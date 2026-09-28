import React, { useState } from 'react';
import { 
  X, LayoutGrid, Layers, ClipboardCheck, MessageCircle, User, 
  ShieldCheck, PhoneCall, Globe, ArrowRight, HelpCircle, FileText,
  LifeBuoy, CheckCircle2, Send, Ticket
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
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketReason, setTicketReason] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketQuestion, setTicketQuestion] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  if (!isOpen) return null;

  const handleOpenTicket = () => {
    setTicketSubmitted(false);
    setTicketModalOpen(true);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReason.trim() || !ticketName.trim() || !ticketQuestion.trim()) return;

    const randomId = `#TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTicketId(randomId);
    setTicketSubmitted(true);
  };

  const handleResetTicketModal = () => {
    setTicketModalOpen(false);
    setTicketSubmitted(false);
    setTicketReason('');
    setTicketName('');
    setTicketPhone('');
    setTicketQuestion('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
        {/* Backdrop */}
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-[#0D253D]/50 backdrop-blur-xs transition-opacity" 
        />

        {/* Drawer Content */}
        <div className="relative w-full max-w-sm sm:max-w-md bg-[#FFFFFF] h-full shadow-2xl flex flex-col justify-between z-10 animate-slideLeft border-l border-[#E5EDF5]">
          {/* Drawer Top Header */}
          <div className="p-4 sm:p-5 border-b border-[#E5EDF5] flex items-center justify-between bg-[#F8FAFD]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#533AFD] text-[#FFFFFF] flex items-center justify-center font-black text-xs">
                BW
              </div>
              <div>
                <h3 className="text-sm font-black text-[#0D253D]">BongoWeb.xyz</h3>
                <p className="text-[10px] text-[#64748D]">Stripe Design System</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#E5EDF5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
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
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-black">অর্ডারের পরের ধাপসমূহ</span>
                <span className="text-[10px] text-[#64748D] font-normal">What we do after taking your order</span>
              </div>
            </button>

            {/* Support Ticket Menu Option Requested by User */}
            <button
              onClick={handleOpenTicket}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-[#E2E4FF]/60 hover:bg-[#E2E4FF] text-[#533AFD] transition-all text-xs font-bold text-left cursor-pointer group border border-[#533AFD]/20 shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-[#533AFD] flex items-center justify-center text-[#FFFFFF] shadow-xs">
                <Ticket className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="block font-black">সাপোর্ট টিকিট জমা দিন</span>
                  <span className="text-[9px] bg-[#533AFD] text-white px-1.5 py-0.2 rounded-md font-bold">নতুন</span>
                </div>
                <span className="text-[10px] text-[#533AFD] font-medium">Create direct support ticket</span>
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

      {/* Support Ticket Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 animate-slideUpModal relative">
            <button
              onClick={handleResetTicketModal}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD]"
            >
              <X className="w-5 h-5" />
            </button>

            {ticketSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold font-mono">
                  {generatedTicketId}
                </span>
                <h3 className="text-xl font-black text-[#0D253D]">
                  সাপোর্ট টিকিট সফলভাবে গৃহীত হয়েছে!
                </h3>
                <p className="text-xs sm:text-sm text-[#273951] leading-relaxed max-w-sm mx-auto">
                  ধন্যবাদ <strong className="text-[#533AFD]">{ticketName}</strong>। আমাদের টেকনিক্যাল টিম আপনার টিকিট পর্যালোচনা করে খুব শীঘ্রই ফোন বা WhatsApp নম্বরে সমাধান জানাবে।
                </p>
                <div className="pt-3">
                  <button
                    onClick={handleResetTicketModal}
                    className="px-6 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] transition-all cursor-pointer shadow-xs"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold">
                    সরাসরি সাপোর্ট ডেস্ক
                  </span>
                  <h2 className="text-xl font-black text-[#0D253D] mt-2">
                    সাপোর্ট টিকিট জমা দিন (Support Ticket)
                  </h2>
                  <p className="text-xs text-[#64748D] mt-1">
                    আপনার যেকোনো প্রশ্ন বা সমস্যার কারণ লিখে টিকিট পাঠান।
                  </p>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1">
                      টিকিটের কারণ / বিষয় (Reason Name) <span className="text-[#D8351E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ডোমেইন সেটআপ, পেমেন্ট গেটওয়ে, কাস্টম ডিজাইন..."
                      value={ticketReason}
                      onChange={(e) => setTicketReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        আপনার নাম (Your Name) <span className="text-[#D8351E]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="আপনার নাম"
                        value={ticketName}
                        onChange={(e) => setTicketName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        মোবাইল / WhatsApp <span className="text-[#D8351E]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017xxxxxxxx"
                        value={ticketPhone}
                        onChange={(e) => setTicketPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1">
                      আপনার প্রশ্ন বা সমস্যা (Your Question) <span className="text-[#D8351E]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="বিস্তারিত লিখুন..."
                      value={ticketQuestion}
                      onChange={(e) => setTicketQuestion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>টিকিট পাঠান (Send Ticket)</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
