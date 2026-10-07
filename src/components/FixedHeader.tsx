import React from 'react';
import { Bell, Menu, Sparkles } from 'lucide-react';
import { WebsiteCategory } from '../types';
import BongoWebLogo from './BongoWebLogo';

interface FixedHeaderProps {
  onBackToCategoryPicker: () => void;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  onOpenLogoShowcase?: () => void;
  unreadCount?: number;
  currentCategory?: WebsiteCategory | string;
}

export default function FixedHeader({
  onBackToCategoryPicker,
  onOpenNotifications,
  onOpenMenu,
  onOpenLogoShowcase,
  unreadCount = 0,
  currentCategory = 'all'
}: FixedHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 w-full flex flex-col select-none">
      <header 
        id="fixed-main-header"
        className="w-full bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_16px_rgba(171,85,247,0.06)] h-16 sm:h-[68px] flex items-center transition-all"
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 h-full">
          {/* Top Left: Official BongoWeb Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              onClick={onBackToCategoryPicker}
              className="flex items-center cursor-pointer group"
              title="BongoWeb — Official Home"
            >
              <BongoWebLogo size="md" />
            </div>

            {onOpenLogoShowcase && (
              <button
                type="button"
                onClick={onOpenLogoShowcase}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#AB55F7]/10 hover:bg-[#AB55F7]/15 text-[#9333EA] text-xs font-bold border border-[#AB55F7]/25 transition-all cursor-pointer shadow-2xs"
                title="View BongoWeb Logo Brand Versions (4:1 & 1:1)"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9333EA]" />
                <span>Brand Logos</span>
              </button>
            )}
          </div>

          {/* Top Right: Notifications Icon & 3-line Menu Icon */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotifications}
              id="header-notification-btn"
              aria-label="View Notifications"
              title="Notifications"
              className="relative px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-50 hover:bg-[#AB55F7]/10 active:bg-[#AB55F7]/20 active:scale-95 text-slate-700 border border-slate-200 hover:border-[#AB55F7]/30 transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-2xs group"
            >
              <Bell className="w-4.5 h-4.5 text-slate-500 group-hover:text-[#9333EA] group-hover:rotate-12 transition-all" />
              <span className="hidden md:inline text-xs font-bold text-slate-700">
                নোটিফিকেশন
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-[#AB55F7] to-[#7C3AED] text-[#FFFFFF] text-[9.5px] font-black shadow-[0_2px_8px_rgba(171,85,247,0.4)] ring-2 ring-[#FFFFFF]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 3-Line Menu Icon */}
            <button
              onClick={onOpenMenu}
              id="header-menu-btn"
              aria-label="Open Navigation Menu"
              title="Menu"
              className="px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#AB55F7] via-[#9333EA] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] active:scale-95 text-[#FFFFFF] transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-[0_2px_12px_rgba(171,85,247,0.3)] hover:shadow-[0_4px_18px_rgba(171,85,247,0.4)] border border-white/20 group font-bold"
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
