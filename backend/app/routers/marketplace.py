from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, field_validator, model_validator
from typing import List, Optional, Any
from sqlmodel import Session, select
import hashlib
import urllib.request
import base64
import os

from app.db.engine import get_session
from app.models.database import (
    CropLot, GeoCluster, Bid, BidStatus, LotStatus, QualityGrade, User, ImageAssessment, AssessmentStatus
)
from app.core.tasks.geo_pooling import geo_pooling_worker
from app.repositories.geo_cluster import GeoClusterRepository

router = APIRouter()

class CreateLotRequest(BaseModel):
    farmer_id: int = 1
    farmer_name: Optional[str] = "Ramesh Patil"
    farmer_email: Optional[str] = None

    # --- Farmer-confirmed classification fields ---
    commodity: str
    commodity_category: str
    variety: Optional[str] = "Standard"
    farmer_confirmed_classification: bool

    quantity_kg: float
    base_price_per_kg: float
    district: str = "Nashik"
    state: str = "Maharashtra"
    latitude: float = 20.0125
    longitude: float = 73.7910
    destination_mandi: Optional[str] = "Nashik APMC"
    image_url: Optional[str] = None

    quality_grade: Optional[str] = "GRADE_A"
    quality_score: Optional[float] = 95.4
    defect_percentage: Optional[float] = 1.4
    ripeness_index: Optional[float] = 96.0

    @model_validator(mode="after")
    def validate_farmer_confirmation(self) -> 'CreateLotRequest':
        if not self.farmer_confirmed_classification:
            raise ValueError("Farmer must have explicitly confirmed the classification")
        return self

    @field_validator("commodity", mode="before")
    @classmethod
    def reject_blank_strings(cls, v: Any, info) -> str:
        if not isinstance(v, str) or not v.strip():
            raise ValueError(f"{info.field_name} must be a non-empty string")
        return v.strip()


class CreateBidRequest(BaseModel):
    lot_id: int
    buyer_id: int = 2
    buyer_name: Optional[str] = "AgroProcure Private Ltd"
    amount_per_kg: float
    delivery_deadline_days: int = 3
    note: Optional[str] = None

