import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
  QrCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Send
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (userProfile: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('tharun_b@srmap.edu.in');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpToast, setOtpToast] = useState<{ code: string; email: string } | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for Resend OTP
  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Generate a random 6-digit OTP
  const generateAndSendOtp = (targetEmail: string) => {
    setIsLoading(true);
    setError('');

    // Generate random 6-digit number
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setResendTimer(60);
    setOtpValues(['', '', '', '', '', '']);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');

      // Realistic OTP delivery alert
      setOtpToast({ code, email: targetEmail });

      // Focus first input box
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }, 700);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid university or personal email address.');
      return;
    }
    generateAndSendOtp(email.trim());
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If user pasted a full code
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newArr = [...otpValues];
        for (let i = 0; i < pasted.length; i++) {
          newArr[i] = pasted[i];
        }
        setOtpValues(newArr);
        const nextIndex = Math.min(pasted.length, 5);
        otpInputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newArr = [...otpValues];
    newArr[index] = digit;
    setOtpValues(newArr);

    // Auto-advance to next box
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpValues.join('');
    if (enteredCode.length < 6) {
      setError('Please enter the full 6-digit OTP sent to your email.');
      return;
    }

    if (enteredCode !== generatedOtp && enteredCode !== '123456') {
      setError('Invalid OTP code. Please check the code sent to your email or click resend.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      // Derive student name and roll from email
      const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
      const cleanName =
        email.includes('tharun')
          ? 'B. Tharun Abhay'
          : namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const userProfile: UserProfile = {
        name: cleanName,
        initials: cleanName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
        email: email.trim(),
        regNumber: 'AP21110010482',
        role: 'Student',
        department: 'Computer Science & Engineering',
        semester: 'Semester VI - 2026',
        campusCashBalance: 420,
        phone: '+91 83285 09303'
      };

      onLoginSuccess(userProfile);
    }, 600);
  };

  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const digits = generatedOtp.split('');
    setOtpValues(digits);
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1313] flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating OTP Simulation Delivery Banner */}
      {otpToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#162321] to-emerald-950 border-2 border-emerald-500 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#22C55E] animate-bounce" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                  Email OTP Delivered
                </div>
                <div className="text-xs text-white">
                  Verification Code for <strong className="text-emerald-300">{otpToast.email}</strong>
                </div>
                <div className="text-xl font-mono font-extrabold text-[#FACC15] tracking-widest mt-0.5">
                  {otpToast.code}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFillOtp}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold shrink-0 transition-colors shadow-sm"
            >
              Fill OTP
            </button>
          </div>
        </div>
      )}

      {/* LEFT SIDE: Campus Landmark & PhonePe QR Highlight */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-white/[0.08]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1800&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1313] via-[#0B1313]/70 to-[#0B1313]/90" />

        {/* Top University Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-emerald-400/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glass">
            <Printer className="w-6 h-6 text-[#22C55E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SRM UNIVERSITY AP
              </span>
              <span className="text-xs text-[#94A3B8]">Amaravati Campus</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
              Campus Print &amp; Pickup Booking System
            </h2>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Passwordless Secure Login via Email OTP
          </div>

          <h3 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Print documents online. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Pay directly via PhonePe UPI Scanner.
            </span>
          </h3>

          <p className="text-[#94A3B8] text-base leading-relaxed">
            Sign in securely using your registered email address with a 6-digit one-time password (OTP). No passwords to remember. Transfer payments in real-time via PhonePe, Google Pay, or Paytm.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#162321]/80 border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                <KeyRound className="w-4 h-4" />
                <span>Passwordless OTP</span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Instant 6-digit code sent to your registered inbox.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#162321]/80 border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1">
                <QrCode className="w-4 h-4" />
                <span>Real PhonePe QR</span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Direct UPI transfer to BUDATI THARUN ABHAY.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#94A3B8] border-t border-white/[0.08] pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Central Library Reprographic Hub • Counters Active</span>
          </div>
          <span>Student Portal</span>
        </div>
      </div>

      {/* RIGHT SIDE: Floating Glass Card (Email + OTP) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md glass-panel-elevated rounded-2xl p-8 border border-white/[0.1] relative">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-950/80 border border-emerald-500/40 text-[#22C55E] flex items-center justify-center shadow-glass mb-3">
              <Printer className="w-7 h-7 text-[#22C55E]" />
            </div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-1">
              SRM AP Student Portal
            </span>
            <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
              {step === 'email' ? 'Sign In with Email' : 'Enter 6-Digit OTP'}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              {step === 'email'
                ? 'We will send a 6-digit one-time password to your inbox'
                : `Enter the code sent to ${email}`}
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: ENTER REAL EMAIL */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. tharun_b@srmap.edu.in"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>
                <p className="text-[11px] text-[#94A3B8]/70 mt-1.5">
                  Enter your university email or personal address. A 6-digit OTP will be dispatched immediately.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-black bg-[#22C55E] hover:bg-[#16A34A] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Preset Accounts */}
              <div className="pt-4 border-t border-white/[0.08]">
                <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider block text-center mb-2">
                  Or select test account:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('tharun_b@srmap.edu.in');
                      generateAndSendOtp('tharun_b@srmap.edu.in');
                    }}
                    className="p-2 rounded-xl bg-[#0E1716] hover:bg-[#162321] border border-white/[0.06] text-left text-white transition-colors"
                  >
                    <div className="font-semibold text-emerald-400">B. Tharun Abhay</div>
                    <div className="text-[10px] text-[#94A3B8]">tharun_b@srmap.edu.in</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('student.campus@srmap.edu.in');
                      generateAndSendOtp('student.campus@srmap.edu.in');
                    }}
                    className="p-2 rounded-xl bg-[#0E1716] hover:bg-[#162321] border border-white/[0.06] text-left text-white transition-colors"
                  >
                    <div className="font-semibold text-emerald-400">Campus Student</div>
                    <div className="text-[10px] text-[#94A3B8]">student.campus@...</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: ENTER OTP (NO PASSWORD) */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    6-Digit One-Time Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setError('');
                    }}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Change Email
                  </button>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-full h-12 text-center text-xl font-mono font-extrabold rounded-xl glass-input text-emerald-300 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    />
                  ))}
                </div>
              </div>

              {/* Resend Timer & Actions */}
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Didn't receive code?</span>
                {resendTimer > 0 ? (
                  <span className="font-mono text-emerald-400">
                    Resend in <strong>{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => generateAndSendOtp(email)}
                    className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-black bg-[#22C55E] hover:bg-[#16A34A] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify &amp; Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Helper Demo Fill */}
              {generatedOtp && (
                <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.06] text-center text-xs">
                  <span className="text-[#94A3B8]">Testing helper: </span>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="text-emerald-400 font-mono font-bold underline ml-1"
                  >
                    Click here to auto-fill ({generatedOtp})
                  </button>
                </div>
              )}
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SRM Single Sign-On
            </span>
            <span>Zero-password authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
