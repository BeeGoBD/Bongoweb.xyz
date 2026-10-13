import React, { useState } from 'react';
import { 
  X, Laptop, Smartphone, ExternalLink, ArrowRight, 
  ShoppingBag, CheckCircle2, Star, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { WebsiteDemo } from '../types';

interface LivePreviewModalProps {
  demo: WebsiteDemo | null;
  onClose: () => void;
  onOrderThis: (demo: WebsiteDemo) => void;
}

export default function LivePreviewModal({
  demo,
  onClose,
  onOrderThis
}: LivePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  if (!demo) return null;

  const handleTestAddToCart = (itemName: string) => {
    setAddedItem(itemName);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] bg-[#0F172A] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-slideUpModal">
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-[#111827] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Left Title & 4-Digit Code */}
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] text-white text-xs font-mono font-bold shadow-xs">
              {demo.fourDigitCode}
            </span>
            <div>
              <h3 className="text-sm font-black text-white line-clamp-1">
                {demo.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                https://{demo.demoUrl}
              </p>
            </div>
          </div>

          {/* Center Device Switcher */}
          <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Right Action & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOrderThis(demo)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] active:scale-[0.99] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>এই সাইটটি অর্ডার করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Simulator Body */}
        <div className="flex-1 bg-[#0B0F19] p-2 sm:p-4 overflow-y-auto flex items-center justify-center">
          <div
            className={`transition-all duration-300 bg-[#111827] rounded-2xl border border-slate-800 shadow-lg overflow-y-auto max-h-full ${
              deviceMode === 'mobile'
                ? 'w-[360px] h-[640px] rounded-3xl border-4 border-slate-700'
                : 'w-full h-full'
            }`}
          >
            {/* Simulated Website Hero */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
              <img
                src={demo.previewImage}
                alt={demo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] text-white text-xs font-bold w-fit mb-2 shadow-xs">
                  {demo.categoryLabel} • Verified Template
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight text-white mb-2">
                  {demo.heroHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                  {demo.mockData?.heroSub || demo.description}
                </p>
              </div>
            </div>

            {/* Simulated Live Product Catalog */}
            <div className="p-4 sm:p-6 bg-[#111827]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm sm:text-base font-black text-white">
                    Featured Items & Interactive Demo
                  </h4>
                  <p className="text-xs text-slate-400">
                    Click any item to test live customer cart action
                  </p>
                </div>
                {addedItem && (
                  <span className="px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 text-xs font-bold border border-emerald-800 animate-fadeIn">
                    ✓ Added to Cart!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {demo.mockData?.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-950">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs font-black text-purple-400 mt-1">
                        {item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTestAddToCart(item.name)}
                      className="mt-3 w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Add to Order
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom Reassurance in Simulator */}
              <div className="mt-6 p-4 rounded-xl bg-purple-950/40 border border-purple-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <h5 className="text-xs font-bold text-white">
                    পছন্দ হয়েছে? এই ডিজাইনটি দিয়ে আজই আপনার ওয়েবসাইট চালু করুন
                  </h5>
                  <p className="text-[11px] text-slate-300">
                    ২৪ ঘণ্টার মধ্যে .com ডোমেইন এবং বিকাশ পেমেন্ট সহ লাইভ করে দেওয়া হবে।
                  </p>
                </div>
                <button
                  onClick={() => onOrderThis(demo)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                >
                  কনফার্ম করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
