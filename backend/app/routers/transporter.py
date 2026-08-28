from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from sqlmodel import Session, select
from app.db.engine import get_session
from app.models.database import TransporterProfile, User

router = APIRouter()

class SaveTransporterProfileRequest(BaseModel):
    user_id: Optional[int] = None
    user_email: Optional[str] = None
    carrier_name: str = Field(..., example="Kisan Express Fleet Logistics")
    gstin: str = Field(..., example="27AABCK9981F1Z2")
    contact_phone: Optional[str] = Field(default="+91 99887 76655")
    total_trucks: int = Field(default=4, example=4)
    vehicle_types: Union[List[str], str] = Field(default=["Medium Truck (3-7 MT)", "Reefer / Cold-Chain Truck"])
    total_drivers: int = Field(default=3, example=3)
    base_rate: float = Field(default=1.50, example=1.50)
    rate_unit: str = Field(default="INR_PER_KG", example="INR_PER_KG")
    min_freight_charge: float = Field(default=2000.0, example=2000.0)
    reefer_surcharge_enabled: bool = Field(default=True)
    reefer_surcharge_type: str = Field(default="PERCENTAGE")
    reefer_surcharge_value: float = Field(default=20.0)
    preferred_target_trips: int = Field(default=12)
    target_frequency: str = Field(default="PER_WEEK")
    operating_corridors: Union[List[str], str] = Field(default=["Nashik → Mumbai (Vashi APMC)"])
    rating: Optional[float] = 4.9
    total_trips_completed: Optional[int] = 0
    available_escrow_balance_inr: Optional[float] = 0.0

class AcceptLoadRequest(BaseModel):
    tender_id: str
    driver_name: str = Field(..., example="Suresh Rathod")
    driver_phone: str = Field(..., example="+91 98231 49821")
    vehicle_number: str = Field(..., example="MH-15-EG-4421")
    vehicle_type: str = Field(default="16-Wheeler Hauler", example="16-Wheeler Hauler")

class VerifyOtpRequest(BaseModel):
    otp: str = Field(..., example="4821")

class UpdateGpsRequest(BaseModel):
    lat: float
    lng: float
    speed_kmh: float = 55.0
    heading: float = 210.0
    temperature_c: float = 14.2
    humidity_rh: float = 68.0
    waypoint_name: Optional[str] = "Ghoti Toll Plaza, NH-160"

# In-memory fleet trip state for demo continuity
FLEET_STATE = {
    "carrier_name": "Kisan Express Logistics",
    "gstin": "27AABCK9981F1Z2",
    "rating": 4.9,
    "total_trips_completed": 142,
    "available_escrow_balance_inr": 42800.0,
    "active_vehicles_on_road": 3,
    "trips": [
        {
            "id": 1,
            "vault_id": 1,
            "lot_id": "LOT-1",
            "crop_name": "Sharbati Wheat",
            "variety": "Lok-1 Clean Grain",
            "farmer_name": "Ramesh Patil",
            "farmer_phone": "+91 98231 49821",
            "origin": "Nashik Cluster Farmgate, Maharashtra",
            "destination": "Vashi APMC Mandi Scale #4 (Navi Mumbai)",
            "quantity_tons": 5.0,
            "quantity_kg": 5000,
            "total_freight_inr": 6000.0,
            "advance_freight_inr": 1800.0,
            "advance_claimed": True,
            "advance_utr": "UTR-ICICI-ADV-894210",
            "balance_freight_inr": 4200.0,
            "driver_name": "Suresh Rathod",
            "driver_phone": "+91 98231 49821",
            "vehicle_number": "MH-15-EG-4421",
            "eway_bill_number": "EWB-2026-98412",
            "farm_gate_otp": "4821",
            "current_milestone": "IN_TRANSIT",
            "status": "IN_TRANSIT",
            "current_lat": 19.4285,
            "current_lng": 73.2941,
            "temperature_c": 14.2,
            "humidity_rh": 68.0,
            "created_at": "2026-08-24T09:30:00Z"
        }
    ],
    "open_tenders": [
        {
            "id": "TEND-2026-091",
            "lot_id": "LOT-2",
            "crop_name": "Nashik Red Onion",
            "variety": "Garva Premium",
            "farmer_name": "Sanjay Deshmukh",
            "origin": "Lasalgaon APMC Cluster, Nashik",
            "destination": "Pune Gultekdi Mandi",
            "quantity_tons": 8.0,
            "freight_rate_kg": 1.20,
            "total_freight_inr": 9600.0,
            "advance_30_pct_inr": 2880.0,
            "pickup_window": "Today, within 4 hours",
            "required_vehicle": "10-Wheeler Open / Tarpaulin"
        },
        {
            "id": "TEND-2026-092",
            "lot_id": "LOT-3",
            "crop_name": "Hybrid Tomato",
            "variety": "Abhinav Class-1",
            "farmer_name": "Kailash Jadhav",
            "origin": "Narayangaon Hub, Pune",
            "destination": "Vashi APMC Mandi, Navi Mumbai",
            "quantity_tons": 4.0,
            "freight_rate_kg": 1.60,
            "total_freight_inr": 6400.0,
            "advance_30_pct_inr": 1920.0,
            "pickup_window": "Tomorrow morning, 06:00 AM",
            "required_vehicle": "Reefer Cold-Chain (14°C)"
        }
    ]
}

