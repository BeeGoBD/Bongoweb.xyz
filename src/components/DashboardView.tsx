import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Newspaper, 
  Store, 
  ChevronRight
} from 'lucide-react';
import { WebsiteCategory, WebsiteDemo } from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';
import { useLanguage } from '../utils/LanguageContext';
import { apiGetWebsites } from '../utils/api';

interface DashboardViewProps {
  initialCategory?: WebsiteCategory;
  onOpenLiveDemo?: (demo: WebsiteDemo) => void;
  onOpenOrder: (demo: WebsiteDemo) => void;
  onSelectCategoryWebsites?: (category: WebsiteCategory) => void;
  onChangeCategoryLanding?: () => void;
}

interface CategoryContactItem {
  id: WebsiteCategory;
  serial: string;
  code: string;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
  tagEn: string;
  tagBn: string;
  demoId: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  cardBorderHover: string;
  hoverShadow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  actionHoverBg: string;
  featuresEn: string[];
  featuresBn: string[];
  startingPrice: string;
  // Intelligent Demand Attributes
  demandTier: 'most-demanded' | 'high-demand' | 'growing' | 'basic';
  demandBadgeEn: string;
  demandBadgeBn: string;
  demandBadgeBg: string;
  demandHighlightEn: string;
  demandHighlightBn: string;
}

