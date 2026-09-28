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
      className="fixed bottom-0 left-0 right-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E5EDF5] shadow-[0_-4px_24px_rgba(13,37,61,0.06)] h-16 sm:h-[72px] flex items-center select-none"
    >
      <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-full mx-auto px-2 sm:px-4 h-full flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              id={`bottom-nav-${tab.id}`}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 sm:py-2 px-1 rounded-xl transition-all duration-200 cursor-pointer touch-manipulation min-h-[48px] ${
                isActive
                  ? 'text-[#533AFD] font-bold'
                  : 'text-[#64748D] hover:text-[#273951] font-semibold'
              }`}
            >
              {/* Active subtle background capsule */}
              {isActive && (
                <span className="absolute inset-x-2 inset-y-1 bg-[#E2E4FF] rounded-xl -z-10 animate-fadeIn" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative mb-0.5">
                <Icon
                  className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#00B261] text-[#FFFFFF] text-[9px] font-bold shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Tab Title */}
              <span
                className={`text-[11px] sm:text-xs leading-none tracking-tight transition-colors ${
                  isActive ? 'text-[#533AFD]' : 'text-[#64748D]'
                }`}
              >
                {tab.label}
              </span>

              {/* Micro Active Bottom Dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#533AFD] mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
