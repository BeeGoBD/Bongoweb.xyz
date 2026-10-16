import React from 'react';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  BookOpen, 
  ShoppingCart, 
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles
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

export default function DashboardView({
  onOpenOrder,
  onSelectCategoryWebsites
}: DashboardViewProps) {
  const { language, t } = useLanguage();

  // Exactly 4 categories in vertical cards as specified in user brief
  const categories = [
    {
      id: 'ecommerce' as WebsiteCategory,
      titleEn: 'E-commerce Shop',
      titleBn: 'ই-কমার্স শপ',
      descEn: 'Online store for your products',
      descBn: 'পণ্য বিক্রির অনলাইন স্টোর ও কুরিয়ার ট্র্যাকিং',
      icon: ShoppingBag,
      codeHint: '#2085'
    },
    {
      id: 'restaurant' as WebsiteCategory,
      titleEn: 'Restaurant & Cafe',
      titleBn: 'রেস্তোরাঁ ও ক্যাফে',
      descEn: 'Menu, orders & online presence',
      descBn: 'ডিজিটাল ফুড মেনু, টেবিল বুকিং ও হোম ডেলিভারি',
      icon: UtensilsCrossed,
      codeHint: '#1042'
    },
    {
      id: 'blogging' as WebsiteCategory,
      titleEn: 'Blog & Media',
      titleBn: 'ব্লগ ও মিডিয়া',
      descEn: 'Share stories & grow audience',
      descBn: 'নিউজ, ম্যাগাজিন, দ্রুত গুগল র‍্যাংকিং ও এডসেন্স',
      icon: BookOpen,
      codeHint: '#3091'
    },
    {
      id: 'grocery' as WebsiteCategory,
      titleEn: 'Grocery & Supermarket',
      titleBn: 'মুদি ও সুপারমার্কেট',
      descEn: 'Everyday essentials, delivered',
      descBn: 'নিত্যপ্রয়োজনীয় গ্রোসারি ও এক্সপ্রেস ডেলিভারি',
      icon: ShoppingCart,
      codeHint: '#4150'
    }
  ];

  const handleCardClick = (catId: WebsiteCategory) => {
    if (onSelectCategoryWebsites) {
      onSelectCategoryWebsites(catId);
    } else {
      const demo = WEBSITE_DEMOS.find(d => d.category === catId) || WEBSITE_DEMOS[0];
      onOpenOrder(demo);
    }
  };

  return (
    <div 
      id="dashboard-home-view"
      data-view="dashboard"
      className="w-full min-h-[calc(100vh-4rem)] bg-[#F8F5FC] text-[#1F1F2E] font-sans pb-24 sm:pb-28"
    >
      {/* 1. Purple Header Extension / Hero Section (Flows seamlessly with the #5B2C8A Header) */}
      <section className="w-full bg-[#5B2C8A] text-white pt-6 pb-16 sm:pt-8 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle background ambient purple glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#7C3AED]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#4A1F6E]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center relative z-10 px-2">
          {/* One line main heading */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {language === 'bn' ? 'আপনার ব্যবসার ক্যাটাগরি বেছে নিন' : 'Choose Your Business Category'}
          </h1>
          
          {/* One line subtext */}
          <p className="text-xs sm:text-sm text-purple-100/90 font-medium mt-1.5 sm:mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
            {language === 'bn' 
              ? 'পছন্দের ক্যাটাগরি বেছে নিয়ে লাইভ ওয়েবসাইট টেমপ্লেট দেখুন' 
              : 'Select your business category to explore live website templates'}
          </p>
        </div>
      </section>

      {/* 2. Overlapping White Rounded Container with Soft Shadow */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 relative z-20">
        <div className="w-full bg-[#FFFFFF] rounded-[20px] border border-[#EDE4F5] shadow-[0_10px_35px_-5px_rgba(91,44,138,0.12)] p-4 sm:p-6 md:p-7">
          
          <div className="mb-4 pb-3 border-b border-[#EDE4F5] flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#1F1F2E]">
              {language === 'bn' ? 'ক্যাটাগরি তালিকা' : 'Available Categories'}
            </span>
            <span className="text-[11px] font-semibold text-[#5B2C8A] bg-[#F8F5FC] px-2.5 py-0.5 rounded-full border border-[#EDE4F5]">
              {categories.length} {language === 'bn' ? 'টি ক্যাটাগরি' : 'Categories'}
            </span>
          </div>

          {/* Category List: 4 items in vertical cards */}
          <div className="space-y-3 sm:space-y-3.5">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleCardClick(cat.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${cat.titleEn}`}
                  className="group w-full p-4 sm:p-4.5 rounded-[16px] bg-[#FFFFFF] hover:bg-[#F8F5FC] border border-[#EDE4F5] hover:border-[#5B2C8A]/40 shadow-xs hover:shadow-[0_4px_16px_rgba(91,44,138,0.08)] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
                >
                  {/* Left: Purple Rounded Icon */}
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#F8F5FC] group-hover:bg-[#5B2C8A] text-[#5B2C8A] group-hover:text-white border border-[#EDE4F5] flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  {/* Middle: Bold Title + Gray Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-[#1F1F2E] group-hover:text-[#5B2C8A] transition-colors truncate">
                        {language === 'bn' ? cat.titleBn : cat.titleEn}
                      </h2>
                      {idx === 0 && (
                        <span className="text-[10px] font-bold text-[#5B2C8A] bg-[#F8F5FC] border border-[#EDE4F5] px-2 py-0.2 rounded-full hidden xs:inline-block">
                          {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280] font-normal mt-0.5 truncate leading-relaxed">
                      {language === 'bn' ? cat.descBn : cat.descEn}
                    </p>
                  </div>

                  {/* Right: Chevron Arrow (>) */}
                  <div className="w-8 h-8 rounded-xl bg-transparent group-hover:bg-white text-[#6B7280] group-hover:text-[#5B2C8A] flex items-center justify-center shrink-0 transition-all border border-transparent group-hover:border-[#EDE4F5]">
                    <ChevronRight className="w-5 h-5 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action: Explore All Templates */}
          <div className="mt-5 pt-4 border-t border-[#EDE4F5] text-center">
            <button
              type="button"
              onClick={() => handleCardClick('all')}
              className="w-full py-3 px-4 rounded-xl bg-[#F8F5FC] hover:bg-[#EDE4F5]/60 text-[#5B2C8A] hover:text-[#4A1F6E] border border-[#EDE4F5] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>
                {language === 'bn' 
                  ? 'সবগুলো রেডি টেমপ্লেট একসাথে দেখুন' 
                  : 'Browse All Ready Website Templates'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Feature Signals & Trust Footnote */}
        <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-xs text-[#6B7280] flex-wrap font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>{t('২৪ ঘণ্টায় ডেলিভারি', '24-Hour Launch')}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>{t('১০০% মোবাইল রেসপন্সিভ', '100% Mobile Ready')}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>{t('লাইভ কাস্টমার সাপোর্ট', '24/7 Live Support')}</span>
          </span>
        </div>
      </section>
    </div>
  );
}
