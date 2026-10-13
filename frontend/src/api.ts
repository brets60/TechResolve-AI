import type {
  User,
  TroubleshootingSession,
  SessionMessage,
  KnowledgeArticle,
  SystemSettings,
  TroubleshootingMode,
  CmdItem,
  CmdOutputTranslation,
  OtpResponse
} from './types';

// Use Railway API when running inside native Android APK bundle
const API_BASE = (typeof window !== 'undefined' && window.location.hostname === 'localhost' && !window.location.port)
  ? 'https://techresolve-ai-production.up.railway.app/api'
  : '/api';

class ApiClient {
  private token: string | null = localStorage.getItem('techresolve_token');

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('techresolve_token', token);
    } else {
      localStorage.removeItem('techresolve_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errMessage = 'An unexpected error occurred';
      try {
        const errorData = await res.json();
        errMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
      } catch {
        errMessage = res.statusText;
      }
      throw new Error(errMessage);
    }

    return res.json();
  }

  // Auth
  async register(data: { email: string; name: string; password: string; preferred_mode?: string }) {
    const res = await this.request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  async login(data: { email: string; password: string }) {
    const res = await this.request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  async sendOtp(email: string, purpose: string = 'login_register'): Promise<OtpResponse> {
    return this.request<OtpResponse>('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    });
  }

  async verifyOtp(data: { email: string; code: string; name?: string; preferred_mode?: string }) {
    const res = await this.request<{ access_token: string; user: User }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  async googleAuth(data: {
    credential?: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    google_id?: string;
  }) {
    const res = await this.request<{ access_token: string; user: User }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  async getMe(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async updateMode(mode: TroubleshootingMode): Promise<User> {
    return this.request<User>(`/auth/mode?mode=${mode}`, {
      method: 'PATCH',
    });
  }

  logout() {
    this.setToken(null);
  }

  // Sessions
  async listSessions(): Promise<TroubleshootingSession[]> {
    return this.request<TroubleshootingSession[]>('/troubleshoot/sessions');
  }

  async createSession(data: {
    title: string;
    category?: string;
    problem_description: string;
    mode?: TroubleshootingMode;
  }): Promise<TroubleshootingSession> {
    return this.request<TroubleshootingSession>('/troubleshoot/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSession(sessionId: string): Promise<TroubleshootingSession> {
    return this.request<TroubleshootingSession>(`/troubleshoot/sessions/${sessionId}`);
  }

  async sendStepResponse(
    sessionId: string,
    data: {
      chosen_option_key?: string;
      chosen_option_label?: string;
      custom_feedback?: string;
      action_type?: string;
    }
  ): Promise<SessionMessage> {
    return this.request<SessionMessage>(`/troubleshoot/sessions/${sessionId}/step`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async askClarification(sessionId: string, question: string): Promise<SessionMessage> {
    return this.request<SessionMessage>(`/troubleshoot/sessions/${sessionId}/ask`, {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  async switchSessionMode(sessionId: string, mode: TroubleshootingMode): Promise<TroubleshootingSession> {
    return this.request<TroubleshootingSession>(`/troubleshoot/sessions/${sessionId}/mode?mode=${mode}`, {
      method: 'PATCH',
    });
  }

  async deleteSession(sessionId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/troubleshoot/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Uploads
  async uploadFile(sessionId: string, file: File, notes?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (notes) {
      formData.append('notes', notes);
    }
    return this.request(`/troubleshoot/sessions/${sessionId}/upload`, {
      method: 'POST',
      body: formData,
    });
  }

  // Knowledge Base
  async getKnowledgeArticles(query?: string, category?: string): Promise<KnowledgeArticle[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category && category !== 'All') params.append('category', category);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<KnowledgeArticle[]>(`/knowledge${qs}`);
  }

  async getKnowledgeArticle(id: string): Promise<KnowledgeArticle> {
    return this.request<KnowledgeArticle>(`/knowledge/${id}`);
  }

  async launchInteractiveTroubleshoot(id: string): Promise<TroubleshootingSession> {
    return this.request<TroubleshootingSession>(`/knowledge/${id}/troubleshoot`, {
      method: 'POST',
    });
  }

  // Settings
  async getSettings(): Promise<SystemSettings> {
    return this.request<SystemSettings>('/settings');
  }

  async updateGeminiKey(apiKey: string): Promise<{ success: boolean; message: string; gemini_configured: boolean }> {
    return this.request('/settings/gemini-key', {
      method: 'POST',
      body: JSON.stringify({ api_key: apiKey }),
    });
  }

  // CMD Helper API
  async getCmdLibrary(query?: string, category?: string): Promise<CmdItem[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category && category !== 'All') params.append('category', category);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<CmdItem[]>(`/cmd/library${qs}`);
  }

  async explainCommand(command: string, mode?: string): Promise<CmdItem> {
    return this.request<CmdItem>('/cmd/explain', {
      method: 'POST',
      body: JSON.stringify({ command, mode }),
    });
  }

  async explainCmd(command: string, mode?: string): Promise<CmdItem> {
    return this.explainCommand(command, mode);
  }

  async translateCmdOutput(command: string, outputText: string): Promise<CmdOutputTranslation> {
    return this.request<CmdOutputTranslation>('/cmd/translate-output', {
      method: 'POST',
      body: JSON.stringify({ command, output_text: outputText }),
    });
  }
}

export const api = new ApiClient();
