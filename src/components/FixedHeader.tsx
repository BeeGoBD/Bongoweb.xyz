import React from 'react';
import { Bell, Menu, Sparkles, Layers, ArrowLeft } from 'lucide-react';
import { WebsiteCategory } from '../types';

interface FixedHeaderProps {
  onBackToCategoryPicker: () => void;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
  unreadCount?: number;
  currentCategory?: WebsiteCategory | string;
}

export default function FixedHeader({
  onBackToCategoryPicker,
  onOpenNotifications,
  onOpenMenu,
  unreadCount = 3,
  currentCategory = 'all'
}: FixedHeaderProps) {
  const getCategoryLabel = () => {
    switch (currentCategory) {
      case 'ecommerce': return 'ই-কমার্স শপ';
      case 'restaurant': return 'রেস্তোরাঁ ও ক্যাফে';
      case 'blogging': return 'ব্লগ ও মিডিয়া';
      case 'grocery': return 'মুদি ও সুপারশপ';
      default: return 'সব ওয়েবসাইট';
    }
  };

  return (
    <header 
      id="fixed-main-header"
      className="fixed top-0 left-0 right-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5EDF5] shadow-[0_1px_3px_rgba(13,37,61,0.05)] h-16 sm:h-[68px] flex items-center transition-all select-none"
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Top Left: Logo & Category Selector Switch */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* English Logo */}
          <div 
            onClick={onBackToCategoryPicker}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
            title="BongoWeb.xyz — Go to Category Selection"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#533AFD] text-[#FFFFFF] flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_3px_10px_rgba(83,58,253,0.3)] group-hover:bg-[#665EFD] transition-colors">
              BW
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline leading-none">
                <span className="text-lg sm:text-xl font-black tracking-tight text-[#0D253D]">
                  BongoWeb
                </span>
                <span className="text-xs font-bold text-[#533AFD] ml-0.5">.xyz</span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#64748D] -mt-0.5 hidden xs:block">
                Verified Platform
              </span>
            </div>
          </div>

          {/* Quick Active Category Badge / Change Category */}
          <button
            onClick={onBackToCategoryPicker}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] hover:bg-[#533AFD] hover:text-[#FFFFFF] text-xs font-bold transition-all cursor-pointer border border-[#533AFD]/20"
            title="Click to choose a different category"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{getCategoryLabel()}</span>
            <span className="text-[10px] opacity-70 ml-0.5">✕ পরিবর্তন</span>
          </button>
        </div>

        {/* Top Right: Notifications Icon & 3-line Menu Icon */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell Button */}
          <button
            onClick={onOpenNotifications}
            id="header-notification-btn"
            aria-label="View Admin Notifications"
            title="Notifications"
            className="relative p-2.5 sm:px-3 sm:py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E5EDF5] active:bg-[#E2E4FF] text-[#273951] border border-[#E5EDF5] transition-all cursor-pointer flex items-center gap-2"
          >
            <Bell className="w-5 h-5 text-[#273951]" />
            <span className="hidden md:inline text-xs font-semibold text-[#0D253D]">
              নোটিফিকেশন
            </span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#FF6118] text-[#FFFFFF] text-[10px] font-extrabold shadow-xs">
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
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] transition-all cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Menu className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold">
              মেনু
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
