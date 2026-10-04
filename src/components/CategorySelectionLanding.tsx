import React, { useState, useEffect } from 'react';
import { 
  ShoppingBasket, UtensilsCrossed, Newspaper, Store, 
  ChevronRight, ArrowRight, CheckCircle2, Globe
} from 'lucide-react';
import BongoWebLogo from './BongoWebLogo';
import { WebsiteCategory, UserAccount } from '../types';
import { useLanguage } from '../utils/LanguageContext';

interface CategorySelectionLandingProps {
  onSelectCategory: (category: WebsiteCategory) => void;
  onNavigateToTab?: (tab: 'dashboard' | 'after-order' | 'live-chat' | 'account') => void;
}

export default function CategorySelectionLanding({ 
  onSelectCategory,
  onNavigateToTab: _onNavigateToTab
}: CategorySelectionLandingProps) {
  const [selectedId, setSelectedId] = useState<WebsiteCategory | null>(null);
  const { language, setLanguage, t } = useLanguage();

  // Strictly 4 core categories in order: 
  // Row 1: E-Commerce & Restaurant side-by-side
  // Row 2: Blogs & Media & Groceries side-by-side
  const categories = [
    {
      id: 'ecommerce' as WebsiteCategory,
      titleEnglish: 'E-Commerce',
      titleBangla: 'ই-কমার্স ও শপ',
      subtitleBn: 'অনলাইন শপ, স্টক ম্যানেজমেন্ট, অটো পেমেন্ট ও কুরিয়ার ট্র্যাকিং',
      subtitleEn: 'Online stores, inventory, automated payments & courier sync',
      featuresBn: 'bKash Auto · Courier Sync',
      featuresEn: 'Auto Payment · Courier Sync',
      icon: ShoppingBasket,
      tagBn: 'সর্বাধিক জনপ্রিয়',
      tagEn: 'Most Popular',
      accentColor: '#533AFD',
      iconBg: 'bg-[#F0EEFF]',
      borderHover: 'hover:border-[#533AFD]'
    },
    {
      id: 'restaurant' as WebsiteCategory,
      titleEnglish: 'Restaurant',
      titleBangla: 'ক্যাফে ও রেস্তোরাঁ',
      subtitleBn: 'ডিজিটাল ফুড মেনু, টেবিল বুকিং ও হোম ডেলিভারি সিস্টেম',
      subtitleEn: 'Digital food menu, table reservation, dine-in delivery',
      featuresBn: 'Digital Menu · Table Booking',
      featuresEn: 'Digital Menu · Table Booking',
      icon: UtensilsCrossed,
      tagBn: 'ট্রেন্ডিং চয়েস',
      tagEn: 'Trending Choice',
      accentColor: '#FF6118',
      iconBg: 'bg-[#FFF3EC]',
      borderHover: 'hover:border-[#FF6118]'
    },
    {
      id: 'blogging' as WebsiteCategory,
      titleEnglish: 'Blogs & Media',
      titleBangla: 'ব্লগ ও মিডিয়া',
      subtitleBn: 'আধুনিক নিউজ ম্যাগাজিন, দ্রুত গুগল র‍্যাংকিং ও আর্টিকেল পাবলিশার',
      subtitleEn: 'Modern news magazine, SEO archives, article publisher',
      featuresBn: 'AdSense Ready · Fast SEO',
      featuresEn: 'AdSense Ready · Fast SEO',
      icon: Newspaper,
      tagBn: 'হাই ট্রাফিক',
      tagEn: 'High Traffic',
      accentColor: '#7C3AED',
      iconBg: 'bg-[#F5F0FF]',
      borderHover: 'hover:border-[#7C3AED]'
    },
    {
      id: 'grocery' as WebsiteCategory,
      titleEnglish: 'Groceries',
      titleBangla: 'মুদি ও গ্রোসারি',
      subtitleBn: 'অর্গানিক ফার্ম ফুড, এলাকাভিত্তিক এক্সপ্রেস ডেলিভারি ও ওয়েট কার্টস',
      subtitleEn: 'Organic farm foods, area express delivery, weight carts',
      featuresBn: 'Weight Carts · Area Express',
      featuresEn: 'Weight Carts · Area Express',
      icon: Store,
      tagBn: 'নিত্যপ্রয়োজনীয়',
      tagEn: 'Daily Essential',
      accentColor: '#00B261',
      iconBg: 'bg-[#EBFDF3]',
      borderHover: 'hover:border-[#00B261]'
    }
  ];

  const handleCardClick = (catId: WebsiteCategory) => {
    setSelectedId(catId);
    setTimeout(() => {
      onSelectCategory(catId);
    }, 100);
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#0D253D] flex flex-col justify-between font-sans select-none overflow-y-auto">
      {/* 1. Top Header */}
      <header className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_16px_rgba(15,23,42,0.03)] shrink-0 h-16 sm:h-[68px] px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
        {/* Left Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group">
          <BongoWebLogo size="md" />
          <div className="hidden sm:flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B261] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00B261]"></span>
            </span>
            <span>{t('ভেরিফাইড প্ল্যাটফর্ম', 'Verified Platform')}</span>
          </div>
        </div>

        {/* Right Actions: STRICTLY LANGUAGE SELECTION BUTTON */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                language === 'bn'
                  ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-slate-900/5 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
              title="বাংলা ভাষা নির্বাচন করুন"
            >
              <span className="text-sm leading-none">🇧🇩</span>
              <span>বাংলা</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-slate-900/5 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
              title="Select English Language"
            >
              <span className="text-sm leading-none">🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Viewport: All 4 categories with premium studio presence */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex flex-col justify-center items-center relative overflow-hidden">
        {/* Subtle Ambient Background Spotlight */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-[#2563EB]/[0.07] via-[#F59E0B]/[0.05] to-[#C026D3]/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Hero Title Section */}
        <div className="text-center mb-7 sm:mb-9 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-50/90 to-amber-50/80 border border-rose-200/80 text-[#2563EB] text-[11px] font-bold mb-4 shadow-xs select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]"></span>
            </span>
            <span>
              {t(
                '২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি · ১০০% রেডি লাইভ ডিজাইন',
                '⚡ 24-Hour Express Launch Guaranteed · 100% Live Demos'
              )}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            {language === 'bn' ? (
              <>
                Select Your Website <span className="bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#2563EB] bg-clip-text text-transparent">Category</span>
              </>
            ) : (
              <>
                Choose Your Website <span className="bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#2563EB] bg-clip-text text-transparent">Category</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-2.5 max-w-xl mx-auto leading-relaxed font-normal">
            {t(
              'আপনার ব্যবসার জন্য প্রস্তুত সম্পূর্ণ রেডি লাইভ ডিজাইন বেছে নিন। সরাসরি ডেমো ব্রাউজ করুন এবং ১ ক্লিকে শুরু করুন।',
              'Select a ready-to-launch live design tailored for your business. Browse interactive previews and get started with 1 click.'
            )}
          </p>
        </div>

        {/* 2x2 Grid: 
            Row 1: E-Commerce & Restaurant side-by-side
            Row 2: Blogs & Groceries side-by-side
            Enhanced tactile depth, refined typography, and sleek hover elevation */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat.id)}
                className={`group relative p-5 sm:p-6 sm:py-7 rounded-[24px] sm:rounded-[28px] border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-10px_rgba(15,23,42,0.12)] min-h-[230px] sm:min-h-[275px] md:min-h-[290px] bg-white/95 backdrop-blur-md hover:-translate-y-1.5 overflow-hidden select-none ${
                  isSelected
                    ? 'border-[#2563EB] ring-3 ring-[#2563EB]/20 shadow-[0_16px_36px_rgba(99,102,241,0.2)] scale-[1.01]'
                    : `border-slate-200/90 ${cat.borderHover}`
                }`}
              >
                {/* Top Corner Ambient Glow on Hover */}
                <div 
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: cat.accentColor }}
                />

                <div className="relative z-10">
                  {/* Top Bar: Icon + Status Indicator */}
                  <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-xs border border-black/[0.03] ${cat.iconBg}`}
                      style={{ color: cat.accentColor }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[10px] sm:text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                      <span className="hidden xs:inline-block">
                        {language === 'en' ? cat.tagEn : cat.tagBn}
                      </span>
                    </div>
                  </div>

                  {/* Titles */}
                  <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 group-hover:text-[#533AFD] transition-colors leading-tight">
                    {cat.titleEnglish}
                  </h3>

                  {language === 'bn' ? (
                    <span className="text-xs sm:text-sm font-bold text-[#2563EB] block mt-0.5 mb-1.5 sm:mb-2">
                      {cat.titleBangla}
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-[#2563EB] block mt-0.5 mb-1.5 sm:mb-2">
                      {cat.tagEn}
                    </span>
                  )}

                  <p className="text-[11px] sm:text-xs text-slate-500 group-hover:text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {language === 'en' ? cat.subtitleEn : cat.subtitleBn}
                  </p>

                  {/* Micro features separator */}
                  <div className="hidden sm:inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
                    <span className="w-1 h-1 rounded-full bg-[#00B261]" />
                    <span>{language === 'en' ? cat.featuresEn : cat.featuresBn}</span>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="relative z-10 pt-3.5 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-[#2563EB]">
                  <span className="group-hover:text-[#1D4ED8] transition-colors">
                    {t('ক্যাটালগ দেখুন', 'Explore Catalog')}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-50 group-hover:bg-[#2563EB] text-[#2563EB] group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs group-hover:shadow-md">
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button & Reassurance Signals */}
        <div className="mt-7 sm:mt-9 text-center flex flex-col items-center gap-4">
          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 hover:text-[#2563EB] border border-slate-200/90 hover:border-[#2563EB]/40 font-extrabold text-xs sm:text-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(99,102,241,0.18)] cursor-pointer group active:scale-[0.99]"
          >
            <span>{t('সবগুলো ক্যাটাগরি একসাথে ব্রাউজ করুন', 'Browse All Categories Together')}</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB] transition-transform group-hover:translate-x-1 stroke-[2.5]" />
          </button>

          {/* Trust Reassurance Footnotes */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-[11px] font-medium text-slate-500 flex-wrap pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00B261]" />
              <span>{t('ফ্রি লাইভ সাপোর্ট', 'Free Live Support')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00B261]" />
              <span>{t('১০০% মোবাইল রেসপন্সিভ', '100% Mobile Responsive')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00B261]" />
              <span>{t('সম্পূর্ণ লাইভ ডেমো রেডি', 'Full Live Demo Ready')}</span>
            </span>
          </div>
        </div>
      </main>

      {/* 3. Clean Footer */}
      <footer className="w-full py-2.5 shrink-0 border-t border-[#E5EDF5] bg-[#FFFFFF] text-center text-[10px] sm:text-xs text-[#64748D]">
        <p>© 2026 BongoWeb — All Rights Reserved.</p>
      </footer>
    </div>
  );
}
