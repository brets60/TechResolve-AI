import os
import json
import logging
from typing import Dict, Any, Optional, List
from app.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_BEGINNER = """
You are TechResolve AI, a patient, friendly, and experienced IT technician.
You are helping someone solve their computer or technology problem.
Assume the user has NO technical background.
Follow these strict rules:
1. Speak in warm, clear, everyday English.
2. Never overwhelm the user. Guide them through ONE step at a time.
3. Always explain any technical word immediately in simple terms.
4. Distinguish confirmed facts from possible explanations. Do not guess wildly.
5. If recommending a command or setting, explain what it does and reassure them it is safe.
6. Provide an alternative if they cannot find a tool.
7. SAFETY FIRST: Warn them if an action could erase files or if hardware (like a swollen battery) is dangerous.
8. Output MUST be a valid JSON object matching the required schema.

Required JSON Schema:
{
  "stage": "understanding" | "checking" | "trying_solution" | "confirming_fix",
  "progress_title": "Short title of current stage",
  "assistant_message": "Warm, reassuring explanation in plain English",
  "structured_data": {
    "what_we_are_checking": "Clear explanation of the test/purpose",
    "why_it_matters": "Why this test matters in plain English",
    "what_to_do": ["Step 1...", "Step 2..."],
    "what_should_happen": "Expected outcome",
    "tell_us_what_happened_options": [
      {"key": "opt1", "label": "Clear user response label", "action_type": "normal"},
      {"key": "opt_simpler", "label": "I need simpler instructions", "action_type": "need_simpler"},
      {"key": "opt_err", "label": "Something went wrong", "action_type": "error"}
    ],
    "what_happens_next": "How the result affects the next step",
    "what_we_know_so_far": ["Fact 1", "Fact 2"],
    "what_we_need_to_check": ["Item 1"],
    "next_action_title": "Clear action button label",
    "safety_warning": "Optional warning if relevant",
    "command_to_run": "Optional command if applicable",
    "command_explanation": "Optional explanation of command",
    "allows_file_upload": false,
    "upload_hint": "Optional hint for file upload"
  }
}
"""

SYSTEM_PROMPT_PRO = """
You are TechResolve AI in IT Professional Mode.
Provide detailed technical analysis, root-cause diagnostics, relevant CLI commands (PowerShell, Bash, sysinternals), error log inspection, and configuration analysis.
Still output the response as a strict JSON object matching the same schema structure.
"""

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client = None
        if self.api_key:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Client: {e}")

    def is_configured(self) -> bool:
        return bool(self.api_key and self._client)

    def generate_wizard_step(
        self,
        problem_description: str,
        session_history: List[Dict[str, Any]],
        current_step: int,
        user_feedback: Optional[str] = None,
        mode: str = "beginner",
        uploaded_context: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        if not self.is_configured():
            return None

        prompt = f"""
USER'S MAIN PROBLEM: {problem_description}
CURRENT STEP NUMBER: {current_step}
USER MODE: {mode}

RECENT CONVERSATION & STEPS SO FAR:
{json.dumps(session_history, indent=2, default=str)}

USER'S LATEST RESPONSE / ACTION:
{user_feedback or 'User started the troubleshooting session.'}
"""
        if uploaded_context:
            prompt += f"\nUPLOADED FILE ANALYSIS:\n{uploaded_context}"

        prompt += "\n\nRespond ONLY with the valid JSON object described in system instructions."

        system_instruction = SYSTEM_PROMPT_PRO if mode == "pro" else SYSTEM_PROMPT_BEGINNER

        try:
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "system_instruction": system_instruction,
                    "response_mime_type": "application/json"
                }
            )
            raw_text = response.text.strip()
            # Parse JSON
            data = json.loads(raw_text)
            return data
        except Exception as e:
            logger.error(f"Gemini API generation error: {e}")
            return None

    def answer_clarification(
        self,
        problem_description: str,
        current_step_data: Dict[str, Any],
        user_question: str,
        mode: str = "beginner"
    ) -> str:
        if not self.is_configured():
            return (
                f"I'm here to help! Regarding your question: '{user_question}' — "
                "this step is completely safe and won't harm your device or files. "
                "If you feel unsure about any instruction, you can click 'I need simpler instructions' "
                "or choose an alternative check."
            )

        prompt = f"""
The user is at this troubleshooting step:
{json.dumps(current_step_data, indent=2, default=str)}

User asked: "{user_question}"

Respond warmly in 2-4 sentences in simple English. Reassure them, explain any confusing word, and clarify what they should do next.
"""
        try:
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "system_instruction": "You are a patient, encouraging IT support technician explaining things simply."
                }
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini clarification error: {e}")
            return "Don't worry! This check is safe to perform. If you'd like simpler guidance, click 'I need simpler instructions'."

    def analyze_image_or_screenshot(
        self,
        image_bytes: bytes,
        mime_type: str,
        problem_description: str
    ) -> Optional[Dict[str, Any]]:
        if not self.is_configured():
            return None
        
        prompt = f"""
The user uploaded this screenshot/image while troubleshooting: "{problem_description}".
Analyze the image carefully:
1. What error message, dialog, or symptom is shown?
2. What does it mean in simple, everyday English?
3. What is the safest next action?
Remember to check for any visible sensitive information (passwords, email addresses, keys) and warn the user.

Output JSON:
{{
  "detected_text": "Text found in screenshot",
  "plain_english_meaning": "What this means in simple words",
  "recommended_next_action": "What to do next",
  "sensitive_data_warning": "Warning if passwords/private info visible, otherwise null"
}}
"""
        try:
            from google.genai import types
            part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=[part, prompt],
                config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text.strip())
        except Exception as e:
            logger.error(f"Gemini vision error: {e}")
            return None

gemini_service = GeminiService()
