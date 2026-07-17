import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Laptop, Mail, Lock, User, ArrowRight, Loader2, RefreshCw, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { themeConfigs } from '../App';

interface AuthProps {
  theme: 'slate' | 'midnight' | 'nordic' | 'warm' | 'brutalist' | 'cyberneon';
  onAuthSuccess: (user: any) => void;
}

export default function Auth({ theme, onAuthSuccess }: AuthProps) {
  const [view, setView] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const cfg = themeConfigs[theme];

  // Stylings mapping for Auth screen
  const authStyles = {
    slate: {
      input: 'bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-800',
      label: 'text-slate-600',
      textMuted: 'text-slate-500',
      accentText: 'text-emerald-600 hover:text-emerald-500',
      button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/10',
      card: 'bg-white border-slate-200/80 shadow-xl shadow-slate-100'
    },
    midnight: {
      input: 'bg-slate-900/60 border-slate-800 focus:border-teal-400 focus:ring-teal-400/20 text-white',
      label: 'text-slate-300',
      textMuted: 'text-slate-400',
      accentText: 'text-teal-400 hover:text-teal-300',
      button: 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-teal-400/10',
      card: 'bg-[#0c1222] border-slate-800 shadow-2xl shadow-black/60'
    },
    nordic: {
      input: 'bg-white border-blue-100 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-800',
      label: 'text-slate-600',
      textMuted: 'text-slate-500',
      accentText: 'text-indigo-600 hover:text-indigo-500',
      button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/10',
      card: 'bg-white border-blue-100 shadow-xl shadow-blue-50/50'
    },
    warm: {
      input: 'bg-[#faf9f6] border-[#ebdcd0] focus:border-[#c2410c] focus:ring-[#c2410c]/20 text-[#2e2620]',
      label: 'text-[#7a6d61]',
      textMuted: 'text-[#8c7e73]',
      accentText: 'text-[#c2410c] hover:text-[#b43e0b]',
      button: 'bg-[#c2410c] hover:bg-[#b43e0b] text-white shadow-[#c2410c]/10',
      card: 'bg-[#fbf9f5] border-[#ebdcd0] shadow-lg'
    },
    brutalist: {
      input: 'bg-white border-2.5 border-black focus:bg-yellow-50 focus:ring-0 text-black font-mono rounded-none',
      label: 'text-black font-bold uppercase tracking-wide text-xs',
      textMuted: 'text-zinc-700 font-mono text-xs',
      accentText: 'text-black underline font-black uppercase',
      button: 'bg-[#facc15] text-black border-2.5 border-black font-black uppercase rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]',
      card: 'bg-white border-3 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono'
    },
    cyberneon: {
      input: 'bg-[#120a24]/60 border-fuchsia-500/30 focus:border-cyan-400 focus:ring-cyan-400/20 text-white font-mono',
      label: 'text-cyan-400 font-semibold tracking-wider uppercase text-[10px]',
      textMuted: 'text-cyan-400/50 font-mono text-[11px]',
      accentText: 'text-fuchsia-400 hover:text-fuchsia-300 font-bold drop-shadow-[0_0_2px_rgba(245,40,145,0.4)]',
      button: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:from-cyan-300 hover:to-fuchsia-400 text-black font-extrabold shadow-[0_0_15px_rgba(34,211,238,0.45)] hover:scale-[1.02] transform transition-all active:scale-[0.98]',
      card: 'bg-[#090514] border border-fuchsia-500/20 shadow-[0_0_30px_rgba(217,70,239,0.1)] rounded-2xl'
    }
  }[theme];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (view === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (authError) throw authError;
        if (data.user) {
          onAuthSuccess(data.user);
        }
      } else if (view === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
              role: 'Admin'
            }
          }
        });
        if (authError) throw authError;

        if (data.user) {
          // If auto-confirmed or we got a session immediately
          const session = data.session;
          if (session) {
            onAuthSuccess(data.user);
          } else {
            setInfoMessage('Account created successfully! Please check your email inbox to confirm your registration.');
            setView('login');
          }
        }
      } else if (view === 'forgot_password') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/`
        });
        if (resetError) throw resetError;
        setInfoMessage('Password reset link sent! Check your inbox to set a new password.');
        setView('login');
      }
    } catch (err: any) {
      console.error('Auth error details:', err);
      setError(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${cfg.bgMain} transition-colors duration-300 relative overflow-hidden`}>
      {/* Background neon glows for cyberneon theme */}
      {theme === 'cyberneon' && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        </>
      )}

      <div className={`w-full max-w-md ${authStyles.card} border p-8 relative z-10 transition-all ${theme === 'brutalist' ? '' : 'rounded-2xl shadow-xl'}`}>
        
        {/* Brand/Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className={`h-12 w-12 flex items-center justify-center mb-3 transition-all ${
            theme === 'brutalist' 
              ? 'bg-[#facc15] border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
              : theme === 'cyberneon' 
              ? 'bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.5)]'
              : 'bg-emerald-500 text-slate-900 rounded-2xl shadow-lg shadow-emerald-500/10'
          }`}>
            <Laptop className="h-6 w-6" />
          </div>
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${
              theme === 'brutalist' 
                ? 'font-black uppercase text-black font-mono' 
                : theme === 'cyberneon' 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-500' 
                : cfg.heading
            }`}>
              SaaS-Optima
            </h1>
            <p className={`text-xs mt-1 font-semibold ${authStyles.textMuted}`}>
              {view === 'login' && 'Sign in to access your SaaS optimization hub'}
              {view === 'signup' && 'Create an account to start tracking waste'}
              {view === 'forgot_password' && 'Enter your email to receive a recovery link'}
            </p>
          </div>
        </div>

        {/* Message alerts */}
        {error && (
          <div className={`p-4 mb-6 rounded-lg flex flex-col gap-2 text-xs leading-relaxed border ${
            theme === 'midnight' || theme === 'cyberneon'
              ? 'bg-rose-950/40 border-rose-800/40 text-rose-400'
              : theme === 'brutalist'
              ? 'bg-rose-100 border-2 border-black text-black font-bold rounded-none'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 opacity-95 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
            
            {/* Custom guidance for Email Confirmation */}
            {(error.toLowerCase().includes('email not confirmed') || error.toLowerCase().includes('confirm')) && (
              <div className={`mt-2 p-2.5 rounded-md text-[11px] leading-relaxed ${
                theme === 'midnight' || theme === 'cyberneon'
                  ? 'bg-rose-950/60 border border-rose-800/40 text-rose-300'
                  : theme === 'brutalist'
                  ? 'bg-white border-2 border-black text-black rounded-none mt-1'
                  : 'bg-white border border-rose-100 text-rose-700 shadow-sm'
              }`}>
                <p className="font-bold mb-1">📬 Verification Required</p>
                <p>We've sent a verification link to your email address. Please open your inbox (and check your <strong>spam/junk folder</strong>) to confirm your email before signing in.</p>
              </div>
            )}

            {/* Custom guidance for Invalid Credentials */}
            {(error.toLowerCase().includes('invalid login credentials') || error.toLowerCase().includes('invalid credentials')) && (
              <div className={`mt-2 p-2.5 rounded-md text-[11px] leading-relaxed ${
                theme === 'midnight' || theme === 'cyberneon'
                  ? 'bg-rose-950/60 border border-rose-800/40 text-rose-300'
                  : theme === 'brutalist'
                  ? 'bg-white border-2 border-black text-black rounded-none mt-1'
                  : 'bg-white border border-rose-100 text-rose-700 shadow-sm'
              }`}>
                <p className="font-bold mb-1">🔑 Help Signing In</p>
                <p>Double-check your email address and password. If you don't have an enterprise workspace account yet, please click <strong>Sign Up</strong> below to create one instantly.</p>
              </div>
            )}
          </div>
        )}

        {infoMessage && (
          <div className={`p-4 mb-6 rounded-lg flex items-start gap-3 text-xs leading-relaxed ${
            theme === 'midnight' || theme === 'cyberneon'
              ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-400'
              : theme === 'brutalist'
              ? 'bg-yellow-100 border-2 border-black text-black font-bold rounded-none'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}>
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 opacity-95" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleAuth} className="space-y-5">
          {view === 'signup' && (
            <div className="space-y-1.5">
              <label className={`text-xs font-bold block ${authStyles.label}`}>
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none opacity-50">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${authStyles.input}`}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className={`text-xs font-bold block ${authStyles.label}`}>
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none opacity-50">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${authStyles.input}`}
              />
            </div>
          </div>

          {view !== 'forgot_password' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`text-xs font-bold block ${authStyles.label}`}>
                  Password
                </label>
                {view === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setView('forgot_password'); setError(null); setInfoMessage(null); }}
                    className={`text-[11px] font-medium transition ${authStyles.accentText}`}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none opacity-50">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all ${authStyles.input}`}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${authStyles.button}`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>
                  {view === 'login' && 'Sign In to Dashboard'}
                  {view === 'signup' && 'Create Enterprise Account'}
                  {view === 'forgot_password' && 'Send Recovery Email'}
                </span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        {/* View toggles */}
        <div className={`mt-6 pt-6 border-t text-center text-xs ${theme === 'midnight' ? 'border-slate-800/80' : theme === 'warm' ? 'border-[#ebdcd0]' : theme === 'brutalist' ? 'border-t-2 border-black' : theme === 'cyberneon' ? 'border-fuchsia-500/10' : 'border-slate-100'}`}>
          {view === 'login' && (
            <p className={authStyles.textMuted}>
              Don't have an enterprise workspace?{' '}
              <button
                type="button"
                onClick={() => { setView('signup'); setError(null); setInfoMessage(null); }}
                className={`font-semibold transition ${authStyles.accentText}`}
              >
                Sign Up
              </button>
            </p>
          )}

          {view === 'signup' && (
            <p className={authStyles.textMuted}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setView('login'); setError(null); setInfoMessage(null); }}
                className={`font-semibold transition ${authStyles.accentText}`}
              >
                Sign In
              </button>
            </p>
          )}

          {view === 'forgot_password' && (
            <button
              type="button"
              onClick={() => { setView('login'); setError(null); setInfoMessage(null); }}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline transition ${authStyles.accentText}`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
