"""
Predefined, battle-tested troubleshooting decision trees for IT problems.
Every step strictly follows the 6-part beginner format:
1. What we are checking
2. Why it matters
3. What to do
4. What should happen
5. Tell us what happened (options)
6. What happens next
"""

from typing import Dict, Any, List

BATTERY_SHUTDOWN_TREE: Dict[int, Dict[str, Any]] = {
    1: {
        "stage": "understanding",
        "progress_title": "Understanding the problem",
        "assistant_message": "I can help you investigate this. First, I want to understand what happens when your laptop loses power from the charger.",
        "structured_data": {
            "what_we_are_checking": "How your laptop behaves the moment it loses power from the wall adapter.",
            "why_it_matters": "A battery that shuts off instantly usually has worn-out chemical cells or a broken power connection, while a battery that lasts a few minutes might just have outdated battery calibration.",
            "what_to_do": [
                "Think about what happened the last time you unplugged the charger.",
                "Select the choice below that best describes your experience."
            ],
            "what_should_happen": "We will use your answer to focus on the most likely cause without wasting your time on unrelated tests.",
            "tell_us_what_happened_options": [
                {"key": "turns_off_instantly", "label": "It turns off immediately (instant black screen)", "action_type": "normal"},
                {"key": "turns_off_few_mins", "label": "It stays on for 2 to 10 minutes, then turns off", "action_type": "normal"},
                {"key": "battery_drops_fast", "label": "The battery percentage suddenly plummets (e.g. 100% to 5%)", "action_type": "normal"},
                {"key": "something_else", "label": "Something else happens", "action_type": "normal"}
            ],
            "what_happens_next": "Once you tell us what happens, we'll check if the laptop stays running reliably while plugged into the wall.",
            "what_we_know_so_far": ["Laptop shuts down when disconnected from power."],
            "what_we_need_to_check": ["Exact shutdown timing when unplugged."],
            "next_action_title": "Choose your symptom"
        }
    },
    2: {
        "stage": "understanding",
        "progress_title": "Understanding the problem",
        "assistant_message": "Thank you. Let's check one more detail before we run any tests.",
        "structured_data": {
            "what_we_are_checking": "Whether the laptop operates normally while the charger is plugged into the wall.",
            "why_it_matters": "If the laptop works normally on the charger, your screen, processor, and motherboard are healthy — meaning the problem is isolated to the battery or charging circuit.",
            "what_to_do": [
                "Keep the charger securely plugged in.",
                "Observe if you can use the computer without sudden shutdowns or restarts."
            ],
            "what_should_happen": "The laptop should either run smoothly or show symptoms even with power plugged in.",
            "tell_us_what_happened_options": [
                {"key": "normal_on_charger", "label": "Yes, it works completely normally on the charger", "action_type": "normal"},
                {"key": "problems_on_charger", "label": "No, it also has problems or turns off while charging", "action_type": "normal"},
                {"key": "not_sure", "label": "I'm not sure", "action_type": "normal"}
            ],
            "what_happens_next": "We will summarize what we know so far and show you a safe, built-in test to inspect your battery's health.",
            "what_we_know_so_far": [
                "The laptop shuts down when disconnected from the charger.",
                "Unplugging causes immediate loss of power."
            ],
            "what_we_need_to_check": ["Whether it remains stable on AC power."],
            "next_action_title": "Confirm charger stability"
        }
    },
    3: {
        "stage": "checking",
        "progress_title": "Checking the cause",
        "assistant_message": "Based on your answers, the battery may not be supplying power properly. It could be worn out, unable to maintain voltage, or affected by a power-management glitch.\n\nWe cannot confirm the exact cause yet, so let's check the battery condition before deciding what to repair.",
        "structured_data": {
            "what_we_are_checking": "The actual physical health and remaining charge capacity of your battery.",
            "why_it_matters": "Batteries age over time like phone batteries. Even if the icon says 100%, the battery might only hold 10% of its original factory electricity.",
            "what_to_do": [
                "Review the summary of what we know so far below.",
                "Click 'Check Your Battery Health' to see how to generate a free Windows battery report."
            ],
            "what_should_happen": "We will prepare clear, gentle instructions to generate Windows' built-in battery diagnostic report.",
            "tell_us_what_happened_options": [
                {"key": "ready_for_test", "label": "Check Your Battery Health", "action_type": "normal"},
                {"key": "ask_safety", "label": "Is this test safe for my laptop?", "action_type": "clarification"}
            ],
            "what_happens_next": "We will walk you step-by-step through generating a battery report in Windows.",
            "what_we_know_so_far": [
                "The laptop works while plugged in.",
                "The problem occurs when unplugged."
            ],
            "what_we_need_to_check": [
                "Whether the battery can actually hold a charge."
            ],
            "next_action_title": "Check Your Battery Health",
            "safety_warning": "Important safety notice: If your laptop battery is visibly swollen, bulging against the trackpad, or feels extremely hot to touch, do NOT continue charging. Disconnect power immediately."
        }
    },
    4: {
        "stage": "checking",
        "progress_title": "Checking the cause",
        "assistant_message": "Let's create a battery report in Windows. This report helps us see how much battery capacity remains.",
        "structured_data": {
            "what_we_are_checking": "Generating the official Windows battery diagnostic report.",
            "why_it_matters": "This report reveals your battery's factory design capacity, current full charge capacity, and cycle count without downloading any untrusted third-party software.",
            "what_to_do": [
                "Save any open work or files you are working on.",
                "Open the Windows Start menu (press the Windows key on your keyboard).",
                "Type cmd in the search box.",
                "Right-click 'Command Prompt' and select 'Run as administrator' (or simply press Enter to open it).",
                "Copy and paste or type this exact command:\n\npowercfg /batteryreport\n",
                "Press Enter on your keyboard.",
                "Command Prompt will show a message stating where it saved the file (usually inside C:\\Windows\\System32\\battery-report.html or your user folder)."
            ],
            "what_should_happen": "You should see a message saying: 'Battery life report saved to file path ...'",
            "command_to_run": "powercfg /batteryreport",
            "command_explanation": "This command only reads battery sensor data and creates an informational report. It does NOT delete any files or change your system settings.",
            "tell_us_what_happened_options": [
                {"key": "steps_completed", "label": "I completed the steps", "action_type": "normal"},
                {"key": "need_simpler", "label": "I need simpler instructions", "action_type": "need_simpler"},
                {"key": "cannot_find_cmd", "label": "I cannot find Command Prompt", "action_type": "tool_missing"},
                {"key": "error_occurred", "label": "Something went wrong or gave an error", "action_type": "error"}
            ],
            "what_happens_next": "Once you run the command, you can upload the report or enter the numbers, and we'll translate the findings into plain English.",
            "what_we_know_so_far": [
                "Laptop is stable on wall power.",
                "Battery cuts out when AC power is removed."
            ],
            "what_we_need_to_check": ["Windows Battery Report file output."],
            "next_action_title": "Run powercfg /batteryreport",
            "allows_file_upload": True,
            "upload_hint": "Upload your battery-report.html file here, or type the numbers directly."
        }
    },
    5: {
        "stage": "trying_solution",
        "progress_title": "Understanding the result",
        "assistant_message": "Let's examine the numbers from your battery report. You can upload the report file directly, or tell us what the report showed.",
        "structured_data": {
            "what_we_are_checking": "The Design Capacity versus the Full Charge Capacity.",
            "why_it_matters": "Comparing what the battery was designed to hold versus what it can currently hold tells us if the battery is worn out.",
            "what_to_do": [
                "Look at your battery report (or upload the battery-report.html file using the button below).",
                "Look for 'DESIGN CAPACITY' and 'FULL CHARGE CAPACITY' near the top.",
                "Choose the option below that best reflects what you see."
            ],
            "what_should_happen": "We will calculate the wear level and explain the health in simple language.",
            "tell_us_what_happened_options": [
                {"key": "full_charge_much_lower", "label": "Full Charge Capacity is much lower than Design Capacity (less than half)", "action_type": "normal"},
                {"key": "full_charge_similar", "label": "Full Charge Capacity is close to Design Capacity (health looks good)", "action_type": "normal"},
                {"key": "report_says_no_battery", "label": "The report says no battery is installed or numbers are zero", "action_type": "normal"},
                {"key": "uploaded_file", "label": "I have uploaded my battery-report.html file", "action_type": "normal"}
            ],
            "what_happens_next": "We will provide an honest, evidence-based recommendation on whether you need a new battery or if a software reset will fix it.",
            "what_we_know_so_far": [
                "Battery report was generated successfully."
            ],
            "what_we_need_to_check": ["Wear percentage and battery condition."],
            "next_action_title": "Analyze capacity numbers",
            "allows_file_upload": True,
            "upload_hint": "Upload battery-report.html for an automated, instant plain-English breakdown."
        }
    },
    6: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Here is what the evidence tells us, along with the safest next steps.",
        "structured_data": {
            "what_we_are_checking": "Evaluating whether a power driver reset or physical battery replacement is needed.",
            "why_it_matters": "Before spending money on a new battery, resetting the Windows Battery Driver can sometimes revive a battery that got confused by a software glitch.",
            "what_to_do": [
                "1. Right-click the Windows Start button and select 'Device Manager'.",
                "2. Click the arrow next to 'Batteries' to expand it.",
                "3. Right-click 'Microsoft ACPI-Compliant Control Method Battery'.",
                "4. Select 'Uninstall device' (Do not worry, Windows will automatically reinstall this when you restart).",
                "5. Restart your laptop with the charger connected."
            ],
            "what_should_happen": "Windows will rebuild its communication link with the battery hardware on reboot.",
            "tell_us_what_happened_options": [
                {"key": "uninstalled_restarted", "label": "I completed the driver reset and restarted", "action_type": "normal"},
                {"key": "need_simpler_driver", "label": "I need simpler steps to find Device Manager", "action_type": "need_simpler"},
                {"key": "battery_already_known_bad", "label": "My battery report showed heavy wear (over 60% loss)", "action_type": "normal"}
            ],
            "what_happens_next": "We will test if unplugging now keeps the laptop awake, or guide you on the safest replacement route.",
            "what_we_know_so_far": [
                "Diagnosed battery capacity and hardware communication status."
            ],
            "what_we_need_to_check": ["Post-restart battery stability."],
            "next_action_title": "Reset Battery Driver",
            "safety_warning": "Never buy cheap non-certified counterfeit batteries online. Look for OEM (original manufacturer) or well-reviewed reputable brands."
        }
    },
    7: {
        "stage": "confirming_fix",
        "progress_title": "Confirming the fix",
        "assistant_message": "Let's check the result. With your computer restarted and charged, try unplugging the charger now.",
        "structured_data": {
            "what_we_are_checking": "Did this solve your problem?",
            "why_it_matters": "We want to ensure your laptop stays safely powered on and that you feel confident using it without unexpected shutdowns.",
            "what_to_do": [
                "Disconnect the charger from your laptop.",
                "Wait 30 to 60 seconds.",
                "Observe if the laptop stays on and shows battery power."
            ],
            "what_should_happen": "The laptop should smoothly transition to battery power without shutting down.",
            "tell_us_what_happened_options": [
                {"key": "yes_fixed", "label": "Yes, it is fixed! It stays on unplugged", "action_type": "solved"},
                {"key": "still_happening", "label": "The problem is still happening (turns off)", "action_type": "not_solved"},
                {"key": "need_more_help", "label": "I need more help / want professional advice", "action_type": "not_solved"}
            ],
            "what_happens_next": "If fixed, we'll give you a summary report of what happened. If not, we'll explain how to safely replace the battery or find a certified technician.",
            "what_we_know_so_far": [
                "Tested power behavior after driver reset and capacity inspection."
            ],
            "what_we_need_to_check": ["Confirmation of fix."],
            "next_action_title": "Verify fix"
        }
    }
}

