from typing import List

from sqlmodel import Session, select

from app.models.database import GeoCluster


class GeoClusterRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[GeoCluster]:
        return self.session.exec(select(GeoCluster)).all()
