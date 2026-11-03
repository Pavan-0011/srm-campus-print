import React from 'react';
import {
  FileText,
  Copy,
  BookOpen,
  Award,
  FileQuestion,
  Clock,
  ArrowRight,
  TrendingUp,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import { PrintOrder, UserProfile, QuickServiceItem } from '../types';
import { quickServices } from '../data/mockData';

interface DashboardScreenProps {
  user: UserProfile;
  orders: PrintOrder[];
  onStartNewOrder: (preset?: Partial<PrintOrder>) => void;
  onViewOrders: (filter?: string) => void;
  onTrackOrder: (order: PrintOrder) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  orders,
  onStartNewOrder,
  onViewOrders,
  onTrackOrder
}) => {
  const activeOrders = orders.filter((o) => o.status === 'New' || o.status === 'In Progress');
  const readyOrders = orders.filter((o) => o.status === 'Ready for Pickup');
  const totalSpent = orders.reduce((sum, o) => sum + o.cost, 0);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'FileText':
        return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'Copy':
        return <Copy className="w-5 h-5 text-teal-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-indigo-400" />;
      case 'FileQuestion':
        return <FileQuestion className="w-5 h-5 text-rose-400" />;
      default:
        return <Printer className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. Top Welcome Banner */}
      <div className="relative rounded-2xl glass-panel p-6 md:p-8 overflow-hidden border border-white/[0.08]">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SRM University AP • Smart Print Station Active
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Welcome, {user.name} 👋
            </h1>
            <p className="text-sm md:text-base text-[#94A3B8] max-w-2xl leading-relaxed">
              Order your assignments, thesis reports, and lab manuals online. Flash your digital token at Central Library Ground Floor Xerox Counter to pick up without standing in queues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onStartNewOrder()}
              className="px-5 py-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Create Print Order</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
            <button
              onClick={() => onViewOrders('all')}
              className="px-4 py-3 rounded-xl bg-[#162321] hover:bg-[#1B2C29] text-[#F8FAFC] font-medium text-sm border border-white/[0.08] flex items-center gap-2 transition-colors"
            >
              <span>View History</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Metric KPI Cards (4 Grid Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Orders */}
        <div
          onClick={() => onViewOrders('In Progress')}
          className="p-5 rounded-2xl glass-panel hover:border-emerald-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Active Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#F8FAFC] font-mono">
              {activeOrders.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              In print queue
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#94A3B8] flex items-center justify-between">
            <span>{readyOrders.length} ready for counter pickup</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div
          onClick={() => onViewOrders('all')}
          className="p-5 rounded-2xl glass-panel hover:border-white/20 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Copy className="w-4 h-4 text-[#94A3B8]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#F8FAFC] font-mono">
              {orders.length}
            </span>
            <span className="text-xs text-[#94A3B8]">Semester total</span>
          </div>
          <div className="mt-2 text-[11px] text-[#94A3B8] flex items-center justify-between">
            <span>100% completion rate</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Metric 3: Total Spent (Highlighted in Yellow #FACC15) */}
        <div className="p-5 rounded-2xl glass-panel border-amber-400/20 shadow-[0_0_20px_rgba(250,204,21,0.05)] hover:border-amber-400/40 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Total Spent
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#FACC15] font-mono tracking-tight">
              ₹{totalSpent}
            </span>
            <span className="text-xs text-amber-400/80 font-medium">INR</span>
          </div>
          <div className="mt-2 text-[11px] text-[#94A3B8] flex items-center justify-between">
            <span>Avg ₹{orders.length ? Math.round(totalSpent / orders.length) : 0} per print job</span>
            <span className="text-amber-400/90 font-medium">Campus Rates</span>
          </div>
        </div>

        {/* Metric 4: Avg Completion Time */}
        <div className="p-5 rounded-2xl glass-panel hover:border-sky-500/40 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Avg. Completion Time
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#38BDF8] font-mono">
              ~15 min
            </span>
            <span className="text-xs text-sky-400 font-medium">Fast Turnaround</span>
          </div>
          <div className="mt-2 text-[11px] text-[#94A3B8] flex items-center justify-between">
            <span>Heavy load peak: 20 min</span>
            <span className="text-emerald-400">Normal load</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Services Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">Quick Campus Services</h2>
            <p className="text-xs text-[#94A3B8]">
              Select a service preset to instantly configure your print specifications
            </p>
          </div>
          <button
            onClick={() => onStartNewOrder()}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Custom Specifications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {quickServices.map((svc) => (
            <div
              key={svc.id}
              onClick={() => onStartNewOrder(svc.preset)}
              className="p-4 rounded-xl glass-panel hover:bg-[#1B2C29] border border-white/[0.08] hover:border-emerald-500/40 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0E1716] border border-white/[0.06] flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getServiceIcon(svc.iconName)}
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    {svc.priceTag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#F8FAFC] group-hover:text-emerald-300 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                  {svc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Orders Live Tracking Highlight */}
      {readyOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/20 via-sky-950/40 to-[#162321] border border-sky-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glass">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                  Ready for Pickup
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                  Token: {readyOrders[0].pickupToken}
                </span>
              </div>
              <p className="text-sm font-medium text-white mt-0.5">
                {readyOrders[0].title} is ready at <strong>Central Library Xerox Counter #2</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onTrackOrder(readyOrders[0])}
              className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Show Pickup QR</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Recent Activity & Counter Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Recent Print Orders</h3>
              <p className="text-xs text-[#94A3B8]">Track your pending and recently printed materials</p>
            </div>
            <button
              onClick={() => onViewOrders('all')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>See All ({orders.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-xl bg-[#0E1716]/80 hover:bg-[#162321] border border-white/[0.05] flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#162321] border border-white/[0.08] flex items-center justify-center text-emerald-400 shrink-0 font-mono text-xs font-bold">
                    {order.id.replace('#', '')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#F8FAFC] truncate">
                      {order.title}
                    </div>
                    <div className="text-xs text-[#94A3B8] flex items-center gap-2 mt-0.5">
                      <span>{order.fileName}</span>
                      <span>•</span>
                      <span className="font-mono text-amber-300">₹{order.cost}</span>
                      <span>•</span>
                      <span>{order.pageCount} pgs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {order.status === 'In Progress' && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-amber-400/15 text-[#FACC15] border border-amber-400/30">
                      In Progress
                    </span>
                  )}
                  {order.status === 'Ready for Pickup' && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-sky-500/15 text-[#38BDF8] border border-sky-500/30">
                      Ready for Pickup
                    </span>
                  )}
                  {order.status === 'Completed' && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-emerald-500/15 text-[#22C55E] border border-emerald-500/30">
                      Completed
                    </span>
                  )}
                  {order.status === 'New' && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-blue-500/15 text-[#3B82F6] border border-blue-500/30">
                      New
                    </span>
                  )}

                  <button
                    onClick={() => onTrackOrder(order)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
                    title="Track Order"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Xerox Station Queue Status */}
        <div className="rounded-2xl glass-panel p-5 border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#F8FAFC]">Live Xerox Terminal Status</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-[#94A3B8]">
              Central Library Ground Floor • Counters Status
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.05]">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">Counter #1 (High-Speed B/W)</span>
                  <span className="text-emerald-400">Available</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">2 jobs processing • 45 ppm duplex</p>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.05]">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">Counter #2 (Color &amp; Spiral Binding)</span>
                  <span className="text-amber-400">Busy (Queue: 3)</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">Special thermal &amp; wire-O binding running</p>
              </div>

              <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.05]">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white">Counter #3 (Express Pickup Desk)</span>
                  <span className="text-emerald-400">Zero Wait</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">Show SMS/App QR code to collect printouts</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Need emergency printouts before lab viva? Counters prioritize orders with active pickup tokens.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
