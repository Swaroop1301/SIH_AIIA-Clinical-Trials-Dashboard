from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.clinical import Trial, Site, Participant
from app.schemas.clinical import DashboardOverview

router = APIRouter()

@router.get("/overview", response_model=DashboardOverview)
def get_dashboard_overview(db: Session = Depends(deps.get_db), current_user = Depends(deps.get_current_user)):
    total_trials = db.query(Trial).count()
    active_sites = db.query(Site).count()
    total_participants = db.query(Participant).count()
    
    # Mock pending approvals for now
    pending_approvals = 5

    return DashboardOverview(
        total_trials=total_trials,
        active_sites=active_sites,
        total_participants=total_participants,
        pending_approvals=pending_approvals
    )
