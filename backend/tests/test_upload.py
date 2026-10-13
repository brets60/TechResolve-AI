import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_upload_battery_report():
    with TestClient(app) as client:
        # 1. Create a session
        res = client.post("/api/troubleshoot/sessions", json={
            "title": "Battery Drain Issue",
            "category": "My Laptop or Computer",
            "problem_description": "My laptop shuts off when unplugged",
            "mode": "beginner"
        })
        assert res.status_code == 200
        session_id = res.json()["id"]

        # 2. Upload sample battery report HTML
        sample_html = """
        <html>
        <body>
            <h1>Battery report</h1>
            <table>
                <tr><td>COMPUTER NAME</td><td>LAPTOP-TEST-PC</td></tr>
                <tr><td>DESIGN CAPACITY</td><td>52,000 mWh</td></tr>
                <tr><td>FULL CHARGE CAPACITY</td><td>18,000 mWh</td></tr>
                <tr><td>CYCLE COUNT</td><td>420</td></tr>
            </table>
        </body>
        </html>
        """
        file_obj = io.BytesIO(sample_html.encode("utf-8"))
        upload_res = client.post(
            f"/api/troubleshoot/sessions/{session_id}/upload",
            files={"file": ("battery-report.html", file_obj, "text/html")},
            data={"notes": "Here is my Windows battery report"}
        )
        assert upload_res.status_code == 200
        data = upload_res.json()
        assert "file" in data
        assert data["file"]["file_type"] == "battery_report"
        
        parsed = data["file"]["parsed_data"]
        assert parsed["design_capacity_mwh"] == 52000
        assert parsed["full_charge_capacity_mwh"] == 18000
        assert parsed["health_percentage"] < 50
        assert parsed["needs_replacement"] is True
        assert "Severe Battery Wear" in parsed["summary_verdict"]

        # 3. Verify assistant message was created with battery analysis
        asst_msg = data["assistant_message"]
        assert asst_msg is not None
        assert "Battery Analysis Results" in asst_msg["structured_data"]["what_we_are_checking"]
        assert "52,000 mWh" in asst_msg["structured_data"]["what_to_do"][0]
