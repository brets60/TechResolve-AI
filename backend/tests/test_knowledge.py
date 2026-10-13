from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.services.knowledge_service import seed_knowledge_base

def test_knowledge_base():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_knowledge_base(db)
    db.close()

    with TestClient(app) as client:
        # 1. Search knowledge base
        res = client.get("/api/knowledge?q=battery")
        assert res.status_code == 200
        articles = res.json()
        assert len(articles) >= 1
        assert any("battery" in (a["title"] + " " + a["summary"] + " " + a["category"]).lower() for a in articles)
        
        # 2. Get article detail
        art_id = articles[0]["id"]
        detail_res = client.get(f"/api/knowledge/{art_id}")
        assert detail_res.status_code == 200
        detail = detail_res.json()
        assert "common_causes" in detail
        assert "signs_to_look_for" in detail
        assert "steps" in detail
        assert "safety_warning" in detail
        assert "technician_trigger" in detail
        
        # 3. Launch interactive troubleshooting from article
        launch_res = client.post(f"/api/knowledge/{art_id}/troubleshoot")
        assert launch_res.status_code == 200
        session_data = launch_res.json()
        assert session_data["status"] == "in_progress"
        assert session_data["current_step_number"] == 1
