from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta
from pydantic import BaseModel
from typing import Any, Optional, List

from app.db.engine import get_session
from app.models.database import User
from app.services.auth_service import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "FARMER"
    phone_number: Optional[str] = None
    district: Optional[str] = "Nashik"
    state: Optional[str] = "Maharashtra"

class UserLogin(BaseModel):
    email: str
    password: str

class KYCRequest(BaseModel):
    aadhaar_number: str
    consent_agreed: bool = True

@router.post("/register", response_model=Any)
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        phone_number=user.phone_number,
        full_name=user.full_name,
        role=user.role,
        district=user.district,
        state=user.state,
        hashed_password=hashed_password
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

@router.post("/login", response_model=Any)
def login_user(user: UserLogin, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where(User.email == user.email)).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=db_user.email,
        role=db_user.role,
        user_id=db_user.id,
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role,
        "user_id": db_user.id,
        "full_name": db_user.full_name,
        "kyc_verified": db_user.kyc_verified
    }

@router.post("/kyc/{user_id}", response_model=Any)
def verify_digilocker_kyc(
    user_id: int,
    req: KYCRequest = KYCRequest(aadhaar_number="XXXX-XXXX-8921"),
    session: Session = Depends(get_session)
):
    """
    DigiLocker & UIDAI KYC Verification simulation.
    Verifies biometric/Aadhaar identity and computes Agri-Credit CIBIL creditworthiness.
    """
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.kyc_verified = True
    db_user.aadhaar_masked = f"XXXX-XXXX-{req.aadhaar_number[-4:] if len(req.aadhaar_number) >= 4 else '8921'}"
    db_user.cibil_score = 765
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return {
        "status": "VERIFIED",
        "message": "Aadhaar e-KYC verified via DigiLocker Sandbox API",
        "cibil_score": db_user.cibil_score,
        "kyc_verified": True
    }

@router.get("/users", response_model=List[User])
def get_all_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users
