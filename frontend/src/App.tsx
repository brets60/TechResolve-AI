import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { WizardView } from './components/WizardView';
import { DashboardView } from './components/DashboardView';
import { KnowledgeView } from './components/KnowledgeView';
import { SettingsView } from './components/SettingsView';
import { CmdHelperView } from './components/CmdHelperView';
import { AuthModal } from './components/AuthModal';
import { User, TroubleshootingSession, TroubleshootingMode } from './types';
import { api } from './api';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'wizard' | 'dashboard' | 'knowledge' | 'settings' | 'cmd'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<TroubleshootingMode>('beginner');
  const [activeSession, setActiveSession] = useState<TroubleshootingSession | null>(null);
  const [sessions, setSessions] = useState<TroubleshootingSession[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Check initial user authentication
  useEffect(() => {
    const checkAuth = async () => {
      if (api.getToken()) {
        try {
          const me = await api.getMe();
          setUser(me);
          if (me.preferred_mode) {
            setMode(me.preferred_mode);
          }
        } catch {
          api.logout();
          setUser(null);
        }
      }
    };
    checkAuth();
  }, []);

  // Fetch sessions whenever user enters dashboard or starts app
  const refreshSessions = async () => {
    try {
      const list = await api.listSessions();
      setSessions(list);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  useEffect(() => {
    if (currentView === 'dashboard' || sessions.length === 0) {
      refreshSessions();
    }
  }, [user, currentView]);

  // Start troubleshooting a problem
  const handleStartProblem = async (problem: string, category: string) => {
    setGlobalLoading(true);
    try {
      const session = await api.createSession({
        title: problem.length > 50 ? `${problem.substring(0, 50)}...` : problem,
        category: category || 'General',
        problem_description: problem,
        mode: mode,
      });
      setActiveSession(session);
      setCurrentView('wizard');
      await refreshSessions();
    } catch (err: any) {
      alert(err.message || 'Failed to start diagnosis');
    } finally {
      setGlobalLoading(false);
    }
  };

  // Open existing session
  const handleOpenSession = async (session: TroubleshootingSession) => {
    setGlobalLoading(true);
    try {
      const full = await api.getSession(session.id);
      setActiveSession(full);
      setCurrentView('wizard');
    } catch (err: any) {
      alert(err.message || 'Failed to load session');
    } finally {
      setGlobalLoading(false);
    }
  };

  // Launch interactive guide from knowledge base article
  const handleLaunchInteractive = async (articleId: string) => {
    setGlobalLoading(true);
    try {
      const session = await api.launchInteractiveTroubleshoot(articleId);
      setActiveSession(session);
      setCurrentView('wizard');
      await refreshSessions();
    } catch (err: any) {
      alert(err.message || 'Failed to start guide session');
    } finally {
      setGlobalLoading(false);
    }
  };

  // Delete session
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await api.deleteSession(sessionId);
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
      }
      await refreshSessions();
    } catch (err: any) {
      alert(err.message || 'Could not delete session');
    }
  };

  // Toggle Mode
  const handleToggleMode = async (newMode: TroubleshootingMode) => {
    setMode(newMode);
    if (user) {
      try {
        await api.updateMode(newMode);
        setUser({ ...user, preferred_mode: newMode });
      } catch (e) {
        console.error(e);
      }
    }
    if (activeSession) {
      try {
        const updated = await api.switchSessionMode(activeSession.id, newMode);
        setActiveSession(updated);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Logout
  const handleLogout = () => {
    api.logout();
    setUser(null);
    refreshSessions();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#334155] bg-[#FAFAF7] relative overflow-x-hidden selection:bg-[#14B8A6]/20 selection:text-[#0F766E]">
      {/* Top Navigation */}
      <div className="relative z-40">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          mode={mode}
          onToggleMode={handleToggleMode}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Body */}
      <main className="flex-1 pb-20 md:pb-6 relative z-10">
        {globalLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-[#0F766E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#64748B] font-medium">Preparing diagnostic steps...</p>
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <HomeView
                onStartProblem={handleStartProblem}
                onOpenCmdHelper={() => setCurrentView('cmd')}
                onOpenKnowledge={() => setCurrentView('knowledge')}
                mode={mode}
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}

            {currentView === 'wizard' && activeSession && (
              <WizardView
                session={activeSession}
                onUpdateSession={(updated) => {
                  setActiveSession(updated);
                  refreshSessions();
                }}
                onBackToHome={() => setCurrentView('home')}
                globalMode={mode}
                onToggleGlobalMode={handleToggleMode}
              />
            )}

            {currentView === 'dashboard' && (
              <DashboardView
                sessions={sessions}
                user={user}
                onOpenSession={handleOpenSession}
                onStartNewProblem={() => setCurrentView('home')}
                onOpenKnowledge={() => setCurrentView('knowledge')}
                onDeleteSession={handleDeleteSession}
              />
            )}

            {currentView === 'knowledge' && (
              <KnowledgeView
                onLaunchInteractive={handleLaunchInteractive}
                onStartCustomProblem={handleStartProblem}
              />
            )}

            {currentView === 'cmd' && (
              <CmdHelperView
                mode={mode}
                onStartProblemWithCommand={(cmdName, category) => handleStartProblem(`Running diagnostics for: ${cmdName}`, category)}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                mode={mode}
                onToggleMode={handleToggleMode}
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-[#FFFFFF] py-6 text-center text-xs text-[#64748B] mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-semibold text-[#0F172A]">
            TechResolve AI • Patient IT Support For Everyone
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/download/apk"
              download="TechResolve-AI.apk"
              className="text-[#0F766E] hover:text-[#115E59] font-bold inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#ECFDF5] border border-[#99F6E4] transition"
            >
              <span>📱 Direct Download: Android App (.APK)</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser) => {
          setUser(newUser);
          if (newUser.preferred_mode) {
            setMode(newUser.preferred_mode);
          }
          refreshSessions();
        }}
      />

    </div>
  );
}

export default App;
