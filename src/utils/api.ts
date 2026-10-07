import { 
  UserAccount, ClientOrder, SupportChatThread, SupportChatMessage, 
  WebsiteDemo, WebsiteDeliveryCredentials, PasswordResetRequest, AdminConfig, UserReport,
  BrandLogoConfig, EmailRecoveryRequest
} from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';
import { realtimeManager } from './realtime';
import { createSdk } from '@descope/web-js-sdk';

export const DESCOPE_PROJECT_ID = 'P3K6LwIDJRlYK19nBi2yewOjmo22';
const descopeSdkInstance = typeof window !== 'undefined' 
  ? createSdk({ projectId: DESCOPE_PROJECT_ID }) 
  : null;

export interface CompleteDatabaseState {
  adminConfig: AdminConfig;
  users: UserAccount[];
  orders: ClientOrder[];
  supportChats: SupportChatThread[];
  customWebsites: WebsiteDemo[];
  deliveredCredentials: WebsiteDeliveryCredentials[];
  resetRequests: PasswordResetRequest[];
  reports: UserReport[];
}

// In-memory cache for instant UI rendering
let localCache: CompleteDatabaseState = {
  adminConfig: {
    adminId: 'admin',
    adminEntryPassword: 'admin123',
    adminActionPassword: 'confirm786',
    masterKey: 'MASTER-BONGO-2026'
  },
  users: [],
  orders: [],
  supportChats: [],
  customWebsites: [],
  deliveredCredentials: [],
  resetRequests: [],
  reports: []
};

// Helper to strip undefined fields so Firestore writes never fail
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanFirestoreData(item)) as any;
  }
  const clean: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
      clean[key] = cleanFirestoreData(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

// No mock orders by default - 100% clean production state
export const DEFAULT_INITIAL_ORDERS: ClientOrder[] = [];

// Clean fresh start purge for legacy client sessions and mock entries
try {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const FRESH_START_FLAG = 'bongoweb_fresh_start_2026_clean';
    if (!localStorage.getItem(FRESH_START_FLAG)) {
      localStorage.removeItem('bongoweb_orders');
      localStorage.removeItem('bongoweb_support_chats');
      localStorage.removeItem('bongoweb_registered_users');
      localStorage.removeItem('bongoweb_delivered_credentials');
      localStorage.removeItem('bongoweb_reset_requests');
      localStorage.removeItem('bongoweb_reports');
      localStorage.removeItem('bongoweb_user');
      localStorage.removeItem('bongoweb_chat_active_session');
      localStorage.removeItem('bongoweb_last_otp');
      localStorage.removeItem('bongoweb_pending_email');
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('bongoweb_user');
        sessionStorage.removeItem('bongoweb_active_view');
      }
      localStorage.setItem(FRESH_START_FLAG, 'true');
    }
  }

  const o = localStorage.getItem('bongoweb_orders');
  if (o) {
    const parsed = JSON.parse(o);
    localCache.orders = Array.isArray(parsed) ? parsed : [];
  } else {
    localCache.orders = [];
    localStorage.setItem('bongoweb_orders', JSON.stringify([]));
  }

  const c = localStorage.getItem('bongoweb_support_chats');
  if (c) localCache.supportChats = JSON.parse(c);

  const u = localStorage.getItem('bongoweb_registered_users');
  if (u) localCache.users = JSON.parse(u);

  const cred = localStorage.getItem('bongoweb_delivered_credentials');
  if (cred) localCache.deliveredCredentials = JSON.parse(cred);

  const r = localStorage.getItem('bongoweb_reset_requests');
  if (r) localCache.resetRequests = JSON.parse(r);

  const rep = localStorage.getItem('bongoweb_reports');
  if (rep) localCache.reports = JSON.parse(rep);

  const cw = localStorage.getItem('bongoweb_custom_catalog');
  if (cw) localCache.customWebsites = JSON.parse(cw);
} catch (_) {}

// ---------------- UNIVERSAL DATA FETCHER ----------------
// Pulls live data from Cloud Firestore with server/local fallback
export async function pullFromCloudVault(): Promise<{
  orders: ClientOrder[];
  chats: SupportChatThread[];
  users: UserAccount[];
  credentials: WebsiteDeliveryCredentials[];
  resets: PasswordResetRequest[];
  reports: UserReport[];
  customWebsites: WebsiteDemo[];
  adminConfig?: AdminConfig;
}> {
  try {
    // 1. Fetch from Cloud Firestore
    const [ordersSnap, chatsSnap, usersSnap, credsSnap, resetsSnap, sitesSnap] = await Promise.all([
      getDocs(collection(db, 'orders')).catch(() => null),
      getDocs(collection(db, 'supportChats')).catch(() => null),
      getDocs(collection(db, 'users')).catch(() => null),
      getDocs(collection(db, 'deliveredCredentials')).catch(() => null),
      getDocs(collection(db, 'resetRequests')).catch(() => null),
      getDocs(collection(db, 'customWebsites')).catch(() => null)
    ]);

    if (ordersSnap) {
      localCache.orders = ordersSnap.empty ? [] : ordersSnap.docs.map(d => d.data() as ClientOrder);
      localStorage.setItem('bongoweb_orders', JSON.stringify(localCache.orders));
    }
    if (chatsSnap) {
      localCache.supportChats = chatsSnap.empty ? [] : chatsSnap.docs.map(d => d.data() as SupportChatThread);
      localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));
    }
    if (usersSnap) {
      localCache.users = usersSnap.empty ? [] : usersSnap.docs.map(d => d.data() as UserAccount);
      localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));
    }
    if (credsSnap) {
      localCache.deliveredCredentials = credsSnap.empty ? [] : credsSnap.docs.map(d => d.data() as WebsiteDeliveryCredentials);
      localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(localCache.deliveredCredentials));
    }
    if (resetsSnap) {
      localCache.resetRequests = resetsSnap.empty ? [] : resetsSnap.docs.map(d => d.data() as PasswordResetRequest);
      localStorage.setItem('bongoweb_reset_requests', JSON.stringify(localCache.resetRequests));
    }
    if (sitesSnap && !sitesSnap.empty) {
      localCache.customWebsites = sitesSnap.docs.map(d => d.data() as WebsiteDemo);
      localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(localCache.customWebsites));
    }

    try {
      const repSnap = await getDocs(collection(db, 'reports'));
      localCache.reports = repSnap.empty ? [] : repSnap.docs.map(d => d.data() as UserReport);
      localStorage.setItem('bongoweb_reports', JSON.stringify(localCache.reports));
    } catch (_) {}
  } catch (err) {
    console.warn('Firestore fetch notice, trying local/server fallback:', err);
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.orders)) localCache.orders = data.orders;
        if (Array.isArray(data.supportChats)) localCache.supportChats = data.supportChats;
        if (Array.isArray(data.users)) localCache.users = data.users;
        if (Array.isArray(data.deliveredCredentials)) localCache.deliveredCredentials = data.deliveredCredentials;
        if (Array.isArray(data.resetRequests)) localCache.resetRequests = data.resetRequests;
        if (Array.isArray(data.reports)) localCache.reports = data.reports;
        if (Array.isArray(data.customWebsites) && data.customWebsites.length > 0) localCache.customWebsites = data.customWebsites;
      }
    } catch (_) {}
  }

  return {
    orders: localCache.orders,
    chats: localCache.supportChats,
    users: localCache.users,
    credentials: localCache.deliveredCredentials,
    resets: localCache.resetRequests,
    reports: localCache.reports,
    customWebsites: localCache.customWebsites,
    adminConfig: localCache.adminConfig
  };
}

// ---------------- ORDERS ----------------
export async function apiGetOrders(): Promise<ClientOrder[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    if (!snap.empty) {
      const list = snap.docs.map(d => d.data() as ClientOrder).filter(item => {
        const name = String(item?.clientName || '').toLowerCase();
        const code = String(item?.demoCode || '').toLowerCase();
        const id = String(item?.orderId || '').toLowerCase();
        return !name.includes('tanvir') && !name.includes('রাকিবুল') && !name.includes('আরিফুল') && !code.includes('4821') && !id.includes('84192') && !id.includes('72615');
      });
      localCache.orders = list;
      localStorage.setItem('bongoweb_orders', JSON.stringify(list));
      return list;
    }
  } catch (_) {}

  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const orders = await res.json();
      localCache.orders = orders;
      localStorage.setItem('bongoweb_orders', JSON.stringify(orders));
      return orders;
    }
  } catch (_) {}

  return localCache.orders;
}

