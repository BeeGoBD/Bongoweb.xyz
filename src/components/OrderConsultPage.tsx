import { useState, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, Phone, 
  Lock, Check, CreditCard, ChevronRight, Zap,
  Copy, MessageCircle, PhoneCall, Sparkles, Rocket, ChevronUp, ChevronDown
} from 'lucide-react';
import { WebsiteDemo } from '../types';

interface OrderConsultPageProps {
  onBack: () => void;
  selectedDemo?: WebsiteDemo | string | null;
}

export default function OrderConsultPage({
  onBack,
  selectedDemo
}: OrderConsultPageProps) {
  // 2-Step Flow: step 1 (Contact info) | step 2 (Domain & Payment details)
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hasDomain, setHasDomain] = useState<'yes' | 'no'>('no');
  const [domainName, setDomainName] = useState('');
  const [notes, setNotes] = useState('');

  // Selected Payment Method Tab: 'bkash' | 'nagad' | 'rocket' | 'bank'
  const [selectedPaymentTab, setSelectedPaymentTab] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Submission & Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [isWhatWeDoExpanded, setIsWhatWeDoExpanded] = useState(false);

  const demoName = typeof selectedDemo === 'string' 
    ? selectedDemo 
    : selectedDemo?.title || selectedDemo?.englishTitle || 'স্ট্যান্ডার্ড প্রিমিয়াম ওয়েবসাইট';

  const fourDigitCode = typeof selectedDemo === 'object' && selectedDemo !== null && 'fourDigitCode' in selectedDemo
    ? selectedDemo.fourDigitCode
    : '#1042';

  const categoryName = typeof selectedDemo === 'object' && selectedDemo !== null && 'category' in selectedDemo
    ? selectedDemo.category
    : 'অনলাইন শপ';

  const orderId = useMemo(() => `BW-${Math.floor(100000 + Math.random() * 900000)}`, []);

  // Pricing calculation
  const regularPrice = 2499;
  const launchDiscount = 1500;
  const basePrice = 999;
  const finalPrice = Math.max(basePrice - appliedDiscount, 499);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'PINKVIP' || clean === 'LAUNCH2026' || clean === 'BONGOWEB' || clean === 'WEBHUB') {
      setAppliedDiscount(100);
      setPromoMessage('প্রোমো কোড সফল: ৳১০০ ডিসকাউন্ট মাইনাস করা হয়েছে।');
    } else {
      setPromoMessage('ভুল প্রোমো কোড। ৳১০০ ছাড়ের জন্য "BONGOWEB" কোড ব্যবহার করুন।');
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !businessName.trim()) {
      alert('দয়া করে আপনার পুরো নাম, ব্র্যান্ডের নাম এবং মোবাইল নম্বর পূরণ করুন।');
      return;
    }
    setCheckoutStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleWhatsAppRedirect = () => {
    const text = `হ্যালো BongoWeb টিম, আমি আমার ওয়েবসাইটের অর্ডার সম্পন্ন করেছি:\n\n` +
      `অর্ডার রেফারেন্স আইডি: ${orderId}\n` +
      `নির্বাচিত ওয়েবসাইট: ${demoName} (${fourDigitCode})\n` +
      `ক্লায়েন্টের নাম: ${fullName}\n` +
      `ব্র্যান্ড/ওয়েবসাইটের নাম: ${businessName}\n` +
      `মোবাইল নম্বর: ${phone}\n` +
      `মোট সেটআপ ফি: ৳${finalPrice} টাকা\n` +
      `পেমেন্ট মাধ্যম: ${selectedPaymentTab.toUpperCase()}\n` +
      (trxId ? `TrxID: ${trxId}\n` : '') +
      `\nঅনুগ্রহ করে আমার সাথে যোগাযোগ করে ২৪ ঘণ্টার সেটআপ শুরু করুন। ধন্যবাদ!`;

    window.open(`https://wa.me/8801700000000?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyReceiptToClipboard = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  return (
    <div 
      id="order-consult-page"
      className="min-h-screen w-full bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans transition-colors duration-300"
    >
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#2A2A2A] shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={checkoutStep === 2 ? () => setCheckoutStep(1) : onBack}
            id="checkout-back-btn"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-400" />
            <span>{checkoutStep === 2 ? '← পূর্ববর্তী ধাপে যান' : '← Return to Dashboard'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className={`px-2 py-0.5 rounded-md ${checkoutStep === 1 ? 'bg-white text-black' : 'bg-[#141414] text-neutral-400 border border-white/10'}`}>ধাপ ১</span>
            <span className="text-white/30">/</span>
            <span className={`px-2 py-0.5 rounded-md ${checkoutStep === 2 ? 'bg-white text-black' : 'bg-[#141414] text-neutral-400 border border-white/10'}`}>ধাপ ২</span>
          </div>
        </div>
      </header>

      {/* 2. Main Checkout Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 animate-fadeIn">
        {!isSuccess ? (
          <div className="space-y-6">
            {/* Top Interactive Banner: "অর্ডার করার পর আমরা আপনার জন্য কী কী করব" */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => setIsWhatWeDoExpanded(prev => !prev)}
                id="btn-what-we-do-checkout-banner"
                className="w-full relative group inline-flex items-center justify-between px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#141414] hover:bg-[#1A1A1A] text-white cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/10 hover:border-white/30 transition-all duration-200 overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF88]"></span>
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-[#00FF88] select-none">
                    অর্ডার করার পর আমরা আপনার জন্য কী কী করব? (নির্দেশনা)
                  </span>
                </div>

                <div className="w-8 h-8 rounded-xl bg-black text-[#00FF88] flex items-center justify-center border border-[#00FF88]/30 group-hover:border-[#00FF88] transition-all duration-200 shrink-0">
                  {isWhatWeDoExpanded ? (
                    <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  )}
                </div>
              </button>

              {/* Collapsible Action Roadmap */}
              {isWhatWeDoExpanded && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0A0A0A] border border-[#00FF88]/30 shadow-md mt-3 animate-fadeIn space-y-3 text-xs sm:text-sm text-[#00FF88]">
                  <div className="flex items-start gap-3 p-3 bg-[#141414] border border-[#00FF88]/20 rounded-xl">
                    <span className="w-6 h-6 rounded-lg bg-[#00FF88] text-black flex items-center justify-center shrink-0 font-bold text-xs">১</span>
                    <span className="text-[#00FF88]">সরাসরি ফোন কল বা হোয়াটসঅ্যাপে কথা বলে আপনার প্ল্যান ও প্রয়োজনীয়তা নিশ্চিত করা হবে।</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-[#141414] border border-[#00FF88]/20 rounded-xl">
                    <span className="w-6 h-6 rounded-lg bg-[#00FF88] text-black flex items-center justify-center shrink-0 font-bold text-xs">২</span>
                    <span className="text-[#00FF88]">আপনার ওয়েবসাইট ও ব্র্যান্ডের নাম, লোগো এবং প্রয়োজনীয় তথ্য সংগ্রহ করা হবে।</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-[#141414] border border-[#00FF88]/20 rounded-xl">
                    <span className="w-6 h-6 rounded-lg bg-[#00FF88] text-black flex items-center justify-center shrink-0 font-bold text-xs">৩</span>
                    <span className="text-[#00FF88]">ডোমেন কানেকশন করে মাত্র ২৪ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ওয়েবসাইট ডেলিভারি দেওয়া হবে।</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-[#141414] border border-[#00FF88]/20 rounded-xl">
                    <span className="w-6 h-6 rounded-lg bg-[#00FF88] text-black flex items-center justify-center shrink-0 font-bold text-xs">৪</span>
                    <span className="text-[#00FF88]">যেকোনো প্রয়োজনে আমাদের অফিসিয়াল হোয়াটসঅ্যাপে আজীবন নিরবচ্ছিন্ন সাপোর্ট পাবেন।</span>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* STEP 1: CONTACT & BRAND INFORMATION                                       */}
            {/* ========================================================================= */}
            {checkoutStep === 1 && (
              <form onSubmit={handleStep1Next} className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    ১. যোগাযোগের তথ্য ও ব্র্যান্ডের নাম
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mb-6">
                    আপনার তথ্য দিন, যাতে আমাদের ইঞ্জিনিয়ারিং টিম আপনার সাথে সরাসরি কথা বলতে পারে।
                  </p>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">
                        আপনার পুরো নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="যেমন: তানভীর আহমেদ"
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                      />
                    </div>

                    {/* Business/Brand Name (Also Website Name) */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">
                        ব্যবসা বা ব্র্যান্ডের নাম (এটিই হবে আপনার ওয়েবসাইটের নাম) *
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="যেমন: ঢাকা গুরমেট শপ"
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                      />
                      <span className="text-[11px] text-[#00FF88] font-medium mt-1 block">
                        💡 <span className="font-bold">তথ্য:</span> এই নামটি আপনার লাইভ ওয়েবসাইট এবং লোগোতে বসানো হবে।
                      </span>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">
                        মোবাইল / হোয়াটসঅ্যাপ নম্বর *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="যেমন: 01700000000"
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88]/20 transition-all font-mono"
                      />
                    </div>

                    {/* Email Address (Optional) */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1.5">
                        ইমেইল অ্যাড্রেস (ঐচ্ছিক - দিতে পারেন বা নাও দিতে পারেন)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="যেমন: contact@mybrand.com"
                        className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#00FF88] focus:ring-1 focus:ring-[#00FF88]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    id="btn-step1-next"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl btn-rgb text-black font-extrabold text-sm cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-[0.99]"
                  >
                    <span>পরবর্তী ধাপে যান (ডোমেন ও পেমেন্ট)</span>
                    <ChevronRight className="w-4 h-4 text-black stroke-[2.5]" />
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================================= */}
            {/* STEP 2: DOMAIN & PAYMENT & SELECTED DESIGN & SUMMARY                       */}
            {/* ========================================================================= */}
            {checkoutStep === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                {/* 1. Domain Setup Box */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-sm space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      ২. ডোমেন সেটআপ
                    </h2>
                    <p className="text-xs sm:text-sm text-[#00FF88] font-medium mb-3 bg-[#00FF88]/10 p-2.5 rounded-xl border border-[#00FF88]/20">
                      💡 <strong className="font-bold">ডোমেন কী?</strong> ডোমেন হলো ইন্টারনেটে আপনার ওয়েবসাইটের নির্দিষ্ট ঠিকানা (যেমন: yourbrand.com বা yourbrand.bongoweb.site)। কাস্টমাররা এটি লিখে আপনার সাইটে ঢুকবে।
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <button
                        type="button"
                        onClick={() => setHasDomain('no')}
                        className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${
                          hasDomain === 'no'
                            ? 'border-2 border-white bg-white/10 text-white'
                            : 'border-white/10 bg-black text-neutral-400 hover:border-white/20'
                        }`}
                      >
                        <div className="font-bold text-white">আমার কোনো ডোমেন নেই</div>
                        <span className="text-xs text-neutral-400 font-normal">আমরা ফ্রি সাবডোমেন বা নতুন ডোমেন সেটআপ করে দেব</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHasDomain('yes')}
                        className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${
                          hasDomain === 'yes'
                            ? 'border-2 border-white bg-white/10 text-white'
                            : 'border-white/10 bg-black text-neutral-400 hover:border-white/20'
                        }`}
                      >
                        <div className="font-bold text-white">আমার নিজস্ব ডোমেন আছে</div>
                        <span className="text-xs text-neutral-400 font-normal">আপনার আগের ডোমেনটি ফ্রিতে কানেক্ট করে দেওয়া হবে</span>
                      </button>
                    </div>

                    {hasDomain === 'yes' && (
                      <div className="mt-2 animate-fadeIn">
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          আপনার বিদ্যমান ডোমেন নামটি লিখুন
                        </label>
                        <input
                          type="text"
                          value={domainName}
                          onChange={(e) => setDomainName(e.target.value)}
                          placeholder="যেমন: mybrand.com"
                          className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Payment Details Box with Tabs */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-sm space-y-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    ৩. পেমেন্টের বিবরণ
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    নিচে থেকে আপনার সুবিধাজনক পেমেন্ট মেথড নির্বাচন করুন এবং ট্রানজেকশন আইডি দিন।
                  </p>

                  {/* Payment Tabs: bKash, Nagad, Rocket, Bank */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* bKash */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentTab('bkash')}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        selectedPaymentTab === 'bkash'
                          ? 'border-2 border-white bg-white text-black shadow-sm'
                          : 'border-white/10 bg-black hover:bg-[#1A1A1A] text-white'
                      }`}
                    >
                      <span className="text-sm">bKash</span>
                      <span className={`text-[10px] font-normal ${selectedPaymentTab === 'bkash' ? 'text-black/80' : 'text-neutral-400'}`}>বিকাশ পেমেন্ট</span>
                    </button>

                    {/* Nagad */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentTab('nagad')}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        selectedPaymentTab === 'nagad'
                          ? 'border-2 border-white bg-white text-black shadow-sm'
                          : 'border-white/10 bg-black hover:bg-[#1A1A1A] text-white'
                      }`}
                    >
                      <span className="text-sm">Nagad</span>
                      <span className={`text-[10px] font-normal ${selectedPaymentTab === 'nagad' ? 'text-black/80' : 'text-neutral-400'}`}>নগদ পেমেন্ট</span>
                    </button>

                    {/* Rocket */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentTab('rocket')}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        selectedPaymentTab === 'rocket'
                          ? 'border-2 border-white bg-white text-black shadow-sm'
                          : 'border-white/10 bg-black hover:bg-[#1A1A1A] text-white'
                      }`}
                    >
                      <span className="text-sm">Rocket</span>
                      <span className={`text-[10px] font-normal ${selectedPaymentTab === 'rocket' ? 'text-black/80' : 'text-neutral-400'}`}>রকেট পেমেন্ট</span>
                    </button>

                    {/* Bank Transfer */}
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentTab('bank')}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        selectedPaymentTab === 'bank'
                          ? 'border-2 border-white bg-white text-black shadow-sm'
                          : 'border-white/10 bg-black hover:bg-[#1A1A1A] text-white'
                      }`}
                    >
                      <span className="text-sm">Bank Transfer</span>
                      <span className={`text-[10px] font-normal ${selectedPaymentTab === 'bank' ? 'text-black/80' : 'text-neutral-400'}`}>ব্যাংক ট্রান্সফার</span>
                    </button>
                  </div>

                  {/* Active Payment Details Panel */}
                  <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#141414] border border-white/10 font-mono text-xs sm:text-sm">
                      <div>
                        <span className="text-neutral-400 block text-[11px] font-sans">অফিসিয়াল মার্চেন্ট/অ্যাকাউন্ট নম্বর:</span>
                        <span className="font-bold text-white text-base">
                          {selectedPaymentTab === 'bank' ? 'BongoWeb Technologies Ltd.' : '01700000000'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-white/10 px-2.5 py-1 rounded-md border border-white/20 self-start sm:self-auto">
                        {selectedPaymentTab === 'bank' ? 'City Bank Ltd. (A/C: 1502938471001)' : 'ভেরিফাইড মার্চেন্ট নম্বর'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          যে নম্বর/অ্যাকাউন্ট থেকে টাকা পাঠিয়েছেন
                        </label>
                        <input
                          type="text"
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder="আপনার সেন্ডার নম্বর"
                          className="w-full px-3.5 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          ট্রানজেকশন আইডি (TrxID)
                        </label>
                        <input
                          type="text"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="যেমন: 9J2834K12"
                          className="w-full px-3.5 py-2.5 bg-[#141414] border border-white/10 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Notes (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      বিশেষ কোনো রিকোয়ারমেন্ট বা নির্দেশনা (ঐচ্ছিক)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="আপনার ওয়েবসাইট সম্পর্কিত কোনো বিশেষ নির্দেশনা বা নোট থাকলে লিখুন..."
                      className="w-full px-3.5 py-2.5 bg-black border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all"
                    />
                  </div>
                </div>

                {/* 3. Bottom Investment Summary */}
                <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                  <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                    <span>ইনভেস্টমেন্ট সারাংশ (Investment Summary)</span>
                    <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                      কোনো লুকানো চার্জ নেই
                    </span>
                  </h3>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>নিয়মিত সেটআপ ফি</span>
                      <span className="line-through font-mono">৳{regularPrice} টাকা</span>
                    </div>

                    <div className="flex items-center justify-between text-white font-semibold">
                      <span>লঞ্চপ্যাড ডিসকাউন্ট অফার</span>
                      <span className="font-mono">-৳{launchDiscount} টাকা</span>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex items-center justify-between text-white font-semibold">
                        <span>ভিআইপি কুপন ছাড়</span>
                        <span className="font-mono">-৳{appliedDiscount} টাকা</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                      <span className="font-bold text-white text-sm sm:text-base">মোট প্রদেয় এককালীন ফি</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                        ৳{finalPrice} <span className="text-xs text-neutral-400 font-medium font-mono">টাকা</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-400 mt-1 flex items-center justify-between pt-1">
                      <span>মাসিক ক্লাউড মেইনটেন্যান্স:</span>
                      <span className="font-bold text-white font-mono">৳১২০ টাকা / মাস</span>
                    </div>
                  </div>

                  {/* Promo Voucher Field */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="ডিসকাউন্ট ভাউচার (যেমন: BONGOWEB)"
                      className="flex-1 px-3.5 py-2 bg-black border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white uppercase font-mono transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      প্রয়োগ করুন
                    </button>
                  </div>
                  {promoMessage && (
                    <p className={`text-[11px] mt-2 font-medium ${appliedDiscount > 0 ? 'text-white' : 'text-neutral-400'}`}>
                      {promoMessage}
                    </p>
                  )}
                </div>

                {/* 4. Selected Design Details */}
                <div className="p-6 rounded-3xl bg-[#141414] border border-white/10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-black text-white border border-white/10 shadow-2xs">
                      {fourDigitCode}
                    </span>
                    <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                      নির্বাচিত ওয়েবসাইট ডিজাইন
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 leading-snug">
                    {demoName}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-4">
                    ক্যাটাগরি: {categoryName} · সম্পূর্ণ রেডিমেড রেসপনসিভ ওয়েবসাইট
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#00FF88] pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
                      <span>কাস্টম ডোমেন কানেকশন (.com / .net ইত্যাদি)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
                      <span>লাইফটাইম ফ্রি SSL সিকিউরিটি সার্টিফিকেট</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
                      <span>১০০% মোবাইল ও ট্যাবলেট রেসপনসিভ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
                      <span>১-ক্লিকে সরাসরি হোয়াটসঅ্যাপ অর্ডার সিস্টেম</span>
                    </div>
                  </div>
                </div>

                {/* Final Submit Button - Radiant RGB */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl text-sm sm:text-base font-extrabold text-black btn-rgb shadow-[0_0_28px_rgba(0,255,136,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 text-black">
                        <Sparkles className="w-4 h-4 animate-spin text-black" />
                        <span>অর্ডার প্রসেস হচ্ছে...</span>
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-black stroke-[2.5]" />
                        <span>অর্ডার কনফার্ম করুন (৳{finalPrice} টাকা)</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-[#00FF88] font-medium mt-2 bg-[#00FF88]/10 py-1.5 px-3 rounded-lg border border-[#00FF88]/20">
                    💡 <span className="font-bold">গ্যারান্টি:</span> ১০০% ডেমো-ম্যাচ গ্যারান্টি। আপনার সাথে ফোনে কথা বলার পরই কাজ শুরু করা হবে।
                  </p>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* 3. ORDER CONFIRMATION RECEIPT (SUCCESS STATE)                             */
          /* ========================================================================= */
          <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#141414] border border-white/10 shadow-lg text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/20">
                <CheckCircle2 className="w-8 h-8 text-white stroke-[2.5]" />
              </div>

              <span className="text-xs uppercase font-mono font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/20 tracking-wider">
                অর্ডার সফলভাবে গ্রহণ করা হয়েছে
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 mb-2">
                ধন্যবাদ, {fullName || 'সম্মানিত উদ্যোক্তা'}!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-6">
                আপনার ওয়েবসাইট অর্ডারটি সিস্টেমে নথিভুক্ত হয়েছে। আমাদের একজন সিনিয়র ডেভেলপার খুব দ্রুত আপনার সাথে যোগাযোগ করবেন।
              </p>

              {/* Order Reference Box */}
              <div className="p-4 rounded-2xl bg-black border border-white/10 mb-6 flex items-center justify-between text-left shadow-2xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-semibold uppercase tracking-wider">
                    অফিসিয়াল অর্ডার রেফারেন্স
                  </span>
                  <span className="text-base font-mono font-bold text-white">
                    {orderId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyReceiptToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-[#141414] border border-white/10 text-xs font-semibold text-white hover:bg-[#1A1A1A] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-white" />
                  <span>{copiedOrderId ? 'কপি হয়েছে!' : 'কোড কপি করুন'}</span>
                </button>
              </div>

              {/* Receipt Summary Table */}
              <div className="space-y-2.5 text-xs text-left mb-8 pb-6 border-b border-white/10">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-neutral-400">নির্বাচিত ওয়েবসাইট:</span>
                  <span className="font-semibold text-white">{demoName} ({fourDigitCode})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-neutral-400">ক্লায়েন্টের যোগাযোগ:</span>
                  <span className="font-semibold text-white">{phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-neutral-400">ডেলিভারি সময়সীমা:</span>
                  <span className="font-semibold text-white">২৪ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span className="text-neutral-400">পেমেন্ট মাধ্যম:</span>
                  <span className="font-semibold text-white uppercase">
                    {selectedPaymentTab}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold">
                  <span className="text-white">মোট প্রদেয় ফি:</span>
                  <span className="font-mono text-white font-extrabold">৳{finalPrice} টাকা</span>
                </div>
              </div>

              {/* Instant WhatsApp Launch Action */}
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm shadow-[0_4px_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="w-4 h-4 text-black" />
                  <span>হোয়াটসঅ্যাপে বিস্তারিত নিশ্চিত করুন</span>
                </button>

                <button
                  onClick={onBack}
                  className="w-full py-2.5 rounded-xl border border-white/10 bg-[#141414] hover:bg-[#1A1A1A] text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                >
                  মূল ক্যাটালগে ফিরে যান
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
