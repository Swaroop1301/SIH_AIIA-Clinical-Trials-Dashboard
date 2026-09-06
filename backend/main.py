from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.api.routes import auth, trials, participants, dashboard
from app.database import engine, Base

# Create database tables (For local SQLite development. Use Alembic in production)
Base.metadata.create_all(bind=engine)

# Configure Rate Limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="AIIA Clinical Trials Dashboard API")

# Add slowapi exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Setup CORS - Enforcing stricter rules for production readiness
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "https://aiia-ctms.demo.com"], # restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(trials.router, prefix="/api/trials", tags=["trials"])
app.include_router(participants.router, prefix="/api/participants", tags=["participants"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

@app.get("/")
@limiter.limit("10/minute")
def read_root(request: Request):
    return {"message": "Welcome to the AIIA Clinical Trials API (Hrishikesh Backend)"}
