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

router = APIRouter()

class CreateLotRequest(BaseModel):
    farmer_id: int = 1
    farmer_name: Optional[str] = "Ramesh Patil"

    # --- Farmer-confirmed classification fields (required, no defaults) ---
    commodity: str
    commodity_category: str          # e.g. "Cereals", "Vegetables", "Fruits"
    variety: str                      # e.g. "Sharbati Lok-1", "Red Nashik"

    # --- Confirmation gate: must be True or request is rejected ---
    farmer_confirmed_classification: bool

    quantity_kg: float
    base_price_per_kg: float
    district: str = "Nashik"
    state: str = "Maharashtra"
    latitude: float = 20.0125
    longitude: float = 73.7910
    destination_mandi: Optional[str] = "Nashik APMC"
    image_url: Optional[str] = None

    # AI-grading fields below are ignored at publish time —
    # the backend re-fetches them from ImageAssessment to prevent tampering.
    quality_grade: Optional[str] = None
    quality_score: Optional[float] = None
    defect_percentage: Optional[float] = None
    ripeness_index: Optional[float] = None

    @field_validator("commodity", "commodity_category", "variety", mode="before")
    @classmethod
    def reject_blank_strings(cls, v: Any, info) -> str:
        if not isinstance(v, str) or not v.strip():
            raise ValueError(f"{info.field_name} must be a non-empty string")
        return v.strip()

    @model_validator(mode="after")
    def require_explicit_confirmation(self) -> "CreateLotRequest":
        if not self.farmer_confirmed_classification:
            raise ValueError(
                "category and crop variety must be explicitly confirmed before publishing"
            )
        return self



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
    session: Session = Depends(get_session)
):
    """Fetches all marketplace crop lots with optional filtering."""
    query = select(CropLot)
    if commodity:
        query = query.where(CropLot.commodity.ilike(f"%{commodity}%"))
    if grade:
        query = query.where(CropLot.quality_grade == grade)
    if status:
        query = query.where(CropLot.status == status)
    
    lots = session.exec(query).all()
    return lots

@router.post("/lots", response_model=CropLot)
def create_crop_lot(req: CreateLotRequest, session: Session = Depends(get_session)):
    """
    Creates a new crop lot listing.

    Requires:
    - farmer_confirmed_classification == True (Pydantic-validated)
    - commodity, commodity_category, variety all non-empty (Pydantic-validated)
    - Image must have an existing COMPLETED ImageAssessment (hash-validated)

    The farmer's confirmed commodity/category/variety are written to the lot.
    AI grading values are taken exclusively from the ImageAssessment record —
    client-submitted grading fields are ignored to prevent tampering.
    """
    if not req.image_url:
        raise HTTPException(
            status_code=400,
            detail="An image is required to publish an AI-graded lot."
        )

    try:
        image_bytes = fetch_image_bytes(req.image_url)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch image associated with the lot: {str(e)}"
        )

    img_hash = hashlib.sha256(image_bytes).hexdigest()

    # Fetch the server-side assessment — never trust client-submitted grading values
    assessment = session.exec(
        select(ImageAssessment).where(ImageAssessment.image_hash == img_hash)
    ).first()

    if not assessment or assessment.status != AssessmentStatus.COMPLETED:
        raise HTTPException(
            status_code=409,
            detail="image has changed since grading, please re-assess before publishing"
        )

    new_lot = CropLot(
        farmer_id=req.farmer_id,
        farmer_name=req.farmer_name,
        # Farmer-confirmed classification — authoritative values for the published lot
        commodity=req.commodity,
        commodity_category=req.commodity_category,
        variety=req.variety,
        quantity_kg=req.quantity_kg,
        base_price_per_kg=req.base_price_per_kg,
        district=req.district,
        state=req.state,
        latitude=req.latitude,
        longitude=req.longitude,
        destination_mandi=req.destination_mandi,
        image_url=req.image_url,
        # AI grading — sourced from DB assessment, NOT from client payload
        quality_grade=assessment.quality_grade,
        quality_score=assessment.quality_score,
        defect_percentage=assessment.defect_percentage,
        ripeness_index=assessment.ripeness_index,
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

@router.post("/bids", response_model=Bid)
def submit_buyer_bid(req: CreateBidRequest, session: Session = Depends(get_session)):
    """
    Submits a competitive buyer bid on an AI-verified crop lot.
    Enforces Agmarknet minimum reserve price threshold and prevents duplicate bids at identical prices.
    Updates existing active tender if the buyer offers a revised rate.
    """
    lot = session.get(CropLot, req.lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")

    if req.amount_per_kg < (lot.base_price_per_kg * 0.85):
        raise HTTPException(
            status_code=400,
            detail=f"Bid rate ₹{req.amount_per_kg:.2f}/kg is below the permissible market reserve threshold (₹{lot.base_price_per_kg * 0.85:.2f}/kg)"
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
        existing_bid.total_amount = round(lot.quantity_kg * req.amount_per_kg, 2)
        existing_bid.delivery_deadline_days = req.delivery_deadline_days
        existing_bid.note = req.note or existing_bid.note
        existing_bid.buyer_name = req.buyer_name or existing_bid.buyer_name
        session.add(existing_bid)
        session.commit()
        session.refresh(existing_bid)
        return existing_bid

    total_amount = round(lot.quantity_kg * req.amount_per_kg, 2)
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
    clusters = session.exec(select(GeoCluster)).all()
    return clusters

@router.post("/clusters/pool-now")
def trigger_spatial_pooling(session: Session = Depends(get_session)):
    """Triggers the spatial PostGIS / Haversine pooling algorithm immediately."""
    result = geo_pooling_worker.run_pooling_pass(session)
    return result
