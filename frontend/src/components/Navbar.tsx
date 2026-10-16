import React from 'react';
import { 
  Wrench, 
  Sparkles, 
  Terminal, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Settings as SettingsIcon,
  Home
} from 'lucide-react';
import { User, TroubleshootingMode } from '../types';

interface NavbarProps {
  currentView: 'home' | 'wizard' | 'dashboard' | 'knowledge' | 'settings' | 'cmd';
  setCurrentView: (view: 'home' | 'wizard' | 'dashboard' | 'knowledge' | 'settings' | 'cmd') => void;
  user: User | null;
  mode: TroubleshootingMode;
  onToggleMode: (newMode: TroubleshootingMode) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  user,
  mode,
  onToggleMode,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] py-2">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-[#334155] group-hover:scale-105 group-hover:border-[#2563EB] transition-all bg-[#151F32] flex items-center justify-center p-1 relative z-10">
                <img 
                  src="/logo.png" 
                  alt="TechResolve AI" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="absolute -inset-1 bg-[#2563EB]/25 rounded-xl blur-xs opacity-30 group-hover:opacity-60 transition" />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-[#F8FAFC] whitespace-nowrap">
                  TechResolve <span className="text-[#2563EB]">AI</span>
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#151F32] text-[#22D3EE] border border-[#334155] whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-[#22D3EE] shrink-0" />
                  <span>IT Assistant</span>
                </span>
              </div>
              <p className="text-[11px] leading-tight text-[#94A3B8] hidden sm:block font-medium whitespace-nowrap mt-0.5">
                Friendly solutions, step-by-step
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition whitespace-nowrap shrink-0 ${
                currentView === 'home'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition whitespace-nowrap shrink-0 ${
                currentView === 'dashboard'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentView('knowledge')}
              className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition whitespace-nowrap shrink-0 ${
                currentView === 'knowledge'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>IT Guides</span>
            </button>
            <button
              onClick={() => setCurrentView('cmd')}
              className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition whitespace-nowrap shrink-0 ${
                currentView === 'cmd'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span>CMD Helper</span>
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition whitespace-nowrap shrink-0 ${
                currentView === 'settings'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
              }`}
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Mode Switcher, AI Status & User Account */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            
            {/* Live AI Status Pill on larger screens */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#151F32] border border-[#334155] text-[11px] font-semibold text-[#4ADE80] whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse shrink-0"></span>
              <span className="whitespace-nowrap">AI Engine Active</span>
            </div>
            
            {/* Beginner vs Pro Mode Pill */}
            <div className="hidden sm:flex bg-[#0B1120] border border-[#334155] p-1 rounded-xl items-center text-xs font-medium shrink-0">
              <button
                onClick={() => onToggleMode('beginner')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === 'beginner'
                    ? 'bg-[#1E293B] text-[#22D3EE] shadow-xs font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
                title="Beginner Mode: Everyday English and simple steps"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
                <span className="whitespace-nowrap">Beginner</span>
              </button>
              <button
                onClick={() => onToggleMode('pro')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
                  mode === 'pro'
                    ? 'bg-[#1E293B] text-[#F8FAFC] shadow-xs font-semibold'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
                title="IT Professional Mode: CLI commands, sys logs, deep diagnostics"
              >
                <Terminal className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
                <span className="whitespace-nowrap">IT Pro</span>
              </button>
            </div>

            {/* Auth / Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#334155] shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#334155]" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs sm:text-sm font-semibold text-[#F8FAFC] max-w-[100px] truncate hidden sm:inline whitespace-nowrap">
                  {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F87171] hover:bg-[#F87171]/10 transition cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 px-3.5 lg:px-4 py-2 rounded-xl transition cursor-pointer shadow-sm hover:shadow-md hover:shadow-blue-500/20 shrink-0 whitespace-nowrap"
              >
                <UserIcon className="w-4 h-4 text-white shrink-0" />
                <span className="whitespace-nowrap">Sign In / Register</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Shown on phones < md) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav-bottom md:hidden flex items-center justify-around py-1.5 px-1.5 safe-area-pb shadow-[0_-8px_20px_rgba(0,0,0,0.4)]">
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
            currentView === 'home'
              ? 'text-[#22D3EE] font-bold bg-[#1E293B] shadow-2xs'
              : 'text-[#94A3B8] hover:text-[#CBD5E1]'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${currentView === 'home' ? 'text-[#22D3EE] stroke-[2.5]' : 'text-[#94A3B8]'}`} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('cmd')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
            currentView === 'cmd'
              ? 'text-[#22D3EE] font-bold bg-[#1E293B] shadow-2xs'
              : 'text-[#94A3B8] hover:text-[#CBD5E1]'
          }`}
        >
          <Terminal className={`w-5 h-5 mb-0.5 ${currentView === 'cmd' ? 'text-[#22D3EE] stroke-[2.5]' : 'text-[#94A3B8]'}`} />
          <span>CMD</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('knowledge')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
            currentView === 'knowledge'
              ? 'text-[#22D3EE] font-bold bg-[#1E293B] shadow-2xs'
              : 'text-[#94A3B8] hover:text-[#CBD5E1]'
          }`}
        >
          <BookOpen className={`w-5 h-5 mb-0.5 ${currentView === 'knowledge' ? 'text-[#22D3EE] stroke-[2.5]' : 'text-[#94A3B8]'}`} />
          <span>Guides</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
            currentView === 'dashboard'
              ? 'text-[#22D3EE] font-bold bg-[#1E293B] shadow-2xs'
              : 'text-[#94A3B8] hover:text-[#CBD5E1]'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-0.5 ${currentView === 'dashboard' ? 'text-[#22D3EE] stroke-[2.5]' : 'text-[#94A3B8]'}`} />
          <span>History</span>
        </button>

        {/* Mobile Dedicated Sign In or Profile Button */}
        {user ? (
          <button
            type="button"
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
              currentView === 'settings' ? 'text-[#22D3EE] font-bold bg-[#1E293B] shadow-2xs' : 'text-[#94A3B8] hover:text-[#CBD5E1]'
            }`}
          >
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-5 h-5 rounded-full object-cover mb-0.5 border border-[#334155]" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold mb-0.5">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="truncate max-w-[45px] text-[#F8FAFC]">{user.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-bold text-[#22D3EE] transition cursor-pointer hover:bg-[#1E293B]"
          >
            <div className="relative mb-0.5">
              <UserIcon className="w-5 h-5 text-[#22D3EE] stroke-[2.5]" />
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] absolute -top-0.5 -right-0.5 animate-pulse"></span>
            </div>
            <span className="font-bold text-[#22D3EE]">Sign In</span>
          </button>
        )}
      </nav>
    </header>
  );
};
