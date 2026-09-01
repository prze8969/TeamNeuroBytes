# backend/app/db/engine.py

import os
from sqlmodel import SQLModel, create_engine, Session, select
from app.core.config import settings
from app.core.security import get_password_hash

# Configure Database Engine (Supports PostgreSQL or SQLite with Connection Health Checks)
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        db_url,
        echo=False,
        connect_args=connect_args,
        pool_pre_ping=True
    )
else:
    engine = create_engine(
        db_url,
        echo=False,
        pool_pre_ping=True,
        pool_recycle=3600
    )

def create_db_and_tables():
    from app.models.database import (
        User, CropLot, GeoCluster, MandiPrice, Bid, EscrowVault, EscrowTransaction, Invoice, Grievance, BuyerProfile, TransporterProfile, ImageAssessment, CropInventory
    )
    SQLModel.metadata.create_all(engine)
    seed_initial_demo_data()

def get_session():
    with Session(engine) as session:
        yield session

def seed_initial_demo_data():
    """Seeds rich Agmarknet prices, verified crop lots, and user accounts for SIH demo with canonical roles & hashed credentials."""
    from app.models.database import User, CropLot, MandiPrice, GeoCluster, QualityGrade, LotStatus, BuyerProfile, BuyerType, TransporterProfile, Bid, BidStatus, EscrowVault, EscrowStatus, Invoice
    
    with Session(engine) as session:
        # Define Canonical Demo Stakeholders with Secure Hashed Passwords
        demo_users_data = [
            {
                "email": "farmer@kisansetu.in",
                "phone_number": "+919876543210",
                "full_name": "Ramesh Patil",
                "role": "FARMER",
                "kyc_verified": True,
                "cibil_score": 760,
                "district": "Nashik",
                "state": "Maharashtra",
                "latitude": 20.0125,
                "longitude": 73.7910,
                "password": "farmer123"
            },
            {
                "email": "buyer@kisansetu.in",
                "phone_number": "+919876543211",
                "full_name": "AgroProcure Private Ltd",
                "role": "BUYER",
                "kyc_verified": True,
                "cibil_score": 810,
                "district": "Mumbai Suburban",
                "state": "Maharashtra",
                "latitude": 19.0760,
                "longitude": 72.8777,
                "password": "buyer123"
            },
            {
                "email": "fpo@kisansetu.in",
                "phone_number": "+919876543212",
                "full_name": "Sahyadri Agro Farmers Producer Co.",
                "role": "ORGANIZATION",
                "kyc_verified": True,
                "cibil_score": 790,
                "district": "Nashik",
                "state": "Maharashtra",
                "latitude": 20.0050,
                "longitude": 73.8100,
                "password": "fpo123"
            },
            {
                "email": "transporter@kisansetu.in",
                "phone_number": "+919876543213",
                "full_name": "Kisan Express Fleet Logistics",
                "role": "TRANSPORTATION",
                "kyc_verified": True,
                "cibil_score": 740,
                "district": "Pune",
                "state": "Maharashtra",
                "latitude": 18.5204,
                "longitude": 73.8567,
                "password": "trans123"
            },
            {
                "email": "warehouse@kisansetu.in",
                "phone_number": "+919876543214",
                "full_name": "Sahyadri Agri Storage Niphad",
                "role": "WAREHOUSE",
                "kyc_verified": True,
                "cibil_score": 800,
                "district": "Nashik",
                "state": "Maharashtra",
                "latitude": 20.0150,
                "longitude": 73.8200,
                "password": "warehouse123"
            },
            {
                "email": "admin@kisansetu.in",
                "phone_number": "+919876543215",
                "full_name": "Krishi Niti Governance Admin",
                "role": "ADMIN",
                "kyc_verified": True,
                "cibil_score": 850,
                "district": "New Delhi",
                "state": "Delhi",
                "latitude": 28.6139,
                "longitude": 77.2090,
                "password": "admin123"
            }
        ]

        # Upsert Demo Users to Guarantee Correct Passwords and Canonical Roles
        created_users = {}
        for u_data in demo_users_data:
            existing = session.exec(select(User).where(User.email == u_data["email"])).first()
            hashed_pw = get_password_hash(u_data["password"])
            if not existing:
                user = User(
                    email=u_data["email"],
                    phone_number=u_data["phone_number"],
                    full_name=u_data["full_name"],
                    role=u_data["role"],
                    kyc_verified=u_data["kyc_verified"],
                    cibil_score=u_data["cibil_score"],
                    district=u_data["district"],
                    state=u_data["state"],
                    latitude=u_data["latitude"],
                    longitude=u_data["longitude"],
                    hashed_password=hashed_pw
                )
                session.add(user)
                session.commit()
                session.refresh(user)
                created_users[u_data["role"]] = user
            else:
                existing.role = u_data["role"]
                existing.hashed_password = hashed_pw
                existing.full_name = u_data["full_name"]
                existing.kyc_verified = True
                session.add(existing)
                session.commit()
                session.refresh(existing)
                created_users[u_data["role"]] = existing

        farmer = created_users.get("FARMER") or session.exec(select(User).where(User.email == "farmer@kisansetu.in")).first()
        buyer = created_users.get("BUYER") or session.exec(select(User).where(User.email == "buyer@kisansetu.in")).first()
        fpo = created_users.get("ORGANIZATION") or session.exec(select(User).where(User.email == "fpo@kisansetu.in")).first()
        transporter = created_users.get("TRANSPORTATION") or session.exec(select(User).where(User.email == "transporter@kisansetu.in")).first()
        warehouse = created_users.get("WAREHOUSE") or session.exec(select(User).where(User.email == "warehouse@kisansetu.in")).first()
        admin = created_users.get("ADMIN") or session.exec(select(User).where(User.email == "admin@kisansetu.in")).first()

        # Seed Demo Buyer Profile if missing
        if buyer:
            existing_buyer_profile = session.exec(select(BuyerProfile).where(BuyerProfile.user_id == buyer.id)).first()
            if not existing_buyer_profile:
                buyer_profile = BuyerProfile(
                    user_id=buyer.id,
                    business_name="AgroProcure Private Ltd",
                    buyer_type=BuyerType.PROCESSOR,
                    gstin="27AABCA1234F1Z5",
                    apmc_license_no="APMC-MH-NSK-2024-892",
                    contact_person="Vikram Singhania",
                    contact_phone="+919820198201",
                    is_verified=True,
                    kyc_document_url="/documents/gst_cert_agroprocure.pdf",
                    delivery_address="Plot 42, Vashi Industrial Area, Navi Mumbai, Maharashtra 400703",
                    delivery_latitude=19.0760,
                    delivery_longitude=72.8777,
                    preferred_apmc_mandi="Vashi APMC Mandi"
                )
                session.add(buyer_profile)
                session.commit()

        # Seed Demo Transporter Profile if missing
        if transporter:
            existing_trans_profile = session.exec(select(TransporterProfile).where(TransporterProfile.user_id == transporter.id)).first()
            if not existing_trans_profile:
                transporter_profile = TransporterProfile(
                    user_id=transporter.id,
                    carrier_name="Kisan Express Fleet Logistics",
                    gstin="27AABCK9981F1Z2",
                    contact_phone="+91 99887 76655",
                    total_trucks=6,
                    vehicle_types="Medium Truck (3-7 MT), Reefer / Cold-Chain Truck",
                    total_drivers=5,
                    base_rate=1.50,
                    rate_unit="INR_PER_KG",
                    min_freight_charge=2500.0,
                    reefer_surcharge_enabled=True,
                    reefer_surcharge_type="PERCENTAGE",
                    reefer_surcharge_value=20.0,
                    preferred_target_trips=18,
                    target_frequency="PER_WEEK",
                    operating_corridors="Nashik → Mumbai (Vashi APMC), Pune → Vashi APMC Terminal, Lasalgaon Onion → Pune Gultekdi",
                    rating=4.9,
                    total_trips_completed=142,
                    available_escrow_balance_inr=42800.0,
                    is_onboarded=True
                )
                session.add(transporter_profile)
                session.commit()

        # Seed Mandi Prices if table is empty
        existing_price = session.exec(select(MandiPrice)).first()
        if not existing_price:
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

        # Seed GeoCluster if missing
        existing_cluster = session.exec(select(GeoCluster)).first()
        if not existing_cluster:
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
            session.refresh(cluster)
        else:
            cluster = existing_cluster

        # Seed Crop Lots if missing
        existing_lot = session.exec(select(CropLot)).first()
        if not existing_lot and farmer:
            lots = [
                CropLot(
                    farmer_id=farmer.id,
                    farmer_phone="+919876543210",
                    farmer_name="Ramesh Patil",
                    commodity="Wheat",
                    commodity_category="Cereals",
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
                    cluster_id=cluster.id if cluster else None
                ),
                CropLot(
                    farmer_id=farmer.id,
                    farmer_phone="+919876543210",
                    farmer_name="Anil Deshmukh",
                    commodity="Onion",
                    commodity_category="Vegetables",
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
                    cluster_id=cluster.id if cluster else None
                ),
                CropLot(
                    farmer_id=farmer.id,
                    farmer_phone="+919876543210",
                    farmer_name="Sanjay Shinde",
                    commodity="Tomato",
                    commodity_category="Vegetables",
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
                    cluster_id=cluster.id if cluster else None
                ),
                CropLot(
                    farmer_id=farmer.id,
                    farmer_phone="+919876543210",
                    farmer_name="Vishnu Kadam",
                    commodity="Soybean",
                    commodity_category="Oilseeds",
                    variety="JS-335 Yellow",
                    quantity_kg=12000,
                    base_price_per_kg=46.50,
                    quality_grade=QualityGrade.GRADE_A,
                    quality_score=95.0,
                    defect_percentage=1.2,
                    ripeness_index=96.0,
                    is_ai_verified=True,
                    latitude=20.0150,
                    longitude=73.7990,
                    district="Nashik",
                    state="Maharashtra",
                    destination_mandi="Latur APMC",
                    harvest_date="2026-08-24",
                    status=LotStatus.POOLED,
                    cluster_id=cluster.id if cluster else None
                )
            ]
            session.add_all(lots)
            session.commit()

        # Seed Bids & Escrow if missing
        existing_bid = session.exec(select(Bid)).first()
        if not existing_bid and buyer and farmer:
            first_lot = session.exec(select(CropLot)).first()
            if first_lot:
                demo_bid = Bid(
                    lot_id=first_lot.id,
                    buyer_id=buyer.id,
                    buyer_name="AgroProcure Private Ltd",
                    amount_per_kg=25.50,
                    bid_price_per_kg=25.50,
                    total_crop_value=127500.0,
                    estimated_freight=4200.0,
                    apmc_cess_fee=1912.5,
                    total_escrow_amount=133612.5,
                    total_amount=133612.5,
                    status=BidStatus.ACCEPTED,
                    delivery_deadline_days=3,
                    payment_method="VIRTUAL_ESCROW",
                    note="Bulk Procurement for Nashik Processing Unit"
                )
                session.add(demo_bid)
                session.commit()

                demo_escrow = EscrowVault(
                    bid_id=demo_bid.id,
                    lot_id=first_lot.id,
                    buyer_id=buyer.id,
                    farmer_id=farmer.id,
                    transporter_id=transporter.id if transporter else 4,
                    crop_total_amount=127500.0,
                    total_freight_cost=4200.0,
                    total_locked_amount=133612.5,
                    advance_freight_amount=1260.0,
                    balance_freight_amount=2940.0,
                    farmer_payout_amount=127500.0,
                    platform_fee_inr=1912.5,
                    current_milestone="LOCKED",
                    status=EscrowStatus.FUNDS_LOCKED,
                    farm_gate_otp="4821",
                    destination_delivery_otp="7394",
                    carrier_name="Kisan Express Logistics",
                    vehicle_number="MH-15-EG-8942"
                )
                session.add(demo_escrow)
                session.commit()

                demo_invoice = Invoice(
                    transaction_id=demo_escrow.id,
                    invoice_number="INV-2026-FPO-1001",
                    buyer_id=buyer.id,
                    seller_id=farmer.id,
                    transporter_id=transporter.id if transporter else 4,
                    crop_amount=127500.0,
                    freight_amount=4200.0,
                    platform_commission=1912.5,
                    tax_amount_gst=344.25,
                    total_payable=133956.75,
                    payment_status="PAID"
                )
                session.add(demo_invoice)
                session.commit()


