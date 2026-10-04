import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Headphones, CheckCircle2, User, Sparkles, 
  CheckCheck, LogOut, Clock, Plus, AlertCircle, ArrowRight, X,
  ShieldCheck, RefreshCw, MessageSquare, Ticket, RotateCcw
} from 'lucide-react';
import { SupportChatMessage, UserAccount } from '../types';
import { 
  apiActivateChat, apiSendChatMessage, apiEndChat, apiReopenChat, subscribeToSingleChatThread, 
  normalizePhone, apiGetLiveChatEnabled, apiRequestPasswordReset
} from '../utils/api';
import { realtimeManager } from '../utils/realtime';

// Helper to guarantee 100% zero message duplication
const deduplicateChatMessages = (msgs: SupportChatMessage[]): SupportChatMessage[] => {
  if (!Array.isArray(msgs)) return [];
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();
  const result: SupportChatMessage[] = [];

  for (const m of msgs) {
    if (!m || !m.text) continue;
    const contentKey = `${m.sender}:${m.text.trim()}`;
    if (seenIds.has(m.id) || seenContent.has(contentKey)) {
      continue;
    }
    seenIds.add(m.id);
    seenContent.add(contentKey);
    result.push(m);
  }
  return result;
};

export default function LiveChatView() {
  // Live Chat System Toggle (Admin On/Off)
  const [isLiveChatOnline, setIsLiveChatOnline] = useState<boolean>(true);

  // Ticket Submission State (When Chat is OFF)
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState('');

  // Onboarding / Activation State
  const [isActivated, setIsActivated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'bn' | 'en'>('bn');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [onboardingError, setOnboardingError] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  // Active Chat State
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inactivity Timer State (calculated from expiresAt timestamp)
  const [timeLeft, setTimeLeft] = useState(300); // in seconds
  const [isExpired, setIsExpired] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [expiresTimestamp, setExpiresTimestamp] = useState<number>(Date.now() + 300000);

  // Check existing session & live chat status on mount
  useEffect(() => {
    // 1. Check if Live Chat is enabled by Admin
    apiGetLiveChatEnabled().then((status) => {
      setIsLiveChatOnline(status);
    });

    const unsubSystem = realtimeManager.on('system:chat_status', (payload) => {
      if (typeof payload.enabled === 'boolean') {
        setIsLiveChatOnline(payload.enabled);
      }
    });

    try {
      const activeSession = localStorage.getItem('bongoweb_chat_active_session');
      if (activeSession) {
        const session = JSON.parse(activeSession);
        setUserName(session.name || '');
        setUserPhone(session.phone || '');
        setSelectedLanguage(session.language || 'bn');
        setIsActivated(true);
        fetchCurrentThread(session.phone);
      } else {
        // Pre-fill from logged in user if available
        const storedUser = localStorage.getItem('bongoweb_user');
        if (storedUser) {
          const u: UserAccount = JSON.parse(storedUser);
          if (u.name) setUserName(u.name);
          if (u.phone) setUserPhone(u.phone);
        }
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      unsubSystem();
    };
  }, []);

  // Fetch thread from server
  const fetchCurrentThread = async (phone: string) => {
    try {
      const res = await fetch(`/api/chat/thread/${encodeURIComponent(phone)}`);
      if (res.ok) {
        const thread = await res.json();
        if (thread) {
          if (thread.messages && thread.messages.length > 0) {
            setMessages((prev) => deduplicateChatMessages([...prev, ...thread.messages]));
          }
          if (thread.isClosed) {
            setIsExpired(true);
            return;
          }
          if (thread.expiresAt) {
            setExpiresTimestamp(thread.expiresAt);
            const remaining = Math.max(0, Math.floor((thread.expiresAt - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining <= 0) {
              setIsExpired(true);
            }
          }
        }
      }
    } catch (_) {}
  };

  // Real-time Event Listener for instant zero-loss messages from Admin
  useEffect(() => {
    if (!isActivated || !userPhone) return;

    const unsubs = [
      realtimeManager.on('chat:message', (payload) => {
        if (!payload.message) return;
        const targetPhone = normalizePhone(payload.phone);
        const currentPhone = normalizePhone(userPhone);

        if (targetPhone === currentPhone) {
          const newMsg: SupportChatMessage = payload.message;
          // If the message is from client, client already has it in local state optimistically, so skip echo
          if (newMsg.sender === 'client') return;

          setMessages((prev) => deduplicateChatMessages([...prev, newMsg]));

          // Reset inactivity timer when admin message arrives
          const newExpiry = Date.now() + 5 * 60 * 1000;
          setExpiresTimestamp(newExpiry);
          setTimeLeft(300);
          setIsExpired(false);
        }
      }),

      realtimeManager.on('chat:extended', (payload) => {
        const targetPhone = normalizePhone(payload.phone);
        const currentPhone = normalizePhone(userPhone);
        if (targetPhone === currentPhone && payload.expiresAt) {
          setExpiresTimestamp(payload.expiresAt);
          const remaining = Math.max(0, Math.floor((payload.expiresAt - Date.now()) / 1000));
          setTimeLeft(remaining);
          setIsExpired(false);
        }
      }),

      realtimeManager.on('chat:ended', (payload) => {
        const targetPhone = normalizePhone(payload.phone);
        const currentPhone = normalizePhone(userPhone);
        if (targetPhone === currentPhone) {
          setIsExpired(true);
        }
      })
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [isActivated, userPhone]);

  // Cloud Firestore Real-time Single Thread Listener (Guarantees direct real-time sync across devices)
  useEffect(() => {
    if (!isActivated || !userPhone) return;

    const unsub = subscribeToSingleChatThread(userPhone, (thread) => {
      if (thread) {
        if (Array.isArray(thread.messages) && thread.messages.length > 0) {
          setMessages((prev) => deduplicateChatMessages([...prev, ...thread.messages]));
        }
        if (thread.isClosed) {
          setIsExpired(true);
          return;
        }
        if (thread.expiresAt) {
          setExpiresTimestamp(thread.expiresAt);
          const remaining = Math.max(0, Math.floor((thread.expiresAt - Date.now()) / 1000));
          setTimeLeft(remaining);
          if (remaining <= 0) {
            setIsExpired(true);
          } else {
            setIsExpired(false);
          }
        }
      }
    });

    return () => unsub();
  }, [isActivated, userPhone]);

  // Real-time server sync polling every 2 seconds (Secondary fail-safe)
  useEffect(() => {
    if (!isActivated || !userPhone || isExpired) return;

    const syncInterval = setInterval(() => {
      fetchCurrentThread(userPhone);
    }, 2000);

    return () => clearInterval(syncInterval);
  }, [isActivated, userPhone, isExpired]);

  // Countdown timer effect
  useEffect(() => {
    if (!isActivated || isExpired) return;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresTimestamp - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActivated, isExpired, expiresTimestamp]);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Onboarding Submit (Name + Phone + Language -> Continue)
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingError('');

    const cleanName = userName.trim();
    const cleanPhone = userPhone.trim();

    if (!cleanName) {
      setOnboardingError(selectedLanguage === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your full name.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setOnboardingError(selectedLanguage === 'bn' ? 'অনুগ্রহ করে সঠিক মোবাইল নম্বর লিখুন।' : 'Please enter a valid phone number.');
      return;
    }

    setIsStarting(true);
    try {
      const welcomeText = selectedLanguage === 'bn'
        ? `স্বাগতম ${cleanName}! BongoWeb লাইভ সাপোর্ট টিম আপনার সাথে যুক্ত হয়েছেন। আপনার ওয়েবসাইট, ডোমেইন বা যেকোনো প্রশ্ন এখানে লিখুন:`
        : `Welcome ${cleanName}! A BongoWeb live support specialist has joined the chat. How can we help you today?`;

      const thread = await apiActivateChat({
        name: cleanName,
        phone: cleanPhone,
        language: selectedLanguage,
        welcomeText
      });

      if (thread && thread.messages) {
        setMessages(deduplicateChatMessages(thread.messages));
      } else {
        setMessages([{
          id: `init-${Date.now()}`,
          sender: 'admin',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }

      const expiry = Date.now() + 5 * 60 * 1000;
      setExpiresTimestamp(expiry);
      setTimeLeft(300);
      setIsExpired(false);
      setIsActivated(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStarting(false);
    }
  };

  // Client Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputVal.trim();
    if (!text || isExpired) return;

    setInputVal('');

    // Reset inactivity timer to 5 minutes on client response
    const newExpiry = Date.now() + 5 * 60 * 1000;
    setExpiresTimestamp(newExpiry);
    setTimeLeft(300);

    const msgId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newMsg: SupportChatMessage = {
      id: msgId,
      sender: 'client',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => deduplicateChatMessages([...prev, newMsg]));

    try {
      await apiSendChatMessage({
        phone: userPhone,
        sender: 'client',
        text,
        name: userName,
        message: newMsg
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Exit Chat Action (Confirm modal -> OK)
  const handleConfirmExit = async () => {
    try {
      await apiEndChat(userPhone);
    } catch (_) {}

    localStorage.removeItem('bongoweb_chat_active_session');
    setIsActivated(false);
    setShowExitConfirm(false);
    setMessages([]);
    setTimeLeft(300);
    setIsExpired(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Ticket Submit (When Live Chat is OFF)
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardingError('');

    const cleanName = userName.trim();
    const cleanPhone = userPhone.trim();
    const cleanDesc = ticketDescription.trim();

    if (!cleanName) {
      setOnboardingError(selectedLanguage === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setOnboardingError(selectedLanguage === 'bn' ? 'অনুগ্রহ করে সঠিক মোবাইল নম্বর লিখুন।' : 'Please enter a valid phone number.');
      return;
    }
    if (!cleanDesc) {
      setOnboardingError(selectedLanguage === 'bn' ? 'আপনার সমস্যার বিবরণ বা প্রশ্ন লিখুন।' : 'Please describe your inquiry.');
      return;
    }

    const tktId = `#TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicketId(tktId);

    // Save ticket to local storage and send admin notification
    try {
      const existing = localStorage.getItem('bongoweb_tickets');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift({
        id: tktId,
        name: cleanName,
        phone: cleanPhone,
        description: cleanDesc,
        createdAt: new Date().toLocaleString('bn-BD'),
        status: 'open'
      });
      localStorage.setItem('bongoweb_tickets', JSON.stringify(list));

      // Also trigger a reset request / support chat entry
      await apiRequestPasswordReset({
        id: tktId,
        phone: cleanPhone,
        requestedAt: new Date().toLocaleString('bn-BD'),
        status: 'pending'
      });
    } catch (_) {}

    setTicketSubmitted(true);
  };

  // ==========================================
  // VIEW 1: STEP-BY-STEP ONBOARDING / TICKET FORM
  // ==========================================
  if (!isActivated) {
    if (ticketSubmitted) {
      return (
        <div className="w-full max-w-lg mx-auto px-4 py-8 animate-fadeIn font-sans">
          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-md text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00B261]/10 text-[#00B261] flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-black font-mono inline-block">
              {submittedTicketId}
            </span>
            <h2 className="text-xl font-black text-[#0D253D]">
              সাপোর্ট টিকিট সফলভাবে জমা হয়েছে
            </h2>
            <p className="text-xs text-[#64748D] leading-relaxed max-w-sm mx-auto">
              আমাদের টিম আপনার প্রদত্ত মোবাইল নম্বরে ({userPhone}) অতি দ্রুত যোগাযোগ করবে এবং সহায়তা প্রদান করবে।
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setTicketSubmitted(false);
                  setTicketDescription('');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] transition-all cursor-pointer shadow-xs"
              >
                নতুন টিকিট সাবমিট করুন
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-lg mx-auto px-4 py-6 sm:py-10 animate-fadeIn font-sans">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-md">
          {/* Header: Strictly BongoWeb Live Support (২৪/৭) without excessive subtext */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3 shadow-inner">
              <Headphones className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0D253D] tracking-tight">
              BongoWeb Live Support (২৪/৭)
            </h2>
            {!isLiveChatOnline && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E53935]/10 text-[#E53935] text-xs font-bold border border-[#E53935]/20">
                <span className="w-2 h-2 rounded-full bg-[#E53935] animate-pulse" />
                <span>লাইভ চ্যাট বর্তমানে অফলাইন (টিকিট সাবমিট করুন)</span>
              </div>
            )}
          </div>

          {/* Form: If Live Chat is OFF -> Ticket Submit; If ON -> Start Live Chat */}
          <form onSubmit={isLiveChatOnline ? handleStartChat : handleTicketSubmit} className="space-y-4">
            {onboardingError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{onboardingError}</span>
              </div>
            )}

            {/* 1. Name */}
            <div>
              <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                ১. আপনার নাম (Your Full Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="যেমন: মোঃ সাকিব আহমেদ"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5EDF5] text-sm focus:outline-none focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 bg-[#F8FAFD]"
                required
              />
            </div>

            {/* 2. Phone Number */}
            <div>
              <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                ২. মোবাইল নম্বর (Mobile Phone Number) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="যেমন: 01712345678"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5EDF5] text-sm focus:outline-none focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 bg-[#F8FAFD]"
                required
              />
            </div>

            {/* If Chat is ON -> Language Selector */}
            {isLiveChatOnline ? (
              <div>
                <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                  ৩. চ্যাটের ভাষা নির্বাচন করুন (Select Language) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedLanguage('bn')}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedLanguage === 'bn'
                        ? 'border-[#533AFD] bg-[#533AFD]/5 text-[#533AFD]'
                        : 'border-[#E5EDF5] bg-[#FFFFFF] text-[#64748D] hover:border-[#533AFD]/30'
                    }`}
                  >
                    <span className="text-base">🇧🇩</span>
                    <span>বাংলা (Bangla)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLanguage('en')}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedLanguage === 'en'
                        ? 'border-[#533AFD] bg-[#533AFD]/5 text-[#533AFD]'
                        : 'border-[#E5EDF5] bg-[#FFFFFF] text-[#64748D] hover:border-[#533AFD]/30'
                    }`}
                  >
                    <span className="text-base">🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If Chat is OFF -> Issue Details Input */
              <div>
                <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                  ৩. আপনার সমস্যা বা প্রশ্ন লিখুন (Issue Details) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="আপনার ওয়েবসাইট বা যেকোনো সমস্যা বিস্তারিত লিখুন..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 bg-[#F8FAFD]"
                  required
                />
              </div>
            )}

            {/* 4. Action Button */}
            <div className="pt-2">
              {isLiveChatOnline ? (
                <button
                  type="submit"
                  disabled={isStarting}
                  className="w-full py-3 px-4 rounded-xl bg-[#533AFD] hover:bg-[#4329d9] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(83,58,253,0.3)] cursor-pointer disabled:opacity-50"
                >
                  {isStarting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>সংযোগ করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>লাইভ চ্যাট শুরু করুন (Start Live Chat)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#00B261] hover:bg-[#009E56] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(0,178,97,0.3)] cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>সাবমিট সাপোর্ট টিকিট (Submit Ticket)</span>
                </button>
              )}
            </div>
          </form>

          {/* Clean Assurance */}
          <div className="mt-4 pt-4 border-t border-[#E5EDF5] text-center">
            <span className="text-[11px] text-[#64748D] inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>২৪/৭ অফিসিয়াল কাস্টমার সাপোর্ট সার্ভিস</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVATED LIVE CHAT WINDOW
  // ==========================================
  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-2 sm:py-4 flex flex-col h-[calc(100vh-140px)] min-h-[500px] font-sans">
      {/* 1. Slim Header Bar */}
      <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-t-2xl p-3 sm:p-4 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-[#533AFD] text-white flex items-center justify-center font-bold text-xs">
              <Headphones className="w-4 h-4" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0D253D]">BongoWeb Support</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                Online
              </span>
            </div>
            <p className="text-[11px] text-[#64748D]">
              {userName} ({userPhone})
            </p>
          </div>
        </div>

        {/* Right Actions: Clean Status & Exit Button (5-min timer is strictly Admin-only) */}
        <div className="flex items-center gap-2">
          {/* Client only sees that they are actively chatting */}
          <div 
            className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5"
            title="লাইভ সাপোর্ট সেশন সক্রিয়"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>লাইভ চ্যাট চলছে</span>
          </div>

          {/* Exit Chat Button */}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="চ্যাট থেকে বের হয়ে যান"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">বের হয়ে যান</span>
          </button>
        </div>
      </div>

      {/* 2. Messages Scroll Area */}
      <div className="flex-1 bg-[#F8FAFD] border-x border-[#E5EDF5] p-3 sm:p-4 overflow-y-auto space-y-3">
        {deduplicateChatMessages(messages).map((msg) => {
          const isClient = msg.sender === 'client';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isClient
                    ? 'bg-[#533AFD] text-white rounded-br-xs'
                    : 'bg-[#FFFFFF] text-[#0D253D] border border-[#E5EDF5] rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap select-text">{msg.text}</p>
                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    isClient ? 'text-white/70' : 'text-[#64748D]'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isClient && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* If chat closed by Admin or session ended */}
        {isExpired && (
          <div className="my-2 p-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#475569] font-medium">
              আপনার টেক্সট সমাপ্ত হয়েছে (Your text is over).
            </span>
            <button
              type="button"
              onClick={async () => {
                setIsExpired(false);
                const newExpiry = Date.now() + 5 * 60 * 1000;
                setExpiresTimestamp(newExpiry);
                setTimeLeft(300);
                try {
                  await apiReopenChat(userPhone);
                } catch (_) {}
              }}
              className="px-3 py-1.5 rounded-lg bg-[#533AFD] hover:bg-[#4329d9] text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিটেক্সট (Retext)</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Send Bar */}
      <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-b-2xl p-2.5 sm:p-3 shrink-0 shadow-xs">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isExpired}
            placeholder={
              isExpired
                ? 'চ্যাট সমাপ্ত হয়েছে'
                : selectedLanguage === 'bn'
                ? 'আপনার মেসেজ লিখুন...'
                : 'Type your message...'
            }
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5EDF5] text-xs sm:text-sm focus:outline-none focus:border-[#533AFD] bg-[#F8FAFD] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isExpired}
            className="w-10 h-10 rounded-xl bg-[#533AFD] text-white flex items-center justify-center hover:bg-[#4329d9] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 animate-scaleIn">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-center text-[#0D253D] mb-1">
              লাইভ চ্যাট সমাপ্ত করবেন?
            </h3>
            <p className="text-xs text-center text-[#64748D] mb-5">
              আপনি কি নিশ্চিতভাবে এই চ্যাট সেশনটি শেষ করতে চান?
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="py-2 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                হ্যাঁ, সমাপ্ত করুন (OK)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
