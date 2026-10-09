import React, { useState, useEffect } from 'react';
import { 
  X, ClipboardCheck, MessageCircle, 
  CheckCircle2, Send, Ticket, Star, Quote, Key, Sparkles,
  PhoneCall, AlertCircle, Clock, Lock
} from 'lucide-react';
import BongoWebLogo from './BongoWebLogo';
import { BottomTabType } from './FixedBottomNav';
import { TESTIMONIALS } from '../data/mockData';
import { UserAccount, CallBackRequest } from '../types';
import { apiSubmitCallBackRequest } from '../utils/api';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: BottomTabType) => void;
  onGoToCategoryLanding?: () => void;
  onOpenLogoShowcase?: () => void;
  onOpenOrderDetails?: () => void;
  onOpenWebsiteCredentials?: () => void;
}

export default function SideMenuDrawer({
  isOpen,
  onClose,
  onSelectTab,
  onOpenLogoShowcase: _onOpenLogoShowcase,
  onOpenOrderDetails,
  onOpenWebsiteCredentials
}: SideMenuDrawerProps) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const raw = localStorage.getItem('bongoweb_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [myCallBackRequest, setMyCallBackRequest] = useState<CallBackRequest | null>(() => {
    try {
      const raw = localStorage.getItem('bongoweb_my_active_callback_request');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Keep user and callback request in sync
  useEffect(() => {
    const handleSync = () => {
      try {
        const u = localStorage.getItem('bongoweb_user');
        setCurrentUser(u ? JSON.parse(u) : null);
      } catch {
        setCurrentUser(null);
      }

      try {
        const cb = localStorage.getItem('bongoweb_my_active_callback_request');
        setMyCallBackRequest(cb ? JSON.parse(cb) : null);
      } catch {
        setMyCallBackRequest(null);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('bongoweb_user_updated', handleSync);
    window.addEventListener('bongoweb_callback_requests_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('bongoweb_user_updated', handleSync);
      window.removeEventListener('bongoweb_callback_requests_updated', handleSync);
    };
  }, []);

  // Call Back Modal State
  const [callBackModalOpen, setCallBackModalOpen] = useState(false);
  const [callBackName, setCallBackName] = useState('');
  const [callBackPhone, setCallBackPhone] = useState('');
  const [callBackReason, setCallBackReason] = useState('');
  const [callBackSubmitting, setCallBackSubmitting] = useState(false);
  const [callBackSuccess, setCallBackSuccess] = useState(false);
  const [showLoginPromptModal, setShowLoginPromptModal] = useState(false);

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketReason, setTicketReason] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketQuestion, setTicketQuestion] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  // Testimonials Modal State
  const [testimonialsModalOpen, setTestimonialsModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenCallBack = () => {
    if (!currentUser) {
      setShowLoginPromptModal(true);
      return;
    }
    setCallBackName(currentUser.name || '');
    setCallBackPhone(currentUser.phone || '');
    setCallBackReason('');
    setCallBackSuccess(false);
    setCallBackModalOpen(true);
  };

  const handleSubmitCallBack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callBackName.trim() || !callBackPhone.trim() || !callBackReason.trim()) return;

    setCallBackSubmitting(true);
    try {
      const res = await apiSubmitCallBackRequest({
        name: callBackName.trim(),
        phone: callBackPhone.trim(),
        reason: callBackReason.trim()
      });
      setMyCallBackRequest(res);
      setCallBackSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setCallBackSubmitting(false);
    }
  };

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
            <BongoWebLogo size="sm" />

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#E5EDF5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* 1. আপনার Order এর বিস্তারিত */}
            <button
              onClick={() => {
                onClose();
                if (onOpenOrderDetails) {
                  onOpenOrderDetails();
                } else {
                  onSelectTab('after-order');
                }
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-[#EEF2FF] text-[#0D253D] hover:text-[#2B47EE] transition-all text-xs font-bold text-left cursor-pointer group border border-[#E5EDF5] hover:border-[#2B47EE]/30 shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F8FAFD] group-hover:bg-[#FFFFFF] flex items-center justify-center text-[#2B47EE] border border-[#E5EDF5] shadow-xs shrink-0">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-black text-[#0D253D] group-hover:text-[#2B47EE]">
                  ১. আপনার Order এর বিস্তারিত
                </span>
                <span className="text-[11px] text-[#64748D] font-normal block truncate">
                  পেন্ডিং, অনুমোদিত ও সম্পূর্ণ অর্ডারের লাইভ স্ট্যাটাস
                </span>
              </div>
            </button>

            {/* 2. ওয়েবসাইট আইডি ও পাসওয়ার্ড (Website ID & Password) */}
            <button
              onClick={() => {
                onClose();
                if (onOpenWebsiteCredentials) {
                  onOpenWebsiteCredentials();
                } else {
                  onSelectTab('account');
                }
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-[#EEF2FF] text-[#0D253D] hover:text-[#2B47EE] transition-all text-xs font-bold text-left cursor-pointer group border border-[#E5EDF5] hover:border-[#2B47EE]/30 shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] group-hover:bg-[#2B47EE] flex items-center justify-center text-[#2B47EE] group-hover:text-white border border-[#2B47EE]/20 shadow-xs shrink-0 transition-colors">
                <Key className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-black text-[#0D253D] group-hover:text-[#2B47EE]">
                  ২. ওয়েবসাইট আইডি ও পাসওয়ার্ড
                </span>
                <span className="text-[11px] text-[#64748D] font-normal block truncate">
                  অ্যাডমিন আইডি ও পাসওয়ার্ড বিস্তারিত দেখুন
                </span>
              </div>
            </button>

            {/* 3. Live Chat Support */}
            <button
              onClick={() => {
                onSelectTab('live-chat');
                onClose();
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-[#EEF2FF] text-[#0D253D] hover:text-[#2B47EE] transition-all text-xs font-bold text-left cursor-pointer group border border-[#E5EDF5] hover:border-[#2B47EE]/30 shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F8FAFD] group-hover:bg-[#FFFFFF] flex items-center justify-center text-[#2B47EE] border border-[#E5EDF5] shadow-xs shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-black text-[#0D253D] group-hover:text-[#2B47EE]">
                  ৩. BongoWeb Live Support (২৪/৭)
                </span>
                <span className="text-[11px] text-[#64748D] font-normal block truncate">
                  সরাসরি আমাদের টিমের সাথে লাইভ চ্যাট
                </span>
              </div>
            </button>

            {/* 4. Support Ticket */}
            <button
              onClick={handleOpenTicket}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-[#EEF2FF] text-[#0D253D] hover:text-[#2B47EE] transition-all text-xs font-bold text-left cursor-pointer group border border-[#E5EDF5] hover:border-[#2B47EE]/30 shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F8FAFD] group-hover:bg-[#FFFFFF] flex items-center justify-center text-[#2B47EE] border border-[#E5EDF5] shadow-xs shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-black text-[#0D253D] group-hover:text-[#2B47EE]">
                  ৪. Support Ticket
                </span>
                <span className="text-[11px] text-[#64748D] font-normal block truncate">
                  যেকোনো সমস্যায় সাপোর্ট টিকিট জমা দিন
                </span>
              </div>
            </button>

            {/* 5. Testimonials (Client Reviews & Ratings) */}
            <button
              onClick={() => setTestimonialsModalOpen(true)}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-[#EEF2FF] text-[#0D253D] hover:text-[#2B47EE] transition-all text-xs font-bold text-left cursor-pointer group border border-[#E5EDF5] hover:border-[#2B47EE]/30 shadow-2xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F8FAFD] group-hover:bg-[#FFFFFF] flex items-center justify-center text-[#F59E0B] border border-[#E5EDF5] shadow-xs shrink-0">
                <Star className="w-5 h-5 fill-[#F59E0B]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-black text-[#0D253D] group-hover:text-[#2B47EE]">
                  ৫. Testimonials (Client Reviews & Ratings)
                </span>
                <span className="text-[11px] text-[#64748D] font-normal block truncate">
                  গ্রাহকদের মতামত ও ৫-স্টার রেটিং দেখুন
                </span>
              </div>
            </button>

            {/* 6. Call Back Button (Menu Option for all users) */}
            <button
              onClick={handleOpenCallBack}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#F0FDF4] to-[#F8FAFD] hover:from-[#DCFCE7] hover:to-[#EEF2FF] text-[#0D253D] hover:text-[#008A4B] transition-all text-xs font-bold text-left cursor-pointer group border border-[#008A4B]/30 hover:border-[#008A4B] shadow-2xs relative"
            >
              <div className="w-9 h-9 rounded-xl bg-[#008A4B] text-white flex items-center justify-center border border-[#008A4B] shadow-xs shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="block text-sm font-black text-[#0D253D] group-hover:text-[#008A4B]">
                    ৬. Call Back (কল ব্যাক রিকোয়েস্ট)
                  </span>
                  {myCallBackRequest?.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 text-[10px] font-bold border border-amber-500/30 shrink-0 animate-pulse">
                      পেন্ডিং
                    </span>
                  )}
                  {myCallBackRequest?.status === 'approved' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#008A4B]/20 text-[#008A4B] text-[10px] font-bold border border-[#008A4B]/30 shrink-0">
                      ✓ অনুমোদিত
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#64748D] font-normal block truncate">
                  {myCallBackRequest?.status === 'pending'
                    ? 'আপনার কল ব্যাক রিকোয়েস্ট অপেক্ষমান রয়েছে'
                    : myCallBackRequest?.status === 'approved'
                    ? '✓ কল সম্পন্ন ও অনুমোদিত হয়েছে'
                    : 'নাম ও নম্বর দিয়ে কল ব্যাক রিকোয়েস্ট পাঠান'}
                </span>
              </div>
            </button>
          </div>

          {/* Drawer Clean Footer (No WhatsApp button) */}
          <div className="p-4 border-t border-[#E5EDF5] bg-[#F8FAFD] text-center">
            <p className="text-[11px] font-bold text-[#0D253D]">
              BongoWeb • Enterprise Solutions
            </p>
            <p className="text-[10px] text-[#7D8BA4] mt-0.5">
              ২৪ ঘণ্টা লাইভ ডেলিভারি ও সাপোর্ট সিস্টেম
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
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {ticketSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-bold font-mono">
                  {generatedTicketId}
                </span>
                <h3 className="text-xl font-black text-[#0D253D]">
                  সাপোর্ট টিকিট সফলভাবে গৃহীত হয়েছে!
                </h3>
                <p className="text-xs sm:text-sm text-[#273951] leading-relaxed max-w-sm mx-auto">
                  ধন্যবাদ <strong className="text-[#2B47EE]">{ticketName}</strong>। আমাদের টেকনিক্যাল টিম আপনার টিকিট পর্যালোচনা করে খুব শীঘ্রই আপনার মোবাইল নম্বরে সমাধান জানাবে।
                </p>
                <div className="pt-3">
                  <button
                    onClick={handleResetTicketModal}
                    className="px-6 py-2.5 rounded-xl bg-[#2B47EE] text-white text-xs font-bold hover:bg-[#203CD4] transition-all cursor-pointer shadow-xs"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-bold">
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
                      টিকিটের কারণ / বিষয় (Reason Name) <span className="text-[#EF4444]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ডোমেইন সেটআপ, পেমেন্ট গেটওয়ে, কাস্টম ডিজাইন..."
                      value={ticketReason}
                      onChange={(e) => setTicketReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2B47EE] focus:ring-1 focus:ring-[#2B47EE] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        আপনার নাম (Your Name) <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="আপনার নাম"
                        value={ticketName}
                        onChange={(e) => setTicketName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2B47EE] focus:ring-1 focus:ring-[#2B47EE] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        মোবাইল নম্বর <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017xxxxxxxx"
                        value={ticketPhone}
                        onChange={(e) => setTicketPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2B47EE] focus:ring-1 focus:ring-[#2B47EE] transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1">
                      আপনার প্রশ্ন বা সমস্যা (Your Question) <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="বিস্তারিত লিখুন..."
                      value={ticketQuestion}
                      onChange={(e) => setTicketQuestion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2B47EE] focus:ring-1 focus:ring-[#2B47EE] transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-[#2B47EE] hover:bg-[#203CD4] active:bg-[#1E3A8A] text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
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

      {/* Testimonials Modal */}
      {testimonialsModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl max-h-[85vh] bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 animate-slideUpModal relative flex flex-col">
            <button
              onClick={() => setTestimonialsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-bold">
                গ্রাহকদের রেটিং ও রিভিউ
              </span>
              <h2 className="text-xl font-black text-[#0D253D] mt-2">
                Testimonials (Client Reviews & Ratings)
              </h2>
              <p className="text-xs text-[#64748D] mt-0.5">
                BongoWeb থেকে ওয়েবসাইট নিয়ে গ্রাহকরা যা বলছেন:
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0D253D]">{t.name}</h4>
                      <p className="text-[11px] text-[#64748D]">{t.business} • {t.role || t.location}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      {[...Array(t.stars || 5)].map((_, rIdx) => (
                        <Star key={rIdx} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#273951] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E5EDF5] text-center">
              <button
                onClick={() => setTestimonialsModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#2B47EE] text-white text-xs font-bold hover:bg-[#203CD4] cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal for Non-Logged-in Users */}
      {showLoginPromptModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0D253D]/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-7 animate-slideUpModal relative">
            <button
              onClick={() => setShowLoginPromptModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#008A4B] to-[#00572F] text-white flex items-center justify-center mx-auto shadow-md">
                <PhoneCall className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#0D253D]">
                  কল ব্যাক সেবা (Call Back Request)
                </h3>
                <p className="text-xs text-[#64748D] mt-1.5 leading-relaxed">
                  কল ব্যাক রিকোয়েস্ট জমা দিতে এবং আমাদের সাপোর্ট টিমের সরাসরি কল পেতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন বা একটি নতুন অ্যাকাউন্ট খুলুন।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#008A4B]/20 text-xs text-[#166534] flex items-center gap-2 text-left">
                <Lock className="w-4 h-4 shrink-0 text-[#008A4B]" />
                <span>লগইন করার পর আপনার নাম ও নম্বর স্বয়ংক্রিয়ভাবে সংযুক্ত হবে।</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginPromptModal(false);
                    onClose();
                    onSelectTab('account');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#2B47EE] hover:bg-[#203CD4] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>লগইন / সাইন আপ করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowLoginPromptModal(false)}
                  className="py-3 px-4 rounded-xl bg-[#F8FAFD] hover:bg-[#E5EDF5] text-[#64748D] text-xs font-bold transition-all cursor-pointer"
                >
                  পরে করব
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Back Request Modal for Logged-In Users */}
      {callBackModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0D253D]/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 animate-slideUpModal relative">
            <button
              onClick={() => {
                setCallBackModalOpen(false);
                setCallBackSuccess(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* If has existing pending request and not in success view */}
            {myCallBackRequest?.status === 'pending' && !callBackSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 shrink-0">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0D253D]">
                      কল ব্যাক রিকোয়েস্ট অপেক্ষমান
                    </h3>
                    <p className="text-xs text-[#64748D]">
                      আপনার অনুরোধটি গৃহীত হয়েছে, শীঘ্রই কল পাবেন।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-amber-500/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[#92400E]">
                    <span className="font-semibold">অনুরোধকারী:</span>
                    <span className="font-bold text-[#0D253D]">{myCallBackRequest.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#92400E]">
                    <span className="font-semibold">মোবাইল নম্বর:</span>
                    <span className="font-mono font-bold text-[#0D253D]">{myCallBackRequest.phone}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#92400E]">
                    <span className="font-semibold">অনুরোধের সময়:</span>
                    <span className="text-[#0D253D]">{myCallBackRequest.requestedAt}</span>
                  </div>
                  <div className="pt-2 border-t border-amber-500/20">
                    <span className="font-semibold text-[#92400E] block mb-1">কল করার কারণ:</span>
                    <p className="p-2.5 rounded-xl bg-white border border-amber-500/20 text-[#0D253D] font-medium leading-relaxed">
                      {myCallBackRequest.reason}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMyCallBackRequest(null);
                      setCallBackSuccess(false);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#F8FAFD] hover:bg-[#E5EDF5] text-[#0D253D] text-xs font-bold border border-[#E5EDF5] transition-all cursor-pointer"
                  >
                    আরেকটি নতুন রিকোয়েস্ট পাঠান
                  </button>
                  <button
                    type="button"
                    onClick={() => setCallBackModalOpen(false)}
                    className="py-2.5 px-5 rounded-xl bg-[#2B47EE] text-white text-xs font-bold hover:bg-[#203CD4] cursor-pointer"
                  >
                    ঠিক আছে
                  </button>
                </div>
              </div>
            ) : myCallBackRequest?.status === 'approved' && !callBackSuccess ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#008A4B]/15 text-[#008A4B] flex items-center justify-center border border-[#008A4B]/30 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0D253D]">
                      কল ব্যাক সম্পন্ন ও অনুমোদিত!
                    </h3>
                    <p className="text-xs text-[#008A4B] font-semibold">
                      আমাদের টিম আপনার সাথে কথা বলেছে ও অনুমোদন দিয়েছে।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#008A4B]/20 space-y-2 text-xs text-[#166534]">
                  <p>আমাদের এক্সিকিউটিভ আপনার অনুরোধের প্রেক্ষিতে কল করেছিলেন। আপনার যেকোনো প্রয়োজনে আমরা সদা প্রস্তুত।</p>
                  {myCallBackRequest.approvedAt && (
                    <p className="text-[11px] text-[#15803D]">
                      অনুমোদনের তারিখ: <span className="font-mono font-bold">{myCallBackRequest.approvedAt}</span>
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMyCallBackRequest(null);
                      setCallBackSuccess(false);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#008A4B] hover:bg-[#00703C] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    নতুন কল ব্যাক রিকোয়েস্ট পাঠান
                  </button>
                  <button
                    type="button"
                    onClick={() => setCallBackModalOpen(false)}
                    className="py-2.5 px-5 rounded-xl bg-[#F8FAFD] text-[#64748D] text-xs font-bold hover:bg-[#E5EDF5] cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            ) : callBackSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#008A4B]/10 text-[#008A4B] flex items-center justify-center mx-auto border border-[#008A4B]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0D253D]">
                    কল ব্যাক রিকোয়েস্ট সফলভাবে জমা হয়েছে!
                  </h3>
                  <p className="text-xs text-[#64748D] mt-1 max-w-sm mx-auto">
                    আমাদের সাপোর্ট টিম আপনার দেওয়া নম্বরে ({callBackPhone}) দ্রুত কল করবে।
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-left space-y-1">
                  <div className="text-[#64748D]">
                    কারণ: <span className="text-[#0D253D] font-bold">{callBackReason}</span>
                  </div>
                  <div className="text-[#64748D]">
                    স্ট্যাটাস: <span className="text-amber-600 font-bold">অপেক্ষমান (পেন্ডিং)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCallBackModalOpen(false);
                    setCallBackSuccess(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#2B47EE] hover:bg-[#203CD4] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#008A4B] to-[#00572F] text-white flex items-center justify-center shadow-md shrink-0">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0D253D]">
                      ফ্রি কল ব্যাক রিকোয়েস্ট (Call Back)
                    </h3>
                    <p className="text-xs text-[#64748D]">
                      আপনার নাম ও নম্বর দিন এবং কল করার কারণ লিখুন।
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmitCallBack} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        আপনার নাম <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="আপনার পূর্ণ নাম"
                        value={callBackName}
                        onChange={(e) => setCallBackName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2B47EE] focus:ring-1 focus:ring-[#2B47EE] transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        মোবাইল নম্বর <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017xxxxxxxx"
                        value={callBackPhone}
                        onChange={(e) => setCallBackPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2B47EE] focus:ring-1 focus:ring-[#2B47EE] transition-all font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1">
                      কল করার কারণ (Reason for Call) <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="আপনি কেন কল ব্যাক চান? আপনার সমস্যা বা প্রয়োজনীয় তথ্য বিস্তারিত লিখুন..."
                      value={callBackReason}
                      onChange={(e) => setCallBackReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2B47EE] focus:ring-1 focus:ring-[#2B47EE] transition-all resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-[11px] text-[#64748D] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#008A4B] shrink-0" />
                    <span>আমাদের টিম অফিস চলাকালীন সর্বোচ্চ ১৫-৩০ মিনিটের মধ্যে কল করে থাকে।</span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={callBackSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-[#008A4B] hover:bg-[#00703C] active:bg-[#00572F] text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{callBackSubmitting ? 'জমা হচ্ছে...' : 'কল ব্যাক রিকোয়েস্ট পাঠান (Submit Call Back)'}</span>
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
