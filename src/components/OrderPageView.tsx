import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, 
  Copy, Check, Upload, HelpCircle, Lock, 
  FileText, Download, Printer, AlertCircle, Sparkles,
  Mail, Phone, RefreshCw, KeyRound, User, Globe, Zap, MessageCircle,
  Building2, Hash, CreditCard, Smartphone
} from 'lucide-react';
import { WebsiteDemo, ClientOrder, UserAccount } from '../types';
import { 
  apiCreateOrder, apiRegisterUser, apiGetUsers, apiSendEmailOtp, apiVerifyEmailOtp,
  isStrictGmail, validateStrictBangladeshiPhone 
} from '../utils/api';
import { WEBSITE_DEMOS } from '../data/mockData';

interface OrderPageViewProps {
  demo: WebsiteDemo | string | null;
  onBackToDashboard: () => void;
  onBackToWebsite?: (code: string) => void;
  onOrderCompleted?: (order: ClientOrder) => void;
}

export type OrderStep = 1 | 'otp' | 2 | 3 | 'receipt';

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

  const demoObj: WebsiteDemo = (() => {
    if (typeof demo === 'object' && demo) return demo;
    const clean = String(demoCode || '').replace('#', '').trim().toLowerCase();
    return WEBSITE_DEMOS.find(d => String(d?.fourDigitCode || '').replace('#', '').toLowerCase() === clean) || WEBSITE_DEMOS[0];
  })();

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
  const getInitialStep = (): OrderStep => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlStep = params.get('step');
      if (urlStep === 'receipt') return 'receipt';
      if (urlStep === '3') return 3;
      if (urlStep === '2') return 2;
      if (urlStep === 'otp') return 'otp';
    } catch (_) {}
    if (saved?.createdOrder || localStorage.getItem('bongoweb_latest_order')) {
      if (saved?.currentStep === 'receipt' || saved?.currentStep === 3) return 'receipt';
    }
    if (saved?.currentStep === 'receipt') return 'receipt';
    if (saved?.currentStep === 3) return 3;
    if (saved?.currentStep === 2) return 2;
    if (saved?.currentStep === 'otp') return 'otp';
    if (loggedIn) return 2; // If already logged in, skip account creation directly to step 2!
    return 1;
  };

  // Step 1: User Info; Step 'otp': OTP verification; Step 2: Business & Domain; Step 3: Checkout/Payment; 'receipt': Standalone Receipt
  const [currentStep, setCurrentStep] = useState<OrderStep>(getInitialStep());

  // Step 1 Inputs (Client Information - No Passwords)
  const [name, setName] = useState(saved?.name || loggedIn?.name || '');
  const [phone, setPhone] = useState(saved?.phone || loggedIn?.phone || '');
  const [email, setEmail] = useState(saved?.email || loggedIn?.email || '');
  const [formConsent, setFormConsent] = useState(false);
  const [step1Error, setStep1Error] = useState('');
  const [step1Loading, setStep1Loading] = useState(false);

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [isOldUserDetected, setIsOldUserDetected] = useState(false);
  const [registeredOldNumber, setRegisteredOldNumber] = useState('');
  const lastVerifiedOtpRef = useRef<string>('');

  // Step 2 Inputs (Company & Domain)
  const [companyName, setCompanyName] = useState(saved?.companyName || '');
  const [domainOption, setDomainOption] = useState<'have_domain' | 'no_domain' | 'dont_know'>(saved?.domainOption || 'no_domain');
  const [customDomainName, setCustomDomainName] = useState(saved?.customDomainName || '');
  const [step2Error, setStep2Error] = useState('');

  // Step 3 Inputs (Payment & Checkout)
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'upay'>(saved?.paymentMethod || 'bkash');
  const [transactionId, setTransactionId] = useState(saved?.transactionId || '');
  const [screenshotName, setScreenshotName] = useState(saved?.screenshotName || '');
  const [step3Error, setStep3Error] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [emailNotification, setEmailNotification] = useState(false);

  // Final Order Receipt
  const [createdOrder, setCreatedOrder] = useState<ClientOrder | null>(getLatestSavedOrder());

  // OTP Countdown timer
  useEffect(() => {
    let timer: any;
    if (currentStep === 'otp' && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, otpCountdown]);

  // Synchronize state to both sessionStorage and localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        currentStep,
        name,
        phone,
        email,
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
      if (currentStep === 2 || currentStep === 3 || currentStep === 'receipt' || currentStep === 'otp') {
        currentUrl.searchParams.set('step', String(currentStep));
      } else {
        currentUrl.searchParams.delete('step');
      }
      window.history.replaceState({}, '', currentUrl.pathname + currentUrl.search);
    } catch (_) {}
  }, [currentStep, name, phone, email, companyName, domainOption, customDomainName, paymentMethod, transactionId, screenshotName, createdOrder, storageKey]);

  const [bkashSubtype, setBkashSubtype] = useState<'personal' | 'merchant'>('personal');

  // Authentic Payment Numbers as specified by user
  const paymentNumbers = {
    bkash_personal: {
      number: '01405005651',
      type: 'bKash Personal (Send Money)',
      actionType: 'Send Money'
    },
    bkash_merchant: {
      number: '01614255150',
      type: 'bKash Merchant (Make Payment)',
      actionType: 'Make Payment'
    },
    nagad: {
      number: '01405005651',
      type: 'Nagad Personal (Send Money)',
      actionType: 'Send Money'
    },
    rocket: {
      number: '014050056514',
      type: 'Rocket Personal (Send Money)',
      actionType: 'Send Money'
    },
    upay: {
      number: '01405005651',
      type: 'Upay Personal (Send Money)',
      actionType: 'Send Money'
    }
  };

  const currentPaymentInfo = (() => {
    if (paymentMethod === 'bkash') {
      return bkashSubtype === 'merchant' ? paymentNumbers.bkash_merchant : paymentNumbers.bkash_personal;
    }
    return paymentNumbers[paymentMethod];
  })();

  const paymentThemes = {
    bkash: {
      brand: 'bKash (বিকাশ)',
      name: 'bKash',
      badgeBg: 'bg-[#E2136E]/10',
      badgeText: 'text-[#E2136E]',
      badgeBorder: 'border-[#E2136E]/30',
      containerBg: 'bg-gradient-to-b from-[#FFF0F6] via-[#FDF2F8] to-[#FFF0F6]',
      containerBorder: 'border-2 border-[#E2136E]/40',
      containerShadow: 'shadow-[0_12px_36px_-6px_rgba(226,19,110,0.18)]',
      cardActiveTab: 'bg-gradient-to-r from-[#E2136E] to-[#D81B60] text-white border-[#E2136E] shadow-md shadow-[#E2136E]/30',
      numberBoxBg: 'bg-white border-2 border-[#E2136E]/40',
      numberText: 'text-[#E2136E]',
      copyBtn: 'bg-gradient-to-r from-[#E2136E] to-[#D81B60] hover:from-[#D81B60] hover:to-[#C2185B] text-white shadow-xs',
      stepBoxBg: 'bg-white/90 border border-[#E2136E]/30',
      stepTitle: 'text-[#E2136E]',
      inputFocus: 'focus:border-[#E2136E] focus:ring-2 focus:ring-[#E2136E]/20',
      accentColor: '#E2136E',
      cardOuterBg: 'bg-gradient-to-b from-[#FFF5F9] via-white to-[#FFF0F6] border-2 border-[#E2136E]/35 shadow-[0_20px_50px_-10px_rgba(226,19,110,0.18)]',
      glowBar: 'bg-gradient-to-r from-[#E2136E] via-[#FF2E93] to-[#E2136E]',
      tagBg: 'bg-[#E2136E]',
      tagText: 'text-[#E2136E]'
    },
    nagad: {
      brand: 'Nagad (নগদ)',
      name: 'Nagad',
      badgeBg: 'bg-[#EA580C]/10',
      badgeText: 'text-[#EA580C]',
      badgeBorder: 'border-[#EA580C]/30',
      containerBg: 'bg-gradient-to-b from-[#FFF7ED] via-[#FFEDD5]/50 to-[#FFF7ED]',
      containerBorder: 'border-2 border-[#EA580C]/40',
      containerShadow: 'shadow-[0_12px_36px_-6px_rgba(234,88,12,0.18)]',
      cardActiveTab: 'bg-gradient-to-r from-[#EA580C] to-[#F97316] text-white border-[#EA580C] shadow-md shadow-[#EA580C]/30',
      numberBoxBg: 'bg-white border-2 border-[#EA580C]/40',
      numberText: 'text-[#EA580C]',
      copyBtn: 'bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white shadow-xs',
      stepBoxBg: 'bg-white/90 border border-[#EA580C]/30',
      stepTitle: 'text-[#EA580C]',
      inputFocus: 'focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20',
      accentColor: '#EA580C',
      cardOuterBg: 'bg-gradient-to-b from-[#FFF9F5] via-white to-[#FFF7ED] border-2 border-[#EA580C]/35 shadow-[0_20px_50px_-10px_rgba(234,88,12,0.18)]',
      glowBar: 'bg-gradient-to-r from-[#F7941D] via-[#FF6F00] to-[#EA580C]',
      tagBg: 'bg-[#EA580C]',
      tagText: 'text-[#EA580C]'
    },
    rocket: {
      brand: 'Rocket (রকেট)',
      name: 'Rocket',
      badgeBg: 'bg-[#8C3494]/10',
      badgeText: 'text-[#8C3494]',
      badgeBorder: 'border-[#8C3494]/30',
      containerBg: 'bg-gradient-to-b from-[#FAF5FF] via-[#F3E8FF]/50 to-[#FAF5FF]',
      containerBorder: 'border-2 border-[#8C3494]/40',
      containerShadow: 'shadow-[0_12px_36px_-6px_rgba(140,52,148,0.18)]',
      cardActiveTab: 'bg-gradient-to-r from-[#8C3494] to-[#702978] text-white border-[#8C3494] shadow-md shadow-[#8C3494]/30',
      numberBoxBg: 'bg-white border-2 border-[#8C3494]/40',
      numberText: 'text-[#8C3494]',
      copyBtn: 'bg-gradient-to-r from-[#8C3494] to-[#702978] hover:from-[#702978] hover:to-[#571B60] text-white shadow-xs',
      stepBoxBg: 'bg-white/90 border border-[#8C3494]/30',
      stepTitle: 'text-[#8C3494]',
      inputFocus: 'focus:border-[#8C3494] focus:ring-2 focus:ring-[#8C3494]/20',
      accentColor: '#8C3494',
      cardOuterBg: 'bg-gradient-to-b from-[#FAF5FF] via-white to-[#F5EEF8] border-2 border-[#8C3494]/35 shadow-[0_20px_50px_-10px_rgba(140,52,148,0.18)]',
      glowBar: 'bg-gradient-to-r from-[#8C3494] via-[#A855F7] to-[#701A75]',
      tagBg: 'bg-[#8C3494]',
      tagText: 'text-[#8C3494]'
    },
    upay: {
      brand: 'Upay (উপায়)',
      name: 'Upay',
      badgeBg: 'bg-[#0284C7]/10',
      badgeText: 'text-[#0284C7]',
      badgeBorder: 'border-[#0284C7]/30',
      containerBg: 'bg-gradient-to-b from-[#F0F9FF] via-[#E0F2FE]/50 to-[#F0F9FF]',
      containerBorder: 'border-2 border-[#0284C7]/40',
      containerShadow: 'shadow-[0_12px_36px_-6px_rgba(2,132,199,0.18)]',
      cardActiveTab: 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white border-[#0284C7] shadow-md shadow-[#0284C7]/30',
      numberBoxBg: 'bg-white border-2 border-[#0284C7]/40',
      numberText: 'text-[#0284C7]',
      copyBtn: 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white shadow-xs',
      stepBoxBg: 'bg-white/90 border border-[#0284C7]/30',
      stepTitle: 'text-[#0284C7]',
      inputFocus: 'focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20',
      accentColor: '#0284C7',
      cardOuterBg: 'bg-gradient-to-b from-[#F0F9FF] via-white to-[#E0F2FE]/40 border-2 border-[#0284C7]/35 shadow-[0_20px_50px_-10px_rgba(2,132,199,0.18)]',
      glowBar: 'bg-gradient-to-r from-[#00AEEF] via-[#38BDF8] to-[#0284C7]',
      tagBg: 'bg-[#0284C7]',
      tagText: 'text-[#0284C7]'
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentPaymentInfo.number);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2200);
  };

  // Step 1: User Enters Info -> Send OTP
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Error('');

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setStep1Error('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    const phoneCheck = validateStrictBangladeshiPhone(cleanPhone);
    if (!phoneCheck.valid) {
      setStep1Error(phoneCheck.error || 'সঠিক ১১-সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন। কোনো ফেক বা অস্থায়ী (Temporary) নম্বর গ্রহণযোগ্য নয়।');
      return;
    }

    if (!isStrictGmail(cleanEmail)) {
      setStep1Error('শুধুমাত্র জিমেইল (@gmail.com) এড্রেস গ্রহণযোগ্য। অন্য কোনো ইমেইল এড্রেস গ্রহণযোগ্য নয়।');
      return;
    }

    if (!formConsent) {
      setStep1Error('অনুগ্রহ করে আমাদের টার্মস ও কন্ডিশনস, প্রাইভেসি পলিসি (DPDP Act) এবং রিফান্ড পলিসিতে সম্মতি প্রদান করুন।');
      return;
    }

    setStep1Loading(true);
    try {
      const res = await apiSendEmailOtp(cleanEmail, 'signup', cleanPhone);
      if (res.success) {
        setOtpCode('');
        setOtpError('');
        setOtpCountdown(60);
        setCurrentStep('otp');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStep1Error(res.error || 'ওটিপি পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setStep1Error(err?.message || 'ইমেইলে ওটিপি পাঠানো সম্ভব হয়নি।');
    } finally {
      setStep1Loading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpSending || otpCountdown > 0) return;
    setOtpSending(true);
    setOtpError('');
    try {
      const res = await apiSendEmailOtp(email.trim().toLowerCase(), 'signup', phone.trim());
      if (res.success) {
        setOtpCountdown(60);
      } else {
        setOtpError(res.error || 'পুনরায় কোড পাঠানো যায়নি।');
      }
    } catch (_) {
      setOtpError('পুনরায় কোড পাঠানো যায়নি।');
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP and auto-recognize old vs new user
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otpCode).trim();
    if (code.length < 6 || otpVerifying) return;
    if (lastVerifiedOtpRef.current === code) return;

    setOtpVerifying(true);
    setOtpError('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      const verifyRes = await apiVerifyEmailOtp(cleanEmail, code);

      if (verifyRes.success) {
        lastVerifiedOtpRef.current = code;

        // Auto-check if old user or new user
        const allUsers = await apiGetUsers().catch(() => []);
        const existing = allUsers.find(
          (u) => (u.email || '').trim().toLowerCase() === cleanEmail
        );

        if (existing) {
          // OLD USER:
          // User requirement: If he is an old user, use the old number that he used to create the account before.
          // He cannot change the number by ordering something.
          const oldPhone = existing.phone || phone.trim();
          setPhone(oldPhone);
          setIsOldUserDetected(true);
          setRegisteredOldNumber(oldPhone);
          if (existing.name && !name) {
            setName(existing.name);
          }

          const updatedUser: UserAccount = {
            ...existing,
            phone: oldPhone,
            numberVerified: true
          };
          localStorage.setItem('bongoweb_user', JSON.stringify(updatedUser));
          sessionStorage.setItem('bongoweb_user', JSON.stringify(updatedUser));
        } else {
          // NEW USER:
          // User requirement: Automatically create an account for him.
          setIsOldUserDetected(false);
          const newUser: UserAccount = {
            name: name.trim(),
            phone: phone.trim(),
            email: cleanEmail,
            registeredAt: new Date().toLocaleDateString('en-US'),
            numberVerified: true
          };
          await apiRegisterUser(newUser).catch(() => {});
          localStorage.setItem('bongoweb_user', JSON.stringify(newUser));
          sessionStorage.setItem('bongoweb_user', JSON.stringify(newUser));
        }

        // Show confirmation banner & shift to Step 2 (Domain & Payment)
        setEmailNotification(true);
        setTimeout(() => setEmailNotification(false), 4500);

        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setOtpError(verifyRes.error || 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি কোড! আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setOtpError(err?.message || 'ওটিপি যাচাইয়ে সমস্যা হয়েছে।');
    } finally {
      setOtpVerifying(false);
    }
  };

  // Auto-verify when 6 digits are typed in OTP input
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(val);
    setOtpError('');
    if (val.length === 6) {
      handleVerifyOtp(val);
    }
  };

  // Step 2 Submission: Business Name & Domain Validation -> Move to Step 3
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Error('');

    if (!companyName.trim()) {
      setStep2Error('অনুগ্রহ করে আপনার কোম্পানি বা ব্যবসার নাম লিখুন।');
      return;
    }
    if (domainOption === 'have_domain' && !customDomainName.trim()) {
      setStep2Error('অনুগ্রহ করে আপনার বিদ্যমান ডোমেইন নামটি লিখুন (যেমন: myshop.com)।');
      return;
    }

    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 Submission: Main Order & Payment Checkout
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Error('');

    if (!transactionId.trim()) {
      setStep3Error('পেমেন্ট পাঠানোর পর প্রাপ্ত ট্রানজেকশন আইডি (TrxID) লিখুন।');
      return;
    }

    setSubmittingOrder(true);
    try {
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
        paymentPhone: currentPaymentInfo.number,
        transactionId: transactionId.trim().toUpperCase(),
        makingCharge: 1990,
        monthlyCost: 250,
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
      setCurrentStep('receipt');
      if (onOrderCompleted) onOrderCompleted(newOrder);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err: any) {
      setStep3Error(err?.message || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F5FC] text-[#1F1F2E] flex flex-col font-sans pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#5B2C8A] border-b border-[#4A1F6E] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => {
                if (currentStep === 'receipt') {
                  onBackToDashboard();
                } else if (currentStep === 3) {
                  setCurrentStep(2);
                } else if (currentStep === 2) {
                  setCurrentStep(1);
                } else if (currentStep === 'otp') {
                  setCurrentStep(1);
                } else if (onBackToWebsite && demoCode) {
                  onBackToWebsite(cleanCode);
                } else {
                  onBackToDashboard();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/35 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span>পেছনে ফিরুন</span>
            </button>

            <span className="px-3 py-1 rounded-xl bg-white/20 text-white text-xs font-mono font-bold shadow-xs">
              {demoCode}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white hidden xs:inline">
              চেকআউট ও অর্ডার
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">১০০% নিরাপদ SSL চেকআউট</span>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {emailNotification && (
        <div className="sticky top-16 z-50 max-w-xl mx-auto px-4 py-2 animate-slideDown">
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2.5 border border-purple-400/30">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <div className="flex-1">
              <span>ইমেইল সফলভাবে ভেরিফাইড হয়েছে!</span>
              <p className="text-[11px] text-white/90 font-normal mt-0.5">
                {isOldUserDetected 
                  ? `স্বাগতম! আপনার নিবন্ধিত নম্বর (${phone}) ভেরিফাইড রয়েছে। নিচের ধাপে ব্যবসার নাম ও ডোমেন দিন।`
                  : `আপনার অ্যাকাউন্ট প্রস্তুত হয়েছে। নিচের ধাপে ব্যবসার নাম ও ডোমেন দিন।`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Checkout View Container */}
      <main className="flex-1 w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Mobile Product Summary Header (Visible on Mobile only, perfectly fits viewport) */}
        {currentStep !== 'receipt' && (
          <div className="lg:hidden mb-4 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-3">
            <div className="w-14 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shrink-0">
              <img 
                src={demoObj.previewImage} 
                alt={demoTitle}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover object-top" 
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-mono text-[10px] font-bold">
                  {demoCode}
                </span>
                <span className="text-xs font-black text-purple-700 font-mono">
                  {demoObj.priceTag || '৳১,৯৯০'}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {demoTitle}
              </h3>
            </div>
          </div>
        )}

        {/* Easy-to-Understand 3-Step Order Progress Bar (ONLY shown before order completion, NOT shown on receipt) */}
        {currentStep !== 'receipt' && (
          <div className="mb-6 sm:mb-8 max-w-xl mx-auto">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-white border border-slate-200/90 shadow-md">
              {/* Step 1 */}
              <div className={`flex items-center gap-1.5 sm:gap-2 p-2 rounded-xl transition-all ${
                currentStep === 1 || currentStep === 'otp'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                  currentStep === 1 || currentStep === 'otp'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {(currentStep === 2 || currentStep === 3) ? '✓' : '১'}
                </span>
                <div className="min-w-0">
                  <span className="block text-[11px] sm:text-xs font-bold truncate leading-tight">
                    ১. অ্যাকাউন্ট
                  </span>
                  <span className={`text-[9px] sm:text-[10px] block truncate leading-none mt-0.5 ${
                    currentStep === 1 || currentStep === 'otp' ? 'text-white/85' : 'text-slate-500'
                  }`}>
                    নাম ও যোগাযোগ
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`flex items-center gap-1.5 sm:gap-2 p-2 rounded-xl transition-all ${
                currentStep === 2
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                  : currentStep === 3
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border border-slate-200'
              }`}>
                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                  currentStep === 2
                    ? 'bg-white/20 text-white'
                    : currentStep === 3
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                }`}>
                  {currentStep === 3 ? '✓' : '২'}
                </span>
                <div className="min-w-0">
                  <span className="block text-[11px] sm:text-xs font-bold truncate leading-tight">
                    ২. ব্যবসা ও ডোমেন
                  </span>
                  <span className={`text-[9px] sm:text-[10px] block truncate leading-none mt-0.5 ${
                    currentStep === 2 ? 'text-white/85' : 'text-slate-500'
                  }`}>
                    ব্র্যান্ড ও ডোমেইন
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`flex items-center gap-1.5 sm:gap-2 p-2 rounded-xl transition-all ${
                currentStep === 3
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-50 text-slate-500 border border-slate-200'
              }`}>
                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                  currentStep === 3
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  ৩
                </span>
                <div className="min-w-0">
                  <span className="block text-[11px] sm:text-xs font-bold truncate leading-tight">
                    ৩. চেকআউট
                  </span>
                  <span className={`text-[9px] sm:text-[10px] block truncate leading-none mt-0.5 ${
                    currentStep === 3 ? 'text-white/85' : 'text-slate-500'
                  }`}>
                    বিকাশ/নগদ ১,৯৯০৳
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep !== 'receipt' ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
            {/* Desktop Order Summary Sidebar (Laptop/Computer View Only) */}
            <aside className="hidden lg:block lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4 select-none">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-md space-y-5 text-slate-900">
                {/* Product Thumbnail & Details */}
                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shrink-0">
                    <img 
                      src={demoObj.previewImage} 
                      alt={demoTitle}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover object-top" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-mono text-[11px] font-bold mb-1">
                      {demoCode}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 truncate leading-tight" title={demoTitle}>
                      {demoTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {demoObj.categoryLabel || 'ব্যবসার ওয়েবসাইট'}
                    </p>
                  </div>
                </div>

                {/* Transparent Financial Architecture Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>ওয়েবসাইট মেকিং ও লাইভ সেটআপ:</span>
                    <span className="font-bold text-slate-900 font-mono">৳১,৯৯০</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>১ বছর ফ্রি .com ডোমেইন:</span>
                    <span className="font-bold text-emerald-600">৳০ (ফ্রি)</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>NVMe হাই-স্পিড ক্লাউড হোস্টিং:</span>
                    <span className="font-bold text-emerald-600">৳০ (ফ্রি)</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>লাইফটাইম SSL সিকিউরিটি:</span>
                    <span className="font-bold text-emerald-600">৳০ (ফ্রি)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900">মোট এককালীন প্রদেয়:</span>
                    <span className="text-xl font-black text-purple-700 font-mono">১,৯৯০ ৳</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">
                    সার্ভার মেইনটেন্যান্স: মাত্র ১২০ টাকা / মাস (৯৯.৯% আপটাইম)
                  </p>
                </div>

                {/* Core Guarantees */}
                <div className="p-3.5 rounded-2xl bg-[#F8F5FC] border border-[#EDE4F5] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Zap className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>২৪ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ডেলিভারি</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>৭ দিনের ১০০% মানিব্যাক গ্যারান্টি</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>মোবাইল, ট্যাবলেট ও ডেক্সটপ রেসপন্সিভ</span>
                  </div>
                </div>

                {/* Hotline Assistance */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">সাহায্য প্রয়োজন?</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://wa.me/8801955570912"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <span className="text-slate-300">•</span>
                    <a
                      href="tel:+8801955570912"
                      className="text-purple-700 hover:text-purple-800 font-bold font-mono"
                    >
                      01955570912
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Column: Active Step Form */}
            <div className="lg:col-span-7 xl:col-span-8">
              {/* ----------------- STEP 1: Client Information (No Password) ----------------- */}
              {currentStep === 1 && (
                <div className="bg-white border-2 border-[#5B2C8A]/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_-10px_rgba(91,44,138,0.15)] max-w-2xl mx-auto animate-fadeIn text-slate-900 relative overflow-hidden space-y-6">
                  {/* Top Glowing Ambient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5B2C8A] via-[#8C3494] to-[#7C3AED]" />

                  <div className="text-center pt-2">
                    <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black inline-flex items-center gap-1.5 mb-2.5 border border-purple-200 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                      ১ম ধাপ: আপনার মৌলিক তথ্য দিন
                    </span>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                      সহজ ও নিরাপদ চেকআউট
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                      কোনো পাসওয়ার্ড ছাড়াই শুধু নাম, মোবাইল ও ইমেইল লিখুন। এরপরের ধাপে বিকাশ বা নগদে পেমেন্ট সম্পন্ন করবেন।
                    </p>
                  </div>

                  {step1Error && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2.5 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{step1Error}</span>
                    </div>
                  )}

                  <form onSubmit={handleStep1Submit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        আপনার পুরো নাম <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="যেমন: মোঃ সাকিব হাসান"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                          স্থায়ী নম্বর আবশ্যক
                        </span>
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          maxLength={11}
                          placeholder="017xxxxxxxx বা 019xxxxxxxx"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/\D/g, '').slice(0, 11));
                            if (step1Error) setStep1Error('');
                          }}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all font-mono shadow-2xs font-bold"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        ১১ ডিজিটের সক্রিয় বাংলাদেশি নম্বর দিন (অস্থায়ী বা ফেক নম্বর গ্রহণ করা হবে না)।
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          জিমেইল এড্রেস (Gmail Address Only) <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                          শুধুমাত্র @gmail.com
                        </span>
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="username@gmail.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (step1Error) setStep1Error('');
                          }}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 transition-all font-mono shadow-2xs font-medium"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        ইমেইল ভেরিফিকেশনের জন্য আপনার জিমেইলে ৬-সংখ্যার ওটিপি কোড পাঠানো হবে।
                      </span>
                    </div>

                    {/* Price & Free Benefits Capsule */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/90 border border-purple-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs text-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[11px]">এককালীন সেটআপ চার্জ</span>
                        <strong className="text-purple-800 text-base font-black font-mono">১,৯৯০ ৳</strong>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-slate-500 block text-[11px]">ক্লাউড হোস্টিং ও সাপোর্ট</span>
                        <strong className="text-purple-800 text-xs font-black">২৫০ টাকা / মাস</strong>
                      </div>
                    </div>

                    {/* Form Consent Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formConsent}
                          onChange={(e) => {
                            setFormConsent(e.target.checked);
                            if (step1Error) setStep1Error('');
                          }}
                          className="mt-0.5 w-4 h-4 rounded text-[#5B2C8A] border-slate-300 focus:ring-[#5B2C8A] cursor-pointer"
                          required
                        />
                        <span className="leading-relaxed">
                          আমি BongoWeb এর{' '}
                          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#5B2C8A] font-bold underline">
                            টার্মস অ্যান্ড কন্ডিশনস
                          </a>
                          ,{' '}
                          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#5B2C8A] font-bold underline">
                            প্রাইভেসি পলিসি (DPDP Act)
                          </a>{' '}
                          এবং{' '}
                          <a href="/refund" target="_blank" rel="noopener noreferrer" className="text-[#5B2C8A] font-bold underline">
                            ৭ দিনের রিফান্ড পলিসি
                          </a>{' '}
                          পড়েছি ও সম্মত আছি।
                        </span>
                      </label>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={step1Loading}
                        className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-[0_8px_25px_rgba(91,44,138,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-60"
                      >
                        {step1Loading ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>ওটিপি কোড পাঠানো হচ্ছে...</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <span>পরবর্তী ধাপ (ওটিপি যাচাই)</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}


        {/* ----------------- STEP 'otp': OTP Verification Page ----------------- */}
        {currentStep === 'otp' && (
          <div className="bg-white border-2 border-[#5B2C8A]/20 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_-10px_rgba(91,44,138,0.15)] max-w-xl mx-auto animate-fadeIn space-y-6 text-slate-900 relative overflow-hidden">
            {/* Top Glowing Ambient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5B2C8A] via-[#8C3494] to-[#7C3AED]" />
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Mail className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold inline-block mb-2 border border-purple-200">
                ইমেইল ওটিপি যাচাই
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ৬-সংখ্যার কোডটি প্রবেশ করান
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-sm mx-auto">
                <strong className="text-purple-700 font-bold">{email}</strong> ঠিকানায় একটি ৬-সংখ্যার ভেরিফিকেশন কোড পাঠানো হয়েছে।
              </p>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="mt-1 text-xs text-purple-600 hover:text-purple-700 hover:underline font-semibold cursor-pointer"
              >
                ইমেইল বা ফোন পরিবর্তন করুন
              </button>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            {/* OTP Input Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>৬-ডিজিটের কোড</span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  টাইপ করলেই স্বয়ংক্রিয় ভেরিফাই হবে
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="● ● ● ● ● ●"
                  value={otpCode}
                  onChange={handleOtpChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-center font-mono font-black tracking-[0.4em] text-xl text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all shadow-xs"
                />
                {otpVerifying && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-purple-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-xs">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>যাচাই হচ্ছে...</span>
                  </div>
                )}
              </div>

              {/* Resend button */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">কোড পাননি?</span>
                {otpCountdown > 0 ? (
                  <span className="text-slate-500 font-mono text-[11px]">
                    পুনরায় পাঠাতে অপেক্ষা করুন: {otpCountdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpSending}
                    className="text-purple-600 hover:text-purple-700 hover:underline font-bold cursor-pointer"
                  >
                    {otpSending ? 'পাঠানো হচ্ছে...' : 'পুনরায় কোড পাঠান'}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={otpCode.length < 6 || otpVerifying}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {otpVerifying ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>যাচাই হচ্ছে...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>যাচাই করুন ও ডোমেইন ধাপে যান</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
              >
                ← তথ্য সংশোধন করুন
              </button>
            </div>
          </div>
        )}

        {/* ----------------- STEP 2: Business Name & Domain Selection ----------------- */}
        {currentStep === 2 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-9 shadow-lg max-w-3xl mx-auto animate-fadeIn space-y-6 text-slate-900 relative overflow-hidden">
            {/* Top Glow Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600" />

            {/* Header: Clean & Compact */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 pt-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
                    ২য় ধাপ
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    ব্যবসার নাম ও ডোমেন নির্বাচন
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  আপনার কোম্পানির নাম লিখুন এবং আপনার ডোমেন পছন্দ নির্ধারণ করুন।
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-200/80 self-start sm:self-auto shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800 truncate max-w-[140px] sm:max-w-[180px]">{name}</span>
                <span className="text-slate-400">•</span>
                <span className="font-mono text-slate-600">{phone}</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-[11px] text-purple-700 hover:underline font-bold ml-1 cursor-pointer"
                >
                  সংশোধন
                </button>
              </div>
            </div>

            {step2Error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{step2Error}</span>
              </div>
            )}

            <form onSubmit={handleProceedToPayment} className="space-y-5">
              {/* 1. Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  কোম্পানি বা ব্যবসার নাম <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: স্টাইল মার্ট বা টেক জোন"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (step2Error) setStep2Error('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all shadow-2xs"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  এই নামটি আপনার ওয়েবসাইটের ব্র্যান্ডিং, লোগো ও ফুটারে সেট করা হবে।
                </p>
              </div>

              {/* 2. Domain Choice */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    ডোমেইন নির্বাচন
                  </label>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ১ বছর ফ্রি .com ডোমেইন অন্তর্ভুক্ত
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDomainOption('no_domain')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      domainOption === 'no_domain'
                        ? 'bg-[#5B2C8A] text-white border-[#5B2C8A] shadow-md shadow-purple-900/10'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">ডোমেন নেই (ফ্রি)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${domainOption === 'no_domain' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                        পছন্দের
                      </span>
                    </div>
                    <p className={`text-[11px] leading-tight ${domainOption === 'no_domain' ? 'text-white/80' : 'text-slate-500'}`}>
                      ১ বছর ফ্রি .com ডোমেইন উপহার
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDomainOption('have_domain')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      domainOption === 'have_domain'
                        ? 'bg-[#5B2C8A] text-white border-[#5B2C8A] shadow-md shadow-purple-900/10'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">ডোমেন আছে</span>
                    </div>
                    <p className={`text-[11px] leading-tight ${domainOption === 'have_domain' ? 'text-white/80' : 'text-slate-500'}`}>
                      বিদ্যমান ডোমেইন ব্যবহার করুন
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDomainOption('dont_know')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      domainOption === 'dont_know'
                        ? 'bg-[#5B2C8A] text-white border-[#5B2C8A] shadow-md shadow-purple-900/10'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">ডোমেন কী জানি না</span>
                    </div>
                    <p className={`text-[11px] leading-tight ${domainOption === 'dont_know' ? 'text-white/80' : 'text-slate-500'}`}>
                      সাপোর্ট টিম বুঝিয়ে দেবে
                    </p>
                  </button>
                </div>

                {domainOption === 'have_domain' && (
                  <div className="mt-3 animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      আপনার বর্তমান ডোমেইন নাম
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: mybrand.com"
                      value={customDomainName}
                      onChange={(e) => setCustomDomainName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                    />
                  </div>
                )}
              </div>

              {/* Package Inclusion Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-purple-50/70 border border-purple-100 space-y-2">
                <span className="text-xs font-bold text-purple-900 block">
                  ওয়েবসাইটের সাথে যা যা পাচ্ছেন:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> ১ বছর ফ্রি .com ডোমেইন
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> NVMe ক্লাউড হোস্টিং
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> লাইফটাইম SSL সিকিউরিটি
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> মোবাইল রেসপন্সিভ
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> ২৪ ঘণ্টায় ডেলিভারি
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> ৭ দিনের মানিব্যাক গ্যারান্টি
                  </span>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto py-3 px-7 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
                >
                  <span>পরবর্তী ধাপ: পেমেন্ট ও চেকআউট (৩য় ধাপ)</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ----------------- STEP 3: Dedicated Checkout & Dynamic Themed Payment ----------------- */}
        {currentStep === 3 && (
          <div className={`rounded-3xl p-6 sm:p-8 md:p-9 shadow-lg max-w-3xl mx-auto animate-fadeIn space-y-5 text-slate-900 border-2 transition-all duration-300 relative overflow-hidden ${paymentThemes[paymentMethod].containerBg} ${paymentThemes[paymentMethod].containerBorder}`}>
            {/* Top Glow Bar matching the payment method brand color */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${paymentThemes[paymentMethod].glowBar}`} />

            {/* Header: Clean & Informative */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/60 pt-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${paymentThemes[paymentMethod].badgeBg} ${paymentThemes[paymentMethod].badgeText}`}>
                    ৩য় ধাপ: চেকআউট
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    নিরাপদ পেমেন্ট ও চেকআউট
                  </h2>
                </div>
                <p className="text-xs text-slate-600">
                  নিচের নম্বরে ১,৯৯০ ৳ পাঠিয়ে প্রাপ্ত TrxID লিখুন।
                </p>
              </div>

              {/* Order Info Capsule */}
              <div className="flex items-center gap-2 text-xs bg-white/90 backdrop-blur-xs py-1.5 px-3 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto shrink-0">
                <Building2 className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <span className="font-bold text-slate-800 truncate max-w-[140px] sm:max-w-[180px]">{companyName}</span>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-[11px] text-purple-700 hover:underline font-bold cursor-pointer"
                >
                  পরিবর্তন
                </button>
              </div>
            </div>

            {step3Error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{step3Error}</span>
              </div>
            )}

            <form onSubmit={handleStep3Submit} className="space-y-4 sm:space-y-5">
              {/* Payment Method Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    পেমেন্ট মেথড নির্বাচন করুন
                  </label>
                  {paymentMethod === 'bkash' && (
                    <div className="inline-flex items-center gap-1 bg-[#FFF0F6] p-0.5 rounded-lg border border-[#E2136E]/30 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setBkashSubtype('personal')}
                        className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          bkashSubtype === 'personal'
                            ? 'bg-[#E2136E] text-white shadow-2xs'
                            : 'text-[#E2136E] hover:bg-[#E2136E]/10'
                        }`}
                      >
                        পার্সোনাল
                      </button>
                      <button
                        type="button"
                        onClick={() => setBkashSubtype('merchant')}
                        className={`px-2.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          bkashSubtype === 'merchant'
                            ? 'bg-[#E2136E] text-white shadow-2xs'
                            : 'text-[#E2136E] hover:bg-[#E2136E]/10'
                        }`}
                      >
                        মার্চেন্ট
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['bkash', 'nagad', 'rocket', 'upay'] as const).map((method) => {
                    const isSelected = paymentMethod === method;
                    const labels = {
                      bkash: 'bKash বিকাশ',
                      nagad: 'Nagad নগদ',
                      rocket: 'Rocket রকেট',
                      upay: 'Upay উপায়'
                    };
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          isSelected
                            ? paymentThemes[method].cardActiveTab
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {labels[method]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Account Number Box */}
              <div className="bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-white/90 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${paymentThemes[paymentMethod].badgeBg} ${paymentThemes[paymentMethod].badgeText}`}>
                        {currentPaymentInfo.type}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {currentPaymentInfo.actionType} করুন
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        ১,৯৯০ ৳
                      </span>
                    </div>
                    <div className={`text-2xl sm:text-3xl font-mono font-black tracking-wider mt-1.5 ${paymentThemes[paymentMethod].numberText}`}>
                      {currentPaymentInfo.number}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className={`px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0 ${paymentThemes[paymentMethod].copyBtn}`}
                  >
                    {copiedNumber ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedNumber ? 'কপি হয়েছে!' : 'নাম্বার কপি করুন'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    আপনার {paymentThemes[paymentMethod].name} অ্যাপ থেকে উপরের নম্বরে ১,৯৯০ ৳ পাঠিয়ে TrxID কপি করে নিচে বসান।
                  </span>
                </div>
              </div>

              {/* TrxID + Screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-slate-500" />
                    <span>ট্রানজেকশন আইডি (TrxID)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 8N7X2Q9L"
                    value={transactionId}
                    onChange={(e) => {
                      setTransactionId(e.target.value);
                      if (step3Error) setStep3Error('');
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-mono font-black text-slate-900 placeholder:text-slate-400 uppercase outline-none transition-all ${paymentThemes[paymentMethod].inputFocus} shadow-2xs`}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    টাকা পাঠানোর পর প্রাপ্ত SMS বা স্টেটমেন্টের TrxID
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>স্ক্রিনশট (ঐচ্ছিক)</span>
                    </span>
                    {screenshotName && (
                      <span className="text-[10px] text-emerald-700 font-bold truncate max-w-[120px]">
                        ✓ আপলোড হয়েছে
                      </span>
                    )}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setScreenshotName(file.name);
                    }}
                    className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:text-slate-800 file:shadow-2xs hover:file:bg-slate-100 cursor-pointer bg-white/70 rounded-xl border border-slate-300/80 p-1"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    দ্রুততম ভেরিফিকেশনের জন্য স্ক্রিনশট দিতে পারেন
                  </p>
                </div>
              </div>

              {/* Bottom Buttons & Guarantee */}
              <div className="pt-3 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-white/80 text-xs font-bold transition-all cursor-pointer text-center sm:text-left"
                >
                  ← আগের ধাপে (ব্যবসা ও ডোমেন) ফিরুন
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="text-center sm:text-right">
                    <div className="flex items-baseline gap-1.5 justify-center sm:justify-end">
                      <span className="text-xs text-slate-500">মোট প্রদেয়:</span>
                      <span className="text-xl font-black text-slate-900 font-mono">১,৯৯০ ৳</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium">৭ দিনের ১০০% মানিব্যাক গ্যারান্টি</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] active:bg-[#C62828] text-white text-xs sm:text-sm font-black shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submittingOrder ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>প্রসেসিং হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <span>অর্ডার নিশ্চিত করুন (১,৯৯০ ৳)</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
            </div>
          </div>
        ) : null}

        {/* ----------------- RECEIPT: Standalone Clean Official Receipt (NOT in section way) ----------------- */}
        {currentStep === 'receipt' && (
          <div className="max-w-2xl lg:max-w-3xl mx-auto space-y-6 animate-fadeIn text-slate-900">
            {/* Success Celebration Banner */}
            <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black font-mono inline-block border border-emerald-300">
                  অর্ডার আইডি: {createdOrder?.orderId || '#BW-PENDING'}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  অভিনন্দন! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                  ধন্যবাদ <strong className="text-slate-900">{createdOrder?.clientName || name}</strong>! আগামী ২৪ ঘণ্টার মধ্যে আমাদের ইঞ্জিনিয়ার টিম আপনার ওয়েবসাইটটি সম্পূর্ণ প্রস্তুত ও লাইভ করবে।
                </p>
              </div>

              {/* Status Alert */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন রয়েছে (১ মিনিট থেকে ১ ঘণ্টার মধ্যে সিস্টেম স্বয়ংক্রিয়ভাবে নিশ্চিত করবে)।
                </span>
              </div>
            </div>

            {/* Official Order Receipt Card / Invoice */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    অফিসিয়াল ইনভয়েস ও রসিদ
                  </h2>
                  <p className="text-xs text-slate-500">
                    BongoWeb • ২৪ ঘণ্টা লাইভ ডেলিভারি গ্যারান্টি
                  </p>
                </div>
                <div className="text-xs sm:text-right text-slate-500">
                  <span>তারিখ: {createdOrder?.createdAt || new Date().toLocaleString('bn-BD')}</span>
                </div>
              </div>

              {/* Receipt Details Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">গ্রাহকের নাম:</span>
                  <span className="font-bold text-slate-900">{createdOrder?.clientName || name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">কোম্পানি / ব্যবসার নাম:</span>
                  <span className="font-bold text-slate-900">{createdOrder?.companyName || companyName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">মোবাইল নম্বর:</span>
                  <span className="font-bold font-mono text-slate-900">{createdOrder?.phone || phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">ইমেইল এড্রেস:</span>
                  <span className="font-bold font-mono text-slate-900">{createdOrder?.email || email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">নির্বাচিত ওয়েবসাইট কোড:</span>
                  <span className="font-bold font-mono text-purple-700">{createdOrder?.demoCode || demoCode}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">ডোমেন স্ট্যাটাস:</span>
                  <span className="font-bold text-slate-900">
                    {(createdOrder?.domainOption || domainOption) === 'have_domain'
                      ? `বিদ্যমান ডোমেইন (${createdOrder?.customDomain || customDomainName})`
                      : (createdOrder?.domainOption || domainOption) === 'no_domain'
                        ? '১ বছর ফ্রি .com ডোমেইন অন্তর্ভুক্ত'
                        : 'পরে সাপোর্ট টিম বুঝিয়ে দেবে'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">পেমেন্ট মেথড:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {(createdOrder?.paymentMethod || paymentMethod)} {createdOrder?.paymentPhone ? `(${createdOrder.paymentPhone})` : ''}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">ট্রানজেকশন আইডি (TrxID):</span>
                  <span className="font-bold font-mono text-emerald-600 font-black">{createdOrder?.transactionId || transactionId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">মেকিং চার্জ (পরিশোধিত):</span>
                  <span className="font-black text-sm text-slate-900 font-mono">১,৯৯০ ৳</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">মাসিক হোস্টিং খরচ:</span>
                  <span className="font-bold text-purple-700 font-mono">২৫০ টাকা / মাস</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">অর্ডার স্ট্যাটাস:</span>
                  <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    পেন্ডিং ভেরিফিকেশন (১ মিনিট - ১ ঘণ্টা)
                  </span>
                </div>
              </div>

              {/* Action Buttons: Print, WhatsApp, Dashboard */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/25"
                >
                  <Printer className="w-4 h-4" />
                  <span>রসিদ প্রিন্ট / ডাউনলোড করুন</span>
                </button>

                <a
                  href={`https://wa.me/8801955570912?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি BongoWeb থেকে অর্ডার করেছি। অর্ডার আইডি: ${createdOrder?.orderId || ''}, TrxID: ${createdOrder?.transactionId || ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপ সাপোর্ট (01955570912)</span>
                </a>

                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-purple-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ড্যাশবোর্ডে ফিরুন</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
