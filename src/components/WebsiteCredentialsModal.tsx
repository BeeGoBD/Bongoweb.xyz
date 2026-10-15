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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#0e0e12] text-[#f5f5f7] rounded-2xl shadow-dark-card border border-white/[0.08] overflow-hidden flex flex-col max-h-[90vh] animate-slideUpModal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#14141a]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] text-[#3b5bff] border border-white/[0.08] flex items-center justify-center shadow-xs">
              <Key className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#f5f5f7]">
                আপনার Website আইডি ও পাসওয়ার্ড
              </h2>
              <p className="text-xs text-[#a1a1b0] font-normal">
                প্রস্তুতকৃত ওয়েবসাইটের অ্যাডমিন অ্যাক্সেস ক্রেডেনশিয়াল
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#a1a1b0] hover:text-[#f5f5f7] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#09090b]">
          {loading ? (
            <div className="py-16 text-center text-xs text-[#a1a1b0] space-y-2">
              <div className="w-8 h-8 mx-auto border-2 border-[#3b5bff] border-t-transparent rounded-full animate-spin" />
              <p className="font-medium">তথ্য লোড হচ্ছে...</p>
            </div>
          ) : credentialsList.length > 0 ? (
            /* CASE 1: Credentials Delivered and Ready */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#a1a1b0]">
                  মোট ডেলিভারিকৃত ওয়েবসাইট: <strong className="text-[#f5f5f7]">{credentialsList.length} টি</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>লাইভ অ্যাক্সেস প্রস্তুত</span>
                </span>
              </div>

              {credentialsList.map((cred, idx) => (
                <div
                  key={cred.id || idx}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] shadow-dark-card space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-medium shadow-xs">
                        ✓ ওয়েবসাইট #{idx + 1}
                      </span>
                      <h3 className="text-base font-semibold text-[#f5f5f7]">
                        {cred.websiteTitle}
                      </h3>
                    </div>
                    {cred.websiteCode && (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] text-[#3b5bff] border border-white/[0.08] font-mono text-xs font-medium">
                        {cred.websiteCode}
                      </span>
                    )}
                  </div>

                  {/* ID & Password Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Admin ID */}
                    <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06] flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-medium text-[#71717a] uppercase tracking-wider block">
                          অ্যাডমিন ইউজারনেম / আইডি
                        </span>
                        <span className="text-sm font-mono font-medium text-[#f5f5f7] select-all truncate block">
                          {cred.websiteAdminId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(cred.websiteAdminId, `id-${cred.id}`)}
                        className="px-2.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#3b5bff] border border-white/[0.08] text-xs font-medium transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        title="আইডি কপি করুন"
                      >
                        {copiedKey === `id-${cred.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">কপি হয়েছে</span>
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
                    <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.06] flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-medium text-[#71717a] uppercase tracking-wider block">
                          অ্যাডমিন পাসওয়ার্ড
                        </span>
                        <span className="text-sm font-mono font-medium text-[#3b5bff] select-all truncate block">
                          {cred.websiteAdminPass}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(cred.websiteAdminPass, `pass-${cred.id}`)}
                        className="px-2.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#3b5bff] border border-white/[0.08] text-xs font-medium transition-all flex items-center gap-1 cursor-pointer shrink-0"
                        title="পাসওয়ার্ড কপি করুন"
                      >
                        {copiedKey === `pass-${cred.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">কপি হয়েছে</span>
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
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-[#a1a1b0]">
                      <strong className="text-[#f5f5f7] block mb-0.5">ইঞ্জিনিয়ার নির্দেশনা:</strong>
                      <p className="leading-relaxed">{cred.notes}</p>
                    </div>
                  )}

                  <div className="text-[11px] text-[#71717a] text-right font-mono">
                    ডেলিভারির তারিখ: {cred.deliveredAt}
                  </div>
                </div>
              ))}
            </div>
          ) : pendingOrProcessingOrders.length > 0 ? (
            /* CASE 2: Order Placed and In-Progress */
            <div className="py-8 px-4 text-center space-y-4 bg-[#0e0e12] rounded-2xl border border-white/[0.08]">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-xs">
                <Clock className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-[#f5f5f7]">
                  আপনার অর্ডারটি প্রক্রিয়াধীন রয়েছে
                </h3>
                <p className="text-xs sm:text-sm text-[#a1a1b0] leading-relaxed">
                  আমাদের ইঞ্জিনিয়ার টিম আপনার ওয়েবসাইটটি প্রস্তুত করছেন। কাজ সম্পূর্ণ হওয়ার সাথে সাথেই আপনার ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড সরাসরি এখানে দেখতে পাবেন।
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/[0.05] text-amber-400 border border-amber-500/20 text-xs font-medium">
                    অর্ডারের স্ট্যাটাস: অপেক্ষমাণ ও প্রসেসিং
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* CASE 3: No Website & No Order */
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.08] text-[#71717a] flex items-center justify-center">
                <Globe className="w-8 h-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-[#f5f5f7]">
                  আপনার কোনো ওয়েবসাইট নেই
                </h3>
                <p className="text-xs sm:text-sm text-[#a1a1b0] leading-relaxed">
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
                  className="px-5 py-2.5 rounded-full bg-[#3b5bff] hover:bg-[#324ecc] text-white text-xs sm:text-sm font-medium transition-all inline-flex items-center gap-2 shadow-md shadow-[#3b5bff]/25 cursor-pointer"
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
        <div className="px-5 py-3.5 sm:px-6 border-t border-white/[0.08] bg-[#14141a]/80 flex items-center justify-between text-xs text-[#71717a]">
          <span className="font-medium">BongoWeb Secure Delivery</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#f5f5f7] font-medium transition-all cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
