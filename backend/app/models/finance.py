from typing import Optional
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field

class BidStatus(str, Enum):
    INITIATED = "INITIATED"
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    OUTBID = "OUTBID"
    REJECTED = "REJECTED"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"

class EscrowStatus(str, Enum):
    INITIATED = "INITIATED"
    FUNDS_LOCKED = "LOCKED"
    FREIGHT_ADVANCE_PAID = "FREIGHT_ADVANCE_PAID"
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
    bid_price_per_kg: Optional[float] = Field(default=None) # Alias
    total_crop_value: Optional[float] = Field(default=None)
    estimated_freight: Optional[float] = Field(default=None)
    apmc_cess_fee: Optional[float] = Field(default=None)
    total_escrow_amount: Optional[float] = Field(default=None)
    total_amount: float = Field(gt=0)
    status: BidStatus = Field(default=BidStatus.INITIATED)
    delivery_deadline_days: int = 3
    payment_method: Optional[str] = "VIRTUAL_ESCROW"
    note: Optional[str] = None

class Bid(BidBase, table=True):
    __tablename__ = "bids"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EscrowVaultBase(SQLModel):
    bid_id: int = Field(unique=True, index=True)
    lot_id: int = Field(index=True)
    buyer_id: int = Field(index=True)
    farmer_id: int = Field(index=True)
    transporter_id: Optional[int] = 4
    
    # Financial Rails Breakdown (INR)
    crop_total_amount: float
    total_freight_cost: float
    total_locked_amount: float
    total_locked_deposit: Optional[float] = None
    
    advance_freight_amount: float = 0.0      # 30% advance (fuel & toll)
    advance_freight_disbursed: float = 0.0   # Compatibility alias
    balance_freight_amount: float = 0.0      # 70% upon delivery settlement
    final_freight_disbursed: float = 0.0     # Compatibility alias
    farmer_payout_amount: float = 0.0        # 100% crop value
    farmer_payout_disbursed: float = 0.0     # Compatibility alias
    platform_fee_inr: float = 0.0            # 1.5% APMC & Mandi Cess
    
    current_milestone: str = "LOCKED"        # "LOCKED", "FREIGHT_ADVANCE_PAID", "IN_TRANSIT", "SETTLED", "DISPUTED"
    status: EscrowStatus = Field(default=EscrowStatus.FUNDS_LOCKED)
    
    # 4-Digit Verification OTPs & Document Proofs
    farm_gate_otp: str = Field(default="4821")
    farmgate_pickup_otp: Optional[str] = Field(default="4821") # Alias
    destination_delivery_otp: str = Field(default="7394")
    weighbridge_receipt_url: Optional[str] = None
    tax_invoice_number: Optional[str] = None
    carrier_name: Optional[str] = "Kisan Express Logistics"
    vehicle_number: Optional[str] = "MH-15-EG-8942"
    
    is_pickup_verified: bool = Field(default=False)
    is_delivery_verified: bool = Field(default=False)
    dispute_reason: Optional[str] = None

class EscrowVault(EscrowVaultBase, table=True):
    __tablename__ = "escrow_vaults"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Legacy alias for backward compatibility
EscrowTransaction = EscrowVault
EscrowTransactionBase = EscrowVaultBase

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
