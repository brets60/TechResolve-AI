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
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-200/90 group-hover:scale-105 group-hover:shadow-md transition-all bg-white flex items-center justify-center p-0.5 relative z-10">
                <img 
                  src="/logo.png" 
                  alt="TechResolve AI" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-xs opacity-25 group-hover:opacity-50 transition" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                  TechResolve <span className="text-blue-600">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span>IT Assistant</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Friendly solutions, step-by-step
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                currentView === 'home'
                  ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                currentView === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('knowledge')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                currentView === 'knowledge'
                  ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              IT Guides
            </button>
            <button
              onClick={() => setCurrentView('cmd')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                currentView === 'cmd'
                  ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Terminal className="w-4 h-4" />
              CMD Helper
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                currentView === 'settings'
                  ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </button>
          </nav>

          {/* Mode Switcher, AI Status & User Account */}
          <div className="flex items-center gap-3">
            
            {/* Live AI Status Pill on larger screens */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/70 text-[11px] font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>AI Engine Active</span>
            </div>
            
            {/* Beginner vs Pro Mode Pill (Hidden on mobile to keep Sign In ultra prominent) */}
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl items-center text-xs font-medium">
              <button
                onClick={() => onToggleMode('beginner')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition ${
                  mode === 'beginner'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Beginner Mode: Everyday English and simple steps"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden sm:inline">Beginner</span>
              </button>
              <button
                onClick={() => onToggleMode('pro')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition ${
                  mode === 'pro'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="IT Professional Mode: CLI commands, sys logs, deep diagnostics"
              >
                <Terminal className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">IT Pro</span>
              </button>
            </div>

            {/* Auth / Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs sm:text-sm font-semibold text-slate-700 max-w-[100px] truncate hidden sm:inline">
                  {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 px-4 py-2 rounded-xl transition cursor-pointer shadow-sm hover:shadow-md hover:shadow-blue-500/20 shrink-0"
              >
                <UserIcon className="w-4 h-4 text-white" />
                <span>Sign In / Register</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Shown on phones < md) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav-bottom md:hidden flex items-center justify-around py-1.5 px-1.5 safe-area-pb shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
            currentView === 'home'
              ? 'text-blue-700 font-bold bg-blue-50/90 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${currentView === 'home' ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('cmd')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
            currentView === 'cmd'
              ? 'text-blue-700 font-bold bg-blue-50/90 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Terminal className={`w-5 h-5 mb-0.5 ${currentView === 'cmd' ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>CMD</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('knowledge')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
            currentView === 'knowledge'
              ? 'text-blue-700 font-bold bg-blue-50/90 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className={`w-5 h-5 mb-0.5 ${currentView === 'knowledge' ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>Guides</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
            currentView === 'dashboard'
              ? 'text-blue-700 font-bold bg-blue-50/90 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-0.5 ${currentView === 'dashboard' ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>History</span>
        </button>

        {/* Mobile Dedicated Sign In or Profile Button */}
        {user ? (
          <button
            type="button"
            onClick={() => setCurrentView('settings')}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
              currentView === 'settings' ? 'text-blue-700 font-bold bg-blue-50/90 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-5 h-5 rounded-full object-cover mb-0.5 border border-slate-200" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold mb-0.5">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="truncate max-w-[45px]">{user.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl text-[11px] font-bold text-blue-600 transition cursor-pointer hover:bg-blue-50/60"
          >
            <div className="relative mb-0.5">
              <UserIcon className="w-5 h-5 text-blue-600 stroke-[2.5]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse"></span>
            </div>
            <span className="font-bold text-blue-600">Sign In</span>
          </button>
        )}
      </nav>
    </header>
  );
};
