import React, { useState, useEffect } from 'react';
import { 
  User, ShieldCheck, Key, Globe, FileText, 
  HelpCircle, CheckCircle2, Lock, ArrowRight, X, 
  Printer, MessageCircle, AlertCircle, ShoppingBag, Eye,
  LogOut, PhoneCall, Sparkles, Check, Server
} from 'lucide-react';
import { ClientOrder, UserAccount, WebsiteDeliveryCredentials, PasswordResetRequest } from '../types';
import { apiRegisterUser, apiRequestPasswordReset, apiGetOrders, apiGetUsers, apiGetCredentials } from '../utils/api';

interface AccountViewProps {
  onGoToDashboard?: () => void;
  onOpenAdminPanel?: () => void;
}

export default function AccountView({ onGoToDashboard, onOpenAdminPanel }: AccountViewProps) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<ClientOrder | null>(null);
  const [userCredentials, setUserCredentials] = useState<WebsiteDeliveryCredentials | null>(null);

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

  // Load state on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem('bongoweb_user');
      if (storedUser) {
        const parsed: UserAccount = JSON.parse(storedUser);
        setCurrentUser(parsed);

        // Check delivered credentials
        const credsList = await apiGetCredentials();
        const found = credsList.find((c) => c.userPhone === parsed.phone);
        setUserCredentials(found || null);
      } else {
        setCurrentUser(null);
        setUserCredentials(null);
      }

      const allOrders = await apiGetOrders();
      setOrders(allOrders);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('bongoweb_user');
    sessionStorage.removeItem('bongoweb_user');
    setCurrentUser(null);
    setUserCredentials(null);
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

    // 2. Client Login Check (API + local)
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

  const pendingOrders = orders.filter((o) => o.status === 'pending');

  // ==========================================
  // VIEW: IF USER IS NOT LOGGED IN
  // ==========================================
  if (!currentUser) {
    return (
      <div className="w-full flex flex-col font-sans pb-28 pt-4 sm:pt-8 animate-fadeIn">
        <div className="max-w-md mx-auto px-4 w-full">
          {/* Header Tab Switcher */}
          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center font-black mx-auto mb-3 text-lg shadow-2xs">
                BW
              </div>
              <h1 className="text-xl font-black text-[#0D253D]">
                ক্লায়েন্ট অ্যাকাউন্ট পোর্টাল
              </h1>
              <p className="text-xs text-[#64748D] mt-1">
                আপনার ওয়েবসাইট ম্যানেজ করতে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন।
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F8FAFD] border border-[#E5EDF5] rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setLoginError('');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-[#533AFD] text-white shadow-xs'
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
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#533AFD] text-white shadow-xs'
                    : 'text-[#64748D] hover:text-[#0D253D]'
                }`}
              >
                রেজিস্টার (Register)
              </button>
            </div>

            {/* 1. LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-[#D8351E]/10 border border-[#D8351E]/20 text-[#D8351E] text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1">
                    মোবাইল নম্বর অথবা ইমেইল
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="017xxxxxxxx বা name@example.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#0D253D]">
                      পাসওয়ার্ড
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotSubmitted(false);
                        setForgotPhone(loginIdentifier);
                      }}
                      className="text-[11px] text-[#533AFD] font-bold hover:underline cursor-pointer"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="পাসওয়ার্ড লিখুন"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>অ্যাকাউন্টে প্রবেশ করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {regError && (
                  <div className="p-3 rounded-xl bg-[#D8351E]/10 border border-[#D8351E]/20 text-[#D8351E] text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1">
                    আপনার পুরো নাম <span className="text-[#D8351E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ সাকিব হাসান"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1">
                    মোবাইল নম্বর <span className="text-[#D8351E]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs font-mono text-[#0D253D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1">
                    ইমেইল এড্রেস <span className="text-[#D8351E]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs font-mono text-[#0D253D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1">
                      পাসওয়ার্ড <span className="text-[#D8351E]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="পাসওয়ার্ড"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:border-[#533AFD]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1">
                      কনফার্ম পাসওয়ার্ড <span className="text-[#D8351E]">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="কনফার্ম করুন"
                      value={regConfirmPass}
                      onChange={(e) => setRegConfirmPass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:border-[#533AFD]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>অ্যাকাউন্ট তৈরি করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Forgot Password Modal (Request Call) */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-sm bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 relative">
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-[#64748D] hover:text-[#0D253D]"
              >
                <X className="w-5 h-5" />
              </button>

              {forgotSubmitted ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-black text-[#0D253D]">
                    পাসওয়ার্ড রিসেট কল রিকোয়েস্ট গৃহীত হয়েছে!
                  </h3>
                  <p className="text-xs text-[#64748D] leading-relaxed">
                    আমাদের সাপোর্ট টিম আপনার নম্বরে সরাসরি ফোন দিয়ে পাসওয়ার্ড রিসেট নিশ্চিত করবে।
                  </p>
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#533AFD] text-white text-xs font-bold"
                  >
                    ঠিক আছে
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <PhoneCall className="w-5 h-5 text-[#533AFD]" />
                    <h3 className="text-base font-black text-[#0D253D]">
                      পাসওয়ার্ড রিসেটের জন্য কল অনুরোধ
                    </h3>
                  </div>
                  <p className="text-xs text-[#64748D] mb-4">
                    আপনার নিবন্ধিত মোবাইল নম্বরটি দিন। অ্যাডমিন প্যানেল থেকে আপনাকে কল করে পাসওয়ার্ড রিসেট করে দেওয়া হবে।
                  </p>

                  <form onSubmit={handleRequestPasswordCall} className="space-y-3">
                    <input
                      type="tel"
                      required
                      placeholder="017xxxxxxxx"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs font-mono text-[#0D253D] focus:outline-none focus:border-[#533AFD]"
                    />

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD]"
                      >
                        কল রিকোয়েস্ট পাঠান
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(false)}
                        className="px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#64748D]"
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
  // VIEW: LOGGED-IN CLIENT ACCOUNT
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
              onClick={() => setSelectedReceiptOrder(pendingOrders[0])}
              className="px-3 py-1 rounded-xl bg-[#8A6D00] text-white text-xs font-bold shrink-0 hover:bg-[#725a00] cursor-pointer"
            >
              রসিদ দেখুন
            </button>
          </div>
        </section>
      )}

      {/* 2. Delivered Website Credentials Box (If delivered by Admin) */}
      {userCredentials && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#008A4B]/10 via-[#00B261]/15 to-[#008A4B]/10 border-2 border-[#00B261] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#008A4B] text-white text-xs font-bold">
                  ✓ ওয়েবসাইট হস্তান্তরিত
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#0D253D]">
                  আপনার ওয়েবসাইটের অ্যাডমিন প্যানেল সক্রিয় হয়েছে!
                </h3>
              </div>
              <span className="text-[10px] text-[#64748D]">{userCredentials.deliveredAt}</span>
            </div>

            <p className="text-xs text-[#273951]">
              আমাদের ইঞ্জিনিয়ার টিম আপনার ওয়েবসাইট সম্পূর্ণ প্রস্তুত করে অ্যাডমিন অ্যাক্সেস প্রদান করেছে:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#E5EDF5]">
              <div>
                <span className="text-[10px] text-[#64748D] font-bold block uppercase">অ্যাডমিন ইউজারনেম / আইডি:</span>
                <span className="text-sm font-mono font-black text-[#0D253D]">{userCredentials.websiteAdminId}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748D] font-bold block uppercase">অ্যাডমিন পাসওয়ার্ড:</span>
                <span className="text-sm font-mono font-black text-[#533AFD]">{userCredentials.websiteAdminPass}</span>
              </div>
            </div>

            {userCredentials.notes && (
              <p className="text-xs text-[#64748D] bg-white/60 p-2.5 rounded-xl border border-[#E5EDF5]">
                <strong>ইঞ্জিনিয়ার নোট:</strong> {userCredentials.notes}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 3. Compact Profile Header Card with Sign Out Option */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-5">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#533AFD] text-[#FFFFFF] flex items-center justify-center font-black text-xl shadow-xs shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#0D253D]">
                  {currentUser.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#E2E4FF] text-[#533AFD] text-[10px] font-bold">
                  সক্রিয় ক্লায়েন্ট
                </span>
              </div>
              <p className="text-xs text-[#273951] mt-0.5">
                {currentUser.email} • {currentUser.phone}
              </p>
              <p className="text-[10px] text-[#64748D] font-mono mt-0.5">
                রেজিস্ট্রেশন: {currentUser.registeredAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E53935]/10 text-[#64748D] hover:text-[#E53935] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>সাইন আউট</span>
            </button>

            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#00B261] hover:bg-[#009e56] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Real Stats Overview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-[#533AFD]">
              {orders.length}
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-0.5">মোট অর্ডার</p>
            <span className="text-[10px] text-[#64748D]">
              {orders.length === 0 ? 'এখনো কোনো অর্ডার নেই' : 'সরাসরি রসিদ সহ'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-[#E53935]">
              {pendingOrders.length}
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-0.5">পেন্ডিং যাচাই</p>
            <span className="text-[10px] text-[#64748D]">১ মিনিট - ১ ঘণ্টা</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-[#00B261]">
              ২৪ ঘণ্টা
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-0.5">ডেলিভারি সময়</p>
            <span className="text-[10px] text-[#64748D]">এক্সপ্রেস লাইভ</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-[#533AFD]">
              ১২০ ৳
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-0.5">মাসিক মেইনটেন্যান্স</p>
            <span className="text-[10px] text-[#64748D]">সার্ভার ও হোস্টিং</span>
          </div>
        </div>
      </section>

      {/* 5. View Your Orders Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#0D253D]">
              View Your Orders (আপনার অর্ডারসমূহ দেখুন)
            </h2>
            <p className="text-xs text-[#64748D]">
              আপনার করা সকল ওয়েবসাইট অর্ডারের তালিকা ও অফিসিয়াল ভেরিফিকেশন রসিদ
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-[#F8FAFD] border border-[#E5EDF5] text-xs font-bold text-[#533AFD]">
            {orders.length} টি রেকর্ড
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F8FAFD] border border-[#E5EDF5] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#0D253D]">
              আপনি এখনো কোনো ওয়েবসাইট অর্ডার করেননি
            </h3>
            <p className="text-xs text-[#64748D] max-w-sm mx-auto">
              ড্যাশবোর্ডে গিয়ে আপনার পছন্দের ক্যাটাগরি থেকে মাত্র ১,৯৯০ টাকায় ওয়েবসাইট অর্ডার করতে পারেন।
            </p>
            {onGoToDashboard && (
              <button
                onClick={onGoToDashboard}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>ওয়েবসাইট তালিকা দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] hover:border-[#533AFD]/40 transition-all shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#533AFD] text-white font-mono font-black text-xs">
                      {ord.orderId}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#E2E4FF] text-[#533AFD] text-[11px] font-bold">
                      {ord.demoCode}
                    </span>
                    <span className="text-xs font-bold text-[#0D253D] truncate">
                      {ord.companyName}
                    </span>
                  </div>

                  <p className="text-xs text-[#64748D] truncate">
                    {ord.demoTitle}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#273951] pt-1">
                    <span>তারিখ: <strong>{ord.createdAt}</strong></span>
                    <span>মেকিং: <strong className="text-[#533AFD]">১,৯৯০ ৳</strong></span>
                    <span>মেইনটেন্যান্স: <strong className="text-[#533AFD]">১২০ ৳/মাস</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EDF5]">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                    ord.status === 'verified'
                      ? 'bg-[#00B261]/15 text-[#008A4B] border border-[#00B261]/30'
                      : ord.status === 'cancelled'
                      ? 'bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30'
                      : 'bg-[#FFD552]/20 text-[#8A6D00] border border-[#FFD552]'
                  }`}>
                    {ord.status === 'verified' ? '✓ নিশ্চিতকৃত' : ord.status === 'cancelled' ? 'বাতিল' : '⏳ পেন্ডিং (১ মিনিট - ১ ঘণ্টা)'}
                  </span>

                  <button
                    onClick={() => setSelectedReceiptOrder(ord)}
                    className="px-3 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
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

      {/* 6. Receipt Modal Popup */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 animate-slideUpModal relative space-y-4">
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD]"
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
                <span className="text-[#64748D]">গ্রাহক:</span>
                <span className="font-bold text-[#0D253D]">{selectedReceiptOrder.clientName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">ব্যবসার নাম:</span>
                <span className="font-bold text-[#0D253D]">{selectedReceiptOrder.companyName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">মোবাইল:</span>
                <span className="font-bold font-mono text-[#0D253D]">{selectedReceiptOrder.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">ইমেইল:</span>
                <span className="font-bold font-mono text-[#0D253D]">{selectedReceiptOrder.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">পেমেন্ট মেথড:</span>
                <span className="font-bold text-[#0D253D] uppercase">{selectedReceiptOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">TrxID:</span>
                <span className="font-bold font-mono text-[#00B261]">{selectedReceiptOrder.transactionId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">মেকিং চার্জ:</span>
                <span className="font-black text-sm text-[#0D253D]">১,৯৯০ ৳</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">মাসিক মেইনটেন্যান্স:</span>
                <span className="font-bold text-[#533AFD]">১২০ ৳ / মাস</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#64748D]">স্ট্যাটাস:</span>
                <span className={`font-bold ${selectedReceiptOrder.status === 'verified' ? 'text-[#008A4B]' : 'text-[#D8351E]'}`}>
                  {selectedReceiptOrder.status === 'verified' ? 'নিশ্চিতকৃত' : 'পেন্ডিং ভেরিফিকেশন (১ মিনিট - ১ ঘণ্টা)'}
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
      )}
    </div>
  );
}