export default function DashboardView({
  onOpenOrder,
  onSelectCategoryWebsites
}: DashboardViewProps) {
  const { language } = useLanguage();

  // Exactly four categories with rich bento visual design & intelligent market demand tiers
  const categoryContacts: CategoryContactItem[] = [
    {
      id: 'ecommerce',
      serial: '01',
      code: '#2085',
      nameEn: 'E-Commerce Store',
      nameBn: 'ই-কমার্স শপ',
      descEn: 'Online storefront • Automated checkout & courier tracking',
      descBn: 'অনলাইন শপ • অটো বিকাশ/নগদ পেমেন্ট ও রিয়েল-টাইম কুরিয়ার',
      tagEn: '🔥 Popular',
      tagBn: '🔥 জনপ্রিয়',
      demoId: 'ecom-1',
      icon: ShoppingBag,
      iconBg: 'bg-gradient-to-tr from-[#6B46C1] via-[#7C3AED] to-[#A855F7] text-white shadow-md shadow-purple-500/20',
      iconColor: 'text-purple-600',
      cardBg: 'bg-gradient-to-br from-purple-100/80 via-purple-50/50 to-white border-purple-200/90',
      cardBorderHover: 'hover:border-purple-400',
      hoverShadow: 'hover:shadow-[0_10px_30px_rgba(147,51,234,0.12)]',
      badgeBg: 'bg-purple-100/90',
      badgeText: 'text-purple-800',
      badgeBorder: 'border-purple-200',
      actionHoverBg: 'group-hover:bg-[#7C3AED] group-hover:text-white',
      featuresEn: ['bKash / Nagad', 'Courier Tracking', 'Cart & Stock'],
      featuresBn: ['বিকাশ/নগদ অটো', 'কুরিয়ার ট্র্যাকিং', 'স্টক ইনভেন্টরি'],
      startingPrice: '৳১,৯৯০',
      demandTier: 'most-demanded',
      demandBadgeEn: '🔥 Most Demanding',
      demandBadgeBn: '🔥 সর্বোচ্চ চাহিদা',
      demandBadgeBg: 'bg-purple-100 text-purple-800 border-purple-200 shadow-2xs',
      demandHighlightEn: 'Highest market demand • High-converting online storefront',
      demandHighlightBn: 'সর্বাধিক চাহিদাসম্পন্ন • হাই-কনভার্সন অনলাইন শপ'
    },
    {
      id: 'restaurant',
      serial: '02',
      code: '#1042',
      nameEn: 'Restaurant & Cafe',
      nameBn: 'রেস্তোরাঁ ও ক্যাফে',
      descEn: 'Food menu • Table reservation & online delivery ordering',
      descBn: 'ডিজিটাল ফুড মেনু • টেবিল বুকিং ও হোম ডেলিভারি সিস্টেম',
      tagEn: '⭐ Trending',
      tagBn: '⭐ ট্রেন্ডিং',
      demoId: 'rest-1',
      icon: UtensilsCrossed,
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20',
      iconColor: 'text-amber-600',
      cardBg: 'bg-gradient-to-br from-amber-100/80 via-orange-50/50 to-white border-amber-200/90',
      cardBorderHover: 'hover:border-amber-400',
      hoverShadow: 'hover:shadow-[0_10px_30px_rgba(245,158,11,0.12)]',
      badgeBg: 'bg-amber-100/90',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-200',
      actionHoverBg: 'group-hover:bg-amber-600 group-hover:text-white',
      featuresEn: ['Online Menu', 'Table Booking', 'Home Delivery'],
      featuresBn: ['ফুড মেনু', 'টেবিল বুকিং', 'হোম ডেলিভারি'],
      startingPrice: '৳১,৯৯০',
      demandTier: 'high-demand',
      demandBadgeEn: '⚡ High Demand',
      demandBadgeBn: '⚡ ব্যাপক চাহিদা',
      demandBadgeBg: 'bg-amber-100 text-amber-800 border-amber-200 shadow-2xs',
      demandHighlightEn: 'High daily demand • Table booking & live food ordering',
      demandHighlightBn: 'ব্যাপক চাহিদা • লাইভ ফুড মেনু ও কাস্টমার টেবিল বুকিং'
    },
    {
      id: 'blogging',
      serial: '03',
      code: '#3091',
      nameEn: 'Blog & Media',
      nameBn: 'ব্লগ ও মিডিয়া',
      descEn: 'News & articles • Fast Google indexing & AdSense ready',
      descBn: 'নিউজ পোর্টাল • দ্রুত গুগল র‍্যাংকিং ও অটো এডসেন্স রেডি',
      tagEn: '📈 High Traffic',
      tagBn: '📈 হাই ট্রাফিক',
      demoId: 'blog-1',
      icon: Newspaper,
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20',
      iconColor: 'text-blue-600',
      cardBg: 'bg-gradient-to-br from-blue-100/80 via-indigo-50/50 to-white border-blue-200/90',
      cardBorderHover: 'hover:border-blue-400',
      hoverShadow: 'hover:shadow-[0_10px_30px_rgba(59,130,246,0.12)]',
      badgeBg: 'bg-blue-100/90',
      badgeText: 'text-blue-800',
      badgeBorder: 'border-blue-200',
      actionHoverBg: 'group-hover:bg-blue-600 group-hover:text-white',
      featuresEn: ['Google SEO', 'AdSense Ready', 'Fast Articles'],
      featuresBn: ['গুগল এসইও', 'এডসেন্স রেডি', 'দ্রুত আর্টিকেল'],
      startingPrice: '৳১,৯৯০',
      demandTier: 'growing',
      demandBadgeEn: '📈 Growing Demand',
      demandBadgeBn: '📈 ক্রমবর্ধমান চাহিদা',
      demandBadgeBg: 'bg-blue-100 text-blue-800 border-blue-200 shadow-2xs',
      demandHighlightEn: 'Steady traffic • Fast Google indexing & AdSense income',
      demandHighlightBn: 'গ্রোথ ও রেভিনিউ চাহিদা • দ্রুত গুগল র‍্যাংক ও অটো অ্যাডসেন্স'
    },
    {
      id: 'grocery',
      serial: '04',
      code: '#4150',
      nameEn: 'Grocery & Supermarket',
      nameBn: 'মুদি ও সুপারশপ',
      descEn: 'Daily essentials • Weight-based catalog & express order',
      descBn: 'নিত্যপ্রয়োজনীয় মুদি • ওজন অনুযায়ী পণ্য ও ইনস্ট্যান্ট অর্ডার',
      tagEn: '🌿 Fresh',
      tagBn: '🌿 ন্যাচারাল',
      demoId: 'groc-1',
      icon: Store,
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20',
      iconColor: 'text-emerald-600',
      cardBg: 'bg-gradient-to-br from-emerald-100/80 via-teal-50/50 to-white border-emerald-200/90',
      cardBorderHover: 'hover:border-emerald-400',
      hoverShadow: 'hover:shadow-[0_10px_30px_rgba(16,185,129,0.12)]',
      badgeBg: 'bg-emerald-100/90',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-200',
      actionHoverBg: 'group-hover:bg-emerald-600 group-hover:text-white',
      featuresEn: ['Weight Catalog', 'Local Express', 'Instant Reorder'],
      featuresBn: ['ওজন ক্যাটালগ', 'দ্রুত ডেলিভারি', 'সহজ রি-অর্ডার'],
      startingPrice: '৳১,৯৯০',
      demandTier: 'basic',
      demandBadgeEn: '📦 Basic & Essential',
      demandBadgeBn: '📦 বেসিক ও এসেনশিয়াল',
      demandBadgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-2xs',
      demandHighlightEn: 'Essential daily need • Weight-based catalog & express order',
      demandHighlightBn: 'নিত্যপ্রয়োজনীয় বেসিক • ওজনভিত্তিক পণ্য ও এক্সপ্রেস ডেলিভারি'
    }
  ];

  // Dynamic state for custom uploaded websites from admin panel
  const [customWebsites, setCustomWebsites] = useState<WebsiteDemo[]>(() => {
    try {
      const stored = localStorage.getItem('bongoweb_custom_websites') || localStorage.getItem('bongoweb_custom_catalog');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    // 1. Fetch latest catalog
    apiGetWebsites()
      .then(sites => {
        if (Array.isArray(sites)) setCustomWebsites(sites);
      })
      .catch(() => {});

    // 2. Listen to real-time custom website updates from admin upload
    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCustomWebsites(e.detail);
      } else {
        try {
          const stored = localStorage.getItem('bongoweb_custom_websites') || localStorage.getItem('bongoweb_custom_catalog');
          if (stored) setCustomWebsites(JSON.parse(stored));
        } catch (_) {}
      }
    };

    window.addEventListener('bongoweb_websites_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('bongoweb_websites_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const allAvailableWebsites = [...WEBSITE_DEMOS, ...customWebsites];

  // Resolve matching WebsiteDemo for each category
  const resolveDemoForCategory = (item: CategoryContactItem): WebsiteDemo => {
    const found = allAvailableWebsites.find(
      d => d.id === item.demoId || d.category === item.id || d.fourDigitCode.replace('#', '') === item.code.replace('#', '')
    );
    return found || allAvailableWebsites[0];
  };

  // When clicking this category -> navigate to see all websites for that specific category
  const handleSelectCategory = (item: CategoryContactItem) => {
    if (onSelectCategoryWebsites) {
      onSelectCategoryWebsites(item.id);
    } else {
      const demo = resolveDemoForCategory(item);
      onOpenOrder(demo);
    }
  };

  return (
    <div 
      className="w-full h-[calc(100dvh-4rem-4rem)] sm:h-[calc(100vh-4.25rem-4.5rem)] max-h-[calc(100dvh-4rem-4rem)] sm:max-h-[calc(100vh-4.25rem-4.5rem)] lg:h-auto lg:min-h-[calc(100vh-4.75rem)] lg:max-h-none overflow-hidden lg:overflow-visible flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-4 lg:py-8 select-none bg-[#F1F5F9] text-slate-900 font-sans"
    >
      {/* Main Targeted Section (section:nth-of-type(1)) */}
      <section className="max-w-2xl sm:max-w-3xl lg:max-w-6xl xl:max-w-7xl w-full mx-auto h-full lg:h-auto my-auto flex flex-col justify-between lg:justify-center py-1 sm:py-2.5 lg:py-0 lg:gap-6 xl:gap-8">
        
        {/* Simple Minimal Header */}
        <header className="shrink-0 text-center py-1 sm:py-2">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'en' ? 'Select Category' : 'ক্যাটাগরি বেছে নিন'}
          </h1>
        </header>

        {/* 1. Mobile Category Grid: 2×2 Grid of Equal Square Cards (Mobile Only: < lg) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 my-auto w-full py-1 min-h-0 lg:hidden">
          {categoryContacts.map((cat) => {
            const IconComponent = cat.icon;
            const shortSubBn = 
              cat.id === 'ecommerce' ? 'অনলাইন শপ ও বিকাশ' :
              cat.id === 'restaurant' ? 'ফুড মেনু ও বুকিং' :
              cat.id === 'blogging' ? 'নিউজ ও এডসেন্স' :
              'মুদি ও হোম ডেলিভারি';
            const shortSubEn = 
              cat.id === 'ecommerce' ? 'Online Shop & bKash' :
              cat.id === 'restaurant' ? 'Food Menu & Orders' :
              cat.id === 'blogging' ? 'News & AdSense' :
              'Grocery & Express Delivery';

            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectCategory(cat)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectCategory(cat);
                  }
                }}
                aria-label={`Select ${language === 'en' ? cat.nameEn : cat.nameBn}`}
                className={`group w-full aspect-square p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl ${cat.cardBg} border ${cat.cardBorderHover} shadow-xs ${cat.hoverShadow} transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-purple-400 relative overflow-hidden`}
              >
                {/* Top Row: Category Icon & Visual Tag */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${cat.iconBg} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                    <IconComponent className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-slate-700 border border-slate-200/90 shadow-2xs truncate max-w-[55%]">
                    {language === 'en' ? cat.tagEn : cat.tagBn}
                  </span>
                </div>

                {/* Center Content: Title & Clear Business Descriptor */}
                <div className="my-auto py-0.5 min-w-0">
                  <h2 className="text-[13px] sm:text-[15px] font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug tracking-tight truncate">
                    {language === 'en' ? cat.nameEn : cat.nameBn}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium mt-0.5 truncate leading-tight">
                    {language === 'en' ? shortSubEn : shortSubBn}
                  </p>
                </div>

                {/* Bottom Row: Starting Price & Explicit "ডেমো দেখুন" Button */}
                <div className="pt-1.5 sm:pt-2 border-t border-slate-200/70 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 block font-medium leading-none">
                      {language === 'en' ? 'Starts at' : 'শুরু মাত্র'}
                    </span>
                    <span className="text-[11.5px] sm:text-sm font-bold text-slate-900 mt-0.5 block leading-tight font-mono">
                      {cat.startingPrice}
                    </span>
                  </div>

                  <div className="px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg bg-white border border-slate-200 text-[10px] sm:text-[11px] font-bold text-purple-700 group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-200 shadow-2xs flex items-center gap-0.5 shrink-0">
                    <span>{language === 'en' ? 'Demos' : 'ডেমো'}</span>
                    <ChevronRight className="w-3 h-3 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Laptop / Desktop View: Clean, Informative 4-Card Deck (lg: & xl: screens) */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4 xl:gap-5 w-full">
          {categoryContacts.map((cat) => {
            const IconComponent = cat.icon;
            const features = language === 'en' ? cat.featuresEn : cat.featuresBn;

            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectCategory(cat)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectCategory(cat);
                  }
                }}
                aria-label={`Select ${language === 'en' ? cat.nameEn : cat.nameBn}`}
                className={`group w-full p-5 xl:p-6 rounded-2xl xl:rounded-3xl ${cat.cardBg} border ${cat.cardBorderHover} shadow-xs ${cat.hoverShadow} transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
              >
                <div>
                  {/* Top Row: Icon + Visual Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <div className={`w-12 h-12 xl:w-13 xl:h-13 rounded-2xl ${cat.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm`}>
                      <IconComponent className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-slate-700 border border-slate-200/90 shadow-2xs">
                      {language === 'en' ? cat.tagEn : cat.tagBn}
                    </span>
                  </div>

                  {/* Title & Clear Description */}
                  <div className="mt-4">
                    <h2 className="text-[17px] xl:text-[18px] font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug tracking-tight">
                      {language === 'en' ? cat.nameEn : cat.nameBn}
                    </h2>
                    <p className="text-xs xl:text-[13px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {language === 'en' ? cat.descEn : cat.descBn}
                    </p>
                  </div>

                  {/* Feature Tags: Instantly Understand Capabilities */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {features.slice(0, 3).map((feat, idx) => (
                      <span 
                        key={idx}
                        className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-white/90 text-slate-700 border border-slate-200/90"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Starting Price & Clear "ডেমো দেখুন" Button */}
                <div className="pt-4 mt-5 border-t border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-[9.5px] xl:text-[10px] text-slate-500 block font-medium leading-none">
                      {language === 'en' ? 'Starts at' : 'শুরু মাত্র'}
                    </span>
                    <span className="text-sm xl:text-base font-bold text-slate-900 mt-1 block leading-tight font-mono">
                      {cat.startingPrice}
                    </span>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-purple-700 group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <span>{language === 'en' ? 'View Demos' : 'ডেমো দেখুন'}</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean, Subtle Micro Footer */}
        <footer className="shrink-0 text-center py-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 shadow-2xs text-[11px] sm:text-xs lg:text-sm text-slate-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>
              {language === 'en' 
                ? 'Ready in 24h • Domain & Hosting Included • 100% Responsive' 
                : '২৪ ঘণ্টায় রেডি • ফ্রি ডোমেন ও হোস্টিং • ১০০% রেসপন্সিভ'}
            </span>
          </div>
        </footer>

      </section>
    </div>
  );
}
