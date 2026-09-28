import React, { useState, useEffect } from 'react';
import { 
  ShoppingBasket, UtensilsCrossed, Newspaper, Store, 
  ArrowRight, ShieldCheck, Zap, Sparkles, Headphones, Globe,
  ChevronRight, CheckCircle2, Clock, Star, PhoneCall, Laptop, CreditCard, Lock,
  LogOut, User, Ticket, ShoppingBag, Layers, Send, X
} from 'lucide-react';
import { WebsiteCategory, UserAccount } from '../types';

interface CategorySelectionLandingProps {
  onSelectCategory: (category: WebsiteCategory) => void;
  onNavigateToTab?: (tab: 'dashboard' | 'after-order' | 'live-chat' | 'account') => void;
}

export default function CategorySelectionLanding({ 
  onSelectCategory,
  onNavigateToTab 
}: CategorySelectionLandingProps) {
  const [selectedId, setSelectedId] = useState<WebsiteCategory | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Support Ticket Modal State
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketReason, setTicketReason] = useState('');
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketQuestion, setTicketQuestion] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  // Check login state
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('bongoweb_user');
    sessionStorage.removeItem('bongoweb_user');
    setCurrentUser(null);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReason.trim() || !ticketName.trim() || !ticketQuestion.trim()) return;

    const randomId = `#TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTicketId(randomId);
    setTicketSubmitted(true);
  };

  // Clean English Categories
  const categories = [
    {
      id: 'ecommerce' as WebsiteCategory,
      titleEnglish: 'E-Commerce',
      titleBangla: 'ই-কমার্স ও শপ',
      subtitle: 'Online stores, carts, automated bKash & courier tracking',
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
    }, 120);
  };

  const handleGoToMainSection = () => {
    onSelectCategory(selectedId || 'all');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FFFFFF] text-[#0D253D] flex flex-col font-sans overflow-x-hidden selection:bg-[#E2E4FF] selection:text-[#533AFD]">
      {/* 1. Top Header with User Info & Quick Action Navigation */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#E5EDF5] sticky top-0 z-30 h-16 sm:h-[68px] px-4 sm:px-6 flex items-center justify-between gap-3 shadow-2xs">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#533AFD] text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-[0_3px_10px_rgba(83,58,253,0.3)]">
            BW
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline leading-tight">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#0D253D]">
                BongoWeb
              </span>
              <span className="text-xs font-bold text-[#533AFD] ml-0.5">.xyz</span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#64748D] -mt-0.5 hidden xs:block">
              Stripe Design System
            </span>
          </div>
        </div>

        {/* Right: Category Options (All Categories, Support Ticket, See All Orders, Account, Sign Out) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* View All Categories Button */}
          <button
            onClick={() => onSelectCategory('all')}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            title="সব ওয়েবসাইট দেখুন"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">View All Categories</span>
            <span className="md:hidden">সব সাইট</span>
          </button>

          {/* Support Ticket Button */}
          <button
            onClick={() => {
              setTicketSubmitted(false);
              setShowTicketModal(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            title="সাপোর্ট টিকিট জমা দিন"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Support Ticket</span>
          </button>

          {/* See All Orders Button */}
          <button
            onClick={() => onNavigateToTab ? onNavigateToTab('account') : onSelectCategory('all')}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            title="আপনার অর্ডারসমূহ দেখুন"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">See All Orders</span>
          </button>

          {/* Account Button */}
          <button
            onClick={() => onNavigateToTab ? onNavigateToTab('account') : onSelectCategory('all')}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            title="ক্লায়েন্ট অ্যাকাউন্ট"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{currentUser ? currentUser.name.split(' ')[0] : 'Account'}</span>
          </button>

          {/* Sign Out Button (Visible if logged in) */}
          {currentUser && (
            <button
              onClick={handleSignOut}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E53935]/10 text-[#64748D] hover:text-[#E53935] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="সাইন আউট করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Main Section: English Category Selection */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex flex-col items-center">
        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="px-3.5 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-extrabold border border-[#533AFD]/20 inline-block mb-3">
            Choose Your Business Industry
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0D253D] tracking-tight leading-tight">
            Select Your Website <span className="text-[#533AFD]">Category</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64748D] mt-2.5 max-w-lg mx-auto">
            আপনার ব্যবসার জন্য প্রস্তুত সম্পূর্ণ রেডি লাইভ ডিজাইন বেছে নিন। অর্ডার কনফার্ম করার মাত্র ২৪ ঘণ্টার মধ্যে ফুল সাইট লাইভ!
          </p>
        </div>

        {/* 4 Clean Category Cards (English Titles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat.id)}
                className={`p-6 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#533AFD] bg-[#FFFFFF] scale-[1.02]'
                    : 'border-[#E5EDF5] bg-[#FFFFFF] hover:border-[#533AFD]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: '#E2E4FF',
                        color: cat.accentColor
                      }}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F8FAFD] border border-[#E5EDF5] text-[#64748D]">
                      {cat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0D253D] group-hover:text-[#533AFD] transition-colors">
                    {cat.titleEnglish}
                  </h3>
                  <span className="text-xs font-semibold text-[#533AFD] block mb-1.5">
                    {cat.titleBangla}
                  </span>
                  <p className="text-xs text-[#64748D] leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5EDF5] flex items-center justify-between text-xs font-bold text-[#533AFD]">
                  <span>Explore Designs</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Categories Big CTA */}
        <div className="w-full max-w-xl mx-auto text-center mb-12">
          <button
            onClick={() => onSelectCategory('all')}
            className="w-full py-4 px-6 rounded-2xl bg-[#533AFD] hover:bg-[#665EFD] active:bg-[#4032C8] text-white text-sm sm:text-base font-black shadow-[0_6px_24px_rgba(83,58,253,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-95"
          >
            <span>সবগুলো ক্যাটাগরি একসাথে দেখুন (View All Categories)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Value Guarantees Section */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
            <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-bold text-[#0D253D]">২৪ ঘণ্টা লাইভ গ্যারান্টি</h4>
            <p className="text-xs text-[#64748D] mt-1">অর্ডার নিশ্চিত করার ২৪ ঘণ্টার মধ্যে লাইভ ডেলিভারি।</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
            <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
              <Globe className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-bold text-[#0D253D]">ফ্রি .com ডোমেইন</h4>
            <p className="text-xs text-[#64748D] mt-1">১ বছরের ফ্রি ডোমেইন ও লাইফটাইম ক্লাউড হোস্টিং।</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
            <div className="w-10 h-10 rounded-xl bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-bold text-[#0D253D]">১০০% মানিব্যাক পলিসি</h4>
            <p className="text-xs text-[#64748D] mt-1">কাজের কোয়ালিটিতে অসন্তুষ্ট হলে কোনো প্রশ্ন ছাড়াই রিফান্ড।</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5]">
            <div className="w-10 h-10 rounded-xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mb-3">
              <Headphones className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h4 className="text-sm font-bold text-[#0D253D]">আজীবন ফ্রি সাপোর্ট</h4>
            <p className="text-xs text-[#64748D] mt-1">সার্বক্ষণিক ডেডিকেটেড ইঞ্জিনিয়ার টিম থেকে সহায়তা।</p>
          </div>
        </div>
      </main>

      {/* 3. Footer with Town Sign Out Option */}
      <footer className="w-full py-6 border-t border-[#E5EDF5] bg-[#FFFFFF] text-center text-xs text-[#64748D]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 BongoWeb.xyz — All Rights Reserved. Stripe Design System Standards.</p>
          
          <div className="flex items-center gap-4 text-xs font-semibold">
            {currentUser && (
              <button 
                onClick={handleSignOut}
                className="text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>সাইন আউট (Sign Out)</span>
              </button>
            )}
            <button onClick={handleGoToMainSection} className="text-[#533AFD] hover:underline cursor-pointer">
              ড্যাশবোর্ড
            </button>
            <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="text-[#00B261] hover:underline">
              WhatsApp সাপোর্ট
            </a>
          </div>
        </div>
      </footer>

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD]"
            >
              <X className="w-5 h-5" />
            </button>

            {ticketSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold font-mono">
                  {generatedTicketId}
                </span>
                <h3 className="text-xl font-black text-[#0D253D]">
                  সাপোর্ট টিকিট সফলভাবে গৃহীত হয়েছে!
                </h3>
                <p className="text-xs sm:text-sm text-[#273951] leading-relaxed max-w-sm mx-auto">
                  ধন্যবাদ <strong className="text-[#533AFD]">{ticketName}</strong>। আমাদের টেকনিক্যাল টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setShowTicketModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold">
                    সরাসরি সাপোর্ট ডেস্ক
                  </span>
                  <h2 className="text-xl font-black text-[#0D253D] mt-2">
                    সাপোর্ট টিকিট জমা দিন (Support Ticket)
                  </h2>
                  <p className="text-xs text-[#64748D] mt-1">
                    আপনার যেকোনো প্রশ্ন বা সমস্যার কারণ লিখে টিকিট পাঠান।
                  </p>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1">
                      টিকিটের কারণ / বিষয় (Reason Name) <span className="text-[#D8351E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ডোমেইন সেটআপ, পেমেন্ট সংক্রান্ত..."
                      value={ticketReason}
                      onChange={(e) => setTicketReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        আপনার নাম <span className="text-[#D8351E]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="আপনার নাম"
                        value={ticketName}
                        onChange={(e) => setTicketName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0D253D] mb-1">
                        মোবাইল / WhatsApp <span className="text-[#D8351E]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017xxxxxxxx"
                        value={ticketPhone}
                        onChange={(e) => setTicketPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D253D] mb-1">
                      আপনার প্রশ্ন বা সমস্যা বিস্তারিত লিখুন <span className="text-[#D8351E]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="বিস্তারিত লিখুন..."
                      value={ticketQuestion}
                      onChange={(e) => setTicketQuestion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:bg-[#FFFFFF] focus:border-[#533AFD] resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>টিকিট পাঠান</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
