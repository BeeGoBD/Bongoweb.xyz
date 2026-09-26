import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';

interface Step2GuaranteeProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Step2Guarantee({ onBack, onNext }: Step2GuaranteeProps) {
  return (
    <div id="step-2-guarantee" className="w-full h-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Back Button on Left (NO logo!), Slide Counter on Right */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EDEDEF] shrink-0">
        <button
          onClick={onBack}
          id="step-2-top-back-btn"
          className="text-xs font-semibold text-[#666666] hover:text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 -ml-2 rounded-lg hover:bg-[#F5F5F7]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>পেছনে যান</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-[#FF9D14] bg-[#FF9D14]/10 px-2.5 py-0.5 rounded-md border border-[#FF9D14]/25">02</span>
          <span className="text-[#888888]/40">/</span>
          <span className="text-[#888888] font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col justify-between py-3 sm:py-4 text-center sm:text-left min-h-0">
        <div>
          <h1 
            id="step-2-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight leading-[1.18] mb-2 sm:mb-2.5 text-balance"
          >
            আপনি যে ওয়েবসাইটটি পছন্দ করবেন,{' '}
            <span className="text-[#FF9D14]">
              ঠিক হুবহু সেই ওয়েবসাইটটিই
            </span>{' '}
            পাবেন।
          </h1>

          <p 
            id="step-2-subtext"
            className="text-xs sm:text-sm md:text-base text-[#666666] font-normal leading-relaxed max-w-xl mb-3 sm:mb-4 text-balance mx-auto sm:mx-0"
          >
            ২৪ ঘণ্টার মধ্যে আপনার ওয়েবসাইট, আপনার লোগো এবং আপনার মতো করে কাস্টমাইজেশন করে ডেলিভারি দেওয়া হবে।
          </p>
        </div>

        {/* 3 Proof Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-left my-auto">
          {/* Card 1: Green Match */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-[#EDEDEF] shadow-sm transition-all hover:border-[#22C55E]/50 hover:shadow-md hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-white flex items-center justify-center mb-2.5 shadow-sm shadow-[#22C55E]/30">
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#111111]">হুবহু ডিজাইন ম্যাচ</div>
            <div className="text-[11px] sm:text-xs text-[#666666] font-medium mt-0.5 leading-snug">ডেমোর সাথে ১০০% মিল</div>
          </div>

          {/* Card 2: Orange Branding */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-[#EDEDEF] shadow-sm transition-all hover:border-[#FF9D14]/50 hover:shadow-md hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF9D14] text-white flex items-center justify-center mb-2.5 shadow-sm shadow-[#FF9D14]/30">
              <Sparkles className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#111111]">আপনার নিজস্ব ব্র্যান্ডিং</div>
            <div className="text-[11px] sm:text-xs text-[#666666] font-medium mt-0.5 leading-snug">আপনার নাম ও লোগো যুক্ত</div>
          </div>

          {/* Card 3: Red Zero Effort */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-[#EDEDEF] shadow-sm transition-all hover:border-[#E91311]/50 hover:shadow-md hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#E91311] text-white flex items-center justify-center mb-2.5 shadow-sm shadow-[#E91311]/30">
              <Layers className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#111111]">সম্পূর্ণ রেডিমেড সেটআপ</div>
            <div className="text-[11px] sm:text-xs text-[#666666] font-medium mt-0.5 leading-snug">কোনো টেকনিক্যাল ঝামেলা নেই</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-2 sm:pt-3 shrink-0">
          <button
            onClick={onBack}
            id="step-2-back-btn"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-semibold text-[#111111] bg-white border border-[#EDEDEF] hover:border-[#FF9D14] hover:text-[#FF9D14] hover:bg-[#FF9D14]/5 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>পেছনে যান</span>
          </button>

          <button
            onClick={onNext}
            id="step-2-next-btn"
            className="flex-2 btn-wave-rtl group inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold text-white bg-[#FF9D14] hover:bg-[#FEB74F] shadow-md shadow-[#FF9D14]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>পরবর্তী পেজে যান</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
