from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import KnowledgeArticle, TroubleshootingSession, User
from app.schemas import KnowledgeArticleItem, KnowledgeArticleDetail, SessionResponse
from app.auth import get_optional_current_user
from app.services.knowledge_service import search_articles
from app.services.diagnostic_engine import diagnostic_engine

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

@router.get("", response_model=List[KnowledgeArticleItem])
def get_articles(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Category filter"),
    db: Session = Depends(get_db)
):
    return search_articles(db, query=q, category=category)

@router.get("/{article_id}", response_model=KnowledgeArticleDetail)
def get_article_detail(article_id: str, db: Session = Depends(get_db)):
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Knowledge base article not found")
    return article

@router.post("/{article_id}/troubleshoot", response_model=SessionResponse)
def launch_interactive_troubleshoot(
    article_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Knowledge base article not found")

    mode = current_user.preferred_mode if current_user else "beginner"
    session = TroubleshootingSession(
        user_id=current_user.id if current_user else None,
        title=f"Fixing: {article.title}",
        category=article.category,
        problem_description=f"User launched interactive guide for '{article.title}': {article.summary}",
        mode=mode,
        status="in_progress",
        current_stage="understanding",
        current_step_number=1,
        diagnostic_data={"source_article_id": article_id, "confirmed_facts": []}
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Initialize first step
    diagnostic_engine.initialize_session(session, db)
    db.refresh(session)
    return session
