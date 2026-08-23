from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.engine import create_db_and_tables

# Import all API Routers
from app.routers import auth, marketplace, whatsapp, ai_grading, decision, escrow

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLModel DB and auto-seed initial demo dataset
    create_db_and_tables()
    yield

app = FastAPI(
    title="KisanSetu & AgMarknet Core API",
    description=(
        "Production-ready backend for Smart India Hackathon (SIH Problem Statement 26132: "
        "'Strengthening market linkages and price discovery for farmers'). "
        "Orchestrates YOLOv8 AI Crop Grading, Geospatial Freight Pooling, Price Intelligence, "
        "WhatsApp Business Conversational Bot, and Milestone Escrow Rails."
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
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["Crop Marketplace & Bidding"])
app.include_router(whatsapp.router, prefix="/api/whatsapp", tags=["WhatsApp Bot & Webhooks"])
app.include_router(ai_grading.router, prefix="/api/ai", tags=["YOLOv8 AI Quality Grading"])
app.include_router(decision.router, prefix="/api/decision", tags=["APMC Decision & Price Intelligence"])
app.include_router(escrow.router, prefix="/api/escrow", tags=["Milestone Escrow & Settlements"])

@app.get("/", tags=["System Health"])
def root():
    return {
        "status": "ONLINE",
        "service": "KisanSetu Agricultural Market Linkage API",
        "version": "2.0.0",
        "docs_url": "/docs",
        "modules": [
            "WhatsApp Farmer Conversational Bot",
            "YOLOv8 AI Quality Grading",
            "Geospatial Freight Pooling (PostGIS)",
            "APMC Price Intelligence & Loss Estimation",
            "Milestone Escrow Rails (4-digit OTP Handshake)"
        ]
    }