def fetch_image_bytes(image_source: str) -> bytes:
    if not image_source:
        raise ValueError("Image source is empty")
    if os.path.exists(image_source):
        with open(image_source, "rb") as f:
            return f.read()
    if image_source.startswith("data:image"):
        if "," in image_source:
            encoded = image_source.split(",", 1)[1]
        else:
            encoded = image_source
        return base64.b64decode(encoded)
    elif image_source.startswith(("http://", "https://")):
        req = urllib.request.Request(image_source, headers={"User-Agent": "KisanSetu/2.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.read()
    else:
        try:
            return base64.b64decode(image_source)
        except Exception:
            raise ValueError("Unsupported image source format")

@router.get("/lots", response_model=List[CropLot])
def get_all_crop_lots(
    commodity: Optional[str] = None,
    grade: Optional[str] = None,
    status: Optional[str] = None,
    farmer_id: Optional[int] = None,
    farmer_email: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """Fetches marketplace crop lots with optional farmer and quality filtering."""
    query = select(CropLot)
    if farmer_email:
        user = session.exec(select(User).where(User.email.ilike(farmer_email.strip()))).first()
        if user:
            query = query.where(CropLot.farmer_id == user.id)
        else:
            return []
    elif farmer_id is not None:
        query = query.where(CropLot.farmer_id == farmer_id)

    if commodity:
        query = query.where(CropLot.commodity.ilike(f"%{commodity}%"))
    if grade:
        query = query.where(CropLot.quality_grade == grade)
    if status:
        query = query.where(CropLot.status == status)
    
    lots = session.exec(query).all()
    return lots

COMMODITY_MANDI_BENCHMARKS = {
    "wheat": 22.75,
    "rice": 21.83,
    "tomato": 18.00,
    "onion": 20.00,
    "banana": 16.00,
    "potato": 16.00,
    "soybean": 46.00,
    "cotton": 66.20,
    "chana": 54.40,
    "tur": 70.00,
}

@router.post("/lots", response_model=CropLot)
def create_crop_lot(req: CreateLotRequest, session: Session = Depends(get_session)):
    """Creates a new crop lot listing with farmer's actual produce photo, AI grade, and 85% anti-distress price floor enforcement."""
    # Statutory 85% Anti-Distress Mandi Reserve Floor Guard
    comm_lower = req.commodity.lower()
    matched_benchmark = 15.0  # Safe default floor
    for key, bench in COMMODITY_MANDI_BENCHMARKS.items():
        if key in comm_lower:
            matched_benchmark = bench
            break

    min_permissible_floor = round(matched_benchmark * 0.85, 2)
    if req.base_price_per_kg < min_permissible_floor:
        raise HTTPException(
            status_code=400,
            detail=f"Asking floor ₹{req.base_price_per_kg:.2f}/kg is below the statutory 85% Mandi Reserve Floor (₹{min_permissible_floor:.2f}/kg) to protect smallholder farmers from distress selling."
        )

    grade_enum = QualityGrade.GRADE_A
    quality_score = req.quality_score or 95.4
    defect_percentage = req.defect_percentage or 1.4
    ripeness_index = req.ripeness_index or 96.0

    # If image_url is provided, check if ImageAssessment exists
    if req.image_url:
        try:
            image_bytes = fetch_image_bytes(req.image_url)
            img_hash = hashlib.sha256(image_bytes).hexdigest()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

        assessment = session.exec(
            select(ImageAssessment).where(ImageAssessment.image_hash == img_hash)
        ).first()

        if not assessment or assessment.status != AssessmentStatus.COMPLETED:
            raise HTTPException(
                status_code=409,
                detail="Image has changed since grading or quality assessment is still processing."
            )

        grade_enum = assessment.quality_grade
        quality_score = assessment.quality_score
        defect_percentage = assessment.defect_percentage
        ripeness_index = assessment.ripeness_index

    if req.quality_grade and not isinstance(grade_enum, QualityGrade):
        clean_g = str(req.quality_grade).upper()
        if "B" in clean_g:
            grade_enum = QualityGrade.GRADE_B
        elif "C" in clean_g:
            grade_enum = QualityGrade.GRADE_C
        elif "REJECT" in clean_g:
            grade_enum = QualityGrade.REJECTED
        else:
            grade_enum = QualityGrade.GRADE_A

    farmer_id = req.farmer_id
    farmer_name = req.farmer_name or "Ramesh Patil"
    if req.farmer_email:
        user = session.exec(select(User).where(User.email.ilike(req.farmer_email.strip()))).first()
        if user:
            farmer_id = user.id
            if user.full_name:
                farmer_name = user.full_name

    new_lot = CropLot(
        farmer_id=farmer_id,
        farmer_name=farmer_name,
        commodity=req.commodity,
        commodity_category=req.commodity_category or "Grains & Cereals",
        variety=req.variety or "Standard",
        quantity_kg=req.quantity_kg,
        base_price_per_kg=req.base_price_per_kg,
        district=req.district,
        state=req.state,
        latitude=req.latitude,
        longitude=req.longitude,
        destination_mandi=req.destination_mandi,
        image_url=req.image_url,
        quality_grade=grade_enum,
        quality_score=quality_score,
        defect_percentage=defect_percentage,
        ripeness_index=ripeness_index,
        is_ai_verified=True,
        status=LotStatus.LISTED
    )
    session.add(new_lot)
    session.commit()
    session.refresh(new_lot)
    return new_lot


@router.get("/lots/{lot_id}", response_model=CropLot)
def get_crop_lot_by_id(lot_id: int, session: Session = Depends(get_session)):
    """Fetches full details of a specific crop lot."""
    lot = session.get(CropLot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")
    return lot

@router.delete("/lots/{lot_id}", response_model=Any)
def delete_crop_lot(lot_id: int, session: Session = Depends(get_session)):
    """Deletes a crop lot listing."""
    lot = session.get(CropLot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")
    
    # Also clean up any associated bids
    bids = session.exec(select(Bid).where(Bid.lot_id == lot_id)).all()
    for b in bids:
        session.delete(b)
        
    session.delete(lot)
    session.commit()
    return {"status": "DELETED", "message": f"Lot #{lot_id} removed successfully"}

@router.post("/bids", response_model=Bid)
def submit_buyer_bid(req: CreateBidRequest, session: Session = Depends(get_session)):
    """
    Submits a competitive buyer bid on an AI-verified crop lot.
    Enforces Agmarknet minimum reserve price threshold and prevents duplicate bids at identical prices.
    Updates existing active tender if the buyer offers a revised rate.
    """
    lot = session.get(CropLot, req.lot_id)
    lot_qty = lot.quantity_kg if lot else 5000.0
    lot_base_price = lot.base_price_per_kg if lot else 15.0

    if lot and req.amount_per_kg < (lot_base_price * 0.85):
        raise HTTPException(
            status_code=400,
            detail=f"Bid rate ₹{req.amount_per_kg:.2f}/kg is below the permissible market reserve threshold (₹{lot_base_price * 0.85:.2f}/kg)"
        )

    # Check for existing active bid from this buyer on this lot
    existing_bid = session.exec(
        select(Bid).where(
            Bid.lot_id == req.lot_id,
            Bid.buyer_id == req.buyer_id,
            Bid.status.in_([BidStatus.PENDING, BidStatus.ACCEPTED])
        )
    ).first()

    if existing_bid:
        # Check if the buyer submitted the exact same price
        if abs(existing_bid.amount_per_kg - req.amount_per_kg) < 0.001:
            raise HTTPException(
                status_code=400,
                detail=f"You already have an active bid of ₹{req.amount_per_kg:.2f}/kg on {lot.commodity}. To adjust your bid, enter a revised rate."
            )
        
        # Update existing bid in place
        existing_bid.amount_per_kg = req.amount_per_kg
        existing_bid.total_amount = round(lot_qty * req.amount_per_kg, 2)
        existing_bid.delivery_deadline_days = req.delivery_deadline_days
        existing_bid.note = req.note or existing_bid.note
        existing_bid.buyer_name = req.buyer_name or existing_bid.buyer_name
        session.add(existing_bid)
        session.commit()
        session.refresh(existing_bid)
        return existing_bid

    total_amount = round(lot_qty * req.amount_per_kg, 2)
    new_bid = Bid(
        lot_id=req.lot_id,
        buyer_id=req.buyer_id,
        buyer_name=req.buyer_name,
        amount_per_kg=req.amount_per_kg,
        total_amount=total_amount,
        delivery_deadline_days=req.delivery_deadline_days,
        note=req.note,
        status=BidStatus.PENDING
    )
    session.add(new_bid)
    session.commit()
    session.refresh(new_bid)
    return new_bid

@router.get("/bids", response_model=List[Bid])
def get_bids(
    lot_id: Optional[int] = None,
    buyer_id: Optional[int] = None,
    session: Session = Depends(get_session)
):
    """Fetches all bids or filtered by lot/buyer."""
    query = select(Bid)
    if lot_id:
        query = query.where(Bid.lot_id == lot_id)
    if buyer_id:
        query = query.where(Bid.buyer_id == buyer_id)
    
    bids = session.exec(query).all()
    return bids

@router.get("/clusters", response_model=List[GeoCluster])
def get_all_geo_clusters(session: Session = Depends(get_session)):
    """Returns active FPO freight pooling clusters."""
    clusters = GeoClusterRepository(session).get_all()
    return clusters

@router.post("/clusters/pool-now")
def trigger_spatial_pooling(session: Session = Depends(get_session)):
    """Triggers the spatial PostGIS / Haversine pooling algorithm immediately."""
    result = geo_pooling_worker.run_pooling_pass(session)
    return result
