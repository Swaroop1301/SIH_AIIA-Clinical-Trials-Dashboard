from pydantic import BaseModel
from typing import Optional
from app.models.user import RoleEnum

class UserBase(BaseModel):
    email: str
    role: RoleEnum = RoleEnum.Coordinator
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
