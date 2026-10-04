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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 animate-slideUpModal relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD]"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black text-[#0D253D]">
              অর্ডার রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে!
            </h3>
            <p className="text-xs sm:text-sm text-[#273951] leading-relaxed max-w-sm mx-auto">
              আমাদের একজন টেকনিক্যাল ম্যানেজার আগামী ১৫ মিনিটের মধ্যে <span className="font-bold text-[#DC2626]">{phoneNumber}</span> নম্বরে ফোন করে আপনার প্রজেক্ট শুরু করবেন।
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#00B261] bg-[#F8FAFD] px-3 py-1 rounded-full border border-[#E5EDF5]">
                ✓ ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি টিম সক্রিয়
              </span>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#DC2626] text-[11px] font-bold border border-[#DC2626]/20">
                {demoCode} • Express 24h Setup
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0D253D] mt-2 line-clamp-1">
                {demoTitle}
              </h2>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-[#64748D]">প্যাকেজ রেট:</span>
                <span className="font-black text-[#DC2626] text-sm">{priceTag}</span>
              </div>
            </div>

            {/* Reassurance Callout */}
            <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] mb-5 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#00B261] shrink-0 mt-0.5" />
              <p className="text-xs text-[#273951] leading-snug">
                <strong>কোনো অগ্রিম টাকা নেওয়া হবে না।</strong> কাজ শুরু করার আগে আমাদের ইঞ্জিনিয়ার সরাসরি আপনার সাথে কথা বলে সব নিশ্চিত করবেন।
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0D253D] mb-1">
                  আপনার নাম / ব্যবসার নাম
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আহসান হাবিব / হাবিব ফ্যাশন"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D253D] mb-1">
                  মোবাইল নম্বর (যেটিতে আমরা কল করব)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01700-000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D253D] mb-1">
                  পছন্দের ডোমেইন নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: yourbrand.com"
                  value={preferredDomain}
                  onChange={(e) => setPreferredDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs sm:text-sm text-[#0D253D] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
