import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowRight, 
  Eye, 
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  UtensilsCrossed,
  BookOpen,
  ShoppingCart,
  Briefcase
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
  category: initialCategory,
  onBackToDashboard: _onBackToDashboard,
  onOpenWebsiteDetail,
  onOpenOrder
}: CategoryWebsitesViewProps) {
  const { language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>(() => {
    if (initialCategory && initialCategory !== 'all') {
      return initialCategory;
    }
    return 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    setSelectedFilter(initialCategory || 'all');
  }, [initialCategory]);

  // Filter chips specification
  const filterChips = [
    { id: 'all', labelEn: 'All', labelBn: 'সকল' },
    { id: 'ecommerce', labelEn: 'Ecommerce', labelBn: 'ই-কমার্স' },
    { id: 'restaurant', labelEn: 'Restaurant & Fast Food', labelBn: 'রেস্তোরাঁ ও ফাস্ট ফুড' },
    { id: 'landing', labelEn: 'Landing Page', labelBn: 'ল্যান্ডিং পেজ' },
    { id: 'grocery', labelEn: 'Grocery', labelBn: 'গ্রোসারি' },
    { id: 'portfolio', labelEn: 'Portfolio', labelBn: 'পোর্টফোলিও' }
  ];

  // Dynamic custom websites fetched from backend/vault
  const [customWebsites, setCustomWebsites] = useState<WebsiteDemo[]>(() => {
    try {
      const raw = localStorage.getItem('bongoweb_custom_websites') || localStorage.getItem('bongoweb_custom_catalog');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    apiGetWebsites()
      .then((sites) => {
        if (Array.isArray(sites) && sites.length > 0) setCustomWebsites(sites);
      })
      .catch(() => {});

    const handleWebsitesUpdate = (e: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setCustomWebsites(e.detail);
      } else {
        try {
          const raw = localStorage.getItem('bongoweb_custom_websites') || localStorage.getItem('bongoweb_custom_catalog');
          if (raw) setCustomWebsites(JSON.parse(raw));
        } catch (_) {}
      }
    };

    window.addEventListener('bongoweb_websites_updated', handleWebsitesUpdate);
    window.addEventListener('bongoweb_custom_websites_updated', handleWebsitesUpdate);
    return () => {
      window.removeEventListener('bongoweb_websites_updated', handleWebsitesUpdate);
      window.removeEventListener('bongoweb_custom_websites_updated', handleWebsitesUpdate);
    };
  }, []);

  const allDemos = useMemo(() => {
    const map = new Map<string, WebsiteDemo>();
    // 1. Initial base demos
    WEBSITE_DEMOS.forEach((site) => {
      const key = String(site.fourDigitCode || site.id).replace('#', '').trim().toLowerCase();
      map.set(key, site);
    });
    // 2. Custom/persisted demos (overwrite or add new)
    (customWebsites || []).forEach((site) => {
      if (!site) return;
      const key = String(site.fourDigitCode || site.id).replace('#', '').trim().toLowerCase();
      map.set(key, site);
    });
    return Array.from(map.values());
  }, [customWebsites]);

  // Filter logic
  const filteredDemos = useMemo(() => {
    return allDemos.filter((demo) => {
      // 1. Category filter
      if (selectedFilter !== 'all') {
        const matchesCategory = 
          demo.category === selectedFilter ||
          (selectedFilter === 'landing' && (demo.category === 'landing' || demo.category === 'blogging')) ||
          (selectedFilter === 'portfolio' && (demo.category === 'portfolio' || demo.category === 'corporate'));
        if (!matchesCategory) return false;
      }

      // 2. Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        demo.title.toLowerCase().includes(q) ||
        (demo.englishTitle?.toLowerCase() || '').includes(q) ||
        (demo.banglaTitle?.toLowerCase() || '').includes(q) ||
        demo.category.toLowerCase().includes(q) ||
        demo.fourDigitCode.toLowerCase().includes(q) ||
        demo.description.toLowerCase().includes(q)
      );
    });
  }, [allDemos, selectedFilter, searchQuery]);

  return (
    <div 
      id="templates-page-view"
      data-view="templates"
      className="w-full min-h-[calc(100vh-4rem)] bg-[#F8F5FC] text-[#1F1F2E] font-sans pb-20 md:pb-12"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-5 sm:pt-7 md:pt-8 space-y-5 sm:space-y-6">
        
        {/* 1. Title Section */}
        <section className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F2E] tracking-tight">
            {language === 'bn' ? 'টেমপ্লেট বেছে নিন' : 'Choose a Template'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium">
            {language === 'bn' ? 'Choose a Template' : 'Browse verified, ready-to-launch website templates'}
          </p>
        </section>

        {/* 2. Search Bar */}
        <section className="w-full">
          <div className="relative w-full flex items-center bg-[#FFFFFF] border border-[#EDE4F5] rounded-xl sm:rounded-2xl px-4 py-3 shadow-xs hover:border-[#5B2C8A]/40 focus-within:border-[#5B2C8A] focus-within:ring-2 focus-within:ring-[#5B2C8A]/10 transition-all">
            {/* Left Search Icon */}
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B7280] shrink-0 mr-3" />

            {/* Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-transparent text-sm sm:text-base text-[#1F1F2E] placeholder-[#6B7280] outline-none"
            />

            {/* Clear Button if input has text */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#6B7280] hover:text-[#1F1F2E] mr-2 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}

            {/* Right Filter Icon */}
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              title="Filter templates"
              className="p-1 rounded-lg text-[#5B2C8A] hover:bg-[#F8F5FC] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </button>
          </div>
        </section>

        {/* 3. Filter Chips (Horizontal scrollable on mobile, wrapped on desktop) */}
        <section className="w-full">
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto md:overflow-visible md:flex-wrap pb-1 md:pb-0 no-scrollbar">
            {filterChips.map((chip) => {
              const isActive = selectedFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedFilter(chip.id)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#5B2C8A] text-[#FFFFFF] shadow-xs'
                      : 'bg-[#FFFFFF] text-[#6B7280] hover:text-[#5B2C8A] border border-[#EDE4F5] hover:border-[#5B2C8A]/40'
                  }`}
                >
                  {language === 'bn' ? chip.labelBn : chip.labelEn}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Template Grid (2 columns on mobile, 3 on tablet/laptop, 4 on desktop) */}
        <section className="w-full pt-1">
          {filteredDemos.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#EDE4F5] rounded-2xl p-8 text-center max-w-md mx-auto my-6 shadow-xs">
              <Search className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#1F1F2E]">
                {language === 'bn' ? 'কোনো টেমপ্লেট পাওয়া যায়নি' : 'No Templates Found'}
              </h3>
              <p className="text-xs text-[#6B7280] mt-1 mb-4">
                {language === 'bn' 
                  ? 'অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার রিসেট করুন।' 
                  : 'Try searching with another keyword or resetting the category filter.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="px-4 py-2 bg-[#5B2C8A] hover:bg-[#4A1F6E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {language === 'bn' ? 'সকল টেমপ্লেট দেখুন' : 'Show All Templates'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
              {filteredDemos.map((demo, idx) => {
                const categoryLabel = 
                  demo.category === 'ecommerce' ? 'Ecommerce' :
                  demo.category === 'restaurant' ? 'Restaurant & Fast Food' :
                  demo.category === 'landing' || demo.category === 'blogging' ? 'Landing Page' :
                  demo.category === 'grocery' ? 'Grocery' : 'Portfolio';

                const uniqueKey = demo.fourDigitCode 
                  ? `template-${String(demo.fourDigitCode).replace('#', '')}-${demo.id || idx}`
                  : `template-${demo.id || idx}`;

                const cleanDemoCode = String(demo.fourDigitCode || '2085').replace('#', '');

                return (
                  <article
                    key={uniqueKey}
                    className="group bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#EDE4F5] shadow-soft hover:shadow-soft-lg hover:border-[#5B2C8A]/40 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Realistic Browser Window Header Bar */}
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#FAF7F2] border-b border-[#EDE4F5] flex items-center justify-between select-none shrink-0 gap-1.5">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        {/* macOS Traffic Dots */}
                        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                          <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#EF4444]/80 inline-block" />
                          <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#F59E0B]/80 inline-block" />
                          <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#10B981]/80 inline-block" />
                        </div>
                        {/* Simulated Browser Address Pill */}
                        <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-[#EDE4F5] text-[10px] sm:text-[11px] font-mono text-[#5B2C8A] font-semibold truncate">
                          <span className="text-emerald-600 font-bold">https://</span>
                          <span className="truncate">{cleanDemoCode.toLowerCase()}.bongoweb.site</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-md bg-[#5B2C8A] text-white shadow-2xs">
                          {demo.fourDigitCode}
                        </span>
                        <span className="text-[9px] sm:text-[11px] font-bold text-[#5B2C8A] bg-purple-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-purple-200 truncate max-w-[85px] sm:max-w-none">
                          {categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Long, Tall Webpage Preview Window (Elongated up-and-down so customers get full preview before clicking) */}
                    <div 
                      onClick={() => onOpenWebsiteDetail(demo)}
                      className="relative w-full h-[380px] xs:h-[460px] sm:h-[560px] md:h-[660px] lg:h-[740px] xl:h-[800px] overflow-hidden bg-[#F8F5FC] cursor-pointer group/preview"
                    >
                      <img
                        src={demo.previewImage}
                        alt={demo.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover/preview:scale-[1.02] transition-transform duration-500"
                      />

                      {/* Bottom Gradient Scrim with preview hint */}
                      <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none flex items-end p-2.5 sm:p-4">
                        <span className="text-white text-[10px] sm:text-xs font-bold flex items-center gap-1.5 drop-shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span className="truncate">{language === 'bn' ? 'সম্পূর্ণ লাইভ ওয়েবসাইট দেখুন' : 'Click to preview live website'}</span>
                        </span>
                      </div>

                      {/* Hover Overlay preview action */}
                      <div className="absolute inset-0 bg-[#5B2C8A]/15 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <span className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white text-[#5B2C8A] font-bold text-[11px] sm:text-sm shadow-xl border border-[#EDE4F5] flex items-center gap-1.5 transform translate-y-2 group-hover/preview:translate-y-0 transition-transform">
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] shrink-0" />
                          <span>{language === 'bn' ? 'আগে দেখুন' : 'See First'}</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        </span>
                      </div>
                    </div>

                    {/* Card Content & Details (Title, Price, Actions) */}
                    <div className="p-3 sm:p-4 md:p-5 space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-2.5">
                        <div className="min-w-0 flex-1">
                          <h2 
                            onClick={() => onOpenWebsiteDetail(demo)}
                            className="text-xs sm:text-base md:text-lg font-extrabold text-[#1F1F2E] hover:text-[#5B2C8A] transition-colors cursor-pointer leading-snug line-clamp-2"
                            title={demo.title}
                          >
                            {demo.title}
                          </h2>
                        </div>

                        {/* Price Badge */}
                        <div className="shrink-0 flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-0.5">
                          <span className="text-[9px] sm:text-[11px] text-[#6B7280] font-medium">
                            {language === 'bn' ? 'প্যাকেজ মূল্য' : 'Setup Price'}
                          </span>
                          <span className="text-sm sm:text-xl md:text-2xl font-black font-mono text-[#5B2C8A]">
                            {demo.priceTag || '১,৯৯০ ৳'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Action Area: "Buy Now" (solid purple) and "See First" button */}
                      <div className="pt-2 sm:pt-3 border-t border-[#EDE4F5] flex flex-col gap-2">
                        <div className="flex flex-col xs:flex-row items-stretch gap-1.5 sm:gap-2.5">
                          {/* Solid Purple "Buy Now" Button */}
                          <button
                            type="button"
                            onClick={() => onOpenOrder(demo)}
                            className="flex-1 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#5B2C8A] hover:bg-[#4A1F6E] active:bg-[#3C165C] text-white text-[11px] sm:text-sm font-bold transition-all cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span className="truncate">{language === 'bn' ? 'এখনই কিনুন' : 'Buy Now'}</span>
                          </button>

                          {/* "See First" Button */}
                          <button
                            type="button"
                            onClick={() => onOpenWebsiteDetail(demo)}
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-[#F8F5FC] text-[#5B2C8A] hover:text-[#4A1F6E] border border-[#EDE4F5] hover:border-[#5B2C8A]/40 text-[11px] sm:text-sm font-bold inline-flex items-center justify-center gap-1 cursor-pointer transition-all shadow-2xs active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span className="truncate">{language === 'bn' ? 'আগে দেখুন' : 'See First'}</span>
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                          </button>
                        </div>

                        {/* Guarantee Label */}
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium flex items-center gap-1 justify-center">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{language === 'bn' ? '২৪ ঘণ্টায় রেডি ওয়েবসাইট' : 'Ready in 24 hours'}</span>
                        </span>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
