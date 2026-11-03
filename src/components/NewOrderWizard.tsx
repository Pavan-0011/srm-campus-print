import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  Check,
  Plus,
  Minus,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileCheck,
  CreditCard,
  Settings,
  BookOpen
} from 'lucide-react';
import { PrintOrder } from '../types';

interface NewOrderWizardProps {
  initialPreset?: Partial<PrintOrder>;
  onProceedToPayment: (orderData: Partial<PrintOrder>) => void;
  onCancel: () => void;
}

export const NewOrderWizard: React.FC<NewOrderWizardProps> = ({
  initialPreset,
  onProceedToPayment,
  onCancel
}) => {
  // Upload & File state
  const [file, setFile] = useState<{
    name: string;
    size: string;
    pages: number;
    type: string;
  } | null>(() => {
    if (initialPreset?.fileName) {
      return {
        name: initialPreset.fileName,
        size: initialPreset.fileSize || '3.4 MB',
        pages: initialPreset.pageCount || 1,
        type: 'application/pdf'
      };
    }
    // Clean empty state by default for new users
    return null;
  });

  const [documentTitle, setDocumentTitle] = useState(
    initialPreset?.title || ''
  );
  const [productType, setProductType] = useState(
    initialPreset?.productType || 'Print Documents (PDF, DOCX)'
  );

  // Print Settings
  const [copies, setCopies] = useState(initialPreset?.copies || 1);
  const [printType, setPrintType] = useState<'Black & White' | 'Color'>(
    initialPreset?.printType || 'Black & White'
  );
  const [sides, setSides] = useState<'Single Side' | 'Both Sides'>(
    initialPreset?.sides || 'Both Sides'
  );
  const [binding, setBinding] = useState<'None' | 'Corner Staple' | 'Spiral' | 'Hard Binding'>(
    initialPreset?.binding || 'None'
  );
  const [paperSize, setPaperSize] = useState<'A4' | 'A3' | 'Letter'>(
    initialPreset?.paperSize || 'A4'
  );
  const [paperQuality, setPaperQuality] = useState<'Standard (75 GSM)' | 'Premium (100 GSM)'>(
    initialPreset?.paperQuality || 'Standard (75 GSM)'
  );
  const [specialInstructions, setSpecialInstructions] = useState(
    initialPreset?.specialInstructions || ''
  );

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pricing Calculation
  // Black & White: ₹2 / page; Color: ₹5 / page
  // Binding: None = 0, Staple = 5, Spiral = 30, Hard = 120
  const pages = file ? file.pages : 0;
  const ratePerPage = printType === 'Color' ? 5 : 2;
  const paperQualitySurcharge = paperQuality === 'Premium (100 GSM)' ? 1 : 0;
  const bindingCost =
    binding === 'Spiral' ? 30 : binding === 'Hard Binding' ? 120 : binding === 'Corner Staple' ? 5 : 0;

  const totalPages = pages * copies;
  const estimatedCost = file ? totalPages * (ratePerPage + paperQualitySurcharge) + bindingCost : 0;

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';
    // Simulate smart page count estimation based on size or name
    let estimatedPages = Math.max(1, Math.min(60, Math.round(selectedFile.size / 75000)));
    if (estimatedPages === 0) estimatedPages = 6;

    setFile({
      name: selectedFile.name,
      size: sizeInMB,
      pages: estimatedPages,
      type: selectedFile.type || 'application/pdf'
    });

    if (!documentTitle) {
      const cleanTitle = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      setDocumentTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    }
  };

  const handleProceed = () => {
    if (!file) {
      alert('Please upload a document to proceed.');
      return;
    }

    onProceedToPayment({
      title: documentTitle || 'Print Job',
      productType,
      fileName: file.name,
      fileSize: file.size,
      pageCount: file.pages,
      copies,
      printType,
      sides,
      binding,
      paperSize,
      paperQuality,
      cost: estimatedCost,
      specialInstructions
    });
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-200">
      {/* Stepper Header */}
      <div className="rounded-2xl glass-panel p-4 md:p-6 border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Step 1 of 3
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] mt-1">
              Place a Print Order
            </h1>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span>Upload &amp; Settings</span>
            </div>
            <span className="text-white/20">➔</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] text-[#94A3B8] border border-white/[0.05]">
              <span className="w-5 h-5 rounded-full bg-white/10 text-white text-xs font-medium flex items-center justify-center">
                2
              </span>
              <span>Payment</span>
            </div>
            <span className="text-white/20">➔</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] text-[#94A3B8] border border-white/[0.05]">
              <span className="w-5 h-5 rounded-full bg-white/10 text-white text-xs font-medium flex items-center justify-center">
                3
              </span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drag & Drop Zone + File Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* File Upload Zone */}
          <div className="rounded-2xl glass-panel p-6 border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#F8FAFC]">Upload Document</h2>
                <p className="text-xs text-[#94A3B8]">Supports PDF, DOCX, and PPTX up to 50 MB</p>
              </div>
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove File</span>
                </button>
              )}
            </div>

            {/* Dropzone Container */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 relative group ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                  : file
                  ? 'border-emerald-500/30 bg-[#0E1716]/80'
                  : 'border-white/10 hover:border-emerald-500/40 bg-[#0E1716]/40 hover:bg-[#0E1716]/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.ppt"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left p-3 rounded-xl bg-[#162321] border border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <FileText className="w-6 h-6 text-[#22C55E]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                        <span>{file.name}</span>
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                          Verified
                        </span>
                      </div>
                      <div className="text-xs text-[#94A3B8] flex items-center gap-2 mt-0.5">
                        <span>Size: {file.size}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-semibold">{file.pages} pages detected</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7 text-[#22C55E]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Drop your assignment or document here
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      or <span className="text-emerald-400 underline">browse your files</span>
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] text-[11px] text-[#94A3B8]">
                    <span>PDF • DOCX • PPTX (Direct Laser Compatibility)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Document Title & Product Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                  Order / Assignment Title
                </label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="e.g. Physics Assignment, DAA Lab Manual..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                  Product / Format Category
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm appearance-none cursor-pointer"
                >
                  <option value="Letter Booklet" className="bg-[#162321]">Letter Booklet</option>
                  <option value="Double-Sided Notes" className="bg-[#162321]">Double-Sided Notes</option>
                  <option value="Spiral Report" className="bg-[#162321]">Spiral Report</option>
                  <option value="Single Page Color" className="bg-[#162321]">Single Page Color</option>
                  <option value="Question Papers (Previous Years)" className="bg-[#162321]">
                    Question Papers (Previous Years)
                  </option>
                  <option value="Project Report (SRM Format)" className="bg-[#162321]">
                    Project Report (SRM Format)
                  </option>
                </select>
              </div>
            </div>

            {/* Manual Page Count Override (if student only wants specific range) */}
            {file && (
              <div className="p-3.5 rounded-xl bg-[#0E1716] border border-white/[0.06] flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-white block">Detected Page Count</span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Adjust if printing an excerpt or custom range
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFile({ ...file, pages: Math.max(1, file.pages - 1) })}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-amber-300 text-sm">
                    {file.pages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFile({ ...file, pages: file.pages + 1 })}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                  <span className="text-xs text-[#94A3B8]">pgs</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Print Options Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl glass-panel p-6 border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F8FAFC]">Print Specifications</h2>
              <span className="text-xs text-emerald-400 font-mono">Counter Rates</span>
            </div>

            {/* 1. Print Type: Black & White vs Color */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Print Color Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPrintType('Black & White')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    printType === 'Black & White'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                      : 'bg-[#0E1716] border-white/[0.06] text-[#94A3B8] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Black &amp; White</span>
                    {printType === 'Black & White' && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-amber-300 font-mono text-xs font-bold mt-1">
                    ₹2.00 / page
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">Sharp 1200 DPI Monochrome</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintType('Color')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    printType === 'Color'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                      : 'bg-[#0E1716] border-white/[0.06] text-[#94A3B8] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Full Color</span>
                    {printType === 'Color' && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-amber-300 font-mono text-xs font-bold mt-1">
                    ₹5.00 / page
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">Vivid Laser CMYK Gloss</div>
                </button>
              </div>
            </div>

            {/* 2. Sides: Single Side vs Both Sides */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Sides (Duplexing)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSides('Both Sides')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    sides === 'Both Sides'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-[#0E1716] border-white/[0.06] text-[#94A3B8] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Both Sides</span>
                    {sides === 'Both Sides' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
                    Standard Campus Policy
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">Saves paper &amp; bulk weight</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSides('Single Side')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    sides === 'Single Side'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-[#0E1716] border-white/[0.06] text-[#94A3B8] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Single Side</span>
                    {sides === 'Single Side' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-1">Formal Lab Submissions</div>
                  <div className="text-[10px] text-[#94A3B8]">One page per sheet</div>
                </button>
              </div>
            </div>

            {/* 3. Copies Counter (- / +) */}
            <div className="p-3.5 rounded-xl bg-[#0E1716] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Number of Copies</span>
                <span className="text-[11px] text-[#94A3B8]">Total document duplicates</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCopies(Math.max(1, copies - 1))}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold text-base transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-mono font-extrabold text-white text-lg">
                  {copies}
                </span>
                <button
                  type="button"
                  onClick={() => setCopies(copies + 1)}
                  className="w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-base transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4. Binding Addon Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Finishing &amp; Binding Add-on
              </label>
              <select
                value={binding}
                onChange={(e) => setBinding(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm appearance-none cursor-pointer"
              >
                <option value="None" className="bg-[#162321]">None (Loose Sheets) — ₹0</option>
                <option value="Corner Staple" className="bg-[#162321]">Corner Staple — ₹5</option>
                <option value="Spiral" className="bg-[#162321]">
                  Spiral Binding (Transparent PVC Cover) — ₹30
                </option>
                <option value="Hard Binding" className="bg-[#162321]">
                  Hard Binding (Gold Embossed SRM AP Thesis) — ₹120
                </option>
              </select>
            </div>

            {/* 5. Paper Quality & Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                  Paper Size
                </label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs appearance-none"
                >
                  <option value="A4" className="bg-[#162321]">A4 (Standard 210x297)</option>
                  <option value="A3" className="bg-[#162321]">A3 (Architectural / Charts)</option>
                  <option value="Letter" className="bg-[#162321]">Letter (8.5 x 11 in)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                  Paper Quality
                </label>
                <select
                  value={paperQuality}
                  onChange={(e) => setPaperQuality(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs appearance-none"
                >
                  <option value="Standard (75 GSM)" className="bg-[#162321]">Standard 75 GSM</option>
                  <option value="Premium (100 GSM)" className="bg-[#162321]">Premium 100 GSM (+₹1/pg)</option>
                </select>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                Operator Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Please leave margin on left for filing, print cover page in color..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs resize-none placeholder:text-[#94A3B8]/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM SUMMARY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30 glass-panel-elevated border-t border-white/[0.1] px-4 md:px-8 py-3.5 shadow-2xl backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Document Summary Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-white">Summary:</span>
            {file ? (
              <>
                <span className="px-2.5 py-1 rounded-lg bg-[#0E1716] border border-white/[0.08] text-[#94A3B8]">
                  Pages: <strong className="text-white font-mono">{file.pages}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0E1716] border border-white/[0.08] text-[#94A3B8]">
                  Copies: <strong className="text-white font-mono">{copies}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0E1716] border border-white/[0.08] text-[#94A3B8]">
                  Type: <strong className="text-white">{printType}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  Total Pages: <strong className="font-mono">{totalPages}</strong>
                </span>
                {binding !== 'None' && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300">
                    {binding}
                  </span>
                )}
              </>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-[#0E1716] border border-white/[0.08] text-[#94A3B8] italic">
                Please upload a document (.pdf, .docx) to calculate pages &amp; cost
              </span>
            )}
          </div>

          {/* Pricing & Proceed CTA */}
          <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] block">
                Estimated Cost
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-extrabold text-[#FACC15] font-mono tracking-tight">
                  {file ? `₹${estimatedCost}` : '₹0'}
                </span>
                <span className="text-xs text-amber-300/80">INR</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl bg-[#162321] hover:bg-[#1B2C29] text-[#94A3B8] hover:text-white text-xs font-semibold border border-white/[0.08] transition-colors"
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={!file}
                onClick={handleProceed}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  file
                    ? 'bg-[#22C55E] hover:bg-[#16A34A] text-black shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] active:scale-95'
                    : 'bg-white/10 text-[#94A3B8] cursor-not-allowed opacity-50'
                }`}
              >
                <span>{file ? 'Proceed to Payment' : 'Upload Document to Proceed'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
