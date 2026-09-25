import { useState } from 'react';
import { 
  Globe, Image, ArrowRight, ShieldCheck, Star, 
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
      className="w-full flex flex-col min-h-screen relative z-10 transition-all duration-300 font-sans bg-[#F8FAFC] text-slate-900"
    >
      {/* 1. Header Bar: Minimal, Elegant, Sticky, High-End Glass */}
      <header 
        id="main-header"
        className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-all"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-[68px] flex items-center justify-between gap-4 relative">
          {/* Top Left: Pure Designer Text Logo for BongoWeb */}
          <div 
            onClick={onBackToWizard}
            className="flex items-baseline cursor-pointer select-none group py-1"
            title="BongoWeb — Home"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
              Bongo
            </span>
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              Web
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 ml-0.5 mb-1 shrink-0 animate-pulse" />
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <button 
              onClick={onOpenLiveBrowser}
              className="hover:text-indigo-600 transition-colors cursor-pointer py-1"
            >
              Live Catalog
            </button>
            <button 
              onClick={onOpenPhotoShowcase}
              className="hover:text-indigo-600 transition-colors cursor-pointer py-1"
            >
              Photo Showcase
            </button>
            <button 
              onClick={onOpenPackages}
              className="hover:text-indigo-600 transition-colors cursor-pointer py-1"
            >
              Pricing & Plans
            </button>
            <button 
              onClick={onOpenVideoFaq}
              className="hover:text-indigo-600 transition-colors cursor-pointer py-1"
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
              className="px-3 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
              aria-label="Account Portal"
              title="My Account"
            >
              <User className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Client Portal</span>
            </button>

            {/* Quick Order Button */}
            <button
              onClick={() => onOpenOrderModal('Standard Starter Website')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 shadow-[0_2px_10px_rgba(5,150,105,0.25)] transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Order Website</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setAccountModalOpen(false);
              }}
              id="header-menu-btn"
              className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 md:hidden cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Account Dropdown Modal */}
          {accountModalOpen && (
            <div className="absolute right-4 sm:right-6 top-16 sm:top-[66px] w-76 sm:w-84 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.16)] border border-slate-200/90 p-5 space-y-4 z-50 animate-fadeIn text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">Entrepreneur Portal</div>
                    <div className="text-[11px] text-slate-500 font-medium">Fast tracking & engineering help</div>
                  </div>
                </div>
                <button
                  onClick={() => setAccountModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/40 rounded-xl border border-indigo-100/80 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-950 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>24-Hour Deployment Guarantee</span>
                </div>
                <span className="text-[11px] text-slate-600 block leading-relaxed">
                  Every order is custom-configured, branded, and connected to your domain within 24 hours of confirmation.
                </span>
              </div>

              <button
                onClick={() => {
                  setAccountModalOpen(false);
                  onOpenOrderModal('Standard Starter Website');
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Launch New Website (৳999 BDT)</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              </button>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact Direct WhatsApp Advisor</span>
              </a>
            </div>
          )}

          {/* Right Menu Dropdown Drawer (Mobile) */}
          {mobileMenuOpen && (
            <div className="absolute right-4 top-16 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.16)] border border-slate-200/90 p-4 space-y-2 z-50 animate-fadeIn text-slate-800 md:hidden">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLiveBrowser();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 text-slate-900 font-semibold text-xs transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Browse Live Websites</span>
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded">60+ Demos</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPhotoShowcase();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 text-slate-900 font-semibold text-xs transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Image className="w-4 h-4 text-indigo-600" />
                  <span>Design Photo Gallery</span>
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Photos</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVideoFaq();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 text-slate-900 font-semibold text-xs transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-indigo-600" />
                  <span>Video Guides & FAQ</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/80 px-2 py-0.5 rounded">Videos</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPackages();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 text-slate-900 font-semibold text-xs transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Packages & Pricing</span>
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded">From ৳999 BDT</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackToWizard();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 font-medium text-xs transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>Restart Onboarding</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrderModal('Standard Starter Website');
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(5,150,105,0.2)] transition-all"
                >
                  <span>Checkout Now (৳999 BDT)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-100" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 bg-white border border-indigo-200/80 shadow-[0_1px_4px_rgba(79,70,229,0.06)] mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Interactive Production Gallery</span>
            <span className="text-slate-300">·</span>
            <span className="text-indigo-600 font-bold">60+ Live Designs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore ready-made websites built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
              immediate revenue
            </span>.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Test interactive live browsers or view high-resolution photo mockups. Choose your design and launch within 24 hours.
          </p>
        </div>

        {/* Dual Choice Cards - Quiet Luxury Architecture */}
        <section 
          id="dual-choice-cards" 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full mb-12 relative items-start"
        >
          {/* Left Card: Live Interactive Websites */}
          <div 
            id="choice-card-live-browse"
            onClick={() => !expandedLiveCard && setExpandedLiveCard(true)}
            className={`group relative p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-white via-white to-blue-50/25 border border-blue-200/80 hover:border-blue-400/90 shadow-[0_4px_24px_rgba(59,130,246,0.06)] hover:shadow-[0_16px_40px_rgba(59,130,246,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden ${
              !expandedLiveCard ? 'cursor-pointer hover:-translate-y-1' : ''
            }`}
          >
            {/* Top Jewel Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 to-indigo-600" />

            {!expandedLiveCard ? (
              <div className="flex flex-col items-center justify-center text-center py-4 sm:py-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
                  <Globe className="w-7 h-7 stroke-[2]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Our Live Websites
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-7 max-w-xs">
                  Interactive live browser demos with working carts, responsive viewports, and live checkouts.
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedLiveCard(true);
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-[0_4px_14px_rgba(15,23,42,0.18)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.22)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <span>View Details & Specifications</span>
                  <ChevronDown className="w-4 h-4 stroke-[2.5] text-indigo-300" />
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-blue-100">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      Our Live Websites
                    </h2>
                    <p className="text-xs text-blue-600 font-medium">
                      Interactive Live Browser Catalog
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedLiveCard(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200/60"
                  >
                    <span>Collapse</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-blue-200/70 shadow-2xs">
                    <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-900 flex-1">60+ Live responsive website demos</span>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 font-mono">Live Browse</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-900 flex-1">Delivered under your brand name and logo</span>
                    <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60 font-mono">100% Custom</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900 flex-1">Complete turnkey delivery within 24 hours</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-mono">24h Express</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-blue-200/70 shadow-2xs">
                    <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-900 flex-1">Mobile management & automated payments</span>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 font-mono">Easy Admin</span>
                  </div>
                </div>

                <button
                  onClick={onOpenLiveBrowser}
                  id="btn-live-web-visit"
                  className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 shadow-[0_4px_16px_rgba(59,130,246,0.25)] flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Live Catalog (60+ Demos)</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Card: Design Photo Gallery */}
          <div 
            id="choice-card-photo-showcase"
            onClick={() => !expandedPhotoCard && setExpandedPhotoCard(true)}
            className={`group relative p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-white via-white to-indigo-50/25 border border-indigo-200/80 hover:border-indigo-400/90 shadow-[0_4px_24px_rgba(99,102,241,0.06)] hover:shadow-[0_16px_40px_rgba(99,102,241,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden ${
              !expandedPhotoCard ? 'cursor-pointer hover:-translate-y-1' : ''
            }`}
          >
            {/* Top Jewel Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-purple-600" />

            {!expandedPhotoCard ? (
              <div className="flex flex-col items-center justify-center text-center py-4 sm:py-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-[0_4px_16px_rgba(99,102,241,0.3)]">
                  <Image className="w-7 h-7 stroke-[2]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Our Websites in Photos
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-7 max-w-xs">
                  High-resolution photo mockups with clean zoom, visual specs, and design breakdowns.
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedPhotoCard(true);
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-[0_4px_14px_rgba(15,23,42,0.18)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.22)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <span>View Details & Specifications</span>
                  <ChevronDown className="w-4 h-4 stroke-[2.5] text-indigo-300" />
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-indigo-100">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      Our Websites in Photos
                    </h2>
                    <p className="text-xs text-indigo-600 font-medium">
                      High-Resolution Mockup Gallery
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedPhotoCard(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-200/60"
                  >
                    <span>Collapse</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
                    <Laptop className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-900 flex-1">60+ Curated high-res design mockups</span>
                    <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60 font-mono">HD Gallery</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-purple-200/70 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="font-semibold text-slate-900 flex-1">Delivered under your brand name and logo</span>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60 font-mono">100% Custom</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-200/70 shadow-2xs">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-900 flex-1">Complete turnkey delivery within 24 hours</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-mono">24h Express</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-indigo-200/70 shadow-2xs">
                    <Smartphone className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-900 flex-1">Mobile management & automated payments</span>
                    <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60 font-mono">Easy Admin</span>
                  </div>
                </div>

                <button
                  onClick={onOpenPhotoShowcase}
                  id="btn-photo-showcase-view"
                  className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 shadow-[0_4px_16px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Photo Gallery Showcase</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Video FAQ Spotlight Banner */}
        <section 
          id="project-video-faq-banner"
          className="max-w-4xl mx-auto w-full mb-12 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white shadow-[0_16px_40px_rgba(15,23,42,0.22)] border border-indigo-500/25 ring-1 ring-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-white flex items-center justify-center shrink-0 border border-indigo-400/30 shadow-inner">
              <Film className="w-6 h-6 stroke-[1.8] text-indigo-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
                <span>Video Walkthrough</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">Self-Paced Guide</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Watch the Project Walkthrough & Frequently Asked Questions
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
                See exactly how our 24-hour setup works, how domain connections happen, and how you manage your store.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenVideoFaq}
            id="btn-open-video-faq"
            className="w-full md:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 shrink-0 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5" />
            <span>Watch Video FAQs</span>
          </button>
        </section>
        {/* Supported Payment Gateways */}
        <section id="payment-gateways" className="max-w-4xl mx-auto w-full mb-14">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-2 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Regulated Channels</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Supported Payment Methods
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto">
              Settle your one-time setup fee and monthly server hosting via bKash, Nagad, Card, or direct bank transfer.
            </p>
          </div>

          {/* Six Brand Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {/* 1. bKash */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-pink-300 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_18px_rgba(236,72,153,0.12)] transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <img 
                src="/bkash-logo.svg" 
                alt="bKash" 
                className="w-10 h-10 rounded-xl mb-2 object-contain" 
              />
              <h4 className="text-xs font-bold text-slate-900">
                bKash
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Merchant & Send
              </p>
              <span className="mt-2 text-[9px] font-bold text-pink-700 bg-pink-50 border border-pink-200/60 px-2 py-0.5 rounded-full font-mono">
                Instant
              </span>
            </div>

            {/* 2. Nagad */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_18px_rgba(245,158,11,0.12)] transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1 mb-2">
                <img 
                  src="/nagad-logo.svg" 
                  alt="Nagad" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Nagad
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Fast & Secure
              </p>
              <span className="mt-2 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full font-mono">
                Quick Pay
              </span>
            </div>

            {/* 3. Rocket */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_18px_rgba(168,85,247,0.12)] transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1.5 mb-2">
                <img 
                  src="/rocket-logo.svg" 
                  alt="Rocket" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Rocket
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                DBBL Wallet
              </p>
              <span className="mt-2 text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-full font-mono">
                DBBL Pay
              </span>
            </div>

            {/* 4. Upay */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_18px_rgba(59,130,246,0.12)] transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-[#002E6E] text-amber-300 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18V25C15 30 19 34 24 34C29 34 33 30 33 25V18" stroke="#FFDD00" strokeWidth="4.5" strokeLinecap="round" />
                  <circle cx="19" cy="12" r="2.5" fill="#FFDD00" />
                  <circle cx="29" cy="12" r="2.5" fill="#FFDD00" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Upay
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                UCB Digital
              </p>
              <span className="mt-2 text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full font-mono">
                UCB Pay
              </span>
            </div>

            {/* 5. Card Payment */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_18px_rgba(99,102,241,0.12)] transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex items-center justify-center mb-2 shadow-xs">
                <CreditCard className="w-5 h-5 text-indigo-300" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Card Payment
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Visa, MC, AMEX
              </p>
              <span className="mt-2 text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full font-mono">
                All Cards
              </span>
            </div>

            {/* 6. Bank Transfer */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_18px_rgba(16,185,129,0.12)] transition-all flex flex-col items-center justify-between text-center hover:-translate-y-0.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white flex items-center justify-center mb-2 shadow-xs">
                <Server className="w-5 h-5 text-emerald-300" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Bank Transfer
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">
                NPSB & BEFTN
              </p>
              <span className="mt-2 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full font-mono">
                Direct Bank
              </span>
            </div>
          </div>

          {/* Trust Certifications Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gradient-to-r from-emerald-50/60 via-white to-blue-50/60 rounded-2xl border border-emerald-200/80 shadow-[0_2px_8px_rgba(16,185,129,0.04)]">
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">256-bit SSL Security</span>
                <span className="text-[10px] text-slate-500">Bank-level Encryption</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Instant Order Processing</span>
                <span className="text-[10px] text-slate-500">Automated Verification</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Official Invoicing</span>
                <span className="text-[10px] text-slate-500">Instant Digital Receipts</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Zero Hidden Fees</span>
                <span className="text-[10px] text-slate-500">100% Transparent</span>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section id="customer-reviews" className="max-w-4xl mx-auto w-full mb-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/90">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">4.9</span>
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-xs text-slate-500 font-semibold">/ 5.0 Rating</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Verified Entrepreneur Feedback & Case Studies
              </p>
            </div>

            <div className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>450+ Active Client Websites</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="p-6 rounded-2xl bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:border-indigo-300 hover:shadow-[0_8px_24px_rgba(79,70,229,0.08)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(test.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono font-medium">
                      {test.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    "{test.highlight}"
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                    {test.quote}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {test.name}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {test.role}, {test.business} ({test.location})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer: Quiet, High-End Enterprise */}
      <footer id="main-footer" className="w-full bg-[#0B0F19] text-slate-400 border-t border-slate-800/80 pt-12 pb-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
          {/* Col 1 */}
          <div>
            <div className="flex items-baseline text-white font-black text-xl mb-3 select-none">
              <span className="text-white">Bongo</span>
              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-indigo-400 bg-clip-text text-transparent">Web</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-0.5 mb-0.5 shrink-0" />
            </div>
            <p className="text-slate-400 leading-relaxed text-xs mb-3">
              Affordable, reliable, turnkey website infrastructure engineered for modern businesses.
            </p>
            <div className="text-[11px] text-indigo-400 font-mono font-medium">
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
                <button onClick={onOpenLiveBrowser} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Live Website Catalog
                </button>
              </li>
              <li>
                <button onClick={onOpenPhotoShowcase} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Photo Mockup Gallery
                </button>
              </li>
              <li>
                <button onClick={onOpenPackages} className="hover:text-indigo-400 transition-colors cursor-pointer">
                  Plans & Pricing (৳999 BDT)
                </button>
              </li>
              <li>
                <button onClick={onOpenVideoFaq} className="hover:text-indigo-400 transition-colors cursor-pointer">
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
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Custom Domain & SSL Included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>1-Click WhatsApp Ordering</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>bKash & Card Payment Gateways</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Lifetime Technical Assistance</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3">
              Infrastructure
            </h4>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs shadow-inner">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-emerald-400">All Cloud Nodes Healthy</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                99.9% uptime SLA with automated 24/7 cloud server health monitoring.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Edge Regions:</span>
                <span className="text-slate-300 font-mono">Asia-Pacific & Global</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} BongoWeb Inc. All rights reserved.
          </div>
          <div className="text-slate-400 font-medium">
            High-speed turnkey digital infrastructure for modern enterprises
          </div>
        </div>
      </footer>
    </div>
  );
}
