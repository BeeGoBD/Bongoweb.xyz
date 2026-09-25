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
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-[0_8px_24px_rgba(15,23,42,0.25)] hover:shadow-[0_12px_32px_rgba(79,70,229,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-indigo-500/30"
        >
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
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
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-slate-200/90 overflow-hidden flex flex-col text-slate-800 animate-fadeIn"
          role="dialog"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 text-white border-b border-indigo-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline select-none">
                  <span className="font-black text-sm text-white tracking-tight">
                    Bongo
                  </span>
                  <span className="font-black text-sm bg-gradient-to-r from-red-400 via-rose-400 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                    Web
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 ml-0.5 mb-0.5 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300 ml-1.5">Live Assistance</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Engineering team online</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="p-3 bg-slate-50 border-b border-slate-200/70 flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-500 shadow-2xs transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Chat</span>
            </a>

            <a
              href="tel:+8801700000000"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-2xs transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Call</span>
            </a>
          </div>

          {/* Body */}
          <div className="p-4 max-h-[360px] overflow-y-auto space-y-4">
            {/* Quick Callback Form */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 border border-indigo-100 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block mb-0.5">
                Free Callback Request
              </span>
              <p className="text-[11px] text-slate-500 mb-3">
                Leave your phone number and an engineer will call you in ~5 mins.
              </p>

              {submitted ? (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Request received. Calling you shortly!</span>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-2">
                  <input
                    type="text"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      placeholder="Mobile or WhatsApp number"
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <Send className="w-3 h-3 text-indigo-300" />
                      <span>Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick FAQs */}
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-2">
                Frequently Asked Questions
              </span>
              <div className="space-y-1.5">
                {SUPPORT_FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={idx} 
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-3 text-left font-medium text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span className="pr-2">{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 pt-1 text-[11px] text-slate-600 bg-slate-50/60 border-t border-slate-100 leading-relaxed">
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
          <div className="p-2.5 bg-slate-50 border-t border-slate-200/80 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
            <Clock className="w-3 h-3 text-indigo-600" />
            <span>Dedicated developer support active 7 days a week</span>
          </div>
        </div>
      )}
    </>
  );
}