WIFI_NO_INTERNET_TREE: Dict[int, Dict[str, Any]] = {
    1: {
        "stage": "understanding",
        "progress_title": "Understanding the problem",
        "assistant_message": "Having Wi-Fi connected without internet is frustrating. Let's figure out whether the problem is on your computer or with the internet service itself.",
        "structured_data": {
            "what_we_are_checking": "Are other devices able to load websites on this exact same Wi-Fi?",
            "why_it_matters": "If your smartphone or family member's computer can open websites on this Wi-Fi, we know your router is fine and the issue is just inside your computer.",
            "what_to_do": [
                "Pick up your phone or another device connected to the same Wi-Fi network.",
                "Turn off Mobile Data (Cellular) on that device.",
                "Try opening any website (like google.com or wikipedia.org)."
            ],
            "what_should_happen": "Websites either load normally on the other device, or they fail there too.",
            "tell_us_what_happened_options": [
                {"key": "phone_works", "label": "My phone works fine on this Wi-Fi", "action_type": "normal"},
                {"key": "all_devices_fail", "label": "No devices have internet on this Wi-Fi", "action_type": "normal"},
                {"key": "no_other_device", "label": "I do not have another device to test with", "action_type": "normal"}
            ],
            "what_happens_next": "Depending on your answer, we will either restart your router or fix your computer's network settings.",
            "what_we_know_so_far": ["Wi-Fi shows connected, but websites do not load."],
            "what_we_need_to_check": ["Is the issue limited to this computer or the whole network?"],
            "next_action_title": "Check other devices"
        }
    },
    2: {
        "stage": "checking",
        "progress_title": "Checking the cause",
        "assistant_message": "Thank you! That helps us narrow this down significantly. Let's do a simple reset of your computer's wireless connection.",
        "structured_data": {
            "what_we_are_checking": "Clearing temporary wireless connection glitches by toggling Wi-Fi.",
            "why_it_matters": "Sometimes computers hold onto an expired network lease (IP address) from a previous session. Turning Wi-Fi off and back on asks the router for a fresh connection.",
            "what_to_do": [
                "Click the Wi-Fi icon in the bottom-right corner of your screen (near the clock).",
                "Click the Wi-Fi button to turn it OFF.",
                "Wait 10 seconds (count slowly to 10).",
                "Click the Wi-Fi button again to turn it back ON.",
                "Wait for it to reconnect to your home network."
            ],
            "what_should_happen": "Your computer will re-handshake with the router and obtain fresh network settings.",
            "tell_us_what_happened_options": [
                {"key": "reconnected_and_works", "label": "Internet started working!", "action_type": "solved"},
                {"key": "reconnected_still_no_internet", "label": "Reconnected, but still says 'No Internet'", "action_type": "normal"},
                {"key": "cant_find_wifi_icon", "label": "I cannot find the Wi-Fi icon", "action_type": "need_simpler"}
            ],
            "what_happens_next": "If it still doesn't work, we will run the built-in Windows Network Diagnostics tool to automatically find what is blocking traffic.",
            "what_we_know_so_far": [
                "Wi-Fi signal is present.",
                "Other devices work, confirming the internet service itself is active."
            ],
            "what_we_need_to_check": ["Whether toggling the Wi-Fi card restores communication."],
            "next_action_title": "Toggle Wi-Fi connection"
        }
    },
    3: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Let's flush your computer's DNS cache. This clears old internet address records that might be directing your browser to dead ends.",
        "structured_data": {
            "what_we_are_checking": "Renewing your computer's internet address lookup table (DNS cache).",
            "why_it_matters": "DNS is like the computer's phonebook. If the phonebook has old entries, your computer can't find website addresses even when the cable is plugged in.",
            "what_to_do": [
                "1. Press the Windows Start button.",
                "2. Type cmd and press Enter.",
                "3. In the black window that opens, type:\n\nipconfig /flushdns\n",
                "4. Press Enter.",
                "5. Next, type:\n\nnetsh winsock reset\n",
                "6. Press Enter, then restart your computer."
            ],
            "what_should_happen": "You should see: 'Successfully flushed the DNS Resolver Cache'.",
            "command_to_run": "ipconfig /flushdns",
            "command_explanation": "This command cleans out old website address records stored on your computer. It is completely safe and touches no personal files.",
            "tell_us_what_happened_options": [
                {"key": "ran_commands_restarted", "label": "I ran the commands and restarted", "action_type": "normal"},
                {"key": "need_simpler_steps", "label": "I need simpler steps or an alternative", "action_type": "need_simpler"},
                {"key": "error_running_command", "label": "I got an error or permission denied", "action_type": "error"}
            ],
            "what_happens_next": "We will check if your browser can now load internet pages.",
            "what_we_know_so_far": [
                "Adapter toggled.",
                "Clearing DNS resolver."
            ],
            "what_we_need_to_check": ["Website reachability."],
            "next_action_title": "Flush DNS and Reset Winsock"
        }
    },
    4: {
        "stage": "confirming_fix",
        "progress_title": "Confirming the fix",
        "assistant_message": "Let's check if you are back online!",
        "structured_data": {
            "what_we_are_checking": "Did this solve your problem?",
            "why_it_matters": "We want to verify that you can load web pages smoothly without errors.",
            "what_to_do": [
                "Open your web browser (Chrome, Edge, or Firefox).",
                "Visit a website you haven't visited today (e.g. bbc.com or wikipedia.org).",
                "Check if the page loads."
            ],
            "what_should_happen": "The web page loads quickly without a 'No Internet' or 'DNS error' screen.",
            "tell_us_what_happened_options": [
                {"key": "yes_fixed", "label": "Yes, it is fixed! I can browse normally", "action_type": "solved"},
                {"key": "still_happening", "label": "Still not working (No internet)", "action_type": "not_solved"},
                {"key": "need_more_help", "label": "I need more help / router reset instructions", "action_type": "not_solved"}
            ],
            "what_happens_next": "If fixed, congratulations! If not, we will guide you on how to safely power-cycle your home router.",
            "what_we_know_so_far": [
                "Computer network stack reset complete."
            ],
            "what_we_need_to_check": ["Final browser test."],
            "next_action_title": "Test internet access"
        }
    }
}

