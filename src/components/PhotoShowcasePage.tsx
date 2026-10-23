import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Search, Check, Sparkles, Clock, 
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp, CheckCircle2,
  ShoppingBasket, UtensilsCrossed, Newspaper, Store,
  ZoomIn, ZoomOut, Image, ArrowRight, MessageCircle, PhoneCall, Rocket, ShieldCheck, ShoppingBag
} from 'lucide-react';
import { PHOTO_MOCKUPS } from '../data/mockData';
import { PhotoMockup, WebsiteCategory, SubscriptionPlanId } from '../types';

interface PhotoShowcasePageProps {
  onBack: () => void;
  onSelectForOrder: (mockupTitle: string) => void;
  initialCategory?: string;
}

export default function PhotoShowcasePage({
  onBack,
  onSelectForOrder,
  initialCategory = 'ecommerce'
}: PhotoShowcasePageProps) {
  const [viewState, setViewState] = useState<'survey-cat' | 'survey-sub' | 'catalog' | 'preview'>('survey-cat');
  const [selectedCategory, setSelectedCategory] = useState<WebsiteCategory>(
    (initialCategory as WebsiteCategory) || 'ecommerce'
  );
  const [isActionDockOpen, setIsActionDockOpen] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('starter');
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  const [isOrderProcessExpanded, setIsOrderProcessExpanded] = useState<boolean>(false);
  const [shouldScrollToDetails, setShouldScrollToDetails] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  const [selectedMockup, setSelectedMockup] = useState<PhotoMockup>(PHOTO_MOCKUPS[0]);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const PRIMARY_CATEGORIES = [
    {
      id: 'ecommerce' as WebsiteCategory,
      title: 'E-commerce & Stores',
      icon: ShoppingBasket,
      tag: 'Most Popular',
      color: 'blue',
      desc: 'Online shopping, carts, and delivery tracking'
    },
    {
      id: 'restaurant' as WebsiteCategory,
      title: 'Restaurant & Dining',
      icon: UtensilsCrossed,
      tag: 'Food & Cafe',
      color: 'amber',
      desc: 'Digital menus, table reservations, and takeaways'
    },
    {
      id: 'blogging' as WebsiteCategory,
      title: 'Blogging & Media',
      icon: Newspaper,
      tag: 'Editorial',
      color: 'purple',
      desc: 'Articles, news, magazines, and content creators'
    },
    {
      id: 'grocery' as WebsiteCategory,
      title: 'Grocery & Supermarket',
      icon: Store,
      tag: 'Daily Needs',
      color: 'emerald',
      desc: 'High-volume product lists and quick orders'
    }
  ];

  const DETAILED_SUBSCRIPTION_PLANS = [
    {
      id: 'starter' as SubscriptionPlanId,
      name: 'Starter Package',
      englishName: 'Starter Package',
      oneTimeFee: '৳999 BDT',
      monthly: '৳120 BDT',
      popular: true,
      tagline: 'Ideal digital starter launch for small capital & new businesses',
      suitabilityText: 'Best for startups testing products, home bakeries, boutique fashion, and personal blogs.',
      features: [
        'Complete mobile & desktop responsive design',
        '1 Custom domain connection & lifetime free SSL security',
        '10-15 products & category arrangement included',
        '1-Click instant WhatsApp direct ordering',
        'No-code easy content & image control panel'
      ],
      serverSpecs: '৳120 BDT monthly server maintenance & cloud backup included'
    },
    {
      id: 'pro' as SubscriptionPlanId,
      name: 'Business Pro',
      englishName: 'Business Pro',
      oneTimeFee: '৳1,490 BDT',
      monthly: '৳250 BDT',
      popular: false,
      tagline: 'Engineered for scaling businesses and high-speed sales',
      suitabilityText: 'Full-featured setup designed for daily orders and consistent customer traffic.',
      features: [
        'Automated bKash, Nagad & Card payment gateway',
        'Inventory stock tracking with low-stock alerts',
        'Unlimited product & image gallery uploads',
        'Meta Pixel & Google Analytics conversion ready',
        'Professional business email & priority tech support'
      ],
      serverSpecs: '৳250 BDT monthly server maintenance & automated daily backup included'
    },
    {
      id: 'enterprise' as SubscriptionPlanId,
      name: 'Premium Enterprise',
      englishName: 'Premium Enterprise',
      oneTimeFee: '৳2,499 BDT',
      monthly: '৳399 BDT',
      popular: false,
      tagline: 'Full automation & dedicated cloud speed for enterprise brands',
      suitabilityText: 'Custom built for hyper-growth stores, multi-branch restaurants, and superstores.',
      features: [
        'Dedicated high-performance cloud VPS instance',
        'Multi-vendor or multi-branch sync management',
        'Custom bespoke layout & database engineering',
        'Automated order invoice generation & SMS gateway',
        '24/7 dedicated enterprise support hotline'
      ],
      serverSpecs: '৳399 BDT monthly cloud server hosting with 99.9% uptime SLA'
    }
  ];

  const filteredMockups = PHOTO_MOCKUPS.filter((mockup) => {
    const matchesCategory = selectedCategory === 'all' || mockup.category.toLowerCase().includes(selectedCategory);
    const matchesSearch = 
      mockup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mockup.fourDigitCode.includes(searchQuery) ||
      (mockup.description && mockup.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenMockup = (mockup: PhotoMockup) => {
    setSelectedMockup(mockup);
    setViewState('preview');
    setIsZoomed(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

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

  const activePlan = DETAILED_SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId);

  return (
    <div 
      id="photo-showcase-page"
      className="min-h-screen w-full bg-[#F1F5F9] text-slate-900 flex flex-col font-sans transition-colors duration-300"
    >
      {/* 1. SURVEY STEP 1: CATEGORY */}
      {viewState === 'survey-cat' && (
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 max-w-4xl mx-auto w-full animate-fadeIn">
          <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-all border border-slate-200 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← Return to Dashboard</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">01</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-500 font-medium">02</span>
            </div>
          </div>

          <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 relative overflow-hidden text-slate-900">
            {/* Jewel Top Bar: Crisp purple accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-3 shadow-2xs">
                <Image className="w-3.5 h-3.5 text-purple-600" />
                <span>Photo Gallery · Step 1</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Select industry{' '}
                <span className="text-purple-700 underline decoration-purple-300 underline-offset-8">
                  photo collection
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Browse high-resolution editorial design collections ready for high-conversion brands.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {PRIMARY_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`group p-5 sm:p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'border-2 border-purple-600 bg-purple-50/50 shadow-md scale-[1.01]'
                        : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50 shadow-2xs hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {cat.title}
                        </span>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-mono">
                          {cat.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">
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

      {/* 2. SURVEY STEP 2: PLAN CHOICE */}
      {viewState === 'survey-sub' && (
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 max-w-4xl mx-auto w-full animate-fadeIn">
          <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <button
              onClick={() => setViewState('survey-cat')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-all border border-slate-200 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← Back to Categories</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">02</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-500 font-medium">02</span>
            </div>
          </div>

          <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 relative overflow-hidden text-slate-900">
            {/* Jewel Top Bar: Crisp purple accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-3 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Photo Gallery · Step 2</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                One flat setup fee.{' '}
                <span className="text-purple-700 underline decoration-purple-300 underline-offset-8">
                  Predictable monthly upkeep.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                All photos are delivered as fully functioning websites with your custom branding.
              </p>
            </div>

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
                        ? 'border-2 border-purple-600 bg-purple-50/50 shadow-md scale-[1.01]'
                        : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50 shadow-2xs hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Top Left Most Popular Badge */}
                    {plan.popular && (
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="text-[10px] font-bold text-white bg-purple-600 px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-white" />
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
                          setTimeout(() => {
                            detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }, 50);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 shadow-2xs transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                        title={`View all specifications for ${plan.name}`}
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="pt-7">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                        <span className="text-slate-900 font-bold">{plan.englishName}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                        {plan.tagline}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-xs text-slate-500 font-medium">Setup:</span>
                        <span className="text-xl font-bold font-mono text-slate-900">{plan.oneTimeFee}</span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500 font-medium">Monthly Upkeep:</span>
                        <span className="font-bold text-purple-700 font-mono">{plan.monthly}/mo</span>
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
                  id="btn-photo-continue-with-plan"
                  onClick={handleProceedToCatalog}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Continue with this Plan</span>
                  <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                </button>
              </div>
            )}

            {/* Expandable Details Section */}
            {isDetailsExpanded && activePlan && (
              <div 
                ref={detailsRef}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-6 animate-fadeIn shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {activePlan.name} Specifications
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {activePlan.oneTimeFee} setup fee · {activePlan.monthly}/month cloud upkeep
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailsExpanded(false)}
                    className="text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {activePlan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-200 mb-5">
                  {activePlan.serverSpecs}
                </div>

                {/* Bottom Action inside Details Section */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDetailsExpanded(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Close Specifications
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToCatalog}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Continue with this Plan</span>
                    <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. PHOTO CATALOG GRID */}
      {viewState === 'catalog' && (
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-all border border-slate-200 cursor-pointer shadow-xs active:scale-[0.99] shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>← Return to Dashboard</span>
              </button>

              <div className="relative w-64 sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photo collections by code or title..."
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* MANDATORY POST-ORDER PROCESS BANNER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 pt-1">
              <button
                type="button"
                onClick={() => setIsOrderProcessExpanded(prev => !prev)}
                id="btn-what-we-do-after-order"
                className="w-full relative group inline-flex items-center justify-between px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-slate-50 text-purple-700 cursor-pointer shadow-sm border border-purple-200 hover:border-purple-400 transition-all duration-200 overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600"></span>
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-slate-900 select-none">
                    অর্ডার করার পর আমরা আপনার জন্য কী কী করব (নির্দেশনা ও ধাপসমূহ)
                  </span>
                </div>

                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 group-hover:border-purple-400 transition-all duration-200 shrink-0">
                  {isOrderProcessExpanded ? (
                    <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  )}
                </div>
              </button>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
            {isOrderProcessExpanded && (
              <div 
                id="order-process-inline-details"
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md mb-8 animate-fadeIn"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      01
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        সরাসরি ফোন কল বা হোয়াটসঅ্যাপে কথা বলে আপনার প্ল্যান চূড়ান্ত করা হবে (আপনার সাথে কথা বলেই কাজ শুরু হবে)
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      02
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        আপনার ব্র্যান্ডের লোগো, স্লোগান, নাম এবং ডোমেন সংগ্রহ করা হবে
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      03
                    </div>
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        ডোমেন কানেকশন করে মাত্র ২৪ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ওয়েবসাইট ডেলিভারি
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      04
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                        যেকোনো প্রয়োজনে আমাদের অফিসিয়াল হোয়াটসঅ্যাপে আজীবন নিরবচ্ছিন্ন সাপোর্ট
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOrderProcessExpanded(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors border border-slate-200"
                  >
                    Hide Details
                  </button>
                </div>
              </div>
            )}

            {/* Photos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMockups.map((mockup) => (
                <div
                  key={mockup.id}
                  onClick={() => handleOpenMockup(mockup)}
                  className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-purple-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                >
                  <div>
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {mockup.category}
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 tracking-wider border border-purple-200 shadow-2xs">
                        {mockup.fourDigitCode}
                      </span>
                    </div>

                    <div className="relative overflow-hidden aspect-16/10 bg-slate-100">
                      <img
                        src={mockup.imageUrl}
                        alt={mockup.title}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <span>Inspect Mockup</span>
                          <ZoomIn className="w-3.5 h-3.5 text-purple-600" />
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                        {mockup.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {mockup.description || 'Turnkey digital storefront built for high performance.'}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(mockup.features || []).slice(0, 3).map((feat: any, idx: number) => (
                          <span key={idx} className="text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMockup(mockup);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-slate-200 hover:border-purple-300"
                    >
                      <span>Open Full Photo Spec</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* 4. PREVIEW FULLSCREEN PHOTO MOCKUP */}
      {viewState === 'preview' && (
        <div id="preview-simulator-active" className="flex-1 flex flex-col relative pb-28 animate-fadeIn">
          {/* Top Sticky Bar */}
          <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
              {/* Left Side: Return to Dashboard */}
              <button
                onClick={onBack}
                id="photo-return-to-dashboard-btn"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer border border-slate-200 shadow-xs flex items-center justify-center hover:-translate-x-0.5 active:translate-x-0 shrink-0"
                title="Return to Dashboard"
                aria-label="Return to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-current shrink-0" />
              </button>

              {/* Right Side: Zoom and Checkout Button */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="hidden md:inline-flex px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Toggle Zoom"
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4 text-current" /> : <ZoomIn className="w-4 h-4 text-current" />}
                  <span>{isZoomed ? 'রিসেট জুম' : 'জুম ১০০%'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectForOrder(selectedMockup.title)}
                  id="photo-header-checkout-btn"
                  className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shrink-0 overflow-hidden"
                  title={`ওয়েবসাইট কিনুন ${selectedMockup.fourDigitCode}`}
                >
                  {/* Live pulsing radar beacon */}
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>

                  {/* Shopping Bag Icon */}
                  <ShoppingBag className="w-4 h-4 text-white shrink-0" />

                  {/* Action Title with Hashtag Code in Bangla */}
                  <span className="tracking-tight font-black whitespace-nowrap text-white">
                    <span className="hidden sm:inline">এই ওয়েবসাইটটি কিনুন </span>
                    <span className="sm:hidden">ওয়েবসাইট কিনুন </span>
                    <span className="font-mono text-xs font-black bg-white/20 text-white px-1.5 py-0.5 rounded-md border border-white/30 ml-1">
                      {selectedMockup.fourDigitCode}
                    </span>
                  </span>

                  {/* Forward Arrow with glide animation */}
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center">
            <div className={`w-full bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden transition-all duration-300 ${
              isZoomed ? 'scale-105' : ''
            }`}>
              <img
                src={selectedMockup.imageUrl}
                alt={selectedMockup.title}
                className="w-full object-cover"
              />
            </div>

            <div className="w-full mt-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Delivered Features for {selectedMockup.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {selectedMockup.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
