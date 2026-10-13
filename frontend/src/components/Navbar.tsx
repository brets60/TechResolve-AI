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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-200/90 group-hover:scale-105 group-hover:shadow-md transition-all bg-white flex items-center justify-center p-0.5">
              <img 
                src="/logo.png" 
                alt="TechResolve AI" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  TechResolve <span className="text-blue-600">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  IT Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Clear solutions, one step at a time
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'home'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'dashboard'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('knowledge')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'knowledge'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              IT Guides
            </button>
            <button
              onClick={() => setCurrentView('cmd')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'cmd'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Terminal className="w-4 h-4" />
              CMD Helper
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentView === 'settings'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </button>
          </nav>

          {/* Mode Switcher & User Account */}
          <div className="flex items-center gap-3">
            
            {/* Beginner vs Pro Mode Pill */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-medium">
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
                  <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
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
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200/80 transition cursor-pointer shadow-2xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Log In / Register</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Shown on phones < md) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden flex items-center justify-around py-1.5 px-2 safe-area-pb shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition cursor-pointer ${
            currentView === 'home'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${currentView === 'home' ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('cmd')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition cursor-pointer ${
            currentView === 'cmd'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Terminal className={`w-5 h-5 mb-0.5 ${currentView === 'cmd' ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>CMD Tools</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('knowledge')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition cursor-pointer ${
            currentView === 'knowledge'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className={`w-5 h-5 mb-0.5 ${currentView === 'knowledge' ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>Guides</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition cursor-pointer ${
            currentView === 'dashboard'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-0.5 ${currentView === 'dashboard' ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>History</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('settings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition cursor-pointer ${
            currentView === 'settings'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <SettingsIcon className={`w-5 h-5 mb-0.5 ${currentView === 'settings' ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span>Settings</span>
        </button>
      </nav>
    </header>
  );
};
