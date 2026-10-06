import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ArrowLeft, Eye, ArrowRight, Star, 
  Server, RefreshCw, Sparkles
} from 'lucide-react';
import { WebsiteDemo, WebsiteCategory, UserAccount } from '../types';
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
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<any>(null);
  const { language, t } = useLanguage();

  // Scroll watcher for Dynamic Scroll Interaction
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 700);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Exactly one mock website as requested by the user for testing & editing
  const fallbackSingleMock = [WEBSITE_DEMOS[0]];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (_) {}

    const handleUserSync = () => {
      try {
        const stored = localStorage.getItem('bongoweb_user');
        setCurrentUser(stored ? JSON.parse(stored) : null);
      } catch (_) {
        setCurrentUser(null);
      }
    };
    window.addEventListener('storage', handleUserSync);
    window.addEventListener('bongoweb_credentials_updated', handleUserSync);
    return () => {
      window.removeEventListener('storage', handleUserSync);
      window.removeEventListener('bongoweb_credentials_updated', handleUserSync);
    };
  }, []);

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
      {/* Notice: Unverified Mobile Number (24-Hour Call Policy) */}
      {currentUser && currentUser.numberVerified !== true && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mb-3">
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span>
                <strong>নম্বর ভেরিফিকেশন অপেক্ষমান ({currentUser.phone || 'মোবাইল নম্বর'})</strong>: আমাদের টিম সর্বোচ্চ ২৪ ঘণ্টার মধ্যে কল করবে। কল রিসিভ না করলে বা রেসপন্স না পেলে ২৪ ঘণ্টা পর অ্যাকাউন্ট সাময়িকভাবে সীমাবদ্ধ (Restrict) করা হবে।
              </span>
            </div>
            <a 
              href="/account/terms" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/account/terms');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="underline font-bold text-amber-800 hover:text-indigo-600 shrink-0 self-end sm:self-auto cursor-pointer"
            >
              ভেরিফিকেশন নীতিমালা →
            </a>
          </div>
        </section>
      )}

      {/* 1. Compact Top Bar: Return Indicator + Top Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mb-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between gap-3">
          {/* Left: Clean Return Button & Context */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onChangeCategoryLanding}
              id="dashboard-back-indicator-btn"
              aria-label="Return to Category Selection"
              title={t('ক্যাটাগরি পেজে ফিরুন', 'Return to Category Selection')}
              className="h-9 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-800 transition-transform group-hover:-translate-x-0.5" />
              <span className="text-xs font-bold hidden sm:inline text-slate-700">
                {t('ক্যাটাগরি', 'Categories')}
              </span>
            </button>

            {/* Subtle Divider & Category Title */}
            <div className="hidden sm:flex items-center gap-2 pl-2.5 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                {getCategoryLabel(activeCategory)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-[10px] font-bold font-mono">
                {filteredDemos.length}
              </span>
            </div>
          </div>

          {/* Right: Modern Clean Search Input */}
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t('কোড বা নাম দিয়ে খুঁজুন...', 'Search by code or name...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2B47EE] focus:ring-2 focus:ring-[#2B47EE]/15 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-4 h-4 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] transition-colors cursor-pointer"
                aria-label="Clear search"
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

                      {/* Monthly Maintenance Section - Standardized exact string */}
                      <div className="w-full mb-3.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#AB55F7]/30 transition-all flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-[#AB55F7]/10 text-[#9333EA] flex items-center justify-center shrink-0 shadow-2xs">
                            <Server className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {language === 'en' ? 'Monthly Cost 250 BDT' : 'মাসিক খরচ ২৫০ টাকা'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-black text-[#9333EA] font-mono shadow-2xs">
                            {language === 'en' ? '250 BDT' : '২৫০ ৳'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {t('/মাস', '/mo')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Unified BongoWeb Brand & Modern Blue Accent */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onOpenLiveDemo(demo)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-[#AB55F7]/10 text-[#9333EA] border border-slate-200 hover:border-[#AB55F7]/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('লাইভ ডেমো', 'Live Demo')}</span>
                      </button>

                      <button
                        onClick={() => onOpenOrder(demo)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#AB55F7] via-[#9333EA] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] active:scale-[0.98] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_16px_rgba(171,85,247,0.35)]"
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

      {/* Dynamic Scroll Interaction: Lightweight Floating "View Preview" Pill */}
      <div
        className={`fixed bottom-20 sm:bottom-22 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300 transform select-none ${
          isScrolling ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#AB55F7] to-[#7C3AED] text-white text-xs font-black shadow-[0_8px_24px_rgba(171,85,247,0.45)] border border-white/20 backdrop-blur-md">
          <Eye className="w-3.5 h-3.5 animate-pulse text-white" />
          <span className="tracking-wide">View Preview • প্রিভিউ দেখুন</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>
    </div>
  );
}
