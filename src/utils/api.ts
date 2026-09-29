import { 
  UserAccount, ClientOrder, SupportChatThread, SupportChatMessage, 
  WebsiteDemo, WebsiteDeliveryCredentials, PasswordResetRequest, AdminConfig 
} from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface CompleteDatabaseState {
  adminConfig: AdminConfig;
  users: UserAccount[];
  orders: ClientOrder[];
  supportChats: SupportChatThread[];
  customWebsites: WebsiteDemo[];
  deliveredCredentials: WebsiteDeliveryCredentials[];
  resetRequests: PasswordResetRequest[];
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
  customWebsites: WEBSITE_DEMOS,
  deliveredCredentials: [],
  resetRequests: []
};

// Seed initial memory cache from localStorage if available
try {
  const o = localStorage.getItem('bongoweb_orders');
  if (o) localCache.orders = JSON.parse(o);

  const c = localStorage.getItem('bongoweb_support_chats');
  if (c) localCache.supportChats = JSON.parse(c);

  const u = localStorage.getItem('bongoweb_registered_users');
  if (u) localCache.users = JSON.parse(u);

  const cred = localStorage.getItem('bongoweb_delivered_credentials');
  if (cred) localCache.deliveredCredentials = JSON.parse(cred);

  const r = localStorage.getItem('bongoweb_reset_requests');
  if (r) localCache.resetRequests = JSON.parse(r);

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

    if (ordersSnap && !ordersSnap.empty) {
      localCache.orders = ordersSnap.docs.map(d => d.data() as ClientOrder);
      localStorage.setItem('bongoweb_orders', JSON.stringify(localCache.orders));
    }
    if (chatsSnap && !chatsSnap.empty) {
      localCache.supportChats = chatsSnap.docs.map(d => d.data() as SupportChatThread);
      localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));
    }
    if (usersSnap && !usersSnap.empty) {
      localCache.users = usersSnap.docs.map(d => d.data() as UserAccount);
      localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));
    }
    if (credsSnap && !credsSnap.empty) {
      localCache.deliveredCredentials = credsSnap.docs.map(d => d.data() as WebsiteDeliveryCredentials);
      localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(localCache.deliveredCredentials));
    }
    if (resetsSnap && !resetsSnap.empty) {
      localCache.resetRequests = resetsSnap.docs.map(d => d.data() as PasswordResetRequest);
      localStorage.setItem('bongoweb_reset_requests', JSON.stringify(localCache.resetRequests));
    }
    if (sitesSnap && !sitesSnap.empty) {
      localCache.customWebsites = sitesSnap.docs.map(d => d.data() as WebsiteDemo);
      localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(localCache.customWebsites));
    }
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
    customWebsites: localCache.customWebsites,
    adminConfig: localCache.adminConfig
  };
}

// ---------------- ORDERS ----------------
export async function apiGetOrders(): Promise<ClientOrder[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    if (!snap.empty) {
      const list = snap.docs.map(d => d.data() as ClientOrder);
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
  // Update local memory and storage immediately
  const existing = localCache.orders.filter(o => o.orderId !== order.orderId);
  existing.unshift(order);
  localCache.orders = existing;
  localStorage.setItem('bongoweb_orders', JSON.stringify(existing));

  if (order.status === 'pending') {
    localStorage.setItem('bongoweb_active_pending_order', JSON.stringify(order));
  }

  // 1. Persist directly to Cloud Firestore (Works on phone & laptop instantly)
  try {
    const cleanId = order.orderId.replace(/[^a-zA-Z0-9_-]/g, '_');
    await setDoc(doc(db, 'orders', cleanId), order);

    // Also auto-register customer in users collection if phone is provided
    if (order.phone) {
      const cleanPhone = order.phone.trim();
      const userRef = doc(db, 'users', cleanPhone);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const newUser: UserAccount = {
          name: order.clientName || 'Valued Client',
          phone: cleanPhone,
          email: order.email || '',
          registeredAt: new Date().toLocaleDateString('bn-BD')
        };
        await setDoc(userRef, newUser);
        localCache.users.push(newUser);
        localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));
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
      body: JSON.stringify(order)
    }).catch(() => {});
  } catch (_) {}

  return order;
}

