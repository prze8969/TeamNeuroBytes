import io
import logging
from typing import Optional, List
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Request, status
from PIL import Image

from app.schemas.crop_grading import CropGradingResponse, CropPredictionResult, GradeProbabilities
from app.services.crop_grading_service import CropGradingService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Crop AI Quality Grading"])

@router.post(
    "/crop-grade",
    response_model=CropGradingResponse,
    status_code=status.HTTP_200_OK,
    summary="Grade Agricultural Crop Quality (DINOv2 + CORAL ONNX)",
    description=(
        "Accepts an uploaded crop image file and optional pre-extracted 32 handcrafted features (comma-separated). "
        "Applies PyTorch-aligned Bicubic Resize(392) + CenterCrop(392), extracts 32 domain features via OpenCV, "
        "and runs 4-view Test-Time Augmentation (TTA) using the DINOv2 ONNX Runtime model."
    )
)
async def grade_crop_quality(
    request: Request,
    file: UploadFile = File(...),
    handcrafted_features: Optional[str] = Form(None)
):
    """
    Production Crop Quality Grading Endpoint:
    - Validates image content-type and file integrity.
    - Parses optional client-provided handcrafted feature overrides.
    - Asynchronously calls CropGradingService without blocking the FastAPI event loop.
    - Returns structured grade prediction, continuous score, and class probabilities.
    """
    # 1. Validate MIME type
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type '{file.content_type}'. Please upload an image file (JPEG, PNG, WebP)."
        )

    # 2. Parse optional override handcrafted features string ("0.1, 0.2, ...")
    parsed_features: Optional[List[float]] = None
    if handcrafted_features:
        try:
            parts = [p.strip() for p in handcrafted_features.split(",") if p.strip()]
            parsed_features = [float(p) for p in parts]
            if len(parsed_features) != 32:
                raise ValueError(f"Expected exactly 32 comma-separated float values, got {len(parsed_features)}.")
        except Exception as parse_err:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid 'handcrafted_features' form field: {str(parse_err)}"
            )

    # 3. Read image bytes and verify PIL image integrity
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise ValueError("Uploaded file payload is empty.")

        pil_image = Image.open(io.BytesIO(file_bytes))
        pil_image.verify()

        # Re-open after verify() resets internal stream pointers
        pil_image = Image.open(io.BytesIO(file_bytes))
        pil_image = pil_image.convert("RGB")

    except Exception as img_err:
        logger.error(f"Image parsing error for file {file.filename}: {img_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupted or unreadable image file: {str(img_err)}"
        )

    # 4. Access initialized CropGradingService from app.state (or fallback singleton)
    try:
        service: CropGradingService = getattr(request.app.state, "crop_grading_service", None)
        if service is None:
            service = CropGradingService()

        # 5. Execute async threadpooled ONNX prediction
        res_dict = await service.predict(pil_image, override_features=parsed_features)

        # 6. Construct Pydantic V2 response
        probabilities = GradeProbabilities(
            grade_a=res_dict["probabilities"]["grade_a"],
            grade_b=res_dict["probabilities"]["grade_b"],
            grade_c=res_dict["probabilities"]["grade_c"],
            grade_d=res_dict["probabilities"]["grade_d"]
        )

        result_data = CropPredictionResult(
            predicted_rank=res_dict["predicted_rank"],
            grade_label=res_dict["grade_label"],
            continuous_score=res_dict["continuous_score"],
            probabilities=probabilities
        )

        return CropGradingResponse(
            success=True,
            message="Crop quality grading completed successfully.",
            data=result_data
        )

    except FileNotFoundError as fnf_err:
        logger.error(f"ONNX Model Missing: {fnf_err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"ML Engine Error: Model checkpoint unavailable ({str(fnf_err)})"
        )
    except Exception as exc:
        logger.error(f"CropGradingService Inference Exception: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during ONNX crop quality grading: {str(exc)}"
        )