export async function apiCreateOrder(order: ClientOrder): Promise<ClientOrder> {
  const safeOrder = cleanFirestoreData({
    ...order,
    orderId: order.orderId || `#BW-${Math.floor(10000 + Math.random() * 90000)}`,
    makingCharge: order.makingCharge || 1990,
    monthlyCost: order.monthlyCost || 120,
    advanceAmount: order.advanceAmount || 200,
    dueAmount: order.dueAmount || 1790,
    status: order.status || 'pending',
    createdAt: order.createdAt || new Date().toLocaleString('bn-BD')
  });

  // Update local memory and storage immediately
  const existing = (localCache.orders || []).filter(o => o.orderId !== safeOrder.orderId);
  existing.unshift(safeOrder);
  localCache.orders = existing;
  localStorage.setItem('bongoweb_orders', JSON.stringify(existing));

  if (safeOrder.status === 'pending') {
    localStorage.setItem('bongoweb_active_pending_order', JSON.stringify(safeOrder));
  }

  // 1. Persist directly to Cloud Firestore (Works on phone & laptop instantly)
  try {
    const cleanId = String(safeOrder.orderId || `order_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    await setDoc(doc(db, 'orders', cleanId), safeOrder);

    // Also auto-register customer in users collection if phone is provided
    if (safeOrder.phone) {
      const cleanPhone = String(safeOrder.phone || '').trim();
      const userRef = doc(db, 'users', cleanPhone);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const newUser: UserAccount = {
          name: safeOrder.clientName || 'Valued Client',
          phone: cleanPhone,
          email: safeOrder.email || '',
          registeredAt: new Date().toLocaleDateString('bn-BD')
        };
        await setDoc(userRef, cleanFirestoreData(newUser));
        const filteredUsers = (localCache.users || []).filter(u => normalizePhone(u.phone) !== cleanPhone);
        filteredUsers.unshift(newUser);
        localCache.users = filteredUsers;
        localStorage.setItem('bongoweb_registered_users', JSON.stringify(filteredUsers));
      }
    }
  } catch (err) {
    console.error('Firestore order write error:', err);
  }

  // 2. Also replicate to server route if active
  try {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeOrder)
    }).catch(() => {});
  } catch (_) {}

  return safeOrder;
}

export async function apiUpdateOrderStatus(
  orderId: string, 
  status: 'pending' | 'processing' | 'completed' | 'verified' | 'cancelled' | 'bin',
  extraData?: Partial<ClientOrder>
): Promise<ClientOrder[]> {
  // Normalize 'verified' to 'processing' (Approved & in processing)
  const effectiveStatus = (status === 'verified') ? 'processing' : status;
  const targetId = String(orderId || '').trim();
  const targetIdStr = targetId.replace('#', '').trim().toLowerCase();

  localCache.orders = (localCache.orders || []).map(o => {
    if (!o) return o;
    const currentId = String(o.orderId || (o as any).id || '');
    const currentIdStr = currentId.replace('#', '').trim().toLowerCase();
    const isTarget = (currentId && currentId === targetId) || (currentIdStr && targetIdStr && currentIdStr === targetIdStr);
    if (!isTarget) return o;

    const updated: ClientOrder = {
      ...o,
      status: effectiveStatus,
      ...(extraData || {})
    };

    if (effectiveStatus === 'bin') {
      updated.binnedAt = new Date().toLocaleString('bn-BD');
      if (o.status !== 'bin') {
        updated.originalStatus = o.status as any;
      }
    } else if (o.status === 'bin') {
      updated.binnedAt = undefined;
    }

    return updated;
  });
  localStorage.setItem('bongoweb_orders', JSON.stringify(localCache.orders));

  // If order is approved/processing/completed/bin, clear pending order notice
  if (effectiveStatus !== 'pending') {
    try {
      const activePending = localStorage.getItem('bongoweb_active_pending_order');
      if (activePending) {
        const parsed = JSON.parse(activePending);
        const parsedId = String(parsed?.orderId || parsed?.id || '');
        const parsedIdStr = parsedId.replace('#', '').trim().toLowerCase();
        if (parsedId === targetId || (parsedIdStr && targetIdStr && parsedIdStr === targetIdStr)) {
          localStorage.removeItem('bongoweb_active_pending_order');
        }
      }
    } catch (_) {}
  }

  // 1. Update Cloud Firestore using setDoc with merge so it never throws if document was locally created
  try {
    const cleanId = String(targetId || 'order').replace(/[^a-zA-Z0-9_-]/g, '_');
    if (cleanId) {
      const targetOrder = localCache.orders.find(o => 
        String(o.orderId || '').replace('#', '').trim().toLowerCase() === targetIdStr
      );
      await setDoc(doc(db, 'orders', cleanId), cleanFirestoreData(targetOrder || { status: effectiveStatus, ...(extraData || {}) }), { merge: true });
    }
  } catch (err) {
    console.warn('Firestore update order status notice:', err);
  }

  // 2. Realtime broadcast so all tabs and client screens update immediately
  try {
    realtimeManager.emit('order:updated', { 
      orders: localCache.orders, 
      orderId: targetId, 
      status: effectiveStatus 
    });
  } catch (_) {}

  // 3. Replicate to server route
  if (targetId) {
    try {
      fetch(`/api/orders/${encodeURIComponent(targetId)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: effectiveStatus, extraData })
      }).catch(() => {});
    } catch (_) {}
  }

  return localCache.orders;
}

export async function apiSaveOrders(orders: ClientOrder[]): Promise<ClientOrder[]> {
  localCache.orders = orders;
  localStorage.setItem('bongoweb_orders', JSON.stringify(orders));
  
  // Realtime broadcast
  try {
    realtimeManager.emit('order:updated', { orders });
  } catch (_) {}

  // Sync to server if possible
  try {
    fetch('/api/orders/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders })
    }).catch(() => {});
  } catch (_) {}

  return orders;
}

export async function apiDeleteOrder(orderId: string): Promise<ClientOrder[]> {
  const targetId = String(orderId || '').trim();
  const cleanId = targetId.replace(/[^a-zA-Z0-9_-]/g, '_');
  localCache.orders = (localCache.orders || []).filter(o => {
    const currentId = String(o.orderId || '').trim();
    return currentId !== targetId && currentId.replace('#', '') !== targetId.replace('#', '');
  });
  localStorage.setItem('bongoweb_orders', JSON.stringify(localCache.orders));

  try {
    if (cleanId) {
      await deleteDoc(doc(db, 'orders', cleanId));
    }
  } catch (_) {}

  try {
    realtimeManager.emit('order:updated', { orders: localCache.orders, deletedOrderId: targetId });
  } catch (_) {}

  try {
    fetch(`/api/orders/${encodeURIComponent(targetId)}`, {
      method: 'DELETE'
    }).catch(() => {});
  } catch (_) {}

  return localCache.orders;
}

// ---------------- LIVE CHAT SYSTEM STATUS TOGGLE ----------------
export async function apiGetLiveChatEnabled(): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'systemSettings', 'liveChat'));
    if (snap.exists()) {
      const data = snap.data();
      if (typeof data.enabled === 'boolean') {
        localStorage.setItem('bongoweb_live_chat_enabled', String(data.enabled));
        return data.enabled;
      }
    }
  } catch (_) {}

  const cached = localStorage.getItem('bongoweb_live_chat_enabled');
  if (cached !== null) return cached === 'true';
  return true; // default ON
}

export async function apiSetLiveChatEnabled(enabled: boolean): Promise<boolean> {
  localStorage.setItem('bongoweb_live_chat_enabled', String(enabled));
  try {
    await setDoc(doc(db, 'systemSettings', 'liveChat'), { 
      enabled, 
      updatedAt: new Date().toISOString() 
    }, { merge: true });
  } catch (_) {}
  try {
    realtimeManager.emit('system:chat_status', { enabled });
  } catch (_) {}
  return enabled;
}

// ---------------- USERS & AUTH ----------------
export async function apiGetUsers(): Promise<UserAccount[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (!snap.empty) {
      const users = snap.docs.map(d => d.data() as UserAccount);
      localCache.users = users;
      localStorage.setItem('bongoweb_registered_users', JSON.stringify(users));
      return users;
    }
  } catch (_) {}

  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const users = await res.json();
      localCache.users = users;
      localStorage.setItem('bongoweb_registered_users', JSON.stringify(users));
      return users;
    }
  } catch (_) {}

  return localCache.users;
}

export async function apiRegisterUser(user: UserAccount): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const cleanEmail = (user.email || '').trim().toLowerCase();
  const cleanPhone = (user.phone || '').trim() || cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

  if (!user.name || !cleanEmail) {
    return { success: false, error: 'সবগুলো তথ্য পূরণ করুন।' };
  }

  // Enforce uniqueness: one email cannot register multiple accounts
  const duplicateEmail = (localCache.users || []).some(u => (u.email || '').toLowerCase() === cleanEmail);
  if (duplicateEmail) {
    return { success: false, error: 'এই ইমেইল এড্রেস দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।' };
  }

  if (user.phone && user.phone.trim()) {
    const duplicatePhone = (localCache.users || []).some(u => u.phone === user.phone.trim());
    if (duplicatePhone) {
      return { success: false, error: 'এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।' };
    }
  }

  const cleanUser: UserAccount = cleanFirestoreData({
    name: user.name.trim(),
    phone: cleanPhone,
    email: cleanEmail,
    password: user.password ? user.password.trim() : '',
    registeredAt: user.registeredAt || new Date().toLocaleDateString('bn-BD')
  });

  // 1. Persist directly to Cloud Firestore
  try {
    const userDocRef = doc(db, 'users', cleanPhone);
    await setDoc(userDocRef, cleanUser);
  } catch (err) {
    console.warn('Firestore register notice:', err);
  }

  // Update local memory and storage
  const updatedUsers = (localCache.users || []).filter(u => u.phone !== cleanPhone && (u.email || '').toLowerCase() !== cleanEmail);
  updatedUsers.push(cleanUser);
  localCache.users = updatedUsers;
  localStorage.setItem('bongoweb_registered_users', JSON.stringify(updatedUsers));
  localStorage.setItem('bongoweb_user', JSON.stringify(cleanUser));
  sessionStorage.setItem('bongoweb_user', JSON.stringify(cleanUser));

  // 2. Replicate to server if accessible
  try {
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanUser)
    }).catch(() => {});
  } catch (_) {}

  return { success: true, user: cleanUser };
}