export async function apiUpdateOrderStatus(orderId: string, status: 'pending' | 'verified' | 'cancelled'): Promise<ClientOrder[]> {
  localCache.orders = localCache.orders.map(o => 
    o.orderId === orderId ? { ...o, status } : o
  );
  localStorage.setItem('bongoweb_orders', JSON.stringify(localCache.orders));

  // 1. Update Cloud Firestore
  try {
    const cleanId = orderId.replace(/[^a-zA-Z0-9_-]/g, '_');
    await updateDoc(doc(db, 'orders', cleanId), { status });
  } catch (err) {
    console.warn('Firestore update order status notice:', err);
  }

  // 2. Replicate to server route
  try {
    fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});
  } catch (_) {}

  return localCache.orders;
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
  const cleanPhone = (user.phone || '').trim();
  const cleanEmail = (user.email || '').trim().toLowerCase();

  if (!user.name || !cleanPhone || !cleanEmail) {
    return { success: false, error: 'সবগুলো তথ্য পূরণ করুন।' };
  }

  const cleanUser: UserAccount = {
    name: user.name.trim(),
    phone: cleanPhone,
    email: cleanEmail,
    password: user.password ? user.password.trim() : undefined,
    registeredAt: user.registeredAt || new Date().toLocaleDateString('bn-BD')
  };

  // 1. Persist directly to Cloud Firestore
  try {
    const userDocRef = doc(db, 'users', cleanPhone);
    const existingSnap = await getDoc(userDocRef);
    if (existingSnap.exists()) {
      return {
        success: false,
        error: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে!'
      };
    }
    await setDoc(userDocRef, cleanUser);
  } catch (err) {
    console.warn('Firestore register notice:', err);
  }

  // Update local memory and storage
  const updatedUsers = localCache.users.filter(u => u.phone !== cleanPhone);
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

export async function apiActivateChat(params: {
  name: string;
  phone: string;
  language: 'bn' | 'en';
  welcomeText: string;
}): Promise<SupportChatThread> {
  const cleanPhone = params.phone.trim();
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

  // Check if thread already has prior messages in Firestore
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
        lastUpdated: 'এখনই'
      };
      if (!thread.messages || thread.messages.length === 0) {
        thread.messages = [welcomeMsg];
      }
    }
    // Save to Cloud Firestore
    await setDoc(chatDocRef, thread);
  } catch (err) {
    console.error('Firestore activate chat error:', err);
  }

  // Update local memory & storage
  const filtered = localCache.supportChats.filter(t => t.userPhone !== cleanPhone);
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
      body: JSON.stringify(params)
    }).catch(() => {});
  } catch (_) {}

  return thread;
}