SLOW_COMPUTER_TREE: Dict[int, Dict[str, Any]] = {
    1: {
        "stage": "understanding",
        "progress_title": "Understanding the problem",
        "assistant_message": "A slow computer can make everything stressful. Let's find out exactly when the slowdown happens so we don't do unnecessary work.",
        "structured_data": {
            "what_we_are_checking": "When your computer feels the slowest.",
            "why_it_matters": "Slowness during startup usually means too many programs are trying to launch at once, while slowness all the time might mean low hard drive space or high processor temperature.",
            "what_to_do": [
                "Consider when you notice the computer slowing down the most.",
                "Select the option below that fits best."
            ],
            "what_should_happen": "We will target the specific cause that matches your computer's behavior.",
            "tell_us_what_happened_options": [
                {"key": "slow_startup", "label": "It takes several minutes just to start up after turning on", "action_type": "normal"},
                {"key": "slow_browsing", "label": "It is slow when opening web browser or many tabs", "action_type": "normal"},
                {"key": "slow_all_the_time", "label": "It is slow all the time, even when doing nothing", "action_type": "normal"},
                {"key": "slow_games", "label": "It is slow or lags only during games or video editing", "action_type": "normal"}
            ],
            "what_happens_next": "We will check your Task Manager to see what is using up your computer's power.",
            "what_we_know_so_far": ["Computer feels slow and unresponsive."],
            "what_we_need_to_check": ["Identify high-resource culprits."],
            "next_action_title": "Select slowdown pattern"
        }
    },
    2: {
        "stage": "checking",
        "progress_title": "Checking the cause",
        "assistant_message": "Let's take a quick look inside Task Manager. It is like a dashboard showing what is working in the background.",
        "structured_data": {
            "what_we_are_checking": "If your CPU (processor), Memory (RAM), or Disk is maxed out at 100%.",
            "why_it_matters": "If any of these columns are pinned at 90-100%, that specific resource is the bottleneck slowing down everything else.",
            "what_to_do": [
                "Press Ctrl + Shift + Esc on your keyboard together to open Task Manager.",
                "(Or right-click the Windows Start button and choose 'Task Manager').",
                "Look at the top columns: CPU, Memory, Disk.",
                "See if any column is highlighted in dark orange or showing near 100%."
            ],
            "what_should_happen": "Task Manager opens and displays percentages for CPU, Memory, and Disk.",
            "tell_us_what_happened_options": [
                {"key": "disk_100", "label": "Disk is at or near 100%", "action_type": "normal"},
                {"key": "cpu_100", "label": "CPU is high (80-100%)", "action_type": "normal"},
                {"key": "memory_100", "label": "Memory (RAM) is high (85-100%)", "action_type": "normal"},
                {"key": "all_look_normal", "label": "All percentages look low (below 50%)", "action_type": "normal"},
                {"key": "cant_open_taskmgr", "label": "I cannot open Task Manager", "action_type": "need_simpler"}
            ],
            "what_happens_next": "We will show you the exact safe fix for whichever component is overloaded.",
            "what_we_know_so_far": ["Checked Task Manager status."],
            "what_we_need_to_check": ["Which hardware resource is overwhelmed."],
            "next_action_title": "Open Task Manager (Ctrl + Shift + Esc)"
        }
    },
    3: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Let's disable unneeded startup apps. When apps launch quietly every time your computer turns on, they silently steal memory in the background.",
        "structured_data": {
            "what_we_are_checking": "Reducing startup apps that launch automatically.",
            "why_it_matters": "Apps like Spotify, game launchers, and chat apps often set themselves to start automatically. Disabling them does not uninstall them; it just stops them from starting until you actually open them.",
            "what_to_do": [
                "In Task Manager, look for the 'Startup apps' tab on the left (an icon shaped like a speedometer or gauge).",
                "Look for apps marked with 'High impact' that you don't need right when Windows boots.",
                "Right-click the app (e.g. game launchers, Cortana, update helpers) and click 'Disable'.",
                "Leave essential items like Windows Security enabled."
            ],
            "what_should_happen": "Unnecessary background apps are prevented from slowing down your boot and system memory.",
            "tell_us_what_happened_options": [
                {"key": "disabled_apps", "label": "I disabled unneeded startup apps", "action_type": "normal"},
                {"key": "need_simpler_startup", "label": "I need simpler guidance on what is safe to disable", "action_type": "need_simpler"},
                {"key": "no_apps_found", "label": "There were very few startup apps listed", "action_type": "normal"}
            ],
            "what_happens_next": "We will run Windows Disk Cleanup to free up wasted temporary files.",
            "what_we_know_so_far": [
                "Inspected Task Manager.",
                "Tuned startup apps."
            ],
            "what_we_need_to_check": ["Temporary cache cleanup."],
            "next_action_title": "Disable startup apps"
        }
    },
    4: {
        "stage": "confirming_fix",
        "progress_title": "Confirming the fix",
        "assistant_message": "Let's restart your computer and feel the difference!",
        "structured_data": {
            "what_we_are_checking": "Did this solve your problem?",
            "why_it_matters": "We want your computer to feel snappy, responsive, and easy to use again.",
            "what_to_do": [
                "Restart your computer.",
                "Notice how quickly it reaches your desktop.",
                "Open a browser or program to test responsiveness."
            ],
            "what_should_happen": "The computer should boot noticeably faster and respond immediately to clicks.",
            "tell_us_what_happened_options": [
                {"key": "yes_fixed", "label": "Yes, it is fixed! It feels much faster now", "action_type": "solved"},
                {"key": "still_happening", "label": "It is still slow", "action_type": "not_solved"},
                {"key": "need_more_help", "label": "I need more help / check hard drive health", "action_type": "not_solved"}
            ],
            "what_happens_next": "If still slow, we can check for mechanical hard drive degradation or recommend adding RAM.",
            "what_we_know_so_far": [
                "Background startup load cleared.",
                "System rebooted."
            ],
            "what_we_need_to_check": ["Final responsiveness test."],
            "next_action_title": "Restart and test speed"
        }
    }
}

