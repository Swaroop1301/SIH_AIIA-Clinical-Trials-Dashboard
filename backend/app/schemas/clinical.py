from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TrialBase(BaseModel):
    name: str
    status: str = "Active"

class TrialResponse(TrialBase):
    id: int

    class Config:
        from_attributes = True

class ParticipantBase(BaseModel):
    name: str
    site_id: int

class ParticipantResponse(ParticipantBase):
    id: int

    class Config:
        from_attributes = True

class DashboardOverview(BaseModel):
    total_trials: int
    active_sites: int
    total_participants: int
    pending_approvals: int
