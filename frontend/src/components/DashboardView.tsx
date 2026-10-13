import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  BookOpen, 
  Trash2, 
  ArrowRight, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { TroubleshootingSession, User } from '../types';
import { api } from '../api';

interface DashboardViewProps {
  sessions: TroubleshootingSession[];
  user: User | null;
  onOpenSession: (session: TroubleshootingSession) => void;
  onStartNewProblem: () => void;
  onOpenKnowledge: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sessions,
  user,
  onOpenSession,
  onStartNewProblem,
  onOpenKnowledge,
  onDeleteSession,
}) => {
  // Find active in-progress session to offer quick resume
  const activeSession = sessions.find((s) => s.status === 'in_progress');
  const solvedSessions = sessions.filter((s) => s.status === 'solved');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'solved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Solved
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 animate-spin" />
            In Progress
          </span>
        );
      case 'needs_help':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3" />
            Needs Further Help
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Not Started
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Personal IT Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Welcome back{user ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed">
            Track your ongoing IT diagnoses, view saved repair reports, and start resolving new issues anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onStartNewProblem}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs hover:shadow transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Troubleshooting</span>
          </button>
        </div>
      </div>

      {/* Continue Previous Diagnosis Banner (If Active Session Exists) */}
      {activeSession && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Active Diagnosis in Progress
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {activeSession.problem_description}
              </h3>
              <p className="text-xs text-slate-600">
                Last completed: Step {activeSession.current_step_number} • {formatDate(activeSession.updated_at)}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenSession(activeSession)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-2xs cursor-pointer shrink-0"
          >
            <span>Continue Diagnosis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Recent Problems & Saved Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): My Recent Problems */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              My Recent Problems
            </h2>
            <span className="text-xs text-slate-500">
              {sessions.length} {sessions.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">
                No Troubleshooting Sessions Yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-4">
                Whenever you diagnose a computer problem, it will be saved here so you can review the steps anytime.
              </p>
              <button
                onClick={onStartNewProblem}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
              >
                <span>Start Your First Diagnosis</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-blue-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {getStatusBadge(sess.status)}
                      <span className="text-xs text-slate-400">
                        {formatDate(sess.created_at)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {sess.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                      {sess.problem_description}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Last step: Step {sess.current_step_number} • Stage: {sess.current_stage.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenSession(sess)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
                    >
                      {sess.status === 'solved' ? 'View Report' : 'Continue'}
                    </button>
                    <button
                      onClick={() => onDeleteSession(sess.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Saved Reports & Helpful Guides */}
        <div className="space-y-6">
          
          {/* My Saved Reports */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>My Saved Reports</span>
            </h3>

            {solvedSessions.length === 0 ? (
              <p className="text-xs text-slate-500 leading-relaxed">
                When you solve a problem with TechResolve AI, a summary report with prevention tips is automatically archived here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {solvedSessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onOpenSession(s)}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800 truncate mb-0.5">
                      {s.problem_description}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">
                      ✓ Resolved on {formatDate(s.updated_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Helpful IT Guides */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Helpful IT Guides</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={onOpenKnowledge}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                    Fix Laptop Turning Off Unplugged
                  </div>
                  <div className="text-[11px] text-slate-400">Battery & Power</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={onOpenKnowledge}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                    Wi-Fi Connected But No Internet
                  </div>
                  <div className="text-[11px] text-slate-400">Network & DNS</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={onOpenKnowledge}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                    Speed Up a Very Slow PC
                  </div>
                  <div className="text-[11px] text-slate-400">Performance</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
              </button>
            </div>

            <button
              onClick={onOpenKnowledge}
              className="mt-4 w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 py-1"
            >
              Browse All Knowledge Articles →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
