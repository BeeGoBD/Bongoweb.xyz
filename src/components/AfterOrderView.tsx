import React from 'react';
import { 
  PhoneCall, 
  FolderKanban, 
  Palette, 
  Rocket, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  MessageCircle,
  LayoutGrid
} from 'lucide-react';

interface AfterOrderViewProps {
  onGoToDashboard?: () => void;
  onOpenLiveChat?: () => void;
}

export default function AfterOrderView({ onGoToDashboard, onOpenLiveChat }: AfterOrderViewProps) {
  const steps = [
    {
      stepNum: '০১',
      stepLabel: 'ধাপ ০১',
      tag: 'প্রথম পদক্ষেপ',
      title: 'কনফার্মেশন ও রিকোয়ারমেন্ট কল',
      description: '১৫ মিনিটের মধ্যে প্রজেক্ট ম্যানেজার কল করবেন',
      time: 'আনুমানিক সময়: ১৫ মিনিট',
      icon: PhoneCall,
      cardBg: 'bg-gradient-to-br from-[#0E1E36] via-[#0A1628] to-[#070E1A]',
      border: 'border-blue-500/35 hover:border-blue-400',
      tagColor: 'bg-blue-950/90 text-blue-300 border-blue-800/80',
      iconBg: 'bg-blue-600 text-white shadow-blue-500/30',
      timeColor: 'text-blue-300',
      badgeBg: 'bg-blue-600 text-white'
    },
    {
      stepNum: '০২',
      stepLabel: 'ধাপ ০২',
      tag: 'তথ্য সংগ্রহ',
      title: 'ব্র্যান্ডিং ও কনটেন্ট সংগ্রহ',
      description: 'লোগো, ছবি ও প্রোডাক্ট তথ্য সহজ সংগ্রহ',
      time: 'আনুমানিক সময়: ২-৪ ঘণ্টা',
      icon: FolderKanban,
      cardBg: 'bg-gradient-to-br from-[#2B1B0E] via-[#1E1309] to-[#120B05]',
      border: 'border-amber-500/35 hover:border-amber-400',
      tagColor: 'bg-amber-950/90 text-amber-300 border-amber-800/80',
      iconBg: 'bg-amber-600 text-white shadow-amber-500/30',
      timeColor: 'text-amber-300',
      badgeBg: 'bg-amber-600 text-white'
    },
    {
      stepNum: '০৩',
      stepLabel: 'ধাপ ০৩',
      tag: 'কাস্টমাইজেশন',
      title: 'ডিজাইন তৈরি ও ফিচার সেটআপ',
      description: 'কালার থিম, ব্যানার ও পেমেন্ট গেটওয়ে ইন্টিগ্রেশন',
      time: 'আনুমানিক সময়: ১২ ঘণ্টা',
      icon: Palette,
      cardBg: 'bg-gradient-to-br from-[#1E1338] via-[#150D27] to-[#0E081A]',
      border: 'border-purple-500/35 hover:border-purple-400',
      tagColor: 'bg-purple-950/90 text-purple-300 border-purple-800/80',
      iconBg: 'bg-[#7C3AED] text-white shadow-purple-500/30',
      timeColor: 'text-purple-300',
      badgeBg: 'bg-[#7C3AED] text-white'
    },
    {
      stepNum: '০৪',
      stepLabel: 'ধাপ ০৪',
      tag: 'লাইভ হ্যান্ডওভার',
      title: 'ওয়েবসাইট ডেলিভারি ও সাপোর্ট',
      description: 'ডোমেইন ও হোস্টিং সহ লাইভ সাইট হস্তান্তর',
      time: 'আনুমানিক সময়: ২৪ ঘণ্টা',
      icon: Rocket,
      cardBg: 'bg-gradient-to-br from-[#0E291F] via-[#0A1C15] to-[#06110D]',
      border: 'border-emerald-500/35 hover:border-emerald-400',
      tagColor: 'bg-emerald-950/90 text-emerald-300 border-emerald-800/80',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/30',
      timeColor: 'text-emerald-300',
      badgeBg: 'bg-emerald-600 text-white'
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans pb-24 lg:pb-16 pt-3 sm:pt-6 lg:pt-8 select-none bg-[#0B0F19] text-slate-100">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* ================= CLEAN HEADER ================= */}
        <header className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/80 text-purple-300 text-xs font-bold border border-purple-800/80 mb-2.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
            <span>অর্ডার প্রসেস • Order Workflow</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-white tracking-tight leading-snug">
            অর্ডারের পর ধারাবাহিক ৪টি পদক্ষেপ
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
            আপনার পছন্দের ডিজাইনটি বেছে অর্ডার করার পর আমাদের টিম যেভাবে আপনার ওয়েবসাইটটি রেডি করবে:
          </p>
        </header>

        {/* ================= 4 CLEAN STEPS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNum}
                className={`relative p-5 rounded-2xl sm:rounded-3xl ${step.cardBg} border ${step.border} shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between`}
              >
                {/* Desktop subtle connector between steps 1-3 */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 shadow-xs items-center justify-center text-slate-300">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}

                <div>
                  {/* Top Row: Number, Tag, Icon */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-xl ${step.badgeBg} text-xs font-black flex items-center justify-center shadow-xs`}>
                        {step.stepNum}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${step.tagColor}`}>
                        {step.tag}
                      </span>
                    </div>

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${step.iconBg}`}>
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-base sm:text-[17px] font-black text-white leading-snug tracking-tight mb-2">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Timing and Step Label */}
                <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className={`flex items-center gap-1.5 font-bold ${step.timeColor}`}>
                    <Clock className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    <span className="text-[11px] sm:text-xs">{step.time}</span>
                  </div>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-200 border border-slate-700/80 shadow-2xs">
                    {step.stepLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= CLEAN REASSURANCE & ACTION BAR ================= */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                ফ্রি ডোমেইন, এসএসএল ও ক্লাউড হোস্টিং প্রতিটি অর্ডারের সাথে অন্তর্ভুক্ত
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                লাইভ সাইট হস্তান্তর ও প্রজেক্ট সাপোর্ট নিশ্চিত
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            {onGoToDashboard && (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer active:scale-95"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>ড্যাশবোর্ড</span>
              </button>
            )}

            {onOpenLiveChat && (
              <button
                type="button"
                onClick={onOpenLiveChat}
                className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>লাইভ চ্যাট</span>
              </button>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}
