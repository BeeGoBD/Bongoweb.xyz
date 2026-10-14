import React from 'react';
import { 
  PhoneCall, 
  FolderKanban, 
  Palette, 
  Rocket, 
  Clock, 
  ShieldCheck, 
  MessageCircle,
  LayoutGrid
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

interface AfterOrderViewProps {
  onGoToDashboard?: () => void;
  onOpenLiveChat?: () => void;
}

export default function AfterOrderView({ onGoToDashboard, onOpenLiveChat }: AfterOrderViewProps) {
  const { language } = useLanguage();

  const steps = [
    {
      stepNum: '1',
      titleEn: 'Confirmation Call',
      titleBn: 'কনফার্মেশন কল',
      descEn: 'Project manager calls within 15 minutes to confirm requirements',
      descBn: '১৫ মিনিটের মধ্যে প্রজেক্ট ম্যানেজার কল করে রিকোয়ারমেন্ট বুঝে নেবেন',
      timeEn: '15 mins',
      timeBn: '১৫ মিনিট',
      icon: PhoneCall
    },
    {
      stepNum: '2',
      titleEn: 'Content & Logo',
      titleBn: 'ব্র্যান্ডিং ও কনটেন্ট',
      descEn: 'Send your logo, pictures & product details, or let us provide templates',
      descBn: 'লোগো, ছবি ও প্রোডাক্টের তথ্য সহজে শেয়ার করুন',
      timeEn: '2-4 hrs',
      timeBn: '২-৪ ঘণ্টা',
      icon: FolderKanban
    },
    {
      stepNum: '3',
      titleEn: 'Setup & Customization',
      titleBn: 'সেটআপ ও ডিজাইন',
      descEn: 'Theme colors, banners, bKash/Nagad & courier integration ready',
      descBn: 'কালার থিম, ব্যানার, বিকাশ/নগদ পেমেন্ট ও কুরিয়ার ইন্টিগ্রেশন',
      timeEn: '12 hrs',
      timeBn: '১২ ঘণ্টা',
      icon: Palette
    },
    {
      stepNum: '4',
      titleEn: 'Live Delivery',
      titleBn: 'লাইভ ডেলিভারি',
      descEn: 'Live website handover with domain, cloud hosting & admin access',
      descBn: 'ডোমেন, ক্লাউড হোস্টিং ও সম্পূর্ণ এডমিন এক্সেস সহ সাইট হস্তান্তর',
      timeEn: '24 hrs',
      timeBn: '২৪ ঘণ্টা',
      icon: Rocket
    }
  ];

  return (
    <div 
      id="after-order-view"
      data-view="after-order"
      className="w-full flex flex-col font-sans pb-24 lg:pb-16 pt-3 sm:pt-6 lg:pt-8 select-none bg-slate-50 text-slate-900"
    >
      {/* Main Targeted Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Simple Header */}
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'en' ? 'How Order Process Works' : 'অর্ডার প্রসেস কিভাবে কাজ করে'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {language === 'en' 
              ? 'Simple 4-step workflow from confirmation to live website' 
              : 'কনফার্মেশন থেকে লাইভ সাইট হস্তান্তরের ৪টি সহজ ধাপ'}
          </p>
        </header>

        {/* 4 Simple Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNum}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center font-mono">
                      {step.stepNum}
                    </span>
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                    {language === 'en' ? step.titleEn : step.titleBn}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'en' ? step.descEn : step.descBn}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? `Est: ${step.timeEn}` : `সময়: ${step.timeBn}`}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simple Bottom Banner */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              {language === 'en' 
                ? 'Free Domain, SSL & Cloud Hosting included with 24/7 support' 
                : 'ফ্রি ডোমেইন, এসএসএল ও ক্লাউড হোস্টিং সহ সার্বক্ষণিক সাপোর্ট অন্তর্ভুক্ত'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {onGoToDashboard && (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
                </span>
              </button>
            )}

            {onOpenLiveChat && (
              <button
                type="button"
                onClick={onOpenLiveChat}
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer shadow-2xs"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Live Chat' : 'লাইভ চ্যাট'}
                </span>
              </button>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}
