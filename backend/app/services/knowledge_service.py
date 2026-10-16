from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models import KnowledgeArticle
from app.services.additional_articles import ADDITIONAL_ARTICLES

BASE_ARTICLES = [
    {
        "id": "battery-unplugged-shutdown",
        "title": "2 & 4. Laptop Suddenly Shuts Down / Works Only When Plugged In",
        "category": "Battery & Power",
        "summary": "Your laptop works fine when plugged into the wall charger, but dies or shuts down instantly when the cable is removed or while working.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["battery", "power", "shutdown", "laptop", "charger", "2", "4"],
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
        "title": "11 & 28. No Internet Connection / Wi-Fi Not Connecting ('Connected But No Internet')",
        "category": "Internet & Network",
        "summary": "Your computer shows full Wi-Fi bars with a yellow warning triangle or says 'Connected, no internet', or fails to connect to the network.",
        "difficulty": "Beginner",
        "estimated_time": "3-7 mins",
        "tags": ["wifi", "internet", "network", "dns", "router", "11", "28", "no internet", "wifi not connecting"],
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
        "title": "6. Computer Running Slowly (Extreme Lag, Freezes & Stuttering)",
        "category": "System Performance",
        "summary": "Your computer takes minutes to respond, programs take forever to open, or the mouse cursor constantly freezes.",
        "difficulty": "Beginner",
        "estimated_time": "10-15 mins",
        "tags": ["slow", "performance", "cpu", "disk", "memory", "speed", "6", "running slowly"],
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
        "title": "21. Applications Crashing or Freezing on Launch",
        "category": "Software & Apps",
        "summary": "You double-click an application, but nothing happens, or it flashes on screen for a second and disappears or crashes.",
        "difficulty": "Beginner",
        "estimated_time": "5 mins",
        "tags": ["app", "crash", "wont open", "software", "freeze", "21", "applications crashing"],
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
        "title": "7. Computer Overheating & Fan Noise (Extreme Heat & Thermal Throttling)",
        "category": "System Performance",
        "summary": "Laptop or PC feels burning hot to the touch, and fans spin at maximum speed sounding like an airplane taking off.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["overheating", "fan", "heat", "thermal", "loud", "7", "computer overheating"],
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
        "title": "29. Printer Not Detected or Shows Offline",
        "category": "Printers & Devices",
        "summary": "You send documents to print, but nothing prints, and Windows says the printer is 'Offline' or 'Paused'.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["printer", "offline", "spooler", "paper", "usb", "29", "printer not detected"],
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
        "title": "8. Blue Screen of Death (BSOD Crash & Stop Code Errors)",
        "category": "System Performance",
        "summary": "Your computer suddenly crashes to a blue screen with a sad face :( and restarts automatically.",
        "difficulty": "Intermediate",
        "estimated_time": "10-20 mins",
        "tags": ["bsod", "blue screen", "crash", "windows", "kernel", "8", "blue screen of death"],
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
    },
    {
        "id": "audio-no-sound-speakers",
        "title": "16. No Sound or Audio Coming Out of Speakers or Headphones",
        "category": "Audio & Sound",
        "summary": "Your computer produces zero audio sound from built-in laptop speakers, 3.5mm headphone jack, or external desktop speakers even when volume is turned up.",
        "difficulty": "Beginner",
        "estimated_time": "3-7 mins",
        "tags": ["audio", "sound", "speakers", "headphones", "volume", "realtek", "mute", "16", "no sound", "no audio"],
        "common_causes": [
            "Default playback device switched to a silent external monitor or virtual cable.",
            "Hardware mute key or Fn audio mute shortcut pressed.",
            "Windows Audio background service stopped or crashed.",
            "Corrupt Realtek High Definition Audio or Intel Display Audio driver."
        ],
        "signs_to_look_for": [
            "Speaker icon has a red 'X' or volume slider is at 100% with no audible output.",
            "YouTube videos play normally with visual progress but complete silence.",
            "Audio works on Bluetooth headphones but not through laptop speakers."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Verify Default Playback Device",
                "instruction": "Click the sound icon on your taskbar, click the '>' arrow next to the volume slider, and ensure 'Speakers (Realtek)' or your headphones are selected (not an external HDMI monitor).",
                "why": "Windows often directs audio to an external screen with no built-in speakers."
            },
            {
                "step": 2,
                "title": "Restart Windows Audio Service",
                "instruction": "Press Windows + R, type 'services.msc', scroll to 'Windows Audio', right-click and click 'Restart'.",
                "why": "Unfreezes jammed audio buffer streams instantly without needing a full system restart."
            },
            {
                "step": 3,
                "title": "Reinstall Realtek Audio Driver",
                "instruction": "Open Device Manager > Sound, video and game controllers > Right-click 'Realtek(R) Audio' > 'Uninstall device' > Restart your PC.",
                "why": "Forces Windows to reinstall clean audio drivers upon reboot."
            }
        ],
        "expected_results": "Sound chime plays cleanly and volume control responds immediately.",
        "safety_warning": "Keep volume at 30% when testing to avoid loud sudden bursts when audio recovers.",
        "technician_trigger": "Seek hardware repair if headphones work fine but built-in speakers produce loud crackling or remain silent (blown speaker coil)."
    },
    {
        "id": "mic-not-working-zoom-teams",
        "title": "Microphone Not Working or Muted in Zoom, Teams & Discord",
        "category": "Audio & Sound",
        "summary": "Others cannot hear your voice in video meetings, calls, or games, or Windows displays 'No input device found'.",
        "difficulty": "Beginner",
        "estimated_time": "3-5 mins",
        "tags": ["microphone", "mic", "zoom", "teams", "discord", "meet", "audio", "mute"],
        "common_causes": [
            "Physical microphone privacy switch or keyboard function key (F4/Fn) engaged.",
            "Windows Privacy setting blocked apps from accessing the microphone.",
            "Calling application has the wrong input device selected in its audio settings."
        ],
        "signs_to_look_for": [
            "Microphone level meter in Windows Settings shows zero movement when you speak.",
            "Zoom or Teams shows an orange banner: 'Your microphone is not working'.",
            "Discord voice indicator ring does not light up green."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Check Laptop Physical Mute Button & Bezel",
                "instruction": "Look at the F4 key or side of your laptop for a microphone icon with an orange or amber LED light. Press it to unmute. Some laptops also have a physical slider switch.",
                "why": "Hardware mute switches cut power to the mic before Windows can touch it."
            },
            {
                "step": 2,
                "title": "Enable Windows Microphone Privacy Permissions",
                "instruction": "Open Windows Settings > Privacy & security > Microphone > Ensure 'Microphone access' and 'Let apps access your microphone' are both switched ON.",
                "why": "Windows blocks third-party apps from listening without explicit permission."
            },
            {
                "step": 3,
                "title": "Select Input Device Directly in App Settings",
                "instruction": "In Zoom, Teams, or Discord, open Settings > Audio > Change 'Microphone' from Default to your actual hardware device (e.g., 'Microphone Array (Realtek)').",
                "why": "Prevents apps from listening to disabled virtual input cables."
            }
        ],
        "expected_results": "The microphone volume bar bounces cleanly as you speak.",
        "safety_warning": "Be careful when cleaning microphone pinholes with pins; use a soft dry toothbrush instead.",
        "technician_trigger": "Contact support if the microphone cable in the screen hinge has severed (microphone disappears completely from Device Manager)."
    },
    {
        "id": "second-monitor-not-detected",
        "title": "33. Computer Won't Connect to an External Monitor (Second Screen Not Detected)",
        "category": "Display & Monitors",
        "summary": "Your external monitor shows 'No Signal' or Windows displays 'Didn't detect another display' when connected via HDMI, DisplayPort, or USB-C.",
        "difficulty": "Beginner",
        "estimated_time": "3-5 mins",
        "tags": ["monitor", "display", "screen", "hdmi", "usb-c", "projector", "second screen", "33", "external monitor"],
        "common_causes": [
            "Display projection mode set to 'PC screen only'.",
            "Monitor is on the wrong input channel (HDMI 1 vs HDMI 2 vs DisplayPort).",
            "Corrupt graphics card driver state or cable pin disconnection."
        ],
        "signs_to_look_for": [
            "Monitor power light is orange/amber instead of blue/white.",
            "Monitor screen displays 'Check signal cable' or 'Entering power saving mode'.",
            "Windows Display Settings shows only '1' with no second rectangle."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Press Win + P and Select Extend",
                "instruction": "Press the Windows Key + P on your keyboard. Select 'Extend' or 'Duplicate'.",
                "why": "If set to 'PC screen only', Windows turns off video signal to all external ports."
            },
            {
                "step": 2,
                "title": "Cycle Monitor Physical Input Button",
                "instruction": "Press the physical button on the monitor bezel to switch input from HDMI 1 to HDMI 2 or DisplayPort to match your cable.",
                "why": "Monitors frequently fail to auto-detect input ports when powered on after the PC."
            },
            {
                "step": 3,
                "title": "Reset Graphics Subsystem Instantly",
                "instruction": "Press Windows + Ctrl + Shift + B all at the same time. The screen will flash once and beep.",
                "why": "Instantly restarts the display adapter and forces HDMI handshake negotiation without rebooting."
            }
        ],
        "expected_results": "The second monitor lights up and displays your desktop wallpaper.",
        "safety_warning": "Never force display cables into ports at an angle to avoid snapping internal pins.",
        "technician_trigger": "Check cable and adapter if the monitor works with another laptop or gaming console."
    },
    {
        "id": "usb-drive-not-recognized",
        "title": "18. USB Ports Not Working / Flash Drive Not Showing Up",
        "category": "Storage & Files",
        "summary": "You insert a USB thumb drive or external hard drive, hear the connection chime, but nothing opens in File Explorer.",
        "difficulty": "Beginner",
        "estimated_time": "5 mins",
        "tags": ["usb", "drive", "flash drive", "storage", "hard drive", "explorer", "not showing", "18", "usb ports"],
        "common_causes": [
            "Drive partition lacks an assigned drive letter (e.g. E: or F:).",
            "Drive formatted in Mac-only APFS or Linux ext4 filesystem.",
            "USB port power suspension or loose port connection."
        ],
        "signs_to_look_for": [
            "Windows plays the device connection sound, but 'This PC' does not show the drive.",
            "Drive appears in Device Manager under Disk Drives but not in Explorer."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Assign a Drive Letter in Disk Management",
                "instruction": "Press Windows + X > click 'Disk Management'. Locate your USB in the bottom list > Right-click the blue bar > 'Change Drive Letter and Paths...' > Click 'Add' > Assign 'E:' or 'F:' > OK.",
                "why": "Windows cannot show a drive in Explorer if it does not have a designated drive letter."
            },
            {
                "step": 2,
                "title": "Try a Direct Port on Back of PC",
                "instruction": "Plug the drive directly into a rear USB port or different side port, bypassing unpowered USB splitters.",
                "why": "Mechanical external drives require 500mA+ of direct electrical current."
            },
            {
                "step": 3,
                "title": "Reinstall USB Controllers",
                "instruction": "Open Device Manager > Universal Serial Bus controllers > Right click 'USB Root Hub' > Uninstall > Restart PC.",
                "why": "Refreshes corrupted USB controller communication tables."
            }
        ],
        "expected_results": "Your drive appears in File Explorer ready for file transfers.",
        "safety_warning": "Never unplug external hard drives while files are transferring to avoid data corruption.",
        "technician_trigger": "Professional data recovery is recommended if an external hard drive makes continuous clicking or beeping noises."
    },
    {
        "id": "bluetooth-pairing-fail",
        "title": "Bluetooth Device Won't Connect or Keeps Disconnecting",
        "category": "Printers & Devices",
        "summary": "Wireless headphones, mice, keyboards, or controllers fail to pair, say 'Driver error', or repeatedly disconnect.",
        "difficulty": "Beginner",
        "estimated_time": "4-6 mins",
        "tags": ["bluetooth", "headphones", "airpods", "mouse", "controller", "wireless", "disconnect"],
        "common_causes": [
            "Device is still actively paired to your phone or tablet nearby.",
            "Windows Bluetooth Support Service stopped or set to manual.",
            "Outdated Intel/Realtek Bluetooth radio driver."
        ],
        "signs_to_look_for": [
            "Status in Settings says 'Paired' but audio never comes through.",
            "Device shows 'Connection failed' after a few seconds of spinning."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Turn Off Bluetooth on Nearby Phones/Tablets",
                "instruction": "Turn off Bluetooth on your smartphone so headphones don't automatically connect to it. Put headphones into pairing mode by holding their button for 5-7 seconds until the LED flashes rapidly.",
                "why": "Most Bluetooth accessories can only hold one active audio channel at a time."
            },
            {
                "step": 2,
                "title": "Remove Device and Re-Pair",
                "instruction": "Settings > Bluetooth & devices > Click the 3 dots on the accessory > 'Remove device'. Then click 'Add device' > Bluetooth > Select accessory.",
                "why": "Clears corrupted Bluetooth pairing keys from the Windows registry."
            },
            {
                "step": 3,
                "title": "Restart Bluetooth Support Service",
                "instruction": "Press Win + R > type 'services.msc' > find 'Bluetooth Support Service' > Right-click > Restart > Double click it and set Startup type to 'Automatic'.",
                "why": "Ensures background discovery broadcasts remain active."
            }
        ],
        "expected_results": "Accessory connects instantly with 'Connected mic, audio' status.",
        "safety_warning": "Ensure accessory battery is charged above 30% during pairing.",
        "technician_trigger": "Replace Bluetooth USB dongle if Device Manager shows a yellow exclamation triangle on the Bluetooth radio chip."
    },
    {
        "id": "drive-c-storage-full",
        "title": "26. Storage Space Full (Drive C: Completely Full — Safe Ways to Free 20+ GB in Windows)",
        "category": "Storage & Files",
        "summary": "Your main Windows drive (C:) is red with critically low disk space, causing sluggish performance, update failures, and crashing apps.",
        "difficulty": "Beginner",
        "estimated_time": "8-12 mins",
        "tags": ["storage", "disk full", "clean", "free space", "c drive", "clean up", "temp files", "26", "storage space full"],
        "common_causes": [
            "Previous Windows update installation backups (Windows.old folder).",
            "Gigabytes of hidden temporary browser and app download caches.",
            "Unemptied Recycle Bin and large downloaded installer files in Downloads folder."
        ],
        "signs_to_look_for": [
            "Windows displays notification: 'Low Disk Space: You are running out of disk space on Local Disk (C:)'",
            "File Explorer shows the C: drive bar in bright red.",
            "Windows updates refuse to download or install."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Use Windows Storage Cleanup Recommendations",
                "instruction": "Open Windows Settings > System > Storage > Click 'Cleanup recommendations' > Select 'Temporary files', check 'Previous Windows installations' and 'Recycle Bin' > Click 'Clean up'.",
                "why": "Safely removes up to 25 GB of old Windows update archives without touching your personal photos or documents."
            },
            {
                "step": 2,
                "title": "Clear Windows SoftwareDistribution Download Cache",
                "instruction": "Open CMD as Administrator and run: net stop wuauserv & del /q /f /s %windir%\\SoftwareDistribution\\Download\\*.* & net start wuauserv.",
                "why": "Safely purges downloaded Windows update installation packages that failed or already installed."
            },
            {
                "step": 3,
                "title": "Move Downloads Folder to Another Drive (If Available)",
                "instruction": "If you have a D: drive, right click 'Downloads' in File Explorer > Properties > Location > Move to D:\\Downloads.",
                "why": "Prevents large installer files and videos from cluttering your OS drive."
            }
        ],
        "expected_results": "10 to 30 GB of free space reclaimed immediately, turning the C: drive bar blue again.",
        "safety_warning": "Never delete files directly from C:\\Windows or C:\\Program Files by hand.",
        "technician_trigger": "Consider upgrading to a 500GB or 1TB M.2 NVMe SSD if your main drive is only 64GB or 128GB."
    },
    {
        "id": "windows-update-stuck",
        "title": "23. Windows Update Failure (Stuck at 100% or Update Error Codes)",
        "category": "System Performance",
        "summary": "Windows Update gets frozen during download/install, or rolls back changes with error codes like 0x80070002, 0x800f0922, or 0x80240034.",
        "difficulty": "Intermediate",
        "estimated_time": "10-15 mins",
        "tags": ["update", "windows update", "stuck", "error", "0x80070002", "freeze", "23", "windows update failure"],
        "common_causes": [
            "Corrupted temporary update package database.",
            "Damaged Windows Component Store system files.",
            "Third-party antivirus or VPN blocking Microsoft update CDNs."
        ],
        "signs_to_look_for": [
            "Update progress percentage stays frozen at the same number for over 2 hours.",
            "Message: 'We couldn't complete the updates. Undoing changes. Don't turn off your computer.'",
            "Error code in red text in Windows Update settings."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Run Built-in Windows Update Troubleshooter",
                "instruction": "Open Settings > System > Troubleshoot > Other troubleshooters > Windows Update > Click 'Run'.",
                "why": "Automatically repairs common file permissions and restarts update services."
            },
            {
                "step": 2,
                "title": "Repair System Component Store with DISM & SFC",
                "instruction": "Open Command Prompt as Administrator and enter: DISM.exe /Online /Cleanup-image /Restorehealth. After completion, enter: sfc /scannow.",
                "why": "Downloads fresh replacement system files directly from Microsoft servers to repair local corruption."
            },
            {
                "step": 3,
                "title": "Reset Windows Update Components",
                "instruction": "In Admin CMD run: net stop wuauserv & net stop bits & ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old & net start wuauserv & net start bits.",
                "why": "Forces Windows to build a brand new update download catalog from scratch."
            }
        ],
        "expected_results": "Windows Update downloads and applies patches smoothly without hanging.",
        "safety_warning": "Do not hard-power off the computer if the screen says 'Working on updates' unless frozen for 4+ hours.",
        "technician_trigger": "Perform an In-Place Windows Upgrade if DISM reports component store corruption that cannot be repaired."
    },
    {
        "id": "browser-popups-malware",
        "title": "35. Computer Infected with Pop-up Ads & Scam Virus Alerts",
        "category": "Security & Accounts",
        "summary": "Loud browser alerts, robotic voices, or full-screen warnings claim 'Your computer is infected with Trojan Spyware! Call 1-800 Microsoft Helpline'.",
        "difficulty": "Beginner",
        "estimated_time": "5-8 mins",
        "tags": ["virus", "malware", "popups", "scam", "browser", "fake alert", "security", "35", "pop-up ads"],
        "common_causes": [
            "Deceptive website notification permission clicked accidentally ('Allow notifications').",
            "Malicious browser extension redirecting search queries.",
            "Adware package bundled with a free software download."
        ],
        "signs_to_look_for": [
            "Repeated notifications in bottom-right corner pretending to be McAfee or Windows Defender.",
            "Browser locked in fullscreen mode (F11) with simulated Windows BSOD screens.",
            "Search engine defaults changing to Yahoo or unfamiliar search portals."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Do NOT Call the Phone Number or Grant Remote Access",
                "instruction": "Never call phone numbers in web alerts. Real tech companies (Microsoft, Google, Apple) NEVER put phone numbers in popups or ask for gift card payments.",
                "why": "These are 100% fake web pages created by scammers to extract money."
            },
            {
                "step": 2,
                "title": "Force Close Browser Safely",
                "instruction": "Press Ctrl + Shift + Esc to open Task Manager > Right-click Chrome/Edge > 'End task'. When reopening the browser, do NOT click 'Restore pages'.",
                "why": "Closes the trapped JavaScript loops without allowing malicious scripts to download files."
            },
            {
                "step": 3,
                "title": "Remove Rogue Notification Permissions",
                "instruction": "In Chrome/Edge: Settings > Privacy and security > Site settings > Notifications > Under 'Allowed to send notifications', click the 3 dots next to all unfamiliar sites > 'Remove'.",
                "why": "Stops 99% of desktop virus popup spam immediately."
            },
            {
                "step": 4,
                "title": "Run Windows Defender Offline Scan",
                "instruction": "Open Windows Security > Virus & threat protection > Scan options > 'Microsoft Defender Offline scan' > Scan now.",
                "why": "Scans your computer before Windows boots to eliminate deeply embedded rootkits."
            }
        ],
        "expected_results": "All popup spam vanishes, and browser returns to fast, clean operation.",
        "safety_warning": "Never give remote access (AnyDesk, TeamViewer) to anyone calling or messaging you out of the blue.",
        "technician_trigger": "Contact your bank immediately if you already shared credit card numbers or passwords with a scam phone representative."
    },
    {
        "id": "phone-hotspot-no-internet",
        "title": "Mobile Phone Hotspot Connected But Laptop Has No Internet",
        "category": "Internet & Network",
        "summary": "Your laptop connects to your iPhone or Android personal hotspot, but web pages refuse to load, showing 'No internet access, secured'.",
        "difficulty": "Beginner",
        "estimated_time": "3-5 mins",
        "tags": ["hotspot", "phone", "tethering", "mobile data", "iphone", "android", "wifi"],
        "common_causes": [
            "Hotspot Wi-Fi frequency incompatibility (5 GHz vs 2.4 GHz).",
            "Cellular carrier tethering cap reached on your phone plan.",
            "Windows Metered Connection setting halting background data."
        ],
        "signs_to_look_for": [
            "Phone hotspot icon is active and shows '1 device connected'.",
            "Phone can browse the web fine, but laptop browsers report 'DNS_PROBE_FINISHED_NO_INTERNET'."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Enable Maximize Compatibility / 2.4 GHz Band",
                "instruction": "On iPhone: Settings > Personal Hotspot > Turn ON 'Maximize Compatibility'. On Android: Hotspot settings > Change AP Band to '2.4 GHz'.",
                "why": "Many laptop Wi-Fi cards cannot lock onto 5 GHz mobile hotspot signals."
            },
            {
                "step": 2,
                "title": "Toggle Airplane Mode on Phone",
                "instruction": "Turn ON Airplane mode on your phone for 10 seconds, then turn it OFF. Turn the hotspot back ON.",
                "why": "Forces your phone's cellular modem to reconnect to a fresh mobile data tower."
            },
            {
                "step": 3,
                "title": "Forget and Reconnect Network on Laptop",
                "instruction": "Settings > Network & internet > Wi-Fi > Manage known networks > Find your phone's hotspot name > Click 'Forget' > Reconnect and enter password.",
                "why": "Clears outdated IP routing leases."
            }
        ],
        "expected_results": "Laptop immediately loads web pages at full 4G/5G mobile data speeds.",
        "safety_warning": "Keep laptop Windows Updates paused while on mobile data to avoid burning your monthly data quota.",
        "technician_trigger": "Check with your mobile provider to verify that your cellular plan includes tethering/hotspot provisioning."
    },
    {
        "id": "keyboard-typing-wrong-keys",
        "title": "14. Keyboard Not Working (Typing Wrong Letters, Swapped Keys or Unresponsive Keys)",
        "category": "Printers & Devices",
        "summary": "Pressing keys types numbers instead of letters (e.g. typing U, I, O results in 4, 5, 6), or typing @ produces \" and vice-versa, or keys fail to register.",
        "difficulty": "Beginner",
        "estimated_time": "2-4 mins",
        "tags": ["keyboard", "typing", "wrong keys", "numlock", "language", "symbols", "layout", "14", "keyboard not working"],
        "common_causes": [
            "NumLock enabled on compact laptops without a dedicated number pad.",
            "Keyboard input language accidentally toggled from US to UK/International.",
            "Windows Filter Keys feature turned on, causing skipped or delayed keystrokes."
        ],
        "signs_to_look_for": [
            "Pressing 'J', 'K', 'L' types '1', '2', '3'.",
            "Pressing Shift + 2 types '\"' instead of '@'.",
            "Typing requires holding keys down for a full second before letters appear."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Toggle Off Laptop NumLock",
                "instruction": "Look for the 'NumLk' or 'NumLock' key on your keyboard. Press Fn + NumLock (or Shift + NumLock).",
                "why": "Compact laptops use letters as a numeric keypad when NumLock is activated."
            },
            {
                "step": 2,
                "title": "Switch Keyboard Layout to English (US)",
                "instruction": "Press Windows + Spacebar together to switch your active input method back to 'English (United States)'.",
                "why": "Accidental Alt+Shift shortcuts frequently swap keyboard layouts to UK English."
            },
            {
                "step": 3,
                "title": "Turn Off Filter Keys",
                "instruction": "Open Windows Settings > Accessibility > Keyboard > Ensure 'Filter Keys' is set to OFF.",
                "why": "Filter Keys ignores brief repetitive keystrokes, making typing feel unresponsive."
            }
        ],
        "expected_results": "Every key types its exact printed letter and symbol accurately.",
        "safety_warning": "Never soak keyboards in rubbing alcohol or liquid cleaners; clean only with a slightly damp microfiber cloth.",
        "technician_trigger": "Replace the keyboard assembly if multiple keys in the same diagonal row fail to register (liquid spill trace damage)."
    },
    {
        "id": "webcam-black-screen",
        "title": "17. Webcam Not Working (Black Screen or 'No Camera Found' in Video Calls)",
        "category": "Printers & Devices",
        "summary": "Your laptop webcam displays a solid black rectangle, loading spinner, or error code 0xA00F4244 in Zoom, Teams, Meet, or Windows Camera app.",
        "difficulty": "Beginner",
        "estimated_time": "3-5 mins",
        "tags": ["webcam", "camera", "black screen", "zoom", "teams", "video", "privacy", "17", "webcam not working"],
        "common_causes": [
            "Physical camera privacy shutter is closed over the lens.",
            "Hardware camera toggle function key (F8 / F10 / Fn) disabled.",
            "Windows Privacy settings blocked desktop apps from camera access."
        ],
        "signs_to_look_for": [
            "The camera LED light turns on, but video feed remains pure pitch black.",
            "App says 'Cannot find camera' or 'Camera is being used by another application'."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Check Physical Privacy Shutter Slide",
                "instruction": "Look directly at the top screen bezel. Slide the tiny plastic latch until you see the glass lens sensor (no red or white dot covering the lens).",
                "why": "Physical shutters completely block light regardless of software settings."
            },
            {
                "step": 2,
                "title": "Press Camera Hardware Function Key",
                "instruction": "Press the keyboard function key featuring a camera icon with a diagonal slash (often F8, F10, or Fn + F8 on Lenovo, MSI, Asus, and HP).",
                "why": "Hardware keys toggle the USB power line to the camera module."
            },
            {
                "step": 3,
                "title": "Enable Windows Camera Privacy Permissions",
                "instruction": "Settings > Privacy & security > Camera > Turn ON 'Camera access' and 'Let desktop apps access your camera'.",
                "why": "Windows privacy shield stops unauthorized apps from recording video."
            }
        ],
        "expected_results": "Video preview illuminates immediately with clear video.",
        "safety_warning": "Do not scratch camera lens glass with abrasive cloth.",
        "technician_trigger": "Contact laptop support if Camera app reports 0xA00F4244 (camera cable disconnected from motherboard)."
    },
    {
        "id": "forgot-windows-pin-password",
        "title": "Forgot Windows Password or PIN / Account Recovery",
        "category": "Security & Accounts",
        "summary": "You are locked out of your Windows computer because you cannot remember your password, PIN code, or Microsoft account login.",
        "difficulty": "Intermediate",
        "estimated_time": "5-15 mins",
        "tags": ["password", "pin", "login", "locked out", "recovery", "account", "microsoft"],
        "common_causes": [
            "Caps Lock or NumLock active while entering password.",
            "Microsoft account password recently changed on another phone or device.",
            "PIN database (NGC folder) corrupted after Windows update."
        ],
        "signs_to_look_for": [
            "Message: 'The password is incorrect. Make sure that you're using the password for your Microsoft account.'",
            "Message: 'Your PIN is no longer available due to a change to the security settings on this device.'"
        ],
        "steps": [
            {
                "step": 1,
                "title": "Verify Caps Lock and Alternative Sign-in Options",
                "instruction": "Click the eye icon inside the password field to view typed characters. Click 'Sign-in options' (key icon) to try an alternative Password or PIN.",
                "why": "Caps Lock causes 80% of login failures."
            },
            {
                "step": 2,
                "title": "Reset Microsoft Password from Smartphone",
                "instruction": "Open account.live.com/password/reset on your phone. Reset your password, then ensure your laptop is connected to Wi-Fi at the lock screen before entering the new password.",
                "why": "Windows syncs the new cloud password over Wi-Fi within seconds."
            },
            {
                "step": 3,
                "title": "Use 'I Forgot My PIN' On-Screen Wizard",
                "instruction": "Click 'I forgot my PIN' below the PIN box. Enter your Microsoft account email and verify via security code sent to your phone or backup email.",
                "why": "Rebuilds local cryptographic authentication tokens on your PC."
            }
        ],
        "expected_results": "Access to your Windows desktop and files is fully restored.",
        "safety_warning": "Never download untrusted 'password remover.iso' tools that could infect your computer with ransomware.",
        "technician_trigger": "If using a local offline account with no reset disk, boot into Windows Recovery to access System Restore or recovery prompt."
    }
]

INITIAL_ARTICLES = BASE_ARTICLES + ADDITIONAL_ARTICLES

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
        else:
            existing.title = item["title"]
            existing.category = item["category"]
            existing.summary = item["summary"]
            existing.difficulty = item["difficulty"]
            existing.estimated_time = item["estimated_time"]
            existing.tags = item["tags"]
            existing.common_causes = item["common_causes"]
            existing.signs_to_look_for = item["signs_to_look_for"]
            existing.steps = item["steps"]
            existing.expected_results = item["expected_results"]
            existing.safety_warning = item.get("safety_warning")
            existing.technician_trigger = item["technician_trigger"]
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
