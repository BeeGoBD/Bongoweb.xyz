import { 
  UserAccount, ClientOrder, SupportChatThread, SupportChatMessage, 
  WebsiteDemo, WebsiteDeliveryCredentials, PasswordResetRequest, AdminConfig 
} from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';

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
// Pulls live data from the real server /api/data
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
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.orders)) {
        localCache.orders = data.orders;
        localStorage.setItem('bongoweb_orders', JSON.stringify(data.orders));
      }
      if (Array.isArray(data.supportChats)) {
        localCache.supportChats = data.supportChats;
        localStorage.setItem('bongoweb_support_chats', JSON.stringify(data.supportChats));
      }
      if (Array.isArray(data.users)) {
        localCache.users = data.users;
        localStorage.setItem('bongoweb_registered_users', JSON.stringify(data.users));
      }
      if (Array.isArray(data.deliveredCredentials)) {
        localCache.deliveredCredentials = data.deliveredCredentials;
        localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(data.deliveredCredentials));
      }
      if (Array.isArray(data.resetRequests)) {
        localCache.resetRequests = data.resetRequests;
        localStorage.setItem('bongoweb_reset_requests', JSON.stringify(data.resetRequests));
      }
      if (Array.isArray(data.customWebsites) && data.customWebsites.length > 0) {
        localCache.customWebsites = data.customWebsites;
        localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(data.customWebsites));
      }
      if (data.adminConfig) {
        localCache.adminConfig = data.adminConfig;
        localStorage.setItem('bongoweb_admin_config', JSON.stringify(data.adminConfig));
      }
    }
  } catch (err) {
    console.warn('Network sync offline, using local storage cache:', err);
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
  // Update local cache immediately
  const existing = localCache.orders.filter(o => o.orderId !== order.orderId);
  existing.unshift(order);
  localCache.orders = existing;
  localStorage.setItem('bongoweb_orders', JSON.stringify(existing));

  if (order.status === 'pending') {
    localStorage.setItem('bongoweb_active_pending_order', JSON.stringify(order));
  }

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (res.ok) {
      const saved = await res.json();
      return saved;
    }
  } catch (err) {
    console.error('Failed to post order to server:', err);
  }

  return order;
}

export async function apiUpdateOrderStatus(orderId: string, status: 'pending' | 'verified' | 'cancelled'): Promise<ClientOrder[]> {
  localCache.orders = localCache.orders.map(o => 
    o.orderId === orderId ? { ...o, status } : o
  );
  localStorage.setItem('bongoweb_orders', JSON.stringify(localCache.orders));

  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const updated = await res.json();
      localCache.orders = updated;
      return updated;
    }
  } catch (err) {
    console.error('Failed to update order status on server:', err);
  }

  return localCache.orders;
}

// ---------------- USERS & AUTH ----------------
export async function apiGetUsers(): Promise<UserAccount[]> {
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
  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      localCache.users.push(data.user);
      localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));
      localStorage.setItem('bongoweb_user', JSON.stringify(data.user));
      sessionStorage.setItem('bongoweb_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error || 'নিবন্ধন সম্পন্ন করা যায়নি।' };
    }
  } catch (err) {
    console.error('Registration failed:', err);
    // Offline fallback
    const cleanUser: UserAccount = {
      ...user,
      registeredAt: user.registeredAt || new Date().toLocaleDateString('bn-BD')
    };
    localCache.users.push(cleanUser);
    localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));
    localStorage.setItem('bongoweb_user', JSON.stringify(cleanUser));
    return { success: true, user: cleanUser };
  }
}

export async function apiLoginUser(identifier: string, password: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
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
    return { success: false, error: data.error || 'ভুল ইউজার বা পাসওয়ার্ড!' };
  } catch (_) {
    // Fallback to local search
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();
    const user = localCache.users.find(
      u => (u.phone === cleanId || (u.email && u.email.toLowerCase() === cleanId)) && u.password === cleanPass
    );
    if (user) {
      localStorage.setItem('bongoweb_user', JSON.stringify(user));
      sessionStorage.setItem('bongoweb_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড সঠিক নয়!' };
  }
}

