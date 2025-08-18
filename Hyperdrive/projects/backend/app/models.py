from sqlalchemy import Column, String, Integer, ForeignKey, Enum, DateTime, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import enum, uuid
from app.db import Base

class Role(str, enum.Enum):
    DEVELOPER="DEVELOPER"; ADMIN="ADMIN"

class ProjectStatus(str, enum.Enum):
    DRAFT="DRAFT"; PUBLISHED="PUBLISHED"; HIDDEN="HIDDEN"; ARCHIVED="ARCHIVED"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    wallet_address = Column(String, unique=True, nullable=True)
    role = Column(Enum(Role), nullable=False, default=Role.DEVELOPER)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(80), nullable=False)
    category = Column(String(40), nullable=False)
    purpose = Column(String(200), nullable=False)
    problem = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    target_market = Column(Text, nullable=False)
    business_model = Column(Text, nullable=False)
    team = Column(Text, nullable=False)
    contact = Column(String(200), nullable=False)
    links_json = Column(JSONB, nullable=False, default=list)
    status = Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.DRAFT)
    views_count = Column(Integer, nullable=False, default=0)
    reports_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class ProjectReport(Base):
    __tablename__ = "project_reports"
    id = Column(Integer, primary_key=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    reporter_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reason = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    actor_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    payload_json = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)