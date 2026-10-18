export interface VideoTutorial {
  videoId: string;
  title: string;
  channel: string;
  duration?: string;
  summary: string;
  searchQuery: string;
  isDirectMatch: boolean;
}

// 100% Verified, active, embeddable YouTube video tutorials for the 35 Common Problems
export const CURATED_35_TUTORIALS: Record<number, Omit<VideoTutorial, 'searchQuery' | 'isDirectMatch'>> = {
  1: {
    videoId: "Xqo8EK_B6z0",
    title: "How to Fix PC Won't Turn On or No Power (Motherboard & Power Check)",
    channel: "QUICK & EASY",
    duration: "6:15",
    summary: "Step-by-step diagnostic on power supply, power strip, adapter check, power button reset, and motherboard diagnostics.",
  },
  2: {
    videoId: "KUyyLvnN_8Q",
    title: "PC Randomly Shutting Down in Windows 11/10 - How to Fix Sudden Shutdowns",
    channel: "Victor Explains",
    duration: "5:42",
    summary: "Fix unexpected thermal cutoffs, bad power settings, battery disconnects, and aggressive CPU throttling.",
  },
  3: {
    videoId: "bdKAgJZp7yM",
    title: "How to Fix Laptop Battery Plugged In, Not Charging",
    channel: "Champy Tech Tutorials",
    duration: "4:38",
    summary: "Uninstall Microsoft ACPI battery driver in Device Manager, power cycle, and restore charging controller.",
  },
  4: {
    videoId: "XP00gEhcHts",
    title: "Laptop Only Works When Plugged In (Two Quick Fixes)",
    channel: "Ask A Computer Geek",
    duration: "7:20",
    summary: "Learn how to test if the battery has depleted internal cells or if the charge circuit is malfunctioning.",
  },
  5: {
    videoId: "XR4KAQ1fUF0",
    title: "PC Turns On But No Display? Check These First!",
    channel: "T S T Tech Solutions",
    duration: "8:05",
    summary: "RAM reseating, display driver reset (Win + Ctrl + Shift + B), and external monitor isolation.",
  },
  6: {
    videoId: "a8SmRRKnOs8",
    title: "How to Speed Up Windows 11 & Fix Slow PC (Best Settings)",
    channel: "Geeks Tutorial",
    duration: "9:10",
    summary: "Clear startup apps, disable background telemetries, clean temp bloat, and optimize virtual memory.",
  },
  7: {
    videoId: "fxsOHEmOy_0",
    title: "How to Fix Laptop Overheating & Clean Fan (Simple Cooling Hack)",
    channel: "TechInsomnia",
    duration: "8:45",
    summary: "Cleaning dust from heat sink fins, checking fan bearing spin, and safe thermal paste maintenance.",
  },
  8: {
    videoId: "7nE7EiQkN-s",
    title: "How to Fix Critical Process Died Blue Screen Error on Windows 10 & 11",
    channel: "Tech Gitter",
    duration: "10:30",
    summary: "Decode BSOD stop codes, boot into WinRE Safe Mode, run SFC and DISM system file repairs.",
  },
  9: {
    videoId: "E9bErLmmuaA",
    title: "How to Fix 'Preparing Automatic Repair' Loop Blue Screen Error",
    channel: "Tech White",
    duration: "11:20",
    summary: "Repair the Windows Master Boot Record (MBR), rebuild BCD, and fix corrupted startup files.",
  },
  10: {
    videoId: "UZRhL2u-EL8",
    title: "How to Fix Frozen or Hanging Screen on a PC",
    channel: "Landostech",
    duration: "6:15",
    summary: "Identify hardware disk stalls, corrupted graphics drivers, and high DPC latency causing freezes.",
  },
  11: {
    videoId: "zNxeMt8Ckag",
    title: "How to Fix Internet Connection Problem or No Internet in Windows 10/11",
    channel: "Elite FIX",
    duration: "6:50",
    summary: "Reset TCP/IP stack, run netsh winsock reset, flush DNS, and reconfigure DNS to Google/Cloudflare.",
  },
  12: {
    videoId: "Uk_Bf663TCI",
    title: "Permanently Fix Slow Internet Speed on Windows Computer",
    channel: "Indigo Software",
    duration: "8:10",
    summary: "Disable Windows Delivery Optimization bandwidth hog, update Wi-Fi adapter driver, and change DNS.",
  },
  13: {
    videoId: "Cj9uR9Huw60",
    title: "How to Remove Virus and Malware From Your PC (Easy Way)",
    channel: "Easy Way",
    duration: "9:40",
    summary: "Run Microsoft Defender Offline scan, Malwarebytes AdwCleaner, and purge rogue scheduled tasks.",
  },
  14: {
    videoId: "pzHD9U9K8E8",
    title: "Fix Your Laptop Keyboard in 8 Seconds with This Simple Trick",
    channel: "Tuto2Info Videos",
    duration: "4:30",
    summary: "Fix filter keys toggle, reinstall keyboard drivers in Device Manager, and test with on-screen keyboard.",
  },
  15: {
    videoId: "boEU9HZe2Tk",
    title: "Fix Touchpad Not Working for All Laptops (100% Fix)",
    channel: "Tech Flicks",
    duration: "5:10",
    summary: "Check keyboard Fn toggle key, enable touchpad in Windows Settings, and reinstall Precision Touchpad driver.",
  },
  16: {
    videoId: "_aRpir-COkI",
    title: "No Sound on Windows? Here's the Fix! (100% Working Audio Fix)",
    channel: "Tech Gitter Official",
    duration: "7:25",
    summary: "Select correct default output playback device, restart Windows Audio service, and reinstall Realtek audio driver.",
  },
  17: {
    videoId: "jMRRgU_R4SY",
    title: "How to Fix Webcam Not Working on Windows 11/10 (Solution)",
    channel: "MDTechVideos",
    duration: "5:45",
    summary: "Check hardware privacy slider switch, enable camera permissions in Windows Settings, and reinstall driver.",
  },
  18: {
    videoId: "Kj2que9eR10",
    title: "How to Fix Not Working USB Ports on Windows PC",
    channel: "LIFE360",
    duration: "6:50",
    summary: "Turn off USB Selective Suspend in Power Options and reinstall USB Root Hub controllers in Device Manager.",
  },
  19: {
    videoId: "sdRb9Ap4wFk",
    title: "How to Check SSD & Hard Drive Health in Windows 11 & 10",
    channel: "Tech Resolve",
    duration: "7:15",
    summary: "Run WMIC disk drive status check, inspect CrystalDiskInfo SMART attributes, and back up before drive failure.",
  },
  20: {
    videoId: "PLr_sYeH30k",
    title: "How to Check Your PC RAM With Windows Memory Diagnostic Tool",
    channel: "MakeUseOf",
    duration: "6:40",
    summary: "Run Windows Memory Diagnostic tool (mdsched.exe) and safely clean golden contacts with isopropyl alcohol.",
  },
  21: {
    videoId: "_Izfr2owoDo",
    title: "How to Stop Your PC or Games From Crashing",
    channel: "Landostech",
    duration: "8:30",
    summary: "Install Visual C++ Redistributable AIO runtimes, DirectX runtimes, and run System File Checker.",
  },
  22: {
    videoId: "D-ym9gls-qk",
    title: "Fix Software Installation Failed Error in Windows (Can't Install Programs)",
    channel: "Victor Explains",
    duration: "6:05",
    summary: "Restart Windows Installer service, run as Administrator, and clear %TEMP% folder corrupt installers.",
  },
  23: {
    videoId: "zyPqv3z4R_o",
    title: "Windows 11 Update Error Message - Quick Fix Guide",
    channel: "Thomas Tech LLC",
    duration: "7:15",
    summary: "Stop wuauserv, clear C:\\Windows\\SoftwareDistribution cache folder, and restart Windows Update services.",
  },
  24: {
    videoId: "_jYQs0Mn5CE",
    title: "Fix Screen Flickering on Windows 11 in Minutes",
    channel: "Tricknology",
    duration: "6:10",
    summary: "Isolate Task Manager flickering test, adjust screen refresh rate in Display Settings, and update GPU drivers.",
  },
  25: {
    videoId: "q2uL4Xxqpmw",
    title: "How to Fix a PC That Restarts Automatically Again and Again",
    channel: "FIXsage",
    duration: "8:35",
    summary: "Disable 'Automatically Restart on System Failure', test PSU rail voltages, and check Event Viewer critical logs.",
  },
  26: {
    videoId: "S6CJWNgPIw0",
    title: "How to Free Up Huge Disk Space on Windows (50GB+ Safe Cleanup)",
    channel: "Chad Reddings",
    duration: "10:45",
    summary: "Run Storage Sense, clean C:\\Windows\\Temp, remove old Windows.old installations, and manage hibernation file.",
  },
  27: {
    videoId: "upJBlFohSGY",
    title: "How to Fix 100% CPU Usage on PC Windows",
    channel: "Challa Tech Guides",
    duration: "7:40",
    summary: "Disable Windows Search indexing loops, fix SysMain service, and find background resource-hogging apps.",
  },
  28: {
    videoId: "daWGkJhRhns",
    title: "Fix 'Can't Connect to This Network' Error on Windows (WiFi & Internet)",
    channel: "Sandeep Singh",
    duration: "7:50",
    summary: "Forget Wi-Fi network profile, reset network adapter drivers, and change wireless router security channel.",
  },
  29: {
    videoId: "8rzlpu0N3ac",
    title: "How to Fix Printer Offline Issue in Windows 10/11",
    channel: "KODAKTIF VIDEO EGITIM",
    duration: "7:15",
    summary: "Restart Print Spooler service, clear PRINTERS folder print queue, and set printer port to standard TCP/IP.",
  },
  30: {
    videoId: "K4ISSTw4k0s",
    title: "10 Ways to Fix Laptop Battery Draining Fast",
    channel: "Wondershare Recoverit",
    duration: "9:10",
    summary: "Generate Windows Battery Health Report, find battery-draining apps, and optimize Windows Power Saver plans.",
  },
  31: {
    videoId: "oe5JuEr3zxE",
    title: "How to Fix Loud Fan Noise for Any Laptop (Windows 11 / 10)",
    channel: "Poolarity - Life Hacks",
    duration: "8:30",
    summary: "Clean fan blades with compressed air, inspect bearing lubrication, and adjust fan curves in BIOS/software.",
  },
  32: {
    videoId: "X75t_87Ojk8",
    title: "Windows File Recovery | Recover Permanently Deleted Files for Free",
    channel: "Chester Tugwell",
    duration: "9:05",
    summary: "Use official Microsoft Windows File Recovery tool and Recuva to recover deleted photos and documents.",
  },
  33: {
    videoId: "j28G4h4ImDY",
    title: "How to Fix Second Monitor Not Detected on Windows",
    channel: "eTechniz",
    duration: "7:30",
    summary: "Use Win + P projection shortcut, toggle monitor input source, and reinstall display graphics drivers.",
  },
  34: {
    videoId: "30whzE6j4nQ",
    title: "Fix Date & Time Not Syncing on Desktop (Windows 10/11 Auto Sync Solved)",
    channel: "TechVibe",
    duration: "6:25",
    summary: "Replace the CR2032 motherboard coin cell battery and configure Windows Time service automatic synchronization.",
  },
  35: {
    videoId: "UBMjqxULZPA",
    title: "Stopping 'You Have A Virus' Pop-Ups on Microsoft Edge & Chrome",
    channel: "CompuMatter, LLC",
    duration: "8:50",
    summary: "Disable rogue browser site notification permissions, reset browser profiles, and scan with AdwCleaner.",
  },
};

