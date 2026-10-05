import React from 'react';
import { 
  PhoneCall, FolderKanban, Rocket, CheckCircle2, ShieldCheck, 
  Zap, Globe, Headphones
} from 'lucide-react';

interface AfterOrderViewProps {
  onGoToDashboard?: () => void;
  onOpenLiveChat?: () => void;
}

export default function AfterOrderView({ onGoToDashboard: _onGoToDashboard, onOpenLiveChat: _onOpenLiveChat }: AfterOrderViewProps) {
  // Serialized order steps: strictly 1, 2, 3, 4 sequential numbering with 100% pure Bengali copy
  const serialSteps = [
    {
      pointNumber: '১',
      mainText: 'আপনাকে আমরা ফোন করে বিস্তারিত জেনে নেব।',
      icon: PhoneCall,
      accentColor: '#2B47EE'
    },
    {
      pointNumber: '২',
      mainText: 'আপনার ব্যবসার লোগো ও প্রয়োজনীয় তথ্য আমরা সংগ্রহ করব।',
      icon: FolderKanban,
      accentColor: '#FF6118'
    },
    {
      pointNumber: '৩',
      mainText: 'আপনার পছন্দের কালার ও ওয়েবসাইটের প্রয়োজনীয় বিষয়গুলো নিয়ে আমরা ওয়েবসাইটটি তৈরি করে দেব।',
      icon: Rocket,
      accentColor: '#2B47EE'
    },
    {
      pointNumber: '৪',
      mainText: '৪৮ ঘণ্টার মধ্যে ওয়েবসাইট ডেলিভারি ও ফ্রি সাপোর্ট',
      icon: CheckCircle2,
      accentColor: '#00B261'
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-4">
      {/* 1. SECTION: SERIALIZED ORDER STEPS (অর্ডারের পর ধারাবাহিক পদক্ষেপসমূহ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="text-center mb-6">
          <span className="px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-bold border border-[#2B47EE]/20 inline-block mb-2 shadow-2xs">
            অর্ডার নিশ্চিতকরণের পরবর্তী ধাপ
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0D253D] tracking-tight">
            অর্ডারের পর <span className="text-[#2B47EE]">ধারাবাহিক পদক্ষেপসমূহ</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748D] mt-1">
            আপনার পছন্দের ডিজাইনটি বেছে অর্ডার করার পর আমাদের টিম যেভাবে আপনার ওয়েবসাইটটি রেডি করবে:
          </p>
        </div>

        {/* Serialized Step Cards: 100% Pure Bangla */}
        <div className="space-y-3 mb-10">
          {serialSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={`serial-step-${step.pointNumber || idx}`}
                className="w-full min-h-[76px] sm:min-h-[86px] p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#E5EDF5] hover:border-[#2B47EE] transition-all duration-200 shadow-2xs hover:shadow-md flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Serial Point Badge */}
                  <div className="flex items-center justify-center w-10 sm:w-12 shrink-0 border-r border-[#E5EDF5] pr-3 sm:pr-4">
                    <span className="text-xl sm:text-2xl font-black text-[#2B47EE]">
                      {step.pointNumber}
                    </span>
                  </div>

                  {/* Unique Matching Icon */}
                  <div 
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: '#EEF2FF',
                      color: step.accentColor
                    }}
                  >
                    <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
                  </div>

                  {/* Main Text ONLY in Pure Bangla */}
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-[#0D253D] group-hover:text-[#2B47EE] transition-colors leading-snug">
                      {step.mainText}
                    </h3>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0 hidden xs:block">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00B261] inline-block animate-pulse" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SECTION: WHAT WE PROVIDE AFTER ORDER (অর্ডারের পর আমরা যা যা প্রদান করি) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-[#F8FAFD] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-bold border border-[#2B47EE]/20 inline-block mb-2">
              ভেরিফাইড ডেলিভারি সার্ভিস
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0D253D] tracking-tight">
              অর্ডারের পর আমরা যা যা প্রদান করি
            </h2>
            <p className="text-xs sm:text-sm text-[#64748D] mt-2">
              আপনার ব্যবসার প্রতিটি ওয়েবসাইট অর্ডারের পর আমরা বিশ্বমানের ক্লাউড ইনফ্রাস্ট্রাকচার ও দীর্ঘমেয়াদী সেবা নিশ্চিত করি।
            </p>
          </div>

          {/* 4 Smart Deliverables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                অর্ডার কনফার্ম করার মাত্র ২৪ ঘণ্টার মধ্যে সম্পূর্ণ কার্যকরী ওয়েবসাইট লাইভ করে দেওয়া হয়।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">ফ্রি ডোমেইন ও ক্লাউড হোস্টিং</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                ১ বছরের জন্য ফ্রি অফিশিয়াল ডোমেইন এবং ৯৯.৯% আপটাইম বিশিষ্ট হাই-স্পিড ক্লাউড সার্ভার।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">১০০% মানিব্যাক সন্তুষ্টি গ্যারান্টি</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                কাজের গুণমান বা প্রতিশ্রুত ফিচারে অসন্তুষ্ট হলে কোনো প্রশ্ন ছাড়াই সম্পূর্ণ টাকা ফেরত।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">আজীবন ফ্রি টেকনিক্যাল সাপোর্ট</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                যেকোনো সময় সরাসরি লাইভ চ্যাট বা ফোন কলে আমাদের টেকনিক্যাল টিম থেকে ইনস্ট্যান্ট সমাধান।
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
