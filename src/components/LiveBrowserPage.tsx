import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Search, 
  ShoppingBag, Check, Star, ArrowRight, RefreshCw, Clock, Smartphone,
  Globe, Sparkles, ShieldCheck, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Layers,
  ShoppingBasket, UtensilsCrossed, Newspaper, Store, CheckCircle2,
  PhoneCall, MessageCircle, Rocket, Lock, Zap
} from 'lucide-react';
import { WebsiteDemo, WebsiteCategory, SubscriptionPlanId } from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';

interface LiveBrowserPageProps {
  onBack: () => void;
  onSelectForOrder: (demo: WebsiteDemo) => void;
  initialCategory?: string;
}

export default function LiveBrowserPage({
  onBack,
  onSelectForOrder,
  initialCategory = 'ecommerce'
}: LiveBrowserPageProps) {
  // Survey steps: 'survey-cat' (category choice) | 'survey-sub' (subscription package) | 'catalog' (websites list) | 'preview' (live interactive demo)
  const [viewState, setViewState] = useState<'survey-cat' | 'survey-sub' | 'catalog' | 'preview'>('survey-cat');
  
  // Selected category in survey
  const [selectedCategory, setSelectedCategory] = useState<WebsiteCategory>(
    (initialCategory as WebsiteCategory) || 'ecommerce'
  );

  // Selected subscription plan
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('starter');
  // Collapsible detailed box toggle
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  // Collapsible inline post-order process details toggle
  const [isOrderProcessExpanded, setIsOrderProcessExpanded] = useState<boolean>(false);
  // Auto-scroll trigger to scroll into package details section
  const [shouldScrollToDetails, setShouldScrollToDetails] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Active website being previewed in 'preview' state
  const [activeDemo, setActiveDemo] = useState<WebsiteDemo>(WEBSITE_DEMOS[0]);
  // Collapsible hover action dock opening from left side
  const [isActionDockOpen, setIsActionDockOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState<number>(0);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  // 4 Primary Categories with Distinct Jewel Visual Signatures
  const PRIMARY_CATEGORIES = [
    {
      id: 'ecommerce' as WebsiteCategory,
      title: 'ই-কমার্স ও অনলাইন শপ',
      icon: ShoppingBasket,
      tag: 'জনপ্রিয়',
      color: 'blue',
      desc: 'অনলাইন শপিং, কার্ট, ইনভেন্টরি ও স্বয়ংক্রিয় কুরিয়ার ট্র্যাকিং।'
    },
    {
      id: 'restaurant' as WebsiteCategory,
      title: 'রেস্তোরাঁ ও ক্যাফে',
      icon: UtensilsCrossed,
      tag: 'ফুড ও ডাইনিং',
      color: 'amber',
      desc: 'ডিজিটাল ফুড মেনু, টেবিল বুকিং ও অনলাইন পার্সেল অর্ডার।'
    },
    {
      id: 'blogging' as WebsiteCategory,
      title: 'ব্লগ ও অনলাইন মিডিয়া',
      icon: Newspaper,
      tag: 'সংবাদ ও ম্যাগাজিন',
      color: 'purple',
      desc: 'নিউজ পোর্টাল, আর্টিকেল প্রকাশনা ও কন্টেন্ট পাবলিশিং।'
    },
    {
      id: 'grocery' as WebsiteCategory,
      title: 'মুদি ও সুপারশপ',
      icon: Store,
      tag: 'নিত্যপ্রয়োজনীয়',
      color: 'emerald',
      desc: 'দ্রুত পণ্য ফিল্টারিং, কাঁচাবাজার ও নিত্যপ্রয়োজনীয় শপিং।'
    }
  ];

  // Filtered demos based on active category and search
  const filteredDemos = WEBSITE_DEMOS.filter((demo) => {
    const matchesCategory = selectedCategory === 'all' || demo.category === selectedCategory;
    const matchesSearch = 
      demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (demo.englishTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (demo.banglaTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      demo.fourDigitCode.includes(searchQuery) ||
      demo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenDemo = (demo: WebsiteDemo) => {
    setActiveDemo(demo);
    setViewState('preview');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleAddToCart = (itemName: string) => {
    setCartCount(prev => prev + 1);
    setLastAddedItem(itemName);
    setTimeout(() => {
      setLastAddedItem(null);
    }, 2200);
  };

  // Category selection automatically continues to subscription slide
  const handleSelectCategory = (catId: WebsiteCategory) => {
    setSelectedCategory(catId);
    setTimeout(() => {
      setViewState('survey-sub');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 150);
  };

  const handleSelectPlan = (planId: SubscriptionPlanId) => {
    setSelectedPlanId(planId);
    if (isDetailsExpanded) {
      setShouldScrollToDetails(true);
    }
  };

  const handleToggleDetails = () => {
    if (!selectedPlanId) return;
    if (!isDetailsExpanded) {
      setIsDetailsExpanded(true);
      setShouldScrollToDetails(true);
    } else {
      setIsDetailsExpanded(false);
    }
  };

  useEffect(() => {
    if (isDetailsExpanded && shouldScrollToDetails) {
      const timer = setTimeout(() => {
        if (detailsRef.current) {
          const yOffset = -20;
          const elementTop = detailsRef.current.getBoundingClientRect().top;
          const targetY = elementTop + window.scrollY + yOffset;
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth'
          });
        }
        setShouldScrollToDetails(false);
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [isDetailsExpanded, shouldScrollToDetails, selectedPlanId]);

  const handleProceedToCatalog = () => {
    setViewState('catalog');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Detailed Subscription Plans in English
  const DETAILED_SUBSCRIPTION_PLANS = [
    {
      id: 'starter' as SubscriptionPlanId,
      name: 'Starter Pack',
      englishName: 'Starter Pack',
      tagline: 'Budget-friendly digital launch for new businesses',
      oneTimeFee: '৳999 BDT',
      monthly: '৳120 BDT',
      popular: true,
      suitabilityText: 'Best for new startups, single-product sellers, boutique brands, personal portfolios, and business blogs.',
      features: [
        '1 Complete pre-built live responsive website',
        'Custom brand name, logo, and theme color styling',
        'Free secure domain & SSL certificate included',
        'Unlimited product & menu catalog uploads',
        '100% mobile, tablet & laptop responsive',
        'Instant 1-click WhatsApp order capture integration',
        'Video walkthrough & admin operating tutorial'
      ],
      serverSpecs: 'Server Backup: Weekly automatic cloud backups (120 BDT/mo) · 24/7 WhatsApp developer support'
    },
    {
      id: 'pro' as SubscriptionPlanId,
      name: 'Business Pro',
      englishName: 'Business Pro',
      tagline: 'Fully automated growth suite for high-volume sales',
      oneTimeFee: '৳1,490 BDT',
      monthly: '৳250 BDT',
      popular: false,
      suitabilityText: 'Designed for scaling e-commerce stores, restaurants with table/home delivery, and automated payment setups.',
      features: [
        'All features included in Starter Pack',
        'bKash, Nagad, Card & MFS automated checkout gateway',
        'Inventory stock tracking with low-stock alerts',
        'Automated customer SMS notifications on orders',
        'Custom domain connection (.com, .net, etc.)',
        'Restaurant food ordering & kitchen ticket management',
        'Coupon codes, discounts & live sales analytics'
      ],
      serverSpecs: 'Server Backup: Daily automated cloud backups (250 BDT/mo) · Priority business support'
    },
    {
      id: 'enterprise' as SubscriptionPlanId,
      name: 'Premium Enterprise',
      englishName: 'Premium Enterprise',
      tagline: 'Custom automation for multi-branch mega brands',
      oneTimeFee: '৳2,499 BDT',
      monthly: '৳399 BDT',
      popular: false,
      suitabilityText: 'Ideal for large supermarket chains, multi-vendor mega stores, high-traffic corporate portals, and custom automated workflows.',
      features: [
        'All features included in Business Pro',
        'Dedicated high-speed cloud node with 99.99% SLA',
        'Custom bespoke layout & database engineering',
        'Multi-branch inventory synchronization',
        'Corporate employee roles & permission matrix',
        'Direct phone line to Lead Solutions Architect'
      ],
      serverSpecs: 'Server Backup: Hourly snapshot backups (399 BDT/mo) · 24/7 Enterprise SLA hotline'
    }
  ];

  const activePlan = DETAILED_SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId);

  return (
    <div 
      id="live-browser-page"
      className="min-h-screen w-full bg-[#0A0A0A] text-[#F5F5F5] flex flex-col font-sans transition-colors duration-300"
    >
      {/* ========================================================================= */}
      {/* 1. SURVEY STEP 1: CATEGORY SELECTION                                     */}
      {/* ========================================================================= */}
      {viewState === 'survey-cat' && (
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 max-w-4xl mx-auto w-full animate-fadeIn">
          {/* Top navigation */}
          <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <button
              onClick={onBack}
              id="survey-back-to-home-btn"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-400" />
              <span>← Return to Dashboard</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md border border-white/20">01</span>
              <span className="text-white/30">/</span>
              <span className="text-neutral-400 font-medium">02</span>
            </div>
          </div>

          <div className="w-full bg-[#141414] rounded-3xl border border-white/10 shadow-xl p-6 sm:p-10 relative overflow-hidden text-white">
            {/* Jewel Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black text-white border border-white/10 mb-3 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>ধাপ ১: আপনার ক্যাটাগরি বেছে নিন</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                আপনার ব্যবসার ধরণ{' '}
                <span className="text-white underline decoration-white/30 underline-offset-4">
                  নির্বাচন করুন
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                সঠিক ক্যাটাগরি বেছে নিয়ে সংশ্লিষ্ট লাইভ ডেমো ওয়েবসাইটগুলো সরাসরি টেস্ট করুন।
              </p>
            </div>

            {/* 4 Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {PRIMARY_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                const iconGradients: Record<string, string> = {
                  blue: 'bg-white/10 text-white border border-white/20',
                  amber: 'bg-white/10 text-white border border-white/20',
                  purple: 'bg-white/10 text-white border border-white/20',
                  emerald: 'bg-white/10 text-white border border-white/20'
                };

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`group relative p-5 sm:p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'border-2 border-white bg-white/10 shadow-[0_8px_24px_rgba(255,255,255,0.1)] scale-[1.01]'
                        : 'border-white/10 bg-black hover:border-white/20 hover:bg-[#1A1A1A] shadow-2xs hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${iconGradients[cat.color] || 'bg-white/10 text-white border border-white/20'} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white group-hover:text-white transition-colors">
                          {cat.title}
                        </span>
                        <span className="text-[10px] font-bold text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded-full font-mono">
                          {cat.tag}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SURVEY STEP 2: SUBSCRIPTION PLAN CHOICE                               */}
      {/* ========================================================================= */}
      {viewState === 'survey-sub' && (
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 max-w-4xl mx-auto w-full animate-fadeIn">
          {/* Top navigation */}
          <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <button
              onClick={() => setViewState('survey-cat')}
              id="survey-return-btn"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-400" />
              <span>← Back to Categories</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md border border-white/20">02</span>
              <span className="text-white/30">/</span>
              <span className="text-neutral-400 font-medium">02</span>
            </div>
          </div>

          <div className="w-full bg-[#141414] rounded-3xl border border-white/10 shadow-xl p-6 sm:p-10 relative overflow-hidden text-white">
            {/* Jewel Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 mb-3 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>ধাপ ২: আপনার সুবিধাজনক প্যাকেজ বেছে নিন</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                এখনই কেনার প্রয়োজন নেই,{' '}
                <span className="text-white underline decoration-white/30 underline-offset-4">
                  শুধু আপনার বাজেট পছন্দ করুন
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                ডেমো ওয়েবসাইটগুলো দেখতে ও পরীক্ষা করতে কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
              </p>
            </div>

            {/* 3 Pack Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {DETAILED_SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? 'border-2 border-white bg-white/10 shadow-[0_8px_24px_rgba(255,255,255,0.08)] scale-[1.01]'
                        : 'border-white/10 bg-[#0A0A0A] hover:border-white/30 hover:bg-[#141414] shadow-2xs hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Top Left Most Popular Badge */}
                    {plan.popular && (
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="text-[10px] font-bold text-black bg-white px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-black" />
                          <span>Most Popular</span>
                        </span>
                      </div>
                    )}

                    {/* Top Right Corner View Details Button */}
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(plan.id);
                          setIsDetailsExpanded(true);
                          setShouldScrollToDetails(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white hover:text-black border border-white/20 shadow-2xs transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                        title={`View all specifications for ${plan.name}`}
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="pt-7">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-2">
                        <span className="text-white font-bold">{plan.englishName}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-neutral-400 mb-4 line-clamp-2">
                        {plan.tagline}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-xs text-neutral-400 font-medium">Setup:</span>
                        <span className="text-xl font-bold font-mono text-white">{plan.oneTimeFee}</span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-neutral-400 font-medium">Monthly Upkeep:</span>
                        <span className="font-bold text-white font-mono">{plan.monthly}/mo</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continue Action Button - Only visible when view details is closed */}
            {!isDetailsExpanded && (
              <div className="flex items-center justify-center mb-6 animate-fadeIn">
                <button
                  type="button"
                  id="btn-continue-with-plan"
                  onClick={handleProceedToCatalog}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Continue with this Plan</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            )}

            {/* Expandable Details Section */}
            {isDetailsExpanded && activePlan && (
              <div 
                ref={detailsRef}
                id="package-details-section"
                className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 mb-6 animate-fadeIn shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {activePlan.name} Specifications
                    </h3>
                    <p className="text-xs text-neutral-400 font-medium">
                      {activePlan.oneTimeFee} setup fee · {activePlan.monthly}/month cloud hosting
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailsExpanded(false)}
                    className="text-xs text-neutral-400 hover:text-white font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                  {activePlan.suitabilityText}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {activePlan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-neutral-500 font-mono pt-3 border-t border-white/10 mb-5">
                  {activePlan.serverSpecs}
                </div>

                {/* Bottom Action inside Details Section */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDetailsExpanded(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/20 bg-[#141414] hover:bg-[#1A1A1A] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Close Specifications
                  </button>

                  <button
                    type="button"
                    id="btn-details-continue-with-plan"
                    onClick={handleProceedToCatalog}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Continue with this Plan</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WEBSITES CATALOG GRID                                                  */}
      {/* ========================================================================= */}
      {viewState === 'catalog' && (
        <div className="flex-1 flex flex-col">
          {/* Sticky Header Bar */}
          <header className="sticky top-0 z-30 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
              <button
                onClick={onBack}
                id="catalog-back-to-dashboard-btn"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141414] hover:bg-white hover:text-black text-white text-xs sm:text-sm font-semibold transition-all border border-white/15 cursor-pointer shadow-xs active:scale-[0.99] shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Return to Dashboard</span>
              </button>

              {/* Search Bar */}
              <div className="relative w-64 sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by code (#1042) or keyword..."
                  className="w-full pl-9 pr-3.5 py-2 bg-[#141414] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all shadow-xs"
                />
              </div>
            </div>

            {/* MANDATORY BANNER: What we do after your order */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 pt-1">
              <button
                type="button"
                onClick={() => setIsOrderProcessExpanded(prev => !prev)}
                id="btn-what-we-do-after-order"
                className="w-full relative group inline-flex items-center justify-between px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#141414] hover:bg-[#1A1A1A] text-white cursor-pointer shadow-md border border-white/10 hover:border-white/30 transition-all duration-200 overflow-hidden"
              >
                {/* Left Side: Bold Exact Statement with Live Pulse */}
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-white select-none">
                    অর্ডার করার পর আমরা আপনার জন্য কী কী করব
                  </span>
                </div>

                {/* Right Side: Frosted Chevron Capsule */}
                <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center border border-white/20 group-hover:border-white transition-all duration-200 shrink-0">
                  {isOrderProcessExpanded ? (
                    <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  )}
                </div>
              </button>
            </div>
          </header>

          {/* Main Catalog Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            {/* Inline Expanded Process Details (pushes websites down) */}
            {isOrderProcessExpanded && (
              <div 
                id="order-process-inline-details"
                className="p-6 rounded-3xl bg-[#141414] border border-white/10 shadow-md mb-8 animate-fadeIn"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {/* Point 1 */}
                  <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      01
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-white shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-white leading-snug">
                        সরাসরি ফোন কল বা হোয়াটসঅ্যাপে কথা বলে আপনার প্ল্যান চূড়ান্ত করা হবে (আপনার সাথে কথা বলেই কাজ শুরু হবে)
                      </span>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      02
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-white leading-snug">
                        আপনার ব্র্যান্ডের লোগো, স্লোগান, নাম এবং ডোমেন সংগ্রহ করা হবে
                      </span>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      03
                    </div>
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-white shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-white leading-snug">
                        ডোমেন কানেকশন করে মাত্র ২৪ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ওয়েবসাইট ডেলিভারি
                      </span>
                    </div>
                  </div>

                  {/* Point 4 */}
                  <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      04
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-white shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-white leading-snug">
                        যেকোনো প্রয়োজনে আমাদের অফিসিয়াল হোয়াটসঅ্যাপে আজীবন নিরবচ্ছিন্ন সাপোর্ট
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOrderProcessExpanded(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white text-xs font-semibold cursor-pointer transition-colors border border-white/15"
                  >
                    Hide Details
                  </button>
                </div>
              </div>
            )}

            {/* Demos Grid */}
            {filteredDemos.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#141414] rounded-3xl border border-white/10 max-w-md mx-auto my-8 shadow-xs text-white">
                <Search className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No websites match your search</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-4">
                  Try searching for another keyword or check another category.
                </p>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDemos.map((demo) => (
                  <div
                    key={demo.id}
                    onClick={() => handleOpenDemo(demo)}
                    className="group bg-[#141414] rounded-3xl border border-white/10 shadow-sm hover:border-white hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                  >
                    <div>
                      {/* Browser Chrome Window Frame */}
                      <div className="px-4 py-2.5 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/30"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-white/50"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                        </div>
                        
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#141414] text-white tracking-wider border border-white/20 shadow-2xs">
                          {demo.fourDigitCode}
                        </span>
                      </div>

                      {/* Image Preview with Hover Lift */}
                      <div className="relative overflow-hidden aspect-16/10 bg-[#0A0A0A]">
                        <img
                          src={demo.previewImage}
                          alt={demo.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        />

                        <div className="absolute inset-0 bg-[#000000]/0 group-hover:bg-[#000000]/50 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-xl bg-white text-black font-bold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <span>Open Live Preview</span>
                            <ArrowRight className="w-3.5 h-3.5 text-black" />
                          </span>
                        </div>

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0A0A0A]/90 text-white shadow-xs backdrop-blur-xs border border-white/20">
                            {demo.categoryLabel}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono font-medium text-neutral-400">
                            Code: {demo.fourDigitCode}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-white">
                            <Star className="w-3.5 h-3.5 fill-white text-white" />
                            <span>{demo.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-white transition-colors leading-snug">
                          {demo.englishTitle || demo.title}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {demo.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {demo.features.slice(0, 3).map((feat, idx) => (
                            <span key={idx} className="text-[10px] font-medium bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-md">
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDemo(demo);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-white/15"
                      >
                        <span>Visit Live Demo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ACTIVE LIVE WEBSITE PREVIEW SIMULATOR                                 */}
      {/* ========================================================================= */}
      {viewState === 'preview' && (
        <div id="preview-simulator-active" className="flex-1 flex flex-col relative w-full bg-[#0A0A0A] text-[#F5F5F5] animate-fadeIn min-h-screen">
          {/* Top Sticky Bar: High Contrast Monochrome Luxury */}
          <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
              {/* Left Side: Return to Dashboard */}
              <button
                onClick={onBack}
                id="simulator-return-to-dashboard-btn"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#141414] hover:bg-white hover:text-black text-white transition-all cursor-pointer border border-white/20 shadow-xs flex items-center justify-center hover:-translate-x-0.5 active:translate-x-0 shrink-0"
                title="Return to Dashboard"
                aria-label="Return to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-current shrink-0" />
              </button>

              {/* Right Side: Primary Monochrome CTA Button */}
              <button
                type="button"
                onClick={() => onSelectForOrder(activeDemo)}
                id="header-checkout-this-website-btn"
                className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shrink-0 overflow-hidden"
                title={`ওয়েবসাইট কিনুন ${activeDemo.fourDigitCode}`}
              >
                {/* Live pulsing radar beacon */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-85"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                </span>

                {/* Shopping Bag Icon */}
                <ShoppingBag className="w-4 h-4 text-black shrink-0" />

                {/* Action Title in Bangla with Hashtag Code */}
                <span className="tracking-tight font-black whitespace-nowrap text-black">
                  <span className="hidden sm:inline">এই ওয়েবসাইটটি কিনুন </span>
                  <span className="sm:hidden">ওয়েবসাইট কিনুন </span>
                  <span className="font-mono text-xs font-black bg-black/10 text-black px-1.5 py-0.5 rounded-md border border-black/20 ml-1">
                    {activeDemo.fourDigitCode}
                  </span>
                </span>

                {/* Forward Arrow with glide animation */}
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>
          </header>

          {/* Authentic Live Website - Full Width & Natural Page Scrolling */}
          <main className="w-full bg-[#0A0A0A] flex-1 flex flex-col">
            {/* Website Internal Top Nav Header (Scrolls with page) */}
            <div className="w-full border-b border-white/10 bg-[#141414] shadow-xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                {/* Clean Authentic Brand Name */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-base shadow-xs">
                    {(activeDemo.englishTitle || activeDemo.title).replace(/^#\d+\s*/, '').split('—')[0].trim().charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight">
                      {(activeDemo.englishTitle || activeDemo.title).replace(/^#\d+\s*/, '').split('—')[0].trim()}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      Official Store
                    </span>
                  </div>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-400">
                  <span className="text-white cursor-pointer font-bold">Home</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Shop Collection</span>
                  <span className="hover:text-white transition-colors cursor-pointer">New Arrivals</span>
                  <span className="hover:text-white transition-colors cursor-pointer">About Brand</span>
                  <span className="hover:text-white transition-colors cursor-pointer">Contact Us</span>
                </nav>

                <div className="flex items-center gap-2.5 text-xs">
                  <button 
                    onClick={() => handleAddToCart(activeDemo.mockData.items[0]?.name || 'Special Item')}
                    className="p-2 rounded-xl bg-[#1A1A1A] hover:bg-white hover:text-black text-white transition-colors cursor-pointer relative border border-white/20"
                    title="Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center font-mono">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Store Hero Banner */}
            <div className="w-full bg-[#141414] text-white py-12 sm:py-20 px-4 sm:px-8 relative overflow-hidden border-b border-white/10">
              <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/20 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>{activeDemo.categoryLabel.toUpperCase()} · 2026 EDITION</span>
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {activeDemo.heroHeadline || activeDemo.englishTitle || activeDemo.title}
                  </h1>
                  <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed max-w-xl">
                    {activeDemo.mockData.heroSub}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleAddToCart(activeDemo.mockData.items[0]?.name || 'Special Offer')}
                      className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4 text-black" />
                      <span>Shop Featured Collection</span>
                    </button>
                    <a
                      href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                        `Hello, I would like to order website design ${activeDemo.fourDigitCode} (${activeDemo.title}).`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white hover:text-black text-white border border-white/20 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Order</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 hidden lg:block">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 aspect-4/3 relative">
                    <img 
                      src={activeDemo.previewImage} 
                      alt={activeDemo.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                      <span className="font-mono text-xs font-bold bg-[#141414] text-white px-3 py-1 rounded-md shadow-sm border border-white/20">
                        Verified 100% Responsive
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className="w-full border-b border-white/10 bg-[#0A0A0A] py-4 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-white">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-white shrink-0" />
                  <span>24-Hour Express Delivery</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                  <span>Free SSL & Cloud Hosting</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-white shrink-0" />
                  <span>Mobile & Android Ready</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-white shrink-0" />
                  <span>Lifetime Website Ownership</span>
                </div>
              </div>
            </div>

            {/* Featured Store Items Catalog */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block font-mono">
                    Product Showcase
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                    Featured Store Catalog
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                    Try adding products to test the live cart experience.
                  </p>
                </div>

                {lastAddedItem && (
                  <div className="p-2.5 px-4 bg-white/15 border border-white/30 text-white rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Added "{lastAddedItem}" to cart!</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeDemo.mockData.items.map((item, idx) => (
                  <div key={idx} className="group p-4 rounded-2xl bg-[#141414] border border-white/10 shadow-xs hover:border-white hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative overflow-hidden rounded-xl aspect-4/3 mb-3 bg-[#0A0A0A]">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#141414]/95 text-white shadow-2xs font-mono border border-white/20">
                          In Stock
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-mono font-extrabold text-white">
                          {item.price}
                        </span>
                        <span className="text-[10px] text-neutral-500 line-through font-mono">
                          ৳{parseInt(item.price.replace(/[^0-9]/g, '') || '500') + 350}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item.name)}
                      className="mt-4 w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials section */}
            <div className="w-full bg-[#141414] py-12 px-4 sm:px-6 border-t border-white/10">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h3 className="text-xl font-bold text-white">What Customers Say</h3>
                  <p className="text-xs text-neutral-400 mt-1">Customer satisfaction guaranteed with every website build.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Kazi Farhan', role: 'Online Fashion Seller', text: 'Our website launched in less than 24 hours. The WhatsApp ordering integration tripled our sales!' },
                    { name: 'Nusrat Jahan', role: 'Boutique Owner, Dhaka', text: 'I had no coding knowledge, but managing products from my phone is effortless.' },
                    { name: 'Tanvir Ahmed', role: 'Gadget Store Entrepreneur', text: 'Fast cloud hosting, bKash & Nagad payments configured flawlessly right from day one.' }
                  ].map((rev, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-2xs">
                      <div className="flex items-center gap-1 text-white mb-2">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-white text-white" />
                        ))}
                      </div>
                      <p className="text-xs text-neutral-400 italic leading-relaxed">"{rev.text}"</p>
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{rev.name}</span>
                        <span className="text-[10px] text-neutral-400">{rev.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Authentic Live Footer */}
            <footer className="w-full bg-[#0A0A0A] text-white py-12 px-4 sm:px-6 border-t border-white/10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-neutral-400">
                <div>
                  <h4 className="text-sm font-bold text-white mb-3">
                    {activeDemo.englishTitle || activeDemo.title}
                  </h4>
                  <p className="leading-relaxed text-neutral-400">
                    Official live responsive demo. Delivered with full ownership, custom domain, and cloud server hosting.
                  </p>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-2">Quick Navigation</h5>
                  <ul className="space-y-1.5">
                    <li>Home</li>
                    <li>Featured Products</li>
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-2">Delivery & Support</h5>
                  <ul className="space-y-1.5">
                    <li>24/7 WhatsApp Hotline</li>
                    <li>Dhaka & Nationwide Courier Integration</li>
                    <li>Free SSL & Automated Backups</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-white mb-2">Accepted Payments</h5>
                  <p className="mb-2 text-neutral-400">bKash, Nagad, Rocket, Upay, Visa, Mastercard, AMEX.</p>
                  <span className="inline-block text-[10px] font-mono text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded">
                    ✓ Secured by BongoWeb Gateway
                  </span>
                </div>
              </div>
              <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 text-center text-[11px] text-neutral-500">
                © {new Date().getFullYear()} {activeDemo.englishTitle || activeDemo.title}. All rights reserved. Powered by BongoWeb Technologies.
              </div>
            </footer>
          </main>
        </div>
      )}
    </div>
  );
}
