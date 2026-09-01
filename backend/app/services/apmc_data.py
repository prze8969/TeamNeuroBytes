import math
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from app.utils.geo_utils import haversine_distance, calculate_road_distance

class APMCDecisionEngine:
    # Commodity Perishability & Decay Profiles (% weight loss / day at ambient farmgate)
    PERISHABILITY_PROFILES = {
        "Tomato": {"weight_loss_per_day": 3.8, "storage_cost_quintal_day": 6.5, "max_holding_days": 6},
        "Onion": {"weight_loss_per_day": 0.65, "storage_cost_quintal_day": 3.0, "max_holding_days": 45},
        "Potato": {"weight_loss_per_day": 0.40, "storage_cost_quintal_day": 2.5, "max_holding_days": 60},
        "Wheat": {"weight_loss_per_day": 0.03, "storage_cost_quintal_day": 1.2, "max_holding_days": 180},
        "Paddy": {"weight_loss_per_day": 0.04, "storage_cost_quintal_day": 1.4, "max_holding_days": 180},
        "Soybean": {"weight_loss_per_day": 0.05, "storage_cost_quintal_day": 1.5, "max_holding_days": 120},
    }

    @classmethod
    def calculate_net_realisation(
        cls,
        lot_weight_kg: float,
        mandi_modal_price_per_kg: float,
        farmer_coords: tuple,
        mandi_coords: tuple,
        freight_rate_per_ton_km: float = 4.2, # Standard commercial mini-truck rate ₹/ton-km
        mandi_cess_percent: float = 1.0,      # APMC user charge 1%
        handling_charge_per_quintal: float = 18.0, # Loading/unloading ₹18/quintal
        is_pooled_freight: bool = False
    ) -> Dict[str, Any]:
        """
        Implements the Net Realisation Formula:
        Net_Profit = (Mandi_Modal_Price * Lot_Weight) - (Freight_Cost + Mandi_Fees + Handling_Charges)
        """
        route = calculate_road_distance(farmer_coords, mandi_coords)
        dist_km = route["distance_km"]

        # Weight conversions
        weight_quintals = lot_weight_kg / 100.0
        weight_tons = lot_weight_kg / 1000.0

        # Gross crop revenue
        gross_revenue = round(lot_weight_kg * mandi_modal_price_per_kg, 2)

        # Standalone freight vs Pooled freight
        base_trip_cost = max(dist_km * freight_rate_per_ton_km * weight_tons, 800.0) # Min trip charge
        if is_pooled_freight:
            freight_cost = round(base_trip_cost * 0.72, 2) # 28% pooled savings
            freight_savings = round(base_trip_cost - freight_cost, 2)
        else:
            freight_cost = round(base_trip_cost, 2)
            freight_savings = 0.0

        # Mandi Fees & Handling charges
        mandi_fees = round((mandi_cess_percent / 100.0) * gross_revenue, 2)
        handling_charges = round(weight_quintals * handling_charge_per_quintal, 2)
        total_deductions = round(freight_cost + mandi_fees + handling_charges, 2)

        net_realisation = round(gross_revenue - total_deductions, 2)
        effective_rate_per_kg = round(net_realisation / lot_weight_kg, 2)

        return {
            "gross_revenue_inr": gross_revenue,
            "distance_km": dist_km,
            "freight_cost_inr": freight_cost,
            "freight_savings_pooled_inr": freight_savings,
            "mandi_fees_inr": mandi_fees,
            "handling_charges_inr": handling_charges,
            "total_deductions_inr": total_deductions,
            "net_realisation_inr": net_realisation,
            "effective_rate_per_kg": effective_rate_per_kg,
            "profit_margin_percent": round((net_realisation / gross_revenue) * 100, 1)
        }

    @classmethod
    def calculate_post_harvest_loss(
        cls,
        commodity: str,
        lot_weight_kg: float,
        holding_days: int,
        current_rate_per_kg: float
    ) -> Dict[str, Any]:
        """
        Calculates physical weight decay and rupee value at risk based on perishability degrade rates.
        """
        profile = cls.PERISHABILITY_PROFILES.get(
            commodity,
            {"weight_loss_per_day": 1.0, "storage_cost_quintal_day": 3.0, "max_holding_days": 14}
        )

        daily_rate = profile["weight_loss_per_day"]
        total_decay_percent = min(round(daily_rate * holding_days, 2), 45.0)
        weight_lost_kg = round((total_decay_percent / 100.0) * lot_weight_kg, 2)
        retained_weight_kg = round(lot_weight_kg - weight_lost_kg, 2)

        value_at_risk_inr = round(weight_lost_kg * current_rate_per_kg, 2)

        return {
            "commodity": commodity,
            "holding_days": holding_days,
            "daily_decay_rate_percent": daily_rate,
            "total_weight_loss_percent": total_decay_percent,
            "weight_lost_kg": weight_lost_kg,
            "retained_weight_kg": retained_weight_kg,
            "value_at_risk_inr": value_at_risk_inr,
            "max_safe_holding_days": profile["max_holding_days"]
        }

    @classmethod
    def evaluate_sell_vs_wait(
        cls,
        commodity: str,
        lot_weight_kg: float,
        current_mandi_price_kg: float,
        forecast_price_7d_kg: float,
        planned_hold_days: int = 7
    ) -> Dict[str, Any]:
        """
        Compares storage holding costs + perishability decay against forecasted price gains
        to provide a data-backed SELL vs. WAIT recommendation.
        """
        profile = cls.PERISHABILITY_PROFILES.get(
            commodity,
            {"weight_loss_per_day": 1.0, "storage_cost_quintal_day": 3.0, "max_holding_days": 14}
        )

        # 1. Immediate Sale Value
        immediate_revenue = round(lot_weight_kg * current_mandi_price_kg, 2)

        # 2. Holding Costs (Cold storage / Warehouse)
        weight_quintals = lot_weight_kg / 100.0
        storage_cost = round(weight_quintals * profile["storage_cost_quintal_day"] * planned_hold_days, 2)

        # 3. Post-Harvest Weight Loss
        loss_metrics = cls.calculate_post_harvest_loss(
            commodity, lot_weight_kg, planned_hold_days, current_mandi_price_kg
        )
        retained_weight = loss_metrics["retained_weight_kg"]

        # 4. Projected Future Revenue
        future_revenue = round(retained_weight * forecast_price_7d_kg, 2)
        net_future_realisation = round(future_revenue - storage_cost, 2)

        net_difference = round(net_future_realisation - immediate_revenue, 2)

        # 5. Recommendation Logic
        if planned_hold_days > profile["max_holding_days"]:
            recommendation = "SELL_IMMEDIATELY"
            reason = f"High perishability risk: {commodity} exceeds max safe storage threshold ({profile['max_holding_days']} days)."
        elif net_difference > 1200.0:
            recommendation = "WAIT_AND_HOLD"
            reason = f"Price forecast indicates a net gain of +₹{net_difference} after covering ₹{storage_cost} storage & ₹{loss_metrics['value_at_risk_inr']} perishability decay."
        elif net_difference < -500.0:
            recommendation = "SELL_IMMEDIATELY"
            reason = f"Holding leads to an estimated net loss of -₹{abs(net_difference)} due to storage fees and weight decay."
        else:
            recommendation = "POOL_IN_FPO"
            reason = "Market fluctuation is marginal. Best strategy is to pool with local FPO to reduce transport costs by ~30%."

        return {
            "commodity": commodity,
            "lot_weight_kg": lot_weight_kg,
            "current_revenue_inr": immediate_revenue,
            "projected_future_revenue_inr": future_revenue,
            "holding_storage_cost_inr": storage_cost,
            "decay_value_lost_inr": loss_metrics["value_at_risk_inr"],
            "net_future_gain_inr": net_difference,
            "recommendation": recommendation,
            "strategy_rationale": reason,
            "forecast_price_7d_kg": forecast_price_7d_kg,
            "current_price_kg": current_mandi_price_kg
        }

decision_engine = APMCDecisionEngine()
