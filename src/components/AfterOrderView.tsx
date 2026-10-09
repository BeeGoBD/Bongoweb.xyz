import React from 'react';
import { 
  PhoneCall, 
  FolderKanban, 
  Rocket, 
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AfterOrderViewProps {
  onGoToDashboard?: () => void;
  onOpenLiveChat?: () => void;
}

export default function AfterOrderView({ onGoToDashboard: _onGoToDashboard, onOpenLiveChat: _onOpenLiveChat }: AfterOrderViewProps) {
  // Professional sequential order workflow steps
  const serialSteps = [
    {
      stepNum: '০১',
      tag: 'প্রথম পদক্ষেপ',
      stage: 'রিকোয়ারমেন্ট',
      title: 'কনফার্মেশন ও রিকোয়ারমেন্ট কল',
      highlight: '১৫ মিনিটের মধ্যে প্রজেক্ট ম্যানেজার কল করবেন',
      timeEst: '১৫ মিনিট',
      icon: PhoneCall,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      tagBg: 'bg-blue-50 text-blue-700 border-blue-100',
      cardHover: 'hover:border-blue-400 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)]'
    },
    {
      stepNum: '০২',
      tag: 'তথ্য সংগ্রহ',
      stage: 'ব্র্যান্ডিং',
      title: 'ব্র্যান্ডিং ও কনটেন্ট সংগ্রহ',
      highlight: 'লোগো, ছবি ও প্রোডাক্ট তথ্য সহজ সংগ্রহ',
      timeEst: '২-৪ ঘণ্টা',
      icon: FolderKanban,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      tagBg: 'bg-amber-50 text-amber-700 border-amber-100',
      cardHover: 'hover:border-amber-400 hover:shadow-[0_8px_24px_rgba(217,119,6,0.08)]'
    },
    {
      stepNum: '০৩',
      tag: 'কাস্টমাইজেশন',
      stage: 'ডেভেলপমেন্ট',
      title: 'ডিজাইন তৈরি ও ফিচার সেটআপ',
      highlight: 'কালার থিম, ব্যানার ও পেমেন্ট গেটওয়ে ইন্টিগ্রেশন',
      timeEst: '১২ ঘণ্টা',
      icon: Rocket,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      tagBg: 'bg-purple-50 text-purple-700 border-purple-100',
      cardHover: 'hover:border-purple-400 hover:shadow-[0_8px_24px_rgba(147,51,234,0.08)]'
    },
    {
      stepNum: '০৪',
      tag: 'লাইভ হ্যান্ডওভার',
      stage: 'ডেলিভারি',
      title: 'ওয়েবসাইট ডেলিভারি ও সাপোর্ট',
      highlight: 'ডোমেইন ও হোস্টিং সহ লাইভ সাইট হস্তান্তর',
      timeEst: '২৪ ঘণ্টা',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      cardHover: 'hover:border-emerald-400 hover:shadow-[0_8px_24px_rgba(16,185,129,0.08)]'
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-4">
      {/* SECTION: SERIALIZED ORDER STEPS (অর্ডারের পর ধারাবাহিক পদক্ষেপসমূহ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        {/* Header (div:nth-of-type(1)) */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100/80 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>অর্ডার প্রসেস • Order Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            অর্ডারের পর ধারাবাহিক ৪টি পদক্ষেপ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-lg mx-auto">
            আপনার পছন্দের ডিজাইনটি বেছে অর্ডার করার পর আমাদের টিম যেভাবে আপনার ওয়েবসাইটটি রেডি করবে:
          </p>
        </div>

        {/* Targeted Order Steps Container (div:nth-of-type(2)) */}
        <div className="w-full space-y-6">
          {/* Visual Workflow Stepper Bar (Connected Progress Flow) */}
          <div className="hidden sm:flex items-center justify-between p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80">
            {serialSteps.map((s, idx) => (
              <React.Fragment key={s.stepNum}>
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    idx === 0 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}>
                    {s.stepNum}
                  </span>
                  <div className="text-left">
                    <span className="text-[11px] font-semibold text-slate-900 block leading-none">
                      {s.stage}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium leading-tight">
                      {s.timeEst}
                    </span>
                  </div>
                </div>
                {idx < serialSteps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Executive Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {serialSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.stepNum}
                  className={`group relative p-4.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 ${step.cardHover} transition-all duration-200 flex flex-col justify-between gap-3 hover:-translate-y-0.5`}
                >
                  {/* Top Bar: Step Number + Tag + Icon */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 tracking-tight shadow-xs">
                        {step.stepNum}
                      </span>
                      <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full border ${step.tagBg}`}>
                        {step.tag}
                      </span>
                    </div>

                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${step.iconBg} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Title & Concise Highlight */}
                  <div>
                    <h3 className="text-[15px] sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                      {step.highlight}
                    </p>
                  </div>

                  {/* Bottom Meta Pill: Timing */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
                      <span>আনুমানিক সময়: <strong className="text-slate-700">{step.timeEst}</strong></span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                      ধাপ {step.stepNum}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reassurance Footer Banner */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700">ফ্রি ডোমেইন, এসএসএল ও ক্লাউড হোস্টিং প্রতিটি অর্ডারের সাথে অন্তর্ভুক্ত</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
