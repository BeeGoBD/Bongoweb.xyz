import React, { useState, useEffect } from 'react';
import { WebsiteCategory, WebsiteDemo } from './types';
import CategorySelectionLanding from './components/CategorySelectionLanding';
import FixedHeader from './components/FixedHeader';
import FixedBottomNav, { BottomTabType } from './components/FixedBottomNav';
import DashboardView from './components/DashboardView';
import AfterOrderView from './components/AfterOrderView';
import LiveChatView from './components/LiveChatView';
import AccountView from './components/AccountView';
import NotificationsModal from './components/NotificationsModal';
import SideMenuDrawer from './components/SideMenuDrawer';
import LivePreviewModal from './components/LivePreviewModal';
import OrderModal from './components/OrderModal';

type AppScreen = 'category-picker' | 'main-app';

export default function App() {
  // Screen state: First visitor directly sees category-picker
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('category-picker');
  const [selectedCategory, setSelectedCategory] = useState<WebsiteCategory>('ecommerce');

  // Fixed bottom tabs state inside main-app
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTabType>('dashboard');

  // Modals state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [previewDemo, setPreviewDemo] = useState<WebsiteDemo | null>(null);
  const [orderDemo, setOrderDemo] = useState<WebsiteDemo | string | null>(null);

  // Synchronize browser history for back button support
  useEffect(() => {
    window.history.replaceState({ screen: 'category-picker', tab: 'dashboard' }, '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        if (event.state.screen) {
          setCurrentScreen(event.state.screen);
        }
        if (event.state.tab) {
          setActiveBottomTab(event.state.tab);
        }
      } else {
        // Fallback: If on main-app, go back to category-picker
        setCurrentScreen((prev) => {
          if (prev === 'main-app') {
            return 'category-picker';
          }
          return prev;
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // When a user selects a category on the landing screen, directly take them to dashboard
  const handleSelectCategory = (category: WebsiteCategory) => {
    setSelectedCategory(category);
    setCurrentScreen('main-app');
    setActiveBottomTab('dashboard');
    window.history.pushState({ screen: 'main-app', category, tab: 'dashboard' }, '');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToCategoryPicker = () => {
    setCurrentScreen('category-picker');
    window.history.pushState({ screen: 'category-picker' }, '');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleTabChange = (tab: BottomTabType) => {
    setActiveBottomTab(tab);
    window.history.pushState({ screen: 'main-app', category: selectedCategory, tab }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLiveDemo = (demo: WebsiteDemo) => {
    setPreviewDemo(demo);
  };

  const handleOpenOrder = (demo: WebsiteDemo | string) => {
    setOrderDemo(demo);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0D253D] antialiased selection:bg-[#E2E4FF] selection:text-[#533AFD] flex flex-col justify-between font-sans">
      {/* 1. First Screen: Direct Category Choosing Option (No slides, No default dashboard) */}
      {currentScreen === 'category-picker' && (
        <CategorySelectionLanding onSelectCategory={handleSelectCategory} />
      )}

      {/* 2. Main App: Fixed Header, Dynamic Tab Content, and Fixed Bottom Nav */}
      {currentScreen === 'main-app' && (
        <div className="w-full min-h-screen flex flex-col bg-[#FFFFFF]">
          {/* Fixed Header: Fixed at top, does not scroll away */}
          <FixedHeader
            onBackToCategoryPicker={handleBackToCategoryPicker}
            onOpenNotifications={() => setNotificationsOpen(true)}
            onOpenMenu={() => setSideMenuOpen(true)}
            unreadCount={unreadNotifications}
            currentCategory={selectedCategory}
          />

          {/* Main Tab Views (Padding top for fixed header 68px) */}
          <main className="flex-1 w-full pt-18 sm:pt-20">
            {/* Tab 1: Dashboard (Shows all websites based on selected category) */}
            {activeBottomTab === 'dashboard' && (
              <DashboardView
                initialCategory={selectedCategory}
                onOpenLiveDemo={handleOpenLiveDemo}
                onOpenOrder={handleOpenOrder}
                onChangeCategoryLanding={handleBackToCategoryPicker}
              />
            )}

            {/* Tab 2: What we do after order (Step-by-step workflow & roadmap) */}
            {activeBottomTab === 'after-order' && (
              <AfterOrderView
                onGoToDashboard={() => handleTabChange('dashboard')}
                onOpenLiveChat={() => handleTabChange('live-chat')}
              />
            )}

            {/* Tab 3: Live Chat (Interactive messaging in Bangla) */}
            {activeBottomTab === 'live-chat' && (
              <LiveChatView />
            )}

            {/* Tab 4: Account (Client portal, settings, policies in English) */}
            {activeBottomTab === 'account' && (
              <AccountView />
            )}
          </main>

          {/* Fixed Bottom Navigation: 4 options fixed at bottom screen */}
          <FixedBottomNav
            activeTab={activeBottomTab}
            onTabChange={handleTabChange}
            unreadChatCount={activeBottomTab === 'live-chat' ? 0 : 1}
          />
        </div>
      )}

      {/* Global Modals & Drawers */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onClearAll={() => setUnreadNotifications(0)}
      />

      <SideMenuDrawer
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        onSelectTab={handleTabChange}
        onGoToCategoryLanding={handleBackToCategoryPicker}
      />

      <LivePreviewModal
        demo={previewDemo}
        onClose={() => setPreviewDemo(null)}
        onOrderThis={(demo) => {
          setPreviewDemo(null);
          handleOpenOrder(demo);
        }}
      />

      <OrderModal
        demo={orderDemo}
        onClose={() => setOrderDemo(null)}
      />
    </div>
  );
}
