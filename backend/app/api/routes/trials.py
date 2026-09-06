from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.clinical import Trial
from app.schemas.clinical import TrialResponse, TrialBase
from typing import List

router = APIRouter()

@router.get("/", response_model=List[TrialResponse])
def get_trials(db: Session = Depends(deps.get_db), current_user = Depends(deps.get_current_user)):
    trials = db.query(Trial).all()
    return trials

@router.post("/", response_model=TrialResponse)
def create_trial(trial_in: TrialBase, db: Session = Depends(deps.get_db), current_user = Depends(deps.get_current_user)):
    db_trial = Trial(name=trial_in.name, status=trial_in.status)
    db.add(db_trial)
    db.commit()
    db.refresh(db_trial)
    return db_trial