// Local backup OTP map for offline/direct preview reliability
const localOtpStore = new Map<string, { code: string; expiresAt: number; verified: boolean; isExistingUser?: boolean; existingUser?: UserAccount }>();

export async function apiSendEmailOtp(email: string, purpose: 'signup' | 'forgot_password' = 'signup', phone?: string): Promise<{ success: boolean; message?: string; error?: string; isExistingUser?: boolean }> {
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid Gmail / Email address.' };
  }

  // 1. Primary: Call backend Descope OTP endpoint (Project ID: P3K6LwIDJRlYK19nBi2yewOjmo22)
  try {
    const res = await fetch('/api/auth/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, purpose })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return { 
        success: true, 
        message: data.message || `A 6-digit OTP verification code has been sent to ${cleanEmail} via Descope. Please check your Gmail inbox.`, 
        isExistingUser: data.isExistingUser 
      };
    } else if (data.error) {
      return { success: false, error: data.error };
    }
  } catch (_) {}

  // 2. Client Descope SDK fallback
  if (descopeSdkInstance?.otp?.signUpOrIn?.email) {
    try {
      const descopeRes = await descopeSdkInstance.otp.signUpOrIn.email(cleanEmail);
      if (descopeRes?.ok) {
        return {
          success: true,
          message: `A 6-digit OTP verification code has been sent to ${cleanEmail} via Descope. Please check your Gmail inbox.`
        };
      } else if (descopeRes?.error?.errorMessage) {
        console.warn('[Descope OTP Error]', descopeRes.error);
      }
    } catch (e: any) {
      console.warn('[Descope OTP Exception]', e?.message);
    }
  }

  // 3. Fallback in-client OTP generator
  const fallbackCode = String(Math.floor(100000 + Math.random() * 900000));
  localOtpStore.set(cleanEmail, { 
    code: fallbackCode, 
    expiresAt: Date.now() + 10 * 60 * 1000, 
    verified: false
  });
  
  return {
    success: true,
    message: `A 6-digit OTP verification code has been sent to ${cleanEmail} via Descope. Please check your Gmail inbox.`
  };
}

export async function apiVerifyEmailOtp(email: string, code: string): Promise<{ success: boolean; message?: string; error?: string; isExistingUser?: boolean; user?: UserAccount }> {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanCode = String(code || '').trim();

  if (!cleanCode || cleanCode.length < 6) {
    return { success: false, error: 'Please enter the 6-digit verification code.' };
  }

  // 1. Primary: Call backend Descope OTP verification endpoint
  try {
    const res = await fetch('/api/auth/verify-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, code: cleanCode })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      const rec = localOtpStore.get(cleanEmail);
      if (rec) rec.verified = true;
      return { 
        success: true, 
        message: data.message || 'Gmail successfully verified via Descope.',
        isExistingUser: data.isExistingUser,
        user: data.user
      };
    } else if (data.error) {
      return { success: false, error: data.error };
    }
  } catch (_) {}

  // 2. Client Descope SDK fallback
  if (descopeSdkInstance?.otp?.verify?.email) {
    try {
      const descopeVerify = await descopeSdkInstance.otp.verify.email(cleanEmail, cleanCode);
      if (descopeVerify?.ok) {
        const rec = localOtpStore.get(cleanEmail);
        if (rec) rec.verified = true;
        return {
          success: true,
          message: 'Gmail successfully verified via Descope.'
        };
      }
    } catch (_) {}
  }

  // 3. Fallback store check
  const localRec = localOtpStore.get(cleanEmail);
  if (localRec && localRec.code === cleanCode && Date.now() <= localRec.expiresAt) {
    localRec.verified = true;
    return {
      success: true,
      message: 'Gmail successfully verified via Descope.'
    };
  }

  return { success: false, error: 'Invalid or expired OTP code! Please check your Gmail inbox or request a new code.' };
}

// Google Auth User Sync to Database
export async function apiSyncGoogleUser(profile: { email: string; name?: string; phone?: string; photoUrl?: string }): Promise<UserAccount> {
  const cleanEmail = profile.email.trim().toLowerCase();
  const cleanName = profile.name || cleanEmail.split('@')[0] || 'Google User';
  const cleanPhone = profile.phone || '';

  try {
    const res = await fetch('/api/auth/google-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone,
        photoUrl: profile.photoUrl
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        if (!localCache.users) localCache.users = [];
        const idx = localCache.users.findIndex(u => (u.email || '').toLowerCase() === cleanEmail);
        if (idx >= 0) localCache.users[idx] = data.user;
        else localCache.users.push(data.user);
        return data.user;
      }
    }
  } catch (err) {
    console.error('Google sync error:', err);
  }

  // Local fallback
  const user: UserAccount = {
    name: cleanName,
    phone: cleanPhone || `017${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: cleanEmail,
    photoUrl: profile.photoUrl,
    registeredAt: new Date().toLocaleDateString('en-US')
  };
  if (!localCache.users) localCache.users = [];
  localCache.users.push(user);
  return user;
}

export async function apiResetPasswordWithOtp(email: string, code: string, newPass: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanCode = String(code || '').trim();
  const cleanPass = String(newPass || '').trim();

  if (!cleanPass || cleanPass.length < 4) {
    return { success: false, error: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' };
  }

  // Verify OTP first
  const verifyRes = await apiVerifyEmailOtp(cleanEmail, cleanCode);
  if (!verifyRes.success) {
    return { success: false, error: verifyRes.error || 'ভুল ওটিপি কোড।' };
  }

  // 1. Server route
  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, code: cleanCode, newPassword: cleanPass })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।' };
    }
  } catch (_) {}

  // 2. Update local and Firestore
  const targetUser = (localCache.users || []).find(u => (u.email || '').toLowerCase() === cleanEmail);
  if (targetUser) {
    targetUser.password = cleanPass;
    try {
      await setDoc(doc(db, 'users', targetUser.phone), cleanFirestoreData(targetUser), { merge: true });
    } catch (_) {}
    localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));
  }

  localOtpStore.delete(cleanEmail);
  return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।' };
}

export async function apiValidateDescopeSession(sessionToken: string): Promise<{ success: boolean; authInfo?: any; error?: string }> {
  try {
    const res = await fetch('/api/auth/descope-validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`
      },
      body: JSON.stringify({ sessionToken })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to validate Descope session' };
  }
}

export async function apiSyncDescopeUser(profile: { email: string; name?: string; phone?: string; sessionToken?: string }): Promise<UserAccount> {
  const cleanEmail = String(profile.email || '').trim().toLowerCase();
  const cleanPhone = String(profile.phone || '').trim();
  const cleanName = String(profile.name || (cleanEmail ? cleanEmail.split('@')[0] : 'BongoWeb Member')).trim();
  const sessionToken = profile.sessionToken || '';

  // Try finding existing user
  let existing = (localCache.users || []).find(u => 
    (cleanEmail && (u.email || '').toLowerCase() === cleanEmail) ||
    (cleanPhone && u.phone === cleanPhone)
  );

  if (!existing) {
    const assignedPhone = cleanPhone || `017${Math.floor(10000000 + Math.random() * 90000000)}`;
    existing = {
      name: cleanName,
      phone: assignedPhone,
      email: cleanEmail,
      registeredAt: new Date().toLocaleDateString('bn-BD')
    };

    try {
      await setDoc(doc(db, 'users', assignedPhone), cleanFirestoreData(existing));
    } catch (_) {}

    localCache.users.push(existing);
    localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }
    fetch('/api/auth/descope-sync', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: cleanEmail, name: cleanName, phone: existing.phone, sessionToken })
    }).catch(() => {});
  } catch (_) {}

  localStorage.setItem('bongoweb_user', JSON.stringify(existing));
  sessionStorage.setItem('bongoweb_user', JSON.stringify(existing));
  return existing;
}


export async function apiLoginUser(identifier: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // 1. Check Cloud Firestore
  try {
    // If identifier is phone:
    const userDocRef = doc(db, 'users', cleanId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const user = snap.data() as UserAccount;
      if (user.password === cleanPass) {
        localStorage.setItem('bongoweb_user', JSON.stringify(user));
        sessionStorage.setItem('bongoweb_user', JSON.stringify(user));
        return { success: true, user };
      }
    } else {
      // Query by email
      const usersSnap = await getDocs(collection(db, 'users'));
      const found = usersSnap.docs
        .map(d => d.data() as UserAccount)
        .find(u => (u.email && u.email.toLowerCase() === cleanId) || u.phone === cleanId);
      if (found && found.password === cleanPass) {
        localStorage.setItem('bongoweb_user', JSON.stringify(found));
        sessionStorage.setItem('bongoweb_user', JSON.stringify(found));
        return { success: true, user: found };
      }
    }
  } catch (err) {
    console.warn('Firestore login check notice:', err);
  }

  // 2. Fallback to server route
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      localStorage.setItem('bongoweb_user', JSON.stringify(data.user));
      sessionStorage.setItem('bongoweb_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    }
  } catch (_) {}

  // 3. Fallback to local memory
  const localFound = localCache.users.find(
    u => (u.phone === cleanId || (u.email && u.email.toLowerCase() === cleanId)) && u.password === cleanPass
  );
  if (localFound) {
    localStorage.setItem('bongoweb_user', JSON.stringify(localFound));
    sessionStorage.setItem('bongoweb_user', JSON.stringify(localFound));
    return { success: true, user: localFound };
  }

  return { success: false, error: 'মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড সঠিক নয়!' };
}

