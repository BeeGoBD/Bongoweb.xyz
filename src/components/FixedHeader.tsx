import React from 'react';
import { Bell, Menu, Sparkles, LayoutGrid, ClipboardCheck, MessageCircle, User } from 'lucide-react';
import { WebsiteCategory } from '../types';
import { BottomTabType } from './FixedBottomNav';
import BongoWebLogo from './BongoWebLogo';

interface FixedHeaderProps {
  onBackToCategoryPicker: () => void;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  onOpenLogoShowcase?: () => void;
  unreadCount?: number;
  currentCategory?: WebsiteCategory | string;
  activeTab?: BottomTabType;
  onTabChange?: (tab: BottomTabType) => void;
  unreadChatCount?: number;
}

export default function FixedHeader({
  onBackToCategoryPicker,
  onOpenNotifications,
  onOpenMenu,
  onOpenLogoShowcase,
  unreadCount = 0,
  currentCategory = 'all',
  activeTab = 'dashboard',
  onTabChange,
  unreadChatCount = 0
}: FixedHeaderProps) {
  const desktopTabs = [
    {
      id: 'dashboard' as BottomTabType,
      label: 'ড্যাশবোর্ড',
      icon: LayoutGrid
    },
    {
      id: 'after-order' as BottomTabType,
      label: 'অর্ডারের ধাপ',
      icon: ClipboardCheck
    },
    {
      id: 'live-chat' as BottomTabType,
      label: 'লাইভ চ্যাট',
      icon: MessageCircle,
      badge: unreadChatCount
    },
    {
      id: 'account' as BottomTabType,
      label: 'Account',
      icon: User
    }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-40 w-full flex flex-col select-none perspective-1000">
      <header 
        id="fixed-main-header"
        className="w-full bg-white/90 backdrop-blur-xl border-b-[3.5px] border-b-slate-200/90 shadow-[0_6px_20px_rgba(15,23,42,0.06),0_1px_0_0_rgba(255,255,255,0.8)_inset] h-16 sm:h-[68px] lg:h-[72px] flex items-center transition-all preserve-3d"
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-full">
          {/* Top Left: Official BongoWeb Logo with 3D Float */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div 
              onClick={onBackToCategoryPicker}
              className="flex items-center cursor-pointer group active:scale-95 transition-transform hover:-translate-y-0.5"
              title="BongoWeb — Official Home"
            >
              <BongoWebLogo size="md" />
            </div>

            {onOpenLogoShowcase && (
              <button
                type="button"
                onClick={onOpenLogoShowcase}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 border-b-2 border-b-purple-400 shadow-[0_2px_0_0_#C084FC] active:border-b active:translate-y-0.5 transition-all cursor-pointer btn-3d-tactile"
                title="View BongoWeb Logo Brand Versions (4:1 & 1:1)"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Brand Logos</span>
              </button>
            )}
          </div>

          {/* Center: Desktop Navigation Tabs (Laptop/Desktop View) */}
          {onTabChange && (
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 border-b-2 border-b-slate-300 shadow-inner">
              {desktopTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 xl:px-4.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
                      isActive
                        ? 'bg-white text-purple-700 font-black border border-purple-200 border-b-[3.5px] border-b-purple-500 shadow-[0_3px_0_0_#C084FC,0_6px_14px_rgba(124,58,237,0.18)] -translate-y-0.5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 active:translate-y-0.5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Top Right: Notifications Icon & 3-line Menu Icon */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Notification Bell Button with 3D Extrusion */}
            <button
              onClick={onOpenNotifications}
              id="header-notification-btn"
              aria-label="View Notifications"
              title="Notifications"
              className="relative px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 border-b-[3.5px] border-b-slate-300 shadow-[0_3px_0_0_#CBD5E1,0_4px_10px_rgba(0,0,0,0.04)] active:border-b active:translate-y-[2.5px] active:shadow-none transition-all cursor-pointer flex items-center gap-2 group btn-3d-tactile"
            >
              <Bell className="w-4.5 h-4.5 text-slate-500 group-hover:text-purple-600 group-hover:rotate-12 transition-all" />
              <span className="hidden md:inline text-xs font-bold text-slate-700">
                নোটিফিকেশন
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-[#AB55F7] to-[#7C3AED] text-white text-[9.5px] font-black shadow-[0_2px_8px_rgba(171,85,247,0.4)] ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 3-Line Menu Icon with 3D Extrusion */}
            <button
              onClick={onOpenMenu}
              id="header-menu-btn"
              aria-label="Open Navigation Menu"
              title="Menu"
              className="px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#6D28D9] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white border border-purple-400/40 border-b-[4px] border-b-purple-950 shadow-[0_4px_0_0_#4C1D95,0_8px_18px_rgba(124,58,237,0.35)] active:border-b active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center gap-2 group font-bold btn-3d-tactile"
            >
              <Menu className="w-4.5 h-4.5 stroke-[2.2] group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-xs font-black tracking-wide">
                মেনু
              </span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
