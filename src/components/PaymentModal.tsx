import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  Building2,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Lock,
  Download,
  AlertCircle,
  Copy,
  ChevronRight,
  Printer,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PrintOrder, UserProfile, MerchantBankDetails, TransactionRecord } from '../types';
import { indianBanks } from '../data/mockData';

interface PaymentModalProps {
  orderData: Partial<PrintOrder>;
  user: UserProfile;
  merchantDetails: MerchantBankDetails;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (createdOrder: PrintOrder, transaction: TransactionRecord) => void;
  onViewReceipt: (order: PrintOrder) => void;
}

type PaymentTab = 'upi' | 'card' | 'netbanking' | 'campus_cash';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  orderData,
  user,
  merchantDetails,
  isOpen,
  onClose,
  onPaymentSuccess,
  onViewReceipt
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('upi');

  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [upiCountdown, setUpiCountdown] = useState(300); // 5 minutes
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8829');
  const [cardHolder, setCardHolder] = useState(user.name.toUpperCase());
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState<string>('hdfc');

  // Campus Cash / COD State
  const [campusPaymentType, setCampusPaymentType] = useState<'campus_wallet' | 'cod'>('campus_wallet');

  // Simulation Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PrintOrder | null>(null);
  const [completedTxn, setCompletedTxn] = useState<TransactionRecord | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(4);

  const amount = orderData.cost || 24;

  // 5-minute countdown timer for UPI QR
  useEffect(() => {
    if (!isOpen || isSuccess) return;
    const interval = setInterval(() => {
      setUpiCountdown((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSuccess]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, type: 'upi' | 'bank') => {
    navigator.clipboard?.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  // Payment Execution Simulation
  const handleExecutePayment = () => {
    setIsProcessing(true);
    setProcessingStep(`Routing payment directly to Owner's Account: ${merchantDetails.accountHolderName}...`);

    setTimeout(() => {
      setProcessingStep(`Crediting ${merchantDetails.bankName} (A/C ...${merchantDetails.accountNumber.slice(-4)})...`);
    }, 700);

    setTimeout(() => {
      setProcessingStep('Authorizing NPCI Bank Settlement Token...');
    }, 1400);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
      const generatedUtr = `UTR-${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder: PrintOrder = {
        id: `#CP${randomIdNumber}`,
        title: orderData.title || 'Course Notes Print Job',
        productType: orderData.productType || 'Letter Booklet',
        fileName: orderData.fileName || 'document.pdf',
        fileSize: orderData.fileSize || '3.5 MB',
        pageCount: orderData.pageCount || 12,
        copies: orderData.copies || 1,
        printType: orderData.printType || 'Black & White',
        sides: orderData.sides || 'Both Sides',
        binding: orderData.binding || 'None',
        paperSize: orderData.paperSize || 'A4',
        paperQuality: orderData.paperQuality || 'Standard (75 GSM)',
        cost: amount,
        timestamp: 'Just now',
        estimatedTime: '~15 min',
        queuePosition: 2,
        status: 'In Progress',
        pickupToken: `SRM-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod:
          activeTab === 'upi'
            ? `UPI (${selectedUpiApp.toUpperCase()})`
            : activeTab === 'card'
            ? 'Visa / Master Debit'
            : activeTab === 'netbanking'
            ? `Net Banking (${selectedBank.toUpperCase()})`
            : campusPaymentType === 'campus_wallet'
            ? 'Campus Cash (Student ID)'
            : 'Pay at Counter (COD)',
        paymentStatus: campusPaymentType === 'cod' ? 'Pay at Counter' : 'Paid',
        progressStep: 2,
        specialInstructions: orderData.specialInstructions,
        studentName: user.name,
        studentRegNo: user.regNumber,
        utrNumber: generatedUtr
      };

      const newTxn: TransactionRecord = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        orderId: newOrder.id,
        studentName: user.name,
        studentRegNo: user.regNumber,
        studentEmail: user.email,
        amount,
        paymentMethod: newOrder.paymentMethod || 'UPI',
        utrNumber: generatedUtr,
        timestamp: 'Just now',
        status: campusPaymentType === 'cod' ? 'Pay at Counter' : 'Credited to Owner Bank',
        destinationBank: `${merchantDetails.bankName} (A/C ...${merchantDetails.accountNumber.slice(-4)})`,
        destinationAccount: merchantDetails.accountNumber,
        destinationUpi: merchantDetails.merchantUpiId
      };

      setCompletedOrder(newOrder);
      setCompletedTxn(newTxn);
      onPaymentSuccess(newOrder, newTxn);
    }, 2000);
  };

  // Redirect timer after success
  useEffect(() => {
    if (!isSuccess) return;
    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl glass-panel-elevated rounded-2xl border border-white/[0.12] overflow-hidden flex flex-col max-h-[92vh] shadow-2xl">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1716]/95">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  SRM AP Secured Checkout
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-[#94A3B8]">
                  Verified Merchant: {merchantDetails.accountHolderName}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Payment Gateway • {orderData.title || 'Print Job'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase text-[#94A3B8] block">Total Payable</span>
              <span className="text-lg font-mono font-extrabold text-[#FACC15]">₹{amount}</span>
            </div>

            {!isProcessing && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* PROCESSING OVERLAY SIMULATION */}
        {isProcessing && (
          <div className="p-12 text-center my-auto space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
              <div className="w-20 h-20 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white">Routing Payment to Owner's Bank...</h4>
              <p className="text-sm text-emerald-400 font-mono animate-pulse">
                {processingStep}
              </p>
              <p className="text-xs text-[#94A3B8]">
                Direct bank settlement to {merchantDetails.accountHolderName} ({merchantDetails.bankName}).
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS SCREEN */}
        {isSuccess && completedOrder && completedTxn && (
          <div className="p-8 text-center my-auto space-y-5 animate-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Payment Credited to Owner Account
              </span>
              <h3 className="text-2xl font-extrabold text-white pt-1">
                Order {completedOrder.id} Confirmed!
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                ₹{amount} credited to <strong>{merchantDetails.accountHolderName}</strong> ({merchantDetails.bankName}). Your file is routed to Counter #2.
              </p>
            </div>

            {/* Generated QR Pickup Token Box */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#0E1716] border border-white/[0.08] flex items-center justify-between gap-4">
              <div className="w-20 h-20 rounded-xl bg-white p-2 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#0B1313] p-1 rounded flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-3.5 h-3.5 bg-white" />
                    <div className="w-3.5 h-3.5 bg-white" />
                  </div>
                  <div className="text-[7px] font-mono text-center text-emerald-400 font-bold">
                    SRM AP
                  </div>
                  <div className="flex justify-between">
                    <div className="w-3.5 h-3.5 bg-white" />
                    <div className="w-3.5 h-3.5 bg-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="text-left space-y-0.5 text-xs">
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">
                  Digital Pickup Token
                </span>
                <div className="text-xl font-mono font-extrabold text-[#FACC15] tracking-widest">
                  {completedOrder.pickupToken}
                </div>
                <div className="text-[#94A3B8]">
                  UTR: <span className="font-mono text-emerald-400">{completedTxn.utrNumber}</span>
                </div>
                <div className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                  <Clock className="w-3 h-3" />
                  Ready in: ~12-15 minutes at Library Desk
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onViewReceipt(completedOrder);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#162321] hover:bg-[#1B2C29] text-white text-xs font-semibold border border-white/10 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Invoice</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-black text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                <span>View in My Orders ({redirectCountdown}s)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT METHOD SELECTION FORM */}
        {!isProcessing && !isSuccess && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Payment Methods Tabs */}
            <div className="w-full md:w-64 bg-[#0E1716]/90 border-r border-white/[0.08] p-3 space-y-1.5 shrink-0">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Payment Option
              </div>

              {/* Tab 1: UPI / QR */}
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === 'upi'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>UPI / QR Code</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Instant
                </span>
              </button>

              {/* Tab 2: Credit & Debit Cards */}
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === 'card'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <span>Credit / Debit Cards</span>
                </div>
                <span className="text-[10px] text-[#94A3B8]">Direct</span>
              </button>

              {/* Tab 3: Net Banking */}
              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === 'netbanking'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>Direct Bank Transfer</span>
                </div>
                <span className="text-[10px] text-amber-300">IMPS</span>
              </button>

              {/* Tab 4: Campus Cash / COD */}
              <button
                type="button"
                onClick={() => setActiveTab('campus_cash')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === 'campus_cash'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span>Campus Cash / COD</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                  ₹{user.campusCashBalance}
                </span>
              </button>

              {/* Owner Receiving Badge */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] p-3 rounded-xl bg-[#162321] text-[11px] text-[#94A3B8] space-y-1">
                <div className="text-white font-bold flex items-center gap-1 text-[10px] uppercase text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Receiving Merchant</span>
                </div>
                <div className="text-white font-semibold">{merchantDetails.accountHolderName}</div>
                <div>{merchantDetails.bankName}</div>
                <div className="font-mono text-emerald-400">{merchantDetails.merchantUpiId}</div>
              </div>
            </div>

            {/* Right Column: Tab View Panels */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* TAB 1: UPI / QR */}
              {activeTab === 'upi' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Scan Dynamic UPI QR Code</span>
                        <span className="text-xs font-mono text-amber-300 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          ⏱️ {formatTimer(upiCountdown)}
                        </span>
                      </h4>
                      <span className="text-[11px] text-[#94A3B8]">Instant Direct Credit</span>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Scan with PhonePe, Google Pay, Paytm, or CRED. Money goes directly to Owner <strong>{merchantDetails.accountHolderName}</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    {/* Simulated High-Res Dynamic QR */}
                    <div className="p-4 rounded-2xl bg-[#0E1716] border border-white/[0.08] text-center space-y-3">
                      <div className="relative mx-auto w-44 h-44 bg-white p-3 rounded-xl flex items-center justify-center shadow-lg">
                        <div className="w-full h-full bg-[#0B1313] p-1.5 rounded flex flex-col justify-between">
                          <div className="flex justify-between">
                            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                              <div className="w-4 h-4 bg-black" />
                            </div>
                            <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
                            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                              <div className="w-4 h-4 bg-black" />
                            </div>
                          </div>
                          <div className="flex items-center justify-center py-1">
                            <span className="text-[8px] font-mono font-bold text-white bg-emerald-600 px-1 rounded truncate max-w-[120px]">
                              {merchantDetails.merchantUpiId}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                              <div className="w-4 h-4 bg-black" />
                            </div>
                            <div className="w-4 h-4 bg-white rounded-sm" />
                            <div className="w-4 h-4 bg-amber-400 rounded-sm" />
                          </div>
                        </div>
                      </div>

                      <div className="text-xs space-y-1">
                        <div className="text-[#94A3B8]">
                          Payee: <strong className="text-white">{merchantDetails.accountHolderName}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(merchantDetails.merchantUpiId, 'upi')}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                          <span>{merchantDetails.merchantUpiId}</span>
                          {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Direct UPI Apps Selector */}
                    <div className="space-y-3">
                      <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                        One-Click Pay with UPI App
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'phonepe', name: 'PhonePe', color: '#5F259F' },
                          { id: 'gpay', name: 'Google Pay', color: '#4285F4' },
                          { id: 'paytm', name: 'Paytm UPI', color: '#00BAF2' },
                          { id: 'cred', name: 'CRED UPI', color: '#E8A735' },
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => setSelectedUpiApp(app.id)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                              selectedUpiApp === app.id
                                ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                                : 'bg-[#0E1716] border-white/[0.06] text-[#94A3B8] hover:text-white'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: app.color }}
                            />
                            <span>{app.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="pt-2">
                        <label className="block text-[11px] text-[#94A3B8] mb-1">
                          Or Enter Custom UPI ID (VPA)
                        </label>
                        <input
                          type="text"
                          value={customUpiId}
                          onChange={(e) => setCustomUpiId(e.target.value)}
                          placeholder="e.g. yourname@okaxis"
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARDS */}
              {activeTab === 'card' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Credit &amp; Debit Cards</h4>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Payment processed via merchant gateway directly into {merchantDetails.bankName}.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DIRECT OWNER BANK TRANSFER (IMPS / NEFT) */}
              {activeTab === 'netbanking' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Direct Owner Bank Account Transfer</h4>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Send payment directly to the owner's bank account via IMPS/NEFT or Net Banking.
                    </p>
                  </div>

                  {/* Owner Verified Bank Account Details Card */}
                  <div className="p-4 rounded-xl bg-[#0E1716] border border-emerald-500/30 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">
                        Owner Bank Account Details
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `A/C: ${merchantDetails.accountNumber}, IFSC: ${merchantDetails.ifscCode}, Name: ${merchantDetails.accountHolderName}`,
                            'bank'
                          )
                        }
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                      >
                        {copiedBank ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy All Details</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Account Name:</span>
                        <span className="text-white font-semibold">{merchantDetails.accountHolderName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Bank Name:</span>
                        <span className="text-white font-semibold">{merchantDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Account Number:</span>
                        <span className="text-amber-300 font-mono font-bold">{merchantDetails.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">IFSC Code:</span>
                        <span className="text-white font-mono">{merchantDetails.ifscCode}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                      Select Your Net Banking Portal
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs cursor-pointer"
                    >
                      {indianBanks.map((bank) => (
                        <option key={bank.id} value={bank.id} className="bg-[#162321]">
                          {bank.name} ({bank.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 4: CAMPUS CASH / COD */}
              {activeTab === 'campus_cash' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Campus Cash &amp; Pay at Counter</h4>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Use your official SRM AP Student ID RFID balance or pay cash when collecting.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-[#0E1716] border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Student ID Card Verified
                      </span>
                      <span className="text-xs font-mono text-white">{user.regNumber}</span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <div className="text-sm font-bold text-white">{user.name}</div>
                        <div className="text-xs text-[#94A3B8]">{user.department}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#94A3B8] block">Available Balance</span>
                        <span className="text-lg font-mono font-extrabold text-[#22C55E]">
                          ₹{user.campusCashBalance}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setCampusPaymentType('campus_wallet')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        campusPaymentType === 'campus_wallet'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                          : 'bg-[#0E1716] border-white/[0.06] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Campus Cash Debit</span>
                        {campusPaymentType === 'campus_wallet' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-1">
                        Deducts ₹{amount} instantly from ID RFID wallet.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCampusPaymentType('cod')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        campusPaymentType === 'cod'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                          : 'bg-[#0E1716] border-white/[0.06] text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Pay at Counter (COD)</span>
                        {campusPaymentType === 'cod' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-1">
                        Pay cash directly to xerox operator at pickup.
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Payment Button */}
              <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Credit to {merchantDetails.accountHolderName}</span>
                </div>

                <button
                  type="button"
                  onClick={handleExecutePayment}
                  className="px-6 py-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] active:scale-95"
                >
                  <span>Pay ₹{amount}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
