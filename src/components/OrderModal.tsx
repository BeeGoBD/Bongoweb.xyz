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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-slideUpModal relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-[#FAF5FF] text-[#6B46C1] border border-[#DDD6FE] flex items-center justify-center mx-auto mb-2 shadow-xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5] text-[#6B46C1]" />
            </div>
            <h3 className="text-xl font-black text-[#0F172A]">
              অর্ডার রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              আমাদের একজন টেকনিক্যাল ম্যানেজার আগামী ১৫ মিনিটের মধ্যে <span className="font-bold text-[#6B46C1]">{phoneNumber}</span> নম্বরে ফোন করে আপনার প্রজেক্ট শুরু করবেন।
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#00B261] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#DCFCE7]">
                ✓ ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি টিম সক্রিয়
              </span>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5FF] text-[#6B46C1] text-[11px] font-bold border border-[#DDD6FE]">
                {demoCode} • Express 24h Setup
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-2 line-clamp-1">
                {demoTitle}
              </h2>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-slate-500">প্যাকেজ রেট:</span>
                <span className="font-black text-[#6B46C1] text-sm">{priceTag}</span>
              </div>
            </div>

            {/* Reassurance Callout */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-5 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#00B261] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 leading-snug">
                <strong>কোনো অগ্রিম টাকা নেওয়া হবে না।</strong> কাজ শুরু করার আগে আমাদের ইঞ্জিনিয়ার সরাসরি আপনার সাথে কথা বলে সব নিশ্চিত করবেন।
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  আপনার নাম / ব্যবসার নাম
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আহসান হাবিব / হাবিব ফ্যাশন"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  মোবাইল নম্বর (যেটিতে আমরা কল করব)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01700-000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  পছন্দের ডোমেইন নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: yourbrand.com"
                  value={preferredDomain}
                  onChange={(e) => setPreferredDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
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
                  href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                    `Hello BongoWeb, I want to order website: ${demoTitle} (${demoCode})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B261] hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন (+8801700000000)</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
