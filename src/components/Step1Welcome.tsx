import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface Step1WelcomeProps {
  onNext: () => void;
}

export default function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <div id="step-1-welcome" className="w-full h-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Pure BongoWeb Text Logo */}
      <div className="flex items-center justify-between pb-2.5 border-b border-blue-200/60 shrink-0">
        <div className="flex items-baseline select-none">
          <span className="font-black text-xl text-slate-900 tracking-tight">
            Bongo
          </span>
          <span className="font-black text-xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            Web
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 ml-0.5 mb-0.5 shrink-0 animate-pulse" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md border border-blue-200/70">01</span>
          <span className="text-blue-300">/</span>
          <span className="text-slate-400 font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col justify-between py-3 sm:py-4 text-center sm:text-left min-h-0">
        <div>
          <h1 
            id="step-1-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-2 sm:mb-2.5 text-balance"
          >
            আগে দেখুন,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
              তারপর কিনুন
            </span>
          </h1>

          <p 
            id="step-1-subtext"
            className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed max-w-xl mb-3 sm:mb-4 text-balance mx-auto sm:mx-0"
          >
            ১০০+ লাইভ ওয়েবসাইট ভিজিট করে দেখে নিন, তারপর পছন্দমতো আপনার ওয়েবসাইট অর্ডার করুন।
          </p>
        </div>

        {/* 3 Compact Proof Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-left my-auto">
          {/* Card 1: Emerald Trust */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-[0_4px_18px_rgba(16,185,129,0.05)] transition-all hover:border-emerald-300 hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)] hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-2.5 shadow-[0_4px_12px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">১০০% লাইভ প্রিভিউ</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">বাস্তব কার্যকরী ডেমো</div>
          </div>

          {/* Card 2: Sapphire Speed */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-[0_4px_18px_rgba(59,130,246,0.05)] transition-all hover:border-blue-300 hover:shadow-[0_8px_24px_rgba(59,130,246,0.1)] hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-2.5 shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
              <Zap className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">দ্রুত চালুর নিশ্চয়তা</div>
          </div>

          {/* Card 3: Indigo Ownership */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-[0_4px_18px_rgba(99,102,241,0.05)] transition-all hover:border-indigo-300 hover:shadow-[0_8px_24px_rgba(99,102,241,0.1)] hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center mb-2.5 shadow-[0_4px_12px_rgba(99,102,241,0.25)]">
              <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">আজীবন পূর্ণ মালিকানা</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">কোনো লুকানো শর্ত ছাড়া</div>
          </div>
        </div>

        {/* High-Intent Next Slide Button */}
        <div className="w-full pt-2 sm:pt-3 flex justify-center shrink-0">
          <button
            onClick={onNext}
            id="step-1-primary-cta"
            className="w-full group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 shadow-[0_4px_16px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.24)] ring-1 ring-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            <span>পরবর্তী পেজে যান</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-indigo-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
