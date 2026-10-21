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
    { id: 'home' as BottomTabType, labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'templates' as BottomTabType, labelBn: 'টেমপ্লেট', labelEn: 'Templates', icon: LayoutGrid },
    { id: 'live-chat' as BottomTabType, labelBn: 'লাইভ চ্যাট', labelEn: 'Live Chat', icon: MessageCircle, badge: unreadChatCount },
    { id: 'account' as BottomTabType, labelBn: 'Account', labelEn: 'Account', icon: User }
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
        className="w-full bg-[#5B2C8A] border-b border-[#4A1F6E] shadow-[0_2px_14px_rgba(91,44,138,0.25)] h-16 sm:h-[68px] md:h-[72px] lg:h-[76px] flex items-center transition-colors"
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between gap-3 md:gap-4 h-full">
          
          {/* Left: Mobile Logo (+ Back Arrow on subpages) / Laptop & Desktop Logo + Back */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 md:flex-1 md:justify-start">
            {/* Mobile-only Back Arrow (only shown on subpages) */}
            {showBackArrow && (
              <button
                type="button"
                onClick={onBackToCategoryPicker}
                aria-label="Go Back to Home"
                title="Go Back"
                className="md:hidden p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/15 active:bg-white/25 transition-all cursor-pointer flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.4]" />
              </button>
            )}

            {/* Laptop/Desktop Back Arrow if on subpage */}
            {showBackArrow && (
              <button
                type="button"
                onClick={onBackToCategoryPicker}
                aria-label="Go Back to Home"
                title="Go Back"
                className="hidden md:inline-flex px-3.5 py-1.5 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-white stroke-[2.2]" />
                <span>{language === 'bn' ? 'ফিরে যান' : 'Back'}</span>
              </button>
            )}

            {/* Logo: Placed in top left, returns home */}
            <div 
              onClick={onBackToCategoryPicker}
              className="flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
              title="BongoWeb"
            >
              <BongoWebLogo size="md" variant="white" />
            </div>
          </div>

          {/* Desktop Navigation Links (Centered frosted glass capsule) */}
          {onTabChange && (
            <div className="hidden md:flex items-center justify-center shrink-0">
              <nav 
                aria-label="Desktop Navigation"
                className="flex items-center p-1 bg-white/[0.10] hover:bg-white/[0.14] border border-white/20 rounded-2xl backdrop-blur-md shadow-xs transition-colors gap-1"
              >
                {desktopNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = normalizedActive === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onTabChange(item.id)}
                      className={`relative px-3.5 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer select-none ${
                        isActive
                          ? 'bg-white text-[#5B2C8A] shadow-[0_2px_10px_rgba(0,0,0,0.14)] scale-[1.02]'
                          : 'text-purple-100 hover:text-white hover:bg-white/15 active:scale-95'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5B2C8A]' : 'text-purple-200'}`} />
                      <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                      {item.badge && item.badge > 0 ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#5B2C8A] animate-pulse shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Right Action: Hotline + Language + (Mobile Menu 3 Lines next to Language) + Notifications + Desktop Menu */}
          <div className="flex items-center gap-2 md:gap-2.5 shrink-0 md:flex-1 md:justify-end">
            {/* Direct Phone Hotline Call Icon Button: Hover or Click reveals page with 2 buttons (Instant Call & Call Back Request) */}
            <div 
              className="relative"
              onMouseEnter={() => setCallHoverOpen(true)}
              onMouseLeave={() => setCallHoverOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setCallModalInitialTab('options');
                  setCallModalOpen(true);
                }}
                aria-label="Call Hotline & Support: 01955570912"
                title="কল বা কল ব্যাক রিকোয়েস্ট (Hotline & Call Back)"
                className="relative p-2 sm:p-2.5 rounded-xl text-white bg-emerald-500/20 hover:bg-emerald-500/30 active:bg-emerald-500/40 border border-emerald-400/40 transition-all cursor-pointer flex items-center justify-center shadow-2xs group"
              >
                <Phone className="w-4.5 h-4.5 text-emerald-300 stroke-[2.2] group-hover:scale-110 transition-transform" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#5B2C8A] animate-pulse" />
              </button>

              {/* Hover Dropdown / Popover Card: 2 Choice Buttons */}
              {callHoverOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 z-50 text-slate-900 animate-slideDownModal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black text-slate-900">
                        {language === 'bn' ? 'BongoWeb কল সেন্টার' : 'Call & Support Desk'}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      সরাসরি ২৪/৭
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight mb-3">
                    {language === 'bn' ? 'সরাসরি এখনই কল করুন অথবা আপনার ফ্রি সময়ে কল ব্যাক রিকোয়েস্ট পাঠান:' : 'Connect immediately or request a convenient call back:'}
                  </p>

                  {/* 2 Buttons */}
                  <div className="space-y-2">
                    {/* Button 1: Instant Call */}
                    <a
                      href="tel:+8801955570912"
                      className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-emerald-600/20 transition-all group/btn"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-white stroke-[2.2]" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-[13px] leading-tight">Instant Call</span>
                          <span className="text-[10px] text-emerald-100">সরাসরি হটলাইন: 01955570912</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>

                    {/* Button 2: Call Back Request */}
                    <button
                      type="button"
                      onClick={() => {
                        setCallHoverOpen(false);
                        setCallModalInitialTab('callback');
                        setCallModalOpen(true);
                      }}
                      className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-purple-600/20 transition-all group/btn cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-white stroke-[2.2]" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-[13px] leading-tight">Call Back Request</span>
                          <span className="text-[10px] text-purple-100">আপনার সুবিধাজনক সময়ে কল পাব</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={handleToggleLanguage}
              aria-label="Change Language"
              title={language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
              className="px-2.5 sm:px-3 py-2 rounded-xl text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Languages className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.2]" />
              <span className="text-xs font-bold text-purple-100 hidden sm:inline uppercase">
                {language === 'bn' ? 'বাংলা' : 'EN'}
              </span>
            </button>

            {/* Mobile Menu 3 Lines Trigger (< md) - Placed in top right next to language icon */}
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open Navigation Menu"
              title="Menu"
              className="md:hidden p-2 sm:p-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
            >
              <Menu className="w-5 h-5 text-white stroke-[2.4]" />
            </button>

            {/* Notifications Button (Tablet & Laptop) */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                aria-label="Notifications"
                title="Notifications"
                className="relative hidden sm:flex p-2 sm:p-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 transition-all cursor-pointer items-center justify-center shadow-2xs"
              >
                <Bell className="w-4.5 h-4.5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#5B2C8A]" />
                )}
              </button>
            )}

            {/* Desktop Menu Drawer Trigger (hidden on mobile, shown on laptop/desktop md+) */}
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open Navigation Menu"
              title="Menu"
              className="hidden md:flex p-2 sm:p-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 transition-all cursor-pointer items-center justify-center shadow-2xs"
            >
              <Menu className="w-4.5 h-4.5 text-white stroke-[2.4]" />
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
