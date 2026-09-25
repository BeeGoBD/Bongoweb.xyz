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
      title: 'E-commerce & Stores',
      icon: ShoppingBasket,
      tag: 'Most Popular',
      color: 'blue',
      desc: 'Online shopping, carts, inventory, and automated delivery tracking.'
    },
    {
      id: 'restaurant' as WebsiteCategory,
      title: 'Restaurant & Dining',
      icon: UtensilsCrossed,
      tag: 'Food & Cafe',
      color: 'amber',
      desc: 'Digital menus, table reservations, chef specials, and takeaway orders.'
    },
    {
      id: 'blogging' as WebsiteCategory,
      title: 'Blogging & Media',
      icon: Newspaper,
      tag: 'Editorial',
      color: 'purple',
      desc: 'Articles, news publication, magazines, podcasts, and content creators.'
    },
    {
      id: 'grocery' as WebsiteCategory,
      title: 'Grocery & Supermarket',
      icon: Store,
      tag: 'Daily Needs',
      color: 'emerald',
      desc: 'High-volume product lists, category filters, and rapid 1-click orders.'
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
      className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans transition-colors duration-300"
    >
      {/* ========================================================================= */}
      {/* 1. SURVEY STEP 1: CATEGORY SELECTION                                     */}
      {/* ========================================================================= */}
      {viewState === 'survey-cat' && (
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 max-w-4xl mx-auto w-full animate-fadeIn">
          {/* Top navigation */}
          <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-200/90">
            <button
              onClick={onBack}
              id="survey-back-to-home-btn"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold transition-all border border-slate-200/90 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← Return to Dashboard</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/60">01</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400 font-medium">02</span>
            </div>
          </div>

          <div className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.03] p-6 sm:p-10 relative overflow-hidden">
            {/* Jewel Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80 mb-3 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Step 1: Choose Your Industry</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                What type of website are you{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
                  building?
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Select your industry to load tailored live demos with industry-standard features and real test checkouts.
              </p>
            </div>

            {/* 4 Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {PRIMARY_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                const iconGradients: Record<string, string> = {
                  blue: 'from-blue-600 to-indigo-600 shadow-[0_4px_12px_rgba(59,130,246,0.25)]',
                  amber: 'from-amber-500 to-orange-600 shadow-[0_4px_12px_rgba(245,158,11,0.25)]',
                  purple: 'from-purple-600 to-indigo-600 shadow-[0_4px_12px_rgba(168,85,247,0.25)]',
                  emerald: 'from-emerald-500 to-teal-600 shadow-[0_4px_12px_rgba(16,185,129,0.25)]'
                };

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`group relative p-5 sm:p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'border-2 border-indigo-500 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 shadow-[0_8px_24px_rgba(79,70,229,0.12)] ring-1 ring-indigo-500/20 scale-[1.01]'
                        : 'border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-slate-50/70 shadow-2xs hover:shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${iconGradients[cat.color]} text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {cat.title}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded-full font-mono">
                          {cat.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
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
          <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-slate-200/90">
            <button
              onClick={() => setViewState('survey-cat')}
              id="survey-return-btn"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold transition-all border border-slate-200/90 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← Back to Categories</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/60">02</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-400 font-medium">02</span>
            </div>
          </div>

          <div className="w-full bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.03] p-6 sm:p-10 relative overflow-hidden">
            {/* Jewel Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-3 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Step 2: Choose Your Launch Package</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                One flat setup fee.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
                  Predictable monthly upkeep.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Zero advance payment required to browse and test all 60+ live website demos.
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
                        ? 'border-2 border-indigo-500 bg-gradient-to-b from-indigo-50/40 via-white to-indigo-50/20 shadow-[0_8px_24px_rgba(79,70,229,0.12)] ring-1 ring-indigo-500/20 scale-[1.01]'
                        : 'border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-slate-50/60 shadow-2xs hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Top Left Most Popular Badge */}
                    {plan.popular && (
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50/95 border border-indigo-200/90 px-2.5 py-1 rounded-xl shadow-2xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>Most Popular</span>
                        </span>
                      </div>
                    )}

                    {/* Top Right Corner View Details Button with tiny gap from border and rounded shape */}
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                        title={`View all specifications for ${plan.name}`}
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                      </span>
                    </div>

                    <div className="pt-7">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                        <span className="text-indigo-950 font-bold">{plan.englishName}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
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

                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-xs text-slate-500 font-medium">Setup:</span>
                        <span className="text-xl font-bold font-mono text-slate-900">{plan.oneTimeFee}</span>
                      </div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500 font-medium">Monthly Upkeep:</span>
                        <span className="font-bold text-emerald-700 font-mono">{plan.monthly}/mo</span>
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_16px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.22)] ring-1 ring-white/10 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Continue with this Plan</span>
                  <ArrowRight className="w-4 h-4 text-indigo-300" />
                </button>
              </div>
            )}

            {/* Expandable Details Section */}
            {isDetailsExpanded && activePlan && (
              <div 
                ref={detailsRef}
                id="package-details-section"
                className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 border border-indigo-200/70 mb-6 animate-fadeIn shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {activePlan.name} Specifications
                    </h3>
                    <p className="text-xs text-indigo-600 font-medium">
                      {activePlan.oneTimeFee} setup fee · {activePlan.monthly}/month cloud hosting
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDetailsExpanded(false)}
                    className="text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {activePlan.suitabilityText}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {activePlan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-200/60 mb-5">
                  {activePlan.serverSpecs}
                </div>

                {/* Bottom Action inside Details Section */}
                <div className="pt-4 border-t border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDetailsExpanded(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Close Specifications
                  </button>

                  <button
                    type="button"
                    id="btn-details-continue-with-plan"
                    onClick={handleProceedToCatalog}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:via-indigo-900 hover:to-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_16px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.22)] ring-1 ring-white/10 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Continue with this Plan</span>
                    <ArrowRight className="w-4 h-4 text-indigo-300" />
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
          <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
              <button
                onClick={onBack}
                id="catalog-back-to-dashboard-btn"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-semibold transition-all border border-slate-200/80 cursor-pointer shadow-xs active:scale-[0.99] shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>← Return to Dashboard</span>
              </button>

              {/* Search Bar with Indigo Focus */}
              <div className="relative w-64 sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by code (#1042) or keyword..."
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* MANDATORY BANNER: What we do after your order, after your website order */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 pt-1">
              <button
                type="button"
                onClick={() => setIsOrderProcessExpanded(prev => !prev)}
                id="btn-what-we-do-after-order"
                className="w-full relative group inline-flex items-center justify-between px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 hover:from-slate-900 hover:via-indigo-900 hover:to-slate-900 text-white cursor-pointer shadow-[0_4px_20px_rgba(15,23,42,0.18)] border border-indigo-500/25 ring-1 ring-white/10 transition-all duration-200 overflow-hidden"
              >
                {/* Left Side: Bold Exact Statement with Live Pulse */}
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-white select-none">
                    What we do after your order, after your website order
                  </span>
                </div>

                {/* Right Side: Frosted Chevron Capsule */}
                <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/15 group-hover:bg-white/20 transition-all duration-200 shrink-0">
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
                className="p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.08)] mb-8 animate-fadeIn"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {/* Point 1 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/40 to-white border border-indigo-100 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      01
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        Direct phone call or WhatsApp connection to discuss and confirm your plan (Work begins only after speaking with you)
                      </span>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/40 to-white border border-purple-100 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      02
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        Collecting your brand logo, website tagline, site title, and custom domain details
                      </span>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/40 to-white border border-blue-100 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      03
                    </div>
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        Domain connection and rapid setup with live website delivery within 24 hours
                      </span>
                    </div>
                  </div>

                  {/* Point 4 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/40 to-white border border-emerald-100 flex items-center gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs">
                      04
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        Lifetime uninterrupted technical support via official WhatsApp for any assistance
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOrderProcessExpanded(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Hide Details
                  </button>
                </div>
              </div>
            )}

            {/* Demos Grid */}
            {filteredDemos.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/90 max-w-md mx-auto my-8 shadow-xs">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No websites match your search</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Try searching for another keyword or check another category.
                </p>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl text-xs font-semibold hover:from-slate-800 hover:to-indigo-900 transition-colors cursor-pointer shadow-xs"
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
                    className="group bg-white rounded-3xl border border-slate-200/90 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:border-indigo-300 hover:shadow-[0_16px_36px_-10px_rgba(79,70,229,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                  >
                    <div>
                      {/* Browser Chrome Window Frame */}
                      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
                        </div>
                        
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-slate-900 to-indigo-950 text-white tracking-wider shadow-2xs">
                          {demo.fourDigitCode}
                        </span>
                      </div>

                      {/* Image Preview with Hover Lift */}
                      <div className="relative overflow-hidden aspect-16/10 bg-slate-100">
                        <img
                          src={demo.previewImage}
                          alt={demo.title}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        />

                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/25 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <span>Open Live Preview</span>
                            <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                          </span>
                        </div>

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs border border-white/60">
                            {demo.categoryLabel}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono font-medium text-slate-400">
                            Code: {demo.fourDigitCode}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{demo.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                          {demo.englishTitle || demo.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {demo.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {demo.features.slice(0, 3).map((feat, idx) => (
                            <span key={idx} className="text-[10px] font-medium bg-indigo-50/70 text-indigo-700 border border-indigo-100/80 px-2 py-0.5 rounded-md">
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
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 group-hover:from-slate-800 group-hover:via-indigo-900 group-hover:to-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(15,23,42,0.12)] cursor-pointer"
                      >
                        <span>Visit Live Demo</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
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
        <div id="preview-simulator-active" className="flex-1 flex flex-col relative w-full bg-white animate-fadeIn min-h-screen">
          {/* Top Sticky Bar: Red Stroke Border, Dashboard Symbol (Left), High-Attraction Red Checkout (Right) */}
          <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b-2 border-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.14)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
              {/* Left Side: Return to Dashboard (Clean Symbol Only) */}
              <button
                onClick={onBack}
                id="simulator-return-to-dashboard-btn"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-600 transition-all cursor-pointer border border-slate-200/90 hover:border-red-300 shadow-xs flex items-center justify-center hover:-translate-x-0.5 active:translate-x-0 shrink-0"
                title="Return to Dashboard"
                aria-label="Return to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-current shrink-0" />
              </button>

              {/* Right Side: Ultra-Attractive High-Conversion Red Checkout Button */}
              <button
                type="button"
                onClick={() => onSelectForOrder(activeDemo)}
                id="header-checkout-this-website-btn"
                className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer border border-rose-300/50 shadow-[0_4px_22px_rgba(225,29,72,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_8px_32px_rgba(225,29,72,0.65),inset_0_1px_1px_rgba(255,255,255,0.6)] ring-1 ring-white/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shrink-0 overflow-hidden"
                title={`Buy website ${activeDemo.fourDigitCode}`}
              >
                {/* Subtle animated gloss sweep on hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

                {/* Live pulsing radar beacon */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-200"></span>
                </span>

                {/* Shopping Bag Icon */}
                <ShoppingBag className="w-4 h-4 text-white shrink-0" />

                {/* Action Title with Hashtag Code */}
                <span className="tracking-tight font-black whitespace-nowrap">
                  <span className="hidden sm:inline">Buy This Website </span>
                  <span className="sm:hidden">Buy Website </span>
                  <span className="font-mono text-xs font-black bg-black/25 px-1.5 py-0.5 rounded-md border border-white/20 shadow-inner ml-1 text-white">
                    {activeDemo.fourDigitCode}
                  </span>
                </span>

                {/* Forward Arrow with glide animation */}
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>
          </header>

          {/* Authentic Live Website - Full Width & Natural Page Scrolling */}
          <main className="w-full bg-white flex-1 flex flex-col">
            {/* Website Internal Top Nav Header (Scrolls with page) */}
            <div className="w-full border-b border-slate-100 bg-white shadow-2xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                {/* Clean Authentic Brand Name (Removed #2085 and long suffix) */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-base shadow-xs">
                    {(activeDemo.englishTitle || activeDemo.title).replace(/^#\d+\s*/, '').split('—')[0].trim().charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                      {(activeDemo.englishTitle || activeDemo.title).replace(/^#\d+\s*/, '').split('—')[0].trim()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Official Store
                    </span>
                  </div>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
                  <span className="text-indigo-600 cursor-pointer">Home</span>
                  <span className="hover:text-slate-900 transition-colors cursor-pointer">Shop Collection</span>
                  <span className="hover:text-slate-900 transition-colors cursor-pointer">New Arrivals</span>
                  <span className="hover:text-slate-900 transition-colors cursor-pointer">About Brand</span>
                  <span className="hover:text-slate-900 transition-colors cursor-pointer">Contact Us</span>
                </nav>

                <div className="flex items-center gap-2.5 text-xs">
                  <button 
                    onClick={() => handleAddToCart(activeDemo.mockData.items[0]?.name || 'Special Item')}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer relative"
                    title="Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Store Hero Banner */}
            <div className="w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white py-12 sm:py-20 px-4 sm:px-8 relative overflow-hidden">
              <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-indigo-300 border border-white/15 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                    <span>{activeDemo.categoryLabel.toUpperCase()} · 2026 EDITION</span>
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {activeDemo.heroHeadline || activeDemo.englishTitle || activeDemo.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-xl">
                    {activeDemo.mockData.heroSub}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleAddToCart(activeDemo.mockData.items[0]?.name || 'Special Offer')}
                      className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4 text-indigo-600" />
                      <span>Shop Featured Collection</span>
                    </button>
                    <a
                      href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                        `Hello, I would like to order website design ${activeDemo.fourDigitCode} (${activeDemo.title}).`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-4">
                      <span className="font-mono text-xs font-bold bg-white/90 text-slate-900 px-3 py-1 rounded-md shadow-sm">
                        Verified 100% Responsive
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className="w-full border-y border-slate-100 bg-slate-50/60 py-4 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>24-Hour Express Delivery</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free SSL & Cloud Hosting</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Mobile & Android Ready</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Lifetime Website Ownership</span>
                </div>
              </div>
            </div>

            {/* Featured Store Items Catalog */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block font-mono">
                    Product Showcase
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Featured Store Catalog
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Try adding products to test the live cart experience.
                  </p>
                </div>

                {lastAddedItem && (
                  <div className="p-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Added "{lastAddedItem}" to cart!</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeDemo.mockData.items.map((item, idx) => (
                  <div key={idx} className="group p-4 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.03)] hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative overflow-hidden rounded-xl aspect-4/3 mb-3 bg-slate-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-800 shadow-2xs font-mono">
                          In Stock
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-mono font-extrabold text-indigo-700">
                          {item.price}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through font-mono">
                          ৳{parseInt(item.price.replace(/[^0-9]/g, '') || '500') + 350}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item.name)}
                      className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials section */}
            <div className="w-full bg-slate-50 py-12 px-4 sm:px-6 border-t border-slate-200/80">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h3 className="text-xl font-bold text-slate-900">What Customers Say</h3>
                  <p className="text-xs text-slate-500 mt-1">Customer satisfaction guaranteed with every website build.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Kazi Farhan', role: 'Online Fashion Seller', text: 'Our website launched in less than 24 hours. The WhatsApp ordering integration tripled our sales!' },
                    { name: 'Nusrat Jahan', role: 'Boutique Owner, Dhaka', text: 'I had no coding knowledge, but managing products from my phone is effortless.' },
                    { name: 'Tanvir Ahmed', role: 'Gadget Store Entrepreneur', text: 'Fast cloud hosting, bKash & Nagad payments configured flawlessly right from day one.' }
                  ].map((rev, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center gap-1 text-amber-400 mb-2">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 italic leading-relaxed">"{rev.text}"</p>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                        <span className="text-[10px] text-slate-400">{rev.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Authentic Live Footer */}
            <footer className="w-full bg-slate-950 text-white py-12 px-4 sm:px-6 border-t border-slate-800">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-slate-400">
                <div>
                  <h4 className="text-sm font-bold text-white mb-3">
                    {activeDemo.englishTitle || activeDemo.title}
                  </h4>
                  <p className="leading-relaxed">
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
                  <p className="mb-2">bKash, Nagad, Rocket, Upay, Visa, Mastercard, AMEX.</p>
                  <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                    ✓ Secured by BongoWeb Gateway
                  </span>
                </div>
              </div>
              <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 text-center text-[11px] text-slate-500">
                © {new Date().getFullYear()} {activeDemo.englishTitle || activeDemo.title}. All rights reserved. Powered by BongoWeb Technologies.
              </div>
            </footer>
          </main>
        </div>
      )}
    </div>
  );
}
