import React, { useState, useEffect } from 'react';
import { Bell, Menu, AlertCircle } from 'lucide-react';
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
  unreadCount = 0,
  currentCategory = 'all'
}: FixedHeaderProps) {
  const [activePendingOrder, setActivePendingOrder] = useState<{ orderId: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bongoweb_active_pending_order');
      if (stored) {
        setActivePendingOrder(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 w-full flex flex-col select-none">
      <header 
        id="fixed-main-header"
        className="w-full bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-[#E5EDF5] shadow-[0_2px_16px_rgba(13,37,61,0.04)] h-16 sm:h-[68px] flex items-center transition-all"
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 h-full">
          {/* Top Left: Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div 
              onClick={onBackToCategoryPicker}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
              title="BongoWeb.xyz — Go to Category Selection"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#533AFD] to-[#694FFF] text-[#FFFFFF] flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_4px_14px_rgba(83,58,253,0.32)] ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(83,58,253,0.42)] transition-all duration-200">
                BW
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline leading-none">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0D253D] group-hover:text-[#533AFD] transition-colors">
                    BongoWeb
                  </span>
                  <span className="text-xs sm:text-sm font-black text-[#533AFD] ml-0.5">.xyz</span>
                </div>
                <div className="flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#64748D] -mt-0.5 hidden xs:flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B261] animate-pulse" />
                  <span>Verified Platform</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Right: Notifications Icon & 3-line Menu Icon */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotifications}
              id="header-notification-btn"
              aria-label="View Admin Notifications"
              title="Notifications"
              className="relative px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#F0F4FA] active:bg-[#E2E4FF] active:scale-95 text-[#273951] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-2xs group"
            >
              <Bell className="w-4.5 h-4.5 text-[#475569] group-hover:text-[#0D253D] group-hover:rotate-12 transition-all" />
              <span className="hidden md:inline text-xs font-bold text-[#0D253D]">
                নোটিফিকেশন
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full bg-[#FF6118] text-[#FFFFFF] text-[9.5px] font-black shadow-[0_2px_8px_rgba(255,97,24,0.4)] ring-2 ring-[#FFFFFF]">
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
              className="px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] active:scale-95 text-[#FFFFFF] transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-[0_2px_10px_rgba(83,58,253,0.25)] hover:shadow-[0_4px_16px_rgba(83,58,253,0.35)] border border-[#533AFD]/50 group"
            >
              <Menu className="w-4.5 h-4.5 stroke-[2.2] group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-xs font-black tracking-wide">
                মেনু
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Payment In Progress Notice */}
      {activePendingOrder && (
        <div className="w-full bg-[#FFF9E6] border-b border-[#FFD552] px-4 py-2 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#8A6D00] font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] animate-ping" />
              <span>
                আপনার পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন রয়েছে ({activePendingOrder.orderId})। অনুগ্রহ করে ১ মিনিট থেকে ১ ঘণ্টা অপেক্ষা করুন।
              </span>
            </div>
            <a href="/account" className="underline font-black text-[#8A6D00] hover:text-[#533AFD] hidden sm:inline ml-2">
              অ্যাকাউন্টে দেখুন →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
