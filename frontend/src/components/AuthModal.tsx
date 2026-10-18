import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  LogIn,
  UserPlus,
  Eye,
  EyeOff
} from 'lucide-react';
import { User } from '../types';
import { api } from '../api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

const isValidEmail = (val: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
};

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialMode = 'login'
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMode === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
    setError(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (activeTab === 'register' && !name.trim()) {
      setError('Please enter your full name for registration.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'register') {
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
      setError(err.message || (activeTab === 'register' ? 'Registration failed. Email may already be in use.' : 'Login failed. Please check your email and password.'));
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl relative text-left my-8 border border-[#E2E8F0]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xs border border-[#E2E8F0] bg-[#EFF6FF] flex items-center justify-center mx-auto mb-3 p-1">
            <img src="/logo.png" alt="TechResolve AI" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            {activeTab === 'login' ? 'Log In to Your Account' : 'Create Your Account'}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            {activeTab === 'login' 
              ? 'Enter your email and password to access your saved sessions and diagnostics.' 
              : 'Register to save your diagnostic history and access your troubleshooting guides.'}
          </p>
        </div>

        {/* 2-Tab Switcher: Log In / Register */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl mb-5 text-sm font-semibold">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs font-bold'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Log In</span>
          </button>
          
          <button
            type="button"
            onClick={() => switchTab('register')}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs font-bold'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs font-medium flex items-start gap-2">
            <span className="shrink-0 text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name for Registration */}
          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Full Name <span className="text-[#B91C1C]">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Email Address <span className="text-[#B91C1C]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Password <span className="text-[#B91C1C]">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-sm shadow-xs transition cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Processing...' : activeTab === 'register' ? 'Create Account' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Tab Switcher Footer */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
          {activeTab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('register')}
                className="text-[#2563EB] hover:underline font-semibold cursor-pointer"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="text-[#2563EB] hover:underline font-semibold cursor-pointer"
              >
                Log In here
              </button>
            </p>
          )}
        </div>

        {/* Continue as Guest option */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
          >
            Continue as Guest without signing in
          </button>
        </div>

      </div>
    </div>
  );
};
