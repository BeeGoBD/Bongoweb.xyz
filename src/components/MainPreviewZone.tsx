import { useState } from 'react';
import { 
  Globe, Image, ArrowRight, ArrowDown, ShieldCheck, Star, 
  ExternalLink, Sparkles, Layers, RotateCcw, 
  CreditCard, CheckCircle2, Lock, FileText, Server, 
  Menu, X, PhoneCall, ChevronRight, ChevronDown, ChevronUp, Zap, Eye, Laptop, Clock, Smartphone, MessageCircle, User,
  Play, Film
} from 'lucide-react';
import { PAYMENT_METHODS, TESTIMONIALS } from '../data/mockData';
import { WebsiteDemo } from '../types';

interface MainPreviewZoneProps {
  onBackToWizard: () => void;
  onOpenLiveBrowser: () => void;
  onOpenPhotoShowcase: () => void;
  onOpenPackages: () => void;
  onOpenVideoFaq: () => void;
  onOpenOrderModal: (demo?: WebsiteDemo | string) => void;
}

export default function MainPreviewZone({
  onBackToWizard,
  onOpenLiveBrowser,
  onOpenPhotoShowcase,
  onOpenPackages,
  onOpenVideoFaq,
  onOpenOrderModal
}: MainPreviewZoneProps) {
  const [expandedLiveCard, setExpandedLiveCard] = useState(false);
  const [expandedPhotoCard, setExpandedPhotoCard] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  return (
    <div 
      id="main-preview-zone"
      className="w-full flex flex-col min-h-screen relative z-10 transition-all duration-300 font-sans bg-white text-[#111111]"
    >
      {/* 1. Header Bar: Minimal, Elegant, Sticky, High-End Glass */}
      <header 
        id="main-header"
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-[#EDEDEF] shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-[68px] flex items-center justify-between gap-4 relative">
          {/* Top Left: Pure Designer Text Logo for BongoWeb with Accent Red #E91311 */}
          <div 
            onClick={onBackToWizard}
            className="flex items-baseline cursor-pointer select-none group py-1"
            title="BongoWeb — Home"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#111111] group-hover:text-black transition-colors">
              Bongo
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#E91311] group-hover:opacity-90 transition-opacity">
              Web
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E91311] ml-0.5 mb-1 shrink-0 animate-pulse" />
          </div>

          {/* Desktop Center Navigation Links (>= 1024px) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-[#666666]">
            <button 
              onClick={onOpenLiveBrowser}
              className="hover:text-[#FF9D14] transition-colors cursor-pointer py-2 min-h-[44px] flex items-center"
            >
              Live Catalog
            </button>
            <button 
              onClick={onOpenPhotoShowcase}
              className="hover:text-[#FF9D14] transition-colors cursor-pointer py-2 min-h-[44px] flex items-center"
            >
              Photo Showcase
            </button>
            <button 
              onClick={onOpenPackages}
              className="hover:text-[#FF9D14] transition-colors cursor-pointer py-2 min-h-[44px] flex items-center"
            >
              Pricing & Plans
            </button>
            <button 
              onClick={onOpenVideoFaq}
              className="hover:text-[#FF9D14] transition-colors cursor-pointer py-2 min-h-[44px] flex items-center"
            >
              Video Guides
            </button>
          </nav>

          {/* Top Right: Account Portal & Primary Action */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Account Icon (Min 48px touch target on mobile) */}
            <button
              onClick={() => {
                setAccountModalOpen(!accountModalOpen);
                setMobileMenuOpen(false);
              }}
              id="header-account-btn"
              className="min-h-[48px] px-3.5 py-2.5 rounded-xl text-[#111111] bg-[#F5F5F7] hover:bg-[#EDEDEF] border border-[#EDEDEF] transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold active:scale-95 touch-manipulation"
              aria-label="Account Portal"
              title="My Account"
            >
              <User className="w-4 h-4 text-[#666666]" />
              <span className="hidden sm:inline">Client Portal</span>
            </button>

            {/* Quick Order Button - Solid #FF9D14 Primary CTA */}
            <button
              onClick={() => onOpenOrderModal('Standard Starter Website')}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[48px] px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF9D14] hover:bg-[#FEB74F] shadow-[0_2px_10px_rgba(255,157,20,0.35)] transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 touch-manipulation"
            >
              <span>Order Website</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Mobile & Tablet Collapsible Menu Toggle (< 1024px, 48x48dp touch target) */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setAccountModalOpen(false);
              }}
              id="header-menu-btn"
              className="min-h-[48px] min-w-[48px] p-3 rounded-xl text-[#111111] bg-[#F5F5F7] hover:bg-[#EDEDEF] border border-[#EDEDEF] lg:hidden flex items-center justify-center cursor-pointer active:scale-95 transition-all touch-manipulation"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#111111]" /> : <Menu className="w-5 h-5 text-[#111111]" />}
            </button>
          </div>

          {/* Account Dropdown Modal */}
          {accountModalOpen && (
            <div className="absolute right-4 sm:right-6 top-16 sm:top-[66px] w-[calc(100vw-2rem)] sm:w-84 max-w-sm bg-white/98 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.16)] border border-[#EDEDEF] p-5 space-y-4 z-50 animate-fadeIn text-[#111111]">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDEDEF]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <User className="w-4 h-4 text-[#FF9D14]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111111] leading-tight">Entrepreneur Portal</div>
                    <div className="text-[11px] text-[#666666] font-medium">Fast tracking & engineering help</div>
                  </div>
                </div>
                <button
                  onClick={() => setAccountModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] text-[#888888] hover:text-[#111111] p-2 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 bg-[#FF9D14]/10 rounded-xl border border-[#FF9D14]/30 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                  <span>24-Hour Deployment Guarantee</span>
                </div>
                <span className="text-[11px] text-[#666666] block leading-relaxed">
                  Every order is custom-configured, branded, and connected to your domain within 24 hours of confirmation.
                </span>
              </div>

              <button
                onClick={() => {
                  setAccountModalOpen(false);
                  onOpenOrderModal('Standard Starter Website');
                }}
                className="w-full min-h-[48px] py-3 rounded-xl text-xs font-bold text-white bg-[#FF9D14] hover:bg-[#FEB74F] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,157,20,0.35)] transition-all active:scale-98 touch-manipulation"
              >
                <span>Launch New Website (৳999 BDT)</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[48px] py-3 rounded-xl text-xs font-semibold text-[#22C55E] bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 touch-manipulation"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Contact Direct WhatsApp Advisor</span>
              </a>
            </div>
          )}

          {/* Right Menu Dropdown Drawer (Mobile & Tablet < 1024px) */}
          {mobileMenuOpen && (
            <div className="absolute right-4 top-16 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white/98 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.16)] border border-[#EDEDEF] p-4 space-y-1.5 z-50 animate-fadeIn text-[#111111] lg:hidden">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLiveBrowser();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-[#FF9D14]/10 text-[#111111] font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-[#FF9D14]/15 touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#FF9D14]" />
                  <span>Browse Live Websites</span>
                </span>
                <span className="text-[10px] font-bold text-[#FF9D14] bg-[#FF9D14]/10 border border-[#FF9D14]/30 px-2 py-0.5 rounded">60+ Demos</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPhotoShowcase();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-[#FF9D14]/10 text-[#111111] font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-[#FF9D14]/15 touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <Image className="w-4 h-4 text-[#FF9D14]" />
                  <span>Design Photo Gallery</span>
                </span>
                <span className="text-[10px] font-bold text-[#666666] bg-[#F5F5F7] px-2 py-0.5 rounded">Photos</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVideoFaq();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-[#FF9D14]/10 text-[#111111] font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-[#FF9D14]/15 touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <Film className="w-4 h-4 text-[#FF9D14]" />
                  <span>Video Guides & FAQ</span>
                </span>
                <span className="text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-2 py-0.5 rounded">Videos</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPackages();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-[#FF9D14]/10 text-[#111111] font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-[#FF9D14]/15 touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-[#FF9D14]" />
                  <span>Packages & Pricing</span>
                </span>
                <span className="text-[10px] font-bold text-[#FF9D14] bg-[#FF9D14]/10 border border-[#FF9D14]/30 px-2 py-0.5 rounded">From ৳999 BDT</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackToWizard();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F5F7] text-[#666666] font-medium text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-[#EDEDEF] touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-[#888888]" />
                  <span>Restart Onboarding</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#888888]" />
              </button>

              <div className="pt-2 border-t border-[#EDEDEF]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrderModal('Standard Starter Website');
                  }}
                  className="w-full min-h-[48px] py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#FF9D14] hover:bg-[#FEB74F] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,157,20,0.35)] transition-all active:scale-98 touch-manipulation"
                >
                  <span>Checkout Now (৳999 BDT)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-start">
        {/* Editorial Section Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-[#111111] bg-white border border-[#FF9D14]/30 shadow-xs mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
            </span>
            <span>Interactive Production Gallery</span>
            <span className="text-[#888888]">·</span>
            <span className="text-[#FF9D14] font-bold">60+ Live Designs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight leading-tight">
            ২৪ ঘণ্টার মধ্যে আপনার নামে, আপনার লোগো দিয়ে{' '}
            <span className="text-[#FF9D14]">
              আপনার কাস্টমাইজেশনে ওয়েবসাইট বুঝে নিন
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#666666] mt-2">
            আপনাকে দেখানোর জন্য আমাদের ১০০+ রেডিমেড ওয়েবসাইট প্রস্তুত রয়েছে।
          </p>
        </div>

        {/* Dual Choice Cards - Modern Sunny Architecture */}
        <section 
          id="dual-choice-cards" 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full mb-12 relative items-start"
        >
          {/* Left Card: Live Interactive Websites */}
          <div 
            id="choice-card-live-browse"
            onClick={() => !expandedLiveCard && setExpandedLiveCard(true)}
            className={`group relative p-7 sm:p-8 rounded-3xl bg-white border border-[#EDEDEF] hover:border-[#FF9D14] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(255,157,20,0.14)] transition-all duration-300 flex flex-col justify-between overflow-hidden ${
              !expandedLiveCard ? 'cursor-pointer hover:-translate-y-1' : ''
            }`}
          >
            {/* Top Jewel Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9D14] to-[#FEB74F]" />

            {!expandedLiveCard ? (
              <div className="flex flex-col items-center justify-center text-center py-4 sm:py-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9D14] to-[#FEB74F] text-white flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-[0_4px_16px_rgba(255,157,20,0.35)]">
                  <Globe className="w-7 h-7 stroke-[2]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                  আমাদের লাইভ ওয়েবসাইটসমূহ
                </h2>
                <p className="text-xs sm:text-sm text-[#666666] mt-1 mb-7 max-w-xs">
                  বাস্তব ব্রাউজার ডেমো, লাইভ কার্ট, এবং কার্যকরী পেমেন্ট সিস্টেম সরাসরি টেস্ট করুন।
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedLiveCard(true);
                  }}
                  className="group/btn relative inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-black text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_22px_rgba(255,157,20,0.25)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <span>বিস্তারিত ও স্পেসিফিকেশন দেখুন</span>
                  <span className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-[#FF9D14]/20 border border-[#FF9D14]/40 text-[#FF9D14] shadow-inner group-hover/btn:bg-[#FF9D14] group-hover/btn:text-white transition-colors">
                    <ArrowDown className="w-3.5 h-3.5 stroke-[3] animate-bounce" />
                  </span>
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#EDEDEF]">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
                      আমাদের লাইভ ওয়েবসাইটসমূহ
                    </h2>
                    <p className="text-xs text-[#FF9D14] font-medium">
                      লাইভ ওয়েবসাইট ক্যাটালগ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedLiveCard(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#F5F5F7] hover:bg-[#EDEDEF] text-[#666666] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#EDEDEF]"
                  >
                    <span>সংক্ষিপ্ত করুন</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 mb-6 text-xs text-[#111111]">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]/70 border border-[#EDEDEF] shadow-2xs">
                    <Laptop className="w-4 h-4 text-[#FF9D14] shrink-0" />
                    <span className="font-semibold text-[#111111] flex-1">৬০+ লাইভ রেসপনসিভ ওয়েবসাইট ডেমো</span>
                    <span className="text-[10px] text-[#FF9D14] font-bold bg-[#FF9D14]/10 px-2 py-0.5 rounded border border-[#FF9D14]/30 font-mono">Live Browse</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]/70 border border-[#EDEDEF] shadow-2xs">
                    <Sparkles className="w-4 h-4 text-[#FF9D14] shrink-0" />
                    <span className="font-semibold text-[#111111] flex-1">আপনার নাম এবং লোগো সহ সম্পূর্ণ রেডি</span>
                    <span className="text-[10px] text-[#FF9D14] font-bold bg-[#FF9D14]/10 px-2 py-0.5 rounded border border-[#FF9D14]/30 font-mono">100% Custom</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]/70 border border-[#EDEDEF] shadow-2xs">
                    <Clock className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span className="font-semibold text-[#111111] flex-1">২৪ ঘণ্টার মধ্যে সম্পূর্ণ সাইট লাইভ ডেলিভারি</span>
                    <span className="text-[10px] text-[#22C55E] font-bold bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30 font-mono">24h Express</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]/70 border border-[#EDEDEF] shadow-2xs">
                    <Smartphone className="w-4 h-4 text-[#FF9D14] shrink-0" />
                    <span className="font-semibold text-[#111111] flex-1">মোবাইল থেকে সহজ ম্যানেজমেন্ট ও পেমেন্ট</span>
                    <span className="text-[10px] text-[#FF9D14] font-bold bg-[#FF9D14]/10 px-2 py-0.5 rounded border border-[#FF9D14]/30 font-mono">Easy Admin</span>
                  </div>
                </div>

                <button
                  onClick={onOpenLiveBrowser}
                  id="btn-live-web-visit"
                  className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#FF9D14] hover:bg-[#FEB74F] shadow-[0_4px_16px_rgba(255,157,20,0.35)] flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>লাইভ ক্যাটালগ খুলুন (৬০+ ডেমো)</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Card: Design Photo Gallery */}
          <div 
            id="choice-card-photo-showcase"
            onClick={() => !expandedPhotoCard && setExpandedPhotoCard(true)}
            className={`group relative p-7 sm:p-8 rounded-3xl bg-white border border-[#EDEDEF] hover:border-[#FF9D14] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(255,157,20,0.14)] transition-all duration-300 flex flex-col justify-between overflow-hidden ${
              !expandedPhotoCard ? 'cursor-pointer hover:-translate-y-1' : ''
            }`}
          >
            {/* Top Jewel Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9D14] via-[#FEB74F] to-[#E91311]" />

            {!expandedPhotoCard ? (
              <div className="flex flex-col items-center justify-center text-center py-4 sm:py-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF9D14] to-[#E91311] text-white flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-[0_4px_16px_rgba(233,19,17,0.25)]">
                  <Image className="w-7 h-7 stroke-[2]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                  আমাদের ওয়েবসাইট ফটো গ্যালারি
                </h2>
                <p className="text-xs sm:text-sm text-[#666666] mt-1 mb-7 max-w-xs">
                  হাই-রেজ্যুলেশন ফটো মকআপ, জুম ভিউ এবং স্পষ্ট ডিজাইন স্পেসিফিকেশন।
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedPhotoCard(true);
                  }}
                  className="group/btn relative inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-[#1A1A1A] hover:bg-black text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_22px_rgba(255,157,20,0.25)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <span>বিস্তারিত ও স্পেসিফিকেশন দেখুন</span>
                  <span className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-[#FF9D14]/20 border border-[#FF9D14]/40 text-[#FF9D14] shadow-inner group-hover/btn:bg-[#FF9D14] group-hover/btn:text-white transition-colors">
                    <ArrowDown className="w-3.5 h-3.5 stroke-[3] animate-bounce" />
                  </span>
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#EDEDEF]">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
                      আমাদের ওয়েবসাইট ফটো গ্যালারি
                    </h2>
                    <p className="text-xs text-[#FF9D14] font-medium">
                      হাই-রেজ্যুলেশন ডিজাইন মকআপ গ্যালারি
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedPhotoCard(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#F5F5F7] hover:bg-[#EDEDEF] text-[#666666] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#EDEDEF]"
                  >
                    <span>সংক্ষিপ্ত করুন</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 mb-6 text-xs text-[#111111]">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]/70 border border-[#EDEDEF] shadow-2xs">
                    <Laptop className="w-4 h-4 text-[#FF9D14] shrink-0" />
                    <span className="font-semibold text-[#111111] flex-1">৬০+ কিউরেটেড হাই-রেজ্যুলেশন ডিজাইন</span>
                    <span className="text-[10px] text-[#FF9D14] font-bold bg-[#FF9D14]/10 px-2 py-0.5 rounded border border-[#FF9D14]/30 font-mono">HD Gallery</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]/70 border border-[#EDEDEF] shadow-2xs">
                    <Sparkles className="w-4 h-4 text-[#FF9D14] shrink-0" />
                    <span className="font-semibold text-[#111111] flex-1">আপনার ব্র্যান্ড নাম ও লোগোর সাথে সাজানো</span>
                    <span className="text-[10px] text-[#FF9D14] font-bold bg-[#FF9D14]/10 px-2 py-0.5 rounded border border-[#FF9D14]/30 font-mono">100% Custom</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]/70 border border-[#EDEDEF] shadow-2xs">
                    <Clock className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span className="font-semibold text-[#111111] flex-1">২৪ ঘণ্টার মধ্যে সম্পূর্ণ সাইট ডেলিভারি</span>
                    <span className="text-[10px] text-[#22C55E] font-bold bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30 font-mono">24h Express</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F5F7]/70 border border-[#EDEDEF] shadow-2xs">
                    <Smartphone className="w-4 h-4 text-[#FF9D14] shrink-0" />
                    <span className="font-semibold text-[#111111] flex-1">মোবাইল থেকে সহজ ম্যানেজমেন্ট ও পরিচালনা</span>
                    <span className="text-[10px] text-[#FF9D14] font-bold bg-[#FF9D14]/10 px-2 py-0.5 rounded border border-[#FF9D14]/30 font-mono">Easy Admin</span>
                  </div>
                </div>

                <button
                  onClick={onOpenPhotoShowcase}
                  id="btn-photo-showcase-view"
                  className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#FF9D14] hover:bg-[#FEB74F] shadow-[0_4px_16px_rgba(255,157,20,0.35)] flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <Eye className="w-4 h-4" />
                  <span>ফটো গ্যালারি প্রদর্শনী খুলুন</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Video FAQ Spotlight Banner - Deep Charcoal with Warm Gold/Orange Accent */}
        <section 
          id="project-video-faq-banner"
          className="max-w-4xl mx-auto w-full mb-12 p-6 sm:p-7 rounded-3xl bg-[#111111] text-white shadow-[0_16px_40px_rgba(0,0,0,0.25)] border border-[#FF9D14]/30 ring-1 ring-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF9D14]/15 text-[#FF9D14] flex items-center justify-center shrink-0 border border-[#FF9D14]/30 shadow-inner">
              <Film className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#888888] mb-1">
                <span>Video Walkthrough</span>
                <span>·</span>
                <span className="text-[#22C55E] font-bold bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]/30">Self-Paced Guide</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                প্রজেক্ট ভিডিও গাইড এবং সচরাচর জিজ্ঞাসিত প্রশ্নাবলী
              </h3>
              <p className="text-xs sm:text-sm text-[#888888] mt-1 max-w-lg leading-relaxed">
                আমাদের ২৪ ঘণ্টার ডেলিভারি, ডোমেন সংযোগ এবং স্টোর ম্যানেজমেন্ট কীভাবে কাজ করে তা দেখে নিন।
              </p>
            </div>
          </div>

          <button
            onClick={onOpenVideoFaq}
            id="btn-open-video-faq"
            className="w-full md:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#FF9D14] hover:bg-[#FEB74F] transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,157,20,0.35)] flex items-center justify-center gap-2 shrink-0 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            <span>Watch Videos</span>
          </button>
        </section>
        {/* Supported Payment Gateways */}
        <section id="payment-gateways" className="max-w-4xl mx-auto w-full mb-14">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 mb-2 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Safe & Regulated Channels</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              Supported Payment Methods
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 max-w-lg mx-auto">
              Settle your one-time setup fee and monthly server hosting via bKash, Nagad, Card, or direct bank transfer.
            </p>
          </div>

          {/* Six Brand Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {/* 1. bKash */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDEDEF] hover:border-[#FF9D14]/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <img 
                src="/bkash-logo.svg" 
                alt="bKash" 
                className="w-10 h-10 rounded-xl mb-2 object-contain" 
              />
              <h4 className="text-xs font-bold text-[#111111]">
                bKash
              </h4>
              <p className="text-[10px] text-[#888888] mt-0.5">
                Merchant & Send
              </p>
              <span className="mt-2 text-[9px] font-bold text-[#E91311] bg-[#E91311]/10 border border-[#E91311]/30 px-2 py-0.5 rounded-full font-mono">
                Instant
              </span>
            </div>

            {/* 2. Nagad */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDEDEF] hover:border-[#FF9D14]/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#EDEDEF] flex items-center justify-center p-1 mb-2">
                <img 
                  src="/nagad-logo.svg" 
                  alt="Nagad" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">
                Nagad
              </h4>
              <p className="text-[10px] text-[#888888] mt-0.5">
                Fast & Secure
              </p>
              <span className="mt-2 text-[9px] font-bold text-[#FF9D14] bg-[#FF9D14]/10 border border-[#FF9D14]/30 px-2 py-0.5 rounded-full font-mono">
                Quick Pay
              </span>
            </div>

            {/* 3. Rocket */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDEDEF] hover:border-[#FF9D14]/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#EDEDEF] flex items-center justify-center p-1.5 mb-2">
                <img 
                  src="/rocket-logo.svg" 
                  alt="Rocket" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">
                Rocket
              </h4>
              <p className="text-[10px] text-[#888888] mt-0.5">
                DBBL Wallet
              </p>
              <span className="mt-2 text-[9px] font-bold text-[#666666] bg-[#F5F5F7] border border-[#EDEDEF] px-2 py-0.5 rounded-full font-mono">
                DBBL Pay
              </span>
            </div>

            {/* 4. Upay */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDEDEF] hover:border-[#FF9D14]/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-[#002E6E] text-amber-300 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18V25C15 30 19 34 24 34C29 34 33 30 33 25V18" stroke="#FFDD00" strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="19" cy="12" r="2.5" fill="#FFDD00" />
                  <circle cx="29" cy="12" r="2.5" fill="#FFDD00" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-[#111111]">
                Upay
              </h4>
              <p className="text-[10px] text-[#888888] mt-0.5">
                UCB Digital
              </p>
              <span className="mt-2 text-[9px] font-bold text-[#0064E0] bg-[#0064E0]/10 border border-[#0064E0]/30 px-2 py-0.5 rounded-full font-mono">
                UCB Pay
              </span>
            </div>

            {/* 5. Card Payment */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDEDEF] hover:border-[#FF9D14]/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#FF9D14] flex items-center justify-center mb-2 shadow-xs">
                <CreditCard className="w-5 h-5 text-[#FF9D14]" />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">
                Card Payment
              </h4>
              <p className="text-[10px] text-[#888888] mt-0.5">
                Visa, MC, AMEX
              </p>
              <span className="mt-2 text-[9px] font-bold text-[#111111] bg-[#F5F5F7] border border-[#EDEDEF] px-2 py-0.5 rounded-full font-mono">
                All Cards
              </span>
            </div>

            {/* 6. Bank Transfer */}
            <div className="p-4 rounded-2xl bg-white border border-[#EDEDEF] hover:border-[#FF9D14]/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] text-[#22C55E] flex items-center justify-center mb-2 shadow-xs">
                <Server className="w-5 h-5 text-[#22C55E]" />
              </div>
              <h4 className="text-xs font-bold text-[#111111]">
                Bank Transfer
              </h4>
              <p className="text-[10px] text-[#888888] mt-0.5">
                NPSB & BEFTN
              </p>
              <span className="mt-2 text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-2 py-0.5 rounded-full font-mono">
                Direct Bank
              </span>
            </div>
          </div>

          {/* Trust Certifications Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#F5F5F7] rounded-2xl border border-[#EDEDEF] shadow-2xs">
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF9D14]/15 text-[#FF9D14] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111111] block leading-tight">256-bit SSL Security</span>
                <span className="text-[10px] text-[#888888]">Bank-level Encryption</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111111] block leading-tight">Instant Order Processing</span>
                <span className="text-[10px] text-[#888888]">Automated Verification</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF9D14]/15 text-[#FF9D14] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111111] block leading-tight">Official Invoicing</span>
                <span className="text-[10px] text-[#888888]">Instant Digital Receipts</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#111111] block leading-tight">Zero Hidden Fees</span>
                <span className="text-[10px] text-[#888888]">100% Transparent</span>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section id="customer-reviews" className="max-w-4xl mx-auto w-full mb-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-[#EDEDEF]">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl font-extrabold text-[#111111] tracking-tight font-mono">4.9</span>
                <div className="flex items-center text-[#FF9D14]">
                  <Star className="w-4 h-4 fill-[#FF9D14] text-[#FF9D14]" />
                  <Star className="w-4 h-4 fill-[#FF9D14] text-[#FF9D14]" />
                  <Star className="w-4 h-4 fill-[#FF9D14] text-[#FF9D14]" />
                  <Star className="w-4 h-4 fill-[#FF9D14] text-[#FF9D14]" />
                  <Star className="w-4 h-4 fill-[#FF9D14] text-[#FF9D14]" />
                </div>
                <span className="text-xs text-[#888888] font-semibold">/ 5.0 Rating</span>
              </div>
              <p className="text-xs sm:text-sm text-[#666666] font-medium">
                Verified Entrepreneur Feedback & Case Studies
              </p>
            </div>

            <div className="px-3.5 py-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
              </span>
              <span>450+ Active Client Websites</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="p-6 rounded-2xl bg-white border border-[#EDEDEF] shadow-xs hover:border-[#FF9D14]/60 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-[#FF9D14]">
                      {[...Array(test.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FF9D14] text-[#FF9D14]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#888888] font-mono font-medium">
                      {test.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#111111] mb-2 leading-snug">
                    "{test.highlight}"
                  </h3>

                  <p className="text-xs text-[#666666] leading-relaxed font-normal mb-5">
                    {test.quote}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#EDEDEF]">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#EDEDEF] shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#111111] truncate">
                        {test.name}
                      </span>
                      <span className="text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.2 rounded border border-[#22C55E]/30 shrink-0">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-[#888888] truncate mt-0.5">
                      {test.role}, {test.business} ({test.location})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer: Quiet, Modern Deep Charcoal & Vibrant Accent */}
      <footer id="main-footer" className="w-full bg-[#111111] text-[#888888] border-t border-white/10 pt-12 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
          {/* Col 1 */}
          <div>
            <div className="flex items-baseline text-white font-black text-xl mb-3 select-none">
              <span className="text-white">Bongo</span>
              <span className="text-[#E91311]">Web</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E91311] ml-0.5 mb-0.5 shrink-0" />
            </div>
            <p className="text-[#888888] leading-relaxed text-xs mb-3">
              Affordable, reliable, turnkey website infrastructure engineered for modern businesses.
            </p>
            <div className="text-[11px] text-[#FF9D14] font-mono font-medium">
              24-Hour Deployment Guarantee
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenLiveBrowser} className="hover:text-[#FF9D14] transition-colors cursor-pointer">
                  Live Website Catalog
                </button>
              </li>
              <li>
                <button onClick={onOpenPhotoShowcase} className="hover:text-[#FF9D14] transition-colors cursor-pointer">
                  Photo Mockup Gallery
                </button>
              </li>
              <li>
                <button onClick={onOpenPackages} className="hover:text-[#FF9D14] transition-colors cursor-pointer">
                  Plans & Pricing (৳999 BDT)
                </button>
              </li>
              <li>
                <button onClick={onOpenVideoFaq} className="hover:text-[#FF9D14] transition-colors cursor-pointer">
                  Video Guides & Walkthrough
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3">
              Deliverables
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                <span>Custom Domain & SSL Included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                <span>1-Click WhatsApp Ordering</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                <span>bKash & Card Payment Gateways</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                <span>Lifetime Technical Assistance</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3">
              Infrastructure
            </h4>
            <div className="p-4 rounded-2xl bg-[#1A1A1A] border border-white/10 text-xs shadow-inner">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                </span>
                <span className="font-bold text-[#22C55E]">All Cloud Nodes Healthy</span>
              </div>
              <p className="text-[#888888] text-[11px] leading-relaxed">
                99.9% uptime SLA with automated 24/7 cloud server health monitoring.
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#888888] font-medium">
                <span>Edge Regions:</span>
                <span className="text-slate-200 font-mono">Asia-Pacific & Global</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-[#888888]">
          <div>
            © {new Date().getFullYear()} BongoWeb Inc. All rights reserved.
          </div>
          <div className="text-[#888888] font-medium">
            High-speed turnkey digital infrastructure for modern enterprises
          </div>
        </div>
      </footer>
    </div>
  );
}
