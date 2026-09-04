import os
from pydantic_settings import BaseSettings
from pydantic import field_validator, model_validator
from typing import Optional, List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgMarknet & KisanSetu Core Engine"
    API_V1_STR: str = "/api"
    ENV: str = "development"
    
    # Secret Key for JWT Signing (Must be set via environment variable in production)
    SECRET_KEY: str = "INSECURE-DEV-KEY-DO-NOT-USE-IN-PROD-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database (PostgreSQL + PostGIS or SQLite Fallback)
    DATABASE_URL: str = "sqlite:///database.db"
    
    # WhatsApp Business API Config
    WHATSAPP_VERIFY_TOKEN: str = "kisan_setu_whatsapp_token_2026"
    WHATSAPP_ACCESS_TOKEN: Optional[str] = None
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = None
    
    # Supabase Cloud Storage & Database Config
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_BUCKET_NAME: str = "crop-images"
    
    # Third-Party External APIs (Set via environment variables)
    GST_API_KEY: Optional[str] = None
    GST_API_SECRET: Optional[str] = None
    OPENROUTESERVICE_API_KEY: Optional[str] = None
    AGMARKNET_API_KEY: Optional[str] = None
    
    # AI Vision Settings
    YOLO_MODEL_PATH: str = "app/core/ml_models/yolov8_agriculture_weights.pt"
    CONFIDENCE_THRESHOLD: float = 0.50
    
    # Web3 & Blockchain Configuration
    RPC_URL: str = "https://polygon-amoy-bor-rpc.publicnode.com"
    CHAIN_ID: int = 80002
    ADMIN_PRIVATE_KEY: Optional[str] = None
    WAREHOUSE_PRIVATE_KEY: Optional[str] = None
    TEST_TOKEN_ADDRESS: str = "0x94eA3B596899cD23F21A9c2b073b4aD44EB26C0d"
    ROLES_ADDRESS: str = "0x06d95F59142eAA3c5f06757c43F6C4db54b73c16"
    GRADE_REGISTRY_ADDRESS: str = "0x1cAb3f4D37eE0AdC19a64dE8023CeEefC404978C"
    ESCROW_MANAGER_ADDRESS: str = "0xB0cA0E341006238BcCCc46cd7Bebd25297794860"
    DISPUTE_ARBITER_ADDRESS: str = "0xfa56743872bc0457C3667609677EE0877d340E5e"

    # Razorpay Gateway Configuration
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None

    # CORS Configuration (Configurable via comma-separated string or list)
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://prze8969.github.io"
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.strip() == "*":
                return ["*"]
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        raise ValueError(v)

    @model_validator(mode="after")
    def validate_production_security(self) -> "Settings":
        if self.ENV.lower() == "production":
            if self.SECRET_KEY == "INSECURE-DEV-KEY-DO-NOT-USE-IN-PROD-2026" or len(self.SECRET_KEY) < 32:
                raise ValueError("CRITICAL SECURITY ERROR: A secure SECRET_KEY (min 32 chars) must be provided in production.")
        return self

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Direct RPC & Smart Contract Configuration
RPC_URL = settings.RPC_URL
CHAIN_ID = settings.CHAIN_ID
CONTRACT_ADDRESSES = {
    "TestToken": settings.TEST_TOKEN_ADDRESS,
    "Roles": settings.ROLES_ADDRESS,
    "GradeRegistry": settings.GRADE_REGISTRY_ADDRESS,
    "EscrowManager": settings.ESCROW_MANAGER_ADDRESS,
    "DisputeArbiter": settings.DISPUTE_ARBITER_ADDRESS,
}

