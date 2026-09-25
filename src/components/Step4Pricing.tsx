import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

interface Step4PricingProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function Step4Pricing({ onBack, onComplete }: Step4PricingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompleteClick = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  return (
    <div id="step-4-pricing" className="w-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Back Button on Left (NO logo!), Slide Counter on Right */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <button
          onClick={onBack}
          id="step-4-top-back-btn"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 -ml-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/60">04</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="py-4 text-center sm:text-left">
        <h1 
          id="step-4-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-2 text-balance"
        >
          One flat setup fee.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
            Predictable monthly upkeep.
          </span>
        </h1>

        <p 
          id="step-4-subtext"
          className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-lg mb-4 text-balance"
        >
          Own your digital presence outright with guaranteed uptime, automatic daily backups, and free technical maintenance.
        </p>

        {/* Dual Financial Breakdown Cards - Built for Subscription Confidence */}
        <div className="w-full mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5 text-left">
            {/* Card 1: Setup Fee */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.03)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700">One-Time Setup</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60 font-mono">
                    Starts From
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                    ৳999
                  </span>
                  <span className="text-xs text-slate-500 font-bold font-mono">BDT</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Complete custom design, branding & catalog upload
                </p>
              </div>

              <div className="pt-2 mt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Lifetime Website Ownership</span>
              </div>
            </div>

            {/* Card 2: Server Upkeep (Matches Card 1 Border & Background Exactly) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.03)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700">Monthly Upkeep</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60 font-mono">
                    Starts From
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                    ৳120
                  </span>
                  <span className="text-xs text-slate-500 font-bold font-mono">BDT / month</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Guaranteed 99.9% uptime, SSL, & automatic daily backups
                </p>
              </div>

              <div className="pt-2 mt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Cancel or pause subscription anytime</span>
              </div>
            </div>
          </div>

          {/* 4 Distinct Payment Boxes - Slim Half-Height & Separated */}
          <div className="grid grid-cols-4 gap-2 w-full mb-3.5">
            {/* Box 1: Bkash */}
            <div className="py-1.5 px-2 rounded-xl bg-white border border-pink-200/90 shadow-2xs flex items-center justify-center gap-1.5 transition-all hover:border-pink-300">
              <span className="font-mono text-[9px] font-bold text-pink-700 bg-pink-50 border border-pink-200/60 px-1.5 py-0.2 rounded">
                01
              </span>
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                Bkash
              </span>
            </div>

            {/* Box 2: Nagad */}
            <div className="py-1.5 px-2 rounded-xl bg-white border border-amber-200/90 shadow-2xs flex items-center justify-center gap-1.5 transition-all hover:border-amber-300">
              <span className="font-mono text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded">
                02
              </span>
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                Nagad
              </span>
            </div>

            {/* Box 3: Rocket */}
            <div className="py-1.5 px-2 rounded-xl bg-white border border-purple-200/90 shadow-2xs flex items-center justify-center gap-1.5 transition-all hover:border-purple-300">
              <span className="font-mono text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200/60 px-1.5 py-0.2 rounded">
                03
              </span>
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                Rocket
              </span>
            </div>

            {/* Box 4: Upay */}
            <div className="py-1.5 px-2 rounded-xl bg-white border border-blue-200/90 shadow-2xs flex items-center justify-center gap-1.5 transition-all hover:border-blue-300">
              <span className="font-mono text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.2 rounded">
                04
              </span>
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                Upay
              </span>
            </div>
          </div>
        </div>

        {/* Conversion Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-1">
          <button
            onClick={onBack}
            id="step-4-back-btn"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleCompleteClick}
            id="step-4-finish-btn"
            disabled={isSubmitting}
            className="flex-2 group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 shadow-[0_4px_18px_rgba(5,150,105,0.28)] hover:shadow-[0_8px_26px_rgba(5,150,105,0.36)] ring-1 ring-emerald-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-80"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Entering Showcase...</span>
              </span>
            ) : (
              <>
                <span>Enter Showcase & Catalog</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
