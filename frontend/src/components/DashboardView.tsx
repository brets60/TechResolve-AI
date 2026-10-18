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
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
            <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
            Solved
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            <Clock className="w-3 h-3 animate-spin text-[#2563EB]" />
            In Progress
          </span>
        );
      case 'needs_help':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            <AlertCircle className="w-3 h-3 text-[#92400E]" />
            Needs Further Help
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
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
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 shadow-xs mb-8 border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
              Personal IT Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-2">
            Welcome back{user ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-[#475569] text-sm sm:text-base max-w-xl leading-relaxed">
            Track your ongoing IT diagnoses, view saved repair reports, and start resolving new issues anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onStartNewProblem}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-xs hover:shadow transition cursor-pointer active:scale-95"
          >
            <Play className="w-4 h-4 fill-current text-white" />
            <span>Start New Diagnosis</span>
          </button>
        </div>
      </div>

      {/* Continue Previous Diagnosis Banner (If Active Session Exists) */}
      {activeSession && (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#075985]">
                Active Diagnosis in Progress
              </span>
              <h3 className="font-bold text-[#0F172A] text-base sm:text-lg">
                {activeSession.problem_description}
              </h3>
              <p className="text-xs text-[#64748B]">
                Last completed: Step {activeSession.current_step_number} • {formatDate(activeSession.updated_at)}
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenSession(activeSession)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition shadow-2xs cursor-pointer shrink-0"
          >
            <span>Continue Diagnosis</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Grid: Recent Problems & Saved Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): My Recent Problems */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              My Recent Problems
            </h2>
            <span className="text-xs text-[#64748B]">
              {sessions.length} {sessions.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] mx-auto mb-3 border border-[#BFDBFE]">
                <FileText className="w-6 h-6 text-[#2563EB]" />
              </div>
              <h3 className="font-bold text-[#0F172A] text-base mb-1">
                No Troubleshooting Sessions Yet
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto mb-4">
                Whenever you diagnose a computer problem, it will be saved here so you can review the steps anytime.
              </p>
              <button
                onClick={onStartNewProblem}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition cursor-pointer"
              >
                <span>Start Your First Diagnosis</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs hover:border-[#2563EB] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {getStatusBadge(sess.status)}
                      <span className="text-xs text-[#64748B]">
                        {formatDate(sess.created_at)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                        {sess.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#0F172A] text-sm sm:text-base mb-1">
                      {sess.problem_description}
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Last step: Step {sess.current_step_number} • Stage: {sess.current_stage.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenSession(sess)}
                      className="px-4 py-2 rounded-xl bg-[#F1F5F9] hover:bg-[#2563EB] hover:text-white text-[#475569] border border-[#E2E8F0] font-semibold text-xs sm:text-sm transition cursor-pointer"
                    >
                      {sess.status === 'solved' ? 'View Report' : 'Continue'}
                    </button>
                    <button
                      onClick={() => onDeleteSession(sess.id)}
                      className="p-2 rounded-xl text-[#94A3B8] hover:text-[#B91C1C] hover:bg-[#FEF2F2] border border-transparent hover:border-[#FECACA] transition cursor-pointer"
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
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
            <h3 className="font-bold text-[#0F172A] text-base mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              <span>My Saved Reports</span>
            </h3>

            {solvedSessions.length === 0 ? (
              <p className="text-xs text-[#64748B] leading-relaxed">
                When you solve a problem with TechResolve AI, a summary report with prevention tips is automatically archived here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {solvedSessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onOpenSession(s)}
                    className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition cursor-pointer"
                  >
                    <div className="text-xs font-bold text-[#0F172A] truncate mb-0.5">
                      {s.problem_description}
                    </div>
                    <div className="text-[11px] text-[#15803D] font-medium">
                      ✓ Resolved on {formatDate(s.updated_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Helpful IT Guides */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
            <h3 className="font-bold text-[#0F172A] text-base mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
              <span>Helpful IT Guides</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={onOpenKnowledge}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#EFF6FF] transition group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-[#475569] group-hover:text-[#2563EB]">
                    Fix Laptop Turning Off Unplugged
                  </div>
                  <div className="text-[11px] text-[#64748B]">Battery & Power</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#2563EB] group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={onOpenKnowledge}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#EFF6FF] transition group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-[#475569] group-hover:text-[#2563EB]">
                    Wi-Fi Connected But No Internet
                  </div>
                  <div className="text-[11px] text-[#64748B]">Network & DNS</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#2563EB] group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={onOpenKnowledge}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#EFF6FF] transition group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-[#475569] group-hover:text-[#2563EB]">
                    Speed Up a Very Slow PC
                  </div>
                  <div className="text-[11px] text-[#64748B]">Performance</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#2563EB] group-hover:translate-x-1 transition" />
              </button>
            </div>

            <button
              onClick={onOpenKnowledge}
              className="mt-4 w-full text-center text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] py-1 cursor-pointer transition"
            >
              Browse All Knowledge Articles →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
