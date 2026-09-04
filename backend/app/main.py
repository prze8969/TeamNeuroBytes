import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.engine import create_db_and_tables, get_session
from app.services.apmc_data import AgmarknetSyncService
from app.services.crop_grading_service import CropGradingService
from app.services.onnx_service import ONNXInferenceService
from app.core.ml_models.crop_quality_predictor import crop_quality_predictor
from app.routers import auth, marketplace, whatsapp, ai_grading, decision, escrow, buyer, transporter, fpo, payment, inference, crop_grading, smart_grading

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def scheduled_agmarknet_sync_loop():
    """
    Background worker that runs on startup and every 6 hours
    to pull live mandi rates from AGMARKNET feed into the database.
    """
    await asyncio.sleep(3)  # Allow DB engine to finish initialization
    while True:
        try:
            logger.info("⏰ Executing scheduled AGMARKNET price sync worker...")
            session = next(get_session())
            AgmarknetSyncService.sync_all_active_commodities(session)
        except Exception as e:
            logger.warning(f"Background AGMARKNET sync worker caught error: {e}")

        # Sleep for 6 hours
        await asyncio.sleep(6 * 3600)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan Context Manager:
    Initializes database tables, pre-loads the ONNX CropGradingService into app.state,
    and manages background service threads.
    """
    # 1. Initialize SQLModel Database & Tables
    create_db_and_tables()

    # 2. Pre-load DINOv2 Crop Model & ONNX Crop AI Inference Engine (CUDA / CPU)
    try:
        crop_quality_predictor.load_model()
    except Exception as e:
        logger.warning(f"Could not pre-load PyTorch DINOv2 crop model on startup: {e}")

    try:
        grading_service = CropGradingService()
        app.state.crop_grading_service = grading_service
        app.state.onnx_service = grading_service
        logger.info("🚀 DINOv2 + CORAL CropGradingService pre-loaded successfully into app.state.")
    except Exception as e:
        logger.warning(f"Could not pre-load CropGradingService on startup: {e}")

    # 3. Start recurring 6-hour AGMARKNET sync worker
    sync_task = asyncio.create_task(scheduled_agmarknet_sync_loop())
    
    yield
    
    # Clean up background tasks on shutdown
    sync_task.cancel()

app = FastAPI(
    title="KisanSetu Agricultural Market Linkage & Quality Grading API",
    description=(
        "Production-ready FastAPI backend integrating Meta DINOv2 ONNX Ordinal Inference, "
        "YOLOv8 Quality Grading, Price Intelligence, WhatsApp Bot, and Escrow Financial Rails."
    ),
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware for Frontend Clients (React/Next.js on localhost:3000 & localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ] if not getattr(settings, "BACKEND_CORS_ORIGINS", None) else settings.BACKEND_CORS_ORIGINS,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(smart_grading.router)
app.include_router(crop_grading.router)
app.include_router(inference.router)
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
app.include_router(payment.router, prefix="/api", tags=["Razorpay Checkout"])

@app.get("/", tags=["System Health"])
def root():
    return {
        "status": "ONLINE",
        "service": "KisanSetu Agricultural Market Linkage API",
        "version": "2.0.0",
        "docs_url": "/docs",
        "ml_engine": "DINOv2 ViT-B/14 + CORAL ONNX Runtime (CUDA/CPU)"
    }
