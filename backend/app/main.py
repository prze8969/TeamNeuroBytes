from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.engine import create_db_and_tables

# Import all API Routers
from app.routers import auth, marketplace, whatsapp, ai_grading, decision, escrow, buyer, transporter, fpo

from app.core.ml_models.crop_quality_predictor import crop_quality_predictor

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLModel DB and auto-seed initial demo dataset
    create_db_and_tables()
    # Pre-load High-Accuracy DINOv2 Crop Quality Grading Model onto GPU
    try:
        crop_quality_predictor.load_model()
    except Exception as e:
        print(f"[WARN] Could not pre-load DINOv2 crop model on startup: {e}")
    yield

app = FastAPI(
    title="KisanSetu & AgMarknet Core API",
    description=(
        "Production-ready backend for Smart India Hackathon (SIH Problem Statement 26132: "
        "'Strengthening market linkages and price discovery for farmers'). "
        "Orchestrates DINOv2 + CORAL AI Crop Grading, Geospatial Freight Pooling, Price Intelligence, "
        "WhatsApp Business Conversational Bot, Milestone Escrow Rails, and Buyer Institutional KYC."
    ),
    version="2.0.0",
    lifespan=lifespan
)

# CORS Configuration for Next.js web dashboards & local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication & DigiLocker KYC"])
app.include_router(buyer.router, prefix="/api/buyer", tags=["Buyer Institutional KYC & Onboarding"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["Crop Marketplace & Bidding"])
app.include_router(escrow.router, prefix="/api/bids", tags=["Bidding & Direct Escrow Vault"])
app.include_router(whatsapp.router, prefix="/api/whatsapp", tags=["WhatsApp Bot & Webhooks"])
app.include_router(ai_grading.router, prefix="/api/ai", tags=["DINOv2 AI Quality Grading"])
app.include_router(decision.router, prefix="/api/decision", tags=["APMC Decision & Price Intelligence"])
app.include_router(escrow.router, prefix="/api/escrow", tags=["Milestone Escrow & Settlements"])
app.include_router(transporter.router, prefix="/api/transporter", tags=["Transporter & Fleet Portal"])
app.include_router(fpo.router, prefix="/api/fpo", tags=["FPO & Aggregator Collective Portal"])

@app.get("/", tags=["System Health"])
def root():
    return {
        "status": "ONLINE",
        "service": "KisanSetu Agricultural Market Linkage API",
        "version": "2.0.0",
        "docs_url": "/docs",
        "modules": [
            "Institutional Buyer e-KYC & GSTIN Verification",
            "WhatsApp Farmer Conversational Bot",
            "YOLOv8 AI Quality Grading",
            "Geospatial Freight Pooling (PostGIS)",
            "APMC Price Intelligence & Loss Estimation",
            "Milestone Escrow Rails (4-digit OTP Handshake)"
        ]
    }
