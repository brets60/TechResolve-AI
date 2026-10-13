import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Search, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight, 
  Battery,
  Wifi, 
  HardDrive, 
  Zap, 
  Cpu, 
  Printer, 
  Code2, 
  Info, 
  FileText, 
  X,
  Filter,
  CheckCircle2,
  AlertCircle,
  Folder,
  Lock,
  Power
} from 'lucide-react';
import type { CmdItem, CmdOutputTranslation, TroubleshootingMode } from '../types';
import { api } from '../api';

interface CmdHelperViewProps {
  mode: TroubleshootingMode;
  onStartProblemWithCommand: (problemTitle: string, category: string) => void;
}

interface CategoryMeta {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  description: string;
}

const CATEGORIES_CONFIG: Record<string, CategoryMeta> = {
  'Files & Navigation': {
    name: 'Files & Navigation',
    icon: Folder,
    color: 'text-amber-600',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    border: 'border-amber-200',
    description: 'Essential CMD navigation: list directory files (dir), open folders (cd), copy, move, rename, and delete.'
  },
  'Battery & Power': {
    name: 'Battery & Power',
    icon: Battery,
    color: 'text-yellow-600',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-700',
    border: 'border-yellow-200',
    description: 'Diagnose battery wear, generate battery reports, find sleep-blocking apps, and manage hibernation.'
  },
  'Internet & Network': {
    name: 'Internet & Network',
    icon: Wifi,
    color: 'text-sky-600',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    border: 'border-sky-200',
    description: 'Clear DNS cache, renew IP addresses, reveal saved Wi-Fi passwords, ping latency, and reset Winsock.'
  },
  'Windows Repair': {
    name: 'Windows Repair',
    icon: ShieldCheck,
    color: 'text-blue-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    border: 'border-blue-200',
    description: 'Scan & repair corrupt system files with SFC, restore images with DISM, check disk sectors, and Group Policy.'
  },
  'Storage & Disks': {
    name: 'Storage & Disks',
    icon: HardDrive,
    color: 'text-emerald-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    border: 'border-emerald-200',
    description: 'Inspect hard drive SMART health sensors, repair bad sectors, run SSD TRIM, and launch Disk Cleanup.'
  },
  'Performance & Apps': {
    name: 'Performance & Apps',
    icon: Zap,
    color: 'text-violet-600',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
    border: 'border-violet-200',
    description: 'List active tasks (tasklist), filter memory hogs, force-close frozen programs, and Resource Monitor.'
  },
  'Hardware & Specs': {
    name: 'Hardware & Specs',
    icon: Cpu,
    color: 'text-indigo-600',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    border: 'border-indigo-200',
    description: 'Retrieve PC serial number from BIOS, check CPU & RAM specs, list device drivers, and launch dxdiag.'
  },
  'Services & Background': {
    name: 'Services & Background',
    icon: Printer,
    color: 'text-teal-600',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    border: 'border-teal-200',
    description: 'Restart jammed Print Spooler queues, list running Windows services, and open Services Manager.'
  },
  'Security & Users': {
    name: 'Security & Users',
    icon: Lock,
    color: 'text-rose-600',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    border: 'border-rose-200',
    description: 'Audit user accounts, check administrator privileges (whoami), verify firewall shields, and wipe free space.'
  },
  'Developer & Ports': {
    name: 'Developer & Ports',
    icon: Code2,
    color: 'text-purple-600',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    border: 'border-purple-200',
    description: 'Find processes holding port 3000, inspect curl HTTP headers, locate executables (where), and clipboard pipe.'
  },
  'System & Power Control': {
    name: 'System & Power Control',
    icon: Power,
    color: 'text-red-600',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    border: 'border-red-200',
    description: 'Graceful PC shutdown, restart straight into BIOS/UEFI firmware, abort shutdown timers, and winver.'
  }
};

