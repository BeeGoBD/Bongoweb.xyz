import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, ShoppingBag, CheckCircle2, 
  ShieldCheck, Zap, Headphones, Globe, MessageCircle, 
  ChevronDown, Layers, Sparkles
} from 'lucide-react';
import { WebsiteDemo } from '../types';

interface WebsiteDetailPageProps {
  demo: WebsiteDemo;
  onBackToDashboard: () => void;
  onGoToOrder: (demo: WebsiteDemo) => void;
}

export default function WebsiteDetailPage({
  demo,
  onBackToDashboard,
  onGoToOrder
}: WebsiteDetailPageProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleTestAddToCart = (itemName: string) => {
    setAddedItem(itemName);
    setTimeout(() => setAddedItem(null), 2500);
  };

  const handleToggleDetails = () => {
    const nextState = !detailsExpanded;
    setDetailsExpanded(nextState);
    if (nextState) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // 5 Real-Time Step-by-Step Feature Specifications
  const detailedSpecs = [
    {
      step: '১',
      title: 'সম্পূর্ণ রেসপন্সিভ ও মোবাইল অপ্টিমাইজড আর্কিটেকচার',
      description: 'যেকোনো মোবাইল, ট্যাবলেট কিংবা ডেক্সটপ কম্পিউটারে স্বয়ংক্রিয়ভাবে খাপ খাইয়ে নিখুঁতভাবে প্রদর্শিত হবে।'
    },
    {
      step: '২',
      title: 'উচ্চগতির ডেডিকেটেড ক্লাউড হোস্টিং ও ফ্রি SSL সিকিউরিটি',
      description: 'অত্যাধুনিক NVMe ক্লাউড সার্ভার এবং নিরাপদ এনক্রিপ্টেড SSL সার্টিফিকেট সার্বক্ষণিক সক্রিয় থাকবে।'
    },
    {
      step: '৩',
      title: 'বিকাশ, নগদ, রকেট ও কার্ড অটো পেমেন্ট গেটওয়ে ইন্টিগ্রেশন',
      description: 'সরাসরি আপনার নিজস্ব মার্চেন্ট বা পার্সোনাল একাউন্টে তাৎক্ষণিক অটোমেটেড পেমেন্ট সেটআপ।'
    },
    {
      step: '৪',
      title: 'অটোমেটেড কুরিয়ার ট্র্যাকিং ও এসএমএস নোটিফিকেশন',
      description: 'Steadfast, Pathao ও RedX কুরিয়ার API ইন্টিগ্রেশন যার মাধ্যমে গ্রাহক স্বয়ংক্রিয় ট্র্যাকিং পাবেন।'
    },
    {
      step: '৫',
      title: 'আজীবন টেকনিক্যাল মেইনটেন্যান্স ও ২৪/৭ ডেডিকেটেড ইঞ্জিনিয়ার সাপোর্ট',
      description: 'কোনো সমস্যা ছাড়াই নির্বিঘ্নে ব্যবসা পরিচালনায় সার্বক্ষণিক সরাসরি হোয়াটসঅ্যাপ ও ফোন সাপোর্ট।'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#0D253D] flex flex-col font-sans">
      {/* 1. Slim Fixed Header (Strictly fixed at top, permanently stays fixed when scrolling) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5EDF5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 select-none">
          {/* Left: Enhanced Back to Dashboard + View Details Action */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] active:bg-[#533AFD] active:text-[#FFFFFF] text-[#533AFD] border border-[#E5EDF5] hover:border-[#533AFD]/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
              title="ড্যাশবোর্ডে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden xs:inline">ড্যাশবোর্ড</span>
            </button>

            <div className="h-6 w-px bg-[#E5EDF5] hidden sm:block" />

            {/* "ভিউ ডিটেইলস" Interactive Spec Drawer Button */}
            <button
              onClick={handleToggleDetails}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                detailsExpanded
                  ? 'bg-[#E2E4FF] text-[#533AFD] border border-[#533AFD]/30 shadow-2xs'
                  : 'bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-[#FFFFFF] shadow-[0_3px_12px_rgba(83,58,253,0.25)] hover:shadow-[0_4px_18px_rgba(83,58,253,0.35)]'
              }`}
            >
              <span>ভিউ ডিটেইলস</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${detailsExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Right: Integrated Order Number & Red Action Button with Natural Attraction */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onGoToOrder(demo)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] active:bg-[#C62828] text-[#FFFFFF] text-xs sm:text-sm font-black shadow-[0_4px_20px_rgba(229,57,53,0.4)] hover:shadow-[0_6px_26px_rgba(229,57,53,0.5)] transition-all flex items-center gap-2.5 cursor-pointer hover:scale-[1.02] active:scale-95 animate-pulse hover:animate-none"
            >
              {/* Order Number badge inside button */}
              <span className="px-2.5 py-0.5 rounded-lg bg-black/25 text-[#FFFFFF] font-mono font-black text-xs tracking-wider border border-white/10 shadow-inner">
                {demo.fourDigitCode}
              </span>
              <span className="tracking-tight">অর্ডার করুন</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Header Placeholder Spacer (Matches fixed header height so website content never jumps) */}
      <div className="h-14 sm:h-16 w-full shrink-0" />

      {/* Small Clean Separation Gap */}
      <div className="h-3 sm:h-4 bg-[#F8FAFD] border-b border-[#E5EDF5]" />

      {/* 2. Main Live Website Content (Natural White Background, No Hover Frames) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 bg-[#FFFFFF]">
        {/* Real Live Website Showcase Area */}
        <section className="w-full bg-[#FFFFFF] rounded-2xl border border-[#E5EDF5] overflow-hidden shadow-xs">
          {/* Hero Banner Section */}
          <div className="relative w-full aspect-[16/7] min-h-[240px] sm:min-h-[360px] overflow-hidden">
            <img
              src={demo.previewImage}
              alt={demo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D253D] via-[#0D253D]/45 to-transparent flex flex-col justify-end p-5 sm:p-8 md:p-10 text-white">
              <span className="px-3 py-1 rounded-full bg-[#533AFD] text-white text-xs font-bold w-fit mb-2 shadow-xs">
                {demo.categoryLabel}
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight max-w-2xl drop-shadow-sm">
                {demo.heroHeadline || demo.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-2 max-w-xl hidden sm:block">
                {demo.mockData?.heroSub || demo.description}
              </p>
            </div>
          </div>

          {/* Interactive Products / Menu Simulation */}
          <div className="p-5 sm:p-8 bg-[#FFFFFF]">
            {addedItem && (
              <div className="mb-5 p-3.5 rounded-xl bg-[#00B261] text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{addedItem} টেস্ট কার্টে সফলভাবে যোগ হয়েছে!</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">
                  লাইভ ফিচার
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E5EDF5]">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0D253D]">
                  লাইভ ক্যাটালগ ও পণ্য তালিকা
                </h3>
                <p className="text-xs text-[#64748D]">
                  আপনার ওয়েবসাইটে ঠিক এমন প্রিমিয়াম ক্যাটালগ সেটআপ থাকবে
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#00B261] bg-[#00B261]/10 px-2.5 py-1 rounded-lg">
                  ⚡ ২৪ ঘণ্টা রেডি
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {demo.mockData?.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] hover:border-[#533AFD] transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E5EDF5] shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      {item.tag && (
                        <span className="text-[9px] font-bold text-[#533AFD] bg-[#E2E4FF] px-2 py-0.5 rounded-md mb-1 inline-block">
                          {item.tag}
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-[#0D253D] line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-xs font-black text-[#533AFD] mt-1 font-mono">
                        {item.price}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestAddToCart(item.name)}
                    className="w-full py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#533AFD] hover:text-[#FFFFFF] text-[#0D253D] border border-[#E5EDF5] hover:border-[#533AFD] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>কার্ট টেস্ট করুন</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step-by-Step Detailed Specs Section (Toggled from Top Header) */}
        {detailsExpanded && (
          <section ref={detailsRef} className="bg-[#F8FAFD] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 animate-fadeIn">
            <div className="max-w-2xl mb-6">
              <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold border border-[#533AFD]/20">
                প্রযুক্তিগত বিস্তারিত তালিকা
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0D253D] mt-2">
                ওয়েবসাইট কোড {demo.fourDigitCode} এর পূর্ণাঙ্গ ৫টি ফিচার
              </h3>
            </div>

            <div className="space-y-3.5">
              {detailedSpecs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] flex items-start gap-4 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#533AFD] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                    {spec.step}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">
                      {spec.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#64748D] mt-1 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Inclusions & Action Section (Removed "Clear Package Rate" Header as Requested) */}
        <section className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
              <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-[#0D253D]">ফ্রি .com ডোমেইন</h5>
              <p className="text-xs text-[#64748D] mt-1">
                আপনার পছন্দের ব্র্যান্ড নামে ১ বছর ফ্রি অফিশিয়াল ডোমেইন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
              <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-[#0D253D]">২৪ ঘণ্টা লাইভ ডেলিভারি</h5>
              <p className="text-xs text-[#64748D] mt-1">
                অর্ডার নিশ্চিত করার মাত্র ২৪ ঘণ্টার মধ্যে ফুল সাইট লাইভ।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
              <div className="w-10 h-10 rounded-xl bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-[#0D253D]">১০০% মানিব্যাক</h5>
              <p className="text-xs text-[#64748D] mt-1">
                কাজের গুণমানে শতভাগ সন্তুষ্টির গ্যারান্টি, কোনো ঝুঁকি নেই।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
              <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-[#0D253D]">২৪/৭ ফুল সাপোর্ট</h5>
              <p className="text-xs text-[#64748D] mt-1">
                সরাসরি ডেডিকেটেড ইঞ্জিনিয়ার থেকে আজীবন টেকনিক্যাল হেল্প।
              </p>
            </div>
          </div>

          {/* Action Order Box with Integrated Red Order Button */}
          <div className="pt-6 border-t border-[#E5EDF5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-base font-black text-[#0D253D]">
                পছন্দ হয়েছে? এখনই নিজের ব্যবসার জন্য অর্ডার করুন
              </p>
              <p className="text-xs text-[#64748D]">
                কোনো অগ্রিম অতিরিক্ত চার্জ নেই • ১ মিনিটেই সম্পন্ন করুন
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#00B261] hover:bg-[#009e56] text-[#FFFFFF] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp কনসাল্টেশন</span>
              </a>

              {/* Red Order Button with Order Number Together */}
              <button
                onClick={() => onGoToOrder(demo)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] active:bg-[#C62828] text-[#FFFFFF] text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(229,57,53,0.35)] hover:scale-105 active:scale-95"
              >
                <span className="px-2 py-0.5 rounded-lg bg-black/20 text-[#FFFFFF] font-mono font-bold text-xs">
                  {demo.fourDigitCode}
                </span>
                <span>অর্ডার পেজে যান</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-[#E5EDF5] bg-[#FFFFFF] text-center text-xs text-[#64748D] mt-12">
        <p>© 2026 BongoWeb — All Rights Reserved. Stripe Design System Standards.</p>
      </footer>
    </div>
  );
}