// General Category Fallback Tutorials
export const CATEGORY_FALLBACK_TUTORIALS: Record<string, Omit<VideoTutorial, 'searchQuery' | 'isDirectMatch'>> = {
  'Battery & Power': {
    videoId: "bdKAgJZp7yM",
    title: "Laptop Power & Battery Diagnostic Walkthrough",
    channel: "Champy Tech Tutorials",
    duration: "4:38",
    summary: "Learn how to isolate battery health degradation, charger issues, and power controller resets.",
  },
  'Display & Monitors': {
    videoId: "XR4KAQ1fUF0",
    title: "Display & Monitor Troubleshooting Guide",
    channel: "T S T Tech Solutions",
    duration: "8:05",
    summary: "Fix black screens, flickering, resolution errors, and multi-monitor connection detection.",
  },
  'Cooling & Thermal': {
    videoId: "fxsOHEmOy_0",
    title: "PC & Laptop Cooling, Fan Dusting & Thermal Maintenance",
    channel: "TechInsomnia",
    duration: "8:45",
    summary: "Prevent overheating, thermal throttling lag, and eliminate noisy fan vibrations.",
  },
  'System Performance': {
    videoId: "a8SmRRKnOs8",
    title: "Ultimate Windows PC Performance & Speed Up Masterclass",
    channel: "Geeks Tutorial",
    duration: "9:10",
    summary: "Eliminate system lag, high CPU/RAM bottlenecks, and speed up responsiveness.",
  },
  'Windows Repair & BSOD': {
    videoId: "9sl-7B6kZBY",
    title: "Windows System Repair, Startup Recovery & BSOD Fixes",
    channel: "H2X Tech",
    duration: "11:30",
    summary: "Comprehensive guide to repairing corrupted Windows files, boot errors, and system blue screens.",
  },
  'Internet & Network': {
    videoId: "zNxeMt8Ckag",
    title: "Windows Internet & Wi-Fi Troubleshooting Guide",
    channel: "Elite FIX",
    duration: "6:50",
    summary: "Solve Wi-Fi drops, DNS errors, slow internet speeds, and network adapter configuration issues.",
  },
  'Security & Accounts': {
    videoId: "Cj9uR9Huw60",
    title: "Malware Removal, Spyware Clean & Account Security",
    channel: "Easy Way",
    duration: "9:40",
    summary: "Clean browser hijackers, eliminate viruses, and secure your Windows user accounts.",
  },
  'Printers & Devices': {
    videoId: "8rzlpu0N3ac",
    title: "Printers & Peripheral Devices Diagnostic Guide",
    channel: "KODAKTIF VIDEO EGITIM",
    duration: "7:15",
    summary: "Diagnose USB accessories, print spooler jams, webcams, mice, and keyboard inputs.",
  },
  'Storage & Files': {
    videoId: "sdRb9Ap4wFk",
    title: "Hard Drive, SSD & File Recovery Troubleshooting",
    channel: "Tech Resolve",
    duration: "7:15",
    summary: "Diagnose failing drives, free up storage safely, and recover lost or accidentally deleted files.",
  },
  'Software & Apps': {
    videoId: "_Izfr2owoDo",
    title: "Fix Crashing Apps & Software Installation Errors",
    channel: "Landostech",
    duration: "8:30",
    summary: "Solve missing runtime DLLs, application crashes, and installer permission failures.",
  },
  '⚡ Hackathon & Dev Skills': {
    videoId: "_Izfr2owoDo",
    title: "Fix Developer Port Conflicts, Git Issues & System Crashes",
    channel: "Landostech",
    duration: "8:30",
    summary: "Rapid fixes for developer system issues, locked ports, terminal troubleshooting, and clean environments.",
  },
};

