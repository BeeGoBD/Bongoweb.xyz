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
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between gap-3 md:gap-5 h-full">
          
          {/* Left: Mobile Back or Menu / Laptop & Desktop Logo + Back */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile-only menu/back toggle (< md) */}
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

            {/* Laptop/Desktop Back Arrow if on subpage */}
            {showBackArrow && (
              <button
                type="button"
                onClick={onBackToCategoryPicker}
                aria-label="Go Back to Home"
                title="Go Back"
                className="hidden md:inline-flex px-3 py-1.5 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-all items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-white stroke-[2.2]" />
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

          {/* Desktop Navigation Links (Clean, floating desktop navigation) */}
          {onTabChange && (
            <nav 
              aria-label="Desktop Navigation"
              className="hidden md:flex items-center gap-1 lg:gap-2.5"
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
                        ? 'bg-white text-[#5B2C8A] shadow-[0_2px_10px_rgba(0,0,0,0.12)] scale-[1.02]'
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
          )}

          {/* Right Action: Hotline (laptop/desktop) + Language Switcher + Notifications + Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Laptop/Desktop Direct Phone Hotline */}
            <a
              href="tel:+8801819847250"
              title="Hotline Support: +880 1819-847250"
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs lg:text-sm font-bold transition-all shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300 stroke-[2.2] shrink-0" />
              <span className="font-mono tracking-tight text-white">+880 1819-847250</span>
            </a>

            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={handleToggleLanguage}
              aria-label="Change Language"
              title={language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-white hover:bg-white/15 active:bg-white/25 border border-transparent sm:border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Languages className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.2]" />
              <span className="text-xs font-bold text-purple-100 hidden sm:inline uppercase">
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
                className="relative hidden sm:flex p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/15 active:bg-white/25 border border-white/15 transition-all cursor-pointer items-center justify-center"
              >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#5B2C8A]" />
                )}
              </button>
            )}

            {/* Laptop & Desktop Menu Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Open Navigation Menu"
              title="Menu"
              className="hidden md:flex p-2 rounded-xl text-white hover:bg-white/15 active:bg-white/25 border border-white/15 transition-all cursor-pointer items-center justify-center"
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
