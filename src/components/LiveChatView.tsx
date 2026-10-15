import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, ShieldCheck, Clock, CheckCheck, 
  RotateCcw, X, Phone, MessageCircle, AlertCircle, Sparkles,
  User, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { 
  apiActivateChat, 
  apiSendChatMessage, 
  apiEndChat, 
  apiReopenChat, 
  subscribeToSingleChatThread, 
  apiGetLiveChatEnabled,
  normalizePhone 
} from '../utils/api';
import { SupportChatThread, SupportChatMessage, UserAccount } from '../types';
import { getClientSecurityCode, getSecurityCodeRemainingSeconds, formatRemainingTime } from '../utils/securityCode';
import { useLanguage } from '../utils/LanguageContext';
import { realtimeManager } from '../utils/realtime';
import ThreeCanvas3D from './ThreeCanvas3D';

export default function LiveChatView() {
  const { t, language } = useLanguage();

  // Admin status (online / offline)
  const [isLiveOnline, setIsLiveOnline] = useState<boolean>(true);

  // Client Identification State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('bongoweb_user') || sessionStorage.getItem('bongoweb_user');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return null;
  });

  const [clientName, setClientName] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('bongoweb_user') || sessionStorage.getItem('bongoweb_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) return u.name;
      }
      const session = localStorage.getItem('bongoweb_chat_active_session');
      if (session) {
        const s = JSON.parse(session);
        if (s.name) return s.name;
      }
    } catch (_) {}
    return '';
  });

  const [clientPhone, setClientPhone] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('bongoweb_user') || sessionStorage.getItem('bongoweb_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.phone) return u.phone;
      }
      const session = localStorage.getItem('bongoweb_chat_active_session');
      if (session) {
        const s = JSON.parse(session);
        if (s.phone) return s.phone;
      }
    } catch (_) {}
    return '';
  });

  // Active Chat State
  const [isChatActive, setIsChatActive] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem('bongoweb_chat_active_session');
      return !!session;
    } catch (_) {}
    return false;
  });

  const [thread, setThread] = useState<SupportChatThread | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 5-Min Rotating Security Code Countdown
  const [codeCountdown, setCodeCountdown] = useState<number>(getSecurityCodeRemainingSeconds());
  const [currentSecurityCode, setCurrentSecurityCode] = useState<string>('');

  // Chat stream auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  // Quick inquiry topics
  const quickQuestions = [
    t('৳১,৯৯০ ওয়েবসাইট প্যাকেজে কী কী সুবিধা আছে?', 'What is included in the ৳1,990 website package?'),
    t('২৪ ঘণ্টার মধ্যে ওয়েবসাইট কীভাবে ডেলিভারি পাব?', 'How do I receive 24-hour express delivery?'),
    t('বিকাশ ও নগদ পেমেন্ট নিশ্চিত করার নিয়ম কী?', 'How do I confirm bKash or Nagad payment?'),
    t('আমার কাস্টম ডোমেন ও হোস্টিং কীভাবে যুক্ত হবে?', 'How will my custom domain & hosting be connected?')
  ];

  // 1. Monitor Live Chat Online/Offline status
  useEffect(() => {
    apiGetLiveChatEnabled().then(enabled => setIsLiveOnline(enabled));

    const unsubscribe = realtimeManager.on('system:chat_status', (data: { enabled: boolean }) => {
      if (data && typeof data.enabled === 'boolean') {
        setIsLiveOnline(data.enabled);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // 2. Synchronize rotating security code every second
  useEffect(() => {
    if (!clientPhone) return;
    setCurrentSecurityCode(getClientSecurityCode(clientPhone));

    const interval = setInterval(() => {
      const remaining = getSecurityCodeRemainingSeconds();
      setCodeCountdown(remaining);
      if (remaining === 300 || remaining === 0) {
        setCurrentSecurityCode(getClientSecurityCode(clientPhone));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [clientPhone]);

  // 3. Subscribe to real-time chat messages when phone is active
  useEffect(() => {
    const cleanPhone = normalizePhone(clientPhone);
    if (!cleanPhone || !isChatActive) return;

    // Direct Firestore real-time listener
    const unsubscribe = subscribeToSingleChatThread(cleanPhone, (incomingThread) => {
      if (incomingThread) {
        setThread(incomingThread);
        // If thread is officially open, maintain active state
        if (!incomingThread.isClosed) {
          setIsChatActive(true);
        }
      }
    });

    // Also fetch current thread from local server cache
    fetch(`/api/chat/thread/${encodeURIComponent(cleanPhone)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && !thread) {
          setThread(data);
        }
      })
      .catch(() => {});

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [clientPhone, isChatActive]);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thread?.messages]);

  // Start / Initiate direct chat with admin
  const handleStartChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanPhone = normalizePhone(clientPhone);
    const cleanName = clientName.trim();

    if (!cleanName) {
      setErrorMessage(t('অনুগ্রহ করে আপনার নাম লিখুন', 'Please enter your name'));
      return;
    }

    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage(t('সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 017xxxxxxxx)', 'Please provide a valid phone number'));
      return;
    }

    setInitialLoading(true);

    try {
      const welcomeText = language === 'bn'
        ? `স্বাগতম ${cleanName}! BongoWeb সরাসরি অ্যাডমিন ও ইঞ্জিনিয়ারিং সাপোর্ট সেন্টারে আপনাকে স্বাগতম। আপনার যেকোনো প্রশ্ন বা চাহিদার কথা লিখুন, আমাদের টিম সরাসরি উত্তর দিচ্ছেন।`
        : `Welcome ${cleanName}! You are directly connected with BongoWeb Engineering Support. Please state your query, we are here to assist you.`;

      const newThread = await apiActivateChat({
        name: cleanName,
        phone: cleanPhone,
        language: language as 'bn' | 'en',
        welcomeText
      });

      setThread(newThread);
      setIsChatActive(true);
      localStorage.setItem('bongoweb_chat_active_session', JSON.stringify({
        name: cleanName,
        phone: cleanPhone,
        language
      }));
    } catch (err) {
      console.error('Failed to start chat:', err);
      setErrorMessage(t('চ্যাট চালু করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'Failed to connect. Please try again.'));
    } finally {
      setInitialLoading(false);
    }
  };

  // Send message to admin panel
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    const cleanPhone = normalizePhone(clientPhone);

    if (!text || !cleanPhone || isSending) return;

    setIsSending(true);
    setInputMessage('');

    try {
      const newMsg: SupportChatMessage = {
        id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: 'client',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Optimistic update in UI
      setThread(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          lastMessage: text,
          lastUpdated: 'এখনই',
          isClosed: false,
          messages: [...(prev.messages || []), newMsg]
        };
      });

      await apiSendChatMessage({
        phone: cleanPhone,
        sender: 'client',
        text,
        name: clientName,
        message: newMsg
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // End chat session
  const handleEndChat = async () => {
    if (!clientPhone) return;
    const confirmClose = window.confirm(
      t('আপনি কি নিশ্চিত যে বর্তমান চ্যাট সেশন সমাপ্ত করতে চান?', 'Are you sure you want to end this chat session?')
    );
    if (!confirmClose) return;

    try {
      await apiEndChat(clientPhone, !!currentUser);
      localStorage.removeItem('bongoweb_chat_active_session');
      setIsChatActive(false);
      setThread(null);
    } catch (err) {
      console.error('Failed to end chat:', err);
    }
  };

  // Reopen closed chat
  const handleReopen = async () => {
    if (!clientPhone) return;
    try {
      await apiReopenChat(clientPhone);
      setIsChatActive(true);
      if (thread) {
        setThread({
          ...thread,
          isClosed: false,
          isArchived: false,
          expiresAt: Date.now() + 5 * 60 * 1000
        });
      }
    } catch (err) {
      console.error('Failed to reopen chat:', err);
    }
  };

  const cleanMsgs = (() => {
    const msgs = thread?.messages || [];
    const seen = new Set<string>();
    return msgs.filter(m => {
      if (!m || !m.text) return false;
      const key = `${m.sender}:${m.text.trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  const remainingMinutes = thread?.expiresAt 
    ? Math.max(0, Math.floor((thread.expiresAt - Date.now()) / 1000 / 60))
    : 5;

  return (
    <div className="relative w-full max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10 pb-28 lg:pb-12 font-sans animate-fadeIn text-[#f5f5f7]">
      {/* 3D Ambient Universe Background */}
      <ThreeCanvas3D intensity={0.8} />

      {/* Main Content: Chat View or Start Form */}
      {!isChatActive ? (
        /* STEP 1: INITIAL CHAT REGISTRATION / START FORM */
        <div className="bg-[#0e0e12]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-dark-card max-w-xl lg:max-w-2xl mx-auto text-[#f5f5f7]">
          <div className="w-12 h-12 rounded-xl bg-white/[0.05] text-[#3b5bff] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#f5f5f7]">
              {t('অ্যাডমিনের সাথে সরাসরি চ্যাট শুরু করুন', 'Start Direct Chat with Support Admin')}
            </h2>
            <p className="text-xs text-[#a1a1b0] mt-1.5 font-normal">
              {t('তাৎক্ষণিক প্রশ্নের উত্তর ও প্রযুক্তিগত সহায়তার জন্য আপনার তথ্য দিন', 'Provide your information for immediate support')}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleStartChat} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#a1a1b0] mb-1.5">
                {t('আপনার নাম', 'Your Full Name')} <span className="text-[#3b5bff]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={t('যেমন: মো: তানভীর আহমেদ', 'e.g. Tanvir Ahmed')}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm text-[#f5f5f7] placeholder-[#71717a] focus:outline-none focus:border-[#3b5bff] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#a1a1b0] mb-1.5">
                {t('মোবাইল / হোয়াটসঅ্যাপ নম্বর', 'Mobile / WhatsApp Number')} <span className="text-[#3b5bff]">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm text-[#f5f5f7] placeholder-[#71717a] font-mono focus:outline-none focus:border-[#3b5bff] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={initialLoading}
              className="w-full mt-4 py-3 px-6 rounded-full bg-[#3b5bff] hover:bg-[#324ecc] active:scale-[0.98] text-white text-xs sm:text-sm font-medium shadow-lg shadow-[#3b5bff]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {initialLoading ? (
                <span>{t('সংযুক্ত হচ্ছে...', 'Connecting to Support...')}</span>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('সরাসরি চ্যাট শুরু করুন', 'Start Direct Chat Now')}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* STEP 2: ACTIVE CONVERSATION INTERFACE */
        <div className="bg-[#0e0e12] border border-white/[0.08] rounded-2xl shadow-dark-card overflow-hidden flex flex-col h-[75vh] min-h-[560px] max-h-[820px] text-[#f5f5f7]">
          {/* Active Chat Top Bar */}
          <div className="p-3.5 sm:p-4 bg-[#14141a]/80 border-b border-white/[0.08] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[#3b5bff] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  BW
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0e0e12]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-semibold text-[#f5f5f7]">
                    {t('BongoWeb টেকনিক্যাল সাপোর্ট', 'BongoWeb Technical Support')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
                    {t('অফিসিয়াল', 'Official')}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#a1a1b0] flex items-center gap-1 mt-0.5 font-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('অ্যাডমিন প্যানেলে সরাসরি কানেক্টেড', 'Directly connected with admin panel')}</span>
                </p>
              </div>
            </div>

            {/* Top Bar Actions: Security Code Badge & Timer */}
            <div className="flex items-center gap-2">
              {/* Synchronized 5-Min Rotating Security Code */}
              {clientPhone && (
                <div 
                  className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#3b5bff] text-[11px] font-medium flex items-center gap-1.5 select-none"
                  title={t('আপনার ৫-মিনিটের সিকিউরিটি কোড (অ্যাডমিন প্যানেলের সাথে সিঙ্ক করা)', 'Your 5-min synchronized security code')}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3b5bff]" />
                  <span className="text-[10px] text-[#a1a1b0] hidden md:inline">
                    {t('সিকিউরিটি কোড:', 'Security Code:')}
                  </span>
                  <span className="font-mono font-semibold text-xs text-[#f5f5f7] px-1.5 py-0.2 bg-white/[0.06] rounded border border-white/[0.1]">
                    {currentSecurityCode || getClientSecurityCode(clientPhone)}
                  </span>
                  <span className="text-[10px] font-mono text-[#71717a]">
                    ({formatRemainingTime(codeCountdown)})
                  </span>
                </div>
              )}

              {/* Inactivity Session Remaining */}
              <div 
                className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#a1a1b0] text-[11px] font-mono font-medium flex items-center gap-1"
                title={t('সেশনের মেয়াদ', 'Session expiry countdown')}
              >
                <Clock className="w-3 h-3 text-[#3b5bff]" />
                <span>{remainingMinutes} {t('মি.', 'min')}</span>
              </div>

              {/* End Chat Button */}
              <button
                type="button"
                onClick={handleEndChat}
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                title={t('চ্যাট সমাপ্ত করুন', 'End chat session')}
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('সমাপ্ত', 'Close')}</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div 
            ref={chatScrollContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#09090b]"
          >
            {/* Security Verification Banner */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-[#a1a1b0] flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3b5bff] shrink-0" />
                <span className="text-[11px] leading-relaxed">
                  {t(
                    'আপনার কথোপকথন সরাসরি সুরক্ষিত ও এনক্রিপ্টেড। অ্যাডমিন প্যানেল থেকে সিনিয়র ইঞ্জিনিয়ার উত্তর দিচ্ছেন।',
                    'Your conversation is private and synchronized directly with BongoWeb administrators.'
                  )}
                </span>
              </div>
            </div>

            {/* Closed Thread Notice */}
            {thread && thread.isClosed && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fadeIn">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('এই চ্যাট সেশনটি সমাপ্ত করা হয়েছে।', 'This support chat session has ended.')}</span>
                </div>
                <button
                  type="button"
                  onClick={handleReopen}
                  className="px-3.5 py-1.5 rounded-full bg-[#3b5bff] hover:bg-[#324ecc] text-white font-medium text-xs flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('পুনরায় চালু করুন', 'Reopen Chat')}</span>
                </button>
              </div>
            )}

            {/* Messages */}
            {cleanMsgs.map((msg, idx) => {
              const isAdmin = msg.sender === 'admin';

              return (
                <div
                  key={msg.id ? `${msg.id}-${idx}` : `msg-${idx}`}
                  className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} max-w-full`}
                >
                  {/* Sender Header Badge */}
                  <div className={`flex items-center gap-1 mb-1 px-1 text-[11px] font-medium ${
                    isAdmin ? 'text-[#3b5bff]' : 'text-[#71717a]'
                  }`}>
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3b5bff]" />
                        <span>BongoWeb সাপোর্ট ইঞ্জিনিয়ার</span>
                      </>
                    ) : (
                      <>
                        <span>{clientName || t('আপনি (গ্রাহক)', 'You')}</span>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] sm:max-w-[78%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isAdmin
                        ? 'bg-[#14141a] border border-white/[0.08] text-[#f5f5f7] rounded-tl-xs shadow-dark-card'
                        : 'bg-[#3b5bff] text-white rounded-tr-xs shadow-md shadow-[#3b5bff]/20'
                    }`}
                  >
                    <p className="whitespace-pre-wrap select-text font-sans">{msg.text}</p>
                  </div>

                  {/* Message Timestamp */}
                  <span className={`text-[10px] font-mono mt-1 px-1 flex items-center gap-1 text-[#71717a]`}>
                    <span>{msg.timestamp}</span>
                    {!isAdmin && <CheckCheck className="w-3 h-3 text-[#3b5bff]" />}
                  </span>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 sm:px-4 py-2 border-t border-white/[0.06] bg-[#0e0e12] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] text-[#71717a] font-medium shrink-0">
              {t('দ্রুত প্রশ্ন:', 'Suggestions:')}
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={thread?.isClosed || isSending}
                className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] hover:text-white text-[#a1a1b0] text-[10px] font-medium border border-white/[0.06] transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box Footer */}
          <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#0e0e12] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                disabled={thread?.isClosed || isSending}
                placeholder={
                  thread?.isClosed
                    ? t('চ্যাট বন্ধ রয়েছে। নতুন চ্যাট চালু করুন...', 'Chat is closed. Reopen to continue...')
                    : t('আপনার বার্তা লিখুন (Enter চাপুন)...', 'Type your message (Press Enter to send)...')
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 sm:py-3 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm text-[#f5f5f7] placeholder-[#71717a] focus:outline-none focus:border-[#3b5bff] transition-all disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || thread?.isClosed || isSending}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#3b5bff] hover:bg-[#324ecc] text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#3b5bff]/25 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{t('পাঠান', 'Send')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Emergency WhatsApp & Direct Call Footer */}
      <div className="mt-5 text-center text-xs text-[#71717a] flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://wa.me/8801819847250"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{t('হোয়াটসঅ্যাপে মেসেজ পাঠান', 'Chat on WhatsApp')}</span>
        </a>

        <span className="text-[#52525b]">•</span>

        <a
          href="tel:+8801819847250"
          className="inline-flex items-center gap-1.5 text-[#3b5bff] hover:text-[#5d77ff] font-medium transition-colors font-mono"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>+880 1819-847250</span>
        </a>
      </div>
    </div>
  );
}
