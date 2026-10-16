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
  Info
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-1.5 rounded-xl hover:bg-[#151F32] border border-transparent hover:border-[#334155] transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#22D3EE]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <button
            onClick={handleToggleSessionMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              session.mode === 'beginner'
                ? 'bg-[#151F32] text-[#22D3EE] border-[#334155] hover:border-[#2563EB]'
                : 'bg-[#151F32] text-[#60A5FA] border-[#334155] hover:border-[#2563EB]'
            }`}
            title="Click to toggle between Beginner and IT Pro mode"
          >
            {session.mode === 'beginner' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Beginner Mode (Simple English)</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>IT Professional Mode (CLI & Logs)</span>
              </>
            )}
          </button>

          {/* Ask AI button */}
          <button
            onClick={() => setShowClarification(!showClarification)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#151F32] border border-[#334155] text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#1E293B] hover:border-[#2563EB] shadow-2xs transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Ask for Clarification</span>
          </button>
        </div>
      </div>

      {/* Problem Title Card */}
      <div className="bg-[#151F32] rounded-3xl p-5 sm:p-7 shadow-sm mb-8 border border-[#334155]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#0B1120] text-[#22D3EE] border border-[#334155]">
            {session.category}
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            session.status === 'solved' 
              ? 'bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30 shadow-2xs' 
              : 'bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30 shadow-2xs'
          }`}>
            {session.status === 'solved' ? '✓ Problem Solved' : '● Live Diagnostic In Progress'}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
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
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-[#2563EB]/25'
                    : isCompleted
                    ? 'bg-[#151F32] text-[#4ADE80] border-[#334155] shadow-2xs'
                    : 'bg-[#151F32]/50 text-[#94A3B8] border-[#334155]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-white text-[#2563EB]'
                      : isCompleted
                      ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                      : 'bg-[#0B1120] text-[#94A3B8]'
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
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Important Safety Notice: </span>
              {stepData.safety_warning}
            </div>
          </div>
        )}

        {/* Battery Health Visual Gauge (When Battery Report Uploaded or Parsed) */}
        {batteryData && batteryData.is_valid && (
          <div className="bg-[#151F32] rounded-2xl border border-[#334155] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Battery className={`w-5 h-5 ${
                  (batteryData.health_percentage ?? 100) < 50 ? 'text-[#F87171]' : 'text-[#4ADE80]'
                }`} />
                <h3 className="font-bold text-[#F8FAFC] text-base sm:text-lg">
                  Battery Health Diagnostic
                </h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                (batteryData.health_percentage ?? 100) < 50 
                  ? 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30' 
                  : 'bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30'
              }`}>
                {batteryData.summary_verdict}
              </span>
            </div>

            {/* Health Meter */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-[#CBD5E1] mb-1.5">
                <span>Current Capacity vs Original Design</span>
                <span className="font-bold text-[#F8FAFC]">{batteryData.health_percentage}% Health</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#0B1120] overflow-hidden border border-[#334155]">
                <div 
                  className={`h-full transition-all duration-500 ${
                    (batteryData.health_percentage ?? 100) < 50 
                      ? 'bg-[#F87171]' 
                      : (batteryData.health_percentage ?? 100) < 75
                      ? 'bg-[#FBBF24]'
                      : 'bg-[#4ADE80]'
                  }`}
                  style={{ width: `${Math.min(100, batteryData.health_percentage || 0)}%` }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
              <div className="p-3 rounded-xl bg-[#0B1120] border border-[#334155]">
                <div className="text-xs text-[#94A3B8]">Design Capacity</div>
                <div className="font-bold text-[#F8FAFC] text-sm sm:text-base">
                  {batteryData.design_capacity_mwh?.toLocaleString()} mWh
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0B1120] border border-[#334155]">
                <div className="text-xs text-[#94A3B8]">Full Charge Capacity</div>
                <div className="font-bold text-[#F8FAFC] text-sm sm:text-base">
                  {batteryData.full_charge_capacity_mwh?.toLocaleString()} mWh
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0B1120] border border-[#334155]">
                <div className="text-xs text-[#94A3B8]">Wear Level</div>
                <div className="font-bold text-[#F87171] text-sm sm:text-base">
                  {batteryData.wear_percentage}% Lost
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0B1120] border border-[#334155]">
                <div className="text-xs text-[#94A3B8]">Cycle Count</div>
                <div className="font-bold text-[#F8FAFC] text-sm sm:text-base">
                  {batteryData.cycle_count || 'N/A'}
                </div>
              </div>
            </div>

            {/* Plain English explanation */}
            <p className="text-sm text-[#CBD5E1] bg-[#1E293B] p-4 rounded-xl border border-[#334155] leading-relaxed">
              💡 <span className="font-semibold text-[#F8FAFC]">What this means: </span>
              {batteryData.plain_english_explanation}
            </p>
          </div>
        )}

        {/* SOLVED STATE: Final Report Card */}
        {session.status === 'solved' && session.final_summary ? (
          <div className="bg-[#151F32] rounded-2xl border border-[#4ADE80]/30 p-6 sm:p-8 shadow-sm text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#4ADE80]/15 text-[#4ADE80] flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">
              Problem Solved Successfully!
            </h2>
            <p className="text-[#CBD5E1] text-sm sm:text-base mb-6 leading-relaxed">
              {session.final_summary.summary || 'Your troubleshooting steps were completed and your device is verified working.'}
            </p>

            {/* Confirmed Facts */}
            {session.final_summary.confirmed_facts && session.final_summary.confirmed_facts.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                  What We Verified:
                </h4>
                <ul className="space-y-1.5">
                  {session.final_summary.confirmed_facts.map((fact, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                      <Check className="w-4 h-4 text-[#4ADE80] shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prevention Tips */}
            {session.final_summary.prevention_tips && (
              <div className="p-4 rounded-xl bg-[#0B1120] border border-[#334155] mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-2">
                  How To Prevent This in the Future:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#CBD5E1] list-disc list-inside">
                  {session.final_summary.prevention_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#334155] hover:bg-[#1E293B] text-[#CBD5E1] hover:text-[#F8FAFC] font-semibold text-sm transition"
              >
                <Printer className="w-4 h-4 text-[#22D3EE]" />
                <span>Print Diagnostic Summary</span>
              </button>
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-xs transition"
              >
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE STEP: Strict 6-Part Step Card */
          stepData && (
            <div className="bg-[#151F32] rounded-2xl border border-[#334155] p-6 sm:p-8 shadow-xs">
              
              {/* Assistant Message */}
              {latestAssistantMessage?.content && (
                <div className="mb-6 p-4 rounded-xl bg-[#1E293B] border border-[#334155] text-[#CBD5E1] text-sm sm:text-base leading-relaxed flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 shadow-xs">
                    IT
                  </div>
                  <div>
                    <span className="font-semibold text-[#22D3EE] block mb-0.5">TechResolve Support</span>
                    <p>{latestAssistantMessage.content}</p>
                  </div>
                </div>
              )}

              {/* 1. What We Are Checking */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-1">
                  <span className="w-5 h-5 rounded-md bg-[#2563EB]/20 text-[#22D3EE] flex items-center justify-center font-extrabold text-[11px] border border-[#2563EB]/30">1</span>
                  <span>What We Are Checking</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#F8FAFC] pl-7">
                  {stepData.what_we_are_checking}
                </h3>
              </div>

              {/* 2. Why It Matters */}
              <div className="mb-6 pl-7">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                  <span>Why This Matters:</span>
                </div>
                <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed bg-[#0B1120] p-3.5 rounded-xl border border-[#334155]">
                  {stepData.why_it_matters}
                </p>
              </div>

              {/* 3. What To Do (Numbered steps) */}
              <div className="mb-6 pl-7">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-2">
                  <span className="w-5 h-5 rounded-md bg-[#2563EB]/20 text-[#22D3EE] flex items-center justify-center font-extrabold text-[11px] border border-[#2563EB]/30">3</span>
                  <span>What To Do:</span>
                </div>
                <div className="space-y-2">
                  {stepData.what_to_do.map((instruction, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#CBD5E1]">
                      <span className="w-6 h-6 rounded-full bg-[#0B1120] border border-[#334155] text-[#22D3EE] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed whitespace-pre-line">{instruction}</span>
                    </div>
                  ))}
                </div>

                {/* Command box if command present */}
                {stepData.command_to_run && (
                  <div className="mt-4 p-4 rounded-2xl bg-[#0B1120] border border-[#334155] text-[#CBD5E1] text-xs sm:text-sm shadow-2xs">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#334155]">
                      <span className="text-[#22D3EE] font-semibold text-xs flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" />
                        <span>Command to type into Command Prompt:</span>
                      </span>
                      <button
                        onClick={() => handleCopy(stepData.command_to_run!)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#CBD5E1] hover:text-[#F8FAFC] bg-[#1E293B] border border-[#334155] hover:border-[#2563EB] px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer"
                      >
                        {copiedCommand ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5 text-[#22D3EE]" />}
                        <span>{copiedCommand ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-[#22D3EE] select-all font-mono font-bold text-sm bg-[#151F32] p-2.5 rounded-xl border border-[#334155]">
                      {stepData.command_to_run}
                    </div>
                    {stepData.command_explanation && (
                      <p className="mt-2.5 text-[#94A3B8] text-xs font-sans">
                        💡 {stepData.command_explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 4. What Should Happen */}
              <div className="mb-8 pl-7">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                  <span>What Should Happen:</span>
                </div>
                <p className="text-sm text-[#94A3B8] italic">
                  "{stepData.what_should_happen}"
                </p>
              </div>

              {/* File Upload Zone (If step allows file upload) */}
              {(stepData.allows_file_upload || session.category.includes('Laptop') || session.category.includes('Battery')) && (
                <div className="mb-8 pl-7">
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-[#334155] bg-[#0B1120]/60 hover:bg-[#0B1120] transition">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-[#F8FAFC] text-sm sm:text-base flex items-center gap-2">
                          <Upload className="w-4 h-4 text-[#22D3EE]" />
                          <span>Upload File or Screenshot</span>
                        </h4>
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                          {stepData.upload_hint || 'Upload battery-report.html, error screenshot, or system log.'}
                        </p>
                        <p className="text-[11px] text-[#FBBF24] mt-1 font-medium">
                          🔒 Privacy check: Please make sure no passwords or personal credentials are included.
                        </p>
                      </div>

                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#2563EB] text-[#F8FAFC] font-semibold text-xs sm:text-sm shadow-2xs hover:shadow transition">
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
                      <p className="text-xs text-[#F87171] mt-2 font-medium">
                        ⚠️ {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Tell Us What Happened (Interactive Choice Buttons) */}
              <div className="mb-8 pl-7 pt-4 border-t border-[#334155]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-3">
                  <span className="w-5 h-5 rounded-md bg-[#2563EB]/20 text-[#22D3EE] flex items-center justify-center font-extrabold text-[11px] border border-[#2563EB]/30">5</span>
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
                          ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80] hover:bg-[#4ADE80]/20'
                          : opt.action_type === 'need_simpler'
                          ? 'bg-[#FBBF24]/10 border-[#FBBF24]/30 text-[#FBBF24] hover:bg-[#FBBF24]/20'
                          : opt.action_type === 'tool_missing' || opt.action_type === 'error'
                          ? 'bg-[#1E293B] border-[#334155] text-[#CBD5E1] hover:bg-[#334155]/60'
                          : 'bg-[#0B1120] border-[#334155] text-[#F8FAFC] hover:border-[#2563EB] hover:bg-[#1E293B] shadow-2xs'
                      }`}
                    >
                      <span className="pr-2">{opt.label}</span>
                      <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#22D3EE] group-hover:translate-x-1 transition shrink-0" />
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
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-[#334155] focus:outline-none focus:border-[#2563EB] bg-[#0B1120] text-[#F8FAFC] placeholder-[#94A3B8]"
                  />
                </div>
              </div>

              {/* 6. What Happens Next */}
              <div className="pl-7 pt-4 border-t border-[#334155] flex items-start gap-2 text-xs sm:text-sm text-[#94A3B8]">
                <Info className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#CBD5E1]">What happens next: </span>
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
            <div className="bg-[#151F32] rounded-2xl border border-[#334155] p-5 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>What We Know So Far</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#CBD5E1]">
                {(stepData.what_we_know_so_far && stepData.what_we_know_so_far.length > 0) ? (
                  stepData.what_we_know_so_far.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#22D3EE]">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#94A3B8] italic">Gathering initial evidence...</li>
                )}
              </ul>
            </div>

            {/* What we need to check */}
            <div className="bg-[#151F32] rounded-2xl border border-[#334155] p-5 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>What We Need To Check</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#CBD5E1]">
                {(stepData.what_we_need_to_check && stepData.what_we_need_to_check.length > 0) ? (
                  stepData.what_we_need_to_check.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FBBF24]">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[#94A3B8] italic">No remaining checks.</li>
                )}
              </ul>
            </div>

          </div>
        )}

        {/* Clarification Drawer / Chat Component */}
        {showClarification && (
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6 shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#22D3EE]" />
                <h3 className="font-bold text-[#F8FAFC] text-sm sm:text-base">
                  Ask For Clarification Or Simpler Words
                </h3>
              </div>
              <button
                onClick={() => setShowClarification(false)}
                className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setClarificationQuestion('Can you explain this in simpler words?')}
                className="text-xs px-3 py-1.5 rounded-full bg-[#151F32] hover:bg-[#2563EB]/20 text-[#CBD5E1] hover:text-[#22D3EE] border border-[#334155] transition cursor-pointer"
              >
                "Explain in simpler words"
              </button>
              <button
                onClick={() => setClarificationQuestion('Is this test safe for my laptop and files?')}
                className="text-xs px-3 py-1.5 rounded-full bg-[#151F32] hover:bg-[#2563EB]/20 text-[#CBD5E1] hover:text-[#22D3EE] border border-[#334155] transition cursor-pointer"
              >
                "Is this test safe?"
              </button>
              <button
                onClick={() => setClarificationQuestion('I cannot find this tool on my computer.')}
                className="text-xs px-3 py-1.5 rounded-full bg-[#151F32] hover:bg-[#2563EB]/20 text-[#CBD5E1] hover:text-[#22D3EE] border border-[#334155] transition cursor-pointer"
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
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB]"
              />
              <button
                type="submit"
                disabled={clarificationLoading || !clarificationQuestion.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
