import React, { useState } from 'react';
import {
  Building2,
  Wallet,
  TrendingUp,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Printer,
  Clock,
  ArrowRight,
  Eye,
  RefreshCw,
  Edit3,
  Save,
  Check,
  Send,
  Download,
  Filter,
  Search,
  Users,
  Copy,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  MerchantBankDetails,
  PrintOrder,
  TransactionRecord,
  OrderStatus
} from '../types';

interface AdminPortalProps {
  merchantDetails: MerchantBankDetails;
  onUpdateMerchantDetails: (updated: MerchantBankDetails) => void;
  orders: PrintOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  transactions: TransactionRecord[];
  onManualSettleBalance: (amount: number) => void;
  onSwitchToStudentView: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  merchantDetails,
  onUpdateMerchantDetails,
  orders,
  onUpdateOrderStatus,
  transactions,
  onManualSettleBalance,
  onSwitchToStudentView
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'bank' | 'orders' | 'transactions'>('bank');

  // Edit Bank Details State
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankFormData, setBankFormData] = useState<MerchantBankDetails>(merchantDetails);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Settlement Modal State
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [settleSuccess, setSettleSuccess] = useState<string | null>(null);

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Handle Bank Form Change
  const handleInputChange = (field: keyof MerchantBankDetails, value: any) => {
    setBankFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMerchantDetails(bankFormData);
    setIsEditingBank(false);
    setSaveToast('Merchant Bank & UPI details successfully updated! Student payments will now route to this account.');
    setTimeout(() => setSaveToast(null), 4000);
  };

  const handleTriggerSettlement = () => {
    if (merchantDetails.pendingSettlement <= 0) {
      alert('No unsettled balance available at the moment.');
      return;
    }
    setIsSettling(true);
    setTimeout(() => {
      setIsSettling(false);
      onManualSettleBalance(merchantDetails.pendingSettlement);
      setSettleSuccess(`₹${merchantDetails.pendingSettlement} transferred to ${merchantDetails.bankName} (A/C ...${merchantDetails.accountNumber.slice(-4)}) via IMPS.`);
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (err) {}
      setTimeout(() => {
        setSettleSuccess(null);
        setIsSettleModalOpen(false);
      }, 2500);
    }, 1500);
  };

  // Filtered orders in Admin
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      !orderSearchQuery ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.title.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (o.studentName && o.studentName.toLowerCase().includes(orderSearchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-emerald-500 text-black font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* TOP OWNER BANNER */}
      <div className="p-6 md:p-8 rounded-2xl glass-panel border border-emerald-500/30 relative overflow-hidden shadow-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MERCHANT &amp; OWNER CONSOLE
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Receiving Account
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {merchantDetails.businessName}
            </h1>
            <p className="text-xs md:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              All student print payments (UPI, Cards, Net Banking, and Campus Cash) are collected here and deposited into your registered bank account <strong>{merchantDetails.bankName} (A/C ...{merchantDetails.accountNumber.slice(-4)})</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSettleModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-black font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <Send className="w-4 h-4" />
              <span>Settle Balance to Bank</span>
            </button>
            <button
              onClick={onSwitchToStudentView}
              className="px-4 py-2.5 rounded-xl bg-[#162321] hover:bg-[#1B2C29] text-emerald-400 font-semibold text-xs border border-emerald-500/30 flex items-center gap-2 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Preview as Student</span>
            </button>
          </div>
        </div>
      </div>

      {/* REVENUE & SETTLEMENT KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue Collected */}
        <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase">
            <span>Total Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#F8FAFC] font-mono">
            ₹{totalRevenue}
          </div>
          <div className="text-[11px] text-[#94A3B8] flex items-center justify-between">
            <span>{transactions.length} student payments</span>
            <span className="text-emerald-400 font-medium">100% Collected</span>
          </div>
        </div>

        {/* Metric 2: Settled into Bank */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 uppercase">
            <span>Credited to Bank</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            ₹{merchantDetails.settledToBank}
          </div>
          <div className="text-[11px] text-[#94A3B8] flex items-center justify-between">
            <span>Direct IMPS Bank Deposits</span>
            <span className="text-emerald-400 font-mono">{merchantDetails.bankName.split(' ')[0]}</span>
          </div>
        </div>

        {/* Metric 3: Pending Settlement / Gateway Pool */}
        <div className="p-5 rounded-2xl glass-panel border-amber-400/30 space-y-2 shadow-[0_0_20px_rgba(250,204,21,0.05)]">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-300 uppercase">
            <span>Unsettled Balance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#FACC15] font-mono">
            ₹{merchantDetails.pendingSettlement}
          </div>
          <div className="text-[11px] text-[#94A3B8] flex items-center justify-between">
            <span>Available for instant transfer</span>
            <button
              onClick={() => setIsSettleModalOpen(true)}
              className="text-amber-300 underline font-semibold hover:text-amber-200"
            >
              Transfer Now →
            </button>
          </div>
        </div>

        {/* Metric 4: Active Receiving UPI VPA */}
        <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase">
            <span>Receiving UPI ID</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-mono font-bold text-sky-300 truncate" title={merchantDetails.merchantUpiId}>
            {merchantDetails.merchantUpiId}
          </div>
          <div className="text-[11px] text-[#94A3B8] flex items-center justify-between pt-1">
            <span>PhonePe • GPay • Paytm</span>
            <span className="text-emerald-400">Live &amp; Active</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS FOR ADMIN */}
      <div className="flex border-b border-white/[0.08] text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveAdminTab('bank')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeAdminTab === 'bank'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Receiving Bank &amp; UPI Gateway Settings</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeAdminTab === 'orders'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Print Fulfillment Queue ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('transactions')}
          className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            activeAdminTab === 'transactions'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Student Payment Ledger ({transactions.length})</span>
        </button>
      </div>

      {/* TAB 1: RECEIVING BANK & UPI SETTINGS */}
      {activeAdminTab === 'bank' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Bank Details (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Owner's Receiving Bank Account Details</span>
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Money paid by students for print jobs will be credited directly to this bank account.
                </p>
              </div>

              {!isEditingBank ? (
                <button
                  type="button"
                  onClick={() => setIsEditingBank(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Bank Details</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingBank(false)}
                  className="text-xs text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveBankDetails} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Account Holder Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingBank}
                    value={bankFormData.accountHolderName}
                    onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      isEditingBank ? 'glass-input' : 'bg-[#0E1716] border border-white/[0.05] text-white'
                    }`}
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Business / Shop Display Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingBank}
                    value={bankFormData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      isEditingBank ? 'glass-input' : 'bg-[#0E1716] border border-white/[0.05] text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bank Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingBank}
                    value={bankFormData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="e.g. HDFC Bank, SBI, ICICI"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      isEditingBank ? 'glass-input' : 'bg-[#0E1716] border border-white/[0.05] text-white'
                    }`}
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingBank}
                    value={bankFormData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold ${
                      isEditingBank ? 'glass-input text-amber-300' : 'bg-[#0E1716] border border-white/[0.05] text-amber-300'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* IFSC Code */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingBank}
                    value={bankFormData.ifscCode}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono ${
                      isEditingBank ? 'glass-input' : 'bg-[#0E1716] border border-white/[0.05] text-white'
                    }`}
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingBank}
                    value={bankFormData.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      isEditingBank ? 'glass-input' : 'bg-[#0E1716] border border-white/[0.05] text-white'
                    }`}
                  />
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Account Type
                  </label>
                  <select
                    disabled={!isEditingBank}
                    value={bankFormData.accountType}
                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs appearance-none ${
                      isEditingBank ? 'glass-input' : 'bg-[#0E1716] border border-white/[0.05] text-white'
                    }`}
                  >
                    <option value="Current" className="bg-[#162321]">Current Account</option>
                    <option value="Savings" className="bg-[#162321]">Savings Account</option>
                  </select>
                </div>
              </div>

              {/* Merchant UPI ID (VPA) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-[#0E1716] border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" />
                    <span>Merchant UPI Receiving VPA (Dynamic QR Target)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Direct Payout
                  </span>
                </div>
                <div>
                  <input
                    type="text"
                    disabled={!isEditingBank}
                    value={bankFormData.merchantUpiId}
                    onChange={(e) => handleInputChange('merchantUpiId', e.target.value)}
                    placeholder="e.g. yourname@hdfcbank or yourshop@okaxis"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold ${
                      isEditingBank ? 'glass-input text-emerald-300' : 'bg-[#0E1716] border border-white/[0.05] text-emerald-300'
                    }`}
                  />
                  <p className="text-[11px] text-[#94A3B8] mt-1.5">
                    When students scan the QR code or pay via PhonePe/GPay, the payment gateway encodes this VPA into the UPI payload.
                  </p>
                </div>
              </div>

              {/* Business Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    Business PAN
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingBank}
                    value={bankFormData.businessPan}
                    onChange={(e) => handleInputChange('businessPan', e.target.value.toUpperCase())}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono ${
                      isEditingBank ? 'glass-input' : 'bg-[#0E1716] border border-white/[0.05] text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                    GSTIN Registration
                  </label>
                  <input
                    type="text"
                    disabled={!isEditingBank}
                    value={bankFormData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono ${
                      isEditingBank ? 'glass-input' : 'bg-[#0E1716] border border-white/[0.05] text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Auto Settlement Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0E1716] border border-white/[0.06] text-xs">
                <div>
                  <span className="font-semibold text-white block">Auto-Settlement to Bank</span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Automatically transfer collected amounts to bank account every evening at 10 PM
                  </span>
                </div>
                <input
                  type="checkbox"
                  disabled={!isEditingBank}
                  checked={bankFormData.autoSettleToBank}
                  onChange={(e) => handleInputChange('autoSettleToBank', e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-[#162321] border-white/20"
                />
              </div>

              {isEditingBank && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Activate Bank Details</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Live Payment Routing Architecture Card (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Real-time Routing Visualizer */}
            <div className="rounded-2xl glass-panel p-6 border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>How Money Flows to Your Account</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* Step 1 */}
                <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.05] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-white">Student Places Print Order</div>
                    <div className="text-[11px] text-[#94A3B8]">
                      Selects PDF, page count &amp; proceeds to checkout.
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.05] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-white">Scans Owner's UPI QR</div>
                    <div className="text-[11px] text-[#94A3B8]">
                      Dynamic QR code is generated pointing to <strong className="text-emerald-400">{merchantDetails.merchantUpiId}</strong>.
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.05] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-white">Direct Bank Credit</div>
                    <div className="text-[11px] text-[#94A3B8]">
                      NPCI UPI switch credits money directly to <strong className="text-white">{merchantDetails.bankName}</strong>.
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3 rounded-xl bg-[#0E1716] border border-white/[0.05] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <div className="font-semibold text-white">Order Appears on Counter</div>
                    <div className="text-[11px] text-[#94A3B8]">
                      Verified order enters your laser printing queue with UTR code.
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Certificate Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#162321] to-[#0E1716] border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>Merchant Gateway Status</span>
                  <span>100% OPERATIONAL</span>
                </div>
                <div className="text-[11px] text-[#94A3B8]">
                  Verified for Indian Retail Banks (SBI, HDFC, ICICI, Axis) and all UPI apps.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRINT FULFILLMENT QUEUE */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Operator Queue &amp; Laser Print Station</h3>
              <p className="text-xs text-[#94A3B8]">
                Advance student orders as jobs finish printing and binding at the counter
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 text-xs">
              {['all', 'New', 'In Progress', 'Ready for Pickup', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    orderStatusFilter === st
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#0E1716] text-[#94A3B8] border border-white/[0.05]'
                  }`}
                >
                  {st === 'all' ? 'All Jobs' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl glass-panel border border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#0E1716]/90 text-[#94A3B8] uppercase text-[10px]">
                    <th className="py-3 px-4">Order ID &amp; Token</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Document Specs</th>
                    <th className="py-3 px-4">Amount Paid</th>
                    <th className="py-3 px-4">Payment UTR</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Counter Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-emerald-400">{order.id}</div>
                        <div className="text-[10px] text-amber-300 font-bold">
                          Token: {order.pickupToken || 'SRM-8041'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{order.studentName || 'B. Tharun'}</div>
                        <div className="text-[10px] text-[#94A3B8] font-mono">{order.studentRegNo || 'AP21110010482'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white max-w-[200px] truncate">{order.title}</div>
                        <div className="text-[10px] text-[#94A3B8]">
                          {order.pageCount} pgs × {order.copies} | {order.printType} | {order.binding}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#FACC15]">
                        ₹{order.cost}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] font-mono text-[#94A3B8]">
                        <span className="text-emerald-400 font-semibold">{order.utrNumber || 'UTR-330491829012'}</span>
                        <span className="block text-[10px] text-[#94A3B8]">{order.paymentMethod}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        {order.status === 'New' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-[#60A5FA] border border-blue-500/30 font-bold">
                            New Job
                          </span>
                        )}
                        {order.status === 'In Progress' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-[#FACC15] border border-amber-400/30 font-bold">
                            Printing...
                          </span>
                        )}
                        {order.status === 'Ready for Pickup' && (
                          <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-[#38BDF8] border border-sky-500/30 font-bold">
                            Ready at Desk
                          </span>
                        )}
                        {order.status === 'Completed' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                            Delivered
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'New' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'In Progress')}
                              className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-[11px] border border-amber-400/40"
                            >
                              Spool to Laser
                            </button>
                          )}
                          {order.status === 'In Progress' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'Ready for Pickup')}
                              className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-[11px] border border-sky-500/40"
                            >
                              Mark Ready
                            </button>
                          )}
                          {order.status === 'Ready for Pickup' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'Completed')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-[11px]"
                            >
                              Confirm Pickup
                            </button>
                          )}
                          {order.status === 'Completed' && (
                            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              Handed Over
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT PAYMENT TRANSACTIONS LEDGER */}
      {activeAdminTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Student Payments Received (Owner Bank Ledger)</h3>
              <p className="text-xs text-[#94A3B8]">
                Every student payment with bank destination, NPCI UTR reference, and settlement state
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-mono font-bold">
              Total Credited: ₹{totalRevenue}
            </div>
          </div>

          <div className="rounded-2xl glass-panel border border-white/[0.08] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-[#0E1716]/90 text-[#94A3B8] uppercase text-[10px]">
                    <th className="py-3 px-4">Transaction ID &amp; UTR</th>
                    <th className="py-3 px-4">Student Details</th>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Destination Bank Account</th>
                    <th className="py-3 px-4">Payment Mode</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-emerald-400">{txn.id}</div>
                        <div className="text-[10px] text-[#94A3B8]">{txn.utrNumber}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{txn.studentName}</div>
                        <div className="text-[10px] text-[#94A3B8] font-mono">{txn.studentRegNo}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        {txn.orderId}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-extrabold text-[#FACC15] text-sm">
                        ₹{txn.amount}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{txn.destinationBank}</div>
                        <div className="text-[10px] font-mono text-emerald-400">{txn.destinationUpi}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[#94A3B8]">
                        {txn.paymentMethod}
                        <div className="text-[10px] text-white/40">{txn.timestamp}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 className="w-3 h-3" />
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INSTANT SETTLEMENT MODAL */}
      {isSettleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md glass-panel-elevated rounded-2xl p-6 border border-white/[0.12] space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Transfer Collections to Bank Account</span>
              </h3>
              <button
                onClick={() => setIsSettleModalOpen(false)}
                className="text-xs text-[#94A3B8] hover:text-white"
              >
                ✕
              </button>
            </div>

            {settleSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-sm font-bold text-white">Transfer Complete!</div>
                <div className="text-xs text-[#94A3B8]">{settleSuccess}</div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#0E1716] border border-white/[0.06] space-y-2">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Pending Unsettled Amount:</span>
                    <span className="text-lg font-mono font-extrabold text-[#FACC15]">
                      ₹{merchantDetails.pendingSettlement}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8] pt-1 border-t border-white/[0.04]">
                    <span>Destination Bank:</span>
                    <span className="text-white font-semibold">{merchantDetails.bankName}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Account Number:</span>
                    <span className="text-white font-mono">{merchantDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>IFSC Code:</span>
                    <span className="text-white font-mono">{merchantDetails.ifscCode}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Payout Speed:</span>
                    <span className="text-emerald-400 font-semibold">Instant IMPS (0 fees)</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSettling}
                  onClick={handleTriggerSettlement}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  {isSettling ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Transfer ₹{merchantDetails.pendingSettlement} to My Bank Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
