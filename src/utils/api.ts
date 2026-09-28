import { 
  UserAccount, ClientOrder, SupportChatThread, SupportChatMessage, 
  WebsiteDemo, WebsiteDeliveryCredentials, PasswordResetRequest, AdminConfig 
} from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';

const BASE_URL = '';

// Safe fetch wrapper
async function apiRequest<T>(url: string, options?: RequestInit, fallbackLocalKey?: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      ...options
    });
    if (res.ok) {
      const data = await res.json();
      if (fallbackLocalKey && data) {
        try {
          localStorage.setItem(fallbackLocalKey, JSON.stringify(data));
        } catch (_) {}
      }
      return data as T;
    }
  } catch (err) {
    // network or server starting
  }

  // Fallback to local storage
  if (fallbackLocalKey) {
    try {
      const cached = localStorage.getItem(fallbackLocalKey);
      if (cached) return JSON.parse(cached) as T;
    } catch (_) {}
  }
  return null;
}

// ---------------- ORDERS ----------------
export async function apiGetOrders(): Promise<ClientOrder[]> {
  const data = await apiRequest<ClientOrder[]>('/api/orders', { method: 'GET' }, 'bongoweb_orders');
  return data || [];
}

export async function apiCreateOrder(order: ClientOrder): Promise<ClientOrder> {
  // Always update local cache immediately
  try {
    const local = JSON.parse(localStorage.getItem('bongoweb_orders') || '[]');
    local.unshift(order);
    localStorage.setItem('bongoweb_orders', JSON.stringify(local));
    localStorage.setItem('bongoweb_active_pending_order', JSON.stringify(order));
  } catch (_) {}

  const res = await apiRequest<ClientOrder>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order)
  });

  return res || order;
}

