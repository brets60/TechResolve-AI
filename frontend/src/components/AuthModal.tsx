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
  Sparkles
} from 'lucide-react';
import { User } from '../types';
import { api } from '../api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'otp' | 'password' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'otp'
}) => {
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>(initialMode === 'password' ? 'password' : 'otp');
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // OTP step state
  const [otpStep, setOtpStep] = useState<'input_email' | 'enter_code'>('input_email');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // If user typed an email, use it; otherwise provide quick Google Auth prompt
      const targetEmail = email.trim() || 'user.techresolve@gmail.com';
      const targetName = name.trim() || targetEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const res = await api.googleAuth({
        email: targetEmail,
        name: targetName,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetName)}&backgroundColor=2563eb,3b82f6`,
        google_id: `google_${Date.now()}`
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Send One-Time Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await api.sendOtp(email.trim());
      setOtpStep('enter_code');
      setOtpPreview(res.code_preview || null);
      setInfoMessage(`A 6-digit verification code was sent to ${email.trim()}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send one-time code');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify One-Time Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.verifyOtp({
        email: email.trim(),
        code: otpCode.trim(),
        name: name.trim() || undefined,
      });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Standard Password Login / Register
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const res = await api.register({ email: email.trim(), name: name.trim(), password });
        onSuccess(res.user);
      } else {
        const res = await api.login({ email: email.trim(), password });
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left my-8 border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 bg-white flex items-center justify-center mx-auto mb-3 p-1">
            <img src="/logo.png" alt="TechResolve AI" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {authMethod === 'otp'
              ? (otpStep === 'enter_code' ? 'Enter Verification Code' : 'Sign In or Register')
              : (isRegister ? 'Create Your Account' : 'Welcome Back')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {authMethod === 'otp'
              ? (otpStep === 'enter_code' 
                  ? 'We generated a fast 6-digit one-time code for you'
                  : 'Instant access with Google or a One-Time verification code')
              : (isRegister 
                  ? 'Save your troubleshooting progress & history' 
                  : 'Access your sessions and custom IT tools')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
            <span className="shrink-0 text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Info Message */}
        {infoMessage && (
          <div className="p-3 mb-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* --- GOOGLE SIGN-IN BUTTON --- */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-2xs transition flex items-center justify-center gap-3 cursor-pointer group"
          >
            {/* Google Colorful SVG Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="group-hover:text-slate-900">Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Or continue with
          </span>
          <div className="border-t border-slate-200 w-full"></div>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMethod('otp'); setError(null); }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === 'otp'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>One-Time Code</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setAuthMethod('password'); setError(null); }}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === 'password'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Password</span>
          </button>
        </div>

        {/* --- METHOD 1: ONE-TIME CODE (OTP) --- */}
        {authMethod === 'otp' && (
          <div>
            {otpStep === 'input_email' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Smith"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-600 focus:border-blue-600 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-600 focus:border-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    We will generate a quick 6-digit login code. No password required!
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Sending Code...' : 'Send One-Time Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80">
                  <div className="text-xs text-blue-900 font-medium">
                    Code sent to <span className="font-bold">{email}</span>
                  </div>
                  {otpPreview && (
                    <div className="mt-2 pt-2 border-t border-blue-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-blue-700 font-medium">Your 6-digit code:</span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(otpPreview)}
                        className="font-mono font-bold text-xs bg-white text-blue-600 px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs hover:bg-blue-50 cursor-pointer"
                        title="Click to auto-fill"
                      >
                        {otpPreview} (Auto-fill)
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Enter 6-Digit Code
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-lg font-mono font-bold tracking-widest text-center focus:outline-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Verifying...' : 'Verify Code & Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => { setOtpStep('input_email'); setOtpCode(''); }}
                    className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Change email
                  </button>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend code</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- METHOD 2: EMAIL & PASSWORD --- */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Smith"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Sign Up' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              {isRegister ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(false); setError(null); }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(true); setError(null); }}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Create one now
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        {/* Continue as Guest option */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Continue as Guest without account
          </button>
        </div>

      </div>
    </div>
  );
};
