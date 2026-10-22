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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
              {filteredDemos.map((demo, idx) => {
                const categoryLabel = 
                  demo.category === 'ecommerce' ? 'Ecommerce' :
                  demo.category === 'restaurant' ? 'Restaurant & Fast Food' :
                  demo.category === 'landing' || demo.category === 'blogging' ? 'Landing Page' :
                  demo.category === 'grocery' ? 'Grocery' : 'Portfolio';

                const uniqueKey = demo.fourDigitCode 
                  ? `template-${String(demo.fourDigitCode).replace('#', '')}-${demo.id || idx}`
                  : `template-${demo.id || idx}`;

                return (
                  <div
                    key={uniqueKey}
                    className="group bg-[#FFFFFF] rounded-2xl border border-[#EDE4F5] shadow-soft hover:shadow-soft-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Realistic website preview image on top */}
                      <div 
                        onClick={() => onOpenWebsiteDetail(demo)}
                        className="relative aspect-[16/10] overflow-hidden bg-[#F8F5FC] cursor-pointer"
                      >
                        <img
                          src={demo.previewImage}
                          alt={demo.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />

                        {/* Top corner code badge */}
                        <span className="absolute top-2 right-2 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-[#1F1F2E] shadow-xs border border-[#EDE4F5]">
                          {demo.fourDigitCode}
                        </span>

                        {/* Hover Overlay preview icon */}
                        <div className="absolute inset-0 bg-[#5B2C8A]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-xl bg-white text-[#5B2C8A] font-bold text-xs shadow-md border border-[#EDE4F5] flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'আগে দেখুন' : 'See First'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-3 sm:p-4 pb-2">
                        {/* Small category pill */}
                        <span className="inline-block text-[10px] sm:text-[11px] font-semibold text-[#5B2C8A] bg-[#F8F5FC] border border-[#EDE4F5] px-2.5 py-0.5 rounded-full mb-1.5">
                          {categoryLabel}
                        </span>

                        {/* Template Name (Bold) */}
                        <h2 
                          onClick={() => onOpenWebsiteDetail(demo)}
                          className="text-xs sm:text-base font-bold text-[#1F1F2E] group-hover:text-[#5B2C8A] transition-colors line-clamp-1 cursor-pointer"
                          title={demo.title}
                        >
                          {demo.title}
                        </h2>

                        <p className="text-[11px] text-[#6B7280] mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                          {demo.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Area: Two buttons: “Buy Now” (solid purple) and “See First →” (text link) */}
                    <div className="p-3 sm:p-4 pt-2 border-t border-[#EDE4F5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      {/* Solid Purple "Buy Now" Button */}
                      <button
                        type="button"
                        onClick={() => onOpenOrder(demo)}
                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#5B2C8A] hover:bg-[#4A1F6E] active:bg-[#3C165C] text-white text-xs font-bold transition-all cursor-pointer text-center shadow-xs"
                      >
                        {language === 'bn' ? 'এখনই কিনুন' : 'Buy Now'}
                      </button>

                      {/* "See First →" Text Link */}
                      <button
                        type="button"
                        onClick={() => onOpenWebsiteDetail(demo)}
                        className="text-[#5B2C8A] hover:text-[#7C3AED] text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer transition-colors py-1 sm:py-0"
                      >
                        <span>{language === 'bn' ? 'আগে দেখুন' : 'See First'}</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
