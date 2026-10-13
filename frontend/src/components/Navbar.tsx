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
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
              <Wrench className="w-5 h-5" />
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
                <span className="text-sm font-medium text-slate-700 hidden lg:inline max-w-[120px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
