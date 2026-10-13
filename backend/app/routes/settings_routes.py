from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.config import settings
from app.ai.gemini_service import gemini_service

router = APIRouter(prefix="/settings", tags=["settings"])

class GeminiKeyUpdateRequest(BaseModel):
    api_key: str

class SettingsStatusResponse(BaseModel):
    gemini_configured: bool
    gemini_model: str
    app_version: str
    active_mode: str
    engine_status: str

@router.get("", response_model=SettingsStatusResponse)
def get_system_settings():
    is_conf = gemini_service.is_configured()
    return {
        "gemini_configured": is_conf,
        "gemini_model": settings.GEMINI_MODEL,
        "app_version": settings.PROJECT_VERSION,
        "active_mode": "beginner",
        "engine_status": "Online (Gemini Cloud AI)" if is_conf else "Active (Local Expert Diagnostic Rules)"
    }

@router.post("/gemini-key")
def update_gemini_key(req: GeminiKeyUpdateRequest):
    key = req.api_key.strip()
    if not key:
        raise HTTPException(status_code=400, detail="API key cannot be empty")
    
    # Test key with client
    try:
        from google import genai
        test_client = genai.Client(api_key=key)
        # Verify key with test call
        response = test_client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents="Say 'OK' if you receive this test."
        )
        if response and response.text:
            # Successfully verified
            settings.GEMINI_API_KEY = key
            gemini_service.api_key = key
            gemini_service._client = test_client
            
            # Save to .env for persistence
            env_file = settings.UPLOAD_DIR.parent / ".env"
            try:
                with open(env_file, "a") as f:
                    f.write(f"\nGEMINI_API_KEY={key}\n")
            except Exception:
                pass

            return {
                "success": True,
                "message": "Gemini API key verified and connected successfully!",
                "gemini_configured": True
            }
        else:
            raise HTTPException(status_code=400, detail="API key was accepted but returned empty response.")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to verify Gemini API Key: {str(e)}"
        )
