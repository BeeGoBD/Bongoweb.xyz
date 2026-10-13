import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Clock, AlertCircle, Eye, Printer, 
  Key, Copy, Check, ExternalLink, ArrowRight, ShieldCheck, 
  RefreshCw, Lock, Sparkles
} from 'lucide-react';
import { ClientOrder, UserAccount, WebsiteDeliveryCredentials } from '../types';
import { apiGetOrders, apiGetCredentials, normalizePhone, subscribeToOrders } from '../utils/api';
import { realtimeManager } from '../utils/realtime';

interface LandscapeOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard?: () => void;
  onGoToLiveChat?: () => void;
}

export default function LandscapeOrderDetailsModal({
  isOpen,
  onClose,
  onGoToDashboard,
  onGoToLiveChat
}: LandscapeOrderDetailsModalProps) {
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [credentials, setCredentials] = useState<WebsiteDeliveryCredentials[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<ClientOrder | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedPass, setRevealedPass] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isOpen) return;

    let user: UserAccount | null = null;
    try {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        user = JSON.parse(stored);
        setCurrentUser(user);
      }
    } catch (_) {}

    const loadData = async () => {
      setLoading(true);
      try {
        const [ordersData, credsData] = await Promise.all([
          apiGetOrders(),
          apiGetCredentials()
        ]);
        setOrders(ordersData);
        setCredentials(credsData);
      } catch (err) {
        console.error('Failed to load order tracking:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const unsubOrders = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
    });

    const unsubRealtime = realtimeManager.on('order:updated', (payload) => {
      if (Array.isArray(payload.orders)) {
        setOrders(payload.orders);
      }
    });

    const handleCredsUpdated = () => {
      apiGetCredentials().then(setCredentials);
    };
    window.addEventListener('bongoweb_credentials_updated', handleCredsUpdated);

    return () => {
      unsubOrders();
      unsubRealtime();
      window.removeEventListener('bongoweb_credentials_updated', handleCredsUpdated);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter orders relevant to the client if logged in, otherwise show all user-placed orders
  const clientPhone = currentUser ? normalizePhone(currentUser.phone) : '';
  const clientEmail = currentUser?.email ? currentUser.email.toLowerCase().trim() : '';

  const relevantOrders = currentUser
    ? orders.filter(o => {
        const oPhone = normalizePhone(o.phone);
        const oEmail = (o.email || '').toLowerCase().trim();
        const phoneMatch = clientPhone && oPhone && (clientPhone.slice(-10) === oPhone.slice(-10));
        const emailMatch = clientEmail && oEmail && (clientEmail === oEmail);
        return phoneMatch || emailMatch;
      })
    : orders;

  const pendingCount = relevantOrders.filter(o => o.status === 'pending').length;
  const processingCount = relevantOrders.filter(o => o.status === 'processing' || o.status === 'verified').length;
  const completedCount = relevantOrders.filter(o => o.status === 'completed').length;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleRevealPass = (id: string) => {
    setRevealedPass(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-[#0F172A] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slideUpModal relative"
        role="dialog"
      >
        {/* Top Header */}
        <div className="px-5 py-4 sm:px-7 sm:py-5 border-b border-slate-800 bg-[#111827] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-950/90 text-purple-400 border border-purple-800/80 flex items-center justify-center font-black shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                আপনার অর্ডারের বিবরণ ও লাইভ ট্র্যাকিং
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                পেন্ডিং, প্রসেসিং ও ডেলিভারিকৃত ওয়েবসাইট আইডি-পাসওয়ার্ড বিস্তারিত
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stat Chips Bar */}
        <div className="px-5 py-3 sm:px-7 bg-slate-900 border-b border-slate-800 flex items-center gap-2 flex-wrap shrink-0">
          <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200">
            মোট অর্ডার: <strong className="text-purple-400 font-mono">{relevantOrders.length}</strong>
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-800 text-xs font-bold text-amber-300">
            পেন্ডিং যাচাই: <strong className="font-mono">{pendingCount}</strong>
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-800 text-xs font-bold text-purple-300">
            প্রসেসিং (সেটআপ): <strong className="font-mono">{processingCount}</strong>
          </span>
          <span className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs font-bold text-emerald-300">
            সম্পূর্ণ ও ডেলিভারি সম্পন্ন: <strong className="font-mono">{completedCount}</strong>
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 bg-[#0B0F19]">
          {loading ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-[#7C3AED]" />
              <p className="text-xs">অর্ডারের তথ্য লোড হচ্ছে...</p>
            </div>
          ) : relevantOrders.length === 0 ? (
            <div className="py-16 text-center bg-[#111827] rounded-3xl border border-slate-800 p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/90 text-purple-400 border border-purple-800 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-white">
                আপনি এখনো কোনো ওয়েবসাইট অর্ডার করেননি
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                আমাদের ড্যাশবোর্ডে গিয়ে মাত্র ১,৯৯০ টাকায় আপনার পছন্দের ক্যাটাগরি থেকে রেডি ওয়েবসাইট অর্ডার করতে পারেন।
              </p>
              {onGoToDashboard && (
                <button
                  onClick={() => {
                    onClose();
                    onGoToDashboard();
                  }}
                  className="mt-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md cursor-pointer inline-flex items-center gap-1.5 transition-all"
                >
                  <span>ওয়েবসাইট ব্রাউজ করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {relevantOrders.map((ord, idx) => {
                const isPending = ord.status === 'pending';
                const isProcessing = ord.status === 'processing' || ord.status === 'verified';
                const isCompleted = ord.status === 'completed';

                // Find matching credentials for this specific order
                const ordCleanPhone = normalizePhone(ord.phone);
                const foundCred = credentials.find(c => {
                  if (c.orderId && ord.orderId && c.orderId.trim() === ord.orderId.trim()) return true;
                  const cPhone = normalizePhone(c.userPhone);
                  if (ordCleanPhone && cPhone && (ordCleanPhone.slice(-10) === cPhone.slice(-10))) {
                    if (!c.websiteCode || c.websiteCode === ord.demoCode || !ord.demoCode) return true;
                  }
                  return false;
                });
                const matchingCred = foundCred ? {
                  ...foundCred,
                  websiteAdminId: ord.deliveredAdminId || foundCred.websiteAdminId,
                  websiteAdminPass: ord.deliveredAdminPass || foundCred.websiteAdminPass,
                } : (ord.deliveredAdminId ? {
                  id: `cred_ord_${ord.orderId}`,
                  orderId: ord.orderId,
                  userPhone: ord.phone,
                  userEmail: ord.email || '',
                  websiteAdminId: ord.deliveredAdminId,
                  websiteAdminPass: ord.deliveredAdminPass || '—',
                  websiteTitle: ord.companyName || ord.demoTitle || 'অ্যাডমিন প্যানেল',
                  websiteCode: ord.demoCode,
                  deliveredAt: ord.createdAt
                } : null);

                return (
                  <div
                    key={ord.orderId ? `order-card-${ord.orderId}` : `ord-idx-${idx}`}
                    className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all shadow-xs space-y-4 bg-[#111827] ${
                      isCompleted
                        ? 'border-emerald-500/50 hover:border-emerald-400'
                        : isProcessing
                        ? 'border-purple-500/50 hover:border-purple-400'
                        : 'border-amber-500/50 hover:border-amber-400'
                    }`}
                  >
                    {/* Top Row: IDs, Website Title & Status Pill */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] text-white font-mono font-black text-xs shadow-2xs">
                          {ord.orderId}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-purple-950/90 text-purple-300 text-xs font-bold font-mono border border-purple-800">
                          {ord.demoCode}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-white">
                          {ord.companyName || ord.clientName}
                        </h3>
                        {ord.customDomain && (
                          <span className="text-[11px] text-emerald-300 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                            {ord.customDomain}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800'
                            : isProcessing
                            ? 'bg-purple-950/90 text-purple-300 border border-purple-800'
                            : 'bg-amber-950/90 text-amber-300 border border-amber-800'
                        }`}>
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>✓ সম্পূর্ণ (Live & Ready)</span>
                            </>
                          ) : isProcessing ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                              <span>⚡ অনুমোদিত (প্রসেসিং)</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                              <span>⏳ পেন্ডিং যাচাই</span>
                            </>
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedReceiptOrder(ord)}
                          className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>রসিদ দেখুন</span>
                        </button>
                      </div>
                    </div>

                    {/* 3-Step Live Visual Lifecycle Pipeline */}
                    <div className="bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        {/* Step 1: Pending */}
                        <div className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          isPending 
                            ? 'bg-amber-950/50 border border-amber-800 text-amber-300 font-bold shadow-2xs' 
                            : 'bg-slate-900 border border-slate-800 text-emerald-400'
                        }`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isPending ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                          }`}>
                            {isPending ? '১' : '✓'}
                          </div>
                          <span className="text-[11px] sm:text-xs">১. পেমেন্ট যাচাই</span>
                        </div>

                        {/* Step 2: Processing */}
                        <div className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          isProcessing 
                            ? 'bg-purple-950/50 border border-purple-800 text-purple-300 font-bold shadow-2xs' 
                            : isCompleted 
                            ? 'bg-slate-900 border border-slate-800 text-emerald-400'
                            : 'bg-slate-900/40 border border-slate-800/80 text-slate-500'
                        }`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isProcessing ? 'bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] text-white' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isCompleted ? '✓' : '২'}
                          </div>
                          <span className="text-[11px] sm:text-xs">২. ওয়েবসাইট রেডি (২৪ ঘণ্টা)</span>
                        </div>

                        {/* Step 3: Completed */}
                        <div className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          isCompleted 
                            ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300 font-bold shadow-2xs' 
                            : 'bg-slate-900/40 border border-slate-800/80 text-slate-500'
                        }`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {isCompleted ? '✓' : '৩'}
                          </div>
                          <span className="text-[11px] sm:text-xs">৩. সম্পন্ন ও লাইভ</span>
                        </div>
                      </div>
                    </div>

                    {/* DELIVERED WEBSITE CREDENTIALS (ID & PASSWORD) SECTION */}
                    {matchingCred ? (
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/70 shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
                            <Key className="w-4 h-4" />
                            <span>আপনার ওয়েবসাইটের আইডি ও পাসওয়ার্ড (Website Admin Credentials)</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                            ডেলিভারি সম্পন্ন
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Username / Admin ID */}
                          <div className="p-3 bg-white rounded-xl border border-[#00B261]/30 flex items-center justify-between gap-2 shadow-2xs">
                            <div className="min-w-0">
                              <span className="text-[10px] text-[#64748D] block uppercase font-bold">
                                অ্যাডমিন ইউজারনেম / ID
                              </span>
                              <span className="text-xs sm:text-sm font-black font-mono text-[#0D253D] truncate block">
                                {matchingCred.websiteAdminId}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(matchingCred.websiteAdminId, `user-${ord.orderId}`)}
                              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-[#FAF5FF] text-[#6B46C1] border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                              title="কপি করুন"
                            >
                              {copiedId === `user-${ord.orderId}` ? (
                                 <>
                                   <Check className="w-3.5 h-3.5 text-[#00B261]" />
                                   <span>কপি হয়েছে</span>
                                 </>
                              ) : (
                                 <>
                                   <Copy className="w-3.5 h-3.5" />
                                   <span>কপি</span>
                                 </>
                              )}
                            </button>
                          </div>

                          {/* Password */}
                          <div className="p-3 bg-white rounded-xl border border-[#00B261]/30 flex items-center justify-between gap-2 shadow-2xs">
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-500 block uppercase font-bold">
                                অ্যাডমিন পাসওয়ার্ড
                              </span>
                              <span className="text-xs sm:text-sm font-black font-mono text-[#0F172A] truncate block">
                                {revealedPass[ord.orderId] ? matchingCred.websiteAdminPass : '••••••••••••'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleRevealPass(ord.orderId)}
                                className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-bold"
                              >
                                {revealedPass[ord.orderId] ? 'লুকান' : 'দেখুন'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopy(matchingCred.websiteAdminPass, `pass-${ord.orderId}`)}
                                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-[#FAF5FF] text-[#6B46C1] border border-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                title="কপি করুন"
                              >
                                {copiedId === `pass-${ord.orderId}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#00B261]" />
                                    <span>কপি হয়েছে</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>কপি</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#008A4B] font-medium pt-0.5">
                          ✓ নোট: {matchingCred.notes || 'আপনার ওয়েবসাইট সম্পূর্ণ তৈরি ও রেডি। অ্যাডমিন প্যানেলে লগইন করে কাস্টমাইজ করুন।'}
                        </p>
                      </div>
                    ) : isProcessing ? (
                      <div className="p-3.5 rounded-2xl bg-[#FAF5FF] border border-[#DDD6FE] text-[#6B46C1] text-xs font-medium flex items-center gap-2.5">
                        <Clock className="w-4 h-4 shrink-0 text-[#6B46C1] animate-spin" />
                        <span>
                          আমাদের ইঞ্জিনিয়ার টিম আপনার ওয়েবসাইট দ্রুত কনফিগার করছেন। সেটআপ সম্পন্ন হওয়া মাত্রই এখানে আপনার অ্যাডমিন আইডি ও পাসওয়ার্ড ভেসে উঠবে।
                        </span>
                      </div>
                    ) : null}

                    {/* Metadata summary line */}
                    <div className="flex items-center justify-between text-[11px] text-[#64748D] pt-1 flex-wrap gap-2 border-t border-[#F1F5F9]">
                      <div className="flex items-center gap-3">
                        <span>তারিখ: <strong className="text-[#0D253D]">{ord.createdAt || 'N/A'}</strong></span>
                        <span>TrxID: <strong className="font-mono text-[#00B261]">{ord.transactionId || 'N/A'}</strong></span>
                        <span>মেকিং চার্জ: <strong className="text-[#9333EA]">১,৯৯০ ৳</strong></span>
                        <span><strong className="text-[#9333EA]">মাসিক খরচ ২৫০ টাকা</strong></span>
                      </div>
                      <span className="text-[10px] font-mono bg-[#F8FAFD] px-2 py-0.5 rounded border border-[#E5EDF5]">
                        পেমেন্ট: {String(ord.paymentMethod || 'bKash').toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 sm:px-7 border-t border-[#E5EDF5] bg-[#F8FAFD] flex items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-[#64748D]">
            BongoWeb • ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি ও আজীবন টেকনিক্যাল সাপোর্ট
          </p>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0D253D] hover:bg-[#1E293B] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>

      {/* Official Receipt Modal Nested */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#0D253D]/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 animate-slideUpModal relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-200">
              <span className="px-3 py-1 rounded-full bg-[#FAF5FF] text-[#6B46C1] border border-[#DDD6FE] text-xs font-mono font-black inline-block mb-1">
                {selectedReceiptOrder.orderId}
              </span>
              <h3 className="text-lg font-black text-[#0F172A]">অফিসিয়াল অর্ডার রসিদ (Receipt)</h3>
              <p className="text-[11px] text-slate-500">BongoWeb — ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">গ্রাহকের নাম:</span>
                <span className="font-bold text-[#0F172A]">{selectedReceiptOrder.clientName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">ব্যবসা/কোম্পানি:</span>
                <span className="font-bold text-[#0F172A]">{selectedReceiptOrder.companyName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">মোবাইল নম্বর:</span>
                <span className="font-bold font-mono text-[#0F172A]">{selectedReceiptOrder.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">ইমেইল এড্রেস:</span>
                <span className="font-bold font-mono text-[#0F172A]">{selectedReceiptOrder.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
                <span className="font-bold text-[#0F172A] uppercase">{selectedReceiptOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">ট্রানজেকশন TrxID:</span>
                <span className="font-bold font-mono text-[#00B261]">{selectedReceiptOrder.transactionId}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">এককালীন চার্জ:</span>
                <span className="font-black text-sm text-[#0F172A]">১,৯৯০ ৳</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">মাসিক খরচ:</span>
                <span className="font-bold text-[#6B46C1]">মাসিক খরচ ২৫০ টাকা</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">স্ট্যাটাস:</span>
                <span className={`font-bold flex items-center gap-1 ${
                  selectedReceiptOrder.status === 'completed'
                    ? 'text-[#008A4B]'
                    : selectedReceiptOrder.status === 'processing' || selectedReceiptOrder.status === 'verified'
                    ? 'text-[#6B46C1]'
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
                    : '⏳ পেন্ডিং ভেরিফিকেশন'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট / ডাউনলোড</span>
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-[#FAF5FF] text-[#6B46C1] border border-slate-200 hover:border-[#DDD6FE] text-xs font-bold cursor-pointer transition-colors"
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
