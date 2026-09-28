import React, { useState } from 'react';
import { 
  Search, ExternalLink, Sparkles, CheckCircle2, 
  ShoppingBag, Star, Zap, Eye, PhoneCall, ShieldCheck, 
  Layers, ArrowRight, ArrowLeft, RefreshCw
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
  const [activeCategory, setActiveCategory] = useState<WebsiteCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all' as WebsiteCategory, labelBangla: 'সকল ওয়েবসাইট', labelEnglish: 'All Websites' },
    { id: 'ecommerce' as WebsiteCategory, labelBangla: 'ই-কমার্স শপ', labelEnglish: 'E-Commerce' },
    { id: 'restaurant' as WebsiteCategory, labelBangla: 'রেস্তোরাঁ ও ক্যাফে', labelEnglish: 'Restaurant' },
    { id: 'blogging' as WebsiteCategory, labelBangla: 'ব্লগ ও মিডিয়া', labelEnglish: 'Blogging' },
    { id: 'grocery' as WebsiteCategory, labelBangla: 'মুদি ও সুপারশপ', labelEnglish: 'Grocery' },
  ];

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
    <div className="w-full flex flex-col font-sans pb-28 pt-4">
      {/* Category Header Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="bg-gradient-to-br from-[#F8FAFD] to-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-5 sm:p-7 shadow-[0_4px_20px_rgba(13,37,61,0.03)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-[11px] font-bold border border-[#533AFD]/20">
                  Verified 2026 Collection
                </span>
                <span className="text-xs font-semibold text-[#64748D]">
                  {filteredDemos.length} টি ওয়েবসাইট প্রস্তুত
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0D253D] tracking-tight">
                প্রিমিয়াম বিজনেস ওয়েবসাইট ড্যাশবোর্ড
              </h1>
              <p className="text-xs sm:text-sm text-[#64748D] mt-1">
                Explore fully built, production-ready website templates with 24-hour setup, free .com domain, and dedicated support.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onChangeCategoryLanding}
                className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#E5EDF5] text-[#273951] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#533AFD]" />
                <span>ক্যাটাগরি পেজে ফিরুন</span>
              </button>
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="mt-5 pt-4 border-t border-[#E5EDF5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#533AFD] text-[#FFFFFF] shadow-xs'
                        : 'bg-[#FFFFFF] text-[#273951] hover:bg-[#E2E4FF] hover:text-[#533AFD] border border-[#E5EDF5]'
                    }`}
                  >
                    <span>{cat.labelBangla}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 md:w-72">
              <Search className="w-4 h-4 text-[#7D8BA4] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="কোড বা নাম দিয়ে খুঁজুন (যেমন #1042)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7D8BA4] hover:text-[#0D253D]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Websites Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {filteredDemos.length === 0 ? (
          <div className="w-full p-12 text-center bg-[#F8FAFD] rounded-3xl border border-[#E5EDF5]">
            <p className="text-base font-bold text-[#0D253D]">কোনো ওয়েবসাইট পাওয়া যায়নি</p>
            <p className="text-xs text-[#64748D] mt-1">অন্য কোনো ক্যাটাগরি বা কীওয়ার্ড দিয়ে অনুসন্ধান করুন।</p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD]"
            >
              সকল ওয়েবসাইট দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredDemos.map((demo) => {
              return (
                <div
                  key={demo.id}
                  className="group bg-[#FFFFFF] hover:bg-[#F8FAFD] rounded-3xl border border-[#E5EDF5] hover:border-[#533AFD] transition-all duration-300 shadow-[0_4px_16px_rgba(13,37,61,0.04)] hover:shadow-[0_16px_36px_rgba(83,58,253,0.1)] flex flex-col justify-between overflow-hidden hover:-translate-y-1"
                >
                  {/* Top Image Preview with Badges */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#E5EDF5]">
                    <img
                      src={demo.previewImage}
                      alt={demo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D253D]/80 via-transparent to-transparent opacity-60" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0D253D]/90 backdrop-blur-md text-[#FFFFFF] text-[11px] font-mono font-bold shadow-xs">
                        {demo.fourDigitCode}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FFFFFF]/90 backdrop-blur-md text-[#533AFD] text-[11px] font-bold shadow-xs">
                        {demo.categoryLabel}
                      </span>
                    </div>

                    {/* Top Right Live Preview Tag */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00B261] text-[#FFFFFF] text-[10px] font-extrabold shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse"></span>
                        LIVE
                      </span>
                    </div>

                    {/* Bottom overlay title info */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[#FFFFFF]">
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#FFD552] text-[#FFD552]" />
                        <span>{demo.rating}</span>
                        <span className="opacity-80 text-[10px]">({demo.ordersCount})</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#FFFFFF]/90">
                        {demo.demoUrl}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-[#0D253D] group-hover:text-[#533AFD] transition-colors line-clamp-1 mb-1">
                        {demo.title}
                      </h3>

                      {/* Description in English */}
                      <p className="text-xs text-[#273951] line-clamp-2 leading-relaxed mb-4">
                        {demo.description}
                      </p>

                      {/* Key Features Checkmarks */}
                      <div className="space-y-1.5 mb-5 pt-3 border-t border-[#E5EDF5]">
                        {demo.features.slice(0, 3).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs text-[#273951]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00B261] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="pt-4 border-t border-[#E5EDF5]">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#64748D] block">
                            প্যাকেজ রেট
                          </span>
                          <span className="text-sm font-black text-[#533AFD]">
                            {demo.priceTag}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#00B261] bg-[#F8FAFD] px-2 py-0.5 rounded border border-[#E5EDF5]">
                          ⚡ 24h Setup Ready
                        </span>
                      </div>

                      {/* 2 Buttons: Live Demo & Order Now */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onOpenLiveDemo(demo)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] hover:border-[#533AFD]/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
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
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Assurance banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-10">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#F8FAFD] border border-[#E5EDF5] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-[#0D253D]">
                সরাসরি কথা বলে নিশ্চিত হয়ে অর্ডার করুন
              </h4>
              <p className="text-[11px] sm:text-xs text-[#64748D]">
                Our engineering team will call you to clarify requirements before taking advance payments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#00B261] hover:bg-[#009e56] text-[#FFFFFF] text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              WhatsApp কনসাল্টেশন
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
