import io
import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, File, UploadFile, HTTPException, Request, status
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field
from PIL import Image

from app.services.crop_grading_service import CropGradingService
from app.services.detection_filter import DefectFilter
from app.core.ml_models.yolo_wrapper import crop_grader

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Smart Crop Grading"])

# -------------------------------------------------------------------
# Pydantic Schemas
# -------------------------------------------------------------------

class FilteredDefectBox(BaseModel):
    id: str = Field(..., description="Unique box ID")
    label: str = Field(..., description="Defect classification label (e.g. Surface Blemish)")
    confidence: float = Field(..., description="Detection confidence score in [0.0, 1.0]")
    box: List[int] = Field(..., description="Bounding box pixel coordinates [x1, y1, x2, y2]")
    area_ratio: float = Field(..., description="Ratio of box area to total image area")
    is_suppressed: bool = Field(False, description="Suppression flag")

class GeometricSmartGradingResponse(BaseModel):
    global_grade: str = Field(..., description="Clean global grade designation ('A', 'B', 'C', 'D')", example="A")
    is_rejected: bool = Field(..., description="Final hard override rejection boolean", example=False)
    filtered_defects: List[FilteredDefectBox] = Field(default_factory=list, description="Sanity-filtered defect bounding boxes")
    rejection_reason: Optional[str] = Field(None, description="Detailed rejection reason message if rejected", example=None)
    predicted_rank: int = Field(..., description="Ordinal rank index (0: Grade A, 1: Grade B, 2: Grade C, 3: Grade D)", example=0)
    continuous_score: float = Field(..., description="Continuous quality score expectation E[Rank]", example=0.1542)
    suppressed_artifacts_count: int = Field(..., description="Count of hallucinated bounding box artifacts stripped by geometric filter", example=0)


# -------------------------------------------------------------------
# Raw Bounding Box Detector Helper
# -------------------------------------------------------------------

def extract_raw_object_detections(pil_image: Image.Image, image_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Runs raw object detection model (YOLO or OpenCV anomaly contours)
    and returns un-filtered candidate bounding boxes.
    """
    defects = []
    w, h = pil_image.size

    # 1. Try YOLO model if available
    if hasattr(crop_grader, "model") and crop_grader.model is not None:
        try:
            preds = crop_grader.model(pil_image, verbose=False)
            if len(preds) > 0 and len(preds[0].boxes) > 0:
                for idx, box in enumerate(preds[0].boxes):
                    conf = float(box.conf[0])
                    cls_id = int(box.cls[0])
                    label_name = preds[0].names.get(cls_id, "Surface Blemish").replace("_", " ").title()
                    xyxy = box.xyxy[0].cpu().numpy().astype(int).tolist()

                    defects.append({
                        "id": f"raw-{idx+1}",
                        "label": label_name if "Blemish" in label_name or "Spot" in label_name else "Surface Blemish",
                        "confidence": round(conf, 4),
                        "box": xyxy
                    })
        except Exception as e:
            logger.warning(f"YOLO bounding box extraction failed: {e}")

    return defects


# -------------------------------------------------------------------
# Core Pipeline Execution Handler
# -------------------------------------------------------------------

def execute_smart_grading_with_filter(
    pil_image: Image.Image,
    image_bytes: bytes,
    grading_service: CropGradingService
) -> Dict[str, Any]:
    """
    1. Executes DINOv2 Global Classifier.
    2. Runs Object Detector for raw bounding box predictions.
    3. Passes predictions through DefectFilter (Area Cap 12%, Aspect Ratio 1:4-4:1, Confidence 0.85, Grade A/B Hard Override).
    """
    # Step 1: DINOv2 Global Classification
    dino_res = grading_service.predict_sync(pil_image)
    global_grade = dino_res["grade_label"]          # "Grade A", "Grade B", etc.
    predicted_rank = dino_res["predicted_rank"]      # 0, 1, 2, 3
    continuous_score = dino_res["continuous_score"]  # float

    # Step 2: Raw Object Detection Detections
    raw_defects = extract_raw_object_detections(pil_image, image_bytes)

    # Step 3: Pass Detections through Geometric DefectFilter
    w, h = pil_image.size
    filter_result = DefectFilter.filter_detections(
        raw_defects=raw_defects,
        image_dimensions=(w, h),
        global_grade=global_grade,
        predicted_rank=predicted_rank,
        area_threshold_pct=0.12,  # 12% max area cap
        min_confidence=0.85        # 0.85 confidence floor
    )

    return {
        "global_grade": filter_result["global_grade"],
        "is_rejected": filter_result["is_rejected"],
        "filtered_defects": filter_result["filtered_defects"],
        "rejection_reason": filter_result["rejection_reason"],
        "predicted_rank": predicted_rank,
        "continuous_score": continuous_score,
        "suppressed_artifacts_count": filter_result["suppressed_artifacts_count"]
    }


# -------------------------------------------------------------------
# FastAPI Endpoint
# -------------------------------------------------------------------

@router.post(
    "/crop-grade",
    response_model=GeometricSmartGradingResponse,
    status_code=status.HTTP_200_OK,
    summary="Crop Quality Grading (Geometric Filter & Grade A/B Override)",
    description=(
        "Runs DINOv2 Global Classification + Object Detection. "
        "Applies DefectFilter rules: 12% max area cap, 1:4 to 4:1 aspect ratio check, "
        "0.85 confidence floor, and Grade A/B hard override to eliminate false positive rejections."
    )
)
async def smart_crop_grade_endpoint(request: Request, file: UploadFile = File(...)):
    """
    POST /api/v1/crop-grade
    - Uploads crop image file.
    - Applies geometric false positive filtering (strips hallucinated >12% area boxes).
    - Applies Grade A/B hard override to prevent false rejections.
    """
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type '{file.content_type}'. Must be an image file (JPEG, PNG, WebP)."
        )

    try:
        image_bytes = await file.read()
        if not image_bytes:
            raise ValueError("Uploaded file payload is empty.")

        pil_image = Image.open(io.BytesIO(image_bytes))
        pil_image.verify()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    except Exception as img_err:
        logger.error(f"Crop grade endpoint image load error: {img_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupted or unreadable image file: {str(img_err)}"
        )

    try:
        service: CropGradingService = getattr(request.app.state, "crop_grading_service", None)
        if service is None:
            service = CropGradingService()

        # Run pipeline in worker thread pool
        result_dict = await run_in_threadpool(
            execute_smart_grading_with_filter,
            pil_image,
            image_bytes,
            service
        )

        filtered_boxes = [FilteredDefectBox(**d) for d in result_dict["filtered_defects"]]

        return GeometricSmartGradingResponse(
            global_grade=result_dict["global_grade"],
            is_rejected=result_dict["is_rejected"],
            filtered_defects=filtered_boxes,
            rejection_reason=result_dict["rejection_reason"],
            predicted_rank=result_dict["predicted_rank"],
            continuous_score=result_dict["continuous_score"],
            suppressed_artifacts_count=result_dict["suppressed_artifacts_count"]
        )

    except Exception as exc:
        logger.error(f"Crop grading endpoint exception: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Crop grading error: {str(exc)}"
        )
