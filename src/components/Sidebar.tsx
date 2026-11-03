import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileClock,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  MapPin,
  Clock,
  Printer
} from 'lucide-react';

export type NavTab = 'dashboard' | 'new-order' | 'my-orders' | 'payments' | 'notifications' | 'help';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeOrdersCount: number;
  unreadNotificationsCount: number;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeOrdersCount,
  unreadNotificationsCount,
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'new-order' as NavTab,
      label: 'New Print Order',
      icon: PlusCircle,
      badge: 'New',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'my-orders' as NavTab,
      label: 'My Orders',
      icon: FileClock,
      badge: activeOrdersCount > 0 ? activeOrdersCount.toString() : null,
      badgeClass: 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
    },
    {
      id: 'payments' as NavTab,
      label: 'Payments',
      icon: CreditCard,
      badge: null
    },
    {
      id: 'notifications' as NavTab,
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount.toString() : null,
      badgeClass: 'bg-emerald-500 text-black font-bold'
    },
    {
      id: 'help' as NavTab,
      label: 'Help & Support',
      icon: HelpCircle,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 glass-panel border-r border-white/[0.08] flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-[#94A3B8]/70">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-[#F8FAFC] border border-emerald-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#22C55E]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      item.badgeClass || 'bg-white/10 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Location Info & Logout */}
        <div className="space-y-3 pt-4 border-t border-white/[0.08]">
          {/* Station location card */}
          <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.06] text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <Printer className="w-3.5 h-3.5" />
              <span>Counter #2 &amp; #3 Active</span>
            </div>
            <div className="flex items-start gap-1.5 text-[11px] text-[#94A3B8]">
              <MapPin className="w-3 h-3 text-[#94A3B8] mt-0.5 shrink-0" />
              <span>Library Ground Floor, Central Block</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Today: 8:30 AM – 9:30 PM</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400/90 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
