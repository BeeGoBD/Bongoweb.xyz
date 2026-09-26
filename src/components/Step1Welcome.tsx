import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface Step1WelcomeProps {
  onNext: () => void;
}

export default function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <div id="step-1-welcome" className="w-full h-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Pure BongoWeb Text Logo: Bongo in Maroon (#800000), Web in Orange (#FF9D14) */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EDEDEF] shrink-0">
        <div className="flex items-baseline select-none">
          <span className="font-black text-xl text-[#800000] tracking-tight">
            Bongo
          </span>
          <span 
            className="font-black text-xl text-[#FF9D14] tracking-tight [-webkit-text-stroke:0.5px_#000000]"
            style={{ WebkitTextStroke: '0.5px #000000' }}
          >
            Web
          </span>
          <span 
            className="w-1.5 h-1.5 rounded-full bg-[#FF9D14] ml-0.5 mb-0.5 shrink-0 animate-pulse ring-1 ring-black"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-[#FF9D14] bg-[#FF9D14]/10 px-2.5 py-0.5 rounded-md border border-[#FF9D14]/25">01</span>
          <span className="text-[#888888]/40">/</span>
          <span className="text-[#888888] font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col justify-between py-3 sm:py-4 text-center sm:text-left min-h-0">
        <div>
          <h1 
            id="step-1-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight leading-[1.18] mb-2 sm:mb-2.5 text-balance"
          >
            আগে দেখুন,{' '}
            <span className="text-[#E91311]">
              তারপর কিনুন
            </span>
          </h1>

          <p 
            id="step-1-subtext"
            className="text-xs sm:text-sm md:text-base text-[#666666] font-normal leading-relaxed max-w-xl mb-3 sm:mb-4 text-balance mx-auto sm:mx-0"
          >
            ১০০+ লাইভ ওয়েবসাইট ভিজিট করে দেখে নিন, তারপর পছন্দমতো আপনার ওয়েবসাইট অর্ডার করুন।
          </p>
        </div>

        {/* 3 Compact Proof Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-left my-auto">
          {/* Card 1: Green Trust */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-[#EDEDEF] shadow-sm transition-all hover:border-[#22C55E]/50 hover:shadow-md hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-white flex items-center justify-center mb-2.5 shadow-sm shadow-[#22C55E]/30">
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#111111]">১০০% লাইভ প্রিভিউ</div>
            <div className="text-[11px] sm:text-xs text-[#666666] font-medium mt-0.5 leading-snug">বাস্তব কার্যকরী ডেমো</div>
          </div>

          {/* Card 2: Orange Speed */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-[#EDEDEF] shadow-sm transition-all hover:border-[#FF9D14]/50 hover:shadow-md hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF9D14] text-white flex items-center justify-center mb-2.5 shadow-sm shadow-[#FF9D14]/30">
              <Zap className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#111111]">২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি</div>
            <div className="text-[11px] sm:text-xs text-[#666666] font-medium mt-0.5 leading-snug">দ্রুত চালুর নিশ্চয়তা</div>
          </div>

          {/* Card 3: Red Accent Ownership */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-[#EDEDEF] shadow-sm transition-all hover:border-[#E91311]/50 hover:shadow-md hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#E91311] text-white flex items-center justify-center mb-2.5 shadow-sm shadow-[#E91311]/30">
              <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#111111]">আজীবন পূর্ণ মালিকানা</div>
            <div className="text-[11px] sm:text-xs text-[#666666] font-medium mt-0.5 leading-snug">কোনো লুকানো শর্ত ছাড়া</div>
          </div>
        </div>

        {/* High-Intent Next Slide Button (Solid Primary Orange #FF9D14 with Left-to-Right Wave) */}
        <div className="w-full pt-2 sm:pt-3 flex justify-center shrink-0">
          <button
            onClick={onNext}
            id="step-1-primary-cta"
            className="w-full btn-wave-ltr group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold text-white bg-[#FF9D14] hover:bg-[#FEB74F] shadow-md shadow-[#FF9D14]/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            <span>পরবর্তী পেজে যান</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