APP_WONT_OPEN_TREE: Dict[int, Dict[str, Any]] = {
    1: {
        "stage": "understanding",
        "progress_title": "Understanding the problem",
        "assistant_message": "When an app refuses to open, it's usually because a 'ghost' copy is already frozen in the background or a file got corrupted. Let's see what happens when you try to open it.",
        "structured_data": {
            "what_we_are_checking": "The exact reaction when you double-click or launch the app.",
            "why_it_matters": "A spinning wheel that vanishes means the app crashed silently upon launch, while an error message tells us the exact missing file.",
            "what_to_do": [
                "Try launching the program once right now.",
                "Watch your screen carefully for 10 seconds."
            ],
            "what_should_happen": "You will observe whether an error dialog appears or if nothing happens at all.",
            "tell_us_what_happened_options": [
                {"key": "nothing_happens", "label": "Nothing happens at all (cursor spins briefly and stops)", "action_type": "normal"},
                {"key": "error_dialog", "label": "An error message or dialog box pops up", "action_type": "normal"},
                {"key": "opens_then_closes", "label": "The window opens for a second and instantly closes", "action_type": "normal"}
            ],
            "what_happens_next": "We will check if a hidden frozen process is blocking the app from starting fresh.",
            "what_we_know_so_far": ["App fails to open."],
            "what_we_need_to_check": ["Type of launch failure."],
            "next_action_title": "Observe launch behavior",
            "allows_file_upload": True,
            "upload_hint": "If an error dialog pops up, you can upload a screenshot of it here!"
        }
    },
    2: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Let's check if the app is already stuck in the background and end it.",
        "structured_data": {
            "what_we_are_checking": "Ending any invisible frozen copies of the app.",
            "why_it_matters": "When an app freezes while closing, Windows keeps its process in memory. When you try to click it again, Windows says 'it is already open' and does nothing.",
            "what_to_do": [
                "1. Press Ctrl + Shift + Esc to open Task Manager.",
                "2. Look through the 'Processes' list for the name of your application.",
                "3. If you find it, right-click it and click 'End task'.",
                "4. Now try opening the application normally from your Start menu or desktop."
            ],
            "what_should_happen": "Ending the frozen copy lets the application launch with a fresh slate.",
            "tell_us_what_happened_options": [
                {"key": "app_opened_now", "label": "It opened! That fixed it", "action_type": "solved"},
                {"key": "not_in_taskmgr", "label": "The app was not in Task Manager", "action_type": "normal"},
                {"key": "still_wont_open", "label": "I ended the task, but it still won't open", "action_type": "normal"}
            ],
            "what_happens_next": "We'll try running the app with Administrator permissions to check for permission blocks.",
            "what_we_know_so_far": [
                "Cleared any zombie processes in memory."
            ],
            "what_we_need_to_check": ["Administrator permissions check."],
            "next_action_title": "End frozen task"
        }
    },
    3: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Let's test opening the app as an Administrator. This tells us if Windows permissions are blocking it.",
        "structured_data": {
            "what_we_are_checking": "Whether the app requires elevated permissions to access its settings or files.",
            "why_it_matters": "Sometimes an app needs permission to update its internal configuration files. Without admin permission, it may silently exit.",
            "what_to_do": [
                "1. Find the shortcut for the app on your desktop or Start menu.",
                "2. Right-click the app shortcut.",
                "3. Click 'Run as administrator'.",
                "4. If a box asks 'Do you want to allow this app to make changes?', click 'Yes'."
            ],
            "what_should_happen": "The application should launch with full permissions.",
            "tell_us_what_happened_options": [
                {"key": "opened_as_admin", "label": "It opened properly as administrator!", "action_type": "solved"},
                {"key": "still_fails", "label": "Still fails or shows error", "action_type": "not_solved"},
                {"key": "need_reinstall_guide", "label": "I want instructions to safely reinstall or repair it", "action_type": "normal"}
            ],
            "what_happens_next": "If still not opening, we'll guide you through Windows' built-in 'Repair app' button in Settings.",
            "what_we_know_so_far": [
                "Tested administrator mode launch."
            ],
            "what_we_need_to_check": ["Windows App Repair."],
            "next_action_title": "Run as Administrator"
        }
    },
    4: {
        "stage": "confirming_fix",
        "progress_title": "Confirming the fix",
        "assistant_message": "Did this solve your problem?",
        "structured_data": {
            "what_we_are_checking": "Is your application working smoothly now?",
            "why_it_matters": "We want to ensure you can do your work without repeated crashes.",
            "what_to_do": [
                "Use the application normally for a minute.",
                "Confirm it does not crash."
            ],
            "what_should_happen": "The app remains open and functional.",
            "tell_us_what_happened_options": [
                {"key": "yes_fixed", "label": "Yes, it is fixed!", "action_type": "solved"},
                {"key": "still_happening", "label": "The problem is still happening", "action_type": "not_solved"},
                {"key": "need_more_help", "label": "I need more help / repair instructions", "action_type": "not_solved"}
            ],
            "what_happens_next": "We will summarize the steps taken so you know what to do if it happens again.",
            "what_we_know_so_far": ["Completed troubleshooting procedure."],
            "what_we_need_to_check": ["User confirmation."],
            "next_action_title": "Confirm application fix"
        }
    }
}