export async function apiUpdateOrderStatus(orderId: string, status: 'pending' | 'verified' | 'cancelled'): Promise<ClientOrder[]> {
  const res = await apiRequest<ClientOrder[]>(`/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }, 'bongoweb_orders');

  return res || [];
}

// ---------------- USERS ----------------
export async function apiGetUsers(): Promise<UserAccount[]> {
  const data = await apiRequest<UserAccount[]>('/api/users', { method: 'GET' }, 'bongoweb_registered_users');
  return data || [];
}

export async function apiRegisterUser(user: UserAccount): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const result = await res.json();
    if (result.success && result.user) {
      localStorage.setItem('bongoweb_user', JSON.stringify(result.user));
      sessionStorage.setItem('bongoweb_user', JSON.stringify(result.user));
      const local = JSON.parse(localStorage.getItem('bongoweb_registered_users') || '[]');
      if (!local.some((u: UserAccount) => u.phone === result.user.phone)) {
        local.push(result.user);
        localStorage.setItem('bongoweb_registered_users', JSON.stringify(local));
      }
      return { success: true, user: result.user };
    }
    return { success: false, error: result.error || 'নিবন্ধন ব্যর্থ হয়েছে' };
  } catch (e) {
    // Local fallback
    const local = JSON.parse(localStorage.getItem('bongoweb_registered_users') || '[]');
    if (local.some((u: UserAccount) => u.phone === user.phone || u.email === user.email)) {
      return { success: false, error: 'এই মোবাইল নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে!' };
    }
    local.push(user);
    localStorage.setItem('bongoweb_registered_users', JSON.stringify(local));
    localStorage.setItem('bongoweb_user', JSON.stringify(user));
    sessionStorage.setItem('bongoweb_user', JSON.stringify(user));
    return { success: true, user };
  }
}

// ---------------- LIVE CHAT ----------------
export async function apiGetChatThreads(): Promise<SupportChatThread[]> {
  const data = await apiRequest<SupportChatThread[]>('/api/chat/threads', { method: 'GET' }, 'bongoweb_support_chats');
  return data || [];
}

export async function apiActivateChat(params: {
  name: string;
  phone: string;
  language: 'bn' | 'en';
  welcomeText: string;
}): Promise<SupportChatThread | null> {
  const res = await apiRequest<SupportChatThread>('/api/chat/activate', {
    method: 'POST',
    body: JSON.stringify(params)
  });

  // Local fallback / sync
  const welcomeMsg: SupportChatMessage = {
    id: `init-${Date.now()}`,
    sender: 'admin',
    text: params.welcomeText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const thread: SupportChatThread = res || {
    userPhone: params.phone,
    userName: params.name,
    language: params.language,
    lastMessage: params.welcomeText,
    lastUpdated: 'এখনই',
    unreadAdminCount: 1,
    unreadClientCount: 0,
    expiresAt: Date.now() + 5 * 60 * 1000,
    isClosed: false,
    messages: [welcomeMsg]
  };

  try {
    const stored = JSON.parse(localStorage.getItem('bongoweb_support_chats') || '[]');
    const idx = stored.findIndex((t: SupportChatThread) => t.userPhone === params.phone);
    if (idx >= 0) stored[idx] = thread;
    else stored.unshift(thread);
    localStorage.setItem('bongoweb_support_chats', JSON.stringify(stored));
    localStorage.setItem('bongoweb_chat_active_session', JSON.stringify({
      name: params.name,
      phone: params.phone,
      language: params.language
    }));
  } catch (_) {}

  return thread;
}

export async function apiSendChatMessage(params: {
  phone: string;
  sender: 'client' | 'admin';
  text: string;
  name?: string;
}): Promise<SupportChatMessage> {
  const newMsg: SupportChatMessage = {
    id: `${params.sender}-${Date.now()}`,
    sender: params.sender,
    text: params.text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  try {
    await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        message: newMsg
      })
    });
  } catch (_) {}

  // Update local cache
  try {
    const stored: SupportChatThread[] = JSON.parse(localStorage.getItem('bongoweb_support_chats') || '[]');
    const idx = stored.findIndex((t) => t.userPhone === params.phone);
    if (idx >= 0) {
      stored[idx].messages.push(newMsg);
      stored[idx].lastMessage = params.text;
      stored[idx].lastUpdated = 'এখনই';
      if (params.sender === 'client') {
        stored[idx].unreadAdminCount += 1;
        stored[idx].expiresAt = Date.now() + 5 * 60 * 1000;
        stored[idx].isClosed = false;
      } else {
        stored[idx].unreadClientCount += 1;
      }
    } else {
      stored.unshift({
        userPhone: params.phone,
        userName: params.name || 'Client',
        lastMessage: params.text,
        lastUpdated: 'এখনই',
        unreadAdminCount: params.sender === 'client' ? 1 : 0,
        unreadClientCount: params.sender === 'admin' ? 1 : 0,
        expiresAt: Date.now() + 5 * 60 * 1000,
        isClosed: false,
        messages: [newMsg]
      });
    }
    localStorage.setItem('bongoweb_support_chats', JSON.stringify(stored));
  } catch (_) {}

  return newMsg;
}

export async function apiExtendChatTime(phone: string, additionalMinutes: number = 5): Promise<boolean> {
  try {
    await fetch('/api/chat/extend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, additionalMinutes })
    });
  } catch (_) {}

  // Update local
  try {
    const stored: SupportChatThread[] = JSON.parse(localStorage.getItem('bongoweb_support_chats') || '[]');
    const idx = stored.findIndex((t) => t.userPhone === phone);
    if (idx >= 0) {
      const currentExpiry = stored[idx].expiresAt || Date.now();
      const base = currentExpiry > Date.now() ? currentExpiry : Date.now();
      stored[idx].expiresAt = base + additionalMinutes * 60 * 1000;
      stored[idx].isClosed = false;
      stored[idx].additionalMinutesAdded = (stored[idx].additionalMinutesAdded || 0) + additionalMinutes;
      localStorage.setItem('bongoweb_support_chats', JSON.stringify(stored));
    }
  } catch (_) {}

  return true;
}

export async function apiEndChat(phone: string): Promise<boolean> {
  try {
    await fetch('/api/chat/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
  } catch (_) {}

  try {
    const stored: SupportChatThread[] = JSON.parse(localStorage.getItem('bongoweb_support_chats') || '[]');
    const filtered = stored.filter((t) => t.userPhone !== phone);
    localStorage.setItem('bongoweb_support_chats', JSON.stringify(filtered));
  } catch (_) {}

  return true;
}

// ---------------- WEBSITES / CATALOG ----------------
export async function apiGetWebsites(): Promise<WebsiteDemo[]> {
  const data = await apiRequest<WebsiteDemo[]>('/api/websites', { method: 'GET' }, 'bongoweb_custom_catalog');
  if (data && data.length > 0) return data;
  return WEBSITE_DEMOS;
}

export async function apiUpdateWebsite(code: string, siteData: Partial<WebsiteDemo>): Promise<WebsiteDemo[]> {
  const res = await apiRequest<WebsiteDemo[]>(`/api/websites/${encodeURIComponent(code)}`, {
    method: 'PUT',
    body: JSON.stringify(siteData)
  }, 'bongoweb_custom_catalog');

  if (res) return res;

  // Local fallback
  const local: WebsiteDemo[] = JSON.parse(localStorage.getItem('bongoweb_custom_catalog') || JSON.stringify(WEBSITE_DEMOS));
  const idx = local.findIndex((s) => s.fourDigitCode.replace('#', '') === code.replace('#', ''));
  if (idx >= 0) {
    local[idx] = { ...local[idx], ...siteData };
    localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(local));
  }
  return local;
}

export async function apiAddWebsite(site: WebsiteDemo): Promise<WebsiteDemo[]> {
  const res = await apiRequest<WebsiteDemo[]>('/api/websites', {
    method: 'POST',
    body: JSON.stringify(site)
  }, 'bongoweb_custom_catalog');

  if (res) return res;

  const local: WebsiteDemo[] = JSON.parse(localStorage.getItem('bongoweb_custom_catalog') || JSON.stringify(WEBSITE_DEMOS));
  local.unshift(site);
  localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(local));
  return local;
}

export async function apiDeleteWebsite(code: string): Promise<WebsiteDemo[]> {
  const res = await apiRequest<WebsiteDemo[]>(`/api/websites/${encodeURIComponent(code)}`, {
    method: 'DELETE'
  }, 'bongoweb_custom_catalog');

  if (res) return res;

  const local: WebsiteDemo[] = JSON.parse(localStorage.getItem('bongoweb_custom_catalog') || JSON.stringify(WEBSITE_DEMOS));
  const filtered = local.filter((s) => s.fourDigitCode.replace('#', '') !== code.replace('#', ''));
  localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(filtered));
  return filtered;
}

// ---------------- CREDENTIALS ----------------
export async function apiGetCredentials(): Promise<WebsiteDeliveryCredentials[]> {
  const data = await apiRequest<WebsiteDeliveryCredentials[]>('/api/credentials', { method: 'GET' }, 'bongoweb_delivered_credentials');
  return data || [];
}

export async function apiDeliverCredentials(creds: WebsiteDeliveryCredentials): Promise<WebsiteDeliveryCredentials[]> {
  const res = await apiRequest<WebsiteDeliveryCredentials[]>('/api/credentials', {
    method: 'POST',
    body: JSON.stringify(creds)
  }, 'bongoweb_delivered_credentials');

  if (res) return res;

  const local: WebsiteDeliveryCredentials[] = JSON.parse(localStorage.getItem('bongoweb_delivered_credentials') || '[]');
  local.unshift(creds);
  localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(local));
  return local;
}

export async function apiDeleteCredential(id: string): Promise<WebsiteDeliveryCredentials[]> {
  const res = await apiRequest<WebsiteDeliveryCredentials[]>(`/api/credentials/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  }, 'bongoweb_delivered_credentials');

  if (res) return res;

  const local: WebsiteDeliveryCredentials[] = JSON.parse(localStorage.getItem('bongoweb_delivered_credentials') || '[]');
  const filtered = local.filter((c) => c.id !== id);
  localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(filtered));
  return filtered;
}

