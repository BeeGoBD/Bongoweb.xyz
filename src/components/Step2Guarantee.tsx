import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';

interface Step2GuaranteeProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Step2Guarantee({ onBack, onNext }: Step2GuaranteeProps) {
  return (
    <div id="step-2-guarantee" className="w-full h-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Back Button on Left (NO logo!), Slide Counter on Right */}
      <div className="flex items-center justify-between pb-2.5 border-b border-blue-200/60 shrink-0">
        <button
          onClick={onBack}
          id="step-2-top-back-btn"
          className="text-xs font-semibold text-slate-600 hover:text-blue-900 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 -ml-2 rounded-lg hover:bg-blue-100/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>পেছনে যান</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md border border-blue-200/70">02</span>
          <span className="text-blue-300">/</span>
          <span className="text-slate-400 font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col justify-between py-3 sm:py-4 text-center sm:text-left min-h-0">
        <div>
          <h1 
            id="step-2-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-2 sm:mb-2.5 text-balance"
          >
            আপনি যে ওয়েবসাইটটি পছন্দ করবেন,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              ঠিক হুবহু সেই ওয়েবসাইটটিই
            </span>{' '}
            পাবেন।
          </h1>

          <p 
            id="step-2-subtext"
            className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed max-w-xl mb-3 sm:mb-4 text-balance mx-auto sm:mx-0"
          >
            ২৪ ঘণ্টার মধ্যে আপনার ওয়েবসাইট, আপনার লোগো এবং আপনার মতো করে কাস্টমাইজেশন করে ডেলিভারি দেওয়া হবে।
          </p>
        </div>

        {/* 3 Proof Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-left my-auto">
          {/* Card 1: Emerald Match */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-[0_4px_18px_rgba(16,185,129,0.05)] transition-all hover:border-emerald-300 hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)] hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-2.5 shadow-[0_4px_12px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">হুবহু ডিজাইন ম্যাচ</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">ডেমোর সাথে ১০০% মিল</div>
          </div>

          {/* Card 2: Indigo Branding */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-[0_4px_18px_rgba(99,102,241,0.05)] transition-all hover:border-indigo-300 hover:shadow-[0_8px_24px_rgba(99,102,241,0.1)] hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center mb-2.5 shadow-[0_4px_12px_rgba(99,102,241,0.25)]">
              <Sparkles className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">আপনার নিজস্ব ব্র্যান্ডিং</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">আপনার নাম ও লোগো যুক্ত</div>
          </div>

          {/* Card 3: Sapphire Zero Effort */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-[0_4px_18px_rgba(14,165,233,0.05)] transition-all hover:border-sky-300 hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)] hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center mb-2.5 shadow-[0_4px_12px_rgba(14,165,233,0.25)]">
              <Layers className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900">সম্পূর্ণ রেডিমেড সেটআপ</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">কোনো টেকনিক্যাল ঝামেলা নেই</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-2 sm:pt-3 shrink-0">
          <button
            onClick={onBack}
            id="step-2-back-btn"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>পেছনে যান</span>
          </button>

          <button
            onClick={onNext}
            id="step-2-next-btn"
            className="flex-2 group inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 shadow-[0_4px_16px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.24)] ring-1 ring-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>পরবর্তী পেজে যান</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-indigo-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
