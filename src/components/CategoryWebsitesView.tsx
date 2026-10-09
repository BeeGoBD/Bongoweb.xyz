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
      accentColor: '#2563EB',
      gradientBg: 'from-blue-600 via-indigo-600 to-blue-700',
      chipBg: 'bg-rose-50 text-rose-700 border-rose-200'
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

  const meta = categoryMeta[category] || categoryMeta.ecommerce;
  const IconComponent = meta.icon;

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
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50 flex flex-col font-sans select-none pb-16">
      {/* Category Hero Banner */}
      <section className="w-full bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Top navigation row */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer border border-slate-200/80 active:scale-95 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-800 stroke-[2.5]" />
              <span>{language === 'en' ? 'Back to Categories' : 'ক্যাটাগরিতে ফিরে যান'}</span>
            </button>

            {/* Total count badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {language === 'en' 
                  ? `${matchingWebsites.length} Websites Available` 
                  : `${matchingWebsites.length} টি ওয়েবসাইট রেডি`}
              </span>
            </div>
          </div>

          {/* Category Header Information */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${meta.gradientBg} text-white flex items-center justify-center shrink-0 shadow-md`}>
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {language === 'en' ? meta.nameEn : meta.nameBn}
                  </h1>
                  <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border ${meta.chipBg}`}>
                    {language === 'en' ? meta.badgeEn : meta.badgeBn}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-xl">
                  {language === 'en' ? meta.descriptionEn : meta.descriptionBn}
                </p>
              </div>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search by code or keyword...' : 'কোড বা নাম দিয়ে খুঁজুন (#1042)...'}
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid of Websites */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {matchingWebsites.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-md mx-auto my-6">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              {language === 'en' ? 'No Websites Found' : 'কোনো ওয়েবসাইট পাওয়া যায়নি'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {language === 'en' 
                ? 'Try searching with another keyword or code.' 
                : 'অন্য কোনো নাম বা কোড দিয়ে চেষ্টা করুন।'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Reset Search' : 'সার্চ রিসেট করুন'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {matchingWebsites.map((demo) => (
              <div
                key={demo.id}
                onClick={() => onOpenWebsiteDetail(demo)}
                className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500/70 shadow-xs hover:shadow-[0_12px_32px_rgba(37,99,235,0.12)] transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
              >
                <div>
                  {/* Top bar with serial code */}
                  <div className="px-3.5 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                      <span className="w-2 h-2 rounded-full bg-blue-400/50" />
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    </div>

                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-white text-blue-700 border border-slate-200 shadow-2xs">
                      {demo.fourDigitCode}
                    </span>
                  </div>

                  {/* Thumbnail Banner with Hover Overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={demo.previewImage}
                      alt={demo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3.5 py-2 rounded-xl bg-white text-blue-600 font-bold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 duration-200">
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>{language === 'en' ? 'Open Live Preview' : 'লাইভ প্রিভিউ দেখুন'}</span>
                      </span>
                    </div>

                    {/* Category Label Chip */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs border border-slate-200">
                        {demo.categoryLabel}
                      </span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-blue-600 text-white shadow-xs">
                        {demo.priceTag || '১,৯৯০ ৳'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-1.5 text-xs text-slate-500 font-medium">
                      <span>{demo.ordersCount || '100+ sales'}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-slate-800">{demo.rating || 4.9}</span>
                      </div>
                    </div>

                    <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1">
                      {demo.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-normal mt-1 line-clamp-2 leading-relaxed">
                      {demo.description}
                    </p>

                    {/* Feature Chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(demo.features || []).slice(0, 3).map((feat, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenWebsiteDetail(demo);
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>{language === 'en' ? 'Preview' : 'প্রিভিউ'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenOrder(demo);
                    }}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    <span>{language === 'en' ? 'Select & Order' : 'অর্ডার করুন'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
