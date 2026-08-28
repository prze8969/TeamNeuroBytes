from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from datetime import timedelta
from pydantic import BaseModel
from typing import Any, Optional, List

from app.db.engine import get_session
from app.models.database import User
from app.services.auth_service import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    decode_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

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

class UserPublic(BaseModel):
    id: int
    email: str
    phone_number: Optional[str] = None
    full_name: str
    role: str
    district: Optional[str] = None
    state: Optional[str] = None
    kyc_verified: bool = False
    cibil_score: Optional[int] = 750
    aadhaar_masked: Optional[str] = None

class KYCRequest(BaseModel):
    aadhaar_number: str
    consent_agreed: bool = True

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials. Please provide a valid Bearer token.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception
    user_id = payload.get("id")
    if user_id is None:
        raise credentials_exception
    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception
    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role.upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin privileges required."
        )
    return current_user

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
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=new_user.email,
        role=new_user.role,
        user_id=new_user.id,
        expires_delta=access_token_expires
    )
    return {
        "message": "User registered successfully", 
        "user_id": new_user.id,
        "access_token": access_token,
        "token_type": "bearer",
        "role": new_user.role,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "kyc_verified": new_user.kyc_verified
    }

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

@router.get("/me", response_model=UserPublic)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Fetches public profile for the authenticated stakeholder."""
    return current_user

@router.post("/kyc/{user_id}", response_model=Any)
def verify_digilocker_kyc(
    user_id: int,
    req: KYCRequest = KYCRequest(aadhaar_number="XXXX-XXXX-8921"),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    DigiLocker & UIDAI KYC Verification simulation.
    Authorization: Only the account owner or ADMIN can verify/update KYC.
    """
    if current_user.id != user_id and current_user.role.upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied: You cannot verify or update another stakeholder's KYC record."
        )

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

@router.get("/users", response_model=List[UserPublic])
def get_all_users(
    current_user: User = Depends(require_admin),
    session: Session = Depends(get_session)
):
    """
    Admin-only endpoint to inspect registered stakeholders.
    Excludes hashed_password and security credentials.
    """
    users = session.exec(select(User)).all()
    return users
