from typing import Optional
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field

class BidStatus(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"

class EscrowStatus(str, Enum):
    INITIATED = "INITIATED"
    FUNDS_LOCKED = "LOCKED"
    ADVANCE_DISBURSED = "ADVANCE_DISBURSED" # 30% Freight released
    IN_TRANSIT = "IN_TRANSIT"               # OTP Verified at farm gate
    INSPECTION_PASSED = "INSPECTION_PASSED" # Quality check passed at buyer
    SETTLED = "SETTLED"                     # 100% Crop + 70% Freight released
    DISPUTED = "DISPUTED"                   # Grievance routed
    REFUNDED = "REFUNDED"

class BidBase(SQLModel):
    lot_id: int = Field(index=True)
    buyer_id: int = Field(index=True)
    buyer_name: Optional[str] = "Institutional Buyer"
    amount_per_kg: float = Field(gt=0)
    total_amount: float = Field(gt=0)
    status: BidStatus = Field(default=BidStatus.PENDING)
    delivery_deadline_days: int = 3
    note: Optional[str] = None

class Bid(BidBase, table=True):
    __tablename__ = "bids"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EscrowTransactionBase(SQLModel):
    bid_id: int = Field(unique=True, index=True)
    lot_id: int = Field(index=True)
    buyer_id: int = Field(index=True)
    farmer_id: int = Field(index=True)
    transporter_id: Optional[int] = None
    
    # Financial Rails Breakdown (INR)
    crop_total_amount: float
    total_freight_cost: float
    total_locked_deposit: float # 100% Crop + 100% Freight + Platform fee
    
    advance_freight_disbursed: float = 0.0 # 30% advance
    final_freight_disbursed: float = 0.0   # 70% upon delivery
    farmer_payout_disbursed: float = 0.0   # 100% upon delivery pass
    platform_fee_inr: float = 0.0
    
    status: EscrowStatus = Field(default=EscrowStatus.INITIATED)
    
    # 4-Digit Verification OTPs
    farmgate_pickup_otp: str = Field(default="4821")
    destination_delivery_otp: str = Field(default="7394")
    
    is_pickup_verified: bool = Field(default=False)
    is_delivery_verified: bool = Field(default=False)
    
    dispute_reason: Optional[str] = None

class EscrowTransaction(EscrowTransactionBase, table=True):
    __tablename__ = "escrow_transactions"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class InvoiceBase(SQLModel):
    transaction_id: int = Field(index=True)
    invoice_number: str = Field(unique=True, index=True)
    buyer_id: int
    seller_id: int
    transporter_id: Optional[int] = None
    crop_amount: float
    freight_amount: float
    platform_commission: float
    tax_amount_gst: float
    total_payable: float
    payment_status: str = Field(default="PAID") # "PENDING", "ESCROW_LOCKED", "PAID"

class Invoice(InvoiceBase, table=True):
    __tablename__ = "invoices"
    id: Optional[int] = Field(default=None, primary_key=True)
    issued_at: datetime = Field(default_factory=datetime.utcnow)

class GrievanceBase(SQLModel):
    user_id: int = Field(index=True)
    related_lot_id: Optional[int] = None
    related_escrow_id: Optional[int] = None
    category: str = "QUALITY_MISMATCH" # "QUALITY_MISMATCH", "DELIVERY_DELAY", "WEIGHT_SHORTAGE", "PAYMENT_HOLD"
    subject: str
    description: str
    evidence_image_url: Optional[str] = None
    status: str = Field(default="OPEN") # "OPEN", "IN_MEDIATION", "RESOLVED", "REJECTED"
    resolution_notes: Optional[str] = None

class Grievance(GrievanceBase, table=True):
    __tablename__ = "grievances"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
