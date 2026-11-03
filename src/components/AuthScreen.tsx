import React, { useState } from 'react';
import {
  Printer,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  QrCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Crown
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (userProfile: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('tharun_b@srmap.edu.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (role: 'student' | 'admin') => {
    setSelectedRole(role);
    setError('');
    if (role === 'admin') {
      setEmail('pavan.reprographics@srmap.edu.in');
      setPassword('adminowner2026');
    } else {
      setEmail('tharun_b@srmap.edu.in');
      setPassword('studentpass123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'admin') {
        onLoginSuccess({
          name: 'Pavan Kumar',
          initials: 'PK',
          email: email,
          regNumber: 'SRM-OWNER-001',
          role: 'Admin',
          department: 'Campus Reprographics & Xerox Services (Business Owner)',
          semester: 'Owner Management Console',
          campusCashBalance: 48520,
          phone: '+91 94400 12345'
        });
      } else {
        onLoginSuccess({
          name: 'B. Tharun',
          initials: 'TA',
          email: email,
          regNumber: 'AP21110010482',
          role: 'Student',
          department: 'Computer Science & Engineering',
          semester: 'Semester VI - 2026',
          campusCashBalance: 420,
          phone: '+91 98765 43210'
        });
      }
    }, 700);
  };

  const handleQuickDemo = (role: 'student' | 'admin') => {
    handleRoleChange(role);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        onLoginSuccess({
          name: 'Pavan Kumar',
          initials: 'PK',
          email: 'pavan.reprographics@srmap.edu.in',
          regNumber: 'SRM-OWNER-001',
          role: 'Admin',
          department: 'Campus Reprographics & Xerox Services (Business Owner)',
          semester: 'Owner Management Console',
          campusCashBalance: 48520,
          phone: '+91 94400 12345'
        });
      } else {
        onLoginSuccess({
          name: 'B. Tharun',
          initials: 'TA',
          email: 'tharun_b@srmap.edu.in',
          regNumber: 'AP21110010482',
          role: 'Student',
          department: 'Computer Science & Engineering',
          semester: 'Semester VI - 2026',
          campusCashBalance: 420,
          phone: '+91 98765 43210'
        });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1313] flex flex-col lg:flex-row relative overflow-hidden font-sans">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* LEFT SIDE: Campus Landmark & Brand Experience */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-white/[0.08]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transform hover:scale-100 transition-transform duration-1000"
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
            Zero-Queue Smart Campus Printing &amp; Direct Settlements
          </div>

          <h3 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Order your prints online. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Payments route straight to the owner's bank account.
            </span>
          </h3>

          <p className="text-[#94A3B8] text-base leading-relaxed">
            Students upload assignments and pay via instant dynamic UPI QR or Net Banking. The Xerox shop owner receives real-time direct credits into their registered Indian bank account.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#162321]/80 border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                <Building2 className="w-4 h-4" />
                <span>Owner Bank Routing</span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Direct bank settlement to HDFC/SBI with automated IMPS transfer.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#162321]/80 border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                <QrCode className="w-4 h-4" />
                <span>Dynamic UPI VPA</span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Configurable merchant QR code for instant counter collections.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#94A3B8] border-t border-white/[0.08] pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Central Library Xerox Hub • Active Gateway</span>
          </div>
          <span>Engineering • Sciences • Management</span>
        </div>
      </div>

      {/* RIGHT SIDE: Floating Dark Glass Auth Card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md glass-panel-elevated rounded-2xl p-8 border border-white/[0.1] relative">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-950/80 border border-emerald-500/40 text-[#22C55E] flex items-center justify-center shadow-glass mb-3">
              {selectedRole === 'admin' ? (
                <Crown className="w-7 h-7 text-amber-400" />
              ) : (
                <Printer className="w-7 h-7 text-[#22C55E]" />
              )}
            </div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 mb-1">
              SRM AP Reprographics
            </span>
            <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
              {selectedRole === 'admin' ? 'Owner / Admin Portal' : 'Student Print Portal'}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              {selectedRole === 'admin'
                ? 'Manage receiving bank account & print queue'
                : 'Upload documents, customize print & pay online'}
            </p>
          </div>

          {/* TWO ACCOUNT TYPES SELECTOR TABS */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0E1716] border border-white/[0.08] mb-5">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === 'student'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student / User</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === 'admin'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Admin / Owner</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                {selectedRole === 'admin' ? 'Owner / Admin Email' : 'University Student Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-emerald-400">SRM Secured</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0E1716] border border-white/20 text-emerald-500"
                />
                <span className="text-[#94A3B8]">Keep session active</span>
              </label>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-Bit Encrypted
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-black transition-all flex items-center justify-center gap-2 shadow-lg mt-2 ${
                selectedRole === 'admin'
                  ? 'bg-amber-400 hover:bg-amber-500'
                  : 'bg-[#22C55E] hover:bg-[#16A34A]'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {selectedRole === 'admin' ? 'Open Owner Console →' : 'Sign In as Student →'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick One-Click Demo Access for Both */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
            <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider block mb-2.5">
              Instant One-Click Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="p-2.5 rounded-xl bg-[#0E1716] hover:bg-[#162321] border border-white/[0.06] text-left text-xs transition-colors group"
              >
                <div className="font-semibold text-emerald-400 group-hover:text-emerald-300">
                  Student Login
                </div>
                <div className="text-[10px] text-[#94A3B8]">B. Tharun (Order prints)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-[#0E1716] hover:bg-[#162321] border border-amber-400/30 text-left text-xs transition-colors group"
              >
                <div className="font-semibold text-amber-300 group-hover:text-amber-200 flex items-center gap-1">
                  <span>Owner / Admin</span>
                  <Crown className="w-3 h-3 text-amber-400" />
                </div>
                <div className="text-[10px] text-[#94A3B8]">Pavan Kumar (Bank details)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