export async function apiSendChatMessage(params: {
  phone: string;
  sender: 'client' | 'admin';
  text: string;
  name?: string;
}): Promise<SupportChatMessage> {
  const cleanPhone = params.phone.trim();
  const cleanText = params.text.trim();

  const newMsg: SupportChatMessage = {
    id: `${params.sender}-${Date.now()}`,
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
      thread.messages.push(newMsg);
      thread.lastMessage = cleanText;
      thread.lastUpdated = 'এখনই';
      if (params.sender === 'client') {
        thread.unreadAdminCount = (thread.unreadAdminCount || 0) + 1;
        thread.expiresAt = Date.now() + 5 * 60 * 1000; // Reset 5 min timer on user response
        thread.isClosed = false;
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
        additionalMinutesAdded: 0,
        messages: [newMsg]
      };
    }
    await setDoc(chatDocRef, thread);
  } catch (err) {
    console.error('Firestore send message error:', err);
  }

  // Update local memory and storage
  let localThread = localCache.supportChats.find(t => t.userPhone === cleanPhone);
  if (localThread) {
    localThread.messages.push(newMsg);
    localThread.lastMessage = cleanText;
    localThread.lastUpdated = 'এখনই';
    if (params.sender === 'client') {
      localThread.unreadAdminCount = (localThread.unreadAdminCount || 0) + 1;
      localThread.expiresAt = Date.now() + 5 * 60 * 1000;
      localThread.isClosed = false;
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
      body: JSON.stringify(params)
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

export async function apiEndChat(phone: string): Promise<void> {
  const cleanPhone = phone.trim();

  try {
    await deleteDoc(doc(db, 'supportChats', cleanPhone));
  } catch (err) {
    console.warn('Firestore delete chat notice:', err);
  }

  localCache.supportChats = localCache.supportChats.filter(t => t.userPhone !== cleanPhone);
  localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));

  try {
    fetch('/api/chat/end', {
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

  return localCache.customWebsites;
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
  try {
    const snap = await getDocs(collection(db, 'deliveredCredentials'));
    if (!snap.empty) {
      const creds = snap.docs.map(d => d.data() as WebsiteDeliveryCredentials);
      localCache.deliveredCredentials = creds;
      localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(creds));
      return creds;
    }
  } catch (_) {}

  try {
    const res = await fetch('/api/credentials');
    if (res.ok) {
      const creds = await res.json();
      localCache.deliveredCredentials = creds;
      localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(creds));
      return creds;
    }
  } catch (_) {}

  return localCache.deliveredCredentials;
}

export async function apiAddDeliveredCredentials(cred: WebsiteDeliveryCredentials): Promise<WebsiteDeliveryCredentials[]> {
  const cleanId = cred.id.replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    await setDoc(doc(db, 'deliveredCredentials', cleanId), cred);
  } catch (err) {
    console.warn('Firestore add credentials notice:', err);
  }

  localCache.deliveredCredentials.unshift(cred);
  localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(localCache.deliveredCredentials));

  try {
    fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cred)
    }).catch(() => {});
  } catch (_) {}

  return localCache.deliveredCredentials;
}

export async function apiDeleteCredentials(id: string): Promise<WebsiteDeliveryCredentials[]> {
  const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    await deleteDoc(doc(db, 'deliveredCredentials', cleanId));
  } catch (err) {
    console.warn('Firestore delete credentials notice:', err);
  }

  localCache.deliveredCredentials = localCache.deliveredCredentials.filter(c => c.id !== id);
  localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(localCache.deliveredCredentials));

  try {
    fetch(`/api/credentials/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(() => {});
  } catch (_) {}

  return localCache.deliveredCredentials;
}

export const apiGetCredentials = apiGetDeliveredCredentials;
export const apiDeliverCredentials = apiAddDeliveredCredentials;
export const apiDeleteCredential = apiDeleteCredentials;

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

  const cleanId = req.id.replace(/[^a-zA-Z0-9_-]/g, '_');

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
  const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '_');

  try {
    const updatePayload: any = {
      status,
      resolvedAt: new Date().toLocaleString('bn-BD')
    };
    if (newPassword) updatePayload.newPasswordAssigned = newPassword;
    await updateDoc(doc(db, 'resetRequests', cleanId), updatePayload);
  } catch (err) {
    console.warn('Firestore resolve reset notice:', err);
  }

  localCache.resetRequests = localCache.resetRequests.map(r => 
    r.id === id ? { ...r, status, newPasswordAssigned: newPassword, resolvedAt: new Date().toLocaleString('bn-BD') } : r
  );
  localStorage.setItem('bongoweb_reset_requests', JSON.stringify(localCache.resetRequests));

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
      const orders = snapshot.docs.map(d => d.data() as ClientOrder);
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
    const cleanPhone = phone.trim();
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
    const websites: WebsiteDemo[] = Array.isArray(backupData.customWebsites) && backupData.customWebsites.length > 0
      ? backupData.customWebsites
      : WEBSITE_DEMOS;

    // Restore to Cloud Firestore
    const writePromises: Promise<any>[] = [];
    orders.forEach(o => {
      const cleanId = o.orderId.replace(/[^a-zA-Z0-9_-]/g, '_');
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