BSOD_CRASH_TREE: Dict[int, Dict[str, Any]] = {
    1: {
        "stage": "understanding",
        "progress_title": "Understanding the problem",
        "assistant_message": "Blue Screen errors can be startling, but they are Windows' way of protecting your files before hardware or memory gets damaged. Let's find out when the crash happens.",
        "structured_data": {
            "what_we_are_checking": "When the blue screen crash occurs.",
            "why_it_matters": "Crashes during heavy 3D games usually point to GPU graphics drivers or overheating, while random crashes while browsing point to corrupted system files or a faulty RAM stick.",
            "what_to_do": [
                "Think about what you were doing right before the blue screen appeared.",
                "Choose the option below that best matches your situation."
            ],
            "what_should_happen": "We will isolate whether the cause is software updates, drivers, or memory.",
            "tell_us_what_happened_options": [
                {"key": "bsod_random", "label": "It happens randomly while doing simple everyday tasks", "action_type": "normal"},
                {"key": "bsod_gaming", "label": "It happens only during gaming, video editing, or heavy load", "action_type": "normal"},
                {"key": "bsod_startup", "label": "It crashes repeatedly right when Windows is turning on", "action_type": "normal"},
                {"key": "bsod_after_update", "label": "It started immediately after a recent Windows update", "action_type": "normal"}
            ],
            "what_happens_next": "We will check if you have a photo of the blue screen or know the Stop Code.",
            "what_we_know_so_far": ["Computer crashed with a Windows Blue Screen of Death."],
            "what_we_need_to_check": ["Determine crash frequency and trigger."],
            "next_action_title": "Select crash timing",
            "allows_file_upload": True,
            "upload_hint": "If you took a photo of the blue screen with your phone, you can upload it here!"
        }
    },
    2: {
        "stage": "checking",
        "progress_title": "Checking the cause",
        "assistant_message": "Let's run a safe, automated scan using Windows System File Checker (SFC). This checks if core operating system files got damaged.",
        "structured_data": {
            "what_we_are_checking": "Integrity of Windows core operating system files.",
            "why_it_matters": "Incomplete updates or sudden restarts can corrupt critical Windows system files. SFC automatically replaces corrupted files with clean backups.",
            "what_to_do": [
                "1. Press the Windows Start button.",
                "2. Type cmd in the search box.",
                "3. Right-click 'Command Prompt' and choose 'Run as administrator'.",
                "4. Type or paste:\n\nsfc /scannow\n",
                "5. Press Enter and wait until verification reaches 100% (takes 5-10 minutes)."
            ],
            "what_should_happen": "Windows will report whether it found and fixed corrupt files.",
            "command_to_run": "sfc /scannow",
            "command_explanation": "This command scans protected Windows files and replaces corrupted files with a healthy cached copy. It will not touch your personal documents or photos.",
            "tell_us_what_happened_options": [
                {"key": "sfc_repaired", "label": "Found corrupt files and successfully repaired them", "action_type": "normal"},
                {"key": "sfc_no_violations", "label": "Did not find any integrity violations (files are clean)", "action_type": "normal"},
                {"key": "sfc_could_not_fix", "label": "Found corrupt files but could not fix them", "action_type": "normal"},
                {"key": "cant_open_cmd_admin", "label": "I cannot open Command Prompt as Administrator", "action_type": "tool_missing"}
            ],
            "what_happens_next": "Depending on the scan result, we will test your RAM memory sticks or update your graphics driver.",
            "what_we_know_so_far": ["System crash frequency investigated."],
            "what_we_need_to_check": ["Core system file integrity."],
            "next_action_title": "Run sfc /scannow"
        }
    },
    3: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Let's schedule a quick hardware RAM check using Windows Memory Diagnostic. Faulty memory chips are one of the most common causes of random blue screens.",
        "structured_data": {
            "what_we_are_checking": "Testing your physical RAM memory sticks for defective sectors.",
            "why_it_matters": "When RAM memory chips develop hardware defects, Windows cannot store temporary data accurately and crashes to prevent file corruption.",
            "what_to_do": [
                "1. Save any open files you are working on.",
                "2. Press Windows Key + R on your keyboard.",
                "3. Type: mdsched.exe and press Enter.",
                "4. Click 'Restart now and check for problems (recommended)'.",
                "5. Your computer will reboot into a blue diagnostic screen and test memory automatically."
            ],
            "what_should_happen": "Windows will reboot, run 2 test passes, and reboot back to your desktop with test results.",
            "command_to_run": "mdsched.exe",
            "command_explanation": "This is the official Microsoft Memory Diagnostic tool built directly into Windows.",
            "tell_us_what_happened_options": [
                {"key": "ram_no_errors", "label": "Test completed: No memory errors were detected", "action_type": "normal"},
                {"key": "ram_errors_found", "label": "Hardware problems were detected in memory", "action_type": "normal"},
                {"key": "prefer_driver_check", "label": "I prefer to update my drivers first before rebooting", "action_type": "normal"}
            ],
            "what_happens_next": "If RAM is clean, we will guide you on updating your GPU graphics driver.",
            "what_we_know_so_far": ["Completed Windows file system verification."],
            "what_we_need_to_check": ["Physical RAM hardware health."],
            "next_action_title": "Run Windows Memory Diagnostic"
        }
    },
    4: {
        "stage": "confirming_fix",
        "progress_title": "Confirming the fix",
        "assistant_message": "Now that system files have been repaired and hardware integrity verified, let's observe your computer's stability.",
        "structured_data": {
            "what_we_are_checking": "Did this solve your problem?",
            "why_it_matters": "We want to ensure your computer runs stably without random crashes interrupting your work.",
            "what_to_do": [
                "Use your computer normally.",
                "Try doing what previously caused the crash (e.g. browsing or gaming).",
                "Observe if any blue screen appears."
            ],
            "what_should_happen": "The computer operates smoothly without crashes.",
            "tell_us_what_happened_options": [
                {"key": "yes_fixed", "label": "Yes, it is fixed! No more blue screens", "action_type": "solved"},
                {"key": "still_happening", "label": "A blue screen occurred again", "action_type": "not_solved"},
                {"key": "need_more_help", "label": "I need help rolling back a recent Windows update", "action_type": "not_solved"}
            ],
            "what_happens_next": "If solved, we'll archive your repair report. If not, we will guide you on how to cleanly reinstall GPU display drivers.",
            "what_we_know_so_far": ["System repair and memory verification completed."],
            "what_we_need_to_check": ["Stability confirmation."],
            "next_action_title": "Confirm system stability"
        }
    }
}

