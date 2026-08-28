from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Any
from sqlmodel import Session

from app.db.engine import get_session
from app.models.database import MandiPrice
from app.repositories.mandi_price import MandiPriceRepository
from app.services.apmc_data import decision_engine

router = APIRouter()

class NetRealisationRequest(BaseModel):
    lot_weight_kg: float
    mandi_modal_price_per_kg: float
    farmer_lat: float = 20.0125
    farmer_lon: float = 73.7910
    mandi_lat: float = 19.0760
    mandi_lon: float = 72.8777
    freight_rate_per_ton_km: float = 4.2
    is_pooled_freight: bool = False

class PostHarvestLossRequest(BaseModel):
    commodity: str
    lot_weight_kg: float
    holding_days: int
    current_rate_per_kg: float

class SellVsWaitRequest(BaseModel):
    commodity: str
    lot_weight_kg: float
    current_mandi_price_kg: float
    forecast_price_7d_kg: float
    planned_hold_days: int = 7

@router.post("/net-realisation")
def calculate_net_realisation(req: NetRealisationRequest):
    """
    Computes exact net farmgate profit realization:
    Net_Profit = (Mandi_Modal_Price * Lot_Weight) - (Freight + Mandi_Fees + Handling_Charges)
    """
    result = decision_engine.calculate_net_realisation(
        lot_weight_kg=req.lot_weight_kg,
        mandi_modal_price_per_kg=req.mandi_modal_price_per_kg,
        farmer_coords=(req.farmer_lat, req.farmer_lon),
        mandi_coords=(req.mandi_lat, req.mandi_lon),
        freight_rate_per_ton_km=req.freight_rate_per_ton_km,
        is_pooled_freight=req.is_pooled_freight
    )
    return result

@router.post("/post-harvest-loss")
def calculate_post_harvest_loss(req: PostHarvestLossRequest):
    """
    Calculates physical produce weight decay and financial value at risk per holding day.
    """
    result = decision_engine.calculate_post_harvest_loss(
        commodity=req.commodity,
        lot_weight_kg=req.lot_weight_kg,
        holding_days=req.holding_days,
        current_rate_per_kg=req.current_rate_per_kg
    )
    return result

@router.post("/sell-vs-wait")
def evaluate_sell_vs_wait(req: SellVsWaitRequest):
    """
    Compares holding & storage costs against forecasted APMC price trajectories
    to output an actionable data-backed recommendation (SELL_IMMEDIATELY, WAIT_AND_HOLD, POOL_IN_FPO).
    """
    result = decision_engine.evaluate_sell_vs_wait(
        commodity=req.commodity,
        lot_weight_kg=req.lot_weight_kg,
        current_mandi_price_kg=req.current_mandi_price_kg,
        forecast_price_7d_kg=req.forecast_price_7d_kg,
        planned_hold_days=req.planned_hold_days
    )
    return result

@router.get("/agmarknet-feed", response_model=List[MandiPrice])
def get_agmarknet_price_feed(
    commodity: Optional[str] = None,
    district: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """Returns official Agmarknet mandi modal benchmarks and AI 7-day forecasts."""
    prices = MandiPriceRepository(session).get_prices(
        commodity=commodity,
        district=district,
    )
    return prices
