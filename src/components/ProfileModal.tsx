import React from 'react';
import { X, User, CheckCircle2, ShieldCheck, CreditCard, Mail, Phone, BookOpen, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel-elevated rounded-2xl border border-white/[0.12] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1716]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Student Profile &amp; Campus ID</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-[#94A3B8]">
          {/* Virtual Student ID Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-[#162321] to-[#0E1716] border border-emerald-500/30 text-white space-y-4 shadow-glass relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  SRM UNIVERSITY AP
                </span>
                <div className="text-xs font-semibold text-[#94A3B8] mt-0.5">Amaravati Campus</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black font-extrabold flex items-center justify-center text-xs">
                {user.initials}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-base font-extrabold flex items-center gap-1.5">
                <span>{user.name}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs font-mono text-emerald-300 font-semibold">
                {user.regNumber}
              </div>
              <div className="text-xs text-[#94A3B8]">{user.department}</div>
              <div className="text-[11px] text-[#94A3B8]">{user.semester}</div>
            </div>

            <div className="pt-2 border-t border-white/[0.1] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#94A3B8] block">RFID Balance</span>
                <span className="text-sm font-mono font-bold text-[#FACC15]">
                  ₹{user.campusCashBalance}
                </span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Biometric Terminal</span>
              </div>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.06] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Email:</span>
              </span>
              <span className="text-white font-mono">{user.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.06] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile (SMS Token):</span>
              </span>
              <span className="text-white font-mono">{user.phone}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.06] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Program:</span>
              </span>
              <span className="text-white">B.Tech Computer Science</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0E1716] flex items-center justify-between">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
