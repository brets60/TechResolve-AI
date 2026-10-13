from app.services.battery_parser import parse_battery_report, clean_number

def test_clean_number():
    assert clean_number("52,440 mWh") == 52440
    assert clean_number("21,300") == 21300
    assert clean_number(None) is None
    assert clean_number("") is None

def test_parse_battery_report_html():
    sample_html = """
    <html>
    <body>
        <h1>Battery report</h1>
        <table>
            <tr><td>COMPUTER NAME</td><td>DESKTOP-TEST1</td></tr>
            <tr><td>DESIGN CAPACITY</td><td>50,000 mWh</td></tr>
            <tr><td>FULL CHARGE CAPACITY</td><td>20,000 mWh</td></tr>
            <tr><td>CYCLE COUNT</td><td>350</td></tr>
        </table>
    </body>
    </html>
    """
    res = parse_battery_report(sample_html)
    assert res["is_valid"] is True
    assert res["design_capacity_mwh"] == 50000
    assert res["full_charge_capacity_mwh"] == 20000
    assert res["cycle_count"] == 350
    assert res["health_percentage"] == 40.0
    assert res["wear_percentage"] == 60.0
    assert "Severe Battery Wear" in res["summary_verdict"] or res["wear_percentage"] >= 50
    assert "electricity" in res["plain_english_explanation"]

def test_parse_battery_report_healthy():
    sample_text = """
    DESIGN CAPACITY: 48,000 mWh
    FULL CHARGE CAPACITY: 45,600 mWh
    CYCLE COUNT: 62
    """
    res = parse_battery_report(sample_text)
    assert res["is_valid"] is True
    assert res["health_percentage"] == 95.0
    assert res["needs_replacement"] is False
    assert "Healthy Battery Capacity" in res["summary_verdict"]
