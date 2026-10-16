import React, { useState, useEffect, useCallback } from 'react';
import { WebsiteCategory, WebsiteDemo } from './types';
import { WEBSITE_DEMOS } from './data/mockData';
import FixedHeader from './components/FixedHeader';
import FixedBottomNav, { BottomTabType } from './components/FixedBottomNav';
import DashboardView from './components/DashboardView';
import AfterOrderView from './components/AfterOrderView';
import LiveChatView from './components/LiveChatView';
import AccountView from './components/AccountView';
import WebsiteDetailPage from './components/WebsiteDetailPage';
import OrderPageView from './components/OrderPageView';
import NotificationsModal from './components/NotificationsModal';
import SideMenuDrawer from './components/SideMenuDrawer';
import AdminPanelView from './components/AdminPanelView';
import LandscapeOrderDetailsModal from './components/LandscapeOrderDetailsModal';
import WebsiteCredentialsModal from './components/WebsiteCredentialsModal';
import CategoryWebsitesView from './components/CategoryWebsitesView';
import PrivacyPolicyView from './components/legal/PrivacyPolicyView';
import TermsConditionsView from './components/legal/TermsConditionsView';
import CookiePolicyView from './components/legal/CookiePolicyView';
import RefundPolicyView from './components/legal/RefundPolicyView';
import NotFoundView from './components/NotFoundView';
import AppFooter from './components/AppFooter';
import CookieConsentBanner from './components/CookieConsentBanner';
import { updatePageSEO } from './utils/seo';

