from fastapi.testclient import TestClient
from app.main import app

def test_cmd_library():
    with TestClient(app) as client:
        res = client.get("/api/cmd/library")
        assert res.status_code == 200
        items = res.json()
        assert len(items) >= 5
        assert any("batteryreport" in c["command"] for c in items)

def test_cmd_library_search():
    with TestClient(app) as client:
        res = client.get("/api/cmd/library?q=dns")
        assert res.status_code == 200
        items = res.json()
        assert len(items) >= 1
        assert any("flushdns" in c["command"] for c in items)

def test_explain_command():
    with TestClient(app) as client:
        # 1. Known safe command
        res = client.post("/api/cmd/explain", json={"command": "powercfg /batteryreport"})
        assert res.status_code == 200
        data = res.json()
        assert data["name"] == "Generate Battery Health Report"
        assert data["safety_badge"] == "safe"
        assert data["requires_admin"] is False
        assert len(data["flags_explanation"]) >= 1

        # 2. Known admin command
        sfc_res = client.post("/api/cmd/explain", json={"command": "sfc /scannow"})
        assert sfc_res.status_code == 200
        assert sfc_res.json()["requires_admin"] is True

        # 3. Dangerous command check
        dang_res = client.post("/api/cmd/explain", json={"command": "format C: /fs:ntfs"})
        assert dang_res.status_code == 200
        dang_data = dang_res.json()
        assert dang_data["is_dangerous"] is True
        assert dang_data["safety_badge"] == "danger"

def test_translate_cmd_output():
    with TestClient(app) as client:
        # Test SFC clean output
        res1 = client.post("/api/cmd/translate-output", json={
            "command": "sfc /scannow",
            "output_text": "Verification 100% complete. Windows Resource Protection did not find any integrity violations."
        })
        assert res1.status_code == 200
        data1 = res1.json()
        assert data1["status"] == "success"
        assert "Healthy" in data1["summary"]

        # Test Ping 0% loss
        res2 = client.post("/api/cmd/translate-output", json={
            "command": "ping 8.8.8.8",
            "output_text": "Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)"
        })
        assert res2.status_code == 200
        data2 = res2.json()
        assert data2["status"] == "success"
        assert "Active" in data2["summary"]
