from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import TroubleshootingSession, SessionMessage, User
from app.schemas import (
    SessionCreate,
    SessionResponse,
    SessionStepRequest,
    ClarificationRequest,
    SessionMessageResponse
)
from app.auth import get_optional_current_user
from app.services.diagnostic_engine import diagnostic_engine
from app.ai.gemini_service import gemini_service

router = APIRouter(prefix="/troubleshoot", tags=["troubleshoot"])

@router.get("/sessions", response_model=List[SessionResponse])
def list_sessions(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    if current_user:
        sessions = db.query(TroubleshootingSession).filter(
            TroubleshootingSession.user_id == current_user.id
        ).order_by(TroubleshootingSession.updated_at.desc()).all()
    else:
        # Return recent guest sessions
        sessions = db.query(TroubleshootingSession).filter(
            TroubleshootingSession.user_id.is_(None)
        ).order_by(TroubleshootingSession.updated_at.desc()).limit(20).all()
    return sessions

@router.post("/sessions", response_model=SessionResponse)
def create_session(
    session_in: SessionCreate,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    mode = session_in.mode or (current_user.preferred_mode if current_user else "beginner")
    session = TroubleshootingSession(
        user_id=current_user.id if current_user else None,
        title=session_in.title or "Troubleshooting Session",
        category=session_in.category or "General",
        problem_description=session_in.problem_description,
        mode=mode,
        status="in_progress",
        current_stage="understanding",
        current_step_number=1,
        diagnostic_data={"confirmed_facts": []}
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Initialize the first step through Diagnostic Engine
    diagnostic_engine.initialize_session(session, db)
    db.refresh(session)
    return session

@router.get("/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(TroubleshootingSession).filter(TroubleshootingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Troubleshooting session not found")
    return session

@router.post("/sessions/{session_id}/step", response_model=SessionMessageResponse)
def advance_step(
    session_id: str,
    req: SessionStepRequest,
    db: Session = Depends(get_db)
):
    session = db.query(TroubleshootingSession).filter(TroubleshootingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    msg = diagnostic_engine.process_step_response(
        session=session,
        db=db,
        chosen_option_key=req.chosen_option_key,
        chosen_option_label=req.chosen_option_label,
        custom_feedback=req.custom_feedback,
        action_type=req.action_type
    )
    return msg

@router.post("/sessions/{session_id}/ask", response_model=SessionMessageResponse)
def ask_clarification(
    session_id: str,
    req: ClarificationRequest,
    db: Session = Depends(get_db)
):
    session = db.query(TroubleshootingSession).filter(TroubleshootingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Save user question message
    user_q = SessionMessage(
        session_id=session.id,
        sender="user",
        message_type="clarification",
        step_number=session.current_step_number,
        stage=session.current_stage,
        content=req.question,
        structured_data={"is_clarification_question": True}
    )
    db.add(user_q)
    db.flush()

    # Find last assistant message to give context
    last_assistant_msg = db.query(SessionMessage).filter(
        SessionMessage.session_id == session.id,
        SessionMessage.sender == "assistant"
    ).order_by(SessionMessage.id.desc()).first()

    current_step_data = last_assistant_msg.structured_data if last_assistant_msg else {}

    # Generate patient response
    explanation = gemini_service.answer_clarification(
        problem_description=session.problem_description,
        current_step_data=current_step_data,
        user_question=req.question,
        mode=session.mode
    )

    resp_msg = SessionMessage(
        session_id=session.id,
        sender="assistant",
        message_type="clarification",
        step_number=session.current_step_number,
        stage=session.current_stage,
        content=explanation,
        structured_data={
            "what_we_are_checking": "Clarification & Assistance",
            "why_it_matters": "We want you to feel completely comfortable and understand every step before taking action.",
            "what_to_do": [
                "Review the explanation above.",
                "Whenever you are ready, continue with the current step."
            ],
            "what_should_happen": "You feel clear and ready to proceed.",
            "tell_us_what_happened_options": [
                {"key": "ready_to_continue", "label": "Thank you, I am ready to continue", "action_type": "normal"}
            ],
            "what_happens_next": "We will return to your current troubleshooting step."
        }
    )
    db.add(resp_msg)
    db.commit()
    db.refresh(resp_msg)
    return resp_msg

@router.patch("/sessions/{session_id}/mode", response_model=SessionResponse)
def switch_session_mode(
    session_id: str,
    mode: str,
    db: Session = Depends(get_db)
):
    if mode not in ["beginner", "pro"]:
        raise HTTPException(status_code=400, detail="Mode must be 'beginner' or 'pro'")
    
    session = db.query(TroubleshootingSession).filter(TroubleshootingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.mode = mode
    db.commit()
    db.refresh(session)
    return session

@router.delete("/sessions/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(TroubleshootingSession).filter(TroubleshootingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"message": "Session deleted successfully"}

@router.get("/sessions/{session_id}/export")
def export_session_report(session_id: str, db: Session = Depends(get_db)):
    from fastapi.responses import HTMLResponse
    session = db.query(TroubleshootingSession).filter(TroubleshootingSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    confirmed_facts = session.diagnostic_data.get("confirmed_facts", []) if session.diagnostic_data else []
    battery = session.diagnostic_data.get("battery_analysis", {}) if session.diagnostic_data else {}
    final_sum = session.final_summary or {}
    tips = final_sum.get("prevention_tips", [
        "Keep your operating system and drivers up to date.",
        "Restart your device at least once a week to clear temporary system caches.",
        "Ensure your laptop has unobstructed ventilation."
    ])
    
    battery_html = ""
    if battery and battery.get("is_valid"):
        battery_html = f"""
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:20px;">
            <h3 style="margin-top:0; color:#0f172a; font-size:16px;">Battery Diagnostic Health</h3>
            <p><strong>Design Capacity:</strong> {battery.get('design_capacity_mwh', 'N/A'):,} mWh</p>
            <p><strong>Full Charge Capacity:</strong> {battery.get('full_charge_capacity_mwh', 'N/A'):,} mWh</p>
            <p><strong>Wear Level:</strong> {battery.get('wear_percentage', 0)}% Lost ({battery.get('health_percentage', 100)}% Health)</p>
            <p style="background:#eff6ff; padding:10px; border-radius:8px; color:#1e40af; margin-bottom:0;">
                {battery.get('plain_english_explanation', '')}
            </p>
        </div>
        """

    facts_list = "".join(f"<li>{f}</li>" for f in confirmed_facts) or "<li>Initial diagnostic checks performed.</li>"
    tips_list = "".join(f"<li>{t}</li>" for t in tips)

    html = f"""<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>IT Diagnostic Report - {session.problem_description}</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }}
            .header {{ border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }}
            .badge {{ display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; background: #eff6ff; color: #1d4ed8; }}
            .solved {{ background: #ecfdf5; color: #047857; }}
            h1 {{ font-size: 24px; margin: 0 0 6px 0; color: #0f172a; }}
            h2 {{ font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; }}
            .meta {{ color: #64748b; font-size: 13px; }}
            ul {{ padding-left: 20px; }}
            li {{ margin-bottom: 6px; }}
            .btn-print {{ background: #2563eb; color: #ffffff; padding: 8px 16px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }}
            @media print {{ .no-print {{ display: none; }} body {{ margin: 0; padding: 0; }} }}
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <h1>TechResolve AI — Diagnostic Summary Report</h1>
                <div class="meta">Case ID: {session.id} • Date: {session.created_at.strftime('%B %d, %Y')} • Category: {session.category}</div>
            </div>
            <button class="btn-print no-print" onclick="window.print()">Print / Save PDF</button>
        </div>

        <div style="background:#f1f5f9; padding:16px; border-radius:12px; margin-bottom:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="badge { 'solved' if session.status == 'solved' else '' }">Status: {session.status.replace('_', ' ').upper()}</span>
                <span class="meta">Mode: {session.mode.upper()}</span>
            </div>
            <h3 style="margin: 10px 0 4px 0; font-size: 17px;">{session.problem_description}</h3>
        </div>

        {battery_html}

        <h2>Confirmed Findings & Diagnostics</h2>
        <ul>{facts_list}</ul>

        <h2>Final Assessment & Resolution</h2>
        <p>{final_sum.get('summary', 'Troubleshooting procedure conducted step-by-step. All safety guidelines followed.')}</p>

        <h2>Preventative Maintenance Tips</h2>
        <ul>{tips_list}</ul>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            Generated by TechResolve AI • Safe, Patient IT Assistance For Everyone
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html)
