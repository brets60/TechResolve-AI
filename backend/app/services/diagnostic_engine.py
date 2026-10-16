import logging
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session

from app.models import TroubleshootingSession, SessionMessage
from app.ai.diagnostic_trees import (
    BATTERY_SHUTDOWN_TREE,
    WIFI_NO_INTERNET_TREE,
    SLOW_COMPUTER_TREE,
    APP_WONT_OPEN_TREE,
    BSOD_CRASH_TREE,
    OVERHEATING_FAN_TREE,
    PRINTER_OFFLINE_TREE,
    HACKATHON_SURVIVAL_TREE
)
from app.ai.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class DiagnosticEngine:
    def detect_category_and_tree(self, text: str, category: Optional[str] = None):
        t = (text or "").lower()
        cat = (category or "").lower()

        if "hackathon" in t or "hackathon" in cat or "eaddrinuse" in t or ("port" in t and "use" in t) or "cors" in t or "merge conflict" in t or "pitch" in t or "demo crash" in t or "rate limit" in t:
            return "⚡ Hackathon & Dev Skills", HACKATHON_SURVIVAL_TREE
        elif "blue screen" in t or "bsod" in t or "stop code" in t or ("crash" in t and "screen" in t) or "boot" in t or "restarting" in t or "reboot" in t:
            return "Windows Repair & BSOD", BSOD_CRASH_TREE
        elif "overheat" in t or "heat" in t or "hot" in t or "loud fan" in t or "fan noise" in t or "unusual noise" in t or "fan" in t:
            return "Cooling & Thermal", OVERHEATING_FAN_TREE
        elif "printer" in t or "print" in t or "spooler" in t or "keyboard" in t or "mouse" in t or "touchpad" in t or "webcam" in t or "camera" in t or "usb" in t or "monitor" in t or "external screen" in t or "sound" in t or "audio" in t or "speaker" in t or "microphone" in t or "bluetooth" in t or "printer" in cat:
            return "Printers & Devices", PRINTER_OFFLINE_TREE
        elif "turn on" in t or "no power" in t or "black screen" in t or "battery" in t or "unplug" in t or "charger" in t or "charging" in t or "power" in t or "shut down" in t or "turns off" in t or "drain" in t or "cmos" in t or "date and time" in t or "laptop" in cat:
            return "Battery & Power", BATTERY_SHUTDOWN_TREE
        elif "wifi" in t or "wi-fi" in t or "internet" in t or "network" in t or "connection" in t or "ping" in t or "bandwidth" in t or "hotspot" in t or "internet" in cat:
            return "Internet & Network", WIFI_NO_INTERNET_TREE
        elif "slow" in t or "lag" in t or "freeze" in t or "freezing" in t or "hang" in t or "ram" in t or "memory" in t or "cpu" in t or "disk" in t or "storage" in t or "hard drive" in t or "ssd" in t or "flicker" in t:
            return "System Performance", SLOW_COMPUTER_TREE
        elif "virus" in t or "malware" in t or "popup" in t or "pop-up" in t or "adware" in t or "ransomware" in t or "password" in t or "locked out" in t or "pin" in t or "security" in cat:
            return "Security & Accounts", APP_WONT_OPEN_TREE
        elif "app" in t or "application" in t or "program" in t or "software" in t or "open" in t or "install" in t or "update" in t or "deleted" in t or "recover" in t:
            return "Software & Apps", APP_WONT_OPEN_TREE
        else:
            return "General IT Issue", BATTERY_SHUTDOWN_TREE

    def initialize_session(self, session: TroubleshootingSession, db: Session) -> SessionMessage:
        category, tree = self.detect_category_and_tree(session.problem_description, session.category)
        session.category = category
        session.current_step_number = 1
        session.current_stage = "understanding"
        session.status = "in_progress"

        step_data = None
        # Try Gemini if configured
        if gemini_service.is_configured():
            try:
                ai_step = gemini_service.generate_wizard_step(
                    problem_description=session.problem_description,
                    session_history=[],
                    current_step=1,
                    mode=session.mode
                )
                if ai_step and "structured_data" in ai_step:
                    step_data = ai_step
            except Exception as e:
                logger.warning(f"Initial step AI error, falling back to tree: {e}")

        # Fallback to predefined tree
        if not step_data:
            step_data = tree.get(1, BATTERY_SHUTDOWN_TREE[1])

        message = SessionMessage(
            session_id=session.id,
            sender="assistant",
            message_type="wizard_step",
            step_number=1,
            stage=step_data.get("stage", "understanding"),
            content=step_data.get("assistant_message", "Let's investigate this together."),
            structured_data=step_data.get("structured_data", {})
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        return message

    def process_step_response(
        self,
        session: TroubleshootingSession,
        db: Session,
        chosen_option_key: Optional[str],
        chosen_option_label: Optional[str],
        custom_feedback: Optional[str],
        action_type: str = "advance"
    ) -> SessionMessage:
        user_text = chosen_option_label or custom_feedback or "Proceeded to next step"
        
        # 1. Record user's action
        user_msg = SessionMessage(
            session_id=session.id,
            sender="user",
            message_type="user_response",
            step_number=session.current_step_number,
            stage=session.current_stage,
            content=user_text,
            structured_data={"chosen_key": chosen_option_key, "action_type": action_type}
        )
        db.add(user_msg)
        db.flush()

        # Update diagnostic data facts
        diag_data = dict(session.diagnostic_data or {})
        facts = list(diag_data.get("confirmed_facts", []))
        if chosen_option_label:
            facts.append(chosen_option_label)
        diag_data["confirmed_facts"] = facts
        session.diagnostic_data = diag_data

        # 2. Check for special action types
        if action_type == "solved" or chosen_option_key in ["yes_fixed", "app_opened_now", "reconnected_and_works"]:
            session.status = "solved"
            session.current_stage = "confirming_fix"
            session.final_summary = {
                "outcome": "Resolved",
                "summary": "The troubleshooting steps successfully resolved the issue.",
                "confirmed_facts": facts,
                "prevention_tips": [
                    "Keep your operating system and drivers up to date.",
                    "Restart your device at least once a week to clear temporary system caches.",
                    "Avoid using your laptop on soft blankets or pillows to allow proper ventilation."
                ]
            }
            db.commit()

            msg = SessionMessage(
                session_id=session.id,
                sender="assistant",
                message_type="report",
                step_number=session.current_step_number,
                stage="confirming_fix",
                content="🎉 Wonderful news! Your problem has been resolved. Here is a summary of what we fixed together.",
                structured_data={
                    "what_we_are_checking": "Troubleshooting Complete — Problem Solved!",
                    "why_it_matters": "Understanding what caused the issue helps you prevent it from happening again in the future.",
                    "what_to_do": [
                        "Review the final summary below.",
                        "You can save or export this report anytime from your dashboard."
                    ],
                    "what_should_happen": "Your device continues operating reliably.",
                    "tell_us_what_happened_options": [],
                    "what_happens_next": "You are all set! You can return to the dashboard or start a new diagnosis whenever you need.",
                    "what_we_know_so_far": facts,
                    "what_we_need_to_check": ["Everything verified working."]
                }
            )
            db.add(msg)
            db.commit()
            db.refresh(msg)
            return msg

        if action_type == "need_simpler":
            # Provide simpler instructions without advancing the step counter
            simpler_msg = self._generate_simpler_instructions(session)
            db.add(simpler_msg)
            db.commit()
            db.refresh(simpler_msg)
            return simpler_msg

        if action_type == "tool_missing":
            # Tool missing (e.g. Command Prompt)
            missing_tool_msg = self._generate_tool_alternative(session)
            db.add(missing_tool_msg)
            db.commit()
            db.refresh(missing_tool_msg)
            return missing_tool_msg

        # 3. Advance to next step
        next_step = session.current_step_number + 1
        session.current_step_number = next_step
        _, tree = self.detect_category_and_tree(session.problem_description, session.category)

        # Check if Gemini can generate dynamic next step
        step_data = None
        if gemini_service.is_configured():
            try:
                history = [
                    {"sender": m.sender, "content": m.content, "structured": m.structured_data}
                    for m in session.messages[-6:]
                ]
                ai_step = gemini_service.generate_wizard_step(
                    problem_description=session.problem_description,
                    session_history=history,
                    current_step=next_step,
                    user_feedback=user_text,
                    mode=session.mode
                )
                if ai_step and "structured_data" in ai_step:
                    step_data = ai_step
            except Exception as e:
                logger.warning(f"AI next step error: {e}")

        # Fallback to tree
        if not step_data:
            if next_step in tree:
                step_data = tree[next_step]
            else:
                # Reached end of tree
                step_data = {
                    "stage": "confirming_fix",
                    "progress_title": "Summary & Next Steps",
                    "assistant_message": "We have completed the primary diagnostic checks. Based on our investigation, here is our recommendation.",
                    "structured_data": {
                        "what_we_are_checking": "Final Technical Assessment",
                        "why_it_matters": "When software and basic driver steps do not solve the issue, professional hardware inspection is the safest choice.",
                        "what_to_do": [
                            "If the issue persists, consult an authorized repair center.",
                            "Do not attempt to open sealed battery packs or power supplies yourself."
                        ],
                        "what_should_happen": "A qualified technician can test individual components with multimeter and bench tools.",
                        "tell_us_what_happened_options": [
                            {"key": "yes_fixed", "label": "The problem resolved", "action_type": "solved"},
                            {"key": "need_more_help", "label": "I need more help / search Knowledge Base", "action_type": "not_solved"}
                        ],
                        "what_happens_next": "You can keep this diagnosis saved in your dashboard for reference.",
                        "what_we_know_so_far": facts,
                        "what_we_need_to_check": ["Physical hardware inspection if unresolved."]
                    }
                }

        session.current_stage = step_data.get("stage", session.current_stage)
        db.commit()

        msg = SessionMessage(
            session_id=session.id,
            sender="assistant",
            message_type="wizard_step",
            step_number=next_step,
            stage=session.current_stage,
            content=step_data.get("assistant_message", "Here is what we should do next."),
            structured_data=step_data.get("structured_data", {})
        )
        db.add(msg)
        db.commit()
        db.refresh(msg)
        return msg

    def _generate_simpler_instructions(self, session: TroubleshootingSession) -> SessionMessage:
        return SessionMessage(
            session_id=session.id,
            sender="assistant",
            message_type="clarification",
            step_number=session.current_step_number,
            stage=session.current_stage,
            content="No problem at all! Let's make this much simpler and easier to follow.",
            structured_data={
                "what_we_are_checking": "Simplified Step-by-Step Instructions",
                "why_it_matters": "Technology should be easy to understand. We'll break this down into tiny, comfortable steps.",
                "what_to_do": [
                    "Take your time — there is no rush.",
                    "1. Press the key with the Windows logo on the bottom-left of your keyboard.",
                    "2. Release the key, then type the letters c m d on your keyboard.",
                    "3. Click the black icon named 'Command Prompt'.",
                    "4. If you don't want to type anything, you can also just upload a photo of your screen using the button below!"
                ],
                "what_should_happen": "A black window with white text appears on your screen.",
                "tell_us_what_happened_options": [
                    {"key": "got_it_now", "label": "I got it! Ready to proceed", "action_type": "normal"},
                    {"key": "still_confused", "label": "I would prefer an alternative method", "action_type": "tool_missing"}
                ],
                "what_happens_next": "Once you have it open, we'll guide you through the next step."
            }
        )

    def _generate_tool_alternative(self, session: TroubleshootingSession) -> SessionMessage:
        return SessionMessage(
            session_id=session.id,
            sender="assistant",
            message_type="clarification",
            step_number=session.current_step_number,
            stage=session.current_stage,
            content="Can't find Command Prompt? Don't worry, here is an easy alternative that doesn't need typing commands.",
            structured_data={
                "what_we_are_checking": "Alternative GUI Method (Using Windows Settings)",
                "why_it_matters": "You don't need to type commands to get help. Windows has friendly visual buttons.",
                "what_to_do": [
                    "1. Open Windows Settings (Press Windows Key + I on your keyboard).",
                    "2. Click on 'System', then click 'Power & battery'.",
                    "3. Look at the 'Battery usage' graph.",
                    "4. Tell us if your battery percentage shows any sudden drops to 0%."
                ],
                "what_should_happen": "Windows Settings shows your battery levels and which apps used power.",
                "tell_us_what_happened_options": [
                    {"key": "found_in_settings", "label": "I found it in Settings and can see battery stats", "action_type": "normal"},
                    {"key": "upload_screen", "label": "I will upload a screenshot of this screen instead", "action_type": "normal"}
                ],
                "what_happens_next": "We will use your visual observations to diagnose the problem."
            }
        )

diagnostic_engine = DiagnosticEngine()
