import React, { useState, useEffect, useCallback } from 'react';
import { WebsiteCategory, WebsiteDemo } from './types';
import { WEBSITE_DEMOS } from './data/mockData';
import CategorySelectionLanding from './components/CategorySelectionLanding';
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

type ViewMode = 
  | 'category-picker' 
  | 'dashboard' 
  | 'after-order' 
  | 'live-chat' 
  | 'account' 
  | 'website-detail' 
  | 'order-page'
  | 'admin';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('category-picker');
  const [selectedCategory, setSelectedCategory] = useState<WebsiteCategory>('ecommerce');
  const [activeDemo, setActiveDemo] = useState<WebsiteDemo | null>(null);

  // Modals state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  // Helper to extract demo by code (e.g. 1042 or #1042)
  const findDemoByCode = (rawCode: string): WebsiteDemo | null => {
    const clean = rawCode.replace('#', '').trim().toLowerCase();
    return WEBSITE_DEMOS.find(
      (d) => d.fourDigitCode.replace('#', '').toLowerCase() === clean
    ) || WEBSITE_DEMOS[0];
  };

  // Parse path from window.location.pathname
  const parseCurrentUrl = useCallback(() => {
    const path = window.location.pathname;

    if (path === '/admin') {
      setViewMode('admin');
      return;
    }

    if (path.startsWith('/website/')) {
      const code = path.replace('/website/', '').split('/')[0];
      const demo = findDemoByCode(code);
      if (demo) {
        setActiveDemo(demo);
        setViewMode('website-detail');
        return;
      }
    }

    if (path.startsWith('/order/')) {
      const code = path.replace('/order/', '').split('/')[0];
      const demo = findDemoByCode(code);
      setActiveDemo(demo);
      setViewMode('order-page');
      return;
    }

    if (path === '/after-order') {
      setViewMode('after-order');
      return;
    }

    if (path === '/live-chat') {
      setViewMode('live-chat');
      return;
    }

    if (path === '/account') {
      setViewMode('account');
      return;
    }

    // Default root path "/"
    const savedCategory = sessionStorage.getItem('bongoweb_chosen_category');
    if (savedCategory) {
      setSelectedCategory(savedCategory as WebsiteCategory);
      setViewMode('dashboard');
    } else {
      setViewMode('category-picker');
    }
  }, []);

  // Initialize and listen to popstate
  useEffect(() => {
    parseCurrentUrl();

    const handlePopState = () => {
      parseCurrentUrl();
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseCurrentUrl]);

  // Navigate to Category Picker (URL remains root "/")
  const handleBackToCategoryPicker = () => {
    sessionStorage.removeItem('bongoweb_chosen_category');
    setViewMode('category-picker');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Select Category -> Enters Dashboard (URL is root domain "/")
  const handleSelectCategory = (category: WebsiteCategory) => {
    setSelectedCategory(category);
    sessionStorage.setItem('bongoweb_chosen_category', category);
    setViewMode('dashboard');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Open Website in dedicated full page with unique URL: /website/:code
  const handleOpenWebsiteDetail = (demo: WebsiteDemo) => {
    setActiveDemo(demo);
    const cleanCode = demo.fourDigitCode.replace('#', '');
    setViewMode('website-detail');
    window.history.pushState({}, '', `/website/${cleanCode}`);
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
    const cleanCode = resolvedDemo.fourDigitCode.replace('#', '');
    setViewMode('order-page');
    window.history.pushState({}, '', `/order/${cleanCode}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Change Fixed Bottom Nav tab with unique URLs
  const handleTabChange = (tab: BottomTabType) => {
    if (tab === 'dashboard') {
      setViewMode('dashboard');
      window.history.pushState({}, '', '/');
    } else if (tab === 'after-order') {
      setViewMode('after-order');
      window.history.pushState({}, '', '/after-order');
    } else if (tab === 'live-chat') {
      setViewMode('live-chat');
      window.history.pushState({}, '', '/live-chat');
    } else if (tab === 'account') {
      setViewMode('account');
      window.history.pushState({}, '', '/account');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to Dashboard from Detail or Order pages
  const handleReturnToDashboard = () => {
    setViewMode('dashboard');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Helper for active tab indicator in bottom nav
  const getActiveBottomTab = (): BottomTabType => {
    if (viewMode === 'after-order') return 'after-order';
    if (viewMode === 'live-chat') return 'live-chat';
    if (viewMode === 'account') return 'account';
    return 'dashboard';
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0D253D] antialiased selection:bg-[#E2E4FF] selection:text-[#533AFD] flex flex-col justify-between font-sans">
      {/* 1. Category Choosing Landing Screen (No special URL, at base domain "/") */}
      {viewMode === 'category-picker' && (
        <CategorySelectionLanding 
          onSelectCategory={handleSelectCategory}
          onNavigateToTab={(tab) => handleTabChange(tab)}
        />
      )}

      {/* 2. Standalone Leaf Green Admin Panel */}
      {viewMode === 'admin' && (
        <AdminPanelView onBackToApp={handleBackToCategoryPicker} />
      )}

      {/* 3. Dedicated Website Full Page (Unique URL: /website/:code, NO hover modal overlay) */}
      {viewMode === 'website-detail' && activeDemo && (
        <WebsiteDetailPage
          demo={activeDemo}
          onBackToDashboard={handleReturnToDashboard}
          onGoToOrder={handleOpenOrder}
        />
      )}

      {/* 4. Dedicated Order Full Page (Unique URL: /order/:code) */}
      {viewMode === 'order-page' && (
        <OrderPageView
          demo={activeDemo}
          onBackToDashboard={handleReturnToDashboard}
          onBackToWebsite={(code) => {
            const demo = findDemoByCode(code);
            if (demo) handleOpenWebsiteDetail(demo);
            else handleReturnToDashboard();
          }}
        />
      )}

      {/* 5. Main App Container (Dashboard, After Order, Live Chat, Account) */}
      {viewMode !== 'category-picker' && viewMode !== 'admin' && viewMode !== 'website-detail' && viewMode !== 'order-page' && (
        <div className="w-full min-h-screen flex flex-col bg-[#FFFFFF]">
          {/* Fixed Header */}
          <FixedHeader
            onBackToCategoryPicker={handleBackToCategoryPicker}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onOpenMenu={() => setSideMenuOpen(true)}
            unreadCount={unreadNotifications}
            currentCategory={selectedCategory}
          />

          {/* Dynamic Content Views */}
          <main className="flex-1 w-full pt-18 sm:pt-20">
            {/* Dashboard (URL: "/") */}
            {viewMode === 'dashboard' && (
              <DashboardView
                initialCategory={selectedCategory}
                onOpenLiveDemo={handleOpenWebsiteDetail}
                onOpenOrder={handleOpenOrder}
                onChangeCategoryLanding={handleBackToCategoryPicker}
              />
            )}

            {/* After Order (URL: "/after-order") */}
            {viewMode === 'after-order' && (
              <AfterOrderView
                onGoToDashboard={() => handleTabChange('dashboard')}
                onOpenLiveChat={() => handleTabChange('live-chat')}
              />
            )}

            {/* Live Chat (URL: "/live-chat") */}
            {viewMode === 'live-chat' && (
              <LiveChatView />
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
      />

      {/* Side Menu Drawer */}
      <SideMenuDrawer
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        onSelectTab={handleTabChange}
        onGoToCategoryLanding={handleBackToCategoryPicker}
      />
    </div>
  );
}
