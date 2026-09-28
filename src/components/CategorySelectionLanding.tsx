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
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#0D253D] flex flex-col justify-between font-sans select-none overflow-y-auto">
      {/* 1. Top Header: STRICTLY ONLY LOGO — Zero extra icons */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#E5EDF5] shrink-0 h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
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

      {/* 2. Main Viewport: All 4 categories with increased, comfortable height */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 w-full flex flex-col justify-center items-center">
        {/* Title */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-black text-[#0D253D] tracking-tight">
            Select Your Website <span className="text-[#533AFD]">Category</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64748D] mt-1">
            আপনার ব্যবসার জন্য প্রস্তুত সম্পূর্ণ রেডি লাইভ ডিজাইন বেছে নিন (২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি)
          </p>
        </div>

        {/* 2x2 Grid: 
            Row 1: E-Commerce & Restaurant side-by-side
            Row 2: Blogs & Groceries side-by-side
            Height increased with min-h and generous vertical padding, width/length unchanged */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-3xl">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat.id)}
                className={`p-4 sm:p-6 sm:py-7 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-lg min-h-[210px] sm:min-h-[250px] md:min-h-[265px] ${
                  isSelected
                    ? 'border-[#533AFD] bg-[#FFFFFF] scale-[1.01] shadow-md'
                    : 'border-[#E5EDF5] bg-[#FFFFFF] hover:border-[#533AFD]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div
                      className="w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner"
                      style={{
                        backgroundColor: '#E2E4FF',
                        color: cat.accentColor
                      }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-[#F8FAFD] border border-[#E5EDF5] text-[#64748D] hidden xs:inline-block">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-lg font-black text-[#0D253D] group-hover:text-[#533AFD] transition-colors leading-tight">
                    {cat.titleEnglish}
                  </h3>
                  <span className="text-xs sm:text-sm font-bold text-[#533AFD] block mt-0.5 mb-1 sm:mb-2">
                    {cat.titleBangla}
                  </span>
                  <p className="text-[11px] sm:text-xs text-[#64748D] line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[#E5EDF5] flex items-center justify-between text-xs sm:text-sm font-bold text-[#533AFD] group-hover:text-[#4329d9]">
                  <span>Explore Catalog</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Option */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs sm:text-sm font-bold text-[#533AFD] hover:underline cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>সবগুলো ক্যাটাগরি একসাথে দেখতে চান? ক্লিক করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
