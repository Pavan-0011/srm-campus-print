import React, { useState, useEffect, useRef } from 'react';
import {
  Printer,
  Mail,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  Send,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (userProfile: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  const [otpToken, setOtpToken] = useState<string>('');
  const [otpExpiresAt, setOtpExpiresAt] = useState<number>(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-Second Resend Countdown Timer
  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Step 1: Send Real OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@gmail.com).');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessInfo('');

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      setStep('otp');
      setResendTimer(60);
      setOtpToken(data.token || '');
      setOtpExpiresAt(data.expiresAt || 0);
      setSuccessInfo(`Real verification OTP sent to ${cleanEmail}. Please check your email inbox.`);
      setOtpValues(['', '', '', '', '', '']);

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Error sending OTP. Please check the email domain and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Inputs
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
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

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpValues.join('');
    if (enteredCode.length < 6) {
      setError('Please enter the complete 6-digit code received in your email.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: enteredCode,
          token: otpToken,
          expiresAt: otpExpiresAt
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP code.');
      }

      // Success: Build User Profile based on the verified email
      const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
      const cleanName =
        namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const userProfile: UserProfile = {
        name: cleanName,
        initials: cleanName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
        email: email.trim().toLowerCase(),
        regNumber: 'AP' + Math.floor(21110000000 + Math.random() * 900000),
        role: 'Student',
        department: 'SRM University AP',
        semester: 'Semester VI - 2026',
        campusCashBalance: 420,
        phone: '+91 83285 09303'
      };

      onLoginSuccess(userProfile);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1313] flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* LEFT SIDE: Full-Bleed SRM AP Campus Architecture */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-white/[0.08]">
        {/* Full-bleed background high-res campus image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100 hover:scale-105"
          style={{ backgroundImage: `url('/srm-campus-hero.jpg')` }}
        />
        {/* Dark academic glass gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1313] via-[#0B1313]/60 to-[#0B1313]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0B1313]/30 to-[#0B1313]" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B1313]/80 backdrop-blur-md border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glass">
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

        {/* Bottom Status & Info */}
        <div className="relative z-10 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0B1313]/70 border border-white/[0.1] backdrop-blur-md max-w-md">
            <p className="text-sm font-semibold text-white">Central Reprographic &amp; Print Facility</p>
            <p className="text-xs text-[#94A3B8] mt-1">High-speed color &amp; monochrome digital xerox, thesis binding, and document pickup.</p>
          </div>
          <div className="flex items-center justify-between text-xs text-[#94A3B8] border-t border-white/[0.08] pt-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Library Counters Active</span>
            </div>
            <span>Academic Portal</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Real Email + OTP Authentication Form */}
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
              {step === 'email' ? 'Sign In' : 'Verify Your Email'}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              {step === 'email'
                ? 'Enter your email address to receive your OTP verification code'
                : `Enter the 6-digit OTP sent to ${email}`}
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successInfo && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* STEP 1: ENTER ANY VALID EMAIL */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@gmail.com, student@srmap.edu.in"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>
                <p className="text-[11px] text-[#94A3B8]/70 mt-1.5">
                  Accepts any active email domain (Gmail, Yahoo, Outlook, SRM AP, etc.).
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-black bg-[#22C55E] hover:bg-[#16A34A] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send OTP to My Email</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: ENTER OTP (PASTE FROM REAL EMAIL INBOX) */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setError('');
                      setSuccessInfo('');
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
                <p className="text-[11px] text-[#94A3B8] text-center mt-2">
                  Paste or type the 6-digit code received in your inbox.
                </p>
              </div>

              {/* Resend Countdown */}
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Didn't receive code?</span>
                {resendTimer > 0 ? (
                  <span className="font-mono text-emerald-400">
                    Resend in <strong>{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
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
                className="w-full py-3 px-4 rounded-xl font-bold text-black bg-[#22C55E] hover:bg-[#16A34A] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95"
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
