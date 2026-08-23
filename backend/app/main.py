from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.engine import create_db_and_tables
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

# Initialize FastAPI app
app = FastAPI(
    title="AgMarknet API",
    description="Backend API for the AgMarknet platform (SIH Problem Statement 132)",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import auth
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# from app.routers import farmers, buyers, organization, warehouse, transportation, marketplace, payments, price_feed, central_bank, grievance
# app.include_router(farmers.router, prefix="/api/farmers", tags=["farmers"])
# app.include_router(buyers.router, prefix="/api/buyers", tags=["buyers"])
# app.include_router(organization.router, prefix="/api/org", tags=["organization"])
# app.include_router(warehouse.router, prefix="/api/warehouse", tags=["warehouse"])
# app.include_router(transportation.router, prefix="/api/transport", tags=["transportation"])
# app.include_router(marketplace.router, prefix="/api/marketplace", tags=["marketplace"])
# app.include_router(payments.router, prefix="/api/payments", tags=["payments"])
# app.include_router(price_feed.router, prefix="/api/price-feed", tags=["price-feed"])
# app.include_router(central_bank.router, prefix="/api/central-bank", tags=["central-bank"])
# app.include_router(grievance.router, prefix="/api/grievance", tags=["grievance"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AgMarknet API"}
