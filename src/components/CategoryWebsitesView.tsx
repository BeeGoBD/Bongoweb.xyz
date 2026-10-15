import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, ArrowRight, Eye, ShieldCheck, ShoppingBag, 
  UtensilsCrossed, Newspaper, Store, Laptop
} from 'lucide-react';
import { WebsiteCategory, WebsiteDemo } from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';
import { useLanguage } from '../utils/LanguageContext';
import { apiGetWebsites } from '../utils/api';
import Card3D from './Card3D';

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
  }> = {
    ecommerce: {
      nameEn: 'E-Commerce Stores',
      nameBn: 'ই-কমার্স শপসমূহ',
      badgeEn: 'Most Demanding',
      badgeBn: 'সর্বোচ্চ চাহিদা',
      descriptionEn: 'Browse all live high-converting ecommerce online store templates ready with payment & courier integration.',
      descriptionBn: 'অটো বিকাশ/নগদ পেমেন্ট ও রিয়েল-টাইম কুরিয়ার সংযুক্ত সকল রেডিমেড ই-কমার্স ওয়েবসাইট এক্সপ্লোর করুন।',
      icon: ShoppingBag
    },
    restaurant: {
      nameEn: 'Restaurant & Cafe',
      nameBn: 'রেস্তোরাঁ ও ক্যাফে',
      badgeEn: 'High Demand',
      badgeBn: 'ব্যাপক চাহিদা',
      descriptionEn: 'Browse delicious restaurant, cafe, and dine-in food ordering templates with digital menus and table booking.',
      descriptionBn: 'ডিজিটাল ফুড মেনু, টেবিল বুকিং ও অনলাইন পার্সেল ডেলিভারি সুবিধাসম্পন্ন রেস্তোরাঁ ওয়েবসাইটসমূহ।',
      icon: UtensilsCrossed
    },
    blogging: {
      nameEn: 'Blog & Media Portals',
      nameBn: 'ব্লগ ও অনলাইন মিডিয়া',
      badgeEn: 'Growing Demand',
      badgeBn: 'ক্রমবর্ধমান চাহিদা',
      descriptionEn: 'Modern news portals, magazine publishers, and article showcase platforms optimized for fast Google indexing.',
      descriptionBn: 'দ্রুত গুগল ইনডেক্সিং ও অটো এডসেন্স অনুমোদিত আধুনিক নিউজ ও ম্যাগাজিন পোর্টালসমূহ।',
      icon: Newspaper
    },
    grocery: {
      nameEn: 'Grocery & Supermarket',
      nameBn: 'মুদি ও সুপারশপ',
      badgeEn: 'Basic & Essential',
      badgeBn: 'বেসিক ও নিত্যপ্রয়োজনীয়',
      descriptionEn: 'Daily essentials, organic foods, and weight-based grocery ordering templates with instant checkout.',
      descriptionBn: 'ওজন অনুযায়ী পণ্যের হিসাব ও দ্রুত হোম ডেলিভারি সমৃদ্ধ কাঁচাবাজার ও সুপারশপ ওয়েবসাইটসমূহ।',
      icon: Store
    },
    all: {
      nameEn: 'All Ready Websites',
      nameBn: 'সকল রেডি ওয়েবসাইট',
      badgeEn: 'All Catalog',
      badgeBn: 'সম্পূর্ণ ক্যাটালগ',
      descriptionEn: 'Explore our complete gallery of verified high-performance ready-made websites.',
      descriptionBn: 'আমাদের সকল ভেরিফায়েড রেডিমেড ওয়েবসাইটের সম্পূর্ণ কালেকশন এক্সপ্লোর করুন।',
      icon: Laptop
    },
    corporate: {
      nameEn: 'Corporate & Agency',
      nameBn: 'কর্পোরেট ও এজেন্সি',
      badgeEn: 'Professional',
      badgeBn: 'প্রফেশনাল',
      descriptionEn: 'Professional business and agency portfolio websites with lead generation forms.',
      descriptionBn: 'ব্যবসায়িক পরিচিতি ও লিড জেনারেশন সমৃদ্ধ কর্পোরেট ওয়েবসাইট।',
      icon: Laptop
    },
    fashion: {
      nameEn: 'Fashion & Clothing',
      nameBn: 'ফ্যাশন ও ক্লোদিং',
      badgeEn: 'Trending',
      badgeBn: 'ট্রেন্ডিং',
      descriptionEn: 'Modern lifestyle, apparel, and fashion boutique storefronts.',
      descriptionBn: 'লাইফস্টাইল ও পোশাকের আকর্ষণীয় অনলাইন স্টোরফ্রন্ট।',
      icon: ShoppingBag
    },
    portfolio: {
      nameEn: 'Personal Portfolio',
      nameBn: 'ব্যক্তিগত পোর্টফোলিও',
      badgeEn: 'Creator',
      badgeBn: 'ক্রিয়েটর',
      descriptionEn: 'Showcase your skills, projects, and client testimonials with high elegance.',
      descriptionBn: 'কাজের নমুনা ও ক্লায়েন্ট রিভিউ প্রদর্শনের পার্সোনাল পোর্টফোলিও।',
      icon: Laptop
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
    window.addEventListener('bongoweb_custom_websites_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('bongoweb_websites_updated', handleUpdate);
      window.removeEventListener('bongoweb_custom_websites_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
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

  const meta = categoryMeta[category] || categoryMeta.ecommerce;
  const CategoryIcon = meta.icon;

  return (
    <div 
      id="category-websites-view"
      data-view="category-websites"
      className="w-full min-h-[calc(100vh-4.5rem)] bg-[#09090b] text-[#f5f5f7] flex flex-col font-sans select-none pb-20 lg:pb-12"
    >
      {/* Category Navigation Bar */}
      <section className="w-full bg-[#0e0e12]/80 backdrop-blur-xl border-b border-white/[0.08] sticky top-16 sm:top-[68px] lg:top-[72px] z-10">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Left: Simple Back button & Category info */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#a1a1b0] hover:text-[#f5f5f7] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#a1a1b0]" />
                <span>{language === 'en' ? 'Back' : 'পেছনে'}</span>
              </button>

              <span className="text-[#71717a] font-light">/</span>

              <div className="flex items-center gap-2">
                <CategoryIcon className="w-4 h-4 text-[#3b5bff]" />
                <h2 className="text-sm sm:text-base font-medium text-[#f5f5f7]">
                  {language === 'en' ? meta.nameEn : meta.nameBn}
                </h2>
              </div>

              <span className="text-xs font-mono font-medium text-[#a1a1b0] bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                {matchingWebsites.length}
              </span>
            </div>

            {/* Right: Search Input */}
            <div className="relative w-full sm:w-64 md:w-72 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search by code or name (#1042)...' : 'কোড বা নাম দিয়ে খুঁজুন (#1042)...'}
                className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-white/[0.04] border border-white/[0.08] rounded-full focus:outline-none focus:border-[#3b5bff]/50 text-[#f5f5f7] placeholder-[#71717a]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid of Websites */}
      <main className="max-w-6xl xl:max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {matchingWebsites.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#0e0e12] rounded-2xl border border-white/[0.08] max-w-sm mx-auto my-8">
            <Search className="w-8 h-8 text-[#71717a] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#f5f5f7]">
              {language === 'en' ? 'No Websites Found' : 'কোনো ওয়েবসাইট পাওয়া যায়নি'}
            </h3>
            <p className="text-xs text-[#a1a1b0] mt-1 mb-4">
              {language === 'en' 
                ? 'Try searching with another keyword or code.' 
                : 'অন্য কোনো নাম বা কোড দিয়ে চেষ্টা করুন।'}
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-[#f5f5f7] rounded-full text-xs font-medium transition-colors cursor-pointer border border-white/[0.08]"
            >
              {language === 'en' ? 'Reset Search' : 'সার্চ রিসেট করুন'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingWebsites.map((demo) => (
              <Card3D
                key={demo.id}
                maxTilt={5}
                scale={1.015}
                onClick={() => onOpenWebsiteDetail(demo)}
                className="group bg-[#0e0e12]/95 rounded-2xl border border-white/[0.08] hover:border-[#3b5bff]/40 shadow-dark-card hover:shadow-dark-card-hover transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#14141a]">
                  <img
                    src={demo.previewImage}
                    alt={demo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  {/* Code Tag badge top-right */}
                  <span className="absolute top-2.5 right-2.5 font-mono text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#09090b]/80 text-[#f5f5f7] backdrop-blur-xs border border-white/[0.1]">
                    {demo.fourDigitCode}
                  </span>

                  {/* Hover Overlay with Live Preview */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3.5 py-1.5 rounded-full bg-white text-[#09090b] font-medium text-xs shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#3b5bff]" />
                      <span>{language === 'en' ? 'Live Preview' : 'লাইভ প্রিভিউ'}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[#f5f5f7] group-hover:text-white transition-colors line-clamp-1">
                      {demo.title}
                    </h3>
                    <p className="text-xs text-[#a1a1b0] mt-1 line-clamp-2 leading-relaxed">
                      {demo.description}
                    </p>
                  </div>

                  {/* Clean Pricing & Royal Blue Action Row */}
                  <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-semibold text-[#f5f5f7] font-mono">
                          {demo.priceTag || '৳১,৯৯০'}
                        </span>
                        <span className="text-xs text-[#71717a] font-normal font-mono">
                          + ৳১২০{language === 'en' ? '/mo' : '/মাস'}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium block">
                        {language === 'en' ? 'Domain & Hosting included' : 'ডোমেন ও হোস্টিং অন্তর্ভুক্ত'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOrder(demo);
                      }}
                      className="px-4 py-2 rounded-full bg-[#3b5bff] hover:bg-[#324ecc] text-white text-xs font-medium shadow-md shadow-[#3b5bff]/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{language === 'en' ? 'Order' : 'অর্ডার'}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
