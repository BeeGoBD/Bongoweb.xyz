import { ArrowLeft, ArrowRight, CloudUpload, Tag, Edit3 } from 'lucide-react';

interface Step3ManagementProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Step3Management({ onBack, onNext }: Step3ManagementProps) {
  return (
    <div id="step-3-management" className="w-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Back button on Left (NO logo!), Slide Counter on Right */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <button
          onClick={onBack}
          id="step-3-top-back-btn"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 -ml-2 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/60">03</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="py-4 text-center sm:text-left">
        <h1 
          id="step-3-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-2 text-balance"
        >
          Effortless store management with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800">
            zero technical learning curve
          </span>.
        </h1>

        <p 
          id="step-3-subtext"
          className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-lg mb-4 text-balance"
        >
          Manage your entire catalog, orders, and promotions right from your smartphone or laptop in plain language.
        </p>

        {/* 3 Bento Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full text-left mb-5">
          {/* Card 1: Blue Cloud Updates */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-blue-50/40 border border-blue-200/80 shadow-[0_2px_8px_rgba(59,130,246,0.04)] transition-all hover:border-blue-300 hover:shadow-[0_4px_12px_rgba(59,130,246,0.08)]">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 shadow-[0_2px_6px_rgba(59,130,246,0.25)]">
              <CloudUpload className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Catalog Updates</h3>
            <p className="text-[11px] text-blue-700 font-medium mt-0.5 leading-snug">
              Add products, upload photos, and update details.
            </p>
          </div>

          {/* Card 2: Amber Promotions */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-amber-50/40 border border-amber-200/80 shadow-[0_2px_8px_rgba(245,158,11,0.04)] transition-all hover:border-amber-300 hover:shadow-[0_4px_12px_rgba(245,158,11,0.08)]">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-2 shadow-[0_2px_6px_rgba(245,158,11,0.25)]">
              <Tag className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Promotions & Pricing</h3>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5 leading-snug">
              Adjust prices on the fly and create discount codes.
            </p>
          </div>

          {/* Card 3: Emerald Live Inventory */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white to-emerald-50/40 border border-emerald-200/80 shadow-[0_2px_8px_rgba(16,185,129,0.04)] transition-all hover:border-emerald-300 hover:shadow-[0_4px_12px_rgba(16,185,129,0.08)]">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-[0_2px_6px_rgba(16,185,129,0.25)]">
              <Edit3 className="w-4 h-4 stroke-[2]" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Live Inventory</h3>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5 leading-snug">
              Track stock levels and view incoming customer orders.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-1">
          <button
            onClick={onBack}
            id="step-3-back-btn"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={onNext}
            id="step-3-next-btn"
            className="flex-2 group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 shadow-[0_4px_16px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.24)] ring-1 ring-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Continue to Pricing</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-indigo-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
