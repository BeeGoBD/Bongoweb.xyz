import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, ShoppingBag, CheckCircle2, 
  MessageCircle, ChevronDown, Sparkles, Phone, ArrowDown, X,
  ExternalLink, Globe, Layout, Image as ImageIcon, RefreshCw, AlertCircle,
  Laptop, Smartphone, Maximize2, ZoomIn, ZoomOut, RotateCcw, Check, Eye
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
  
  // Intelligent initial mode: if demoUrl is empty or default placeholder, default directly to image mode
  const isExternalLiveDemo = Boolean(
    demo.demoUrl && 
    !demo.demoUrl.includes('bongoweb.site') && 
    (demo.demoUrl.startsWith('http://') || demo.demoUrl.startsWith('https://'))
  );
  const [screenViewMode, setScreenViewMode] = useState<'live' | 'image'>(() => {
    return isExternalLiveDemo ? 'live' : 'image';
  });
  
  // Device & Fit Responsive Controls for 100% viewport fit
  const [deviceMode, setDeviceMode] = useState<'laptop' | 'mobile'>('laptop');
  const [fitMode, setFitMode] = useState<'fit' | 'natural'>('fit');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

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

          {/* Right: Open Site Link */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Open Website in New Tab */}
            <a
              href={getEmbedUrl(demo.demoUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              title={t('নতুন ট্যাবে ওয়েবসাইটটি ওপেন করুন', 'Open website in new tab')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer group"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>{t('সাইট ওপেন করুন', 'Open Site')}</span>
            </a>
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

        {/* 3. The Website Preview Screen: Responsive Laptop & Mobile Device Simulation */}
        <section 
          id="website-preview-screen"
          className="w-full bg-[#0D111A] rounded-2xl sm:rounded-3xl border-2 border-purple-900/40 shadow-[0_20px_50px_rgba(91,44,138,0.2)] overflow-hidden flex flex-col transition-all"
        >
          {/* Universal Preview Header Toolbar */}
          <div className="w-full px-3 sm:px-4 py-3 bg-[#131926] border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-2.5 text-white select-none">
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
                <span className="truncate max-w-[110px] xs:max-w-[140px] sm:max-w-xs md:max-w-md group-hover:text-emerald-300">
                  {demo.demoUrl || `${String(demo.title).toLowerCase().replace(/\s+/g, '')}.bongoweb.site`}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-300 shrink-0" />
              </a>

              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 font-mono text-[11px] font-bold border border-purple-400/30 shrink-0">
                {demo.fourDigitCode}
              </span>
            </div>

            {/* Center: Device Mode Switcher (Laptop vs Mobile) */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setDeviceMode('laptop');
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  deviceMode === 'laptop'
                    ? 'bg-[#5B2C8A] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={t('ল্যাপটপ / কম্পিউটার ভিউ', 'Laptop / Desktop View')}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{t('ল্যাপটপ ভিউ', 'Laptop View')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setDeviceMode('mobile');
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  deviceMode === 'mobile'
                    ? 'bg-[#5B2C8A] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={t('স্মার্টফোন / মোবাইল ভিউ', 'Mobile Phone View')}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{t('মোবাইল ভিউ', 'Mobile View')}</span>
              </button>
            </div>

            {/* Right: Fit Toggle + Lightbox Zoom + Direct Open */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Fit vs Full Scroll Toggle (When in image mode) */}
              {screenViewMode === 'image' && (
                <div className="hidden md:flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFitMode('fit');
                    }}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      fitMode === 'fit' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title={t('পুরো ছবি স্ক্রিনে ফিট করুন (কোনো অংশ কাটবে না)', 'Fit 100% inside screen')}
                  >
                    {t('ফিট ভিউ', 'Fit to Screen')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFitMode('natural');
                    }}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      fitMode === 'natural' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title={t('স্বাভাবিক স্ক্রোল ভিউ', 'Scrollable View')}
                  >
                    {t('স্ক্রোল ভিউ', 'Full Scroll')}
                  </button>
                </div>
              )}

              {/* Fullscreen Lightbox Button */}
              {demo.previewImage && (
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setLightboxZoom(1);
                    setIsLightboxOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  title={t('সম্পূর্ণ ছবি জুম ও ফুলস্ক্রিন দেখুন', 'Zoom Full High-Res Image')}
                >
                  <Maximize2 className="w-3.5 h-3.5 text-purple-300" />
                  <span className="hidden xs:inline">{t('ফুল ভিউ', 'Fullscreen')}</span>
                </button>
              )}

              {/* View Mode Switcher: Live Website vs Preview Image (Only if external demoUrl is provided) */}
              {isExternalLiveDemo && (
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
                    <span>{t('লাইভ সাইট', 'Live')}</span>
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
                    <span>{t('ছবি', 'Image')}</span>
                  </button>
                </div>
              )}

              {/* Direct Open Website Button */}
              <a
                href={getEmbedUrl(demo.demoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 group"
              >
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span className="hidden xs:inline">{t('ওপেন করুন', 'Open Website')}</span>
              </a>
            </div>
          </div>

          {/* Screen Body Canvas: Fitted to viewport so nothing overflows laptop or mobile */}
          <div className="w-full bg-[#080B12] p-2.5 sm:p-5 md:p-6 flex items-center justify-center overflow-hidden min-h-[420px] sm:min-h-[500px]">
            {screenViewMode === 'image' ? (
              deviceMode === 'laptop' ? (
                /* ======================================================= */
                /* 💻 LAPTOP MODE MOCKUP FRAME                             */
                /* ======================================================= */
                <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none animate-fadeIn">
                  {/* Laptop Screen Bezel */}
                  <div className="w-full bg-[#111827] rounded-t-2xl sm:rounded-t-3xl border-2 sm:border-4 border-slate-700/80 p-2 sm:p-3 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col">
                    {/* Top Webcam indicator dot */}
                    <div className="w-full flex items-center justify-center pb-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                        <span className="w-0.5 h-0.5 rounded-full bg-cyan-400 block" />
                      </div>
                    </div>

                    {/* Display viewport */}
                    <div className="w-full bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center max-h-[56vh] sm:max-h-[62vh] md:max-h-[68vh]">
                      {demo.previewImage ? (
                        fitMode === 'fit' ? (
                          /* Fit Mode: 100% visible inside frame, zero clipping on any screen */
                          <div className="w-full h-full flex items-center justify-center p-1 sm:p-3 bg-slate-950/80">
                            <img
                              src={demo.previewImage}
                              alt={demo.title}
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                              }}
                              className="max-w-full max-h-[52vh] sm:max-h-[58vh] md:max-h-[64vh] object-contain rounded-lg shadow-2xl select-none m-auto"
                              loading="eager"
                            />
                          </div>
                        ) : (
                          /* Scroll Mode: Natural width with smooth vertical scroll */
                          <div className="w-full max-h-[52vh] sm:max-h-[58vh] md:max-h-[64vh] overflow-y-auto scrollbar-thin bg-slate-950">
                            <img
                              src={demo.previewImage}
                              alt={demo.title}
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                              }}
                              className="w-full h-auto object-cover object-top select-none"
                              loading="eager"
                            />
                          </div>
                        )
                      ) : (
                        <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-900">
                          <ShoppingBag className="w-16 h-16 mb-4 text-purple-400" />
                          <h4 className="text-xl font-bold text-white">{demo.title}</h4>
                          <p className="text-sm text-slate-400 mt-2 max-w-md">{demo.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Laptop Base & Keyboard Lip Notch */}
                  <div className="w-[104%] max-w-[104%] h-3.5 sm:h-4.5 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 rounded-b-2xl border-t border-slate-500/50 shadow-2xl flex items-center justify-center relative">
                    <div className="w-20 sm:w-28 h-1 sm:h-1.5 bg-slate-900/80 rounded-full" />
                  </div>
                </div>
              ) : (
                /* ======================================================= */
                /* 📱 MOBILE SMARTPHONE MODE MOCKUP FRAME                  */
                /* ======================================================= */
                <div className="w-full max-w-[310px] xs:max-w-[330px] sm:max-w-[350px] mx-auto select-none animate-fadeIn py-2">
                  <div className="rounded-[40px] sm:rounded-[44px] border-[8px] sm:border-[10px] border-slate-800 bg-slate-950 shadow-[0_30px_70px_rgba(0,0,0,0.7)] p-1 relative overflow-hidden flex flex-col">
                    {/* Top Dynamic Island / Speaker Pill */}
                    <div className="w-24 h-4 sm:h-5 bg-black rounded-full mx-auto my-1.5 flex items-center justify-between px-2.5 z-20 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                    </div>

                    {/* Smartphone Screen Viewport */}
                    <div className="w-full h-[460px] xs:h-[490px] sm:h-[530px] overflow-y-auto bg-slate-900 scrollbar-none rounded-[28px] sm:rounded-[32px] relative flex flex-col">
                      {demo.previewImage ? (
                        fitMode === 'fit' ? (
                          <div className="w-full h-full flex items-center justify-center p-1 bg-slate-950">
                            <img
                              src={demo.previewImage}
                              alt={demo.title}
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                              }}
                              className="max-w-full max-h-full object-contain rounded-xl select-none m-auto"
                              loading="eager"
                            />
                          </div>
                        ) : (
                          <img
                            src={demo.previewImage}
                            alt={demo.title}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                            }}
                            className="w-full h-auto object-cover object-top select-none"
                            loading="eager"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                          <ShoppingBag className="w-12 h-12 mb-3 text-purple-400" />
                          <h4 className="text-base font-bold text-white">{demo.title}</h4>
                        </div>
                      )}
                    </div>

                    {/* Bottom Home Indicator Bar */}
                    <div className="w-28 h-1 bg-white/40 rounded-full mx-auto my-2 shrink-0" />
                  </div>
                </div>
              )
            ) : (
              /* Mode 2: Live Embedded Website Viewer */
              <div className="w-full max-w-6xl mx-auto bg-slate-900 rounded-2xl overflow-hidden flex flex-col min-h-[550px] sm:min-h-[680px] md:min-h-[750px] relative border border-slate-700/80">
                {/* Iframe Loading Overlay */}
                {iframeLoading && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 text-white gap-3 p-6 text-center animate-fadeIn">
                    <div className="w-12 h-12 rounded-2xl bg-[#5B2C8A]/30 border border-[#AB55F7]/40 flex items-center justify-center text-[#AB55F7]">
                      <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-white">
                        {t('লাইভ ওয়েবসাইট লোড হচ্ছে...', 'Loading live website...')}
                      </h5>
                      <p className="text-xs text-purple-200/80 font-mono mt-1 max-w-md truncate">
                        {getEmbedUrl(demo.demoUrl)}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {t('প্রিভিউ স্ক্রিনে সরাসরি ওয়েবসাইটটি প্রদর্শিত হচ্ছে', 'Rendering the website directly inside the preview screen')}
                    </span>
                  </div>
                )}

                {/* Embedded Live Website Iframe */}
                <iframe
                  key={iframeKey}
                  id="real-live-website-preview-frame"
                  src={getEmbedUrl(demo.demoUrl)}
                  title={demo.title}
                  onLoad={() => setIframeLoading(false)}
                  className="w-full flex-1 min-h-[550px] sm:min-h-[680px] md:min-h-[750px] border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="eager"
                />

                {/* Bottom Interactive Control & Fallback Bar */}
                <div className="w-full px-3 sm:px-5 py-3 bg-[#110D1E] border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-3 text-white text-xs select-none">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-300 truncate">
                      {t('লাইভ ওয়েবসাইট ইন্টারঅ্যাক্টিভ প্রিভিউ', 'Live Interactive Website Preview')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setIframeLoading(true);
                        setIframeKey(k => k + 1);
                      }}
                      title={t('পুনরায় লোড করুন', 'Reload website')}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">{t('রিলোড', 'Reload')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setScreenViewMode('image');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all cursor-pointer text-[11px] font-bold"
                    >
                      {t('প্রিভিউ ছবি', 'Preview Image')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Helper Banner below preview */}
          <div className="w-full px-4 py-2.5 bg-[#0A0D15] border-t border-purple-900/30 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'bn' ? '১০০% রেসপন্সিভ ডিজাইন • ল্যাপটপ ও মোবাইল উভয় মোডে প্রিভিউ দেখুন' : '100% responsive design • Toggle Laptop & Mobile previews above'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-purple-300 font-bold">{demo.fourDigitCode}</span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setDeviceMode(deviceMode === 'laptop' ? 'mobile' : 'laptop');
                }}
                className="text-purple-300 hover:text-purple-200 font-bold underline cursor-pointer"
              >
                {deviceMode === 'laptop' ? (language === 'bn' ? 'মোবাইলে কেমন দেখাবে?' : 'Preview on Mobile') : (language === 'bn' ? 'ল্যাপটপে কেমন দেখাবে?' : 'Preview on Laptop')}
              </button>
            </div>
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

      {/* 5. Stitched Right-Wall Floating "Buy Now" Button (Cart/Shop Style Side Drawer Dock) */}
      <aside
        id="floating-right-wall-buy-now-dock"
        aria-label={t('এখনই কিনুন - সাইড বাটন', 'Floating Buy Now')}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 select-none group"
      >
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onGoToOrder(demo);
          }}
          aria-label={`${t('এখনই কিনুন', 'Buy Now')} ${demo.title}`}
          title={`${t('এখনই ওয়েবসাইটটি কিনুন', 'Buy this website now')} (${demo.fourDigitCode})`}
          className="relative flex flex-col items-center justify-center py-4 px-2 sm:px-3 rounded-l-2xl sm:rounded-l-3xl rounded-r-none bg-gradient-to-b from-emerald-500 via-teal-600 to-[#03543e] text-white shadow-[-8px_4px_30px_rgba(16,185,129,0.5)] hover:shadow-[-14px_8px_40px_rgba(16,185,129,0.7)] border-y-2 border-l-2 border-r-0 border-emerald-300/80 cursor-pointer transition-all duration-300 ease-out transform hover:-translate-x-2 sm:hover:-translate-x-3 active:scale-95"
        >
          {/* Subtle tactile grip notches stitched flat to the screen's right wall */}
          <div className="absolute right-0.5 top-3 bottom-3 w-1 flex flex-col justify-between items-center opacity-40">
            <span className="w-1 h-1 rounded-full bg-white block" />
            <span className="w-1 h-1 rounded-full bg-white block" />
            <span className="w-1 h-1 rounded-full bg-white block" />
            <span className="w-1 h-1 rounded-full bg-white block" />
          </div>

          {/* Glowing pulse beacon & Shopping Bag Icon */}
          <div className="relative mb-2 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-200 opacity-80" />
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-xs border border-white/50 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-white text-emerald-800 transition-all duration-300">
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white group-hover:text-emerald-700 transition-colors stroke-[2.4]" />
            </div>
          </div>

          {/* Primary "Buy Now" CTA Typography */}
          <div className="flex flex-col items-center text-center font-black tracking-wider uppercase leading-none drop-shadow-md">
            <span className="text-[11px] sm:text-xs text-white">
              {language === 'bn' ? 'এখনই' : 'BUY'}
            </span>
            <span className="text-[11px] sm:text-xs text-amber-300 mt-0.5">
              {language === 'bn' ? 'কিনুন' : 'NOW'}
            </span>
          </div>

          {/* Price Tag Pill */}
          <div className="mt-2.5 px-1.5 sm:px-2 py-0.5 rounded-lg bg-black/40 border border-white/30 text-[10px] sm:text-[11px] font-mono font-black text-white text-center whitespace-nowrap shadow-xs">
            {demo.priceTag || '৳১,৯৯০'}
          </div>

          {/* Website Code Badge */}
          <span className="mt-1 px-1 rounded bg-white/15 text-[9px] font-mono font-bold text-emerald-100 tracking-tight">
            {demo.fourDigitCode}
          </span>

          {/* Hover interactive Arrow trigger */}
          <div className="mt-2 w-5 h-5 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-emerald-700 flex items-center justify-center transition-all duration-200 shadow-2xs">
            <ArrowRight className="w-3 h-3 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Floating Slide-out Hover Tooltip Tag on Left */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2.5 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-emerald-400/40 pointer-events-none animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{language === 'bn' ? '১-ক্লিকে এখনই অর্ডার করুন' : '1-Click Instant Order'}</span>
            <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -right-1 top-1/2 -translate-y-1/2 border-r border-t border-emerald-400/40" />
          </div>
        </button>
      </aside>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isLightboxOpen && demo.previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col animate-fadeIn select-none"
          role="dialog"
          aria-modal="true"
        >
          {/* Lightbox Header Bar */}
          <div className="w-full h-14 bg-slate-900/90 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#5B2C8A] text-white">
                {demo.fourDigitCode}
              </span>
              <h3 className="text-xs sm:text-sm font-bold truncate">
                {demo.title}
              </h3>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom(prev => Math.max(0.6, prev - 0.25))}
                className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title={t('জুম আউট', 'Zoom Out')}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(1)}
                className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title={t('রিসেট', 'Reset')}
              >
                {Math.round(lightboxZoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(prev => Math.min(3, prev + 0.25))}
                className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title={t('জুম ইন', 'Zoom In')}
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-5 w-px bg-white/20 mx-1" />

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 sm:p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-all cursor-pointer flex items-center gap-1"
                title={t('বন্ধ করুন', 'Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Body */}
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLightboxOpen(false);
            }}
            className="flex-1 w-full overflow-auto flex items-center justify-center p-4 cursor-zoom-out"
          >
            <img
              src={demo.previewImage}
              alt={demo.title}
              style={{
                transform: `scale(${lightboxZoom})`,
                transition: 'transform 0.15s ease-out'
              }}
              className="max-w-[95vw] max-h-[85vh] object-contain rounded-xl shadow-2xl select-none cursor-default"
            />
          </div>

          {/* Lightbox Footer Notice */}
          <div className="w-full py-2 bg-slate-950/80 border-t border-white/10 text-center text-[11px] text-slate-400">
            <span>{t('সম্পূর্ণ আসল রেজল্যুশনে প্রদর্শিত • কোনো অংশ কাটা পড়ছে না', 'Displayed in full original resolution • 100% visible with zero clipping')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
