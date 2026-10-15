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
  Sparkles,
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
  highlightsEn: string[];
  highlightsBn: string[];
  timeEn: string;
  timeBn: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  accentBg: string;
  borderColor: string;
  bottomBorderColor: string;
  shadowColor: string;
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
      highlightsEn: ['Direct Call in 15 mins', 'Feature Analysis', 'Dedicated Project Lead'],
      highlightsBn: ['১৫ মিনিটে সরাসরি কল', 'ফিচার বিশ্লেষণ', 'ডেডিকেটেড প্রজেক্ট লিড'],
      timeEn: '15 mins',
      timeBn: '১৫ মিনিট',
      icon: PhoneCall,
      color: 'from-purple-500 to-indigo-600',
      accentBg: 'bg-purple-50 text-purple-700 border-purple-200',
      borderColor: 'border-purple-200',
      bottomBorderColor: 'border-b-purple-400',
      shadowColor: 'shadow-[0_4px_0_0_#C084FC,0_8px_16px_rgba(124,58,237,0.18)]'
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
      highlightsEn: ['Easy WhatsApp Drop', 'Catalog Upload', 'Free Content Drafting'],
      highlightsBn: ['সহজ হোয়াটসঅ্যাপ ড্রপ', 'ক্যাটালগ আপলোড', 'ফ্রি কনটেন্ট সহায়তা'],
      timeEn: '2-4 hrs',
      timeBn: '২-৪ ঘণ্টা',
      icon: FolderKanban,
      color: 'from-blue-500 to-cyan-600',
      accentBg: 'bg-blue-50 text-blue-700 border-blue-200',
      borderColor: 'border-blue-200',
      bottomBorderColor: 'border-b-blue-400',
      shadowColor: 'shadow-[0_4px_0_0_#93C5FD,0_8px_16px_rgba(59,130,246,0.18)]'
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
      highlightsEn: ['Mobile Responsive', 'bKash/Nagad Payment', 'Courier Automation'],
      highlightsBn: ['ফুল রেসপনসিভ ভিউ', 'বিকাশ ও নগদ পেমেন্ট', 'কুরিয়ার অটোমেশন'],
      timeEn: '12 hrs',
      timeBn: '১২ ঘণ্টা',
      icon: Palette,
      color: 'from-amber-500 to-orange-600',
      accentBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderColor: 'border-amber-200',
      bottomBorderColor: 'border-b-amber-400',
      shadowColor: 'shadow-[0_4px_0_0_#FDE68A,0_8px_16px_rgba(245,158,11,0.18)]'
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
      highlightsEn: ['Custom .com Domain', 'Full Admin Credentials', '24/7 Dedicated Support'],
      highlightsBn: ['নিজস্ব ডোমেন ও হোস্টিং', 'সম্পূর্ণ অ্যাডমিন এক্সেস', 'সার্বক্ষণিক সাপোর্ট'],
      timeEn: '24 hrs',
      timeBn: '২৪ ঘণ্টা',
      icon: Rocket,
      color: 'from-emerald-500 to-teal-600',
      accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderColor: 'border-emerald-200',
      bottomBorderColor: 'border-b-emerald-400',
      shadowColor: 'shadow-[0_4px_0_0_#6EE7B7,0_8px_16px_rgba(16,185,129,0.18)]'
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
      // Completed last step
      playAllStepsCelebrationSound();
      setViewState('all-steps');
    }
  }, [currentStepIndex, steps.length, clearTimers]);

  // Audio mute toggle
  const handleToggleSound = () => {
    const nextMuted = toggleAudioMuted();
    setMuted(nextMuted);
    if (!nextMuted) {
      playClickSound();
    }
  };

  // Main Walkthrough Typing & Progression State Machine
  useEffect(() => {
    if (viewState !== 'walkthrough') return;

    // Phase: Entering
    if (subPhase === 'enter') {
      setVisibleTitleCount(0);
      setVisibleDescCount(0);
      setReadProgress(0);
      playStepSwooshSound();

      timerRef.current = setTimeout(() => {
        setSubPhase('typing-title');
      }, 250);
      return () => clearTimers();
    }

    // Phase: Typing Title word by word
    if (subPhase === 'typing-title') {
      if (visibleTitleCount < titleWords.length) {
        timerRef.current = setTimeout(() => {
          setVisibleTitleCount(prev => prev + 1);
          playKeyboardTypeSound({ isSpace: false, volume: 0.08 });
        }, 130);
      } else {
        // Title finished, brief pause before description starts
        timerRef.current = setTimeout(() => {
          setSubPhase('typing-desc');
        }, 150);
      }
      return () => clearTimers();
    }

    // Phase: Typing Description word by word
    if (subPhase === 'typing-desc') {
      if (visibleDescCount < descWords.length) {
        timerRef.current = setTimeout(() => {
          setVisibleDescCount(prev => prev + 1);
          // Space/punctuation rhythm variation
          const isSpaceKey = (visibleDescCount + 1) % 4 === 0;
          playKeyboardTypeSound({ isSpace: isSpaceKey, volume: 0.075 });
        }, 115);
      } else {
        // Description finished, transition to reading phase
        timerRef.current = setTimeout(() => {
          setSubPhase('reading');
        }, 180);
      }
      return () => clearTimers();
    }

    // Phase: Reading Completed Step
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
        // Step guide has finished! It will now disappear, and the next will come
        setSubPhase('exit');
      }, totalReadMs);

      return () => clearTimers();
    }

    // Phase: Exiting Step -> Next Step or All Steps View
    if (subPhase === 'exit') {
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
          setSubPhase('enter');
          setVisibleTitleCount(0);
          setVisibleDescCount(0);
          setReadProgress(0);
        } else {
          // All 4 steps completed! Reveal all steps together
          playAllStepsCelebrationSound();
          setViewState('all-steps');
        }
      }, 350);
      return () => clearTimers();
    }

  }, [viewState, subPhase, visibleTitleCount, visibleDescCount, titleWords.length, descWords.length, currentStepIndex, steps.length, clearTimers]);

  return (
    <div 
      id="after-order-view"
      data-view="after-order"
      className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col font-sans pb-24 lg:pb-16 pt-3 sm:pt-6 select-none bg-slate-50/80 text-slate-900 perspective-1500"
    >
      {/* 3D Ambient Universe Background */}
      <ThreeCanvas3D intensity={0.85} />

      {/* Main Targeted Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full preserve-3d">
        
        {/* ======================================================== */}
        {/* 1. WALKTHROUGH MODE: Sequential Step-by-Step Typing Guide */}
        {/* ======================================================== */}
        {viewState === 'walkthrough' && (
          <div className="flex flex-col items-center justify-center py-2 sm:py-6 preserve-3d animate-fadeIn">
            
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
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isCurrent 
                          ? 'w-10 sm:w-14 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-sm shadow-purple-300' 
                          : isPast 
                          ? 'w-4 sm:w-6 bg-emerald-500' 
                          : 'w-4 sm:w-6 bg-slate-200'
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
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-[1px] ${
                    muted 
                      ? 'bg-slate-100 text-slate-500 border-slate-200' 
                      : 'bg-purple-50 text-purple-700 border-purple-200 border-b-2 border-b-purple-300 shadow-2xs'
                  }`}
                  title={muted ? 'সাউন্ড চালু করুন (Unmute)' : 'সাউন্ড বন্ধ করুন (Mute)'}
                >
                  {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-purple-600 animate-pulse" />}
                  <span className="hidden sm:inline text-[11px]">
                    {muted ? (language === 'en' ? 'Muted' : 'শব্দ বন্ধ') : (language === 'en' ? 'Sound On' : 'কীবোর্ড সাউন্ড')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSkipToAll}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 border-b-2 border-b-slate-300 shadow-2xs active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1"
                  title="স্কিপ করে সরাসরি ৪টি ধাপ একসাথে দেখুন"
                >
                  <span>{language === 'en' ? 'Skip to All' : 'স্কিপ করুন'}</span>
                  <FastForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* The Single Spotlight 3D Card (Enters, types out word-by-word with keyboard sound, then departs) */}
            <div className="w-full max-w-2xl px-1">
              <div 
                className={`transition-all duration-300 ease-out transform ${
                  subPhase === 'enter' 
                    ? 'opacity-0 translate-y-8 scale-95' 
                    : subPhase === 'exit' 
                    ? 'opacity-0 -translate-y-6 scale-95' 
                    : 'opacity-100 translate-y-0 scale-100'
                }`}
              >
                <Card3D
                  maxTilt={8}
                  scale={1.015}
                  glare={true}
                  className={`p-6 sm:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border ${currentStep.borderColor} border-b-[4px] ${currentStep.bottomBorderColor} ${currentStep.shadowColor} flex flex-col justify-between preserve-3d`}
                >
                  <div>
                    {/* Header: Step Number, Badge & 3D Floating Icon */}
                    <div className="flex items-center justify-between mb-5 translate-z-lg">
                      <div className="flex items-center gap-2.5">
                        <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 border-b-[3px] border-b-purple-400 text-sm sm:text-base font-black flex items-center justify-center font-mono shadow-sm">
                          {language === 'en' ? currentStep.stepNum : currentStep.serialBn}
                        </span>

                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600/90">
                            {language === 'en' ? currentStep.badgeEn : currentStep.badgeBn}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {language === 'en' ? `Step ${currentStepIndex + 1} of 4` : `ধাপ ${currentStepIndex + 1} এর ৪`}
                          </span>
                        </div>
                      </div>

                      {/* 3D Gradient Icon */}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-tr ${currentStep.color} text-white shadow-[0_6px_16px_rgba(124,58,237,0.3),inset_0_1.5px_1px_rgba(255,255,255,0.7),inset_0_-1.5px_1px_rgba(0,0,0,0.2)] border border-white/50 animate-bounce-slow`}>
                        {React.createElement(currentStep.icon, { className: 'w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]' })}
                      </div>
                    </div>

                    {/* Step Title — Word by word stream */}
                    <div className="mb-3 min-h-[36px] sm:min-h-[44px] flex items-center flex-wrap gap-x-1.5 gap-y-1 translate-z-md">
                      {titleWords.slice(0, visibleTitleCount).map((word, wIdx) => (
                        <h2 
                          key={`tw-${wIdx}`}
                          className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight animate-word-pop inline-block"
                        >
                          {word}
                        </h2>
                      ))}
                      {subPhase === 'typing-title' && (
                        <span className="inline-block w-2.5 h-6 sm:h-7 bg-purple-600 rounded-xs animate-cursor-blink ml-0.5 align-middle shadow-xs" />
                      )}
                    </div>

                    {/* Step Description — Word by word stream */}
                    <div className="min-h-[64px] sm:min-h-[72px] mb-5 text-sm sm:text-base text-slate-700 leading-relaxed font-normal flex flex-wrap gap-x-1.5 gap-y-0.5 translate-z-sm">
                      {visibleTitleCount >= titleWords.length && descWords.slice(0, visibleDescCount).map((word, wIdx) => (
                        <span 
                          key={`dw-${wIdx}`}
                          className="animate-word-pop inline-block"
                        >
                          {word}
                        </span>
                      ))}
                      {subPhase === 'typing-desc' && (
                        <span className="inline-block w-2 h-4 sm:h-5 bg-indigo-500 rounded-xs animate-cursor-blink ml-0.5 align-middle shadow-xs" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Footer: Time Estimate + Next Step Control */}
                  <div className="pt-4 mt-2 border-t border-slate-200/80 flex items-center justify-between gap-3 translate-z-sm">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-700 font-bold bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>{language === 'en' ? `Est Time: ${currentStep.timeEn}` : `আনুমানিক সময়: ${currentStep.timeBn}`}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAdvanceNext}
                      className="px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border border-purple-400 border-b-[3px] border-b-purple-900 shadow-[0_3px_0_0_#4C1D95] active:border-b active:translate-y-[1.5px] transition-all cursor-pointer flex items-center gap-1.5 btn-3d-tactile"
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
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-75 ease-linear rounded-full"
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
              <div className="text-center mt-4 text-xs text-slate-500 font-medium">
                {language === 'en' 
                  ? 'Typing out live walkthrough • Will automatically advance through all 4 steps' 
                  : 'অর্ডার নির্দেশিকা টাইপ হচ্ছে • প্রতিটি ধাপ শেষ হলে স্বয়ংক্রিয়ভাবে পরের ধাপ আসবে'}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 2. ALL STEPS MODE: Full 4-Card 3D Grid Layout (Completed) */}
        {/* ======================================================== */}
        {viewState === 'all-steps' && (
          <div className="preserve-3d animate-fadeIn">
            {/* Simple 3D Header with Replay & Sound Controls */}
            <header className="text-center mb-6 sm:mb-8 preserve-3d">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 border-b-2 border-b-emerald-300 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'en' ? 'All 4 Steps Ready' : 'সকল ধাপ সম্পন্ন'}</span>
                </span>

                <button
                  type="button"
                  onClick={handleRestartWalkthrough}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 border-b-2 border-b-purple-300 shadow-2xs cursor-pointer transition-all active:translate-y-[1px]"
                  title="পুনরায় অ্যানিমেশন ও শব্দ সহ গাইড দেখুন"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                  <span>{language === 'en' ? 'Replay Guide' : 'পুনরায় গাইড শুনুন ও দেখুন'}</span>
                </button>
              </div>

              <div className="inline-block translate-z-sm">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-xs">
                  {language === 'en' ? 'How Order Process Works' : 'অর্ডার প্রসেস কিভাবে কাজ করে'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto translate-z-xs font-medium">
                {language === 'en' 
                  ? 'Simple 4-step 3D workflow from confirmation to live website' 
                  : 'কনফার্মেশন থেকে লাইভ সাইট হস্তান্তরের ৪টি সহজ ধাপ'}
              </p>
            </header>

            {/* 4 3D Step Cards with 50% Reduced Stroke Depth & Mouse Parallax */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 perspective-1000 preserve-3d">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <Card3D
                    key={step.stepNum}
                    maxTilt={6}
                    scale={1.015}
                    className={`p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 border-b-[3.5px] ${step.bottomBorderColor} ${step.shadowColor} transition-all flex flex-col justify-between`}
                  >
                    <div>
                      {/* Top Row: Floating 3D Step Number & 3D Icon */}
                      <div className="flex items-center justify-between mb-4 translate-z-lg">
                        <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 border-b-2 border-b-purple-300 text-xs font-black flex items-center justify-center font-mono shadow-sm">
                          {language === 'en' ? step.stepNum : step.serialBn}
                        </span>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-tr ${step.color} text-white shadow-[0_4px_12px_rgba(124,58,237,0.3),inset_0_1.5px_1px_rgba(255,255,255,0.7),inset_0_-1.5px_1px_rgba(0,0,0,0.2)] border border-white/40`}>
                          <Icon className="w-5 h-5 stroke-[2.2]" />
                        </div>
                      </div>

                      {/* Title & Description with Depth */}
                      <div className="translate-z-md">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
                          {language === 'en' ? step.titleEn : step.titleBn}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {language === 'en' ? step.descEn : step.descBn}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Time Badge */}
                    <div className="pt-3 mt-3 border-t border-purple-100/70 flex items-center gap-1.5 text-xs text-purple-700 font-semibold translate-z-sm">
                      <Clock className="w-3.5 h-3.5 opacity-80" />
                      <span>{language === 'en' ? `Est: ${step.timeEn}` : `সময়: ${step.timeBn}`}</span>
                    </div>
                  </Card3D>
                );
              })}
            </div>

            {/* 3D Reassurance & Action Banner */}
            <Card3D
              maxTilt={4}
              scale={1.01}
              glare={false}
              className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 border-b-[3.5px] border-b-slate-300 shadow-[0_4px_0_0_#CBD5E1,0_8px_16px_-2px_rgba(15,23,42,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3 preserve-3d"
            >
              <div className="flex items-center gap-3 translate-z-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 border-b-2 border-b-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {language === 'en' 
                      ? 'Free Domain, SSL & Cloud Hosting included with 24/7 support' 
                      : 'ফ্রি ডোমেইন, এসএসএল ও ক্লাউড হোস্টিং সহ সার্বক্ষণিক সাপোর্ট অন্তর্ভুক্ত'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'en' 
                      ? '100% verified live handover & continuous technical support' 
                      : 'লাইভ সাইট হস্তান্তর ও সার্বক্ষণিক প্রজেক্ট সাপোর্ট নিশ্চিত'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 translate-z-md">
                {onGoToDashboard && (
                  <button
                    type="button"
                    onClick={onGoToDashboard}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 border-b-[2.5px] border-b-slate-300 shadow-2xs active:border-b active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer btn-3d-tactile"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <LayoutGrid className="w-3.5 h-3.5" />
                      {language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড'}
                    </span>
                  </button>
                )}

                {onOpenLiveChat && (
                  <button
                    type="button"
                    onClick={onOpenLiveChat}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] border border-purple-400/40 border-b-[3px] border-b-purple-950 shadow-[0_3px_0_0_#4C1D95] active:border-b active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer btn-3d-tactile"
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
