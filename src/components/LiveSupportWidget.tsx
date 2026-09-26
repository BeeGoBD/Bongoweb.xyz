import { useState } from 'react';
import { 
  Headphones, X, MessageCircle, Phone, Send, 
  ChevronDown, ChevronUp, CheckCircle2, Clock 
} from 'lucide-react';
import { SUPPORT_FAQS } from '../data/mockData';

export default function LiveSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCallbackName('');
      setCallbackPhone('');
      setIsOpen(false);
    }, 2200);
  };

  const whatsappUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(
    'Hello BongoWeb Team, I am interested in launching a website for my business. Please share details.'
  )}`;

  return (
    <>
      {/* Floating Action Button */}
      <div 
        id="live-support-floating-wrapper"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="live-support-btn"
          aria-label="Live Support"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#FF9D14] hover:bg-[#FEB74F] text-white shadow-[0_8px_24px_rgba(255,157,20,0.45)] hover:shadow-[0_12px_32px_rgba(255,157,20,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#FEB74F]/50"
        >
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-[#E91311]"></span>
          </span>

          {isOpen ? (
            <X className="w-5 h-5 transition-transform duration-200" />
          ) : (
            <Headphones className="w-5 h-5 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Floating Support Drawer */}
      {isOpen && (
        <div 
          id="live-support-drawer"
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-[#EDEDEF] overflow-hidden flex flex-col text-[#111111] animate-fadeIn"
          role="dialog"
        >
          {/* Header */}
          <div className="bg-[#111111] p-4 text-white border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline select-none">
                  <span className="font-black text-sm text-[#A51D24] tracking-tight">
                    Bongo
                  </span>
                  <span className="font-black text-sm text-[#FF9D14] tracking-tight">
                    Web
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9D14] ml-0.5 mb-0.5 shrink-0" />
                  <span className="text-[10px] font-semibold text-[#888888] ml-1.5">Live Assistance</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#888888] mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                  <span>Engineering team online</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="p-3 bg-[#F5F5F7] border-b border-[#EDEDEF] flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#22C55E] text-white text-xs font-bold hover:bg-[#16a34a] shadow-xs transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </a>

            <a
              href="tel:+8801700000000"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1A1A1A] text-white text-xs font-bold hover:bg-black shadow-xs transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Call</span>
            </a>
          </div>

          {/* Body */}
          <div className="p-4 max-h-[360px] overflow-y-auto space-y-4">
            {/* Quick Callback Form */}
            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-[#EDEDEF] shadow-2xs">
              <span className="text-xs font-bold text-[#111111] block mb-0.5">
                Free Callback Request
              </span>
              <p className="text-[11px] text-[#666666] mb-3">
                Leave your phone number and an engineer will call you in ~5 mins.
              </p>

              {submitted ? (
                <div className="p-3 rounded-xl bg-[#22C55E]/10 text-[#22C55E] text-xs font-semibold flex items-center gap-2 border border-[#22C55E]/30">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  <span>Request received. Calling you shortly!</span>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-2">
                  <input
                    type="text"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 bg-white border border-[#EDEDEF] rounded-xl text-xs placeholder-[#888888] focus:outline-none focus:border-[#FF9D14] transition-all"
                  />
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      placeholder="Mobile or WhatsApp number"
                      className="flex-1 px-3 py-2 bg-white border border-[#EDEDEF] rounded-xl text-xs placeholder-[#888888] focus:outline-none focus:border-[#FF9D14] font-mono transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FF9D14] hover:bg-[#FEB74F] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1 shrink-0 shadow-xs"
                    >
                      <Send className="w-3 h-3 text-white" />
                      <span>Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick FAQs */}
            <div>
              <span className="text-xs font-bold text-[#111111] block mb-2">
                Frequently Asked Questions
              </span>
              <div className="space-y-1.5">
                {SUPPORT_FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="rounded-xl border border-[#EDEDEF] bg-white overflow-hidden text-xs"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-3 text-left font-medium text-[#111111] flex items-center justify-between hover:bg-[#F5F5F7] transition-colors cursor-pointer"
                      >
                        <span className="pr-2">{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#888888] shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-[#888888] shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 pt-1 text-[11px] text-[#666666] bg-[#F5F5F7] border-t border-[#EDEDEF] leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-2.5 bg-[#F5F5F7] border-t border-[#EDEDEF] text-center text-[10px] text-[#888888] flex items-center justify-center gap-1.5 font-medium">
            <Clock className="w-3 h-3 text-[#FF9D14]" />
            <span>Dedicated developer support active 7 days a week</span>
          </div>
        </div>
      )}
    </>
  );
}
