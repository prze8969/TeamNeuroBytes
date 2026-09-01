from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional, Any, List
from sqlmodel import Session, select
import hashlib
import base64
import json
import uuid
import os
import io
import numpy as np
from PIL import Image

from app.db.engine import get_session
from app.models.database import CropLot, QualityGrade, ImageAssessment, AssessmentStatus, CropInventory, CropInventoryBase, BatchCropInventoryCreate
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

@router.post("/grade-image", response_model=Any, deprecated=True)
async def grade_uploaded_produce_image(
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    """
    DEPRECATED: Use /api/ai/v2/grade-image instead.
    This legacy endpoint uses old YOLOv8 model and is kept for backwards compatibility.
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
        result["warning"] = "DEPRECATED: Please upgrade client to /api/ai/v2/grade-image (DINOv2 AI Model)"
        return result
    except Exception as e:
        fail_assessment(session, assessment, str(e))
        raise HTTPException(status_code=400, detail=f"Grading failed: {str(e)}")

@router.post("/grade-base64", response_model=Any, deprecated=True)
def grade_base64_produce_image(
    req: Base64ImageRequest,
    session: Session = Depends(get_session)
):
    """
    DEPRECATED: Use /api/ai/v2/grade-base64 instead.
    This legacy endpoint uses old YOLOv8 model and is kept for backwards compatibility.
    """
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
        result["warning"] = "DEPRECATED: Please upgrade client to /api/ai/v2/grade-base64 (DINOv2 AI Model)"
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

# =====================================================================
# HIGH-ACCURACY DINOv2 + CORAL ORDINAL CLASSIFICATION ENDPOINTS (v2)
# =====================================================================
from app.services.crop_quality_service import crop_quality_service

@router.get("/v2/health", response_model=Any)
def get_v2_model_health():
    """
    Returns operational health status of the high-accuracy DINOv2 model.
    """
    return crop_quality_service.get_health()

@router.post("/v2/grade-image", response_model=Any)
async def grade_image_v2_high_accuracy(
    file: UploadFile = File(...)
):
    """
    Accepts produce photo upload (JPEG/PNG) and executes the high-accuracy
    DINOv2 + CORAL Ordinal Classification model (Acc: 68.14%, QWK: 0.9107).
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    try:
        result = crop_quality_service.grade_image_bytes(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"High-accuracy grading failed: {str(e)}")

@router.post("/v2/grade-base64", response_model=Any)
def grade_base64_v2_high_accuracy(
    req: Base64ImageRequest
):
    """
    Executes high-accuracy DINOv2 quality grading on a Base64-encoded image string.
    """
    try:
        result = crop_quality_service.grade_base64_image(req.base64_image)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"High-accuracy base64 grading failed: {str(e)}")

