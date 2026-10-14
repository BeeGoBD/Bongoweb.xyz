import React from 'react';
import { LayoutGrid, ClipboardCheck, MessageCircle, User } from 'lucide-react';

export type BottomTabType = 'dashboard' | 'after-order' | 'live-chat' | 'account';

interface FixedBottomNavProps {
  activeTab: BottomTabType;
  onTabChange: (tab: BottomTabType) => void;
  unreadChatCount?: number;
}

export default function FixedBottomNav({
  activeTab,
  onTabChange,
  unreadChatCount = 1
}: FixedBottomNavProps) {
  const tabs = [
    {
      id: 'dashboard' as BottomTabType,
      label: 'ড্যাশবোর্ড',
      icon: LayoutGrid,
      tag: 'ওয়েবসাইট'
    },
    {
      id: 'after-order' as BottomTabType,
      label: 'অর্ডারের ধাপ',
      icon: ClipboardCheck,
      tag: 'কর্মপদ্ধতি'
    },
    {
      id: 'live-chat' as BottomTabType,
      label: 'লাইভ চ্যাট',
      icon: MessageCircle,
      tag: 'সাপোর্ট',
      badge: unreadChatCount
    },
    {
      id: 'account' as BottomTabType,
      label: 'Account',
      icon: User,
      tag: 'Profile'
    }
  ];

  return (
    <nav
      id="fixed-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 w-full bg-white/90 backdrop-blur-xl border-t-[3.5px] border-t-purple-200/90 shadow-[0_-8px_24px_rgba(124,58,237,0.12),0_1px_0_0_rgba(255,255,255,0.9)_inset] h-16 sm:h-[72px] flex items-center select-none lg:hidden perspective-1000"
    >
      <div className="max-w-lg sm:max-w-xl md:max-w-2xl w-full mx-auto px-3 sm:px-6 h-full flex items-center justify-around gap-1.5 sm:gap-2 preserve-3d">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              id={`bottom-nav-${tab.id}`}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 px-2 rounded-2xl transition-all duration-200 cursor-pointer touch-manipulation min-h-[50px] group active:translate-y-[2px] btn-3d-tactile ${
                isActive
                  ? 'text-purple-700 font-black -translate-y-1'
                  : 'text-slate-500 hover:text-slate-900 font-bold'
              }`}
            >
              {/* Active Tab Floating 3D Capsule */}
              {isActive && (
                <span className="absolute inset-x-1 sm:inset-x-2 inset-y-1 bg-gradient-to-b from-white via-purple-50 to-purple-100/90 border border-purple-200 border-b-[3.5px] border-b-purple-500 rounded-xl sm:rounded-2xl -z-10 shadow-[0_4px_0_0_#C084FC,0_8px_16px_rgba(124,58,237,0.18)] transition-all animate-fadeIn" />
              )}

              {/* Icon Container with 3D Depth & Badge */}
              <div className="relative mb-0.5 flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-all duration-200 ${
                    isActive 
                      ? 'scale-110 stroke-[2.4] text-purple-700 drop-shadow-[0_3px_6px_rgba(168,85,247,0.45)]' 
                      : 'stroke-[1.9] text-slate-400 group-hover:text-slate-700 group-hover:scale-105'
                  }`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#10B981] text-white text-[9px] font-black shadow-[0_2px_6px_rgba(16,185,129,0.35)] ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Tab Title */}
              <span
                className={`text-[10.5px] sm:text-[11.5px] leading-tight tracking-tight transition-colors mt-0.5 ${
                  isActive ? 'text-purple-700 font-extrabold' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
