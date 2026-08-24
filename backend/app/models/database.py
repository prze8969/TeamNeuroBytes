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

# Legacy alias for backward compatibility
Listing = CropLot
ListingBase = CropLotBase
