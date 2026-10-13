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
  BatteryCharging,
  Terminal,
  Zap,
  User as UserIcon
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

  const categories = [
    {
      title: '⚡ Hackathon Survival & Dev Skills',
      description: 'Emergency demo crash, port in use (3000/8000), CORS block, git merge panic',
      icon: Zap,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400',
      defaultProblem: 'Hackathon emergency: port already in use or demo crashed before pitch.',
    },
    {
      title: 'My Laptop or Computer',
      description: 'Power, battery, sudden shutdowns, loud fans, or slow boot',
      icon: Laptop,
      color: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400',
      defaultProblem: 'My laptop turns off when I unplug the charger.',
    },
    {
      title: 'My Internet Is Not Working',
      description: 'Wi-Fi drops, connected but no internet, slow browsing',
      icon: Wifi,
      color: 'bg-sky-50 text-sky-600 border-sky-200 hover:border-sky-400',
      defaultProblem: 'My Wi-Fi is connected but there is no internet.',
    },
    {
      title: 'My Software Is Not Working',
      description: 'Apps freezing, won’t open, crashing, or installation errors',
      icon: AppWindow,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-400',
      defaultProblem: 'My application will not open.',
    },
    {
      title: 'My Printer or Device',
      description: 'Printer offline, USB device not detected, Bluetooth issues',
      icon: Printer,
      color: 'bg-teal-50 text-teal-600 border-teal-200 hover:border-teal-400',
      defaultProblem: 'My printer shows offline and will not print.',
    },
    {
      title: 'I Have a Programming Error',
      description: 'Port already in use, database connection refused, runtime bugs',
      icon: Code2,
      color: 'bg-violet-50 text-violet-600 border-violet-200 hover:border-violet-400',
      defaultProblem: 'Programming error: address or port already in use.',
    },
    {
      title: 'Something Else Is Wrong',
      description: 'Audio issues, screen glitches, Windows errors, or unknown problems',
      icon: HelpCircle,
      color: 'bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400',
      defaultProblem: 'My computer is experiencing an unexpected issue.',
    },
  ];

  const popularProblems = [
    {
      title: 'Hackathon emergency: Port in use or app crashed before pitch.',
      category: '⚡ Hackathon Survival & Dev Skills',
      badge: 'Hackathon ⚡',
    },
    {
      title: 'My laptop suddenly turns off.',
      category: 'My Laptop or Computer',
      badge: 'Power & Battery',
    },
    {
      title: 'My battery drains quickly.',
      category: 'My Laptop or Computer',
      badge: 'Battery Health',
    },
    {
      title: 'My computer is very slow.',
      category: 'My Laptop or Computer',
      badge: 'Performance',
    },
    {
      title: 'My Wi-Fi is connected but there is no internet.',
      category: 'My Internet Is Not Working',
      badge: 'Network',
    },
    {
      title: 'My application will not open.',
      category: 'My Software Is Not Working',
      badge: 'Software',
    },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onStartProblem(customInput.trim(), 'General');
  };

  return (
    <div className="py-8 sm:py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center px-4">
        
        {/* Friendly Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-medium mb-6 shadow-2xs">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Patient IT Guidance For Everyone • No Tech Jargon</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight mb-4">
          Let's Fix Your Tech Problem Together.
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          Tell us what's wrong with your device. We'll help you understand the problem and guide you through the solution one step at a time.
        </p>

        {/* Prominent Sign In Banner for Guests */}
        {!user && onOpenAuth && (
          <div className="max-w-2xl mx-auto mb-8 p-3.5 sm:p-4 rounded-2xl bg-white border border-blue-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
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
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <UserIcon className="w-4 h-4" />
              <span>Log In / Register</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Synced User Pill */}
        {user && (
          <div className="max-w-2xl mx-auto mb-6 p-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-2 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Signed in as <strong>{user.name}</strong> ({user.email})</span>
            </div>
            <span className="font-bold text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
              Sessions Synced ✓
            </span>
          </div>
        )}

        {/* Direct Problem Input Form */}
        <form onSubmit={handleCustomSubmit} className="max-w-2xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-sm border border-slate-200 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-100 transition">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="E.g., My laptop turns off when I unplug the charger..."
              className="flex-1 px-4 py-3 text-slate-800 placeholder-slate-400 text-sm sm:text-base outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow transition"
            >
              <span>Start Troubleshooting</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Reassurance Features */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 mb-12">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>One question at a time</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>100% safe tests only</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Go back or ask anytime</span>
          </div>
        </div>

      </div>

      {/* Category Cards Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="text-center sm:text-left mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Choose What Needs Help
          </h2>
          <p className="text-sm text-slate-500">
            Click any category below to begin targeted guidance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => onStartProblem(cat.defaultProblem, cat.title)}
                className="flex flex-col text-left p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-md hover:border-blue-400 transition group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${cat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 group-hover:text-blue-600 transition">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed flex-1">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Start diagnosis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Problems Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Popular Problems
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Click any common issue to jump straight into the wizard
              </p>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              Quick Launch
            </span>
          </div>

          <div className="space-y-3">
            {popularProblems.map((prob, idx) => (
              <button
                key={idx}
                onClick={() => onStartProblem(prob.title, prob.category)}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-125 transition-transform" />
                  <span className="text-sm sm:text-base font-medium text-slate-800 group-hover:text-blue-700">
                    {prob.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                    {prob.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Command Prompt Assistant Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-xs">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Need Help with a Windows Command Prompt?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Browse 101 safe Windows tools, test in the Practice Sandbox, or translate confusing error messages into simple English.
              </p>
            </div>
          </div>
          {onOpenCmdHelper && (
            <button
              onClick={onOpenCmdHelper}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
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
