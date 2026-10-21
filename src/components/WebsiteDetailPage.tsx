import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, ShoppingBag, CheckCircle2, 
  ShieldCheck, Zap, Headphones, Globe, MessageCircle, 
  ChevronDown, Layers, Sparkles, Box, Phone, ArrowDown, X
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 lg:h-[72px] flex items-center justify-between gap-2.5 sm:gap-4 select-none">
          {/* Left: 1) Return back icon (no text) + 2) "Features You Get" explanation button */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* 1. Return back icon (icon only, no text) */}
            <button
              type="button"
              onClick={handleBack}
              aria-label={t('ফিরে যান', 'Back')}
              title={t('ফিরে যান', 'Back')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/35 text-white border border-white/20 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-90 shrink-0 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 text-white stroke-[2.4]" />
            </button>

            {/* 2. "Features You Get" Button - clearly conveys the features included with the website */}
            <button
              type="button"
              onClick={handleToggleFeatures}
              aria-expanded={showFeaturesChart}
              aria-label={t('ওয়েবসাইটে যা যা পাবেন', 'Features You Get')}
              title={t('ওয়েবসাইটে কী কী ফিচার পাবেন তা দেখুন', 'See what features you get with this website')}
              className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs shrink min-w-0 ${
                showFeaturesChart
                  ? 'bg-white text-[#5B2C8A] shadow-md ring-2 ring-white/40'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
            >
              <span className="truncate">
                {t('ওয়েবসাইটে যা যা পাবেন', 'Features You Get')}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${showFeaturesChart ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Right: 3) "Buy It" Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onGoToOrder(demo)}
              aria-label={t('এখনই কিনুন', 'Buy Now')}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-purple-50 active:bg-purple-100 text-[#5B2C8A] text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <span className="hidden xs:inline-block px-1.5 py-0.5 rounded-md bg-[#5B2C8A]/10 text-[#5B2C8A] font-mono font-bold text-xs">
                {demo.fourDigitCode}
              </span>
              <span>{t('এখনই কিনুন', 'Buy Now')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Header Placeholder Spacer */}
      <div className="h-14 sm:h-16 lg:h-[72px] w-full shrink-0" />

      {/* 2. Main Live Website Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-[#F1F5F9]">
        
        {/* Laptop/Desktop 2-Column Workstation Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start space-y-6 lg:space-y-0">
          
          {/* Main Showcase & Catalog Area (Left 8 Columns on Laptop/Desktop) */}
          <div className="lg:col-span-8 space-y-6">
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
                  setShowOrderChart(prev => !prev);
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

        {/* Real Live Website Showcase Area */}
        <section className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {show3DStage ? (
            <div className="w-full h-[450px] sm:h-[550px] bg-slate-950 relative overflow-hidden animate-fadeIn">
              <ThreeCanvas3D intensity={1} />
            </div>
          ) : (
            /* Hero Banner Section */
            <div className="relative w-full aspect-[16/7] min-h-[240px] sm:min-h-[360px] overflow-hidden">
              <img
                src={demo.previewImage}
                alt={demo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-5 sm:p-8 md:p-10 text-white">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] text-white text-xs font-bold w-fit mb-2 shadow-xs">
                  {demo.categoryLabel}
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight max-w-2xl drop-shadow-sm text-white">
                  {demo.heroHeadline || demo.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl hidden sm:block">
                  {demo.mockData?.heroSub || demo.description}
                </p>
              </div>
            </div>
          )}

          {/* Interactive Products / Menu Simulation */}
          <div className="p-5 sm:p-8 bg-white">
            {addedItem && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{addedItem} টেস্ট কার্টে সফলভাবে যোগ হয়েছে!</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">
                  লাইভ ফিচার
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  লাইভ ক্যাটালগ ও পণ্য তালিকা
                </h3>
                <p className="text-xs text-slate-500">
                  আপনার ওয়েবসাইটে ঠিক এমন প্রিমিয়াম ক্যাটালগ সেটআপ থাকবে
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ⚡ ২৪ ঘণ্টা রেডি
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {demo.mockData?.items?.map((item, idx) => (
                <Card3D
                  key={idx}
                  maxTilt={10}
                  scale={1.02}
                  glare={true}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-400 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-start gap-3 mb-3" style={{ transform: 'translateZ(18px)' }}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      {item.tag && (
                        <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md mb-1 inline-block border border-purple-200">
                          {item.tag}
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-xs font-black text-purple-700 mt-1 font-mono">
                        {item.price}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      handleTestAddToCart(item.name);
                    }}
                    style={{ transform: 'translateZ(22px)' }}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-[#7C3AED] hover:text-white text-slate-700 border border-slate-200 hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>কার্ট টেস্ট করুন</span>
                  </button>
                </Card3D>
              ))}
            </div>
          </div>
        </section>

          </div>

          {/* Right Sticky Sidebar (Laptop/Desktop View Only) */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 space-y-4 select-none">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md space-y-5 text-slate-900">
              
              {/* Product Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="min-w-0">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5B2C8A] font-bold text-xs mb-1.5 border border-purple-200">
                    {demo.categoryLabel || 'বিজনেস টেমপ্লেট'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {demo.title}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs shrink-0 border border-slate-200">
                  {demo.fourDigitCode}
                </span>
              </div>

              {/* Price & Plan */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-semibold">এককালীন ফুল সেটআপ:</span>
                  <span className="text-2xl font-black text-[#5B2C8A] font-mono">{demo.priceTag || '৳১,৯৯০'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-purple-700 font-medium pt-1 border-t border-purple-100">
                  <span>মাসিক ক্লাউড হোস্টিং:</span>
                  <span className="font-bold font-mono">৳১২০ / মাস</span>
                </div>
              </div>

              {/* Inclusions Checklist */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>১ বছর ফ্রি .com ডোমেইন রেজিস্ট্রেশন</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>উচ্চগতির NVMe ক্লাউড হোস্টিং ও SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>বিকাশ/নগদ অটো পেমেন্ট ও কুরিয়ার ট্র্যাকিং</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>২৪ ঘণ্টায় ফুল লাইভ ডেলিভারি গ্যারান্টি</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onGoToOrder(demo)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#6B46C1] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/20 hover:scale-[1.02] active:scale-95"
                >
                  <span className="px-2 py-0.5 rounded-md bg-black/20 text-white font-mono text-xs">
                    {demo.fourDigitCode}
                  </span>
                  <span>অর্ডার পেজে যান</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://wa.me/8801955570912"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="tel:+8801955570912"
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#5B2C8A]" />
                    <span>কল করুন</span>
                  </a>
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-center gap-2 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>৭ দিনের মানিব্যাক গ্যারান্টি • ২৪/৭ সাপোর্ট</span>
              </div>
            </div>
          </aside>

        </div>

        {/* 3. Pricing Architecture & Inclusions Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Transparent Financial Architecture Breakdown */}
          <div className="p-5 sm:p-6 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2 border border-purple-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>স্বচ্ছ মূল্য ও আজীবন মালিকানা</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                এককালীন সেটআপ ফি ও নিয়মিত ক্লাউড হোস্টিং
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                কোনো হিডেন চার্জ নেই। এককালীন ফি দিয়ে ওয়েবসাইট বুঝে নিন, সাথে মাত্র ১২০ টাকা মাসিক ক্লাউড সার্ভার খরচে নিশ্চিত করুন ৯৯.৯% আপটাইম।
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs text-center min-w-[130px]">
                <span className="text-[11px] font-semibold text-slate-500 block">এককালীন সেটআপ</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block mt-0.5">
                  {demo.priceTag || '৳১,৯৯০'}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">ফুল লাইভ সাইট</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-purple-200 shadow-2xs text-center min-w-[130px] ring-2 ring-purple-500/20">
                <span className="text-[11px] font-semibold text-slate-500 block">মাসিক ক্লাউড খরচ</span>
                <span className="text-xl sm:text-2xl font-black text-purple-700 font-mono block mt-0.5">
                  ৳১২০
                </span>
                <span className="text-[10px] text-purple-600 font-bold block mt-0.5">সার্ভার ও ব্যাকআপ</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-slate-900">ফ্রি .com ডোমেইন</h5>
              <p className="text-xs text-slate-600 mt-1">
                আপনার পছন্দের ব্র্যান্ড নামে ১ বছর ফ্রি অফিশিয়াল ডোমেইন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-slate-900">২৪ ঘণ্টা লাইভ ডেলিভারি</h5>
              <p className="text-xs text-slate-600 mt-1">
                অর্ডার নিশ্চিত করার মাত্র ২৪ ঘণ্টার মধ্যে ফুল সাইট লাইভ।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-slate-900">১০০% মানিব্যাক</h5>
              <p className="text-xs text-slate-600 mt-1">
                কাজের গুণমানে শতভাগ সন্তুষ্টির গ্যারান্টি, কোনো ঝুঁকি নেই।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-slate-900">২৪/৭ ফুল সাপোর্ট</h5>
              <p className="text-xs text-slate-600 mt-1">
                সরাসরি ডেডিকেটেড ইঞ্জিনিয়ার থেকে আজীবন টেকনিক্যাল হেল্প।
              </p>
            </div>
          </div>

          {/* Action Order Box with Integrated Red Order Button */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-base font-black text-slate-900">
                পছন্দ হয়েছে? এখনই নিজের ব্যবসার জন্য অর্ডার করুন
              </p>
              <p className="text-xs text-slate-500">
                কোনো অগ্রিম অতিরিক্ত চার্জ নেই • ১ মিনিটেই সম্পন্ন করুন
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/8801955570912"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp কনসাল্টেশন</span>
              </a>

              {/* Order Button with Order Number Together */}
              <button
                onClick={() => onGoToOrder(demo)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#6B46C1] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:scale-105 active:scale-95"
              >
                <span className="px-2 py-0.5 rounded-lg bg-black/25 text-white font-mono font-bold text-xs">
                  {demo.fourDigitCode}
                </span>
                <span>অর্ডার পেজে যান</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
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
