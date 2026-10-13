import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Cpu, 
  Lock,
  ExternalLink,
  Smartphone,
  Download
} from 'lucide-react';
import { TroubleshootingMode, SystemSettings, User } from '../types';
import { api } from '../api';

interface SettingsViewProps {
  mode: TroubleshootingMode;
  onToggleMode: (mode: TroubleshootingMode) => void;
  user?: User | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  mode, 
  onToggleMode,
  user,
  onOpenAuth,
  onLogout
}) => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    setSavingKey(true);
    setKeyStatus(null);
    try {
      const res = await api.updateGeminiKey(apiKeyInput.trim());
      setKeyStatus({ success: true, message: res.message });
      setApiKeyInput('');
      await loadSettings();
    } catch (err: any) {
      setKeyStatus({ success: false, message: err.message || 'Key verification failed' });
    } finally {
      setSavingKey(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-left">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
          <span className="text-slate-900">Application </span>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Customize your troubleshooting experience, AI diagnostics engine, and preferences.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Account & Authentication */}
        <div className="glass-panel rounded-3xl border border-white/90 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                Account & Authentication
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Sign in with Google, One-Time Code, or Email to save your diagnostic history across devices.
              </p>
            </div>
            {user ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Signed In
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Guest Mode
              </span>
            )}
          </div>

          {user ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">{user.name}</span>
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {user.auth_provider === 'google' ? 'Google' : user.auth_provider === 'otp' ? 'One-Time Code' : 'Password'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition cursor-pointer self-start sm:self-center"
                >
                  Sign Out
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-200/80">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  You are currently using TechResolve as a Guest
                </h3>
                <p className="text-xs text-slate-600">
                  Register or log in to sync all 111 command tools, diagnostic trees, and battery history across your phone and computer.
                </p>
              </div>

              {onOpenAuth && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition cursor-pointer whitespace-nowrap self-start sm:self-center flex items-center gap-2"
                >
                  <span>Sign In / Register</span>
                  <span>→</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mode Preference (Beginner vs IT Pro) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
              Troubleshooting Assistant Mode
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              You can switch between modes at any time without losing your active diagnostic session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Beginner Mode Option */}
            <div
              onClick={() => onToggleMode('beginner')}
              className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                mode === 'beginner'
                  ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  {mode === 'beginner' && (
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                      ✓ Active (Default)
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  Beginner Mode
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Warm, patient IT guidance in plain everyday English. One simple check at a time, clear explanations, and zero confusing acronyms.
                </p>
              </div>

              <ul className="text-xs text-slate-500 space-y-1 pt-3 border-t border-slate-100">
                <li>• Everyday English wording</li>
                <li>• Large visual action buttons</li>
                <li>• Explanations for all commands</li>
                <li>• Simplified alternatives when stuck</li>
              </ul>
            </div>

            {/* IT Pro Mode Option */}
            <div
              onClick={() => onToggleMode('pro')}
              className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                mode === 'pro'
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                  {mode === 'pro' && (
                    <span className="text-xs font-bold text-white bg-indigo-600 px-2.5 py-0.5 rounded-full shadow-2xs">
                      ✓ Active
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1.5">
                  IT Professional Mode
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  For engineers and technical users who want rapid root-cause analysis, shell commands, stack traces, and direct log inspection.
                </p>
              </div>

              <ul className="text-xs text-slate-500 space-y-1 pt-3 border-t border-slate-100">
                <li>• PowerShell / Bash commands</li>
                <li>• Stack traces & error code lookup</li>
                <li>• Deep registry / network diagnosis</li>
                <li>• Concise technical summaries</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Gemini AI Integration Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  AI Diagnostic Engine
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Powered by Google Gemini multimodal intelligence and offline expert IT diagnostic trees.
              </p>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
              settings?.gemini_configured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {settings?.engine_status || 'Initializing...'}
            </span>
          </div>

          {/* Engine Status Note */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-xs sm:text-sm text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Diagnostic System is Fully Functional Out-of-the-Box</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              TechResolve AI includes a comprehensive local engine with full Windows battery report parsing, 
              Wi-Fi network repair trees, disk optimization procedures, and safety validators.
            </p>
            {!settings?.gemini_configured && (
              <p className="text-xs text-blue-800 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                💡 Want live conversational AI and screenshot computer vision? You can connect your free Google Gemini API key below anytime.
              </p>
            )}
          </div>

          {/* Gemini API Key Form */}
          <form onSubmit={handleSaveKey} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Google Gemini API Key (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={settings?.gemini_configured ? "•••••••••••••••••••••••••••• (Connected)" : "AIzaSy..."}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-600 font-mono"
                />
                <button
                  type="submit"
                  disabled={savingKey || !apiKeyInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-2xs transition"
                >
                  {savingKey ? 'Verifying...' : 'Connect Key'}
                </button>
              </div>
            </div>

            {keyStatus && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                keyStatus.success 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {keyStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                <span>{keyStatus.message}</span>
              </div>
            )}
          </form>
        </div>

        {/* Mobile Phone & Android APK Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Phone & Mobile App
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Install TechResolve AI as a native mobile app on your smartphone with one click.
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              APK Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            
            {/* Native Android APK Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-1">
                  <span>🤖</span>
                  <span>Android App (.APK)</span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Download the standalone Android APK installer directly to your phone and install it for a fullscreen native app experience.
                </p>
              </div>

              <a
                href="/api/download/apk"
                download="TechResolve-AI.apk"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Android APK (4.2 MB)</span>
              </a>
            </div>

            {/* Instant PWA Install Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-1">
                  <span>📲</span>
                  <span>Add to Home Screen (Instant)</span>
                </div>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  Works on both <strong>iPhone (Safari)</strong> and <strong>Android (Chrome)</strong> without downloading files:
                </p>
                <ul className="text-xs text-slate-500 space-y-1 mb-4">
                  <li>• <strong>iPhone:</strong> Tap Share icon <span className="font-semibold text-slate-700">&rarr;</span> "Add to Home Screen"</li>
                  <li>• <strong>Android:</strong> Tap Three dots <span className="font-semibold text-slate-700">&rarr;</span> "Install App"</li>
                </ul>
              </div>

              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-center">
                ✓ Auto-syncs live updates with zero storage
              </div>
            </div>

          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
            💡 <strong>Tip for installing APKs on Android:</strong> When opening the downloaded APK file for the first time, your phone may ask: <em>"Allow installation from this source"</em>. Tap <strong>Allow / Settings</strong>, then tap <strong>Install</strong>.
          </div>
        </div>

        {/* Safety & Privacy Assurances */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Safety & Privacy Principles
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="font-bold text-slate-900 shrink-0">• No Destructive Commands:</span>
              <span>We never run or recommend commands that format drives, wipe user files, or alter critical registry trees without crystal-clear warnings and backups.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-slate-900 shrink-0">• Hardware Caution:</span>
              <span>We never ask non-technical users to open power supply units, tamper with live mains electricity, or puncture lithium-ion battery cells.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-slate-900 shrink-0">• Privacy First:</span>
              <span>Uploaded screenshots and battery reports are processed solely to extract technical diagnostics. We advise users never to share personal passwords or credentials.</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
