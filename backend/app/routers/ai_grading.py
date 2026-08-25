from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional, Any
from sqlmodel import Session, select
import hashlib
import base64

from app.db.engine import get_session
from app.models.database import CropLot, QualityGrade, ImageAssessment, AssessmentStatus
from app.services.ai_grading import ai_grading_service

router = APIRouter()

class Base64ImageRequest(BaseModel):
    base64_image: str
    commodity_hint: Optional[str] = "Wheat"

def start_processing_assessment(session: Session, contents: bytes) -> ImageAssessment:
    image_hash = hashlib.sha256(contents).hexdigest()
    assessment = session.exec(select(ImageAssessment).where(ImageAssessment.image_hash == image_hash)).first()
    if not assessment:
        assessment = ImageAssessment(
            image_hash=image_hash,
            status=AssessmentStatus.PROCESSING,
        )
        session.add(assessment)
    else:
        assessment.status = AssessmentStatus.PROCESSING
        assessment.error_reason = None
        session.add(assessment)
    session.commit()
    session.refresh(assessment)
    return assessment

def complete_assessment(session: Session, assessment: ImageAssessment, result: dict) -> ImageAssessment:
    raw_grade = result.get("quality_grade", "B")
    grade_enum = QualityGrade.GRADE_B
    if raw_grade:
        clean_g = str(raw_grade).upper()
        if "A" in clean_g:
            grade_enum = QualityGrade.GRADE_A
        elif "B" in clean_g:
            grade_enum = QualityGrade.GRADE_B
        elif "C" in clean_g:
            grade_enum = QualityGrade.GRADE_C
        elif "REJECT" in clean_g:
            grade_enum = QualityGrade.REJECTED

    assessment.status = AssessmentStatus.COMPLETED
    assessment.quality_grade = grade_enum
    assessment.quality_score = float(result.get("quality_score", 85.0))
    assessment.defect_percentage = float(result.get("defect_percentage", 2.5))
    assessment.ripeness_index = float(result.get("ripeness_index", 90.0))
    assessment.error_reason = None
    session.add(assessment)
    session.commit()
    session.refresh(assessment)
    return assessment

def fail_assessment(session: Session, assessment: ImageAssessment, error_msg: str) -> ImageAssessment:
    assessment.status = AssessmentStatus.FAILED
    assessment.error_reason = error_msg
    session.add(assessment)
    session.commit()
    session.refresh(assessment)
    return assessment

def save_or_get_assessment(session: Session, contents: bytes, result: dict) -> ImageAssessment:
    image_hash = hashlib.sha256(contents).hexdigest()
    existing = session.exec(select(ImageAssessment).where(ImageAssessment.image_hash == image_hash)).first()
    if existing and existing.status == AssessmentStatus.COMPLETED:
        return existing
    
    if not existing:
        existing = ImageAssessment(image_hash=image_hash)
    
    return complete_assessment(session, existing, result)

@router.get("/image-assessment/{image_hash}/status", response_model=Any)
def get_image_assessment_status(image_hash: str, session: Session = Depends(get_session)):
    """Returns the current status of an image assessment and, if COMPLETED, the grading result."""
    assessment = session.exec(select(ImageAssessment).where(ImageAssessment.image_hash == image_hash)).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="No assessment found for this image hash")
    
    response = {
        "image_hash": assessment.image_hash,
        "status": assessment.status,
        "error_reason": assessment.error_reason,
        "created_at": assessment.created_at
    }
    if assessment.status == AssessmentStatus.COMPLETED:
        response.update({
            "quality_grade": assessment.quality_grade,
            "quality_score": assessment.quality_score,
            "defect_percentage": assessment.defect_percentage,
            "ripeness_index": assessment.ripeness_index
        })
    return response

@router.post("/grade-image", response_model=Any)
async def grade_uploaded_produce_image(
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    """
    Accepts produce photo upload (JPEG/PNG) and executes the
    Ultralytics YOLOv8 crop grading computer vision pipeline.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    
    assessment = start_processing_assessment(session, contents)
    try:
        result = ai_grading_service.grade_image_bytes(contents)
        assessment = complete_assessment(session, assessment, result)
        result["image_hash"] = assessment.image_hash
        result["status"] = assessment.status
        return result
    except Exception as e:
        fail_assessment(session, assessment, str(e))
        raise HTTPException(status_code=400, detail=f"Grading failed: {str(e)}")

@router.post("/grade-base64", response_model=Any)
def grade_base64_produce_image(
    req: Base64ImageRequest,
    session: Session = Depends(get_session)
):
    """Executes AI quality grading on a Base64-encoded image string."""
    try:
        base64_str = req.base64_image
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_bytes = base64.b64decode(base64_str)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image decoding failed: {str(e)}")

    assessment = start_processing_assessment(session, img_bytes)
    try:
        result = ai_grading_service.grade_image_bytes(img_bytes)
        assessment = complete_assessment(session, assessment, result)
        result["image_hash"] = assessment.image_hash
        result["status"] = assessment.status
        return result
    except Exception as e:
        fail_assessment(session, assessment, str(e))
        raise HTTPException(status_code=400, detail=f"Grading failed: {str(e)}")

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
    assessment = start_processing_assessment(session, contents)
    try:
        grading = ai_grading_service.grade_image_bytes(contents)
        assessment = complete_assessment(session, assessment, grading)

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
            "trade_recommendation": grading["trade_recommendation"],
            "image_hash": assessment.image_hash,
            "status": assessment.status
        }
    except Exception as e:
        fail_assessment(session, assessment, str(e))
        raise HTTPException(status_code=400, detail=f"Verification failed: {str(e)}")
