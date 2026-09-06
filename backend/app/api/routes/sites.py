from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.clinical import Site

router = APIRouter()

@router.get('/')
def get_sites(db: Session = Depends(deps.get_db)):
    return db.query(Site).all()
