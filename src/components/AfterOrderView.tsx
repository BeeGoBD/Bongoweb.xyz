import React from 'react';
import { 
  PhoneCall, FolderKanban, Server, CreditCard, Rocket, 
  CheckCircle2, ShieldCheck, Zap, Globe, Headphones, 
  MessageCircle, ArrowRight
} from 'lucide-react';

interface AfterOrderViewProps {
  onGoToDashboard: () => void;
  onOpenLiveChat: () => void;
}

export default function AfterOrderView({ onGoToDashboard, onOpenLiveChat }: AfterOrderViewProps) {
  // Serialized order steps: strictly main text, no subtext, unique icons
  const serialSteps = [
    {
      pointNumber: '১',
      pointLabel: 'পয়েন্ট ১',
      pointEn: 'Point 1',
      mainText: 'সরাসরি আপনাকে ফোন কল করে প্রজেক্ট বিস্তারিত নিশ্চিতকরণ',
      mainTextEn: 'We will call you directly to confirm project details',
      icon: PhoneCall,
      accentColor: '#533AFD'
    },
    {
      pointNumber: '২',
      pointLabel: 'পয়েন্ট ২',
      pointEn: 'Point 2',
      mainText: 'আপনার ব্যবসার লোগো ও প্রয়োজনীয় তথ্যাদি সংগ্রহ',
      mainTextEn: 'Ask for your business logo, branding and information',
      icon: FolderKanban,
      accentColor: '#FF6118'
    },
    {
      pointNumber: '৩',
      pointLabel: 'পয়েন্ট ৩',
      pointEn: 'Point 3',
      mainText: 'ক্লাউড সার্ভার, সুপারফাস্ট হোস্টিং ও ডোমেইন সক্রিয়করণ',
      mainTextEn: 'Setup cloud server, high-speed hosting and domain',
      icon: Server,
      accentColor: '#533AFD'
    },
    {
      pointNumber: '৪',
      pointLabel: 'পয়েন্ট ৪',
      pointEn: 'Point 4',
      mainText: 'পেমেন্ট গেটওয়ে, অটো কুরিয়ার ও কনটেন্ট কনফিগারেশন',
      mainTextEn: 'Configure payment gateway, automated courier and products',
      icon: CreditCard,
      accentColor: '#00B261'
    },
    {
      pointNumber: '৫',
      pointLabel: 'পয়েন্ট ৫',
      pointEn: 'Point 5',
      mainText: 'মাত্র ২৪ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ওয়েবসাইট ডেলিভারি',
      mainTextEn: 'Live website delivery and staging inspection within 24 hours',
      icon: Rocket,
      accentColor: '#533AFD'
    },
    {
      pointNumber: '৬',
      pointLabel: 'পয়েন্ট ৬',
      pointEn: 'Point 6',
      mainText: 'ক্লায়েন্টের সন্তুষ্টি যাচাই ও আজীবন পূর্ণ মালিকানা হস্তান্তর',
      mainTextEn: 'Client satisfaction confirmation and lifetime ownership handover',
      icon: CheckCircle2,
      accentColor: '#00B261'
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-4">
      {/* 1. Header Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="text-center">
          <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold border border-[#533AFD]/20 inline-block mb-2">
            অর্ডার নিশ্চিতকরণের পরবর্তী ধাপ
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0D253D] tracking-tight">
            অর্ডারের পর <span className="text-[#533AFD]">ধারাবাহিক পদক্ষেপসমূহ</span>
          </h1>
        </div>
      </section>

      {/* 2. Serialized Step Cards: Each occupies ~15% screen size, main text only, no subtext */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-3 mb-10">
        {serialSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="w-full min-h-[76px] sm:min-h-[86px] p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#E5EDF5] hover:border-[#533AFD] transition-all duration-200 shadow-2xs hover:shadow-md flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {/* Serial Point Badge */}
                <div className="flex flex-col items-center justify-center w-12 sm:w-14 shrink-0 border-r border-[#E5EDF5] pr-3 sm:pr-4">
                  <span className="text-[10px] font-bold text-[#64748D] uppercase tracking-wider">
                    {step.pointEn}
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#533AFD]">
                    {step.pointNumber}
                  </span>
                </div>

                {/* Unique Matching Icon */}
                <div 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: '#E2E4FF',
                    color: step.accentColor
                  }}
                >
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
                </div>

                {/* Main Text ONLY (No subtext as requested) */}
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-black text-[#0D253D] group-hover:text-[#533AFD] transition-colors leading-snug">
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
      </section>

      {/* 3. Section After All Detail Steps: What We Do After Your Website Order */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-[#F8FAFD] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="px-3.5 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold border border-[#533AFD]/20 inline-block mb-2">
              Verified Delivery Standards
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0D253D] tracking-tight">
              What We Do After Your Website Order
            </h2>
            <p className="text-xs sm:text-sm text-[#64748D] mt-2">
              আপনার ব্যবসার প্রতিটি ওয়েবসাইট অর্ডারের পর আমরা বিশ্বমানের ক্লাউড ইনফ্রাস্ট্রাকচার ও দীর্ঘমেয়াদী সেবা নিশ্চিত করি।
            </p>
          </div>

          {/* 4 Smart Deliverables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                অর্ডার কনফার্ম করার মাত্র ২৪ ঘণ্টার মধ্যে সম্পূর্ণ কার্যকরী ওয়েবসাইট লাইভ করে দেওয়া হয়।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">ফ্রি .com ডোমেইন ও ক্লাউড হোস্টিং</h4>
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
              <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">আজীবন ফ্রি টেকনিক্যাল কনসাল্টেশন</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                যেকোনো সময় সরাসরি হোয়াটসঅ্যাপ বা ফোন কলে আমাদের টেকনিক্যাল টিম থেকে ইনস্ট্যান্ট সমাধান।
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="pt-6 border-t border-[#E5EDF5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onGoToDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ড্যাশবোর্ডে ওয়েবসাইট দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#00B261] hover:bg-[#009e56] text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp এ সরাসরি যোগাযোগ</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
