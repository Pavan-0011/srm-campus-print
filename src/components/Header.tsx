import React from 'react';
import { Bell, Printer, CheckCircle2, Sparkles, QrCode } from 'lucide-react';
import { UserProfile } from '../types';
import { phonePeMerchant } from '../data/mockData';

interface HeaderProps {
  user: UserProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  activeOrdersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  activeOrdersCount
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 w-full glass-panel border-b border-white/[0.08] px-4 md:px-8 flex items-center justify-between transition-all">
      {/* Left: SRM AP Branding */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-950/60 border border-emerald-500/30 text-emerald-400 shadow-glass">
          <Printer className="w-5 h-5 text-[#22C55E]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              SRM AP
            </span>
            <h1 className="text-sm md:text-base font-bold text-[#F8FAFC] tracking-tight leading-none">
              Campus Print &amp; Pickup Booking System
            </h1>
          </div>
          <p className="text-[11px] text-[#94A3B8] hidden sm:block mt-0.5">
            SRM University AP • Central Library Xerox Hub
          </p>
        </div>
      </div>

      {/* Center: Live Station Status & PhonePe Badge */}
      <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#162321]/90 border border-white/[0.06] text-xs">
        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Station: Online
        </span>
        <span className="text-white/20">|</span>
        <span className="text-[#94A3B8]">
          Queue: <strong className="text-white font-semibold">{activeOrdersCount} active</strong>
        </span>
        <span className="text-white/20">|</span>
        <span className="text-purple-300 font-medium flex items-center gap-1">
          <QrCode className="w-3 h-3 text-purple-400" />
          PhonePe QR: {phonePeMerchant.name}
        </span>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-[#162321] hover:bg-[#1B2C29] border border-white/[0.08] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-black text-[11px] font-bold flex items-center justify-center border-2 border-[#0B1313] animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Chip */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-[#162321] hover:bg-[#1B2C29] border border-white/[0.08] transition-all group text-left"
          title="Student Profile"
        >
          <div className="w-8 h-8 rounded-lg font-extrabold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform bg-gradient-to-br from-emerald-500 to-emerald-700 text-black">
            {user.initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1">
              {user.name}
              <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
            </div>
            <div className="text-[10px] text-[#94A3B8] flex items-center gap-1">
              <span>{user.email}</span>
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
