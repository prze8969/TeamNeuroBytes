from typing import Optional

from sqlmodel import Session, select

from app.models.database import BuyerProfile


class BuyerProfileRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_user_id(self, user_id: int) -> Optional[BuyerProfile]:
        query = select(BuyerProfile).where(BuyerProfile.user_id == user_id)
        return self.session.exec(query).first()
