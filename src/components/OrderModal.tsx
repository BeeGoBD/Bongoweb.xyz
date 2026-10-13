import React, { useState } from 'react';
import { 
  X, CheckCircle2, PhoneCall, ShieldCheck, 
  MessageCircle, Sparkles, ArrowRight, Zap 
} from 'lucide-react';
import { WebsiteDemo } from '../types';

interface OrderModalProps {
  demo: WebsiteDemo | string | null;
  onClose: () => void;
}

export default function OrderModal({ demo, onClose }: OrderModalProps) {
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!demo) return null;

  const demoTitle = typeof demo === 'string' ? demo : demo.title;
  const demoCode = typeof demo === 'object' ? demo.fourDigitCode : '#2085';
  const priceTag = typeof demo === 'object' ? demo.priceTag : 'Starts at 999 BDT';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-slideUpModal relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mx-auto mb-2 shadow-xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5] text-purple-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              অর্ডার রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              আমাদের একজন টেকনিক্যাল ম্যানেজার আগামী ১৫ মিনিটের মধ্যে <span className="font-bold text-purple-700">{phoneNumber}</span> নম্বরে ফোন করে আপনার প্রজেক্ট শুরু করবেন।
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি টিম সক্রিয়
              </span>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-5">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200">
                {demoCode} • Express 24h Setup
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 line-clamp-1">
                {demoTitle}
              </h2>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-slate-500">প্যাকেজ রেট:</span>
                <span className="font-black text-purple-700 text-sm font-mono">{priceTag}</span>
              </div>
            </div>

            {/* Reassurance Callout */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-5 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-snug">
                <strong className="text-slate-900">কোনো অগ্রিম টাকা নেওয়া হবে না।</strong> কাজ শুরু করার আগে আমাদের ইঞ্জিনিয়ার সরাসরি আপনার সাথে কথা বলে সব নিশ্চিত করবেন।
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার নাম / ব্যবসার নাম
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আহসান হাবিব / হাবিব ফ্যাশন"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নম্বর (যেটিতে আমরা কল করব)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01700-000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পছন্দের ডোমেইন নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: yourbrand.com"
                  value={preferredDomain}
                  onChange={(e) => setPreferredDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>অর্ডার কনফার্ম করুন (ফ্রি কল ব্যাক)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Or Direct WhatsApp */}
              <div className="text-center pt-2">
                <a
                  href={`https://wa.me/8801819847250?text=${encodeURIComponent(
                    `Hello BongoWeb, I want to order website: ${demoTitle} (${demoCode})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন (+880 1819-847250)</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
