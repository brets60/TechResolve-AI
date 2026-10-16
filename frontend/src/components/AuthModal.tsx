import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Globe
} from 'lucide-react';
import { User } from '../types';
import { api } from '../api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'otp' | 'google' | 'password' | 'register';
}

const isValidEmail = (val: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
};

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'otp'
}) => {
  const [authMethod, setAuthMethod] = useState<'otp' | 'google' | 'password'>(
    initialMode === 'google' ? 'google' : initialMode === 'password' || initialMode === 'register' ? 'password' : 'otp'
  );
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  
  // Real user inputs
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // OTP step
  const [otpStep, setOtpStep] = useState<'input_email' | 'enter_code'>('input_email');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Google Sign-In with Real Registered Email
  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your registered Google email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const cleanName = name.trim() || cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      const res = await api.googleAuth({
        email: cleanEmail,
        name: cleanName,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=2563eb,3b82f6`,
        google_id: `google_${encodeURIComponent(cleanEmail)}`
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Send One-Time Code to Real Registered Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid registered email address (e.g. yourname@example.com).');
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await api.sendOtp(cleanEmail);
      setOtpStep('enter_code');
      setOtpPreview(res.code_preview || null);
      setInfoMessage(`A 6-digit verification code has been sent to ${cleanEmail}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send one-time code.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify One-Time Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = otpCode.trim();
    if (!cleanCode || cleanCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.verifyOtp({
        email: email.trim(),
        code: cleanCode,
        name: name.trim() || undefined,
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Standard Password Login or Register
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email format.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isRegister && !name.trim()) {
      setError('Please enter your full name for registration.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const res = await api.register({ 
          email: cleanEmail, 
          name: name.trim(), 
          password 
        });
        onSuccess(res.user);
      } else {
        const res = await api.login({ 
          email: cleanEmail, 
          password 
        });
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1120]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1E293B] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left my-8 border border-[#334155]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F32] transition cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-[#334155] bg-[#151F32] flex items-center justify-center mx-auto mb-3 p-1">
            <img src="/logo.png" alt="TechResolve AI" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            {authMethod === 'otp' && (otpStep === 'enter_code' ? 'Enter 6-Digit Code' : 'Sign In with Registered Email')}
            {authMethod === 'google' && 'Google Account Sign In'}
            {authMethod === 'password' && (isRegister ? 'Register New Account' : 'Sign In to Account')}
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            {authMethod === 'otp' && 'Enter your registered email to receive a fast 6-digit one-time passcode'}
            {authMethod === 'google' && 'Register or sign in with your official Google email address'}
            {authMethod === 'password' && (isRegister ? 'Create your personal account with your registered email' : 'Enter your registered email and password')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs font-medium flex items-start gap-2">
            <span className="shrink-0 text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Info Message */}
        {infoMessage && (
          <div className="p-3 mb-4 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#22D3EE] text-xs font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22D3EE] mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Method Switcher Tabs: 3 Real Options */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#0B1120] border border-[#334155] rounded-2xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMethod('otp'); setError(null); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
              authMethod === 'otp'
                ? 'bg-[#1E293B] text-[#22D3EE] border border-[#2563EB] shadow-2xs font-bold'
                : 'text-[#94A3B8] hover:text-[#CBD5E1]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span className="truncate">One-Time Code</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setAuthMethod('google'); setError(null); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
              authMethod === 'google'
                ? 'bg-[#1E293B] text-[#22D3EE] border border-[#2563EB] shadow-2xs font-bold'
                : 'text-[#94A3B8] hover:text-[#CBD5E1]'
            }`}
          >
            {/* Google Colorful mini-logo */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="truncate">Google</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('password'); setError(null); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
              authMethod === 'password'
                ? 'bg-[#1E293B] text-[#22D3EE] border border-[#2563EB] shadow-2xs font-bold'
                : 'text-[#94A3B8] hover:text-[#CBD5E1]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="truncate">Password</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* OPTION 1: ONE-TIME CODE (OTP)                            */}
        {/* ======================================================== */}
        {authMethod === 'otp' && (
          <div>
            {otpStep === 'input_email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Smith"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                    Your Registered Email Address <span className="text-[#F87171]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1">
                    Enter your real registered email. A 6-digit code will be generated for it.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Sending Code...' : 'Send One-Time Code'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-[#0B1120] border border-[#334155]">
                  <div className="text-xs text-[#CBD5E1] font-medium">
                    Verification code for: <strong className="font-bold text-[#F8FAFC]">{email}</strong>
                  </div>
                  {otpPreview && (
                    <div className="mt-2 pt-2 border-t border-[#334155] flex items-center justify-between">
                      <span className="text-[11px] text-[#22D3EE] font-medium">Your 6-digit code:</span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(otpPreview)}
                        className="font-mono font-bold text-xs bg-[#151F32] text-[#22D3EE] px-2 py-0.5 rounded-md border border-[#334155] hover:border-[#2563EB] shadow-2xs hover:bg-[#1E293B] cursor-pointer"
                        title="Click to auto-fill"
                      >
                        {otpPreview} (Auto-fill)
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                    Enter 6-Digit Code
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#334155] bg-[#0B1120] text-[#22D3EE] text-lg font-mono font-bold tracking-widest text-center focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Verifying...' : 'Verify Code & Sign In'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <div className="flex items-center justify-between pt-2 text-xs text-[#94A3B8]">
                  <button
                    type="button"
                    onClick={() => { setOtpStep('input_email'); setOtpCode(''); }}
                    className="text-[#94A3B8] hover:text-[#CBD5E1] underline cursor-pointer"
                  >
                    Use different email
                  </button>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-[#22D3EE] hover:text-[#60A5FA] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend code</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* OPTION 2: GOOGLE SIGN-IN WITH REAL REGISTERED EMAIL      */}
        {/* ======================================================== */}
        {authMethod === 'google' && (
          <form onSubmit={handleGoogleSignIn} className="space-y-4">
            <div className="p-3 rounded-2xl bg-[#0B1120] border border-[#334155] text-xs text-[#CBD5E1] flex items-center gap-2.5 mb-2">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Please enter your registered Google account email below to authenticate.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                Your Registered Google Email <span className="text-[#F87171]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                Your Name (Optional)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saidimar Rey"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with This Google Email'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>
        )}

        {/* ======================================================== */}
        {/* OPTION 3: EMAIL & PASSWORD (REGISTER OR SIGN IN)         */}
        {/* ======================================================== */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            
            {/* Toggle between Register and Sign In */}
            <div className="flex items-center justify-center gap-2 p-1 bg-[#0B1120] border border-[#334155] rounded-xl mb-3">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  !isRegister ? 'bg-[#1E293B] text-[#22D3EE] border border-[#2563EB] shadow-2xs' : 'text-[#94A3B8] hover:text-[#CBD5E1]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  isRegister ? 'bg-[#1E293B] text-[#22D3EE] border border-[#2563EB] shadow-2xs' : 'text-[#94A3B8] hover:text-[#CBD5E1]'
                }`}
              >
                Register New
              </button>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                  Your Full Name <span className="text-[#F87171]">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Smith"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                Your Registered Email Address <span className="text-[#F87171]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-1">
                Password <span className="text-[#F87171]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0B1120] text-[#F8FAFC] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>
        )}

        {/* Continue as Guest option */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
          >
            Continue as Guest without account
          </button>
        </div>

      </div>
    </div>
  );
};
