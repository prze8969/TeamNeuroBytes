from typing import List, Dict, Any
from sqlmodel import Session, select
from app.models.database import CropLot, GeoCluster, LotStatus
from app.utils.geo_utils import haversine_distance, calculate_cluster_centroid, compute_shared_freight_split

class GeoPoolingWorker:
    CLUSTER_RADIUS_KM = 10.0
    MIN_LOTS_FOR_CLUSTER = 2

    @classmethod
    def run_pooling_pass(cls, session: Session) -> Dict[str, Any]:
        """
        Scans all active unpooled lots (status == LISTED),
        clusters lots within 10 km radius sharing same destination mandi,
        calculates proportional freight split, and updates database records.
        """
        # Fetch unassigned lots
        query = select(CropLot).where(
            (CropLot.status == LotStatus.LISTED) | (CropLot.cluster_id == None)
        )
        unpooled_lots = session.exec(query).all()

        if len(unpooled_lots) < cls.MIN_LOTS_FOR_CLUSTER:
            return {
                "message": "Not enough unpooled lots to form new clusters",
                "unpooled_count": len(unpooled_lots),
                "new_clusters_created": 0
            }

        # Group by destination APMC mandi
        mandi_groups: Dict[str, List[CropLot]] = {}
        for lot in unpooled_lots:
            dest = lot.destination_mandi or "Nashik APMC"
            mandi_groups.setdefault(dest, []).append(lot)

        clusters_created = 0
        total_pooled_lots = 0

        for mandi_name, lots in mandi_groups.items():
            if len(lots) < cls.MIN_LOTS_FOR_CLUSTER:
                continue

            # Greedy spatial clustering within 10 km radius
            unvisited = list(lots)
            while unvisited:
                seed = unvisited.pop(0)
                current_cluster_lots = [seed]

                # Find all neighbors within 10 km of seed
                remaining = []
                for other in unvisited:
                    dist = haversine_distance(
                        seed.latitude, seed.longitude,
                        other.latitude, other.longitude
                    )
                    if dist <= cls.CLUSTER_RADIUS_KM:
                        current_cluster_lots.append(other)
                    else:
                        remaining.append(other)
                unvisited = remaining

                # If cluster has enough volume, create GeoCluster
                if len(current_cluster_lots) >= cls.MIN_LOTS_FOR_CLUSTER:
                    coords = [(lot.latitude, lot.longitude) for lot in current_cluster_lots]
                    centroid_lat, centroid_lon = calculate_cluster_centroid(coords)
                    total_weight = sum(lot.quantity_kg for lot in current_cluster_lots)

                    # Create GeoCluster DB record
                    cluster_obj = GeoCluster(
                        cluster_name=f"{seed.district} {mandi_name.split()[0]} Collective",
                        destination_mandi=mandi_name,
                        centroid_latitude=centroid_lat,
                        centroid_longitude=centroid_lon,
                        radius_km=cls.CLUSTER_RADIUS_KM,
                        total_weight_kg=total_weight,
                        lots_count=len(current_cluster_lots),
                        participating_farmers_count=len(set(l.farmer_id for l in current_cluster_lots)),
                        estimated_freight_cost=round(total_weight * 0.95, 2), # ₹0.95/kg bulk freight
                        estimated_freight_savings_percent=29.5,
                        status="OPEN"
                    )
                    session.add(cluster_obj)
                    session.commit()
                    session.refresh(cluster_obj)

                    # Update Lots to POOLED status with cluster_id
                    for lot in current_cluster_lots:
                        lot.cluster_id = cluster_obj.id
                        lot.status = LotStatus.POOLED
                        session.add(lot)
                    
                    session.commit()
                    clusters_created += 1
                    total_pooled_lots += len(current_cluster_lots)

        return {
            "status": "SUCCESS",
            "new_clusters_created": clusters_created,
            "lots_pooled_count": total_pooled_lots
        }

geo_pooling_worker = GeoPoolingWorker()
