import { ArrowLeft, ArrowRight, CloudUpload, Tag, Edit3 } from 'lucide-react';

interface Step3ManagementProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Step3Management({ onBack, onNext }: Step3ManagementProps) {
  return (
    <div id="step-3-management" className="w-full h-full flex flex-col justify-between animate-fadeIn">
      {/* Top Slide Header: Back button on Left (NO logo!), Slide Counter on Right */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EDEDEF] shrink-0">
        <button
          onClick={onBack}
          id="step-3-top-back-btn"
          className="text-xs font-semibold text-[#666666] hover:text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 -ml-2 rounded-lg hover:bg-[#F5F5F7]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>পেছনে যান</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="font-bold text-[#FF9D14] bg-[#FF9D14]/10 px-2.5 py-0.5 rounded-md border border-[#FF9D14]/25">03</span>
          <span className="text-[#888888]/40">/</span>
          <span className="text-[#888888] font-medium">04</span>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex flex-col justify-between py-3 sm:py-4 text-center sm:text-left min-h-0">
        <div>
          <h1 
            id="step-3-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight leading-[1.18] mb-2 sm:mb-2.5 text-balance"
          >
            আমরা আপনাকে পণ্য এবং{' '}
            <span className="text-[#FF9D14]">
              অর্ডার ম্যানেজ করা শিখিয়ে দেব
            </span>
          </h1>

          <p 
            id="step-3-subtext"
            className="text-xs sm:text-sm md:text-base text-[#666666] font-normal leading-relaxed max-w-xl mb-3 sm:mb-4 text-balance mx-auto sm:mx-0"
          >
            আপনার সুবিধার জন্য আমাদের কাছে রয়েছে বিস্তারিত ভিডিও টিউটোরিয়াল।
          </p>
        </div>

        {/* 3 Bento Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-left my-auto">
          {/* Card 1: Orange Uploads */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-[#EDEDEF] shadow-sm transition-all hover:border-[#FF9D14]/50 hover:shadow-md hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF9D14] text-white flex items-center justify-center mb-2.5 shadow-sm shadow-[#FF9D14]/30">
              <CloudUpload className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#111111]">প্রোডাক্ট ও ছবি আপলোড</h3>
            <p className="text-[11px] sm:text-xs text-[#666666] font-medium mt-0.5 leading-snug">
              সহজেই নতুন পণ্য যুক্ত করুন ও বিবরণ বদলান।
            </p>
          </div>

          {/* Card 2: Warm Amber Promotions */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-[#EDEDEF] shadow-sm transition-all hover:border-[#FEB74F] hover:shadow-md hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#FEB74F] text-white flex items-center justify-center mb-2.5 shadow-sm shadow-[#FEB74F]/30">
              <Tag className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#111111]">দাম ও ডিসকাউন্ট অফার</h3>
            <p className="text-[11px] sm:text-xs text-[#666666] font-medium mt-0.5 leading-snug">
              এক ক্লিকেই যেকোনো প্রডাক্টের দাম আপডেট করুন।
            </p>
          </div>

          {/* Card 3: Green Live Order Tracking */}
          <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white border border-[#EDEDEF] shadow-sm transition-all hover:border-[#22C55E]/50 hover:shadow-md hover:-translate-y-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#22C55E] text-white flex items-center justify-center mb-2.5 shadow-sm shadow-[#22C55E]/30">
              <Edit3 className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#111111]">অর্ডার ট্র্যাকিং</h3>
            <p className="text-[11px] sm:text-xs text-[#666666] font-medium mt-0.5 leading-snug">
              কাস্টমারদের আসা নতুন অর্ডার দেখুন ও নিয়ন্ত্রণ করুন।
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-2 sm:pt-3 shrink-0">
          <button
            onClick={onBack}
            id="step-3-back-btn"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-semibold text-[#111111] bg-white border border-[#EDEDEF] hover:border-[#FF9D14] hover:text-[#FF9D14] hover:bg-[#FF9D14]/5 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>পেছনে যান</span>
          </button>

          <button
            onClick={onNext}
            id="step-3-next-btn"
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
