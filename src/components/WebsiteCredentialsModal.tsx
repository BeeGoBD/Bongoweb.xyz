import React, { useState, useEffect } from 'react';
import { 
  X, Key, Copy, Check, ExternalLink, Globe, ShieldCheck, 
  Clock, AlertCircle, Sparkles, ArrowRight, Laptop
} from 'lucide-react';
import { ClientOrder, UserAccount, WebsiteDeliveryCredentials } from '../types';
import { apiGetOrders, apiGetCredentials, normalizePhone } from '../utils/api';
import { realtimeManager } from '../utils/realtime';

interface WebsiteCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard?: () => void;
}

export default function WebsiteCredentialsModal({
  isOpen,
  onClose,
  onGoToDashboard
}: WebsiteCredentialsModalProps) {
  const [userOrders, setUserOrders] = useState<ClientOrder[]>([]);
  const [credentialsList, setCredentialsList] = useState<WebsiteDeliveryCredentials[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadData = async () => {
    let user: UserAccount | null = null;
    try {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        user = JSON.parse(stored);
        setCurrentUser(user);
      }
    } catch (_) {}

    try {
      const [allOrders, allCreds] = await Promise.all([
        apiGetOrders(),
        apiGetCredentials()
      ]);

      const userCleanPhone = user ? normalizePhone(user.phone) : '';
      const userCleanEmail = (user?.email || '').toLowerCase().trim();

      // Find user's orders
      const matchingOrders = allOrders.filter((o) => {
        const oPhone = normalizePhone(o.phone);
        const oEmail = (o.email || '').toLowerCase().trim();
        return (userCleanPhone && oPhone && userCleanPhone.slice(-10) === oPhone.slice(-10)) ||
               (userCleanEmail && oEmail && userCleanEmail === oEmail);
      });
      setUserOrders(matchingOrders);

      // Find user's delivered credentials
      const matchingCreds = allCreds.filter((c) => {
        const cPhone = normalizePhone(c.userPhone);
        const cEmail = (c.userEmail || (c as any).clientEmail || '').toLowerCase().trim();
        const phoneMatch = userCleanPhone && cPhone && (userCleanPhone.slice(-10) === cPhone.slice(-10));
        const emailMatch = userCleanEmail && cEmail && (userCleanEmail === cEmail);
        return phoneMatch || emailMatch;
      });

      // Strict authoritative resolution: order credentials set by Admin override older credentials
      const rawCandidates: WebsiteDeliveryCredentials[] = [];

      for (const ord of matchingOrders) {
        const ordOrderId = String(ord.orderId || (ord as any).id || '').trim();
        const ordDemoCode = String(ord.demoCode || '').trim();

        const matchedDelivery = matchingCreds.find(c => {
          const cOrder = String(c.orderId || '').trim();
          const cCode = String(c.websiteCode || '').trim();
          if (cOrder && ordOrderId && cOrder === ordOrderId) return true;
          if (cCode && ordDemoCode && (cCode === ordDemoCode || cCode.replace('#', '') === ordDemoCode.replace('#', ''))) return true;
          if (matchingOrders.length <= 1) return true;
          return false;
        });

        const hasOrderCreds = Boolean(ord.deliveredAdminId && ord.deliveredAdminPass);
        if (hasOrderCreds || matchedDelivery) {
          const finalAdminId = (hasOrderCreds ? ord.deliveredAdminId : matchedDelivery?.websiteAdminId) || 'admin';
          const finalAdminPass = (hasOrderCreds ? ord.deliveredAdminPass : matchedDelivery?.websiteAdminPass) || '—';
          rawCandidates.push({
            id: matchedDelivery?.id || `cred_ord_${ordOrderId.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
            orderId: ordOrderId,
            userPhone: ord.phone,
            userEmail: ord.email || '',
            websiteTitle: ord.companyName || ord.demoTitle || matchedDelivery?.websiteTitle || 'ওয়েবসাইট অ্যাডমিন প্যানেল',
            websiteCode: ord.demoCode,
            websiteAdminId: finalAdminId,
            websiteAdminPass: finalAdminPass,
            notes: matchedDelivery?.notes || 'আপনার ওয়েবসাইট সম্পূর্ণ তৈরি ও রেডি। অ্যাডমিন প্যানেলে লগইন করুন।',
            deliveredAt: matchedDelivery?.deliveredAt || ord.createdAt || new Date().toLocaleString('bn-BD'),
            updatedAt: Math.max(Number(matchedDelivery?.updatedAt) || 0, Date.now())
          });
        }
      }

      for (const c of matchingCreds) {
        const alreadyLinked = rawCandidates.some(cand => {
          const sameOrder = cand.orderId && c.orderId && cand.orderId === c.orderId;
          const sameCode = cand.websiteCode && c.websiteCode && (cand.websiteCode === c.websiteCode || cand.websiteCode.replace('#', '') === c.websiteCode.replace('#', ''));
          return sameOrder || sameCode;
        });
        if (!alreadyLinked) {
          rawCandidates.push(c);
        }
      }

      // Keep strictly latest credentials per website
      rawCandidates.sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0));

      const deduplicated: WebsiteDeliveryCredentials[] = [];
      for (const item of rawCandidates) {
        const itemOrder = String(item.orderId || '').trim();
        const itemCode = String(item.websiteCode || '').trim();

        const exists = deduplicated.some(existing => {
          const exOrder = String(existing.orderId || '').trim();
          const exCode = String(existing.websiteCode || '').trim();
          if (itemOrder && exOrder && itemOrder === exOrder) return true;
          if (itemCode && exCode && (itemCode === exCode || itemCode.replace('#', '') === exCode.replace('#', ''))) return true;
          if (matchingOrders.length <= 1) return true;
          return false;
        });

        if (!exists) {
          deduplicated.push(item);
        }
      }

      setCredentialsList(deduplicated);
    } catch (err) {
      console.error('Error loading credentials in modal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    loadData();

    const handleCredsUpdated = () => {
      loadData();
    };
    window.addEventListener('bongoweb_credentials_updated', handleCredsUpdated);
    const unsub = realtimeManager.on('order:updated', () => {
      loadData();
    });

    return () => {
      window.removeEventListener('bongoweb_credentials_updated', handleCredsUpdated);
      unsub();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (_) {}
  };

  // Find if there are pending or processing orders waiting for delivery
  const pendingOrProcessingOrders = userOrders.filter(
    (o) => o.status === 'pending' || o.status === 'processing' || o.status === 'verified'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center shadow-xs">
              <Key className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0D253D]">
                আপনার Website আইডি ও পাসওয়ার্ড
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                প্রস্তুতকৃত ওয়েবসাইটের অ্যাডমিন অ্যাক্সেস ক্রেডেনশিয়াল
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <div className="w-8 h-8 mx-auto border-3 border-[#2B47EE] border-t-transparent rounded-full animate-spin" />
              <p className="font-bold">তথ্য লোড হচ্ছে...</p>
            </div>
          ) : credentialsList.length > 0 ? (
            /* CASE 1: Credentials Delivered and Ready */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  মোট ডেলিভারিকৃত ওয়েবসাইট: <strong className="text-[#0D253D]">{credentialsList.length} টি</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>লাইভ অ্যাক্সেস প্রস্তুত</span>
                </span>
              </div>

              {credentialsList.map((cred, idx) => (
                <div
                  key={cred.id || idx}
                  className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-50/60 via-white to-emerald-50/40 border-2 border-emerald-500/40 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs">
                        ✓ ওয়েবসাইট #{idx + 1}
                      </span>
                      <h3 className="text-base font-black text-[#0D253D]">
                        {cred.websiteTitle}
                      </h3>
                    </div>
                    {cred.websiteCode && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-bold">
                        {cred.websiteCode}
                      </span>
                    )}
                  </div>

                  {/* ID & Password Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Admin ID */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          অ্যাডমিন ইউজারনেম / আইডি
                        </span>
                        <span className="text-sm font-mono font-black text-[#0D253D] select-all truncate block">
                          {cred.websiteAdminId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(cred.websiteAdminId, `id-${cred.id}`)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-[#EEF2FF] text-[#2B47EE] border border-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        title="আইডি কপি করুন"
                      >
                        {copiedKey === `id-${cred.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>কপি</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Admin Password */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          অ্যাডমিন পাসওয়ার্ড
                        </span>
                        <span className="text-sm font-mono font-black text-[#2B47EE] select-all truncate block">
                          {cred.websiteAdminPass}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(cred.websiteAdminPass, `pass-${cred.id}`)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-[#EEF2FF] text-[#2B47EE] border border-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        title="পাসওয়ার্ড কপি করুন"
                      >
                        {copiedKey === `pass-${cred.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">কপি হয়েছে</span>
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

                  {/* Engineer Notes */}
                  {cred.notes && (
                    <div className="p-3 rounded-2xl bg-white/90 border border-slate-200 text-xs text-slate-600">
                      <strong className="text-[#0D253D] block mb-0.5">ইঞ্জিনিয়ার নির্দেশনা:</strong>
                      <p className="leading-relaxed">{cred.notes}</p>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 text-right font-mono">
                    ডেলিভারির তারিখ: {cred.deliveredAt}
                  </div>
                </div>
              ))}
            </div>
          ) : pendingOrProcessingOrders.length > 0 ? (
            /* CASE 2: Order Placed and In-Progress */
            <div className="py-8 px-4 text-center space-y-4 bg-amber-50/50 rounded-3xl border border-amber-200">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-xs">
                <Clock className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  আপনার অর্ডারটি প্রক্রিয়াধীন রয়েছে
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  আমাদের ইঞ্জিনিয়ার টিম আপনার ওয়েবসাইটটি প্রস্তুত করছেন। কাজ সম্পূর্ণ হওয়ার সাথে সাথেই আপনার ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড সরাসরি এখানে দেখতে পাবেন।
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    অর্ডারের স্ট্যাটাস: অপেক্ষমাণ ও প্রসেসিং
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* CASE 3: No Website & No Order */
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Globe className="w-8 h-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-2">
                <h3 className="text-base sm:text-lg font-black text-[#0D253D]">
                  আপনার কোনো ওয়েবসাইট নেই
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  আপনি এখনও কোনো ওয়েবসাইট ক্রয় বা অর্ডার করেননি। ওয়েবসাইট কেনার পর এখানে আপনার প্রস্তুতকৃত ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড দেখতে পাবেন।
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onGoToDashboard) onGoToDashboard();
                  }}
                  className="px-5 py-3 rounded-2xl bg-[#2B47EE] hover:bg-[#1E3AE5] text-white text-xs sm:text-sm font-black transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Laptop className="w-4 h-4" />
                  <span>ড্যাশবোর্ডে ওয়েবসাইট দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 sm:px-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">BongoWeb Secure Delivery</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all cursor-pointer shadow-2xs"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
