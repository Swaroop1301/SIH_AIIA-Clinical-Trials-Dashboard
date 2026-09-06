from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, trials, participants, dashboard
from app.database import engine, Base

# Create database tables (For local SQLite development. Use Alembic in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AIIA Clinical Trials Dashboard API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(trials.router, prefix="/api/trials", tags=["trials"])
app.include_router(participants.router, prefix="/api/participants", tags=["participants"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AIIA Clinical Trials API (Hrishikesh Backend)"}
