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
    <div className="w-full max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10 pb-28 lg:pb-12 font-sans animate-fadeIn">
      {/* Main Content: Chat View or Start Form */}
      {!isChatActive ? (
        /* STEP 1: INITIAL CHAT REGISTRATION / START FORM */
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.5)] max-w-xl lg:max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-950/90 to-slate-900 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-800/80 shadow-xs">
            <MessageSquare className="w-7 h-7 stroke-[2.2]" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-black text-white">
              {t('অ্যাডমিনের সাথে সরাসরি চ্যাট শুরু করুন', 'Start Direct Chat with Support Admin')}
            </h2>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleStartChat} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('আপনার নাম', 'Your Full Name')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={t('যেমন: মো: তানভীর আহমেদ', 'e.g. Tanvir Ahmed')}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-slate-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t('মোবাইল / হোয়াটসঅ্যাপ নম্বর', 'Mobile / WhatsApp Number')} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-400 font-mono focus:outline-none focus:border-purple-500 focus:bg-slate-900 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={initialLoading}
              className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6B46C1] via-[#7C3AED] to-[#5521B5] hover:from-[#5B21B6] hover:to-[#4C1D95] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
        <div className="bg-[#111827] border border-slate-800 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[75vh] min-h-[560px] max-h-[820px]">
          {/* Active Chat Top Bar */}
          <div className="p-3.5 sm:p-4 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6B46C1] to-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  BW
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white">
                    {t('BongoWeb টেকনিক্যাল সাপোর্ট', 'BongoWeb Technical Support')}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {t('অফিসিয়াল', 'Official')}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
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
                  className="px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-300 text-[11px] font-bold flex items-center gap-1.5 select-none"
                  title={t('আপনার ৫-মিনিটের সিকিউরিটি কোড (অ্যাডমিন প্যানেলের সাথে সিঙ্ক করা)', 'Your 5-min synchronized security code')}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] text-slate-400 hidden md:inline">
                    {t('সিকিউরিটি কোড:', 'Security Code:')}
                  </span>
                  <span className="font-mono font-black text-xs text-purple-300 px-1 bg-slate-900 rounded border border-slate-700">
                    {currentSecurityCode || getClientSecurityCode(clientPhone)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({formatRemainingTime(codeCountdown)})
                  </span>
                </div>
              )}

              {/* Inactivity Session Remaining */}
              <div 
                className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono font-bold flex items-center gap-1"
                title={t('সেশনের মেয়াদ', 'Session expiry countdown')}
              >
                <Clock className="w-3 h-3 text-purple-400" />
                <span>{remainingMinutes} {t('মি.', 'min')}</span>
              </div>

              {/* End Chat Button */}
              <button
                type="button"
                onClick={handleEndChat}
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
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
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0B0F19]"
          >
            {/* Security Verification Banner */}
            <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-800/80 text-xs text-purple-300 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
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
              <div className="p-3.5 rounded-2xl bg-amber-950/70 border border-amber-800 text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fadeIn">
                <div className="flex items-center gap-2 text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('এই চ্যাট সেশনটি সমাপ্ত করা হয়েছে।', 'This support chat session has ended.')}</span>
                </div>
                <button
                  type="button"
                  onClick={handleReopen}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6B46C1] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
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
                  <div className={`flex items-center gap-1 mb-1 px-1 text-[11px] font-bold ${
                    isAdmin ? 'text-purple-300' : 'text-slate-400'
                  }`}>
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
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
                        ? 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-xs shadow-xs'
                        : 'bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] text-white rounded-tr-xs shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap select-text font-sans">{msg.text}</p>
                  </div>

                  {/* Message Timestamp */}
                  <span className={`text-[10px] font-mono mt-1 px-1 flex items-center gap-1 ${
                    isAdmin ? 'text-slate-400' : 'text-slate-400'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {!isAdmin && <CheckCheck className="w-3 h-3 text-purple-400" />}
                  </span>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 sm:px-4 py-2 border-t border-slate-800 bg-[#0F172A] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] text-slate-400 font-bold shrink-0">
              {t('দ্রুত প্রশ্ন:', 'Suggestions:')}
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={thread?.isClosed || isSending}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-purple-300 text-[10px] font-medium border border-slate-700 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box Footer */}
          <div className="p-3 sm:p-4 border-t border-slate-800 bg-[#0F172A] shrink-0">
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
                className="flex-1 px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-slate-900 transition-all disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || thread?.isClosed || isSending}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6B46C1] active:bg-[#4C1D95] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{t('পাঠান', 'Send')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Emergency WhatsApp & Direct Call Footer */}
      <div className="mt-5 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-4">
        <a
          href="https://wa.me/8801819847250"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{t('হোয়াটসঅ্যাপে মেসেজ পাঠান', 'Chat on WhatsApp')}</span>
        </a>

        <span className="text-slate-300">•</span>

        <a
          href="tel:+8801819847250"
          className="inline-flex items-center gap-1.5 text-[#6B46C1] hover:text-[#5B21B6] font-bold transition-colors font-mono"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>+880 1819-847250</span>
        </a>
      </div>
    </div>
  );
}
