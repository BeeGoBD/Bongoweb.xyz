import React, { useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Layers, ShieldCheck, Eye, ExternalLink } from 'lucide-react';

interface LogoShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoShowcaseModal({ isOpen, onClose }: LogoShowcaseModalProps) {
  const [copiedV1, setCopiedV1] = useState(false);
  const [copiedV2, setCopiedV2] = useState(false);
  const [previewBg, setPreviewBg] = useState<'light' | 'dark'>('light');
  const [showMaskGuide, setShowMaskGuide] = useState(true);

  if (!isOpen) return null;

  const handleCopySvg = async (version: 1 | 2) => {
    try {
      const url = version === 1 ? '/bongoweb-logo-horizontal.svg' : '/bongoweb-icon-square.svg';
      const res = await fetch(url);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      if (version === 1) {
        setCopiedV1(true);
        setTimeout(() => setCopiedV1(false), 2000);
      } else {
        setCopiedV2(true);
        setTimeout(() => setCopiedV2(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-5xl bg-[#FFFFFF] rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B46C1]/10 text-[#6B46C1] text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Brand Identity · BongoWeb</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              BongoWeb Professional Vector Logos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Two official production versions: Full Horizontal Wordmark (4:1) & Centered Square Icon (1:1).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Light / Dark Canvas Toggle */}
            <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setPreviewBg('light')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  previewBg === 'light'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Light Canvas
              </button>
              <button
                type="button"
                onClick={() => setPreviewBg('dark')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  previewBg === 'dark'
                    ? 'bg-[#6B46C1] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dark Canvas
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Side by Side Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ========================================================= */}
            {/* VERSION 1: FULL LOGO (HORIZONTAL 4:1)                     */}
            {/* ========================================================= */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/70 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 rounded-lg bg-[#6B46C1] text-white text-xs font-bold uppercase tracking-wider">
                    Version 1
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Ratio: ~4:1 (440 × 110 px)
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Full Logo (Horizontal)
                </h3>
                <p className="text-xs text-slate-600">
                  Icon emblem + "BongoWeb" wordmark. Styled for website headers, navigation, invoices, and brand cards.
                </p>
              </div>

              {/* Display Box */}
              <div 
                className={`relative w-full h-44 sm:h-52 rounded-2xl border transition-all duration-300 flex items-center justify-center p-6 overflow-hidden ${
                  previewBg === 'light'
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-[#0B0F19] border-slate-800 shadow-inner'
                }`}
              >
                {/* Subtle Grid Pattern in background */}
                <div 
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(#6B46C1 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                />

                <img
                  src="/bongoweb-logo-horizontal.svg"
                  alt="BongoWeb Full Horizontal Logo"
                  className="max-h-20 sm:max-h-24 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Version 1 Actions & Specs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Ultra-crisp SVG vector · Scaling 16px - 2000px</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopySvg(1)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    {copiedV1 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedV1 ? 'Copied SVG' : 'Copy SVG'}</span>
                  </button>

                  <a
                    href="/bongoweb-logo-horizontal.svg"
                    download="bongoweb-logo-horizontal.svg"
                    className="px-4 py-2 rounded-xl bg-[#6B46C1] hover:bg-[#5521B5] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download SVG</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* VERSION 2: ICON ONLY (SQUARE 1:1)                         */}
            {/* ========================================================= */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50/70 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 rounded-lg bg-[#9F7AEA] text-slate-900 text-xs font-bold uppercase tracking-wider">
                    Version 2
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Ratio: 1:1 (256 × 256 px)
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Icon Only (Square)
                </h3>
                <p className="text-xs text-slate-600">
                  Purple gradient "B" monogram with adaptive margin for Android maskable icons, iOS, and favicons.
                </p>
              </div>

              {/* Display Box */}
              <div 
                className={`relative w-full h-44 sm:h-52 rounded-2xl border transition-all duration-300 flex items-center justify-center p-6 overflow-hidden ${
                  previewBg === 'light'
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-[#0B0F19] border-slate-800 shadow-inner'
                }`}
              >
                {/* Subtle Grid Pattern in background */}
                <div 
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(#6B46C1 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                />

                <img
                  src="/bongoweb-icon-square.svg"
                  alt="BongoWeb Square Icon"
                  className="max-h-28 sm:max-h-32 w-auto object-contain transition-transform duration-300 hover:scale-110"
                />

                {/* Adaptive Maskable Safe Zone Overlay Guide */}
                {showMaskGuide && (
                  <div 
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    title="Android Adaptive Icon 66% Keyline Circle Safe Zone"
                  >
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-dashed border-[#6B46C1]/40 flex items-center justify-center">
                      <span className="text-[9px] font-mono font-bold text-[#6B46C1]/60 tracking-wider bg-white/70 px-1 rounded">
                        Safe Zone
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Version 2 Actions & Specs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMaskGuide(!showMaskGuide)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#6B46C1]" />
                  <span>{showMaskGuide ? 'Hide Safe Zone' : 'Show Safe Zone'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopySvg(2)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    {copiedV2 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedV2 ? 'Copied' : 'Copy'}</span>
                  </button>

                  <a
                    href="/bongoweb-icon-square.svg"
                    download="bongoweb-icon-square.svg"
                    className="px-4 py-2 rounded-xl bg-[#6B46C1] hover:bg-[#5521B5] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download SVG</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BRAND COLOR PALETTE & DESIGN TOKENS                       */}
          {/* ========================================================= */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6B46C1]" />
              <span>Official Brand Palette & Design Tokens</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5521B5] shadow-inner shrink-0" />
                <div>
                  <p className="text-xs font-black text-slate-900">#5521B5</p>
                  <p className="text-[10px] text-slate-500">Deep Indigo Core</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6B46C1] shadow-inner shrink-0" />
                <div>
                  <p className="text-xs font-black text-slate-900">#6B46C1</p>
                  <p className="text-[10px] text-slate-500">Rich Purple (Brand)</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#805AD5] shadow-inner shrink-0" />
                <div>
                  <p className="text-xs font-black text-slate-900">#805AD5</p>
                  <p className="text-[10px] text-slate-500">Vibrant Orchid</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#9F7AEA] shadow-inner shrink-0" />
                <div>
                  <p className="text-xs font-black text-slate-900">#9F7AEA</p>
                  <p className="text-[10px] text-slate-500">Radiant Violet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3 shrink-0">
          <p className="text-xs text-slate-500 font-medium">
            Files stored in public directory: <code className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[11px] font-mono">/public/bongoweb-logo-horizontal.svg</code> & <code className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[11px] font-mono">/public/bongoweb-icon-square.svg</code>
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-all shadow-2xs ml-auto"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
