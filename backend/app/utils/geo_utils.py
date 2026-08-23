import math
import json
import urllib.request
from typing import Tuple, List, Dict, Any, Optional
from app.core.config import settings

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees). Returns distance in km.
    """
    # Convert decimal degrees to radians
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    # Haversine formula
    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    earth_radius_km = 6371.0
    return round(earth_radius_km * c, 2)

def calculate_road_distance(
    origin: Tuple[float, float],
    destination: Tuple[float, float]
) -> Dict[str, Any]:
    """
    Calculates estimated road driving distance and duration using OpenRouteService API,
    with an automated fallback to Haversine distance * road tortuosity factor (1.28).
    """
    lat1, lon1 = origin
    lat2, lon2 = destination

    if settings.OPENROUTESERVICE_API_KEY:
        try:
            url = f"https://api.openrouteservice.org/v2/directions/driving-car?api_key={settings.OPENROUTESERVICE_API_KEY}&start={lon1},{lat1}&end={lon2},{lat2}"
            req = urllib.request.Request(url, headers={"User-Agent": "KisanSetu/2.0"})
            with urllib.request.urlopen(req, timeout=3) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode())
                    features = data.get("features", [])
                    if features:
                        summary = features[0]["properties"]["segments"][0]
                        dist_km = round(summary["distance"] / 1000.0, 2)
                        duration_hrs = round(summary["duration"] / 3600.0, 2)
                        return {
                            "distance_km": dist_km,
                            "duration_hours": duration_hrs,
                            "routing_engine": "OpenRouteService",
                            "is_live_routing": True
                        }
        except Exception:
            pass

    # Fallback with realistic highway factor (1.28x great-circle distance)
    crow_dist = haversine_distance(lat1, lon1, lat2, lon2)
    road_dist = round(crow_dist * 1.28, 2)
    avg_speed_kmh = 45.0 # Average commercial truck speed in rural India
    duration_hrs = round(road_dist / avg_speed_kmh, 2)
    
    return {
        "distance_km": road_dist,
        "duration_hours": duration_hrs,
        "routing_engine": "HaversineTortuosityFallback",
        "is_live_routing": False
    }

def calculate_cluster_centroid(coordinates: List[Tuple[float, float]]) -> Tuple[float, float]:
    """
    Computes the geometric centroid (mean latitude and longitude) for a cluster.
    """
    if not coordinates:
        return (0.0, 0.0)
    avg_lat = sum(coord[0] for coord in coordinates) / len(coordinates)
    avg_lon = sum(coord[1] for coord in coordinates) / len(coordinates)
    return (round(avg_lat, 6), round(avg_lon, 6))

def compute_shared_freight_split(
    total_freight_cost: float,
    farmer_weights_kg: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Splits consolidated freight transport cost proportionally based on individual produce weight.
    """
    total_weight = sum(item["weight_kg"] for item in farmer_weights_kg)
    if total_weight <= 0:
        return []

    results = []
    for item in farmer_weights_kg:
        share_ratio = item["weight_kg"] / total_weight
        assigned_cost = round(total_freight_cost * share_ratio, 2)
        # Individual standalone trip cost estimation (without pooling)
        standalone_est = round(assigned_cost * 1.38, 2) # ~28-35% savings via pooling
        savings = round(standalone_est - assigned_cost, 2)

        results.append({
            "farmer_id": item.get("farmer_id"),
            "farmer_name": item.get("farmer_name", "Farmer"),
            "lot_id": item.get("lot_id"),
            "weight_kg": item["weight_kg"],
            "share_percentage": round(share_ratio * 100, 2),
            "pooled_cost_inr": assigned_cost,
            "standalone_cost_inr": standalone_est,
            "net_savings_inr": savings,
            "savings_percentage": round((savings / standalone_est) * 100, 1)
        })
    return results
