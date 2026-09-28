import React, { useState } from 'react';
import { 
  ShoppingBasket, UtensilsCrossed, Newspaper, Store, 
  ArrowRight, ShieldCheck, Zap, Sparkles, Headphones, Globe,
  ChevronRight, CheckCircle2, Clock, Star, PhoneCall, Laptop, CreditCard, Lock
} from 'lucide-react';
import { WebsiteCategory } from '../types';

interface CategorySelectionLandingProps {
  onSelectCategory: (category: WebsiteCategory) => void;
}

export default function CategorySelectionLanding({ onSelectCategory }: CategorySelectionLandingProps) {
  const [selectedId, setSelectedId] = useState<WebsiteCategory | null>(null);

  // CATEGORY DESIGN IS 100% PRESERVED EXACTLY AS IS
  const categories = [
    {
      id: 'ecommerce' as WebsiteCategory,
      titleBangla: 'ই-কমার্স ও শপ',
      titleEnglish: 'E-Commerce',
      icon: ShoppingBasket,
      tag: 'জনপ্রিয়',
      accentColor: '#533AFD'
    },
    {
      id: 'restaurant' as WebsiteCategory,
      titleBangla: 'ক্যাফে ও রেস্তোরাঁ',
      titleEnglish: 'Restaurant',
      icon: UtensilsCrossed,
      tag: 'ফুড & ক্যাফে',
      accentColor: '#FF6118'
    },
    {
      id: 'blogging' as WebsiteCategory,
      titleBangla: 'ব্লগ ও আর্টিকেল',
      titleEnglish: 'Blogs & Media',
      icon: Newspaper,
      tag: 'মিডিয়া',
      accentColor: '#533AFD'
    },
    {
      id: 'grocery' as WebsiteCategory,
      titleBangla: 'মুদি ও গ্রোসারি',
      titleEnglish: 'Groceries',
      icon: Store,
      tag: 'নিত্যপণ্য',
      accentColor: '#00B261'
    }
  ];

  const handleCardClick = (catId: WebsiteCategory) => {
    setSelectedId(catId);
    setTimeout(() => {
      onSelectCategory(catId);
    }, 120);
  };

  const handleGoToMainSection = () => {
    onSelectCategory(selectedId || 'all');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FFFFFF] text-[#0D253D] flex flex-col font-sans overflow-x-hidden selection:bg-[#E2E4FF] selection:text-[#533AFD]">
      {/* 1. Top Header */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#E5EDF5] sticky top-0 z-30 h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#533AFD] text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_3px_10px_rgba(83,58,253,0.3)]">
            BW
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline leading-tight">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#0D253D]">
                BongoWeb
              </span>
              <span className="text-xs font-bold text-[#533AFD] ml-0.5">.xyz</span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#64748D] -mt-0.5 hidden xs:block">
              Stripe Design System
            </span>
          </div>
        </div>

        {/* Quick Info & Direct Transition */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8FAFD] text-[#273951] border border-[#E5EDF5]">
            <span className="w-2 h-2 rounded-full bg-[#00B261] animate-pulse"></span>
            ২৪/৭ লাইভ সক্রিয়
          </span>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs sm:text-sm font-bold text-[#533AFD] hover:text-[#665EFD] transition-colors py-1.5 px-3 rounded-xl hover:bg-[#E2E4FF] cursor-pointer"
          >
            সব ওয়েবসাইট →
          </button>
        </div>
      </header>

      {/* 2. Main Section: EXACT UNTOUCHED CATEGORY SELECTION */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-10 pb-8">
        {/* Heading Section */}
        <div className="text-center mb-5 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0D253D] tracking-tight leading-tight">
            ব্যবসার ক্যাটাগরি{' '}
            <span className="text-[#533AFD]">নির্বাচন করুন</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#64748D] mt-1.5">
            যেকোনো একটি ক্যাটাগরিতে ক্লিক করলেই সরাসরি ওয়েবসাইটে নিয়ে যাবে।
          </p>
        </div>

        {/* 4 Category Cards: EXACT SAME CARDS AND SIZING AS REQUESTED */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 items-stretch">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isChosen = selectedId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat.id)}
                className={`group relative bg-[#F8FAFD] hover:bg-[#FFFFFF] border-2 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-[0_2px_10px_rgba(13,37,61,0.02)] hover:shadow-[0_12px_28px_rgba(83,58,253,0.12)] hover:-translate-y-1 active:scale-[0.98] ${
                  isChosen
                    ? 'border-[#533AFD] bg-[#FFFFFF] ring-2 ring-[#533AFD]/20 scale-[1.01]'
                    : 'border-[#E5EDF5] hover:border-[#533AFD]'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E5EDF5] text-[#273951] shadow-2xs">
                    {cat.tag}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                </div>

                {/* Centered Icon & Titles */}
                <div className="my-auto py-3 flex flex-col items-center text-center">
                  <div 
                    className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-xs mb-3"
                    style={{ 
                      backgroundColor: '#E2E4FF', 
                      color: cat.accentColor 
                    }}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#0D253D] group-hover:text-[#533AFD] transition-colors leading-snug">
                    {cat.titleBangla}
                  </h3>
                  <p className="text-xs font-bold text-[#533AFD] mt-0.5">
                    {cat.titleEnglish}
                  </p>
                </div>

                {/* Selection Cue */}
                <div className="pt-3 border-t border-[#E5EDF5] flex items-center justify-center text-xs font-bold text-[#64748D] group-hover:text-[#533AFD] transition-colors">
                  <span>নির্বাচন করুন →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SCROLLABLE BOTTOM DETAILS & 24H DELIVERY SECTION */}
      <section className="w-full bg-[#F8FAFD] border-t border-[#E5EDF5] py-10 sm:py-14 mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold border border-[#533AFD]/20">
              Verified Platform Assurances
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D253D] mt-2">
              প্রতিটি ওয়েবসাইটের সাথে যা থাকছে
            </h2>
            <p className="text-xs sm:text-sm text-[#64748D] mt-1">
              All website orders include express 24-hour setup, complimentary domain, cloud hosting, and guaranteed live support.
            </p>
          </div>

          {/* 4 Core Guarantees: Generous spacing, beautiful cards, scrollable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
            {/* 1: 24h Express Delivery */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-xs hover:shadow-md transition-all hover:border-[#533AFD]/40">
              <div className="w-11 h-11 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h4 className="text-base font-black text-[#0D253D]">২৪ ঘণ্টা ডেলিভারি</h4>
              <p className="text-xs font-semibold text-[#533AFD] mb-1.5">24h Express Setup</p>
              <p className="text-xs text-[#273951] leading-relaxed">
                অর্ডার নিশ্চিত করার পর মাত্র ২৪ ঘণ্টার মধ্যে সম্পূর্ণ রেডি ওয়েবসাইট লাইভ করে দেওয়া হয়।
              </p>
            </div>

            {/* 2: Free .com Domain */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-xs hover:shadow-md transition-all hover:border-[#533AFD]/40">
              <div className="w-11 h-11 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h4 className="text-base font-black text-[#0D253D]">ফ্রি .com ডোমেইন</h4>
              <p className="text-xs font-semibold text-[#533AFD] mb-1.5">Free Cloud Host & SSL</p>
              <p className="text-xs text-[#273951] leading-relaxed">
                ১ বছরের জন্য ফ্রি কাস্টম .com ডোমেইন এবং ৯৯.৯% আপটাইম বিশিষ্ট ক্লাউড সার্ভার হোস্টিং।
              </p>
            </div>

            {/* 3: 100% Money-back Guarantee */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-xs hover:shadow-md transition-all hover:border-[#00B261]/40">
              <div className="w-11 h-11 rounded-xl bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h4 className="text-base font-black text-[#0D253D]">১০০% মানিব্যাক গ্যারান্টি</h4>
              <p className="text-xs font-semibold text-[#00B261] mb-1.5">100% Refund Policy</p>
              <p className="text-xs text-[#273951] leading-relaxed">
                কাজের গুণমান বা প্রতিশ্রুত ফিচারে অসন্তুষ্ট হলে কোনো প্রশ্ন ছাড়াই সম্পূর্ণ টাকা ফেরত।
              </p>
            </div>

            {/* 4: 24/7 Live Support */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-xs hover:shadow-md transition-all hover:border-[#533AFD]/40">
              <div className="w-11 h-11 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
                <Headphones className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h4 className="text-base font-black text-[#0D253D]">২৪/৭ লাইভ সাপোর্ট</h4>
              <p className="text-xs font-semibold text-[#533AFD] mb-1.5">Dedicated WhatsApp Team</p>
              <p className="text-xs text-[#273951] leading-relaxed">
                যেকোনো সময় সরাসরি হোয়াটসঅ্যাপ বা ফোন কলে আমাদের টেকনিক্যাল টিম থেকে ইনস্ট্যান্ট সমাধান।
              </p>
            </div>
          </div>

          {/* Additional Value Banner & Fast Action */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E5EDF5] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#533AFD] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0D253D]">
                  সরাসরি লাইভ ড্যাশবোর্ড থেকে ১০০+ ওয়েবসাইট এক্সপ্লোর করুন
                </h3>
                <p className="text-xs sm:text-sm text-[#64748D] mt-1 max-w-xl">
                  ই-কমার্স, রেস্তোরাঁ, নিউজ ব্লগ কিংবা গ্রোসারি শপের রিয়েল টাইম প্রিভিউ দেখে অর্ডার করুন।
                </p>
              </div>
            </div>

            <button
              onClick={handleGoToMainSection}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>মূল ড্যাশবোর্ডে প্রবেশ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-[#E5EDF5] bg-[#FFFFFF] text-center text-xs text-[#64748D]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 BongoWeb.xyz — All Rights Reserved. Engineered with Stripe Design Standards.</p>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#533AFD]">
            <button onClick={handleGoToMainSection} className="hover:underline cursor-pointer">ড্যাশবোর্ড</button>
            <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp সাপোর্ট</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
