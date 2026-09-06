from fastapi import APIRouter, Depends, HTTPException
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

@router.get("/{id}", response_model=TrialResponse)
def get_trial(id: int, db: Session = Depends(deps.get_db), current_user = Depends(deps.get_current_user)):
    trial = db.query(Trial).filter(Trial.id == id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    return trial

@router.post("/", response_model=TrialResponse)
def create_trial(trial_in: TrialBase, db: Session = Depends(deps.get_db), current_user = Depends(deps.get_current_user)):
    db_trial = Trial(name=trial_in.name, status=trial_in.status)
    db.add(db_trial)
    db.commit()
    db.refresh(db_trial)
    return db_trial
