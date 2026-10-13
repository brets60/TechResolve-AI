import React, { useState } from 'react';
import { 
  Laptop, 
  Wifi, 
  AppWindow, 
  Printer, 
  Code2, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Terminal,
  Zap,
  User as UserIcon,
  Volume2,
  Monitor,
  HardDrive,
  ShieldAlert
} from 'lucide-react';
import type { TroubleshootingMode, User } from '../types';

interface HomeViewProps {
  onStartProblem: (problem: string, category: string) => void;
  onOpenCmdHelper?: () => void;
  mode: TroubleshootingMode;
  user?: User | null;
  onOpenAuth?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onStartProblem, 
  onOpenCmdHelper, 
  mode,
  user,
  onOpenAuth
}) => {
  const [customInput, setCustomInput] = useState('');

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: '☀️' };
    if (hour < 18) return { text: 'Good afternoon', icon: '🌤️' };
    return { text: 'Good evening', icon: '✨' };
  };
  const greeting = getGreeting();

  const categories = [
    {
      title: '⚡ Hackathon Survival & Dev Skills',
      description: 'Emergency demo crash, port 3000/8000 in use, CORS errors, git merge conflicts',
      icon: Zap,
      badge: 'Hackathon ⚡',
      color: 'bg-amber-50 text-amber-600 border-amber-200/80',
      badgeBg: 'bg-amber-100/80 text-amber-800',
      defaultProblem: 'Hackathon emergency: port already in use or demo crashed before pitch.',
    },
    {
      title: 'Laptop & Computer Hardware',
      description: 'Battery dies unplugged, loud fans, overheating, sudden shutdowns, blue screens',
      icon: Laptop,
      badge: 'Hardware & Power',
      color: 'bg-blue-50 text-blue-600 border-blue-200/80',
      badgeBg: 'bg-blue-100/80 text-blue-800',
      defaultProblem: 'My laptop turns off when I unplug the charger.',
    },
    {
      title: 'Internet & Wi-Fi Network',
      description: 'Connected but no internet, Wi-Fi drops, DNS errors, slow browsing, phone hotspot',
      icon: Wifi,
      badge: 'Network',
      color: 'bg-sky-50 text-sky-600 border-sky-200/80',
      badgeBg: 'bg-sky-100/80 text-sky-800',
      defaultProblem: 'My Wi-Fi is connected but there is no internet.',
    },
    {
      title: 'Audio, Sound & Microphones',
      description: 'No sound from speakers, mic muted in Zoom/Teams/Discord, headphone crackling',
      icon: Volume2,
      badge: 'Audio & Mic',
      color: 'bg-purple-50 text-purple-600 border-purple-200/80',
      badgeBg: 'bg-purple-100/80 text-purple-800',
      defaultProblem: 'No sound coming out of speakers or microphone is muted in video calls.',
    },
    {
      title: 'Displays & Multiple Monitors',
      description: 'Second screen not detected, black monitor screen, wrong resolution, flickering',
      icon: Monitor,
      badge: 'Displays',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
      badgeBg: 'bg-indigo-100/80 text-indigo-800',
      defaultProblem: 'Second monitor or external screen is not detected by Windows.',
    },
    {
      title: 'Software, Apps & Windows Updates',
      description: 'Apps freezing, won’t open, Windows Update stuck at 100%, background app crashes',
      icon: AppWindow,
      badge: 'Applications',
      color: 'bg-violet-50 text-violet-600 border-violet-200/80',
      badgeBg: 'bg-violet-100/80 text-violet-800',
      defaultProblem: 'My application will not open or freezes on launch.',
    },
    {
      title: 'Storage, Full Disks & USB Drives',
      description: 'Drive C: completely full, USB flash drive not recognized, freeing 20+ GB safely',
      icon: HardDrive,
      badge: 'Storage & USB',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      badgeBg: 'bg-emerald-100/80 text-emerald-800',
      defaultProblem: 'My C: drive is completely full and I need to free up disk space safely.',
    },
    {
      title: 'Printers, Bluetooth & Peripherals',
      description: 'Printer offline, Bluetooth device won’t pair, keyboard typing wrong characters',
      icon: Printer,
      badge: 'Peripherals',
      color: 'bg-teal-50 text-teal-600 border-teal-200/80',
      badgeBg: 'bg-teal-100/80 text-teal-800',
      defaultProblem: 'My printer shows offline and will not print.',
    },
    {
      title: 'Security, Popups & Account Login',
      description: 'Scam virus popups, browser adware, forgot Windows PIN/password, account recovery',
      icon: ShieldAlert,
      badge: 'Security & PIN',
      color: 'bg-rose-50 text-rose-600 border-rose-200/80',
      badgeBg: 'bg-rose-100/80 text-rose-800',
      defaultProblem: 'Suspicious browser popups or forgot Windows PIN/password.',
    },
  ];

  const popularProblems = [
    {
      title: 'Hackathon emergency: Port 3000 in use or app crashed before pitch.',
      category: '⚡ Hackathon Survival & Dev Skills',
      badge: 'Hackathon ⚡',
    },
    {
      title: 'My laptop turns off immediately when I unplug the charger.',
      category: 'Laptop & Computer Hardware',
      badge: 'Battery Health',
    },
    {
      title: 'Wi-Fi shows connected but there is no internet access.',
      category: 'Internet & Wi-Fi Network',
      badge: 'Network',
    },
    {
      title: 'Microphone is muted or not picking up sound in Zoom/Teams.',
      category: 'Audio, Sound & Microphones',
      badge: 'Microphone',
    },
    {
      title: 'Second monitor or external TV is not detected by laptop.',
      category: 'Displays & Multiple Monitors',
      badge: 'Dual Screens',
    },
    {
      title: 'Drive C: is completely full — how to safely free 20+ GB.',
      category: 'Storage, Full Disks & USB Drives',
      badge: 'Free Disk Space',
    },
  ];

  const quickPicks = [
    { text: '⚡ Port 3000 In Use / Demo Crash', prob: 'Hackathon emergency: port already in use or demo crashed before pitch.', cat: '⚡ Hackathon Survival & Dev Skills' },
    { text: '🔋 Laptop Shuts Down Unplugged', prob: 'Laptop turns off immediately when unplugged', cat: 'Laptop & Computer Hardware' },
    { text: '📶 Wi-Fi Has No Internet', prob: 'Wi-Fi connected but no internet access', cat: 'Internet & Wi-Fi Network' },
    { text: '🔇 Zoom / Teams Mic Muted', prob: 'Microphone not working or muted in Zoom, Teams & Discord', cat: 'Audio, Sound & Microphones' },
    { text: '📺 Second Monitor Not Detected', prob: 'Second monitor or external screen not detected', cat: 'Displays & Multiple Monitors' },
    { text: '💾 Drive C: Completely Full', prob: 'Drive C: completely full — safe ways to free disk space', cat: 'Storage, Full Disks & USB Drives' },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onStartProblem(customInput.trim(), 'General');
  };

  return (
    <div className="py-6 sm:py-10">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center px-4">
        
        {/* Lively Greeting Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold mb-5 shadow-2xs">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>{greeting.icon} {greeting.text} • Patient IT Co-pilot Ready</span>
        </div>

        {/* Lively Headline with Modern Gradient */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
          <span className="text-slate-900">Let's Fix Your </span>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">Tech Problem</span>
          <span className="text-slate-900"> Together.</span>
        </h1>

        {/* Reassuring Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          Tell us what's happening with your device or code. We explain everything in simple terms and guide you step-by-step to a working fix.
        </p>

        {/* Prominent Sign In Banner for Guests */}
        {!user && onOpenAuth && (
          <div className="max-w-2xl mx-auto mb-7 p-3.5 sm:p-4 rounded-2xl glass-panel border border-blue-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Save Your Troubleshooting Progress
                </h3>
                <p className="text-xs text-slate-500">
                  Sign in or register with Google or a One-Time Code
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
            >
              <UserIcon className="w-4 h-4" />
              <span>Log In / Register</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Synced User Pill */}
        {user && (
          <div className="max-w-2xl mx-auto mb-6 p-2.5 px-4 rounded-xl glass-panel border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-2 text-left shadow-2xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">Signed in as <strong>{user.name}</strong> ({user.email})</span>
            </div>
            <span className="font-bold text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md shrink-0">
              Synced ✓
            </span>
          </div>
        )}

        {/* Tactile Search & Diagnostic Input */}
        <form onSubmit={handleCustomSubmit} className="max-w-2xl mx-auto mb-4">
          <div className="glass-panel p-2 rounded-2xl shadow-lg shadow-blue-500/5 border border-white/90 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center pl-3">
              <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mr-2.5" />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Describe your issue: e.g. 'Laptop shuts down unplugged'..."
                className="w-full py-3 text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none bg-transparent font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shrink-0"
            >
              <span>Start AI Fix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick-Pick Problem Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-slate-400 mr-1">Quick Picks:</span>
          {quickPicks.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onStartProblem(chip.prob, chip.cat)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/90 hover:border-blue-300 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              {chip.text}
            </button>
          ))}
        </div>

      </div>

      {/* Live AI Health & Confidence Ticker */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Gemini AI Active
              </div>
              <div className="text-[11px] text-slate-500">Live smart diagnosis</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">21 Master Guides</div>
              <div className="text-[11px] text-slate-500">Comprehensive IT library</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">100% Safe Steps</div>
              <div className="text-[11px] text-slate-500">Zero data or file risk</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Patient Pace</div>
              <div className="text-[11px] text-slate-500">One question at a time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="text-center sm:text-left mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Specialized Categories</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Choose What Needs Help
          </h2>
          <p className="text-sm text-slate-500">
            Click any category to launch intelligent step-by-step guidance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => onStartProblem(cat.defaultProblem, cat.title)}
                className="flex flex-col text-left p-6 glass-panel rounded-2xl card-hover-lift border border-slate-200/90 hover:border-blue-400 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cat.color} group-hover:scale-110 transition-transform shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cat.badgeBg}`}>
                    {cat.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1.5 group-hover:text-blue-600 transition leading-snug">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed flex-1 mb-4">
                  {cat.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Start diagnosis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Problems Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-1">
                <span>Top User Concerns</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Frequently Asked IT Problems
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Tap any common issue to jump straight into the guided diagnostic wizard
              </p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
              Instant Launch
            </span>
          </div>

          <div className="space-y-3">
            {popularProblems.map((prob, idx) => (
              <button
                key={idx}
                onClick={() => onStartProblem(prob.title, prob.category)}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-white/70 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-2xs transition text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 group-hover:scale-125 transition-transform shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-blue-700">
                    {prob.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                    {prob.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Command Prompt Assistant Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Need Help with Windows Command Prompt?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                Browse 101 safe Windows tools, practice risk-free in the CMD Sandbox, or translate cryptic terminal outputs into plain English.
              </p>
            </div>
          </div>
          {onOpenCmdHelper && (
            <button
              onClick={onOpenCmdHelper}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition shrink-0 cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Explore CMD Helper</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
