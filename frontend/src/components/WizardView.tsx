import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Upload, 
  ArrowLeft, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles, 
  Terminal, 
  Download, 
  Printer, 
  RefreshCw,
  Send,
  Battery,
  ShieldAlert,
  ChevronRight,
  Info,
  Tv,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  Play
} from 'lucide-react';
import { 
  TroubleshootingSession, 
  SessionMessage, 
  TroubleshootingMode, 
  TroubleshootingStage,
  WizardOption,
  BatteryAnalysis 
} from '../types';
import { api } from '../api';
import { getYoutubeTutorial } from '../services/youtubeTutorials';
import { VideoTutorialModal } from './VideoTutorialModal';

interface WizardViewProps {
  session: TroubleshootingSession;
  onUpdateSession: (session: TroubleshootingSession) => void;
  onBackToHome: () => void;
  globalMode: TroubleshootingMode;
  onToggleGlobalMode: (mode: TroubleshootingMode) => void;
}

export const WizardView: React.FC<WizardViewProps> = ({
  session,
  onUpdateSession,
  onBackToHome,
  globalMode,
  onToggleGlobalMode,
}) => {
  const [loading, setLoading] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [showClarification, setShowClarification] = useState(false);
  const [clarificationQuestion, setClarificationQuestion] = useState('');
  const [clarificationLoading, setClarificationLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showInlineVideo, setShowInlineVideo] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Intelligent YouTube Video Tutorial (works for 35 problems AND any custom concern)
  const tutorial = getYoutubeTutorial(session.problem_description, session.category);

  // Stages configuration
  const stages: { key: TroubleshootingStage; label: string; number: number }[] = [
    { key: 'understanding', label: 'Understanding problem', number: 1 },
    { key: 'checking', label: 'Checking the cause', number: 2 },
    { key: 'trying_solution', label: 'Trying a solution', number: 3 },
    { key: 'confirming_fix', label: 'Confirming the fix', number: 4 },
  ];

  const getStageIndex = (stage: TroubleshootingStage) => {
    switch (stage) {
      case 'understanding': return 0;
      case 'checking': return 1;
      case 'trying_solution': return 2;
      case 'confirming_fix': return 3;
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(session.current_stage);

  // Find latest assistant message with structured data
  const messages = session.messages || [];
  const latestAssistantMessage = [...messages].reverse().find(
    (m) => m.sender === 'assistant' && m.structured_data
  );
  const stepData = latestAssistantMessage?.structured_data;

  // Handle option click
  const handleSelectOption = async (option: WizardOption) => {
    setLoading(true);
    try {
      if (option.action_type === 'solved') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      await api.sendStepResponse(session.id, {
        chosen_option_key: option.key,
        chosen_option_label: option.label,
        custom_feedback: customNote.trim() || undefined,
        action_type: option.action_type || 'normal',
      });
      setCustomNote('');
      // Refresh session
      const updated = await api.getSession(session.id);
      onUpdateSession(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  // Handle copy command
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  // Handle Clarification Question
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationQuestion.trim()) return;

    setClarificationLoading(true);
    try {
      await api.askClarification(session.id, clarificationQuestion.trim());
      setClarificationQuestion('');
      const updated = await api.getSession(session.id);
      onUpdateSession(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to get answer');
    } finally {
      setClarificationLoading(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError(null);
    try {
      await api.uploadFile(session.id, file);
      const updated = await api.getSession(session.id);
      onUpdateSession(updated);
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Mode Toggle within session
  const handleToggleSessionMode = async () => {
    const nextMode: TroubleshootingMode = session.mode === 'beginner' ? 'pro' : 'beginner';
    try {
      const updated = await api.switchSessionMode(session.id, nextMode);
      onUpdateSession(updated);
      onToggleGlobalMode(nextMode);
    } catch (err: any) {
      alert('Could not switch mode');
    }
  };

  // Battery data from diagnostic_data
  const batteryData: BatteryAnalysis | undefined = 
    session.diagnostic_data?.battery_analysis || stepData?.battery_analysis;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      
      {/* Session Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] px-3 py-1.5 rounded-xl hover:bg-[#FFFFFF] border border-transparent hover:border-[#E2E8F0] shadow-2xs transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#0F766E]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <button
            onClick={handleToggleSessionMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              session.mode === 'beginner'
                ? 'bg-[#FFFFFF] text-[#0F766E] border-[#E2E8F0] hover:border-[#0F766E] shadow-2xs'
                : 'bg-[#FFFFFF] text-[#0369A1] border-[#E2E8F0] hover:border-[#0F766E] shadow-2xs'
            }`}
            title="Click to toggle between Beginner and IT Pro mode"
          >
            {session.mode === 'beginner' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Beginner Mode (Simple English)</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5 text-[#15803D]" />
                <span>IT Professional Mode (CLI & Logs)</span>
              </>
            )}
          </button>

          {/* Ask AI button */}
          <button
            onClick={() => setShowClarification(!showClarification)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFFFFF] border border-[#E2E8F0] text-[#334155] hover:text-[#0F766E] hover:bg-[#ECFDF5] hover:border-[#99F6E4] shadow-2xs transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Ask for Clarification</span>
          </button>

          {/* Watch Video Tutorial Button */}
          <button
            onClick={() => setShowVideoModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ECFDF5] border border-[#99F6E4] text-[#0F766E] hover:bg-[#0F766E] hover:text-white shadow-2xs transition cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Watch Video Fix</span>
          </button>
        </div>
      </div>

      {/* Problem Title Card */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 sm:p-7 shadow-xs mb-8 border border-[#E2E8F0]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ECFDF5] text-[#0F766E] border border-[#99F6E4]">
            {session.category}
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            session.status === 'solved' 
              ? 'bg-[#ECFDF5] text-[#15803D] border border-[#BBF7D0] shadow-2xs' 
              : 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] shadow-2xs'
          }`}>
            {session.status === 'solved' ? '✓ Problem Solved' : '● Live Diagnostic In Progress'}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
          {session.problem_description}
        </h1>
      </div>

      {/* Visual Progress Bar (4 Stages) */}
      <div className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {stages.map((stg, idx) => {
            const isCompleted = idx < currentStageIndex || session.status === 'solved';
            const isCurrent = idx === currentStageIndex && session.status !== 'solved';

            return (
              <div 
                key={stg.key}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm shadow-[#0F766E]/20'
                    : isCompleted
                    ? 'bg-[#ECFDF5] text-[#15803D] border-[#BBF7D0] shadow-2xs'
                    : 'bg-[#FFFFFF] text-[#64748B] border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-white text-[#0F766E]'
                      : isCompleted
                      ? 'bg-[#BBF7D0] text-[#15803D]'
                      : 'bg-[#FAFAF7] text-[#64748B]'
                  }`}>
                    {isCompleted ? '✓' : stg.number}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Stage {stg.number}
                  </span>
                </div>
                <div className="font-semibold text-xs sm:text-sm truncate">
                  {stg.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Content Area */}
      <div className="space-y-6">

        {/* Swollen Battery / Safety Alert */}
        {stepData?.safety_warning && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Important Safety Notice: </span>
              {stepData.safety_warning}
            </div>
          </div>
        )}

        {/* Battery Health Visual Gauge (When Battery Report Uploaded or Parsed) */}
        {batteryData && batteryData.is_valid && (
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Battery className={`w-5 h-5 ${
                  (batteryData.health_percentage ?? 100) < 50 ? 'text-[#B91C1C]' : 'text-[#15803D]'
                }`} />
                <h3 className="font-bold text-[#0F172A] text-base sm:text-lg">
                  Battery Health Diagnostic
                </h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                (batteryData.health_percentage ?? 100) < 50 
                  ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]' 
                  : 'bg-[#ECFDF5] text-[#15803D] border border-[#BBF7D0]'
              }`}>
                {batteryData.summary_verdict}
              </span>
            </div>

            {/* Health Meter */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-[#475569] mb-1.5">
                <span>Current Capacity vs Original Design</span>
                <span className="font-bold text-[#0F172A]">{batteryData.health_percentage}% Health</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#FAFAF7] overflow-hidden border border-[#E2E8F0]">
                <div 
                  className={`h-full transition-all duration-500 ${
                    (batteryData.health_percentage ?? 100) < 50 
                      ? 'bg-[#B91C1C]' 
                      : (batteryData.health_percentage ?? 100) < 75
                      ? 'bg-[#B45309]'
                      : 'bg-[#15803D]'
                  }`}
                  style={{ width: `${Math.min(100, batteryData.health_percentage || 0)}%` }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
              <div className="p-3 rounded-xl bg-[#FAFAF7] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Design Capacity</div>
                <div className="font-bold text-[#0F172A] text-sm sm:text-base">
                  {batteryData.design_capacity_mwh?.toLocaleString()} mWh
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAF7] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Full Charge Capacity</div>
                <div className="font-bold text-[#0F172A] text-sm sm:text-base">
                  {batteryData.full_charge_capacity_mwh?.toLocaleString()} mWh
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAF7] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Wear Level</div>
                <div className="font-bold text-[#B91C1C] text-sm sm:text-base">
                  {batteryData.wear_percentage}% Lost
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#FAFAF7] border border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Cycle Count</div>
                <div className="font-bold text-[#0F172A] text-sm sm:text-base">
                  {batteryData.cycle_count || 'N/A'}
                </div>
              </div>
            </div>

            {/* Plain English explanation */}
            <p className="text-sm text-[#334155] bg-[#ECFDF5] p-4 rounded-xl border border-[#99F6E4] leading-relaxed">
              💡 <span className="font-semibold text-[#0F172A]">What this means: </span>
              {batteryData.plain_english_explanation}
            </p>
          </div>
        )}

        {/* SOLVED STATE: Final Report Card */}
        {session.status === 'solved' && session.final_summary ? (
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#BBF7D0] p-6 sm:p-8 shadow-xs text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#15803D] flex items-center justify-center mb-6 border border-[#BBF7D0]">
              <CheckCircle2 className="w-8 h-8 text-[#15803D]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
              Problem Solved Successfully!
            </h2>
            <p className="text-[#334155] text-sm sm:text-base mb-6 leading-relaxed">
              {session.final_summary.summary || 'Your troubleshooting steps were completed and your device is verified working.'}
            </p>

            {/* Confirmed Facts */}
            {session.final_summary.confirmed_facts && session.final_summary.confirmed_facts.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  What We Verified:
                </h4>
                <ul className="space-y-1.5">
                  {session.final_summary.confirmed_facts.map((fact, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#0F172A]">
                      <Check className="w-4 h-4 text-[#15803D] shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prevention Tips */}
            {session.final_summary.prevention_tips && (
              <div className="p-4 rounded-xl bg-[#FAFAF7] border border-[#E2E8F0] mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">
                  How To Prevent This in the Future:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#475569] list-disc list-inside">
                  {session.final_summary.prevention_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#FAFAF7] text-[#475569] hover:text-[#0F172A] font-semibold text-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#0F766E]" />
                <span>Print Diagnostic Summary</span>
              </button>
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-sm shadow-xs transition cursor-pointer"
              >
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE STEP: Strict 6-Part Step Card */
          stepData && (
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
              
              {/* Assistant Message */}
              {latestAssistantMessage?.content && (
                <div className="mb-6 p-4 rounded-xl bg-[#ECFDF5] border border-[#99F6E4] text-[#0F172A] text-sm sm:text-base leading-relaxed flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 shadow-xs">
                    IT
                  </div>
                  <div>
                    <span className="font-semibold text-[#0F766E] block mb-0.5">TechResolve Support</span>
                    <p>{latestAssistantMessage.content}</p>
                  </div>
                </div>
              )}

              {/* 1. What We Are Checking */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-1">
                  <span className="w-5 h-5 rounded-md bg-[#ECFDF5] text-[#0F766E] flex items-center justify-center font-extrabold text-[11px] border border-[#99F6E4]">1</span>
                  <span>What We Are Checking</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] pl-7">
                  {stepData.what_we_are_checking}
                </h3>
              </div>

              {/* 2. Why It Matters */}
              <div className="mb-6 pl-7">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  <span>Why This Matters:</span>
                </div>
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed bg-[#FAFAF7] p-3.5 rounded-xl border border-[#E2E8F0]">
                  {stepData.why_it_matters}
                </p>
              </div>

              {/* 3. What To Do (Numbered steps) */}
              <div className="mb-6 pl-7">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-2">
                  <span className="w-5 h-5 rounded-md bg-[#ECFDF5] text-[#0F766E] flex items-center justify-center font-extrabold text-[11px] border border-[#99F6E4]">3</span>
                  <span>What To Do:</span>
                </div>
                <div className="space-y-2">
                  {stepData.what_to_do.map((instruction, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#0F172A]">
                      <span className="w-6 h-6 rounded-full bg-[#FAFAF7] border border-[#E2E8F0] text-[#0F766E] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed whitespace-pre-line">{instruction}</span>
                    </div>
                  ))}
                </div>

                {/* Command box if command present */}
                {stepData.command_to_run && (
                  <div className="mt-4 p-4 rounded-2xl bg-[#FAFAF7] border border-[#E2E8F0] text-[#0F172A] text-xs sm:text-sm shadow-2xs">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#E2E8F0]">
                      <span className="text-[#0F766E] font-semibold text-xs flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span>Command to type into Command Prompt:</span>
                      </span>
                      <button
                        onClick={() => handleCopy(stepData.command_to_run!)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#475569] hover:text-[#0F172A] bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#0F766E] px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer"
                      >
                        {copiedCommand ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5 text-[#0F766E]" />}
                        <span>{copiedCommand ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-[#0F172A] select-all font-mono font-bold text-sm bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E2E8F0]">
                      {stepData.command_to_run}
                    </div>
                    {stepData.command_explanation && (
                      <p className="mt-2.5 text-[#64748B] text-xs font-sans">
                        💡 {stepData.command_explanation}
                      </p>
                    )}
                  </div>
                )}

                {/* Inline Video Demonstration & Walkthrough */}
                <div className="mt-5 rounded-2xl border border-[#99F6E4] bg-[#ECFDF5]/60 overflow-hidden shadow-2xs">
                  <div className="p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                        <Play className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0F172A]">
                            Prefer watching a video fix?
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
                            YouTube Tutorial
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] line-clamp-1">
                          {tutorial.title} • {tutorial.channel} {tutorial.duration ? `(${tutorial.duration})` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowInlineVideo(!showInlineVideo)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-2xs transition cursor-pointer"
                      >
                        {showInlineVideo ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Hide Video</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Watch Video Here</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVideoModal(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAFAF7] border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] text-xs font-semibold shadow-2xs transition cursor-pointer"
                        title="Open full video modal"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span className="hidden sm:inline">Pop Out</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Expanded Video Player */}
                  {showInlineVideo && (
                    <div className="p-3.5 sm:p-4 pt-0 border-t border-[#99F6E4]/40">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0F172A] border border-[#CBD5E1] shadow-inner mb-3">
                        <iframe
                          src={`https://www.youtube.com/embed/${tutorial.videoId}?rel=0&modestbranding=1`}
                          title={tutorial.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
                        <span>💡 {tutorial.summary}</span>
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://www.youtube.com/watch?v=${tutorial.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#0F766E] font-bold hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Watch on YouTube</span>
                          </a>
                          {!tutorial.isDirectMatch && (
                            <a
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(tutorial.searchQuery)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#0F766E] font-bold hover:underline"
                            >
                              <Search className="w-3 h-3" />
                              <span>Search more</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. What Should Happen */}
              <div className="mb-8 pl-7">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                  <span>What Should Happen:</span>
                </div>
                <p className="text-sm text-[#475569] italic">
                  "{stepData.what_should_happen}"
                </p>
              </div>

              {/* File Upload Zone (If step allows file upload) */}
              {(stepData.allows_file_upload || session.category.includes('Laptop') || session.category.includes('Battery')) && (
                <div className="mb-8 pl-7">
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-[#FAFAF7] hover:bg-[#ECFDF5]/60 transition">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-[#0F172A] text-sm sm:text-base flex items-center gap-2">
                          <Upload className="w-4 h-4 text-[#0F766E]" />
                          <span>Upload File or Screenshot</span>
                        </h4>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {stepData.upload_hint || 'Upload battery-report.html, error screenshot, or system log.'}
                        </p>
                        <p className="text-[11px] text-[#B45309] mt-1 font-medium">
                          🔒 Privacy check: Please make sure no passwords or personal credentials are included.
                        </p>
                      </div>

                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#0F766E] text-[#0F172A] font-semibold text-xs sm:text-sm shadow-2xs hover:shadow transition">
                        <span>{uploadLoading ? 'Analyzing...' : 'Choose File'}</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileUpload}
                          disabled={uploadLoading}
                          className="hidden"
                          accept=".html,.htm,.png,.jpg,.jpeg,.webp,.log,.txt"
                        />
                      </label>
                    </div>

                    {uploadError && (
                      <p className="text-xs text-[#B91C1C] mt-2 font-medium">
                        ⚠️ {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Tell Us What Happened (Interactive Choice Buttons) */}
              <div className="mb-8 pl-7 pt-4 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-3">
                  <span className="w-5 h-5 rounded-md bg-[#ECFDF5] text-[#0F766E] flex items-center justify-center font-extrabold text-[11px] border border-[#99F6E4]">5</span>
                  <span>Tell Us What Happened:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {stepData.tell_us_what_happened_options?.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt)}
                      disabled={loading}
                      className={`p-3.5 sm:p-4 rounded-xl border text-left font-medium text-sm transition group cursor-pointer flex items-center justify-between ${
                        opt.action_type === 'solved'
                          ? 'bg-[#ECFDF5] border-[#BBF7D0] text-[#15803D] hover:bg-[#DCFCE7]'
                          : opt.action_type === 'need_simpler'
                          ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309] hover:bg-[#FDE68A]/60'
                          : opt.action_type === 'tool_missing' || opt.action_type === 'error'
                          ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] hover:bg-[#FEE2E2]'
                          : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A] hover:border-[#14B8A6] hover:bg-[#ECFDF5]/50 shadow-xs'
                      }`}
                    >
                      <span className="pr-2">{opt.label}</span>
                      <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:text-[#0F766E] group-hover:translate-x-1 transition shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Optional Note input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Optional: add any details or exact error text you saw..."
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15 bg-[#FAFAF7] text-[#0F172A] placeholder-[#94A3B8]"
                  />
                </div>
              </div>

              {/* 6. What Happens Next */}
              <div className="pl-7 pt-4 border-t border-[#E2E8F0] flex items-start gap-2 text-xs sm:text-sm text-[#64748B]">
                <Info className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#0F172A]">What happens next: </span>
                  {stepData.what_happens_next}
                </div>
              </div>

            </div>
          )
        )}

        {/* Facts Summary Cards */}
        {stepData && session.status !== 'solved' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* What we know so far */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>What We Know So Far</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#475569]">
                {(stepData.what_we_know_so_far && stepData.what_we_know_so_far.length > 0) ? (
                  stepData.what_we_know_so_far.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#0F766E]">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#64748B] italic">Gathering initial evidence...</li>
                )}
              </ul>
            </div>

            {/* What we need to check */}
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#B45309]" />
                <span>What We Need To Check</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#475569]">
                {(stepData.what_we_need_to_check && stepData.what_we_need_to_check.length > 0) ? (
                  stepData.what_we_need_to_check.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#B45309]">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#64748B] italic">No remaining checks.</li>
                )}
              </ul>
            </div>

          </div>
        )}

        {/* Clarification Drawer / Chat Component */}
        {showClarification && (
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#99F6E4] p-6 shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0F766E]" />
                <h3 className="font-bold text-[#0F172A] text-sm sm:text-base">
                  Ask For Clarification Or Simpler Words
                </h3>
              </div>
              <button
                onClick={() => setShowClarification(false)}
                className="text-xs text-[#64748B] hover:text-[#0F172A] font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setClarificationQuestion('Can you explain this in simpler words?')}
                className="text-xs px-3 py-1.5 rounded-full bg-[#ECFDF5] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] transition cursor-pointer"
              >
                "Explain in simpler words"
              </button>
              <button
                onClick={() => setClarificationQuestion('Is this test safe for my laptop and files?')}
                className="text-xs px-3 py-1.5 rounded-full bg-[#ECFDF5] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] transition cursor-pointer"
              >
                "Is this test safe?"
              </button>
              <button
                onClick={() => setClarificationQuestion('I cannot find this tool on my computer.')}
                className="text-xs px-3 py-1.5 rounded-full bg-[#ECFDF5] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] transition cursor-pointer"
              >
                "I cannot find this tool"
              </button>
            </div>

            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <input
                type="text"
                value={clarificationQuestion}
                onChange={(e) => setClarificationQuestion(e.target.value)}
                placeholder="Ask anything you are unsure about..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FAFAF7] text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
              />
              <button
                type="submit"
                disabled={clarificationLoading || !clarificationQuestion.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Video Tutorial Modal */}
      {showVideoModal && (
        <VideoTutorialModal
          tutorial={tutorial}
          problemTitle={session.problem_description}
          onClose={() => setShowVideoModal(false)}
        />
      )}

    </div>
  );
};
