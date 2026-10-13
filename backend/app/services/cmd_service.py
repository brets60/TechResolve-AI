import re
from typing import Dict, Any, List, Optional
from app.ai.gemini_service import gemini_service

false = False
true = True
null = None

CMD_LIBRARY: List[Dict[str, Any]] = [
    {
        "id": "files-dir",
        "command": "dir",
        "name": "List Files and Folders",
        "category": "Files & Navigation",
        "description": "Displays a list of all files, subfolders, file sizes, and last modified dates in your current folder.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "dir",
                "meaning": "Directory listing utility that prints files and folders"
            }
        ],
        "expected_output": " Volume in drive C has no label.\n Directory of C:\\Users\\User\n04/10/2026  10:30 AM    <DIR>          Documents\n04/10/2026  02:15 PM            24,512 notes.txt",
        "what_to_look_for": "File sizes and names. Folders have the <DIR> label next to them.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type dir and press Enter."
        ]
    },
    {
        "id": "files-cd",
        "command": "cd [folder]",
        "name": "Change Directory (Open Folder)",
        "category": "Files & Navigation",
        "description": "Navigates into a specified folder (e.g. 'cd Documents' opens the Documents folder).",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "cd",
                "meaning": "Change Directory command"
            },
            {
                "flag": "[folder]",
                "meaning": "Name of the target folder you want to enter"
            }
        ],
        "expected_output": "C:\\Users\\User\\Documents>",
        "what_to_look_for": "The prompt path updates to show the folder you are currently inside.",
        "how_to_run_steps": [
            "1. Type cd followed by the folder name (e.g. cd Downloads).",
            "2. Press Enter."
        ]
    },
    {
        "id": "files-cd-up",
        "command": "cd ..",
        "name": "Go Up One Folder Level",
        "category": "Files & Navigation",
        "description": "Moves backwards up one level to the parent directory (like clicking the Back button in File Explorer).",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "..",
                "meaning": "Refers to the parent directory one level above"
            }
        ],
        "expected_output": "C:\\Users>",
        "what_to_look_for": "The command path retreats one folder back.",
        "how_to_run_steps": [
            "1. Type cd .. and press Enter."
        ]
    },
    {
        "id": "files-mkdir",
        "command": "mkdir [folder_name]",
        "name": "Create New Folder",
        "category": "Files & Navigation",
        "description": "Creates a brand new folder inside the current directory.",
        "safety_level": "Safe (Creates Folder)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "mkdir",
                "meaning": "Make Directory (creates a new folder)"
            }
        ],
        "expected_output": "Returns to the command prompt silently without errors.",
        "what_to_look_for": "Type dir to verify your new folder appears in the listing.",
        "how_to_run_steps": [
            "1. Type mkdir Projects and press Enter."
        ]
    },
    {
        "id": "files-copy",
        "command": "copy [file] [destination]",
        "name": "Copy File",
        "category": "Files & Navigation",
        "description": "Duplicates one or more files to another folder or storage drive without deleting the original.",
        "safety_level": "Safe (Duplicates File)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "copy",
                "meaning": "Copies source file to destination path"
            }
        ],
        "expected_output": "        1 file(s) copied.",
        "what_to_look_for": "Confirms '1 file(s) copied'.",
        "how_to_run_steps": [
            "1. Type: copy report.docx D:\\Backups\\",
            "2. Press Enter."
        ]
    },
    {
        "id": "files-xcopy",
        "command": "xcopy [source] [destination] /s /e",
        "name": "Copy Directory & Subfolders",
        "category": "Files & Navigation",
        "description": "Copies entire folder hierarchies, including all subdirectories and empty folders.",
        "safety_level": "Safe (Duplicates Folders)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/s",
                "meaning": "Copies directories and subdirectories (except empty ones)"
            },
            {
                "flag": "/e",
                "meaning": "Copies all subdirectories, even if they are empty"
            }
        ],
        "expected_output": "C:\\Source\\file1.txt\nC:\\Source\\file2.txt\n2 File(s) copied",
        "what_to_look_for": "Counts total files successfully replicated.",
        "how_to_run_steps": [
            "1. Type: xcopy C:\\Work D:\\Backup\\Work /s /e",
            "2. Press Enter."
        ]
    },
    {
        "id": "files-robocopy",
        "command": "robocopy [source] [destination] /mir",
        "name": "Robust Mirror Copy for Backups",
        "category": "Files & Navigation",
        "description": "Professional Windows backup copy tool. Resumes interrupted transfers and mirrors exact directory structures.",
        "safety_level": "Caution (Mirror Mode)",
        "safety_badge": "moderate",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "robocopy",
                "meaning": "Robust File Copy utility"
            },
            {
                "flag": "/mir",
                "meaning": "MIRror directory tree (adds new files and purges files deleted from source)"
            }
        ],
        "expected_output": "--------------------------------------------------\n   ROBOCOPY  ::  Robust File Copy for Windows\n--------------------------------------------------\n               Total    Copied   Skipped\n    Files :       45        45         0",
        "what_to_look_for": "Review the summary table for Copied vs Failed files count.",
        "how_to_run_steps": [
            "1. Type: robocopy C:\\Photos D:\\Photos_Backup /mir",
            "2. Press Enter."
        ]
    },
    {
        "id": "files-del",
        "command": "del [filename]",
        "name": "Delete File",
        "category": "Files & Navigation",
        "description": "Permanently deletes one or more specified files without moving them to the Recycle Bin.",
        "safety_level": "Caution (Permanent Delete)",
        "safety_badge": "moderate",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "del",
                "meaning": "Deletes the specified file permanently"
            }
        ],
        "expected_output": "Silently deletes the file and returns to prompt.",
        "what_to_look_for": "Double check filename spelling before pressing Enter, as CMD deletes bypass the Recycle Bin.",
        "how_to_run_steps": [
            "1. Type: del old_log.txt",
            "2. Press Enter."
        ]
    },
    {
        "id": "files-ren",
        "command": "ren [old_name] [new_name]",
        "name": "Rename File or Folder",
        "category": "Files & Navigation",
        "description": "Changes the name of an existing file or folder.",
        "safety_level": "Safe (Renames)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "ren",
                "meaning": "Rename command (also works as 'rename')"
            }
        ],
        "expected_output": "Returns to command prompt on success.",
        "what_to_look_for": "If a file with the new name already exists, Windows will warn you.",
        "how_to_run_steps": [
            "1. Type: ren draft.txt final_report.txt",
            "2. Press Enter."
        ]
    },
    {
        "id": "files-move",
        "command": "move [file] [new_location]",
        "name": "Move File to Another Folder",
        "category": "Files & Navigation",
        "description": "Moves a file from its current directory to a destination folder.",
        "safety_level": "Safe (Relocates File)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "move",
                "meaning": "Transfers file and removes it from source"
            }
        ],
        "expected_output": "        1 file(s) moved.",
        "what_to_look_for": "Confirms '1 file(s) moved'.",
        "how_to_run_steps": [
            "1. Type: move doc.pdf C:\\Archive\\",
            "2. Press Enter."
        ]
    },
    {
        "id": "files-tree",
        "command": "tree",
        "name": "Display Graphical Folder Tree",
        "category": "Files & Navigation",
        "description": "Visually graphs all subfolders in the current directory as an branching ASCII tree.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "tree",
                "meaning": "Draws directory tree hierarchy"
            },
            {
                "flag": "/f",
                "meaning": "Optional flag: also display file names in each folder"
            }
        ],
        "expected_output": "Folder PATH listing\n\u251c\u2500\u2500 Documents\n\u2502   \u251c\u2500\u2500 Invoices\n\u2502   \u2514\u2500\u2500 Receipts\n\u2514\u2500\u2500 Photos",
        "what_to_look_for": "Helps locate deeply nested subfolders quickly.",
        "how_to_run_steps": [
            "1. Type tree and press Enter."
        ]
    },
    {
        "id": "files-type",
        "command": "type [filename]",
        "name": "View Text File Contents",
        "category": "Files & Navigation",
        "description": "Displays the textual contents of any file directly inside the Command Prompt window.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "type",
                "meaning": "Prints contents of text file to standard output"
            }
        ],
        "expected_output": "Prints lines of text from the file.",
        "what_to_look_for": "Quick way to check config files or logs without opening Notepad.",
        "how_to_run_steps": [
            "1. Type: type readme.txt",
            "2. Press Enter."
        ]
    },
    {
        "id": "files-attrib",
        "command": "attrib [filename]",
        "name": "View & Change File Attributes",
        "category": "Files & Navigation",
        "description": "Checks or toggles file flags such as Hidden (+H / -H) and Read-Only (+R / -R).",
        "safety_level": "Safe (Attributes)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "+H / -H",
                "meaning": "Sets or clears Hidden attribute"
            },
            {
                "flag": "+R / -R",
                "meaning": "Sets or clears Read-only attribute"
            }
        ],
        "expected_output": "A   H        C:\\Users\\User\\secret.txt",
        "what_to_look_for": "Flags: 'H' indicates hidden, 'R' indicates read-only, 'A' indicates archive.",
        "how_to_run_steps": [
            "1. Type: attrib -h -r secret.txt to unhide and make editable.",
            "2. Press Enter."
        ]
    },
    {
        "id": "files-cls",
        "command": "cls",
        "name": "Clear Terminal Screen",
        "category": "Files & Navigation",
        "description": "Clears all previous text from the Command Prompt window and gives you a fresh clean screen.",
        "safety_level": "Safe (Cosmetic)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "cls",
                "meaning": "Clear Screen utility"
            }
        ],
        "expected_output": "Clears the window back to just the single prompt prompt line.",
        "what_to_look_for": "Your session history is wiped visually, leaving a clean workspace.",
        "how_to_run_steps": [
            "1. Type cls and press Enter."
        ]
    },
    {
        "id": "files-exit",
        "command": "exit",
        "name": "Close Command Prompt",
        "category": "Files & Navigation",
        "description": "Gracefully exits the Command Prompt window.",
        "safety_level": "Safe",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "exit",
                "meaning": "Quits the CMD interpreter process"
            }
        ],
        "expected_output": "The black Command Prompt window closes.",
        "what_to_look_for": "Closes the window.",
        "how_to_run_steps": [
            "1. Type exit and press Enter."
        ]
    },
    {
        "id": "powercfg-batteryreport",
        "command": "powercfg /batteryreport",
        "name": "Generate Battery Health Report",
        "category": "Battery & Power",
        "description": "Creates an official Windows report detailing your battery's factory capacity, current health, wear percentage, and charge cycle count.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "powercfg",
                "meaning": "Windows Power Configuration utility"
            },
            {
                "flag": "/batteryreport",
                "meaning": "Instructs Windows to measure battery cells and export an HTML report"
            }
        ],
        "expected_output": "Battery life report saved to file path C:\\Users\\...\\battery-report.html",
        "what_to_look_for": "Design Capacity vs Full Charge Capacity numbers. If Full Charge is less than 50% of Design, the battery is heavily worn.",
        "how_to_run_steps": [
            "1. Press the Windows Start button.",
            "2. Type cmd and press Enter.",
            "3. Type or paste: powercfg /batteryreport",
            "4. Press Enter. Note where Windows saved the file."
        ]
    },
    {
        "id": "powercfg-energy",
        "command": "powercfg /energy",
        "name": "Energy & Battery Drain Bug Audit",
        "category": "Battery & Power",
        "description": "Monitors laptop power usage for 60 seconds to detect runaway background apps, power-wasting USB devices, and sleep bugs.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "powercfg",
                "meaning": "Windows Power Configuration utility"
            },
            {
                "flag": "/energy",
                "meaning": "Analyzes system energy efficiency for 60 seconds and produces energy-report.html"
            }
        ],
        "expected_output": "Enabling tracing for 60 seconds... Observing system behavior... Analysis complete.",
        "what_to_look_for": "Errors count in red. Common culprits include devices blocking processor low-power sleep states.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: powercfg /energy",
            "3. Wait 60 seconds without using the computer for clean measurements.",
            "4. Open energy-report.html to view power-hungry drivers."
        ]
    },
    {
        "id": "powercfg-wake-armed",
        "command": "powercfg /devicequery wake_armed",
        "name": "Find Devices Waking PC from Sleep",
        "category": "Battery & Power",
        "description": "Lists the exact hardware devices (mouse, keyboard, network adapter) that are allowed to wake your computer up from sleep.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/devicequery",
                "meaning": "Queries Windows device power capabilities"
            },
            {
                "flag": "wake_armed",
                "meaning": "Filters to hardware currently configured to wake the system from sleep"
            }
        ],
        "expected_output": "HID Keyboard Device\nHID-compliant mouse\nIntel(R) Ethernet Connection",
        "what_to_look_for": "If your laptop randomly wakes up in a backpack, look for network adapters or sensitive mice listed here.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Paste: powercfg /devicequery wake_armed",
            "3. Press Enter to inspect wake triggers."
        ]
    },
    {
        "id": "powercfg-requests",
        "command": "powercfg /requests",
        "name": "Find Apps Blocking Windows Sleep",
        "category": "Battery & Power",
        "description": "Displays which running programs, audio streams, or background downloads are preventing your computer from going to sleep.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/requests",
                "meaning": "Enumerates active application and driver power requests"
            }
        ],
        "expected_output": "DISPLAY:\nNone.\nSYSTEM:\n[DRIVER] High Definition Audio Device\nAWAYMODE:\nNone.",
        "what_to_look_for": "Look for audio drivers, media players, or browser tabs holding the SYSTEM awake.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: powercfg /requests and press Enter."
        ]
    },
    {
        "id": "powercfg-availablesleepstates",
        "command": "powercfg /availablesleepstates",
        "name": "Check Supported Sleep & Standby Modes",
        "category": "Battery & Power",
        "description": "Checks which low-power states (Modern Standby S0, S3 Sleep, Hibernation) your hardware and BIOS support.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/availablesleepstates",
                "meaning": "Shows sleep states available on the system"
            }
        ],
        "expected_output": "The following sleep states are available on this system:\n    Standby (S0 Low Power Idle) Network Connected\n    Hibernate\n    Fast Startup",
        "what_to_look_for": "Shows whether your laptop uses Modern Standby (S0) or legacy S3 Sleep.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: powercfg /availablesleepstates and press Enter."
        ]
    },
    {
        "id": "powercfg-lastwake",
        "command": "powercfg /lastwake",
        "name": "Identify What Woke PC from Sleep Last",
        "category": "Battery & Power",
        "description": "Reveals the exact reason or device that caused your PC to wake up from its most recent sleep state.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/lastwake",
                "meaning": "Reports the wake history count and source"
            }
        ],
        "expected_output": "Wake History Count - 1\nWake Source: Device - Intel(R) USB 3.1 eXtensible Host Controller",
        "what_to_look_for": "Tells you whether a USB mouse movement, network packet, or scheduled task woke the PC.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: powercfg /lastwake and press Enter."
        ]
    },
    {
        "id": "powercfg-hibernate-off",
        "command": "powercfg /hibernate off",
        "name": "Disable Hibernation (Free 5-16GB Disk Space)",
        "category": "Battery & Power",
        "description": "Deletes the large hidden hiberfil.sys file from C: drive and frees up several gigabytes of space instantly.",
        "safety_level": "Safe (Modifies Power Setting)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/hibernate off",
                "meaning": "Turns off hibernation and deletes the multi-gigabyte hiberfil.sys storage file"
            }
        ],
        "expected_output": "Command returns cleanly without errors.",
        "what_to_look_for": "Check File Explorer: Your C: drive free space will increase by 5GB to 16GB.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: powercfg /hibernate off and press Enter."
        ]
    },
    {
        "id": "powercfg-hibernate-on",
        "command": "powercfg /hibernate on",
        "name": "Enable Windows Hibernation",
        "category": "Battery & Power",
        "description": "Enables Windows Hibernation so your open work is saved safely to disk when battery drops to 0%.",
        "safety_level": "Safe (Modifies Power Setting)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/hibernate on",
                "meaning": "Creates hiberfil.sys and enables hibernation state"
            }
        ],
        "expected_output": "Command completes cleanly.",
        "what_to_look_for": "Hibernate appears as an option in the Start menu power options.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: powercfg /hibernate on and press Enter."
        ]
    },
    {
        "id": "powercfg-standby-timeout",
        "command": "powercfg /change standby-timeout-ac 15",
        "name": "Set Sleep Timer When Plugged In",
        "category": "Battery & Power",
        "description": "Configures how many minutes of inactivity Windows waits before going to sleep when plugged into the charger.",
        "safety_level": "Safe (Modifies Timeout)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/change standby-timeout-ac",
                "meaning": "Sets standby timeout in minutes on AC power"
            },
            {
                "flag": "15",
                "meaning": "15 minutes (you can change this to any number)"
            }
        ],
        "expected_output": "Returns to command prompt on success.",
        "what_to_look_for": "Windows will now sleep after 15 minutes of idle time on AC power.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: powercfg /change standby-timeout-ac 15 and press Enter."
        ]
    },
    {
        "id": "net-ipconfig",
        "command": "ipconfig",
        "name": "View Basic IP Address & Gateway",
        "category": "Internet & Network",
        "description": "Displays your computer's local IP address, subnet mask, and router Default Gateway for all active adapters.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "ipconfig",
                "meaning": "Displays IP configuration values"
            }
        ],
        "expected_output": "IPv4 Address. . . . . . . . . . . : 192.168.1.50\nSubnet Mask . . . . . . . . . . . : 255.255.255.0\nDefault Gateway . . . . . . . . . : 192.168.1.1",
        "what_to_look_for": "If IPv4 starts with 169.254, your computer failed to receive an IP address from your router (APIPA issue).",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: ipconfig and press Enter."
        ]
    },
    {
        "id": "net-ipconfig-all",
        "command": "ipconfig /all",
        "name": "Detailed Network Specs & MAC Address",
        "category": "Internet & Network",
        "description": "Displays full network adapter hardware specifications, physical MAC addresses, DHCP lease dates, and DNS server addresses.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/all",
                "meaning": "Dumps detailed configuration information for every network adapter"
            }
        ],
        "expected_output": "Physical Address. . . . . . . . . : 00-1A-2B-3C-4D-5E\nDHCP Enabled. . . . . . . . . . . : Yes\nDNS Servers . . . . . . . . . . . : 8.8.8.8",
        "what_to_look_for": "Physical Address (MAC) for router whitelisting, and DNS Servers to check if custom DNS is active.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: ipconfig /all and press Enter."
        ]
    },
    {
        "id": "net-flushdns",
        "command": "ipconfig /flushdns",
        "name": "Flush & Clear DNS Cache",
        "category": "Internet & Network",
        "description": "Clears Windows DNS resolver cache. Resolves website loading errors, outdated domain redirects, and 'Server Not Found' bugs.",
        "safety_level": "Safe (Cache Reset)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/flushdns",
                "meaning": "Purges and resets the contents of the DNS client resolver cache"
            }
        ],
        "expected_output": "Windows IP Configuration\n\nSuccessfully flushed the DNS Resolver Cache.",
        "what_to_look_for": "Confirmation saying 'Successfully flushed the DNS Resolver Cache'.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: ipconfig /flushdns and press Enter.",
            "3. Refresh your web browser."
        ]
    },
    {
        "id": "net-release",
        "command": "ipconfig /release",
        "name": "Release Current Router IP Address",
        "category": "Internet & Network",
        "description": "Releases the current IP address assigned to your PC by the router. Used as step 1 when renewing stuck connections.",
        "safety_level": "Safe (Network Reset)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/release",
                "meaning": "Sends DHCP release notification to drop current IP address"
            }
        ],
        "expected_output": "Configured adapters will temporarily show 0.0.0.0.",
        "what_to_look_for": "Connection will disconnect temporarily until you run /renew.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: ipconfig /release and press Enter."
        ]
    },
    {
        "id": "net-renew",
        "command": "ipconfig /renew",
        "name": "Renew Fresh Router IP Address",
        "category": "Internet & Network",
        "description": "Requests a brand new IP address assignment from your Wi-Fi router via DHCP.",
        "safety_level": "Safe (Network Reset)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/renew",
                "meaning": "Renews DHCP lease and requests new IP configuration"
            }
        ],
        "expected_output": "IPv4 Address. . . . . . . . . . . : 192.168.1.52",
        "what_to_look_for": "A fresh valid IP address appears and internet connection restores.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: ipconfig /renew and press Enter."
        ]
    },
    {
        "id": "net-ping-google",
        "command": "ping 8.8.8.8",
        "name": "Test Internet Connection & Latency",
        "category": "Internet & Network",
        "description": "Sends 4 test data packets to Google DNS (8.8.8.8) to check if your computer can reach the global internet.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "8.8.8.8",
                "meaning": "Google public DNS server IP address (reliable global internet target)"
            }
        ],
        "expected_output": "Reply from 8.8.8.8: bytes=32 time=15ms TTL=117\nPackets: Sent = 4, Received = 4, Lost = 0 (0% loss)",
        "what_to_look_for": "0% loss means internet is working. 100% loss means your PC is disconnected from the internet.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: ping 8.8.8.8 and press Enter."
        ]
    },
    {
        "id": "net-ping-local",
        "command": "ping 127.0.0.1",
        "name": "Test Local Network Card (Loopback)",
        "category": "Internet & Network",
        "description": "Pings your computer's internal network stack (loopback). Proves whether your physical network card is working.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "127.0.0.1",
                "meaning": "Localhost loopback address inside your computer's network driver"
            }
        ],
        "expected_output": "Reply from 127.0.0.1: bytes=32 time<1ms TTL=128\n0% loss",
        "what_to_look_for": "If this fails, your physical network card or Windows TCP/IP driver is damaged.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: ping 127.0.0.1 and press Enter."
        ]
    },
    {
        "id": "net-tracert",
        "command": "tracert 8.8.8.8",
        "name": "Trace Route (Find Where Connection Drops)",
        "category": "Internet & Network",
        "description": "Maps every router and server hop between your computer and the destination to pinpoint where connection lag occurs.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "tracert",
                "meaning": "Trace route utility determining the path to a destination"
            }
        ],
        "expected_output": "1    <1 ms    <1 ms    <1 ms  192.168.1.1\n2    10 ms     9 ms     8 ms  10.20.0.1\nTrace complete.",
        "what_to_look_for": "Hop 1 is your home router. If timeouts (* * * Request timed out) start at hop 1, the problem is inside your house.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: tracert 8.8.8.8 and press Enter."
        ]
    },
    {
        "id": "net-pathping",
        "command": "pathping 8.8.8.8",
        "name": "Advanced Network Hop & Loss Analysis",
        "category": "Internet & Network",
        "description": "Combines ping and tracert to analyze packet loss percentage at every single hop along the network route over several minutes.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "pathping",
                "meaning": "Measures packet loss and latency at intermediate router hops"
            }
        ],
        "expected_output": "Computing statistics for 25 seconds...\nSource to Here   This Node/Link\nHop  RTT    Lost/Sent = Pct  Lost/Sent = Pct  Address",
        "what_to_look_for": "Look for which hop exhibits high Lost/Sent percentages.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: pathping 8.8.8.8 and press Enter. Wait 1-2 minutes for complete stats."
        ]
    },
    {
        "id": "net-netstat-ano",
        "command": "netstat -ano",
        "name": "List All Active Connections & Ports",
        "category": "Internet & Network",
        "description": "Lists all active TCP and UDP connections, IP addresses, listening ports, and the owning Process ID (PID).",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "-a",
                "meaning": "Displays all active connections and listening ports"
            },
            {
                "flag": "-n",
                "meaning": "Displays addresses and port numbers in numerical form"
            },
            {
                "flag": "-o",
                "meaning": "Displays the owning process ID (PID) associated with each connection"
            }
        ],
        "expected_output": "TCP    192.168.1.50:52410   142.250.190.46:443   ESTABLISHED   12404",
        "what_to_look_for": "Inspect the PID column on the right to see which app is connecting to which remote server.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: netstat -ano and press Enter."
        ]
    },
    {
        "id": "net-nslookup",
        "command": "nslookup google.com",
        "name": "Query DNS Server for Domain IP",
        "category": "Internet & Network",
        "description": "Checks what IP address your configured DNS server resolves for a domain name. Tests whether DNS lookup is working.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "nslookup",
                "meaning": "Name Server Lookup query tool"
            }
        ],
        "expected_output": "Server:  dns.google\nAddress:  8.8.8.8\n\nNon-authoritative answer:\nName:    google.com\nAddresses:  142.250.190.46",
        "what_to_look_for": "If it times out or returns 'server can't find', your DNS configuration is broken.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: nslookup google.com and press Enter."
        ]
    },
    {
        "id": "net-arp",
        "command": "arp -a",
        "name": "View Local Network Devices (ARP Table)",
        "category": "Internet & Network",
        "description": "Displays the Address Resolution Protocol table, listing the IP addresses and physical MAC addresses of devices on your Wi-Fi.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "-a",
                "meaning": "Displays current ARP entries across all network interfaces"
            }
        ],
        "expected_output": "Internet Address      Physical Address      Type\n192.168.1.1           a0-b1-c2-d3-e4-f5     dynamic\n192.168.1.25          18-65-90-da-bc-ee     dynamic",
        "what_to_look_for": "Find IP addresses of connected printers, smart TVs, or phones on your home network.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: arp -a and press Enter."
        ]
    },
    {
        "id": "net-getmac",
        "command": "getmac",
        "name": "Get Physical MAC Address",
        "category": "Internet & Network",
        "description": "Returns the Media Access Control (MAC) address for all network adapters in the computer.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "getmac",
                "meaning": "Retrieves the MAC addresses of network adapters"
            }
        ],
        "expected_output": "Physical Address    Transport Name\n=================== ====================================================\n00-1B-44-11-3A-B7   \\Device\\Tcpip_{87654321-ABCD-EF01-2345-6789ABCDEF01}",
        "what_to_look_for": "The 12-character hexadecimal Physical Address is required for router access lists.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: getmac and press Enter."
        ]
    },
    {
        "id": "net-wlan-profiles",
        "command": "netsh wlan show profiles",
        "name": "List Saved Wi-Fi Networks",
        "category": "Internet & Network",
        "description": "Lists all Wi-Fi network names (SSIDs) that this computer has ever connected to and remembered.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "netsh wlan",
                "meaning": "Network Shell wireless configuration tool"
            },
            {
                "flag": "show profiles",
                "meaning": "Lists all saved wireless connection profiles"
            }
        ],
        "expected_output": "User profiles\n-------------\n    All User Profile     : Home-WiFi-5G\n    All User Profile     : CoffeeShop_Guest",
        "what_to_look_for": "Find the exact name of the network you need password for.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: netsh wlan show profiles and press Enter."
        ]
    },
    {
        "id": "net-wlan-password",
        "command": "netsh wlan show profile name=\"WiFiName\" key=clear",
        "name": "Reveal Saved Wi-Fi Password",
        "category": "Internet & Network",
        "description": "Displays the saved security password for a Wi-Fi network in plain text without stars.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "name=\"WiFiName\"",
                "meaning": "Specifies the exact wireless network name"
            },
            {
                "flag": "key=clear",
                "meaning": "Instructs Windows to display security key in plain readable text"
            }
        ],
        "expected_output": "Security settings\n-----------------\n    Key Content            : MySecretPassword123!",
        "what_to_look_for": "Look under 'Security settings' for the 'Key Content' line. That is the Wi-Fi password.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Replace WiFiName with your network name.",
            "3. Paste: netsh wlan show profile name=\"YourNetwork\" key=clear",
            "4. Press Enter and view 'Key Content'."
        ]
    },
    {
        "id": "net-wlan-interfaces",
        "command": "netsh wlan show interfaces",
        "name": "Check Wi-Fi Signal Strength & Channel",
        "category": "Internet & Network",
        "description": "Displays live signal quality percentage, radio type (Wi-Fi 6, 802.11ax), transmission rate (Mbps), and current router channel.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "show interfaces",
                "meaning": "Displays status parameters of active Wi-Fi hardware"
            }
        ],
        "expected_output": "    SSID                   : Home-WiFi-5G\n    Radio type             : 802.11ax\n    Signal                 : 94%\n    Receive rate (Mbps)    : 866",
        "what_to_look_for": "Signal percentage. If below 50%, you are experiencing distance or wall interference.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: netsh wlan show interfaces and press Enter."
        ]
    },
    {
        "id": "net-winsock-reset",
        "command": "netsh winsock reset",
        "name": "Reset Winsock Catalog (Fix Broken Internet)",
        "category": "Internet & Network",
        "description": "Resets the Windows network socket pipeline. Fixes connections broken by VPN uninstallations, malware, or antivirus bugs.",
        "safety_level": "Safe (Protocol Reset)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "winsock reset",
                "meaning": "Restores Winsock catalog to a clean default state"
            }
        ],
        "expected_output": "Successfully reset the Winsock Catalog.\nYou must restart the computer in order to complete the reset.",
        "what_to_look_for": "Requires a PC restart to finalize network stack reset.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: netsh winsock reset and press Enter.",
            "3. Restart your computer."
        ]
    },
    {
        "id": "net-int-ip-reset",
        "command": "netsh int ip reset",
        "name": "Reset TCP/IP Stack to Factory Defaults",
        "category": "Internet & Network",
        "description": "Completely rewrites corrupted TCP/IP registry keys and resets network protocols to clean Microsoft defaults.",
        "safety_level": "Safe (Protocol Reset)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "int ip reset",
                "meaning": "Resets Internet Protocol stack and registry entries"
            }
        ],
        "expected_output": "Resetting Global, completed!\nResetting Interface, completed!\nRestart the computer to complete this action.",
        "what_to_look_for": "All items report 'completed!'. Restart your computer afterwards.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: netsh int ip reset and press Enter.",
            "3. Restart your PC."
        ]
    },
    {
        "id": "repair-sfc-scannow",
        "command": "sfc /scannow",
        "name": "Repair Corrupted Windows System Files (SFC)",
        "category": "Windows Repair",
        "description": "Scans all protected Windows operating system files and automatically replaces broken or corrupted files with fresh copies.",
        "safety_level": "Safe (Automatic Repair)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "sfc",
                "meaning": "System File Checker"
            },
            {
                "flag": "/scannow",
                "meaning": "Initiates an immediate full system integrity scan"
            }
        ],
        "expected_output": "Beginning system scan. This process will take some time.\nVerification 100% complete.\nWindows Resource Protection found corrupt files and successfully repaired them.",
        "what_to_look_for": "If it says 'found corrupt files and successfully repaired them', restart your computer to apply the fix.",
        "how_to_run_steps": [
            "1. Right-click Start button and choose 'Terminal (Admin)' or 'Command Prompt (Admin)'.",
            "2. Type: sfc /scannow and press Enter.",
            "3. Wait 5-15 minutes for verification to reach 100%."
        ]
    },
    {
        "id": "repair-dism-checkhealth",
        "command": "dism /online /cleanup-image /checkhealth",
        "name": "Check Windows Image Corruption (DISM Quick)",
        "category": "Windows Repair",
        "description": "Quickly inspects whether Windows component store has been flagged as corrupted by previous update crashes.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "dism",
                "meaning": "Deployment Image Servicing and Management tool"
            },
            {
                "flag": "/online",
                "meaning": "Targets currently running live Windows operating system"
            },
            {
                "flag": "/checkhealth",
                "meaning": "Quickly checks if component store corruption flag is set"
            }
        ],
        "expected_output": "No component store corruption detected.\nThe operation completed successfully.",
        "what_to_look_for": "'No component store corruption detected' indicates healthy component store.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: dism /online /cleanup-image /checkhealth",
            "3. Press Enter."
        ]
    },
    {
        "id": "repair-dism-scanhealth",
        "command": "dism /online /cleanup-image /scanhealth",
        "name": "Deep Scan Component Store (DISM Scan)",
        "category": "Windows Repair",
        "description": "Performs an in-depth scan of the Windows component store to detect hidden corruption that SFC cannot repair.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/scanhealth",
                "meaning": "Deeply scans component store for corruption"
            }
        ],
        "expected_output": "[==========================100.0%==========================]\nThe component store is repairable.\nThe operation completed successfully.",
        "what_to_look_for": "If it reports 'The component store is repairable', follow up with /restorehealth.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: dism /online /cleanup-image /scanhealth",
            "3. Press Enter and wait for 100% completion."
        ]
    },
    {
        "id": "repair-dism-restorehealth",
        "command": "dism /online /cleanup-image /restorehealth",
        "name": "Restore & Fix Component Store with Windows Update",
        "category": "Windows Repair",
        "description": "Connects to Windows Update and downloads clean replacement system component files to repair damaged Windows installations.",
        "safety_level": "Safe (Automatic Repair)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/restorehealth",
                "meaning": "Repairs Windows image using Windows Update servers as repair source"
            }
        ],
        "expected_output": "[==========================100.0%==========================]\nThe restore operation completed successfully.\nThe operation completed successfully.",
        "what_to_look_for": "'The restore operation completed successfully'. Always follow this with 'sfc /scannow'.",
        "how_to_run_steps": [
            "1. Ensure you have active internet connection.",
            "2. Open Command Prompt as Administrator.",
            "3. Type: dism /online /cleanup-image /restorehealth",
            "4. Wait 10-20 minutes until it finishes."
        ]
    },
    {
        "id": "repair-dism-componentcleanup",
        "command": "dism /online /cleanup-image /startcomponentcleanup",
        "name": "Clean Up Old Windows Update Leftovers",
        "category": "Windows Repair",
        "description": "Deletes superseded and outdated Windows update backup components to reclaim gigabytes of disk space.",
        "safety_level": "Safe (Maintenance)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/startcomponentcleanup",
                "meaning": "Cleans up superseded components in WinSxS folder"
            }
        ],
        "expected_output": "[==========================100.0%==========================]\nThe operation completed successfully.",
        "what_to_look_for": "Takes 5-10 minutes. Shrinks the C:\\Windows\\WinSxS directory size.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: dism /online /cleanup-image /startcomponentcleanup",
            "3. Press Enter."
        ]
    },
    {
        "id": "repair-chkdsk-f",
        "command": "chkdsk C: /f",
        "name": "Check & Fix File System Errors (Chkdsk)",
        "category": "Windows Repair",
        "description": "Scans your storage drive for file system corruption, damaged file allocation tables, and directory errors, scheduling a fix on next boot.",
        "safety_level": "Safe (Fixes File System)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "C:",
                "meaning": "Specifies target drive letter to check"
            },
            {
                "flag": "/f",
                "meaning": "Fixes errors on the disk"
            }
        ],
        "expected_output": "Chkdsk cannot run because the volume is in use by another process.\nWould you like to schedule this volume to be checked the next time the system restarts? (Y/N)",
        "what_to_look_for": "Type Y and press Enter. Windows will perform the disk repair on your next reboot.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: chkdsk C: /f",
            "3. Press Enter.",
            "4. When prompted (Y/N), type Y and restart your PC."
        ]
    },
    {
        "id": "repair-chkdsk-r",
        "command": "chkdsk C: /r",
        "name": "Scan Drive Bad Sectors & Recover Data",
        "category": "Windows Repair",
        "description": "Locates bad physical sectors on hard drives, marks them unusable, and recovers readable data from damaged areas.",
        "safety_level": "Safe (Deep Sector Scan)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/r",
                "meaning": "Locates bad sectors and recovers readable information (implies /f)"
            }
        ],
        "expected_output": "Schedule volume check on next reboot? (Y/N)",
        "what_to_look_for": "Can take 1-4 hours on large hard drives. Recommended if computer freezes with clicking hard drive sounds.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: chkdsk C: /r",
            "3. Press Enter, press Y, and restart computer."
        ]
    },
    {
        "id": "repair-gpupdate",
        "command": "gpupdate /force",
        "name": "Force Windows Group Policy Update",
        "category": "Windows Repair",
        "description": "Forces Windows to immediately apply updated computer and user Group Policies without waiting for background refresh.",
        "safety_level": "Safe (Policy Refresh)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/force",
                "meaning": "Reapplies all policy settings, ignoring unchanged status"
            }
        ],
        "expected_output": "Updating policy...\nComputer Policy update has completed successfully.\nUser Policy update has completed successfully.",
        "what_to_look_for": "'Computer Policy update has completed successfully'.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: gpupdate /force and press Enter."
        ]
    },
    {
        "id": "repair-slmgr-xpr",
        "command": "slmgr /xpr",
        "name": "Check Windows License Expiration Date",
        "category": "Windows Repair",
        "description": "Pops up a Windows dialog showing whether your Windows license is permanently activated or has an expiration date.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "slmgr",
                "meaning": "Software Licensing Management Tool"
            },
            {
                "flag": "/xpr",
                "meaning": "Displays expiration date for current license state"
            }
        ],
        "expected_output": "Windows Script Host popup: 'The machine is permanently activated.'",
        "what_to_look_for": "A small dialog box will pop up on your desktop saying 'permanently activated'.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: slmgr /xpr and press Enter."
        ]
    },
    {
        "id": "disk-smart-status",
        "command": "wmic diskdrive get status",
        "name": "Check Hard Drive & SSD Hardware Health (SMART)",
        "category": "Storage & Disks",
        "description": "Queries internal SMART self-monitoring sensors on all installed hard drives and SSDs to detect hardware failure.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "wmic diskdrive",
                "meaning": "Windows Management Instrumentation disk drive class"
            },
            {
                "flag": "get status",
                "meaning": "Returns hardware self-diagnostic health verdict"
            }
        ],
        "expected_output": "Status\nOK",
        "what_to_look_for": "If it says 'OK', hardware is healthy. If it says 'Pred Fail' or 'Bad', backup all personal files immediately!",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: wmic diskdrive get status",
            "3. Press Enter."
        ]
    },
    {
        "id": "disk-model-size-status",
        "command": "wmic diskdrive get model,size,status",
        "name": "List Storage Drives, Sizes & Health",
        "category": "Storage & Disks",
        "description": "Lists the exact manufacturer models, byte capacities, and health verdicts of all connected storage drives.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "get model,size,status",
                "meaning": "Prints drive model name, capacity, and health state"
            }
        ],
        "expected_output": "Model                             Size           Status\nSamsung SSD 980 PRO 1TB           1000204886016  OK",
        "what_to_look_for": "Drive model names and 'OK' status.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: wmic diskdrive get model,size,status and press Enter."
        ]
    },
    {
        "id": "disk-defrag-trim",
        "command": "defrag C: /O",
        "name": "Optimize SSD with TRIM / Defrag HDD",
        "category": "Storage & Disks",
        "description": "Performs appropriate drive optimization: runs TRIM command on solid state drives (SSD) or defragments magnetic hard drives.",
        "safety_level": "Safe (Drive Maintenance)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/O",
                "meaning": "Performs proper optimization for each media type (TRIM for SSD, Defrag for HDD)"
            }
        ],
        "expected_output": "Post Defragmentation Report:\n    Total fragmented space = 0%\nRetrim: 100% complete.",
        "what_to_look_for": "'Retrim: 100% complete' restores peak SSD read/write speeds.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: defrag C: /O and press Enter."
        ]
    },
    {
        "id": "disk-defrag-analyze",
        "command": "defrag C: /A",
        "name": "Analyze Disk Fragmentation Level",
        "category": "Storage & Disks",
        "description": "Analyzes drive C: and reports whether defragmentation is recommended without altering any data.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/A",
                "meaning": "Analyze specified volume only"
            }
        ],
        "expected_output": "Analysis Report:\n    Total fragmented space = 2%\n    You do not need to defragment this volume.",
        "what_to_look_for": "Shows percentage of fragmented files.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: defrag C: /A and press Enter."
        ]
    },
    {
        "id": "disk-fsutil-dirty",
        "command": "fsutil dirty query C:",
        "name": "Check If Drive Has 'Dirty Bit' Set",
        "category": "Storage & Disks",
        "description": "Checks if Windows marked the C: drive as 'dirty' due to an unexpected power outage, crash, or write failure.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "fsutil dirty query",
                "meaning": "Queries file system dirty flag"
            }
        ],
        "expected_output": "Volume - C: is NOT Dirty",
        "what_to_look_for": "If 'Volume is Dirty', Windows will mandate a Chkdsk scan on next boot.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: fsutil dirty query C: and press Enter."
        ]
    },
    {
        "id": "disk-cleanmgr",
        "command": "cleanmgr",
        "name": "Launch Windows Disk Cleanup GUI",
        "category": "Storage & Disks",
        "description": "Opens the Windows Disk Cleanup utility to delete temporary internet files, Recycle Bin contents, and old update caches.",
        "safety_level": "Safe (Launches Utility)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "cleanmgr",
                "meaning": "Launches Disk Cleanup graphical tool"
            }
        ],
        "expected_output": "Disk Cleanup dialog opens on screen.",
        "what_to_look_for": "Select checkboxes for files you wish to remove and click OK.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: cleanmgr and press Enter."
        ]
    },
    {
        "id": "disk-compactos-query",
        "command": "compact /compactos:query",
        "name": "Check Windows Compact OS Compression",
        "category": "Storage & Disks",
        "description": "Checks if Windows Compact OS algorithm is actively compressing operating system files to save disk storage.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/compactos:query",
                "meaning": "Queries whether the system is in Compact state"
            }
        ],
        "expected_output": "The system is not in the Compact state because Windows has determined that it is not beneficial for this system.",
        "what_to_look_for": "Shows whether compact mode is active.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: compact /compactos:query and press Enter."
        ]
    },
    {
        "id": "perf-tasklist",
        "command": "tasklist",
        "name": "List All Running Programs & Memory Usage",
        "category": "Performance & Apps",
        "description": "Lists all active software processes, Process IDs (PID), session numbers, and memory (RAM) consumption in kilobytes.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "tasklist",
                "meaning": "Displays all currently running processes"
            }
        ],
        "expected_output": "Image Name                     PID Session Name        Session#    Mem Usage\nchrome.exe                   14204 Console                    1    154,220 K\nexplorer.exe                  4112 Console                    1     82,410 K",
        "what_to_look_for": "Apps with high Mem Usage numbers taking up physical RAM.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: tasklist and press Enter."
        ]
    },
    {
        "id": "perf-tasklist-highmem",
        "command": "tasklist /fi \"memusage gt 100000\"",
        "name": "Filter Programs Consuming >100MB RAM",
        "category": "Performance & Apps",
        "description": "Filters the task list to only show heavy applications and browser tabs consuming more than 100MB of RAM.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/fi",
                "meaning": "Applies a filter query"
            },
            {
                "flag": "\"memusage gt 100000\"",
                "meaning": "Filters for memory usage greater than 100,000 KB (100MB)"
            }
        ],
        "expected_output": "Image Name                     PID Session Name        Session#    Mem Usage\nmsedge.exe                    8912 Console                    1    384,120 K",
        "what_to_look_for": "Quickly identify memory-hogging background applications causing PC slowdown.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: tasklist /fi \"memusage gt 100000\" and press Enter."
        ]
    },
    {
        "id": "perf-taskkill-pid",
        "command": "taskkill /pid [PID] /f",
        "name": "Force Close Frozen Program by PID",
        "category": "Performance & Apps",
        "description": "Forcefully terminates a frozen, unresponsive program or background service using its Process ID number.",
        "safety_level": "Safe (Terminates Process)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/pid [PID]",
                "meaning": "Specifies process ID to terminate (found in tasklist)"
            },
            {
                "flag": "/f",
                "meaning": "Forcefully terminates the process immediately"
            }
        ],
        "expected_output": "SUCCESS: The process with PID 14204 has been terminated.",
        "what_to_look_for": "Confirmation 'SUCCESS: The process with PID ... has been terminated.'",
        "how_to_run_steps": [
            "1. Find the PID using tasklist.",
            "2. Type: taskkill /pid 1234 /f (replace 1234 with actual PID).",
            "3. Press Enter."
        ]
    },
    {
        "id": "perf-taskkill-name",
        "command": "taskkill /im [app.exe] /f",
        "name": "Force Close All Instances of an App",
        "category": "Performance & Apps",
        "description": "Closes all open windows and background instances of a program by image name (e.g. taskkill /im notepad.exe /f).",
        "safety_level": "Safe (Terminates Process)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/im [name]",
                "meaning": "Image name of program to close"
            },
            {
                "flag": "/f",
                "meaning": "Forcefully terminates without saving prompts"
            }
        ],
        "expected_output": "SUCCESS: The process \"notepad.exe\" with PID 8812 has been terminated.",
        "what_to_look_for": "All instances of the specified software will close instantly.",
        "how_to_run_steps": [
            "1. Type: taskkill /im notepad.exe /f",
            "2. Press Enter."
        ]
    },
    {
        "id": "perf-resmon",
        "command": "resmon",
        "name": "Open Windows Resource Monitor GUI",
        "category": "Performance & Apps",
        "description": "Launches the Resource Monitor showing real-time graphs of CPU, Disk I/O, Network, and Memory usage per process.",
        "safety_level": "Safe (Launches Utility)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "resmon",
                "meaning": "Launches Resource Monitor"
            }
        ],
        "expected_output": "Resource Monitor window opens.",
        "what_to_look_for": "Check the Disk tab to see which program is causing 100% disk usage.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: resmon and press Enter."
        ]
    },
    {
        "id": "perf-perfmon",
        "command": "perfmon",
        "name": "Open Windows Performance Monitor",
        "category": "Performance & Apps",
        "description": "Opens Windows Performance Monitor for hardware telemetry tracking, counter logs, and reliability audits.",
        "safety_level": "Safe (Launches Utility)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "perfmon",
                "meaning": "Launches Performance Monitor"
            }
        ],
        "expected_output": "Performance Monitor console opens.",
        "what_to_look_for": "Useful for benchmarking hardware performance over hours or days.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: perfmon and press Enter."
        ]
    },
    {
        "id": "perf-taskmgr",
        "command": "taskmgr",
        "name": "Open Windows Task Manager",
        "category": "Performance & Apps",
        "description": "Opens the classic Windows Task Manager GUI window directly from the command line.",
        "safety_level": "Safe (Launches Utility)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "taskmgr",
                "meaning": "Opens Task Manager"
            }
        ],
        "expected_output": "Task Manager window opens.",
        "what_to_look_for": "View CPU, Memory, Disk, GPU percentages and startup apps.",
        "how_to_run_steps": [
            "1. Type taskmgr and press Enter."
        ]
    },
    {
        "id": "hw-systeminfo",
        "command": "systeminfo",
        "name": "Comprehensive System Specs & OS Build",
        "category": "Hardware & Specs",
        "description": "Generates a detailed summary of your PC: Windows build, system manufacturer, model, BIOS version, total RAM, and network cards.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "systeminfo",
                "meaning": "Queries and prints hardware and operating system parameters"
            }
        ],
        "expected_output": "OS Name:                   Microsoft Windows 11 Pro\nSystem Manufacturer:       Dell Inc.\nSystem Model:              XPS 15 9520\nTotal Physical Memory:     16,112 MB",
        "what_to_look_for": "Shows total installed RAM, original OS installation date, and BIOS version.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: systeminfo and press Enter."
        ]
    },
    {
        "id": "hw-bios-serial",
        "command": "wmic bios get serialnumber",
        "name": "Retrieve PC Hardware Serial Number",
        "category": "Hardware & Specs",
        "description": "Retrieves your computer's official hardware serial number from the motherboard BIOS without looking at stickers on the bottom.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "wmic bios",
                "meaning": "WMI BIOS class"
            },
            {
                "flag": "get serialnumber",
                "meaning": "Queries hardware serial number from BIOS"
            }
        ],
        "expected_output": "SerialNumber\n8B7X9Z2",
        "what_to_look_for": "Provides your manufacturer Service Tag or Serial Number for warranty claims.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: wmic bios get serialnumber and press Enter."
        ]
    },
    {
        "id": "hw-motherboard",
        "command": "wmic baseboard get product,manufacturer",
        "name": "Identify Motherboard Model & Maker",
        "category": "Hardware & Specs",
        "description": "Identifies the exact make and model of your computer motherboard without opening the PC case.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "wmic baseboard",
                "meaning": "WMI motherboard hardware class"
            }
        ],
        "expected_output": "Manufacturer       Product\nASUSTeK COMPUTER   ROG STRIX B550-F GAMING",
        "what_to_look_for": "Helps find correct BIOS update files and RAM compatibility.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: wmic baseboard get product,manufacturer and press Enter."
        ]
    },
    {
        "id": "hw-cpu-specs",
        "command": "wmic cpu get name,numberofcores,maxclockspeed",
        "name": "Check Processor Model, Cores & Speed",
        "category": "Hardware & Specs",
        "description": "Displays the exact processor (CPU) model name, physical core count, and maximum clock speed in megahertz.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "wmic cpu",
                "meaning": "WMI central processing unit class"
            }
        ],
        "expected_output": "MaxClockSpeed  Name                                      NumberOfCores\n4700           12th Gen Intel(R) Core(TM) i7-12700H      14",
        "what_to_look_for": "Confirms CPU specs and core count.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: wmic cpu get name,numberofcores,maxclockspeed and press Enter."
        ]
    },
    {
        "id": "hw-ram-specs",
        "command": "wmic memorychip get capacity,speed,manufacturer",
        "name": "List Installed RAM Sticks & MHz Speed",
        "category": "Hardware & Specs",
        "description": "Displays each installed RAM memory stick, its capacity in bytes (divide by 1,073,741,824 for GB), and operating speed in MHz.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "wmic memorychip",
                "meaning": "WMI physical RAM stick class"
            }
        ],
        "expected_output": "Capacity     Manufacturer  Speed\n8589934592   Crucial       3200\n8589934592   Crucial       3200",
        "what_to_look_for": "Shows how many RAM slots are occupied and whether RAM is running at rated XMP speed.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: wmic memorychip get capacity,speed,manufacturer and press Enter."
        ]
    },
    {
        "id": "hw-driverquery",
        "command": "driverquery",
        "name": "List All Installed Device Drivers",
        "category": "Hardware & Specs",
        "description": "Produces a clean table listing every device driver installed in Windows, driver module names, types, and link dates.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "driverquery",
                "meaning": "Queries installed device drivers"
            }
        ],
        "expected_output": "Module Name  Display Name           Driver Type   Link Date\nIntelPPM     Intel Processor Driver Kernel        05/02/2026",
        "what_to_look_for": "Look for outdated driver Link Dates if troubleshooting blue screens (BSOD).",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: driverquery and press Enter."
        ]
    },
    {
        "id": "hw-dxdiag",
        "command": "dxdiag",
        "name": "Open DirectX Diagnostic Tool (GPU / Audio)",
        "category": "Hardware & Specs",
        "description": "Launches the DirectX Diagnostic Tool for detailed testing of your graphics card (GPU), VRAM, display drivers, and audio devices.",
        "safety_level": "Safe (Launches Utility)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "dxdiag",
                "meaning": "Launches DirectX Diagnostic Tool"
            }
        ],
        "expected_output": "DirectX Diagnostic Tool GUI opens on screen.",
        "what_to_look_for": "Click the Display tab to check GPU VRAM capacity and driver dates.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: dxdiag and press Enter."
        ]
    },
    {
        "id": "hw-msinfo32",
        "command": "msinfo32",
        "name": "Open Detailed System Information GUI",
        "category": "Hardware & Specs",
        "description": "Opens the comprehensive Microsoft System Information graphical suite showing hardware resources, conflicts, and IRQs.",
        "safety_level": "Safe (Launches Utility)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "msinfo32",
                "meaning": "Launches System Information console"
            }
        ],
        "expected_output": "System Information window opens.",
        "what_to_look_for": "Check 'Secure Boot State' and 'BIOS Mode' (UEFI vs Legacy).",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: msinfo32 and press Enter."
        ]
    },
    {
        "id": "svc-net-start",
        "command": "net start",
        "name": "List All Running Windows Services",
        "category": "Services & Background",
        "description": "Lists all Windows background services that are currently active and running.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "net start",
                "meaning": "Lists active background services without arguments"
            }
        ],
        "expected_output": "These Windows services are started:\n   Background Intelligent Transfer Service\n   Print Spooler\n   Windows Audio\nThe command completed successfully.",
        "what_to_look_for": "Verify if essential services (e.g. Windows Audio, Print Spooler) are in the list.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: net start and press Enter."
        ]
    },
    {
        "id": "svc-restart-spooler",
        "command": "net stop spooler && net start spooler",
        "name": "Restart Print Spooler (Clear Jammed Queue)",
        "category": "Services & Background",
        "description": "Restarts the Windows Print Spooler service. Instantly clears frozen printer queues and allows printers to resume printing.",
        "safety_level": "Safe (Service Restart)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "net stop spooler",
                "meaning": "Halts the printer queue engine"
            },
            {
                "flag": "&&",
                "meaning": "Runs the next command immediately after the first finishes"
            },
            {
                "flag": "net start spooler",
                "meaning": "Restarts the clean printer engine"
            }
        ],
        "expected_output": "The Print Spooler service was stopped successfully.\nThe Print Spooler service was started successfully.",
        "what_to_look_for": "Both lines report 'successfully'. Your printer should resume immediately.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: net stop spooler && net start spooler",
            "3. Press Enter."
        ]
    },
    {
        "id": "svc-sc-query",
        "command": "sc query [service_name]",
        "name": "Query Real-Time Service Status",
        "category": "Services & Background",
        "description": "Queries the exact operational state (RUNNING, STOPPED, PAUSED) of any Windows service.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "sc query",
                "meaning": "Service Controller query"
            }
        ],
        "expected_output": "SERVICE_NAME: spooler\n        STATE              : 4  RUNNING",
        "what_to_look_for": "STATE: 4 RUNNING indicates healthy service status.",
        "how_to_run_steps": [
            "1. Type: sc query spooler and press Enter."
        ]
    },
    {
        "id": "svc-services-msc",
        "command": "services.msc",
        "name": "Open Windows Services Manager GUI",
        "category": "Services & Background",
        "description": "Opens the Windows Services management console to view, start, stop, or disable background services with a mouse.",
        "safety_level": "Safe (Launches Utility)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "services.msc",
                "meaning": "Launches Services Microsoft Management Console"
            }
        ],
        "expected_output": "Services management console opens.",
        "what_to_look_for": "Right-click any service to change its startup type (Automatic, Manual, Disabled).",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: services.msc and press Enter."
        ]
    },
    {
        "id": "sec-whoami",
        "command": "whoami",
        "name": "Display Current Username & Domain",
        "category": "Security & Users",
        "description": "Prints your exact active computer/domain name and current user account.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "whoami",
                "meaning": "Outputs current user identity"
            }
        ],
        "expected_output": "desktop-pc\\john_doe",
        "what_to_look_for": "Identifies the exact username Windows recognizes for file permission checks.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: whoami and press Enter."
        ]
    },
    {
        "id": "sec-whoami-priv",
        "command": "whoami /priv",
        "name": "Check Active Administrative Privileges",
        "category": "Security & Users",
        "description": "Displays the security privileges and user rights assigned to your current token. Proves if CMD is elevated as Administrator.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/priv",
                "meaning": "Displays user privileges for current session token"
            }
        ],
        "expected_output": "Privilege Name                Description                          State\nSeShutdownPrivilege           Shut down the system                 Enabled\nSeTakeOwnershipPrivilege      Take ownership of files or objects   Enabled",
        "what_to_look_for": "Look for 'SeDebugPrivilege' or 'Enabled' states to confirm administrative elevation.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: whoami /priv and press Enter."
        ]
    },
    {
        "id": "sec-net-user",
        "command": "net user",
        "name": "List All User Accounts on this PC",
        "category": "Security & Users",
        "description": "Lists all user accounts that exist on the computer, including Administrator, Guest, and standard user profiles.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "net user",
                "meaning": "Displays local user accounts"
            }
        ],
        "expected_output": "User accounts for \\\\MY-PC\n-------------------------------------------------------------------\nAdministrator            DefaultAccount           Guest\nJohnDoe                  WDAGUtilityAccount\nThe command completed successfully.",
        "what_to_look_for": "Detect any unexpected or unauthorized user accounts.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: net user and press Enter."
        ]
    },
    {
        "id": "sec-net-user-detail",
        "command": "net user [username]",
        "name": "View Account Expiration & Password Age",
        "category": "Security & Users",
        "description": "Displays password change dates, password expiration status, account active flags, and group memberships for a user.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "[username]",
                "meaning": "Specifies account name to inspect"
            }
        ],
        "expected_output": "User name                    JohnDoe\nAccount active               Yes\nPassword last set            01/15/2026\nPassword expires             Never\nLocal Group Memberships      *Administrators",
        "what_to_look_for": "Check 'Account active' and 'Local Group Memberships'.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: net user JohnDoe (replace with your username) and press Enter."
        ]
    },
    {
        "id": "sec-admin-group",
        "command": "net localgroup administrators",
        "name": "List Accounts with Administrator Rights",
        "category": "Security & Users",
        "description": "Audits which user accounts have full Administrator rights to install software and modify system files.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "net localgroup administrators",
                "meaning": "Displays members of local Administrators group"
            }
        ],
        "expected_output": "Members\n-------------------------------------------------------------------\nAdministrator\nJohnDoe\nThe command completed successfully.",
        "what_to_look_for": "Ensure only trusted people are listed as Administrators.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: net localgroup administrators and press Enter."
        ]
    },
    {
        "id": "sec-firewall-show",
        "command": "netsh advfirewall show allprofiles",
        "name": "Check Windows Firewall Protection Status",
        "category": "Security & Users",
        "description": "Checks whether the Windows Defender Firewall is actively running and protecting Domain, Private, and Public profiles.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "show allprofiles",
                "meaning": "Reports firewall state for all network profiles"
            }
        ],
        "expected_output": "Domain Profile Settings:\nState                                 ON\nPrivate Profile Settings:\nState                                 ON\nPublic Profile Settings:\nState                                 ON",
        "what_to_look_for": "State should say 'ON'. If it says 'OFF', your computer is unprotected on networks.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: netsh advfirewall show allprofiles and press Enter."
        ]
    },
    {
        "id": "sec-firewall-on",
        "command": "netsh advfirewall set allprofiles state on",
        "name": "Turn Windows Firewall ON (All Networks)",
        "category": "Security & Users",
        "description": "Immediately enables Windows Defender Firewall across Domain, Private, and Public network interfaces.",
        "safety_level": "Safe (Security Enable)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "set allprofiles state on",
                "meaning": "Enables firewall on all profiles"
            }
        ],
        "expected_output": "Ok.",
        "what_to_look_for": "Returns 'Ok.' and restores firewall shield protection.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: netsh advfirewall set allprofiles state on",
            "3. Press Enter."
        ]
    },
    {
        "id": "sec-cipher-wipe",
        "command": "cipher /w:C:",
        "name": "Wipe Deleted Files Permanently (Free Space)",
        "category": "Security & Users",
        "description": "Overwrites unused free space on drive C: with zeros to ensure previously deleted sensitive files cannot be recovered with undelete tools.",
        "safety_level": "Safe (Overwrites Free Space Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/w:C:",
                "meaning": "Wipes deallocated free space only on drive C: without touching existing files"
            }
        ],
        "expected_output": "To remove as much data as possible, please close all other applications.\nWriting 0x00\nWriting 0xFF\nWriting New Random Numbers",
        "what_to_look_for": "Takes 15-45 minutes depending on free disk size. Leaves your existing files completely intact.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: cipher /w:C: and press Enter."
        ]
    },
    {
        "id": "dev-port-findstr",
        "command": "netstat -ano | findstr :3000",
        "name": "Find What Program is Holding Port (e.g. 3000)",
        "category": "Developer & Ports",
        "description": "Finds which background program or dev server is using port 3000 (or any port), causing 'Port already in use' errors.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "netstat -ano",
                "meaning": "Lists active network connections and Process IDs"
            },
            {
                "flag": "| findstr :3000",
                "meaning": "Pipes output to filter for port :3000 specifically"
            }
        ],
        "expected_output": "TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       15920",
        "what_to_look_for": "The number on the far right (15920) is the PID. Use 'taskkill /pid 15920 /f' to free the port.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: netstat -ano | findstr :3000 (change 3000 to your port).",
            "3. Press Enter."
        ]
    },
    {
        "id": "dev-curl-headers",
        "command": "curl -I https://www.google.com",
        "name": "Inspect Website / API HTTP Headers (curl)",
        "category": "Developer & Ports",
        "description": "Fetches HTTP status codes (200 OK, 301 Redirect, 404 Not Found, 500 Error) and headers from any web address.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "-I",
                "meaning": "Fetch HTTP response headers only without downloading body payload"
            }
        ],
        "expected_output": "HTTP/2 200\ncontent-type: text/html; charset=ISO-8859-1\nserver: gws",
        "what_to_look_for": "HTTP response status code on the first line.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: curl -I https://example.com and press Enter."
        ]
    },
    {
        "id": "dev-where",
        "command": "where python",
        "name": "Locate Executable Installation Path",
        "category": "Developer & Ports",
        "description": "Finds the exact folder location where an executable (like python, node, git) is installed on your computer.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "where",
                "meaning": "Searches for matching executables in PATH folders"
            }
        ],
        "expected_output": "C:\\Users\\User\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
        "what_to_look_for": "Helps debug multiple conflicting compiler or Python versions.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: where python (or where node) and press Enter."
        ]
    },
    {
        "id": "dev-echo-path",
        "command": "echo %PATH%",
        "name": "Display System Environment PATH Variable",
        "category": "Developer & Ports",
        "description": "Prints all folder paths currently registered in your Windows PATH variable.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "%PATH%",
                "meaning": "Windows environment variable holding executable lookup folders"
            }
        ],
        "expected_output": "C:\\Windows\\system32;C:\\Program Files\\Git\\cmd;C:\\Program Files\\nodejs",
        "what_to_look_for": "Verify if your compiler, SDK, or tool folder is listed here.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: echo %PATH% and press Enter."
        ]
    },
    {
        "id": "dev-set",
        "command": "set",
        "name": "Display All Environment Variables",
        "category": "Developer & Ports",
        "description": "Prints all active Windows system and user environment variables (USERPROFILE, APPDATA, TEMP, etc.).",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "set",
                "meaning": "Lists all environment variables without arguments"
            }
        ],
        "expected_output": "ALLUSERSPROFILE=C:\\ProgramData\nAPPDATA=C:\\Users\\User\\AppData\\Roaming\nUSERNAME=User",
        "what_to_look_for": "Find exact path locations of system app data folders.",
        "how_to_run_steps": [
            "1. Type set and press Enter."
        ]
    },
    {
        "id": "dev-clip",
        "command": "dir | clip",
        "name": "Copy Terminal Output to Windows Clipboard",
        "category": "Developer & Ports",
        "description": "Pipes command output directly into your Windows clipboard so you can paste it (Ctrl+V) into email or chat.",
        "safety_level": "Safe (Clipboard)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "| clip",
                "meaning": "Pipes command output directly into the Windows clipboard"
            }
        ],
        "expected_output": "Command completes silently; output is now ready to paste with Ctrl+V.",
        "what_to_look_for": "Open Notepad and press Ctrl+V to see the copied output.",
        "how_to_run_steps": [
            "1. Append | clip to any command (e.g. systeminfo | clip).",
            "2. Press Enter."
        ]
    },
    {
        "id": "dev-findstr",
        "command": "findstr /i \"error\" [file.log]",
        "name": "Search for Text Inside Files (findstr)",
        "category": "Developer & Ports",
        "description": "Searches for specific keywords or error phrases inside text and log files without opening them.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/i",
                "meaning": "Performs case-insensitive search"
            },
            {
                "flag": "\"error\"",
                "meaning": "Target word to search for"
            }
        ],
        "expected_output": "2026-10-12 10:15:22 [ERROR] Database connection failed on port 5432",
        "what_to_look_for": "Prints lines matching the search term.",
        "how_to_run_steps": [
            "1. Type: findstr /i \"error\" server.log and press Enter."
        ]
    },
    {
        "id": "dev-fc",
        "command": "fc file1.txt file2.txt",
        "name": "Compare Two Files for Differences (fc)",
        "category": "Developer & Ports",
        "description": "Compares two files line by line and highlights the differences between them.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "fc",
                "meaning": "File Compare utility"
            }
        ],
        "expected_output": "***** file1.txt\nstatus = active\n***** file2.txt\nstatus = inactive\n*****",
        "what_to_look_for": "Shows exactly which lines differ between the two files.",
        "how_to_run_steps": [
            "1. Type: fc original.txt modified.txt and press Enter."
        ]
    },
    {
        "id": "dev-assoc",
        "command": "assoc .pdf",
        "name": "View File Extension Association",
        "category": "Developer & Ports",
        "description": "Displays which file type is associated with a given extension (e.g. .pdf, .txt, .py).",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "assoc",
                "meaning": "Queries file extension associations"
            }
        ],
        "expected_output": ".pdf=Acrobat.Document.DC",
        "what_to_look_for": "Shows which app handles opening that file type.",
        "how_to_run_steps": [
            "1. Type: assoc .pdf and press Enter."
        ]
    },
    {
        "id": "dev-ssh-github",
        "command": "ssh -T git@github.com",
        "name": "Test GitHub SSH Key Authentication",
        "category": "Developer & Ports",
        "description": "Tests whether your SSH public key is properly added to your GitHub account without making any git changes.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "ssh -T",
                "meaning": "Tests SSH connection without allocating a pseudo-terminal"
            }
        ],
        "expected_output": "Hi username! You've successfully authenticated, but GitHub does not provide shell access.",
        "what_to_look_for": "Confirmation saying 'You've successfully authenticated'.",
        "how_to_run_steps": [
            "1. Open Command Prompt.",
            "2. Type: ssh -T git@github.com and press Enter."
        ]
    },
    {
        "id": "sys-shutdown-graceful",
        "command": "shutdown /s /t 0",
        "name": "Shut Down Computer Immediately",
        "category": "System & Power Control",
        "description": "Initiates a clean, graceful shutdown of the computer immediately without delay.",
        "safety_level": "Power Action (Shutdown)",
        "safety_badge": "moderate",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/s",
                "meaning": "Shuts down the computer"
            },
            {
                "flag": "/t 0",
                "meaning": "Sets timer to 0 seconds (immediate)"
            }
        ],
        "expected_output": "Windows initiates shutdown and computer turns off.",
        "what_to_look_for": "Save open work before running.",
        "how_to_run_steps": [
            "1. Save all open files.",
            "2. Type: shutdown /s /t 0 and press Enter."
        ]
    },
    {
        "id": "sys-restart-graceful",
        "command": "shutdown /r /t 0",
        "name": "Restart Computer Immediately",
        "category": "System & Power Control",
        "description": "Safely reboots the computer immediately without delay.",
        "safety_level": "Power Action (Restart)",
        "safety_badge": "moderate",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/r",
                "meaning": "Restarts the computer"
            },
            {
                "flag": "/t 0",
                "meaning": "Sets timer to 0 seconds"
            }
        ],
        "expected_output": "Computer reboots immediately.",
        "what_to_look_for": "Save open work before running.",
        "how_to_run_steps": [
            "1. Type: shutdown /r /t 0 and press Enter."
        ]
    },
    {
        "id": "sys-shutdown-abort",
        "command": "shutdown /a",
        "name": "Abort / Cancel Scheduled Shutdown",
        "category": "System & Power Control",
        "description": "Cancels an accidental or pending shutdown timer (e.g. if Windows displayed a countdown warning).",
        "safety_level": "Safe (Cancels Shutdown)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "/a",
                "meaning": "Aborts a system shutdown"
            }
        ],
        "expected_output": "Windows popup in notification area: 'Logoff is cancelled'.",
        "what_to_look_for": "A notification confirming that shutdown has been aborted.",
        "how_to_run_steps": [
            "1. Type: shutdown /a and press Enter."
        ]
    },
    {
        "id": "sys-restart-bios",
        "command": "shutdown /fw /r /t 0",
        "name": "Restart Straight into BIOS / UEFI Settings",
        "category": "System & Power Control",
        "description": "Reboots the computer directly into motherboard BIOS / UEFI firmware settings without having to spam F2 or Del keys.",
        "safety_level": "Power Action (Reboot to BIOS)",
        "safety_badge": "moderate",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "/fw",
                "meaning": "Instructs system to boot into firmware (BIOS/UEFI) interface"
            },
            {
                "flag": "/r",
                "meaning": "Restarts PC"
            },
            {
                "flag": "/t 0",
                "meaning": "0 second timeout"
            }
        ],
        "expected_output": "Computer reboots and opens BIOS setup screen directly.",
        "what_to_look_for": "Your PC will restart directly into the motherboard BIOS.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type: shutdown /fw /r /t 0 and press Enter."
        ]
    },
    {
        "id": "sys-winver",
        "command": "winver",
        "name": "Open About Windows Version Window",
        "category": "System & Power Control",
        "description": "Opens the official About Windows dialog showing OS edition (Home/Pro) and build number.",
        "safety_level": "Safe (Read-Only)",
        "safety_badge": "safe",
        "requires_admin": false,
        "flags_explanation": [
            {
                "flag": "winver",
                "meaning": "Launches Windows Version utility dialog"
            }
        ],
        "expected_output": "About Windows dialog pops up on screen.",
        "what_to_look_for": "Shows version (e.g. 23H2) and OS Build.",
        "how_to_run_steps": [
            "1. Type winver and press Enter."
        ]
    },
    {
        "id": "sys-bcdedit",
        "command": "bcdedit",
        "name": "View Windows Boot Configuration Data",
        "category": "System & Power Control",
        "description": "Displays Windows Boot Manager and Boot Loader configuration parameters.",
        "safety_level": "Safe (Read-Only View)",
        "safety_badge": "safe",
        "requires_admin": true,
        "flags_explanation": [
            {
                "flag": "bcdedit",
                "meaning": "Boot Configuration Data editor (read-only without modification flags)"
            }
        ],
        "expected_output": "Windows Boot Manager\nidentifier              {bootmgr}\ndevice                  partition=\\Device\\HarddiskVolume1\nWindows Boot Loader\nidentifier              {current}\npath                    \\Windows\\system32\\winload.efi",
        "what_to_look_for": "Verifies EFI bootloader path and default OS partition.",
        "how_to_run_steps": [
            "1. Open Command Prompt as Administrator.",
            "2. Type bcdedit and press Enter."
        ]
    }
]

