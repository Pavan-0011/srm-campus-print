import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
  Sparkles
} from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'Where do I collect my printed documents?',
      a: 'All online orders are fulfilled at the Central Library Ground Floor Reprographic Centre (Counters #2 & #3). Flash your order ID or digital pickup token on your phone at Counter #3 to grab your package.'
    },
    {
      q: 'How fast will my document be ready?',
      a: 'Average turnaround is 10 to 15 minutes for regular assignments. Large spiral-bound thesis reports or multi-copy presentations (>100 pages) take approximately 20 to 25 minutes depending on queue volume.'
    },
    {
      q: 'Can I pay cash upon collection?',
      a: 'Yes! Choose "Pay at Counter (COD)" during checkout. Your print job will be spooled and printed; you can pay the counter operator with cash when presenting your pickup token.'
    },
    {
      q: 'What is the official SRM AP thesis binding standard?',
      a: 'For final B.Tech / M.Tech / Ph.D project submissions, select "Hard Binding (Gold Embossed SRM AP Thesis)". It complies with Dean Academics guidelines, including dark navy leatherette casing and golden hot-foil stamping.'
    },
    {
      q: 'How do I request a reprint if pages are misprinted?',
      a: 'Report directly to the desk supervisor at Counter #1 or email reprographics@srmap.edu.in with your Order ID. Misprints caused by paper jams or toner fading will be re-printed immediately free of charge.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel-elevated rounded-2xl border border-white/[0.12] overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1716]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Help &amp; Campus Reprographics Support
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                SRM University AP • Central Print Services Desk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          {/* Station Locations Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
              Campus Xerox Centres &amp; Operating Hours
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0E1716] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Central Library Hub</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    Primary Station
                  </span>
                </div>
                <div className="text-[11px] text-[#94A3B8] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Ground Floor, Central Library Block</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Mon - Sat: 8:30 AM – 9:30 PM (Sun: 10AM - 6PM)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Internal Intercom: 4421 / 4422</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E1716] border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Ganga Hostel Kiosk</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#94A3B8]">
                    Express Desk
                  </span>
                </div>
                <div className="text-[11px] text-[#94A3B8] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Hostel Block Dining Hall Annex</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>All Days: 5:00 PM – 11:30 PM</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>reprographics@srmap.edu.in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Card Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
              Official Subsidized Student Rate Card
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#0E1716] border border-white/[0.06]">
                <span className="text-[10px] text-[#94A3B8] block">B&amp;W Laser</span>
                <span className="text-sm font-mono font-bold text-white">₹2.00 / pg</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E1716] border border-white/[0.06]">
                <span className="text-[10px] text-[#94A3B8] block">Full Color</span>
                <span className="text-sm font-mono font-bold text-emerald-400">₹5.00 / pg</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E1716] border border-white/[0.06]">
                <span className="text-[10px] text-[#94A3B8] block">Spiral Binding</span>
                <span className="text-sm font-mono font-bold text-amber-300">₹30.00</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E1716] border border-white/[0.06]">
                <span className="text-[10px] text-[#94A3B8] block">Hard Binding</span>
                <span className="text-sm font-mono font-bold text-[#FACC15]">₹120.00</span>
              </div>
            </div>
          </div>

          {/* Accordion FAQs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
              Frequently Asked Questions
            </h4>
            {faqs.map((faq, index) => {
              const isOpenItem = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-[#0E1716] border border-white/[0.06] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpenItem ? null : index)}
                    className="w-full p-3 text-left font-semibold text-white flex items-center justify-between hover:bg-white/[0.02]"
                  >
                    <span>{faq.q}</span>
                    {isOpenItem ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    )}
                  </button>
                  {isOpenItem && (
                    <div className="px-3 pb-3 text-xs text-[#94A3B8] leading-relaxed border-t border-white/[0.04] pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-[#0E1716] flex items-center justify-between">
          <span className="text-[11px] text-[#94A3B8]">
            Operator Hotline: <strong>+91 863 234 3000</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