// ---------------- PASSWORD RESET REQUESTS ----------------
export async function apiGetResetRequests(): Promise<PasswordResetRequest[]> {
  const data = await apiRequest<PasswordResetRequest[]>('/api/resets', { method: 'GET' }, 'bongoweb_reset_requests');
  return data || [];
}

export async function apiRequestPasswordReset(phone: string): Promise<PasswordResetRequest> {
  const newReq: PasswordResetRequest = {
    id: `RST-${Date.now()}`,
    phone,
    requestedAt: new Date().toLocaleString('bn-BD'),
    status: 'pending'
  };

  try {
    const res = await fetch('/api/resets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq)
    });
    if (res.ok) {
      const saved = await res.json();
      return saved;
    }
  } catch (_) {}

  // Local fallback
  const local: PasswordResetRequest[] = JSON.parse(localStorage.getItem('bongoweb_reset_requests') || '[]');
  local.unshift(newReq);
  localStorage.setItem('bongoweb_reset_requests', JSON.stringify(local));
  return newReq;
}

export async function apiResolveResetRequest(
  id: string, 
  status: 'reset' | 'rejected' | 'call_not_received', 
  newPassword?: string
): Promise<PasswordResetRequest[]> {
  const res = await apiRequest<PasswordResetRequest[]>(`/api/resets/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ status, newPassword })
  }, 'bongoweb_reset_requests');

  if (res) return res;

  const local: PasswordResetRequest[] = JSON.parse(localStorage.getItem('bongoweb_reset_requests') || '[]');
  const idx = local.findIndex((r) => r.id === id);
  if (idx >= 0) {
    local[idx].status = status;
    local[idx].resolvedAt = new Date().toLocaleString('bn-BD');
    if (newPassword) local[idx].newPasswordAssigned = newPassword;
    localStorage.setItem('bongoweb_reset_requests', JSON.stringify(local));
  }
  return local;
}

// ---------------- BACKUP & VAULT ----------------
export async function apiExportCompleteBackup(): Promise<any> {
  try {
    const res = await fetch('/api/backup/export');
    if (res.ok) {
      return await res.json();
    }
  } catch (_) {}

  // Complete client data compile
  return {
    exportedAt: new Date().toISOString(),
    platform: 'BongoWeb.xyz Complete Production Vault',
    version: '4.0.0',
    adminConfig: JSON.parse(localStorage.getItem('bongoweb_admin_config') || '{}'),
    users: JSON.parse(localStorage.getItem('bongoweb_registered_users') || '[]'),
    orders: JSON.parse(localStorage.getItem('bongoweb_orders') || '[]'),
    customWebsites: JSON.parse(localStorage.getItem('bongoweb_custom_catalog') || JSON.stringify(WEBSITE_DEMOS)),
    deliveredCredentials: JSON.parse(localStorage.getItem('bongoweb_delivered_credentials') || '[]'),
    resetRequests: JSON.parse(localStorage.getItem('bongoweb_reset_requests') || '[]'),
    supportChats: JSON.parse(localStorage.getItem('bongoweb_support_chats') || '[]')
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
      const json = await res.json();
      // Mirror to local
      if (backupData.users) localStorage.setItem('bongoweb_registered_users', JSON.stringify(backupData.users));
      if (backupData.orders) localStorage.setItem('bongoweb_orders', JSON.stringify(backupData.orders));
      if (backupData.customWebsites) localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(backupData.customWebsites));
      if (backupData.deliveredCredentials) localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(backupData.deliveredCredentials));
      if (backupData.resetRequests) localStorage.setItem('bongoweb_reset_requests', JSON.stringify(backupData.resetRequests));
      if (backupData.supportChats) localStorage.setItem('bongoweb_support_chats', JSON.stringify(backupData.supportChats));
      if (backupData.adminConfig) localStorage.setItem('bongoweb_admin_config', JSON.stringify(backupData.adminConfig));
      return { success: true, message: 'সম্পূর্ণ ডাটাবেজ সফলভাবে রিস্টোর হয়েছে!' };
    }
  } catch (_) {}

  // Local fallback
  try {
    if (backupData.users) localStorage.setItem('bongoweb_registered_users', JSON.stringify(backupData.users));
    if (backupData.orders) localStorage.setItem('bongoweb_orders', JSON.stringify(backupData.orders));
    if (backupData.customWebsites) localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(backupData.customWebsites));
    if (backupData.deliveredCredentials) localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(backupData.deliveredCredentials));
    if (backupData.resetRequests) localStorage.setItem('bongoweb_reset_requests', JSON.stringify(backupData.resetRequests));
    if (backupData.supportChats) localStorage.setItem('bongoweb_support_chats', JSON.stringify(backupData.supportChats));
    if (backupData.adminConfig) localStorage.setItem('bongoweb_admin_config', JSON.stringify(backupData.adminConfig));
    return { success: true, message: 'সফলভাবে লোকাল ক্যাশ রিস্টোর করা হয়েছে।' };
  } catch (e) {
    return { success: false, message: 'রিস্টোর করতে সমস্যা হয়েছে।' };
  }
}
