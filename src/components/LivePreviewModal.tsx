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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-[#0D253D]/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl flex flex-col overflow-hidden animate-slideUpModal">
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-[#F8FAFD] border-b border-[#E5EDF5] flex flex-wrap items-center justify-between gap-3">
          {/* Left Title & 4-Digit Code */}
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-[#533AFD] text-[#FFFFFF] text-xs font-mono font-bold">
              {demo.fourDigitCode}
            </span>
            <div>
              <h3 className="text-sm font-black text-[#0D253D] line-clamp-1">
                {demo.title}
              </h3>
              <p className="text-[11px] text-[#64748D] font-mono">
                https://{demo.demoUrl}
              </p>
            </div>
          </div>

          {/* Center Device Switcher */}
          <div className="hidden sm:flex items-center bg-[#FFFFFF] p-1 rounded-xl border border-[#E5EDF5]">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-[#533AFD] text-[#FFFFFF] shadow-xs'
                  : 'text-[#64748D] hover:text-[#0D253D]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-[#533AFD] text-[#FFFFFF] shadow-xs'
                  : 'text-[#64748D] hover:text-[#0D253D]'
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
              className="px-4 py-2 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>এই সাইটটি অর্ডার করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#E5EDF5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Simulator Body */}
        <div className="flex-1 bg-[#F8FAFD] p-2 sm:p-4 overflow-y-auto flex items-center justify-center">
          <div
            className={`transition-all duration-300 bg-[#FFFFFF] rounded-2xl border border-[#E5EDF5] shadow-lg overflow-y-auto max-h-full ${
              deviceMode === 'mobile'
                ? 'w-[360px] h-[640px] rounded-3xl border-4 border-[#273951]'
                : 'w-full h-full'
            }`}
          >
            {/* Simulated Website Hero */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#273951]">
              <img
                src={demo.previewImage}
                alt={demo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D253D] via-[#0D253D]/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="px-3 py-1 rounded-full bg-[#533AFD] text-white text-xs font-bold w-fit mb-2">
                  {demo.categoryLabel} • Verified Template
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight text-white mb-2">
                  {demo.heroHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                  {demo.mockData?.heroSub || demo.description}
                </p>
              </div>
            </div>

            {/* Simulated Live Product Catalog */}
            <div className="p-4 sm:p-6 bg-[#FFFFFF]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm sm:text-base font-black text-[#0D253D]">
                    Featured Items & Interactive Demo
                  </h4>
                  <p className="text-xs text-[#64748D]">
                    Click any item to test live customer cart action
                  </p>
                </div>
                {addedItem && (
                  <span className="px-3 py-1 rounded-full bg-[#00B261]/10 text-[#00B261] text-xs font-bold border border-[#00B261]/20 animate-fadeIn">
                    ✓ Added to Cart!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {demo.mockData?.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] hover:border-[#533AFD] transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-[#E5EDF5]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0D253D] line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs font-black text-[#533AFD] mt-1">
                        {item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTestAddToCart(item.name)}
                      className="mt-3 w-full py-1.5 px-3 rounded-lg bg-[#533AFD] hover:bg-[#665EFD] text-[#FFFFFF] text-xs font-bold transition-all"
                    >
                      Add to Order
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom Reassurance in Simulator */}
              <div className="mt-6 p-4 rounded-xl bg-[#E2E4FF]/40 border border-[#533AFD]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <h5 className="text-xs font-bold text-[#0D253D]">
                    পছন্দ হয়েছে? এই ডিজাইনটি দিয়ে আজই আপনার ওয়েবসাইট চালু করুন
                  </h5>
                  <p className="text-[11px] text-[#64748D]">
                    ২৪ ঘণ্টার মধ্যে .com ডোমেইন এবং বিকাশ পেমেন্ট সহ লাইভ করে দেওয়া হবে।
                  </p>
                </div>
                <button
                  onClick={() => onOrderThis(demo)}
                  className="px-4 py-2 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] text-[#FFFFFF] text-xs font-bold transition-all shadow-xs shrink-0"
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
