import React, { useState, useEffect } from 'react';
import { 
  ShoppingBasket, UtensilsCrossed, Newspaper, Store, 
  ChevronRight, ArrowRight, LogOut, CheckCircle2
} from 'lucide-react';
import { WebsiteCategory, UserAccount } from '../types';

interface CategorySelectionLandingProps {
  onSelectCategory: (category: WebsiteCategory) => void;
  onNavigateToTab?: (tab: 'dashboard' | 'after-order' | 'live-chat' | 'account') => void;
}

export default function CategorySelectionLanding({ 
  onSelectCategory 
}: CategorySelectionLandingProps) {
  const [selectedId, setSelectedId] = useState<WebsiteCategory | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserAccount | null>(null);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        setLoggedInUser(JSON.parse(stored));
      }
    } catch (_) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bongoweb_user');
    sessionStorage.removeItem('bongoweb_user');
    setLoggedInUser(null);
    setShowLogoutToast(true);
    setTimeout(() => setShowLogoutToast(false), 3000);
  };

  // Strictly 4 core categories in order: 
  // Row 1: E-Commerce & Restaurant side-by-side
  // Row 2: Blogs & Media & Groceries side-by-side
  const categories = [
    {
      id: 'ecommerce' as WebsiteCategory,
      titleEnglish: 'E-Commerce',
      titleBangla: 'ই-কমার্স ও শপ',
      subtitle: 'Online stores, inventory, automated bKash & courier tracking',
      icon: ShoppingBasket,
      tag: 'Popular',
      accentColor: '#533AFD'
    },
    {
      id: 'restaurant' as WebsiteCategory,
      titleEnglish: 'Restaurant',
      titleBangla: 'ক্যাফে ও রেস্তোরাঁ',
      subtitle: 'Digital food menu, table reservation, dine-in delivery',
      icon: UtensilsCrossed,
      tag: 'Trending',
      accentColor: '#FF6118'
    },
    {
      id: 'blogging' as WebsiteCategory,
      titleEnglish: 'Blogs & Media',
      titleBangla: 'ব্লগ ও মিডিয়া',
      subtitle: 'Modern news magazine, SEO archives, article publisher',
      icon: Newspaper,
      tag: 'Editorial',
      accentColor: '#533AFD'
    },
    {
      id: 'grocery' as WebsiteCategory,
      titleEnglish: 'Groceries',
      titleBangla: 'মুদি ও গ্রোসারি',
      subtitle: 'Organic farm foods, area express delivery, weight carts',
      icon: Store,
      tag: 'Essential',
      accentColor: '#00B261'
    }
  ];

  const handleCardClick = (catId: WebsiteCategory) => {
    setSelectedId(catId);
    setTimeout(() => {
      onSelectCategory(catId);
    }, 100);
  };

  return (
    <div className="h-screen max-h-screen w-full bg-[#FFFFFF] text-[#0D253D] flex flex-col justify-between font-sans select-none overflow-hidden sm:overflow-auto">
      {/* 1. Top Header: STRICTLY ONLY LOGO — Zero extra icons */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#E5EDF5] shrink-0 h-13 sm:h-15 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#533AFD] text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_3px_10px_rgba(83,58,253,0.3)]">
            BW
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline leading-none">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#0D253D]">
                BongoWeb
              </span>
              <span className="text-xs font-bold text-[#533AFD] ml-0.5">.xyz</span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#64748D] -mt-0.5">
              Verified Platform
            </span>
          </div>
        </div>

        {/* If logged in, show clear Sign Out button right in category section as requested */}
        {loggedInUser && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-[11px] sm:text-xs font-bold transition-all cursor-pointer"
            title="লগআউট করুন"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট ({loggedInUser.name.split(' ')[0]})</span>
          </button>
        )}
      </header>

      {/* Logout Toast Notification */}
      {showLogoutToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>সফলভাবে অ্যাকাউন্ট থেকে লগআউট করা হয়েছে!</span>
        </div>
      )}

      {/* 2. Main Viewport: All 4 categories visible in FIRST VIEW (Zero scrolling required!) */}
      <main className="flex-1 max-w-4xl mx-auto px-3.5 sm:px-6 py-2 sm:py-4 w-full flex flex-col justify-center items-center">
        {/* Title */}
        <div className="text-center mb-2.5 sm:mb-4">
          <h1 className="text-lg sm:text-2xl font-black text-[#0D253D] tracking-tight">
            Select Your Website <span className="text-[#533AFD]">Category</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-[#64748D] mt-0.5">
            আপনার ব্যবসার জন্য প্রস্তুত সম্পূর্ণ রেডি লাইভ ডিজাইন বেছে নিন (২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি)
          </p>
        </div>

        {/* 2x2 Grid: 
            Row 1: E-Commerce & Restaurant side-by-side
            Row 2: Blogs & Groceries side-by-side
            Compact padding to guarantee 100% viewport visibility on all screens */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full max-w-3xl">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat.id)}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#533AFD] bg-[#FFFFFF] scale-[1.01]'
                    : 'border-[#E5EDF5] bg-[#FFFFFF] hover:border-[#533AFD]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: '#E2E4FF',
                        color: cat.accentColor
                      }}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F8FAFD] border border-[#E5EDF5] text-[#64748D] hidden xs:inline-block">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-black text-[#0D253D] group-hover:text-[#533AFD] transition-colors leading-tight">
                    {cat.titleEnglish}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#533AFD] block mb-0.5">
                    {cat.titleBangla}
                  </span>
                  <p className="text-[9px] sm:text-xs text-[#64748D] line-clamp-2 leading-tight">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t border-[#E5EDF5] flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#533AFD]">
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Option */}
        <div className="mt-2.5 sm:mt-4 text-center">
          <button
            onClick={() => onSelectCategory('all')}
            className="text-[11px] sm:text-xs font-bold text-[#533AFD] hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <span>সবগুলো ক্যাটাগরি একসাথে দেখতে চান? ক্লিক করুন</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </main>

      {/* 3. Clean Footer */}
      <footer className="w-full py-2.5 shrink-0 border-t border-[#E5EDF5] bg-[#FFFFFF] text-center text-[10px] sm:text-xs text-[#64748D]">
        <p>© 2026 BongoWeb.xyz — All Rights Reserved. Stripe Design System Standards.</p>
      </footer>
    </div>
  );
}
