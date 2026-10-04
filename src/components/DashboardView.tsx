import React, { useState, useEffect } from 'react';
import { 
  Search, ArrowLeft, Eye, ArrowRight, Star, 
  Server, RefreshCw
} from 'lucide-react';
import { WebsiteDemo, WebsiteCategory } from '../types';
import { apiGetWebsites, subscribeToWebsites } from '../utils/api';
import { WEBSITE_DEMOS } from '../data/mockData';
import { useLanguage } from '../utils/LanguageContext';

interface DashboardViewProps {
  initialCategory: WebsiteCategory;
  onOpenLiveDemo: (demo: WebsiteDemo) => void;
  onOpenOrder: (demo: WebsiteDemo) => void;
  onChangeCategoryLanding: () => void;
}

export default function DashboardView({
  initialCategory,
  onOpenLiveDemo,
  onOpenOrder,
  onChangeCategoryLanding
}: DashboardViewProps) {
  const [activeCategory] = useState<WebsiteCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [websites, setWebsites] = useState<WebsiteDemo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, t } = useLanguage();

  // Exactly one mock website as requested by the user for testing & editing
  const fallbackSingleMock = [WEBSITE_DEMOS[0]];

  useEffect(() => {
    apiGetWebsites()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Provide exactly one mock website for editing as user requested
          setWebsites([data[0]]);
        } else {
          setWebsites(fallbackSingleMock);
        }
      })
      .catch(() => {
        setWebsites(fallbackSingleMock);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const unsubscribe = subscribeToWebsites((sites) => {
      if (Array.isArray(sites) && sites.length > 0) {
        setWebsites([sites[0]]);
      } else {
        setWebsites(fallbackSingleMock);
      }
    });

    return () => unsubscribe();
  }, []);

  const getCategoryLabel = (cat: WebsiteCategory) => {
    if (language === 'en') {
      switch (cat) {
        case 'ecommerce': return 'E-Commerce Store';
        case 'restaurant': return 'Restaurant & Cafe';
        case 'blogging': return 'Blog & Media';
        case 'grocery': return 'Grocery & Supermarket';
        default: return 'All Websites';
      }
    }
    switch (cat) {
      case 'ecommerce': return 'ই-কমার্স শপ';
      case 'restaurant': return 'রেস্তোরাঁ ও ক্যাফে';
      case 'blogging': return 'ব্লগ ও মিডিয়া';
      case 'grocery': return 'মুদি ও সুপারশপ';
      default: return 'সকল ওয়েবসাইট';
    }
  };

  const currentWebsites = websites.length > 0 ? websites : fallbackSingleMock;

  const filteredDemos = currentWebsites.filter((demo) => {
    const matchesCategory = activeCategory === 'all' || demo.category === activeCategory;
    const matchesSearch = 
      demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (demo.banglaTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      demo.fourDigitCode.includes(searchQuery) ||
      demo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-2 animate-fadeIn">
      {/* 1. Compact Top Bar: Return Indicator + Top Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mb-5">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_2px_12px_rgba(13,37,61,0.03)] flex items-center justify-between gap-3">
          {/* Left: Simple Indicator Button */}
          <div className="flex items-center">
            <button
              onClick={onChangeCategoryLanding}
              id="dashboard-back-indicator-btn"
              aria-label="Return to Category Selection"
              title={t('ক্যাটাগরি পেজে ফিরুন', 'Return to Category Selection')}
              className="w-10 h-10 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] active:bg-[#2B47EE] active:text-[#FFFFFF] text-[#2B47EE] border border-[#E5EDF5] hover:border-[#2B47EE]/30 transition-all flex items-center justify-center cursor-pointer shadow-2xs group shrink-0"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
          </div>

          {/* Right: Search Input at Top */}
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="w-4 h-4 text-[#7D8BA4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('কোড বা নাম দিয়ে খুঁজুন (যেমন #1042)...', 'Search by code or name (e.g. #1042)...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2B47EE] focus:ring-1 focus:ring-[#2B47EE] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#7D8BA4] hover:text-[#0D253D] p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Websites Grid: Single mock website ready for inspection & editing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {isLoading ? (
          <div className="w-full p-12 text-center bg-[#F8FAFD] rounded-3xl border border-[#E5EDF5] flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#2B47EE] animate-spin" />
            <p className="text-xs text-[#64748D]">{t('লোড হচ্ছে...', 'Loading...')}</p>
          </div>
        ) : filteredDemos.length === 0 ? (
          <div className="w-full p-12 text-center bg-[#F8FAFD] rounded-3xl border border-[#E5EDF5] space-y-2">
            <p className="text-base font-bold text-[#0D253D]">
              {searchQuery ? t('কোনো ওয়েবসাইট পাওয়া যায়নি', 'No websites found') : t('বর্তমানে কোনো ওয়েবসাইট নেই', 'No website available')}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-2 rounded-xl bg-[#2B47EE] text-white text-xs font-bold hover:bg-[#203CD4] cursor-pointer"
              >
                {t('রিসেট করুন', 'Reset Search')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredDemos.map((demo) => {
              return (
                <div
                  key={demo.id}
                  className="group bg-[#FFFFFF] hover:bg-[#F8FAFD] rounded-2xl sm:rounded-3xl border border-[#E5EDF5] hover:border-[#2B47EE] transition-all duration-300 shadow-[0_4px_16px_rgba(13,37,61,0.03)] hover:shadow-[0_16px_36px_rgba(43,71,238,0.12)] flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                >
                  {/* Top Image Preview */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#E5EDF5] select-none">
                    <img
                      src={demo.previewImage}
                      alt={demo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D253D]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Top Left Code Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0D253D]/90 backdrop-blur-md text-[#FFFFFF] text-[11px] font-mono font-bold shadow-xs">
                        {demo.fourDigitCode}
                      </span>
                    </div>

                    {/* Top Right Live Indicator */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00B261] text-[#FFFFFF] text-[10px] font-extrabold shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse"></span>
                        LIVE
                      </span>
                    </div>

                    {/* Centered 'Preview Website' Hover / Click Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLiveDemo(demo);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#2B47EE] hover:bg-[#203CD4] text-[#FFFFFF] text-xs font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{t('প্রিভিউ ওয়েবসাইট', 'Preview Website')}</span>
                      </button>
                    </div>

                    {/* Bottom overlay: rating */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[#FFFFFF]">
                      <div className="flex items-center gap-1 text-[11px] font-bold bg-[#0D253D]/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-[#FFD552] text-[#FFD552]" />
                        <span>{demo.rating}</span>
                        <span className="opacity-80 text-[10px]">({demo.ordersCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#FFFFFF]">
                    <div>
                      {/* Top Bar: Category Pill + 24h Setup on Left, Making Charge on Right */}
                      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#E5EDF5]">
                        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#2B47EE] text-[11px] font-extrabold tracking-tight truncate">
                            {getCategoryLabel(demo.category)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#10B981]/10 text-[10px] font-bold text-[#059669] shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                            <span>{t('২৪ ঘণ্টা রেডি', '24h Ready')}</span>
                          </span>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] text-xs font-black text-[#2B47EE] tracking-tight">
                            {language === 'en' ? '1,990 BDT Making' : '১,৯৯০ ৳ মেকিং'}
                          </span>
                        </div>
                      </div>

                      {/* Clean Title */}
                      <h3 className="text-sm sm:text-base font-black text-[#0D253D] group-hover:text-[#2B47EE] transition-colors line-clamp-1 mb-1.5">
                        {language === 'en' 
                          ? (demo?.englishTitle || String(demo?.title || '').replace(/^#\d+\s*/, ''))
                          : (demo?.banglaTitle || String(demo?.title || '').replace(/^#\d+\s*/, ''))
                        }
                      </h3>

                      {/* Clean Description */}
                      <p className="text-xs text-[#64748D] line-clamp-2 leading-relaxed mb-3">
                        {language === 'en' 
                          ? 'Complete customized high-conversion design with inventory, mobile responsive layouts, and automated payments.'
                          : demo.description
                        }
                      </p>

                      {/* Monthly Maintenance Section */}
                      <div className="w-full mb-3.5 px-3 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] hover:border-[#2B47EE]/30 transition-all flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center shrink-0 shadow-2xs">
                            <Server className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-[#0D253D] truncate">
                            {t('মাসিক মেইনটেন্যান্স ও হোস্টিং', 'Monthly Server & Cloud Hosting')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#FFFFFF] border border-[#E5EDF5] text-xs font-black text-[#2B47EE] font-mono shadow-2xs">
                            {language === 'en' ? '120 BDT' : '১২০ ৳'}
                          </span>
                          <span className="text-[10px] text-[#64748D] font-bold">
                            {t('/মাস', '/mo')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Clean & High-Contrast */}
                    <div className="pt-3 border-t border-[#E5EDF5] grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onOpenLiveDemo(demo)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] hover:border-[#2B47EE]/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('লাইভ ডেমো', 'Live Demo')}</span>
                      </button>

                      <button
                        onClick={() => onOpenOrder(demo)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#2B47EE] hover:bg-[#203CD4] active:bg-[#1E3A8A] text-[#FFFFFF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>{t('অর্ডার করুন', 'Order Now')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      {/* Note: Assurance banner "talk us directly 24/7" removed as requested */}
    </div>
  );
}