export const CmdHelperView: React.FC<CmdHelperViewProps> = ({
  mode,
  onStartProblemWithCommand,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'library' | 'simulator' | 'custom' | 'translator' | 'guide'>('library');

  // Command library state
  const [library, setLibrary] = useState<CmdItem[]>([]);
  const [searchLibrary, setSearchLibrary] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [adminFilter, setAdminFilter] = useState<'all' | 'safe' | 'admin'>('all');
  const [libraryLoading, setLibraryLoading] = useState(true);

  // Selected command for detail modal
  const [selectedCmdDetail, setSelectedCmdDetail] = useState<CmdItem | null>(null);

  // Custom command explainer state
  const [commandInput, setCommandInput] = useState('');
  const [analyzingCommand, setAnalyzingCommand] = useState(false);
  const [explainedCommand, setExplainedCommand] = useState<CmdItem | null>(null);

  // Output translator state
  const [outputCommand, setOutputCommand] = useState('sfc /scannow');
  const [outputText, setOutputText] = useState('');
  const [translatingOutput, setTranslatingOutput] = useState(false);
  const [outputTranslation, setOutputTranslation] = useState<CmdOutputTranslation | null>(null);

  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Simulator state
  const [simulatorCmd, setSimulatorCmd] = useState('powercfg /batteryreport');
  const [simulatorRunning, setSimulatorRunning] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<Array<{
    command: string;
    output: string;
    explanation?: {
      summary: string;
      meaning: string;
      action: string;
      status: 'success' | 'warning' | 'danger' | 'info';
    };
  }>>([
    {
      command: 'ver',
      output: 'Microsoft Windows [Version 10.0.22631.3296]\n(c) Microsoft Corporation. All rights reserved.\nInteractive Practice Sandbox Ready. Type any command or click a quick preset below.',
    }
  ]);

  // Handlers
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => {
      setCopiedCmd(null);
    }, 2000);
  };

  const handleExplainCommand = async (e?: React.FormEvent, overrideCmd?: string) => {
    if (e) e.preventDefault();
    const cmdToAnalyze = (overrideCmd || commandInput).trim();
    if (!cmdToAnalyze) return;
    setAnalyzingCommand(true);
    try {
      const data = await api.explainCmd(cmdToAnalyze);
      setExplainedCommand(data);
    } catch (err: any) {
      alert(err.message || 'Failed to explain command');
    } finally {
      setAnalyzingCommand(false);
    }
  };

  const handleTranslateOutput = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!outputText.trim()) return;
    setTranslatingOutput(true);
    try {
      const data = await api.translateCmdOutput(outputCommand, outputText);
      setOutputTranslation(data);
    } catch (err: any) {
      alert(err.message || 'Failed to translate output');
    } finally {
      setTranslatingOutput(false);
    }
  };

  const handleRunInSimulator = (targetCmd?: string) => {
    const cmdToRun = (targetCmd || simulatorCmd).trim();
    if (!cmdToRun) return;
    setSimulatorCmd(cmdToRun);
    setSimulatorRunning(true);
    setActiveTab('simulator');

    // Find known command in library
    const match = library.find(
      (c) => c.command.toLowerCase() === cmdToRun.toLowerCase() ||
             c.command.toLowerCase().startsWith(cmdToRun.toLowerCase().split(' ')[0])
    );

    setTimeout(() => {
      let output = '';
      let explanation: {
        summary: string;
        meaning: string;
        action: string;
        status: 'success' | 'warning' | 'danger' | 'info';
      } = {
        summary: 'Command Executed in Simulator',
        meaning: `Simulated execution of '${cmdToRun}'. In real Windows, this tests system health without altering your personal files.`,
        action: 'Review the output lines above to see what Windows reported.',
        status: 'info'
      };

      if (cmdToRun.includes('batteryreport')) {
        output = 'Battery life report saved to file path C:\\Users\\TechResolve\\battery-report.html.';
        explanation = {
          summary: 'Battery Health Report Created',
          meaning: 'Windows measured your laptop battery cells and exported an HTML file showing factory Design Capacity vs actual Full Charge capacity.',
          action: 'Open battery-report.html in Chrome or Edge to check wear percentage, or upload it to TechResolve AI for instant automated diagnosis.',
          status: 'success'
        };
      } else if (cmdToRun.includes('ping')) {
        output = 'Pinging 8.8.8.8 with 32 bytes of data:\nReply from 8.8.8.8: bytes=32 time=14ms TTL=117\nReply from 8.8.8.8: bytes=32 time=15ms TTL=117\nReply from 8.8.8.8: bytes=32 time=13ms TTL=117\nReply from 8.8.8.8: bytes=32 time=14ms TTL=117\n\nPing statistics for 8.8.8.8:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),\nApproximate round trip times in milli-seconds:\n    Minimum = 13ms, Maximum = 15ms, Average = 14ms';
        explanation = {
          summary: '0% Packet Loss — Internet Reachable',
          meaning: 'Your computer sent 4 test messages to Google DNS and received all 4 replies back in 14 milliseconds. Your network card and Wi-Fi router are communicating flawlessly.',
          action: 'If you still cannot browse websites, clear your DNS cache or check browser extensions.',
          status: 'success'
        };
      } else if (cmdToRun.includes('flushdns')) {
        output = 'Windows IP Configuration\n\nSuccessfully flushed the DNS Resolver Cache.';
        explanation = {
          summary: 'DNS Address Cache Cleared',
          meaning: 'All outdated and temporary website address translations in Windows memory have been erased. Next time you visit a website, Windows will query fresh DNS servers.',
          action: 'Refresh your browser or try loading previously unreachable websites now.',
          status: 'success'
        };
      } else if (cmdToRun.includes('sfc')) {
        output = 'Beginning system scan. This process will take some time.\n\nBeginning verification phase of system scan.\nVerification 100% complete.\n\nWindows Resource Protection found corrupt files and successfully repaired them.\nDetails are included in the CBS.Log windir\\Logs\\CBS\\CBS.log.';
        explanation = {
          summary: 'Corrupted System Files Successfully Repaired',
          meaning: 'Windows scanned its core system operating files, discovered corrupted files caused by updates or sudden power loss, and restored them from the clean component cache.',
          action: 'Restart your PC to finalize all repaired system files.',
          status: 'success'
        };
      } else if (cmdToRun.includes('wmic diskdrive')) {
        output = 'Status\nOK';
        explanation = {
          summary: 'Storage Drive Hardware Status: Healthy',
          meaning: 'Your SSD / hard drive S.M.A.R.T. internal self-monitoring chips report 100% normal mechanical and electrical health scores.',
          action: 'No hardware replacement needed! Computer slowness is caused by background apps or Windows settings.',
          status: 'success'
        };
      } else if (cmdToRun.includes('winsock reset')) {
        output = 'Successfully reset the Winsock Catalog.\nYou must restart the computer in order to complete the reset.';
        explanation = {
          summary: 'Winsock Network Catalog Reset',
          meaning: 'Corrupted socket layers and network pipeline filters (often damaged by buggy VPNs or aggressive antivirus) have been reset to factory defaults.',
          action: 'Restart your PC so the clean network stack takes effect.',
          status: 'success'
        };
      } else if (match?.expected_output) {
        output = match.expected_output;
        explanation = {
          summary: match.name,
          meaning: match.description,
          action: match.what_to_look_for || 'Check the output above for confirmation.',
          status: 'success'
        };
      } else {
        output = `Command '${cmdToRun}' simulated successfully.\nExecution completed with return code 0.`;
      }

      setTerminalHistory((prev) => [
        ...prev,
        {
          command: cmdToRun,
          output,
          explanation
        }
      ]);
      setSimulatorRunning(false);
    }, 400);
  };

  // Fetch command library once on mount
  useEffect(() => {
    let isMounted = true;
    api.getCmdLibrary().then((data) => {
      if (isMounted) {
        setLibrary(data);
        setLibraryLoading(false);
      }
    }).catch((err) => {
      console.error(err);
      if (isMounted) setLibraryLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  // Filter commands instantly in memory (0ms)
  const filteredLibrary = React.useMemo(() => {
    return library.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (adminFilter === 'safe' && item.requires_admin) return false;
      if (adminFilter === 'admin' && !item.requires_admin) return false;
      if (searchLibrary.trim()) {
        const q = searchLibrary.toLowerCase();
        return (
          item.command.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [library, selectedCategory, adminFilter, searchLibrary]);

  // Group commands by category instantly
  const groupedCategories = React.useMemo(() => {
    return Object.keys(CATEGORIES_CONFIG).reduce((acc, catName) => {
      const items = filteredLibrary.filter((c) => c.category === catName);
      if (items.length > 0) {
        acc[catName] = items;
      }
      return acc;
    }, {} as Record<string, CmdItem[]>);
  }, [filteredLibrary]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-left">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>Windows Command Prompt Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Organized CMD Commands & Translator
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Cleanly categorized safe Windows commands with everyday English explanations, safety ratings, and output translations.
        </p>
      </div>

      {/* Main Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'library'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Organized Command Library</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Practice Terminal Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'custom'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Explain Any Command</span>
        </button>

        <button
          onClick={() => setActiveTab('translator')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'translator'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Translate CMD Output</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'guide'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Beginner's Guide</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ORGANIZED COMMAND LIBRARY */}
      {/* ========================================================================= */}
      {activeTab === 'library' && (
        <div className="space-y-10">
          
          {/* Top Category Overview Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Command Categories
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select a category to view its essential diagnostic tools
                </p>
              </div>

              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Show All Categories ({library.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {Object.entries(CATEGORIES_CONFIG).map(([catKey, conf]) => {
                const Icon = conf.icon;
                const isSelected = selectedCategory === catKey;

                return (
                  <div
                    key={catKey}
                    onClick={() => setSelectedCategory(isSelected ? 'All' : catKey)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-9 h-9 rounded-xl ${conf.badgeBg} ${conf.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
                        {conf.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {conf.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLibrary}
                onChange={(e) => setSearchLibrary(e.target.value)}
                placeholder="Search commands, flags, or problems (e.g. battery, wifi, sfc)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-blue-600 bg-slate-50/50"
              />
              {searchLibrary && (
                <button
                  onClick={() => setSearchLibrary('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Permission Filter */}
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
              <button
                onClick={() => setAdminFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                  adminFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Permissions
              </button>
              <button
                onClick={() => setAdminFilter('safe')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                  adminFilter === 'safe'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                🟢 Safe (No Admin)
              </button>
              <button
                onClick={() => setAdminFilter('admin')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
                  adminFilter === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                🛡️ Needs Administrator
              </button>
            </div>

          </div>

          {/* Grouped Commands Presentation */}
          {libraryLoading ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              Loading categorized commands...
            </div>
          ) : Object.keys(groupedCategories).length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-base font-bold text-slate-700 mb-1">No commands matched your filters.</p>
              <p className="text-xs text-slate-500 mb-4">Try clearing your search query or selecting "All Permissions".</p>
              <button
                onClick={() => { setSearchLibrary(''); setSelectedCategory('All'); setAdminFilter('all'); }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedCategories).map(([categoryName, items]) => {
                const conf = CATEGORIES_CONFIG[categoryName];
                const Icon = conf?.icon || Terminal;

                return (
                  <div key={categoryName} className="space-y-4">
                    
                    {/* Category Section Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl ${conf?.badgeBg || 'bg-blue-50'} ${conf?.color || 'text-blue-600'} flex items-center justify-center`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                            {categoryName}
                          </h3>
                          <p className="text-xs text-slate-500 hidden sm:block">
                            {conf?.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {items.length} {items.length === 1 ? 'command' : 'commands'}
                      </span>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-400 hover:shadow-xs transition flex flex-col justify-between text-left group"
                        >
                          <div>
                            {/* Permission Badge */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                item.requires_admin
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {item.requires_admin ? '🛡️ Administrator' : '🟢 Standard User'}
                              </span>

                              <span className="text-[11px] font-medium text-slate-400">
                                {item.safety_level}
                              </span>
                            </div>

                            {/* Command Name */}
                            <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition">
                              {item.name}
                            </h4>

                            {/* Description */}
                            <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>

                            {/* Friendly Command Box */}
                            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 font-mono text-xs flex items-center justify-between mb-4 select-all shadow-2xs">
                              <span className="text-blue-950 font-bold truncate mr-2">{item.command}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(item.command)}
                                className="text-blue-600 hover:text-blue-800 bg-white border border-blue-200 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] shrink-0 cursor-pointer shadow-2xs font-sans font-semibold transition"
                                title="Copy command"
                              >
                                {copiedCmd === item.command ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-600" />}
                                <span>{copiedCmd === item.command ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                            <button
                              type="button"
                              onClick={() => setSelectedCmdDetail(item)}
                              className="font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <span>Breakdown</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRunInSimulator(item.command)}
                              className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer flex items-center gap-1"
                              title="Test this command in the simulated terminal"
                            >
                              <span>▶ Sandbox</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onStartProblemWithCommand(item.name, item.category)}
                              className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                            >
                              Guide Me →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: INTERACTIVE PRACTICE TERMINAL SANDBOX */}
      {/* ========================================================================= */}
      {activeTab === 'simulator' && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
                  &gt;_
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Interactive Windows Terminal Sandbox
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Safely simulate and practice running Windows CMD commands without any risk to your computer.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTerminalHistory([
                    {
                      command: 'cls',
                      output: 'Microsoft Windows [Version 10.0.22631.3296]\n(c) Microsoft Corporation. All rights reserved.\nTerminal screen cleared.',
                    }
                  ])}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Clear Terminal
                </button>
              </div>
            </div>

            {/* Quick Practice Buttons */}
            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Quick One-Click Simulations:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '🔋 Battery Health Report', cmd: 'powercfg /batteryreport' },
                  { label: '🌐 Ping Test (Internet)', cmd: 'ping 8.8.8.8' },
                  { label: '🧹 Flush DNS Cache', cmd: 'ipconfig /flushdns' },
                  { label: '🛡️ SFC System File Scan', cmd: 'sfc /scannow' },
                  { label: '💾 Storage SMART Health', cmd: 'wmic diskdrive get status' },
                  { label: '🔄 Winsock Reset', cmd: 'netsh winsock reset' },
                  { label: '📊 System Info', cmd: 'systeminfo' },
                  { label: '🔍 Active Network Ports', cmd: 'netstat -ano' },
                ].map((item) => (
                  <button
                    key={item.cmd}
                    type="button"
                    onClick={() => handleRunInSimulator(item.cmd)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-medium text-slate-700 hover:text-blue-700 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {item.cmd.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Terminal Window - Friendly Light Style */}
            <div className="rounded-3xl overflow-hidden border-2 border-blue-100 bg-white shadow-md text-slate-800 font-mono text-xs sm:text-sm">
              {/* Window Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-5 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-white text-xs font-sans font-bold ml-2">Command Prompt Practice Sandbox</span>
                </div>
                <span className="text-[11px] font-sans font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  🟢 100% Safe Simulation
                </span>
              </div>

              {/* Terminal Body */}
              <div className="p-4 sm:p-6 space-y-4 max-h-[380px] overflow-y-auto leading-relaxed bg-slate-50/70 border-b border-slate-200">
                {terminalHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    {item.command && (
                      <div className="text-blue-900 font-bold flex items-center gap-2">
                        <span className="text-blue-500 font-mono">C:\Users\TechResolve&gt;</span>
                        <span className="text-blue-900">{item.command}</span>
                      </div>
                    )}
                    <pre className="text-slate-800 whitespace-pre-wrap font-mono text-xs pl-3 py-2 bg-white rounded-xl border border-blue-100 shadow-2xs">
                      {item.output}
                    </pre>

                    {item.explanation && (
                      <div className="mt-3 p-4 rounded-2xl bg-white border border-blue-200/80 font-sans text-xs sm:text-sm text-left shadow-2xs">
                        <div className="flex items-center gap-2 mb-1.5 font-bold text-blue-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{item.explanation.summary}</span>
                        </div>
                        <p className="text-slate-600 text-xs mb-2 leading-relaxed">
                          {item.explanation.meaning}
                        </p>
                        <div className="text-[11px] text-blue-800 font-semibold bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                          <strong>💡 What this tells us: </strong> {item.explanation.action}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {simulatorRunning && (
                  <div className="flex items-center gap-2 text-blue-600 animate-pulse text-xs font-semibold">
                    <span className="text-blue-400">C:\Users\TechResolve&gt;</span>
                    <span>Running {simulatorCmd}...</span>
                  </div>
                )}
              </div>

              {/* Terminal Interactive Input */}
              <div className="bg-white p-3.5 sm:p-4 flex items-center gap-2">
                <span className="text-blue-600 font-bold font-mono text-xs shrink-0">C:\Users\TechResolve&gt;</span>
                <input
                  type="text"
                  value={simulatorCmd}
                  onChange={(e) => setSimulatorCmd(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRunInSimulator();
                    }
                  }}
                  placeholder="Type a command (e.g. sfc /scannow, ping 8.8.8.8) and press Enter..."
                  className="flex-1 bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs sm:text-sm outline-none focus:border-blue-500 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => handleRunInSimulator()}
                  disabled={simulatorRunning || !simulatorCmd.trim()}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {simulatorRunning ? 'Running...' : 'Run in Sandbox'}
                </button>
              </div>
            </div>

            {/* Beginner reassurance note */}
            <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Safe Practice Guarantee: </strong> 
                This practice terminal runs in a sandboxed simulator in your browser. None of these commands modify your real system files. When you are ready to run them for real on your PC, you can copy the command and paste it into real Command Prompt.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EXPLAIN ANY CUSTOM COMMAND */}
      {/* ========================================================================= */}
      {activeTab === 'custom' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Explain Any Windows Command
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Type or paste any command to inspect safety, administrator needs, and flag meanings.
                </p>
              </div>
            </div>

            <form onSubmit={handleExplainCommand} className="my-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="e.g. chkdsk C: /f or powercfg /energy or netstat -ano"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-blue-600"
                />
                <button
                  type="submit"
                  disabled={analyzingCommand || !commandInput.trim()}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  {analyzingCommand ? 'Analyzing...' : 'Explain'}
                </button>
              </div>
            </form>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              <span className="text-xs text-slate-400 self-center mr-1">Popular tests:</span>
              {[
                'powercfg /batteryreport',
                'sfc /scannow',
                'netsh winsock reset',
                'ipconfig /flushdns',
                'wmic diskdrive get status',
                'wmic bios get serialnumber'
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setCommandInput(sample);
                    handleExplainCommand(undefined, sample);
                  }}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition"
                >
                  {sample}
                </button>
              ))}
            </div>

            {/* Results Card */}
            {explainedCommand && (
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    explainedCommand.safety_badge === 'danger'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : explainedCommand.safety_badge === 'moderate'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {explainedCommand.safety_level}
                  </span>

                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    explainedCommand.requires_admin
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {explainedCommand.requires_admin ? '🛡️ Administrator Required' : '🟢 Standard User (No Admin)'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {explainedCommand.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {explainedCommand.description}
                </p>

                {/* Command copy box */}
                <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/90 text-blue-950 font-mono text-sm flex items-center justify-between mb-4 shadow-xs">
                  <span className="text-blue-950 select-all font-bold tracking-tight mr-2">{explainedCommand.command}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(explainedCommand.command)}
                    className="text-blue-700 hover:text-blue-900 bg-white/90 hover:bg-white px-2.5 py-1 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 shadow-2xs cursor-pointer"
                  >
                    {copiedCmd === explainedCommand.command ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
                    <span>{copiedCmd === explainedCommand.command ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Flags Breakdown */}
                {explainedCommand.flags_explanation && explainedCommand.flags_explanation.length > 0 && (
                  <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm">
                    <span className="font-bold text-slate-800 block mb-2">What Each Word / Flag Means:</span>
                    <div className="space-y-1.5">
                      {explainedCommand.flags_explanation.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-700">
                          <span className="font-mono font-bold text-blue-700 shrink-0">{f.flag}:</span>
                          <span>{f.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expected output */}
                <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
                  <span className="font-bold block mb-1">Expected Output:</span>
                  <p className="italic text-slate-600">{explainedCommand.expected_output}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onStartProblemWithCommand(explainedCommand.name, explainedCommand.category)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Guide Me Step-by-Step in Troubleshooting Wizard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMMAND OUTPUT TRANSLATOR */}
      {/* ========================================================================= */}
      {activeTab === 'translator' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Translate Command Prompt Output
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Paste the text or error messages you got from CMD to understand what happened.
                </p>
              </div>
            </div>

            <form onSubmit={handleTranslateOutput} className="my-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Which command did you run?
                </label>
                <input
                  type="text"
                  value={outputCommand}
                  onChange={(e) => setOutputCommand(e.target.value)}
                  placeholder="e.g. sfc /scannow or ping 8.8.8.8"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Paste the CMD output text:
                </label>
                <textarea
                  rows={5}
                  value={outputText}
                  onChange={(e) => setOutputText(e.target.value)}
                  placeholder="Paste the output text from the Command Prompt window here..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-blue-600 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={translatingOutput || !outputText.trim()}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm transition cursor-pointer"
              >
                {translatingOutput ? 'Analyzing Output...' : 'Translate Output Into Plain English'}
              </button>
            </form>

            {/* Translation Output Card */}
            {outputTranslation && (
              <div className={`p-5 rounded-2xl border text-left ${
                outputTranslation.status === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : outputTranslation.status === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : outputTranslation.status === 'danger' || outputTranslation.status === 'error'
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : 'bg-blue-50 border-blue-200 text-blue-950'
              }`}>
                <h4 className="font-bold text-base mb-1.5 flex items-center gap-2">
                  <span>{outputTranslation.summary}</span>
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed mb-4">
                  {outputTranslation.plain_english_meaning}
                </p>
                <div className="pt-3 border-t border-slate-200/50 text-xs font-semibold">
                  <span className="font-bold">Next Action: </span>
                  <span>{outputTranslation.recommended_next_step}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HOW TO OPEN CMD BEGINNER GUIDE */}
      {/* ========================================================================= */}
      {activeTab === 'guide' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              <span>Beginner's Guide: Opening & Using Command Prompt</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Command Prompt is a built-in Windows tool that lets you talk to your computer with text. Here is how to use it safely.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 mb-8">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md mb-2 inline-block">
                  Standard User Mode
                </span>
                <h3 className="font-bold text-slate-900 text-base mb-2">For Safe Read-Only Checks</h3>
                <ol className="space-y-2 list-decimal list-inside text-xs sm:text-sm text-slate-600">
                  <li>Press the <strong>Windows Key</strong> on your keyboard.</li>
                  <li>Type the letters <code className="bg-slate-200 px-1 rounded font-bold text-slate-800">cmd</code></li>
                  <li>Press <strong>Enter</strong>. A black window will open.</li>
                  <li>You can now type or paste any standard command!</li>
                </ol>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md mb-2 inline-block">
                  Administrator Mode
                </span>
                <h3 className="font-bold text-slate-900 text-base mb-2">For System Repairs (SFC, DISM, Chkdsk)</h3>
                <ol className="space-y-2 list-decimal list-inside text-xs sm:text-sm text-slate-600">
                  <li>Press the <strong>Windows Key</strong> on your keyboard.</li>
                  <li>Type <code className="bg-blue-100 px-1 rounded font-bold text-blue-900">cmd</code></li>
                  <li><strong>Right-click</strong> 'Command Prompt' and select <strong>'Run as administrator'</strong>.</li>
                  <li>Click <strong>'Yes'</strong> when Windows asks for permission.</li>
                </ol>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 text-xs sm:text-sm text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-800 block">💡 Tips For Pasting Commands:</span>
              <p>• You don't have to re-type long commands. Just click the <strong>Copy</strong> button on any card above.</p>
              <p>• Inside the Command Prompt window, simply press <kbd className="bg-white border border-slate-300 px-1.5 py-0.5 rounded text-xs font-semibold">Ctrl</kbd> + <kbd className="bg-white border border-slate-300 px-1.5 py-0.5 rounded text-xs font-semibold">V</kbd> or right-click your mouse to paste instantly.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMMAND DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedCmdDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCmdDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {selectedCmdDetail.category}
              </span>

              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                selectedCmdDetail.requires_admin
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {selectedCmdDetail.requires_admin ? '🛡️ Administrator Required' : '🟢 Standard User'}
              </span>

              <span className="text-xs text-slate-500 font-medium">
                {selectedCmdDetail.safety_level}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
              {selectedCmdDetail.name}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              {selectedCmdDetail.description}
            </p>

            {/* Command Box */}
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/90 text-blue-950 font-mono text-sm flex items-center justify-between mb-6 shadow-xs">
              <span className="text-blue-950 font-bold truncate mr-2">{selectedCmdDetail.command}</span>
              <button
                type="button"
                onClick={() => handleCopy(selectedCmdDetail.command)}
                className="text-blue-700 hover:text-blue-900 bg-white/90 hover:bg-white px-2.5 py-1 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer shadow-2xs"
              >
                {copiedCmd === selectedCmdDetail.command ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
                <span>{copiedCmd === selectedCmdDetail.command ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Flag breakdown */}
            {selectedCmdDetail.flags_explanation && selectedCmdDetail.flags_explanation.length > 0 && (
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm">
                <span className="font-bold text-slate-800 block mb-2">Parameter / Flag Breakdown:</span>
                <div className="space-y-1.5">
                  {selectedCmdDetail.flags_explanation.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-700">
                      <span className="font-mono font-bold text-blue-700 shrink-0">{f.flag}:</span>
                      <span>{f.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Output */}
            <div className="mb-6">
              <span className="font-bold text-slate-900 text-xs sm:text-sm block mb-1">
                Expected Output in Command Prompt:
              </span>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono text-slate-700 whitespace-pre-line">
                {selectedCmdDetail.expected_output}
              </div>
            </div>

            {/* What to look for */}
            {selectedCmdDetail.what_to_look_for && (
              <div className="mb-6 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-blue-900 block mb-0.5">What to Look For:</span>
                {selectedCmdDetail.what_to_look_for}
              </div>
            )}

            {/* How to run steps */}
            {selectedCmdDetail.how_to_run_steps && selectedCmdDetail.how_to_run_steps.length > 0 && (
              <div className="mb-6">
                <span className="font-bold text-slate-900 text-xs sm:text-sm block mb-2">
                  How To Run This Safely:
                </span>
                <div className="space-y-1 text-xs sm:text-sm text-slate-600">
                  {selectedCmdDetail.how_to_run_steps.map((step, idx) => (
                    <div key={idx}>{step}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedCmdDetail(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const cmd = selectedCmdDetail;
                  setSelectedCmdDetail(null);
                  handleRunInSimulator(cmd.command);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs sm:text-sm hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>▶ Test in Sandbox</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const cmd = selectedCmdDetail;
                  setSelectedCmdDetail(null);
                  onStartProblemWithCommand(cmd.name, cmd.category);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Launch in Troubleshooting Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
