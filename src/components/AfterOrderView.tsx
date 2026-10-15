import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PhoneCall, 
  FolderKanban, 
  Palette, 
  Rocket, 
  Clock, 
  ShieldCheck, 
  MessageCircle,
  LayoutGrid,
  Volume2,
  VolumeX,
  FastForward,
  RotateCcw,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import Card3D from './Card3D';
import ThreeCanvas3D from './ThreeCanvas3D';
import { 
  playKeyboardTypeSound, 
  playStepSwooshSound, 
  playAllStepsCelebrationSound, 
  isAudioMuted, 
  toggleAudioMuted,
  playClickSound
} from '../utils/sound';

interface AfterOrderViewProps {
  onGoToDashboard?: () => void;
  onOpenLiveChat?: () => void;
}

interface StepData {
  stepNum: string;
  serialBn: string;
  badgeEn: string;
  badgeBn: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  timeEn: string;
  timeBn: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function AfterOrderView({ onGoToDashboard, onOpenLiveChat }: AfterOrderViewProps) {
  const { language } = useLanguage();

  const steps: StepData[] = [
    {
      stepNum: '1',
      serialBn: '০১',
      badgeEn: 'Step 1 • Requirements',
      badgeBn: 'ধাপ ০১ • রিকোয়ারমেন্ট যাচাই',
      titleEn: 'Confirmation Call',
      titleBn: 'কনফার্মেশন কল ও পরামর্শ',
      descEn: 'Project manager calls within 15 minutes to confirm your requirements, business goals, and timeline.',
      descBn: 'অর্ডার করার ১৫ মিনিটের মধ্যে আমাদের সিনিয়র প্রজেক্ট ম্যানেজার কল করে সকল রিকয়ারমেন্ট ও পরিকল্পনা নিশ্চিত করবেন।',
      timeEn: '15 mins',
      timeBn: '১৫ মিনিট',
      icon: PhoneCall,
      color: 'from-[#3b5bff] to-[#6366f1]'
    },
    {
      stepNum: '2',
      serialBn: '০২',
      badgeEn: 'Step 2 • Brand Asset Ingestion',
      badgeBn: 'ধাপ ০২ • ব্র্যান্ডিং ও কনটেন্ট',
      titleEn: 'Branding & Content Collection',
      titleBn: 'ব্র্যান্ডিং ও কনটেন্ট সংগ্রহ',
      descEn: 'Easily send your logo, product photos & details via WhatsApp or email, or choose our ready templates.',
      descBn: 'আপনার ব্যবসার লোগো, ছবি ও প্রোডাক্টের বিস্তারিত তথ্য হোয়াটসঅ্যাপ বা মেইলে সহজে পাঠিয়ে দিন অথবা আমাদের প্রস্তুত টেমপ্লেট বেছে নিন।',
      timeEn: '2-4 hrs',
      timeBn: '২-৪ ঘণ্টা',
      icon: FolderKanban,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      stepNum: '3',
      serialBn: '০৩',
      badgeEn: 'Step 3 • Custom Engineering',
      badgeBn: 'ধাপ ০৩ • ডিজাইন ও পেমেন্ট সেটআপ',
      titleEn: 'Setup & Customization',
      titleBn: 'সেটআপ ও সম্পূর্ণ ডিজাইন',
      descEn: 'Theme colors, banners, bKash & Nagad payments, and automated courier tracking are fully integrated.',
      descBn: 'ব্র্যান্ড কালার থিম, ব্যানার, বিকাশ নগদ রকেট অটো-পেমেন্ট এবং কুরিয়ার ট্র্যাকিং সম্পূর্ণ রেডি করা হয়।',
      timeEn: '12 hrs',
      timeBn: '১২ ঘণ্টা',
      icon: Palette,
      color: 'from-amber-500 to-orange-500'
    },
    {
      stepNum: '4',
      serialBn: '০৪',
      badgeEn: 'Step 4 • Production Handover',
      badgeBn: 'ধাপ ০৪ • লাইভ ডেলিভারি ও প্রশিক্ষণ',
      titleEn: 'Live Delivery & Admin Handover',
      titleBn: 'লাইভ ডেলিভারি ও হ্যান্ডওভার',
      descEn: 'Live website handover with custom domain, secure cloud hosting, and full admin dashboard access.',
      descBn: 'নিজস্ব ডট কম ডোমেন, হাই-স্পিড ক্লাউড হোস্টিং ও সম্পূর্ণ এডমিন এক্সেস সহ লাইভ ওয়েবসাইট বুঝিয়ে দেওয়া হবে।',
      timeEn: '24 hrs',
      timeBn: '২৪ ঘণ্টা',
      icon: Rocket,
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  // Modes: 'walkthrough' (step-by-step sequential typing) vs 'all-steps' (all 4 in grid)
  const [viewState, setViewState] = useState<'walkthrough' | 'all-steps'>('walkthrough');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Sub-phases: 'enter' -> 'typing-title' -> 'typing-desc' -> 'reading' -> 'exit'
  const [subPhase, setSubPhase] = useState<'enter' | 'typing-title' | 'typing-desc' | 'reading' | 'exit'>('enter');
  
  // Words streaming counts
  const [visibleTitleCount, setVisibleTitleCount] = useState(0);
  const [visibleDescCount, setVisibleDescCount] = useState(0);
  
  // Reading countdown progress (0% to 100%)
  const [readProgress, setReadProgress] = useState(0);

  // Audio mute state
  const [muted, setMuted] = useState<boolean>(() => isAudioMuted());

  // Refs for timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const readIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = steps[currentStepIndex] || steps[0];
  const titleText = language === 'en' ? currentStep.titleEn : currentStep.titleBn;
  const descText = language === 'en' ? currentStep.descEn : currentStep.descBn;

  const titleWords = titleText.trim().split(/\s+/);
  const descWords = descText.trim().split(/\s+/);

  // Clear all running timers helper
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (readIntervalRef.current) {
      clearInterval(readIntervalRef.current);
      readIntervalRef.current = null;
    }
  }, []);

  // Jump straight to all 4 steps view
  const handleSkipToAll = useCallback(() => {
    clearTimers();
    playClickSound();
    setViewState('all-steps');
  }, [clearTimers]);

  // Restart walkthrough sequence from Step 1
  const handleRestartWalkthrough = useCallback(() => {
    clearTimers();
    playClickSound();
    setCurrentStepIndex(0);
    setViewState('walkthrough');
    setSubPhase('enter');
    setVisibleTitleCount(0);
    setVisibleDescCount(0);
    setReadProgress(0);
  }, [clearTimers]);

  // Advance to next step immediately
  const handleAdvanceNext = useCallback(() => {
    clearTimers();
    playClickSound();
    if (currentStepIndex < steps.length - 1) {
      setSubPhase('exit');
      timerRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
        setSubPhase('enter');
        setVisibleTitleCount(0);
        setVisibleDescCount(0);
        setReadProgress(0);
        playStepSwooshSound();
      }, 300);
    } else {
      playAllStepsCelebrationSound();
      setViewState('all-steps');
    }
  }, [clearTimers, currentStepIndex, steps.length]);

  // Toggle Sound Button handler
  const handleToggleSound = () => {
    const nextMuted = toggleAudioMuted();
    setMuted(nextMuted);
    if (!nextMuted) {
      playKeyboardTypeSound();
    }
  };

  // State Machine for the sequential guide
  useEffect(() => {
    if (viewState !== 'walkthrough') return;

    if (subPhase === 'enter') {
      playStepSwooshSound();
      timerRef.current = setTimeout(() => {
        setSubPhase('typing-title');
        setVisibleTitleCount(0);
      }, 320);
      return () => clearTimers();
    }

    if (subPhase === 'typing-title') {
      if (visibleTitleCount < titleWords.length) {
        timerRef.current = setTimeout(() => {
          setVisibleTitleCount(prev => prev + 1);
          playKeyboardTypeSound();
        }, 85);
      } else {
        timerRef.current = setTimeout(() => {
          setSubPhase('typing-desc');
          setVisibleDescCount(0);
        }, 120);
      }
      return () => clearTimers();
    }

    if (subPhase === 'typing-desc') {
      if (visibleDescCount < descWords.length) {
        timerRef.current = setTimeout(() => {
          setVisibleDescCount(prev => prev + 1);
          playKeyboardTypeSound();
        }, 65);
      } else {
        timerRef.current = setTimeout(() => {
          setSubPhase('reading');
        }, 160);
      }
      return () => clearTimers();
    }

    if (subPhase === 'reading') {
      setReadProgress(0);
      const totalReadMs = 1700;
      const intervalMs = 50;
      const stepPct = (intervalMs / totalReadMs) * 100;

      readIntervalRef.current = setInterval(() => {
        setReadProgress(prev => {
          if (prev >= 100) {
            clearInterval(readIntervalRef.current!);
            return 100;
          }
          return Math.min(100, prev + stepPct);
        });
      }, intervalMs);

      timerRef.current = setTimeout(() => {
        setSubPhase('exit');
      }, totalReadMs);

      return () => clearTimers();
    }

    if (subPhase === 'exit') {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
          setSubPhase('enter');
          setVisibleTitleCount(0);
          setVisibleDescCount(0);
          setReadProgress(0);
        } else {
          playAllStepsCelebrationSound();
          setViewState('all-steps');
        }
      }, 320);
      return () => clearTimers();
    }

  }, [viewState, subPhase, visibleTitleCount, visibleDescCount, titleWords.length, descWords.length, currentStepIndex, steps.length, clearTimers]);

  return (
    <div 
      id="after-order-view"
      data-view="after-order"
      className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col font-sans pb-24 lg:pb-16 pt-6 select-none bg-[#09090b] text-[#f5f5f7]"
    >
      {/* 3D Ambient Background */}
      <ThreeCanvas3D intensity={0.9} />

      {/* Main Targeted Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* 1. WALKTHROUGH MODE: Sequential Step-by-Step Typing Guide */}
        {viewState === 'walkthrough' && (
          <div className="flex flex-col items-center justify-center py-4 sm:py-8 animate-fadeIn">
            
            {/* Top Interactive Bar: Progress Tracker & Sound Toggle */}
            <div className="w-full max-w-2xl mb-6 flex items-center justify-between gap-3 px-2">
              
              {/* Step indicator pills */}
              <div className="flex items-center gap-2">
                {steps.map((st, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isPast = idx < currentStepIndex;

                  return (
                    <div 
                      key={st.stepNum}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCurrent 
                          ? 'w-10 sm:w-14 bg-[#3b5bff] shadow-sm shadow-[#3b5bff]/30' 
                          : isPast 
                          ? 'w-3.5 sm:w-5 bg-emerald-500' 
                          : 'w-3.5 sm:w-5 bg-white/[0.1]'
                      }`}
                      title={st.titleBn}
                    />
                  );
                })}
              </div>

              {/* Top Controls: Sound Toggle & Skip */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    muted 
                      ? 'bg-white/[0.04] text-[#a1a1b0] border-white/[0.08]' 
                      : 'bg-[#3b5bff]/15 text-[#3b5bff] border-[#3b5bff]/30 shadow-xs'
                  }`}
                  title={muted ? 'সাউন্ড চালু করুন (Unmute)' : 'সাউন্ড বন্ধ করুন (Mute)'}
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5 text-[#71717a]" /> : <Volume2 className="w-3.5 h-3.5 text-[#3b5bff] animate-pulse" />}
                  <span className="hidden sm:inline text-[11px]">
                    {muted ? (language === 'en' ? 'Muted' : 'শব্দ বন্ধ') : (language === 'en' ? 'Sound On' : 'কীবোর্ড সাউন্ড')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSkipToAll}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-[#a1a1b0] hover:text-[#f5f5f7] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                  title="স্কিপ করে সরাসরি ৪টি ধাপ একসাথে দেখুন"
                >
                  <span>{language === 'en' ? 'Skip to All' : 'স্কিপ করুন'}</span>
                  <FastForward className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Spotlight Card */}
            <div className="w-full max-w-2xl px-1">
              <div 
                className={`transition-all duration-300 ease-out transform ${
                  subPhase === 'enter' 
                    ? 'opacity-0 translate-y-6 scale-95' 
                    : subPhase === 'exit' 
                    ? 'opacity-0 -translate-y-4 scale-95' 
                    : 'opacity-100 translate-y-0 scale-100'
                }`}
              >
                <Card3D
                  maxTilt={6}
                  scale={1.012}
                  glare={true}
                  className="p-6 sm:p-8 rounded-2xl bg-[#0e0e12]/95 backdrop-blur-xl border border-white/[0.08] shadow-dark-card flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Step Number, Badge & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-white/[0.06] text-[#3b5bff] border border-white/[0.1] text-sm font-bold flex items-center justify-center font-mono">
                          {language === 'en' ? currentStep.stepNum : currentStep.serialBn}
                        </span>

                        <div className="flex flex-col">
                          <span className="text-[11px] font-medium uppercase tracking-wider text-[#3b5bff]">
                            {language === 'en' ? currentStep.badgeEn : currentStep.badgeBn}
                          </span>
                          <span className="text-xs text-[#a1a1b0] font-normal">
                            {language === 'en' ? `Step ${currentStepIndex + 1} of 4` : `ধাপ ${currentStepIndex + 1} এর ৪`}
                          </span>
                        </div>
                      </div>

                      {/* Icon */}
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-tr ${currentStep.color} text-white shadow-lg shadow-[#3b5bff]/20`}>
                        {React.createElement(currentStep.icon, { className: 'w-5 h-5 sm:w-6 sm:h-6 stroke-[2]' })}
                      </div>
                    </div>

                    {/* Step Title — Word by word stream */}
                    <div className="mb-3 min-h-[36px] sm:min-h-[44px] flex items-center flex-wrap gap-x-1.5 gap-y-1">
                      {titleWords.slice(0, visibleTitleCount).map((word, wIdx) => (
                        <h2 
                          key={`tw-${wIdx}`}
                          className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight leading-tight animate-word-pop inline-block"
                        >
                          {word}
                        </h2>
                      ))}
                      {subPhase === 'typing-title' && (
                        <span className="inline-block w-2 h-6 bg-[#3b5bff] rounded-xs animate-cursor-blink ml-0.5 align-middle shadow-xs" />
                      )}
                    </div>

                    {/* Step Description — Word by word stream */}
                    <div className="min-h-[64px] sm:min-h-[72px] mb-5 text-sm sm:text-base text-[#a1a1b0] leading-relaxed font-normal flex flex-wrap gap-x-1.5 gap-y-0.5">
                      {visibleTitleCount >= titleWords.length && descWords.slice(0, visibleDescCount).map((word, wIdx) => (
                        <span 
                          key={`dw-${wIdx}`}
                          className="animate-word-pop inline-block"
                        >
                          {word}
                        </span>
                      ))}
                      {subPhase === 'typing-desc' && (
                        <span className="inline-block w-1.5 h-4 bg-[#3b5bff] rounded-xs animate-cursor-blink ml-0.5 align-middle shadow-xs" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Footer: Next Step Control */}
                  <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleAdvanceNext}
                      className="px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-white bg-[#3b5bff] hover:bg-[#324ecc] shadow-lg shadow-[#3b5bff]/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                    >
                      <span>
                        {currentStepIndex === steps.length - 1 
                          ? (language === 'en' ? 'Finish & See All' : 'সম্পূর্ণ করুন') 
                          : (language === 'en' ? 'Next Step' : 'পরবর্তী ধাপ')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Reading Progress Bar on Bottom of Card */}
                  <div className="w-full bg-white/[0.06] h-1 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#3b5bff] to-emerald-400 transition-all duration-75 ease-linear rounded-full"
                      style={{ 
                        width: subPhase === 'reading' 
                          ? `${readProgress}%` 
                          : subPhase === 'exit' 
                          ? '100%' 
                          : '0%' 
                      }}
                    />
                  </div>
                </Card3D>
              </div>

              {/* Informational Guidance Helper */}
              <div className="text-center mt-4 text-xs text-[#71717a] font-normal">
                {language === 'en' 
                  ? 'Typing out live walkthrough • Will automatically advance through all 4 steps' 
                  : 'অর্ডার নির্দেশিকা টাইপ হচ্ছে • প্রতিটি ধাপ শেষ হলে স্বয়ংক্রিয়ভাবে পরের ধাপ আসবে'}
              </div>
            </div>

          </div>
        )}

        {/* 2. ALL STEPS MODE: Full 4-Card Grid Layout (Completed) */}
        {viewState === 'all-steps' && (
          <div className="animate-fadeIn">
            {/* Header with Replay Controls */}
            <header className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'en' ? 'All 4 Steps Ready' : 'সকল ধাপ সম্পন্ন'}</span>
                </span>

                <button
                  type="button"
                  onClick={handleRestartWalkthrough}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-[#a1a1b0] hover:text-[#f5f5f7] border border-white/[0.08] cursor-pointer transition-all active:scale-95"
                  title="পুনরায় অ্যানিমেশন ও শব্দ সহ গাইড দেখুন"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#3b5bff]" />
                  <span>{language === 'en' ? 'Replay Guide' : 'পুনরায় গাইড শুনুন ও দেখুন'}</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#f5f5f7] tracking-tight">
                {language === 'en' ? (
                  <>
                    How Order Process <span className="text-[#3b5bff] italic font-serif">Works</span>
                  </>
                ) : (
                  <>
                    অর্ডার প্রসেস কিভাবে <span className="text-[#3b5bff] italic font-serif">কাজ করে</span>
                  </>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-[#a1a1b0] mt-1.5 max-w-md mx-auto font-normal">
                {language === 'en' 
                  ? 'Simple 4-step workflow from confirmation to live website' 
                  : 'কনফার্মেশন থেকে লাইভ সাইট হস্তান্তরের ৪টি সহজ ধাপ'}
              </p>
            </header>

            {/* 4 Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <Card3D
                    key={step.stepNum}
                    maxTilt={5}
                    scale={1.015}
                    className="p-5 rounded-2xl bg-[#0e0e12]/95 backdrop-blur-md border border-white/[0.08] hover:border-[#3b5bff]/40 shadow-dark-card transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Step Number & Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-8 h-8 rounded-xl bg-white/[0.06] text-[#3b5bff] border border-white/[0.1] text-xs font-bold flex items-center justify-center font-mono">
                          {language === 'en' ? step.stepNum : step.serialBn}
                        </span>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-tr ${step.color} text-white shadow-md shadow-[#3b5bff]/20`}>
                          <Icon className="w-5 h-5 stroke-[2]" />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-[#f5f5f7] mb-1.5 leading-snug">
                          {language === 'en' ? step.titleEn : step.titleBn}
                        </h3>

                        <p className="text-xs text-[#a1a1b0] leading-relaxed font-normal">
                          {language === 'en' ? step.descEn : step.descBn}
                        </p>
                      </div>
                    </div>
                  </Card3D>
                );
              })}
            </div>

            {/* Reassurance & Action Banner */}
            <Card3D
              maxTilt={3}
              scale={1.01}
              glare={false}
              className="p-4 sm:p-5 rounded-2xl bg-[#0e0e12]/95 backdrop-blur-md border border-white/[0.08] shadow-dark-card flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#f5f5f7]">
                    {language === 'en' 
                      ? 'Free Domain, SSL & Cloud Hosting included with 24/7 support' 
                      : 'ফ্রি ডোমেইন, এসএসএল ও ক্লাউড হোস্টিং সহ সার্বক্ষণিক সাপোর্ট অন্তর্ভুক্ত'}
                  </p>
                  <p className="text-[11px] text-[#a1a1b0] mt-0.5">
                    {language === 'en' 
                      ? '100% verified live handover & continuous technical support' 
                      : 'লাইভ সাইট হস্তান্তর ও সার্বক্ষণিক প্রজেক্ট সাপোর্ট নিশ্চিত'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                {onGoToDashboard && (
                  <button
                    type="button"
                    onClick={onGoToDashboard}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-medium text-[#f5f5f7] bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <LayoutGrid className="w-3.5 h-3.5 text-[#a1a1b0]" />
                      {language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
                    </span>
                  </button>
                )}

                {onOpenLiveChat && (
                  <button
                    type="button"
                    onClick={onOpenLiveChat}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-medium text-white bg-[#3b5bff] hover:bg-[#324ecc] shadow-md shadow-[#3b5bff]/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {language === 'en' ? 'Live Chat' : 'লাইভ চ্যাট'}
                    </span>
                  </button>
                )}
              </div>
            </Card3D>
          </div>
        )}

      </section>
    </div>
  );
}