OVERHEATING_FAN_TREE: Dict[int, Dict[str, Any]] = {
    1: {
        "stage": "understanding",
        "progress_title": "Understanding the problem",
        "assistant_message": "When fans spin loudly and a laptop gets hot, the cooling system is struggling to push out heat. Let's see what is happening physically.",
        "structured_data": {
            "what_we_are_checking": "Where your computer is placed and what the fan sounds like.",
            "why_it_matters": "Placing a laptop on a bed, blanket, or pillow completely suffocates the air intake vents underneath, trapping heat inside.",
            "what_to_do": [
                "Look at where your laptop is resting right now.",
                "Listen to the fan noise."
            ],
            "what_should_happen": "We will immediately correct any airflow blockage before heat causes a sudden safety shutdown.",
            "tell_us_what_happened_options": [
                {"key": "on_soft_surface", "label": "It was resting on my lap, bed, or a soft blanket", "action_type": "normal"},
                {"key": "on_hard_desk", "label": "It is on a clean, hard desk, but still getting hot", "action_type": "normal"},
                {"key": "fan_rattling", "label": "The fan makes a grinding or buzzing noise (broken fan)", "action_type": "normal"}
            ],
            "what_happens_next": "We will elevate the laptop for proper airflow and inspect background processor usage.",
            "what_we_know_so_far": ["Computer getting very hot with loud fan noise."],
            "what_we_need_to_check": ["Air intake blockage and surface ventilation."],
            "next_action_title": "Check placement and surface",
            "safety_warning": "Important safety warning: Never use your laptop directly on blankets, duvets, or pillows. Soft materials block cooling vents and can cause dangerous thermal cutouts."
        }
    },
    2: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Let's do two simple physical adjustments right now to restore healthy cooling airflow.",
        "structured_data": {
            "what_we_are_checking": "Restoring unobstructed air circulation underneath the laptop.",
            "why_it_matters": "Raising the back of the laptop by just 1 inch allows cool room air to flow underneath, which can immediately drop temperatures by 10 to 15 degrees Celsius.",
            "what_to_do": [
                "1. Move the laptop to a clean, flat table or hard desk.",
                "2. Prop up the back feet of the laptop slightly (you can place two bottle caps or a small book under the back corners).",
                "3. Ensure the side and bottom vents have at least 4 inches of open space.",
                "4. Wait 2 to 3 minutes and listen to the fan."
            ],
            "what_should_happen": "Fans should begin pushing out warm air and gradually slow down as the heatsink cools.",
            "tell_us_what_happened_options": [
                {"key": "fan_slowed_down", "label": "The fan slowed down and temperatures dropped!", "action_type": "solved"},
                {"key": "fan_still_loud", "label": "Still very hot and fan is still spinning loudly", "action_type": "normal"}
            ],
            "what_happens_next": "If still loud, we will check Task Manager for runaway background programs eating 100% CPU.",
            "what_we_know_so_far": ["Ventilation path cleared and elevated."],
            "what_we_need_to_check": ["Background processor load."],
            "next_action_title": "Elevate laptop and check fan"
        }
    },
    3: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Let's check Task Manager to see if a hidden background process is running your processor at maximum power.",
        "structured_data": {
            "what_we_are_checking": "High CPU utilization in Task Manager.",
            "why_it_matters": "When a background program gets stuck in a loop, it pushes your processor to 100% clock speed, which generates intense heat even when you are doing nothing.",
            "what_to_do": [
                "1. Press Ctrl + Shift + Esc on your keyboard to open Task Manager.",
                "2. Click the 'CPU' column at the top to sort by highest processor usage.",
                "3. Look at which app is using more than 40-50% CPU.",
                "4. If it is an app you don't need (like a browser tab or game launcher), right click it and click 'End task'."
            ],
            "what_should_happen": "Ending runaway programs instantly drops CPU usage below 10%, letting temperatures normalize.",
            "tell_us_what_happened_options": [
                {"key": "found_high_cpu", "label": "I found a high-CPU program and closed it — it cooled down!", "action_type": "solved"},
                {"key": "cpu_was_low", "label": "CPU usage was low (below 15%), but it's still hot", "action_type": "normal"}
            ],
            "what_happens_next": "If temperatures remain high despite low CPU, dust buildup in the heatsink fins is the likely cause.",
            "what_we_know_so_far": ["Inspected background CPU load."],
            "what_we_need_to_check": ["Internal dust blockage."],
            "next_action_title": "Inspect Task Manager (Ctrl + Shift + Esc)"
        }
    },
    4: {
        "stage": "confirming_fix",
        "progress_title": "Confirming the fix",
        "assistant_message": "Did this solve your problem?",
        "structured_data": {
            "what_we_are_checking": "Is your computer quiet and running at a normal temperature?",
            "why_it_matters": "We want your device to operate comfortably without risk of thermal throttling or sudden shutdowns.",
            "what_to_do": [
                "Touch the keyboard and bottom casing.",
                "Listen to the fan noise level."
            ],
            "what_should_happen": "The computer should feel lukewarm or cool, with fans running quietly.",
            "tell_us_what_happened_options": [
                {"key": "yes_fixed", "label": "Yes, it is fixed! Quiet and much cooler", "action_type": "solved"},
                {"key": "still_happening", "label": "It is still uncomfortably hot (needs dust cleaning)", "action_type": "not_solved"},
                {"key": "need_more_help", "label": "I want advice on cleaning heatsink dust safely", "action_type": "not_solved"}
            ],
            "what_happens_next": "If still hot, we recommend using a can of compressed air to gently blow dust out of the exhaust vents while powered off.",
            "what_we_know_so_far": ["Ventilation elevated and CPU usage verified."],
            "what_we_need_to_check": ["User confirmation."],
            "next_action_title": "Confirm thermal resolution"
        }
    }
}

