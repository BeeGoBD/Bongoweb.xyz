import React, { useState, useEffect } from 'react';
import { Bell, Menu, Sparkles, AlertTriangle } from 'lucide-react';
import { WebsiteCategory, UserAccount } from '../types';
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
  const [activePendingOrder, setActivePendingOrder] = useState<{ orderId: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bongoweb_active_pending_order');
      if (stored) {
        setActivePendingOrder(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    const syncUser = () => {
      try {
        const u = localStorage.getItem('bongoweb_user');
        if (u) {
          setCurrentUser(JSON.parse(u));
        } else {
          setCurrentUser(null);
        }
      } catch (_) {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('bongoweb_credentials_updated', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('bongoweb_credentials_updated', syncUser);
    };
  }, []);

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
            <a 
              href="/account" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/account');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="underline font-black text-[#8A6D00] hover:text-[#2B47EE] hidden sm:inline ml-2 cursor-pointer"
            >
              অ্যাকাউন্টে দেখুন →
            </a>
          </div>
        </div>
      )}

      {/* Unverified Phone Number Notice (24-Hour Call Policy) */}
      {currentUser && currentUser.numberVerified !== true && (
        <div className="w-full bg-[#FFF3E0] border-b border-[#FFE0B2] px-4 py-2 sm:py-2.5 shadow-2xs animate-fadeIn">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 text-xs text-[#C65102]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9800] animate-ping shrink-0" />
              <span className="font-bold">
                ⚠️ নম্বর ভেরিফিকেশন অপেক্ষমান ({currentUser.phone || 'মোবাইল নম্বর'}): আমাদের ভেরিফিকেশন টিম সর্বোচ্চ ২৪ ঘণ্টার মধ্যে কল করবে। ২৪ ঘণ্টায় কল না ধরলে অ্যাকাউন্ট সীমাবদ্ধ (Restrict) করা হবে।
              </span>
            </div>
            <a 
              href="/account/terms" 
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/account/terms');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="underline font-black text-[#C65102] hover:text-[#2B47EE] shrink-0 cursor-pointer self-end sm:self-auto"
            >
              ভেরিফিকেশন নীতিমালা দেখুন →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
