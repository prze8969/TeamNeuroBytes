from typing import Optional, List
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship

class UserRole(str, Enum):
    FARMER = "FARMER"
    BUYER = "BUYER"
    FPO = "ORGANIZATION"
    TRANSPORTER = "TRANSPORTATION"
    WAREHOUSE = "WAREHOUSE"
    ADMIN = "ADMIN"

class QualityGrade(str, Enum):
    GRADE_A = "A"
    GRADE_B = "B"
    GRADE_C = "C"
    REJECTED = "REJECTED"

class LotStatus(str, Enum):
    DRAFT = "DRAFT"
    LISTED = "LISTED"
    POOLED = "POOLED"
    BID_ACCEPTED = "BID_ACCEPTED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    DISPUTED = "DISPUTED"
    COMPLETED = "COMPLETED"

class CropLotBase(SQLModel):
    farmer_id: int = Field(index=True)
    farmer_phone: Optional[str] = Field(default=None, index=True)
    farmer_name: Optional[str] = None
    commodity: str = Field(index=True) # e.g. "Wheat", "Paddy", "Tomato", "Onion", "Soybean"
    variety: Optional[str] = "Standard Hybrid"
    quantity_kg: float = Field(gt=0)
    base_price_per_kg: float = Field(gt=0)
    
    # AI Quality Attributes
    quality_grade: QualityGrade = Field(default=QualityGrade.GRADE_B)
    quality_score: float = Field(default=85.0) # 0 to 100%
    defect_percentage: float = Field(default=2.5)
    ripeness_index: float = Field(default=90.0) # 0 to 100%
    image_url: Optional[str] = None
    is_ai_verified: bool = Field(default=False)
    
    # Geospatial Coordinates
    latitude: float
    longitude: float
    village: Optional[str] = None
    district: str = Field(default="Nashik")
    state: str = Field(default="Maharashtra")
    
    destination_mandi: Optional[str] = "Nashik APMC"
    harvest_date: Optional[str] = None
    status: LotStatus = Field(default=LotStatus.LISTED)
    cluster_id: Optional[int] = Field(default=None, foreign_key="geoclusters.id")

class CropLot(CropLotBase, table=True):
    __tablename__ = "crop_lots"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class GeoClusterBase(SQLModel):
    cluster_name: str
    destination_mandi: str
    centroid_latitude: float
    centroid_longitude: float
    radius_km: float = 10.0
    total_weight_kg: float = 0.0
    lots_count: int = 0
    participating_farmers_count: int = 0
    estimated_freight_cost: float = 0.0
    estimated_freight_savings_percent: float = 28.5
    status: str = Field(default="OPEN") # "OPEN", "MATCHED", "IN_TRANSIT", "FULFILLED"
    assigned_transporter_id: Optional[int] = None

class GeoCluster(GeoClusterBase, table=True):
    __tablename__ = "geoclusters"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MandiPriceBase(SQLModel):
    mandi_name: str = Field(index=True)
    district: str
    state: str
    commodity: str = Field(index=True)
    variety: Optional[str] = "Common"
    min_price_quintal: float # In ₹/Quintal
    max_price_quintal: float
    modal_price_quintal: float
    modal_price_kg: float # In ₹/kg
    arrival_quantity_tons: float = 50.0
    date: str
    forecast_7d_modal_kg: float

class MandiPrice(MandiPriceBase, table=True):
    __tablename__ = "mandi_prices"
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
