import React from 'react';
import { 
  ShoppingBasket, UtensilsCrossed, Newspaper, Store, 
  ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2, 
  Headphones, Globe, Star
} from 'lucide-react';
import { WebsiteCategory } from '../types';

interface CategorySelectionLandingProps {
  onSelectCategory: (category: WebsiteCategory) => void;
}

export default function CategorySelectionLanding({ onSelectCategory }: CategorySelectionLandingProps) {
  const categories = [
    {
      id: 'ecommerce' as WebsiteCategory,
      titleEnglish: 'E-Commerce & Store',
      titleBangla: 'ই-কমার্স ও অনলাইন শপ',
      descriptionEnglish: 'Online shop with cart, automated bKash/card checkout, inventory, and courier tracking.',
      descriptionBangla: 'অনলাইন শপিং, পেমেন্ট গেটওয়ে, অটো কুরিয়ার ট্র্যাকিং ও ইনভেন্টরি।',
      icon: ShoppingBasket,
      tag: 'সবচেয়ে জনপ্রিয়',
      badgeColor: '#533AFD',
      continueTextBangla: 'ই-কমার্স নির্বাচন করুন',
      continueTextEnglish: 'Continue with E-Commerce',
      features: ['bKash & Card Gateway', 'Pathao / Steadfast API', 'SMS Order Alerts']
    },
    {
      id: 'restaurant' as WebsiteCategory,
      titleEnglish: 'Cafe & Restaurant',
      titleBangla: 'ক্যাফে ও রেস্তোরাঁ',
      descriptionEnglish: 'Interactive food menu, online table booking, takeaway delivery dispatch, and chef specials.',
      descriptionBangla: 'ডিজিটাল ফুড মেনু, টেবিল বুকিং ও অনলাইন পার্সেল ডেলিভারি।',
      icon: UtensilsCrossed,
      tag: 'ফুড ও ডাইনিং',
      badgeColor: '#FF6118',
      continueTextBangla: 'রেস্তোরাঁ নির্বাচন করুন',
      continueTextEnglish: 'Continue with Restaurant',
      features: ['QR Digital Dine-in Menu', 'Online Table Reservation', 'Parcel & Food Booking']
    },
    {
      id: 'blogging' as WebsiteCategory,
      titleEnglish: 'Blogs & Articles',
      titleBangla: 'ব্লগ ও আর্টিকেল',
      descriptionEnglish: 'SEO-ready news portal, editorial magazine, reading archives, social share, and Google AdSense.',
      descriptionBangla: 'নিউজ পোর্টাল, আর্টিকেল প্রকাশনা ও গুগল অ্যাডসেন্স ফ্রেন্ডলি।',
      icon: Newspaper,
      tag: 'মিডিয়া ও প্রকাশনা',
      badgeColor: '#533AFD',
      continueTextBangla: 'ব্লগ সাইট নির্বাচন করুন',
      continueTextEnglish: 'Continue with Blogs',
      features: ['Google AdSense Ready', 'Social Share System', 'Newsletter & Archives']
    },
    {
      id: 'grocery' as WebsiteCategory,
      titleEnglish: 'Groceries & Supershop',
      titleBangla: 'মুদি ও গ্রোসারি শপ',
      descriptionEnglish: 'Fast daily essential ordering, weight-based pricing, fresh farm produce, and COD delivery.',
      descriptionBangla: 'নিত্যপ্রয়োজনীয় কাঁচাবাজার, ওজন হিসাব ও ফাস্ট হোম ডেলিভারি।',
      icon: Store,
      tag: 'নিত্যপ্রয়োজনীয়',
      badgeColor: '#00B261',
      continueTextBangla: 'গ্রোসারি নির্বাচন করুন',
      continueTextEnglish: 'Continue with Groceries',
      features: ['Weight & Unit Cart System', 'Area-based Fast Delivery', 'Cash on Delivery Ready']
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0D253D] flex flex-col font-sans">
      {/* Top Header */}
      <header className="w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5EDF5] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[68px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#533AFD] text-white flex items-center justify-center font-black text-sm shadow-[0_4px_12px_rgba(83,58,253,0.3)]">
              BW
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0D253D]">
                  BongoWeb
                </span>
                <span className="text-xs font-bold text-[#533AFD] ml-1">.xyz</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748D] -mt-0.5">
                Stripe-Standard Architecture
              </span>
            </div>
          </div>

          {/* Quick Info & Direct Chat indicator */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8FAFD] text-[#273951] border border-[#E5EDF5]">
              <span className="w-2 h-2 rounded-full bg-[#00B261] animate-pulse"></span>
              ২৪/৭ লাইভ সাপোর্ট সক্রিয়
            </span>
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs sm:text-sm font-semibold text-[#533AFD] hover:text-[#665EFD] transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-[#E2E4FF]/60"
            >
              সব ওয়েবসাইট দেখুন →
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 w-full flex flex-col justify-center">
        {/* Subtle Top Accent Pill */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E2E4FF] text-[#533AFD] border border-[#533AFD]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ওয়েবসাইট ক্যাটাগরি নির্বাচন করুন • Step 1</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0D253D] tracking-tight leading-[1.15] mb-4">
            আপনার ব্যবসার জন্য সঠিক{' '}
            <span className="bg-gradient-to-r from-[#533AFD] via-[#7F7DFC] to-[#BDB4FF] bg-clip-text text-transparent">
              ক্যাটাগরি বেছে নিন
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#64748D] leading-relaxed max-w-2xl mx-auto">
            Choose your category below. All four options are aligned in one single section with dedicated continuation buttons to take you straight to your verified website dashboard.
          </p>
        </div>

        {/* 4 CATEGORIES IN ONE SECTION - 4 COLUMNS SIDE BY SIDE NEXT TO EACH OTHER */}
        <div className="w-full bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] p-4 sm:p-6 lg:p-7 shadow-[0_8px_30px_rgba(13,37,61,0.04)] mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="group relative bg-[#F8FAFD] hover:bg-[#FFFFFF] border-2 border-[#E5EDF5] hover:border-[#533AFD] rounded-2xl p-5 transition-all duration-300 shadow-[0_2px_10px_rgba(13,37,61,0.02)] hover:shadow-[0_12px_28px_rgba(83,58,253,0.12)] cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    {/* Top Icon & Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs"
                        style={{ 
                          backgroundColor: '#E2E4FF', 
                          color: cat.badgeColor 
                        }}
                      >
                        <IconComponent className="w-6 h-6 stroke-[2.2]" />
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E5EDF5] text-[#273951] shadow-2xs">
                        {cat.tag}
                      </span>
                    </div>

                    {/* Titles */}
                    <h3 className="text-base sm:text-lg font-black text-[#0D253D] group-hover:text-[#533AFD] transition-colors mb-0.5">
                      {cat.titleBangla}
                    </h3>
                    <p className="text-xs font-semibold text-[#533AFD] mb-2.5">
                      {cat.titleEnglish}
                    </p>

                    {/* Descriptions */}
                    <p className="text-xs text-[#273951] mb-1.5 font-medium leading-relaxed">
                      {cat.descriptionBangla}
                    </p>
                    <p className="text-[11px] text-[#64748D] mb-4 leading-relaxed line-clamp-2">
                      {cat.descriptionEnglish}
                    </p>

                    {/* Features list */}
                    <div className="space-y-1.5 mb-5 pt-3 border-t border-[#E5EDF5]">
                      {cat.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-[#273951]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00B261] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Continuing Button */}
                  <div className="w-full pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory(cat.id);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer group-hover:shadow-md"
                    >
                      <span>{cat.continueTextBangla}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                    <span className="block text-center text-[10px] text-[#7D8BA4] mt-1 font-medium">
                      {cat.continueTextEnglish}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar inside the Category Sector: View all templates */}
          <div className="mt-6 pt-4 border-t border-[#E5EDF5] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold text-[#0D253D]">
                সবগুলো ক্যাটাগরি একসাথে দেখতে চান?
              </p>
              <p className="text-[11px] text-[#64748D]">
                Browse all e-commerce, restaurant, blog, and grocery templates together in one master dashboard.
              </p>
            </div>
            <button
              onClick={() => onSelectCategory('all')}
              className="px-4 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] hover:border-[#533AFD]/40 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              সবগুলো ক্যাটাগরি ড্যাশবোর্ড →
            </button>
          </div>
        </div>

        {/* The 4-Column Aligned Strip: 24/7 Delivery, Free Domain, 100% Money-back Guarantee, 24/7 Live Support */}
        <div className="w-full pt-6 border-t border-[#E5EDF5]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] hover:border-[#533AFD]/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-xs font-bold text-[#0D253D]">২৪ ঘণ্টা ডেলিভারি</h5>
              <p className="text-[11px] text-[#64748D] mt-0.5 font-medium">24-Hour Express Setup</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] hover:border-[#533AFD]/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <Globe className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-xs font-bold text-[#0D253D]">ফ্রি .com ডোমেইন</h5>
              <p className="text-[11px] text-[#64748D] mt-0.5 font-medium">Free Domain & Cloud Host</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] hover:border-[#00B261]/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-xs font-bold text-[#0D253D]">১০০% মানিব্যাক গ্যারান্টি</h5>
              <p className="text-[11px] text-[#64748D] mt-0.5 font-medium">Safe & Verified Quality</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] hover:border-[#533AFD]/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-xs font-bold text-[#0D253D]">২৪/৭ লাইভ সাপোর্ট</h5>
              <p className="text-[11px] text-[#64748D] mt-0.5 font-medium">Dedicated WhatsApp Team</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-5 border-t border-[#E5EDF5] bg-[#F8FAFD] text-center text-xs text-[#64748D]">
        <p>© 2026 BongoWeb.xyz — All Rights Reserved. Engineered with Stripe Design Standards.</p>
      </footer>
    </div>
  );
}
