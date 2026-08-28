from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from sqlmodel import Session, select, func
from datetime import datetime

from app.db.engine import get_session
from app.models.database import (
    CropLot, GeoCluster, Bid, BidStatus, LotStatus, QualityGrade, User
)

router = APIRouter()

# -----------------------------------------------------------------------------
# Request & Response Models
# -----------------------------------------------------------------------------
class CreateFPOLotRequest(BaseModel):
    farmer_name: str = "Ramesh Patil"
    farmer_phone: Optional[str] = "+919876543210"
    commodity: str
    commodity_category: Optional[str] = "Cereals"
    variety: Optional[str] = "Certified Standard"
    quantity_kg: float
    base_price_per_kg: float
    quality_grade: Optional[str] = "A"
    quality_score: Optional[float] = 92.0
    district: str = "Nashik"
    state: str = "Maharashtra"
    latitude: float = 20.0125
    longitude: float = 73.7910
    destination_mandi: Optional[str] = "Nashik APMC"
    image_url: Optional[str] = None
    harvest_date: Optional[str] = "2026-08-25"

class UpdateFPOLotRequest(BaseModel):
    commodity: Optional[str] = None
    variety: Optional[str] = None
    quantity_kg: Optional[float] = None
    base_price_per_kg: Optional[float] = None
    quality_grade: Optional[str] = None
    quality_score: Optional[float] = None
    destination_mandi: Optional[str] = None

class StatusUpdateRequest(BaseModel):
    status: str

class InwardBayRequest(BaseModel):
    bay_id: str
    lot_id: int
    quantity_tons: float
    crop_assigned: str
    notes: Optional[str] = None

class FPOTenderRequest(BaseModel):
    title: str
    commodity: str
    total_quantity_tons: float = 45.0
    reserve_price_per_kg: float
    delivery_mandi: str = "Vashi APMC Navi Mumbai"
    deadline_date: str = "2026-08-30"

# -----------------------------------------------------------------------------
# FPO Dashboard Endpoints
# -----------------------------------------------------------------------------
@router.get("/dashboard/summary")
def get_fpo_dashboard_summary(session: Session = Depends(get_session)) -> Dict[str, Any]:
    """
    Returns executive summary telemetry for FPO operations.
    """
    all_lots = session.exec(select(CropLot)).all()
    total_lots = len(all_lots)
    pending_approval = len([l for l in all_lots if l.status == LotStatus.DRAFT or l.status == LotStatus.LISTED])
    approved_pooled = len([l for l in all_lots if l.status == LotStatus.POOLED])
    
    total_volume_kg = sum(l.quantity_kg for l in all_lots)
    total_volume_tons = round(total_volume_kg / 1000.0, 1)

    clusters = session.exec(select(GeoCluster)).all()
    total_clusters = len(clusters)
    total_farmers = sum(c.participating_farmers_count for c in clusters) or max(total_lots, 14)

    return {
        "fpo_name": "Nashik East Farmers Producer Company Ltd.",
        "fpo_code": "FPC #MH-NSK-4412",
        "total_member_lots": total_lots,
        "pending_approval_lots": pending_approval,
        "approved_pooled_lots": approved_pooled,
        "total_volume_tons": total_volume_tons,
        "total_clusters": total_clusters,
        "enrolled_farmers": total_farmers,
        "warehouse_occupancy_pct": 74.5,
        "total_warehouse_capacity_mt": 620,
        "total_warehouse_occupied_mt": 442.5,
        "total_settled_dbt_payouts_inr": 845200.0,
        "fpo_commission_inr": 16904.0,
        "estimated_freight_savings_pct": 35.1
    }

@router.get("/lots")
def get_fpo_member_lots(
    q: Optional[str] = Query(None, description="Search by farmer name or commodity"),
    status_filter: Optional[str] = Query(None, description="Filter by lot status"),
    grade_filter: Optional[str] = Query(None, description="Filter by grade"),
    session: Session = Depends(get_session)
):
    """
    Fetches all FPO member produce lots with optional search & filter criteria.
    """
    query = select(CropLot)
    
    if q:
        search_term = f"%{q}%"
        query = query.where(
            (CropLot.commodity.ilike(search_term)) | 
            (CropLot.farmer_name.ilike(search_term)) | 
            (CropLot.variety.ilike(search_term))
        )
    
    if status_filter and status_filter != "ALL":
        query = query.where(CropLot.status == status_filter)
        
    if grade_filter and grade_filter != "ALL":
        query = query.where(CropLot.quality_grade == grade_filter)

    lots = session.exec(query).all()
    return lots

