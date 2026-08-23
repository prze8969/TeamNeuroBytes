from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Any
from sqlmodel import Session, select

from app.db.engine import get_session
from app.models.database import EscrowTransaction, Invoice, Grievance
from app.services.escrow_service import escrow_service

router = APIRouter()

class AcceptBidRequest(BaseModel):
    transporter_id: Optional[int] = 4

class PickupOtpRequest(BaseModel):
    otp: str

class SettleDeliveryRequest(BaseModel):
    delivery_otp: str
    quality_inspection_pass: bool = True

class FileDisputeRequest(BaseModel):
    user_id: int
    category: str = "QUALITY_MISMATCH"
    subject: str
    description: str

@router.post("/accept-bid/{bid_id}", response_model=EscrowTransaction)
def accept_bid_and_lock_escrow(
    bid_id: int,
    req: AcceptBidRequest = AcceptBidRequest(),
    session: Session = Depends(get_session)
):
    """
    Milestone 1: 100% buyer funds locked upon bid acceptance.
    Transfers funds to secure Escrow Vault and issues 4-digit pickup OTP.
    """
    escrow_tx = escrow_service.initiate_escrow_for_bid(
        session=session,
        bid_id=bid_id,
        transporter_id=req.transporter_id
    )
    return escrow_tx

@router.post("/advance-freight/{escrow_id}")
def disburse_advance_freight(escrow_id: int, session: Session = Depends(get_session)):
    """
    Milestone 2: Disburses 30% advance transit & fuel fee to assigned transporter.
    """
    result = escrow_service.disburse_advance_freight(session=session, escrow_id=escrow_id)
    return result

@router.post("/verify-pickup/{escrow_id}")
def verify_farmgate_pickup(
    escrow_id: int,
    req: PickupOtpRequest,
    session: Session = Depends(get_session)
):
    """
    Milestone 3: 4-digit OTP handshake at farm gate pickup (status -> IN_TRANSIT).
    """
    result = escrow_service.verify_farmgate_pickup_otp(
        session=session,
        escrow_id=escrow_id,
        entered_otp=req.otp
    )
    return result

@router.post("/settle/{escrow_id}")
def settle_escrow_delivery(
    escrow_id: int,
    req: SettleDeliveryRequest,
    session: Session = Depends(get_session)
):
    """
    Milestone 4: Quality inspection pass at APMC/buyer facility triggers:
    - Remaining 70% freight payout to transporter.
    - 100% crop payment to farmer.
    - Generates GST-compliant invoice.
    """
    result = escrow_service.complete_delivery_and_settle(
        session=session,
        escrow_id=escrow_id,
        delivery_otp=req.delivery_otp,
        quality_inspection_pass=req.quality_inspection_pass
    )
    return result

@router.post("/dispute/{escrow_id}")
def dispute_escrow_transaction(
    escrow_id: int,
    req: FileDisputeRequest,
    session: Session = Depends(get_session)
):
    """
    Milestone 5: Dispute trigger routes transaction to integrated grievance mediation.
    """
    grievance = escrow_service.file_dispute(
        session=session,
        user_id=req.user_id,
        escrow_id=escrow_id,
        category=req.category,
        subject=req.subject,
        description=req.description
    )
    return grievance

@router.get("/transactions", response_model=List[EscrowTransaction])
def get_all_escrow_transactions(session: Session = Depends(get_session)):
    """Returns all active escrow transactions and status milestones."""
    txs = session.exec(select(EscrowTransaction)).all()
    return txs

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
