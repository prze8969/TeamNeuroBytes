from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Any
from app.db.engine import get_session
from app.models.database import Listing

router = APIRouter()

@router.get("/listings", response_model=List[Any])
def get_all_listings(session: Session = Depends(get_session)):
    """Fetch all verified listings available in the market."""
    listings = session.exec(select(Listing).where(Listing.is_verified == True)).all()
    return listings

@router.post("/listings", response_model=Any)
def create_listing(title: str, description: str, quantity: float, price: float, location: str, session: Session = Depends(get_session)):
    """Create a new listing (mock). Real version would take Pydantic models & JWT user."""
    # Mock user ID 1 for now
    new_listing = Listing(
        title=title,
        description=description,
        commodity_type="Wheat",
        quantity_kg=quantity,
        base_price_per_kg=price,
        location=location,
        farmer_id=1,
        is_verified=False # Requires image validation
    )
    session.add(new_listing)
    session.commit()
    session.refresh(new_listing)
    return new_listing

@router.post("/verify-pic/{listing_id}", response_model=Any)
def verify_listing_picture(listing_id: int, session: Session = Depends(get_session)):
    """Stub for OCR/CV based image validation"""
    listing = session.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Mocking successful validation
    listing.is_verified = True
    session.add(listing)
    session.commit()
    return {"message": "Picture validated successfully. Listing is now public."}
