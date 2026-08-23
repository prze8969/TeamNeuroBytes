import random
import uuid
from typing import Dict, Any, Optional
from datetime import datetime
from sqlmodel import Session, select
from fastapi import HTTPException

from app.models.database import (
    EscrowTransaction, EscrowStatus, Bid, BidStatus, CropLot, LotStatus, Invoice, Grievance, User
)

class MilestoneEscrowService:
    @staticmethod
    def generate_secure_otp() -> str:
        """Generates 4-digit numeric OTP for verification handshakes."""
        return f"{random.randint(1000, 9999)}"

    @classmethod
    def initiate_escrow_for_bid(
        cls,
        session: Session,
        bid_id: int,
        transporter_id: Optional[int] = None
    ) -> EscrowTransaction:
        """
        Milestone 1: 100% buyer funds locked upon bid acceptance.
        Calculates crop cost, freight budget, platform fee, and locks total funds in escrow.
        """
        bid = session.get(Bid, bid_id)
        if not bid:
            raise HTTPException(status_code=404, detail="Bid not found")
        
        lot = session.get(CropLot, bid.lot_id)
        if not lot:
            raise HTTPException(status_code=404, detail="Associated crop lot not found")

        # Check existing escrow
        existing = session.exec(select(EscrowTransaction).where(EscrowTransaction.bid_id == bid_id)).first()
        if existing:
            return existing

        # Estimate Freight and Platform Fee
        crop_total = round(lot.quantity_kg * bid.amount_per_kg, 2)
        freight_estimate = round(lot.quantity_kg * 0.95, 2) # ~₹0.95/kg transport budget
        platform_fee = round(crop_total * 0.015, 2)         # 1.5% platform fee
        total_locked = round(crop_total + freight_estimate + platform_fee, 2)

        pickup_otp = cls.generate_secure_otp()
        delivery_otp = cls.generate_secure_otp()

        escrow_tx = EscrowTransaction(
            bid_id=bid.id,
            lot_id=lot.id,
            buyer_id=bid.buyer_id,
            farmer_id=lot.farmer_id,
            transporter_id=transporter_id or 4, # Default demo transporter
            crop_total_amount=crop_total,
            total_freight_cost=freight_estimate,
            total_locked_deposit=total_locked,
            platform_fee_inr=platform_fee,
            status=EscrowStatus.FUNDS_LOCKED,
            farmgate_pickup_otp=pickup_otp,
            destination_delivery_otp=delivery_otp,
            is_pickup_verified=False,
            is_delivery_verified=False
        )
        session.add(escrow_tx)

        # Update Bid and Lot status
        bid.status = BidStatus.ACCEPTED
        lot.status = LotStatus.BID_ACCEPTED
        session.add(bid)
        session.add(lot)

        session.commit()
        session.refresh(escrow_tx)
        return escrow_tx

    @classmethod
    def disburse_advance_freight(cls, session: Session, escrow_id: int) -> Dict[str, Any]:
        """
        Milestone 2: Disburse 30% advance freight fee to assigned transporter.
        """
        escrow = session.get(EscrowTransaction, escrow_id)
        if not escrow:
            raise HTTPException(status_code=404, detail="Escrow transaction not found")

        advance_30_percent = round(escrow.total_freight_cost * 0.30, 2)
        escrow.advance_freight_disbursed = advance_30_percent
        escrow.status = EscrowStatus.ADVANCE_DISBURSED
        
        session.add(escrow)
        session.commit()
        session.refresh(escrow)

        return {
            "escrow_id": escrow.id,
            "advance_freight_released_inr": advance_30_percent,
            "transporter_id": escrow.transporter_id,
            "status": escrow.status,
            "message": "30% Advance fuel & transit payment released to transporter"
        }

    @classmethod
    def verify_farmgate_pickup_otp(cls, session: Session, escrow_id: int, entered_otp: str) -> Dict[str, Any]:
        """
        Milestone 3: 4-digit OTP handshake at farm gate pickup (status -> IN_TRANSIT).
        """
        escrow = session.get(EscrowTransaction, escrow_id)
        if not escrow:
            raise HTTPException(status_code=404, detail="Escrow transaction not found")

        if escrow.farmgate_pickup_otp != entered_otp.strip():
            raise HTTPException(status_code=400, detail="Invalid Farmgate Pickup OTP")

        escrow.is_pickup_verified = True
        escrow.status = EscrowStatus.IN_TRANSIT

        lot = session.get(CropLot, escrow.lot_id)
        if lot:
            lot.status = LotStatus.IN_TRANSIT
            session.add(lot)

        session.add(escrow)
        session.commit()
        session.refresh(escrow)

        return {
            "escrow_id": escrow.id,
            "status": escrow.status,
            "is_pickup_verified": True,
            "message": "Farmgate OTP verified successfully! Produce is now IN_TRANSIT with live GPS tracking."
        }

    @classmethod
    def complete_delivery_and_settle(
        cls,
        session: Session,
        escrow_id: int,
        delivery_otp: str,
        quality_inspection_pass: bool = True
    ) -> Dict[str, Any]:
        """
        Milestone 4: Quality inspection pass at APMC/buyer facility triggers:
        - Remaining 70% freight payout to transporter.
        - 100% crop payment to farmer.
        - Generates finalized tax invoice.
        """
        escrow = session.get(EscrowTransaction, escrow_id)
        if not escrow:
            raise HTTPException(status_code=404, detail="Escrow transaction not found")

        if escrow.destination_delivery_otp != delivery_otp.strip():
            raise HTTPException(status_code=400, detail="Invalid Destination Delivery OTP")

        if not quality_inspection_pass:
            escrow.status = EscrowStatus.DISPUTED
            escrow.dispute_reason = "Quality inspection failed at buyer facility gate."
            session.add(escrow)
            session.commit()
            return {
                "escrow_id": escrow.id,
                "status": escrow.status,
                "message": "Quality mismatch flagged. Escrow routed to Grievance Mediation Rail."
            }

        # Calculate Final Disbursements
        remaining_70_freight = round(escrow.total_freight_cost * 0.70, 2)
        farmer_full_crop_payout = escrow.crop_total_amount

        escrow.final_freight_disbursed = remaining_70_freight
        escrow.farmer_payout_disbursed = farmer_full_crop_payout
        escrow.is_delivery_verified = True
        escrow.status = EscrowStatus.SETTLED

        # Update Lot
        lot = session.get(CropLot, escrow.lot_id)
        if lot:
            lot.status = LotStatus.DELIVERED
            session.add(lot)

        # Generate Formal Tax Invoice
        inv_num = f"INV-KS-{datetime.utcnow().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
        invoice = Invoice(
            transaction_id=escrow.id,
            invoice_number=inv_num,
            buyer_id=escrow.buyer_id,
            seller_id=escrow.farmer_id,
            transporter_id=escrow.transporter_id,
            crop_amount=escrow.crop_total_amount,
            freight_amount=escrow.total_freight_cost,
            platform_commission=escrow.platform_fee_inr,
            tax_amount_gst=round(escrow.platform_fee_inr * 0.18, 2), # 18% GST on platform service
            total_payable=escrow.total_locked_deposit,
            payment_status="PAID"
        )
        session.add(invoice)

        session.add(escrow)
        session.commit()
        session.refresh(escrow)

        return {
            "escrow_id": escrow.id,
            "status": escrow.status,
            "farmer_payout_inr": farmer_full_crop_payout,
            "remaining_freight_payout_inr": remaining_70_freight,
            "invoice_number": invoice.invoice_number,
            "message": f"Escrow fully settled! ₹{farmer_full_crop_payout} disbursed to farmer, ₹{remaining_70_freight} to transporter."
        }

    @classmethod
    def file_dispute(
        cls,
        session: Session,
        user_id: int,
        escrow_id: int,
        category: str,
        subject: str,
        description: str
    ) -> Grievance:
        """Milestone 5: Dispute trigger routes cases to integrated grievance mediation."""
        escrow = session.get(EscrowTransaction, escrow_id)
        if not escrow:
            raise HTTPException(status_code=404, detail="Escrow transaction not found")

        escrow.status = EscrowStatus.DISPUTED
        escrow.dispute_reason = subject
        session.add(escrow)

        grievance = Grievance(
            user_id=user_id,
            related_lot_id=escrow.lot_id,
            related_escrow_id=escrow.id,
            category=category,
            subject=subject,
            description=description,
            status="IN_MEDIATION"
        )
        session.add(grievance)
        session.commit()
        session.refresh(grievance)
        return grievance

escrow_service = MilestoneEscrowService()