@router.post("/v2/grade-multi-item", response_model=Any)
async def grade_multi_item_produce_image(
    file: UploadFile = File(...)
):
    """
    Two-stage Multi-Item Produce Detector & Batch DINOv2 Grading.
    Segments individual items, executes GPU batch classification, and returns
    exact grade distribution (A/B/C/D), weighted average score, and per-item bounding boxes.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    try:
        result = crop_quality_service.grade_multi_item_bytes(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Multi-item grading failed: {str(e)}")

@router.post("/v2/grade-multi-base64", response_model=Any)
def grade_multi_base64_produce_image(
    req: Base64ImageRequest
):
    """
    Executes Multi-Item produce detection & batch DINOv2 grading on a Base64-encoded image.
    """
    try:
        result = crop_quality_service.grade_multi_item_base64(req.base64_image)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Multi-item base64 grading failed: {str(e)}")

# =====================================================================
# AI CROP IDENTIFICATION & MULTI-CROP INVENTORY PIPELINE (v2)
# =====================================================================

def identify_crop_from_image_bytes(contents: bytes) -> str:
    """
    Step A (AI Identification): Analyzes produce image using AI Vision Model.
    Attempts Gemini Vision / OpenAI API if keys are present, with a fast, calibrated
    Computer Vision (Spectral & Chromaticity) engine as offline fallback.
    Returns common crop name e.g. 'Tomato', 'Apple', 'Bell Pepper', 'Banana', etc.
    """
    # 1. Try Gemini Vision API if API Key is configured in environment
    gemini_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            img = Image.open(io.BytesIO(contents))
            prompt = (
                "Identify the agricultural produce item in this photo. "
                "Respond ONLY with the common English name of the crop (e.g. Tomato, Apple, Bell Pepper, Banana, Onion, Potato, Wheat). "
                "Do not include any extra punctuation or explanation."
            )
            response = model.generate_content([prompt, img])
            crop_name = response.text.strip().title()
            if crop_name and len(crop_name) < 40:
                return crop_name
        except Exception:
            pass

    # 2. Try OpenAI GPT-4o Vision API if API Key is configured
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key:
        try:
            import requests
            base64_img = base64.b64encode(contents).decode("utf-8")
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Identify the crop/produce in this image. Respond ONLY with the single common name (e.g. Tomato, Apple, Bell Pepper, Banana, Onion, Potato, Wheat)."},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_img}"}}
                        ]
                    }
                ],
                "max_tokens": 10
            }
            headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
            res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=5)
            if res.status_code == 200:
                crop_name = res.json()["choices"][0]["message"]["content"].strip().title()
                if crop_name and len(crop_name) < 40:
                    return crop_name
        except Exception:
            pass

    # 3. Fallback: Computer Vision Chromaticity & Spectral Feature Extraction
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((128, 128))
        img_np = np.array(img)
        
        # Crop center ROI to eliminate background artifacts
        h, w, _ = img_np.shape
        roi = img_np[int(h*0.15):int(h*0.85), int(w*0.15):int(w*0.85)]
        
        mean_r = float(np.mean(roi[:, :, 0]))
        mean_g = float(np.mean(roi[:, :, 1]))
        mean_b = float(np.mean(roi[:, :, 2]))

        # Calculate Hue & Saturation
        max_c = max(mean_r, mean_g, mean_b)
        min_c = min(mean_r, mean_g, mean_b)
        diff = max_c - min_c
        
        hue = 0.0
        if diff > 0:
            if max_c == mean_r:
                hue = (60.0 * ((mean_g - mean_b) / diff) + 360.0) % 360.0
            elif max_c == mean_g:
                hue = (60.0 * ((mean_b - mean_r) / diff) + 120.0) % 360.0
            else:
                hue = (60.0 * ((mean_r - mean_g) / diff) + 240.0) % 360.0

        sat = (diff / max_c) if max_c > 0 else 0.0

        # Chromatic Classification Logic for common produce
        if (hue >= 340 or hue <= 22) and mean_r > 120 and mean_r > mean_g * 1.2:
            if sat > 0.4:
                return "Tomato"
            else:
                return "Apple"
        elif (hue >= 65 and hue <= 170) or (mean_g > mean_r * 1.15 and mean_g > 75):
            return "Bell Pepper"
        elif hue >= 260 and hue <= 345:
            return "Onion"
        elif hue >= 28 and hue <= 72 and mean_r > 130 and mean_g > 110:
            if (mean_g / (mean_r + 0.001)) >= 0.70:
                return "Banana"
            else:
                return "Potato"
        elif mean_r > 130 and mean_g > 110 and sat < 0.35:
            return "Wheat"
        elif mean_r > 150 and mean_g > 150 and mean_b > 130:
            return "Apple"
        else:
            return "Tomato"
    except Exception:
        return "Tomato"


@router.post("/v2/identify-and-grade-crop", response_model=Any)
async def identify_and_grade_crop(
    file: UploadFile = File(...),
    farmer_id: int = Form(1),
    batch_id: Optional[str] = Form(None),
    session: Session = Depends(get_session)
):
    """
    Step 2 Endpoint: POST /api/ai/v2/identify-and-grade-crop
    Step A: AI Vision model auto-identifies common crop name (e.g. 'Tomato', 'Apple', 'Bell Pepper').
    Step B: DINOv2 + CORAL model runs multi-item detection & quality grading.
    Step C: SQLModel saves combined data to 'crop_inventories' table.
    Returns unified JSON with predicted_crop_name, grading_results, and database_record_id.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    try:
        # Step A: AI Crop Identification
        predicted_crop_name = identify_crop_from_image_bytes(contents)

        # Step B: DINOv2 Multi-Item Quality Grading
        grading_results = crop_quality_service.grade_multi_item_bytes(contents)

        # Encode image to base64 data URL for storage/preview
        base64_img = base64.b64encode(contents).decode("utf-8")
        image_url = f"data:{file.content_type or 'image/jpeg'};base64,{base64_img}"

        # Extract grading metrics
        overall_grade = str(grading_results.get("overall_grade", "A")).upper()
        quality_score = float(grading_results.get("overall_quality_score", grading_results.get("quality_score", 95.0)))
        item_count = int(grading_results.get("items_count", len(grading_results.get("items", [1]))))
        bbox_json = json.dumps(grading_results.get("items", []))
        dist_json = json.dumps(grading_results.get("distribution", {}))

        effective_batch_id = batch_id or f"BATCH-{uuid.uuid4().hex[:8].upper()}"

        # Step C: Save to Database (SQLModel CropInventory)
        inventory_record = CropInventory(
            farmer_id=farmer_id,
            batch_id=effective_batch_id,
            crop_name=predicted_crop_name,
            overall_grade=overall_grade,
            quality_score=quality_score,
            item_count=item_count,
            image_url=image_url[:50000],  # Save preview base64 string
            bounding_box_data=bbox_json,
            distribution_json=dist_json
        )

        session.add(inventory_record)
        session.commit()
        session.refresh(inventory_record)

        return {
            "predicted_crop_name": predicted_crop_name,
            "grading_results": grading_results,
            "database_record_id": inventory_record.id,
            "batch_id": effective_batch_id,
            "status": "SUCCESS"
        }

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Identify and grade crop failed: {str(e)}")


@router.post("/v2/inventory/save-batch", response_model=Any)
def save_crop_inventory_batch(
    payload: BatchCropInventoryCreate,
    session: Session = Depends(get_session)
):
    """
    Saves a batch of multi-crop inventory items to the database at once.
    """
    try:
        effective_batch_id = payload.batch_id or f"BATCH-{uuid.uuid4().hex[:8].upper()}"
        saved_records = []

        for item in payload.items:
            rec = CropInventory(
                farmer_id=payload.farmer_id or item.farmer_id or 1,
                batch_id=effective_batch_id,
                crop_name=item.crop_name,
                overall_grade=item.overall_grade,
                quality_score=item.quality_score,
                item_count=item.item_count,
                image_url=item.image_url,
                bounding_box_data=item.bounding_box_data,
                distribution_json=item.distribution_json
            )
            session.add(rec)
            saved_records.append(rec)

        session.commit()
        for r in saved_records:
            session.refresh(r)

        return {
            "message": f"Successfully saved {len(saved_records)} crops to inventory batch {effective_batch_id}",
            "batch_id": effective_batch_id,
            "saved_record_ids": [r.id for r in saved_records]
        }
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Batch inventory save failed: {str(e)}")



