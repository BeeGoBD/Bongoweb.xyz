import { useState, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Phone, 
  Lock, Globe, Clock, Check, Laptop, CreditCard, ChevronRight, Zap, RefreshCw,
  Tag, AlertCircle, Copy, Download, Star, Award, MessageCircle, FileText
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
  // Form State
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [hasDomain, setHasDomain] = useState<'yes' | 'no'>('no');
  const [domainName, setDomainName] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentOption, setPaymentOption] = useState<'instant-online' | 'pay-after-call'>('instant-online');
  const [trxId, setTrxId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const demoName = typeof selectedDemo === 'string' 
    ? selectedDemo 
    : selectedDemo?.title || selectedDemo?.englishTitle || 'Standard Premium Website';

  const fourDigitCode = typeof selectedDemo === 'object' && selectedDemo !== null && 'fourDigitCode' in selectedDemo
    ? selectedDemo.fourDigitCode
    : '#1042';

  const categoryName = typeof selectedDemo === 'object' && selectedDemo !== null && 'category' in selectedDemo
    ? selectedDemo.category
    : 'Business Store';

  const orderId = useMemo(() => `WH-${Math.floor(100000 + Math.random() * 900000)}`, []);

  // Pricing breakdown
  const regularPrice = 2499;
  const launchDiscount = 1500;
  const basePrice = 999;
  const finalPrice = Math.max(basePrice - appliedDiscount, 499);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'PINKVIP' || clean === 'LAUNCH2026' || clean === 'BONGOWEB' || clean === 'WEBHUB') {
      setAppliedDiscount(100);
      setPromoMessage('Promo code applied: ৳100 VIP discount deducted.');
    } else {
      setPromoMessage('Invalid promo code. Try "BONGOWEB" for ৳100 off.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hello BongoWeb Team, I have just completed my website checkout:\n\n` +
      `Order ID: ${orderId}\n` +
      `Selected Website: ${demoName} (${fourDigitCode})\n` +
      `Client Name: ${fullName}\n` +
      `Phone Number: ${phone}\n` +
      `Total Setup: ৳${finalPrice} BDT\n\n` +
      `Please call me to confirm my requirements and initiate the 24-hour website setup.`;

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
      className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans transition-colors duration-300"
    >
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            id="checkout-back-btn"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-semibold transition-all border border-slate-200/80 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>← Return to Catalog</span>
          </button>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium border border-slate-200/60">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200/80 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>24h Express Delivery</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Checkout Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 animate-fadeIn">
        {!isSuccess ? (
          <div>
            {/* Header Titles */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80 mb-2 shadow-2xs">
                <span>Secure Order Checkout</span>
                <span>·</span>
                <span className="font-mono font-bold text-indigo-900">Reference: {orderId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Complete Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
                  Website Order
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Provide your project specifications below. Our senior engineering team will call you to confirm branding before deployment.
              </p>
            </div>

            {/* 2-Column Split: Summary on Left, Form on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 cols): Order Overview & Pricing */}
              <div className="lg:col-span-5 space-y-6">
                {/* Selected Template Card */}
                <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 to-indigo-600" />
                  
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-2xs">
                      {fourDigitCode}
                    </span>
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      Selected Design
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                    {demoName}
                  </h3>
                  <p className="text-xs text-slate-500 mb-5">
                    Category: {categoryName} · Complete turnkey store build
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Custom domain connection (.com, .net, etc.)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Lifetime SSL security certificate included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Mobile & desktop responsive optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>1-Click direct WhatsApp order integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>1-on-1 Admin control tutorial walkthrough</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Card */}
                <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-600" />

                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                    <span>Investment Summary</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Zero Advance to Start
                    </span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Regular Setup Fee</span>
                      <span className="line-through font-mono">৳{regularPrice} BDT</span>
                    </div>

                    <div className="flex items-center justify-between text-emerald-700 font-semibold">
                      <span>Launchpad Promotion</span>
                      <span className="font-mono">-৳{launchDiscount} BDT</span>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex items-center justify-between text-indigo-700 font-semibold">
                        <span>VIP Coupon Applied</span>
                        <span className="font-mono">-৳{appliedDiscount} BDT</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between text-sm">
                      <span className="font-bold text-slate-900">Total Setup Fee</span>
                      <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                        ৳{finalPrice} <span className="text-xs text-slate-500 font-medium font-mono">BDT</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between pt-1">
                      <span>Monthly Cloud Upkeep:</span>
                      <span className="font-bold text-emerald-700 font-mono">৳120 BDT / month</span>
                    </div>
                  </div>

                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyPromo} className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo voucher (e.g. BONGOWEB)"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white uppercase font-mono transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                    >
                      Apply
                    </button>
                  </form>
                  {promoMessage && (
                    <p className={`text-[11px] mt-2 font-medium ${appliedDiscount > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {promoMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column (7 cols): Customer & Project Form */}
              <div className="lg:col-span-7">
                <form onSubmit={handleSubmit} className="p-7 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_4px_24px_rgba(15,23,42,0.04)] space-y-6">
                  {/* Step 1: Customer Details */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      1. Contact & Brand Information
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Where our development team will contact you.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Tanvir Ahmed"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Business / Brand Name
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Dhaka Gourmet"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Mobile / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 01700000000"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. contact@mybrand.com"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Domain Preference */}
                  <div className="pt-5 border-t border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      2. Domain Setup
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Do you already own a domain name, or need us to register a new one for you?
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <button
                        type="button"
                        onClick={() => setHasDomain('no')}
                        className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                          hasDomain === 'no'
                            ? 'border-2 border-indigo-500 bg-indigo-50/50 text-slate-900 ring-1 ring-indigo-500/20'
                            : 'border-slate-200/90 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-slate-900">I need a new domain</div>
                        <span className="text-[10px] text-slate-500 font-normal">We assist in registering it</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHasDomain('yes')}
                        className={`p-3.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                          hasDomain === 'yes'
                            ? 'border-2 border-indigo-500 bg-indigo-50/50 text-slate-900 ring-1 ring-indigo-500/20'
                            : 'border-slate-200/90 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-slate-900">I already own a domain</div>
                        <span className="text-[10px] text-slate-500 font-normal">We connect it for free</span>
                      </button>
                    </div>

                    {hasDomain === 'yes' && (
                      <input
                        type="text"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        placeholder="Enter your existing domain (e.g. mybrand.com)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono"
                      />
                    )}
                  </div>

                  {/* Step 3: Payment Method */}
                  <div className="pt-5 border-t border-slate-100">
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      3. Payment Option
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Select how you would like to settle your one-time setup fee.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => setPaymentOption('instant-online')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          paymentOption === 'instant-online'
                            ? 'border-2 border-indigo-500 bg-indigo-50/40 text-slate-900 ring-1 ring-indigo-500/20'
                            : 'border-slate-200/90 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">Instant Online Payment</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Pay via bKash, Nagad, or Card</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentOption('pay-after-call')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          paymentOption === 'pay-after-call'
                            ? 'border-2 border-indigo-500 bg-indigo-50/40 text-slate-900 ring-1 ring-indigo-500/20'
                            : 'border-slate-200/90 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">Pay After Verification Call</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Pay after discussing with engineer</div>
                      </button>
                    </div>

                    {paymentOption === 'instant-online' && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 border border-indigo-100 space-y-3 shadow-2xs">
                        <div className="text-xs text-slate-600 leading-relaxed">
                          Please send the setup payment of <strong className="text-slate-900 font-mono">${finalPrice}</strong> to our verified bKash or Nagad merchant account:
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs shadow-2xs">
                          <span className="font-bold text-slate-900">bKash / Nagad: 01700000000</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Merchant Account
                          </span>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Transaction ID (TrxID)
                          </label>
                          <input
                            type="text"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            placeholder="e.g. 9J2834K12"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 4: Notes */}
                  <div className="pt-5 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Project Notes or Special Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any specific color preferences, required pages, or deadline notes..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
                          <span>Processing Order...</span>
                        </span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-emerald-100" />
                          <span>Confirm & Place Website Order (${finalPrice})</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      Backed by our 100% demo-mirror guarantee. No work starts without your phone confirmation.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 3. ORDER CONFIRMATION RECEIPT (SUCCESS STATE)                             */
          /* ========================================================================= */
          <div className="max-w-2xl mx-auto py-10 animate-fadeIn">
            <div className="p-8 sm:p-10 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.06)] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 stroke-[2.5]" />
              </div>

              <span className="text-xs uppercase font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 tracking-wider">
                Order Received Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 mb-2">
                Thank You, {fullName || 'Valued Client'}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
                Your website order has been registered in our deployment queue. An assigned engineer will call you within 15 minutes.
              </p>

              {/* Order Reference Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 mb-6 flex items-center justify-between text-left shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                    Official Order Reference
                  </span>
                  <span className="text-base font-mono font-bold text-slate-900">
                    {orderId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyReceiptToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{copiedOrderId ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Receipt Summary Table */}
              <div className="space-y-2.5 text-xs text-left mb-8 pb-6 border-b border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Selected Website:</span>
                  <span className="font-semibold text-slate-900">{demoName} ({fourDigitCode})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Client Contact:</span>
                  <span className="font-semibold text-slate-900">{phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Deployment SLA:</span>
                  <span className="font-semibold text-emerald-700">Within 24 Hours Turnkey</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className="font-semibold text-slate-900">
                    {paymentOption === 'pay-after-call' ? 'Pay After Verification Call' : 'Online Payment Received'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold">
                  <span>Total Setup Investment:</span>
                  <span className="font-mono text-emerald-700 font-extrabold">৳{finalPrice} BDT</span>
                </div>
              </div>

              {/* Instant WhatsApp Launch Action */}
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-[0_4px_16px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-100" />
                  <span>Launch WhatsApp to Confirm Specifications</span>
                </button>

                <button
                  onClick={onBack}
                  className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                >
                  Return to Main Catalog
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
