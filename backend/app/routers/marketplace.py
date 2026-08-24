from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Any
from sqlmodel import Session, select

from app.db.engine import get_session
from app.models.database import (
    CropLot, GeoCluster, Bid, BidStatus, LotStatus, QualityGrade, User
)
from app.core.tasks.geo_pooling import geo_pooling_worker

router = APIRouter()

class CreateLotRequest(BaseModel):
    farmer_id: int = 1
    farmer_name: Optional[str] = "Ramesh Patil"
    commodity: str
    variety: Optional[str] = "Standard Hybrid"
    quantity_kg: float
    base_price_per_kg: float
    district: str = "Nashik"
    state: str = "Maharashtra"
    latitude: float = 20.0125
    longitude: float = 73.7910
    destination_mandi: Optional[str] = "Nashik APMC"

class CreateBidRequest(BaseModel):
    lot_id: int
    buyer_id: int = 2
    buyer_name: Optional[str] = "AgroProcure Private Ltd"
    amount_per_kg: float
    delivery_deadline_days: int = 3
    note: Optional[str] = None

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
    """Creates a new crop lot listing."""
    new_lot = CropLot(
        farmer_id=req.farmer_id,
        farmer_name=req.farmer_name,
        commodity=req.commodity,
        variety=req.variety,
        quantity_kg=req.quantity_kg,
        base_price_per_kg=req.base_price_per_kg,
        district=req.district,
        state=req.state,
        latitude=req.latitude,
        longitude=req.longitude,
        destination_mandi=req.destination_mandi,
        quality_grade=QualityGrade.GRADE_A,
        quality_score=92.5,
        defect_percentage=2.0,
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
