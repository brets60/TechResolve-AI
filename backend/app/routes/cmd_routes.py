from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.services.cmd_service import CMD_LIBRARY, explain_command, translate_cmd_output

router = APIRouter(prefix="/cmd", tags=["cmd"])

class ExplainCommandRequest(BaseModel):
    command: str
    mode: Optional[str] = "beginner"

class TranslateOutputRequest(BaseModel):
    command: str
    output_text: str

@router.get("/library")
def get_cmd_library(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Category filter")
):
    results = CMD_LIBRARY
    if category and category != "All":
        results = [c for c in results if c["category"] == category]
    if q:
        term = q.lower()
        results = [
            c for c in results
            if term in c["command"].lower()
            or term in c["name"].lower()
            or term in c["description"].lower()
            or term in c["category"].lower()
        ]
    return results

@router.post("/explain")
def api_explain_command(req: ExplainCommandRequest):
    if not req.command.strip():
        raise HTTPException(status_code=400, detail="Command string cannot be empty")
    return explain_command(req.command, req.mode or "beginner")

@router.post("/translate-output")
def api_translate_output(req: TranslateOutputRequest):
    if not req.output_text.strip():
        raise HTTPException(status_code=400, detail="Output text cannot be empty")
    return translate_cmd_output(req.command, req.output_text)