type ViewMode = 
  | 'dashboard' 
  | 'category-websites'
  | 'after-order' 
  | 'live-chat' 
  | 'account' 
  | 'website-detail' 
  | 'order-page' 
  | 'admin'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'refund'
  | 'not-found';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.startsWith('/admin')) return 'admin';
      if (p.startsWith('/website')) return 'website-detail';
      if (p.startsWith('/order')) return 'order-page';
      if (p.startsWith('/after-order')) return 'after-order';
      if (p.startsWith('/live-chat')) return 'live-chat';
      if (p.startsWith('/account') || p.startsWith('/recover-email')) return 'account';
      if (p.startsWith('/dashboard')) return 'dashboard';

      const saved = sessionStorage.getItem('bongoweb_active_view') || localStorage.getItem('bongoweb_active_view');
      if (saved === 'dashboard') return 'dashboard';
      if (saved === 'account') return 'account';
      if (saved === 'live-chat') return 'live-chat';
      if (saved === 'after-order') return 'after-order';
    }
    // Directly land on Dashboard for any visitor (logged-in or guest)
    return 'dashboard';
  });
  const [selectedCategory, setSelectedCategory] = useState<WebsiteCategory>('ecommerce');
  const [activeDemo, setActiveDemo] = useState<WebsiteDemo | null>(null);
  const [afterOrderKey, setAfterOrderKey] = useState(0);

  // Modals state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [landscapeOrderModalOpen, setLandscapeOrderModalOpen] = useState(false);
  const [websiteCredentialsModalOpen, setWebsiteCredentialsModalOpen] = useState(false);

  // Track previous path before opening website detail so Back returns to where user came from (e.g. templates, category, etc.)
  const [returnPath, setReturnPath] = useState<string>(() => {
    try {
      return sessionStorage.getItem('bongoweb_return_path') || '/templates';
    } catch {
      return '/templates';
    }
  });

  // Helper to extract demo by code (e.g. 1042 or #1042 or custom uploaded websites)
  const findDemoByCode = (rawCode: string): WebsiteDemo | null => {
    const clean = decodeURIComponent(String(rawCode || '')).replace('#', '').trim().toLowerCase();
    
    // 1. Search in static mock data
    const foundStatic = WEBSITE_DEMOS.find(
      (d) => String(d?.fourDigitCode || '').replace('#', '').toLowerCase() === clean
    );
    if (foundStatic) return foundStatic;

    // 2. Search in custom websites from storage/vault
    try {
      const storedCustom = localStorage.getItem('bongoweb_custom_websites');
      if (storedCustom) {
        const parsed: WebsiteDemo[] = JSON.parse(storedCustom);
        const foundCustom = parsed.find(
          (d) => String(d?.fourDigitCode || '').replace('#', '').toLowerCase() === clean
        );
        if (foundCustom) return foundCustom;
      }
    } catch (_) {}

    return WEBSITE_DEMOS[0];
  };

  // Parse path from window.location.pathname, hash, or search
  const parseCurrentUrl = useCallback(() => {
    let rawPath = window.location.pathname || '/';

    // Support hash fallback (e.g. #/account, #/live-chat, #/order/1042)
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      rawPath = window.location.hash.replace(/^#/, '');
    } else if (window.location.hash && window.location.hash.length > 1 && !window.location.hash.includes('=')) {
      rawPath = '/' + window.location.hash.replace(/^#\/?/, '');
    }

    // Support query param fallback (e.g. ?view=account or ?tab=account)
    if (window.location.search) {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryView = params.get('view') || params.get('tab') || params.get('page');
        if (queryView) {
          rawPath = '/' + queryView.replace(/^\//, '');
        }
      } catch (_) {}
    }

    const path = decodeURIComponent(rawPath).replace(/\/+$/, '') || '/';

    if (path === '/admin' || path.startsWith('/admin')) {
      setViewMode('admin');
      return;
    }

    if (path.startsWith('/website')) {
      const code = path.replace(/^\/website\/?/, '').split('/')[0].split('?')[0];
      const demo = findDemoByCode(code) || WEBSITE_DEMOS[0];
      setActiveDemo(demo);
      setViewMode('website-detail');
      return;
    }

    if (path.startsWith('/order')) {
      const code = path.replace(/^\/order\/?/, '').split('/')[0].split('?')[0];
      const demo = findDemoByCode(code) || WEBSITE_DEMOS[0];
      setActiveDemo(demo);
      setViewMode('order-page');
      return;
    }

    if (path === '/after-order' || path.startsWith('/after-order')) {
      setViewMode('after-order');
      return;
    }

    if (path === '/live-chat' || path.startsWith('/live-chat')) {
      setViewMode('live-chat');
      return;
    }

    if (path === '/account' || path.startsWith('/account') || path === '/recover-email' || path.startsWith('/recover-email')) {
      setViewMode('account');
      return;
    }

    if (path.startsWith('/category')) {
      const cat = path.replace(/^\/category\/?/, '').split('/')[0].split('?')[0];
      if (cat) {
        setSelectedCategory(cat as WebsiteCategory);
      }
      setViewMode('category-websites');
      return;
    }

    if (path === '/templates' || path.startsWith('/templates')) {
      setSelectedCategory('all');
      setViewMode('category-websites');
      return;
    }

    if (path === '/preview' || path.startsWith('/preview')) {
      if (!activeDemo) setActiveDemo(WEBSITE_DEMOS[0]);
      setViewMode('website-detail');
      return;
    }

    if (path === '/help' || path.startsWith('/help')) {
      setViewMode('live-chat');
      return;
    }

    if (path === '/privacy' || path === '/privacy-policy' || path.startsWith('/privacy')) {
      setViewMode('privacy');
      return;
    }

    if (path === '/terms' || path === '/terms-and-conditions' || path.startsWith('/terms')) {
      setViewMode('terms');
      return;
    }

    if (path === '/cookies' || path === '/cookie-policy' || path.startsWith('/cookies')) {
      setViewMode('cookies');
      return;
    }

    if (path === '/refund' || path === '/refund-policy' || path.startsWith('/refund')) {
      setViewMode('refund');
      return;
    }

    if (path === '/404') {
      setViewMode('not-found');
      return;
    }

    if (path === '/dashboard' || path.startsWith('/dashboard')) {
      setViewMode('dashboard');
      return;
    }

    // Default root path "/"
    if (path === '/' || path === '') {
      const savedCategory = sessionStorage.getItem('bongoweb_chosen_category') || localStorage.getItem('bongoweb_chosen_category');
      if (savedCategory) setSelectedCategory(savedCategory as WebsiteCategory);
      setViewMode('dashboard');
      return;
    }

    // Any other unrecognized route -> 404 Custom Not Found View
    setViewMode('not-found');
  }, [findDemoByCode]);

  // Synchronize current view mode to storage
  useEffect(() => {
    try {
      localStorage.setItem('bongoweb_active_view', viewMode);
      sessionStorage.setItem('bongoweb_active_view', viewMode);
    } catch (_) {}
  }, [viewMode]);

  // Initialize and listen to popstate and hashchange
  useEffect(() => {
    // 1. Initial route resolution
    parseCurrentUrl();

    // 2. Fetch custom websites from database so direct URLs or page reloads resolve instantly
    fetch('/api/websites')
      .then(res => res.ok ? res.json() : [])
      .then((customWebsites: WebsiteDemo[]) => {
        if (Array.isArray(customWebsites) && customWebsites.length > 0) {
          localStorage.setItem('bongoweb_custom_websites', JSON.stringify(customWebsites));
          // If user loaded on a website or order page, re-parse to ensure the exact custom website object is bound
          const path = window.location.pathname || '';
          if (path.startsWith('/website') || path.startsWith('/order')) {
            parseCurrentUrl();
          }
        }
      })
      .catch(() => {});

    const handleNavigation = () => {
      parseCurrentUrl();
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const handleWebsitesUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        localStorage.setItem('bongoweb_custom_websites', JSON.stringify(e.detail));
        parseCurrentUrl();
      }
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('bongoweb_websites_updated', handleWebsitesUpdated);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('bongoweb_websites_updated', handleWebsitesUpdated);
    };
  }, [parseCurrentUrl]);

  // Select Category -> Enters Dashboard (URL is root domain "/")
  const handleSelectCategory = (category: WebsiteCategory) => {
    setSelectedCategory(category);
    sessionStorage.setItem('bongoweb_chosen_category', category);
    localStorage.setItem('bongoweb_chosen_category', category);
    localStorage.setItem('bongoweb_active_view', 'dashboard');
    setViewMode('dashboard');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Open Category Websites View with unique URL: /category/:category
  const handleOpenCategoryWebsites = (category: WebsiteCategory) => {
    setSelectedCategory(category);
    sessionStorage.setItem('bongoweb_chosen_category', category);
    localStorage.setItem('bongoweb_chosen_category', category);
    setViewMode('category-websites');
    window.history.pushState({}, '', `/category/${category}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Open Website in dedicated full page with unique URL: /website/:code
  const handleOpenWebsiteDetail = (demo: WebsiteDemo) => {
    const currentPath = window.location.pathname || '/';
    if (!currentPath.startsWith('/website') && !currentPath.startsWith('/order')) {
      setReturnPath(currentPath);
      try {
        sessionStorage.setItem('bongoweb_return_path', currentPath);
      } catch (_) {}
    }
    setActiveDemo(demo);
    const cleanCode = String(demo?.fourDigitCode || '2085').replace('#', '');
    setViewMode('website-detail');
    window.history.pushState({ prevPath: currentPath }, '', `/website/${cleanCode}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Open Order in dedicated full page with unique URL: /order/:code
  const handleOpenOrder = (demo: WebsiteDemo | string | null) => {
    let resolvedDemo: WebsiteDemo | null = null;
    if (typeof demo === 'string') {
      resolvedDemo = findDemoByCode(demo);
    } else if (demo) {
      resolvedDemo = demo;
    }

    if (!resolvedDemo) {
      resolvedDemo = activeDemo || WEBSITE_DEMOS[0];
    }

    setActiveDemo(resolvedDemo);
    const cleanCode = String(resolvedDemo?.fourDigitCode || '2085').replace('#', '');
    setViewMode('order-page');
    window.history.pushState({}, '', `/order/${cleanCode}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Change Fixed Bottom Nav tab with unique URLs
  const handleTabChange = (tab: BottomTabType) => {
    if (tab === 'home' || tab === 'dashboard') {
      setViewMode('dashboard');
      window.history.pushState({}, '', '/');
    } else if (tab === 'templates') {
      setSelectedCategory('all');
      sessionStorage.setItem('bongoweb_chosen_category', 'all');
      localStorage.setItem('bongoweb_chosen_category', 'all');
      setViewMode('category-websites');
      window.history.pushState({}, '', '/templates');
    } else if (tab === 'live-chat') {
      setViewMode('live-chat');
      window.history.pushState({}, '', '/live-chat');
    } else if (tab === 'help' || tab === 'after-order') {
      setAfterOrderKey((prev) => prev + 1);
      setViewMode('after-order');
      window.history.pushState({}, '', '/after-order');
    } else if (tab === 'preview') {
      if (!activeDemo) setActiveDemo(WEBSITE_DEMOS[0]);
      setViewMode('website-detail');
      const cleanCode = String(activeDemo?.fourDigitCode || WEBSITE_DEMOS[0].fourDigitCode).replace('#', '');
      window.history.pushState({}, '', `/website/${cleanCode}`);
    } else if (tab === 'account') {
      setViewMode('account');
      window.history.pushState({}, '', '/account');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to Dashboard (Home)
  const handleReturnToDashboard = () => {
    setViewMode('dashboard');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Navigate to Legal & Compliance pages
  const handleNavigateLegal = (page: 'privacy' | 'terms' | 'cookies' | 'refund') => {
    setViewMode(page);
    window.history.pushState({}, '', `/${page}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Return to previous view (Templates, Category, Home, etc.) when clicking Back from Website Detail / Preview
  const handleBackFromWebsite = () => {
    let target = returnPath;
    try {
      const stored = sessionStorage.getItem('bongoweb_return_path');
      if (stored && !stored.startsWith('/website') && !stored.startsWith('/order')) {
        target = stored;
      }
    } catch (_) {}

    // Fallback if target is invalid or self
    if (!target || target.startsWith('/website') || target.startsWith('/order')) {
      const savedCat = sessionStorage.getItem('bongoweb_chosen_category') || selectedCategory;
      if (savedCat && savedCat !== 'all') {
        target = `/category/${savedCat}`;
      } else {
        target = '/templates';
      }
    }

    window.history.pushState({}, '', target);
    parseCurrentUrl();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Helper for active tab indicator in bottom nav
  const getActiveBottomTab = (): BottomTabType => {
    if (viewMode === 'category-websites') return 'templates';
    if (viewMode === 'live-chat') return 'live-chat';
    if (viewMode === 'account') return 'account';
    if (viewMode === 'after-order') return 'help';
    if (viewMode === 'website-detail') {
      return (returnPath && (returnPath.startsWith('/templates') || returnPath.startsWith('/category'))) ? 'templates' : 'home';
    }
    return 'home';
  };

  return (
    <div className="min-h-screen bg-[#F8F5FC] text-[#1F1F2E] antialiased selection:bg-[#5B2C8A] selection:text-white flex flex-col justify-between font-sans">
      {/* 1. Standalone Executive Admin Panel */}
      {viewMode === 'admin' && (
        <AdminPanelView onBackToApp={handleReturnToDashboard} />
      )}

      {/* 2. Dedicated Website Full Page (Unique URL: /website/:code) */}
      {viewMode === 'website-detail' && (
        <div className="w-full min-h-screen flex flex-col bg-[#F8F5FC] text-[#1F1F2E]">
          <WebsiteDetailPage
            demo={activeDemo || findDemoByCode('') || WEBSITE_DEMOS[0]}
            onBackToDashboard={handleBackFromWebsite}
            onBack={handleBackFromWebsite}
            onGoToOrder={handleOpenOrder}
          />
          <FixedBottomNav
            activeTab={getActiveBottomTab()}
            onTabChange={handleTabChange}
            unreadChatCount={unreadNotifications}
          />
        </div>
      )}

      {/* 3. Dedicated Order Full Page (Unique URL: /order/:code) */}
      {viewMode === 'order-page' && (
        <OrderPageView
          demo={activeDemo || findDemoByCode('') || WEBSITE_DEMOS[0]}
          onBackToDashboard={handleBackFromWebsite}
          onBackToWebsite={(code) => {
            const demo = findDemoByCode(code);
            if (demo) handleOpenWebsiteDetail(demo);
            else handleBackFromWebsite();
          }}
        />
      )}

      {/* 4. Main App Container (Dashboard/Home, Templates, After Order, Live Chat, Account) */}
      {viewMode !== 'admin' && viewMode !== 'website-detail' && viewMode !== 'order-page' && (
        <div className="w-full min-h-screen flex flex-col bg-[#F8F5FC] text-[#1F1F2E]">
          {/* Fixed Header */}
          <FixedHeader
            onBackToCategoryPicker={handleReturnToDashboard}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onOpenMenu={() => setSideMenuOpen(true)}
            unreadCount={unreadNotifications}
            showBackArrow={viewMode === 'category-websites' || viewMode === 'after-order' || viewMode === 'account' || viewMode === 'live-chat'}
            activeTab={getActiveBottomTab()}
            onTabChange={handleTabChange}
            unreadChatCount={viewMode === 'live-chat' ? 0 : 1}
          />

          {/* Dynamic Content Views */}
          <main className="flex-1 w-full pt-16 sm:pt-[72px] lg:pt-[76px]">
            {/* Dashboard (URL: "/") */}
            {viewMode === 'dashboard' && (
              <DashboardView
                initialCategory={selectedCategory}
                onOpenLiveDemo={handleOpenWebsiteDetail}
                onOpenOrder={handleOpenOrder}
                onSelectCategoryWebsites={handleOpenCategoryWebsites}
                onChangeCategoryLanding={handleReturnToDashboard}
              />
            )}

            {/* Category Websites List (URL: "/category/:category") */}
            {viewMode === 'category-websites' && (
              <CategoryWebsitesView
                category={selectedCategory}
                onBackToDashboard={handleReturnToDashboard}
                onOpenWebsiteDetail={handleOpenWebsiteDetail}
                onOpenOrder={handleOpenOrder}
              />
            )}

            {/* After Order (URL: "/after-order") */}
            {viewMode === 'after-order' && (
              <AfterOrderView
                key={afterOrderKey}
                onGoToDashboard={() => handleTabChange('dashboard')}
                onOpenLiveChat={() => handleTabChange('live-chat')}
              />
            )}

            {/* Live Chat (URL: "/live-chat") */}
            {viewMode === 'live-chat' && (
              <LiveChatView onExitChat={() => handleTabChange('home')} />
            )}

            {/* Account (URL: "/account") */}
            {viewMode === 'account' && (
              <AccountView 
                onGoToDashboard={() => handleTabChange('dashboard')}
                onOpenAdminPanel={() => {
                  setViewMode('admin');
                  window.history.pushState({}, '', '/admin');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              />
            )}

            {/* Privacy Policy (URL: "/privacy") */}
            {viewMode === 'privacy' && (
              <PrivacyPolicyView
                onBack={handleReturnToDashboard}
                onNavigateToTerms={() => handleNavigateLegal('terms')}
                onNavigateToCookies={() => handleNavigateLegal('cookies')}
              />
            )}

            {/* Terms & Conditions (URL: "/terms") */}
            {viewMode === 'terms' && (
              <TermsConditionsView
                onBack={handleReturnToDashboard}
                onNavigateToPrivacy={() => handleNavigateLegal('privacy')}
                onNavigateToRefund={() => handleNavigateLegal('refund')}
              />
            )}

            {/* Cookie Policy (URL: "/cookies") */}
            {viewMode === 'cookies' && (
              <CookiePolicyView
                onBack={handleReturnToDashboard}
                onNavigateToPrivacy={() => handleNavigateLegal('privacy')}
              />
            )}

            {/* Refund Policy (URL: "/refund") */}
            {viewMode === 'refund' && (
              <RefundPolicyView
                onBack={handleReturnToDashboard}
                onNavigateToLiveChat={() => handleTabChange('live-chat')}
              />
            )}

            {/* Custom 404 Page */}
            {viewMode === 'not-found' && (
              <NotFoundView
                onGoHome={handleReturnToDashboard}
                onGoTemplates={() => handleTabChange('templates')}
                onGoSupport={() => handleTabChange('live-chat')}
              />
            )}

            {/* Global Comprehensive Footer */}
            {(viewMode === 'dashboard' || viewMode === 'category-websites' || viewMode === 'privacy' || viewMode === 'terms' || viewMode === 'cookies' || viewMode === 'refund' || viewMode === 'not-found') && (
              <AppFooter
                onNavigateHome={handleReturnToDashboard}
                onNavigateTemplates={() => handleTabChange('templates')}
                onNavigateLiveChat={() => handleTabChange('live-chat')}
                onNavigateAccount={() => handleTabChange('account')}
                onNavigatePrivacy={() => handleNavigateLegal('privacy')}
                onNavigateTerms={() => handleNavigateLegal('terms')}
                onNavigateCookies={() => handleNavigateLegal('cookies')}
                onNavigateRefund={() => handleNavigateLegal('refund')}
              />
            )}
          </main>

          {/* Fixed Bottom Navigation Bar (4 Options) */}
          <FixedBottomNav
            activeTab={getActiveBottomTab()}
            onTabChange={handleTabChange}
            unreadChatCount={viewMode === 'live-chat' ? 0 : 1}
          />
        </div>
      )}

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => {
          setNotificationsOpen(false);
          setUnreadNotifications(0);
        }}
        onClearAll={() => setUnreadNotifications(0)}
        onNavigateToAccount={() => {
          handleTabChange('account');
        }}
      />

      {/* Side Menu Drawer */}
      <SideMenuDrawer
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        onSelectTab={handleTabChange}
        onGoToCategoryLanding={handleReturnToDashboard}
        onOpenOrderDetails={() => setLandscapeOrderModalOpen(true)}
        onOpenWebsiteCredentials={() => setWebsiteCredentialsModalOpen(true)}
        onNavigateLegal={handleNavigateLegal}
      />

      {/* Dedicated Website Credentials Modal (Menu Option 2) */}
      <WebsiteCredentialsModal
        isOpen={websiteCredentialsModalOpen}
        onClose={() => setWebsiteCredentialsModalOpen(false)}
        onGoToDashboard={() => {
          setWebsiteCredentialsModalOpen(false);
          handleTabChange('dashboard');
        }}
      />

      {/* Landscape Order Details & Live Credentials Modal */}
      <LandscapeOrderDetailsModal
        isOpen={landscapeOrderModalOpen}
        onClose={() => setLandscapeOrderModalOpen(false)}
        onGoToDashboard={() => {
          setLandscapeOrderModalOpen(false);
          handleTabChange('dashboard');
        }}
        onGoToLiveChat={() => {
          setLandscapeOrderModalOpen(false);
          handleTabChange('live-chat');
        }}
      />

      {/* Cookie Consent Banner & Preferences Modal */}
      <CookieConsentBanner 
        onNavigateToCookies={() => handleNavigateLegal('cookies')} 
      />
    </div>
  );
}
