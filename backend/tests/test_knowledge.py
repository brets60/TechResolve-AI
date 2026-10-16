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

        # 4. Verify all 35 problems and overheating article
        all_res = client.get("/api/knowledge")
        assert all_res.status_code == 200
        all_articles = all_res.json()
        assert len(all_articles) >= 35

        # Check problem #7 specifically (Computer overheating)
        overheating_art = next((a for a in all_articles if "overheating" in a["title"].lower() or "overheat" in a["title"].lower()), None)
        assert overheating_art is not None
        assert "7." in overheating_art["title"]
        heat_detail_res = client.get(f"/api/knowledge/{overheating_art['id']}")
        assert heat_detail_res.status_code == 200
        heat_detail = heat_detail_res.json()
        assert len(heat_detail["steps"]) >= 3
        assert heat_detail["safety_warning"] is not None

        # Check that all numbers 1 to 35 appear in knowledge base titles
        titles = " ".join(a["title"] for a in all_articles)
        for num in range(1, 36):
            has_num = f"{num}." in titles or f"{num} &" in titles or f"& {num}." in titles
            assert has_num, f"Problem #{num} missing in knowledge base titles"
