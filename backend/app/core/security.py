import hashlib
import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import jwt
from app.core.config import settings

def create_access_token(subject: Union[str, Any], role: str, user_id: int, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "id": user_id
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # Check standard bcrypt hash
        plain_bytes = plain_password[:72].encode("utf-8")
        if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
            return bcrypt.checkpw(plain_bytes, hashed_password.encode("utf-8"))
        # Fallback to sha256
        sha_hash = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
        return sha_hash == hashed_password or plain_password == hashed_password
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    plain_bytes = password[:72].encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_bytes, salt).decode("utf-8")
