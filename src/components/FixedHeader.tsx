import React, { useState } from 'react';
import { Menu, ArrowLeft, Languages, Bell, Home, LayoutGrid, MessageCircle, User, Phone, Clock, ArrowRight } from 'lucide-react';
import { BottomTabType } from './FixedBottomNav';
import BongoWebLogo from './BongoWebLogo';
import CallActionModal from './CallActionModal';
import { useLanguage } from '../utils/LanguageContext';

interface FixedHeaderProps {
  onBackToCategoryPicker: () => void;
  onOpenNotifications?: () => void;
  onOpenMenu: () => void;
  unreadCount?: number;
  showBackArrow?: boolean;
  activeTab?: BottomTabType;
  onTabChange?: (tab: BottomTabType) => void;
  unreadChatCount?: number;
}

export default function FixedHeader({
  onBackToCategoryPicker,
  onOpenNotifications,
  onOpenMenu,
  unreadCount = 0,
  showBackArrow = false,
  activeTab = 'home',
  onTabChange,
  unreadChatCount = 0
}: FixedHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callHoverOpen, setCallHoverOpen] = useState(false);
  const [callModalInitialTab, setCallModalInitialTab] = useState<'options' | 'callback'>('options');

  const handleToggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const desktopNavItems = [
    { 
      id: 'home' as BottomTabType, 
      labelBn: 'হোম', 
      labelEn: 'Home', 
      icon: Home 
    },
    { 
      id: 'templates' as BottomTabType, 
      labelBn: 'রেডি ওয়েবসাইট', 
      labelEn: 'Ready Websites', 
      tagBn: 'হট',
      tagEn: 'Hot',
      icon: LayoutGrid 
    },
    { 
      id: 'live-chat' as BottomTabType, 
      labelBn: '২৪/৭ লাইভ সাপোর্ট', 
      labelEn: 'Live Support', 
      badge: unreadChatCount,
      isLive: true,
      icon: MessageCircle 
    },
    { 
      id: 'account' as BottomTabType, 
      labelBn: 'ক্লায়েন্ট পোর্টাল', 
      labelEn: 'Client Portal', 
      icon: User 
    }
  ];

  const normalizedActive: 'home' | 'templates' | 'live-chat' | 'account' = (() => {
    if (activeTab === 'home' || activeTab === 'dashboard') return 'home';
    if (activeTab === 'templates') return 'templates';
    if (activeTab === 'live-chat') return 'live-chat';
    if (activeTab === 'account') return 'account';
    return 'home';
  })();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 w-full select-none">
      <header 
        id="fixed-main-header"
        className="w-full bg-[#5B2C8A] border-b border-[#4A1F6E]/80 shadow-[0_4px_20px_-2px_rgba(91,44,138,0.35)] h-16 sm:h-[68px] md:h-[72px] lg:h-[76px] flex items-center transition-all backdrop-blur-md"
      >
        <div className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between gap-2.5 sm:gap-4 h-full">
          
          {/* Left: Brand Identity + Subpage Return Action */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 md:flex-1 md:justify-start">
            {/* Mobile Return Back Button */}
            {showBackArrow && (
              <button
                type="button"
                onClick={onBackToCategoryPicker}
                aria-label={language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}
                title={language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}
                className="md:hidden p-2 rounded-xl text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 transition-all cursor-pointer flex items-center justify-center shadow-2xs active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-white stroke-[2.5]" />
              </button>
            )}

            {/* Laptop/Desktop Back Arrow with Clear Catchy Label */}
            {showBackArrow && (
              <button
                type="button"
                onClick={onBackToCategoryPicker}
                aria-label={language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}
                title={language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}
                className="hidden md:inline-flex px-3.5 py-2 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all items-center gap-2 cursor-pointer shadow-2xs active:scale-95 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-purple-200 group-hover:-translate-x-0.5 transition-transform stroke-[2.4]" />
                <span>{language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}</span>
              </button>
            )}

            {/* Logo: Interactive brand identity */}
            <div 
              onClick={onBackToCategoryPicker}
              className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform select-none"
              title="BongoWeb.xyz — Official Website Solutions"
            >
              <BongoWebLogo size="md" variant="white" />
              {/* Catchy 24h Launching Pill for Desktop */}
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{language === 'bn' ? '২৪ ঘণ্টায় লাইভ ওয়েবসাইট' : '24h Launch Guaranteed'}</span>
              </span>
            </div>
          </div>

          {/* Center: Modern Frosted Glass Navigation Capsule */}
          {onTabChange && (
            <div className="hidden md:flex items-center justify-center shrink-0">
              <nav 
                aria-label="Desktop Navigation"
                className="flex items-center p-1.5 bg-white/[0.12] hover:bg-white/[0.15] border border-white/20 rounded-2xl backdrop-blur-xl shadow-inner transition-colors gap-1"
              >
                {desktopNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = normalizedActive === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      className={`relative px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-[13px] font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
                        isActive
                          ? 'bg-white text-[#5B2C8A] shadow-[0_3px_12px_rgba(0,0,0,0.16)] scale-[1.02]'
                          : 'text-purple-100 hover:text-white hover:bg-white/15 active:scale-95'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#5B2C8A] scale-105' : 'text-purple-200'}`} />
                      <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                      
                      {/* Hot Tag badge */}
                      {item.tagBn && (
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                          isActive 
                            ? 'bg-purple-100 text-[#5B2C8A]' 
                            : 'bg-amber-400 text-slate-950 font-black shadow-2xs'
                        }`}>
                          {language === 'bn' ? item.tagBn : item.tagEn}
                        </span>
                      )}

                      {/* Live support pulsing indicator */}
                      {item.isLive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#5B2C8A] animate-pulse shrink-0" />
                      )}

                      {/* Unread badge */}
                      {item.badge && item.badge > 0 ? (
                        <span className="min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-[#5B2C8A] shadow-2xs">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Right Action Suite: 24/7 Hotline + Dual Language Toggle + Notifications + Menu Drawer */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 md:flex-1 md:justify-end">
            
            {/* 24/7 Direct Hotline & Support Desk (Interactive Popover with Catchy Actions) */}
            <div 
              className="relative"
              onMouseEnter={() => setCallHoverOpen(true)}
              onMouseLeave={() => setCallHoverOpen(false)}
            >
              {/* Desktop Hotline Pill */}
              <button
                type="button"
                onClick={() => {
                  setCallModalInitialTab('options');
                  setCallModalOpen(true);
                }}
                aria-label="Direct Customer Hotline: 01955570912"
                title={language === 'bn' ? 'সরাসরি সাপোর্ট হটলাইন: 01955570912' : 'Call Customer Hotline: 01955570912'}
                className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-white bg-gradient-to-r from-emerald-500/25 to-teal-500/25 hover:from-emerald-500/35 hover:to-teal-500/35 active:scale-95 border border-emerald-400/40 transition-all cursor-pointer flex items-center gap-2 shadow-2xs group"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-3.5 h-3.5 stroke-[2.4]" />
                </div>
                <div className="hidden lg:flex flex-col text-left leading-none">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                      {language === 'bn' ? 'সরাসরি হটলাইন' : '24/7 Hotline'}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-white tracking-wide">
                    01955570912
                  </span>
                </div>
                <span className="lg:hidden absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#5B2C8A] animate-pulse" />
              </button>

              {/* Catchy & Understanding 2-Button Card Popover */}
              {callHoverOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-76 sm:w-84 bg-white rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.22)] border border-slate-200/90 p-4 z-50 text-slate-900 animate-slideDownModal select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs sm:text-[13px] font-black text-slate-900">
                        {language === 'bn' ? 'BongoWeb সরাসরি সাপোর্ট ডেস্ক' : 'BongoWeb Direct Support Desk'}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {language === 'bn' ? 'এখনই একটিভ' : 'Active 24/7'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-snug mb-3.5">
                    {language === 'bn' 
                      ? 'যেকোনো জিজ্ঞাসায় আমাদের সিনিয়র ওয়েব ইঞ্জিনিয়ারের সাথে যোগাযোগ করুন:' 
                      : 'Connect with a senior web engineer or request a scheduled callback:'}
                  </p>

                  {/* 2 Clean Action Buttons */}
                  <div className="space-y-2.5">
                    {/* Option 1: Instant Call */}
                    <a
                      href="tel:+8801955570912"
                      className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-emerald-600/20 transition-all group/btn"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-white stroke-[2.4]" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-xs sm:text-[13px] leading-tight">
                            {language === 'bn' ? 'সরাসরি কল দিন (Instant Call)' : 'Instant Direct Call'}
                          </span>
                          <span className="text-[10px] text-emerald-100 font-mono mt-0.5 block">
                            01955570912
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                    </a>

                    {/* Option 2: Schedule Call Back */}
                    <button
                      type="button"
                      onClick={() => {
                        setCallHoverOpen(false);
                        setCallModalInitialTab('callback');
                        setCallModalOpen(true);
                      }}
                      className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-purple-600/20 transition-all group/btn cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-white stroke-[2.4]" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-xs sm:text-[13px] leading-tight">
                            {language === 'bn' ? 'ফ্রি কল ব্যাক চান (Call Back)' : 'Request Call Back'}
                          </span>
                          <span className="text-[10px] text-purple-100 mt-0.5 block">
                            {language === 'bn' ? 'আপনার সুবিধাজনক সময়ে কল পাবেন' : 'We will call you back at your time'}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Intuitive Dual-Segment Language Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                aria-label="বাংলা নির্বাচন করুন"
                title="বাংলা ভাষা"
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'bn' 
                    ? 'bg-white text-[#5B2C8A] font-black shadow-xs scale-[1.02]' 
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                বাং
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-label="Switch to English"
                title="English Language"
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-white text-[#5B2C8A] font-black shadow-xs scale-[1.02]' 
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Notifications Button (System Updates & Order Alerts) */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                aria-label={language === 'bn' ? 'নোটিফিকেশন ও আপডেট' : 'Notifications & Updates'}
                title={language === 'bn' ? 'নোটিফিকেশন ও আপডেট' : 'Notifications & Updates'}
                className="relative p-2 sm:p-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 transition-all cursor-pointer flex items-center justify-center shadow-2xs active:scale-95"
              >
                <Bell className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-[#5B2C8A] shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Menu Drawer Button (3 lines with text on desktop) */}
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label={language === 'bn' ? 'মেন্যু খুলুন' : 'Open Menu'}
              title={language === 'bn' ? 'মেন্যু ও অপশন' : 'Menu & Options'}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 group"
            >
              <Menu className="w-4.5 h-4.5 text-white stroke-[2.4] group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-xs font-bold text-purple-100">
                {language === 'bn' ? 'মেন্যু' : 'Menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2-Button Hover/Action Modal: Instant Call & Call Back Request */}
      <CallActionModal 
        isOpen={callModalOpen} 
        initialTab={callModalInitialTab}
        onClose={() => setCallModalOpen(false)} 
      />
    </div>
  );
}