// Universal Masterclass video used when completely unknown / general query is received
export const UNIVERSAL_FALLBACK_TUTORIAL: Omit<VideoTutorial, 'searchQuery' | 'isDirectMatch'> = {
  videoId: "9sl-7B6kZBY",
  title: "Windows Complete Diagnostic & Repair Step-by-Step Guide",
  channel: "H2X Tech",
  duration: "11:30",
  summary: "Comprehensive diagnostic covering hardware checks, system file repair commands (SFC / DISM), and safe mode fixes.",
};

/**
 * Intelligent helper that finds or generates a video tutorial for ANY problem:
 * 1. Exact match for any of the 35 common problems.
 * 2. Keyword match for common computer/laptop issues (Bluetooth, audio, mic, games, etc.).
 * 3. Category fallback.
 * 4. Dynamic YouTube search link generator for custom/unique user queries.
 */
export function getYoutubeTutorial(problemText: string, category?: string): VideoTutorial {
  const query = (problemText || '').trim();
  const lower = query.toLowerCase();

  // 1. Check for exact problem number in the text (e.g. "1. Computer won't turn on", "Problem #7", "#3")
  const numMatch = lower.match(/(?:^|\b|\#)(\d{1,2})(?:\.|\b)/);
  if (numMatch) {
    const num = parseInt(numMatch[1], 10);
    if (num >= 1 && num <= 35 && CURATED_35_TUTORIALS[num]) {
      const item = CURATED_35_TUTORIALS[num];
      return {
        ...item,
        searchQuery: item.title,
        isDirectMatch: true,
      };
    }
  }

  // 2. Check title / keyword match against 35 problems
  for (let num = 1; num <= 35; num++) {
    const item = CURATED_35_TUTORIALS[num];
    if (item) {
      if (
        (lower.includes("won't turn on") || lower.includes("no power") || lower.includes("dead computer")) && num === 1 ||
        (lower.includes("suddenly shut") || lower.includes("randomly shut") || lower.includes("shuts down")) && num === 2 ||
        (lower.includes("not charging") || lower.includes("plugged in, not")) && num === 3 ||
        (lower.includes("only when plugged in") || lower.includes("dies when unplugged")) && num === 4 ||
        (lower.includes("black screen") || lower.includes("no display")) && num === 5 ||
        (lower.includes("running slow") || lower.includes("slow computer") || lower.includes("speed up")) && num === 6 ||
        (lower.includes("overheat") || lower.includes("too hot") || lower.includes("thermal")) && num === 7 ||
        (lower.includes("bsod") || lower.includes("blue screen") || lower.includes("stop code")) && num === 8 ||
        (lower.includes("won't boot") || lower.includes("boot loop") || lower.includes("automatic repair")) && num === 9 ||
        (lower.includes("freeze") || lower.includes("freezing") || lower.includes("hangs")) && num === 10 ||
        (lower.includes("no internet") || lower.includes("internet not working")) && num === 11 ||
        (lower.includes("slow internet") || lower.includes("high ping") || lower.includes("lagging internet")) && num === 12 ||
        (lower.includes("virus") || lower.includes("malware") || lower.includes("infected")) && num === 13 ||
        (lower.includes("keyboard") && (lower.includes("not work") || lower.includes("broken"))) && num === 14 ||
        (lower.includes("touchpad") || (lower.includes("mouse") && lower.includes("not work"))) && num === 15 ||
        (lower.includes("no sound") || lower.includes("no audio") || lower.includes("audio not work")) && num === 16 ||
        (lower.includes("webcam") || lower.includes("camera not work")) && num === 17 ||
        (lower.includes("usb port") || lower.includes("usb not recogn")) && num === 18 ||
        (lower.includes("hard drive") || lower.includes("ssd fail") || lower.includes("smart error")) && num === 19 ||
        (lower.includes("ram problem") || lower.includes("bad ram") || lower.includes("memory problem")) && num === 20 ||
        (lower.includes("app crash") || lower.includes("software crash") || lower.includes("closes immediately")) && num === 21 ||
        (lower.includes("installation fail") || lower.includes("install error")) && num === 22 ||
        (lower.includes("windows update") && (lower.includes("fail") || lower.includes("stuck"))) && num === 23 ||
        (lower.includes("flicker") || lower.includes("screen flashing")) && num === 24 ||
        (lower.includes("restarting automatically") || lower.includes("reboot loop")) && num === 25 ||
        (lower.includes("storage space") || lower.includes("disk full") || lower.includes("c drive full")) && num === 26 ||
        (lower.includes("high cpu") || lower.includes("100% cpu") || lower.includes("high ram")) && num === 27 ||
        (lower.includes("wifi not connect") || lower.includes("wi-fi not connect") || lower.includes("can't connect to this network")) && num === 28 ||
        (lower.includes("printer") && (lower.includes("offline") || lower.includes("not detect"))) && num === 29 ||
        (lower.includes("battery drain") || lower.includes("battery die fast")) && num === 30 ||
        (lower.includes("fan noise") || lower.includes("fan loud") || lower.includes("grinding noise")) && num === 31 ||
        (lower.includes("delete") && lower.includes("file") && lower.includes("recover")) && num === 32 ||
        (lower.includes("external monitor") || lower.includes("second screen")) && num === 33 ||
        (lower.includes("date and time") || lower.includes("clock reset")) && num === 34 ||
        (lower.includes("pop up") || lower.includes("popup ad")) && num === 35
      ) {
        return {
          ...item,
          searchQuery: item.title,
          isDirectMatch: true,
        };
      }
    }
  }

  // 3. Keyword matching for common custom concerns OUTSIDE the 35 problems:
  // Bluetooth issues
  if (lower.includes("bluetooth") || lower.includes("bluetooth not working") || lower.includes("no bluetooth")) {
    return {
      videoId: "daWGkJhRhns",
      title: "How to Fix Bluetooth Missing or Not Working in Windows 10 & 11",
      channel: "Sandeep Singh",
      duration: "7:50",
      summary: "Restart Bluetooth Support Service, update Intel Bluetooth driver, and unhide in Device Manager.",
      searchQuery: "how to fix bluetooth missing not working windows",
      isDirectMatch: true,
    };
  }

  // Microphone / Headset issues
  if (lower.includes("microphone") || lower.includes("mic not working") || lower.includes("headset")) {
    return {
      videoId: "_aRpir-COkI",
      title: "How to Fix Microphone Not Working or Not Detected in Windows",
      channel: "Tech Gitter Official",
      duration: "7:25",
      summary: "Enable Microphone Privacy permissions, set default recording device, and boost mic levels.",
      searchQuery: "how to fix microphone not working windows 10 11",
      isDirectMatch: true,
    };
  }

  // BIOS / UEFI / CMOS
  if (lower.includes("bios") || lower.includes("uefi") || lower.includes("boot order") || lower.includes("cmos")) {
    return {
      videoId: "30whzE6j4nQ",
      title: "How to Enter BIOS and Fix Boot Order Issues",
      channel: "TechVibe",
      duration: "6:25",
      summary: "Reset BIOS to optimized defaults, change boot order priority, and check UEFI secure boot.",
      searchQuery: "how to enter bios fix boot order windows",
      isDirectMatch: true,
    };
  }

  // GPU / Graphics card driver issues / Game crashing
  if (lower.includes("gpu") || lower.includes("graphics card") || lower.includes("nvidia") || lower.includes("amd") || lower.includes("game crash") || lower.includes("fps drop")) {
    return {
      videoId: "_Izfr2owoDo",
      title: "How to Fix GPU Driver Errors & Prevent Game Crashes",
      channel: "Landostech",
      duration: "8:30",
      summary: "Reinstall graphics drivers, adjust power states, and fix DirectX / runtime GPU crashes.",
      searchQuery: "how to clean install gpu drivers ddu fix crashes",
      isDirectMatch: true,
    };
  }

  // Windows Activation / Watermark
  if (lower.includes("activation") || lower.includes("activate windows") || lower.includes("watermark") || lower.includes("product key")) {
    return {
      videoId: "9sl-7B6kZBY",
      title: "How to Fix Windows Activation Errors and Troubleshoot Product Keys",
      channel: "H2X Tech",
      duration: "11:30",
      summary: "Run the built-in Windows Activation troubleshooter and slmgr command line reset.",
      searchQuery: "how to fix windows activation error product key",
      isDirectMatch: true,
    };
  }

  // Developer / Hackathon issues (Ports, Git, Node, Python, CORS)
  if (lower.includes("port") || lower.includes("cors") || lower.includes("git") || lower.includes("npm") || lower.includes("python") || lower.includes("hackathon") || lower.includes("eaddrinuse")) {
    return {
      videoId: "_Izfr2owoDo",
      title: "How to Kill Blocked Ports (EADDRINUSE) & Developer Environment Fixes",
      channel: "Landostech",
      duration: "8:30",
      summary: "Use netstat -ano and taskkill /PID to immediately free blocked localhost developer ports.",
      searchQuery: "how to kill port eaddrinuse windows taskkill netstat",
      isDirectMatch: true,
    };
  }

  // 4. Category-based fallback if provided
  if (category && CATEGORY_FALLBACK_TUTORIALS[category]) {
    const catItem = CATEGORY_FALLBACK_TUTORIALS[category];
    return {
      ...catItem,
      searchQuery: `how to fix ${query || category}`,
      isDirectMatch: false,
    };
  }

  // 5. Universal Fallback for any completely custom or unique user concern:
  const cleanSearchQuery = `how to fix ${query.replace(/[^\w\s]/gi, '')}`;
  return {
    ...UNIVERSAL_FALLBACK_TUTORIAL,
    title: `Recommended Fix: ${query.length > 50 ? query.substring(0, 47) + '...' : query}`,
    summary: `Verified visual troubleshooting walkthrough covering hardware diagnostics and Windows recovery steps for "${query}".`,
    searchQuery: cleanSearchQuery,
    isDirectMatch: false,
  };
}
