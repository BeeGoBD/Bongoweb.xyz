import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Star, ArrowRight, Eye, CheckCircle2, 
  Sparkles, ExternalLink, ShieldCheck, ShoppingBag, 
  UtensilsCrossed, Newspaper, Store, Laptop
} from 'lucide-react';
import { WebsiteCategory, WebsiteDemo } from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';
import { useLanguage } from '../utils/LanguageContext';
import { apiGetWebsites } from '../utils/api';

interface CategoryWebsitesViewProps {
  category: WebsiteCategory;
  onBackToDashboard: () => void;
  onOpenWebsiteDetail: (demo: WebsiteDemo) => void;
  onOpenOrder: (demo: WebsiteDemo) => void;
}

export default function CategoryWebsitesView({
  category,
  onBackToDashboard,
  onOpenWebsiteDetail,
  onOpenOrder
}: CategoryWebsitesViewProps) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Category metadata & styling
  const categoryMeta: Record<WebsiteCategory, {
    nameEn: string;
    nameBn: string;
    badgeEn: string;
    badgeBn: string;
    descriptionEn: string;
    descriptionBn: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    gradientBg: string;
    chipBg: string;
  }> = {
    ecommerce: {
      nameEn: 'E-Commerce Stores',
      nameBn: 'ই-কমার্স শপসমূহ',
      badgeEn: '🔥 Most Demanding',
      badgeBn: '🔥 সর্বোচ্চ চাহিদা',
      descriptionEn: 'Browse all live high-converting ecommerce online store templates ready with payment & courier integration.',
      descriptionBn: 'অটো বিকাশ/নগদ পেমেন্ট ও রিয়েল-টাইম কুরিয়ার সংযুক্ত সকল রেডিমেড ই-কমার্স ওয়েবসাইট এক্সপ্লোর করুন।',
      icon: ShoppingBag,
      accentColor: '#6B46C1',
      gradientBg: 'from-[#5521B5] via-[#6B46C1] to-[#7C3AED]',
      chipBg: 'bg-[#FAF5FF] text-[#6B46C1] border-[#DDD6FE]'
    },
    restaurant: {
      nameEn: 'Restaurant & Cafe',
      nameBn: 'রেস্তোরাঁ ও ক্যাফে',
      badgeEn: '⚡ High Demand',
      badgeBn: '⚡ ব্যাপক চাহিদা',
      descriptionEn: 'Browse delicious restaurant, cafe, and dine-in food ordering templates with digital menus and table booking.',
      descriptionBn: 'ডিজিটাল ফুড মেনু, টেবিল বুকিং ও অনলাইন পার্সেল ডেলিভারি সুবিধাসম্পন্ন রেস্তোরাঁ ওয়েবসাইটসমূহ।',
      icon: UtensilsCrossed,
      accentColor: '#EA580C',
      gradientBg: 'from-orange-600 via-amber-600 to-orange-700',
      chipBg: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    blogging: {
      nameEn: 'Blog & Media Portals',
      nameBn: 'ব্লগ ও অনলাইন মিডিয়া',
      badgeEn: '📈 Growing Demand',
      badgeBn: '📈 ক্রমবর্ধমান চাহিদা',
      descriptionEn: 'Modern news portals, magazine publishers, and article showcase platforms optimized for fast Google indexing.',
      descriptionBn: 'দ্রুত গুগল ইনডেক্সিং ও অটো এডসেন্স অনুমোদিত আধুনিক নিউজ ও ম্যাগাজিন পোর্টালসমূহ।',
      icon: Newspaper,
      accentColor: '#7C3AED',
      gradientBg: 'from-purple-600 via-violet-600 to-purple-700',
      chipBg: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    grocery: {
      nameEn: 'Grocery & Supermarket',
      nameBn: 'মুদি ও সুপারশপ',
      badgeEn: '📦 Basic & Essential',
      badgeBn: '📦 বেসিক ও নিত্যপ্রয়োজনীয়',
      descriptionEn: 'Daily essentials, organic foods, and weight-based grocery ordering templates with instant checkout.',
      descriptionBn: 'ওজন অনুযায়ী পণ্যের হিসাব ও দ্রুত হোম ডেলিভারি সমৃদ্ধ কাঁচাবাজার ও সুপারশপ ওয়েবসাইটসমূহ।',
      icon: Store,
      accentColor: '#059669',
      gradientBg: 'from-emerald-600 via-teal-600 to-emerald-700',
      chipBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    all: {
      nameEn: 'All Ready Websites',
      nameBn: 'সকল রেডি ওয়েবসাইট',
      badgeEn: 'All Catalog',
      badgeBn: 'সম্পূর্ণ ক্যাটালগ',
      descriptionEn: 'Explore our complete gallery of verified high-performance ready-made websites.',
      descriptionBn: 'আমাদের সকল ভেরিফায়েড রেডিমেড ওয়েবসাইটের সম্পূর্ণ কালেকশন এক্সপ্লোর করুন।',
      icon: Laptop,
      accentColor: '#2563EB',
      gradientBg: 'from-slate-800 to-slate-900',
      chipBg: 'bg-slate-100 text-slate-800 border-slate-200'
    },
    corporate: {
      nameEn: 'Corporate & Business',
      nameBn: 'কর্পোরেট ও ব্যবসা',
      badgeEn: 'Professional',
      badgeBn: 'প্রফেশনাল',
      descriptionEn: 'Corporate portfolio and agency business websites.',
      descriptionBn: 'কর্পোরেট ব্যবসা ও এজেন্সির জন্য প্রিমিয়াম ওয়েবসাইট।',
      icon: Laptop,
      accentColor: '#2563EB',
      gradientBg: 'from-blue-700 to-indigo-800',
      chipBg: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    fashion: {
      nameEn: 'Fashion & Boutique',
      nameBn: 'ফ্যাশন ও বুটিক',
      badgeEn: 'Trendy',
      badgeBn: 'ট্রেন্ডি',
      descriptionEn: 'Fashion apparel and stylish clothing boutique storefronts.',
      descriptionBn: 'ফ্যাশন ও ব্র্যান্ডেড কাপড়ের আধুনিক অনলাইন স্টোর।',
      icon: ShoppingBag,
      accentColor: '#DB2777',
      gradientBg: 'from-pink-600 to-rose-700',
      chipBg: 'bg-pink-50 text-pink-700 border-pink-200'
    },
    portfolio: {
      nameEn: 'Personal Portfolio',
      nameBn: 'ব্যক্তিগত পোর্টফোলিও',
      badgeEn: 'Creative',
      badgeBn: 'ক্রিয়েটিভ',
      descriptionEn: 'Personal resume and creative portfolio showcase.',
      descriptionBn: 'ব্যক্তিগত সিভি ও কাজের নমুনা প্রদর্শনের পোর্টফোলিও।',
      icon: Laptop,
      accentColor: '#0284C7',
      gradientBg: 'from-sky-600 to-cyan-700',
      chipBg: 'bg-sky-50 text-sky-700 border-sky-200'
    }
  };


  // Retrieve custom uploaded websites dynamically from database and local sync
  const [customWebsites, setCustomWebsites] = useState<WebsiteDemo[]>(() => {
    try {
      const raw = localStorage.getItem('bongoweb_custom_websites') || localStorage.getItem('bongoweb_custom_catalog');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    apiGetWebsites()
      .then(sites => {
        if (Array.isArray(sites)) setCustomWebsites(sites);
      })
      .catch(() => {});

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCustomWebsites(e.detail);
      } else {
        try {
          const raw = localStorage.getItem('bongoweb_custom_websites') || localStorage.getItem('bongoweb_custom_catalog');
          if (raw) setCustomWebsites(JSON.parse(raw));
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

  // Filter demos matching this specific category
  const matchingWebsites = allAvailableWebsites.filter((demo) => {
    const matchCat = category === 'all' || demo.category === category;
    if (!matchCat) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      demo.title.toLowerCase().includes(q) ||
      (demo.englishTitle?.toLowerCase() || '').includes(q) ||
      (demo.banglaTitle?.toLowerCase() || '').includes(q) ||
      demo.fourDigitCode.toLowerCase().includes(q) ||
      demo.description.toLowerCase().includes(q)
    );
  });

  return (
    <div 
      id="category-websites-view"
      data-view="category-websites"
      className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 flex flex-col font-sans select-none pb-20 lg:pb-12"
    >
      {/* Category Navigation Bar */}
      <section className="w-full bg-white border-b border-slate-200 shadow-2xs sticky top-16 sm:top-[72px] lg:top-[76px] z-10">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Left: Simple Back button & Category info */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer py-1 px-1.5 -ml-1.5 rounded-lg hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>{language === 'en' ? 'Back' : 'পেছনে'}</span>
              </button>

              <span className="text-slate-300 font-light">/</span>

              <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                {categoryMeta[category] 
                  ? (language === 'en' ? categoryMeta[category].nameEn : categoryMeta[category].nameBn)
                  : (language === 'en' ? 'Websites' : 'ওয়েবসাইট')}
              </h2>

              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/70">
                {matchingWebsites.length}
              </span>
            </div>

            {/* Right: Clean Search Input */}
            <div className="relative w-full sm:w-64 md:w-72 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search by code or name...' : 'কোড বা নাম দিয়ে খুঁজুন (#1042)...'}
                className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid of Websites */}
      <main className="max-w-6xl xl:max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 flex-1">
        {matchingWebsites.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 shadow-2xs max-w-sm mx-auto my-6">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2.5" />
            <h3 className="text-sm font-bold text-slate-800">
              {language === 'en' ? 'No Websites Found' : 'কোনো ওয়েবসাইট পাওয়া যায়নি'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              {language === 'en' 
                ? 'Try searching with another keyword or code.' 
                : 'অন্য কোনো নাম বা কোড দিয়ে চেষ্টা করুন।'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
            >
              {language === 'en' ? 'Reset Search' : 'সার্চ রিসেট করুন'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {matchingWebsites.map((demo) => (
              <div
                key={demo.id}
                onClick={() => onOpenWebsiteDetail(demo)}
                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={demo.previewImage}
                    alt={demo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Code Tag badge top-right */}
                  <span className="absolute top-2.5 right-2.5 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-700 shadow-xs backdrop-blur-xs border border-slate-200/80">
                    {demo.fourDigitCode}
                  </span>

                  {/* Hover Overlay with Live Preview */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 font-semibold text-xs shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-purple-600" />
                      <span>{language === 'en' ? 'Live Preview' : 'লাইভ প্রিভিউ'}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                      {demo.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {demo.description}
                    </p>
                  </div>

                  {/* Clean Pricing & Action Row */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-slate-900 font-mono">
                          {demo.priceTag || '৳১,৯৯০'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium font-mono">
                          + ৳১২০{language === 'en' ? '/mo' : '/মাস'}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium block">
                        {language === 'en' ? 'Domain & Hosting included' : 'ডোমেন ও হোস্টিং অন্তর্ভুক্ত'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOrder(demo);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 flex items-center gap-1"
                    >
                      <span>{language === 'en' ? 'Order' : 'অর্ডার'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
