import React from 'react';
import { Menu, ArrowLeft, Languages, Bell, Home, LayoutGrid, MessageCircle, User } from 'lucide-react';
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
        className="w-full bg-[#5B2C8A] border-b border-[#4A1F6E] shadow-[0_2px_12px_rgba(91,44,138,0.25)] h-16 sm:h-[68px] flex items-center transition-colors"
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-full">
          
          {/* Left Action:
              On Home: White Hamburger menu icon
              On Templates / Subpages: White Back Arrow */}
          <div className="flex items-center gap-2">
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

          {/* Center: White circular "B" logo + "BongoWeb" text */}
          <div 
            onClick={onBackToCategoryPicker}
            className="flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
            title="BongoWeb"
          >
            <BongoWebLogo size="md" variant="white" />
          </div>

          {/* Desktop Navigation Links (for wide screens) */}
          {onTabChange && (
            <nav className="hidden lg:flex items-center gap-1 bg-white/10 px-2 py-1 rounded-2xl border border-white/15">
              {desktopNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = normalizedActive === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#5B2C8A] shadow-xs'
                        : 'text-purple-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ) : null}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action:
              On Home: White globe icon (toggles / selects language)
              On Templates / Subpages: White hamburger menu icon (or Globe + Hamburger on desktop) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={handleToggleLanguage}
              aria-label="Change Language"
              title={language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
              className="p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/15 active:bg-white/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Languages className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white stroke-[2.2]" />
              <span className="text-[11px] font-bold text-purple-100 hidden sm:inline uppercase">
                {language === 'bn' ? 'বাংলা' : 'EN'}
              </span>
            </button>

            {/* If on Templates/Subpage, show Hamburger Menu on the right as requested */}
            {showBackArrow && (
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

            {/* Notifications Button (if provided) */}
            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                aria-label="Notifications"
                title="Notifications"
                className="relative hidden md:flex p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/15 active:bg-white/25 transition-all cursor-pointer items-center justify-center"
              >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#5B2C8A]" />
                )}
              </button>
            )}
          </div>

        </div>
      </header>
    </div>
  );
}
