from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Trial(Base):
    __tablename__ = "trials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    status = Column(String, default="Active")

    sites = relationship("Site", back_populates="trial")

class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    trial_id = Column(Integer, ForeignKey("trials.id"))

    trial = relationship("Trial", back_populates="sites")
    participants = relationship("Participant", back_populates="site")

class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    site_id = Column(Integer, ForeignKey("sites.id"))

    site = relationship("Site", back_populates="participants")
    visits = relationship("Visit", back_populates="participant")

class Visit(Base):
    __tablename__ = "visits"

    id = Column(Integer, primary_key=True, index=True)
    participant_id = Column(Integer, ForeignKey("participants.id"))
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Scheduled")

    participant = relationship("Participant", back_populates="visits")
