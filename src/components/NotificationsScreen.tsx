import React from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { NotificationItem, PrintOrder } from '../types';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onSelectOrderById: (orderId: string) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onSelectOrderById
}) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
            Notifications &amp; Station Alerts
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Real-time updates on queue transitions, print completions, and campus station notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllAsRead}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            Mark all read
          </button>
          <button
            onClick={onClearNotifications}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-[#94A3B8] hover:text-red-400 border border-white/10 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-panel text-[#94A3B8]">
            <Bell className="w-8 h-8 mx-auto text-[#94A3B8]/40 mb-2" />
            <p className="text-sm font-semibold text-white">No active alerts</p>
            <p className="text-xs">You're completely caught up with all print notifications.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'bg-gradient-to-r from-emerald-950/30 to-[#162321] border-emerald-500/40 shadow-sm'
                  : 'glass-panel border-white/[0.06]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'order'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : notif.type === 'payment'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">{notif.message}</p>
                  <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]/70 mt-2 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{notif.time}</span>
                  </div>
                </div>
              </div>

              {notif.orderId && (
                <button
                  onClick={() => onSelectOrderById(notif.orderId!)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 shrink-0 flex items-center gap-1 transition-colors"
                >
                  <span>Track</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
