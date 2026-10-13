import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def get_utc_now():
    return datetime.now(timezone.utc)

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False, default="")
    avatar_url = Column(String(500), nullable=True)
    auth_provider = Column(String(50), default="local")  # "local", "google", "otp"
    google_id = Column(String(255), nullable=True, index=True)
    preferred_mode = Column(String(50), default="beginner")  # "beginner" or "pro"
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    sessions = relationship("TroubleshootingSession", back_populates="user", cascade="all, delete-orphan")

class OtpCode(Base):
    __tablename__ = "otp_codes"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), index=True, nullable=False)
    code = Column(String(10), nullable=False)
    purpose = Column(String(50), default="login_register")
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

class TroubleshootingSession(Base):
    __tablename__ = "troubleshooting_sessions"

    id = Column(String(64), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, default="General")
    problem_description = Column(Text, nullable=False)
    mode = Column(String(50), default="beginner")  # "beginner" or "pro"
    status = Column(String(50), default="not_started")  # "not_started", "in_progress", "solved", "needs_help"
    current_stage = Column(String(50), default="understanding")  # "understanding", "checking", "trying_solution", "confirming_fix"
    current_step_number = Column(Integer, default=1)
    diagnostic_data = Column(JSON, default=dict)  # what we know so far, hypotheses, battery data, etc.
    final_summary = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    user = relationship("User", back_populates="sessions")
    messages = relationship("SessionMessage", back_populates="session", cascade="all, delete-orphan", order_by="SessionMessage.created_at")
    files = relationship("UploadedFile", back_populates="session", cascade="all, delete-orphan")

class SessionMessage(Base):
    __tablename__ = "session_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), ForeignKey("troubleshooting_sessions.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(50), nullable=False)  # "assistant", "user", "system"
    message_type = Column(String(50), default="wizard_step")  # "wizard_step", "clarification", "user_response", "system_alert", "report"
    step_number = Column(Integer, nullable=True)
    stage = Column(String(50), nullable=True)
    content = Column(Text, nullable=False)
    structured_data = Column(JSON, default=dict)  # Follows 6-part wizard step schema
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    session = relationship("TroubleshootingSession", back_populates="messages")

class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    session_id = Column(String(64), ForeignKey("troubleshooting_sessions.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    stored_path = Column(String(500), nullable=False)
    file_type = Column(String(50), default="other")  # "battery_report", "screenshot", "log", "other"
    parsed_data = Column(JSON, default=dict)
    analysis_summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    session = relationship("TroubleshootingSession", back_populates="files")

class KnowledgeArticle(Base):
    __tablename__ = "knowledge_articles"

    id = Column(String(100), primary_key=True)  # slug
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    summary = Column(Text, nullable=False)
    common_causes = Column(JSON, default=list)
    signs_to_look_for = Column(JSON, default=list)
    steps = Column(JSON, default=list)
    expected_results = Column(Text, nullable=False)
    safety_warning = Column(Text, nullable=True)
    technician_trigger = Column(Text, nullable=False)
    difficulty = Column(String(50), default="Beginner")
    estimated_time = Column(String(50), default="5-10 mins")
    tags = Column(JSON, default=list)
