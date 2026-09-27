import { ArrowLeft, ArrowRight, CloudUpload, Tag, Edit3 } from 'lucide-react';

interface Step3ManagementProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Step3Management({ onBack, onNext }: Step3ManagementProps) {
  return (
    <div id="step-3-management" className="w-full h-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Back button on Left, Slide Counter on Right */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
        <button
          onClick={onBack}
          id="step-3-top-back-btn"
          className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 -ml-2 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>পেছনে যান</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-md border border-white/20">03</span>
          <span className="text-white/40">/</span>
          <span className="text-white/60 font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col justify-between py-3 sm:py-4 text-center sm:text-left min-h-0">
        <div>
          <h1 
            id="step-3-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.18] mb-2 sm:mb-2.5 text-balance"
          >
            আমরা আপনাকে পণ্য এবং{' '}
            <span className="underline decoration-white/30 underline-offset-6">
              অর্ডার ম্যানেজ করা শিখিয়ে দেব
            </span>
          </h1>

          <p 
            id="step-3-subtext"
            className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed max-w-xl mb-3 sm:mb-4 text-balance mx-auto sm:mx-0"
          >
            আপনার সুবিধার জন্য আমাদের কাছে রয়েছে বিস্তারিত ভিডিও টিউটোরিয়াল।
          </p>
        </div>

        {/* 3 Bento Feature Cards - Rich Charcoal Surfaces with Soft Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-left my-auto">
          {/* Card 1: Product & Photo Upload */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-[#141414] border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all hover:border-white/25 hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center mb-2.5">
              <CloudUpload className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white">প্রোডাক্ট ও ছবি আপলোড</h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium mt-0.5 leading-snug">
              সহজেই নতুন পণ্য যুক্ত করুন ও বিবরণ বদলান।
            </p>
          </div>

          {/* Card 2: Price & Discounts */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-[#141414] border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all hover:border-white/25 hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center mb-2.5">
              <Tag className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white">দাম ও ডিসকাউন্ট অফার</h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium mt-0.5 leading-snug">
              এক ক্লিকেই যেকোনো প্রডাক্টের দাম আপডেট করুন।
            </p>
          </div>

          {/* Card 3: Live Order Tracking */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-[#141414] border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all hover:border-white/25 hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center mb-2.5">
              <Edit3 className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white">অর্ডার ট্র্যাকিং</h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-medium mt-0.5 leading-snug">
              কাস্টমারদের আসা নতুন অর্ডার দেখুন ও নিয়ন্ত্রণ করুন।
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-2 sm:pt-3 shrink-0">
          <button
            onClick={onBack}
            id="step-3-back-btn"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-semibold text-white bg-[#141414] border border-white/15 hover:bg-white/10 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
            <span>পেছনে যান</span>
          </button>

          <button
            onClick={onNext}
            id="step-3-next-btn"
            className="flex-1 btn-wave-ltr group inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold text-black bg-white hover:bg-neutral-200 shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            <span>পরবর্তী পেজে যান</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
