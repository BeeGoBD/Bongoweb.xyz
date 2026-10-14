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
import Card3D from './Card3D';
import ThreeCanvas3D from './ThreeCanvas3D';

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
  card3d?: string;
  icon3d?: string;
  btn3d?: string;
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
      icon3d: 'bg-gradient-to-tr from-[#6B46C1] via-[#7C3AED] to-[#A855F7] text-white shadow-[0_3px_8px_rgba(124,58,237,0.25),inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.15)] border border-white/50',
      iconColor: 'text-purple-600',
      cardBg: 'bg-gradient-to-b from-white via-purple-50/70 to-purple-100/50',
      card3d: 'border border-purple-200 border-b-[2.5px] sm:border-b-[3px] border-b-purple-500/80 shadow-[0_4px_0_0_#C084FC,0_8px_16px_-3px_rgba(124,58,237,0.18)] hover:shadow-[0_6px_0_0_#C084FC,0_12px_20px_-4px_rgba(124,58,237,0.25)] active:translate-y-[2px] active:border-b-[1px] active:shadow-[0_1px_0_0_#C084FC,0_4px_8px_rgba(124,58,237,0.14)]',
      btn3d: 'border border-purple-200 border-b border-b-purple-400 text-purple-700 bg-white group-hover:bg-[#7C3AED] group-hover:text-white group-hover:border-b-purple-700 shadow-2xs active:border-b-0 active:translate-y-[1px]',
      cardBorderHover: 'hover:border-purple-400',
      hoverShadow: 'hover:shadow-[0_6px_20px_rgba(147,51,234,0.10)]',
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
      icon3d: 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-[0_3px_8px_rgba(245,158,11,0.25),inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.15)] border border-white/50',
      iconColor: 'text-amber-600',
      cardBg: 'bg-gradient-to-b from-white via-amber-50/70 to-amber-100/50',
      card3d: 'border border-amber-200 border-b-[2.5px] sm:border-b-[3px] border-b-amber-500/80 shadow-[0_4px_0_0_#FBBF24,0_8px_16px_-3px_rgba(245,158,11,0.18)] hover:shadow-[0_6px_0_0_#FBBF24,0_12px_20px_-4px_rgba(245,158,11,0.25)] active:translate-y-[2px] active:border-b-[1px] active:shadow-[0_1px_0_0_#FBBF24,0_4px_8px_rgba(245,158,11,0.14)]',
      btn3d: 'border border-amber-200 border-b border-b-amber-400 text-amber-700 bg-white group-hover:bg-amber-600 group-hover:text-white group-hover:border-b-amber-700 shadow-2xs active:border-b-0 active:translate-y-[1px]',
      cardBorderHover: 'hover:border-amber-400',
      hoverShadow: 'hover:shadow-[0_6px_20px_rgba(245,158,11,0.10)]',
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
      icon3d: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_3px_8px_rgba(59,130,246,0.25),inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.15)] border border-white/50',
      iconColor: 'text-blue-600',
      cardBg: 'bg-gradient-to-b from-white via-blue-50/70 to-indigo-100/50',
      card3d: 'border border-blue-200 border-b-[2.5px] sm:border-b-[3px] border-b-blue-500/80 shadow-[0_4px_0_0_#60A5FA,0_8px_16px_-3px_rgba(59,130,246,0.18)] hover:shadow-[0_6px_0_0_#60A5FA,0_12px_20px_-4px_rgba(59,130,246,0.25)] active:translate-y-[2px] active:border-b-[1px] active:shadow-[0_1px_0_0_#60A5FA,0_4px_8px_rgba(59,130,246,0.14)]',
      btn3d: 'border border-blue-200 border-b border-b-blue-400 text-blue-700 bg-white group-hover:bg-blue-600 group-hover:text-white group-hover:border-b-blue-700 shadow-2xs active:border-b-0 active:translate-y-[1px]',
      cardBorderHover: 'hover:border-blue-400',
      hoverShadow: 'hover:shadow-[0_6px_20px_rgba(59,130,246,0.10)]',
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
      icon3d: 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-[0_3px_8px_rgba(16,185,129,0.25),inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-1px_1px_rgba(0,0,0,0.15)] border border-white/50',
      iconColor: 'text-emerald-600',
      cardBg: 'bg-gradient-to-b from-white via-emerald-50/70 to-emerald-100/50',
      card3d: 'border border-emerald-200 border-b-[2.5px] sm:border-b-[3px] border-b-emerald-500/80 shadow-[0_4px_0_0_#34D399,0_8px_16px_-3px_rgba(16,185,129,0.18)] hover:shadow-[0_6px_0_0_#34D399,0_12px_20px_-4px_rgba(16,185,129,0.25)] active:translate-y-[2px] active:border-b-[1px] active:shadow-[0_1px_0_0_#34D399,0_4px_8px_rgba(16,185,129,0.14)]',
      btn3d: 'border border-emerald-200 border-b border-b-emerald-400 text-emerald-700 bg-white group-hover:bg-emerald-600 group-hover:text-white group-hover:border-b-emerald-700 shadow-2xs active:border-b-0 active:translate-y-[1px]',
      cardBorderHover: 'hover:border-emerald-400',
      hoverShadow: 'hover:shadow-[0_6px_20px_rgba(16,185,129,0.10)]',
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
      id="dashboard-view"
      data-view="dashboard"
      className="relative w-full h-[calc(100dvh-4rem-4rem)] sm:h-[calc(100vh-4.25rem-4.5rem)] max-h-[calc(100dvh-4rem-4rem)] sm:max-h-[calc(100vh-4.25rem-4.5rem)] lg:h-auto lg:min-h-[calc(100vh-4.75rem)] lg:max-h-none overflow-hidden lg:overflow-visible flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-4 lg:py-8 select-none bg-slate-50/70 text-slate-900 font-sans perspective-1500"
    >
      {/* 3D Interactive Three.js WebGL Universe in Background */}
      <ThreeCanvas3D intensity={1.1} />

      {/* Main Targeted Section (section:nth-of-type(1)) */}
      <section className="max-w-2xl sm:max-w-3xl lg:max-w-6xl xl:max-w-7xl w-full mx-auto h-full lg:h-auto my-auto flex flex-col justify-between lg:justify-center py-1 sm:py-2.5 lg:py-0 lg:gap-6 xl:gap-8 preserve-3d">
        
        {/* Simple 3D Dashboard Header */}
        <header className="shrink-0 text-center py-1 sm:py-2 preserve-3d">
          <div className="inline-block translate-z-sm">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
              {language === 'en' ? 'Select Your Business Category' : 'আপনার ব্যবসার ক্যাটাগরি বেছে নিন'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto translate-z-xs font-medium">
            {language === 'en' 
              ? 'Click any 3D category card to explore live website demos' 
              : 'যেকোনো ক্যাটাগরিতে ক্লিক করে সরাসরি লাইভ ওয়েবসাইট ডেমো দেখুন'}
          </p>
        </header>

        {/* 1. Mobile Category Grid: 2×2 3D Grid of Cards (Mobile Only: < lg) */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 my-auto w-full py-2 min-h-0 lg:hidden perspective-1000 preserve-3d">
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
              <Card3D
                key={cat.id}
                maxTilt={6}
                scale={1.015}
                onClick={() => handleSelectCategory(cat)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${language === 'en' ? cat.nameEn : cat.nameBn}`}
                className={`group w-full aspect-square p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl ${cat.cardBg} ${cat.card3d} cursor-pointer flex flex-col justify-between outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
              >
                {/* Top Row: 3D Category Icon & Visual Tag */}
                <div className="flex items-start justify-between gap-1.5 translate-z-sm">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${cat.icon3d} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm`}>
                    <IconComponent className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 stroke-[2]" />
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

                {/* Bottom Row: Starting Price & 3D "ডেমো" Button */}
                <div className="pt-1.5 sm:pt-2 border-t border-slate-200/80 flex items-center justify-between gap-1 translate-z-xs">
                  <div>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 block font-medium leading-none">
                      {language === 'en' ? 'Starts at' : 'শুরু মাত্র'}
                    </span>
                    <span className="text-[11.5px] sm:text-sm font-bold text-slate-900 mt-0.5 block leading-tight font-mono">
                      {cat.startingPrice}
                    </span>
                  </div>

                  <div className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg ${cat.btn3d} text-[10px] sm:text-[11px] font-bold transition-all duration-200 flex items-center gap-0.5 shrink-0 btn-3d-tactile`}>
                    <span>{language === 'en' ? 'Demos' : 'ডেমো'}</span>
                    <ChevronRight className="w-3 h-3 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        {/* 2. Laptop / Desktop View: 3D 4-Card Deck with Mouse Tilt Physics (lg: & xl: screens) */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5 xl:gap-6 w-full py-2 perspective-1000 preserve-3d">
          {categoryContacts.map((cat) => {
            const IconComponent = cat.icon;
            const features = language === 'en' ? cat.featuresEn : cat.featuresBn;

            return (
              <Card3D
                key={cat.id}
                maxTilt={7}
                scale={1.018}
                onClick={() => handleSelectCategory(cat)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${language === 'en' ? cat.nameEn : cat.nameBn}`}
                className={`group w-full p-5 xl:p-6 rounded-2xl xl:rounded-3xl ${cat.cardBg} ${cat.card3d} cursor-pointer flex flex-col justify-between outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
              >
                <div>
                  {/* Top Row: 3D Elevated Icon + Visual Tag */}
                  <div className="flex items-center justify-between gap-2 translate-z-lg">
                    <div className={`w-12 h-12 xl:w-13 xl:h-13 rounded-2xl ${cat.icon3d} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-lg`}>
                      <IconComponent className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-slate-700 border border-slate-200/90 shadow-2xs translate-z-sm">
                      {language === 'en' ? cat.tagEn : cat.tagBn}
                    </span>
                  </div>

                  {/* Title & Clear Description with 3D Depth */}
                  <div className="mt-4 translate-z-md">
                    <h2 className="text-[17px] xl:text-[18px] font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug tracking-tight">
                      {language === 'en' ? cat.nameEn : cat.nameBn}
                    </h2>
                    <p className="text-xs xl:text-[13px] text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {language === 'en' ? cat.descEn : cat.descBn}
                    </p>
                  </div>

                  {/* Feature Tags with Subtle Elevation */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5 translate-z-sm">
                    {features.slice(0, 3).map((feat, idx) => (
                      <span 
                        key={idx}
                        className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-white/95 text-slate-700 border border-slate-200/90 shadow-2xs"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Starting Price & 3D View Demos Button */}
                <div className="pt-4 mt-5 border-t border-slate-200/70 flex items-center justify-between translate-z-lg">
                  <div>
                    <span className="text-[9.5px] xl:text-[10px] text-slate-500 block font-medium leading-none">
                      {language === 'en' ? 'Starts at' : 'শুরু মাত্র'}
                    </span>
                    <span className="text-sm xl:text-base font-bold text-slate-900 mt-1 block leading-tight font-mono">
                      {cat.startingPrice}
                    </span>
                  </div>

                  <div className={`px-3.5 py-1.5 rounded-xl ${cat.btn3d} text-xs font-bold flex items-center gap-1.5 transition-all duration-200 btn-3d-tactile`}>
                    <span>{language === 'en' ? 'View Demos' : 'ডেমো দেখুন'}</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        {/* Clean, Subtle Micro Footer */}
        <footer className="shrink-0 text-center py-1 preserve-3d">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 shadow-[0_3px_0_0_#CBD5E1,0_6px_12px_rgba(0,0,0,0.05)] text-[11px] sm:text-xs lg:text-sm text-slate-700 font-medium translate-z-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-xs" />
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
