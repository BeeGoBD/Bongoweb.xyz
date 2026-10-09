import React from 'react';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Newspaper, 
  Store, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { WebsiteCategory, WebsiteDemo } from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';
import { useLanguage } from '../utils/LanguageContext';

interface DashboardViewProps {
  initialCategory?: WebsiteCategory;
  onOpenLiveDemo?: (demo: WebsiteDemo) => void;
  onOpenOrder: (demo: WebsiteDemo) => void;
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
  avatarGradient: string;
  avatarShadow: string;
  cardBg: string;
  cardBorder: string;
  hoverBorder: string;
  hoverBg: string;
  hoverShadow: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  actionBg: string;
  actionHover: string;
  actionShadow: string;
}

export default function DashboardView({
  onOpenOrder
}: DashboardViewProps) {
  const { language } = useLanguage();

  // Exactly four categories in vertical serial order with rich, vibrant, modern color palettes
  const categoryContacts: CategoryContactItem[] = [
    {
      id: 'ecommerce',
      serial: '01',
      code: '#2085',
      nameEn: 'E-Commerce Store',
      nameBn: 'ই-কমার্স শপ',
      descEn: 'Online storefront • Automated checkout & courier tracking',
      descBn: 'অনলাইন শপ • অটো বিকাশ/নগদ পেমেন্ট ও রিয়েল-টাইম কুরিয়ার',
      tagEn: 'Popular',
      tagBn: 'জনপ্রিয়',
      demoId: 'ecom-1',
      icon: ShoppingBag,
      avatarGradient: 'bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white',
      avatarShadow: 'shadow-md shadow-blue-500/25',
      cardBg: 'bg-gradient-to-r from-blue-50/80 via-white to-blue-50/30',
      cardBorder: 'border-blue-200/90',
      hoverBorder: 'hover:border-[#2563EB]',
      hoverBg: 'hover:from-blue-100/70 hover:via-white hover:to-blue-50/60',
      hoverShadow: 'hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)]',
      accentText: 'group-hover:text-[#2563EB]',
      badgeBg: 'bg-blue-100/90',
      badgeText: 'text-[#1D4ED8]',
      badgeBorder: 'border-blue-200',
      actionBg: 'bg-[#2563EB] text-white',
      actionHover: 'group-hover:bg-[#1D4ED8]',
      actionShadow: 'shadow-sm shadow-blue-600/30'
    },
    {
      id: 'restaurant',
      serial: '02',
      code: '#1042',
      nameEn: 'Restaurant & Cafe',
      nameBn: 'রেস্তোরাঁ ও ক্যাফে',
      descEn: 'Food menu • Table reservation & online delivery ordering',
      descBn: 'ডিজিটাল ফুড মেনু • টেবিল বুকিং ও হোম ডেলিভারি সিস্টেম',
      tagEn: 'Trending',
      tagBn: 'ট্রেন্ডিং',
      demoId: 'rest-1',
      icon: UtensilsCrossed,
      avatarGradient: 'bg-gradient-to-tr from-[#EA580C] to-[#F97316] text-white',
      avatarShadow: 'shadow-md shadow-orange-500/25',
      cardBg: 'bg-gradient-to-r from-orange-50/80 via-white to-orange-50/30',
      cardBorder: 'border-orange-200/90',
      hoverBorder: 'hover:border-[#EA580C]',
      hoverBg: 'hover:from-orange-100/70 hover:via-white hover:to-orange-50/60',
      hoverShadow: 'hover:shadow-[0_8px_24px_rgba(234,88,12,0.12)]',
      accentText: 'group-hover:text-[#EA580C]',
      badgeBg: 'bg-orange-100/90',
      badgeText: 'text-[#C2410C]',
      badgeBorder: 'border-orange-200',
      actionBg: 'bg-[#EA580C] text-white',
      actionHover: 'group-hover:bg-[#C2410C]',
      actionShadow: 'shadow-sm shadow-orange-600/30'
    },
    {
      id: 'blogging',
      serial: '03',
      code: '#3091',
      nameEn: 'Blog & Media',
      nameBn: 'ব্লগ ও মিডিয়া',
      descEn: 'News & articles • Fast Google indexing & AdSense ready',
      descBn: 'নিউজ পোর্টাল • দ্রুত গুগল র‍্যাংকিং ও অটো এডসেন্স রেডি',
      tagEn: 'High Traffic',
      tagBn: 'হাই ট্রাফিক',
      demoId: 'blog-1',
      icon: Newspaper,
      avatarGradient: 'bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] text-white',
      avatarShadow: 'shadow-md shadow-purple-500/25',
      cardBg: 'bg-gradient-to-r from-purple-50/80 via-white to-purple-50/30',
      cardBorder: 'border-purple-200/90',
      hoverBorder: 'hover:border-[#7C3AED]',
      hoverBg: 'hover:from-purple-100/70 hover:via-white hover:to-purple-50/60',
      hoverShadow: 'hover:shadow-[0_8px_24px_rgba(124,58,237,0.12)]',
      accentText: 'group-hover:text-[#7C3AED]',
      badgeBg: 'bg-purple-100/90',
      badgeText: 'text-[#6D28D9]',
      badgeBorder: 'border-purple-200',
      actionBg: 'bg-[#7C3AED] text-white',
      actionHover: 'group-hover:bg-[#6D28D9]',
      actionShadow: 'shadow-sm shadow-purple-600/30'
    },
    {
      id: 'grocery',
      serial: '04',
      code: '#4150',
      nameEn: 'Grocery & Supermarket',
      nameBn: 'মুদি ও সুপারশপ',
      descEn: 'Daily essentials • Weight-based catalog & express order',
      descBn: 'নিত্যপ্রয়োজনীয় মুদি • ওজন অনুযায়ী পণ্য ও ইনস্ট্যান্ট অর্ডার',
      tagEn: 'Fresh',
      tagBn: 'ন্যাচারাল',
      demoId: 'groc-1',
      icon: Store,
      avatarGradient: 'bg-gradient-to-tr from-[#059669] to-[#10B981] text-white',
      avatarShadow: 'shadow-md shadow-emerald-500/25',
      cardBg: 'bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/30',
      cardBorder: 'border-emerald-200/90',
      hoverBorder: 'hover:border-[#059669]',
      hoverBg: 'hover:from-emerald-100/70 hover:via-white hover:to-emerald-50/60',
      hoverShadow: 'hover:shadow-[0_8px_24px_rgba(5,150,105,0.12)]',
      accentText: 'group-hover:text-[#059669]',
      badgeBg: 'bg-emerald-100/90',
      badgeText: 'text-[#047857]',
      badgeBorder: 'border-emerald-200',
      actionBg: 'bg-[#059669] text-white',
      actionHover: 'group-hover:bg-[#047857]',
      actionShadow: 'shadow-sm shadow-emerald-600/30'
    }
  ];

  // Resolve matching WebsiteDemo for each category
  const resolveDemoForCategory = (item: CategoryContactItem): WebsiteDemo => {
    const found = WEBSITE_DEMOS.find(
      d => d.id === item.demoId || d.category === item.id || d.fourDigitCode.replace('#', '') === item.code.replace('#', '')
    );
    return found || WEBSITE_DEMOS[0];
  };

  // Instant direct navigation to creation flow
  const handleSelectCategory = (item: CategoryContactItem) => {
    const demo = resolveDemoForCategory(item);
    onOpenOrder(demo);
  };

  return (
    <div 
      className="w-full h-[calc(100dvh-4rem-4rem)] sm:h-[calc(100vh-4.25rem-4.5rem)] max-h-[calc(100dvh-4rem-4rem)] sm:max-h-[calc(100vh-4.25rem-4.5rem)] overflow-hidden flex flex-col justify-between items-center px-4 sm:px-6 py-2.5 sm:py-4 select-none bg-gradient-to-b from-slate-50/80 via-white to-slate-100/60 font-sans"
    >
      {/* Main Targeted Section (section:nth-of-type(1)) */}
      <section className="max-w-xl w-full mx-auto h-full flex flex-col justify-between py-1 sm:py-2">
        
        {/* Vibrant & Clean Header */}
        <header className="shrink-0 text-center pt-0.5 pb-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-[11px] sm:text-xs font-semibold shadow-md shadow-purple-500/25 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>{language === 'en' ? 'Choose Your Platform' : 'ক্যাটাগরি পছন্দ করুন'}</span>
            <Zap className="w-3 h-3 text-white/90" />
          </div>
          <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {language === 'en' ? 'Website Categories' : 'ক্যাটাগরি নির্বাচন করুন'}
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-600 font-medium mt-0.5">
            {language === 'en' 
              ? 'Tap any category below to instantly start your website' 
              : 'যেকোনো ক্যাটাগরিতে ট্যাপ করে সাথে সাথে ওয়েবসাইট তৈরি করুন'}
          </p>
        </header>

        {/* Colorful Vertical Sequential Contact-Style List (Zero Scrolling) */}
        <div className="flex-1 flex flex-col justify-center gap-2.5 sm:gap-3.5 my-auto w-full">
          {categoryContacts.map((cat) => {
            const IconComponent = cat.icon;

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
                className={`group relative w-full h-[66px] sm:h-[74px] px-3.5 sm:px-4 rounded-xl sm:rounded-2xl ${cat.cardBg} ${cat.hoverBg} border-2 ${cat.cardBorder} ${cat.hoverBorder} shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${cat.hoverShadow} transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 sm:gap-4 hover:scale-[1.01] active:scale-[0.99] outline-none focus-visible:ring-2`}
              >
                {/* Left: Colorful Contact Avatar & Information */}
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                  {/* Vibrant Gradient Contact-Style Avatar */}
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${cat.avatarGradient} ${cat.avatarShadow} flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:rotate-1`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                  </div>

                  {/* Clean, Colorful Typography */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className={`text-[14px] sm:text-[15.5px] font-bold text-slate-900 ${cat.accentText} transition-colors truncate`}>
                        {language === 'en' ? cat.nameEn : cat.nameBn}
                      </h2>
                      <span className={`shrink-0 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${cat.badgeBg} ${cat.badgeText} border ${cat.badgeBorder}`}>
                        {language === 'en' ? cat.tagEn : cat.tagBn}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 font-medium truncate mt-0.5">
                      {language === 'en' ? cat.descEn : cat.descBn}
                    </p>
                  </div>
                </div>

                {/* Right: Vibrant Colored Action Button */}
                <div className="shrink-0 flex items-center pl-2">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${cat.actionBg} ${cat.actionHover} ${cat.actionShadow} flex items-center justify-center transition-all duration-200 group-hover:scale-110`}>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-200 group-hover:translate-x-0.5 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Colorful, Confident Micro Footer */}
        <footer className="shrink-0 text-center py-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-100/90 border border-slate-200 text-[11px] sm:text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