DANGEROUS_COMMAND_PATTERNS = [
    r"\bformat\b",
    r"\bdel\s+/[sfq]\b",
    r"\brmdir\s+/[sq]\b",
    r"\bdiskpart\b",
    r"\breg\s+delete\b",
    r"\bcd\s+\\s*&&\s*del\b"
]

def is_dangerous_command(cmd: str) -> bool:
    c = cmd.lower()
    for pat in DANGEROUS_COMMAND_PATTERNS:
        if re.search(pat, c):
            return True
    return False

def explain_command(command_str: str, mode: str = "beginner") -> Dict[str, Any]:
    cmd_clean = command_str.strip()
    cmd_lower = cmd_clean.lower()

    # 1. Check known library (exact match first)
    for item in CMD_LIBRARY:
        if item["command"].lower() == cmd_lower:
            return {
                "command": cmd_clean,
                "name": item["name"],
                "category": item["category"],
                "description": item["description"],
                "safety_level": item["safety_level"],
                "safety_badge": item["safety_badge"],
                "requires_admin": item["requires_admin"],
                "flags_explanation": item["flags_explanation"],
                "expected_output": item["expected_output"],
                "what_to_look_for": item["what_to_look_for"],
                "how_to_run_steps": item["how_to_run_steps"],
                "is_dangerous": False
            }

    # Prefix match next
    for item in CMD_LIBRARY:
        first_token = item["command"].lower().split()[0]
        if cmd_lower == first_token or cmd_lower.startswith(first_token + " ") or cmd_lower.startswith(item["command"].lower()):
            return {
                "command": cmd_clean,
                "name": item["name"],
                "category": item["category"],
                "description": item["description"],
                "safety_level": item["safety_level"],
                "safety_badge": item["safety_badge"],
                "requires_admin": item["requires_admin"],
                "flags_explanation": item["flags_explanation"],
                "expected_output": item["expected_output"],
                "what_to_look_for": item["what_to_look_for"],
                "how_to_run_steps": item["how_to_run_steps"],
                "is_dangerous": False
            }

    # 2. Safety check for destructive commands
    if is_dangerous_command(cmd_clean):
        return {
            "command": cmd_clean,
            "name": "Potentially Destructive Command",
            "category": "High Risk / Caution",
            "description": "WARNING: This command can permanently erase files, format partitions, or delete system registry keys.",
            "safety_level": "DANGEROUS — Data Loss Risk",
            "safety_badge": "danger",
            "requires_admin": True,
            "flags_explanation": [{"flag": "CAUTION", "meaning": "Risk of irreversible data loss or unbootable system"}],
            "expected_output": "May modify or wipe disk data.",
            "what_to_look_for": "Do NOT execute unless you have complete verified backups and understand every parameter.",
            "how_to_run_steps": [
                "1. STOP. Do not run this command unless instructed by a certified technician.",
                "2. Ensure you have backed up all files to an external drive or cloud."
            ],
            "is_dangerous": True
        }

    # 3. Use Gemini AI if configured for custom command explanation
    if gemini_service.is_configured():
        prompt = f"""
Explain this Windows Command Prompt command to a beginner:
"{cmd_clean}"

Output JSON:
{{
  "name": "Short 2-4 word title for command",
  "category": "Category name",
  "description": "Simple 1-2 sentence explanation of what it does",
  "safety_level": "Safe (Read-Only)" or "Modifies Settings" or "Caution",
  "safety_badge": "safe" or "moderate" or "danger",
  "requires_admin": true/false,
  "flags_explanation": [
     {{"flag": "flag or word", "meaning": "what it does"}}
  ],
  "expected_output": "What text should appear in Command Prompt",
  "what_to_look_for": "What the user should look for",
  "how_to_run_steps": ["Step 1", "Step 2", "Step 3"]
}}
"""
        try:
            res = gemini_service._client.models.generate_content(
                model=gemini_service.model_name,
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            import json
            parsed = json.loads(res.text.strip())
            parsed["command"] = cmd_clean
            parsed["is_dangerous"] = False
            return parsed
        except Exception:
            pass

    # 4. Fallback smart heuristic explanation
    first_word = cmd_clean.split()[0].lower() if cmd_clean else "command"
    return {
        "command": cmd_clean,
        "name": f"Windows {first_word.upper()} Utility",
        "category": "General Diagnostics",
        "description": f"Runs the Windows {first_word} tool. This command inspects or interacts with system services.",
        "safety_level": "Standard Command",
        "safety_badge": "safe",
        "requires_admin": False,
        "flags_explanation": [
            {"flag": first_word, "meaning": f"Executes the {first_word} program in Windows"}
        ],
        "expected_output": "Command Prompt displays status text and returns to the command prompt.",
        "what_to_look_for": "Look for success messages or specific error codes.",
        "how_to_run_steps": [
            "1. Press the Windows Start button.",
            "2. Type cmd and press Enter.",
            f"3. Type or paste: {cmd_clean}",
            "4. Press Enter."
        ],
        "is_dangerous": False
    }

def translate_cmd_output(command_str: str, output_text: str) -> Dict[str, Any]:
    out_lower = output_text.lower()
    cmd_lower = command_str.lower()

    # Rule-based recognizers
    # 1. SFC scan output
    if "sfc" in cmd_lower or "verification" in out_lower:
        if "did not find any integrity violations" in out_lower:
            return {
                "status": "success",
                "summary": "100% Healthy — No Corrupt Files Found",
                "plain_english_meaning": "Your Windows operating system files are intact and in perfect working order. Whatever issue you are facing is not caused by broken Windows core files.",
                "recommended_next_step": "Look into software settings or hardware drivers instead of Windows system files."
            }
        elif "found corrupt files and successfully repaired them" in out_lower:
            return {
                "status": "success",
                "summary": "Repairs Successful! Broken Files Fixed",
                "plain_english_meaning": "Windows discovered damaged system files and successfully replaced them with fresh, working backups.",
                "recommended_next_step": "Restart your computer now so Windows can load the newly repaired files cleanly."
            }
        elif "unable to fix some of them" in out_lower:
            return {
                "status": "warning",
                "summary": "Corrupt Files Found But Could Not Be Replaced",
                "plain_english_meaning": "Windows found corrupted files, but its local backup cache was also damaged, so it couldn't complete the repair.",
                "recommended_next_step": "Run 'DISM /Online /Cleanup-Image /RestoreHealth' while connected to internet to download fresh replacements from Microsoft."
            }

    # 2. Ping output
    if "ping" in cmd_lower or "packets:" in out_lower:
        if "0% loss" in out_lower or "(0% packet loss)" in out_lower:
            return {
                "status": "success",
                "summary": "Internet Connection Is Active & Responsive",
                "plain_english_meaning": "Your computer successfully sent and received all test data packets. Your network adapter, router, and internet connection are actively communicating.",
                "recommended_next_step": "If specific websites fail to open, clear your browser cache or check your DNS settings."
            }
        elif "100% loss" in out_lower or "timed out" in out_lower:
            return {
                "status": "error",
                "summary": "No Response / 100% Packet Loss",
                "plain_english_meaning": "Your computer sent data packets into the network, but got zero replies back. The connection is blocked, unplugged, or your router is offline.",
                "recommended_next_step": "Toggle your Wi-Fi off and on, or restart your home router by unplugging it for 30 seconds."
            }

    # 3. DNS flush
    if "flushdns" in cmd_lower or "dns resolver cache" in out_lower:
        return {
            "status": "success",
            "summary": "DNS Cache Successfully Cleared",
            "plain_english_meaning": "Old and expired website address records have been cleared from memory. Your computer will now ask the internet for fresh routing information.",
            "recommended_next_step": "Try refreshing or opening your website now in Chrome or Edge."
        }

    # 4. WMIC Disk Drive
    if "diskdrive" in cmd_lower or "wmic" in cmd_lower:
        if "ok" in out_lower:
            return {
                "status": "success",
                "summary": "Hard Drive Hardware Status: OK",
                "plain_english_meaning": "Your hard drive / SSD hardware reports healthy internal self-test scores. No mechanical or electrical head failure detected.",
                "recommended_next_step": "Any computer slowness is likely software or background apps, not a dying hard drive."
            }
        elif "pred fail" in out_lower or "bad" in out_lower:
            return {
                "status": "danger",
                "summary": "CRITICAL: Drive Failure Imminent",
                "plain_english_meaning": "Your storage drive hardware has flagged internal errors (S.M.A.R.T. failure). The drive could stop working completely at any moment.",
                "recommended_next_step": "Copy all important personal documents and photos to a USB drive or cloud storage immediately! Then replace the drive."
            }

    # 5. Wi-Fi Password Extraction
    if "key content" in out_lower:
        m = re.search(r"key content\s*:\s*([^\r\n]+)", output_text, re.IGNORECASE)
        pw = m.group(1).strip() if m else "Found"
        return {
            "status": "success",
            "summary": f"Wi-Fi Password Retrieved: {pw}",
            "plain_english_meaning": f"Windows successfully extracted the saved security key for this Wi-Fi network: '{pw}'.",
            "recommended_next_step": "You can use this password to connect your phone or another device to this Wi-Fi network."
        }

    # 6. DISM RestoreHealth output
    if "restorehealth" in cmd_lower or "cleanup-image" in cmd_lower:
        if "the restore operation completed successfully" in out_lower:
            return {
                "status": "success",
                "summary": "Windows Component Store Repaired Successfully",
                "plain_english_meaning": "Microsoft Windows Update downloaded clean component files and restored your system image to factory health.",
                "recommended_next_step": "Now run 'sfc /scannow' to fix any remaining individual files using the fresh component store."
            }

    # 7. Taskkill output
    if "taskkill" in cmd_lower:
        if "success" in out_lower:
            return {
                "status": "success",
                "summary": "Frozen Process Terminated Successfully",
                "plain_english_meaning": "The program or process was forcefully closed. Any occupied ports or memory resources have been released.",
                "recommended_next_step": "You can now safely restart the application or dev server."
            }
        elif "not found" in out_lower:
            return {
                "status": "warning",
                "summary": "Process Was Not Running",
                "plain_english_meaning": "Windows could not find this Process ID or name because it was already closed.",
                "recommended_next_step": "Check Task Manager or run 'tasklist' to confirm the current active process ID."
            }

    # 8. Gemini AI fallback if configured
    if gemini_service.is_configured():
        prompt = (
            f'The user ran this command: "{command_str}"\n'
            f'And received this output in Command Prompt:\n'
            f'---\n{output_text}\n---\n\n'
            'Explain what this output means to a beginner who has no tech background:\n'
            'Output JSON:\n'
            '{\n'
            '  "status": "success" | "warning" | "error",\n'
            '  "summary": "Short 3-6 word summary",\n'
            '  "plain_english_meaning": "Warm, clear 2-3 sentence explanation in everyday English",\n'
            '  "recommended_next_step": "Clear next action they should take"\n'
            '}\n'
        )
        try:
            res = gemini_service._client.models.generate_content(
                model=gemini_service.model_name,
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            import json
            return json.loads(res.text.strip())
        except Exception:
            pass

    # Generic translation
    return {
        "status": "info",
        "summary": "Command Output Received",
        "plain_english_meaning": "The command executed and displayed its system status report. If you see 'Success' or 'OK', the operation completed normally.",
        "recommended_next_step": "Verify if your original issue is resolved, or ask TechResolve AI for further guidance."
    }
