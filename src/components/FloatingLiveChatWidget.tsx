import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, X, Send, User, Phone, Globe, 
  CheckCircle2, Clock, Headphones, Minimize2, Sparkles, AlertCircle, ShieldCheck
} from 'lucide-react';
import { 
  SupportChatMessage, SupportChatThread 
} from '../types';
import { 
  apiActivateChat, apiSendChatMessage, subscribeToSingleChatThread, 
  normalizePhone, apiGetLiveChatEnabled 
} from '../utils/api';
import { realtimeManager } from '../utils/realtime';
import ClientSecurityCodeModal from './ClientSecurityCodeModal';

export default function FloatingLiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  // User onboarding info
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [errorMsg, setErrorMsg] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  // Chat conversation
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLiveOnline, setIsLiveOnline] = useState(true);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check existing session & live status on mount
  useEffect(() => {
    apiGetLiveChatEnabled().then(setIsLiveOnline).catch(() => {});

    // Check if user is logged into their BongoWeb account
    try {
      const storedUser = localStorage.getItem('bongoweb_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
      }
    } catch (_) {}

    // Check if an active chat session was already started
    try {
      const storedSession = localStorage.getItem('bongoweb_chat_active_session');
      if (storedSession) {
        const sess = JSON.parse(storedSession);
        if (sess.phone) {
          setPhone(sess.phone);
          if (sess.name) setName(sess.name);
          if (sess.language) setLanguage(sess.language);
          setIsActivated(true);
        }
      }
    } catch (_) {}

    const unsubRealtime = realtimeManager.on('system:chat_status', (data) => {
      if (typeof data.enabled === 'boolean') {
        setIsLiveOnline(data.enabled);
      }
    });

    return () => {
      unsubRealtime();
    };
  }, []);

  // Subscribe to chat updates when active
  useEffect(() => {
    if (!isActivated || !phone) return;

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone) return;

    const unsub = subscribeToSingleChatThread(cleanPhone, (thread: SupportChatThread | null) => {
      if (thread && Array.isArray(thread.messages)) {
        setMessages(thread.messages);
        if (!isOpen && thread.unreadClientCount && thread.unreadClientCount > 0) {
          setUnreadCount(thread.unreadClientCount);
        }
      }
    });

    const unsubMsg = realtimeManager.on('chat:message', (payload) => {
      if (normalizePhone(payload.phone) === cleanPhone && payload.message) {
        setMessages(prev => {
          if (prev.some(m => m.id === payload.message.id || (m.sender === payload.message.sender && m.text === payload.message.text && m.timestamp === payload.message.timestamp))) {
            return prev;
          }
          return [...prev, payload.message];
        });
        if (!isOpen && payload.message.sender === 'admin') {
          setUnreadCount(c => c + 1);
        }
      }
    });

    const unsubTyping = realtimeManager.on('chat:typing', (payload) => {
      if (normalizePhone(payload.phone) === cleanPhone && payload.sender === 'admin') {
        setIsAgentTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsAgentTyping(false);
        }, 3000);
      }
    });

    return () => {
      unsub();
      unsubMsg();
      unsubTyping();
    };
  }, [isActivated, phone, isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Clear unread count when opening
  const handleOpenWidget = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  // Start chat session with updated details
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/[^0-9]/g, '').trim();

    if (!cleanName) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন' : 'Please enter your name');
      return;
    }

    if (cleanPhone.length < 11) {
      setErrorMsg(language === 'bn' ? 'সঠিক ১১-সংখ্যার মোবাইল নম্বর লিখুন' : 'Please enter a valid 11-digit mobile number');
      return;
    }

    setIsStarting(true);
    try {
      const welcomeText = language === 'bn'
        ? `আসসালামু আলাইকুম ${cleanName}! BongoWeb লাইভ সাপোর্টে স্বাগতম। আপনার পছন্দের ওয়েবসাইট তৈরি বা যেকোনো তথ্যে আমাদের টিম সহায়তা করতে প্রস্তুত।`
        : `Hello ${cleanName}! Welcome to BongoWeb Live Support. How can our engineering team assist you today?`;

      const thread = await apiActivateChat({
        name: cleanName,
        phone: cleanPhone,
        language,
        welcomeText
      });

      if (thread && thread.messages) {
        setMessages(thread.messages);
      }
      setIsActivated(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('চ্যাট শুরু করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsStarting(false);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || isSending || !phone) return;

    setInputText('');
    setIsSending(true);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const optimisticMsg: SupportChatMessage = {
      id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      sender: 'client',
      text: cleanText,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      await apiSendChatMessage({
        phone: normalizePhone(phone),
        sender: 'client',
        text: cleanText,
        name,
        message: optimisticMsg
      });
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* 1. Round Floating Hover Button with Pulse Animation & Live Vibe */}
      <div 
        id="floating-live-chat-round-button"
        className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-50 flex items-center gap-3 select-none pointer-events-auto"
      >
        {/* Friendly Hover Pill Badge */}
        {!isOpen && (
          <div 
            onClick={handleOpenWidget}
            className="hidden xs:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-indigo-200/80 shadow-[0_4px_20px_rgba(43,71,238,0.18)] text-slate-800 text-xs font-bold cursor-pointer hover:border-[#2B47EE] hover:text-[#2B47EE] transition-all hover:scale-105 active:scale-95 group"
          >
            <span className="w-2 h-2 rounded-full bg-[#00B261] animate-ping shrink-0" />
            <span>২৪/৭ লাইভ সাপোর্ট</span>
            <span className="text-[10px] text-[#2B47EE] font-extrabold group-hover:translate-x-0.5 transition-transform">
              চ্যাট করুন →
            </span>
          </div>
        )}

        {/* Circular Floating Button */}
        <button
          onClick={() => (isOpen ? setIsOpen(false) : handleOpenWidget())}
          aria-label="Live Chat Support"
          className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#1E3A8A] via-[#2B47EE] to-[#7C3AED] text-white shadow-[0_8px_30px_rgba(43,71,238,0.45)] hover:shadow-[0_12px_36px_rgba(43,71,238,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/40"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#2B47EE]/35 blur-md -z-10 group-hover:bg-[#7C3AED]/45 transition-colors animate-pulse" />

          {/* Online Indicator Badge */}
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E575] opacity-80" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00B261] border-2 border-white" />
          </span>

          {/* Unread Message Pill */}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded-full bg-[#E53935] text-white text-[10px] font-black border-2 border-white shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}

          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5] text-white transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <MessageCircle className="w-7 h-7 stroke-[2.2] text-white transition-transform group-hover:scale-110 duration-200" />
          )}
        </button>
      </div>

      {/* 2. Floating Live Chat Window */}
      {isOpen && (
        <div 
          id="floating-live-chat-panel"
          className="fixed bottom-24 right-3 sm:bottom-28 sm:right-8 z-50 w-[94vw] sm:w-[380px] max-h-[80vh] h-[540px] bg-white rounded-3xl shadow-[0_20px_70px_rgba(13,37,61,0.25)] border border-slate-200/90 overflow-hidden flex flex-col text-[#0D253D] animate-slideUpModal select-none"
          role="dialog"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2B47EE] p-4 text-white shrink-0 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xs">
                    <Headphones className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00E575] border-2 border-[#1E3A8A]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-sm text-white tracking-tight">
                      BongoWeb Live Chat
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-white/15 text-[9px] font-bold text-emerald-300 font-mono">
                      ২৪/৭
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E575] animate-pulse" />
                    <span>{isLiveOnline ? 'ইঞ্জিনিয়ারিং টিম অনলাইনে সক্রিয়' : 'সাপোর্ট ডেস্ক সক্রিয়'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* 5-Min Rotating Security Code Icon Button (Requirement 13) */}
                <button
                  type="button"
                  onClick={() => setShowSecurityCodeModal(true)}
                  className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                  title="৫-মিনিটের সিকিউরিটি কোড (Security Code)"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span className="hidden sm:inline">কোড</span>
                </button>

                {isActivated && (
                  <button
                    type="button"
                    onClick={() => setIsActivated(false)}
                    className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer text-[10px] font-bold"
                    title="তথ্য পরিবর্তন করুন"
                  >
                    এডিট
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* BODY: STEP 1 - ONBOARDING FORM (Name, Phone, Language) */}
          {!isActivated ? (
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col justify-between bg-slate-50/50">
              <div className="space-y-4">
                <div className="text-center pt-1 pb-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                    <Sparkles className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h4 className="text-base font-black text-[#0D253D]">
                    সরাসরি লাইভ চ্যাট শুরু করুন
                  </h4>
                  <p className="text-xs text-[#64748D] mt-1 leading-relaxed max-w-xs mx-auto">
                    আপনার মোবাইল নম্বর ও নাম প্রদান করে সরাসরি আমাদের সাপোর্ট টিমের সাথে সংযুক্ত হোন।
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleStartChat} className="space-y-3.5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#0D253D] mb-1">
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#64748D] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-[#0D253D] focus:outline-none focus:border-[#2B47EE] focus:ring-2 focus:ring-[#2B47EE]/20 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Mobile Phone Input */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#0D253D] mb-1">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#64748D] absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold font-mono text-[#0D253D] focus:outline-none focus:border-[#2B47EE] focus:ring-2 focus:ring-[#2B47EE]/20 transition-all shadow-2xs"
                      />
                    </div>
                    <span className="text-[10px] text-[#64748D] block mt-1">
                      (অ্যাকাউন্ট ভেরিফিকেশন ও চ্যাট হিস্ট্রি সংরক্ষণের জন্য প্রয়োজনীয়)
                    </span>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-xs font-extrabold text-[#0D253D] mb-1.5">
                      পছন্দের ভাষা (Language Preference)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage('bn')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          language === 'bn'
                            ? 'bg-[#EEF2FF] text-[#2B47EE] border-[#2B47EE] shadow-2xs'
                            : 'bg-white text-[#64748D] border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>বাংলা (Bangla)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          language === 'en'
                            ? 'bg-[#EEF2FF] text-[#2B47EE] border-[#2B47EE] shadow-2xs'
                            : 'bg-white text-[#64748D] border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>English</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isStarting}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2B47EE] to-[#7C3AED] hover:from-[#203CD4] hover:to-[#6D28D9] text-white text-xs sm:text-sm font-black transition-all shadow-[0_4px_16px_rgba(43,71,238,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
                    >
                      {isStarting ? (
                        <span>কানেক্ট হচ্ছে...</span>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                          <span>লাইভ চ্যাট শুরু করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="text-center pt-3 border-t border-slate-200/80">
                <span className="text-[11px] text-[#64748D] flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00B261]" />
                  <span>নিরাপদ ও এনক্রিপ্টেড লাইভ সাপোর্ট</span>
                </span>
              </div>
            </div>
          ) : (
            /* BODY: STEP 2 - ACTIVE CHAT INTERACTION */
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFD]/60">
                {messages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#64748D] space-y-2">
                    <Clock className="w-6 h-6 mx-auto text-[#2B47EE] animate-spin" />
                    <p>সাপোর্ট প্রতিনিধির সাথে কানেক্ট হচ্ছে...</p>
                  </div>
                ) : (
                  messages.map((msg, mIdx) => {
                    const isClient = msg.sender === 'client';
                    return (
                      <div
                        key={msg.id ? `${msg.id}-${mIdx}` : `fl-msg-${mIdx}`}
                        className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                            isClient
                              ? 'bg-gradient-to-r from-[#2B47EE] to-[#3B28CC] text-white rounded-br-xs'
                              : 'bg-white border border-[#E5EDF5] text-[#0D253D] rounded-bl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] font-mono mt-1 px-1">
                          {msg.timestamp || 'এখন'}
                        </span>
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {isAgentTyping && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-xs text-[#64748D] w-fit animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#2B47EE] animate-ping" />
                    <span>এজেন্ট রিপ্লাই টাইপ করছেন...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form 
                onSubmit={handleSendMessage}
                className="p-3 border-t border-[#E5EDF5] bg-white flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="আপনার মেসেজ লিখুন..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-slate-200 text-xs sm:text-sm text-[#0D253D] placeholder-[#94A3B8] focus:outline-none focus:border-[#2B47EE] focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="w-10 h-10 rounded-xl bg-[#2B47EE] hover:bg-[#203CD4] active:bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 5-Minute Rotating Security Code Modal (Requirement 13) */}
      <ClientSecurityCodeModal
        isOpen={showSecurityCodeModal}
        onClose={() => setShowSecurityCodeModal(false)}
        onGoToLogin={() => {
          setShowSecurityCodeModal(false);
          setIsOpen(false);
          window.location.href = '/account';
        }}
      />
    </>
  );
}
