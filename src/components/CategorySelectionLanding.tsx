import React, { useState, useEffect } from 'react';
import { 
  ShoppingBasket, UtensilsCrossed, Newspaper, Store, 
  ChevronRight, ArrowRight, CheckCircle2, Globe
} from 'lucide-react';
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
      <header className="w-full bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-[#E5EDF5] shadow-[0_1px_8px_rgba(13,37,61,0.03)] shrink-0 h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#533AFD] to-[#694FFF] text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_3px_12px_rgba(83,58,253,0.32)] ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            BW
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline leading-none">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#0D253D] group-hover:text-[#533AFD] transition-colors">
                BongoWeb
              </span>
              <span className="text-xs sm:text-sm font-black text-[#533AFD] ml-0.5">.xyz</span>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#64748D] -mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B261] animate-pulse" />
              <span>{t('ভেরিফাইড প্ল্যাটফর্ম', 'Verified Platform')}</span>
            </div>
          </div>
        </div>

        {/* Right Actions: STRICTLY LANGUAGE SELECTION BUTTON (Client login removed as requested) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] shadow-2xs">
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                language === 'bn'
                  ? 'bg-[#533AFD] text-white shadow-xs'
                  : 'text-[#64748D] hover:text-[#0D253D]'
              }`}
              title="বাংলা ভাষা নির্বাচন করুন"
            >
              <span className="text-sm leading-none">🇧🇩</span>
              <span>বাংলা</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                language === 'en'
                  ? 'bg-[#533AFD] text-white shadow-xs'
                  : 'text-[#64748D] hover:text-[#0D253D]'
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
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex flex-col justify-center items-center relative overflow-hidden">
        {/* Subtle Ambient Background Spotlight */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#533AFD]/[0.04] via-transparent to-[#FF6118]/[0.03] rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Hero Title Section */}
        <div className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E2E4FF]/70 border border-[#533AFD]/20 text-[#533AFD] text-[11px] font-bold mb-3 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#533AFD] animate-pulse" />
            <span>
              {t(
                '২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি · ১০০% রেডি লাইভ ডিজাইন',
                '⚡ 24-Hour Express Launch Guaranteed · 100% Live Demos'
              )}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-[40px] font-black text-[#0D253D] tracking-tight leading-tight">
            {language === 'bn' ? (
              <>
                Select Your Website <span className="bg-gradient-to-r from-[#533AFD] via-[#665EFD] to-[#8B5CF6] bg-clip-text text-transparent">Category</span>
              </>
            ) : (
              <>
                Choose Your Website <span className="bg-gradient-to-r from-[#533AFD] via-[#665EFD] to-[#8B5CF6] bg-clip-text text-transparent">Category</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#64748D] mt-2 max-w-xl mx-auto leading-relaxed">
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
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6 w-full max-w-3xl">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat.id)}
                className={`group relative p-4 sm:p-6 sm:py-7 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-[0_2px_12px_rgba(13,37,61,0.04)] hover:shadow-[0_16px_36px_rgba(13,37,61,0.09)] min-h-[220px] sm:min-h-[265px] md:min-h-[280px] bg-gradient-to-b from-[#FFFFFF] to-[#FDFEFE] hover:-translate-y-1 overflow-hidden select-none ${
                  isSelected
                    ? 'border-[#533AFD] ring-2 ring-[#533AFD]/20 shadow-[0_14px_34px_rgba(83,58,253,0.18)] scale-[1.01]'
                    : `border-[#E5EDF5] ${cat.borderHover}`
                }`}
              >
                {/* Top Corner Ambient Glow on Hover */}
                <div 
                  className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: cat.accentColor }}
                />

                <div className="relative z-10">
                  {/* Top Bar: Icon + Status Indicator */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-2xs border border-black/[0.04] ${cat.iconBg}`}
                      style={{ color: cat.accentColor }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F8FAFD] border border-[#E5EDF5] text-[10px] sm:text-[11px] font-semibold text-[#64748D] group-hover:text-[#0D253D] transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                      <span className="hidden xs:inline-block">
                        {language === 'en' ? cat.tagEn : cat.tagBn}
                      </span>
                    </div>
                  </div>

                  {/* Titles */}
                  <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-[#0D253D] group-hover:text-[#533AFD] transition-colors leading-tight">
                    {cat.titleEnglish}
                  </h3>

                  {language === 'bn' ? (
                    <span className="text-xs sm:text-sm font-bold text-[#533AFD] block mt-0.5 mb-1.5 sm:mb-2">
                      {cat.titleBangla}
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-[#533AFD] block mt-0.5 mb-1.5 sm:mb-2">
                      {cat.tagEn}
                    </span>
                  )}

                  <p className="text-[11px] sm:text-xs text-[#64748D] group-hover:text-[#475569] line-clamp-2 leading-relaxed mb-3">
                    {language === 'en' ? cat.subtitleEn : cat.subtitleBn}
                  </p>

                  {/* Micro features separator */}
                  <div className="hidden sm:inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#7D8BA4] bg-[#F8FAFD] px-2.5 py-1 rounded-lg border border-[#E5EDF5]/60">
                    <span className="w-1 h-1 rounded-full bg-[#00B261]" />
                    <span>{language === 'en' ? cat.featuresEn : cat.featuresBn}</span>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="relative z-10 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#E5EDF5] flex items-center justify-between text-xs sm:text-sm font-bold text-[#533AFD]">
                  <span className="group-hover:text-[#3B25D4] transition-colors">
                    {t('ক্যাটালগ দেখুন', 'Explore Catalog')}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#F8FAFD] group-hover:bg-[#533AFD] text-[#533AFD] group-hover:text-[#FFFFFF] flex items-center justify-center transition-all duration-200">
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button & Reassurance Signals */}
        <div className="mt-6 sm:mt-8 text-center flex flex-col items-center gap-3.5">
          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFD] text-[#0D253D] hover:text-[#533AFD] border border-[#E5EDF5] hover:border-[#533AFD]/40 font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md cursor-pointer group"
          >
            <span>{t('সবগুলো ক্যাটাগরি একসাথে ব্রাউজ করুন', 'Browse All Categories Together')}</span>
            <ArrowRight className="w-4 h-4 text-[#533AFD] transition-transform group-hover:translate-x-1" />
          </button>

          {/* Trust Reassurance Footnotes */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-[11px] font-semibold text-[#7D8BA4] flex-wrap pt-1">
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
        <p>© 2026 BongoWeb.xyz — All Rights Reserved.</p>
      </footer>
    </div>
  );
}