PRINTER_OFFLINE_TREE: Dict[int, Dict[str, Any]] = {
    1: {
        "stage": "understanding",
        "progress_title": "Understanding the problem",
        "assistant_message": "Printer offline errors usually happen when Windows gets confused about printer Wi-Fi signals or when a corrupted document jams the Windows Print Spooler. Let's see how it is connected.",
        "structured_data": {
            "what_we_are_checking": "How your printer connects to your computer.",
            "why_it_matters": "Wi-Fi printers can drop connection if the router reassigns a new IP address, while USB printers might just have a loose cable.",
            "what_to_do": [
                "Look at your printer.",
                "Select whether it connects via Wi-Fi network or a direct USB cable."
            ],
            "what_should_happen": "We will target the correct connection test.",
            "tell_us_what_happened_options": [
                {"key": "printer_wifi", "label": "It connects via Wi-Fi (Wireless network)", "action_type": "normal"},
                {"key": "printer_usb", "label": "It connects via USB cable plugged into my PC", "action_type": "normal"},
                {"key": "printer_not_sure", "label": "I am not sure how it connects", "action_type": "normal"}
            ],
            "what_happens_next": "We will check the Windows print queue to make sure 'Use Printer Offline' was not checked accidentally.",
            "what_we_know_so_far": ["Printer displays 'Offline' and documents won't print."],
            "what_we_need_to_check": ["Physical connection type."],
            "next_action_title": "Select printer connection type"
        }
    },
    2: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Let's check if the hidden 'Use Printer Offline' setting got accidentally enabled in Windows.",
        "structured_data": {
            "what_we_are_checking": "Unchecking the 'Use Printer Offline' setting in Windows.",
            "why_it_matters": "If Windows lost connection with the printer for even 1 second, it often checks this box and never unchecks it automatically.",
            "what_to_do": [
                "1. Open Windows Settings (Press Windows Key + I).",
                "2. Click 'Bluetooth & devices', then click 'Printers & scanners'.",
                "3. Click on your printer from the list.",
                "4. Click 'Open print queue'.",
                "5. In the top menu, click 'Printer'.",
                "6. Make sure 'Use Printer Offline' is UNCHECKED (no checkmark next to it)."
            ],
            "what_should_happen": "Printer status updates from 'Offline' back to 'Ready'.",
            "tell_us_what_happened_options": [
                {"key": "uncheck_fixed", "label": "It was checked! I unchecked it and it started printing", "action_type": "solved"},
                {"key": "was_not_checked", "label": "It was not checked (still shows offline)", "action_type": "normal"},
                {"key": "cant_find_menu", "label": "I cannot find the print queue menu", "action_type": "need_simpler"}
            ],
            "what_happens_next": "If still offline, we will restart the Windows Print Spooler service.",
            "what_we_know_so_far": ["Inspected offline print queue toggle."],
            "what_we_need_to_check": ["Restart Print Spooler service."],
            "next_action_title": "Check print queue settings"
        }
    },
    3: {
        "stage": "trying_solution",
        "progress_title": "Trying a solution",
        "assistant_message": "Let's restart the Windows Print Spooler. This clears any corrupted print jobs stuck in memory.",
        "structured_data": {
            "what_we_are_checking": "Restarting the Windows Print Spooler service.",
            "why_it_matters": "When a PDF or image has a formatting error, it can freeze the Windows print queue, blocking all future print jobs.",
            "what_to_do": [
                "1. Press the Windows Start button.",
                "2. Type cmd.",
                "3. Right-click 'Command Prompt' and choose 'Run as administrator'.",
                "4. Type: net stop spooler and press Enter.",
                "5. Wait 3 seconds, then type: net start spooler and press Enter."
            ],
            "what_should_happen": "Command Prompt will display: 'The Print Spooler service was started successfully.'",
            "command_to_run": "net stop spooler & net start spooler",
            "command_explanation": "Stops and restarts the Windows background printing engine. This safely unblocks frozen print queues.",
            "tell_us_what_happened_options": [
                {"key": "spooler_restarted", "label": "I restarted the spooler and tried printing again", "action_type": "normal"},
                {"key": "error_starting_spooler", "label": "I got an error or access denied", "action_type": "error"}
            ],
            "what_happens_next": "We will print a test page to verify that the printer is working.",
            "what_we_know_so_far": ["Restarted Windows printing spooler service."],
            "what_we_need_to_check": ["Print test page."],
            "next_action_title": "Restart Print Spooler"
        }
    },
    4: {
        "stage": "confirming_fix",
        "progress_title": "Confirming the fix",
        "assistant_message": "Did this solve your problem?",
        "structured_data": {
            "what_we_are_checking": "Did your test document print successfully?",
            "why_it_matters": "We want to ensure your printer responds immediately when you send documents.",
            "what_to_do": [
                "Send a short document or test page to print.",
                "Verify paper feeds through and prints."
            ],
            "what_should_happen": "The printer wakes up, feeds paper, and prints cleanly.",
            "tell_us_what_happened_options": [
                {"key": "yes_fixed", "label": "Yes, it is fixed! It printed cleanly", "action_type": "solved"},
                {"key": "still_happening", "label": "Still not printing (shows offline)", "action_type": "not_solved"},
                {"key": "need_more_help", "label": "I need help reconnecting printer to Wi-Fi", "action_type": "not_solved"}
            ],
            "what_happens_next": "If fixed, congratulations! If not, power-cycling the printer (turn off for 30s) or reinstalling printer manufacturer drivers will be our next step.",
            "what_we_know_so_far": ["Print spooler reset and tested."],
            "what_we_need_to_check": ["Final print confirmation."],
            "next_action_title": "Confirm printing fix"
        }
    }
}
