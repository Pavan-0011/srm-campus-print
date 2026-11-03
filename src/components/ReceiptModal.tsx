import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { PrintOrder, UserProfile } from '../types';
import { phonePeMerchant } from '../data/mockData';

interface ReceiptModalProps {
  order: PrintOrder | null;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  user,
  isOpen,
  onClose
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const gstAmount = (order.cost * 0.05).toFixed(2);
  const baseAmount = (order.cost - parseFloat(gstAmount)).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel-elevated rounded-2xl border border-white/[0.12] overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
        {/* Header Controls */}
        <div className="px-6 py-3.5 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1716]">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Official Tax Invoice / Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs text-[#94A3B8] bg-[#0E1716]/95">
          {/* University Seal & Station info */}
          <div className="flex justify-between items-start border-b border-white/[0.08] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SRM AP
                </span>
                <h3 className="text-base font-extrabold text-white">
                  SRM University AP
                </h3>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Central Library Xerox &amp; Reprographic Centre
              </p>
              <p className="text-[11px] text-[#94A3B8]">
                Payee: <strong className="text-white">{phonePeMerchant.name}</strong> ({phonePeMerchant.vpa})
              </p>
              <p className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                GSTIN: 37AAAAU0000A1Z5 • PhonePe Merchant Gateway
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase text-[#94A3B8] block">Invoice No.</span>
              <span className="text-base font-mono font-bold text-white">
                INV-{order.id.replace('#', '')}
              </span>
              <span className="text-[10px] text-[#94A3B8] block mt-1">
                Date: {order.timestamp}
              </span>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                PAID IN FULL
              </span>
            </div>
          </div>

          {/* Student Details & Token */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#162321] border border-white/[0.06]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Billed To</span>
              <div className="text-sm font-bold text-white mt-0.5">{user.name}</div>
              <div className="text-[11px] text-[#94A3B8]">{user.regNumber}</div>
              <div className="text-[11px] text-[#94A3B8]">{user.department}</div>
              <div className="text-[11px] text-[#94A3B8]">{user.email}</div>
            </div>

            <div className="text-right flex flex-col justify-between items-end">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Pickup Verification Token</span>
                <span className="text-xl font-mono font-extrabold text-[#FACC15]">
                  {order.pickupToken || 'SRM-8041'}
                </span>
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                UTR: {order.utrNumber || '330491829012'}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-white/[0.08] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#162321] text-white/70 uppercase text-[10px] border-b border-white/[0.08]">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Pages</th>
                  <th className="p-3 text-center">Copies</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                <tr>
                  <td className="p-3">
                    <div className="font-semibold text-white">{order.title}</div>
                    <div className="text-[10px] text-[#94A3B8]">
                      {order.printType} • {order.sides} • {order.paperSize} ({order.paperQuality})
                    </div>
                  </td>
                  <td className="p-3 text-center font-mono text-white">{order.pageCount}</td>
                  <td className="p-3 text-center font-mono text-white">{order.copies}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">
                    ₹{baseAmount}
                  </td>
                </tr>
                {order.binding !== 'None' && (
                  <tr>
                    <td className="p-3 text-white">
                      Finishing Add-on: {order.binding}
                    </td>
                    <td className="p-3 text-center text-[#94A3B8]">-</td>
                    <td className="p-3 text-center text-[#94A3B8]">-</td>
                    <td className="p-3 text-right font-mono text-white">
                      ₹{order.binding === 'Hard Binding' ? '120.00' : order.binding === 'Spiral' ? '30.00' : '5.00'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Calculation */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-white">₹{baseAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%) + SGST (2.5%):</span>
                <span className="font-mono text-white">₹{gstAmount}</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.1] pt-2 font-bold text-sm">
                <span className="text-white">Total Amount Paid:</span>
                <span className="font-mono text-[#FACC15]">₹{order.cost}.00</span>
              </div>
            </div>
          </div>

          {/* Footer certification */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified PhonePe UPI Transaction (Payee: {phonePeMerchant.name})</span>
            </div>
            <span>reprographics@srmap.edu.in</span>
          </div>
        </div>
      </div>
    </div>
  );
};
