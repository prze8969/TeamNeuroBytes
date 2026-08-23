from typing import Optional, List
from datetime import datetime
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
    EscrowTransactionBase,
    EscrowTransaction,
    InvoiceBase,
    Invoice,
    GrievanceBase,
    Grievance,
)

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

# Legacy alias for backward compatibility
Listing = CropLot
ListingBase = CropLotBase
