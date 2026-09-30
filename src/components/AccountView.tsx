import React, { useState, useEffect } from 'react';
import { 
  User, ShieldCheck, Key, Globe, FileText, 
  HelpCircle, CheckCircle2, Lock, ArrowRight, ArrowLeft, X, 
  Printer, AlertCircle, ShoppingBag, Eye, LogOut, PhoneCall, 
  Sparkles, Check, Server, Shield, Copy, Languages, CheckCheck
} from 'lucide-react';
import { ClientOrder, UserAccount, WebsiteDeliveryCredentials, PasswordResetRequest } from '../types';
import { apiRegisterUser, apiRequestPasswordReset, apiGetOrders, apiGetUsers, apiGetCredentials } from '../utils/api';
import { getClientSecurityCode, getSecurityCodeRemainingSeconds, formatRemainingTime } from '../utils/securityCode';

interface AccountViewProps {
  onGoToDashboard?: () => void;
  onOpenAdminPanel?: () => void;
}

export type AccountSubView = 'overview' | 'total-orders' | 'pending-orders' | 'privacy' | 'terms';

export default function AccountView({ onGoToDashboard, onOpenAdminPanel }: AccountViewProps) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<ClientOrder | null>(null);
  const [userCredentialsList, setUserCredentialsList] = useState<WebsiteDeliveryCredentials[]>([]);
  const [subView, setSubView] = useState<AccountSubView>('overview');

  // Security Code System State (Requirement 13)
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);
  const [securityCodeCopied, setSecurityCodeCopied] = useState(false);
  const [codeRemainingSec, setCodeRemainingSec] = useState<number>(getSecurityCodeRemainingSeconds());

  // Language Change State (Requirement 9)
  const [selectedLanguage, setSelectedLanguage] = useState<'bn' | 'en'>('bn');

  // Copy Feedback State
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Auth Screen State (when logged out)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regError, setRegError] = useState('');

  // Forgot Password / Request Call Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Subview routing parser
  const syncSubViewWithUrl = () => {
    const path = window.location.pathname;
    if (path === '/account/orders') {
      setSubView('total-orders');
    } else if (path === '/account/pending') {
      setSubView('pending-orders');
    } else if (path === '/account/privacy') {
      setSubView('privacy');
    } else if (path === '/account/terms') {
      setSubView('terms');
    } else {
      setSubView('overview');
    }
  };

  // Load state on mount
  useEffect(() => {
    loadUserData();
    syncSubViewWithUrl();

    const handlePopState = () => {
      syncSubViewWithUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Security code timer interval (Requirement 13)
  useEffect(() => {
    const timer = setInterval(() => {
      setCodeRemainingSec(getSecurityCodeRemainingSeconds());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Security code timer interval (Requirement 13)
  useEffect(() => {
    const timer = setInterval(() => {
      setCodeRemainingSec(getSecurityCodeRemainingSeconds());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navigateSubView = (target: AccountSubView) => {
    setSubView(target);
    let targetUrl = '/account';
    if (target === 'total-orders') targetUrl = '/account/orders';
    else if (target === 'pending-orders') targetUrl = '/account/pending';
    else if (target === 'privacy') targetUrl = '/account/privacy';
    else if (target === 'terms') targetUrl = '/account/terms';

    window.history.pushState({}, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem('bongoweb_user');
      if (storedUser) {
        const parsed: UserAccount = JSON.parse(storedUser);
        setCurrentUser(parsed);

        // Check delivered credentials for this user
        const credsList = await apiGetCredentials();
        const found = credsList.filter((c) => c.userPhone === parsed.phone);
        setUserCredentialsList(found);
      } else {
        setCurrentUser(null);
        setUserCredentialsList([]);
      }

      const allOrders = await apiGetOrders();
      setOrders(allOrders);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Logout (Requirement 2 & 9)
  const handleLogout = () => {
    localStorage.removeItem('bongoweb_user');
    sessionStorage.removeItem('bongoweb_user');
    setCurrentUser(null);
    setUserCredentialsList([]);
    setSubView('overview');
    window.history.pushState({}, '', '/account');
  };

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle Client Login (or Secret Admin Login)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanId = loginIdentifier.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // 1. Secret Admin Detection
    const adminConfigStr = localStorage.getItem('bongoweb_admin_config');
    const adminConfig = adminConfigStr ? JSON.parse(adminConfigStr) : {
      adminId: 'admin',
      adminEntryPassword: 'admin123',
      masterKey: 'MASTER-BONGO-2026'
    };

    if (
      (cleanId === adminConfig.adminId.toLowerCase() || cleanId === 'admin@bongoweb.xyz') &&
      cleanPass === adminConfig.adminEntryPassword
    ) {
      sessionStorage.setItem('bongoweb_admin_auth', 'true');
      if (onOpenAdminPanel) {
        onOpenAdminPanel();
      } else {
        window.location.href = '/admin';
      }
      return;
    }

    if (cleanPass === adminConfig.masterKey) {
      sessionStorage.setItem('bongoweb_admin_auth', 'true');
      if (onOpenAdminPanel) {
        onOpenAdminPanel();
      } else {
        window.location.href = '/admin';
      }
      return;
    }

    // 2. Client Login Check
    const storedUsers = await apiGetUsers();
    const matchingUser = storedUsers.find(
      (u) => (u.phone === cleanId || u.email.toLowerCase() === cleanId) && u.password === cleanPass
    );

    if (matchingUser) {
      localStorage.setItem('bongoweb_user', JSON.stringify(matchingUser));
      sessionStorage.setItem('bongoweb_user', JSON.stringify(matchingUser));
      setCurrentUser(matchingUser);
      loadUserData();
    } else {
      setLoginError('মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড সঠিক নয়!');
    }
  };

  // Handle Client Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('অনুগ্রহ করে নাম লিখুন।');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 10) {
      setRegError('সঠিক মোবাইল নম্বর প্রদান করুন।');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('সঠিক ইমেইল এড্রেস প্রদান করুন।');
      return;
    }
    if (!regPass || regPass.length < 4) {
      setRegError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }
    if (regPass !== regConfirmPass) {
      setRegError('পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    const newUser: UserAccount = {
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPass.trim(),
      registeredAt: new Date().toLocaleDateString('bn-BD')
    };

    const result = await apiRegisterUser(newUser);
    if (!result.success) {
      setRegError(result.error || 'নিবন্ধন করা সম্ভব হয়নি!');
      return;
    }

    setCurrentUser(newUser);
    loadUserData();
  };

  // Handle Forgot Password Request Call
  const handleRequestPasswordCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone.trim() || forgotPhone.length < 10) return;

    await apiRequestPasswordReset(forgotPhone.trim());
    setForgotSubmitted(true);
  };

  // Filter orders for the logged-in client
  const userOrders = currentUser 
    ? orders.filter((o) => o.phone === currentUser.phone || o.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];
  const pendingOrders = userOrders.filter((o) => o.status === 'pending');

  // ==========================================
  // VIEW: IF USER IS NOT LOGGED IN
  // ==========================================
  if (!currentUser) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-center items-center font-sans pb-28 pt-4 sm:pt-8 relative overflow-hidden animate-fadeIn">
        {/* Subtle Ambient Background Spotlight */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-gradient-to-tr from-[#533AFD]/[0.05] via-transparent to-[#00B261]/[0.03] rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-md sm:max-w-[480px] mx-auto px-4 w-full relative z-10 flex flex-col items-center">
          {/* Top Brand Context Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs text-[11px] font-bold text-[#533AFD] mb-3.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00B261] animate-pulse" />
            <span>BongoWeb Official Client Portal</span>
          </div>

          <div className="w-full bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E2E8F0] rounded-3xl p-6 sm:p-9 shadow-[0_20px_50px_-12px_rgba(13,37,61,0.1),0_4px_12px_-2px_rgba(13,37,61,0.05)] ring-1 ring-black/[0.02] relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#533AFD] via-[#7C3AED] to-[#00B261]" />

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#533AFD] to-[#694FFF] text-[#FFFFFF] flex items-center justify-center font-black mx-auto mb-3.5 text-xl shadow-[0_6px_20px_rgba(83,58,253,0.32)] ring-4 ring-[#533AFD]/10">
                BW
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0D253D] tracking-tight">
                ক্লায়েন্ট অ্যাকাউন্ট পোর্টাল
              </h1>
              <p className="text-xs sm:text-[13px] text-[#64748D] mt-1.5 leading-relaxed">
                আপনার ওয়েবসাইট ম্যানেজ করতে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।
              </p>
            </div>

            {/* Segmented Toggle Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl mb-6 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError('');
                }}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-[#FFFFFF] text-[#0D253D] font-black shadow-[0_2px_8px_rgba(13,37,61,0.06)] border border-[#E2E8F0]'
                    : 'text-[#64748D] hover:text-[#0D253D]'
                }`}
              >
                লগইন (Log In)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setRegError('');
                }}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#FFFFFF] text-[#0D253D] font-black shadow-[0_2px_8px_rgba(13,37,61,0.06)] border border-[#E2E8F0]'
                    : 'text-[#64748D] hover:text-[#0D253D]'
                }`}
              >
                রেজিস্টার (Register)
              </button>
            </div>

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-[#D8351E]/10 border border-[#D8351E]/20 text-[#D8351E] text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                    মোবাইল নম্বর অথবা ইমেইল এড্রেস
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="আপনার Mobile Number অথবা Email Address"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-xs sm:text-sm text-[#0D253D] placeholder-[#94A3B8] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#0D253D]">
                      অ্যাকাউন্ট পাসওয়ার্ড
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotSubmitted(false);
                      }}
                      className="text-[11px] text-[#533AFD] hover:underline font-semibold cursor-pointer"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="আপনার Password লিখুন"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-xs sm:text-sm text-[#0D253D] placeholder-[#94A3B8] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(83,58,253,0.3)] hover:shadow-[0_6px_22px_rgba(83,58,253,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>অ্যাকাউন্টে প্রবেশ করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regError && (
                  <div className="p-3 rounded-xl bg-[#D8351E]/10 border border-[#D8351E]/20 text-[#D8351E] text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                    আপনার পূর্ণ নাম <span className="text-[#D8351E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-xs sm:text-sm text-[#0D253D] placeholder-[#94A3B8] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                    মোবাইল নম্বর <span className="text-[#D8351E]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 01712345678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-xs sm:text-sm text-[#0D253D] placeholder-[#94A3B8] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                    ইমেইল এড্রেস <span className="text-[#D8351E]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="যেমন: yourname@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-xs sm:text-sm text-[#0D253D] placeholder-[#94A3B8] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 transition-all shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                      পাসওয়ার্ড <span className="text-[#D8351E]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="কমপক্ষে ৪ অক্ষর"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-xs sm:text-sm text-[#0D253D] placeholder-[#94A3B8] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                      কনফার্ম পাসওয়ার্ড <span className="text-[#D8351E]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                      value={regConfirmPass}
                      onChange={(e) => setRegConfirmPass(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-xs sm:text-sm text-[#0D253D] placeholder-[#94A3B8] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-2 focus:ring-[#533AFD]/15 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(83,58,253,0.3)] hover:shadow-[0_6px_22px_rgba(83,58,253,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>নতুন অ্যাকাউন্ট খুলুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Security Code Quick Button for unauthenticated clients (Requirement 13) */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowSecurityCodeModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F8FAFD] active:scale-95 text-[#533AFD] border border-[#E2E8F0] hover:border-[#533AFD]/30 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
            >
              <ShieldCheck className="w-4 h-4 text-[#533AFD] transition-transform group-hover:scale-110" />
              <span>Security Code (কোড দেখুন)</span>
            </button>
          </div>

          {/* Security & Support Footnote */}
          <div className="mt-5 flex items-center justify-center gap-3 text-[11px] font-semibold text-[#64748D] flex-wrap select-none">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00B261]" />
              <span>256-Bit SSL সুরক্ষিত</span>
            </span>
            <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#533AFD]" />
              <span>ভেরিফাইড ক্লায়েন্ট পোর্টাল</span>
            </span>
            <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
            <span>২৪/৭ লাইভ সাপোর্ট</span>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-sm bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 relative">
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 p-1 rounded-xl text-[#64748D] hover:text-[#0D253D]"
              >
                <X className="w-5 h-5" />
              </button>

              {forgotSubmitted ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#0D253D]">
                    কল অনুরোধ সফল হয়েছে
                  </h3>
                  <p className="text-xs text-[#64748D]">
                    আমাদের সাপোর্ট টিম আপনার নম্বরে কল করে পাসওয়ার্ড ভেরিফিকেশন ও রিসেট সম্পন্ন করবে।
                  </p>
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="mt-2 px-5 py-2 rounded-xl bg-[#533AFD] text-white text-xs font-bold"
                  >
                    ঠিক আছে
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-[#533AFD]" />
                    <h3 className="text-base font-black text-[#0D253D]">
                      পাসওয়ার্ড রিসেট সাপোর্ট কল
                    </h3>
                  </div>
                  <p className="text-xs text-[#64748D]">
                    আপনার রেজিস্ট্রেশনকৃত মোবাইল নম্বর দিন। আমাদের সাপোর্ট স্পেশালিস্ট আপনাকে সরাসরি ফোন করে সহায়তা করবেন।
                  </p>
                  <form onSubmit={handleRequestPasswordCall} className="space-y-3">
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: 01712345678"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:border-[#533AFD]"
                    />
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] cursor-pointer"
                      >
                        কল রিকোয়েস্ট পাঠান
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(false)}
                        className="px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#64748D] cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW: TOTAL ORDERS SUBPAGE (Requirement 8)
  // ==========================================
  if (subView === 'total-orders') {
    return (
      <div className="w-full flex flex-col font-sans pb-28 pt-3 sm:pt-6 animate-fadeIn">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-5">
          {/* Back Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold font-mono">
              মোট অর্ডার: {userOrders.length} টি
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0D253D]">
              মোট Order (Total Orders)
            </h1>
            <p className="text-xs text-[#64748D] mt-1">
              আপনার নিবন্ধিত মোবাইল নম্বর ({currentUser.phone}) দিয়ে করা সমস্ত অর্ডারের সম্পূর্ণ তালিকা ও রসিদ:
            </p>
          </div>

          {userOrders.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E5EDF5] text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#0D253D]">
                আপনি এখনো কোনো ওয়েবসাইট অর্ডার করেননি
              </h3>
              <p className="text-xs text-[#64748D] max-w-sm mx-auto">
                ড্যাশবোর্ডে গিয়ে আপনার পছন্দের ক্যাটাগরি থেকে মাত্র ১,৯৯০ টাকায় ওয়েবসাইট অর্ডার করতে পারেন।
              </p>
              {onGoToDashboard && (
                <button
                  onClick={onGoToDashboard}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>ওয়েবসাইট তালিকা দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.map((ord, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] hover:border-[#533AFD]/40 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#533AFD] text-white font-mono font-black text-xs">
                        {ord.orderId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#E2E4FF] text-[#533AFD] text-[11px] font-bold">
                        {ord.demoCode}
                      </span>
                      <span className="text-sm font-bold text-[#0D253D] truncate">
                        {ord.companyName || ord.clientName}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748D] truncate">
                      {ord.demoTitle}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#273951] pt-1">
                      <span>তারিখ: <strong>{ord.createdAt}</strong></span>
                      <span>মেকিং: <strong className="text-[#533AFD]">১,৯৯০ ৳</strong></span>
                      <span>TrxID: <strong className="font-mono text-[#00B261]">{ord.transactionId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EDF5]">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      ord.status === 'completed'
                        ? 'bg-[#00B261]/15 text-[#008A4B] border border-[#00B261]/30'
                        : ord.status === 'processing' || ord.status === 'verified'
                        ? 'bg-[#533AFD]/15 text-[#533AFD] border border-[#533AFD]/30'
                        : ord.status === 'cancelled'
                        ? 'bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30'
                        : 'bg-[#FFD552]/20 text-[#8A6D00] border border-[#FFD552]'
                    }`}>
                      {ord.status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#008A4B]" />
                          <span>✓ সম্পূর্ণ (Completed)</span>
                        </>
                      ) : ord.status === 'processing' || ord.status === 'verified' ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#533AFD] animate-pulse" />
                          <span>অনুমোদিত (প্রসেসিং)</span>
                        </>
                      ) : ord.status === 'cancelled' ? (
                        <span>বাতিলকৃত</span>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
                          <span>⏳ পেন্ডিং যাচাই</span>
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>রসিদ দেখুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Receipt Modal */}
        {renderReceiptModal()}
      </div>
    );
  }

  // ==========================================
  // VIEW: PENDING VERIFICATION SUBPAGE (Requirement 8)
  // ==========================================
  if (subView === 'pending-orders') {
    return (
      <div className="w-full flex flex-col font-sans pb-28 pt-3 sm:pt-6 animate-fadeIn">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-5">
          {/* Back Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              pendingOrders.length > 0 ? 'bg-[#FFD552]/20 text-[#8A6D00] border border-[#FFD552]' : 'bg-[#00B261]/15 text-[#008A4B]'
            }`}>
              {pendingOrders.length > 0 ? `${pendingOrders.length} টি পেন্ডিং যাচাই` : '০ টি পেন্ডিং'}
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0D253D]">
              Pending যাচাই (Pending Verification)
            </h1>
            <p className="text-xs text-[#64748D] mt-1">
              ম্যানুয়াল পেমেন্ট প্রেরণের পর অ্যাডমিন টিম কর্তৃক যাচাইকরণের তালিকা:
            </p>
          </div>

          {/* If there are NO pending orders -> Show "কোনো Pending নেই" / "No Pending" exactly as required */}
          {pendingOrders.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border-2 border-[#00B261]/30 text-center space-y-3 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#0D253D]">
                কোনো Pending নেই / No Pending
              </h3>
              <p className="text-xs sm:text-sm text-[#273951] max-w-md mx-auto leading-relaxed">
                আপনার কোনো অর্ডার বর্তমানে পেন্ডিং অবস্থায় নেই। সকল পেমেন্ট ও অর্ডার সফলভাবে যাচাই এবং কনফার্ম করা হয়েছে।
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateSubView('overview')}
                  className="px-6 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>অ্যাকাউন্ট ওভারভিউতে ফিরুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#FFD552]/20 border border-[#FFD552] text-xs sm:text-sm font-bold text-[#8A6D00] flex items-center gap-2.5 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] animate-ping shrink-0" />
                <span>
                  আপনার নিম্নের অর্ডারসমূহের পেমেন্ট যাচাই প্রক্রিয়াধীন রয়েছে। অনুগ্রহ করে ১ মিনিট থেকে ১ ঘণ্টা অপেক্ষা করুন।
                </span>
              </div>

              {pendingOrders.map((ord, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#FFD552] transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#533AFD] text-white font-mono font-black text-xs">
                        {ord.orderId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#E2E4FF] text-[#533AFD] text-[11px] font-bold">
                        {ord.demoCode}
                      </span>
                      <span className="text-sm font-bold text-[#0D253D] truncate">
                        {ord.companyName || ord.clientName}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748D] truncate">
                      {ord.demoTitle}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#273951] pt-1">
                      <span>তারিখ: <strong>{ord.createdAt}</strong></span>
                      <span>মেকিং চার্জ: <strong className="text-[#533AFD]">১,৯৯০ ৳</strong></span>
                      <span>পেমেন্ট: <strong>{ord.paymentMethod.toUpperCase()}</strong></span>
                      <span>TrxID: <strong className="font-mono text-[#00B261]">{ord.transactionId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EDF5]">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFD552]/20 text-[#8A6D00] border border-[#FFD552] flex items-center gap-1">
                      <span>⏳ পেন্ডিং যাচাই (১ মি. - ১ ঘণ্টা)</span>
                    </span>

                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>রসিদ দেখুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Receipt Modal */}
        {renderReceiptModal()}
      </div>
    );
  }

  // ==========================================
  // VIEW: PRIVACY POLICY SUBPAGE (Requirement 9)
  // ==========================================
  if (subView === 'privacy') {
    return (
      <div className="w-full flex flex-col font-sans pb-28 pt-3 sm:pt-6 animate-fadeIn">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 w-full space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-[#64748D]">BongoWeb.xyz পলিসি</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5EDF5]">
              <ShieldCheck className="w-6 h-6 text-[#533AFD]" />
              <h1 className="text-lg sm:text-xl font-black text-[#0D253D]">
                গোপনীয়তা নীতিমালা (Privacy Policy)
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#273951] leading-relaxed">
              <p>
                BongoWeb.xyz গ্রাহকদের তথ্যের গোপনীয়তা ও নিরাপত্তাকে সর্বোচ্চ প্রাধান্য দেয়। আপনি যখন আমাদের ওয়েবসাইট সেবা গ্রহণ করেন, আপনার প্রদত্ত ফোন নম্বর, ইমেইল ও ব্যবসার তথ্য শুধুমাত্র ওয়েবসাইট কনফিগারেশন ও অফিসিয়াল ডেলিভারির উদ্দেশ্যে সংরক্ষিত থাকে।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">১. তথ্য সংগ্রহ ও সুরক্ষা</h3>
              <p>
                আপনার মোবাইল নম্বর, ইমেইল এবং পেমেন্ট ট্রানজেকশন আইডি ২৫৬-বিট এসএসএল (SSL) এনক্রিপশনের মাধ্যমে সম্পূর্ণ সুরক্ষিত ডেটাবেজে সংরক্ষিত থাকে। কোনো অবস্থাতেই তৃতীয় পক্ষের কাছে বাণিজ্যিক উদ্দেশ্যে তথ্য শেয়ার করা হয় না।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">২. ওয়েবসাইট অ্যাডমিন ও পাসওয়ার্ড গোপনীয়তা</h3>
              <p>
                ওয়েবসাইট ডেলিভারির পর গ্রাহকের জন্য স্বতন্ত্র অ্যাডমিন আইডি ও পাসওয়ার্ড তৈরি করে সুরক্ষিত এনক্রিপশনে প্রদান করা হয়। গ্রাহক যেকোনো সময় নিজস্ব ওয়েবসাইট প্যানেল থেকে পাসওয়ার্ড পরিবর্তন করতে পারেন।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">৩. যোগাযোগ ও সহায়তা</h3>
              <p>
                যেকোনো প্রয়োজনে আমাদের অফিসিয়াল সাপোর্ট নম্বরে কল অথবা অ্যাকাউন্টের মাধ্যমে যোগাযোগ করতে পারেন।
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // VIEW: TERMS & CONDITIONS SUBPAGE (Requirement 9)
  // ==========================================
  if (subView === 'terms') {
    return (
      <div className="w-full flex flex-col font-sans pb-28 pt-3 sm:pt-6 animate-fadeIn">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 w-full space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-[#64748D]">BongoWeb.xyz টার্মস</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5EDF5]">
              <FileText className="w-6 h-6 text-[#533AFD]" />
              <h1 className="text-lg sm:text-xl font-black text-[#0D253D]">
                শর্তাবলি ও ব্যবহারের নিয়ম (Terms & Conditions)
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#273951] leading-relaxed">
              <h3 className="text-sm font-bold text-[#0D253D]">১. মেকিং ও ডেলিভারি চার্জ</h3>
              <p>
                প্রতিটি প্রি-বিল্ট ওয়েবসাইটের এককালীন রেডিমেকিং চার্জ মাত্র ১,৯৯০ টাকা। অর্ডার নিশ্চিত হওয়ার পর সর্বোচ্চ ২৪ থেকে ৪৮ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ওয়েবসাইট ডেলিভারি সম্পন্ন হয়।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">২. মাসিক ক্লাউড সার্ভার ও মেইনটেন্যান্স</h3>
              <p>
                ওয়েবসাইট নিরবচ্ছিন্নভাবে লাইভ ও নিরাপদ রাখার জন্য মাসিক ক্লাউড সার্ভার মেইনটেন্যান্স ফি মাত্র ১২০ টাকা। এই ফিতে সার্বক্ষণিক এসএসএল সিকিউরিটি, ডেটা ব্যাকআপ ও ক্লাউড নোড অপটিমাইজেশন অন্তর্ভুক্ত থাকে।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">৩. ফ্রি সাপোর্ট ও পরামর্শ</h3>
              <p>
                ওয়েবসাইট পরিচালনার জন্য সকল গ্রাহককে ফ্রি ভিডিও টিউটোরিয়াল প্রদান করা হয় এবং লাইভ সাপোর্ট টিকেট ও চ্যাটের মাধ্যমে সার্বক্ষণিক ফ্রি সাপোর্ট নিশ্চিত করা হয়।
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Helper for receipt modal
  function renderReceiptModal() {
    if (!selectedReceiptOrder) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
        <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 animate-slideUpModal relative space-y-4">
          <button
            onClick={() => setSelectedReceiptOrder(null)}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center pb-4 border-b border-[#E5EDF5]">
            <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-black font-mono">
              {selectedReceiptOrder.orderId}
            </span>
            <h3 className="text-lg font-black text-[#0D253D] mt-2">
              অফিসিয়াল অর্ডার রসিদ (Official Receipt)
            </h3>
            <p className="text-[11px] text-[#64748D]">
              BongoWeb.xyz — ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">গ্রাহকের নাম:</span>
              <span className="font-bold text-[#0D253D]">{selectedReceiptOrder.clientName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">ব্যবসা/কোম্পানি:</span>
              <span className="font-bold text-[#0D253D]">{selectedReceiptOrder.companyName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">মোবাইল নম্বর:</span>
              <span className="font-bold font-mono text-[#0D253D]">{selectedReceiptOrder.phone}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">ইমেইল এড্রেস:</span>
              <span className="font-bold font-mono text-[#0D253D]">{selectedReceiptOrder.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">পেমেন্ট মাধ্যম:</span>
              <span className="font-bold text-[#0D253D] uppercase">{selectedReceiptOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">ট্রানজেকশন TrxID:</span>
              <span className="font-bold font-mono text-[#00B261]">{selectedReceiptOrder.transactionId}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">এককালীন চার্জ:</span>
              <span className="font-black text-sm text-[#0D253D]">১,৯৯০ ৳</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">মাসিক মেইনটেন্যান্স:</span>
              <span className="font-bold text-[#533AFD]">১২০ ৳ / মাস</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#64748D]">স্ট্যাটাস:</span>
              <span className={`font-bold flex items-center gap-1 ${
                selectedReceiptOrder.status === 'completed'
                  ? 'text-[#008A4B]'
                  : selectedReceiptOrder.status === 'processing' || selectedReceiptOrder.status === 'verified'
                  ? 'text-[#533AFD]'
                  : selectedReceiptOrder.status === 'cancelled'
                  ? 'text-[#E53935]'
                  : 'text-[#D8351E]'
              }`}>
                {selectedReceiptOrder.status === 'completed'
                  ? '✓ সম্পূর্ণ (Completed)'
                  : selectedReceiptOrder.status === 'processing' || selectedReceiptOrder.status === 'verified'
                  ? '⚡ অনুমোদিত (প্রসেসিং)'
                  : selectedReceiptOrder.status === 'cancelled'
                  ? 'বাতিলকৃত'
                  : '⏳ পেন্ডিং ভেরিফিকেশন (১ মিনিট - ১ ঘণ্টা)'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / ডাউনলোড</span>
            </button>
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="px-4 py-2.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN LOGGED-IN ACCOUNT OVERVIEW
  // ==========================================
  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-2 animate-fadeIn">
      {/* 1. Global Pending Verification Notice (If any pending orders exist) */}
      {pendingOrders.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-4">
          <div className="p-4 rounded-2xl bg-[#FFD552]/20 border border-[#FFD552] text-xs sm:text-sm font-bold text-[#8A6D00] flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] animate-ping shrink-0" />
              <span>
                আপনার পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন রয়েছে (অর্ডার {pendingOrders[0].orderId})। অনুগ্রহ করে ১ মিনিট থেকে ১ ঘণ্টা অপেক্ষা করুন।
              </span>
            </div>
            <button
              onClick={() => navigateSubView('pending-orders')}
              className="px-3 py-1 rounded-xl bg-[#8A6D00] text-white text-xs font-bold shrink-0 hover:bg-[#725a00] cursor-pointer"
            >
              বিবরণ দেখুন
            </button>
          </div>
        </section>
      )}

      {/* 2. SECTION: আপনার Website এর বিস্তারিত (Requirement 6) */}
      {userCredentialsList.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0D253D] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00B261]" />
                  <span>আপনার Website এর বিস্তারিত</span>
                </h3>
                <p className="text-xs text-[#64748D]">
                  আমাদের ইঞ্জিনিয়ার টিম কর্তৃক প্রস্তুতকৃত প্রতিটি ওয়েবসাইটের পৃথক বিস্তারিত তথ্য ও অ্যাডমিন অ্যাক্সেস:
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#00B261]/15 text-[#008A4B] text-xs font-bold">
                {userCredentialsList.length} টি ওয়েবসাইট রেডি
              </span>
            </div>

            {/* If payment is in verification status, show that notice right here as required */}
            {pendingOrders.length > 0 && (
              <div className="p-3 rounded-xl bg-[#FFD552]/20 border border-[#FFD552] text-xs text-[#8A6D00] font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#8A6D00]" />
                <span>
                  বিজ্ঞপ্তি: আপনার নতুন ওয়েবসাইটের পেমেন্ট বর্তমানে 'যাচাইকরণ' (Verification) স্ট্যাটাসে রয়েছে।
                </span>
              </div>
            )}

            {/* Each website's details shown separately (Requirement 6) */}
            <div className="space-y-3">
              {userCredentialsList.map((cred, cIdx) => (
                <div
                  key={cIdx}
                  className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#008A4B]/10 via-[#00B261]/15 to-[#008A4B]/10 border-2 border-[#00B261] shadow-md space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00B261]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-full bg-[#008A4B] text-white text-xs font-bold">
                        ✓ ওয়েবসাইট #{cIdx + 1}
                      </span>
                      <h4 className="text-base font-black text-[#0D253D]">
                        {cred.websiteTitle}
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#64748D] font-mono">
                      ডেলিভারি তারিখ: {cred.deliveredAt}
                    </span>
                  </div>

                  {/* ID & Password display with 1-click copy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E5EDF5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#64748D] font-bold block uppercase">
                          ওয়েবসাইট অ্যাডমিন আইডি / ইউজারনেম:
                        </span>
                        <span className="text-sm font-mono font-black text-[#0D253D] select-all">
                          {cred.websiteAdminId}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyText(cred.websiteAdminId, `id-${cred.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="আইডি কপি করুন"
                      >
                        {copiedField === `id-${cred.id}` ? <Check className="w-3.5 h-3.5 text-[#00B261]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === `id-${cred.id}` ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#E5EDF5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#64748D] font-bold block uppercase">
                          ওয়েবসাইট অ্যাডমিন পাসওয়ার্ড:
                        </span>
                        <span className="text-sm font-mono font-black text-[#533AFD] select-all">
                          {cred.websiteAdminPass}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyText(cred.websiteAdminPass, `pass-${cred.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="পাসওয়ার্ড কপি করুন"
                      >
                        {copiedField === `pass-${cred.id}` ? <Check className="w-3.5 h-3.5 text-[#00B261]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === `pass-${cred.id}` ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </div>
                  </div>

                  {cred.notes && (
                    <div className="bg-white/80 p-3 rounded-2xl border border-[#E5EDF5] text-xs text-[#273951]">
                      <strong className="text-[#0D253D] block mb-0.5">ইঞ্জিনিয়ার নোট ও লগইন নির্দেশনা:</strong>
                      <p className="leading-relaxed text-[#64748D]">{cred.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. SECTION: CLIENT ACCOUNT / PROFILE SECTION (Requirement 2) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E5EDF5] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#533AFD] text-white flex items-center justify-center font-black text-lg shadow-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E2E4FF] text-[#533AFD] text-[10px] font-bold">
                  সক্রিয় ক্লায়েন্ট অ্যাকাউন্ট
                </span>
                <h2 className="text-base sm:text-lg font-black text-[#0D253D] mt-0.5">
                  ক্লায়েন্ট প্রোফাইল বিবরণ
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowSecurityCodeModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#E2E4FF] hover:bg-[#533AFD] text-[#533AFD] hover:text-white border border-[#533AFD]/30 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="৫-মিনিটের সিকিউরিটি কোড দেখুন"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Security Code (কোড দেখুন)</span>
              </button>
              <span className="text-[11px] text-[#64748D] font-mono hidden sm:inline-block">
                রেজিস্ট্রেশন: {currentUser.registeredAt}
              </span>
            </div>
          </div>

          {/* Clean Fields: Profile Name, Email Address, Phone Number (Requirement 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-1">
              <span className="text-[10px] font-bold text-[#64748D] uppercase block">
                Profile Name (প্রোফাইল নাম)
              </span>
              <p className="text-sm font-black text-[#0D253D] truncate">
                {currentUser.name}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-1">
              <span className="text-[10px] font-bold text-[#64748D] uppercase block">
                Email Address (ইমেইল এড্রেস)
              </span>
              <p className="text-sm font-mono font-bold text-[#0D253D] truncate select-all">
                {currentUser.email}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-1">
              <span className="text-[10px] font-bold text-[#64748D] uppercase block">
                Phone Number (রেজিস্ট্রেশন মোবাইল)
              </span>
              <p className="text-sm font-mono font-bold text-[#533AFD] select-all">
                {currentUser.phone}
              </p>
            </div>
          </div>

          {/* Sign Out Button placed cleanly at the VERY END of the profile section (Requirement 2) - WhatsApp button completely removed */}
          <div className="pt-2 border-t border-[#E5EDF5] flex items-center justify-end">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E53935]/10 text-[#64748D] hover:text-[#E53935] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>সাইন আউট (Sign Out)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. SECTION: STATS & DEDICATED SUBPAGES TRIGGER (Requirement 8) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#64748D] mb-2 uppercase tracking-wider">
            অর্ডার ও সার্ভিস পরিসংখ্যান (ক্লিক করে সরাসরি বিস্তারিত দেখুন)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Stat 1: মোট Order (Click opens dedicated full page, Requirement 8) */}
          <button
            type="button"
            onClick={() => navigateSubView('total-orders')}
            className="p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#533AFD]/30 hover:border-[#533AFD] text-center shadow-xs transition-all hover:scale-[1.02] cursor-pointer group text-left sm:text-center"
          >
            <span className="text-2xl sm:text-3xl font-black text-[#533AFD] block">
              {userOrders.length}
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-1 group-hover:text-[#533AFD] flex items-center justify-center gap-1">
              <span>মোট Order</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </p>
            <span className="text-[10px] text-[#64748D] block mt-0.5">
              ক্লিক করে সকল অর্ডার দেখুন
            </span>
          </button>

          {/* Stat 2: Pending যাচাই (Click opens dedicated full page, Requirement 8) */}
          <button
            type="button"
            onClick={() => navigateSubView('pending-orders')}
            className={`p-4 rounded-2xl border-2 text-center shadow-xs transition-all hover:scale-[1.02] cursor-pointer group text-left sm:text-center ${
              pendingOrders.length > 0 
                ? 'bg-[#FFF8E7] border-[#FFD552] hover:border-[#E53935]'
                : 'bg-[#FFFFFF] border-[#E5EDF5] hover:border-[#00B261]'
            }`}
          >
            <span className={`text-2xl sm:text-3xl font-black block ${
              pendingOrders.length > 0 ? 'text-[#E53935]' : 'text-[#00B261]'
            }`}>
              {pendingOrders.length}
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-1 group-hover:text-[#E53935] flex items-center justify-center gap-1">
              <span>Pending যাচাই</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </p>
            <span className="text-[10px] text-[#64748D] block mt-0.5">
              {pendingOrders.length > 0 ? '১ মিনিট - ১ ঘণ্টা' : 'কোনো Pending নেই'}
            </span>
          </button>

          {/* Stat 3: ডেলিভারি সময় */}
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-[#00B261] block">
              ২৪ ঘণ্টা
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-1">ডেলিভারি সময়</p>
            <span className="text-[10px] text-[#64748D] block mt-0.5">এক্সপ্রেস লাইভ সেটআপ</span>
          </div>

          {/* Stat 4: মাসিক মেইনটেন্যান্স */}
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-[#533AFD] block">
              ১২০ ৳
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-1">মাসিক মেইনটেন্যান্স</p>
            <span className="text-[10px] text-[#64748D] block mt-0.5">সার্ভার ও হোস্টিং ফি</span>
          </div>
        </div>
      </section>

      {/* 5. SECTION: PROFESSIONAL IMPROVEMENTS (Requirement 9) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-3">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-[#0D253D]">
              অ্যাকাউন্ট সেটিংস ও নীতিমালা (Account Settings & Policies)
            </h3>
            <p className="text-xs text-[#64748D]">
              BongoWeb.xyz সার্ভিস ব্যবহারের নিয়মাবলি, ভাষা নির্বাচন ও নীতিসমূহ:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Privacy Policy */}
            <button
              onClick={() => navigateSubView('privacy')}
              className="p-4 rounded-2xl bg-[#F8FAFD] hover:bg-[#E2E4FF] border border-[#E5EDF5] hover:border-[#533AFD]/30 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-[#533AFD]" />
                <ArrowRight className="w-4 h-4 text-[#64748D] group-hover:text-[#533AFD] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D253D] group-hover:text-[#533AFD]">
                Privacy Policy
              </h4>
              <p className="text-[11px] text-[#64748D] mt-0.5">
                গ্রাহকের তথ্যের সুরক্ষা ও গোপনীয়তা নীতিমালা পড়ুন
              </p>
            </button>

            {/* Terms & Conditions */}
            <button
              onClick={() => navigateSubView('terms')}
              className="p-4 rounded-2xl bg-[#F8FAFD] hover:bg-[#E2E4FF] border border-[#E5EDF5] hover:border-[#533AFD]/30 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-[#533AFD]" />
                <ArrowRight className="w-4 h-4 text-[#64748D] group-hover:text-[#533AFD] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D253D] group-hover:text-[#533AFD]">
                Terms & Conditions
              </h4>
              <p className="text-[11px] text-[#64748D] mt-0.5">
                সার্ভিস ব্যবহার ও ওয়েবসাইট ডেলিভারির শর্তাবলি
              </p>
            </button>

            {/* Language Change Option */}
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D253D]">
                  <Languages className="w-4 h-4 text-[#533AFD]" />
                  <span>ভাষা পরিবর্তন (Language)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('bn')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedLanguage === 'bn'
                      ? 'bg-[#533AFD] text-white shadow-xs'
                      : 'bg-white text-[#64748D] border border-[#E5EDF5] hover:text-[#0D253D]'
                  }`}
                >
                  <span>🇧🇩</span>
                  <span>বাংলা</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('en')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedLanguage === 'en'
                      ? 'bg-[#533AFD] text-white shadow-xs'
                      : 'bg-white text-[#64748D] border border-[#E5EDF5] hover:text-[#0D253D]'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
              <p className="text-[10px] text-[#64748D]">
                সিস্টেমের ভাষা {selectedLanguage === 'bn' ? 'বাংলা' : 'English'} হিসেবে নির্বাচিত।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Receipt Modal Popup */}
      {renderReceiptModal()}

      {/* 6. SECURITY CODE MODAL (Requirement 13) */}
      {showSecurityCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5EDF5] relative space-y-4">
            <button
              onClick={() => setShowSecurityCodeModal(false)}
              className="absolute top-4 right-4 p-2 text-[#64748D] hover:text-[#0D253D] rounded-full hover:bg-[#F8FAFD] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!currentUser ? (
              <div className="text-center space-y-4 pt-2">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8E7] text-[#FF9800] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-[#0D253D]">
                  সিকিউরিটি কোড যাচাইকরণ
                </h3>
                <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#FFD552] text-xs font-bold text-[#8A6D00] leading-relaxed">
                  “কোড পেতে আগে Account তৈরি করুন। তারপর আমরা আপনার সমস্যা সমাধান করব।”
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSecurityCodeModal(false);
                      setAuthMode('register');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#533AFD] hover:bg-[#432BEE] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Account তৈরি করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSecurityCodeModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#F8FAFD] text-[#64748D] hover:text-[#0D253D] text-xs font-semibold cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#533AFD] uppercase tracking-wider block">
                      ভেরিফিকেশন সুরক্ষা কোড
                    </span>
                    <h3 className="text-base font-black text-[#0D253D]">
                      Your Security Code
                    </h3>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFD] border-2 border-[#533AFD]/30 text-center space-y-2">
                  <span className="text-xs text-[#64748D] font-medium block">
                    আপনার বর্তমান ৫-মিনিটের সক্রিয় সিকিউরিটি কোড:
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-[0.25em] text-[#533AFD] select-all py-1">
                    {getClientSecurityCode(currentUser.phone || currentUser.email)}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748D] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#00B261] animate-pulse" />
                    <span>মেয়াদ বাকি: <strong className="text-[#0D253D] font-mono">{formatRemainingTime(codeRemainingSec)}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const code = getClientSecurityCode(currentUser.phone || currentUser.email);
                    navigator.clipboard.writeText(code);
                    setSecurityCodeCopied(true);
                    setTimeout(() => setSecurityCodeCopied(false), 2000);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    securityCodeCopied
                      ? 'bg-[#00B261] text-white'
                      : 'bg-[#533AFD] hover:bg-[#432BEE] text-white'
                  }`}
                >
                  {securityCodeCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Security Code কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Security Code (কোড কপি করুন)</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#64748D] text-center leading-relaxed">
                  * এই কোডটি প্রতি ৫ মিনিটে স্বয়ংক্রিয়ভাবে পরিবর্তিত হয়। অ্যাডমিন বা সাপোর্ট টিম চাইলে তাদের এই কোডটি প্রদান করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
