import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, 
  Copy, Check, Upload, HelpCircle, Lock, 
  FileText, Download, Printer, AlertCircle, Sparkles
} from 'lucide-react';
import { WebsiteDemo, ClientOrder, UserAccount } from '../types';
import { apiCreateOrder, apiRegisterUser, apiGetUsers } from '../utils/api';

interface OrderPageViewProps {
  demo: WebsiteDemo | string | null;
  onBackToDashboard: () => void;
  onBackToWebsite?: (code: string) => void;
  onOrderCompleted?: (order: ClientOrder) => void;
}

export default function OrderPageView({
  demo,
  onBackToDashboard,
  onBackToWebsite,
  onOrderCompleted
}: OrderPageViewProps) {
  const demoTitle = typeof demo === 'string' ? demo : demo?.title || 'প্রিমিয়াম বিজনেস ওয়েবসাইট';
  const demoCode = (typeof demo === 'object' && demo?.fourDigitCode) ? demo.fourDigitCode : (typeof demo === 'string' ? demo : '#2085');
  const cleanCode = String(demoCode || '').replace('#', '');
  const storageKey = `bongoweb_order_state_${cleanCode}`;

  // Safely restore state across page refreshes
  const getSavedState = () => {
    try {
      const saved = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return null;
  };

  const getLoggedInUser = (): UserAccount | null => {
    try {
      const raw = localStorage.getItem('bongoweb_user') || sessionStorage.getItem('bongoweb_user');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
  };

  const saved = getSavedState();
  const loggedIn = getLoggedInUser();

  const getLatestSavedOrder = (): ClientOrder | null => {
    if (saved?.createdOrder) return saved.createdOrder;
    try {
      const rawLatest = localStorage.getItem('bongoweb_latest_order');
      if (rawLatest) return JSON.parse(rawLatest);
    } catch (_) {}
    return null;
  };

  // Check URL query for step e.g. /order/2085?step=2
  const getInitialStep = (): 1 | 2 | 3 => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlStep = Number(params.get('step'));
      if (urlStep === 2) return 2;
      if (urlStep === 3) {
        if (saved?.createdOrder || localStorage.getItem('bongoweb_latest_order')) return 3;
        return 2;
      }
    } catch (_) {}
    if (saved?.currentStep === 3 && (saved?.createdOrder || localStorage.getItem('bongoweb_latest_order'))) return 3;
    if (saved?.currentStep === 2) return 2;
    if (loggedIn) return 2; // If already logged in, skip account creation directly to step 2!
    return 1;
  };

  // Step 1: Account Creation; Step 2: Domain, Company & Payment; Step 3: Receipt
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(getInitialStep());

  // Step 1 Inputs (Account Creation)
  const [name, setName] = useState(saved?.name || loggedIn?.name || '');
  const [phone, setPhone] = useState(saved?.phone || loggedIn?.phone || '');
  const [email, setEmail] = useState(saved?.email || loggedIn?.email || '');
  const [password, setPassword] = useState(saved?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(saved?.confirmPassword || '');
  const [step1Error, setStep1Error] = useState('');
  const [emailNotification, setEmailNotification] = useState(false);

  // Step 2 Inputs (Company, Domain & Payment)
  const [companyName, setCompanyName] = useState(saved?.companyName || '');
  const [domainOption, setDomainOption] = useState<'have_domain' | 'no_domain' | 'dont_know'>(saved?.domainOption || 'no_domain');
  const [customDomainName, setCustomDomainName] = useState(saved?.customDomainName || '');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'upay'>(saved?.paymentMethod || 'bkash');
  const [transactionId, setTransactionId] = useState(saved?.transactionId || '');
  const [screenshotName, setScreenshotName] = useState(saved?.screenshotName || '');
  const [step2Error, setStep2Error] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Final Order Receipt
  const [createdOrder, setCreatedOrder] = useState<ClientOrder | null>(getLatestSavedOrder());

  // Synchronize state to both sessionStorage and localStorage on every change to prevent any refresh errors
  useEffect(() => {
    try {
      const stateToSave = {
        currentStep,
        name,
        phone,
        email,
        password,
        confirmPassword,
        companyName,
        domainOption,
        customDomainName,
        paymentMethod,
        transactionId,
        screenshotName,
        createdOrder
      };
      sessionStorage.setItem(storageKey, JSON.stringify(stateToSave));
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      if (createdOrder) {
        localStorage.setItem('bongoweb_latest_order', JSON.stringify(createdOrder));
      }
      // Keep URL query in sync
      const currentUrl = new URL(window.location.href);
      if (currentStep > 1) {
        currentUrl.searchParams.set('step', String(currentStep));
      } else {
        currentUrl.searchParams.delete('step');
      }
      window.history.replaceState({}, '', currentUrl.pathname + currentUrl.search);
    } catch (_) {}
  }, [currentStep, name, phone, email, password, confirmPassword, companyName, domainOption, customDomainName, paymentMethod, transactionId, screenshotName, createdOrder, storageKey]);

  // Payment Numbers
  const paymentNumbers: Record<'bkash' | 'nagad' | 'rocket' | 'upay', { number: string; type: string }> = {
    bkash: { number: '01712345678', type: 'bKash Personal / Send Money' },
    nagad: { number: '01812345678', type: 'Nagad Personal / Send Money' },
    rocket: { number: '019123456789', type: 'Rocket Personal / Send Money' },
    upay: { number: '01712345678', type: 'Upay Personal / Send Money' }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentNumbers[paymentMethod].number);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2200);
  };

  // Step 1 Submission: Account Creation
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Error('');

    if (!name.trim()) {
      setStep1Error('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setStep1Error('অনুগ্রহ করে সঠিক মোবাইল নম্বর প্রদান করুন।');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setStep1Error('অনুগ্রহ করে সঠিক ইমেইল এড্রেস লিখুন।');
      return;
    }
    if (!password || password.length < 4) {
      setStep1Error('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }
    if (password !== confirmPassword) {
      setStep1Error('পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    // Automatically create and persist user account to backend and local storage
    const userAccount: UserAccount = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password: password.trim(),
      registeredAt: new Date().toLocaleDateString('en-US')
    };

    apiRegisterUser(userAccount).catch(() => {});

    localStorage.setItem('bongoweb_user', JSON.stringify(userAccount));
    sessionStorage.setItem('bongoweb_user', JSON.stringify(userAccount));

    // Show confirmation notification
    setEmailNotification(true);
    setTimeout(() => setEmailNotification(false), 4500);

    // Proceed to Step 2
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 Submission: Main Order & Payment
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Error('');

    if (!companyName.trim()) {
      setStep2Error('অনুগ্রহ করে আপনার কোম্পানি বা ব্যবসার নাম লিখুন।');
      return;
    }
    if (domainOption === 'have_domain' && !customDomainName.trim()) {
      setStep2Error('অনুগ্রহ করে আপনার বিদ্যমান ডোমেইন নামটি লিখুন।');
      return;
    }
    if (!transactionId.trim()) {
      setStep2Error('পেমেন্ট পাঠানোর পর প্রাপ্ত ট্রানজেকশন আইডি (TrxID) লিখুন।');
      return;
    }

    // Generate unique order number
    const uniqueNumber = Math.floor(10000 + Math.random() * 90000);
    const orderId = `#BW-${uniqueNumber}`;

    const newOrder: ClientOrder = {
      orderId,
      demoCode,
      demoTitle,
      clientName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      companyName: companyName.trim(),
      domainOption,
      customDomain: domainOption === 'have_domain' ? customDomainName.trim() : undefined,
      paymentMethod,
      transactionId: transactionId.trim().toUpperCase(),
      makingCharge: 1990,
      monthlyCost: 120,
      status: 'pending',
      createdAt: new Date().toLocaleString('bn-BD'),
      screenshotName: screenshotName || undefined
    };

    // Store in backend and local cache
    try {
      await apiCreateOrder(newOrder);
    } catch (err) {
      console.error(err);
    }

    setCreatedOrder(newOrder);
    localStorage.setItem('bongoweb_latest_order', JSON.stringify(newOrder));
    setCurrentStep(3);
    if (onOrderCompleted) onOrderCompleted(newOrder);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#0D253D] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#E5EDF5] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => {
                if (currentStep === 2) {
                  setCurrentStep(1);
                } else if (onBackToWebsite && demoCode) {
                  onBackToWebsite(cleanCode);
                } else {
                  onBackToDashboard();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2563EB] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পেছনে ফিরুন</span>
            </button>

            <span className="px-3 py-1 rounded-xl bg-[#2563EB] text-white text-xs font-mono font-black shadow-xs">
              {demoCode}
            </span>
            <span className="text-xs sm:text-sm font-black text-[#0D253D] hidden xs:inline">
              চেকআউট ও অর্ডার
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#00B261]">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">১০০% নিরাপদ SSL চেকআউট</span>
          </div>
        </div>
      </header>

      {/* Floating Email Sent Notification (Step 1 -> Step 2 transition) */}
      {emailNotification && (
        <div className="sticky top-16 z-50 max-w-xl mx-auto px-4 py-2 animate-slideDown">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#2563EB] text-white text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#FFD552] shrink-0" />
            <div className="flex-1">
              <span>কনফার্মেশন লিংক আপনার ইমেইল এড্রেসে ({email}) পাঠানো হয়েছে।</span>
              <p className="text-[11px] text-white/80 font-normal mt-0.5">
                অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে সক্রিয় হয়েছে। নিচের ধাপে পেমেন্ট সম্পন্ন করুন।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Checkout View Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Step Indicator */}
        {currentStep !== 3 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              currentStep === 1 
                ? 'bg-[#2563EB] text-white shadow-xs' 
                : 'bg-[#00B261]/15 text-[#00B261]'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">১</span>
              <span>অ্যাকাউন্ট তৈরি</span>
            </div>

            <span className="text-[#64748D] font-bold">→</span>

            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              currentStep === 2 
                ? 'bg-[#2563EB] text-white shadow-xs' 
                : 'bg-[#F8FAFD] text-[#64748D] border border-[#E5EDF5]'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">২</span>
              <span>ডোমেইন ও পেমেন্ট</span>
            </div>
          </div>
        )}

        {/* ----------------- STEP 1: Account Creation Page ----------------- */}
        {currentStep === 1 && (
          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto animate-fadeIn">
            <div className="text-center mb-6">
              <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#2563EB] text-xs font-bold inline-block mb-2">
                ধাপ ১ • একাউন্ট তৈরি
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0D253D]">
                আপনার তথ্য দিয়ে সরাসরি চেকআউট শুরু করুন
              </h1>
              <p className="text-xs text-[#64748D] mt-1">
                আলাদা করে অ্যাকাউন্ট খোলার প্রয়োজন নেই। এই তথ্যের মাধ্যমে আপনার পোর্টাল তৈরি হয়ে যাবে।
              </p>
            </div>

            {step1Error && (
              <div className="mb-4 p-3 rounded-xl bg-[#D8351E]/10 border border-[#D8351E]/20 text-[#D8351E] text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{step1Error}</span>
              </div>
            )}

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0D253D] mb-1">
                  আপনার পুরো নাম <span className="text-[#D8351E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ সাকিব হাসান"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all font-mono"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1">
                    পাসওয়ার্ড <span className="text-[#D8351E]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="পাসওয়ার্ড দিন"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1">
                    পাসওয়ার্ড নিশ্চিত করুন <span className="text-[#D8351E]">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                  />
                </div>
              </div>

              {/* Price Reminder */}
              <div className="p-3 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] flex items-center justify-between text-xs mt-3">
                <span className="text-[#64748D]">এককালীন মেকিং চার্জ: <strong className="text-[#2563EB]">১,৯৯০ ৳</strong></span>
                <span className="text-[#64748D]">মাসিক মেইনটেন্যান্স: <strong className="text-[#2563EB]">১২০ ৳</strong></span>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                >
                  <span>পরবর্তী ধাপ (ডোমেইন ও পেমেন্ট)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ----------------- STEP 2: Main Step (Company, Domain, Payment) ----------------- */}
        {currentStep === 2 && (
          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-10 shadow-sm max-w-3xl mx-auto animate-fadeIn space-y-6">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#2563EB] text-xs font-bold inline-block mb-2">
                ধাপ ২ • ডোমেইন ও পেমেন্ট
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0D253D]">
                ব্যবসার বিবরণ ও ম্যানুয়াল পেমেন্ট সম্পন্ন করুন
              </h1>
            </div>

            {step2Error && (
              <div className="p-3 rounded-xl bg-[#D8351E]/10 border border-[#D8351E]/20 text-[#D8351E] text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{step2Error}</span>
              </div>
            )}

            <form onSubmit={handleStep2Submit} className="space-y-6">
              {/* 1. Company Name */}
              <div>
                <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                  কোম্পানি বা ব্যবসার নাম <span className="text-[#D8351E]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: স্টাইল মার্ট / টেক জোন"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                />
              </div>

              {/* 2. Domain Choice Section (3 Options in Bangla) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0D253D]">
                    ডোমেইন নির্বাচন
                  </h4>
                  <p className="text-[11px] text-[#64748D] mt-0.5">
                    ডোমেইন সম্পর্কে না জানলে নিচের ৩য় অপশনটি নির্বাচন করুন।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDomainOption('have_domain')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                      domainOption === 'have_domain'
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                        : 'bg-white text-[#0D253D] border-[#E5EDF5] hover:border-[#2563EB]/40'
                    }`}
                  >
                    আমার ডোমেন আছে
                  </button>

                  <button
                    type="button"
                    onClick={() => setDomainOption('no_domain')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                      domainOption === 'no_domain'
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                        : 'bg-white text-[#0D253D] border-[#E5EDF5] hover:border-[#2563EB]/40'
                    }`}
                  >
                    আমার ডোমেন নেই
                  </button>

                  <button
                    type="button"
                    onClick={() => setDomainOption('dont_know')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                      domainOption === 'dont_know'
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                        : 'bg-white text-[#0D253D] border-[#E5EDF5] hover:border-[#2563EB]/40'
                    }`}
                  >
                    ডোমেন কী আমি জানি না
                  </button>
                </div>

                {/* Sub-box based on selection */}
                {domainOption === 'have_domain' && (
                  <div className="pt-2 animate-fadeIn">
                    <label className="block text-xs font-bold text-[#0D253D] mb-1">
                      আপনার বিদ্যমান ডোমেইন নামটি লিখুন:
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: mybrand.com বা myshop.xyz"
                      value={customDomainName}
                      onChange={(e) => setCustomDomainName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5EDF5] text-xs font-mono text-[#0D253D] placeholder-[#7D8BA4] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                )}

                {domainOption === 'no_domain' && (
                  <p className="text-xs text-[#00B261] font-semibold bg-white p-2.5 rounded-xl border border-[#E5EDF5] animate-fadeIn">
                    ✓ আপনার প্যাকেজের সাথে ১ বছরের সম্পূর্ণ ফ্রি ডোমেইন ও হোস্টিং যুক্ত থাকবে।
                  </p>
                )}

                {domainOption === 'dont_know' && (
                  <div className="p-3 rounded-xl bg-white border border-[#E5EDF5] text-xs text-[#273951] leading-relaxed animate-fadeIn">
                    <span className="font-bold text-[#2563EB]">ডোমেন কী?</span> ডোমেন হলো ইন্টারনেটে আপনার ওয়েবসাইটের সুনির্দিষ্ট ঠিকানা (যেমন: daraz.com.bd বা bikroy.com) যার মাধ্যমে গ্রাহকরা আপনার ওয়েবসাইটে প্রবেশ করবে। প্যাকেজের সাথে ১ বছরের ফ্রি ডোমেইন অন্তর্ভুক্ত রয়েছে, যা আমাদের ইঞ্জিনিয়ার সরাসরি আপনার সাথে কথা বলে আপনার কোম্পানির নামে রেজিস্টার করে দেবে।
                  </div>
                )}
              </div>

              {/* 3. Manual Payment Method Selector (bKash, Nagad, Rocket, Upay) */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#0D253D]">
                    পেমেন্ট মেথড নির্বাচন করুন (ম্যানুয়াল পেমেন্ট)
                  </h4>
                  <p className="text-[11px] text-[#64748D]">
                    নিচের যেকোনো একটি মাধ্যমে এককালীন মেকিং চার্জ ১,৯৯০ টাকা পাঠান।
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['bkash', 'nagad', 'rocket', 'upay'] as const).map((method) => {
                    const isSelected = paymentMethod === method;
                    const labels = {
                      bkash: 'bKash (বিকাশ)',
                      nagad: 'Nagad (নগদ)',
                      rocket: 'Rocket (রকেট)',
                      upay: 'Upay (উপায়)'
                    };
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                            : 'bg-[#F8FAFD] text-[#0D253D] border-[#E5EDF5] hover:border-[#2563EB]/40'
                        }`}
                      >
                        {labels[method]}
                      </button>
                    );
                  })}
                </div>

                {/* Dedicated Payment Box with 1-Click Copy Number */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFD] border-2 border-[#2563EB]/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E5EDF5]">
                    <div>
                      <span className="text-[10px] font-bold text-[#64748D] block uppercase">
                        {paymentNumbers[paymentMethod].type}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-black text-[#0D253D]">
                        {paymentNumbers[paymentMethod].number}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? 'কপি হয়েছে!' : 'নাম্বার কপি করুন'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        ট্রানজেকশন আইডি (TrxID) <span className="text-[#D8351E]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: 8N7X2Q9L"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5EDF5] text-xs font-mono font-bold text-[#0D253D] placeholder-[#7D8BA4] uppercase focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        পেমেন্ট স্ক্রিনশট (ঐচ্ছিক)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setScreenshotName(file.name);
                        }}
                        className="w-full text-xs text-[#64748D] file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#EEF2FF] file:text-[#2563EB] hover:file:bg-[#2563EB] hover:file:text-white cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Clean Step-by-Step Payment Tutorial at Bottom */}
                  <div className="pt-3 border-t border-[#E5EDF5] text-xs text-[#273951] space-y-1.5">
                    <span className="font-bold text-[#0D253D] block">টাকা পাঠানোর নিয়মাবলি:</span>
                    <p className="text-[11px] text-[#64748D]">
                      ১. আপনার {paymentMethod.toUpperCase()} অ্যাপে প্রবেশ করে 'Send Money' করুন।
                    </p>
                    <p className="text-[11px] text-[#64748D]">
                      ২. উপরে দেয়া নম্বরে ১,৯৯০ টাকা সফলভাবে পাঠান।
                    </p>
                    <p className="text-[11px] text-[#64748D]">
                      ৩. প্রাপ্ত TrxID টি উপরের বক্সে লিখে নিচে লাল বাটনে ক্লিক করে অর্ডার কনফার্ম করুন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#64748D] block">মোট প্রদেয় এককালীন মেকিং চার্জ</span>
                  <span className="text-lg font-black text-[#0D253D]">১,৯৯০ ৳</span>
                </div>
                <div className="text-right">
                  <span className="text-[#64748D] block">মাসিক মেইনটেন্যান্স খরচ</span>
                  <span className="text-sm font-black text-[#2563EB]">১২০ ৳ / মাস</span>
                </div>
              </div>

              {/* Red Attraction Order Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#E53935] hover:bg-[#D32F2F] active:bg-[#C62828] text-white text-sm sm:text-base font-black shadow-[0_6px_24px_rgba(229,57,53,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95 animate-pulse hover:animate-none"
                >
                  <span>অর্ডার নিশ্চিত করুন (১,৯৯০ ৳)</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ----------------- STEP 3: Authentic Printable Receipt / Invoice ----------------- */}
        {currentStep === 3 && createdOrder && (
          <div className="bg-[#FFFFFF] border-2 border-[#E5EDF5] rounded-3xl p-6 sm:p-10 shadow-lg max-w-2xl mx-auto animate-fadeIn space-y-6">
            {/* Header Badge */}
            <div className="text-center pb-6 border-b border-[#E5EDF5]">
              <div className="w-14 h-14 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#2563EB] text-xs font-black font-mono inline-block mb-1">
                অর্ডার আইডি: {createdOrder.orderId}
              </span>
              <h1 className="text-2xl font-black text-[#0D253D]">
                অফিসিয়াল অর্ডার রসিদ (Official Receipt)
              </h1>
              <p className="text-xs text-[#64748D] mt-1">
                BongoWeb • ২৪ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ডেলিভারি গ্যারান্টি
              </p>
            </div>

            {/* Global Notice Alert */}
            <div className="p-4 rounded-2xl bg-[#FFD552]/20 border border-[#FFD552] text-xs font-bold text-[#8A6D00] flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>
                আপনার পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন রয়েছে। ১ মিনিট থেকে ১ ঘণ্টার মধ্যে সিস্টেম স্বয়ংক্রিয়ভাবে নিশ্চিত করবে।
              </span>
            </div>

            {/* Receipt Details Table */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">গ্রাহকের নাম:</span>
                <span className="font-bold text-[#0D253D]">{createdOrder.clientName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">কোম্পানি / ব্যবসার নাম:</span>
                <span className="font-bold text-[#0D253D]">{createdOrder.companyName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">মোবাইল নম্বর:</span>
                <span className="font-bold font-mono text-[#0D253D]">{createdOrder.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">ইমেইল এড্রেস:</span>
                <span className="font-bold font-mono text-[#0D253D]">{createdOrder.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">নির্বাচিত ওয়েবসাইট কোড:</span>
                <span className="font-bold font-mono text-[#2563EB]">{createdOrder.demoCode}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">পেমেন্ট মেথড:</span>
                <span className="font-bold text-[#0D253D] uppercase">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">ট্রানজেকশন আইডি (TrxID):</span>
                <span className="font-bold font-mono text-[#00B261]">{createdOrder.transactionId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">মেকিং চার্জ (পরিশোধিত):</span>
                <span className="font-black text-sm text-[#0D253D]">১,৯৯০ ৳</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">মাসিক মেইনটেন্যান্স খরচ:</span>
                <span className="font-bold text-[#2563EB]">১২০ ৳ / মাস</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#64748D]">অর্ডার স্ট্যাটাস:</span>
                <span className="font-bold text-[#D8351E]">পেন্ডিং ভেরিফিকেশন (১ মিনিট - ১ ঘণ্টা)</span>
              </div>
            </div>

            {/* Print & Return Buttons */}
            <div className="pt-4 border-t border-[#E5EDF5] flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>রসিদ প্রিন্ট / ডাউনলোড করুন</span>
              </button>

              <button
                onClick={onBackToDashboard}
                className="flex-1 py-3 px-4 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2563EB] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ড্যাশবোর্ডে ফিরুন</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3 Fallback if refreshed without active order object */}
        {currentStep === 3 && !createdOrder && (
          <div className="bg-[#FFFFFF] border-2 border-[#E5EDF5] rounded-3xl p-6 sm:p-10 shadow-lg max-w-xl mx-auto animate-fadeIn text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-black text-[#0D253D]">
              অর্ডার রসিদ পৃষ্ঠা
            </h2>
            <p className="text-xs sm:text-sm text-[#64748D] leading-relaxed max-w-md mx-auto">
              আপনার দেওয়া অর্ডারের রসিদ প্রস্তুত রয়েছে। নতুন অর্ডার করতে চাইলে আগের ধাপে ফিরে যেতে পারেন অথবা সরাসরি ড্যাশবোর্ড বা ক্যাটালগ দেখতে পারেন।
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2563EB] border border-[#E5EDF5] text-xs font-bold transition-all"
              >
                ← পেমেন্ট ধাপে ফিরে যান
              </button>
              <button
                type="button"
                onClick={onBackToDashboard}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#432BEE] text-white text-xs font-bold transition-all"
              >
                ড্যাশবোর্ডে যান
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
