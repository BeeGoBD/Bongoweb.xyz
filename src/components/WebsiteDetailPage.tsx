import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, ShoppingBag, CheckCircle2, 
  MessageCircle, ChevronDown, Sparkles, Phone, ArrowDown, X
} from 'lucide-react';
import { WebsiteDemo } from '../types';
import Card3D from './Card3D';
import ThreeCanvas3D from './ThreeCanvas3D';
import { playClickSound } from '../utils/sound';
import { useLanguage } from '../utils/LanguageContext';

interface WebsiteDetailPageProps {
  demo: WebsiteDemo;
  onBackToDashboard?: () => void;
  onBack?: () => void;
  onGoToOrder: (demo: WebsiteDemo) => void;
}

export default function WebsiteDetailPage({
  demo,
  onBackToDashboard,
  onBack,
  onGoToOrder
}: WebsiteDetailPageProps) {
  const { language, t } = useLanguage();
  const handleBack = onBack || onBackToDashboard;
  const [showFeaturesChart, setShowFeaturesChart] = useState(false);
  const [show3DStage, setShow3DStage] = useState(false);
  const [showOrderChart, setShowOrderChart] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Formats URL without ever displaying domain link to user
  const getEmbedUrl = (rawUrl?: string) => {
    if (!rawUrl) return '';
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // Matching short text: Bangla for Bangla version, English for English version. Strictly in one line with no sub text.
  const afterOrderSteps = language === 'bn' ? [
    '১. ফোনে কথা বলে রিকোয়ারমেন্ট বুঝে নেব',
    '২. লোগো ও প্রয়োজনীয় তথ্য সংগ্রহ করব',
    '৩. পছন্দের কালার অনুযায়ী ওয়েবসাইট রেডি করব',
    '৪. ৪৮ ঘণ্টার মধ্যে লাইভ ডেলিভারি ও সাপোর্ট'
  ] : [
    '1. Call you to understand project requirements',
    '2. Collect your logo & business details',
    '3. Customize and prepare your website',
    '4. Live delivery within 48 hours + free support'
  ];

  // Features You Get list: matching short text, strictly in one line with no sub text.
  const includedFeaturesList = language === 'bn' ? [
    '১. সম্পূর্ণ রেসপন্সিভ ও মোবাইল অপ্টিমাইজড আর্কিটেকচার',
    '২. ১ বছর ফ্রি .com ডোমেইন এবং NVMe ক্লাউড হোস্টিং + SSL',
    '৩. বিকাশ, নগদ, রকেট ও কার্ড অটো পেমেন্ট গেটওয়ে ইন্টিগ্রেশন',
    '৪. Steadfast, Pathao ও RedX অটো কুরিয়ার ট্র্যাকিং',
    '৫. ২৪ ঘণ্টায় ফুল ডেলিভারি ও আজীবন ডেডিকেটেড ইঞ্জিনিয়ার সাপোর্ট'
  ] : [
    '1. Fully responsive & 100% mobile-optimized architecture',
    '2. 1-year free .com domain & high-speed NVMe hosting + SSL',
    '3. bKash, Nagad, Rocket & card automated payment gateway',
    '4. Steadfast, Pathao & RedX automated courier tracking',
    '5. 24-hour full launch & lifetime dedicated engineer support'
  ];

  const handleTestAddToCart = (itemName: string) => {
    setAddedItem(itemName);
    setTimeout(() => setAddedItem(null), 2500);
  };

  const handleToggleFeatures = () => {
    playClickSound();
    const nextState = !showFeaturesChart;
    setShowFeaturesChart(nextState);
    if (nextState) {
      setShowOrderChart(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  return (
    <div className="min-h-screen w-full bg-[#F8F5FC] text-[#1F1F2E] flex flex-col font-sans pb-16 lg:pb-12">
      {/* 1. Purple Header (Matches #5B2C8A Theme) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#5B2C8A] border-b border-[#4A1F6E] shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-[72px] flex items-center justify-between gap-2.5 sm:gap-4 select-none">
          {/* Left: 1) Return back icon (no text) + 2) "Features You Get" explanation button */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* 1. Return back icon (icon only, no text) */}
            <button
              type="button"
              onClick={handleBack}
              aria-label={t('ফিরে যান', 'Back')}
              title={t('ফিরে যান', 'Back')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs active:scale-95 shrink-0 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5 text-white stroke-[2.4]" />
            </button>

            {/* 2. "Features You Get" Button - clearly conveys features included with website */}
            <button
              type="button"
              onClick={handleToggleFeatures}
              aria-expanded={showFeaturesChart}
              aria-label={t('ওয়েবসাইটে যা যা পাবেন', 'Features You Get')}
              title={t('ওয়েবসাইটে কী কী ফিচার পাবেন তা দেখুন', 'See what features you get with this website')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs shrink min-w-0 group active:scale-95 ${
                showFeaturesChart
                  ? 'bg-white text-[#5B2C8A] shadow-md ring-2 ring-white/50 border border-white'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              <span className="truncate tracking-wide">
                {t('ওয়েবসাইটে যা যা পাবেন', 'Features You Get')}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 ${showFeaturesChart ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
            </button>
          </div>

          {/* Right: 3) "Buy It" Action Button (Light Green background + White text) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onGoToOrder(demo)}
              aria-label={t('এখনই কিনুন', 'Buy Now')}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:from-emerald-700 active:to-teal-700 text-white text-xs sm:text-sm font-black shadow-[0_4px_16px_rgba(16,185,129,0.45)] hover:shadow-[0_6px_22px_rgba(16,185,129,0.6)] border border-emerald-300/40 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:scale-105 active:scale-95 shrink-0 group"
            >
              <span className="hidden xs:inline-block px-1.5 py-0.5 rounded-md bg-white/25 text-white font-mono font-bold text-[11px] sm:text-xs tracking-tight shadow-2xs">
                {demo.fourDigitCode}
              </span>
              <span className="text-white font-black tracking-wide">
                {t('এখনই কিনুন', 'Buy Now')}
              </span>
              <ArrowRight className="w-4 h-4 text-white stroke-[2.5] group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </header>

      {/* Header Placeholder Spacer */}
      <div className="h-14 sm:h-16 lg:h-[72px] w-full shrink-0" />

      {/* 2. Main Live Website Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 bg-[#F8F5FC]">
        
        {/* Interactive "Features You Get" Chart (Opened from header button, website remains in background) */}
        {showFeaturesChart && (
          <div 
            id="website-features-included-chart"
            className="w-full bg-white/98 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-purple-200/90 shadow-[0_20px_50px_rgba(91,44,138,0.15)] p-4 sm:p-6 animate-slideDown"
          >
            {/* Chart Header */}
            <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5B2C8A] shrink-0" />
                <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900">
                  {t('ওয়েবসাইটে যে যে ফিচার পাচ্ছেন', 'Features You Get With This Website')}
                </h4>
              </div>

              {/* Put Back Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowFeaturesChart(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                aria-label={t('বন্ধ করুন', 'Put back')}
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('বন্ধ করুন', 'Put back')}</span>
              </button>
            </div>

            {/* 5 Features List - Strictly Every Feature in One Line, No Sub Text */}
            <div className="space-y-2 sm:space-y-2.5">
              {includedFeaturesList.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-purple-300 hover:bg-purple-50/30 transition-all flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-[#5B2C8A] text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono shadow-2xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-[13px] md:text-sm font-bold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
                      {feature}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>

            {/* Chart Footer with Action to Put it back */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                {t('স্বচ্ছ মূল্য ও আজীবন মালিকানা • কোনো হিডেন চার্জ নেই', 'Transparent pricing & lifetime ownership • No hidden charges')}
              </span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowFeaturesChart(false);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#5B2C8A] hover:bg-[#4A1F6E] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ml-auto shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('চার্ট বন্ধ করুন', 'Put back')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive "What we do after your order" Action with Animated Down Arrow & Chart */}
        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowOrderChart((prev: boolean) => !prev);
              setShowFeaturesChart(false);
            }}
            aria-expanded={showOrderChart}
            aria-label={t('অর্ডার করার পর আমরা যা করব', 'What we do after your order')}
            className="w-full py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-[#5B2C8A] via-[#6B34A3] to-[#5B2C8A] hover:from-[#4A1F6E] hover:to-[#4A1F6E] active:scale-[0.99] text-white shadow-[0_8px_20px_-4px_rgba(91,44,138,0.35)] border border-white/20 transition-all flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-wide whitespace-nowrap overflow-hidden text-ellipsis text-left">
                {t('অর্ডার করার পর আমরা যা করব', 'What we do after your order')}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] sm:text-xs font-semibold text-purple-200 hidden md:inline">
                {showOrderChart ? t('বন্ধ করুন', 'Put back') : t('চার্ট দেখুন', 'View Chart')}
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                <ArrowDown className={`w-4 h-4 text-white stroke-[2.5] ${showOrderChart ? 'rotate-180 transition-transform duration-300' : 'animate-bounce'}`} />
              </div>
            </div>
          </button>

          {/* Interactive Workflow Chart (The website being viewed stays in the background) */}
          {showOrderChart && (
            <div 
              id="after-order-workflow-chart"
              className="w-full bg-white/98 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-purple-200/90 shadow-[0_20px_50px_rgba(91,44,138,0.15)] p-4 sm:p-6 animate-slideDown"
            >
              {/* Chart Header */}
              <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5B2C8A] shrink-0" />
                  <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900">
                    {t('অর্ডার পরবর্তী ৪টি পদক্ষেপ', '4 Steps After Your Order')}
                  </h4>
                </div>

                {/* Put Back Button */}
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowOrderChart(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  aria-label={t('বন্ধ করুন', 'Put back')}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t('বন্ধ করুন', 'Put back')}</span>
                </button>
              </div>

              {/* 4 Instructions - Strictly Every Instruction in One Line, No Sub Text */}
              <div className="space-y-2 sm:space-y-2.5">
                {afterOrderSteps.map((instruction, idx) => (
                  <div
                    key={idx}
                    className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-purple-300 hover:bg-purple-50/30 transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-[#5B2C8A] text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono shadow-2xs">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-[13px] md:text-sm font-bold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
                        {instruction}
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>

              {/* Chart Footer with Action to Put it back */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  {t('স্বচ্ছ প্রক্রিয়া • সার্বক্ষণিক টেকনিক্যাল সাপোর্ট', 'Transparent process • 24/7 dedicated support')}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setShowOrderChart(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#5B2C8A] hover:bg-[#4A1F6E] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ml-auto shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t('চার্ট বন্ধ করুন', 'Put back')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Real Live Website Window (NOT in hover - opens url link without showing the domain link) */}
        <section 
          id="real-live-website-window"
          className="w-full bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200 overflow-hidden shadow-lg flex flex-col transition-all relative"
        >
          <div className="w-full h-[650px] sm:h-[760px] md:h-[840px] bg-white relative flex flex-col">
            <iframe
              key={iframeKey}
              src={getEmbedUrl(demo.demoUrl)}
              title={demo.title}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
            />

          </div>
        </section>

        {/* 4. Pricing & Direct Order Section */}
        <section className="w-full bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 shadow-xs select-none">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Product & Pricing summary */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-[#5B2C8A] font-mono font-bold text-xs sm:text-sm border border-purple-200 shrink-0">
                {demo.fourDigitCode}
              </span>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-purple-50/80 border border-purple-200 text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block leading-tight">
                    {t('এককালীন সেটআপ', 'One-Time Setup')}
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#5B2C8A] font-mono leading-tight">
                    {demo.priceTag || '৳১,৯৯০'}
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block leading-tight">
                    {t('ক্লাউড হোস্টিং', 'Cloud Hosting')}
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-800 font-mono leading-tight">
                    ৳১২০/মাস
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pl-2 border-l border-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{t('১ বছর ফ্রি .com ডোমেইন ও ২৪ ঘণ্টায় লাইভ', '1-year free .com domain & 24h launch')}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/8801955570912"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onGoToOrder(demo);
                }}
                className="w-full sm:w-auto px-5 sm:px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(16,185,129,0.35)] shrink-0 group"
              >
                <span>{t('এখনই কিনুন', 'Buy Now')}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 mt-12 pb-24 sm:pb-12 space-y-2">
        <p>&copy; {new Date().getFullYear()} BongoWeb Digital Solutions Ltd. All Rights Reserved.</p>
        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
          <a href="/privacy" className="hover:text-[#5B2C8A] underline">Privacy Policy</a>
          <span>•</span>
          <a href="/terms" className="hover:text-[#5B2C8A] underline">Terms of Service</a>
          <span>•</span>
          <a href="/refund" className="hover:text-[#5B2C8A] underline">Refund Policy</a>
          <span>•</span>
          <a href="tel:+8801955570912" className="hover:text-[#5B2C8A] underline font-mono">01955570912</a>
        </div>
      </footer>
    </div>
  );
}
