import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, ShoppingBag, CheckCircle2, 
  ShieldCheck, Zap, Headphones, Globe, MessageCircle, 
  ChevronDown, Layers, Sparkles, Box
} from 'lucide-react';
import { WebsiteDemo } from '../types';
import Card3D from './Card3D';
import ThreeCanvas3D from './ThreeCanvas3D';
import { playClickSound } from '../utils/sound';

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
  const [show3DStage, setShow3DStage] = useState(false);
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
    <div className="min-h-screen w-full bg-[#F8F5FC] text-[#1F1F2E] flex flex-col font-sans pb-16">
      {/* 1. Purple Header (Matches #5B2C8A Theme) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#5B2C8A] border-b border-[#4A1F6E] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 select-none">
          {/* Left: Enhanced Back to Templates / Home */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onBackToDashboard}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/35 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs group"
              title="ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-white" />
              <span>ফিরে যান</span>
            </button>

            {/* "ভিউ ডিটেইলস" Interactive Spec Drawer Button */}
            <button
              onClick={handleToggleDetails}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                detailsExpanded
                  ? 'bg-white text-[#5B2C8A] shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
            >
              <span>ভিউ ডিটেইলস</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${detailsExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Right: Integrated Order Number & Solid Purple/White Action Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onGoToOrder(demo)}
              className="px-4 sm:px-5 py-2 rounded-xl bg-white hover:bg-purple-50 text-[#5B2C8A] text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span className="px-2 py-0.5 rounded-md bg-[#5B2C8A]/10 text-[#5B2C8A] font-mono font-bold text-xs">
                {demo.fourDigitCode}
              </span>
              <span>এখনই কিনুন</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Header Placeholder Spacer */}
      <div className="h-14 sm:h-16 w-full shrink-0" />

      {/* 2. Main Live Website Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 bg-[#F1F5F9]">
        
        {/* Showcase Mode Header */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] animate-pulse" />
            <h2 className="text-sm sm:text-base font-black text-slate-800">
              {show3DStage ? 'ইন্টারেক্টিভ ৩ডি ডিভাইস স্টুডিও (3D Device Stage)' : 'লাইভ ওয়েবসাইট ইন্টারফেস'}
            </h2>
          </div>

          <div className="inline-flex items-center p-0.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setShow3DStage(false);
                playClickSound();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                !show3DStage
                  ? 'bg-purple-100 text-purple-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>ইন্টারফেস ভিউ</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShow3DStage(true);
                playClickSound();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                show3DStage
                  ? 'bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>🧊 ৩ডি ডিভাইস মডেল</span>
            </button>
          </div>
        </div>

        {/* Real Live Website Showcase Area */}
        <section className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {show3DStage ? (
            <div className="w-full h-[450px] sm:h-[550px] bg-slate-950 relative overflow-hidden animate-fadeIn">
              <ThreeCanvas3D intensity={1} />
            </div>
          ) : (
            /* Hero Banner Section */
            <div className="relative w-full aspect-[16/7] min-h-[240px] sm:min-h-[360px] overflow-hidden">
              <img
                src={demo.previewImage}
                alt={demo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-5 sm:p-8 md:p-10 text-white">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] text-white text-xs font-bold w-fit mb-2 shadow-xs">
                  {demo.categoryLabel}
                </span>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight max-w-2xl drop-shadow-sm text-white">
                  {demo.heroHeadline || demo.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl hidden sm:block">
                  {demo.mockData?.heroSub || demo.description}
                </p>
              </div>
            </div>
          )}

          {/* Interactive Products / Menu Simulation */}
          <div className="p-5 sm:p-8 bg-white">
            {addedItem && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-md animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{addedItem} টেস্ট কার্টে সফলভাবে যোগ হয়েছে!</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md">
                  লাইভ ফিচার
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  লাইভ ক্যাটালগ ও পণ্য তালিকা
                </h3>
                <p className="text-xs text-slate-500">
                  আপনার ওয়েবসাইটে ঠিক এমন প্রিমিয়াম ক্যাটালগ সেটআপ থাকবে
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ⚡ ২৪ ঘণ্টা রেডি
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {demo.mockData?.items?.map((item, idx) => (
                <Card3D
                  key={idx}
                  maxTilt={10}
                  scale={1.02}
                  glare={true}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-400 transition-all flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-start gap-3 mb-3" style={{ transform: 'translateZ(18px)' }}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      {item.tag && (
                        <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md mb-1 inline-block border border-purple-200">
                          {item.tag}
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-xs font-black text-purple-700 mt-1 font-mono">
                        {item.price}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      handleTestAddToCart(item.name);
                    }}
                    style={{ transform: 'translateZ(22px)' }}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-[#7C3AED] hover:text-white text-slate-700 border border-slate-200 hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>কার্ট টেস্ট করুন</span>
                  </button>
                </Card3D>
              ))}
            </div>
          </div>
        </section>

        {/* Step-by-Step Detailed Specs Section (Toggled from Top Header) */}
        {detailsExpanded && (
          <section ref={detailsRef} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 animate-fadeIn shadow-sm">
            <div className="max-w-2xl mb-6">
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                প্রযুক্তিগত বিস্তারিত তালিকা
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                ওয়েবসাইট কোড {demo.fourDigitCode} এর পূর্ণাঙ্গ ৫টি ফিচার
              </h3>
            </div>

            <div className="space-y-3.5">
              {detailedSpecs.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 shadow-2xs"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6B46C1] to-[#7C3AED] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                    {spec.step}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {spec.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Pricing Architecture & Inclusions Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Transparent Financial Architecture Breakdown */}
          <div className="p-5 sm:p-6 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2 border border-purple-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>স্বচ্ছ মূল্য ও আজীবন মালিকানা</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                এককালীন সেটআপ ফি ও নিয়মিত ক্লাউড হোস্টিং
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                কোনো হিডেন চার্জ নেই। এককালীন ফি দিয়ে ওয়েবসাইট বুঝে নিন, সাথে মাত্র ১২০ টাকা মাসিক ক্লাউড সার্ভার খরচে নিশ্চিত করুন ৯৯.৯% আপটাইম।
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 shadow-2xs text-center min-w-[130px]">
                <span className="text-[11px] font-semibold text-slate-500 block">এককালীন সেটআপ</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block mt-0.5">
                  {demo.priceTag || '৳১,৯৯০'}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">ফুল লাইভ সাইট</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-purple-200 shadow-2xs text-center min-w-[130px] ring-2 ring-purple-500/20">
                <span className="text-[11px] font-semibold text-slate-500 block">মাসিক ক্লাউড খরচ</span>
                <span className="text-xl sm:text-2xl font-black text-purple-700 font-mono block mt-0.5">
                  ৳১২০
                </span>
                <span className="text-[10px] text-purple-600 font-bold block mt-0.5">সার্ভার ও ব্যাকআপ</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-slate-900">ফ্রি .com ডোমেইন</h5>
              <p className="text-xs text-slate-600 mt-1">
                আপনার পছন্দের ব্র্যান্ড নামে ১ বছর ফ্রি অফিশিয়াল ডোমেইন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-slate-900">২৪ ঘণ্টা লাইভ ডেলিভারি</h5>
              <p className="text-xs text-slate-600 mt-1">
                অর্ডার নিশ্চিত করার মাত্র ২৪ ঘণ্টার মধ্যে ফুল সাইট লাইভ।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-slate-900">১০০% মানিব্যাক</h5>
              <p className="text-xs text-slate-600 mt-1">
                কাজের গুণমানে শতভাগ সন্তুষ্টির গ্যারান্টি, কোনো ঝুঁকি নেই।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h5 className="text-sm font-bold text-slate-900">২৪/৭ ফুল সাপোর্ট</h5>
              <p className="text-xs text-slate-600 mt-1">
                সরাসরি ডেডিকেটেড ইঞ্জিনিয়ার থেকে আজীবন টেকনিক্যাল হেল্প।
              </p>
            </div>
          </div>

          {/* Action Order Box with Integrated Red Order Button */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-base font-black text-slate-900">
                পছন্দ হয়েছে? এখনই নিজের ব্যবসার জন্য অর্ডার করুন
              </p>
              <p className="text-xs text-slate-500">
                কোনো অগ্রিম অতিরিক্ত চার্জ নেই • ১ মিনিটেই সম্পন্ন করুন
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/8801819847250"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp কনসাল্টেশন</span>
              </a>

              {/* Order Button with Order Number Together */}
              <button
                onClick={() => onGoToOrder(demo)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#6B46C1] hover:from-[#8B5CF6] hover:to-[#7C3AED] text-white text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:scale-105 active:scale-95"
              >
                <span className="px-2 py-0.5 rounded-lg bg-black/25 text-white font-mono font-bold text-xs">
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
      <footer className="w-full py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 mt-12">
        <p>© 2026 BongoWeb — All Rights Reserved.</p>
      </footer>
    </div>
  );
}
