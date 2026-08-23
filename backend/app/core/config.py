from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgMarknet & KisanSetu Core Engine"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "kisan-setu-sih26132-super-secret-key-change-in-prod-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database (PostgreSQL + PostGIS or SQLite Fallback)
    DATABASE_URL: str = "sqlite:///database.db"
    
    # WhatsApp Business API Config
    WHATSAPP_VERIFY_TOKEN: str = "kisan_setu_whatsapp_token_2026"
    WHATSAPP_ACCESS_TOKEN: Optional[str] = None
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = None
    
    # Third-Party External APIs
    OPENROUTESERVICE_API_KEY: Optional[str] = "5b3ce3597851110001cf6248e89f82df362e49c7bf5689196b0b0bb1"
    AGMARKNET_API_KEY: Optional[str] = None
    
    # AI Vision Settings
    YOLO_MODEL_PATH: str = "app/core/ml_models/yolov8_agriculture_weights.pt"
    CONFIDENCE_THRESHOLD: float = 0.50
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
