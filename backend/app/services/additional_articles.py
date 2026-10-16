from typing import List, Dict, Any

ADDITIONAL_ARTICLES: List[Dict[str, Any]] = [
    {
        "id": "computer-wont-turn-on",
        "title": "1. Computer Won't Turn On (No Power, Lights, or Fan)",
        "category": "Battery & Power",
        "summary": "Your laptop or desktop computer does not turn on at all when pressing the power button — no power LED, no fan sound, and screen remains completely off.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["power", "turn on", "dead", "power button", "laptop", "pc", "no power", "1"],
        "common_causes": [
            "Residual static electricity trapped in motherboard capacitors (system in lockup state).",
            "Wall outlet or surge protector switch turned off or tripped.",
            "Loose AC power adapter connection or broken charger cable pin.",
            "Defective laptop power adapter or dead desktop Power Supply Unit (PSU)."
        ],
        "signs_to_look_for": [
            "Pressing the power button produces no sound, light, or fan movement.",
            "The small charging LED next to the charging port does not turn on.",
            "The charger brick feels cold to the touch even after being plugged in for 15 minutes."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Perform a 30-Second Hard Power Drain (Static Discharge)",
                "instruction": "Unplug the charger from your laptop or PC. If your laptop has a removable battery, take it out. Now press and HOLD the power button down continuously for 30 full seconds. Afterward, plug only the wall charger back in (leave battery out if removable) and press power once.",
                "why": "Motherboards have a protective circuit that freezes startup if static charges build up in capacitors. Holding the power button completely drains residual electricity and resets the Embedded Controller (EC)."
            },
            {
                "step": 2,
                "title": "Test the Wall Socket and Power Strip Directly",
                "instruction": "Unplug the computer charger from any power strips or extension cords. Plug a desk lamp or phone charger into that exact wall outlet to confirm electricity is working, then plug your computer charger directly into the wall.",
                "why": "Surge protectors and power strips often trip internal safety switches without visible warning."
            },
            {
                "step": 3,
                "title": "Inspect the Power Port and Charger Cable Tip",
                "instruction": "Look inside the laptop charging port with your phone flashlight. Check if the center pin is bent, loose, or dirty. Wiggle the cable gently where it enters the laptop; if the charging light blinks on and off, the jack is loose.",
                "why": "Loose DC charging jacks or broken internal copper wires prevent electricity from reaching the motherboard."
            }
        ],
        "expected_results": "In over 60% of cases, the 30-second power drain resets the internal power safety chip and the laptop turns on normally. If there are still no lights, the charger brick or power jack needs replacement.",
        "safety_warning": "ELECTRICAL SAFETY: Never open a desktop power supply (PSU) unit or disassemble a laptop battery pack. Desktop power supplies contain high-voltage capacitors that hold dangerous electric charges even after being unplugged.",
        "technician_trigger": "Contact a repair shop if the charger LED turns off the second you plug it into the laptop (indicating a motherboard short circuit), or if you detect a burning electronic smell."
    },
    {
        "id": "laptop-battery-not-charging",
        "title": "3. Laptop Battery Not Charging ('Plugged In, Not Charging')",
        "category": "Battery & Power",
        "summary": "Your laptop is plugged into the wall charger and operating, but the battery icon says 'Plugged in, not charging' or the percentage refused to increase.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["battery", "not charging", "plugged in", "power", "laptop", "charger", "3"],
        "common_causes": [
            "OEM manufacturer battery threshold software (Lenovo Conservation Mode, ASUS Battery Care, Dell Power Manager) intentionally capped charging at 60% or 80%.",
            "Corrupted Windows ACPI battery driver in Device Manager.",
            "Overheated battery pack temporarily locking charging to prevent thermal runaway.",
            "Charger brick wattage is too low (e.g. using a 20W phone USB-C charger on a 65W laptop)."
        ],
        "signs_to_look_for": [
            "Battery percentage stays stuck at 60%, 80%, or 0%.",
            "Hovering mouse over the battery icon displays 'Plugged in, not charging'.",
            "Laptop runs fine while plugged in, but powers off when the cable is pulled."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Check Manufacturer Battery Health Software",
                "instruction": "Open Start and search for your laptop's management app: Lenovo Vantage, Dell Optimizer/Command | Power, MyASUS, or HP Command Center. Look for 'Battery Conservation Mode', 'Battery Care', or 'Peak Shift' and toggle it to 100% or Standard Mode.",
                "why": "Manufacturers include battery protection features that stop charging at 60% or 80% to prolong battery chemical lifespan when plugged in continuously."
            },
            {
                "step": 2,
                "title": "Reinstall Microsoft ACPI Battery Drivers",
                "instruction": "Press Windows Key + X and select 'Device Manager'. Expand 'Batteries'. Right-click 'Microsoft ACPI-Compliant Control Method Battery' and click 'Uninstall device'. Do NOT delete the driver. Restart your laptop.",
                "why": "Windows automatically reinstalls a fresh copy of the battery communication driver during startup, fixing software communication freezes."
            },
            {
                "step": 3,
                "title": "Check Charger Wattage Compatibility",
                "instruction": "Look at the fine print on your charging brick. Check the output wattage (e.g. 45W, 65W, 90W). Ensure you are using the original laptop charger, especially if charging through USB-C.",
                "why": "Underpowered USB-C phone chargers provide enough power to keep the laptop running, but cannot supply extra wattage to charge the battery."
            }
        ],
        "expected_results": "Your laptop battery will resume charging towards 100%. If the battery is stuck at 0% and dies immediately when unplugged, the internal battery cells have reached end of life.",
        "safety_warning": "If your laptop trackpad is swelling upwards or the bottom chassis is bulging, the battery is chemically failing and expanding. Unplug immediately and do not charge.",
        "technician_trigger": "If Windows Battery Report shows full charge capacity is 0 mWh or Device Manager shows a yellow warning triangle on the battery controller, replace the internal battery pack."
    },
    {
        "id": "black-screen-no-display",
        "title": "5. Black Screen or No Display: Computer Turns On But Screen Stays Blank",
        "category": "Display & Monitors",
        "summary": "Your computer powers on (you hear fans spinning or see power lights illuminate), but the display remains completely black, blank, or shows 'No Signal'.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["black screen", "no display", "blank screen", "monitor", "no signal", "screen", "5"],
        "common_causes": [
            "Windows graphics driver crashed or stuck in a blank sleep state.",
            "Display brightness set to 0 or display switched to external projector mode (Win + P).",
            "Oxidized or loose RAM memory contacts preventing successful POST boot.",
            "Loose HDMI, DisplayPort, or internal laptop eDP screen ribbon cable."
        ],
        "signs_to_look_for": [
            "Power button LED is on, and cooling fan is spinning.",
            "Caps Lock key LED toggles on and off when pressed, indicating Windows is running in the background.",
            "Screen backlight may have a faint glow, but no text or icons appear."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Force-Restart the Windows Graphics Driver",
                "instruction": "Press the following four keys simultaneously: Windows Key + Ctrl + Shift + B. Hold them for one second and release.",
                "why": "This official Windows emergency hotkey instantly restarts the graphics driver subsystem and refreshes the display buffer without restarting your PC."
            },
            {
                "step": 2,
                "title": "Test Screen Backlight with Phone Flashlight",
                "instruction": "In a dim room, shine your smartphone flashlight directly at the laptop screen from a 45-degree angle. Look closely for faint desktop icons, Windows login text, or mouse pointer.",
                "why": "If you can faintly see desktop icons with a flashlight, the LCD screen itself is working, but the backlight fuse or inverter has failed, or brightness is set to zero."
            },
            {
                "step": 3,
                "title": "Connect to an External TV or Monitor",
                "instruction": "Connect an HDMI cable from your laptop or PC to a TV or computer monitor. Turn on the TV, set the correct HDMI input, and press Windows Key + P, then Down Arrow, then Enter.",
                "why": "If the TV shows your desktop, your computer's motherboard, CPU, and Windows are completely healthy, isolating the issue to the laptop screen or video cable."
            },
            {
                "step": 4,
                "title": "Reseat Desktop RAM Sticks (Desktop PCs)",
                "instruction": "On desktop computers, turn off power and unplug the power cable. Open the side panel, release the plastic retention clips on your RAM memory sticks, remove them, wipe the gold pins with a dry microfiber cloth, and snap them firmly back into place until clips click shut.",
                "why": "Over 70% of desktop 'No Display / Black Screen' boots are caused by dust or microscopic thermal shifting in the RAM slots."
            }
        ],
        "expected_results": "The display will beep and awaken, or the external monitor will provide immediate access to your desktop.",
        "safety_warning": "Always unplug the AC power cord from the wall before opening a desktop case. Touch an unpainted metal part of the case to discharge static electricity before touching RAM.",
        "technician_trigger": "If an external monitor also displays no picture and the motherboard produces repetitive beeps (e.g. 1 long 2 short), the graphics card or motherboard has suffered hardware failure."
    },
    {
        "id": "windows-wont-boot",
        "title": "9. Windows Won't Boot: Automatic Repair Loop, Stuck on Loading Circle, or No Boot Device",
        "category": "System Performance",
        "summary": "Your computer powers on, but Windows fails to load into the desktop, showing an infinite spinning circle, 'Preparing Automatic Repair', or 'No bootable device found'.",
        "difficulty": "Intermediate",
        "estimated_time": "10-15 mins",
        "tags": ["windows won't boot", "boot loop", "automatic repair", "no boot device", "spinning circle", "9"],
        "common_causes": [
            "Corrupted Boot Configuration Data (BCD) or Master Boot Record (MBR).",
            "Interrupted Windows update leaving system files in an unbootable state.",
            "Unbootable USB flash drive or external drive plugged into the computer.",
            "BIOS boot order changed or SATA/NVMe mode switched from AHCI to RAID."
        ],
        "signs_to_look_for": [
            "Computer repeatedly loops into 'Preparing Automatic Repair' and 'Diagnosing your PC'.",
            "Screen displays 'No bootable devices found - Strike F1 to retry boot'.",
            "Windows loading dots spin infinitely for over 30 minutes."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Unplug All USB Flash Drives & External Devices",
                "instruction": "Disconnect all USB flash drives, external hard drives, memory cards, and USB printers from the computer. Restart the computer.",
                "why": "Computers are often configured to prioritize booting from external USB devices. If an unbootable USB drive is plugged in, the computer halts before loading Windows."
            },
            {
                "step": 2,
                "title": "Trigger Windows Startup Repair",
                "instruction": "Turn on your PC. As soon as the Windows loading circle appears, press and hold the power button for 5 seconds to force it off. Repeat this 3 times. On the 4th turn-on, Windows will enter the blue 'Recovery' screen. Click 'Advanced options' > 'Troubleshoot' > 'Advanced options' > 'Startup Repair'.",
                "why": "Windows Startup Repair scans partition headers, bootloader files, and system registry hives, automatically repairing damaged boot records."
            },
            {
                "step": 3,
                "title": "Boot into Safe Mode to Undo Recent Updates",
                "instruction": "From the same blue Advanced Options menu, click 'Startup Settings' > click 'Restart' > press key '4' or 'F4' for Safe Mode. If Windows boots to the desktop in Safe Mode, open Settings > Windows Update > Update history > Uninstall recent updates.",
                "why": "Safe Mode loads only core system files. If an update or driver crashed normal boot, Safe Mode allows you to uninstall it cleanly."
            },
            {
                "step": 4,
                "title": "Rebuild Boot Configuration Data via Command Prompt",
                "instruction": "In Advanced Options, click 'Command Prompt' and enter these commands one by one:\nbootrec /fixmbr\nbootrec /fixboot\nbootrec /rebuildbcd\nThen type 'exit' and restart.",
                "why": "Directly rewrites the Master Boot Record and rebuilds the BCD pointer store."
            }
        ],
        "expected_results": "Windows repairs the boot sector and loads normally to your lock screen with all your files intact.",
        "safety_warning": "Do not choose 'Reset this PC' or format drives until trying Startup Repair and System Restore, ensuring your documents remain preserved.",
        "technician_trigger": "If BIOS reports 'Hard Disk Not Detected' or 'SMART Error: Hard Drive Failure Imminent', the storage drive has physically failed."
    },
    {
        "id": "computer-freezes-hangs",
        "title": "10. Computer Freezes or Hangs: Mouse Unresponsive & Screen Locked Up",
        "category": "System Performance",
        "summary": "Your computer suddenly freezes completely while browsing, working, or gaming. The mouse cursor will not move, and the keyboard does not respond.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["freezes", "hangs", "locked up", "not responding", "unresponsive", "10"],
        "common_causes": [
            "Overloaded RAM or CPU from runaway background processes or browser memory leaks.",
            "Failing storage drive with bad sectors causing Windows to stall when reading files.",
            "Overheating processor throttling down to protect itself from heat damage.",
            "Corrupted core Windows system files or outdated graphics driver."
        ],
        "signs_to_look_for": [
            "Mouse pointer does not move across the screen.",
            "Audio stutters in a buzzing loop or cuts out completely.",
            "Hard drive activity light stays solidly lit or stops blinking entirely."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Attempt Soft Recovery Shortcuts",
                "instruction": "First press: Windows Key + Ctrl + Shift + B (restarts graphics driver). If nothing happens, press: Ctrl + Alt + Delete. Wait 15 seconds to see if the blue security screen appears. If it does, click 'Task Manager'.",
                "why": "Tests whether the system freeze is just a stalled graphics driver or a total kernel lockup."
            },
            {
                "step": 2,
                "title": "Identify and End Runaway Tasks in Task Manager",
                "instruction": "In Task Manager, click the 'CPU' and 'Memory' column headers to sort by highest usage. Right-click any app using 90%+ resources and click 'End Task'.",
                "why": "A single looping script or memory-leaking app can starve the operating system of processing cycles."
            },
            {
                "step": 3,
                "title": "Run System File Checker (SFC Scan)",
                "instruction": "Open Start, type 'cmd', right-click 'Command Prompt' and select 'Run as administrator'. Type: sfc /scannow and press Enter. Let it reach 100% verification.",
                "why": "Scans Windows system files against official cached copies and automatically replaces corrupted DLL files that cause system hangs."
            },
            {
                "step": 4,
                "title": "Check Storage Health with CHKDSK",
                "instruction": "In the same Administrator Command Prompt, type: chkdsk C: /f and press Enter. Type 'Y' to schedule disk check on next restart, then restart your PC.",
                "why": "Detects bad sectors on your hard drive/SSD and repairs filesystem directory corruption."
            }
        ],
        "expected_results": "System hangs cease, and Task Manager shows normal baseline CPU (under 10%) and RAM usage.",
        "safety_warning": "Avoid yanking the power plug while the disk activity LED is flashing rapidly to prevent filesystem damage.",
        "technician_trigger": "If freezing occurs inside the BIOS setup screen or immediately within 60 seconds of every cold boot, suspect failing motherboard power delivery or defective RAM."
    },
    {
        "id": "slow-internet-connection",
        "title": "12. Slow Internet Connection: High Latency, Buffering & Sluggish Downloads",
        "category": "Internet & Network",
        "summary": "Your internet is connected, but web pages take ages to open, videos constantly buffer at low resolution, and video calls lag or freeze.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["slow internet", "buffering", "lag", "high ping", "bandwidth", "downloads", "12"],
        "common_causes": [
            "Wi-Fi frequency congestion on the 2.4 GHz band from neighboring routers.",
            "Background Windows Update downloads or cloud syncing (OneDrive, Google Drive, Steam).",
            "Slow, congested DNS servers provided by your Internet Service Provider.",
            "Stale router routing cache or outdated network adapter drivers."
        ],
        "signs_to_look_for": [
            "Speed test (fast.com or speedtest.net) shows download speeds significantly below your plan.",
            "YouTube and Netflix automatically drop down to 360p or 480p resolution.",
            "Zoom and Teams display 'Your internet connection is unstable'."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Power Cycle the Modem and Wi-Fi Router",
                "instruction": "Unplug the power cables from both your modem and Wi-Fi router. Wait 30 seconds. Plug the modem back in first and wait 2 minutes, then plug the Wi-Fi router back in and wait for green connection lights.",
                "why": "Clears the router's internal NAT translation table, memory leaks, and re-establishes a fresh IP session with your ISP."
            },
            {
                "step": 2,
                "title": "Connect to 5 GHz Wi-Fi Instead of 2.4 GHz",
                "instruction": "Click your Wi-Fi icon in the taskbar. Check if your network has a version ending in '_5G' or '_5GHz'. Connect to that network using your normal Wi-Fi password.",
                "why": "The 2.4 GHz band is crowded with Bluetooth, microwaves, and neighbors' routers. The 5 GHz band provides up to 5x higher throughput with virtually zero interference."
            },
            {
                "step": 3,
                "title": "Flush DNS Cache and Reset Winsock Stack",
                "instruction": "Open Command Prompt as Administrator and run these commands:\nipconfig /flushdns\nnetsh winsock reset\nnetsh int ip reset\nRestart your computer.",
                "why": "Clears outdated domain name lookups and resets the Windows networking stack."
            },
            {
                "step": 4,
                "title": "Switch to High-Speed Public DNS Servers",
                "instruction": "Open Windows Settings > Network & internet > Wi-Fi > Hardware properties. Next to 'DNS server assignment', click Edit > select Manual > IPv4 ON. Set Preferred DNS to: 1.1.1.1 (Cloudflare) and Alternate DNS to: 8.8.8.8 (Google).",
                "why": "Cloudflare and Google DNS servers resolve web addresses in under 15ms, significantly speeding up initial page load times compared to slow ISP servers."
            }
        ],
        "expected_results": "Web pages open instantly, downloads run at your full subscribed speed, and video buffering disappears.",
        "safety_warning": "Do not download third-party 'Internet Boosters' or 'Speed Accelerators'; they are almost always adware programs that slow your computer down further.",
        "technician_trigger": "If speeds remain 90% below your paid plan on multiple phones and laptops directly connected via Ethernet cable, contact your ISP to inspect the fiber/coaxial cable coming into your house."
    },
    {
        "id": "virus-malware-infection",
        "title": "13. Virus or Malware Infection: Slowdown, File Encryption & Rogue Programs",
        "category": "Security & Accounts",
        "summary": "Your computer is behaving erratically, running excessively slow, changing your browser homepage automatically, showing strange warnings, or opening unknown programs.",
        "difficulty": "Intermediate",
        "estimated_time": "15-20 mins",
        "tags": ["virus", "malware", "infection", "trojan", "hacked", "spyware", "13"],
        "common_causes": [
            "Downloading cracked software, keygens, or torrented installers.",
            "Opening malicious email attachments disguised as invoices, tracking numbers, or PDFs.",
            "Deceptive browser notifications tricking you into installing rogue extensions."
        ],
        "signs_to_look_for": [
            "Browser searches automatically redirect to unknown search engines (Yahoo, Bing clones, search conduit).",
            "Task Manager shows unknown processes consuming 80%+ CPU when idle.",
            "Antivirus keeps alerting or has been disabled without your permission."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Disconnect from the Internet Immediately",
                "instruction": "Turn off Wi-Fi or unplug your Ethernet network cable right now.",
                "why": "Cuts off communication with remote hacker command servers, stopping personal data theft and preventing ransomware from downloading encryption keys."
            },
            {
                "step": 2,
                "title": "Run a Microsoft Defender Offline Scan",
                "instruction": "Open Windows Security > Virus & threat protection > click 'Scan options'. Choose 'Microsoft Defender Antivirus (offline scan)' and click 'Scan now'. Your PC will reboot into a specialized scanning environment.",
                "why": "Offline scans run before Windows and malware load into memory, allowing the antivirus to delete rootkits and stubborn trojans that protect themselves during normal use."
            },
            {
                "step": 3,
                "title": "Disable Rogue Startup Applications",
                "instruction": "Press Ctrl + Shift + Esc > click the 'Startup apps' tab. Look for unfamiliar programs, right-click, and click 'Disable'.",
                "why": "Prevents malware from re-launching itself every time your computer starts."
            },
            {
                "step": 4,
                "title": "Reset Web Browsers to Factory Defaults",
                "instruction": "In Chrome, Edge, or Firefox, open Settings > click 'Reset settings' > click 'Restore settings to their original defaults'.",
                "why": "Clears malicious browser extensions, rogue search engines, and malicious background push notification permissions."
            }
        ],
        "expected_results": "Malware is quarantined, browser redirects stop, and CPU usage returns to normal baseline levels.",
        "safety_warning": "NEVER call telephone numbers shown on flashing red screens claiming 'Your PC is infected by Zeus virus'. These are fake scam call centers attempting to steal credit card details.",
        "technician_trigger": "If your files have been renamed with strange extensions (e.g. .locked, .crypto) and a text file demands ransom, your computer has been hit by ransomware; consult a data recovery expert."
    },
    {
        "id": "mouse-touchpad-not-working",
        "title": "15. Mouse or Touchpad Not Working: Cursor Frozen, Disappearing or Unresponsive",
        "category": "Printers & Devices",
        "summary": "Your laptop trackpad or external USB/wireless mouse does not respond to clicks or movement, or the mouse cursor has completely vanished from the screen.",
        "difficulty": "Beginner",
        "estimated_time": "3-7 mins",
        "tags": ["mouse", "touchpad", "trackpad", "cursor", "pointer", "frozen mouse", "15"],
        "common_causes": [
            "Accidentally toggled the physical touchpad disable hotkey (Fn + F7/F9/F10).",
            "Dead AA/AAA battery in wireless mouse or loose USB receiver dongle.",
            "Touchpad driver disabled or corrupted Human Interface Device (HID) driver.",
            "Dirt, oil, or water droplets resting on the capacitive trackpad surface."
        ],
        "signs_to_look_for": [
            "Mouse cursor does not move when sliding finger on the trackpad.",
            "Mouse pointer is completely missing from the screen.",
            "Wireless mouse sensor light on the bottom is not glowing."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Check the Physical Touchpad Toggle Key",
                "instruction": "Look at the top row (F1-F12) of your laptop keyboard for an icon of a trackpad with a line through it (commonly F7, F9, or F10). Press Fn + that key. On HP laptops, look for a tiny amber dot in the top-left corner of the trackpad and double-tap it.",
                "why": "Laptops have dedicated privacy and gaming switches that instantly disable the trackpad to prevent accidental palm clicks."
            },
            {
                "step": 2,
                "title": "Verify Mouse Battery, Switch, and USB Port",
                "instruction": "For external mice: turn the bottom switch off and on, replace the AA/AAA battery with a fresh one, and plug the USB receiver dongle into a different USB port directly on the PC.",
                "why": "Low battery voltage causes mouse sensors to disconnect or stutter."
            },
            {
                "step": 3,
                "title": "Reinstall Mouse Drivers Using Only Keyboard Navigation",
                "instruction": "Press Windows Key > type 'devmgmt.msc' > press Enter. Press Tab key once, use Down Arrow to reach 'Mice and other pointing devices', press Right Arrow to expand. Select your mouse, press Shift + F10 (or Menu key) > select 'Uninstall device' > press Enter. Then press Alt + F4 and restart PC.",
                "why": "Windows automatically detects the mouse hardware during reboot and installs fresh HID drivers."
            }
        ],
        "expected_results": "The mouse cursor reappears on screen and moves smoothly across your desktop.",
        "safety_warning": "Do not clean trackpads with soaking wet wipes; excess alcohol or water can seep under the trackpad edges and short out internal motherboard traces.",
        "technician_trigger": "If a laptop trackpad is swelling upward, stiff to click, or lifting out of the palm rest, stop using the laptop immediately—the lithium battery underneath has swollen."
    },
    {
        "id": "hard-drive-ssd-failure",
        "title": "19. Hard Drive or SSD Failure: SMART Errors, Clicking Noises & Unreadable Sectors",
        "category": "Storage & Files",
        "summary": "Your computer warns of 'SMART status BAD', disk read errors, extreme disk latency, or repetitive clicking sounds, with files disappearing or becoming unreadable.",
        "difficulty": "Intermediate",
        "estimated_time": "10-20 mins",
        "tags": ["hard drive failure", "ssd failure", "smart error", "clicking", "bad sectors", "disk failure", "19"],
        "common_causes": [
            "Physical mechanical wear on HDD read/write heads and platters.",
            "NAND flash memory cell exhaustion on older heavily-written SSDs.",
            "Damage caused by dropping a laptop while the hard drive was spinning.",
            "Overheating storage drive degrading controller chips."
        ],
        "signs_to_look_for": [
            "Repetitive rhythmic clicking, grinding, or buzzing sounds coming from the drive ('Click of Death').",
            "Windows Task Manager shows 100% disk usage constantly, even with 0 KB/s transfer speed.",
            "Computer boots directly into BIOS showing 'Hard Drive Not Installed' or 'SMART Failure Imminent'."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Immediately Back Up Critical Files to Cloud or USB",
                "instruction": "Insert an external USB flash drive and immediately copy your most important photos, work documents, and school projects first. Do not attempt full system backups yet.",
                "why": "Failing drives can suffer total mechanical or electrical death at any moment without warning. Prioritize irreplaceable personal files first."
            },
            {
                "step": 2,
                "title": "Check SMART Health Status via Command Prompt",
                "instruction": "Open Command Prompt as Administrator and type: wmic diskdrive get status, caption. Press Enter.",
                "why": "If the status column reports 'Pred Fail' or 'Bad' instead of 'OK', the internal drive firmware has detected that bad sectors have exhausted spare reserves."
            },
            {
                "step": 3,
                "title": "Run Built-in Windows Error Checking",
                "instruction": "Open File Explorer > This PC > Right-click C: Drive > Properties > Tools tab > click 'Check' under Error checking.",
                "why": "Scans filesystem metadata integrity and marks corrupted sectors to prevent Windows from writing files to damaged areas."
            }
        ],
        "expected_results": "Critical personal files are safely rescued before catastrophic drive failure, and disk diagnostics confirm whether replacement is required.",
        "safety_warning": "DO NOT run intensive defragmentation on an SSD or a clicking HDD. Defragmentation forces continuous heavy reading/writing that will destroy a dying drive.",
        "technician_trigger": "If a mechanical hard drive is clicking rhythmically, power it off immediately to prevent read heads from physically scraping magnetic media off the platters."
    },
    {
        "id": "ram-memory-problems",
        "title": "20. RAM Memory Problems: Random Restarts, Memory Management Crashes & Beep Codes",
        "category": "System Performance",
        "summary": "Your computer suffers random crashes with 'MEMORY_MANAGEMENT' blue screens, applications randomly disappear without errors, or motherboard beeps continuously on startup.",
        "difficulty": "Intermediate",
        "estimated_time": "10-20 mins",
        "tags": ["ram", "memory", "memory management", "beep code", "crashes", "dimm", "20"],
        "common_causes": [
            "Defective memory chip cell failing read/write integrity tests.",
            "Dust, lint, or microscopic oxidation on gold DIMM pin contacts.",
            "Mismatched RAM sticks with conflicting timings, voltages, or speeds.",
            "Unstable XMP or EXPO overclocking profiles in motherboard BIOS."
        ],
        "signs_to_look_for": [
            "Blue screens with codes: MEMORY_MANAGEMENT, PAGE_FAULT_IN_NONPAGED_AREA, or IRQL_NOT_LESS_OR_EQUAL.",
            "Games and web browser tabs abruptly crash with 'Status: Access Violation'.",
            "Motherboard beeps in continuous beeps on power-up and displays no video."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Run Windows Memory Diagnostic Tool",
                "instruction": "Press Windows Key + R, type 'mdsched.exe' and press Enter. Select 'Restart now and check for problems'. Your PC will reboot into a blue diagnostic screen.",
                "why": "Tests every memory address with complex bit-flip algorithms before Windows loads. If errors are found, hardware RAM failure is confirmed."
            },
            {
                "step": 2,
                "title": "Reseat RAM Sticks in Motherboard Slots",
                "instruction": "Turn off PC, unplug power cord from wall. Open the desktop side panel (or laptop RAM cover). Press the retention clips to release the RAM sticks. Wipe the gold contact pins with a dry clean microfiber cloth, then press firmly into the slots until clips click shut.",
                "why": "Seasonal thermal expansion and vibration cause RAM contacts to microscopically shift and oxidize."
            },
            {
                "step": 3,
                "title": "Test RAM Sticks Individually",
                "instruction": "If your PC has multiple RAM sticks, remove all except one stick placed in Slot 2. Test your PC. Then swap sticks to test the other one.",
                "why": "Isolates exactly which specific memory stick or motherboard slot is defective."
            },
            {
                "step": 4,
                "title": "Disable XMP/DOCP Memory Overclocking in BIOS",
                "instruction": "Restart PC and tap Delete or F2 to enter BIOS. Find 'XMP', 'DOCP', or 'EXPO' and set it to 'Disabled' or 'Auto' (default JEDEC speed). Save and exit.",
                "why": "Overclocked memory profiles frequently become unstable as motherboards age."
            }
        ],
        "expected_results": "Memory crashes stop completely, and Windows Memory Diagnostic passes with 'No memory errors were detected'.",
        "safety_warning": "Always unplug the AC power cord and touch an unpainted metal surface before handling RAM to prevent electrostatic discharge (ESD) from frying memory chips.",
        "technician_trigger": "If Windows Memory Diagnostic flags errors on multiple different known-good RAM sticks, the motherboard CPU socket pins or memory controller may be damaged."
    },
    {
        "id": "software-installation-failure",
        "title": "22. Software Installation Failure: Error Codes, Missing DLLs & Installer Freezes",
        "category": "Software & Apps",
        "summary": "An application installer fails with errors like 'The cabinet file is corrupt', 'Installation was interrupted', 'Error 1603', or missing VC++ Runtime DLLs.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["installation failure", "installer error", "error 1603", "missing dll", "setup failed", "22"],
        "common_causes": [
            "Missing Microsoft Visual C++ Redistributable runtime libraries.",
            "Insufficient administrator privileges to write to Program Files or Windows Registry.",
            "Corrupted Windows Installer (msiexec.exe) background service.",
            "Antivirus software falsely blocking installer temporary script files."
        ],
        "signs_to_look_for": [
            "Setup wizard displays 'Installation ended prematurely because of an error'.",
            "Error pop-up: 'vcruntime140.dll was not found' or 'msvcp140.dll is missing'.",
            "Installer progress bar gets stuck at 99% and never finishes."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Run Installer as Administrator",
                "instruction": "Right-click the setup file (.exe or .msi) and select 'Run as administrator'. Click 'Yes' on the User Account Control prompt.",
                "why": "Installers need elevated permissions to register system services and write files to the protected C:\\Program Files directory."
            },
            {
                "step": 2,
                "title": "Install Official Microsoft Visual C++ Runtimes",
                "instruction": "Search official Microsoft Support for 'Visual C++ Redistributable latest supported downloads'. Download and install BOTH the x86 and x64 versions (vc_redist.x86.exe and vc_redist.x64.exe). Restart your PC.",
                "why": "Over 90% of missing DLL installer errors occur because modern programs depend on Microsoft C++ runtime libraries that aren't pre-installed."
            },
            {
                "step": 3,
                "title": "Restart the Windows Installer Service",
                "instruction": "Press Windows Key + R, type 'services.msc' and press Enter. Scroll down to 'Windows Installer'. Right-click it and choose 'Restart' (or 'Start' if stopped).",
                "why": "Clears hung installation locks from previously interrupted setup processes."
            },
            {
                "step": 4,
                "title": "Clear the Windows Temp Folder",
                "instruction": "Press Windows Key + R, type '%temp%' and press Enter. Select all files with Ctrl + A and press Delete. Skip any files currently in use.",
                "why": "Stale setup scripts in the temporary directory often cause new installer instances to error out with collision conflicts."
            }
        ],
        "expected_results": "The application setup completes smoothly with a 'Installation Successful' confirmation.",
        "safety_warning": "Never download individual .DLL files from random third-party DLL download websites; they are frequently malicious or outdated. Always install official Microsoft redistributables.",
        "technician_trigger": "If all software installers fail system-wide with error 1719 (Windows Installer service could not be accessed), registry permissions in HKEY_LOCAL_MACHINE require repair."
    },
    {
        "id": "screen-flickering",
        "title": "24. Screen Flickering: Display Flashing, Lines on Screen & Refresh Rate Glitches",
        "category": "Display & Monitors",
        "summary": "Your laptop display or computer monitor repeatedly flashes, jitters, displays horizontal or vertical lines, or momentarily goes black.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["screen flickering", "display flashing", "flicker", "lines on screen", "refresh rate", "24"],
        "common_causes": [
            "Incompatible display refresh rate (Hz) or variable refresh rate (G-Sync/FreeSync) glitch.",
            "Corrupted or outdated graphics driver.",
            "Loose or unshielded HDMI/DisplayPort cable picking up electrical interference.",
            "Pinched or damaged internal eDP video ribbon cable inside laptop hinge."
        ],
        "signs_to_look_for": [
            "Screen flashes on and off every few seconds.",
            "Horizontal colored lines jitter across the screen when moving the mouse.",
            "Flickering stops or worsens when moving the laptop lid open and closed."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Isolate Software vs Hardware with Task Manager",
                "instruction": "Press Ctrl + Shift + Esc to open Task Manager. Look closely at your screen: If everything on the screen flickers EXCEPT Task Manager, an app is causing it. If Task Manager flickers along with everything else, the graphics driver or hardware is at fault.",
                "why": "Task Manager operates on a separate drawing surface, providing instant diagnosis between third-party app conflicts vs display hardware/driver issues."
            },
            {
                "step": 2,
                "title": "Change Display Refresh Rate to 60Hz",
                "instruction": "Right-click Desktop > Display settings > scroll down to 'Advanced display'. Next to 'Choose a refresh rate', change it from high refresh (144Hz/120Hz) to standard 60 Hz. Turn off 'Variable refresh rate'.",
                "why": "Resolves timing sync mismatches between the GPU frame buffer and panel controller."
            },
            {
                "step": 3,
                "title": "Reinstall Display Driver via Device Manager",
                "instruction": "Press Windows Key + X > Device Manager > expand 'Display adapters'. Right-click your graphics card (Intel, AMD, or NVIDIA) > click 'Uninstall device' > restart your PC.",
                "why": "Windows reinstalls a clean driver upon reboot, clearing corrupted display pipeline cache."
            },
            {
                "step": 4,
                "title": "Test Laptop Lid Hinge Movement",
                "instruction": "On laptops, gently tilt the screen back and forth between 45 and 135 degrees. Observe if lines appear only at specific angles.",
                "why": "If lines appear only when adjusting the hinge, the internal video ribbon cable has worn out from repeated opening and closing."
            }
        ],
        "expected_results": "The screen remains completely steady and clear with zero flashing or jittering.",
        "safety_warning": "Do not press hard against flickering laptop displays with your fingers; excessive pressure will crack the delicate liquid crystal display substrate.",
        "technician_trigger": "If screen lines or flickering directly change when touching or moving the laptop hinge, the internal eDP video cable needs professional replacement."
    },
    {
        "id": "computer-restarting-automatically",
        "title": "25. Computer Restarting Automatically: Sudden Reboots without Warning",
        "category": "System Performance",
        "summary": "Your PC or laptop abruptly restarts in the middle of working or gaming without warning, blue screens, or shutdown screens.",
        "difficulty": "Intermediate",
        "estimated_time": "10-15 mins",
        "tags": ["restarting automatically", "sudden reboot", "restarting", "spontaneous reboot", "25"],
        "common_causes": [
            "Processor or graphics card reaching thermal junction limit (100°C) triggering emergency hardware shutdown.",
            "Failing desktop Power Supply Unit (PSU) dropping voltage under 3D load.",
            "Windows configured to automatically reboot on system failure before displaying BSOD error codes.",
            "Voltage drops or loose power cord connection."
        ],
        "signs_to_look_for": [
            "Computer powers off instantly and boots right back up as if someone pressed the reset button.",
            "Restarts happen specifically during demanding tasks like gaming, video editing, or compiling.",
            "Windows Event Viewer logs Event ID 41: 'Kernel-Power - The system has rebooted without cleanly shutting down first'."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Disable 'Automatically Restart on System Failure'",
                "instruction": "Press Windows Key + R, type 'sysdm.cpl' and press Enter. Click the 'Advanced' tab > under 'Startup and Recovery' click 'Settings'. Uncheck 'Automatically restart' and click OK.",
                "why": "When Windows experiences a critical error, it defaults to restarting instantly. Disabling this forces Windows to show the Blue Screen error code so you can identify the broken driver."
            },
            {
                "step": 2,
                "title": "Inspect Reliability History for the Culprit",
                "instruction": "Open Start, type 'Reliability History' and press Enter. Click on the red 'X' icons on days where restarts occurred. Read the 'Critical events' log.",
                "why": "Windows keeps an exact diary of every hardware crash, failed driver update, or kernel crash with exact timestamps."
            },
            {
                "step": 3,
                "title": "Check Temperatures with HWMonitor",
                "instruction": "Download HWMonitor or Core Temp. Check CPU and GPU temperatures. If CPU temperatures exceed 90°C during normal tasks, your cooling system is failing.",
                "why": "CPUs have built-in PROCHOT thermal trip mechanisms that cut power instantly to prevent chip melting."
            },
            {
                "step": 4,
                "title": "Plug Directly into Wall Socket (No Daisy Chains)",
                "instruction": "Plug the computer power cord directly into a wall outlet rather than a daisy-chained extension cord or overloaded power strip.",
                "why": "Voltage dips (brownouts) cause PC power supplies to drop below threshold and trigger an automatic reboot."
            }
        ],
        "expected_results": "Spontaneous restarts stop, or Windows displays the exact error code responsible for the crash.",
        "safety_warning": "Frequent sudden power cuts can corrupt the master file table of your storage drive. Ensure critical files are backed up.",
        "technician_trigger": "If sudden restarts happen specifically during 3D gaming despite normal temperatures, the power supply unit (PSU) capacitors have degraded and cannot deliver required wattage."
    },
    {
        "id": "high-cpu-ram-usage",
        "title": "27. High CPU or RAM Usage: 100% Resource Spike, Fan Ramping & Sluggish System",
        "category": "System Performance",
        "summary": "Your computer fans roar loudly, system responsiveness crawls to a halt, and Task Manager shows CPU or Memory pegged at 95% to 100%.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["high cpu", "high ram", "100% cpu", "100% disk", "sluggish", "resource spike", "27"],
        "common_causes": [
            "Windows Search Indexing or SysMain (SuperFetch) service thrashing hard drive.",
            "Background Windows Update services (TiWorker.exe, svchost.exe) compiling update files.",
            "Cryptocurrency mining malware running hidden in the background.",
            "Browser tab memory leaks from video streaming or heavy web apps."
        ],
        "signs_to_look_for": [
            "Task Manager shows CPU, Memory, or Disk graphs stuck at 100% in bright orange/red.",
            "Laptop cooling fans run at maximum speed even when no programs are open.",
            "Mouse clicks take 5-10 seconds to respond."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Identify Resource Hogs in Task Manager",
                "instruction": "Press Ctrl + Shift + Esc. Click 'More details' if needed. Click the 'CPU' header to sort highest usage to top. Do the same for 'Memory'. Identify the top 2-3 apps.",
                "why": "Pinpoints the exact background application or service consuming all computing resources."
            },
            {
                "step": 2,
                "title": "Optimize Windows SysMain & Windows Search",
                "instruction": "Press Windows Key + R, type 'services.msc' and press Enter. Locate 'SysMain' (formerly SuperFetch). Right-click > Properties > set Startup type to 'Automatic (Delayed Start)' or 'Disabled' > click Stop > click OK.",
                "why": "SysMain attempts to preload apps into RAM. On mechanical hard drives and older systems, it causes continuous 100% disk and CPU thrashing."
            },
            {
                "step": 3,
                "title": "Restart Windows Explorer",
                "instruction": "In Task Manager > Processes tab, scroll down to 'Windows processes'. Find 'Windows Explorer', right-click it, and click 'Restart'.",
                "why": "Clears leaked memory and desktop shell rendering buffers without requiring a full computer restart."
            },
            {
                "step": 4,
                "title": "Disable High-Impact Startup Apps",
                "instruction": "In Task Manager, switch to the 'Startup apps' tab. Sort by 'Startup impact'. Right-click and disable non-essential apps like Spotify, Discord, Steam, and OneDrive.",
                "why": "Prevents dozens of background telemetry and update services from loading into memory when you log in."
            }
        ],
        "expected_results": "Idle CPU usage drops back down to 1-5%, RAM usage normalizes, and cooling fans quiet down.",
        "safety_warning": "Do not terminate Windows critical processes named 'System', 'ntoskrnl.exe', or 'csrss.exe'; doing so will cause an immediate blue screen crash.",
        "technician_trigger": "If memory usage shows 99% but the sum of all visible processes in Task Manager is only 2 GB, a hardware driver has a non-paged pool memory leak requiring a motherboard chipset update."
    },
    {
        "id": "laptop-battery-drains-quickly",
        "title": "30. Laptop Battery Drains Quickly: Rapid Battery Drain in 1-2 Hours",
        "category": "Battery & Power",
        "summary": "Your laptop battery used to last 6-8 hours, but now dies completely in an hour or two even with light web browsing.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["battery drain", "battery life", "drains fast", "battery health", "power drain", "30"],
        "common_causes": [
            "Severe chemical capacity degradation of the lithium-ion battery cells.",
            "Dedicated high-power GPU (NVIDIA/AMD) kept awake by background apps.",
            "Screen brightness set to 100% and keyboard backlighting active.",
            "Background applications running constantly while the laptop lid is closed (Modern Standby drain)."
        ],
        "signs_to_look_for": [
            "Battery percentage drops 1-2% every minute.",
            "Laptop feels warm in your bag while sleeping.",
            "Battery suddenly drops from 35% straight to 0% and shuts down."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Generate a Windows Battery Health Report",
                "instruction": "Open Start, type 'cmd', right-click Command Prompt > Run as administrator. Type: powercfg /batteryreport and press Enter. Open the generated file located at C:\\Windows\\System32\\battery-report.html.",
                "why": "Compare 'Design Capacity' vs 'Full Charge Capacity'. If Full Charge Capacity is less than 50% of Design Capacity, the battery has chemically aged and holds half its original charge."
            },
            {
                "step": 2,
                "title": "Lower Screen Brightness & Enable Energy Saver",
                "instruction": "Click the battery icon in the taskbar > toggle 'Battery Saver' ON. Lower display brightness from 100% to 50-60%. Turn off keyboard backlighting.",
                "why": "The display panel accounts for up to 45% of total battery power consumption on modern laptops."
            },
            {
                "step": 3,
                "title": "Ensure Dedicated GPU is Sleeping",
                "instruction": "Open NVIDIA Control Panel > Desktop menu > click 'Display GPU Activity Icon in Notification Area'. Check the system tray icon to ensure no simple apps (like web browsers) are running on the power-hungry dedicated GPU.",
                "why": "An active dedicated graphics chip drains batteries 3x faster than integrated processor graphics."
            },
            {
                "step": 4,
                "title": "Find Energy-Draining Background Apps",
                "instruction": "Open Windows Settings > System > Power & battery > click 'Battery usage'. Review which apps used the highest percentage in the last 24 hours.",
                "why": "Identifies rogue background apps syncing files or streaming media while your laptop is supposed to be sleeping."
            }
        ],
        "expected_results": "Battery runtime increases by 2 to 4 hours per charge on healthy battery packs.",
        "safety_warning": "Avoid completely draining your laptop to 0% repeatedly; deep discharges stress lithium-ion chemistry and accelerate capacity loss.",
        "technician_trigger": "If the battery health report shows capacity below 30% of original design, or the laptop dies instantly at 30% without warning, replace the battery pack."
    },
    {
        "id": "laptop-fan-unusual-noises",
        "title": "31. Laptop Fan Making Unusual Noises: Grinding, Rattling, Buzzing, or Screeching",
        "category": "System Performance",
        "summary": "Your laptop cooling fan sounds like an airplane taking off, makes a clicking, grinding, buzzing, or high-pitched screeching sound.",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["fan noise", "grinding fan", "rattling", "buzzing", "cooling fan", "loud fan", "31"],
        "common_causes": [
            "Dust accumulation and hair wrapped around fan axle causing imbalance.",
            "Worn fan sleeve/ball bearing where lubrication has dried out.",
            "Foreign debris (small crumb or sticker) trapped in the fan shroud.",
            "Bent fan blade contacting the metal casing under heat expansion."
        ],
        "signs_to_look_for": [
            "Rhythmic clicking or grinding sound that speeds up when launching games or programs.",
            "High-pitched screeching or vibrating sensation through the laptop palm rest.",
            "Fan runs at maximum RPM constantly, even while sitting idle at the desktop."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Safely Blow Out Dust Using Compressed Air",
                "instruction": "Shut down the laptop and unplug the charger. Locate the bottom intake vents and side/rear exhaust vents. Spray short 1-second bursts of compressed air into the exhaust and intake vents. Keep the can completely upright.",
                "why": "Clears dust bunnies and debris clogging the fan blades and copper radiator heat sink fins."
            },
            {
                "step": 2,
                "title": "Use Laptop on Hard Flat Surfaces Only",
                "instruction": "Never place your laptop on beds, blankets, pillows, or carpet. Always place it on a clean wooden desk, tabletop, or hard laptop stand.",
                "why": "Fabrics choke cooling vents and cause the fan to vacuum bed lint and pet hair directly into the fan bearings."
            },
            {
                "step": 3,
                "title": "Switch Fan Profile in Laptop Management Software",
                "instruction": "Open your laptop's management software (Lenovo Vantage, MyASUS, Dell Power Manager, HP OMEN Gaming Hub). Switch the thermal mode from 'Performance' or 'Turbo' to 'Quiet' or 'Balanced'.",
                "why": "Quiet profiles adjust the fan curve to run at lower, quieter RPMs for web browsing and office work."
            }
        ],
        "expected_results": "Dust is cleared, airflow is restored, and fan noise returns to a gentle, quiet hum.",
        "safety_warning": "Never insert needles, toothpicks, or metal wires into the fan vents while the laptop is powered on. Always hold compressed air cans upright to avoid spraying freezing liquid propellant.",
        "technician_trigger": "If the fan makes loud mechanical grinding or screeching noises even after clearing dust, the fan bearing has physically worn out and the fan module must be replaced."
    },
    {
        "id": "files-accidentally-deleted",
        "title": "32. Files Accidentally Deleted: Recovering Lost Documents, Photos & Recycle Bin Files",
        "category": "Storage & Files",
        "summary": "You accidentally deleted an important document, folder, or photo, emptied the Recycle Bin, or pressed Shift + Delete by mistake.",
        "difficulty": "Beginner",
        "estimated_time": "5-15 mins",
        "tags": ["deleted files", "recycle bin", "file recovery", "lost documents", "undelete", "32"],
        "common_causes": [
            "Accidental pressing of Shift + Delete (bypasses Recycle Bin).",
            "Recycle Bin emptied without checking contents.",
            "File accidentally dragged into an unintended subfolder.",
            "Office crash before saving draft."
        ],
        "signs_to_look_for": [
            "File is missing from its original folder.",
            "Recycle Bin shows empty icon.",
            "Recent files list in Word/Excel shows the filename, but clicking it says 'File not found'."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Check the Windows Recycle Bin",
                "instruction": "Double-click the Recycle Bin icon on your desktop. In the search box in the top-right corner, type the name of your file. If found, right-click it and click 'Restore'.",
                "why": "Standard deleted files remain in the Recycle Bin with original folder path metadata until manually emptied."
            },
            {
                "step": 2,
                "title": "Restore Previous Versions (Shadow Copies)",
                "instruction": "Open File Explorer and navigate to the folder where the deleted file used to live. Right-click in the empty space > click 'Properties' > click the 'Previous Versions' tab. Select a previous date and click 'Restore'.",
                "why": "Windows automatically creates shadow copies of folders when System Restore or File History is enabled."
            },
            {
                "step": 3,
                "title": "Check Microsoft Office AutoRecover Drafts",
                "instruction": "If you lost an unsaved Word or Excel file, open Word > click 'File' > 'Open' > scroll to the bottom and click 'Recover Unsaved Documents'.",
                "why": "Microsoft Office automatically saves background backup drafts (.asd files) every 10 minutes."
            },
            {
                "step": 4,
                "title": "Use Microsoft's Official Windows File Recovery Tool",
                "instruction": "Open Command Prompt as Administrator and install the official Microsoft utility by running: winfr C: D:\\RecoveredFiles /regular /n *.docx (replace D: with an external USB drive).",
                "why": "Scans the NTFS master file table for deleted records before newly created files overwrite the disk blocks."
            }
        ],
        "expected_results": "Deleted documents, spreadsheets, and photos are successfully recovered to their original locations.",
        "safety_warning": "DO NOT install large new games or download big files onto the drive where files were lost. New files will overwrite the disk sectors containing your deleted data.",
        "technician_trigger": "If critical files were lost on a failing hard drive or formatted SSD, stop using the computer immediately and consult a professional cleanroom data recovery lab."
    },
    {
        "id": "date-time-keep-resetting",
        "title": "34. Date and Time Keep Resetting: CMOS Coin Battery Depletion & Clock Errors",
        "category": "System Performance",
        "summary": "Every time you turn on or unplug your computer, the Windows clock resets to the year 2000 or the wrong hour, and web browsers show 'Your connection is not private' (SSL clock errors).",
        "difficulty": "Beginner",
        "estimated_time": "5-10 mins",
        "tags": ["date and time", "clock resetting", "cmos battery", "bios clock", "ssl error", "34"],
        "common_causes": [
            "Depleted CR2032 3V coin-cell battery on the computer motherboard.",
            "Windows Time synchronization service (W32Time) stopped or set to manual.",
            "Incorrect time zone selected in Windows settings."
        ],
        "signs_to_look_for": [
            "Computer clock shows an old date (e.g. January 1, 2000 or 2015) after being unplugged.",
            "Every website displays 'Your clock is behind' or SSL certificate security errors.",
            "Motherboard displays 'CMOS Checksum Error - Defaults Loaded' during boot."
        ],
        "steps": [
            {
                "step": 1,
                "title": "Force-Sync Clock with Official Internet Time Server",
                "instruction": "Open Windows Settings > Time & language > Date & time. Ensure both 'Set time automatically' and 'Set time zone automatically' are turned ON. Scroll down and click the 'Sync now' button.",
                "why": "Forces Windows to query government atomic time servers (time.windows.com) over Network Time Protocol (NTP)."
            },
            {
                "step": 2,
                "title": "Restart and Automate the Windows Time Service",
                "instruction": "Press Windows Key + R, type 'services.msc' and press Enter. Locate 'Windows Time'. Right-click > Properties > change Startup type to 'Automatic' > click 'Start' > click OK.",
                "why": "Ensures the background time synchronization daemon runs automatically every time Windows boots."
            },
            {
                "step": 3,
                "title": "Replace the Motherboard CR2032 Coin-Cell Battery",
                "instruction": "On desktop PCs, turn off power and unplug the power cable. Open the side panel, find the shiny, silver coin-sized CR2032 battery on the motherboard, push the release latch, remove it, and snap a fresh $2 CR2032 battery in with the '+' side facing up.",
                "why": "When the computer is unplugged, the CMOS battery keeps the internal hardware clock chip ticking. When the battery dies after 5-7 years, the clock resets to factory default on every power loss."
            }
        ],
        "expected_results": "Windows keeps perfect time across shutdowns, and browser SSL security certificate errors disappear.",
        "safety_warning": "Keep lithium coin batteries strictly away from young children and pets; swallowing a coin battery causes chemical burns within hours.",
        "technician_trigger": "On ultra-slim laptops where the RTC/CMOS battery is soldered directly to the motherboard or buried underneath the heat pipes, seek a technician for replacement."
    }
]
