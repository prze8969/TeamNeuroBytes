from typing import List, Optional

from sqlmodel import Session, select

from app.models.database import MandiPrice


class MandiPriceRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_prices(
        self,
        commodity: Optional[str] = None,
        district: Optional[str] = None,
    ) -> List[MandiPrice]:
        query = select(MandiPrice)
        if commodity:
            query = query.where(MandiPrice.commodity.ilike(f"%{commodity}%"))
        if district:
            query = query.where(MandiPrice.district.ilike(f"%{district}%"))

        return self.session.exec(query).all()
