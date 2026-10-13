import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_troubleshooting_wizard_workflow():
    client = TestClient(app)
    
    # 1. Start a new session: "My laptop turns off when I unplug the charger."
    create_res = client.post("/api/troubleshoot/sessions", json={
        "title": "Laptop Shuts Down Unplugged",
        "category": "My Laptop or Computer",
        "problem_description": "My laptop turns off when I unplug the charger.",
        "mode": "beginner"
    })
    assert create_res.status_code == 200
    session_data = create_res.json()
    session_id = session_data["id"]
    assert session_data["current_step_number"] == 1
    assert session_data["current_stage"] == "understanding"
    
    # Verify Step 1 message format
    messages = session_data["messages"]
    assert len(messages) >= 1
    step1 = messages[0]["structured_data"]
    assert "what_we_are_checking" in step1
    assert "why_it_matters" in step1
    assert "what_to_do" in step1
    assert "what_should_happen" in step1
    assert "tell_us_what_happened_options" in step1
    assert "what_happens_next" in step1
    
    # 2. User selects answer: "It turns off immediately"
    step2_res = client.post(f"/api/troubleshoot/sessions/{session_id}/step", json={
        "chosen_option_key": "turns_off_instantly",
        "chosen_option_label": "It turns off immediately (instant black screen)",
        "action_type": "normal"
    })
    assert step2_res.status_code == 200
    step2_data = step2_res.json()
    assert step2_data["step_number"] == 2
    
    # 3. User selects answer for Step 2: "Yes, it works normally on charger"
    step3_res = client.post(f"/api/troubleshoot/sessions/{session_id}/step", json={
        "chosen_option_key": "normal_on_charger",
        "chosen_option_label": "Yes, it works completely normally on the charger",
        "action_type": "normal"
    })
    assert step3_res.status_code == 200
    step3_data = step3_res.json()
    assert step3_data["step_number"] == 3
    assert step3_data["stage"] == "checking"
    
    # 4. User requests simpler instructions
    simpler_res = client.post(f"/api/troubleshoot/sessions/{session_id}/step", json={
        "chosen_option_key": "need_simpler",
        "chosen_option_label": "I need simpler instructions",
        "action_type": "need_simpler"
    })
    assert simpler_res.status_code == 200
    simpler_data = simpler_res.json()
    assert "Simplified" in simpler_data["structured_data"]["what_we_are_checking"]

    # 5. User completes fix
    solved_res = client.post(f"/api/troubleshoot/sessions/{session_id}/step", json={
        "chosen_option_key": "yes_fixed",
        "chosen_option_label": "Yes, it is fixed!",
        "action_type": "solved"
    })
    assert solved_res.status_code == 200
    
    # Verify session status is solved
    get_res = client.get(f"/api/troubleshoot/sessions/{session_id}")
    assert get_res.status_code == 200
    final_session = get_res.json()
    assert final_session["status"] == "solved"
