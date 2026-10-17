import React from 'react';
import { Menu, ArrowLeft, Languages, Bell, Home, LayoutGrid, MessageCircle, User, Phone } from 'lucide-react';
import { BottomTabType } from './FixedBottomNav';
import BongoWebLogo from './BongoWebLogo';
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
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between gap-4 md:gap-6 h-full">
          
          {/* Left: Brand Logo & Navigation Back */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile-only toggle (< md) */}
            <div className="md:hidden flex items-center">
              {showBackArrow ? (
                <button
                  type="button"
                  onClick={onBackToCategoryPicker}
                  aria-label="Go Back to Home"
                  title="Go Back"
                  className="p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/15 active:bg-white/25 transition-all cursor-pointer flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.4]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenMenu}
                  aria-label="Open Navigation Menu"
                  title="Menu"
                  className="p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/15 active:bg-white/25 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.4]" />
                </button>
              )}
            </div>

            {/* Desktop Back Arrow if on subpage */}
            {showBackArrow && (
              <button
                type="button"
                onClick={onBackToCategoryPicker}
                aria-label="Go Back to Home"
                title="Go Back"
                className="hidden md:inline-flex px-3.5 py-1.5 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all items-center gap-1.5 cursor-pointer shadow-xs group"
              >
                <ArrowLeft className="w-4 h-4 text-white stroke-[2.2] group-hover:-translate-x-0.5 transition-transform" />
                <span>{language === 'bn' ? 'ফিরে যান' : 'Back'}</span>
              </button>
            )}

            {/* Logo: Always clickable, returns home */}
            <div 
              onClick={onBackToCategoryPicker}
              className="flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
              title="BongoWeb"
            >
              <BongoWebLogo size="md" variant="white" />
            </div>
          </div>

          {/* Center: Desktop Navigation Bar */}
          {onTabChange && (
            <nav 
              aria-label="Main Desktop Navigation"
              className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-inner"
            >
              {desktopNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = normalizedActive === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={`relative px-3.5 lg:px-4.5 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
                      isActive
                        ? 'bg-white text-[#5B2C8A] shadow-[0_2px_8px_rgba(0,0,0,0.12)] scale-[1.02]'
                        : 'text-purple-100 hover:text-white hover:bg-white/10 active:scale-95'
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
          )}

          {/* Right: Desktop Actions & Support Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Direct Phone Hotline (Desktop) */}
            <a
              href="tel:+8801819847250"
              title="Hotline Support: +880 1819-847250"
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-white text-xs lg:text-sm font-bold transition-all shadow-xs cursor-pointer group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <Phone className="w-3.5 h-3.5 text-emerald-300 stroke-[2.2] shrink-0 group-hover:rotate-12 transition-transform" />
              <span className="font-mono tracking-tight text-white">+880 1819-847250</span>
            </a>

            {/* Language Switcher Badge */}
            <button
              type="button"
              onClick={handleToggleLanguage}
              aria-label="Change Language"
              title={language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
              className="px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Languages className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2.2]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'bn' ? 'বাংলা' : 'EN'}
              </span>
            </button>

            {/* Notifications Button */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                aria-label="Notifications"
                title="Notifications"
                className="relative p-2 sm:p-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
              >
                <Bell className="w-4.5 h-4.5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#5B2C8A]" />
                )}
              </button>
            )}

            {/* Desktop Menu / All Options Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open Navigation Menu"
              title="All Options & Menu"
              className="hidden md:flex p-2 sm:p-2.5 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer items-center justify-center shadow-2xs"
            >
              <Menu className="w-5 h-5 text-white stroke-[2.4]" />
            </button>

            {/* Mobile Subpage Hamburger Menu (< md) */}
            {showBackArrow && (
              <button
                type="button"
                onClick={onOpenMenu}
                aria-label="Open Navigation Menu"
                title="Menu"
                className="md:hidden p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/15 active:bg-white/25 transition-all cursor-pointer flex items-center justify-center"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.4]" />
              </button>
            )}
          </div>

        </div>
      </header>
    </div>
  );
}
