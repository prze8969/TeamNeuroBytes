import io
import logging
import asyncio
from fastapi import APIRouter, File, UploadFile, HTTPException, Request, status
from fastapi.concurrency import run_in_threadpool
from PIL import Image

from app.schemas import APIResponse, CropPredictionResponse
from app.services.onnx_service import ONNXInferenceService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Crop AI Inference"])

@router.post(
    "/predict",
    response_model=APIResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict Agricultural Crop Quality Grade (DINOv2 + CORAL)",
    description=(
        "Accepts an uploaded crop image file, extracts 32 handcrafted color/texture/shape/defect features "
        "via OpenCV, and executes 4-view Test-Time Augmentation (TTA) inference using the DINOv2 ONNX model."
    )
)
async def predict_crop_quality(request: Request, file: UploadFile = File(...)):
    """
    Production Crop Quality Inference Endpoint:
    - Validates image content-type and readability.
    - Offloads CPU/GPU-bound ONNX inference & feature extraction to thread pool.
    - Returns structured grade prediction, continuous score, and class probabilities.
    """
    # 1. Validate file extension / MIME type
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file format '{file.content_type}'. Please upload a valid image (JPEG, PNG, WebP)."
        )

    # 2. Read file bytes & parse PIL Image
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise ValueError("Uploaded file is empty.")

        # Load & verify PIL image integrity
        pil_image = Image.open(io.BytesIO(file_bytes))
        pil_image.verify()

        # Re-open PIL image after verify() resets internal file pointers
        pil_image = Image.open(io.BytesIO(file_bytes))
        pil_image = pil_image.convert("RGB")

    except Exception as e:
        logger.error(f"Image parsing failed for file {file.filename}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupted or invalid image file: {str(e)}"
        )

    # 3. Retrieve ONNX Inference Service from app.state (or fallback singleton)
    try:
        onnx_service: ONNXInferenceService = getattr(request.app.state, "onnx_service", None)
        if onnx_service is None:
            onnx_service = ONNXInferenceService()

        # 4. Offload heavy CPU/GPU computation to thread pool to prevent blocking FastAPI async event loop
        prediction_dict = await run_in_threadpool(onnx_service.predict, pil_image)

        # 5. Build structured response
        crop_prediction = CropPredictionResponse(
            predicted_rank=prediction_dict["predicted_rank"],
            grade_label=prediction_dict["grade_label"],
            continuous_score=prediction_dict["continuous_score"],
            probabilities=prediction_dict["probabilities"]
        )

        return APIResponse(
            success=True,
            filename=file.filename or "uploaded_crop.jpg",
            prediction=crop_prediction
        )

    except FileNotFoundError as fnf_err:
        logger.error(f"ONNX Model File Not Found: {fnf_err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"ML Engine Error: Model checkpoint unavailable ({str(fnf_err)})"
        )
    except Exception as exc:
        logger.error(f"ONNX Crop AI Inference Error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during crop quality inference: {str(exc)}"
        )