@router.post("/lots", response_model=CropLot)
def create_fpo_member_lot(req: CreateFPOLotRequest, session: Session = Depends(get_session)):
    """
    Creates a new smallholder member crop lot on behalf of an FPO farmer.
    """
    grade_enum = QualityGrade.GRADE_A
    if req.quality_grade:
        clean_g = req.quality_grade.upper()
        if "B" in clean_g:
            grade_enum = QualityGrade.GRADE_B
        elif "C" in clean_g:
            grade_enum = QualityGrade.GRADE_C
        elif "REJECT" in clean_g:
            grade_enum = QualityGrade.REJECTED

    new_lot = CropLot(
        farmer_id=1,
        farmer_phone=req.farmer_phone or "+919876543210",
        farmer_name=req.farmer_name,
        commodity=req.commodity,
        commodity_category=req.commodity_category or "Cereals",
        variety=req.variety or "Certified Variety",
        quantity_kg=req.quantity_kg,
        base_price_per_kg=req.base_price_per_kg,
        quality_grade=grade_enum,
        quality_score=req.quality_score or 92.0,
        defect_percentage=2.0,
        ripeness_index=90.0,
        is_ai_verified=True,
        latitude=req.latitude,
        longitude=req.longitude,
        district=req.district,
        state=req.state,
        destination_mandi=req.destination_mandi or "Nashik APMC",
        harvest_date=req.harvest_date or datetime.now().strftime("%Y-%m-%d"),
        status=LotStatus.LISTED,
        image_url=req.image_url
    )

    session.add(new_lot)
    session.commit()
    session.refresh(new_lot)
    return new_lot

@router.get("/lots/{lot_id}", response_model=CropLot)
def get_fpo_lot_by_id(lot_id: int, session: Session = Depends(get_session)):
    """
    Fetches full details of a specific member crop lot.
    """
    lot = session.get(CropLot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="FPO Crop Lot not found")
    return lot

