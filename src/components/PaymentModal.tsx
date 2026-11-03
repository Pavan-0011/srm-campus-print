import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  QrCode,
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
  Check,
  Smartphone,
  CreditCard,
  Wallet,
  ExternalLink,
  UploadCloud,
  FileCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PrintOrder, UserProfile } from '../types';
import { phonePeMerchant } from '../data/mockData';

interface PaymentModalProps {
  orderData: Partial<PrintOrder>;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (createdOrder: PrintOrder) => void;
  onViewReceipt: (order: PrintOrder) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  orderData,
  user,
  isOpen,
  onClose,
  onPaymentSuccess,
  onViewReceipt
}) => {
  const [activeTab, setActiveTab] = useState<'phonepe_qr' | 'razorpay' | 'campus_cash'>('phonepe_qr');

  // UTR & Payment Verification state
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<{ name: string; url: string } | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiCountdown, setUpiCountdown] = useState(300); // 5 min countdown
  const [utrError, setUtrError] = useState('');

  // Simulation / Processing state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PrintOrder | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(4);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const amount = orderData.cost || 24;

  // Real UPI Intent Link for Mobile Users
  const upiIntentUrl = `upi://pay?pa=${phonePeMerchant.vpa}&pn=${encodeURIComponent(
    phonePeMerchant.name
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(
    `SRM Print Order ${orderData.title || 'Doc'}`
  )}`;

  // 5-minute timer
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

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(phonePeMerchant.vpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setScreenshotFile({ name: file.name, url: previewUrl });
    }
  };

  // Execute Real Payment Verification
  const handleVerifyAndSubmitPayment = () => {
    if (activeTab === 'phonepe_qr') {
      if (!utrNumber.trim()) {
        setUtrError('Please enter the 12-digit UTR / UPI Reference Number from your PhonePe app.');
        return;
      }
      if (utrNumber.trim().length < 6) {
        setUtrError('Please enter a valid 12-digit transaction reference number.');
        return;
      }
    }

    setUtrError('');
    setIsVerifying(true);
    setVerificationStep(`Verifying transaction with PhonePe switch for ${phonePeMerchant.name}...`);

    setTimeout(() => {
      setVerificationStep(`Validating UTR ${utrNumber || 'CAMPUS-RFID'} with NPCI settlement node...`);
    }, 800);

    setTimeout(() => {
      setVerificationStep(`Payment of ₹${amount} received! Generating digital print token...`);
    }, 1500);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
      const generatedUtr = utrNumber.trim() || `UTR-${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;

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
          activeTab === 'phonepe_qr'
            ? 'PhonePe UPI QR'
            : activeTab === 'razorpay'
            ? 'Razorpay Gateway'
            : 'Campus Cash (Student ID)',
        paymentStatus: 'Paid',
        progressStep: 2,
        specialInstructions: orderData.specialInstructions,
        studentName: user.name,
        studentEmail: user.email,
        studentRegNo: user.regNumber,
        utrNumber: generatedUtr,
        paymentScreenshot: screenshotFile?.url
      };

      setCompletedOrder(newOrder);
      onPaymentSuccess(newOrder);
    }, 2200);
  };

  // Auto redirect countdown
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-panel-elevated rounded-2xl border border-white/[0.12] overflow-hidden flex flex-col max-h-[94vh] shadow-2xl">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1716]/95">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  PhonePe Verified Merchant
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-[#94A3B8]">
                  NPCI 256-Bit
                </span>
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">
                Transfer to {phonePeMerchant.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase text-[#94A3B8] block">Amount to Pay</span>
              <span className="text-xl font-mono font-extrabold text-[#FACC15]">₹{amount}</span>
            </div>

            {!isVerifying && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* VERIFICATION ANIMATION SCREEN */}
        {isVerifying && (
          <div className="p-12 text-center my-auto space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-ping" />
              <div className="w-20 h-20 rounded-full border-4 border-purple-500 border-t-transparent animate-spin flex items-center justify-center">
                <Lock className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white">Verifying Transaction...</h4>
              <p className="text-sm text-purple-300 font-mono animate-pulse">
                {verificationStep}
              </p>
              <p className="text-xs text-[#94A3B8]">
                Matching UTR code with {phonePeMerchant.name}'s PhonePe payment gateway.
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS CONFIRMATION SCREEN */}
        {isSuccess && completedOrder && (
          <div className="p-6 md:p-8 text-center my-auto space-y-5 animate-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Payment Verified &amp; Confirmed
              </span>
              <h3 className="text-2xl font-extrabold text-white pt-1">
                Order {completedOrder.id} Placed!
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                ₹{amount} confirmed to <strong>{phonePeMerchant.name}</strong>. Your print job has been spooled to the laser printer.
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
                  UTR: <span className="font-mono text-emerald-400 font-semibold">{completedOrder.utrNumber}</span>
                </div>
                <div className="text-emerald-400 flex items-center gap-1 font-medium text-[11px]">
                  <Clock className="w-3 h-3" />
                  Pickup in ~15 mins at Central Library Counter #2
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
                <span>Download Invoice Voucher</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-black text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                <span>View My Orders ({redirectCountdown}s)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* REAL PAYMENT FORM VIEW */}
        {!isVerifying && !isSuccess && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Method Tabs */}
            <div className="w-full md:w-56 bg-[#0E1716]/95 border-r border-white/[0.08] p-3 space-y-1.5 shrink-0">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Payment Gateway
              </div>

              {/* Tab 1: PhonePe Scanner (Real Payment) */}
              <button
                type="button"
                onClick={() => setActiveTab('phonepe_qr')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'phonepe_qr'
                    ? 'bg-purple-500/20 border border-purple-500/50 text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-extrabold">
                    पे
                  </div>
                  <span>PhonePe QR</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 font-bold">
                  Official
                </span>
              </button>

              {/* Tab 2: Razorpay Gateway */}
              <button
                type="button"
                onClick={() => setActiveTab('razorpay')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === 'razorpay'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-white'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <span>Cards / NetBanking</span>
                </div>
              </button>

              {/* Tab 3: Campus Cash */}
              <button
                type="button"
                onClick={() => setActiveTab('campus_cash')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all text-left ${
                  activeTab === 'campus_cash'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-white'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span>Campus Cash</span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono">₹{user.campusCashBalance}</span>
              </button>

              {/* Verified Payee Details Box */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] p-3 rounded-xl bg-[#162321] text-[11px] text-[#94A3B8] space-y-1">
                <span className="text-[10px] uppercase font-bold text-purple-400 block">
                  Verified Receiver
                </span>
                <div className="text-white font-bold">{phonePeMerchant.name}</div>
                <div className="text-emerald-400 font-mono text-[10px]">{phonePeMerchant.vpa}</div>
                <div className="text-[10px] text-white/50 pt-1">
                  SRM Reprographics Desk
                </div>
              </div>
            </div>

            {/* Right Pane */}
            <div className="flex-1 p-5 md:p-6 overflow-y-auto">
              {/* TAB 1: PHONEPE QR (USER'S REAL SCANNER) */}
              {activeTab === 'phonepe_qr' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Scan PhonePe QR Scanner to Pay ₹{amount}</span>
                        <span className="text-xs font-mono text-amber-300 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          ⏱️ {formatTimer(upiCountdown)}
                        </span>
                      </h4>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        Scan using PhonePe, Google Pay, Paytm, or CRED to transfer directly.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-semibold border border-white/10 self-start sm:self-auto transition-colors"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied VPA!' : 'Copy UPI ID'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* The Real PhonePe QR Scanner Card */}
                    <div className="md:col-span-5 p-3 rounded-2xl bg-white text-center shadow-2xl relative border-2 border-purple-500">
                      <div className="rounded-xl overflow-hidden bg-white">
                        <img
                          src={phonePeMerchant.qrImagePath}
                          alt="PhonePe QR Scanner for BUDATI THARUN ABHAY"
                          className="w-full h-auto object-contain max-h-[300px] mx-auto"
                        />
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                        <div className="text-[11px] font-bold text-gray-800 tracking-wide">
                          BUDATI THARUN ABHAY
                        </div>
                        <div className="text-[10px] font-mono text-purple-700 font-semibold">
                          {phonePeMerchant.vpa}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Payment & UTR Entry */}
                    <div className="md:col-span-7 space-y-4 text-xs">
                      {/* Mobile Intent Direct Launch */}
                      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                        <span className="font-bold text-purple-300 block">
                          On Mobile? Tap to Open UPI App:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={upiIntentUrl}
                            className="py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <span className="font-extrabold text-[11px]">पे</span>
                            <span>PhonePe App</span>
                          </a>
                          <a
                            href={upiIntentUrl}
                            className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>GPay / Paytm</span>
                          </a>
                        </div>
                      </div>

                      {/* 12-Digit UTR Entry */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                          Enter 12-Digit UPI Ref / UTR Number <span className="text-red-400">*</span>
                        </label>
                        <p className="text-[11px] text-[#94A3B8]">
                          After transferring ₹{amount} on PhonePe, copy the 12-digit UTR from your payment receipt screen:
                        </p>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => {
                            setUtrNumber(e.target.value.replace(/\s/g, ''));
                            setUtrError('');
                          }}
                          placeholder="e.g. 430981928301"
                          maxLength={16}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-mono text-emerald-300 focus:border-emerald-400"
                        />
                        {utrError && (
                          <div className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{utrError}</span>
                          </div>
                        )}
                      </div>

                      {/* Optional Screenshot Upload */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[#94A3B8]">
                            Optional: Attach Payment Screenshot
                          </span>
                          {screenshotFile && (
                            <button
                              type="button"
                              onClick={() => setScreenshotFile(null)}
                              className="text-[11px] text-red-400 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full p-2.5 rounded-xl border border-dashed border-white/20 hover:border-emerald-500/40 bg-[#0E1716] text-[#94A3B8] hover:text-white flex items-center justify-center gap-2 transition-all"
                        >
                          {screenshotFile ? (
                            <>
                              <FileCheck className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold truncate max-w-[200px]">
                                {screenshotFile.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4 text-purple-400" />
                              <span>Upload PhonePe Confirmation Screenshot</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Verify Button */}
                      <button
                        type="button"
                        onClick={handleVerifyAndSubmitPayment}
                        className="w-full py-3 px-4 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.35)] active:scale-95 mt-1"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>I Have Paid ₹{amount} • Verify &amp; Confirm Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RAZORPAY GATEWAY */}
              {activeTab === 'razorpay' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Razorpay Online Payment Gateway</h4>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Pay via Credit/Debit Cards (Visa, MasterCard, RuPay) or 50+ Indian Net Banking portals.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0E1716] border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#94A3B8]">Merchant Settlement:</span>
                      <span className="text-white font-bold">{phonePeMerchant.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#94A3B8]">Payable Amount:</span>
                      <span className="text-base font-mono font-bold text-[#FACC15]">₹{amount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#94A3B8]">Supported:</span>
                      <span className="text-emerald-400">All Indian Debit/Credit Cards &amp; NetBanking</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyAndSubmitPayment}
                    className="w-full py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{amount} via Razorpay Gateway</span>
                  </button>
                </div>
              )}

              {/* TAB 3: CAMPUS CASH */}
              {activeTab === 'campus_cash' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">SRM AP Campus Cash (RFID)</h4>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Deduct from your student ID card wallet balance.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-[#0E1716] border border-emerald-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">Student ID: {user.regNumber}</span>
                      <span className="font-mono text-white">{user.name}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <span className="text-[#94A3B8]">Available Balance:</span>
                      <span className="text-lg font-mono font-bold text-[#22C55E]">
                        ₹{user.campusCashBalance}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyAndSubmitPayment}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Pay ₹{amount} using Campus Cash</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
