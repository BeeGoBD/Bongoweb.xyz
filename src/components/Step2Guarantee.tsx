import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';

interface Step2GuaranteeProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Step2Guarantee({ onBack, onNext }: Step2GuaranteeProps) {
  return (
    <div id="step-2-guarantee" className="w-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Back Button on Left (NO logo!), Slide Counter on Right */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <button
          onClick={onBack}
          id="step-2-top-back-btn"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 -ml-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/60">02</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="py-4 text-center sm:text-left">
        <h1 
          id="step-2-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-2 text-balance"
        >
          The exact demo you select is the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            exact website we launch
          </span>{' '}
          for you.
        </h1>

        <p 
          id="step-2-subtext"
          className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-lg mb-4 text-balance"
        >
          Personalized seamlessly with your custom brand name, logo, typography, color palette, and initial product catalog.
        </p>

        {/* 3 Proof Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full text-left mb-5">
          {/* Card 1: Emerald Match */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/40 border border-emerald-200/80 shadow-[0_2px_8px_rgba(16,185,129,0.04)] transition-all hover:border-emerald-300 hover:shadow-[0_4px_12px_rgba(16,185,129,0.08)]">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-[0_2px_6px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-slate-900">Pixel-Perfect Match</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5 leading-snug">Identical layout & mechanics</div>
          </div>

          {/* Card 2: Indigo Branding */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-indigo-50/40 border border-indigo-200/80 shadow-[0_2px_8px_rgba(99,102,241,0.04)] transition-all hover:border-indigo-300 hover:shadow-[0_4px_12px_rgba(99,102,241,0.08)]">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-2 shadow-[0_2px_6px_rgba(99,102,241,0.25)]">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-slate-900">Bespoke Branding</div>
            <div className="text-[11px] text-indigo-700 font-medium mt-0.5 leading-snug">Your logo & color assets</div>
          </div>

          {/* Card 3: Sapphire Zero Effort */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-sky-50/40 border border-sky-200/80 shadow-[0_2px_8px_rgba(14,165,233,0.04)] transition-all hover:border-sky-300 hover:shadow-[0_4px_12px_rgba(14,165,233,0.08)]">
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center mb-2 shadow-[0_2px_6px_rgba(14,165,233,0.25)]">
              <Layers className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-slate-900">Zero Technical Effort</div>
            <div className="text-[11px] text-sky-700 font-medium mt-0.5 leading-snug">Hosting and setup handled</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-1">
          <button
            onClick={onBack}
            id="step-2-back-btn"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            id="step-2-next-btn"
            className="flex-2 group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 shadow-[0_4px_16px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.24)] ring-1 ring-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Continue to Training</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-indigo-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
