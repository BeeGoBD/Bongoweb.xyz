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
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20',
      iconColor: 'text-blue-600',
      cardBg: 'bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/30',
      cardBorderHover: 'hover:border-rose-400/90',
      hoverShadow: 'hover:shadow-[0_12px_28px_rgba(225,29,72,0.12)]',
      badgeBg: 'bg-rose-100/90',
      badgeText: 'text-rose-700',
      badgeBorder: 'border-rose-200/80',
      actionHoverBg: 'group-hover:bg-blue-600 group-hover:text-white',
      featuresEn: ['bKash / Nagad', 'Courier Tracking', 'Cart & Stock'],
      featuresBn: ['বিকাশ/নগদ অটো', 'কুরিয়ার ট্র্যাকিং', 'স্টক ইনভেন্টরি'],
      startingPrice: '৳১,৯৯০',
      // #1 Top demand: highest converting store
      demandTier: 'most-demanded',
      demandBadgeEn: '🔥 Most Demanding',
      demandBadgeBn: '🔥 সর্বোচ্চ চাহিদা',
      demandBadgeBg: 'bg-rose-50 text-rose-700 border-rose-200/90 shadow-2xs',
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
      iconBg: 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20',
      iconColor: 'text-orange-600',
      cardBg: 'bg-gradient-to-br from-orange-50/60 via-white to-amber-50/30',
      cardBorderHover: 'hover:border-amber-400/90',
      hoverShadow: 'hover:shadow-[0_12px_28px_rgba(217,119,6,0.12)]',
      badgeBg: 'bg-amber-100/90',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-200/80',
      actionHoverBg: 'group-hover:bg-orange-600 group-hover:text-white',
      featuresEn: ['Online Menu', 'Table Booking', 'Home Delivery'],
      featuresBn: ['ফুড মেনু', 'টেবিল বুকিং', 'হোম ডেলিভারি'],
      startingPrice: '৳১,৯৯০',
      // High demand: continuous food orders & dining
      demandTier: 'high-demand',
      demandBadgeEn: '⚡ High Demand',
      demandBadgeBn: '⚡ ব্যাপক চাহিদা',
      demandBadgeBg: 'bg-amber-50 text-amber-800 border-amber-200/90 shadow-2xs',
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
      iconBg: 'bg-gradient-to-tr from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/20',
      iconColor: 'text-purple-600',
      cardBg: 'bg-gradient-to-br from-purple-50/60 via-white to-violet-50/30',
      cardBorderHover: 'hover:border-purple-400/90',
      hoverShadow: 'hover:shadow-[0_12px_28px_rgba(124,58,237,0.12)]',
      badgeBg: 'bg-purple-100/90',
      badgeText: 'text-purple-700',
      badgeBorder: 'border-purple-200/80',
      actionHoverBg: 'group-hover:bg-purple-600 group-hover:text-white',
      featuresEn: ['Google SEO', 'AdSense Ready', 'Fast Articles'],
      featuresBn: ['গুগল এসইও', 'এডসেন্স রেডি', 'দ্রুত আর্টিকেল'],
      startingPrice: '৳১,৯৯০',
      // Growing demand: traffic & monetization
      demandTier: 'growing',
      demandBadgeEn: '📈 Growing Demand',
      demandBadgeBn: '📈 ক্রমবর্ধমান চাহিদা',
      demandBadgeBg: 'bg-purple-50 text-purple-700 border-purple-200/90 shadow-2xs',
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
      cardBg: 'bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/30',
      cardBorderHover: 'hover:border-emerald-400/90',
      hoverShadow: 'hover:shadow-[0_12px_28px_rgba(5,150,105,0.12)]',
      badgeBg: 'bg-emerald-100/90',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200/80',
      actionHoverBg: 'group-hover:bg-emerald-600 group-hover:text-white',
      featuresEn: ['Weight Catalog', 'Local Express', 'Instant Reorder'],
      featuresBn: ['ওজন ক্যাটালগ', 'দ্রুত ডেলিভারি', 'সহজ রি-অর্ডার'],
      startingPrice: '৳১,৯৯০',
      // Basic / Essential category: everyday foundational needs
      demandTier: 'basic',
      demandBadgeEn: '📦 Basic & Essential',
      demandBadgeBn: '📦 বেসিক ও এসেনশিয়াল',
      demandBadgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 shadow-2xs',
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
      className="w-full h-[calc(100dvh-4rem-4rem)] sm:h-[calc(100vh-4.25rem-4.5rem)] max-h-[calc(100dvh-4rem-4rem)] sm:max-h-[calc(100vh-4.25rem-4.5rem)] overflow-hidden flex flex-col justify-between items-center px-4 sm:px-6 py-2.5 sm:py-4 select-none bg-gradient-to-b from-slate-50/80 via-white to-slate-100/60 font-sans"
    >
      {/* Main Targeted Section (section:nth-of-type(1)) */}
      <section className="max-w-2xl sm:max-w-3xl w-full mx-auto h-full flex flex-col justify-between py-1.5 sm:py-2.5">
        
        {/* Clean, Refined Header */}
        <header className="shrink-0 text-center pt-0.5 pb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold tracking-wide mb-1 border border-blue-100/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>{language === 'en' ? 'Interactive Demos' : 'লাইভ ওয়েবসাইট ডেমো'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'en' ? 'Website Categories' : 'ক্যাটাগরি নির্বাচন করুন'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en' 
              ? 'Choose a category to browse ready-to-launch website demos' 
              : 'সবগুলো লাইভ ওয়েবসাইট ডেমো দেখতে একটি ক্যাটাগরি বেছে নিন'}
          </p>
        </header>

        {/* Clean Category List (Polished, Balanced & Tactile) */}
        <div className="flex-1 flex flex-col justify-between gap-3 sm:gap-3.5 my-auto w-full py-1.5 min-h-0">
          {categoryContacts.map((cat) => {
            const IconComponent = cat.icon;
            const demoCount = allAvailableWebsites.filter(d => 
              d.category === cat.id || 
              (cat.id === 'blogging' && ((d.category as string) === 'newspaper' || d.category === 'blogging'))
            ).length;

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
                className={`group w-full flex-1 min-h-[74px] sm:min-h-[82px] max-h-[100px] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200/90 ${cat.cardBorderHover} shadow-xs ${cat.hoverShadow} transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 sm:gap-4 hover:-translate-y-0.5 active:translate-y-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
              >
                {/* Left: Clean Icon & Perfectly Aligned 2-Row Category Hierarchy */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${cat.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  </div>

                  {/* Centered Structured Content: Guaranteed Identical Vertical Placement */}
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    {/* Row 1: Category Name + Demand Pill (Strictly Inline, Never Wraps) */}
                    <div className="flex items-center gap-2 min-w-0">
                      <h2 className="text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">
                        {language === 'en' ? cat.nameEn : cat.nameBn}
                      </h2>
                      <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[10.5px] font-bold px-2 py-0.5 rounded-full border shrink-0 leading-none ${cat.demandBadgeBg}`}>
                        <span>{language === 'en' ? cat.demandBadgeEn : cat.demandBadgeBn}</span>
                      </span>
                    </div>

                    {/* Row 2: Highlighting Text Section for Category Demand & Purpose */}
                    <div className="flex items-center gap-2 mt-1 min-w-0">
                      <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 truncate min-w-0 leading-tight">
                        {language === 'en' ? cat.demandHighlightEn : cat.demandHighlightBn}
                      </p>
                      <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-400 shrink-0">
                        <span>{demoCount}</span>
                        <span>{language === 'en' ? 'Templates' : 'টেমপ্লেট'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Starting Price & Category Action Arrow */}
                <div className="shrink-0 flex items-center gap-2.5 sm:gap-3.5 pl-1">
                  <div className="text-right">
                    <span className="text-[9.5px] sm:text-[10px] text-slate-400 block font-medium leading-none">
                      {language === 'en' ? 'Starts at' : 'শুরু মাত্র'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block leading-tight">
                      {cat.startingPrice}
                    </span>
                  </div>

                  <div className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-slate-100/90 border border-slate-200/60 flex items-center justify-center text-slate-500 ${cat.actionHoverBg} transition-all duration-200 shadow-2xs group-hover:scale-105`}>
                    <ChevronRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean, Subtle Micro Footer */}
        <footer className="shrink-0 text-center py-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-2xs text-[11px] sm:text-xs text-slate-600 font-medium">
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
