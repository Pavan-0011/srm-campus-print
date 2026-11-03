import React from 'react';
import { Bell, Printer, User, Sparkles, CheckCircle2, Crown, Users, ArrowRightLeft } from 'lucide-react';
import { UserProfile, MerchantBankDetails } from '../types';

interface HeaderProps {
  user: UserProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  activeOrdersCount: number;
  merchantDetails: MerchantBankDetails;
  onToggleRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  activeOrdersCount,
  merchantDetails,
  onToggleRole
}) => {
  const isAdmin = user.role === 'Admin';

  return (
    <header className="sticky top-0 z-30 h-16 w-full glass-panel border-b border-white/[0.08] px-4 md:px-8 flex items-center justify-between transition-all">
      {/* Left: SRM AP Branding */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-950/60 border border-emerald-500/30 text-emerald-400 shadow-glass">
          {isAdmin ? (
            <Crown className="w-5 h-5 text-amber-400" />
          ) : (
            <Printer className="w-5 h-5 text-[#22C55E]" />
          )}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border ${
                isAdmin
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {isAdmin ? 'OWNER CONSOLE' : 'SRM AP'}
            </span>
            <h1 className="text-sm md:text-base font-bold text-[#F8FAFC] tracking-tight leading-none">
              {isAdmin ? 'Reprographics Management' : 'Campus Print & Pickup'}
            </h1>
          </div>
          <p className="text-[11px] text-[#94A3B8] hidden sm:block mt-0.5">
            {isAdmin
              ? `Receiving: ${merchantDetails.bankName} (A/C ...${merchantDetails.accountNumber.slice(-4)})`
              : 'SRM University AP • Central Library Xerox Hub'}
          </p>
        </div>
      </div>

      {/* Center: Status & Switcher */}
      <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#162321]/90 border border-white/[0.06] text-xs">
        {isAdmin ? (
          <>
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Merchant Active: {merchantDetails.merchantUpiId}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400 font-mono font-bold">
              Unsettled: ₹{merchantDetails.pendingSettlement}
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Printing Hub: Online
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#94A3B8]">
              Queue: <strong className="text-white font-semibold">{activeOrdersCount} active</strong>
            </span>
          </>
        )}

        <span className="text-white/20">|</span>
        <button
          onClick={onToggleRole}
          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline text-[11px]"
          title="Switch view between Student and Admin"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>Switch to {isAdmin ? 'Student View' : 'Owner Console'}</span>
        </button>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Role Toggle pill for tablet/mobile */}
        <button
          onClick={onToggleRole}
          className="lg:hidden px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-emerald-400 flex items-center gap-1"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>{isAdmin ? 'Student' : 'Owner'}</span>
        </button>

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
          title="Profile & Bank Info"
        >
          <div
            className={`w-8 h-8 rounded-lg font-extrabold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform ${
              isAdmin
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black'
                : 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-black'
            }`}
          >
            {user.initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1">
              {user.name}
              {isAdmin ? (
                <Crown className="w-3 h-3 text-amber-400 inline" />
              ) : (
                <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
              )}
            </div>
            <div className="text-[10px] text-[#94A3B8] flex items-center gap-1">
              <span className="capitalize">{user.role}</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">
                {isAdmin ? `₹${merchantDetails.pendingSettlement}` : `₹${user.campusCashBalance}`}
              </span>
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
