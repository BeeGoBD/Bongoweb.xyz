import React from 'react';
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
}

export default function DashboardView({
  onOpenOrder,
  onSelectCategoryWebsites
}: DashboardViewProps) {
  const { language } = useLanguage();

  // Exactly four categories with rich bento visual design
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
      cardBorderHover: 'hover:border-blue-400',
      hoverShadow: 'hover:shadow-[0_12px_28px_rgba(37,99,235,0.12)]',
      badgeBg: 'bg-blue-100/90',
      badgeText: 'text-blue-700',
      badgeBorder: 'border-blue-200/80',
      actionHoverBg: 'group-hover:bg-blue-600 group-hover:text-white',
      featuresEn: ['bKash / Nagad', 'Courier Tracking', 'Cart & Stock'],
      featuresBn: ['বিকাশ/নগদ অটো', 'কুরিয়ার ট্র্যাকিং', 'স্টক ইনভেন্টরি'],
      startingPrice: '৳১,৯৯০'
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
      cardBorderHover: 'hover:border-orange-400',
      hoverShadow: 'hover:shadow-[0_12px_28px_rgba(234,88,12,0.12)]',
      badgeBg: 'bg-orange-100/90',
      badgeText: 'text-orange-700',
      badgeBorder: 'border-orange-200/80',
      actionHoverBg: 'group-hover:bg-orange-600 group-hover:text-white',
      featuresEn: ['Online Menu', 'Table Booking', 'Home Delivery'],
      featuresBn: ['ফুড মেনু', 'টেবিল বুকিং', 'হোম ডেলিভারি'],
      startingPrice: '৳১,৯৯০'
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
      cardBorderHover: 'hover:border-purple-400',
      hoverShadow: 'hover:shadow-[0_12px_28px_rgba(124,58,237,0.12)]',
      badgeBg: 'bg-purple-100/90',
      badgeText: 'text-purple-700',
      badgeBorder: 'border-purple-200/80',
      actionHoverBg: 'group-hover:bg-purple-600 group-hover:text-white',
      featuresEn: ['Google SEO', 'AdSense Ready', 'Fast Articles'],
      featuresBn: ['গুগল এসইও', 'এডসেন্স রেডি', 'দ্রুত আর্টিকেল'],
      startingPrice: '৳১,৯৯০'
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
      cardBorderHover: 'hover:border-emerald-400',
      hoverShadow: 'hover:shadow-[0_12px_28px_rgba(5,150,105,0.12)]',
      badgeBg: 'bg-emerald-100/90',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-200/80',
      actionHoverBg: 'group-hover:bg-emerald-600 group-hover:text-white',
      featuresEn: ['Weight Catalog', 'Local Express', 'Instant Reorder'],
      featuresBn: ['ওজন ক্যাটালগ', 'দ্রুত ডেলিভারি', 'সহজ রি-অর্ডার'],
      startingPrice: '৳১,৯৯০'
    }
  ];

  // Resolve matching WebsiteDemo for each category
  const resolveDemoForCategory = (item: CategoryContactItem): WebsiteDemo => {
    const found = WEBSITE_DEMOS.find(
      d => d.id === item.demoId || d.category === item.id || d.fourDigitCode.replace('#', '') === item.code.replace('#', '')
    );
    return found || WEBSITE_DEMOS[0];
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
            const demoCount = WEBSITE_DEMOS.filter(d => d.category === cat.id).length;

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
                className={`group w-full flex-1 min-h-[74px] sm:min-h-[84px] max-h-[105px] px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl bg-white border border-slate-200/90 ${cat.cardBorderHover} shadow-xs ${cat.hoverShadow} transition-all duration-200 cursor-pointer flex items-center justify-between gap-3.5 sm:gap-5 hover:-translate-y-0.5 active:translate-y-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
              >
                {/* Left: Clean Icon & Category Details */}
                <div className="flex items-center gap-3.5 sm:gap-4.5 min-w-0 flex-1">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${cat.iconBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-[15px] sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {language === 'en' ? cat.nameEn : cat.nameBn}
                      </h2>
                      <span className={`inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full ${cat.badgeBg} ${cat.badgeText} border ${cat.badgeBorder} shrink-0`}>
                        <span className="w-1 h-1 rounded-full bg-current opacity-70" />
                        <span>{demoCount} {language === 'en' ? 'Templates' : 'টেমপ্লেট'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Starting Price & Category Action Arrow */}
                <div className="shrink-0 flex items-center gap-3 sm:gap-4 pl-1">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium leading-none">
                      {language === 'en' ? 'Starts at' : 'শুরু মাত্র'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                      {cat.startingPrice}
                    </span>
                  </div>

                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100/90 border border-slate-200/60 flex items-center justify-center text-slate-500 ${cat.actionHoverBg} transition-all duration-200 shadow-2xs group-hover:scale-105`}>
                    <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
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
