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
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <button
            onClick={handleToggleSessionMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              session.mode === 'beginner'
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
            title="Click to toggle between Beginner and IT Pro mode"
          >
            {session.mode === 'beginner' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Beginner Mode (Simple English)</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>IT Professional Mode (CLI & Logs)</span>
              </>
            )}
          </button>

          {/* Ask AI button */}
          <button
            onClick={() => setShowClarification(!showClarification)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Ask for Clarification</span>
          </button>
        </div>
      </div>

      {/* Problem Title Card */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 shadow-sm mb-8 border border-white/90">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
            {session.category}
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            session.status === 'solved' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs' 
              : 'bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs'
          }`}>
            {session.status === 'solved' ? '✓ Problem Solved' : '● Live Diagnostic In Progress'}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
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
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : isCompleted
                    ? 'glass-panel text-emerald-700 border-emerald-200 shadow-2xs'
                    : 'glass-panel text-slate-400 border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-white text-blue-600'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
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
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold">Important Safety Notice: </span>
              {stepData.safety_warning}
            </div>
          </div>
        )}

        {/* Battery Health Visual Gauge (When Battery Report Uploaded or Parsed) */}
        {batteryData && batteryData.is_valid && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Battery className={`w-5 h-5 ${
                  (batteryData.health_percentage ?? 100) < 50 ? 'text-red-500' : 'text-emerald-600'
                }`} />
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Battery Health Diagnostic
                </h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                (batteryData.health_percentage ?? 100) < 50 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {batteryData.summary_verdict}
              </span>
            </div>

            {/* Health Meter */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                <span>Current Capacity vs Original Design</span>
                <span className="font-bold text-slate-900">{batteryData.health_percentage}% Health</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div 
                  className={`h-full transition-all duration-500 ${
                    (batteryData.health_percentage ?? 100) < 50 
                      ? 'bg-red-500' 
                      : (batteryData.health_percentage ?? 100) < 75
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, batteryData.health_percentage || 0)}%` }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">Design Capacity</div>
                <div className="font-bold text-slate-800 text-sm sm:text-base">
                  {batteryData.design_capacity_mwh?.toLocaleString()} mWh
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">Full Charge Capacity</div>
                <div className="font-bold text-slate-800 text-sm sm:text-base">
                  {batteryData.full_charge_capacity_mwh?.toLocaleString()} mWh
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">Wear Level</div>
                <div className="font-bold text-red-600 text-sm sm:text-base">
                  {batteryData.wear_percentage}% Lost
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">Cycle Count</div>
                <div className="font-bold text-slate-800 text-sm sm:text-base">
                  {batteryData.cycle_count || 'N/A'}
                </div>
              </div>
            </div>

            {/* Plain English explanation */}
            <p className="text-sm text-slate-700 bg-blue-50/60 p-4 rounded-xl border border-blue-100 leading-relaxed">
              💡 <span className="font-semibold text-slate-900">What this means: </span>
              {batteryData.plain_english_explanation}
            </p>
          </div>
        )}

        {/* SOLVED STATE: Final Report Card */}
        {session.status === 'solved' && session.final_summary ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-sm text-left">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Problem Solved Successfully!
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
              {session.final_summary.summary || 'Your troubleshooting steps were completed and your device is verified working.'}
            </p>

            {/* Confirmed Facts */}
            {session.final_summary.confirmed_facts && session.final_summary.confirmed_facts.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  What We Verified:
                </h4>
                <ul className="space-y-1.5">
                  {session.final_summary.confirmed_facts.map((fact, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prevention Tips */}
            {session.final_summary.prevention_tips && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  How To Prevent This in the Future:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                  {session.final_summary.prevention_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Diagnostic Summary</span>
              </button>
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition"
              >
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE STEP: Strict 6-Part Step Card */
          stepData && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              
              {/* Assistant Message */}
              {latestAssistantMessage?.content && (
                <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-slate-800 text-sm sm:text-base leading-relaxed flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    IT
                  </div>
                  <div>
                    <span className="font-semibold text-blue-900 block mb-0.5">TechResolve Support</span>
                    <p>{latestAssistantMessage.content}</p>
                  </div>
                </div>
              )}

              {/* 1. What We Are Checking */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
                  <span className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-[11px]">1</span>
                  <span>What We Are Checking</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 pl-7">
                  {stepData.what_we_are_checking}
                </h3>
              </div>

              {/* 2. Why It Matters */}
              <div className="mb-6 pl-7">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  <span>Why This Matters:</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {stepData.why_it_matters}
                </p>
              </div>

              {/* 3. What To Do (Numbered steps) */}
              <div className="mb-6 pl-7">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  <span className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-[11px]">3</span>
                  <span>What To Do:</span>
                </div>
                <div className="space-y-2">
                  {stepData.what_to_do.map((instruction, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-800">
                      <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed whitespace-pre-line">{instruction}</span>
                    </div>
                  ))}
                </div>

                {/* Command box if command present */}
                {stepData.command_to_run && (
                  <div className="mt-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-slate-800 text-xs sm:text-sm shadow-2xs">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-blue-200/60">
                      <span className="text-blue-900 font-semibold text-xs flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-blue-600" />
                        <span>Command to type into Command Prompt:</span>
                      </span>
                      <button
                        onClick={() => handleCopy(stepData.command_to_run!)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 bg-white border border-blue-200 px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer"
                      >
                        {copiedCommand ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCommand ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-blue-950 select-all font-mono font-bold text-sm bg-white/80 p-2.5 rounded-xl border border-blue-100">
                      {stepData.command_to_run}
                    </div>
                    {stepData.command_explanation && (
                      <p className="mt-2.5 text-slate-600 text-xs font-sans">
                        💡 {stepData.command_explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 4. What Should Happen */}
              <div className="mb-8 pl-7">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  <span>What Should Happen:</span>
                </div>
                <p className="text-sm text-slate-600 italic">
                  "{stepData.what_should_happen}"
                </p>
              </div>

              {/* File Upload Zone (If step allows file upload) */}
              {(stepData.allows_file_upload || session.category.includes('Laptop') || session.category.includes('Battery')) && (
                <div className="mb-8 pl-7">
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50/60 transition">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                          <Upload className="w-4 h-4 text-blue-600" />
                          <span>Upload File or Screenshot</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {stepData.upload_hint || 'Upload battery-report.html, error screenshot, or system log.'}
                        </p>
                        <p className="text-[11px] text-amber-700 mt-1 font-medium">
                          🔒 Privacy check: Please make sure no passwords or personal credentials are included.
                        </p>
                      </div>

                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs hover:shadow transition">
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
                      <p className="text-xs text-red-600 mt-2 font-medium">
                        ⚠️ {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Tell Us What Happened (Interactive Choice Buttons) */}
              <div className="mb-8 pl-7 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-3">
                  <span className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-[11px]">5</span>
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
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                          : opt.action_type === 'need_simpler'
                          ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                          : opt.action_type === 'tool_missing' || opt.action_type === 'error'
                          ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          : 'bg-white border-blue-200 text-blue-900 hover:border-blue-500 hover:bg-blue-50/50 shadow-2xs'
                      }`}
                    >
                      <span className="pr-2">{opt.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition shrink-0" />
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
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-blue-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* 6. What Happens Next */}
              <div className="pl-7 pt-4 border-t border-slate-100 flex items-start gap-2 text-xs sm:text-sm text-slate-500">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">What happens next: </span>
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
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>What We Know So Far</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                {(stepData.what_we_know_so_far && stepData.what_we_know_so_far.length > 0) ? (
                  stepData.what_we_know_so_far.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">Gathering initial evidence...</li>
                )}
              </ul>
            </div>

            {/* What we need to check */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>What We Need To Check</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                {(stepData.what_we_need_to_check && stepData.what_we_need_to_check.length > 0) ? (
                  stepData.what_we_need_to_check.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No remaining checks.</li>
                )}
              </ul>
            </div>

          </div>
        )}

        {/* Clarification Drawer / Chat Component */}
        {showClarification && (
          <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Ask For Clarification Or Simpler Words
                </h3>
              </div>
              <button
                onClick={() => setShowClarification(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setClarificationQuestion('Can you explain this in simpler words?')}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
              >
                "Explain in simpler words"
              </button>
              <button
                onClick={() => setClarificationQuestion('Is this test safe for my laptop and files?')}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
              >
                "Is this test safe?"
              </button>
              <button
                onClick={() => setClarificationQuestion('I cannot find this tool on my computer.')}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
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
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-600"
              />
              <button
                type="submit"
                disabled={clarificationLoading || !clarificationQuestion.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
};
