from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from sqlmodel import Session, select

from app.db.engine import get_session
from app.models.database import EscrowVault, Bid, CropLot, Invoice, Grievance
from app.services.escrow_service import escrow_service

router = APIRouter()

class CreateBidVaultRequest(BaseModel):
    lot_id: int
    buyer_id: int = 2
    buyer_name: Optional[str] = "AgroProcure Private Ltd"
    bid_price_per_kg: float
    payment_method: Optional[str] = "VIRTUAL_ESCROW"
    delivery_deadline_days: int = 3
    note: Optional[str] = None

class PickupOtpRequest(BaseModel):
    otp: str

class SettleDeliveryRequest(BaseModel):
    delivery_otp: Optional[str] = "7394"
    weighbridge_receipt_url: Optional[str] = "https://kisansetu.in/docs/receipts/WB-2026-APMC-942.pdf"
    quality_inspection_pass: bool = True

class RaiseDisputeRequest(BaseModel):
    user_id: int = 2
    category: str = "QUALITY_MISMATCH"
    subject: str = "Produce Rotten / Weight Mismatch"
    description: str = "Substantial quality deterioration and broken produce detected upon gate arrival."

@router.post("/bids/create", response_model=Any)
def create_bid_and_lock_escrow_vault(
    req: CreateBidVaultRequest,
    session: Session = Depends(get_session)
):
    """
    Feature #4 & #5: Validates asking floor, calculates total landed cost,
    creates Bid, and initializes 100% Locked Escrow Vault.
    """
    result = escrow_service.create_bid_and_lock_vault(
        session=session,
        lot_id=req.lot_id,
        buyer_id=req.buyer_id,
        buyer_name=req.buyer_name or "AgroProcure Private Ltd",
        bid_price_per_kg=req.bid_price_per_kg,
        payment_method=req.payment_method or "VIRTUAL_ESCROW",
        delivery_deadline_days=req.delivery_deadline_days,
        note=req.note
    )
    return result

@router.get("/vaults", response_model=List[Any])
def get_all_escrow_vaults(
    buyer_id: Optional[int] = None,
    session: Session = Depends(get_session)
):
    """Returns active escrow vaults with associated crop lot metadata."""
    query = select(EscrowVault)
    if buyer_id:
        query = query.where(EscrowVault.buyer_id == buyer_id)
    
    vaults = session.exec(query).all()
    results = []
    for v in vaults:
        lot = session.get(CropLot, v.lot_id)
        results.append({
            "id": v.id,
            "bid_id": v.bid_id,
            "lot_id": v.lot_id,
            "crop_name": lot.commodity if lot else "Crop Lot",
            "variety": lot.variety if lot else "Hybrid",
            "quantity_kg": lot.quantity_kg if lot else 5000,
            "farmer_name": lot.farmer_name if lot else "Ramesh Patil",
            "farmer_district": lot.district if lot else "Nashik",
            "total_locked_amount": v.total_locked_amount,
            "crop_total_amount": v.crop_total_amount,
            "total_freight_cost": v.total_freight_cost,
            "advance_freight_amount": v.advance_freight_amount,
            "advance_freight_disbursed": v.advance_freight_disbursed,
            "balance_freight_amount": v.balance_freight_amount,
            "farmer_payout_amount": v.farmer_payout_amount,
            "platform_fee_inr": v.platform_fee_inr,
            "current_milestone": v.current_milestone,
            "status": v.status,
            "farm_gate_otp": v.farm_gate_otp,
            "destination_delivery_otp": v.destination_delivery_otp,
            "is_pickup_verified": v.is_pickup_verified,
            "is_delivery_verified": v.is_delivery_verified,
            "carrier_name": v.carrier_name,
            "vehicle_number": v.vehicle_number,
            "tax_invoice_number": v.tax_invoice_number,
            "dispute_reason": v.dispute_reason,
            "created_at": v.created_at
        })
    return results

@router.get("/vaults/{vault_id}", response_model=Any)
def get_escrow_vault_details(vault_id: int, session: Session = Depends(get_session)):
    """Fetches full state and milestone history of a specific escrow vault."""
    vault = session.get(EscrowVault, vault_id)
    if not vault:
        raise HTTPException(status_code=404, detail="Escrow vault not found")
    
    lot = session.get(CropLot, vault.lot_id)
    return {
        "vault": vault,
        "lot": lot
    }

@router.post("/{vault_id}/advance-freight", response_model=Any)
def disburse_advance_freight(vault_id: int, session: Session = Depends(get_session)):
    """
    Milestone 2: Disburses 30% advance fuel & transit fee to carrier.
    """
    result = escrow_service.disburse_advance_freight(session=session, vault_id=vault_id)
    return result

@router.post("/{vault_id}/verify-pickup-otp", response_model=Any)
def verify_farmgate_pickup_otp(
    vault_id: int,
    req: PickupOtpRequest,
    session: Session = Depends(get_session)
):
    """
    Milestone 3: 4-digit OTP handshake between farmer and driver at farm gate (status -> IN_TRANSIT).
    """
    result = escrow_service.verify_farmgate_pickup_otp(
        session=session,
        vault_id=vault_id,
        entered_otp=req.otp
    )
    return result

@router.post("/{vault_id}/complete-settlement", response_model=Any)
@router.post("/{vault_id}/settle", response_model=Any)
def complete_delivery_and_settlement(
    vault_id: int,
    req: SettleDeliveryRequest = SettleDeliveryRequest(),
    session: Session = Depends(get_session)
):
    """
    Milestone 4: Weighbridge weight verification + quality inspection pass triggers:
    - 100% crop payout to farmer bank account.
    - 70% balance freight to transporter.
    - Generates GST-compliant Tax Invoice.
    """
    result = escrow_service.complete_delivery_and_settle(
        session=session,
        vault_id=vault_id,
        delivery_otp=req.delivery_otp,
        weighbridge_receipt_url=req.weighbridge_receipt_url,
        quality_inspection_pass=req.quality_inspection_pass
    )
    return result

@router.post("/{vault_id}/raise-dispute", response_model=Any)
@router.post("/{vault_id}/dispute", response_model=Any)
def raise_dispute_and_freeze_funds(
    vault_id: int,
    req: RaiseDisputeRequest = RaiseDisputeRequest(),
    session: Session = Depends(get_session)
):
    """
    Freezes escrow vault and routes to APMC grievance mediation arbitration.
    """
    result = escrow_service.raise_dispute(
        session=session,
        vault_id=vault_id,
        user_id=req.user_id,
        category=req.category,
        subject=req.subject,
        description=req.description
    )
    return result

@router.post("/{vault_id}/reset-demo", response_model=Any)
def reset_escrow_demo_state(vault_id: int, session: Session = Depends(get_session)):
    """Resets escrow vault back to Milestone 1 for demo repeatability."""
    result = escrow_service.reset_demo_vault(session=session, vault_id=vault_id)
    return result

@router.get("/invoices", response_model=List[Invoice])
def get_all_invoices(session: Session = Depends(get_session)):
    """Returns all finalized invoices and tax receipts."""
    invoices = session.exec(select(Invoice)).all()
    return invoices

@router.get("/grievances", response_model=List[Grievance])
def get_all_grievances(session: Session = Depends(get_session)):
    """Returns all open and mediated grievances."""
    grievances = session.exec(select(Grievance)).all()
    return grievances
