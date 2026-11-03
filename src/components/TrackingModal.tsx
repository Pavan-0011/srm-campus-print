import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  Download,
  Sparkles
} from 'lucide-react';
import { PrintOrder } from '../types';

interface TrackingModalProps {
  order: PrintOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onViewReceipt: (order: PrintOrder) => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onViewReceipt
}) => {
  if (!isOpen || !order) return null;

  const steps = [
    {
      title: 'Order Received & Verified',
      desc: 'PDF uploaded and rasterized into laser print spool.',
      completed: true
    },
    {
      title: 'Queued on Laser Station',
      desc: 'Routed to Heavy-Duty Duplex Laser Printer #2.',
      completed: order.status !== 'New'
    },
    {
      title: 'Printing in Progress',
      desc: `${order.pageCount} pages × ${order.copies} copy in ${order.printType}.`,
      completed: order.status === 'Ready for Pickup' || order.status === 'Completed'
    },
    {
      title: 'Finishing & Binding',
      desc: order.binding !== 'None' ? `Applying ${order.binding}.` : 'Collation completed.',
      completed: order.status === 'Ready for Pickup' || order.status === 'Completed'
    },
    {
      title: 'Ready for Pickup at Counter',
      desc: 'Packaged at Central Library Ground Floor Desk.',
      completed: order.status === 'Ready for Pickup' || order.status === 'Completed'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-2xl border border-white/[0.12] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1716]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Printer className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {order.id}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">
                  {order.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-[280px]">
                {order.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Pickup Token Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#0E1716] border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">
                Pickup Verification Token
              </span>
              <span className="text-2xl font-mono font-extrabold text-[#FACC15] tracking-wider">
                {order.pickupToken || 'SRM-8041'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-white mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Counter #2 • Central Library Ground Floor</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#94A3B8] block">Estimated Time</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {order.estimatedTime}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Live Processing Timeline
            </h4>

            <div className="relative pl-6 space-y-5 border-l-2 border-white/[0.08] ml-2">
              {steps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      step.completed
                        ? 'bg-emerald-500 border-[#0B1313] text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                        : 'bg-[#162321] border-white/20'
                    }`}
                  >
                    {step.completed && <CheckCircle2 className="w-3 h-3 text-black stroke-[3]" />}
                  </div>

                  <div className="text-xs font-bold text-white">{step.title}</div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Specs Details */}
          <div className="p-3.5 rounded-xl bg-[#0E1716] border border-white/[0.06] text-xs space-y-1.5">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Document File:</span>
              <span className="text-white font-mono">{order.fileName}</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Print Mode:</span>
              <span className="text-white">{order.printType} • {order.sides}</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Total Paid:</span>
              <span className="text-amber-300 font-mono font-bold">₹{order.cost}</span>
            </div>
            {order.specialInstructions && (
              <div className="pt-1 text-[11px] text-[#94A3B8] italic border-t border-white/[0.05]">
                Note: "{order.specialInstructions}"
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#0E1716] flex items-center justify-between">
          <button
            onClick={() => {
              onViewReceipt(order);
              onClose();
            }}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>View Tax Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
