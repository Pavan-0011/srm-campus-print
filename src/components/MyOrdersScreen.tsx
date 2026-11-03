import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  Printer,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { PrintOrder, OrderStatus } from '../types';

interface MyOrdersScreenProps {
  orders: PrintOrder[];
  initialFilter?: string;
  onTrackOrder: (order: PrintOrder) => void;
  onDownloadReceipt: (order: PrintOrder) => void;
  onReorder: (order: PrintOrder) => void;
  onStartNewOrder: () => void;
}

export const MyOrdersScreen: React.FC<MyOrdersScreenProps> = ({
  orders,
  initialFilter = 'all',
  onTrackOrder,
  onDownloadReceipt,
  onReorder,
  onStartNewOrder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Filter tabs
  const filterTabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    {
      id: 'In Progress',
      label: 'In Progress',
      count: orders.filter((o) => o.status === 'In Progress').length,
      badgeColor: 'bg-amber-400/20 text-[#FACC15]'
    },
    {
      id: 'Ready for Pickup',
      label: 'Ready for Pickup',
      count: orders.filter((o) => o.status === 'Ready for Pickup').length,
      badgeColor: 'bg-sky-500/20 text-[#38BDF8]'
    },
    {
      id: 'Completed',
      label: 'Completed',
      count: orders.filter((o) => o.status === 'Completed').length,
      badgeColor: 'bg-emerald-500/20 text-[#22C55E]'
    },
    {
      id: 'New',
      label: 'New',
      count: orders.filter((o) => o.status === 'New').length,
      badgeColor: 'bg-blue-500/20 text-[#3B82F6]'
    }
  ];

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search matching Order ID, title, or fileName
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.title.toLowerCase().includes(query) ||
        order.fileName.toLowerCase().includes(query) ||
        order.productType.toLowerCase().includes(query);

      // Status matching
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleDownloadFile = (fileName: string) => {
    setDownloadSuccessToast(`Downloading source document: ${fileName}`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed top-20 right-8 z-50 p-3.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
            My Orders &amp; Print History
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Monitor real-time laser queue progress, download PDF files, or generate pickup verification tokens.
          </p>
        </div>

        <button
          onClick={onStartNewOrder}
          className="px-4 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-black font-bold text-xs flex items-center gap-2 transition-all self-start sm:self-auto shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>New Print Job</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (e.g. #CP1080), Title, or File name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs placeholder:text-[#94A3B8]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Counter Location Filter */}
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <span className="shrink-0 hidden lg:inline">Station:</span>
            <span className="px-2.5 py-1.5 rounded-lg bg-[#0E1716] text-emerald-400 font-semibold border border-white/[0.06]">
              Central Library Ground Floor
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.05]">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {filterTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500/20 text-white border border-emerald-500/40 shadow-sm'
                    : 'bg-[#0E1716] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/[0.05] hover:border-white/10'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    tab.badgeColor || 'bg-white/10 text-white'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="rounded-2xl glass-panel border border-white/[0.08] overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0E1716]/90 text-[#94A3B8] uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Product / Type</th>
                <th className="py-3.5 px-4">File</th>
                <th className="py-3.5 px-4">Cost</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4">Est. Print Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#94A3B8]">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 flex items-center justify-center mx-auto">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {orders.length === 0 ? 'No print orders placed yet' : 'No matching print orders'}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        {orders.length === 0
                          ? 'Upload your first document (PDF, DOCX) to get instant pricing and pickup token.'
                          : 'Try searching for another term or change your filter.'}
                      </p>
                      <button
                        onClick={onStartNewOrder}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
                      >
                        Create Print Order
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* 1. Order ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400">{order.id}</span>
                          {order.pickupToken && (
                            <span className="text-[10px] font-normal px-1 py-0.5 rounded bg-white/5 text-[#94A3B8] hidden xl:inline">
                              {order.pickupToken}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. Title */}
                      <td className="py-3.5 px-4 font-semibold text-white max-w-[220px]">
                        <div className="truncate" title={order.title}>
                          {order.title}
                        </div>
                        {order.binding !== 'None' && (
                          <span className="text-[10px] font-normal text-amber-300 block">
                            Finishing: {order.binding}
                          </span>
                        )}
                      </td>

                      {/* 3. Product / Type */}
                      <td className="py-3.5 px-4 text-[#94A3B8] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                          <span>{order.productType}</span>
                        </div>
                        <span className="text-[10px] text-white/50 block">
                          {order.printType} • {order.sides}
                        </span>
                      </td>

                      {/* 4. File with Download Icon */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(order.fileName)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0E1716] hover:bg-[#162321] border border-white/[0.06] text-[#F8FAFC] hover:text-emerald-300 transition-colors group/file text-left"
                          title="Click to download source document"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-mono text-[11px] max-w-[130px] truncate">
                            {order.fileName}
                          </span>
                          <Download className="w-3 h-3 text-[#94A3B8] group-hover/file:text-emerald-400 shrink-0 ml-0.5" />
                        </button>
                      </td>

                      {/* 5. Cost */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-[#FACC15] text-sm">
                          ₹{order.cost}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] block">
                          {order.copies > 1 ? `${order.copies} copies` : '1 copy'}
                        </span>
                      </td>

                      {/* 6. Last Activity / Timestamp */}
                      <td className="py-3.5 px-4 text-[#94A3B8] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#94A3B8]" />
                          <span>{order.timestamp}</span>
                        </div>
                      </td>

                      {/* 7. Estimated Xerox / Print Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {order.estimatedTime === 'Ready' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Ready
                          </span>
                        ) : order.estimatedTime.includes('Queue') ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-[#38BDF8] border border-blue-500/30">
                            <Clock className="w-3 h-3" />
                            {order.estimatedTime}
                          </span>
                        ) : order.estimatedTime === 'Completed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-[#94A3B8]">
                            Archived
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-400/15 text-[#FACC15] border border-amber-400/30">
                            <Clock className="w-3 h-3 animate-spin" />
                            {order.estimatedTime}
                          </span>
                        )}
                      </td>

                      {/* 8. Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {order.status === 'In Progress' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/15 text-[#FACC15] border border-amber-400/30">
                            In Progress
                          </span>
                        )}
                        {order.status === 'Ready for Pickup' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/15 text-[#38BDF8] border border-sky-500/30 animate-pulse">
                            Ready for Pickup
                          </span>
                        )}
                        {order.status === 'Completed' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-[#22C55E] border border-emerald-500/30">
                            Completed
                          </span>
                        )}
                        {order.status === 'New' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600/20 text-[#60A5FA] border border-blue-500/40">
                            New
                          </span>
                        )}
                      </td>

                      {/* 9. Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Track */}
                          <button
                            type="button"
                            onClick={() => onTrackOrder(order)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1 transition-colors"
                            title="Track Live Progress"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Track</span>
                          </button>

                          {/* Download Receipt */}
                          <button
                            type="button"
                            onClick={() => onDownloadReceipt(order)}
                            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white border border-white/10 transition-colors"
                            title="View / Print Tax Invoice Receipt"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Reorder */}
                          <button
                            type="button"
                            onClick={() => onReorder(order)}
                            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-amber-300 border border-white/10 transition-colors"
                            title="Reorder with same settings"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM INFO CARD */}
      <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
            <Printer className="w-6 h-6 text-[#FACC15]" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>Estimated Xerox / Print Time</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <p className="text-sm font-medium text-[#F8FAFC] mt-0.5">
              Usually completed within 10–20 minutes depending on page volume and queue position.
            </p>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              High-volume spiral bound thesis (&gt;100 pages) may take up to 30 minutes during final week.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-[#94A3B8] uppercase block">Direct Counter Desk</span>
            <span className="text-xs font-mono font-bold text-emerald-400">Ext: 4421 / 4422</span>
          </div>
          <button
            onClick={() => alert('Xerox Helpline: +91 863 234 3000 (Central Library Desk). Live operator is available.')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            Call Desk
          </button>
        </div>
      </div>
    </div>
  );
};
