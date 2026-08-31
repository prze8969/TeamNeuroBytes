import asyncio
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.engine import create_db_and_tables, get_session
from app.services.apmc_data import AgmarknetSyncService

# Import all API Routers
from app.routers import auth, marketplace, whatsapp, ai_grading, decision, escrow, buyer, transporter, fpo

logger = logging.getLogger(__name__)

async def scheduled_agmarknet_sync_loop():
    """
    Background worker that runs on startup and every 6 hours
    to pull live mandi rates from Data.gov.in AGMARKNET feed into the database.
    """
    await asyncio.sleep(3) # Allow DB engine to finish initialization
    while True:
        try:
            logger.info("⏰ Executing scheduled AGMARKNET price sync worker...")
            session = next(get_session())
            AgmarknetSyncService.sync_all_active_commodities(session)
        except Exception as e:
            logger.warning(f"Background AGMARKNET sync worker caught error: {e}")
        
        # Sleep for 6 hours (21,600 seconds)
        await asyncio.sleep(6 * 3600)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLModel DB and auto-seed initial demo dataset
    create_db_and_tables()
    # Spawn background recurring 6-hour AGMARKNET sync worker
    sync_task = asyncio.create_task(scheduled_agmarknet_sync_loop())
    yield
    sync_task.cancel()

app = FastAPI(
    title="KisanSetu & AgMarknet Core API",
    description=(
        "Production-ready backend for Smart India Hackathon (SIH Problem Statement 26132: "
        "'Strengthening market linkages and price discovery for farmers'). "
        "Orchestrates YOLOv8 AI Crop Grading, Geospatial Freight Pooling, Price Intelligence, "
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
app.include_router(ai_grading.router, prefix="/api/ai", tags=["YOLOv8 AI Quality Grading"])
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
            "Milestone Escrow Rails (4-digit OTP Handshake)",
            "Automated 6-Hour AGMARKNET Live Feed Synchronization"
        ]
    }
