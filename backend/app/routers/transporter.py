from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

router = APIRouter()

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

@router.get("/trips", tags=["Transporter Portal"])
def get_transporter_trips():
    """Returns load board tenders, active hauls, and carrier financial summary."""
    return {
        "status": "SUCCESS",
        "carrier_profile": {
            "carrier_name": FLEET_STATE["carrier_name"],
            "gstin": FLEET_STATE["gstin"],
            "rating": FLEET_STATE["rating"],
            "total_trips_completed": FLEET_STATE["total_trips_completed"],
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
