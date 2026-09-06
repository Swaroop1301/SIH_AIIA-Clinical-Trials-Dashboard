from sqlalchemy import Column, Integer, String, Boolean, Enum
import enum
from app.database import Base

class RoleEnum(str, enum.Enum):
    Admin = "Admin"
    Sponsor = "Sponsor"
    PI = "PI"
    Coordinator = "Coordinator"
    Monitor = "Monitor"
    Ethics = "Ethics"
    Regulatory = "Regulatory"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.Coordinator)
    is_active = Column(Boolean, default=True)
