export type TroubleshootingMode = 'beginner' | 'pro';
export type TroubleshootingStatus = 'not_started' | 'in_progress' | 'solved' | 'needs_help';
export type TroubleshootingStage = 'understanding' | 'checking' | 'trying_solution' | 'confirming_fix';

export interface User {
  id: number;
  email: string;
  name: string;
  preferred_mode: TroubleshootingMode;
  created_at: string;
}

export interface WizardOption {
  key: string;
  label: string;
  action_type?: 'normal' | 'need_simpler' | 'tool_missing' | 'error' | 'solved' | 'not_solved' | 'clarification';
  description?: string;
}

export interface BatteryAnalysis {
  is_valid: boolean;
  computer_name?: string;
  design_capacity_mwh?: number;
  full_charge_capacity_mwh?: number;
  cycle_count?: number;
  health_percentage?: number;
  wear_percentage?: number;
  summary_verdict?: string;
  plain_english_explanation?: string;
  recommendation?: string;
  needs_replacement?: boolean;
}

export interface StepStructuredData {
  what_we_are_checking: string;
  why_it_matters: string;
  what_to_do: string[];
  what_should_happen: string;
  tell_us_what_happened_options: WizardOption[];
  what_happens_next: string;
  what_we_know_so_far?: string[];
  what_we_need_to_check?: string[];
  next_action_title?: string;
  safety_warning?: string;
  command_to_run?: string;
  command_explanation?: string;
  allows_file_upload?: boolean;
  upload_hint?: string;
  battery_analysis?: BatteryAnalysis;
}

export interface SessionMessage {
  id: number;
  session_id: string;
  sender: 'assistant' | 'user' | 'system';
  message_type: 'wizard_step' | 'clarification' | 'user_response' | 'system_alert' | 'report';
  step_number?: number;
  stage?: TroubleshootingStage;
  content: string;
  structured_data?: StepStructuredData;
  created_at: string;
}

export interface UploadedFile {
  id: string;
  session_id: string;
  filename: string;
  file_type: 'battery_report' | 'screenshot' | 'log' | 'other';
  analysis_summary?: string;
  parsed_data?: Record<string, any>;
  created_at: string;
}

export interface TroubleshootingSession {
  id: string;
  user_id?: number | null;
  title: string;
  category: string;
  problem_description: string;
  mode: TroubleshootingMode;
  status: TroubleshootingStatus;
  current_stage: TroubleshootingStage;
  current_step_number: number;
  diagnostic_data?: {
    confirmed_facts?: string[];
    battery_analysis?: BatteryAnalysis;
    source_article_id?: string;
  };
  final_summary?: {
    outcome?: string;
    summary?: string;
    confirmed_facts?: string[];
    prevention_tips?: string[];
  };
  created_at: string;
  updated_at: string;
  messages?: SessionMessage[];
  files?: UploadedFile[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  difficulty: string;
  estimated_time: string;
  tags: string[];
  common_causes?: string[];
  signs_to_look_for?: string[];
  steps?: {
    step: number;
    title: string;
    instruction: string;
    why: string;
  }[];
  expected_results?: string;
  safety_warning?: string;
  technician_trigger?: string;
}

export interface SystemSettings {
  gemini_configured: boolean;
  gemini_model: string;
  app_version: string;
  active_mode: TroubleshootingMode;
  engine_status: string;
}

// CMD Command Helper Types
export interface CmdItem {
  id: string;
  command: string;
  name: string;
  category: string;
  description: string;
  safety_level: string;
  safety_badge: 'safe' | 'moderate' | 'danger';
  requires_admin: boolean;
  flags_explanation: { flag: string; meaning: string }[];
  expected_output: string;
  what_to_look_for: string;
  how_to_run_steps: string[];
  is_dangerous?: boolean;
}

export interface CmdOutputTranslation {
  status: 'success' | 'warning' | 'error' | 'info' | 'danger';
  summary: string;
  plain_english_meaning: string;
  recommended_next_step: string;
}