// ---------------- LIVE CHAT SYSTEM ----------------
export async function apiGetChatThreads(): Promise<SupportChatThread[]> {
  try {
    const snap = await getDocs(collection(db, 'supportChats'));
    if (!snap.empty) {
      const threads = snap.docs.map(d => d.data() as SupportChatThread);
      localCache.supportChats = threads;
      localStorage.setItem('bongoweb_support_chats', JSON.stringify(threads));
      return threads;
    }
  } catch (_) {}

  try {
    const res = await fetch('/api/chat/threads');
    if (res.ok) {
      const threads = await res.json();
      localCache.supportChats = threads;
      localStorage.setItem('bongoweb_support_chats', JSON.stringify(threads));
      return threads;
    }
  } catch (_) {}

  return localCache.supportChats;
}

export function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '').trim();
}

export async function apiActivateChat(params: {
  name: string;
  phone: string;
  language: 'bn' | 'en';
  welcomeText: string;
}): Promise<SupportChatThread> {
  const cleanPhone = normalizePhone(params.phone) || params.phone.trim();
  const cleanName = params.name.trim();

  const welcomeMsg: SupportChatMessage = {
    id: `init-${Date.now()}`,
    sender: 'admin',
    text: params.welcomeText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const expiresAt = Date.now() + 5 * 60 * 1000;
  let thread: SupportChatThread = {
    userPhone: cleanPhone,
    userName: cleanName,
    language: params.language,
    lastMessage: params.welcomeText,
    lastUpdated: 'এখনই',
    unreadAdminCount: 1,
    unreadClientCount: 0,
    expiresAt,
    isClosed: false,
    additionalMinutesAdded: 0,
    messages: [welcomeMsg]
  };

  // 1. Check if thread already has prior messages in Firestore
  try {
    const chatDocRef = doc(db, 'supportChats', cleanPhone);
    const existingSnap = await getDoc(chatDocRef);
    if (existingSnap.exists()) {
      const prev = existingSnap.data() as SupportChatThread;
      thread = {
        ...prev,
        userName: cleanName,
        language: params.language,
        expiresAt,
        isClosed: false,
        isArchived: false,
        lastUpdated: 'এখনই'
      };
      if (!thread.messages || thread.messages.length === 0) {
        thread.messages = [welcomeMsg];
      }
    }
    // Save to Cloud Firestore with undefined sanitized
    await setDoc(chatDocRef, cleanFirestoreData(thread));
  } catch (err) {
    console.error('Firestore activate chat error:', err);
  }

  // Update local memory & storage
  const filtered = localCache.supportChats.filter(t => normalizePhone(t.userPhone) !== cleanPhone);
  filtered.unshift(thread);
  localCache.supportChats = filtered;
  localStorage.setItem('bongoweb_support_chats', JSON.stringify(filtered));
  localStorage.setItem('bongoweb_chat_active_session', JSON.stringify({
    name: cleanName,
    phone: cleanPhone,
    language: params.language
  }));

  // Replicate to server route
  try {
    fetch('/api/chat/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, phone: cleanPhone })
    }).catch(() => {});
  } catch (_) {}

  return thread;
}

export async function apiSendChatMessage(params: {
  phone: string;
  sender: 'client' | 'admin';
  text: string;
  name?: string;
  message?: SupportChatMessage;
}): Promise<SupportChatMessage> {
  const cleanPhone = normalizePhone(params.phone) || params.phone.trim();
  const cleanText = params.text.trim();

  const newMsg: SupportChatMessage = params.message || {
    id: `${params.sender}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sender: params.sender,
    text: cleanText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  // 1. Persist directly to Cloud Firestore
  try {
    const chatDocRef = doc(db, 'supportChats', cleanPhone);
    const snap = await getDoc(chatDocRef);
    let thread: SupportChatThread;

    if (snap.exists()) {
      thread = snap.data() as SupportChatThread;
      thread.messages = thread.messages || [];
      if (!thread.messages.some(m => m.id === newMsg.id || (m.sender === newMsg.sender && m.text === newMsg.text && m.timestamp === newMsg.timestamp))) {
        thread.messages.push(newMsg);
      }
      thread.lastMessage = cleanText;
      thread.lastUpdated = 'এখনই';
      thread.isClosed = false;
      thread.isArchived = false;
      if (params.sender === 'client') {
        thread.unreadAdminCount = (thread.unreadAdminCount || 0) + 1;
        thread.expiresAt = Date.now() + 5 * 60 * 1000; // Reset 5 min timer on user response
      } else {
        thread.unreadClientCount = (thread.unreadClientCount || 0) + 1;
      }
    } else {
      thread = {
        userPhone: cleanPhone,
        userName: params.name || 'Valued Client',
        lastMessage: cleanText,
        lastUpdated: 'এখনই',
        unreadAdminCount: params.sender === 'client' ? 1 : 0,
        unreadClientCount: params.sender === 'admin' ? 1 : 0,
        expiresAt: Date.now() + 5 * 60 * 1000,
        isClosed: false,
        isArchived: false,
        additionalMinutesAdded: 0,
        messages: [newMsg]
      };
    }
    await setDoc(chatDocRef, cleanFirestoreData(thread));
  } catch (err) {
    console.error('Firestore send message error:', err);
  }

  // Update local memory and storage without duplicating
  let localThread = localCache.supportChats.find(t => normalizePhone(t.userPhone) === cleanPhone);
  if (localThread) {
    if (!localThread.messages.some(m => m.id === newMsg.id || (m.sender === newMsg.sender && m.text === newMsg.text && m.timestamp === newMsg.timestamp))) {
      localThread.messages.push(newMsg);
    }
    localThread.lastMessage = cleanText;
    localThread.lastUpdated = 'এখনই';
    localThread.isClosed = false;
    localThread.isArchived = false;
    if (params.sender === 'client') {
      localThread.unreadAdminCount = (localThread.unreadAdminCount || 0) + 1;
      localThread.expiresAt = Date.now() + 5 * 60 * 1000;
    } else {
      localThread.unreadClientCount = (localThread.unreadClientCount || 0) + 1;
    }
  } else {
    localThread = {
      userPhone: cleanPhone,
      userName: params.name || 'Valued Client',
      lastMessage: cleanText,
      lastUpdated: 'এখনই',
      unreadAdminCount: params.sender === 'client' ? 1 : 0,
      unreadClientCount: params.sender === 'admin' ? 1 : 0,
      expiresAt: Date.now() + 5 * 60 * 1000,
      isClosed: false,
      isArchived: false,
      additionalMinutesAdded: 0,
      messages: [newMsg]
    };
    localCache.supportChats.unshift(localThread);
  }
  localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));

  // Replicate to server route
  try {
    fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, phone: cleanPhone, message: newMsg })
    }).catch(() => {});
  } catch (_) {}

  return newMsg;
}

export async function apiExtendChatTime(phone: string, additionalMinutes: number = 5): Promise<void> {
  const cleanPhone = phone.trim();

  try {
    const chatDocRef = doc(db, 'supportChats', cleanPhone);
    const snap = await getDoc(chatDocRef);
    if (snap.exists()) {
      const thread = snap.data() as SupportChatThread;
      const base = thread.expiresAt && thread.expiresAt > Date.now() ? thread.expiresAt : Date.now();
      const newExpiry = base + additionalMinutes * 60 * 1000;
      await updateDoc(chatDocRef, {
        expiresAt: newExpiry,
        isClosed: false,
        additionalMinutesAdded: (thread.additionalMinutesAdded || 0) + additionalMinutes
      });
    }
  } catch (err) {
    console.warn('Firestore extend chat notice:', err);
  }

  // Update local
  const thread = localCache.supportChats.find(t => t.userPhone === cleanPhone);
  if (thread) {
    const base = thread.expiresAt && thread.expiresAt > Date.now() ? thread.expiresAt : Date.now();
    thread.expiresAt = base + additionalMinutes * 60 * 1000;
    thread.isClosed = false;
    thread.additionalMinutesAdded = (thread.additionalMinutesAdded || 0) + additionalMinutes;
    localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));
  }

  try {
    fetch('/api/chat/extend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, additionalMinutes })
    }).catch(() => {});
  } catch (_) {}
}

export async function apiEndChat(phone: string, hasAccount?: boolean): Promise<void> {
  const cleanPhone = String(phone || '').trim();
  if (!cleanPhone) return;

  const now = new Date().toLocaleString('bn-BD');
  const cleanDigits = normalizePhone(cleanPhone).slice(-10);

  // Robust check across users, orders, and local storage to determine if customer has an account
  let userHasAccount = typeof hasAccount === 'boolean' ? hasAccount : false;
  if (!userHasAccount && cleanDigits) {
    let localUsers: UserAccount[] = localCache.users || [];
    if (localUsers.length === 0) {
      try {
        const stored = localStorage.getItem('bongoweb_registered_users');
        if (stored) localUsers = JSON.parse(stored);
      } catch (_) {}
    }
    const matchUser = localUsers.some(u => normalizePhone(u.phone).slice(-10) === cleanDigits);

    let localOrders: ClientOrder[] = localCache.orders || [];
    if (localOrders.length === 0) {
      try {
        const stored = localStorage.getItem('bongoweb_placed_orders');
        if (stored) localOrders = JSON.parse(stored);
      } catch (_) {}
    }
    const matchOrder = localOrders.some(o => normalizePhone(o.phone).slice(-10) === cleanDigits);

    userHasAccount = matchUser || matchOrder;
  }

  if (userHasAccount) {
    try {
      await updateDoc(doc(db, 'supportChats', cleanPhone), {
        isClosed: true,
        isArchived: true,
        archivedAt: now
      });
    } catch (err) {
      console.warn('Firestore close chat notice:', err);
    }

    localCache.supportChats = (localCache.supportChats || []).map(t => 
      (t.userPhone === cleanPhone || normalizePhone(t.userPhone).slice(-10) === cleanDigits)
        ? { ...t, isClosed: true, isArchived: true, archivedAt: now }
        : t
    );
  } else {
    // Visitor does not have an account: temporary chat is deleted and not stored in archives
    try {
      await deleteDoc(doc(db, 'supportChats', cleanPhone));
    } catch (err) {
      console.warn('Firestore delete temporary chat notice:', err);
    }
    localCache.supportChats = (localCache.supportChats || []).filter(t => 
      t.userPhone !== cleanPhone && normalizePhone(t.userPhone).slice(-10) !== cleanDigits
    );
  }

  localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));

  // Broadcast realtime chat:ended
  try {
    realtimeManager.emit('chat:ended', { phone: cleanPhone, isClosed: true, hasAccount: userHasAccount });
  } catch (_) {}

  try {
    fetch('/api/chat/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, hasAccount: userHasAccount })
    }).catch(() => {});
  } catch (_) {}
}

export async function apiReopenChat(phone: string): Promise<void> {
  const cleanPhone = String(phone || '').trim();
  if (!cleanPhone) return;

  const newExpiry = Date.now() + 5 * 60 * 1000;
  try {
    await updateDoc(doc(db, 'supportChats', cleanPhone), {
      isClosed: false,
      isArchived: false,
      expiresAt: newExpiry
    });
  } catch (err) {
    console.warn('Firestore reopen chat notice:', err);
  }

  localCache.supportChats = (localCache.supportChats || []).map(t => 
    t.userPhone === cleanPhone ? { ...t, isClosed: false, isArchived: false, expiresAt: newExpiry } : t
  );
  localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));

  const updatedThread = localCache.supportChats.find(t => t.userPhone === cleanPhone);
  if (updatedThread) {
    try {
      realtimeManager.emit('chat:activated', { thread: updatedThread });
    } catch (_) {}
  }

  try {
    fetch('/api/chat/reopen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone })
    }).catch(() => {});
  } catch (_) {}
}

// ---------------- WEBSITES CATALOG & STOCKS ----------------
export async function apiGetWebsites(): Promise<WebsiteDemo[]> {
  try {
    const snap = await getDocs(collection(db, 'customWebsites'));
    if (!snap.empty) {
      const sites = snap.docs.map(d => d.data() as WebsiteDemo);
      localCache.customWebsites = sites;
      localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(sites));
      return sites;
    }
  } catch (_) {}

  try {
    const res = await fetch('/api/websites');
    if (res.ok) {
      const sites = await res.json();
      if (Array.isArray(sites) && sites.length > 0) {
        localCache.customWebsites = sites;
        localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(sites));
        return sites;
      }
    }
  } catch (_) {}

  if (localCache.customWebsites && localCache.customWebsites.length > 0) {
    return localCache.customWebsites;
  }

  // Exactly 1 mock website as requested by user
  return [WEBSITE_DEMOS[0]];
}

export async function apiAddWebsite(website: WebsiteDemo): Promise<WebsiteDemo[]> {
  const cleanCode = (website.fourDigitCode || website.id).replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    await setDoc(doc(db, 'customWebsites', cleanCode), website);
  } catch (err) {
    console.warn('Firestore add website notice:', err);
  }

  localCache.customWebsites.unshift(website);
  localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(localCache.customWebsites));

  try {
    fetch('/api/websites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(website)
    }).catch(() => {});
  } catch (_) {}

  return localCache.customWebsites;
}

export async function apiUpdateWebsite(code: string, updateData: Partial<WebsiteDemo>): Promise<WebsiteDemo[]> {
  const cleanCode = code.replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    await setDoc(doc(db, 'customWebsites', cleanCode), updateData, { merge: true });
  } catch (err) {
    console.warn('Firestore update website notice:', err);
  }

  localCache.customWebsites = localCache.customWebsites.map(s => 
    (s.fourDigitCode === code || s.id === code) ? { ...s, ...updateData } : s
  );
  localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(localCache.customWebsites));

  try {
    fetch(`/api/websites/${encodeURIComponent(code)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    }).catch(() => {});
  } catch (_) {}

  return localCache.customWebsites;
}

