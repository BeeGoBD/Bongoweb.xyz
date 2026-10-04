import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCheck, ShieldCheck, ShoppingBag, Key, MessageSquare, AlertCircle } from 'lucide-react';
import { ClientOrder, WebsiteDeliveryCredentials } from '../types';

interface RealNotification {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: 'order' | 'credential' | 'chat';
  isUnread: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onNavigateToAccount?: () => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  onClearAll,
  onNavigateToAccount
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<RealNotification[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const loadRealNotifications = async () => {
      const realList: RealNotification[] = [];

      try {
        let orders: ClientOrder[] = [];
        let creds: WebsiteDeliveryCredentials[] = [];

        try {
          const res = await fetch('/api/data');
          if (res.ok) {
            const db = await res.json();
            if (Array.isArray(db.orders)) orders = db.orders;
            if (Array.isArray(db.deliveredCredentials)) creds = db.deliveredCredentials;
          }
        } catch (_) {}

        if (orders.length === 0) {
          const storedOrders = localStorage.getItem('bongoweb_orders');
          if (storedOrders) orders = JSON.parse(storedOrders);
        }
        if (creds.length === 0) {
          const storedCreds = localStorage.getItem('bongoweb_delivered_credentials');
          if (storedCreds) creds = JSON.parse(storedCreds);
        }

        const storedUser = localStorage.getItem('bongoweb_user');
        const userPhone = storedUser ? JSON.parse(storedUser).phone : null;

        const userOrders = userPhone ? orders.filter(o => o.phone === userPhone) : orders;
        
        // Requirement 6: If payment is in verification, notice is visible.
        // After the order is confirmed (verified), the verification notification automatically disappears!
        userOrders.forEach((o) => {
          if (o.status === 'pending') {
            realList.push({
              id: `ord-pending-${o.orderId}`,
              title: `অর্ডার ${o.orderId} — পেমেন্ট ভেরিফিকেশন চলছে`,
              subtitle: `${o.companyName || o.clientName} (${o.demoTitle}) এর পেমেন্ট যাচাই করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।`,
              time: o.createdAt || 'সম্প্রতি',
              type: 'order',
              isUnread: true
            });
          }
        });

        // Requirement 6: Once details are sent, client receives notification per website
        const myCreds = userPhone ? creds.filter(c => c.userPhone === userPhone) : creds;
        myCreds.forEach((c) => {
          realList.push({
            id: `cred-${c.id}`,
            title: `🔑 ${c.websiteTitle || 'ওয়েবসাইট'} — অ্যাডমিন অ্যাক্সেস ডেলিভারি`,
            subtitle: `আইডি: ${c.websiteAdminId} • পাসওয়ার্ড: ${c.websiteAdminPass}। ক্লিক করে বিস্তারিত দেখুন।`,
            time: c.deliveredAt || 'সম্প্রতি',
            type: 'credential',
            isUnread: true
          });
        });
      } catch (_) {}

      setNotifications(realList);
    };

    loadRealNotifications();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-6 bg-[#0D253D]/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl overflow-hidden animate-slideUpModal mt-12 sm:mt-14"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#F8FAFD] border-b border-[#E5EDF5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0D253D]">
                সিস্টেম নোটিফিকেশন
              </h3>
              <p className="text-[10px] text-[#64748D]">
                Real-Time Updates & Alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  setNotifications([]);
                  onClearAll();
                }}
                className="text-[11px] font-semibold text-[#2B47EE] hover:text-[#203CD4] flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>ক্লিয়ার</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64748D] hover:text-[#0D253D] hover:bg-[#E5EDF5] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Notifications List */}
        <div className="p-3 sm:p-4 space-y-2.5 max-h-[380px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] flex items-center justify-center mx-auto mb-2 text-[#64748D]">
                <Bell className="w-5 h-5 text-[#94A3B8]" />
              </div>
              <p className="text-xs font-bold text-[#0D253D]">কোনো নতুন নোটিফিকেশন নেই</p>
              <p className="text-[11px] text-[#64748D] mt-0.5">
                আপনার অর্ডার, পেমেন্ট ও ডেলিভারি সংক্রান্ত সমস্ত রিয়েল-টাইম আপডেট এখানে প্রদর্শিত হবে।
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (onNavigateToAccount) {
                    onNavigateToAccount();
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-[#2B47EE]/50 ${
                  item.isUnread
                    ? 'bg-[#EEF2FF]/50 border-[#2B47EE]/30 shadow-2xs'
                    : 'bg-[#F8FAFD] border-[#E5EDF5]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.isUnread ? 'bg-[#2B47EE]' : 'bg-[#94A3B8]'}`} />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#0D253D] leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#64748D] mt-0.5 leading-snug">
                      {item.subtitle}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] font-mono text-[#7D8BA4]">
                        {item.time}
                      </span>
                      <span className="text-[10px] font-bold text-[#2B47EE] hover:underline">
                        বিস্তারিত দেখুন →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F8FAFD] border-t border-[#E5EDF5] text-center">
          <p className="text-[11px] text-[#64748D]">
            BongoWeb রিয়েল-টাইম এনক্রিপ্টেড নোটিফিকেশন সিস্টেম
          </p>
        </div>
      </div>
    </div>
  );
}
