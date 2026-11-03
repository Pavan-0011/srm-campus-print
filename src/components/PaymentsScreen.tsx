import React, { useState } from 'react';
import {
  CreditCard,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { PrintOrder, UserProfile } from '../types';

interface PaymentsScreenProps {
  user: UserProfile;
  orders: PrintOrder[];
  onViewReceipt: (order: PrintOrder) => void;
  onAddCampusCash: (amount: number) => void;
}

export const PaymentsScreen: React.FC<PaymentsScreenProps> = ({
  user,
  orders,
  onViewReceipt,
  onAddCampusCash
}) => {
  const [topupAmount, setTopupAmount] = useState('200');
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalSpent = orders.reduce((sum, o) => sum + o.cost, 0);

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(topupAmount, 10);
    if (!isNaN(val) && val > 0) {
      onAddCampusCash(val);
      setIsTopupOpen(false);
      setToastMessage(`₹${val} successfully loaded to Campus Cash RFID.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-3.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
          Payments &amp; Campus Cash Wallet
        </h1>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Manage your student RFID campus cash balance and review itemized reprographics statements.
        </p>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campus Cash Wallet Card */}
        <div className="p-6 rounded-2xl glass-panel border-emerald-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Campus Cash (RFID Wallet)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#22C55E] font-mono">
              ₹{user.campusCashBalance}
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Tap-and-print at Library, Neerukonda, &amp; Ganga Hostel stations.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs text-white/80">Reg: {user.regNumber}</span>
            <button
              onClick={() => setIsTopupOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Funds</span>
            </button>
          </div>
        </div>

        {/* Total Semester Reprographics Expenditure */}
        <div className="p-6 rounded-2xl glass-panel border-amber-400/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Total Print Spend
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#FACC15] font-mono">
              ₹{totalSpent}
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Total across {orders.length} print &amp; photocopy jobs this semester.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.08] text-xs text-[#94A3B8] flex items-center justify-between">
            <span>Subsidized Student Tariff</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>

        {/* Payment Methods On File */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Default Payment Method
              </span>
              <div className="w-8 h-8 rounded-lg bg-white/5 text-white flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-base font-bold text-white">
              UPI Auto-Route (GPay)
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Linked to student mobile +91 98765 43210
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit SSL Campus Encryption</span>
          </div>
        </div>
      </div>

      {/* Topup Modal */}
      {isTopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-panel-elevated rounded-2xl p-6 border border-white/[0.12] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Top-up Campus Cash</h3>
              <button
                onClick={() => setIsTopupOpen(false)}
                className="text-xs text-[#94A3B8] hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleTopupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                  Top-up Amount (₹)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['100', '200', '500'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                        topupAmount === amt
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          : 'bg-[#0E1716] text-[#94A3B8] border-white/[0.06]'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  min={10}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs shadow-sm transition-colors"
              >
                Proceed via UPI / NetBanking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Transactions & Receipts Table */}
      <div className="rounded-2xl glass-panel border border-white/[0.08] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0E1716]/90 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Billing History &amp; Vouchers</h3>
            <p className="text-xs text-[#94A3B8]">Download tax receipts for department reimbursement</p>
          </div>
          <span className="text-xs text-[#94A3B8] font-mono">{orders.length} Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0E1716]/60 text-[#94A3B8] uppercase text-[10px]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Order Title</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Tax Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#94A3B8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CreditCard className="w-7 h-7 text-[#94A3B8]/40" />
                      <p className="text-xs font-semibold text-white">No transactions recorded yet</p>
                      <p className="text-[11px] text-[#94A3B8]">
                        Invoices and payment receipts will appear here after you place an order.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      TXN-{o.id.replace('#', '')}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white max-w-[200px] truncate">
                      {o.title}
                    </td>
                    <td className="py-3 px-4 text-[#94A3B8]">
                      {o.paymentMethod || 'UPI Payment'}
                    </td>
                    <td className="py-3 px-4 text-[#94A3B8]">
                      {o.timestamp}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#FACC15]">
                      ₹{o.cost}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewReceipt(o)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-xs inline-flex items-center gap-1.5 transition-colors border border-white/10"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
