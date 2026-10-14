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
import Card3D from './Card3D';
import ThreeCanvas3D from './ThreeCanvas3D';

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
      icon: PhoneCall,
      color: 'from-purple-500 to-indigo-600',
      shadow3d: 'shadow-[0_8px_0_0_#DDD6FE,0_16px_25px_-5px_rgba(124,58,237,0.18)]'
    },
    {
      stepNum: '2',
      titleEn: 'Content & Logo',
      titleBn: 'ব্র্যান্ডিং ও কনটেন্ট',
      descEn: 'Send your logo, pictures & product details, or let us provide templates',
      descBn: 'লোগো, ছবি ও প্রোডাক্টের তথ্য সহজে শেয়ার করুন',
      timeEn: '2-4 hrs',
      timeBn: '২-৪ ঘণ্টা',
      icon: FolderKanban,
      color: 'from-blue-500 to-cyan-600',
      shadow3d: 'shadow-[0_8px_0_0_#BFDBFE,0_16px_25px_-5px_rgba(59,130,246,0.18)]'
    },
    {
      stepNum: '3',
      titleEn: 'Setup & Customization',
      titleBn: 'সেটআপ ও ডিজাইন',
      descEn: 'Theme colors, banners, bKash/Nagad & courier integration ready',
      descBn: 'কালার থিম, ব্যানার, বিকাশ/নগদ পেমেন্ট ও কুরিয়ার ইন্টিগ্রেশন',
      timeEn: '12 hrs',
      timeBn: '১২ ঘণ্টা',
      icon: Palette,
      color: 'from-amber-500 to-orange-600',
      shadow3d: 'shadow-[0_8px_0_0_#FDE68A,0_16px_25px_-5px_rgba(245,158,11,0.18)]'
    },
    {
      stepNum: '4',
      titleEn: 'Live Delivery',
      titleBn: 'লাইভ ডেলিভারি',
      descEn: 'Live website handover with domain, cloud hosting & admin access',
      descBn: 'ডোমেন, ক্লাউড হোস্টিং ও সম্পূর্ণ এডমিন এক্সেস সহ সাইট হস্তান্তর',
      timeEn: '24 hrs',
      timeBn: '২৪ ঘণ্টা',
      icon: Rocket,
      color: 'from-emerald-500 to-teal-600',
      shadow3d: 'shadow-[0_8px_0_0_#A7F3D0,0_16px_25px_-5px_rgba(16,185,129,0.18)]'
    }
  ];

  return (
    <div 
      id="after-order-view"
      data-view="after-order"
      className="relative w-full flex flex-col font-sans pb-24 lg:pb-16 pt-3 sm:pt-6 lg:pt-8 select-none bg-slate-50/80 text-slate-900 perspective-1500"
    >
      {/* 3D Ambient Universe Background */}
      <ThreeCanvas3D intensity={0.9} />

      {/* Main Targeted Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full preserve-3d">
        
        {/* Simple 3D Header */}
        <header className="text-center mb-6 sm:mb-8 preserve-3d">
          <div className="inline-block translate-z-sm">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-xs">
              {language === 'en' ? 'How Order Process Works' : 'অর্ডার প্রসেস কিভাবে কাজ করে'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto translate-z-xs font-medium">
            {language === 'en' 
              ? 'Simple 4-step 3D workflow from confirmation to live website' 
              : 'কনফার্মেশন থেকে লাইভ সাইট হস্তান্তরের ৪টি সহজ ধাপ'}
          </p>
        </header>

        {/* 4 3D Step Cards with Mouse Parallax & Dynamic Light Glare */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 perspective-1000 preserve-3d">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card3D
                key={step.stepNum}
                maxTilt={12}
                scale={1.03}
                className={`p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 border-b-[6px] border-b-purple-400/80 ${step.shadow3d} transition-all flex flex-col justify-between`}
              >
                <div>
                  {/* Top Row: Floating 3D Step Number & 3D Icon */}
                  <div className="flex items-center justify-between mb-4 translate-z-lg">
                    <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 border-b-2 border-b-purple-300 text-xs font-black flex items-center justify-center font-mono shadow-sm">
                      {step.stepNum}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-tr ${step.color} text-white shadow-[0_4px_12px_rgba(124,58,237,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.7),inset_0_-1.5px_1px_rgba(0,0,0,0.2)] border border-white/40`}>
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Title & Description with Depth */}
                  <div className="translate-z-md">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
                      {language === 'en' ? step.titleEn : step.titleBn}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'en' ? step.descEn : step.descBn}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Time Badge */}
                <div className="pt-3 mt-4 border-t border-purple-100/70 flex items-center gap-1.5 text-xs text-purple-700 font-semibold translate-z-sm">
                  <Clock className="w-3.5 h-3.5 opacity-80" />
                  <span>{language === 'en' ? `Est: ${step.timeEn}` : `সময়: ${step.timeBn}`}</span>
                </div>
              </Card3D>
            );
          })}
        </div>

        {/* 3D Reassurance & Action Banner */}
        <Card3D
          maxTilt={6}
          scale={1.01}
          glare={false}
          className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 border-b-[5px] border-b-slate-300 shadow-[0_6px_0_0_#CBD5E1,0_12px_24px_-4px_rgba(15,23,42,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3 preserve-3d"
        >
          <div className="flex items-center gap-3 translate-z-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 border-b-2 border-b-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                {language === 'en' 
                  ? 'Free Domain, SSL & Cloud Hosting included with 24/7 support' 
                  : 'ফ্রি ডোমেইন, এসএসএল ও ক্লাউড হোস্টিং সহ সার্বক্ষণিক সাপোর্ট অন্তর্ভুক্ত'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'en' 
                  ? '100% verified live handover & continuous technical support' 
                  : 'লাইভ সাইট হস্তান্তর ও সার্বক্ষণিক প্রজেক্ট সাপোর্ট নিশ্চিত'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 translate-z-md">
            {onGoToDashboard && (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 border-b-[3px] border-b-slate-300 shadow-2xs active:border-b active:translate-y-[2px] active:shadow-none transition-all cursor-pointer btn-3d-tactile"
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
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] border border-purple-400/40 border-b-[3.5px] border-b-purple-950 shadow-[0_3px_0_0_#4C1D95] active:border-b active:translate-y-[2px] active:shadow-none transition-all cursor-pointer btn-3d-tactile"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Live Chat' : 'লাইভ চ্যাট'}
                </span>
              </button>
            )}
          </div>
        </Card3D>

      </section>
    </div>
  );
}
