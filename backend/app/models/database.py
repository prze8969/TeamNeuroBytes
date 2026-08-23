from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: str
    role: str # "FARMER", "BUYER", "ORGANIZATION", "WAREHOUSE", "TRANSPORTATION", "ADMIN"
    is_active: bool = True
    cibil_score: Optional[int] = None
    kyc_verified: bool = False
    fpo_id: Optional[int] = None

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ListingBase(SQLModel):
    title: str
    description: str
    commodity_type: str
    quantity_kg: float
    base_price_per_kg: float
    location: str
    image_url: Optional[str] = None
    is_verified: bool = False

class Listing(ListingBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    farmer_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BidBase(SQLModel):
    listing_id: int = Field(foreign_key="listing.id")
    buyer_id: int = Field(foreign_key="user.id")
    amount_per_kg: float
    status: str = "PENDING" # "PENDING", "ACCEPTED", "REJECTED"

class Bid(BidBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class InvoiceBase(SQLModel):
    bid_id: int = Field(foreign_key="bid.id")
    buyer_id: int = Field(foreign_key="user.id")
    seller_id: int = Field(foreign_key="user.id")
    total_amount: float
    transportation_cost: float
    status: str = "PAID"

class Invoice(InvoiceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class GrievanceBase(SQLModel):
    user_id: int = Field(foreign_key="user.id")
    subject: str
    description: str
    status: str = "OPEN" # "OPEN", "IN_PROGRESS", "RESOLVED"

class Grievance(GrievanceBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
