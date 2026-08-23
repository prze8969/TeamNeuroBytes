from app.core.tasks.geo_pooling import geo_pooling_worker
from app.db.engine import get_session

def run_scheduled_clustering_job():
    """Triggered periodically or on-demand by FPO dashboard."""
    for session in get_session():
        return geo_pooling_worker.run_pooling_pass(session)