// ---------------- LIVE CHAT ----------------
export async function apiGetChatThreads(): Promise<SupportChatThread[]> {
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

  // Optimistic local update
  const welcomeMsg: SupportChatMessage = {
    id: `init-${Date.now()}`,
    sender: 'admin',
    text: params.welcomeText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const expiresAt = Date.now() + 5 * 60 * 1000;
  let existing = localCache.supportChats.find(t => t.userPhone === cleanPhone);

  if (existing) {
    existing.userName = cleanName;
    existing.language = params.language;
    existing.lastMessage = params.welcomeText;
    existing.lastUpdated = 'এখনই';
    existing.expiresAt = expiresAt;
    existing.isClosed = false;
    if (!existing.messages || existing.messages.length === 0) {
      existing.messages = [welcomeMsg];
    }
  } else {
    existing = {
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
    localCache.supportChats.unshift(existing);
  }

  localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));
  localStorage.setItem('bongoweb_chat_active_session', JSON.stringify({
    name: cleanName,
    phone: cleanPhone,
    language: params.language
  }));

  try {
    const res = await fetch('/api/chat/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      const serverThread = await res.json();
      return serverThread;
    }
  } catch (err) {
    console.error('Failed to activate chat on server:', err);
  }

  return existing;
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

  let thread = localCache.supportChats.find(t => t.userPhone === cleanPhone);
  if (thread) {
    thread.messages.push(newMsg);
    thread.lastMessage = cleanText;
    thread.lastUpdated = 'এখনই';
    if (params.sender === 'client') {
      thread.unreadAdminCount = (thread.unreadAdminCount || 0) + 1;
      thread.expiresAt = Date.now() + 5 * 60 * 1000;
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
    localCache.supportChats.unshift(thread);
  }

  localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));

  try {
    const res = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      const savedMsg = await res.json();
      return savedMsg;
    }
  } catch (err) {
    console.error('Failed to send message to server:', err);
  }

  return newMsg;
}

export async function apiExtendChatTime(phone: string, additionalMinutes: number = 5): Promise<void> {
  const cleanPhone = phone.trim();
  const thread = localCache.supportChats.find(t => t.userPhone === cleanPhone);
  if (thread) {
    const base = thread.expiresAt && thread.expiresAt > Date.now() ? thread.expiresAt : Date.now();
    thread.expiresAt = base + additionalMinutes * 60 * 1000;
    thread.isClosed = false;
    thread.additionalMinutesAdded = (thread.additionalMinutesAdded || 0) + additionalMinutes;
    localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));
  }

  try {
    await fetch('/api/chat/extend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, additionalMinutes })
    });
  } catch (err) {
    console.error('Failed to extend chat time:', err);
  }
}

export async function apiEndChat(phone: string): Promise<void> {
  const cleanPhone = phone.trim();
  localCache.supportChats = localCache.supportChats.filter(t => t.userPhone !== cleanPhone);
  localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));

  try {
    await fetch('/api/chat/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone })
    });
  } catch (err) {
    console.error('Failed to end chat on server:', err);
  }
}

// ---------------- WEBSITES CATALOG & STOCKS ----------------
export async function apiGetWebsites(): Promise<WebsiteDemo[]> {
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

export async function apiAddWebsite(site: WebsiteDemo): Promise<WebsiteDemo[]> {
  localCache.customWebsites.unshift(site);
  localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(localCache.customWebsites));

  try {
    const res = await fetch('/api/websites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(site)
    });
    if (res.ok) {
      const updated = await res.json();
      localCache.customWebsites = updated;
      return updated;
    }
  } catch (err) {
    console.error('Failed to add website to server:', err);
  }
  return localCache.customWebsites;
}

export async function apiUpdateWebsite(code: string, siteData: Partial<WebsiteDemo>): Promise<WebsiteDemo[]> {
  const cleanCode = code.replace('#', '');
  localCache.customWebsites = localCache.customWebsites.map(s => 
    (s.fourDigitCode && s.fourDigitCode.replace('#', '') === cleanCode) || s.id === code
      ? { ...s, ...siteData }
      : s
  );
  localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(localCache.customWebsites));

  try {
    const res = await fetch(`/api/websites/${encodeURIComponent(cleanCode)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteData)
    });
    if (res.ok) {
      const updated = await res.json();
      localCache.customWebsites = updated;
      return updated;
    }
  } catch (err) {
    console.error('Failed to update website on server:', err);
  }
  return localCache.customWebsites;
}

export async function apiDeleteWebsite(code: string): Promise<WebsiteDemo[]> {
  const cleanCode = code.replace('#', '');
  localCache.customWebsites = localCache.customWebsites.filter(s => 
    (s.fourDigitCode && s.fourDigitCode.replace('#', '') !== cleanCode) && s.id !== code
  );
  localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(localCache.customWebsites));

  try {
    const res = await fetch(`/api/websites/${encodeURIComponent(cleanCode)}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      const updated = await res.json();
      localCache.customWebsites = updated;
      return updated;
    }
  } catch (err) {
    console.error('Failed to delete website on server:', err);
  }
  return localCache.customWebsites;
}