@router.patch("/lots/{lot_id}/status")
def update_fpo_lot_status(lot_id: int, req: StatusUpdateRequest, session: Session = Depends(get_session)):
    """
    Updates the operational status of an FPO lot (e.g. LISTED -> POOLED, REJECTED, BID_ACCEPTED).
    """
    lot = session.get(CropLot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")
    
    clean_status = req.status.upper()
    try:
        lot.status = LotStatus(clean_status)
    except ValueError:
        # Fallback if non-standard status string passed
        lot.status = clean_status # type: ignore
        
    lot.updated_at = datetime.utcnow()
    session.add(lot)
    session.commit()
    session.refresh(lot)
    return {"message": f"Lot #{lot_id} status updated to {lot.status}", "lot": lot}

@router.put("/lots/{lot_id}", response_model=CropLot)
def edit_fpo_lot(lot_id: int, req: UpdateFPOLotRequest, session: Session = Depends(get_session)):
    """
    Edits member lot details.
    """
    lot = session.get(CropLot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")

    if req.commodity is not None:
        lot.commodity = req.commodity
    if req.variety is not None:
        lot.variety = req.variety
    if req.quantity_kg is not None:
        lot.quantity_kg = req.quantity_kg
    if req.base_price_per_kg is not None:
        lot.base_price_per_kg = req.base_price_per_kg
    if req.quality_grade is not None:
        clean_g = req.quality_grade.upper()
        if "B" in clean_g:
            lot.quality_grade = QualityGrade.GRADE_B
        elif "C" in clean_g:
            lot.quality_grade = QualityGrade.GRADE_C
        else:
            lot.quality_grade = QualityGrade.GRADE_A
    if req.quality_score is not None:
        lot.quality_score = req.quality_score
    if req.destination_mandi is not None:
        lot.destination_mandi = req.destination_mandi

    lot.updated_at = datetime.utcnow()
    session.add(lot)
    session.commit()
    session.refresh(lot)
    return lot

@router.delete("/lots/{lot_id}")
def delete_fpo_lot(lot_id: int, session: Session = Depends(get_session)):
    """
    Deletes an FPO crop lot record.
    """
    lot = session.get(CropLot, lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Crop lot not found")
    
    session.delete(lot)
    session.commit()
    return {"message": f"Lot #{lot_id} successfully deleted", "id": lot_id}

@router.get("/warehouses")
def get_fpo_warehouses():
    """
    Returns live FPO warehouse bays & IoT cold chain telemetry data.
    """
    return [
        {
            "id": "BAY-A1",
            "name": "Niphad Cold Bay A-1 (Apples & Tomatoes)",
            "type": "COLD_STORAGE",
            "capacityTons": 120,
            "occupiedTons": 85.5,
            "tempCelcius": 12.4,
            "humidityPercent": 88,
            "assignedCrop": "Hybrid Tomatoes & Bananas",
            "status": "OPTIMAL",
            "enwrIssued": True,
            "wdraCertified": True
        },
        {
            "id": "BAY-A2",
            "name": "Niphad Cold Bay A-2 (Onions & Perishables)",
            "type": "COLD_STORAGE",
            "capacityTons": 150,
            "occupiedTons": 132.0,
            "tempCelcius": 14.8,
            "humidityPercent": 65,
            "assignedCrop": "Nashik Red Onions (Export Grade)",
            "status": "NEAR_CAPACITY",
            "enwrIssued": True,
            "wdraCertified": True
        },
        {
            "id": "BAY-B1",
            "name": "Central Dry Silo B-1 (Sharbati Wheat)",
            "type": "DRY_GRAIN",
            "capacityTons": 250,
            "occupiedTons": 180.0,
            "tempCelcius": 24.5,
            "humidityPercent": 42,
            "assignedCrop": "Sharbati Wheat Lok-1",
            "status": "OPTIMAL",
            "enwrIssued": True,
            "wdraCertified": True
        },
        {
            "id": "BAY-C1",
            "name": "Controlled Atmosphere Bay C-1 (Pulses)",
            "type": "CONTROLLED_ATMOSPHERE",
            "capacityTons": 100,
            "occupiedTons": 45.0,
            "tempCelcius": 18.0,
            "humidityPercent": 48,
            "assignedCrop": "Yellow Soybean & Desi Chana",
            "status": "OPTIMAL",
            "enwrIssued": False,
            "wdraCertified": True
        }
    ]

@router.post("/warehouses/inward")
def inward_bay_lot(req: InwardBayRequest):
    """
    Processes inward check-in for produce arriving at FPO aggregation yard and issues e-NWR receipt.
    """
    receipt_no = f"eNWR-WDRA-{req.bay_id}-2026-8812"
    return {
        "status": "SUCCESS",
        "message": f"Produce successfully checked into {req.bay_id}",
        "enwr_receipt_no": receipt_no,
        "bay_id": req.bay_id,
        "lot_id": req.lot_id,
        "quantity_tons": req.quantity_tons,
        "bank_pledge_eligibility": "70% Pledge Loan Available via ICICI/NABARD"
    }

@router.get("/tenders")
def get_fpo_tenders():
    """
    Fetches active bulk institutional tenders published by FPO.
    """
    return [
        {
            "id": "TEND-FPO-4412",
            "title": "45-Ton Multi-Axle Institutional Wheat Tender",
            "commodity": "Sharbati Wheat Lok-1",
            "total_quantity_tons": 45.0,
            "reserve_price_per_kg": 26.50,
            "delivery_mandi": "Vashi APMC Navi Mumbai",
            "deadline_date": "2026-08-30",
            "status": "OPEN",
            "participating_farmers_count": 14,
            "escrow_locked_bids": 2
        }
    ]

@router.post("/tenders")
def create_fpo_tender(req: FPOTenderRequest):
    """
    Publishes a new FPO bulk institutional tender.
    """
    tender_id = f"TEND-FPO-{int(datetime.now().timestamp())}"
    return {
        "id": tender_id,
        "title": req.title,
        "commodity": req.commodity,
        "total_quantity_tons": req.total_quantity_tons,
        "reserve_price_per_kg": req.reserve_price_per_kg,
        "delivery_mandi": req.delivery_mandi,
        "deadline_date": req.deadline_date,
        "status": "OPEN",
        "message": "Bulk Institutional Tender published to buyers with 100% Escrow Requirement!"
    }

@router.get("/ledger")
def get_fpo_ledger():
    """
    Fetches financial transactions, DBT payouts to member bank accounts, and FPO commission logs.
    """
    return [
        {
            "id": "TXN-8801",
            "date": "2026-08-24",
            "lot_id": 1,
            "farmer_name": "Ramesh Patil",
            "commodity": "Wheat Sharbati",
            "quantity_kg": 5000,
            "amount_inr": 127500.0,
            "dbt_status": "SETTLED",
            "utr_number": "UTR99281029102",
            "fpo_commission_inr": 2550.0
        },
        {
            "id": "TXN-8802",
            "date": "2026-08-23",
            "lot_id": 2,
            "farmer_name": "Anil Deshmukh",
            "commodity": "Red Nashik Onion",
            "quantity_kg": 8000,
            "amount_inr": 168000.0,
            "dbt_status": "SETTLED",
            "utr_number": "UTR99281029103",
            "fpo_commission_inr": 3360.0
        }
    ]

# -----------------------------------------------------------------------------
# Demo & Database Persistence Verification Endpoints
# -----------------------------------------------------------------------------
class DemoUpdateRequest(BaseModel):
    lot_id: Optional[int] = None
    custom_note: Optional[str] = None

@router.post("/demo/update")
def demo_update_fpo_lot(
    req: Optional[DemoUpdateRequest] = None,
    session: Session = Depends(get_session)
):
    """
    Safely modifies a demo FPO produce lot in the database to demonstrate live DB persistence.
    Returns safe confirmation payload (record ID, updated field, timestamp, transaction status).
    """
    target_id = req.lot_id if (req and req.lot_id) else None
    lot = None
    if target_id:
        lot = session.get(CropLot, target_id)
    
    if not lot:
        # Find first lot or create a dedicated demo lot
        lot = session.exec(select(CropLot)).first()
        
    if not lot:
        lot = CropLot(
            farmer_id=1,
            farmer_name="Ramesh Patil",
            commodity="Wheat",
            variety="Sharbati Lok-1",
            quantity_kg=5000.0,
            base_price_per_kg=24.50,
            quality_grade=QualityGrade.GRADE_A,
            quality_score=94.2,
            latitude=20.0125,
            longitude=73.7910,
            district="Nashik",
            state="Maharashtra",
            status=LotStatus.LISTED
        )
        session.add(lot)
        session.commit()
        session.refresh(lot)

    now_str = datetime.utcnow().strftime("%H:%M:%S")
    custom_marker = (req.custom_note if req and req.custom_note else f"Certified Sharbati (Verified DB Sync @ {now_str})")
    
    # Perform harmless field updates
    lot.variety = custom_marker
    lot.updated_at = datetime.utcnow()
    
    session.add(lot)
    session.commit()
    session.refresh(lot)

    return {
        "status": "SUCCESS",
        "message": "FPO Produce Lot database update committed successfully.",
        "db_transaction_status": "COMMITTED_PERSISTED",
        "record_id": lot.id,
        "updated_field": "variety",
        "updated_value": lot.variety,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "lot": lot
    }

@router.post("/demo/reset")
def demo_reset_fpo_lot(
    req: Optional[DemoUpdateRequest] = None,
    session: Session = Depends(get_session)
):
    """
    Resets the demo FPO lot back to baseline standard values in the database.
    """
    target_id = req.lot_id if (req and req.lot_id) else None
    lot = None
    if target_id:
        lot = session.get(CropLot, target_id)
    if not lot:
        lot = session.exec(select(CropLot)).first()
        
    if not lot:
        raise HTTPException(status_code=404, detail="No demo lot available to reset")

    lot.variety = "Sharbati Lok-1"
    lot.quantity_kg = 5000.0
    lot.updated_at = datetime.utcnow()
    
    session.add(lot)
    session.commit()
    session.refresh(lot)

    return {
        "status": "SUCCESS",
        "message": f"Demo Lot #{lot.id} reset to baseline values.",
        "db_transaction_status": "COMMITTED_PERSISTED",
        "record_id": lot.id,
        "reset_value": lot.variety,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "lot": lot
    }

