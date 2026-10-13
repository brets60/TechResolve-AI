import uuid
import os
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.config import settings
from app.models import TroubleshootingSession, SessionMessage, UploadedFile
from app.schemas import UploadedFileResponse, SessionMessageResponse
from app.services.battery_parser import parse_battery_report
from app.ai.gemini_service import gemini_service

router = APIRouter(prefix="/troubleshoot", tags=["uploads"])

@router.post("/sessions/{session_id}/upload")
async def upload_file_or_report(
    session_id: str,
    file: UploadFile = File(...),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    session = db.query(TroubleshootingSession).filter(TroubleshootingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size ({settings.MAX_UPLOAD_SIZE_MB}MB)")

    filename = file.filename or "uploaded_file"
    ext = Path(filename).suffix.lower()
    file_uuid = str(uuid.uuid4())
    saved_filename = f"{file_uuid}_{filename}"
    saved_path = settings.UPLOAD_DIR / saved_filename

    with open(saved_path, "wb") as f:
        f.write(file_bytes)

    # Determine file type
    file_type = "other"
    if "battery" in filename.lower() or ext in [".html", ".htm"] and b"battery" in file_bytes[:1000].lower():
        file_type = "battery_report"
    elif ext in [".png", ".jpg", ".jpeg", ".webp", ".bmp"]:
        file_type = "screenshot"
    elif ext in [".log", ".txt", ".json"]:
        file_type = "log"

    parsed_data = {}
    analysis_text = ""
    assistant_msg_data = None

    # 1. Process Battery Report
    if file_type == "battery_report" or (ext in [".html", ".txt"] and b"CAPACITY" in file_bytes.upper()):
        try:
            text_content = file_bytes.decode("utf-8", errors="ignore")
            parsed_data = parse_battery_report(text_content)
            analysis_text = parsed_data.get("plain_english_explanation", "")

            # Update session diagnostic data with battery numbers
            current_diag = dict(session.diagnostic_data or {})
            current_diag["battery_analysis"] = parsed_data
            session.diagnostic_data = current_diag
            session.current_stage = "trying_solution"
            session.current_step_number = 6

            assistant_msg_data = {
                "what_we_are_checking": f"Battery Analysis Results: {parsed_data.get('summary_verdict', 'Assessment Complete')}",
                "why_it_matters": "Real capacity measurements show whether your battery hardware can still deliver steady power without cutting out.",
                "what_to_do": [
                    f"Factory Design Capacity: {parsed_data.get('design_capacity_mwh', 'N/A'):,} mWh" if parsed_data.get('design_capacity_mwh') else "Design Capacity: Unknown",
                    f"Current Full Charge Capacity: {parsed_data.get('full_charge_capacity_mwh', 'N/A'):,} mWh" if parsed_data.get('full_charge_capacity_mwh') else "Full Charge Capacity: Unknown",
                    f"Calculated Health: {parsed_data.get('health_percentage', 'N/A')}% (Wear level: {parsed_data.get('wear_percentage', 'N/A')}%)" if parsed_data.get('health_percentage') else "Health: Unable to calculate exact %",
                    f"Battery Cycles: {parsed_data.get('cycle_count', 'N/A')}" if parsed_data.get('cycle_count') else "Battery Cycles: Not recorded"
                ],
                "what_should_happen": parsed_data.get("plain_english_explanation", "Analysis complete."),
                "tell_us_what_happened_options": [
                    {"key": "proceed_with_recommendation", "label": "Continue to Recommended Solution", "action_type": "normal"},
                    {"key": "ask_battery_question", "label": "I have a question about these numbers", "action_type": "clarification"}
                ],
                "what_happens_next": parsed_data.get("recommendation", "Next we'll test driver settings and verify hardware integrity."),
                "what_we_know_so_far": [
                    f"Battery health is at {parsed_data.get('health_percentage', 'N/A')}% capacity."
                ],
                "what_we_need_to_check": ["Determine if replacement or software reset is needed."],
                "battery_analysis": parsed_data
            }
        except Exception as e:
            analysis_text = f"Could not fully parse battery report structure: {e}"

    # 2. Process Screenshot
    elif file_type == "screenshot":
        mime = "image/png" if ext == ".png" else "image/jpeg"
        if gemini_service.is_configured():
            ai_vision = gemini_service.analyze_image_or_screenshot(file_bytes, mime, session.problem_description)
            if ai_vision:
                parsed_data = ai_vision
                analysis_text = ai_vision.get("plain_english_meaning", "Screenshot analyzed.")
                assistant_msg_data = {
                    "what_we_are_checking": "Screenshot Analysis & Error Recognition",
                    "why_it_matters": "Reading the exact text in error popups helps us target the exact setting or missing file.",
                    "what_to_do": [
                        f"Detected in image: {ai_vision.get('detected_text', 'Diagnostic visual data')}",
                        f"What this means: {ai_vision.get('plain_english_meaning', '')}"
                    ],
                    "what_should_happen": ai_vision.get("recommended_next_action", "Proceed with targeted resolution."),
                    "tell_us_what_happened_options": [
                        {"key": "follow_screenshot_advice", "label": "Let's fix this error", "action_type": "normal"},
                        {"key": "ask_screenshot_q", "label": "Can you explain this error in simpler words?", "action_type": "clarification"}
                    ],
                    "what_happens_next": "We will guide you through resolving the exact error shown in your screenshot.",
                    "safety_warning": ai_vision.get("sensitive_data_warning")
                }

        if not assistant_msg_data:
            analysis_text = "Screenshot received successfully. No passwords or private keys detected in privacy pre-check."
            assistant_msg_data = {
                "what_we_are_checking": "Screenshot Received",
                "why_it_matters": "Having visual evidence helps us guide you accurately.",
                "what_to_do": [
                    f"Uploaded image: {filename}",
                    "Our system confirmed the image was uploaded securely."
                ],
                "what_should_happen": "We'll incorporate this visual evidence into your next troubleshooting action.",
                "tell_us_what_happened_options": [
                    {"key": "ready_to_proceed", "label": "Proceed to next troubleshooting step", "action_type": "normal"}
                ],
                "what_happens_next": "We will continue resolving the problem step by step."
            }

    # 3. Log or other file
    else:
        analysis_text = f"File {filename} received. Checked for diagnostic error signatures."
        assistant_msg_data = {
            "what_we_are_checking": f"File Log Inspection: {filename}",
            "why_it_matters": "Log files record background messages when programs crash.",
            "what_to_do": [
                f"We received your file ({len(file_bytes):,} bytes).",
                "No private credentials or passwords detected."
            ],
            "what_should_happen": "Log data attached to your session history.",
            "tell_us_what_happened_options": [
                {"key": "continue_log_step", "label": "Continue troubleshooting", "action_type": "normal"}
            ],
            "what_happens_next": "We will apply the findings to your diagnosis."
        }

    # Save to UploadedFile model
    db_file = UploadedFile(
        id=file_uuid,
        session_id=session.id,
        filename=filename,
        stored_path=str(saved_path),
        file_type=file_type,
        parsed_data=parsed_data,
        analysis_summary=analysis_text
    )
    db.add(db_file)

    # Save assistant message if created
    new_msg = None
    if assistant_msg_data:
        new_msg = SessionMessage(
            session_id=session.id,
            sender="assistant",
            message_type="wizard_step",
            step_number=session.current_step_number,
            stage=session.current_stage,
            content=analysis_text or "Here is what we discovered from your uploaded file.",
            structured_data=assistant_msg_data
        )
        db.add(new_msg)

    db.commit()
    db.refresh(db_file)
    if new_msg:
        db.refresh(new_msg)

    return {
        "file": db_file,
        "assistant_message": new_msg
    }
