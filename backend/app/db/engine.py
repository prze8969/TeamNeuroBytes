import os
from sqlmodel import SQLModel, create_engine, Session, select
from app.core.config import settings
from app.core.security import get_password_hash

# Configure Database Engine (Supports PostgreSQL or SQLite)
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_url, echo=False, connect_args=connect_args)
else:
    engine = create_engine(db_url, echo=False, pool_pre_ping=True)

def create_db_and_tables():
    from app.models.database import (
        User, CropLot, GeoCluster, MandiPrice, Bid, EscrowTransaction, Invoice, Grievance
    )
    SQLModel.metadata.create_all(engine)
    seed_initial_demo_data()

def get_session():
    with Session(engine) as session:
        yield session

def seed_initial_demo_data():
    """Seeds rich Agmarknet prices, verified crop lots, and user accounts for SIH demo."""
    from app.models.database import User, CropLot, MandiPrice, GeoCluster, QualityGrade, LotStatus
    
    with Session(engine) as session:
        # Check if users already seeded
        existing_user = session.exec(select(User)).first()
        if not existing_user:
            # Seed Demo Users
            farmer = User(
                email="farmer@kisansetu.in",
                phone_number="+919876543210",
                full_name="Ramesh Patil",
                role="FARMER",
                kyc_verified=True,
                cibil_score=760,
                district="Nashik",
                state="Maharashtra",
                latitude=20.0125,
                longitude=73.7910,
                hashed_password=get_password_hash("farmer123")
            )
            buyer = User(
                email="buyer@kisansetu.in",
                phone_number="+919876543211",
                full_name="AgroProcure Private Ltd",
                role="BUYER",
                kyc_verified=True,
                cibil_score=810,
                district="Mumbai Suburban",
                state="Maharashtra",
                latitude=19.0760,
                longitude=72.8777,
                hashed_password=get_password_hash("buyer123")
            )
            fpo = User(
                email="fpo@kisansetu.in",
                phone_number="+919876543212",
                full_name="Sahyadri Agro Farmers Producer Co.",
                role="ORGANIZATION",
                kyc_verified=True,
                cibil_score=790,
                district="Nashik",
                state="Maharashtra",
                latitude=20.0050,
                longitude=73.8100,
                hashed_password=get_password_hash("fpo123")
            )
            transporter = User(
                email="transporter@kisansetu.in",
                phone_number="+919876543213",
                full_name="Kisan Express Fleet Logistics",
                role="TRANSPORTATION",
                kyc_verified=True,
                cibil_score=740,
                district="Pune",
                state="Maharashtra",
                latitude=18.5204,
                longitude=73.8567,
                hashed_password=get_password_hash("trans123")
            )
            session.add_all([farmer, buyer, fpo, transporter])
            session.commit()
            
            # Seed Demo Mandi Price Benchmarks
            prices = [
                MandiPrice(
                    mandi_name="Nashik APMC", district="Nashik", state="Maharashtra",
                    commodity="Wheat", variety="Sharbati Lok-1",
                    min_price_quintal=2300, max_price_quintal=2750, modal_price_quintal=2550,
                    modal_price_kg=25.50, arrival_quantity_tons=120.0, date="2026-08-23",
                    forecast_7d_modal_kg=27.20
                ),
                MandiPrice(
                    mandi_name="Lasalgaon APMC", district="Nashik", state="Maharashtra",
                    commodity="Onion", variety="Red Nashik",
                    min_price_quintal=1800, max_price_quintal=2400, modal_price_quintal=2150,
                    modal_price_kg=21.50, arrival_quantity_tons=450.0, date="2026-08-23",
                    forecast_7d_modal_kg=23.00
                ),
                MandiPrice(
                    mandi_name="Pune APMC", district="Pune", state="Maharashtra",
                    commodity="Tomato", variety="Hybrid Vaishali",
                    min_price_quintal=1500, max_price_quintal=2200, modal_price_quintal=1900,
                    modal_price_kg=19.00, arrival_quantity_tons=280.0, date="2026-08-23",
                    forecast_7d_modal_kg=21.50
                ),
                MandiPrice(
                    mandi_name="Vashi APMC Navi Mumbai", district="Thane", state="Maharashtra",
                    commodity="Wheat", variety="Sharbati Lok-1",
                    min_price_quintal=2600, max_price_quintal=3100, modal_price_quintal=2850,
                    modal_price_kg=28.50, arrival_quantity_tons=350.0, date="2026-08-23",
                    forecast_7d_modal_kg=29.80
                ),
            ]
            session.add_all(prices)
            session.commit()
            
            # Seed Demo GeoCluster
            cluster = GeoCluster(
                cluster_name="Nashik East Smallholder Collective",
                destination_mandi="Vashi APMC Navi Mumbai",
                centroid_latitude=20.0120,
                centroid_longitude=73.7950,
                radius_km=8.5,
                total_weight_kg=18500,
                lots_count=4,
                participating_farmers_count=4,
                estimated_freight_cost=14200.0,
                estimated_freight_savings_percent=31.5,
                status="OPEN"
            )
            session.add(cluster)
            session.commit()
            
            # Seed Demo Crop Lots
            lots = [
                CropLot(
                    farmer_id=farmer.id,
                    farmer_phone="+919876543210",
                    farmer_name="Ramesh Patil",
                    commodity="Wheat",
                    variety="Sharbati Lok-1",
                    quantity_kg=5000,
                    base_price_per_kg=24.50,
                    quality_grade=QualityGrade.GRADE_A,
                    quality_score=94.2,
                    defect_percentage=1.8,
                    ripeness_index=95.0,
                    is_ai_verified=True,
                    latitude=20.0125,
                    longitude=73.7910,
                    district="Nashik",
                    state="Maharashtra",
                    destination_mandi="Nashik APMC",
                    harvest_date="2026-08-20",
                    status=LotStatus.LISTED,
                    cluster_id=cluster.id
                ),
                CropLot(
                    farmer_id=farmer.id,
                    farmer_phone="+919876543210",
                    farmer_name="Anil Deshmukh",
                    commodity="Onion",
                    variety="Red Nashik",
                    quantity_kg=8000,
                    base_price_per_kg=21.00,
                    quality_grade=QualityGrade.GRADE_A,
                    quality_score=92.0,
                    defect_percentage=2.1,
                    ripeness_index=91.0,
                    is_ai_verified=True,
                    latitude=20.0090,
                    longitude=73.8050,
                    district="Nashik",
                    state="Maharashtra",
                    destination_mandi="Lasalgaon APMC",
                    harvest_date="2026-08-22",
                    status=LotStatus.POOLED,
                    cluster_id=cluster.id
                ),
                CropLot(
                    farmer_id=farmer.id,
                    farmer_phone="+919876543210",
                    farmer_name="Sanjay Shinde",
                    commodity="Tomato",
                    variety="Hybrid Vaishali",
                    quantity_kg=5500,
                    base_price_per_kg=18.50,
                    quality_grade=QualityGrade.GRADE_B,
                    quality_score=87.5,
                    defect_percentage=4.2,
                    ripeness_index=88.0,
                    is_ai_verified=True,
                    latitude=20.0210,
                    longitude=73.7890,
                    district="Nashik",
                    state="Maharashtra",
                    destination_mandi="Pune APMC",
                    harvest_date="2026-08-23",
                    status=LotStatus.LISTED,
                    cluster_id=cluster.id
                )
            ]
            session.add_all(lots)
            session.commit()