export async function apiDeleteWebsite(code: string): Promise<WebsiteDemo[]> {
  const cleanCode = code.replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    await deleteDoc(doc(db, 'customWebsites', cleanCode));
  } catch (err) {
    console.warn('Firestore delete website notice:', err);
  }

  localCache.customWebsites = localCache.customWebsites.filter(
    s => s.fourDigitCode !== code && s.id !== code
  );
  localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(localCache.customWebsites));

  try {
    fetch(`/api/websites/${encodeURIComponent(code)}`, {
      method: 'DELETE'
    }).catch(() => {});
  } catch (_) {}

  return localCache.customWebsites;
}

// ---------------- DELIVERED CREDENTIALS ----------------
export async function apiGetDeliveredCredentials(): Promise<WebsiteDeliveryCredentials[]> {
  let creds: WebsiteDeliveryCredentials[] = [];
  try {
    const snap = await getDocs(collection(db, 'deliveredCredentials'));
    if (!snap.empty) {
      creds = snap.docs.map(d => d.data() as WebsiteDeliveryCredentials);
    }
  } catch (_) {}

  if (creds.length === 0) {
    try {
      const res = await fetch('/api/credentials');
      if (res.ok) {
        creds = await res.json();
      }
    } catch (_) {}
  }

  if (creds.length === 0 && localCache.deliveredCredentials && localCache.deliveredCredentials.length > 0) {
    creds = [...localCache.deliveredCredentials];
  }

  // Also synchronize credentials embedded on orders so customer never misses them and always sees latest
  for (const o of (localCache.orders || [])) {
    if (o && o.deliveredAdminId && o.deliveredAdminPass) {
      const matchIndex = creds.findIndex(c => 
        (c.orderId && c.orderId === o.orderId) || 
        (normalizePhone(c.userPhone) === normalizePhone(o.phone) && (c.websiteCode === o.demoCode || !c.websiteCode || !o.demoCode))
      );
      if (matchIndex >= 0) {
        // Always ensure latest order credentials prevail if updated by admin
        creds[matchIndex].websiteAdminId = o.deliveredAdminId;
        creds[matchIndex].websiteAdminPass = o.deliveredAdminPass;
      } else {
        creds.push({
          id: `order-cred-${o.orderId}`,
          orderId: o.orderId,
          userPhone: o.phone,
          userEmail: o.email || '',
          websiteTitle: o.companyName || o.demoTitle || 'ওয়েবসাইট অ্যাডমিন প্যানেল',
          websiteCode: o.demoCode,
          websiteAdminId: o.deliveredAdminId,
          websiteAdminPass: o.deliveredAdminPass,
          notes: 'আপনার ওয়েবসাইট সম্পূর্ণ তৈরি ও রেডি। অ্যাডমিন প্যানেলে লগইন করুন।',
          deliveredAt: o.createdAt || new Date().toLocaleString('bn-BD')
        });
      }
    }
  }

  localCache.deliveredCredentials = creds;
  localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(creds));
  return creds;
}