// ---------------- CREDENTIALS ----------------
export async function apiGetCredentials(): Promise<WebsiteDeliveryCredentials[]> {
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

export async function apiDeliverCredentials(cred: WebsiteDeliveryCredentials): Promise<WebsiteDeliveryCredentials[]> {
  localCache.deliveredCredentials.unshift(cred);
  localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(localCache.deliveredCredentials));

  try {
    const res = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cred)
    });
    if (res.ok) {
      const updated = await res.json();
      localCache.deliveredCredentials = updated;
      return updated;
    }
  } catch (err) {
    console.error('Failed to deliver credentials to server:', err);
  }
  return localCache.deliveredCredentials;
}

export async function apiDeleteCredential(id: string): Promise<WebsiteDeliveryCredentials[]> {
  localCache.deliveredCredentials = localCache.deliveredCredentials.filter(c => c.id !== id);
  localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(localCache.deliveredCredentials));

  try {
    const res = await fetch(`/api/credentials/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      const updated = await res.json();
      localCache.deliveredCredentials = updated;
      return updated;
    }
  } catch (err) {
    console.error('Failed to delete credential on server:', err);
  }
  return localCache.deliveredCredentials;
}

// ---------------- PASSWORD RESETS ----------------
export async function apiGetResetRequests(): Promise<PasswordResetRequest[]> {
  try {
    const res = await fetch('/api/resets');
    if (res.ok) {
      const resets = await res.json();
      localCache.resetRequests = resets;
      localStorage.setItem('bongoweb_reset_requests', JSON.stringify(resets));
      return resets;
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

  localCache.resetRequests.unshift(req);
  localStorage.setItem('bongoweb_reset_requests', JSON.stringify(localCache.resetRequests));

  try {
    const res = await fetch('/api/resets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) {
      const saved = await res.json();
      return saved;
    }
  } catch (err) {
    console.error('Failed to post reset request to server:', err);
  }
  return req;
}

export async function apiResolveResetRequest(
  id: string, 
  status: 'pending' | 'reset' | 'rejected' | 'call_not_received', 
  newPassword?: string
): Promise<PasswordResetRequest[]> {
  localCache.resetRequests = localCache.resetRequests.map(r => 
    r.id === id ? { ...r, status, newPasswordAssigned: newPassword, resolvedAt: new Date().toLocaleString('bn-BD') } : r
  );
  localStorage.setItem('bongoweb_reset_requests', JSON.stringify(localCache.resetRequests));

  try {
    const res = await fetch(`/api/resets/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, newPassword })
    });
    if (res.ok) {
      const updated = await res.json();
      localCache.resetRequests = updated;
      return updated;
    }
  } catch (err) {
    console.error('Failed to resolve reset on server:', err);
  }
  return localCache.resetRequests;
}

// ---------------- FULL SYSTEM BACKUP (SINGLE LOCATION NEXT TO LOGOUT) ----------------
export async function apiExportCompleteBackup(): Promise<any> {
  try {
    const res = await fetch('/api/backup/export');
    if (res.ok) {
      return await res.json();
    }
  } catch (_) {}

  return {
    exportedAt: new Date().toISOString(),
    platform: 'BongoWeb.xyz Complete Production Vault',
    version: '4.0.0',
    totalUsers: localCache.users.length,
    totalOrders: localCache.orders.length,
    totalCustomWebsites: localCache.customWebsites.length,
    totalChatThreads: localCache.supportChats.length,
    totalDeliveredCredentials: localCache.deliveredCredentials.length,
    totalResetRequests: localCache.resetRequests.length,
    ...localCache
  };
}

export async function apiRestoreCompleteBackup(backupData: any): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/backup/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backupData)
    });
    if (res.ok) {
      const data = await res.json();
      // Also update local cache
      await pullFromCloudVault();
      return { success: true, message: data.message || 'ডাটাবেজ সফলভাবে রিস্টোর হয়েছে!' };
    }
  } catch (err) {
    console.error('Failed to restore backup to server:', err);
  }

  // Local fallback
  if (Array.isArray(backupData.orders)) localCache.orders = backupData.orders;
  if (Array.isArray(backupData.supportChats)) localCache.supportChats = backupData.supportChats;
  if (Array.isArray(backupData.users)) localCache.users = backupData.users;
  if (Array.isArray(backupData.customWebsites)) localCache.customWebsites = backupData.customWebsites;
  if (Array.isArray(backupData.deliveredCredentials)) localCache.deliveredCredentials = backupData.deliveredCredentials;
  if (Array.isArray(backupData.resetRequests)) localCache.resetRequests = backupData.resetRequests;

  localStorage.setItem('bongoweb_orders', JSON.stringify(localCache.orders));
  localStorage.setItem('bongoweb_support_chats', JSON.stringify(localCache.supportChats));
  localStorage.setItem('bongoweb_registered_users', JSON.stringify(localCache.users));
  localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(localCache.customWebsites));

  return { success: true, message: 'ডাটাবেজ লোকাল স্টোরেজে রিস্টোর সম্পন্ন হয়েছে।' };
}
