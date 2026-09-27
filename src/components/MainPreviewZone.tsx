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
      className="w-full flex flex-col min-h-screen relative z-10 transition-all duration-300 font-sans bg-[#0A0A0A] text-[#F5F5F5]"
    >
      {/* 1. Header Bar: Minimal, Elegant, Sticky, High-End Glass */}
      <header 
        id="main-header"
        className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.8)] transition-all"
      >
        <div className="max-w-6xl lg:max-w-7xl xl:max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between gap-4 relative">
          {/* Top Left: Upgraded Designer Logo for BongoWeb */}
          <div 
            onClick={onBackToWizard}
            id="bongo-web-logo"
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group py-1"
            title="BongoWeb — Home"
          >
            {/* Tech Emblem */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white text-black shadow-sm group-hover:scale-105 transition-all duration-200 shrink-0 flex items-center justify-center font-black text-xs sm:text-sm">
              BW
            </div>

            {/* Typographic Wordmark */}
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white transition-colors">
                  Bongo
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white transition-colors ml-0.5">
                  Web
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white ml-1 mb-0.5 shrink-0 animate-pulse ring-1 ring-white/50" />
              </div>
              <span className="text-[8.5px] font-bold tracking-widest text-white/50 uppercase -mt-0.5 hidden sm:block font-mono">
                Website Platform
              </span>
            </div>
          </div>

          {/* Desktop Center Navigation Links (>= 1024px) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-white/60">
            <button 
              onClick={onOpenLiveBrowser}
              className="hover:text-white transition-colors cursor-pointer py-2 min-h-[44px] flex items-center"
            >
              Live Catalog
            </button>
            <button 
              onClick={onOpenPhotoShowcase}
              className="hover:text-white transition-colors cursor-pointer py-2 min-h-[44px] flex items-center"
            >
              Photo Showcase
            </button>
            <button 
              onClick={onOpenPackages}
              className="hover:text-white transition-colors cursor-pointer py-2 min-h-[44px] flex items-center"
            >
              Pricing & Plans
            </button>
            <button 
              onClick={onOpenVideoFaq}
              className="hover:text-white transition-colors cursor-pointer py-2 min-h-[44px] flex items-center"
            >
              Video Guides
            </button>
          </nav>

          {/* Top Right: Account Portal & Primary Action */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Account Icon */}
            <button
              onClick={() => {
                setAccountModalOpen(!accountModalOpen);
                setMobileMenuOpen(false);
              }}
              id="header-account-btn"
              className="min-h-[48px] px-3.5 py-2.5 rounded-xl text-white bg-[#141414] hover:bg-white/10 border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold active:scale-95 touch-manipulation"
              aria-label="Account Portal"
              title="My Account"
            >
              <User className="w-4 h-4 text-white/70" />
              <span className="hidden sm:inline">Client Portal</span>
            </button>

            {/* Quick Order Button - Solid White Primary CTA */}
            <button
              onClick={() => onOpenOrderModal('Standard Starter Website')}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[48px] px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-neutral-200 shadow-[0_2px_14px_rgba(255,255,255,0.2)] transition-all cursor-pointer hover:scale-[1.02] active:scale-95 touch-manipulation"
            >
              <span>Order Website</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>

            {/* Mobile & Tablet Collapsible Menu Toggle (< 1024px) */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setAccountModalOpen(false);
              }}
              id="header-menu-btn"
              className="min-h-[48px] min-w-[48px] p-3 rounded-xl text-white bg-[#141414] hover:bg-white/10 border border-white/15 lg:hidden flex items-center justify-center cursor-pointer active:scale-95 transition-all touch-manipulation"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>

          {/* Account Dropdown Modal */}
          {accountModalOpen && (
            <div className="absolute right-4 sm:right-6 top-16 sm:top-[66px] w-[calc(100vw-2rem)] sm:w-84 max-w-sm bg-[#141414]/98 backdrop-blur-xl rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/15 p-5 space-y-4 z-50 animate-fadeIn text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">Entrepreneur Portal</div>
                    <div className="text-[11px] text-neutral-400 font-medium">Fast tracking & engineering help</div>
                  </div>
                </div>
                <button
                  onClick={() => setAccountModalOpen(false)}
                  className="min-h-[44px] min-w-[44px] text-white/60 hover:text-white p-2 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 bg-[#0A0A0A] rounded-xl border border-white/10 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-white mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>24-Hour Deployment Guarantee</span>
                </div>
                <span className="text-[11px] text-neutral-400 block leading-relaxed">
                  Every order is custom-configured, branded, and connected to your domain within 24 hours of confirmation.
                </span>
              </div>

              <button
                onClick={() => {
                  setAccountModalOpen(false);
                  onOpenOrderModal('Standard Starter Website');
                }}
                className="w-full min-h-[48px] py-3 rounded-xl text-xs font-bold text-black bg-white hover:bg-neutral-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,255,255,0.2)] transition-all active:scale-98 touch-manipulation"
              >
                <span>Launch New Website (৳999 BDT)</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="w-full min-h-[48px] py-3 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 touch-manipulation"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>Contact Direct WhatsApp Advisor</span>
              </a>
            </div>
          )}

          {/* Right Menu Dropdown Drawer (Mobile & Tablet < 1024px) */}
          {mobileMenuOpen && (
            <div className="absolute right-4 top-16 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-[#141414]/98 backdrop-blur-xl rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/15 p-4 space-y-1.5 z-50 animate-fadeIn text-white lg:hidden">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLiveBrowser();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-white/15 touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-white" />
                  <span>Browse Live Websites</span>
                </span>
                <span className="text-[10px] font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded font-mono">60+ Demos</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPhotoShowcase();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-white/15 touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <Image className="w-4 h-4 text-white" />
                  <span>Design Photo Gallery</span>
                </span>
                <span className="text-[10px] font-bold text-white/70 bg-white/10 border border-white/20 px-2 py-0.5 rounded font-mono">Photos</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVideoFaq();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-white/15 touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <Film className="w-4 h-4 text-white" />
                  <span>Video Guides & FAQ</span>
                </span>
                <span className="text-[10px] font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded font-mono">Videos</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPackages();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-white/15 touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-white" />
                  <span>Packages & Pricing</span>
                </span>
                <span className="text-[10px] font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded font-mono">From ৳999 BDT</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackToWizard();
                }}
                className="w-full min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white/60 font-medium text-xs sm:text-sm transition-colors cursor-pointer text-left active:bg-white/15 touch-manipulation"
              >
                <span className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-white/60" />
                  <span>Restart Onboarding</span>
                </span>
                <ChevronRight className="w-4 h-4 text-white/60" />
              </button>

              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrderModal('Standard Starter Website');
                  }}
                  className="w-full min-h-[48px] py-3 rounded-xl text-xs sm:text-sm font-bold text-black bg-white hover:bg-neutral-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(255,255,255,0.2)] transition-all active:scale-98 touch-manipulation"
                >
                  <span>Checkout Now (৳999 BDT)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Main Container */}
      <main className="flex-1 max-w-6xl lg:max-w-7xl xl:max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex flex-col justify-start">
        {/* Editorial Section Intro */}
        <div className="text-center max-w-2xl lg:max-w-4xl mx-auto mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#141414] border border-white/10 shadow-xs mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>Interactive Production Gallery</span>
            <span className="text-white/40">·</span>
            <span className="text-white font-bold">60+ Live Designs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight lg:leading-[1.16]">
            ২৪ ঘণ্টার মধ্যে আপনার নামে, আপনার লোগো দিয়ে{' '}
            <span className="underline decoration-white/30 underline-offset-6">
              আপনার কাস্টমাইজেশনে ওয়েবসাইট বুঝে নিন
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-300 mt-2 lg:mt-3 max-w-2xl mx-auto">
            আপনাকে দেখানোর জন্য আমাদের ১০০+ রেডিমেড ওয়েবসাইট প্রস্তুত রয়েছে।
          </p>
        </div>

        {/* Dual Choice Cards - Modern Luxury Pure Black & Charcoal Architecture */}
        <section 
          id="dual-choice-cards" 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full mb-12 relative items-stretch"
        >
          {/* Left Card: Live Interactive Websites */}
          <div 
            id="choice-card-live-browse"
            onClick={() => {
              if (!expandedLiveCard) {
                setExpandedLiveCard(true);
                setExpandedPhotoCard(true);
              }
            }}
            className={`group relative p-7 sm:p-8 lg:p-9 rounded-3xl bg-[#141414] text-white border border-white/10 hover:border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between overflow-hidden h-full min-h-[380px] sm:min-h-[420px] lg:min-h-[450px] ${
              !expandedLiveCard ? 'cursor-pointer hover:-translate-y-1' : ''
            }`}
          >
            {/* Top White Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/40 via-white/15 to-transparent" />

            {!expandedLiveCard ? (
              <div className="flex-1 flex flex-col items-center justify-between text-center py-4 sm:py-6 h-full">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-[0_4px_16px_rgba(255,255,255,0.1)]">
                  <Globe className="w-7 h-7 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight min-h-[32px] sm:min-h-[36px] flex items-center justify-center">
                    আমাদের লাইভ ওয়েবসাইটসমূহ
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 mb-7 max-w-xs mx-auto min-h-[40px] sm:min-h-[44px] flex items-center justify-center leading-relaxed">
                    বাস্তব ব্রাউজার ডেমো, লাইভ কার্ট, এবং কার্যকরী পেমেন্ট সিস্টেম সরাসরি টেস্ট করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedLiveCard(true);
                    setExpandedPhotoCard(true);
                  }}
                  className="group/btn relative inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm cursor-pointer border border-white/20 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <span>বিস্তারিত ও স্পেসিফিকেশন দেখুন</span>
                  <span className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-white/10 border border-white/20 text-white shadow-inner group-hover/btn:bg-white group-hover/btn:text-black transition-colors">
                    <ArrowDown className="w-3.5 h-3.5 stroke-[3] animate-bounce" />
                  </span>
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10 h-[56px]">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        আমাদের লাইভ ওয়েবসাইটসমূহ
                      </h2>
                      <p className="text-xs text-white/70 font-medium">
                        লাইভ ওয়েবসাইট ক্যাটালগ
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedLiveCard(false);
                        setExpandedPhotoCard(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
                    >
                      <span>সংক্ষিপ্ত করুন</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 mb-6 text-xs text-white">
                    <div className="min-h-[58px] flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xs hover:border-white/20 transition-colors">
                      <Laptop className="w-4 h-4 text-white shrink-0" />
                      <span className="font-semibold text-white flex-1">৬০+ লাইভ রেসপনসিভ ওয়েবসাইট ডেমো</span>
                      <span className="text-[10px] text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono">Live Browse</span>
                    </div>

                    <div className="min-h-[58px] flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xs hover:border-white/20 transition-colors">
                      <Sparkles className="w-4 h-4 text-white shrink-0" />
                      <span className="font-semibold text-white flex-1">আপনার নাম এবং লোগো সহ সম্পূর্ণ রেডি</span>
                      <span className="text-[10px] text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono">100% Custom</span>
                    </div>

                    <div className="min-h-[58px] flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xs hover:border-white/20 transition-colors">
                      <Clock className="w-4 h-4 text-white shrink-0" />
                      <span className="font-semibold text-white flex-1">২৪ ঘণ্টার মধ্যে সম্পূর্ণ সাইট লাইভ ডেলিভারি</span>
                      <span className="text-[10px] text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono">24h Express</span>
                    </div>

                    <div className="min-h-[58px] flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xs hover:border-white/20 transition-colors">
                      <Smartphone className="w-4 h-4 text-white shrink-0" />
                      <span className="font-semibold text-white flex-1">মোবাইল থেকে সহজ ম্যানেজমেন্ট ও পেমেন্ট</span>
                      <span className="text-[10px] text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono">Easy Admin</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenLiveBrowser}
                  id="btn-live-web-visit"
                  className="w-full btn-wave-ltr min-h-[50px] py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-black bg-white hover:bg-neutral-200 shadow-[0_4px_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ExternalLink className="w-4 h-4 text-black" />
                  <span>লাইভ ক্যাটালগ খুলুন (৬০+ ডেমো)</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Card: Design Photo Gallery */}
          <div 
            id="choice-card-photo-showcase"
            onClick={() => {
              if (!expandedPhotoCard) {
                setExpandedLiveCard(true);
                setExpandedPhotoCard(true);
              }
            }}
            className={`group relative p-7 sm:p-8 lg:p-9 rounded-3xl bg-[#141414] text-white border border-white/10 hover:border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between overflow-hidden h-full min-h-[380px] sm:min-h-[420px] lg:min-h-[450px] ${
              !expandedPhotoCard ? 'cursor-pointer hover:-translate-y-1' : ''
            }`}
          >
            {/* Top White Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/40 via-white/15 to-transparent" />

            {!expandedPhotoCard ? (
              <div className="flex-1 flex flex-col items-center justify-between text-center py-4 sm:py-6 h-full">
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-[0_4px_16px_rgba(255,255,255,0.1)]">
                  <Image className="w-7 h-7 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight min-h-[32px] sm:min-h-[36px] flex items-center justify-center">
                    আমাদের ওয়েবসাইট ফটো গ্যালারি
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 mb-7 max-w-xs mx-auto min-h-[40px] sm:min-h-[44px] flex items-center justify-center leading-relaxed">
                    হাই-রেজ্যুলেশন ফটো মকআপ, জুম ভিউ এবং স্পষ্ট ডিজাইন স্পেসিফিকেশন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedLiveCard(true);
                    setExpandedPhotoCard(true);
                  }}
                  className="group/btn relative inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm cursor-pointer border border-white/20 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <span>বিস্তারিত ও স্পেসিফিকেশন দেখুন</span>
                  <span className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-white/10 border border-white/20 text-white shadow-inner group-hover/btn:bg-white group-hover/btn:text-black transition-colors">
                    <ArrowDown className="w-3.5 h-3.5 stroke-[3] animate-bounce" />
                  </span>
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10 h-[56px]">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        আমাদের ওয়েবসাইট ফটো গ্যালারি
                      </h2>
                      <p className="text-xs text-white/70 font-medium">
                        হাই-রেজ্যুলেশন ডিজাইন মকআপ গ্যালারি
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedLiveCard(false);
                        setExpandedPhotoCard(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
                    >
                      <span>সংক্ষিপ্ত করুন</span>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 mb-6 text-xs text-white">
                    <div className="min-h-[58px] flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xs hover:border-white/20 transition-colors">
                      <Laptop className="w-4 h-4 text-white shrink-0" />
                      <span className="font-semibold text-white flex-1">৬০+ কিউরেটেড হাই-রেজ্যুলেশন ডিজাইন</span>
                      <span className="text-[10px] text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono">HD Gallery</span>
                    </div>

                    <div className="min-h-[58px] flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xs hover:border-white/20 transition-colors">
                      <Sparkles className="w-4 h-4 text-white shrink-0" />
                      <span className="font-semibold text-white flex-1">আপনার ব্র্যান্ড নাম ও লোগোর সাথে সাজানো</span>
                      <span className="text-[10px] text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono">100% Custom</span>
                    </div>

                    <div className="min-h-[58px] flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xs hover:border-white/20 transition-colors">
                      <Clock className="w-4 h-4 text-white shrink-0" />
                      <span className="font-semibold text-white flex-1">২৪ ঘণ্টার মধ্যে সম্পূর্ণ সাইট ডেলিভারি</span>
                      <span className="text-[10px] text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono">24h Express</span>
                    </div>

                    <div className="min-h-[58px] flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xs hover:border-white/20 transition-colors">
                      <Smartphone className="w-4 h-4 text-white shrink-0" />
                      <span className="font-semibold text-white flex-1">মোবাইল থেকে সহজ ম্যানেজমেন্ট ও পরিচালনা</span>
                      <span className="text-[10px] text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 font-mono">Easy Admin</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onOpenPhotoShowcase}
                  id="btn-photo-showcase-view"
                  className="w-full btn-wave-ltr min-h-[50px] py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-black bg-white hover:bg-neutral-200 shadow-[0_4px_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Eye className="w-4 h-4 text-black" />
                  <span>ফটো গ্যালারি প্রদর্শনী খুলুন</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Video FAQ Spotlight Banner - Rich Charcoal with Crisp White Accent */}
        <section 
          id="project-video-faq-banner"
          className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full mb-12 p-6 sm:p-7 lg:p-8 rounded-3xl bg-[#141414] text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
              <Film className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 mb-1">
                <span>Video Walkthrough</span>
                <span>·</span>
                <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20">Self-Paced Guide</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                প্রজেক্ট ভিডিও গাইড এবং সচরাচর জিজ্ঞাসিত প্রশ্নাবলী
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg leading-relaxed">
                আমাদের ২৪ ঘণ্টার ডেলিভারি, ডোমেন সংযোগ এবং স্টোর ম্যানেজমেন্ট কীভাবে কাজ করে তা দেখে নিন।
              </p>
            </div>
          </div>

          <button
            onClick={onOpenVideoFaq}
            id="btn-open-video-faq"
            className="w-full md:w-auto btn-wave-rtl px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02] active:scale-[0.99]"
          >
            <Play className="w-3.5 h-3.5 fill-black text-black ml-0.5" />
            <span>Watch Videos</span>
          </button>
        </section>
        {/* Supported Payment Gateways */}
        {/* Payment Gateway Supported Strip */}
        <section id="payment-gateways" className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto w-full mb-14">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 mb-2 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Safe & Regulated Channels</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Supported Payment Methods
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg mx-auto">
              Settle your one-time setup fee and monthly server hosting via bKash, Nagad, Card, or direct bank transfer.
            </p>
          </div>

          {/* Six Brand Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {/* 1. bKash */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <img 
                src="/bkash-logo.svg" 
                alt="bKash" 
                className="w-10 h-10 rounded-xl mb-2 object-contain" 
              />
              <h4 className="text-xs font-bold text-white">
                bKash
              </h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Merchant & Send
              </p>
              <span className="mt-2 text-[9px] font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-full font-mono">
                Instant
              </span>
            </div>

            {/* 2. Nagad */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-white/20 flex items-center justify-center p-1 mb-2">
                <img 
                  src="/nagad-logo.svg" 
                  alt="Nagad" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h4 className="text-xs font-bold text-white">
                Nagad
              </h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Fast & Secure
              </p>
              <span className="mt-2 text-[9px] font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-full font-mono">
                Quick Pay
              </span>
            </div>

            {/* 3. Rocket */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-white/20 flex items-center justify-center p-1.5 mb-2">
                <img 
                  src="/rocket-logo.svg" 
                  alt="Rocket" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h4 className="text-xs font-bold text-white">
                Rocket
              </h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                DBBL Wallet
              </p>
              <span className="mt-2 text-[9px] font-bold text-neutral-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-mono">
                DBBL Pay
              </span>
            </div>

            {/* 4. Upay */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center mb-2">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white">
                Upay
              </h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                UCB Digital
              </p>
              <span className="mt-2 text-[9px] font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-full font-mono">
                UCB Pay
              </span>
            </div>

            {/* 5. Card Payment */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center mb-2 shadow-xs">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white">
                Card Payment
              </h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Visa, MC, AMEX
              </p>
              <span className="mt-2 text-[9px] font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-full font-mono">
                All Cards
              </span>
            </div>

            {/* 6. Bank Transfer */}
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20 flex items-center justify-center mb-2 shadow-xs">
                <Server className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white">
                Bank Transfer
              </h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                NPSB & BEFTN
              </p>
              <span className="mt-2 text-[9px] font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-full font-mono">
                Direct Bank
              </span>
            </div>
          </div>

          {/* Trust Certifications Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#141414] rounded-2xl border border-white/10 shadow-2xs">
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">256-bit SSL Security</span>
                <span className="text-[10px] text-neutral-400">Bank-level Encryption</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">Instant Order Processing</span>
                <span className="text-[10px] text-neutral-400">Automated Verification</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">Official Invoicing</span>
                <span className="text-[10px] text-neutral-400">Instant Digital Receipts</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">Zero Hidden Fees</span>
                <span className="text-[10px] text-neutral-400">100% Transparent</span>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section id="customer-reviews" className="max-w-4xl mx-auto w-full mb-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">4.9</span>
                <div className="flex items-center text-white">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <Star className="w-4 h-4 fill-white text-white" />
                  <Star className="w-4 h-4 fill-white text-white" />
                  <Star className="w-4 h-4 fill-white text-white" />
                  <Star className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="text-xs text-neutral-400 font-semibold">/ 5.0 Rating</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                Verified Entrepreneur Feedback & Case Studies
              </p>
            </div>

            <div className="px-3.5 py-1.5 bg-[#141414] text-white border border-white/20 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>450+ Active Client Websites</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-xs hover:border-white/30 hover:shadow-md transition-all flex flex-col justify-between text-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-white">
                      {[...Array(test.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono font-medium">
                      {test.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    "{test.highlight}"
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed font-normal mb-5">
                    {test.quote}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {test.name}
                      </span>
                      <span className="text-[9px] font-bold text-black bg-white px-1.5 py-0.2 rounded shrink-0">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {test.role}, {test.business} ({test.location})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer: Pure Black & White */}
      <footer id="main-footer" className="w-full bg-[#0A0A0A] text-neutral-400 border-t border-white/10 pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl lg:max-w-7xl xl:max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
          {/* Col 1 */}
          <div>
            <div className="flex items-baseline font-black text-xl mb-3 select-none">
              <span className="text-white tracking-tight">BongoWeb</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white ml-1 mb-0.5 shrink-0" />
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs mb-3">
              Affordable, reliable, turnkey website infrastructure engineered for modern businesses.
            </p>
            <div className="text-[11px] text-white font-mono font-medium">
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
                <button onClick={onOpenLiveBrowser} className="hover:text-white transition-colors cursor-pointer">
                  Live Website Catalog
                </button>
              </li>
              <li>
                <button onClick={onOpenPhotoShowcase} className="hover:text-white transition-colors cursor-pointer">
                  Photo Mockup Gallery
                </button>
              </li>
              <li>
                <button onClick={onOpenPackages} className="hover:text-white transition-colors cursor-pointer">
                  Plans & Pricing (৳999 BDT)
                </button>
              </li>
              <li>
                <button onClick={onOpenVideoFaq} className="hover:text-white transition-colors cursor-pointer">
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
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Custom Domain & SSL Included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                <span>1-Click WhatsApp Ordering</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                <span>bKash & Card Payment Gateways</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Lifetime Technical Assistance</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3">
              Infrastructure
            </h4>
            <div className="p-4 rounded-2xl bg-[#141414] border border-white/10 text-xs shadow-inner">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="font-bold text-white">All Cloud Nodes Healthy</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                99.9% uptime SLA with automated 24/7 cloud server health monitoring.
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                <span>Edge Regions:</span>
                <span className="text-white font-mono">Asia-Pacific & Global</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl lg:max-w-7xl xl:max-w-[1360px] mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} BongoWeb Inc. All rights reserved.
          </div>
          <div className="text-neutral-400 font-medium">
            High-speed turnkey digital infrastructure for modern enterprises
          </div>
        </div>
      </footer>
    </div>
  );
}