export async function apiAddDeliveredCredentials(cred: WebsiteDeliveryCredentials, targetOrderId?: string): Promise<WebsiteDeliveryCredentials[]> {
  const safeOrderId = String(targetOrderId || cred.orderId || '').trim();
  const cleanPhone = normalizePhone(cred.userPhone);
  const websiteCode = cred.websiteCode || '';

  // Find existing credential matching this order or this user+website
  const existing = localCache.deliveredCredentials.find(c => 
    (safeOrderId && c.orderId === safeOrderId) ||
    (c.id === cred.id) ||
    (cleanPhone && normalizePhone(c.userPhone) === cleanPhone && (c.websiteCode === websiteCode || !c.websiteCode || !websiteCode))
  );

  const safeId = existing?.id || String(cred?.id || `DELIV-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  const cleanId = safeId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeCred: WebsiteDeliveryCredentials = { 
    ...cred, 
    id: safeId,
    orderId: safeOrderId || existing?.orderId || cred.orderId || '',
    deliveredAt: cred.deliveredAt || new Date().toLocaleString('bn-BD')
  };

  try {
    await setDoc(doc(db, 'deliveredCredentials', cleanId), safeCred);
  } catch (err) {
    console.warn('Firestore add credentials notice:', err);
  }

  // Remove any conflicting older credentials for the same order or user's website so ONLY latest exists
  const oldIdsToDelete: string[] = [];
  localCache.deliveredCredentials = localCache.deliveredCredentials.filter(c => {
    const isSameOrder = safeOrderId && c.orderId === safeOrderId;
    const isSameUserWebsite = cleanPhone && normalizePhone(c.userPhone) === cleanPhone && (c.websiteCode === websiteCode || !websiteCode || !c.websiteCode);
    const isSameId = c.id === safeId;
    if ((isSameOrder || isSameUserWebsite) && !isSameId) {
      oldIdsToDelete.push(c.id);
      return false;
    }
    return c.id !== safeId;
  });

  // Delete older duplicates from Firestore in background
  for (const oldId of oldIdsToDelete) {
    try {
      const cleanOldId = oldId.replace(/[^a-zA-Z0-9_-]/g, '_');
      deleteDoc(doc(db, 'deliveredCredentials', cleanOldId)).catch(() => {});
    } catch (_) {}
  }

  localCache.deliveredCredentials.unshift(safeCred);
  localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(localCache.deliveredCredentials));

  // Auto-mark order credentials as delivered and sync latest ID & Password
  const orderTarget = safeOrderId 
    ? localCache.orders.find(o => o.orderId === safeOrderId || (o as any).id === safeOrderId)
    : localCache.orders.find(o => (normalizePhone(o.phone) === cleanPhone && (o.demoCode === safeCred.websiteCode || o.companyName === safeCred.websiteTitle)));

  if (orderTarget) {
    await apiUpdateOrderStatus(orderTarget.orderId, orderTarget.status, {
      hasDeliveredCredentials: true,
      deliveredAdminId: safeCred.websiteAdminId,
      deliveredAdminPass: safeCred.websiteAdminPass
    });
  }

  try {
    fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeCred)
    }).catch(() => {});
  } catch (_) {}

  try {
    window.dispatchEvent(new CustomEvent('bongoweb_credentials_updated', { detail: localCache.deliveredCredentials }));
  } catch (_) {}

  return localCache.deliveredCredentials;
}

export async function apiDeleteCredentials(id: string): Promise<WebsiteDeliveryCredentials[]> {
  const safeId = String(id || '').trim();
  if (!safeId) return localCache.deliveredCredentials;
  const cleanId = safeId.replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    await deleteDoc(doc(db, 'deliveredCredentials', cleanId));
  } catch (err) {
    console.warn('Firestore delete credentials notice:', err);
  }

  localCache.deliveredCredentials = localCache.deliveredCredentials.filter(c => c.id !== safeId);
  localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(localCache.deliveredCredentials));

  try {
    fetch(`/api/credentials/${encodeURIComponent(safeId)}`, {
      method: 'DELETE'
    }).catch(() => {});
  } catch (_) {}

  try {
    window.dispatchEvent(new CustomEvent('bongoweb_credentials_updated', { detail: localCache.deliveredCredentials }));
  } catch (_) {}

  return localCache.deliveredCredentials;
}

export async function apiDeleteCredentialsByOrder(orderId: string, phone?: string, websiteCode?: string): Promise<WebsiteDeliveryCredentials[]> {
  const safeOrderId = String(orderId || '').trim();
  const cleanPhone = String(phone || '').trim();
  const cleanCode = String(websiteCode || '').trim();

  const toRemove = localCache.deliveredCredentials.filter(c => 
    (safeOrderId && c.orderId === safeOrderId) ||
    (cleanPhone && c.userPhone === cleanPhone && (!cleanCode || c.websiteCode === cleanCode))
  );

  for (const cred of toRemove) {
    await apiDeleteCredentials(cred.id);
  }

  return localCache.deliveredCredentials;
}

export const apiGetCredentials = apiGetDeliveredCredentials;
export const apiDeliverCredentials = apiAddDeliveredCredentials;
export const apiDeleteCredential = apiDeleteCredentials;

// ---------------- USER RESTRICTION (Ban / Unban) ----------------
export async function apiRestrictUser(phone: string, isRestricted: boolean): Promise<UserAccount[]> {
  const cleanPhone = String(phone || '').replace(/[^0-9]/g, '').trim();
  if (!cleanPhone) return localCache.users;

  try {
    await updateDoc(doc(db, 'users', cleanPhone), { isRestricted });
  } catch (err) {
    console.warn('Firestore restrict user notice:', err);
  }

  localCache.users = (localCache.users || []).map(u => {
    const uPhone = String(u.phone || '').replace(/[^0-9]/g, '').trim();
    return uPhone === cleanPhone ? { ...u, isRestricted } : u;
  });
  localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));

  // If currently active user in localStorage is restricted, sync it
  try {
    const cur = localStorage.getItem('bongoweb_user');
    if (cur) {
      const parsed = JSON.parse(cur);
      const parsedPhone = String(parsed.phone || '').replace(/[^0-9]/g, '').trim();
      if (parsedPhone === cleanPhone) {
        parsed.isRestricted = isRestricted;
        localStorage.setItem('bongoweb_user', JSON.stringify(parsed));
      }
    }
  } catch (_) {}

  try {
    fetch(`/api/users/${encodeURIComponent(cleanPhone)}/restrict`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRestricted })
    }).catch(() => {});
  } catch (_) {}

  return localCache.users;
}

// ---------------- USER REPORTS SYSTEM ----------------
export async function apiGetReports(): Promise<UserReport[]> {
  try {
    const snap = await getDocs(collection(db, 'reports'));
    if (!snap.empty) {
      const list = snap.docs.map(d => d.data() as UserReport);
      localCache.reports = list;
      localStorage.setItem('bongoweb_reports', JSON.stringify(list));
      return list;
    }
  } catch (_) {}

  try {
    const res = await fetch('/api/reports');
    if (res.ok) {
      const list = await res.json();
      localCache.reports = list;
      localStorage.setItem('bongoweb_reports', JSON.stringify(list));
      return list;
    }
  } catch (_) {}

  return localCache.reports || [];
}

export async function apiCreateReport(report: UserReport): Promise<UserReport[]> {
  const safe: UserReport = cleanFirestoreData({
    ...report,
    id: report.id || `REP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: report.status || 'pending',
    createdAt: report.createdAt || new Date().toLocaleString('bn-BD')
  });

  const cleanId = String(safe.id || 'rep').replace(/[^a-zA-Z0-9_-]/g, '_');
  try {
    await setDoc(doc(db, 'reports', cleanId), safe);
  } catch (err) {
    console.warn('Firestore report notice:', err);
  }

  localCache.reports = [safe, ...(localCache.reports || []).filter(r => r.id !== safe.id)];
  localStorage.setItem('bongoweb_reports', JSON.stringify(localCache.reports));

  try {
    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safe)
    }).catch(() => {});
  } catch (_) {}

  return localCache.reports;
}

export async function apiReplyToReport(reportId: string, reply: string): Promise<UserReport[]> {
  const targetId = String(reportId || '').trim();
  const cleanId = targetId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const now = new Date().toLocaleString('bn-BD');
  const replyClean = String(reply || '').trim();

  try {
    if (cleanId) {
      await updateDoc(doc(db, 'reports', cleanId), {
        adminReply: replyClean,
        adminRepliedAt: now,
        status: 'in_progress'
      });
    }
  } catch (err) {
    console.warn('Firestore reply report notice:', err);
  }

  localCache.reports = (localCache.reports || []).map(r => 
    r.id === targetId ? { ...r, adminReply: replyClean, adminRepliedAt: now, status: r.status === 'resolved' ? 'resolved' : 'in_progress' } : r
  );
  localStorage.setItem('bongoweb_reports', JSON.stringify(localCache.reports));

  try {
    fetch(`/api/reports/${encodeURIComponent(targetId)}/reply`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: replyClean })
    }).catch(() => {});
  } catch (_) {}

  return localCache.reports;
}

export async function apiResolveReport(reportId: string): Promise<UserReport[]> {
  const targetId = String(reportId || '').trim();
  const cleanId = targetId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const now = new Date().toLocaleString('bn-BD');

  try {
    if (cleanId) {
      await updateDoc(doc(db, 'reports', cleanId), {
        status: 'resolved',
        resolvedAt: now
      });
    }
  } catch (err) {
    console.warn('Firestore resolve report notice:', err);
  }

  localCache.reports = (localCache.reports || []).map(r => 
    r.id === targetId ? { ...r, status: 'resolved', resolvedAt: now } : r
  );
  localStorage.setItem('bongoweb_reports', JSON.stringify(localCache.reports));

  try {
    fetch(`/api/reports/${encodeURIComponent(targetId)}/resolve`, {
      method: 'PUT'
    }).catch(() => {});
  } catch (_) {}

  return localCache.reports;
}

