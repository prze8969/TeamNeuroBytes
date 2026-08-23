from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional, Any
from sqlmodel import Session

from app.db.engine import get_session
from app.models.database import CropLot, QualityGrade
from app.services.ai_grading import ai_grading_service

router = APIRouter()

class Base64ImageRequest(BaseModel):
    base64_image: str
    commodity_hint: Optional[str] = "Wheat"

@router.post("/grade-image", response_model=Any)
async def grade_uploaded_produce_image(file: UploadFile = File(...)):
    """
    Accepts produce photo upload (JPEG/PNG) and executes the
    Ultralytics YOLOv8 crop grading computer vision pipeline.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    
    result = ai_grading_service.grade_image_bytes(contents)
    return result

@router.post("/grade-base64", response_model=Any)
def grade_base64_produce_image(req: Base64ImageRequest):
    """Executes AI quality grading on a Base64-encoded image string."""
    try:
        result = ai_grading_service.grade_base64_image(req.base64_image)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image decoding failed: {str(e)}")

@router.post("/verify-lot/{lot_id}", response_model=Any)
async def verify_and_attach_grading_to_lot(
    lot_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    """
    Grades uploaded produce image and updates the corresponding CropLot
    in the database with certified Quality Grade and AI verification badge.
    """
    lot = session.get(CropLot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")

    contents = await file.read()
    grading = ai_grading_service.grade_image_bytes(contents)

    lot.quality_grade = QualityGrade(grading["quality_grade"])
    lot.quality_score = grading["quality_score"]
    lot.defect_percentage = grading["defect_percentage"]
    lot.ripeness_index = grading["ripeness_index"]
    lot.is_ai_verified = True

    session.add(lot)
    session.commit()
    session.refresh(lot)

    return {
        "message": "Crop lot certified successfully via AI vision pipeline",
        "lot_id": lot.id,
        "quality_grade": lot.quality_grade,
        "quality_score": lot.quality_score,
        "defect_percentage": lot.defect_percentage,
        "trade_recommendation": grading["trade_recommendation"]
    }
