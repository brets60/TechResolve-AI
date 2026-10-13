from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models import KnowledgeArticle

INITIAL_ARTICLES = [
    {
        "id": "battery-unplugged-shutdown",
        "title": "Laptop Turns Off Immediately When Unplugged",
        "category": "Battery & Power",
        "summary": "Your laptop works fine when plugged into the wall charger, but dies or shuts down instantly when the cable is removed.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["battery", "power", "shutdown", "laptop", "charger"],
        "common_causes": [
            "Battery chemical wear (battery cannot hold enough electrical voltage).",
            "Loose or oxidized battery connection pins.",
            "Corrupted Windows battery driver (ACPI-Compliant Control Method Battery).",
            "Motherboard charging circuit or MOSFET failure."
        ],
        "signs_to_look_for": [
            "Laptop instantly goes black the second the power cable is pulled.",
            "Battery icon shows '100% Plugged in' or 'No battery detected'.",
            "Laptop will not turn on at all without being plugged into the wall."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Inspect the physical battery and charging port",
                "instruction": "Look at your laptop's charging port and bottom casing. If your laptop has a removable battery, take it out, blow away dust, and reseat it firmly.",
                "why": "Dust or a loose connection can prevent power transfer."
            },
            {
                "step": 2,
                "title": "Generate a Windows Battery Health Report",
                "instruction": "Open Start, type 'cmd', open Command Prompt, and enter: powercfg /batteryreport. Check the Full Charge Capacity compared to Design Capacity.",
                "why": "Reveals whether the battery has permanently lost electrical capacity."
            },
            {
                "step": 3,
                "title": "Reinstall the Battery Driver",
                "instruction": "Open Device Manager > Batteries > Right click 'Microsoft ACPI-Compliant Control Method Battery' > Uninstall > Restart laptop.",
                "why": "Fixes software glitches where Windows loses contact with the battery."
            }
        ],
        "expected_results": "If it is a software glitch, your laptop will stay awake on battery after restarting. If the battery capacity is below 20%, a replacement battery will be required.",
        "safety_warning": "CRITICAL SAFETY WARNING: If your battery is swollen, bulging, lifting the trackpad, or smells like nail polish remover, STOP CHARGING IMMEDIATELY. Disconnect the charger and do not puncture the battery.",
        "technician_trigger": "Contact an authorized repair shop if: the battery is swollen, the laptop does not turn on even with the charger plugged in, or replacing the battery does not resolve the shutdown."
    },
    {
        "id": "wifi-connected-no-internet",
        "title": "Wi-Fi Connected But No Internet Access",
        "category": "Internet & Network",
        "summary": "Your computer shows full Wi-Fi bars with a yellow warning triangle or says 'Connected, no internet'.",
        "difficulty": "Beginner",
        "estimated_time": "3-7 mins",
        "tags": ["wifi", "internet", "network", "dns", "router"],
        "common_causes": [
            "Your home router lost internet connection with your Internet Service Provider (ISP).",
            "Outdated or corrupt DNS cache on your computer.",
            "Expired IP address lease.",
            "Third-party VPN or antivirus web filter blocking outgoing traffic."
        ],
        "signs_to_look_for": [
            "Yellow triangle or globe icon in the Windows taskbar.",
            "Browsers display 'DNS_PROBE_FINISHED_NO_INTERNET' or 'Server IP address could not be found'.",
            "Chat apps like Discord or Slack might still connect while web pages fail."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Check if other devices have internet",
                "instruction": "Check your smartphone on the same Wi-Fi with cellular data turned off. If your phone also has no internet, restart your home router by unplugging it for 30 seconds.",
                "why": "Quickly isolates whether the issue is your computer or your whole house."
            },
            {
                "step": 2,
                "title": "Turn Wi-Fi off and back on",
                "instruction": "Click the Wi-Fi icon near your clock, toggle it OFF, wait 10 seconds, then toggle it ON.",
                "why": "Forces a clean re-negotiation of network credentials with your router."
            },
            {
                "step": 3,
                "title": "Flush DNS and Reset Winsock",
                "instruction": "Open Command Prompt and enter: ipconfig /flushdns followed by netsh winsock reset. Restart your computer.",
                "why": "Clears expired website phonebook entries and resets the Windows networking stack."
            }
        ],
        "expected_results": "Websites load normally without delay after the network stack reset.",
        "safety_warning": "Never download third-party 'network booster' or 'internet accelerator' programs from unfamiliar websites.",
        "technician_trigger": "Call your Internet Service Provider if all lights on your router are red or flashing orange, or if none of the devices in your home can connect."
    },
    {
        "id": "slow-computer-speedup",
        "title": "Computer Running Extremely Slow or Freezing",
        "category": "System Performance",
        "summary": "Your computer takes minutes to respond, programs take forever to open, or the mouse cursor constantly freezes.",
        "difficulty": "Beginner",
        "estimated_time": "10-15 mins",
        "tags": ["slow", "performance", "cpu", "disk", "memory", "speed"],
        "common_causes": [
            "Too many background programs launching at startup.",
            "Storage drive is almost completely full (less than 10% free space).",
            "Mechanical hard drive (HDD) showing signs of age or bad sectors.",
            "Processor thermal throttling due to dust clogged in fans."
        ],
        "signs_to_look_for": [
            "Task Manager shows 100% Disk or 100% CPU usage constantly.",
            "Fans running loudly even when no apps are open.",
            "Programs display '(Not Responding)' across the title bar."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Inspect Task Manager",
                "instruction": "Press Ctrl + Shift + Esc. Look at the CPU, Memory, and Disk columns to identify which program is consuming 90%+ resources.",
                "why": "Identifies runaway background processes immediately."
            },
            {
                "step": 2,
                "title": "Disable unnecessary Startup apps",
                "instruction": "Inside Task Manager, click 'Startup apps'. Right-click non-essential programs (like game launchers or chat apps) and choose 'Disable'.",
                "why": "Frees up gigabytes of RAM from being wasted upon startup."
            },
            {
                "step": 3,
                "title": "Run Disk Cleanup",
                "instruction": "Open Start menu, type 'Disk Cleanup', select drive C:, check 'Temporary files' and click OK.",
                "why": "Clears gigabytes of obsolete update backups and cached junk."
            }
        ],
        "expected_results": "Computer boot time drops significantly, and apps open with crisp responsiveness.",
        "safety_warning": "Do not delete files directly from C:\\Windows or system folders without knowing what they are.",
        "technician_trigger": "Contact a professional if you hear clicking or grinding sounds from inside the computer (indicating a failing mechanical hard drive)."
    },
    {
        "id": "app-wont-open-crashes",
        "title": "Application Won't Open or Freezes on Launch",
        "category": "Software & Apps",
        "summary": "You double-click an application, but nothing happens, or it flashes on screen for a second and disappears.",
        "difficulty": "Beginner",
        "estimated_time": "5 mins",
        "tags": ["app", "crash", "wont open", "software", "freeze"],
        "common_causes": [
            "A frozen background instance of the application is already stuck in memory.",
            "Missing administrator permissions to write to local configuration files.",
            "Corrupt application cache or missing Visual C++ redistributable runtime.",
            "Antivirus software falsely blocked or quarantined the executable."
        ],
        "signs_to_look_for": [
            "Mouse cursor spins for 2 seconds and stops.",
            "Error dialog saying 'The application was unable to start correctly (0xc000007b)' or 'VCRUNTIME140.dll was not found'.",
            "App appears in Task Manager under Background Processes but has no window."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Kill hanging background processes",
                "instruction": "Press Ctrl + Shift + Esc to open Task Manager. Look for the application in the list, right-click it, and select 'End task'.",
                "why": "Windows will not open a new instance if a previous one is frozen in memory."
            },
            {
                "step": 2,
                "title": "Run as Administrator",
                "instruction": "Right click the app icon on your desktop or Start menu, and click 'Run as administrator'.",
                "why": "Gives the app needed permissions to update database or config files."
            },
            {
                "step": 3,
                "title": "Repair the app via Windows Settings",
                "instruction": "Open Windows Settings > Apps > Installed apps > Click the three dots next to the app > Advanced options > Click 'Repair' or 'Reset'.",
                "why": "Windows can automatically restore corrupted app binaries without losing your files."
            }
        ],
        "expected_results": "The application launches properly into its main window.",
        "safety_warning": "Always download software updates from the official publisher website, never from sponsored search ads.",
        "technician_trigger": "Consult your IT department or the software vendor if the crash produces an unhandled memory fault or license server timeout."
    },
    {
        "id": "overheating-loud-fan",
        "title": "Computer Getting Dangerously Hot with Loud Fan Noise",
        "category": "System Performance",
        "summary": "Laptop feels burning hot on your lap, and fans spin at maximum speed sounding like an airplane taking off.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["overheating", "fan", "heat", "thermal", "loud"],
        "common_causes": [
            "Dust accumulation blocking internal heatsink vents.",
            "Using the laptop on a bed, blanket, or pillow blocking intake airflow.",
            "High CPU background crypto-mining malware or runaway loop.",
            "Dried up thermal paste between processor and heatsink."
        ],
        "signs_to_look_for": [
            "Bottom or keyboard feels uncomfortably hot to touch.",
            "Laptop suddenly shuts off with no warning while playing games or rendering video (thermal shutdown).",
            "Computer throttles and slows to a crawl under load."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Check laptop surface and airflow",
                "instruction": "Immediately move the laptop to a flat, hard surface (like a clean wooden desk). Elevate the back of the laptop slightly with a book or bottle cap to let air circulate underneath.",
                "why": "Soft surfaces like blankets suffocate cooling vents, trapping heat."
            },
            {
                "step": 2,
                "title": "Gently clean exhaust vents",
                "instruction": "Turn off the laptop and use a can of compressed air held upright to gently blow short bursts of air into the side and bottom vents.",
                "why": "Removes dust blankets trapped on heatsink cooling fins."
            },
            {
                "step": 3,
                "title": "Switch Power Mode to Balanced",
                "instruction": "Open Windows Settings > System > Power & battery > Set 'Power mode' to 'Balanced' instead of 'Best performance'.",
                "why": "Lowers peak CPU voltage spikes that generate intense heat."
            }
        ],
        "expected_results": "Temperatures drop by 15-25°C and fans slow down to quiet whisper levels.",
        "safety_warning": "Never use a vacuum cleaner directly against laptop circuit boards (static electricity risk). Do not open the laptop if under manufacturer warranty.",
        "technician_trigger": "Visit a certified repair shop if the laptop shuts off within 2 minutes of turning on, or if the fan is buzzing/grinding (broken bearing)."
    },
    {
        "id": "printer-offline-error",
        "title": "Printer Shows Offline and Won't Print",
        "category": "Printers & Devices",
        "summary": "You send documents to print, but nothing prints, and Windows says the printer is 'Offline' or 'Paused'.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["printer", "offline", "spooler", "paper", "usb"],
        "common_causes": [
            "Windows Print Spooler service got stuck with a corrupt print job.",
            "Printer Wi-Fi connection dropped or IP address changed.",
            "Loose USB cable or power adapter.",
            "'Use Printer Offline' checkbox accidentally toggled in print queue."
        ],
        "signs_to_look_for": [
            "Status in Settings says 'Offline' or 'Error'.",
            "Documents sit in the print queue with status 'Printing' indefinitely.",
            "Printer power light is blinking."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Check printer physical status",
                "instruction": "Ensure printer has paper loaded, ink cartridges seated, and no paper jam errors. Power cycle the printer by turning it off, waiting 20 seconds, and turning it back on.",
                "why": "Clears internal printer memory cache."
            },
            {
                "step": 2,
                "title": "Uncheck 'Use Printer Offline'",
                "instruction": "Open Windows Settings > Bluetooth & devices > Printers & scanners > Click your printer > Open print queue > Click 'Printer' in menu > Ensure 'Use Printer Offline' is UNCHECKED.",
                "why": "Accidental offline toggle is one of the most common causes."
            },
            {
                "step": 3,
                "title": "Restart Windows Print Spooler",
                "instruction": "Press Windows + R, type 'services.msc', scroll down to 'Print Spooler', right-click it, and click 'Restart'.",
                "why": "Resets the Windows printing engine and unblocks jammed queues."
            }
        ],
        "expected_results": "Printer status updates to 'Ready' and pending documents print out cleanly.",
        "safety_warning": "Do not yank paper forcefully if jammed; pull gently in the direction of the paper path to avoid tearing gears.",
        "technician_trigger": "Contact the manufacturer if the printer displays a physical hardware error code (e.g. 50.4 Fuser Error or B200)."
    },
    {
        "id": "blue-screen-bsod",
        "title": "Windows Blue Screen of Death (BSOD) Error",
        "category": "System Performance",
        "summary": "Your computer suddenly crashes to a blue screen with a sad face :( and restarts automatically.",
        "difficulty": "Intermediate",
        "estimated_time": "10-20 mins",
        "tags": ["bsod", "blue screen", "crash", "windows", "kernel"],
        "common_causes": [
            "Faulty or outdated device driver (especially GPU graphics or Wi-Fi).",
            "Failing RAM memory stick.",
            "Corrupted Windows system files following an incomplete update.",
            "Overheating or unstable overclocking settings."
        ],
        "signs_to_look_for": [
            "Stop codes such as: CRITICAL_PROCESS_DIED, IRQL_NOT_LESS_OR_EQUAL, SYSTEM_SERVICE_EXCEPTION, or MEMORY_MANAGEMENT.",
            "Unexpected reboots while working."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Note down the Stop Code",
                "instruction": "When the blue screen appears, write down the STOP CODE or QR code text at the bottom. You can upload a photo of it to TechResolve AI for analysis.",
                "why": "The stop code points directly to the guilty driver or component."
            },
            {
                "step": 2,
                "title": "Run Windows System File Checker (SFC)",
                "instruction": "Open Command Prompt as Administrator and enter: sfc /scannow. Wait for the 100% verification.",
                "why": "Automatically detects and replaces corrupted Windows core system files."
            },
            {
                "step": 3,
                "title": "Run Windows Memory Diagnostic",
                "instruction": "Press Windows + R, type 'mdsched.exe', press Enter, and choose 'Restart now and check for problems'.",
                "why": "Scans your computer's RAM memory sticks for defective sectors."
            }
        ],
        "expected_results": "Corrupt files are repaired, or the failing driver is pinpointed for an update.",
        "safety_warning": "Back up your personal files (photos, documents) to a cloud drive or USB stick immediately if blue screens happen frequently.",
        "technician_trigger": "Seek professional help if Memory Diagnostic reports hardware errors or if the computer cannot boot into Windows at all."
    },
    {
        "id": "port-already-in-use",
        "title": "Programming Error: Address or Port Already in Use",
        "category": "Programming & Databases",
        "summary": "When starting a dev server (Node, Vite, Flask, Docker, etc.), you get 'EADDRINUSE: address already in use :::3000' or 5000/8000.",
        "difficulty": "Intermediate",
        "estimated_time": "3 mins",
        "tags": ["programming", "port", "eaddrinuse", "node", "python", "developer"],
        "common_causes": [
            "A previous development server process didn't terminate cleanly when you closed your terminal.",
            "Another program (like Skype, IIS, or Spotify) is listening on that port.",
            "Docker container running in the background."
        ],
        "signs_to_look_for": [
            "Error: listen EADDRINUSE: address already in use :::3000 or :::5173 or :::8000.",
            "Terminal crashes immediately upon running npm start / python run.py."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Find the process ID using the port (Windows)",
                "instruction": "Open Command Prompt and run: netstat -ano | findstr :3000 (replace 3000 with your port number). Note the PID number at the far right.",
                "why": "Identifies the exact process holding the port hostage."
            },
            {
                "step": 2,
                "title": "Terminate the zombie process",
                "instruction": "Run: taskkill /PID <number> /F (replace <number> with the PID from step 1).",
                "why": "Instantly releases the occupied port so your dev server can bind to it."
            },
            {
                "step": 3,
                "title": "Alternative: Change port in config",
                "instruction": "Change PORT=3001 in your .env or launch command (e.g. npm run dev -- --port 3001).",
                "why": "Avoids port conflicts entirely."
            }
        ],
        "expected_results": "Your development server starts up smoothly with listening status.",
        "safety_warning": "Double check the PID before running taskkill to make sure you are not terminating an essential system service.",
        "technician_trigger": "Consult your lead developer or DevOps if system-reserved low ports (<1024) are blocked by corporate firewall policies."
    },
    {
        "id": "hackathon-survival-guide",
        "title": "Hackathon Survival Guide: Emergency Fixes 10 Mins Before Pitch",
        "category": "⚡ Hackathon & Dev Skills",
        "summary": "Step-by-step emergency troubleshooting guide to rescue your project from port conflicts, CORS blocks, broken git merges, and presentation crashes.",
        "difficulty": "Beginner / Developer",
        "estimated_time": "2-5 mins",
        "tags": ["hackathon", "demo", "pitch", "port", "cors", "git", "emergency", "crash"],
        "common_causes": [
            "Zombie Node or Python processes holding dev ports (EADDRINUSE 3000 / 8000).",
            "CORS policy blocking frontend from communicating with backend API.",
            "Git merge conflict markers (<<<<<<< HEAD) left uncommitted right before deadline.",
            "Venue Wi-Fi instability or AI rate limit quota exceeded during live judging."
        ],
        "signs_to_look_for": [
            "Terminal throws 'Error: listen EADDRINUSE: address already in use'.",
            "Browser console throws red 'Access to fetch has been blocked by CORS policy'.",
            "Git says 'Automatic merge failed; fix conflicts and then commit the result'.",
            "Demo website shows white blank screen when opened on presenter screen."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Kill Hung Background Servers Instantly",
                "instruction": "Open Command Prompt and run: taskkill /F /IM node.exe & taskkill /F /IM python.exe. This frees all listening ports in 3 seconds without rebooting.",
                "why": "Unblocks frozen dev servers and releases locked files."
            },
            {
                "step": 2,
                "title": "Unblock API Requests with Permissive CORS",
                "instruction": "In FastAPI, ensure allow_origins=['*']. In Express.js, add app.use(cors()). In Flask, add CORS(app).",
                "why": "Allows browser to fetch data from localhost or deployed cloud APIs without browser security blocks."
            },
            {
                "step": 3,
                "title": "Abort Broken Git Merges Safely",
                "instruction": "If a panic merge broke your project, run: git merge --abort. Then create an emergency branch: git checkout -b demo-rescue.",
                "why": "Instantly returns your codebase to the last known working state before the deadline."
            },
            {
                "step": 4,
                "title": "Run the 30-Second Pre-Pitch Checklist",
                "instruction": "Open demo tabs in Chrome Incognito, enable Windows Focus Assist (Do Not Disturb), and keep a 30-second screen recording backup ready in case venue Wi-Fi fails.",
                "why": "Guarantees a flawless, professional presentation for the hackathon judges."
            }
        ],
        "expected_results": "Your dev servers start smoothly, APIs respond cleanly, and your demo runs flawlessly on stage.",
        "safety_warning": "Never run destructive git reset without creating a safety backup branch first.",
        "technician_trigger": "If venue Wi-Fi blocks ports entirely, switch to your phone's mobile hotspot or run completely on localhost."
    }
]

def seed_knowledge_base(db: Session):
    for item in INITIAL_ARTICLES:
        existing = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == item["id"]).first()
        if not existing:
            article = KnowledgeArticle(
                id=item["id"],
                title=item["title"],
                category=item["category"],
                summary=item["summary"],
                difficulty=item["difficulty"],
                estimated_time=item["estimated_time"],
                tags=item["tags"],
                common_causes=item["common_causes"],
                signs_to_look_for=item["signs_to_look_for"],
                steps=item["steps"],
                expected_results=item["expected_results"],
                safety_warning=item.get("safety_warning"),
                technician_trigger=item["technician_trigger"]
            )
            db.add(article)
    db.commit()

def search_articles(db: Session, query: Optional[str] = None, category: Optional[str] = None) -> List[KnowledgeArticle]:
    q = db.query(KnowledgeArticle)
    if category and category != "All":
        q = q.filter(KnowledgeArticle.category == category)
    if query:
        term = f"%{query.lower()}%"
        q = q.filter(
            (KnowledgeArticle.title.ilike(term)) | 
            (KnowledgeArticle.summary.ilike(term)) |
            (KnowledgeArticle.category.ilike(term))
        )
    return q.all()
