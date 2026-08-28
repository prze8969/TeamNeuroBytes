from typing import Optional, List
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field

# Import and expose agriculture and finance models
from app.models.agriculture import (
    UserRole,
    QualityGrade,
    LotStatus,
    CropLotBase,
    CropLot,
    GeoClusterBase,
    GeoCluster,
    MandiPriceBase,
    MandiPrice,
    ImageAssessment,
    AssessmentStatus,
    CropInventory,
)
from app.models.finance import (
    BidStatus,
    EscrowStatus,
    BidBase,
    Bid,
    EscrowVaultBase,
    EscrowVault,
    EscrowTransactionBase,
    EscrowTransaction,
    InvoiceBase,
    Invoice,
    GrievanceBase,
    Grievance,
)

class BuyerType(str, Enum):
    WHOLESALER = "WHOLESALER"
    PROCESSOR = "PROCESSOR"
    RETAILER = "RETAILER"
    EXPORTER = "EXPORTER"

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    phone_number: Optional[str] = Field(default=None, unique=True, index=True)
    full_name: str
    role: str = "FARMER" # "FARMER", "BUYER", "ORGANIZATION", "WAREHOUSE", "TRANSPORTATION", "ADMIN"
    is_active: bool = True
    cibil_score: Optional[int] = None
    kyc_verified: bool = False
    aadhaar_masked: Optional[str] = None
    fpo_id: Optional[int] = None
    village: Optional[str] = "Panchavati"
    district: Optional[str] = "Nashik"
    state: Optional[str] = "Maharashtra"
    latitude: Optional[float] = 19.9975
    longitude: Optional[float] = 73.7898

class User(UserBase, table=True):
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BuyerProfileBase(SQLModel):
    user_id: int = Field(foreign_key="users.id", unique=True, index=True)
    business_name: str
    buyer_type: BuyerType = BuyerType.PROCESSOR
    gstin: str = Field(unique=True, index=True)
    apmc_license_no: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    is_verified: bool = False
    kyc_document_url: Optional[str] = None
    delivery_address: str
    delivery_latitude: Optional[float] = 19.9975
    delivery_longitude: Optional[float] = 73.7898
    preferred_apmc_mandi: Optional[str] = "Vashi APMC Mandi"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BuyerProfile(BuyerProfileBase, table=True):
    __tablename__ = "buyer_profiles"
    id: Optional[int] = Field(default=None, primary_key=True)

class TransporterProfileBase(SQLModel):
    user_id: int = Field(foreign_key="users.id", unique=True, index=True)
    carrier_name: str = "Kisan Express Fleet Logistics"
    gstin: str = "27AABCK9981F1Z2"
    contact_phone: Optional[str] = "+91 99887 76655"
    total_trucks: int = Field(default=4)
    vehicle_types: str = Field(default="Medium Truck (3-7 MT), Reefer / Cold-Chain Truck")
    total_drivers: int = Field(default=3)
    base_rate: float = Field(default=1.50)
    rate_unit: str = Field(default="INR_PER_KG")
    min_freight_charge: float = Field(default=2000.0)
    reefer_surcharge_enabled: bool = Field(default=True)
    reefer_surcharge_type: str = Field(default="PERCENTAGE")
    reefer_surcharge_value: float = Field(default=20.0)
    preferred_target_trips: int = Field(default=12)
    target_frequency: str = Field(default="PER_WEEK")
    operating_corridors: str = Field(default="Nashik → Mumbai (Vashi APMC), Pune → Vashi APMC Terminal")
    rating: float = Field(default=4.9)
    total_trips_completed: int = Field(default=0)
    available_escrow_balance_inr: float = Field(default=0.0)
    is_onboarded: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TransporterProfile(TransporterProfileBase, table=True):
    __tablename__ = "transporter_profiles"
    id: Optional[int] = Field(default=None, primary_key=True)

# Legacy alias for backward compatibility
Listing = CropLot
ListingBase = CropLotBase
