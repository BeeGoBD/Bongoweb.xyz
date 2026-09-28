import React from 'react';
import { Bell, X, CheckCheck, Sparkles, ShieldCheck, Zap, MessageCircle } from 'lucide-react';

interface NotificationItem {
  id: string;
  titleBangla: string;
  titleEnglish: string;
  time: string;
  isUnread: boolean;
  type: 'feature' | 'promo' | 'system';
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  onClearAll
}: NotificationsModalProps) {
  if (!isOpen) return null;

  const notifications: NotificationItem[] = [
    {
      id: '1',
      titleBangla: '🎉 ২০২৬ নতুন সুপারফাস্ট ই-কমার্স ও রেস্তোরাঁ টেমপ্লেট যুক্ত হয়েছে!',
      titleEnglish: 'New 2026 ultra-speed e-commerce & dining templates launched.',
      time: '১০ মিনিট আগে',
      isUnread: true,
      type: 'feature'
    },
    {
      id: '2',
      titleBangla: '⚡ প্রতিটি অর্ডারে পাচ্ছেন ফ্রি .com ডোমেইন ও লাইফটাইম SSL সার্টিফিকেট।',
      titleEnglish: 'Complimentary .com custom domain & SSL security included.',
      time: '১ ঘণ্টা আগে',
      isUnread: true,
      type: 'promo'
    },
    {
      id: '3',
      titleBangla: '🛡️ ২৪ ঘণ্টার মধ্যে ডেলিভারি গ্যারান্টি সহ যেকোনো ওয়েবসাইট চালু করুন।',
      titleEnglish: '24-Hour Express Launch guarantee is fully active across all packages.',
      time: 'আজ সকালে',
      isUnread: true,
      type: 'system'
    },
    {
      id: '4',
      titleBangla: '💬 আমাদের ইঞ্জিনিয়ারিং সাপোর্ট টিম এখন লাইভ অনলাইনে আছেন।',
      titleEnglish: 'Engineering desk is live for consultation & live chat support.',
      time: 'গতকাল',
      isUnread: false,
      type: 'system'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-6 bg-[#0D253D]/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl overflow-hidden animate-slideUpModal mt-12 sm:mt-14"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#F8FAFD] border-b border-[#E5EDF5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center">
              <Bell className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0D253D]">
                অ্যাডমিন নোটিফিকেশন
              </h3>
              <p className="text-[10px] text-[#64748D]">
                Admin Alerts & System Updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="text-[11px] font-semibold text-[#533AFD] hover:text-[#665EFD] flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>পড়ুন</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64748D] hover:text-[#0D253D] hover:bg-[#E5EDF5]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-3 sm:p-4 space-y-2.5 max-h-[380px] overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                item.isUnread
                  ? 'bg-[#E2E4FF]/40 border-[#533AFD]/30 shadow-2xs'
                  : 'bg-[#F8FAFD] border-[#E5EDF5]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#533AFD] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#0D253D] leading-snug">
                    {item.titleBangla}
                  </p>
                  <p className="text-[11px] text-[#64748D] mt-0.5 leading-snug">
                    {item.titleEnglish}
                  </p>
                  <span className="text-[10px] font-mono text-[#7D8BA4] mt-1.5 block">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F8FAFD] border-t border-[#E5EDF5] text-center">
          <p className="text-[11px] text-[#64748D]">
            Official announcements from BongoWeb.xyz engineering desk
          </p>
        </div>
      </div>
    </div>
  );
}
