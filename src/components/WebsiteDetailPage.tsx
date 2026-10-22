import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, ShoppingBag, CheckCircle2, 
  MessageCircle, ChevronDown, Sparkles, Phone, ArrowDown, X,
  ExternalLink, Globe, Layout, Image as ImageIcon
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
  const [cartCount, setCartCount] = useState<number>(0);
  const [screenViewMode, setScreenViewMode] = useState<'live' | 'image'>('live');

  // Formats URL without ever displaying domain link to user
  const getEmbedUrl = (rawUrl?: string) => {
    if (!rawUrl) return 'https://bongoweb.site';
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

  const handleToggleOrderChart = () => {
    playClickSound();
    const nextState = !showOrderChart;
    setShowOrderChart(nextState);
    if (nextState) {
      setShowFeaturesChart(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F5FC] text-[#1F1F2E] flex flex-col font-sans">
      {/* 1. Purple Header (Matches #5B2C8A Theme) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#5B2C8A] border-b border-[#4A1F6E] shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-[72px] flex items-center justify-between gap-2.5 sm:gap-4 select-none">
          {/* Left: 1) Return back icon (no text) + 2) "Features You Get" explanation button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

          {/* Center (Laptop view only): "What we do after your order" fills the gap between Features You Get and Buy Now */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-auto">
            <button
              type="button"
              onClick={handleToggleOrderChart}
              aria-expanded={showOrderChart}
              aria-label={t('অর্ডার করার পর আমরা যা করব', 'What we do after your order')}
              title={t('অর্ডার পরবর্তী ৪টি পদক্ষেপ দেখুন', 'See 4 steps after your order')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs shrink min-w-0 group active:scale-95 ${
                showOrderChart
                  ? 'bg-white text-[#5B2C8A] shadow-md ring-2 ring-white/50 border border-white'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${showOrderChart ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
              <span className="truncate tracking-wide">
                {t('অর্ডার করার পর আমরা যা করব', 'What we do after your order')}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 ${showOrderChart ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
            </button>
          </div>

          {/* Right: 3) Open Site Link + "Buy It" Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Open Website in New Tab */}
            <a
              href={getEmbedUrl(demo.demoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              title={t('নতুন ট্যাবে ওয়েবসাইটটি ওপেন করুন', 'Open website in new tab')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer group"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>{t('সাইট ওপেন করুন', 'Open Site')}</span>
            </a>

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

      {/* 2. Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Interactive "Features You Get" Chart (Opened from header button) */}
        {showFeaturesChart && (
          <div 
            id="website-features-included-chart"
            className="w-full bg-white rounded-2xl sm:rounded-3xl border-2 border-purple-200/90 shadow-[0_20px_50px_rgba(91,44,138,0.15)] p-4 sm:p-6 animate-slideDown"
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

            {/* 5 Features List */}
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

        {/* 2. Interactive "What we do after your order" Action & Workflow Chart */}
        <div className="w-full space-y-3">
          {/* Main Trigger Button */}
          <button
            type="button"
            onClick={handleToggleOrderChart}
            aria-expanded={showOrderChart}
            aria-label={t('অর্ডার করার পর আমরা যা করব', 'What we do after your order')}
            className="w-full py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-[#5B2C8A] via-[#6B34A3] to-[#5B2C8A] hover:from-[#4A1F6E] hover:to-[#4A1F6E] active:scale-[0.99] text-white shadow-[0_8px_20px_-4px_rgba(91,44,138,0.35)] border border-white/20 transition-all flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-wide truncate text-left">
                {t('অর্ডার করার পর আমরা যা করব', 'What we do after your order')}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] sm:text-xs font-semibold text-purple-200 hidden sm:inline">
                {showOrderChart ? t('বন্ধ করুন', 'Put back') : t('চার্ট দেখুন', 'View Chart')}
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-colors">
                <ArrowDown className={`w-4 h-4 text-white stroke-[2.5] ${showOrderChart ? 'rotate-180 transition-transform duration-300' : 'animate-bounce'}`} />
              </div>
            </div>
          </button>

          {/* Interactive Workflow Chart */}
          {showOrderChart && (
            <div 
              id="after-order-workflow-chart"
              className="w-full bg-white rounded-2xl sm:rounded-3xl border-2 border-purple-200/90 shadow-[0_20px_50px_rgba(91,44,138,0.15)] p-4 sm:p-6 animate-slideDown"
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

              {/* 4 Instructions */}
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

        {/* 3. The Website Preview Screen (Applied directly after "What we do after your order" section) */}
        <section 
          id="website-preview-screen"
          className="w-full bg-slate-950 rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 shadow-[0_20px_50px_rgba(91,44,138,0.15)] overflow-hidden flex flex-col transition-all"
        >
          {/* Browser Chrome Header */}
          <div className="w-full px-3 sm:px-4 py-3 bg-[#181226] border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-2.5 text-white select-none">
            {/* Left: Window Dots & Clickable Address Bar */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-2xs" />
              </div>

              {/* Clickable URL Address Bar */}
              <a 
                href={getEmbedUrl(demo.demoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                title={t('নতুন ট্যাবে ওয়েবসাইটটি ওপেন করুন', 'Open website in new tab')}
                className="ml-1 sm:ml-2 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-emerald-400/50 text-xs font-mono text-slate-200 transition-all cursor-pointer group"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-bold hidden xs:inline">https://</span>
                <span className="truncate max-w-[120px] sm:max-w-xs md:max-w-md group-hover:text-emerald-300">
                  {demo.demoUrl || `${String(demo.title).toLowerCase().replace(/\s+/g, '')}.bongoweb.site`}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-300 shrink-0" />
              </a>

              <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 font-mono text-[11px] font-bold border border-purple-400/30 shrink-0">
                {demo.fourDigitCode}
              </span>
            </div>

            {/* Right: Mode Switcher + Open Website Action Button */}
            <div className="flex items-center gap-2 shrink-0">
              {/* View Mode Switcher: Live Website vs Preview Image */}
              <div className="flex items-center bg-white/10 p-0.5 rounded-lg border border-white/10 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setScreenViewMode('live');
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    screenViewMode === 'live'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Layout className="w-3 h-3" />
                  <span>{t('লাইভ সাইট', 'Live Site')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setScreenViewMode('image');
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    screenViewMode === 'image'
                      ? 'bg-[#5B2C8A] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>{t('প্রিভিউ ছবি', 'Preview Image')}</span>
                </button>
              </div>

              {/* Direct Open Website Button */}
              <a
                href={getEmbedUrl(demo.demoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 group"
              >
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>{t('ওপেন করুন', 'Open Website')}</span>
              </a>
            </div>
          </div>

          {/* Screen Body */}
          {screenViewMode === 'image' ? (
            /* Mode 1: Full-resolution Preview Image */
            <div 
              className="w-full min-h-[600px] sm:min-h-[750px] md:min-h-[900px] bg-slate-950 bg-cover bg-top bg-no-repeat relative flex flex-col items-center justify-start overflow-hidden select-none"
              style={{
                backgroundImage: demo.previewImage ? `url("${demo.previewImage}")` : undefined,
              }}
            >
              {demo.previewImage ? (
                <img
                  src={demo.previewImage}
                  alt={demo.title}
                  className="w-full h-auto min-h-[600px] sm:min-h-[750px] md:min-h-[900px] object-cover sm:object-contain object-top shadow-2xl"
                  loading="eager"
                />
              ) : (
                <div className="w-full min-h-[600px] flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-900">
                  <ShoppingBag className="w-16 h-16 mb-4 text-purple-400" />
                  <h4 className="text-xl font-bold text-white">{demo.title}</h4>
                  <p className="text-sm text-slate-400 mt-2 max-w-md">{demo.description}</p>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Live Interactive Website Simulator */
            <div className="w-full bg-[#FAFAFC] text-slate-900 flex flex-col min-h-[700px] sm:min-h-[850px] select-none font-sans">
              {/* Added to cart toast banner */}
              {addedItem && (
                <div className="sticky top-0 z-50 w-full py-2.5 px-4 bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                  <span>"{addedItem}" {t('কার্টে সফলভাবে যুক্ত হয়েছে!', 'added to cart successfully!')}</span>
                </div>
              )}

              {/* Website Simulator Navigation */}
              <nav className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-xs sticky top-0 z-30">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B2C8A] to-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    🛍️
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate block">
                      {demo.title}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      ● Verified 100% Live
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {/* Cart Button */}
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onGoToOrder(demo);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#5B2C8A]" />
                    <span className="hidden xs:inline">{t('কার্ট', 'Cart')}</span>
                    <span className="w-5 h-5 rounded-full bg-[#5B2C8A] text-white text-[10px] font-bold flex items-center justify-center">
                      {cartCount}
                    </span>
                  </button>

                  {/* Buy Now directly from simulator */}
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onGoToOrder(demo);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>{t('এখনই কিনুন', 'Buy Now')}</span>
                  </button>
                </div>
              </nav>

              {/* Hero Banner Section */}
              <div className="w-full bg-gradient-to-br from-purple-900 via-[#5B2C8A] to-indigo-900 text-white px-4 sm:px-8 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="max-w-xl space-y-3 z-10 text-center md:text-left">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white font-mono text-[11px] font-bold inline-block border border-white/30 backdrop-blur-xs">
                    {demo.categoryLabel || 'Exclusive Store'} • {demo.fourDigitCode}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
                    {demo.heroHeadline || demo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                    {demo.mockData?.heroSub || demo.description}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onGoToOrder(demo);
                      }}
                      className="px-4 sm:px-5 py-2.5 rounded-xl bg-white text-[#5B2C8A] hover:bg-slate-100 text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{t('অর্ডার করুন', 'Order Now')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href={getEmbedUrl(demo.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/25 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t('লাইভ সাইট ভিজিট', 'Visit Live Site')}</span>
                    </a>
                  </div>
                </div>

                {/* Hero Showcase Image */}
                <div className="w-full md:w-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-4/3 relative shrink-0">
                  <img
                    src={demo.previewImage}
                    alt={demo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-[11px] font-bold text-white font-mono bg-[#5B2C8A]/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      100% Mobile Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges Strip */}
              <div className="w-full bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>১ বছর ফ্রি ডোমেইন ও হোস্টিং</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>বিকাশ/নগদ অটো পেমেন্ট</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>কুরিয়ার অটো ট্র্যাকিং API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>২৪ ঘণ্টায় লাইভ ডেলিভারি</span>
                  </div>
                </div>
              </div>

              {/* Interactive Store Items Showcase */}
              <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                      {t('স্টোরের প্রোডাক্ট ক্যাটালগ', 'Store Products & Catalog')}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {t('কার্টে যোগ করে লাইভ ওয়েবসাইট অভিজ্ঞতা পরীক্ষা করুন', 'Add products to cart to test live website functionality')}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#5B2C8A] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    {demo.mockData?.items?.length || 3} {t('টি আইটেম', 'Items')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(demo.mockData?.items || [
                    { name: 'Wireless Active Noise-Canceling Earbuds', price: '1,650 BDT', tag: 'Sale', image: demo.previewImage },
                    { name: 'Ultra Smartwatch Series 8 Pro', price: '2,190 BDT', tag: 'Top Rated', image: demo.previewImage },
                    { name: 'Fast-Charging Powerbank 20,000 mAh', price: '1,100 BDT', tag: 'Popular', image: demo.previewImage }
                  ]).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 mb-2.5 relative">
                          <img
                            src={item.image || demo.previewImage}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {item.tag && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {item.name}
                        </h5>
                        <p className="text-xs font-mono font-bold text-[#5B2C8A] mt-1">
                          {item.price}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setCartCount(prev => prev + 1);
                          handleTestAddToCart(item.name);
                        }}
                        className="mt-3 w-full py-2 rounded-xl bg-slate-900 hover:bg-[#5B2C8A] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t('কার্টে যোগ করুন', 'Add to Cart')}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 mt-12 pb-8 sm:pb-10 space-y-2">
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
