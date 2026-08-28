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
        User, CropLot, GeoCluster, MandiPrice, Bid, EscrowVault, EscrowTransaction, Invoice, Grievance, BuyerProfile, TransporterProfile, ImageAssessment, CropInventory
    )
    SQLModel.metadata.create_all(engine)
    seed_initial_demo_data()


def get_session():
    with Session(engine) as session:
        yield session

def seed_initial_demo_data():
    """Seeds rich Agmarknet prices, verified crop lots, and user accounts for SIH demo."""
    from app.models.database import User, CropLot, MandiPrice, GeoCluster, QualityGrade, LotStatus, BuyerProfile, BuyerType, TransporterProfile
    
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
            
            # Seed Demo Buyer Profile
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

            # Seed Demo Transporter Profile
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
                    cluster_id=cluster.id
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
                    cluster_id=cluster.id
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
                    cluster_id=cluster.id
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
                    cluster_id=cluster.id
                ),
                CropLot(
                    farmer_id=farmer.id,
                    farmer_phone="+919876543210",
                    farmer_name="Balasaheb Pawar",
                    commodity="Grapes",
                    commodity_category="Fruits",
                    variety="Export Thompson Seedless",
                    quantity_kg=9500,
                    base_price_per_kg=62.00,
                    quality_grade=QualityGrade.GRADE_A,
                    quality_score=97.8,
                    defect_percentage=0.9,
                    ripeness_index=98.0,
                    is_ai_verified=True,
                    latitude=20.0310,
                    longitude=73.8120,
                    district="Nashik",
                    state="Maharashtra",
                    destination_mandi="Mumbai Port Terminal APMC",
                    harvest_date="2026-08-25",
                    status=LotStatus.BID_ACCEPTED,
                    cluster_id=cluster.id
                )
            ]
            session.add_all(lots)
            session.commit()

            # Seed Demo Bids & Escrow Rails for Lot #1 and Lot #5
            from app.models.database import Bid, BidStatus, EscrowVault, EscrowStatus, Invoice
            demo_bid = Bid(
                lot_id=lots[0].id,
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
                lot_id=lots[0].id,
                buyer_id=buyer.id,
                farmer_id=farmer.id,
                transporter_id=transporter.id,
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
                transporter_id=transporter.id,
                crop_amount=127500.0,
                freight_amount=4200.0,
                platform_commission=1912.5,
                tax_amount_gst=344.25,
                total_payable=133956.75,
                payment_status="PAID"
            )
            session.add(demo_invoice)
            session.commit()

        # Ensure TransporterProfile exists for existing databases
        existing_profile = session.exec(select(TransporterProfile)).first()
        if not existing_profile:
            trans_user = session.exec(select(User).where(User.role == "TRANSPORTATION")).first()
            user_id = trans_user.id if trans_user else 4
            default_profile = TransporterProfile(
                user_id=user_id,
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
            session.add(default_profile)
            session.commit()

