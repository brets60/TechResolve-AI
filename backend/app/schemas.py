from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Any, Dict
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2)
    preferred_mode: Optional[str] = "beginner"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    name: str
    preferred_mode: str
    created_at: datetime

class UserUpdate(BaseModel):
    name: Optional[str] = None
    preferred_mode: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Wizard / Troubleshooting Schemas
class WizardOption(BaseModel):
    key: str
    label: str
    action_type: Optional[str] = "normal"  # "normal", "need_simpler", "tool_missing", "error", "solved", "not_solved"
    description: Optional[str] = None

class StepStructuredData(BaseModel):
    what_we_are_checking: str
    why_it_matters: str
    what_to_do: List[str]
    what_should_happen: str
    tell_us_what_happened_options: List[WizardOption]
    what_happens_next: str
    what_we_know_so_far: Optional[List[str]] = []
    what_we_need_to_check: Optional[List[str]] = []
    next_action_title: Optional[str] = None
    safety_warning: Optional[str] = None
    command_to_run: Optional[str] = None
    command_explanation: Optional[str] = None
    allows_file_upload: bool = False
    upload_hint: Optional[str] = None
    battery_analysis: Optional[Dict[str, Any]] = None

class SessionMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    session_id: str
    sender: str
    message_type: str
    step_number: Optional[int] = None
    stage: Optional[str] = None
    content: str
    structured_data: Optional[Dict[str, Any]] = None
    created_at: datetime

class UploadedFileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    session_id: str
    filename: str
    file_type: str
    analysis_summary: Optional[str] = None
    parsed_data: Optional[Dict[str, Any]] = None
    created_at: datetime

class SessionCreate(BaseModel):
    title: str
    category: Optional[str] = "General"
    problem_description: str
    mode: Optional[str] = "beginner"

class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: Optional[int] = None
    title: str
    category: str
    problem_description: str
    mode: str
    status: str
    current_stage: str
    current_step_number: int
    diagnostic_data: Optional[Dict[str, Any]] = {}
    final_summary: Optional[Dict[str, Any]] = {}
    created_at: datetime
    updated_at: datetime
    messages: Optional[List[SessionMessageResponse]] = []
    files: Optional[List[UploadedFileResponse]] = []

class SessionStepRequest(BaseModel):
    chosen_option_key: Optional[str] = None
    chosen_option_label: Optional[str] = None
    custom_feedback: Optional[str] = None
    action_type: str = "advance"  # "advance", "simpler_instructions", "cannot_find_tool", "something_went_wrong", "confirm_fixed", "not_fixed", "clarification"

class ClarificationRequest(BaseModel):
    question: str

# Knowledge Base Schemas
class KnowledgeArticleItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    category: str
    summary: str
    difficulty: str
    estimated_time: str
    tags: List[str] = []

class KnowledgeArticleDetail(KnowledgeArticleItem):
    common_causes: List[str] = []
    signs_to_look_for: List[str] = []
    steps: List[Dict[str, Any]] = []
    expected_results: str
    safety_warning: Optional[str] = None
    technician_trigger: str

# Settings
class SystemSettings(BaseModel):
    gemini_configured: bool
    gemini_model: str
    preferred_mode: str
    version: str