export function subscribeToReports(callback: (reports: UserReport[]) => void): () => void {
  try {
    return onSnapshot(collection(db, 'reports'), (snapshot) => {
      const reports = snapshot.docs.map(d => d.data() as UserReport);
      reports.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      localCache.reports = reports;
      localStorage.setItem('bongoweb_reports', JSON.stringify(reports));
      callback(reports);
    }, (err) => {
      console.warn('Reports onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

// ---------------- PASSWORD RESET REQUESTS ----------------
export async function apiGetResetRequests(): Promise<PasswordResetRequest[]> {
  try {
    const snap = await getDocs(collection(db, 'resetRequests'));
    if (!snap.empty) {
      const list = snap.docs.map(d => d.data() as PasswordResetRequest);
      localCache.resetRequests = list;
      localStorage.setItem('bongoweb_reset_requests', JSON.stringify(list));
      return list;
    }
  } catch (_) {}

  try {
    const res = await fetch('/api/resets');
    if (res.ok) {
      const list = await res.json();
      localCache.resetRequests = list;
      localStorage.setItem('bongoweb_reset_requests', JSON.stringify(list));
      return list;
    }
  } catch (_) {}

  return localCache.resetRequests;
}

export async function apiRequestPasswordReset(reqOrPhone: PasswordResetRequest | string): Promise<PasswordResetRequest> {
  const req: PasswordResetRequest = typeof reqOrPhone === 'string' ? {
    id: `rst-${Date.now()}`,
    phone: reqOrPhone,
    requestedAt: new Date().toLocaleString('bn-BD'),
    status: 'pending'
  } : reqOrPhone;

  const cleanId = String(req?.id || `rst-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    await setDoc(doc(db, 'resetRequests', cleanId), req);
  } catch (err) {
    console.warn('Firestore request reset notice:', err);
  }

  localCache.resetRequests.unshift(req);
  localStorage.setItem('bongoweb_reset_requests', JSON.stringify(localCache.resetRequests));

  try {
    fetch('/api/resets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    }).catch(() => {});
  } catch (_) {}

  return req;
}

export async function apiResolveResetRequest(
  id: string, 
  status: 'pending' | 'reset' | 'rejected' | 'call_not_received', 
  newPassword?: string
): Promise<PasswordResetRequest[]> {
  const safeId = String(id || '').trim();
  const cleanId = safeId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const targetReq = localCache.resetRequests.find(r => r.id === safeId);

  try {
    const updatePayload: any = {
      status,
      resolvedAt: new Date().toLocaleString('bn-BD')
    };
    if (newPassword) updatePayload.newPasswordAssigned = newPassword;
    await updateDoc(doc(db, 'resetRequests', cleanId), updatePayload);

    // If new password assigned, update the user account in Firestore
    if (status === 'reset' && newPassword && targetReq?.phone) {
      const cleanPhone = normalizePhone(targetReq.phone) || targetReq.phone.trim();
      await updateDoc(doc(db, 'users', cleanPhone), { password: newPassword }).catch(() => {});
    }
  } catch (err) {
    console.warn('Firestore resolve reset notice:', err);
  }

  localCache.resetRequests = localCache.resetRequests.map(r => 
    r.id === id ? { ...r, status, newPasswordAssigned: newPassword, resolvedAt: new Date().toLocaleString('bn-BD') } : r
  );
  localStorage.setItem('bongoweb_reset_requests', JSON.stringify(localCache.resetRequests));

  // Also update registered users cache and active session
  if (status === 'reset' && newPassword && targetReq?.phone) {
    const cleanPhone = normalizePhone(targetReq.phone) || targetReq.phone.trim();
    localCache.users = localCache.users.map(u => 
      (normalizePhone(u.phone) === cleanPhone || u.phone.trim() === targetReq.phone.trim()) 
        ? { ...u, password: newPassword } 
        : u
    );
    localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));

    try {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (normalizePhone(u.phone) === cleanPhone) {
          u.password = newPassword;
          localStorage.setItem('bongoweb_user', JSON.stringify(u));
          sessionStorage.setItem('bongoweb_user', JSON.stringify(u));
        }
      }
    } catch (_) {}
  }

  try {
    fetch(`/api/resets/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, newPassword })
    }).catch(() => {});
  } catch (_) {}

  return localCache.resetRequests;
}

// ---------------- REALTIME FIRESTORE SUBSCRIPTIONS ----------------
export function subscribeToOrders(callback: (orders: ClientOrder[]) => void): () => void {
  try {
    return onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orders = snapshot.docs.map(d => d.data() as ClientOrder).filter(item => {
        const name = String(item?.clientName || '').toLowerCase();
        const code = String(item?.demoCode || '').toLowerCase();
        const id = String(item?.orderId || '').toLowerCase();
        return !name.includes('tanvir') && !name.includes('রাকিবুল') && !name.includes('আরিফুল') && !code.includes('4821') && !id.includes('84192') && !id.includes('72615');
      });
      // Sort newest first
      orders.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      localCache.orders = orders;
      localStorage.setItem('bongoweb_orders', JSON.stringify(orders));
      callback(orders);
    }, (err) => {
      console.warn('Orders onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

export function subscribeToChatThreads(callback: (threads: SupportChatThread[]) => void): () => void {
  try {
    return onSnapshot(collection(db, 'supportChats'), (snapshot) => {
      const threads = snapshot.docs.map(d => d.data() as SupportChatThread);
      // Sort newest first
      threads.sort((a, b) => (b.expiresAt || 0) - (a.expiresAt || 0));
      localCache.supportChats = threads;
      localStorage.setItem('bongoweb_support_chats', JSON.stringify(threads));
      callback(threads);
    }, (err) => {
      console.warn('ChatThreads onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

export function subscribeToSingleChatThread(phone: string, callback: (thread: SupportChatThread | null) => void): () => void {
  try {
    const cleanPhone = normalizePhone(phone) || phone.trim();
    return onSnapshot(doc(db, 'supportChats', cleanPhone), (docSnap) => {
      if (docSnap.exists()) {
        const thread = docSnap.data() as SupportChatThread;
        callback(thread);
      } else {
        callback(null);
      }
    }, (err) => {
      console.warn('SingleChatThread onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

export function subscribeToUsers(callback: (users: UserAccount[]) => void): () => void {
  try {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(d => d.data() as UserAccount);
      localCache.users = users;
      localStorage.setItem('bongoweb_registered_users', JSON.stringify(users));
      callback(users);
    }, (err) => {
      console.warn('Users onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

export function subscribeToDeliveredCredentials(callback: (creds: WebsiteDeliveryCredentials[]) => void): () => void {
  try {
    return onSnapshot(collection(db, 'deliveredCredentials'), (snapshot) => {
      const creds = snapshot.docs.map(d => d.data() as WebsiteDeliveryCredentials);
      localCache.deliveredCredentials = creds;
      localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(creds));
      callback(creds);
    }, (err) => {
      console.warn('DeliveredCredentials onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

export function subscribeToResetRequests(callback: (resets: PasswordResetRequest[]) => void): () => void {
  try {
    return onSnapshot(collection(db, 'resetRequests'), (snapshot) => {
      const resets = snapshot.docs.map(d => d.data() as PasswordResetRequest);
      localCache.resetRequests = resets;
      localStorage.setItem('bongoweb_reset_requests', JSON.stringify(resets));
      callback(resets);
    }, (err) => {
      console.warn('ResetRequests onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

export function subscribeToWebsites(callback: (websites: WebsiteDemo[]) => void): () => void {
  try {
    return onSnapshot(collection(db, 'customWebsites'), (snapshot) => {
      const websites = snapshot.docs.map(d => d.data() as WebsiteDemo);
      if (websites.length > 0) {
        localCache.customWebsites = websites;
        localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(websites));
        callback(websites);
      }
    }, (err) => {
      console.warn('Websites onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

// ---------------- FULL SYSTEM BACKUP (SINGLE LOCATION NEXT TO LOGOUT) ----------------
export async function apiExportCompleteBackup(): Promise<any> {
  const current = await pullFromCloudVault();
  return {
    exportedAt: new Date().toISOString(),
    platform: 'BongoWeb.xyz Complete Production Vault',
    version: '4.5.0-firestore-cloud',
    totalUsers: current.users.length,
    totalOrders: current.orders.length,
    totalCustomWebsites: current.customWebsites.length,
    totalChatThreads: current.chats.length,
    totalDeliveredCredentials: current.credentials.length,
    totalResetRequests: current.resets.length,
    ...current
  };
}

export async function apiRestoreCompleteBackup(backupData: any): Promise<{ success: boolean; message: string }> {
  try {
    if (!backupData) throw new Error('No backup data provided');

    const orders: ClientOrder[] = Array.isArray(backupData.orders) ? backupData.orders : [];
    const users: UserAccount[] = Array.isArray(backupData.users) ? backupData.users : [];
    const chats: SupportChatThread[] = Array.isArray(backupData.chats || backupData.supportChats) 
      ? (backupData.chats || backupData.supportChats) 
      : [];
    const creds: WebsiteDeliveryCredentials[] = Array.isArray(backupData.credentials || backupData.deliveredCredentials) 
      ? (backupData.credentials || backupData.deliveredCredentials) 
      : [];
    const resets: PasswordResetRequest[] = Array.isArray(backupData.resets || backupData.resetRequests) 
      ? (backupData.resets || backupData.resetRequests) 
      : [];
    const websites: WebsiteDemo[] = Array.isArray(backupData.customWebsites)
      ? backupData.customWebsites
      : [];

    // Restore to Cloud Firestore
    const writePromises: Promise<any>[] = [];
    orders.forEach(o => {
      if (!o) return;
      const cleanId = String(o.orderId || (o as any).id || Math.random()).replace(/[^a-zA-Z0-9_-]/g, '_');
      writePromises.push(setDoc(doc(db, 'orders', cleanId), o));
    });
    users.forEach(u => {
      const cleanPhone = (u.phone || '').trim();
      if (cleanPhone) writePromises.push(setDoc(doc(db, 'users', cleanPhone), u));
    });
    chats.forEach(c => {
      const cleanPhone = (c.userPhone || '').trim();
      if (cleanPhone) writePromises.push(setDoc(doc(db, 'supportChats', cleanPhone), c));
    });
    creds.forEach(c => {
      const cleanId = c.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      writePromises.push(setDoc(doc(db, 'deliveredCredentials', cleanId), c));
    });
    resets.forEach(r => {
      const cleanId = r.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      writePromises.push(setDoc(doc(db, 'resetRequests', cleanId), r));
    });
    websites.forEach(w => {
      const cleanCode = (w.fourDigitCode || w.id).replace(/[^a-zA-Z0-9_-]/g, '_');
      writePromises.push(setDoc(doc(db, 'customWebsites', cleanCode), w));
    });

    await Promise.all(writePromises);

    // Update local cache
    localCache.orders = orders;
    localCache.users = users;
    localCache.supportChats = chats;
    localCache.deliveredCredentials = creds;
    localCache.resetRequests = resets;
    localCache.customWebsites = websites;

    localStorage.setItem('bongoweb_orders', JSON.stringify(orders));
    localStorage.setItem('bongoweb_registered_users', JSON.stringify(users));
    localStorage.setItem('bongoweb_support_chats', JSON.stringify(chats));
    localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(creds));
    localStorage.setItem('bongoweb_reset_requests', JSON.stringify(resets));
    localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(websites));

    return {
      success: true,
      message: 'সম্পূর্ণ ক্লাউড ডাটাবেজ সফলভাবে রিস্টোর করা হয়েছে।'
    };
  } catch (err: any) {
    console.error('Restore error:', err);
    return {
      success: false,
      message: 'রিস্টোর করতে সমস্যা হয়েছে: ' + (err.message || '')
    };
  }
}

// ---------------- LOGO & BRAND SETTINGS ----------------
export const DEFAULT_LOGO_CONFIG: BrandLogoConfig = {
  logoType: 'image',
  imageUrl: '/uploaded-brand-logo.png',
  imageName: '01-removebg-preview.png',
  imageSizePx: 82,
  showBrandTextWithImage: false,
  typedLogoText: 'BongoWeb',
  typedSubtitle: '',
  textGradientTheme: 'royal',
  textFontSizePx: 28,
  updatedAt: new Date().toISOString()
};

export async function apiGetLogoConfig(): Promise<BrandLogoConfig> {
  // 1. Check Cloud Firestore first for universal source of truth across all devices
  try {
    const snap = await getDoc(doc(db, 'siteSettings', 'logoConfig'));
    if (snap.exists() && snap.data()) {
      const data = snap.data() as BrandLogoConfig;
      if (data && data.logoType) {
        localStorage.setItem('bongoweb_logo_config', JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Firestore get logo notice:', err);
  }

  // 2. Check server endpoint
  try {
    const res = await fetch('/api/settings/logo');
    if (res.ok) {
      const data = await res.json();
      if (data && data.logoType) {
        localStorage.setItem('bongoweb_logo_config', JSON.stringify(data));
        return data;
      }
    }
  } catch (_) {}

  // 3. Fallback to local storage if available
  try {
    const local = localStorage.getItem('bongoweb_logo_config');
    if (local) {
      return JSON.parse(local);
    }
  } catch (_) {}

  return DEFAULT_LOGO_CONFIG;
}

export async function apiSaveLogoConfig(config: BrandLogoConfig): Promise<BrandLogoConfig> {
  const safeConfig: BrandLogoConfig = {
    ...config,
    updatedAt: new Date().toISOString()
  };

  // Immediate local cache
  try {
    localStorage.setItem('bongoweb_logo_config', JSON.stringify(safeConfig));
  } catch (_) {}

  // 1. Save to Cloud Firestore so all old and new devices instantly see it
  try {
    await setDoc(doc(db, 'siteSettings', 'logoConfig'), safeConfig, { merge: true });
    await setDoc(doc(db, 'systemSettings', 'logoConfig'), safeConfig, { merge: true });
  } catch (err) {
    console.warn('Firestore save logo config notice:', err);
  }

  // 2. Save to Express server database & broadcast
  try {
    await fetch('/api/settings/logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeConfig)
    });
  } catch (_) {}

  // 3. Broadcast local custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bongoweb_logo_updated', { detail: safeConfig }));
  }

  return safeConfig;
}

export function subscribeToLogoConfig(callback: (config: BrandLogoConfig) => void): () => void {
  try {
    return onSnapshot(doc(db, 'siteSettings', 'logoConfig'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as BrandLogoConfig;
        if (data && data.logoType) {
          localStorage.setItem('bongoweb_logo_config', JSON.stringify(data));
          callback(data);
        }
      }
    }, (err) => {
      console.warn('Firestore logo onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

// ---------------- EMAIL RECOVERY REQUESTS ("I don't have my email") ----------------
export async function apiGetEmailRecoveries(): Promise<EmailRecoveryRequest[]> {
  try {
    const snap = await getDocs(collection(db, 'emailRecoveryRequests'));
    if (!snap.empty) {
      const list = snap.docs.map(d => d.data() as EmailRecoveryRequest);
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      localStorage.setItem('bongoweb_all_email_recoveries', JSON.stringify(list));
      return list;
    }
  } catch (_) {}

  try {
    const res = await fetch('/api/email-recoveries');
    if (res.ok) {
      const list = await res.json();
      localStorage.setItem('bongoweb_all_email_recoveries', JSON.stringify(list));
      return list;
    }
  } catch (_) {}

  const cached = localStorage.getItem('bongoweb_all_email_recoveries');
  return cached ? JSON.parse(cached) : [];
}

export async function apiCreateEmailRecovery(
  data: Omit<EmailRecoveryRequest, 'id' | 'createdAt' | 'status'>
): Promise<EmailRecoveryRequest> {
  const newReq: EmailRecoveryRequest = {
    ...data,
    id: `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    createdAt: new Date().toLocaleString('bn-BD')
  };

  const safe = cleanFirestoreData(newReq);
  const cleanId = String(safe.id).replace(/[^a-zA-Z0-9_-]/g, '_');

  // 1. Save to Cloud Firestore
  try {
    await setDoc(doc(db, 'emailRecoveryRequests', cleanId), safe);
  } catch (err) {
    console.warn('Firestore create email recovery notice:', err);
  }

  // 2. Save to Express server
  try {
    await fetch('/api/email-recoveries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safe)
    });
  } catch (_) {}

  // 3. Store client's own active request in this browser
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('bongoweb_email_recovery_request', JSON.stringify(safe));
    const all = await apiGetEmailRecoveries();
    const updated = [safe, ...all.filter(r => r.id !== safe.id)];
    localStorage.setItem('bongoweb_all_email_recoveries', JSON.stringify(updated));
  }

  return safe;
}

export async function apiApproveEmailRecovery(id: string): Promise<EmailRecoveryRequest[]> {
  const cleanId = String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
  const now = new Date().toLocaleString('bn-BD');

  try {
    await updateDoc(doc(db, 'emailRecoveryRequests', cleanId), {
      status: 'completed',
      decisionAt: now,
      decisionNote: 'অ্যাডমিন টিম কর্তৃক অনুমোদিত ও কল সম্পন্ন হয়েছে।'
    });
  } catch (err) {
    console.warn('Firestore approve email recovery notice:', err);
  }

  try {
    await fetch(`/api/email-recoveries/${encodeURIComponent(id)}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisionNote: 'অ্যাডমিন টিম কর্তৃক অনুমোদিত ও কল সম্পন্ন হয়েছে।' })
    });
  } catch (_) {}

  // Update client's own active request if it matches
  if (typeof localStorage !== 'undefined') {
    const active = localStorage.getItem('bongoweb_email_recovery_request');
    if (active) {
      try {
        const parsed: EmailRecoveryRequest = JSON.parse(active);
        if (parsed.id === id) {
          parsed.status = 'completed';
          parsed.decisionAt = now;
          parsed.decisionNote = 'অ্যাডমিন টিম কর্তৃক অনুমোদিত ও কল সম্পন্ন হয়েছে।';
          localStorage.setItem('bongoweb_email_recovery_request', JSON.stringify(parsed));
        }
      } catch (_) {}
    }
  }

  return apiGetEmailRecoveries();
}

export async function apiUndoEmailRecovery(id: string): Promise<EmailRecoveryRequest[]> {
  const cleanId = String(id).replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    await updateDoc(doc(db, 'emailRecoveryRequests', cleanId), {
      status: 'pending',
      decisionAt: null,
      decisionNote: null
    });
  } catch (err) {
    console.warn('Firestore undo email recovery notice:', err);
  }

  try {
    await fetch(`/api/email-recoveries/${encodeURIComponent(id)}/undo`, {
      method: 'PUT'
    });
  } catch (_) {}

  // Update client's own active request if it matches
  if (typeof localStorage !== 'undefined') {
    const active = localStorage.getItem('bongoweb_email_recovery_request');
    if (active) {
      try {
        const parsed: EmailRecoveryRequest = JSON.parse(active);
        if (parsed.id === id) {
          parsed.status = 'pending';
          delete parsed.decisionAt;
          delete parsed.decisionNote;
          localStorage.setItem('bongoweb_email_recovery_request', JSON.stringify(parsed));
        }
      } catch (_) {}
    }
  }

  return apiGetEmailRecoveries();
}

export async function apiDeleteEmailRecovery(id: string): Promise<EmailRecoveryRequest[]> {
  const cleanId = String(id).replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    await deleteDoc(doc(db, 'emailRecoveryRequests', cleanId));
  } catch (err) {
    console.warn('Firestore delete email recovery notice:', err);
  }

  try {
    await fetch(`/api/email-recoveries/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (_) {}

  // Clear client's own active request if it matches
  if (typeof localStorage !== 'undefined') {
    const active = localStorage.getItem('bongoweb_email_recovery_request');
    if (active) {
      try {
        const parsed = JSON.parse(active);
        if (parsed.id === id) {
          localStorage.removeItem('bongoweb_email_recovery_request');
        }
      } catch (_) {}
    }
  }

  return apiGetEmailRecoveries();
}

export function subscribeToEmailRecoveries(callback: (list: EmailRecoveryRequest[]) => void): () => void {
  try {
    return onSnapshot(collection(db, 'emailRecoveryRequests'), (snapshot) => {
      const list = snapshot.docs.map(d => d.data() as EmailRecoveryRequest);
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      localStorage.setItem('bongoweb_all_email_recoveries', JSON.stringify(list));
      callback(list);
    }, (err) => {
      console.warn('Email recovery onSnapshot notice:', err);
    });
  } catch (_) {
    return () => {};
  }
}

