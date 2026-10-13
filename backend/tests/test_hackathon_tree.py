from app.services.diagnostic_engine import DiagnosticEngine
from app.ai.diagnostic_trees import HACKATHON_SURVIVAL_TREE
from app.services.cmd_service import CMD_LIBRARY

def test_detect_hackathon_tree():
    engine = DiagnosticEngine()
    category, tree = engine.detect_category_and_tree("My hackathon demo crashed right before presentation")
    assert category == "⚡ Hackathon & Dev Skills"
    assert tree == HACKATHON_SURVIVAL_TREE

def test_detect_hackathon_port_error():
    engine = DiagnosticEngine()
    category, tree = engine.detect_category_and_tree("Error: EADDRINUSE address already in use :::3000")
    assert category == "⚡ Hackathon & Dev Skills"
    assert tree == HACKATHON_SURVIVAL_TREE

def test_hackathon_tree_strict_format():
    assert len(HACKATHON_SURVIVAL_TREE) == 4
    for step_num, step in HACKATHON_SURVIVAL_TREE.items():
        assert "stage" in step
        assert "progress_title" in step
        assert "assistant_message" in step
        struct = step["structured_data"]
        assert "what_we_are_checking" in struct
        assert "why_it_matters" in struct
        assert "what_to_do" in struct
        assert "what_should_happen" in struct
        assert "tell_us_what_happened_options" in struct
        assert "what_happens_next" in struct

def test_hackathon_cmd_library_items():
    hackathon_cmds = [c for c in CMD_LIBRARY if c["category"] == "⚡ Hackathon & Rapid Dev"]
    assert len(hackathon_cmds) >= 10
    cmd_names = [c["name"] for c in hackathon_cmds]
    assert any("Kill All Zombie Node.js Processes" in name for name in cmd_names)
    assert any("Emergency Abort Broken Merge Conflict" in name for name in cmd_names)
