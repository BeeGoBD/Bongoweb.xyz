import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, FolderKanban, Rocket, CheckCircle2, ShieldCheck, 
  Zap, Globe, Headphones, MessageCircle, ArrowRight, Clock,
  Eye, Check, Printer, X, AlertCircle
} from 'lucide-react';
import { ClientOrder, UserAccount } from '../types';
import { apiGetOrders, subscribeToOrders } from '../utils/api';
import { realtimeManager } from '../utils/realtime';

interface AfterOrderViewProps {
  onGoToDashboard: () => void;
  onOpenLiveChat: () => void;
}

export default function AfterOrderView({ onGoToDashboard, onOpenLiveChat }: AfterOrderViewProps) {
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<ClientOrder | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Load orders and subscribe to real-time status updates
  useEffect(() => {
    // 1. Get logged in user if any
    try {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (_) {}

    // 2. Fetch orders
    apiGetOrders().then((data) => {
      if (Array.isArray(data)) {
        setOrders(data);
      }
    });

    // 3. Realtime subscriptions
    const unsub = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
    });

    const unsubRealtime = realtimeManager.on('order:updated', (payload) => {
      if (Array.isArray(payload.orders)) {
        setOrders(payload.orders);
      }
    });

    return () => {
      unsub();
      unsubRealtime();
    };
  }, []);

  // Filter orders relevant to the client if logged in, otherwise show recent orders
  const clientOrders = currentUser 
    ? orders.filter(o => o.phone === currentUser.phone || o.email === currentUser.email)
    : orders;

  const pendingCount = clientOrders.filter(o => o.status === 'pending').length;
  const processingCount = clientOrders.filter(o => o.status === 'processing' || o.status === 'verified').length;
  const completedCount = clientOrders.filter(o => o.status === 'completed').length;

  // Serialized order steps: strictly 1, 2, 3, 4 sequential numbering with 100% pure Bengali copy
  const serialSteps = [
    {
      pointNumber: '১',
      mainText: 'আপনাকে আমরা ফোন করে বিস্তারিত জেনে নেব।',
      icon: PhoneCall,
      accentColor: '#2B47EE'
    },
    {
      pointNumber: '২',
      mainText: 'আপনার ব্যবসার লোগো ও প্রয়োজনীয় তথ্য আমরা সংগ্রহ করব।',
      icon: FolderKanban,
      accentColor: '#FF6118'
    },
    {
      pointNumber: '৩',
      mainText: 'আপনার পছন্দের কালার ও ওয়েবসাইটের প্রয়োজনীয় বিষয়গুলো নিয়ে আমরা ওয়েবসাইটটি তৈরি করে দেব।',
      icon: Rocket,
      accentColor: '#2B47EE'
    },
    {
      pointNumber: '৪',
      mainText: '৪৮ ঘণ্টার মধ্যে ওয়েবসাইট ডেলিভারি ও ফ্রি সাপোর্ট',
      icon: CheckCircle2,
      accentColor: '#00B261'
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans pb-28 pt-4">
      {/* 1. SECTION: YOUR ORDER DETAILS & LIVE STATUS (Shown only when client has active orders) */}
      {clientOrders.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-8">
          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            {/* Quick Stat Chips */}
            <div className="flex items-center gap-2 flex-wrap w-full justify-between sm:justify-start border-b border-[#E5EDF5] pb-4">
              <span className="px-3 py-1.5 rounded-xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs font-bold text-[#0D253D]">
                মোট অর্ডার: <strong className="text-[#2B47EE] font-mono">{clientOrders.length}</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#FFF8E7] border border-[#FFD552] text-xs font-bold text-[#8A6D00]">
                পেন্ডিং: <strong className="font-mono">{pendingCount}</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#EEF2FF] border border-[#2B47EE]/30 text-xs font-bold text-[#2B47EE]">
                প্রসেসিং: <strong className="font-mono">{processingCount}</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-[#E8F8F0] border border-[#00B261]/30 text-xs font-bold text-[#008A4B]">
                সম্পূর্ণ: <strong className="font-mono">{completedCount}</strong>
              </span>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {clientOrders.map((ord, idx) => {
                const isPending = ord.status === 'pending';
                const isProcessing = ord.status === 'processing' || ord.status === 'verified';
                const isCompleted = ord.status === 'completed';
                const uniqueKey = ord.orderId ? `client-order-${ord.orderId}-${idx}` : (ord.id ? `client-order-${ord.id}-${idx}` : `client-order-${idx}`);

                return (
                  <div
                    key={uniqueKey}
                    className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#E5EDF5] hover:border-[#2B47EE]/40 transition-all shadow-xs space-y-3.5"
                  >
                    {/* Top Row: IDs, Title, and Main Status Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-xl bg-[#2B47EE] text-white font-mono font-black text-xs">
                          {ord.orderId}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#EEF2FF] text-[#2B47EE] text-xs font-bold font-mono">
                          {ord.demoCode}
                        </span>
                        <h3 className="text-sm font-extrabold text-[#0D253D]">
                          {ord.companyName || ord.clientName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-[#00B261]/15 text-[#008A4B] border border-[#00B261]/30'
                            : isProcessing
                            ? 'bg-[#2B47EE]/15 text-[#2B47EE] border border-[#2B47EE]/30'
                            : 'bg-[#FFD552]/20 text-[#8A6D00] border border-[#FFD552]'
                        }`}>
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#008A4B]" />
                              <span>✓ সম্পূর্ণ (Completed)</span>
                            </span>
                          ) : isProcessing ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#2B47EE] animate-pulse" />
                              <span>অনুমোদিত (প্রসেসিং)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
                              <span>⏳ পেন্ডিং যাচাই</span>
                            </span>
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedReceiptOrder(ord)}
                          className="px-3 py-1 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>রসিদ দেখুন</span>
                        </button>
                      </div>
                    </div>

                    {/* 3-STEP VISUAL PROGRESS LIFECYCLE (Pending -> Approved [In Processing] -> Complete) */}
                    <div className="bg-[#F8FAFD] p-3 sm:p-4 rounded-xl border border-[#E5EDF5]">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        {/* Step 1: Pending */}
                        <div className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                          isPending 
                            ? 'bg-[#FFD552]/20 border border-[#FFD552] text-[#8A6D00] font-bold shadow-2xs' 
                            : 'bg-white/80 border border-[#E5EDF5] text-[#008A4B]'
                        }`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isPending ? 'bg-[#FFD552] text-[#0D253D]' : 'bg-[#00B261] text-white'
                          }`}>
                            {isPending ? '১' : '✓'}
                          </div>
                          <span className="text-[11px] sm:text-xs">১. পেন্ডিং যাচাই</span>
                        </div>

                        {/* Step 2: Approved (In Processing) */}
                        <div className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                          isProcessing 
                            ? 'bg-[#2B47EE]/15 border border-[#2B47EE] text-[#2B47EE] font-bold shadow-2xs' 
                            : isCompleted 
                            ? 'bg-white/80 border border-[#E5EDF5] text-[#008A4B]'
                            : 'bg-white/40 border border-[#E5EDF5] text-[#94A3B8]'
                        }`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isProcessing ? 'bg-[#2B47EE] text-white' : isCompleted ? 'bg-[#00B261] text-white' : 'bg-[#CBD5E1] text-[#64748D]'
                          }`}>
                            {isCompleted ? '✓' : '২'}
                          </div>
                          <span className="text-[11px] sm:text-xs">২. অনুমোদিত (প্রসেসিং)</span>
                        </div>

                        {/* Step 3: Completed */}
                        <div className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                          isCompleted 
                            ? 'bg-[#00B261]/15 border border-[#00B261] text-[#008A4B] font-bold shadow-2xs' 
                            : 'bg-white/40 border border-[#E5EDF5] text-[#94A3B8]'
                        }`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCompleted ? 'bg-[#00B261] text-white' : 'bg-[#CBD5E1] text-[#64748D]'
                          }`}>
                            {isCompleted ? '✓' : '৩'}
                          </div>
                          <span className="text-[11px] sm:text-xs">৩. সম্পূর্ণ</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata line */}
                    <div className="flex items-center justify-between text-[11px] text-[#64748D] pt-1 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span>তারিখ: <strong className="text-[#0D253D]">{ord.createdAt || 'N/A'}</strong></span>
                        <span>TrxID: <strong className="font-mono text-[#00B261]">{ord.transactionId || 'N/A'}</strong></span>
                        <span>মেকিং চার্জ: <strong className="text-[#2B47EE]">১,৯৯০ ৳</strong></span>
                      </div>
                      <span className="text-[10px] font-mono bg-[#F8FAFD] px-2 py-0.5 rounded border border-[#E5EDF5]">
                        পেমেন্ট: {String(ord.paymentMethod || 'bKash').toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 2. SECTION: SERIALIZED ORDER STEPS (অর্ডারের পর ধারাবাহিক পদক্ষেপসমূহ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="text-center mb-6">
          <span className="px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-bold border border-[#2B47EE]/20 inline-block mb-2 shadow-2xs">
            অর্ডার নিশ্চিতকরণের পরবর্তী ধাপ
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0D253D] tracking-tight">
            অর্ডারের পর <span className="text-[#2B47EE]">ধারাবাহিক পদক্ষেপসমূহ</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748D] mt-1">
            আপনার পছন্দের ডিজাইনটি বেছে অর্ডার করার পর আমাদের টিম যেভাবে আপনার ওয়েবসাইটটি রেডি করবে:
          </p>
        </div>

        {/* Serialized Step Cards: 100% Pure Bangla */}
        <div className="space-y-3 mb-10">
          {serialSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={`serial-step-${step.pointNumber || idx}`}
                className="w-full min-h-[76px] sm:min-h-[86px] p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#E5EDF5] hover:border-[#2B47EE] transition-all duration-200 shadow-2xs hover:shadow-md flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Serial Point Badge */}
                  <div className="flex items-center justify-center w-10 sm:w-12 shrink-0 border-r border-[#E5EDF5] pr-3 sm:pr-4">
                    <span className="text-xl sm:text-2xl font-black text-[#2B47EE]">
                      {step.pointNumber}
                    </span>
                  </div>

                  {/* Unique Matching Icon */}
                  <div 
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: '#EEF2FF',
                      color: step.accentColor
                    }}
                  >
                    <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
                  </div>

                  {/* Main Text ONLY in Pure Bangla */}
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-[#0D253D] group-hover:text-[#2B47EE] transition-colors leading-snug">
                      {step.mainText}
                    </h3>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0 hidden xs:block">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00B261] inline-block animate-pulse" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SECTION: WHAT WE PROVIDE AFTER ORDER (অর্ডারের পর আমরা যা যা প্রদান করি) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-[#F8FAFD] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-bold border border-[#2B47EE]/20 inline-block mb-2">
              ভেরিফাইড ডেলিভারি সার্ভিস
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0D253D] tracking-tight">
              অর্ডারের পর আমরা যা যা প্রদান করি
            </h2>
            <p className="text-xs sm:text-sm text-[#64748D] mt-2">
              আপনার ব্যবসার প্রতিটি ওয়েবসাইট অর্ডারের পর আমরা বিশ্বমানের ক্লাউড ইনফ্রাস্ট্রাকচার ও দীর্ঘমেয়াদী সেবা নিশ্চিত করি।
            </p>
          </div>

          {/* 4 Smart Deliverables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                অর্ডার কনফার্ম করার মাত্র ২৪ ঘণ্টার মধ্যে সম্পূর্ণ কার্যকরী ওয়েবসাইট লাইভ করে দেওয়া হয়।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">ফ্রি ডোমেইন ও ক্লাউড হোস্টিং</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                ১ বছরের জন্য ফ্রি অফিশিয়াল ডোমেইন এবং ৯৯.৯% আপটাইম বিশিষ্ট হাই-স্পিড ক্লাউড সার্ভার।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">১০০% মানিব্যাক সন্তুষ্টি গ্যারান্টি</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                কাজের গুণমান বা প্রতিশ্রুত ফিচারে অসন্তুষ্ট হলে কোনো প্রশ্ন ছাড়াই সম্পূর্ণ টাকা ফেরত।
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-[#0D253D]">আজীবন ফ্রি টেকনিক্যাল সাপোর্ট</h4>
              <p className="text-xs text-[#64748D] mt-1 leading-relaxed">
                যেকোনো সময় সরাসরি লাইভ চ্যাট বা ফোন কলে আমাদের টেকনিক্যাল টিম থেকে ইনস্ট্যান্ট সমাধান।
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="pt-6 border-t border-[#E5EDF5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onGoToDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2B47EE] hover:bg-[#203CD4] active:bg-[#1E3A8A] text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ড্যাশবোর্ডে ওয়েবসাইট দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLiveChat}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#00B261] hover:bg-[#009e56] text-[#FFFFFF] text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>২৪/৭ লাইভ সাপোর্ট চ্যাট</span>
            </button>
          </div>
        </div>
      </section>

      {/* Official Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 animate-slideUpModal relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-[#E5EDF5]">
              <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-mono font-black inline-block mb-1">
                {selectedReceiptOrder.orderId}
              </span>
              <h3 className="text-lg font-black text-[#0D253D]">অফিসিয়াল অর্ডার রসিদ (Receipt)</h3>
              <p className="text-[11px] text-[#64748D]">BongoWeb — ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">গ্রাহকের নাম:</span>
                <span className="font-bold text-[#0D253D]">{selectedReceiptOrder.clientName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">ব্যবসা/কোম্পানি:</span>
                <span className="font-bold text-[#0D253D]">{selectedReceiptOrder.companyName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">মোবাইল নম্বর:</span>
                <span className="font-bold font-mono text-[#0D253D]">{selectedReceiptOrder.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">ইমেইল এড্রেস:</span>
                <span className="font-bold font-mono text-[#0D253D]">{selectedReceiptOrder.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">পেমেন্ট মাধ্যম:</span>
                <span className="font-bold text-[#0D253D] uppercase">{selectedReceiptOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">ট্রানজেকশন TrxID:</span>
                <span className="font-bold font-mono text-[#00B261]">{selectedReceiptOrder.transactionId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">এককালীন চার্জ:</span>
                <span className="font-black text-sm text-[#0D253D]">১,৯৯০ ৳</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
                <span className="text-[#64748D]">মাসিক মেইনটেন্যান্স:</span>
                <span className="font-bold text-[#2B47EE]">১২০ ৳ / মাস</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#64748D]">স্ট্যাটাস:</span>
                <span className={`font-bold flex items-center gap-1 ${
                  selectedReceiptOrder.status === 'completed'
                    ? 'text-[#008A4B]'
                    : selectedReceiptOrder.status === 'processing' || selectedReceiptOrder.status === 'verified'
                    ? 'text-[#2B47EE]'
                    : selectedReceiptOrder.status === 'cancelled'
                    ? 'text-[#E53935]'
                    : 'text-[#D8351E]'
                }`}>
                  {selectedReceiptOrder.status === 'completed'
                    ? '✓ সম্পূর্ণ (Completed)'
                    : selectedReceiptOrder.status === 'processing' || selectedReceiptOrder.status === 'verified'
                    ? '⚡ অনুমোদিত (প্রসেসিং)'
                    : selectedReceiptOrder.status === 'cancelled'
                    ? 'বাতিলকৃত'
                    : '⏳ পেন্ডিং ভেরিফিকেশন (১ মিনিট - ১ ঘণ্টা)'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#2B47EE] hover:bg-[#203CD4] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট / ডাউনলোড</span>
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-xs font-bold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
