import React, { useState } from 'react';
import { 
  Search, ArrowLeft, Eye, ArrowRight, Star, 
  CheckCircle2, Zap, ExternalLink, ShieldCheck, Server
} from 'lucide-react';
import { WebsiteDemo, WebsiteCategory } from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';

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

  const getCategoryLabel = (cat: WebsiteCategory) => {
    switch (cat) {
      case 'ecommerce': return 'ই-কমার্স শপ';
      case 'restaurant': return 'রেস্তোরাঁ ও ক্যাফে';
      case 'blogging': return 'ব্লগ ও মিডিয়া';
      case 'grocery': return 'মুদি ও সুপারশপ';
      default: return 'সকল ওয়েবসাইট';
    }
  };

  const filteredDemos = WEBSITE_DEMOS.filter((demo) => {
    const matchesCategory = activeCategory === 'all' || demo.category === activeCategory;
    const matchesSearch = 
      demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (demo.banglaTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      demo.fourDigitCode.includes(searchQuery) ||
      demo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-2">
      {/* 1. Compact Top Bar (~10% Screen): Simple Return Indicator + Top Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mb-5">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-[0_2px_12px_rgba(13,37,61,0.03)] flex items-center justify-between gap-3">
          {/* Left: Simple Indicator Button (Clean, no text) */}
          <div className="flex items-center">
            <button
              onClick={onChangeCategoryLanding}
              id="dashboard-back-indicator-btn"
              aria-label="Return to Category Selection"
              title="ক্যাটাগরি পেজে ফিরুন"
              className="w-10 h-10 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] active:bg-[#533AFD] active:text-[#FFFFFF] text-[#533AFD] border border-[#E5EDF5] hover:border-[#533AFD]/30 transition-all flex items-center justify-center cursor-pointer shadow-2xs group shrink-0"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
          </div>

          {/* Right: Search Input at Top */}
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="w-4 h-4 text-[#7D8BA4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="কোড বা নাম দিয়ে খুঁজুন (যেমন #1042)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all"
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

      {/* 2. Websites Grid: Compact, Space-Optimized with Image Preview Option & Same-Line Price */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {filteredDemos.length === 0 ? (
          <div className="w-full p-12 text-center bg-[#F8FAFD] rounded-3xl border border-[#E5EDF5]">
            <p className="text-base font-bold text-[#0D253D]">কোনো ওয়েবসাইট পাওয়া যায়নি</p>
            <p className="text-xs text-[#64748D] mt-1">অনুসন্ধান বা ফিল্টারিং পরিবর্তন করে দেখুন।</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] cursor-pointer"
            >
              সবগুলো রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredDemos.map((demo) => {
              return (
                <div
                  key={demo.id}
                  className="group bg-[#FFFFFF] hover:bg-[#F8FAFD] rounded-2xl sm:rounded-3xl border border-[#E5EDF5] hover:border-[#533AFD] transition-all duration-300 shadow-[0_4px_16px_rgba(13,37,61,0.03)] hover:shadow-[0_16px_36px_rgba(83,58,253,0.1)] flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                >
                  {/* Top Image Preview: Only explicit click on Preview button triggers navigation */}
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
                        className="px-4 py-2.5 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] text-[#FFFFFF] text-xs font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>প্রিভিউ ওয়েবসাইট</span>
                      </button>
                    </div>

                    {/* Bottom overlay: rating only (domain removed) */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[#FFFFFF]">
                      <div className="flex items-center gap-1 text-[11px] font-bold bg-[#0D253D]/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-[#FFD552] text-[#FFD552]" />
                        <span>{demo.rating}</span>
                        <span className="opacity-80 text-[10px]">({demo.ordersCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content - Ultra Clean Layout */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#FFFFFF]">
                    <div>
                      {/* Top Bar: Category Pill + 24h Setup on Left, Making Charge on Right */}
                      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#E5EDF5]">
                        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#E2E4FF] text-[#533AFD] text-[11px] font-extrabold tracking-tight truncate">
                            {demo.categoryLabel}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#00B261]/10 text-[10px] font-bold text-[#008A4B] shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00B261] animate-pulse" />
                            <span>২৪ ঘণ্টা রেডি</span>
                          </span>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F8FAFD] border border-[#E5EDF5] text-xs font-black text-[#533AFD] tracking-tight">
                            ১,৯৯০ ৳ মেকিং
                          </span>
                        </div>
                      </div>

                      {/* Clean Title (without redundant code prefix) */}
                      <h3 className="text-sm sm:text-base font-black text-[#0D253D] group-hover:text-[#533AFD] transition-colors line-clamp-1 mb-1.5">
                        {demo.title.replace(/^#\d+\s*/, '')}
                      </h3>

                      {/* Clean Description */}
                      <p className="text-xs text-[#64748D] line-clamp-2 leading-relaxed mb-3">
                        {demo.description}
                      </p>

                      {/* Upgraded Clean Monthly Maintenance Section */}
                      <div className="w-full mb-3.5 px-3 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] hover:border-[#533AFD]/30 transition-all flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center shrink-0 shadow-2xs">
                            <Server className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-[#0D253D] truncate">
                            মাসিক মেইনটেন্যান্স ও হোস্টিং
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#FFFFFF] border border-[#E5EDF5] text-xs font-black text-[#533AFD] font-mono shadow-2xs">
                            ১২০ ৳
                          </span>
                          <span className="text-[10px] text-[#64748D] font-bold">/মাস</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Clean & High-Contrast */}
                    <div className="pt-3 border-t border-[#E5EDF5] grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onOpenLiveDemo(demo)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] hover:border-[#533AFD]/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>লাইভ ডেমো</span>
                      </button>

                      <button
                        onClick={() => onOpenOrder(demo)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>অর্ডার করুন</span>
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

      {/* Assurance banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#0D253D]">
                সরাসরি কথা বলে নিশ্চিত হয়ে অর্ডার করুন
              </h4>
              <p className="text-[11px] text-[#64748D]">
                আমাদের ইঞ্জিনিয়ার সরাসরি আপনাকে ফোন করে সব রিকোয়ারমেন্ট নিশ্চিত করবেন।
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#00B261] hover:bg-[#009e56] text-[#FFFFFF] text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs shrink-0"
          >
            WhatsApp কনসাল্টেশন
          </a>
        </div>
      </section>
    </div>
  );
}
