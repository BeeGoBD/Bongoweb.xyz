import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Newspaper, 
  Store, 
  ChevronRight,
  ShieldCheck,
  Sparkles
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
  iconGlow: string;
  featuresEn: string[];
  featuresBn: string[];
  startingPrice: string;
  demandTier: 'most-demanded' | 'high-demand' | 'growing' | 'basic';
  demandBadgeEn: string;
  demandBadgeBn: string;
}

export default function DashboardView({
  onOpenOrder,
  onSelectCategoryWebsites
}: DashboardViewProps) {
  const { language } = useLanguage();

  // Exactly four categories with 21st.dev luxury dark styling & market demand tiers
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
      iconGlow: 'bg-[#3b5bff]/15 text-[#3b5bff] border border-[#3b5bff]/30 shadow-[0_0_20px_rgba(59,91,255,0.25)]',
      featuresEn: ['bKash / Nagad', 'Courier Tracking', 'Cart & Stock'],
      featuresBn: ['বিকাশ/নগদ অটো', 'কুরিয়ার ট্র্যাকিং', 'স্টক ইনভেন্টরি'],
      startingPrice: '৳১,৯৯০',
      demandTier: 'most-demanded',
      demandBadgeEn: 'Most Demanding',
      demandBadgeBn: 'সর্বোচ্চ চাহিদা'
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
      iconGlow: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      featuresEn: ['Online Menu', 'Table Booking', 'Home Delivery'],
      featuresBn: ['ফুড মেনু', 'টেবিল বুকিং', 'হোম ডেলিভারি'],
      startingPrice: '৳১,৯৯০',
      demandTier: 'high-demand',
      demandBadgeEn: 'High Demand',
      demandBadgeBn: 'ব্যাপক চাহিদা'
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
      iconGlow: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]',
      featuresEn: ['Google SEO', 'AdSense Ready', 'Fast Articles'],
      featuresBn: ['গুগল এসইও', 'এডসেন্স রেডি', 'দ্রুত আর্টিকেল'],
      startingPrice: '৳১,৯৯০',
      demandTier: 'growing',
      demandBadgeEn: 'Growing Demand',
      demandBadgeBn: 'ক্রমবর্ধমান চাহিদা'
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
      iconGlow: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      featuresEn: ['Weight Catalog', 'Local Express', 'Instant Reorder'],
      featuresBn: ['ওজন ক্যাটালগ', 'দ্রুত ডেলিভারি', 'সহজ রি-অর্ডার'],
      startingPrice: '৳১,৯৯০',
      demandTier: 'basic',
      demandBadgeEn: 'Basic & Essential',
      demandBadgeBn: 'বেসিক ও এসেনশিয়াল'
    }
  ];

  // Dynamic state for custom uploaded websites from admin panel / cloud vault
  const [customWebsites, setCustomWebsites] = useState<WebsiteDemo[]>(() => {
    try {
      const stored = localStorage.getItem('bongoweb_custom_websites') || localStorage.getItem('bongoweb_custom_catalog');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    apiGetWebsites()
      .then(sites => {
        if (Array.isArray(sites)) setCustomWebsites(sites);
      })
      .catch(() => {});

    const handleCustomUpdated = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setCustomWebsites(e.detail);
      } else {
        try {
          const stored = localStorage.getItem('bongoweb_custom_websites') || localStorage.getItem('bongoweb_custom_catalog');
          if (stored) setCustomWebsites(JSON.parse(stored));
        } catch (_) {}
      }
    };

    window.addEventListener('bongoweb_websites_updated', handleCustomUpdated);
    window.addEventListener('bongoweb_custom_websites_updated', handleCustomUpdated);
    window.addEventListener('storage', handleCustomUpdated);
    return () => {
      window.removeEventListener('bongoweb_websites_updated', handleCustomUpdated);
      window.removeEventListener('bongoweb_custom_websites_updated', handleCustomUpdated);
      window.removeEventListener('storage', handleCustomUpdated);
    };
  }, []);

  const allAvailableWebsites = React.useMemo(() => {
    const map = new Map<string, WebsiteDemo>();
    WEBSITE_DEMOS.forEach(d => {
      const codeKey = String(d.fourDigitCode || d.id).replace('#', '').trim().toLowerCase();
      map.set(codeKey, d);
    });
    customWebsites.forEach(cw => {
      const codeKey = String(cw.fourDigitCode || cw.id).replace('#', '').trim().toLowerCase();
      const existing = map.get(codeKey);
      if (existing) {
        map.set(codeKey, { ...existing, ...cw });
      } else {
        map.set(codeKey, cw);
      }
    });
    return Array.from(map.values());
  }, [customWebsites]);

  const resolveDemoForCategory = (item: CategoryContactItem): WebsiteDemo => {
    const cleanCode = item.code.replace('#', '').trim().toLowerCase();
    const found = allAvailableWebsites.find(
      (d) => String(d.fourDigitCode || '').replace('#', '').trim().toLowerCase() === cleanCode || d.category === item.id
    );
    return found || allAvailableWebsites[0];
  };

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
      className="relative w-full min-h-[calc(100vh-4.5rem)] flex flex-col justify-between items-center px-3 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10 select-none bg-[#09090b] text-[#f5f5f7] font-sans"
    >
      {/* 3D Atmospheric Background */}
      <ThreeCanvas3D intensity={1.0} />

      {/* Atmospheric Radial Gradient Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[420px] radial-hero-glow -z-5" 
      />

      <section className="max-w-5xl xl:max-w-6xl w-full mx-auto my-auto flex flex-col justify-center gap-6 sm:gap-9">
        
        {/* Centered 21st.dev Hero Header */}
        <header className="text-center max-w-3xl mx-auto flex flex-col items-center">
          {/* Subtle status kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] sm:text-xs text-[#a1a1b0] mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b5bff] animate-pulse" />
            <span>
              {language === 'en' ? 'Verified Ready-to-Launch Websites' : 'ভেরিফাইড লাইভ ওয়েবসাইট প্ল্যাটফর্ম'}
            </span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-[26px] xs:text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-[#f5f5f7] tracking-tight leading-[1.14]">
            {language === 'en' ? (
              <>
                Select Your Business <span className="text-[#3b5bff] italic font-serif">Category</span>
              </>
            ) : (
              <>
                আপনার ব্যবসার <span className="text-[#3b5bff] italic font-serif">ক্যাটাগরি</span> বেছে নিন
              </>
            )}
          </h1>

          {/* Short supporting line */}
          <p className="text-xs sm:text-base text-[#a1a1b0] mt-2 sm:mt-3.5 max-w-xl mx-auto font-normal leading-relaxed px-2">
            {language === 'en' 
              ? 'Ready in 24 hours with custom domain, automated bKash/Nagad checkout & dedicated 24/7 support.' 
              : '২৪ ঘণ্টার মধ্যে নিজস্ব ডোমেন, বিকাশ অটো পেমেন্ট ও সার্বক্ষণিক সাপোর্ট সহ সম্পূর্ণ রেডি ওয়েবসাইট সমাধান।'}
          </p>
        </header>

        {/* 4 Floating Dark Cards: STRICT 2 SECTION UP AND 2 DOWN LAYOUT (2x2 Grid) */}
        {/* Row 1: E-Commerce Store & Restaurant & Cafe */}
        {/* Row 2: Blog & Media & Grocery & Supermarket */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6 w-full max-w-4xl mx-auto">
          {categoryContacts.map((cat) => {
            const IconComponent = cat.icon;
            const features = language === 'en' ? cat.featuresEn : cat.featuresBn;
            const liveDemo = resolveDemoForCategory(cat);
            const dynamicPrice = liveDemo?.priceTag || cat.startingPrice;

            return (
              <Card3D
                key={cat.id}
                maxTilt={5}
                scale={1.015}
                onClick={() => handleSelectCategory(cat)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${language === 'en' ? cat.nameEn : cat.nameBn}`}
                className="group w-full p-3.5 xs:p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0e0e12]/95 backdrop-blur-md border border-white/[0.08] hover:border-[#3b5bff]/40 shadow-dark-card hover:shadow-dark-card-hover cursor-pointer flex flex-col justify-between transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#3b5bff]"
              >
                <div>
                  {/* Top Row: Elevated Glowing Icon + Status Badge */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2.5 sm:mb-4">
                    <div className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl ${cat.iconGlow} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                      <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2]" />
                    </div>

                    <span className="text-[10px] sm:text-[11px] font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/[0.05] text-[#a1a1b0] border border-white/[0.08] flex items-center gap-1 sm:gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b5bff] animate-pulse" />
                      <span>{language === 'en' ? cat.tagEn : cat.tagBn}</span>
                    </span>
                  </div>

                  {/* Dual Titles: Large English + Bangla */}
                  <div>
                    <h2 className="text-xs xs:text-sm sm:text-lg font-semibold text-[#f5f5f7] group-hover:text-white transition-colors leading-snug tracking-tight">
                      {cat.nameEn}
                    </h2>
                    <span className="text-[11px] sm:text-sm font-medium text-[#3b5bff] block mt-0.5 mb-1 sm:mb-1.5">
                      {cat.nameBn}
                    </span>
                    <p className="text-[10px] sm:text-[13px] text-[#a1a1b0] leading-relaxed line-clamp-2 font-normal">
                      {language === 'en' ? cat.descEn : cat.descBn}
                    </p>
                  </div>

                  {/* Feature Metadata Pills */}
                  <div className="hidden sm:flex flex-wrap gap-1.5 mt-3 sm:mt-4">
                    {features.map((feat, idx) => (
                      <span 
                        key={idx}
                        className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-white/[0.03] text-[#a1a1b0] border border-white/[0.06]"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Starting Price & Primary CTA Button */}
                <div className="pt-2.5 sm:pt-4 mt-3 sm:mt-5 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-[#71717a] block font-medium uppercase tracking-wider">
                      {language === 'en' ? 'Starts at' : 'শুরু মাত্র'}
                    </span>
                    <span className="text-xs sm:text-base font-semibold text-[#f5f5f7] mt-0.5 block leading-tight font-mono">
                      {dynamicPrice}
                    </span>
                  </div>

                  <div className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#3b5bff] group-hover:bg-[#324ecc] text-white text-[11px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5 shadow-md shadow-[#3b5bff]/25 transition-all duration-200">
                    <span>{language === 'en' ? 'View Demos' : 'ডেমো দেখুন'}</span>
                    <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        {/* Reassurance Micro Footer */}
        <footer className="text-center pt-1 sm:pt-2">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] sm:text-xs text-[#a1a1b0]">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span>
              {language === 'en' 
                ? 'Ready in 24h • Domain & Hosting Included • 100% Mobile Responsive' 
                : '২৪ ঘণ্টায় রেডি • ফ্রি ডোমেন ও হোস্টিং • ১০০% রেসপন্সিভ'}
            </span>
          </div>
        </footer>

      </section>
    </div>
  );
}
