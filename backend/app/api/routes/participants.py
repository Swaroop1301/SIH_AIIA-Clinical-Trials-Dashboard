from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.clinical import Participant
from app.schemas.clinical import ParticipantResponse

router = APIRouter()

@router.get("/{id}", response_model=ParticipantResponse)
def get_participant(id: int, db: Session = Depends(deps.get_db), current_user = Depends(deps.get_current_user)):
    participant = db.query(Participant).filter(Participant.id == id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    return participant