@router.post("/profile", tags=["Transporter Portal"])
def save_transporter_profile(
    req: SaveTransporterProfileRequest,
    session: Session = Depends(get_session)
):
    """
    Saves or updates a Transporter Fleet Profile directly in Supabase / PostgreSQL DB.
    """
    # 1. Resolve user
    user = None
    if req.user_email:
        clean_email = req.user_email.strip().lower()
        user = session.exec(select(User).where(User.email.ilike(clean_email))).first()
    elif req.user_id:
        user = session.get(User, req.user_id)
    
    if not user:
        # If user registered with this email, create user record if missing
        if req.user_email:
            user = User(
                email=req.user_email.strip().lower(),
                full_name=req.carrier_name,
                role="TRANSPORTATION",
                phone_number=req.contact_phone,
                hashed_password="transporter_hashed"
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        else:
            user = session.exec(select(User).where(User.role == "TRANSPORTATION")).first()

    user_id = user.id if user else 4

    # 2. Serialize vehicle types & corridors
    vehicle_types_str = req.vehicle_types if isinstance(req.vehicle_types, str) else ", ".join(req.vehicle_types)
    corridors_str = req.operating_corridors if isinstance(req.operating_corridors, str) else ", ".join(req.operating_corridors)

    # 3. Check existing profile for this specific user
    profile = session.exec(select(TransporterProfile).where(TransporterProfile.user_id == user_id)).first()
    if profile:
        profile.carrier_name = req.carrier_name
        profile.gstin = req.gstin
        profile.contact_phone = req.contact_phone
        profile.total_trucks = req.total_trucks
        profile.vehicle_types = vehicle_types_str
        profile.total_drivers = req.total_drivers
        profile.base_rate = req.base_rate
        profile.rate_unit = req.rate_unit
        profile.min_freight_charge = req.min_freight_charge
        profile.reefer_surcharge_enabled = req.reefer_surcharge_enabled
        profile.reefer_surcharge_type = req.reefer_surcharge_type
        profile.reefer_surcharge_value = req.reefer_surcharge_value
        profile.preferred_target_trips = req.preferred_target_trips
        profile.target_frequency = req.target_frequency
        profile.operating_corridors = corridors_str
        profile.is_onboarded = True
    else:
        profile = TransporterProfile(
            user_id=user_id,
            carrier_name=req.carrier_name,
            gstin=req.gstin,
            contact_phone=req.contact_phone,
            total_trucks=req.total_trucks,
            vehicle_types=vehicle_types_str,
            total_drivers=req.total_drivers,
            base_rate=req.base_rate,
            rate_unit=req.rate_unit,
            min_freight_charge=req.min_freight_charge,
            reefer_surcharge_enabled=req.reefer_surcharge_enabled,
            reefer_surcharge_type=req.reefer_surcharge_type,
            reefer_surcharge_value=req.reefer_surcharge_value,
            preferred_target_trips=req.preferred_target_trips,
            target_frequency=req.target_frequency,
            operating_corridors=corridors_str,
            rating=req.rating or 4.9,
            total_trips_completed=req.total_trips_completed or 0,
            available_escrow_balance_inr=req.available_escrow_balance_inr or 0.0,
            is_onboarded=True
        )
        session.add(profile)

    session.commit()
    session.refresh(profile)

    # Sync in-memory FLEET_STATE for fast mock read access
    FLEET_STATE["carrier_name"] = profile.carrier_name
    FLEET_STATE["gstin"] = profile.gstin
    FLEET_STATE["rating"] = profile.rating
    FLEET_STATE["total_trips_completed"] = profile.total_trips_completed

    return {
        "status": "SUCCESS",
        "message": f"Transporter profile for '{profile.carrier_name}' saved to Supabase/PostgreSQL database successfully.",
        "profile": {
            "id": profile.id,
            "user_id": profile.user_id,
            "carrier_name": profile.carrier_name,
            "gstin": profile.gstin,
            "contact_phone": profile.contact_phone,
            "total_trucks": profile.total_trucks,
            "vehicle_types": [v.strip() for v in profile.vehicle_types.split(",") if v.strip()],
            "total_drivers": profile.total_drivers,
            "base_rate": profile.base_rate,
            "rate_unit": profile.rate_unit,
            "min_freight_charge": profile.min_freight_charge,
            "reefer_surcharge_enabled": profile.reefer_surcharge_enabled,
            "reefer_surcharge_type": profile.reefer_surcharge_type,
            "reefer_surcharge_value": profile.reefer_surcharge_value,
            "preferred_target_trips": profile.preferred_target_trips,
            "target_frequency": profile.target_frequency,
            "operating_corridors": [c.strip() for c in profile.operating_corridors.split(",") if c.strip()],
            "rating": profile.rating,
            "total_trips_completed": profile.total_trips_completed,
            "available_escrow_balance_inr": profile.available_escrow_balance_inr,
            "is_onboarded": profile.is_onboarded,
            "created_at": profile.created_at
        }
    }

@router.get("/profile/me", tags=["Transporter Portal"])
def get_my_transporter_profile(
    user_id: Optional[int] = None,
    email: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """
    Fetches the authenticated transporter's fleet profile from the database.
    Ensures new users only receive their own profile and are prompted with onboarding if not yet set up.
    """
    profile = None
    
    if user_id:
        profile = session.exec(select(TransporterProfile).where(TransporterProfile.user_id == user_id)).first()
    elif email:
        clean_email = email.strip().lower()
        user = session.exec(select(User).where(User.email.ilike(clean_email))).first()
        if user:
            profile = session.exec(select(TransporterProfile).where(TransporterProfile.user_id == user.id)).first()

    if not profile:
        matched_user = None
        if email:
            clean_email = email.strip().lower()
            matched_user = session.exec(select(User).where(User.email.ilike(clean_email))).first()
        elif user_id:
            matched_user = session.get(User, user_id)

        user_name = matched_user.full_name if matched_user else None
        user_phone = matched_user.phone_number if matched_user else None

        return {
            "status": "NOT_FOUND",
            "is_onboarded": False,
            "user_name": user_name,
            "user_phone": user_phone,
            "profile": None
        }

    return {
        "status": "SUCCESS",
        "is_onboarded": profile.is_onboarded,
        "profile": {
            "id": profile.id,
            "user_id": profile.user_id,
            "carrier_name": profile.carrier_name,
            "gstin": profile.gstin,
            "contact_phone": profile.contact_phone,
            "total_trucks": profile.total_trucks,
            "vehicle_types": [v.strip() for v in profile.vehicle_types.split(",") if v.strip()],
            "total_drivers": profile.total_drivers,
            "base_rate": profile.base_rate,
            "rate_unit": profile.rate_unit,
            "min_freight_charge": profile.min_freight_charge,
            "reefer_surcharge_enabled": profile.reefer_surcharge_enabled,
            "reefer_surcharge_type": profile.reefer_surcharge_type,
            "reefer_surcharge_value": profile.reefer_surcharge_value,
            "preferred_target_trips": profile.preferred_target_trips,
            "target_frequency": profile.target_frequency,
            "operating_corridors": [c.strip() for c in profile.operating_corridors.split(",") if c.strip()],
            "rating": profile.rating,
            "total_trips_completed": profile.total_trips_completed,
            "available_escrow_balance_inr": profile.available_escrow_balance_inr,
            "is_onboarded": profile.is_onboarded,
            "created_at": profile.created_at
        }
    }

@router.get("/trips", tags=["Transporter Portal"])
def get_transporter_trips(session: Session = Depends(get_session)):
    """Returns load board tenders, active hauls, and carrier financial summary."""
    # Attempt to sync carrier name from database
    profile = session.exec(select(TransporterProfile)).first()
    carrier_name = profile.carrier_name if profile else FLEET_STATE["carrier_name"]
    gstin = profile.gstin if profile else FLEET_STATE["gstin"]
    rating = profile.rating if profile else FLEET_STATE["rating"]
    total_trips = profile.total_trips_completed if profile else FLEET_STATE["total_trips_completed"]

    return {
        "status": "SUCCESS",
        "carrier_profile": {
            "carrier_name": carrier_name,
            "gstin": gstin,
            "rating": rating,
            "total_trips_completed": total_trips,
            "available_escrow_balance_inr": FLEET_STATE["available_escrow_balance_inr"],
            "active_vehicles_on_road": FLEET_STATE["active_vehicles_on_road"]
        },
        "active_trips": FLEET_STATE["trips"],
        "open_tenders": FLEET_STATE["open_tenders"]
    }

@router.post("/accept-load", tags=["Transporter Portal"])
def accept_freight_load(req: AcceptLoadRequest):
    """Accept an open load board dispatch and assign driver & truck details."""
    tender = next((t for t in FLEET_STATE["open_tenders"] if t["id"] == req.tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail=f"Tender {req.tender_id} not found or already assigned.")
    
    # Move tender to active trips
    new_trip = {
        "id": len(FLEET_STATE["trips"]) + 1,
        "vault_id": len(FLEET_STATE["trips"]) + 1,
        "lot_id": tender["lot_id"],
        "crop_name": tender["crop_name"],
        "variety": tender["variety"],
        "farmer_name": tender["farmer_name"],
        "farmer_phone": "+91 98231 77112",
        "origin": tender["origin"],
        "destination": tender["destination"],
        "quantity_tons": tender["quantity_tons"],
        "quantity_kg": int(tender["quantity_tons"] * 1000),
        "total_freight_inr": tender["total_freight_inr"],
        "advance_freight_inr": tender["advance_30_pct_inr"],
        "advance_claimed": False,
        "advance_utr": None,
        "balance_freight_inr": tender["total_freight_inr"] - tender["advance_30_pct_inr"],
        "driver_name": req.driver_name,
        "driver_phone": req.driver_phone,
        "vehicle_number": req.vehicle_number,
        "eway_bill_number": f"EWB-2026-{datetime.now().strftime('%m%d%H%M')}",
        "farm_gate_otp": "7192",
        "current_milestone": "LOCKED",
        "status": "ASSIGNED",
        "current_lat": 19.9975,
        "current_lng": 73.7898,
        "temperature_c": 14.2,
        "humidity_rh": 68.0,
        "created_at": datetime.utcnow().isoformat()
    }
    
    FLEET_STATE["trips"].insert(0, new_trip)
    FLEET_STATE["open_tenders"] = [t for t in FLEET_STATE["open_tenders"] if t["id"] != req.tender_id]
    
    return {
        "status": "ACCEPTED",
        "message": f"Trip assigned to {req.driver_name} ({req.vehicle_number}) for {tender['crop_name']}.",
        "trip": new_trip
    }

@router.post("/{vault_id}/claim-advance", tags=["Transporter Portal"])
def claim_fuel_advance(vault_id: int):
    """Claim 30% advance fuel disbursement from the Escrow Vault."""
    trip = next((t for t in FLEET_STATE["trips"] if t["vault_id"] == vault_id), None)
    if not trip:
        # Fallback to trip 0
        trip = FLEET_STATE["trips"][0] if FLEET_STATE["trips"] else None
    
    utr_num = f"UTR-ICICI-ADV-{datetime.now().strftime('%y%m%d%H%M')}"
    if trip:
        trip["advance_claimed"] = True
        trip["advance_utr"] = utr_num
        trip["current_milestone"] = "FREIGHT_ADVANCE_PAID"
        trip["status"] = "ADVANCE_PAID"
    
    return {
        "status": "DISBURSED",
        "utr_number": utr_num,
        "amount_inr": trip["advance_freight_inr"] if trip else 1800.0,
        "beneficiary": f"{FLEET_STATE['carrier_name']} (Fuel Card Credit / DBT)",
        "message": f"₹{trip['advance_freight_inr'] if trip else 1800.0} credited instantly for diesel & tolls under UTR {utr_num}."
    }

@router.post("/{vault_id}/verify-otp", tags=["Transporter Portal"])
def verify_farmgate_pickup_otp(vault_id: int, req: VerifyOtpRequest):
    """Verify the 4-digit farm-gate OTP given by the farmer to start the trip."""
    trip = next((t for t in FLEET_STATE["trips"] if t["vault_id"] == vault_id), None)
    if not trip:
        trip = FLEET_STATE["trips"][0] if FLEET_STATE["trips"] else None
    
    expected_otp = trip["farm_gate_otp"] if trip else "4821"
    if req.otp != expected_otp:
        raise HTTPException(status_code=400, detail=f"Invalid OTP '{req.otp}'. Please enter the 4-digit code shown on farmer's screen.")
    
    if trip:
        trip["current_milestone"] = "IN_TRANSIT"
        trip["status"] = "IN_TRANSIT"
    
    return {
        "status": "VERIFIED",
        "message": f"Farm-gate OTP {req.otp} verified! Produce safely loaded. Trip status is now IN_TRANSIT with live GPS."
    }

@router.post("/{vault_id}/update-gps", tags=["Transporter Portal"])
def update_live_gps(vault_id: int, req: UpdateGpsRequest):
    """Ingest live driver GPS coordinate telemetry along the transit corridor."""
    trip = next((t for t in FLEET_STATE["trips"] if t["vault_id"] == vault_id), None)
    if trip:
        trip["current_lat"] = req.lat
        trip["current_lng"] = req.lng
        trip["temperature_c"] = req.temperature_c
        trip["humidity_rh"] = req.humidity_rh
    
    return {
        "status": "TELEMETRY_UPDATED",
        "lat": req.lat,
        "lng": req.lng,
        "speed": req.speed_kmh,
        "waypoint": req.waypoint_name
    }

@router.post("/{vault_id}/mark-arrival", tags=["Transporter Portal"])
def mark_mandi_arrival(vault_id: int):
    """Mark vehicle arrived at APMC Mandi terminal."""
    trip = next((t for t in FLEET_STATE["trips"] if t["vault_id"] == vault_id), None)
    if trip:
        trip["status"] = "ARRIVED_AT_MANDI"
    
    return {
        "status": "ARRIVED",
        "message": "Vehicle arrived at APMC Mandi Terminal Scale #4. Buyer notified for weighbridge handover."
    }
