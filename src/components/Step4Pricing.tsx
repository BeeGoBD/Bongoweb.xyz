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
    }, 450);
  };

  return (
    <div id="step-4-pricing" className="w-full h-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Back Button on Left, Slide Counter on Right */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <button
          onClick={onBack}
          id="step-4-top-back-btn"
          className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 -ml-2 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>পেছনে যান</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md border border-white/20">04</span>
          <span className="text-white/40">/</span>
          <span className="text-white/60 font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col justify-between py-3 sm:py-4 text-center sm:text-left min-h-0">
        <div>
          <h1 
            id="step-4-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.18] mb-2 sm:mb-2.5 text-balance"
          >
            একটি মাত্র সেটআপ ফি,{' '}
            <span className="underline decoration-white/30 underline-offset-6">
              সাশ্রয়ী মাসিক মেইনটেন্যান্স
            </span>
          </h1>

          <p 
            id="step-4-subtext"
            className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed max-w-xl mb-3 sm:mb-4 text-balance mx-auto sm:mx-0"
          >
            আপনার ওয়েবসাইটের শতভাগ মালিকানা, সাথে নিরবচ্ছিন্ন সার্ভার ও নিয়মিত ব্যাকআপ সুবিধা।
          </p>
        </div>

        {/* Dual Financial Breakdown Cards - Rich Charcoal Surfaces with Soft Borders */}
        <div className="w-full my-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 text-left">
            {/* Card 1: Setup Fee */}
            <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-[#141414] border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-all hover:border-white/25">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-neutral-400 mb-1">
                  <span className="font-semibold text-white text-xs sm:text-sm">এককালীন সেটআপ ফি</span>
                  <span className="text-[10px] font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 font-mono">
                    শুরু মাত্র
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                    ৳৯৯৯
                  </span>
                  <span className="text-xs text-neutral-400 font-bold font-mono">টাকা</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 leading-snug">
                  সম্পূর্ণ কাস্টম ডিজাইন, ব্র্যান্ডিং ও প্রোডাক্ট আপলোড
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-white/10 flex items-center gap-1.5 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>১০০% লাইফটাইম ওয়েবসাইট মালিকানা</span>
              </div>
            </div>

            {/* Card 2: Server Upkeep */}
            <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-[#141414] border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-all hover:border-white/25">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-neutral-400 mb-1">
                  <span className="font-semibold text-white text-xs sm:text-sm">মাসিক সার্ভার খরচ</span>
                  <span className="text-[10px] font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 font-mono">
                    শুরু মাত্র
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                    ৳১২০
                  </span>
                  <span className="text-xs text-neutral-400 font-bold font-mono">টাকা / মাস</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 leading-snug">
                  ৯৯.৯% সার্ভার আপটাইম, ফ্রি SSL ও অটো ব্যাকআপ
                </p>
              </div>

              <div className="pt-2 mt-2 border-t border-white/10 flex items-center gap-1.5 text-xs font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>যেকোনো সময় বন্ধ বা পরিবর্তনযোগ্য</span>
              </div>
            </div>
          </div>

          {/* 4 Distinct Payment Boxes */}
          <div className="grid grid-cols-4 gap-2 w-full">
            <div className="py-2 px-2 rounded-xl bg-[#141414] border border-white/10 shadow-2xs flex items-center justify-center gap-1.5">
              <span className="font-mono text-[9px] font-bold text-white bg-white/10 border border-white/20 px-1.5 py-0.2 rounded">
                01
              </span>
              <span className="text-xs font-bold text-white tracking-tight">
                Bkash
              </span>
            </div>

            <div className="py-2 px-2 rounded-xl bg-[#141414] border border-white/10 shadow-2xs flex items-center justify-center gap-1.5">
              <span className="font-mono text-[9px] font-bold text-white bg-white/10 border border-white/20 px-1.5 py-0.2 rounded">
                02
              </span>
              <span className="text-xs font-bold text-white tracking-tight">
                Nagad
              </span>
            </div>

            <div className="py-2 px-2 rounded-xl bg-[#141414] border border-white/10 shadow-2xs flex items-center justify-center gap-1.5">
              <span className="font-mono text-[9px] font-bold text-white bg-white/10 border border-white/20 px-1.5 py-0.2 rounded">
                03
              </span>
              <span className="text-xs font-bold text-white tracking-tight">
                Rocket
              </span>
            </div>

            <div className="py-2 px-2 rounded-xl bg-[#141414] border border-white/10 shadow-2xs flex items-center justify-center gap-1.5">
              <span className="font-mono text-[9px] font-bold text-white bg-white/10 border border-white/20 px-1.5 py-0.2 rounded">
                04
              </span>
              <span className="text-xs font-bold text-white tracking-tight">
                Upay
              </span>
            </div>
          </div>
        </div>

        {/* Conversion Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-2 sm:pt-3 shrink-0">
          <button
            onClick={onBack}
            id="step-4-back-btn"
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-semibold text-white bg-[#141414] border border-white/15 hover:bg-white/10 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-60"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
            <span>পেছনে যান</span>
          </button>

          <button
            onClick={handleCompleteClick}
            id="step-4-finish-btn"
            disabled={isSubmitting}
            className="flex-1 btn-wave-ltr group inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold text-black bg-white hover:bg-neutral-200 shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-80"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>প্রবেশ করা হচ্ছে...</span>
              </span>
            ) : (
              <>
                <span>ওয়েবসাইট ক্যাটালগে প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-black" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
