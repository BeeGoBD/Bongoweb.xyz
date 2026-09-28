import React from 'react';
import { 
  X, LayoutGrid, Layers, Sparkles, MessageCircle, User, 
  ShieldCheck, PhoneCall, Globe, ArrowRight, HelpCircle, FileText 
} from 'lucide-react';
import { BottomTabType } from './FixedBottomNav';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: BottomTabType) => void;
  onGoToCategoryLanding: () => void;
}

export default function SideMenuDrawer({
  isOpen,
  onClose,
  onSelectTab,
  onGoToCategoryLanding
}: SideMenuDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0D253D]/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xs sm:max-w-sm bg-[#FFFFFF] h-full shadow-2xl flex flex-col justify-between border-l border-[#E5EDF5] animate-slideInRight">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E5EDF5] flex items-center justify-between bg-[#F8FAFD]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#533AFD] text-white flex items-center justify-center font-black text-xs shadow-xs">
              BW
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0D253D]">
                BongoWeb.xyz
              </h3>
              <p className="text-[10px] text-[#64748D]">
                নেভিগেশন মেনু
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748D] hover:text-[#0D253D] hover:bg-[#E5EDF5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Menu Links (in Bangla as requested) */}
        <div className="p-4 space-y-1.5 overflow-y-auto flex-1">
          <button
            onClick={() => {
              onSelectTab('dashboard');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl hover:bg-[#E2E4FF] text-[#0D253D] hover:text-[#533AFD] transition-all text-xs font-bold text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F8FAFD] group-hover:bg-[#FFFFFF] flex items-center justify-center text-[#533AFD] border border-[#E5EDF5]">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="block font-black">ড্যাশবোর্ড ও ওয়েবসাইট তালিকা</span>
              <span className="text-[10px] text-[#64748D] font-normal">All templates & live designs</span>
            </div>
          </button>

          <button
            onClick={() => {
              onGoToCategoryLanding();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl hover:bg-[#E2E4FF] text-[#0D253D] hover:text-[#533AFD] transition-all text-xs font-bold text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F8FAFD] group-hover:bg-[#FFFFFF] flex items-center justify-center text-[#533AFD] border border-[#E5EDF5]">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="block font-black">ক্যাটাগরি পেজে ফিরুন</span>
              <span className="text-[10px] text-[#64748D] font-normal">E-commerce, Food, Blogs & Grocery</span>
            </div>
          </button>

          <button
            onClick={() => {
              onSelectTab('after-order');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl hover:bg-[#E2E4FF] text-[#0D253D] hover:text-[#533AFD] transition-all text-xs font-bold text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F8FAFD] group-hover:bg-[#FFFFFF] flex items-center justify-center text-[#533AFD] border border-[#E5EDF5]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="block font-black">অর্ডারের পরের ধাপসমূহ</span>
              <span className="text-[10px] text-[#64748D] font-normal">What we do after taking your order</span>
            </div>
          </button>

          <button
            onClick={() => {
              onSelectTab('live-chat');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl hover:bg-[#E2E4FF] text-[#0D253D] hover:text-[#533AFD] transition-all text-xs font-bold text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F8FAFD] group-hover:bg-[#FFFFFF] flex items-center justify-center text-[#533AFD] border border-[#E5EDF5]">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="block font-black">লাইভ চ্যাট সাপোর্ট</span>
              <span className="text-[10px] text-[#64748D] font-normal">Connect directly with our team</span>
            </div>
          </button>

          <button
            onClick={() => {
              onSelectTab('account');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl hover:bg-[#E2E4FF] text-[#0D253D] hover:text-[#533AFD] transition-all text-xs font-bold text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F8FAFD] group-hover:bg-[#FFFFFF] flex items-center justify-center text-[#533AFD] border border-[#E5EDF5]">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="block font-black">ক্লায়েন্ট অ্যাকাউন্ট ও সেটিংস</span>
              <span className="text-[10px] text-[#64748D] font-normal">Client profile & policies</span>
            </div>
          </button>

          {/* Guarantees Box */}
          <div className="mt-4 p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0D253D]">
              <ShieldCheck className="w-4 h-4 text-[#00B261]" />
              <span>১০০% মানিব্যাক গ্যারান্টি</span>
            </div>
            <p className="text-[11px] text-[#64748D] leading-relaxed">
              ২৪ ঘণ্টার মধ্যে সন্তোষজনক ডেলিভারি নিশ্চিত না হলে সম্পূর্ণ টাকা ফেরত।
            </p>
          </div>
        </div>

        {/* Drawer Footer Hotline */}
        <div className="p-4 border-t border-[#E5EDF5] bg-[#F8FAFD]">
          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-[#00B261] hover:bg-[#009e56] text-[#FFFFFF] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>অফিসিয়াল WhatsApp</span>
          </a>
          <p className="text-[10px] text-center text-[#7D8BA4] mt-2">
            BongoWeb.xyz • Stripe Design System 2026
          </p>
        </div>
      </div>
    </div>
  );
}
