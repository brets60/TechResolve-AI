import re
from typing import Dict, Any, Optional
from bs4 import BeautifulSoup

def clean_number(value_str: str) -> Optional[int]:
    if not value_str:
        return None
    digits = re.sub(r"[^\d]", "", value_str)
    if digits:
        try:
            return int(digits)
        except ValueError:
            return None
    return None

def parse_battery_report(content: str) -> Dict[str, Any]:
    """
    Parses Windows powercfg /batteryreport HTML or plain text copy-paste.
    Extracts Design Capacity, Full Charge Capacity, Cycle Count,
    and returns a beginner-friendly assessment.
    """
    design_capacity: Optional[int] = None
    full_charge_capacity: Optional[int] = None
    cycle_count: Optional[int] = None
    computer_name: Optional[str] = None

    # Check if content looks like HTML
    if "<html" in content.lower() or "<table" in content.lower() or "<body" in content.lower():
        try:
            soup = BeautifulSoup(content, "html.parser")
            
            for td in soup.find_all(["td", "span", "div"]):
                text = td.get_text().strip()
                if "COMPUTER NAME" in text.upper():
                    nxt = td.find_next_sibling()
                    if nxt:
                        computer_name = nxt.get_text().strip()
                
            for tr in soup.find_all("tr"):
                cells = tr.find_all(["td", "th"])
                if len(cells) >= 2:
                    label = cells[0].get_text().strip().upper()
                    val = cells[1].get_text().strip()
                    if "DESIGN CAPACITY" in label and not design_capacity:
                        design_capacity = clean_number(val)
                    elif "FULL CHARGE CAPACITY" in label and not full_charge_capacity:
                        full_charge_capacity = clean_number(val)
                    elif "CYCLE COUNT" in label and not cycle_count:
                        cycle_count = clean_number(val)
        except Exception:
            pass

    # Fallback to regex on raw text if not found via HTML
    if not design_capacity:
        m = re.search(r"DESIGN\s+CAPACITY\s*[:\t]?\s*([0-9,]+)\s*(?:mWh)?", content, re.IGNORECASE)
        if m:
            design_capacity = clean_number(m.group(1))

    if not full_charge_capacity:
        m = re.search(r"FULL\s+CHARGE\s+CAPACITY\s*[:\t]?\s*([0-9,]+)\s*(?:mWh)?", content, re.IGNORECASE)
        if m:
            full_charge_capacity = clean_number(m.group(1))

    if not cycle_count:
        m = re.search(r"CYCLE\s+COUNT\s*[:\t]?\s*([0-9,]+)", content, re.IGNORECASE)
        if m:
            cycle_count = clean_number(m.group(1))

    if not computer_name:
        m = re.search(r"COMPUTER\s+NAME\s*[:\t]?\s*([A-Za-z0-9_-]+)", content, re.IGNORECASE)
        if m:
            computer_name = m.group(1).strip()

    # Calculate metrics
    health_percentage = None
    wear_percentage = None
    summary_verdict = ""
    plain_english_explanation = ""
    recommendation = ""
    needs_replacement = False

    if design_capacity and full_charge_capacity and design_capacity > 0:
        health_percentage = round((full_charge_capacity / design_capacity) * 100, 1)
        wear_percentage = max(0.0, round(100 - health_percentage, 1))

        if health_percentage <= 50:
            summary_verdict = "Severe Battery Wear"
            needs_replacement = True
            plain_english_explanation = (
                f"Your battery is currently holding only {health_percentage}% of the electricity it was designed for "
                f"({full_charge_capacity:,} mWh remaining out of {design_capacity:,} mWh originally). "
                "Because of this extreme wear, the battery cannot deliver steady voltage when unplugged, "
                "which causes the laptop to shut down instantly or die within minutes."
            )
            recommendation = (
                "The battery has reached the end of its usable life. We recommend replacing the battery with an official "
                "or certified replacement. If you are not comfortable opening your laptop, have a qualified technician replace it."
            )
        elif health_percentage < 75:
            summary_verdict = "Moderate Battery Wear"
            needs_replacement = False
            plain_english_explanation = (
                f"Your battery holds about {health_percentage}% of its original charge "
                f"({full_charge_capacity:,} mWh out of {design_capacity:,} mWh). "
                "It has experienced normal aging over time. You will get shorter unplugged runtime than when it was new, "
                "but it should not turn off instantly unless you are doing heavy gaming or high-power tasks."
            )
            recommendation = (
                "Try calibrating the battery (charge to 100%, run on battery until 10%, recharge fully). "
                "If it still turns off instantly despite holding 50%+ capacity, the problem may be a faulty internal cell or loose connector."
            )
        else:
            summary_verdict = "Healthy Battery Capacity"
            needs_replacement = False
            plain_english_explanation = (
                f"Great news: your battery capacity is still very healthy at {health_percentage}% "
                f"({full_charge_capacity:,} mWh out of {design_capacity:,} mWh original). "
                "This means the sudden shutdowns are very likely NOT caused by a dead battery cell, "
                "but rather an operating system power-management glitch, outdated chipset drivers, or thermal protection."
            )
            recommendation = (
                "Do not buy a new battery yet. Let's check Windows Power Options, reset the battery driver in Device Manager, "
                "and verify temperature sensors."
            )
    else:
        summary_verdict = "Incomplete Battery Data"
        plain_english_explanation = (
            "We were able to read the report, but could not detect both Design Capacity and Full Charge Capacity. "
            "Some laptop models do not report these numbers directly to Windows."
        )
        recommendation = "You can manually type in the two capacity numbers from your report so we can calculate the exact health."

    return {
        "is_valid": bool(design_capacity and full_charge_capacity),
        "computer_name": computer_name,
        "design_capacity_mwh": design_capacity,
        "full_charge_capacity_mwh": full_charge_capacity,
        "cycle_count": cycle_count,
        "health_percentage": health_percentage,
        "wear_percentage": wear_percentage,
        "summary_verdict": summary_verdict,
        "plain_english_explanation": plain_english_explanation,
        "recommendation": recommendation,
        "needs_replacement": needs_replacement
    }
