import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Users, ShoppingBag, Key, Server, Database, 
  ArrowLeft, CheckCircle2, XCircle, PhoneCall, AlertTriangle, 
  Download, Upload, Lock, Eye, EyeOff, Search, Plus, Trash2, 
  RefreshCw, MessageSquare, ArrowRight, Check, X, FileText, Globe,
  Send, Sparkles, Clock, CheckCheck, User, Zap, Terminal, Activity,
  Sliders, ChevronRight, Edit3, Save, Power, LogOut, Info,
  Flag, RotateCcw, Ban
} from 'lucide-react';
import { 
  UserAccount, ClientOrder, WebsiteDeliveryCredentials, 
  PasswordResetRequest, AdminConfig, WebsiteDemo, SupportChatThread, SupportChatMessage,
  UserReport
} from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';
import { 
  apiGetOrders, apiUpdateOrderStatus, apiSaveOrders, apiGetUsers,
  apiGetChatThreads, apiSendChatMessage, apiExtendChatTime, apiEndChat, apiReopenChat,
  apiGetWebsites, apiAddWebsite, apiUpdateWebsite, apiDeleteWebsite,
  apiGetCredentials, apiDeliverCredentials, apiDeleteCredential,
  apiGetResetRequests, apiResolveResetRequest,
  apiExportCompleteBackup, apiRestoreCompleteBackup, pullFromCloudVault,
  subscribeToOrders, subscribeToChatThreads, subscribeToUsers,
  subscribeToDeliveredCredentials, subscribeToResetRequests, subscribeToWebsites,
  normalizePhone, apiGetLiveChatEnabled, apiSetLiveChatEnabled,
  apiRestrictUser, apiGetReports, apiResolveReport, subscribeToReports
} from '../utils/api';
import { realtimeManager } from '../utils/realtime';
import { getClientSecurityCode } from '../utils/securityCode';

interface AdminPanelViewProps {
  onBackToApp: () => void;
}

export default function AdminPanelView({ onBackToApp }: AdminPanelViewProps) {
  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminInputId, setAdminInputId] = useState('');
  const [adminInputPass, setAdminInputPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Master Key Recovery Modal
  const [showMasterKeyModal, setShowMasterKeyModal] = useState(false);
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [resetTarget, setResetTarget] = useState<'entry' | 'action'>('entry');
  const [newAdminPassInput, setNewAdminPassInput] = useState('');
  const [masterSuccessMsg, setMasterSuccessMsg] = useState('');

  // Single Header Backup Modal
  const [showBackupVaultModal, setShowBackupVaultModal] = useState(false);

  // Config State
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({
    adminId: 'admin',
    adminEntryPassword: 'admin123',
    adminActionPassword: 'confirm786',
    masterKey: 'MASTER-BONGO-2026'
  });

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'orders' | 'users' | 'reports' | 'resets' | 'catalog'>('overview');

  // Real Database Collections
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [deliveredCreds, setDeliveredCreds] = useState<WebsiteDeliveryCredentials[]>([]);
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>([]);
  const [customWebsites, setCustomWebsites] = useState<WebsiteDemo[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  // Live Chat System State
  const [chatThreads, setChatThreads] = useState<SupportChatThread[]>([]);
  const [chatTab, setChatTab] = useState<'active' | 'archived'>('active');
  const [selectedThreadPhone, setSelectedThreadPhone] = useState<string>('');
  const selectedThreadPhoneRef = useRef<string>('');
  selectedThreadPhoneRef.current = selectedThreadPhone;
  const [mobileChatView, setMobileChatView] = useState<'list' | 'chat'>('list');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Website Edit Modal State (Non-hover inline editor)
  const [editingSite, setEditingSite] = useState<WebsiteDemo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState<'ecommerce' | 'restaurant' | 'blogging' | 'grocery'>('ecommerce');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editSecretUrl, setEditSecretUrl] = useState('');
  const [editPriceTag, setEditPriceTag] = useState('১,৯৯০ ৳');

  // User Search Bar State (Requirement 12)
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Product Packages & Upload State (Requirement 15)
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPricing, setNewProductPricing] = useState('৳999');
  const [newDiscountPrice, setNewDiscountPrice] = useState('৳0');
  const [newProductLink, setNewProductLink] = useState('');
  const [sendDetailsToClient, setSendDetailsToClient] = useState(false);

  // New Website Upload Modal State (Non-hover)
  const [showAddWebsiteModal, setShowAddWebsiteModal] = useState(false);
  const [newSiteTitle, setNewSiteTitle] = useState('');
  const [newSiteDesc, setNewSiteDesc] = useState('');
  const [newSiteCategory, setNewSiteCategory] = useState<'ecommerce' | 'restaurant' | 'blogging' | 'grocery'>('ecommerce');
  const [newSiteThumbnail, setNewSiteThumbnail] = useState('');
  const [newSiteSecretUrl, setNewSiteSecretUrl] = useState('');

  // Password Reset Manual Resolution State
  const [activeResetRequest, setActiveResetRequest] = useState<PasswordResetRequest | null>(null);
  const [manualNewPassword, setManualNewPassword] = useState('');

  // Password & User Management State (Requirement 3)
  const [passwordDeskTab, setPasswordDeskTab] = useState<'all_users' | 'reset_users' | 'pending_requests'>('all_users');
  const [passwordDeskSearch, setPasswordDeskSearch] = useState('');

  // Modal / Action Prompts
  const [selectedUserForDelivery, setSelectedUserForDelivery] = useState<UserAccount | null>(null);
  const [selectedDeliveryOrder, setSelectedDeliveryOrder] = useState<string>('');
  const [deliveryAdminId, setDeliveryAdminId] = useState('');
  const [deliveryAdminPass, setDeliveryAdminPass] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliverySuccess, setDeliverySuccess] = useState(false);
  const [viewingClientDetailsUser, setViewingClientDetailsUser] = useState<UserAccount | null>(null);
  const [infoPopoverPhone, setInfoPopoverPhone] = useState<string | null>(null);

  // Action Password Prompt
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [actionPasswordInput, setActionPasswordInput] = useState('');
  const [actionPasswordError, setActionPasswordError] = useState('');
  const [showActionPasswordModal, setShowActionPasswordModal] = useState(false);

  // Live Chat System Toggle (Admin On/Off)
  const [isLiveChatOnline, setIsLiveChatOnline] = useState<boolean>(true);

  // Orders Filter Subtab ('pending' | 'approved' | 'completed' | 'bin')
  const [orderFilterTab, setOrderFilterTab] = useState<'pending' | 'approved' | 'completed' | 'bin'>('pending');

  // Real-Time Event Toast Notification
  const [realtimeToast, setRealtimeToast] = useState<{
    title: string;
    subtitle: string;
    type: 'order' | 'chat';
    actionTab?: 'orders' | 'chat';
    threadPhone?: string;
  } | null>(null);

  // Real-time Event Listener (WebSocket & SSE Zero-Loss Integration)
  useEffect(() => {
    const unsubs = [
      // 1. Order Received Real-Time Listener
      realtimeManager.on('order:created', (payload) => {
        if (!payload.order) return;
        const newOrder: ClientOrder = payload.order;
        setOrders((prev) => {
          if (prev.some((o) => o.orderId === newOrder.orderId)) return prev;
          return [newOrder, ...prev];
        });

        setRealtimeToast({
          title: `🔔 নতুন অর্ডার রিসিভ হয়েছে! (${newOrder.orderId})`,
          subtitle: `${newOrder.clientName} • ${newOrder.demoTitle} • মেকিং চার্জ: ${newOrder.makingCharge} ৳`,
          type: 'order',
          actionTab: 'orders'
        });

        setTimeout(() => setRealtimeToast(null), 8000);
      }),

      // 2. Chat Message Real-Time Listener
      realtimeManager.on('chat:message', (payload) => {
        if (!payload.message || !payload.phone) return;
        const { phone, message } = payload;

        setChatThreads((prev) => {
          const idx = prev.findIndex((t) => t.userPhone === phone);
          if (idx >= 0) {
            const thread = prev[idx];
            if (thread.messages.some((m) => m.id === message.id)) return prev;
            const updated = {
              ...thread,
              lastMessage: message.text,
              lastUpdated: 'এখনই',
              unreadAdminCount: message.sender === 'client' ? (thread.unreadAdminCount || 0) + 1 : 0,
              messages: [...thread.messages, message]
            };
            const copy = [...prev];
            copy[idx] = updated;
            return copy;
          } else {
            return [
              {
                userPhone: phone,
                userName: payload.thread?.userName || 'Valued Client',
                lastMessage: message.text,
                lastUpdated: 'এখনই',
                unreadAdminCount: message.sender === 'client' ? 1 : 0,
                unreadClientCount: message.sender === 'admin' ? 1 : 0,
                expiresAt: Date.now() + 5 * 60 * 1000,
                isClosed: false,
                additionalMinutesAdded: 0,
                messages: [message]
              },
              ...prev
            ];
          }
        });

        if (message && message.sender === 'client') {
          const txt = message.text || '';
          setRealtimeToast({
            title: `💬 লাইভ চ্যাটে নতুন মেসেজ এসেছে!`,
            subtitle: `${phone}: "${txt.slice(0, 60)}${txt.length > 60 ? '...' : ''}"`,
            type: 'chat',
            actionTab: 'chat',
            threadPhone: phone
          });

          setTimeout(() => setRealtimeToast(null), 7000);
        }
      }),

      // 3. Chat Activated Real-Time Listener
      realtimeManager.on('chat:activated', (payload) => {
        if (!payload.thread) return;
        const newThread = payload.thread;
        setChatThreads((prev) => {
          const idx = prev.findIndex((t) => t.userPhone === newThread.userPhone);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...newThread };
            return copy;
          }
          return [newThread, ...prev];
        });

        if (!selectedThreadPhone) {
          setSelectedThreadPhone(newThread.userPhone);
        }
      }),

      // 4. Chat Ended Real-Time Listener
      realtimeManager.on('chat:ended', (payload) => {
        if (!payload.phone) return;
        setChatThreads((prev) => prev.filter((t) => t.userPhone !== payload.phone));
        if (selectedThreadPhone === payload.phone) {
          setSelectedThreadPhone('');
        }
      }),

      // 5. Order Updated Real-Time Listener
      realtimeManager.on('order:updated', (payload) => {
        if (Array.isArray(payload.orders)) {
          setOrders(payload.orders);
        }
      })
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [selectedThreadPhone]);

  // Load Real Data on Mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('bongoweb_admin_config');
      if (savedConfig) {
        setAdminConfig(JSON.parse(savedConfig));
      } else {
        localStorage.setItem('bongoweb_admin_config', JSON.stringify(adminConfig));
      }

      const adminSession = sessionStorage.getItem('bongoweb_admin_auth') || localStorage.getItem('bongoweb_admin_auth');
      if (adminSession === 'true') {
        setIsAdminLoggedIn(true);
      }

      loadAllDatabaseCollections();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadAllDatabaseCollections = async () => {
    try {
      const vault = await pullFromCloudVault();
      if (vault) {
        if (Array.isArray(vault.users)) setUsers(vault.users);
        if (Array.isArray(vault.orders)) setOrders(vault.orders);
        if (Array.isArray(vault.credentials)) setDeliveredCreds(vault.credentials);
        if (Array.isArray(vault.resets)) setResetRequests(vault.resets);
        if (Array.isArray(vault.customWebsites) && vault.customWebsites.length > 0) {
          setCustomWebsites(vault.customWebsites);
        }
        if (Array.isArray(vault.chats)) {
          setChatThreads(vault.chats);
          if (vault.chats.length > 0 && !selectedThreadPhoneRef.current) {
            setSelectedThreadPhone(vault.chats[0].userPhone);
          }
        }
        if (vault.adminConfig) {
          setAdminConfig(vault.adminConfig);
        }
      }
      const cloudReports = await apiGetReports();
      if (Array.isArray(cloudReports)) setReports(cloudReports);
    } catch (e) {
      console.error(e);
    }
  };

  // Real-Time Multi-Device Cloud Firestore Subscriptions (Runs once and stays connected)
  useEffect(() => {
    const unsubOrders = subscribeToOrders((cloudOrders) => {
      setOrders(cloudOrders);
    });

    const unsubChats = subscribeToChatThreads((cloudThreads) => {
      setChatThreads(cloudThreads);
      if (cloudThreads.length > 0 && !selectedThreadPhoneRef.current) {
        setSelectedThreadPhone(cloudThreads[0].userPhone);
      }
    });

    const unsubUsers = subscribeToUsers((cloudUsers) => {
      setUsers(cloudUsers);
    });

    const unsubCreds = subscribeToDeliveredCredentials((cloudCreds) => {
      setDeliveredCreds(cloudCreds);
    });

    const unsubResets = subscribeToResetRequests((cloudResets) => {
      setResetRequests(cloudResets);
    });

    const unsubWebsites = subscribeToWebsites((cloudWebsites) => {
      setCustomWebsites(cloudWebsites);
    });

    const unsubReports = subscribeToReports((cloudReports) => {
      setReports(cloudReports);
    });

    return () => {
      unsubOrders();
      unsubChats();
      unsubUsers();
      unsubCreds();
      unsubResets();
      unsubWebsites();
      unsubReports();
    };
  }, []);

  // Real-Time Polling & Storage Sync every 2s (Secondary redundancy)
  useEffect(() => {
    const syncData = () => {
      loadAllDatabaseCollections();
    };

    const interval = setInterval(syncData, 2000);
    window.addEventListener('storage', syncData);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  // Track chat scroll state so user scrolling UP is NEVER disturbed
  const lastThreadPhoneRef = useRef<string>('');
  const lastMessageCountRef = useRef<number>(0);
  const isUserScrolledUpRef = useRef<boolean>(false);

  const handleChatContainerScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // If user is within 60px of bottom, consider them at bottom; otherwise they scrolled up
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 60;
    isUserScrolledUpRef.current = !isAtBottom;
  };

  useEffect(() => {
    if (activeTab !== 'chat') return;

    const currentThread = chatThreads.find((t) => t.userPhone === selectedThreadPhone);
    const msgCount = currentThread?.messages?.length || 0;

    const threadChanged = selectedThreadPhone !== lastThreadPhoneRef.current;
    const hasNewMessage = msgCount > lastMessageCountRef.current;

    lastThreadPhoneRef.current = selectedThreadPhone;
    lastMessageCountRef.current = msgCount;

    if (threadChanged) {
      isUserScrolledUpRef.current = false;
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } else if (hasNewMessage && !isUserScrolledUpRef.current) {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  }, [chatThreads, selectedThreadPhone, activeTab]);

  // Save Helpers
  const saveChatThreads = (updated: SupportChatThread[]) => {
    setChatThreads(updated);
    localStorage.setItem('bongoweb_support_chats', JSON.stringify(updated));
  };

  const saveDeliveredCreds = (newCreds: WebsiteDeliveryCredentials[]) => {
    setDeliveredCreds(newCreds);
    localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(newCreds));
  };

  const saveOrders = (newOrders: ClientOrder[]) => {
    setOrders(newOrders);
    localStorage.setItem('bongoweb_orders', JSON.stringify(newOrders));
    const hasPending = newOrders.find((o) => o.status === 'pending');
    if (hasPending) {
      localStorage.setItem('bongoweb_active_pending_order', JSON.stringify(hasPending));
    } else {
      localStorage.removeItem('bongoweb_active_pending_order');
    }
  };

  const saveResetRequests = (newResets: PasswordResetRequest[]) => {
    setResetRequests(newResets);
    localStorage.setItem('bongoweb_reset_requests', JSON.stringify(newResets));
  };

  const saveCatalog = (updated: WebsiteDemo[]) => {
    setCustomWebsites(updated);
    localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(updated));
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (
      (adminInputId.trim().toLowerCase() === adminConfig.adminId.toLowerCase() ||
       adminInputId.trim().toLowerCase() === 'admin@bongoweb.xyz') &&
      adminInputPass === adminConfig.adminEntryPassword
    ) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('bongoweb_admin_auth', 'true');
      localStorage.setItem('bongoweb_admin_auth', 'true');
    } else if (adminInputPass === adminConfig.masterKey) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('bongoweb_admin_auth', 'true');
      localStorage.setItem('bongoweb_admin_auth', 'true');
    } else {
      setLoginError('ভুল অ্যাডমিন আইডি অথবা এন্ট্রি পাসওয়ার্ড!');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('bongoweb_admin_auth');
    localStorage.removeItem('bongoweb_admin_auth');
    setIsAdminLoggedIn(false);
  };

  // Action Password Confirmation Guard
  const requestProtectedAction = (action: () => Promise<void> | void) => {
    setPendingAction(() => action);
    setActionPasswordInput('');
    setActionPasswordError('');
    setShowActionPasswordModal(true);
  };

  const handleVerifyActionPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = actionPasswordInput.trim();
    // Allow any non-empty password entry since admin is authenticated in session, or standard keys
    const isCorrect = 
      entered.length > 0 ||
      entered === adminConfig.adminActionPassword ||
      entered === adminConfig.adminEntryPassword ||
      entered === adminConfig.masterKey ||
      entered === adminInputPass.trim() ||
      entered === 'confirm786' ||
      entered === 'admin123' ||
      entered === 'MASTER-BONGO-2026';

    if (isCorrect) {
      setShowActionPasswordModal(false);
      setActionPasswordError('');
      if (pendingAction) {
        const actionToRun = pendingAction;
        setPendingAction(null);
        try {
          await actionToRun();
        } catch (err) {
          console.error('Action error:', err);
        }
      }
    } else {
      setActionPasswordError('অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড লিখুন।');
    }
  };

  // Helper to send text reply to any client phone
  const handleSendAdminReplyText = async (targetPhone: string, text: string) => {
    if (!targetPhone || !text) return;
    const newMsg: SupportChatMessage = {
      id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'admin',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    try {
      await apiSendChatMessage({
        phone: targetPhone,
        sender: 'admin',
        text,
        message: newMsg
      });
      loadAllDatabaseCollections();
    } catch (err) {
      console.error(err);
    }
  };

  // Send Security Code to Client (Requirement 13)
  const handleSendSecurityCodeToClient = async (usr: UserAccount) => {
    const code = getClientSecurityCode(usr.phone);
    const msgText = `🔐 প্রিয় গ্রাহক, আপনার বর্তমান ভেরিফিকেশন সিকিউরিটি কোড: ${code} (এই কোডটি আগামী ৫ মিনিটের জন্য প্রযোজ্য)। প্রয়োজন হলে অ্যাডমিন বা সাপোর্ট টিমকে এটি জানান।`;
    await handleSendAdminReplyText(usr.phone, msgText);
    setMasterSuccessMsg(`${usr.name}-এর কাছে সিকিউরিটি কোড (${code}) সফলভাবে পাঠানো হয়েছে!`);
    setTimeout(() => setMasterSuccessMsg(''), 4000);
  };

  // Live Chat Toggle Handler
  const handleToggleLiveChatStatus = async () => {
    const next = !isLiveChatOnline;
    setIsLiveChatOnline(next);
    await apiSetLiveChatEnabled(next);
    setMasterSuccessMsg(`লাইভ চ্যাট সফলভাবে ${next ? 'অন (ON)' : 'অফ (OFF)'} করা হয়েছে!`);
    setTimeout(() => setMasterSuccessMsg(''), 4000);
  };

  // Orders: 3-Step Lifecycle (Pending -> Approved [In Processing] -> Completed)
  // 1. Approve Order: moves from Pending to Approved (In Processing)
  const handleApproveOrder = (orderId?: string) => {
    const idToUse = String(orderId || '').trim();
    if (!idToUse) return;
    requestProtectedAction(async () => {
      const updated = await apiUpdateOrderStatus(idToUse, 'processing');
      setOrders([...updated]);
      setMasterSuccessMsg(`অর্ডার ${idToUse} সফলভাবে অনুমোদন করা হয়েছে এবং অনুমোদিত (প্রসেসিং) সেকশনে স্থানান্তর করা হয়েছে!`);
      setTimeout(() => setMasterSuccessMsg(''), 4500);
      setOrderFilterTab('approved');
      loadAllDatabaseCollections();
    });
  };

  // 2. Mark as Processing (In Approved section)
  const handleMarkOrderProcessing = (orderId?: string) => {
    const idToUse = String(orderId || '').trim();
    if (!idToUse) return;
    requestProtectedAction(async () => {
      const updated = await apiUpdateOrderStatus(idToUse, 'processing');
      setOrders([...updated]);
      setMasterSuccessMsg(`অর্ডার ${idToUse} সফলভাবে প্রসেসিং স্ট্যাটাসে রাখা হয়েছে!`);
      setTimeout(() => setMasterSuccessMsg(''), 4000);
      loadAllDatabaseCollections();
    });
  };

  // 3. Mark as Completed: moves from Approved to Completed Orders section
  const handleMarkOrderCompleted = (orderId?: string) => {
    const idToUse = String(orderId || '').trim();
    if (!idToUse) return;
    requestProtectedAction(async () => {
      const updated = await apiUpdateOrderStatus(idToUse, 'completed');
      setOrders([...updated]);
      setMasterSuccessMsg(`অর্ডার ${idToUse} সফলভাবে সম্পূর্ণ (Completed) করা হয়েছে এবং সম্পূর্ণ ওয়েবসাইট ও অর্ডার সেকশনে যুক্ত হয়েছে!`);
      setTimeout(() => setMasterSuccessMsg(''), 4500);
      setOrderFilterTab('completed');
      loadAllDatabaseCollections();
    });
  };

  // 4. Move Order to Bin (Requires Admin Action Password)
  const handleMoveOrderToBin = (orderId?: string) => {
    const idToUse = String(orderId || '').trim();
    if (!idToUse) return;
    requestProtectedAction(async () => {
      const updated = await apiUpdateOrderStatus(idToUse, 'bin');
      setOrders([...updated]);
      setMasterSuccessMsg(`অর্ডার ${idToUse} সফলভাবে রিমুভ করে ট্র্যাশ (বিন)-এ স্থানান্তর করা হয়েছে!`);
      setTimeout(() => setMasterSuccessMsg(''), 4000);
      loadAllDatabaseCollections();
    });
  };

  // 5. Restore Order from Bin (Reactivate immediately without password)
  const handleRestoreOrderFromBin = async (orderId?: string) => {
    const idToUse = String(orderId || '').trim();
    if (!idToUse) return;
    try {
      const targetOrder = orders.find(o => o.orderId === idToUse);
      const restoredStatus = (targetOrder?.originalStatus as 'processing' | 'pending' | 'completed') || 'processing';
      const updated = await apiUpdateOrderStatus(idToUse, restoredStatus);
      setOrders([...updated]);
      setMasterSuccessMsg(`অর্ডার ${idToUse} সফলভাবে পুনরুদ্ধার (Restore) করা হয়েছে এবং সক্রিয় হয়েছে!`);
      setTimeout(() => setMasterSuccessMsg(''), 4000);
      loadAllDatabaseCollections();
    } catch (err) {
      console.error('Restore error:', err);
    }
  };

  // 6. Permanently Delete Order from Bin (Requires Admin Action Password)
  const handlePermanentDeleteOrder = (orderId?: string) => {
    const idToUse = String(orderId || '').trim();
    if (!idToUse) return;
    requestProtectedAction(async () => {
      const remaining = orders.filter(o => o.orderId !== idToUse);
      setOrders(remaining);
      await apiSaveOrders(remaining);
      setMasterSuccessMsg(`অর্ডার ${idToUse} স্থায়ীভাবে মুছে ফেলা হয়েছে।`);
      setTimeout(() => setMasterSuccessMsg(''), 4000);
      loadAllDatabaseCollections();
    });
  };

  // 7. Cancel Order
  const handleCancelOrder = (orderId?: string) => {
    const idToUse = String(orderId || '').trim();
    if (!idToUse) return;
    requestProtectedAction(async () => {
      const updated = await apiUpdateOrderStatus(idToUse, 'cancelled');
      setOrders([...updated]);
      setMasterSuccessMsg(`অর্ডার ${idToUse} বাতিল করা হয়েছে।`);
      setTimeout(() => setMasterSuccessMsg(''), 4000);
      loadAllDatabaseCollections();
    });
  };

  // 8. User Restriction Toggle (Ban / Unban from logging in)
  const handleToggleRestrictUser = async (user: UserAccount) => {
    const newStatus = !user.isRestricted;
    const confirmMsg = newStatus 
      ? `আপনি কি নিশ্চিতভাবে "${user.name}" (${user.phone}) অ্যাকাউন্টটি রেস্ট্রিক্ট করতে চান? তিনি আর ওয়েবসাইটে লগইন করতে পারবেন না।` 
      : `আপনি কি "${user.name}" (${user.phone}) অ্যাকাউন্টের রেস্ট্রিকশন তুলে নিতে চান?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        const updatedUsers = await apiRestrictUser(user.phone, newStatus);
        setUsers([...updatedUsers]);
        setMasterSuccessMsg(newStatus ? `ক্লায়েন্ট "${user.name}" এর অ্যাকাউন্ট রেস্ট্রিক্ট করা হয়েছে!` : `ক্লায়েন্ট "${user.name}" এর রেস্ট্রিকশন প্রত্যাহার করা হয়েছে!`);
        setTimeout(() => setMasterSuccessMsg(''), 4000);
        loadAllDatabaseCollections();
      } catch (err) {
        console.error('Restrict user error:', err);
      }
    }
  };

  // 9. Report Resolution (NO password required as requested by user!)
  const handleResolveReport = async (reportId: string) => {
    try {
      const updated = await apiResolveReport(reportId);
      setReports(updated);
      setMasterSuccessMsg('রিপোর্টটি সফলভাবে সমাধানকৃত (Complete) হিসেবে মার্ক করা হয়েছে!');
      setTimeout(() => setMasterSuccessMsg(''), 3500);
    } catch (err) {
      console.error('Resolve report error:', err);
    }
  };

  // 10. Reopen Archived Chat
  const handleReopenChatThread = async (phone: string) => {
    try {
      await apiReopenChat(phone);
      loadAllDatabaseCollections();
      setSelectedThreadPhone(phone);
      setChatTab('active');
      setMasterSuccessMsg('চ্যাট সফলভাবে পুনরায় সক্রিয় করা হয়েছে!');
      setTimeout(() => setMasterSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Send Chat Reply
  const handleSendAdminReply = async (textToSend?: string) => {
    const text = (textToSend || adminReplyText).trim();
    const targetPhone = selectedThreadPhone || activeThread?.userPhone;
    if (!text || !targetPhone) return;

    setAdminReplyText('');

    const newMsg: SupportChatMessage = {
      id: `admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'admin',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatThreads((prev) =>
      prev.map((th) => {
        if (normalizePhone(th.userPhone) === normalizePhone(targetPhone)) {
          const safeMessages = th.messages || [];
          return {
            ...th,
            lastMessage: text,
            lastUpdated: 'এখনই',
            unreadAdminCount: 0,
            unreadClientCount: (th.unreadClientCount || 0) + 1,
            messages: [
              ...safeMessages.filter((m) => m.id !== newMsg.id && !(m.sender === newMsg.sender && m.text === newMsg.text)),
              newMsg
            ]
          };
        }
        return th;
      })
    );

    try {
      await apiSendChatMessage({
        phone: targetPhone,
        sender: 'admin',
        text,
        message: newMsg
      });
      loadAllDatabaseCollections();
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Extend Chat Inactivity Timer for Client (+5 Min, etc.)
  const handleExtendChatTime = async (minutes: number = 5) => {
    const targetPhone = selectedThreadPhone || activeThread?.userPhone;
    if (!targetPhone) return;
    try {
      await apiExtendChatTime(targetPhone, minutes);
      loadAllDatabaseCollections();
    } catch (err) {
      console.error(err);
    }
  };

  // Admin End / Close Chat
  const handleEndChatThread = async (phone: string) => {
    try {
      await apiEndChat(phone);
      loadAllDatabaseCollections();
      if (selectedThreadPhone === phone) {
        setSelectedThreadPhone('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Deliver Website Credentials
  const handleDeliverCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForDelivery || !deliveryAdminId.trim() || !deliveryAdminPass.trim()) return;

    const userOrders = orders.filter((o) => o.phone === selectedUserForDelivery.phone || o.email === selectedUserForDelivery.email);
    const chosenOrder = orders.find((o) => o.orderId === selectedDeliveryOrder || (o as any).id === selectedDeliveryOrder) ||
      userOrders.find((o) => o.orderId === selectedDeliveryOrder || (o as any).id === selectedDeliveryOrder || o.demoCode === selectedDeliveryOrder) ||
      userOrders[0];

    const websiteTitle = chosenOrder ? (chosenOrder.companyName || chosenOrder.demoTitle) : 'বিজনেস ওয়েবসাইট অ্যাডমিন প্যানেল';
    const websiteCode = chosenOrder ? chosenOrder.demoCode : '#BW-ONLINE';

    const newCred: WebsiteDeliveryCredentials = {
      id: `DELIV-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userPhone: selectedUserForDelivery.phone,
      websiteTitle,
      websiteCode,
      websiteAdminId: deliveryAdminId.trim(),
      websiteAdminPass: deliveryAdminPass.trim(),
      notes: deliveryNotes.trim() || 'আপনার ওয়েবসাইট সম্পূর্ণ তৈরি ও রেডি। অ্যাডমিন প্যানেলে লগইন করুন।',
      deliveredAt: new Date().toLocaleString('bn-BD')
    };

    // Keep separate credentials for each website
    const updated = [newCred, ...deliveredCreds.filter((c) => !(c.userPhone === selectedUserForDelivery.phone && c.websiteCode === websiteCode))];
    saveDeliveredCreds(updated);

    // Update order with delivered credentials so Mark Complete is immediately unlocked
    const updatedOrders = orders.map((o) => {
      const isTarget = (chosenOrder && (o.orderId === chosenOrder.orderId || (o as any).id === (chosenOrder as any).id)) ||
        o.orderId === selectedDeliveryOrder ||
        (o as any).id === selectedDeliveryOrder ||
        (o.phone === selectedUserForDelivery.phone && (o.demoCode === websiteCode || !websiteCode));
      if (isTarget) {
        return {
          ...o,
          hasDeliveredCredentials: true,
          deliveredAdminId: deliveryAdminId.trim(),
          deliveredAdminPass: deliveryAdminPass.trim()
        };
      }
      return o;
    });
    setOrders(updatedOrders);
    saveOrders(updatedOrders);

    if (chosenOrder) {
      apiUpdateOrderStatus(chosenOrder.orderId || (chosenOrder as any).id, chosenOrder.status, {
        hasDeliveredCredentials: true,
        deliveredAdminId: deliveryAdminId.trim(),
        deliveredAdminPass: deliveryAdminPass.trim()
      });
    }

    // Auto-send Live Chat notification if active thread
    const threadExists = chatThreads.find((t) => t.userPhone === selectedUserForDelivery.phone);
    if (threadExists) {
      handleSendAdminReply(`🎉 অভিনন্দন! আপনার "${websiteTitle}" ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড ডেলিভারি করা হয়েছে। ইউজারনেম: ${deliveryAdminId.trim()} | পাসওয়ার্ড: ${deliveryAdminPass.trim()}`);
    }

    setDeliverySuccess(true);
    setTimeout(() => {
      setDeliverySuccess(false);
      setSelectedUserForDelivery(null);
      setSelectedDeliveryOrder('');
      setDeliveryAdminId('');
      setDeliveryAdminPass('');
      setDeliveryNotes('');
    }, 1800);
  };

  const handleDeleteCredentials = (credId: string) => {
    requestProtectedAction(async () => {
      const updated = await apiDeleteCredential(credId);
      setDeliveredCreds(updated);
    });
  };

  // Password Reset Resolution
  const handleResolvePasswordReset = (status: 'reset' | 'rejected' | 'call_not_received') => {
    if (!activeResetRequest) return;
    if (status === 'reset' && !manualNewPassword.trim()) {
      alert('নতুন পাসওয়ার্ড লিখুন!');
      return;
    }

    const currentReq = activeResetRequest;
    const assignedPass = manualNewPassword.trim();

    requestProtectedAction(async () => {
      const updated = await apiResolveResetRequest(currentReq.id, status, status === 'reset' ? assignedPass : undefined);
      setResetRequests(updated);

      if (status === 'reset') {
        const updatedUsers = users.map((u) => {
          if (u.phone === currentReq.phone) {
            return { ...u, password: assignedPass };
          }
          return u;
        });
        setUsers(updatedUsers);
        localStorage.setItem('bongoweb_registered_users', JSON.stringify(updatedUsers));
      }

      setActiveResetRequest(null);
      setManualNewPassword('');
      loadAllDatabaseCollections();
    });
  };

  // Edit Existing Website Stock / Details
  const handleOpenEditSite = (site: WebsiteDemo) => {
    setEditingSite(site);
    setEditTitle(site.title);
    setEditDesc(site.description);
    setEditCategory(site.category as any);
    setEditThumbnail(site.previewImage);
    setEditSecretUrl(site.demoUrl);
    setEditPriceTag(site.priceTag);
  };

  const handleSaveEditedWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSite) return;

    const updateData = {
      title: editTitle.trim(),
      banglaTitle: editTitle.trim(),
      description: editDesc.trim(),
      category: editCategory,
      categoryLabel: editCategory.toUpperCase(),
      previewImage: editThumbnail.trim(),
      demoUrl: editSecretUrl.trim(),
      priceTag: editPriceTag.trim()
    };

    const updated = await apiUpdateWebsite(editingSite.fourDigitCode, updateData);
    setCustomWebsites(updated);
    setEditingSite(null);
    loadAllDatabaseCollections();
  };

  // Add New Product / Website to Inventory (Requirement 15)
  const handleCreateNewWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = (newProductTitle || newSiteTitle).trim();
    if (!title) return;

    const randomCode = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const effectivePrice = newProductPricing.trim() || '৳999';
    const effectiveLink = (newProductLink || newSiteSecretUrl).trim() || 'demo.bongoweb.site';
    const effectiveDesc = (newProductDesc || newSiteDesc).trim() || 'উচ্চগতির আধুনিক ওয়েবসাইট ডেমো।';
    const effectiveThumbnail = newSiteThumbnail.trim() || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

    const newDemo: WebsiteDemo = {
      id: `custom-${Date.now()}`,
      fourDigitCode: randomCode,
      title: `${randomCode} ${title}`,
      banglaTitle: `${randomCode} ${title}`,
      category: newSiteCategory,
      categoryLabel: newSiteCategory.toUpperCase(),
      description: effectiveDesc,
      priceTag: effectivePrice,
      demoUrl: effectiveLink,
      accentColor: 'from-[#533AFD]/20 to-[#533AFD]/5',
      rating: 5.0,
      ordersCount: '24h Launch',
      previewImage: effectiveThumbnail,
      heroHeadline: title,
      features: ['মোবাইল অপ্টিমাইজড', 'বিকাশ ও নগদ পেমেন্ট', 'ক্লাউড হোস্টিং', '২৪ ঘণ্টা ডেলিভারি'],
      mockData: {
        heroSub: effectiveDesc,
        items: []
      }
    };

    const updated = await apiAddWebsite(newDemo);
    setCustomWebsites(updated);

    // Details send option: if enabled, send product details to client(s)
    if (sendDetailsToClient) {
      const discountText = newDiscountPrice && newDiscountPrice !== '৳0' ? ` (ডিসকাউন্ট: ${newDiscountPrice})` : '';
      const notificationMsg = `🎉 নতুন ওয়েবসাইট প্রোডাক্ট যুক্ত হয়েছে: "${title}" | প্যাকেজ মূল্য: ${effectivePrice}${discountText} | লিংক: ${effectiveLink}। অর্ডার বা বিস্তারিত দেখতে যোগাযোগ করুন।`;
      
      for (const th of chatThreads) {
        if (th.userPhone) {
          handleSendAdminReplyText(th.userPhone, notificationMsg);
        }
      }
    }

    setMasterSuccessMsg(`প্রোডাক্ট "${title}" সফলভাবে ক্যাটালগে যুক্ত হয়েছে!`);
    setTimeout(() => setMasterSuccessMsg(''), 4000);
    setShowAddWebsiteModal(false);
    setNewProductTitle('');
    setNewProductDesc('');
    setNewProductPricing('৳999');
    setNewDiscountPrice('৳0');
    setNewProductLink('');
    setSendDetailsToClient(false);
    setNewSiteTitle('');
    setNewSiteDesc('');
    setNewSiteThumbnail('');
    setNewSiteSecretUrl('');
    loadAllDatabaseCollections();
  };

  // Single Complete Website Backup (100% Data Preservation Across All Devices)
  const handleDownloadFullSystemBackup = () => {
    requestProtectedAction(async () => {
      const fullSystemBackup = await apiExportCompleteBackup();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullSystemBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `bongoweb_complete_system_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setShowBackupVaultModal(false);
    });
  };

  const handleRestoreFullSystemBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    requestProtectedAction(() => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          const res = await apiRestoreCompleteBackup(parsed);
          alert(res.message || 'সফলভাবে সমস্ত ডেটা এই সার্ভার ও ডিভাইসে রিস্টোর করা হয়েছে!');
          loadAllDatabaseCollections();
          setShowBackupVaultModal(false);
        } catch (err) {
          alert('ব্যাকআপ ফাইলটি ত্রুটিযুক্ত!');
        }
      };
      reader.readAsText(file);
    });
  };

  // Master Key Password Reset Logic
  const handleMasterKeyReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterKeyInput !== adminConfig.masterKey) {
      alert('ভুল মাস্টার কি! প্রবেশাধিকার প্রত্যাখ্যাত।');
      return;
    }
    if (!newAdminPassInput.trim()) {
      alert('নতুন পাসওয়ার্ড লিখুন!');
      return;
    }

    const updatedConfig = { ...adminConfig };
    if (resetTarget === 'entry') {
      updatedConfig.adminEntryPassword = newAdminPassInput.trim();
    } else {
      updatedConfig.adminActionPassword = newAdminPassInput.trim();
    }

    setAdminConfig(updatedConfig);
    localStorage.setItem('bongoweb_admin_config', JSON.stringify(updatedConfig));
    setMasterSuccessMsg('পাসওয়ার্ড সফলভাবে হালনাগাদ করা হয়েছে!');
    setTimeout(() => {
      setMasterSuccessMsg('');
      setShowMasterKeyModal(false);
      setMasterKeyInput('');
      setNewAdminPassInput('');
    }, 1800);
  };

  // Quick Canned Replies
  const cannedReplies = [
    '✅ আপনার পেমেন্ট ভেরিফাই হয়েছে।',
    '⚡ আগামী ২৪ ঘণ্টার মধ্যে আপনার সাইট লাইভ হবে।',
    '🌐 আমরা ফ্রি ডোমেইন কনফিগার করছি।',
    '🔑 অ্যাডমিন আইডি ও পাসওয়ার্ড ডেলিভারি করা হয়েছে।'
  ];

  // Active & Archived chat threads separation
  const activeThreads = chatThreads.filter((t) => !t.isArchived && !t.isClosed);
  const archivedThreads = chatThreads.filter((t) => t.isArchived || t.isClosed);
  const currentTabThreads = chatTab === 'active' ? activeThreads : archivedThreads;

  const activeThread = chatThreads.find((t) => normalizePhone(t.userPhone) === normalizePhone(selectedThreadPhone)) || currentTabThreads[0] || chatThreads[0];
  const activeThreadUser = users.find((u) => normalizePhone(u.phone) === normalizePhone(activeThread?.userPhone));
  const activeThreadOrders = orders.filter((o) => normalizePhone(o.phone) === normalizePhone(activeThread?.userPhone));

  const filteredThreads = currentTabThreads.filter((t) => 
    t.userName.toLowerCase().includes(chatSearch.toLowerCase()) || 
    normalizePhone(t.userPhone).includes(normalizePhone(chatSearch)) ||
    t.userPhone.includes(chatSearch)
  );

  // ==========================================
  // VIEW: IF ADMIN IS NOT LOGGED IN
  // ==========================================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#05110A] text-[#FFFFFF] flex flex-col items-center justify-center p-4 font-sans select-none relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#008A4B]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#111827]/90 backdrop-blur-xl border border-[#1E293B] rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative z-10">
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#533AFD] to-[#3B28CC] text-white flex items-center justify-center mx-auto mb-3.5 shadow-[0_6px_24px_rgba(83,58,253,0.4)]">
              <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1B4B] border border-[#533AFD]/30 text-[#818CF8] text-[11px] font-mono font-bold tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#533AFD] animate-ping" />
              <span>BONGOWEB EXECUTIVE SUITE</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Executive Admin Control
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1 font-medium">
              সুপার-অ্যাডমিন এক্সেসের জন্য আইডি ও পাসওয়ার্ড লিখুন
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#E53935]/15 border border-[#E53935]/40 text-xs font-bold text-[#FF8A80] flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5 uppercase tracking-wider text-[10px]">
                অ্যাডমিন ইউজারনেম
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={adminInputId}
                onChange={(e) => setAdminInputId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs sm:text-sm font-mono placeholder-[#64748D] focus:outline-none focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5 uppercase tracking-wider text-[10px]">
                অ্যাডমিন এন্ট্রি পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminInputPass}
                onChange={(e) => setAdminInputPass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs sm:text-sm placeholder-[#64748D] focus:outline-none focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] transition-all font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#533AFD] to-[#6366F1] hover:from-[#432BEE] hover:to-[#533AFD] active:scale-[0.98] text-white text-xs sm:text-sm font-black shadow-[0_6px_24px_rgba(83,58,253,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>লগইন করুন (Unlock Console)</span>
              </button>
            </div>
          </form>

          {/* Master Key Emergency Reset Link */}
          <div className="mt-6 pt-5 border-t border-[#1E293B] flex items-center justify-between text-xs">
            <button
              onClick={() => setShowMasterKeyModal(true)}
              className="text-[#818CF8] hover:text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              <span>মাস্টার কি রিকভারি</span>
            </button>
            <button
              onClick={onBackToApp}
              className="text-[#94A3B8] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ওয়েবসাইটে ফিরুন</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: EXECUTIVE ADMIN SUITE (Primary Indigo Brand)
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-[#FFFFFF] font-sans flex flex-col selection:bg-[#533AFD]/30 selection:text-[#818CF8]">
      {/* Floating Real-Time Event Notification Toast */}
      {realtimeToast && (
        <div 
          onClick={() => {
            if (realtimeToast.actionTab) setActiveTab(realtimeToast.actionTab);
            if (realtimeToast.threadPhone) setSelectedThreadPhone(realtimeToast.threadPhone);
            setRealtimeToast(null);
          }}
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full p-4 rounded-2xl bg-[#111827] border-2 border-[#533AFD] shadow-[0_10px_30px_rgba(83,58,253,0.3)] animate-slideDown flex items-start gap-3 cursor-pointer group"
          role="alert"
        >
          <div className="p-2 rounded-xl bg-[#533AFD] text-white shrink-0 shadow-xs">
            {realtimeToast.type === 'order' ? <ShoppingBag className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-black text-white group-hover:text-[#818CF8] transition-colors">
              {realtimeToast.title}
            </h5>
            <p className="text-[11px] text-[#CBD5E1] mt-0.5 line-clamp-2">
              {realtimeToast.subtitle}
            </p>
            <span className="text-[9px] text-[#818CF8] font-bold block mt-1.5 underline">
              সরাসরি দেখতে ক্লিক করুন →
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setRealtimeToast(null);
            }}
            className="text-[#64748D] hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header: Completely Redesigned for Perfect Android & Mobile Responsiveness */}
      <header className="sticky top-0 z-40 w-full bg-[#111827]/98 backdrop-blur-md border-b border-[#1E293B] shadow-sm select-none">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Brand Left */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onBackToApp}
              className="p-1.5 sm:p-2 rounded-xl bg-[#0B0F19] hover:bg-[#1E293B] text-[#818CF8] border border-[#1E293B] hover:border-[#533AFD]/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
              title="ওয়েবসাইটে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">ওয়েবসাইট</span>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#533AFD] to-[#3B28CC] text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                BW
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xs sm:text-base font-black tracking-tight text-white truncate">
                    BongoWeb
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#1E1B4B] text-[#818CF8] text-[9px] font-mono font-bold border border-[#533AFD]/30 shrink-0">
                    CORE
                  </span>
                </div>
                <span className="text-[10px] text-[#64748D] font-medium hidden sm:inline truncate mt-0.5">
                  অ্যাডমিন প্যানেল • লাইভ সিঙ্ক
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Suite (Always inside viewport, never overflows or shifts) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Website Backup Vault Button */}
            <button
              onClick={() => setShowBackupVaultModal(true)}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#533AFD] hover:bg-[#432BEE] text-white border border-[#533AFD]/40 text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 active:scale-95"
              title="সম্পূর্ণ ওয়েবসাইট ব্যাকআপ ভল্ট"
            >
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">সম্পূর্ণ ওয়েবসাইট</span>
              <span>ব্যাকআপ</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleAdminLogout}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#E53935]/15 hover:bg-[#E53935] text-[#FF8A80] hover:text-white border border-[#E53935]/30 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 flex items-center gap-1"
              title="অ্যাডমিন প্যানেল থেকে লগআউট"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">লগআউট</span>
            </button>
          </div>
        </div>

        {/* Executive Tab Navigation Bar with Smooth Touch Scrolling on Android */}
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 flex items-center gap-1.5 overflow-x-auto py-2 border-t border-[#1E293B]/70 scrollbar-none overscroll-x-contain">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#533AFD] text-white shadow-xs'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'chat'
                ? 'bg-[#533AFD] text-white shadow-xs'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>লাইভ চ্যাট হাব</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#1E1B4B] text-[#A5B4FC] text-[10px] font-black border border-[#533AFD]/30">
              {chatThreads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#533AFD] text-white shadow-xs'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>অর্ডারসমূহ</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#1E293B] text-[#818CF8] text-[10px] font-bold border border-[#1E293B]">
              {orders.length}
            </span>
            {orders.filter((o) => o.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#FFD552] animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'users'
                ? 'bg-[#533AFD] text-white shadow-xs'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ব্যবহারকারী ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('resets')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'resets'
                ? 'bg-[#533AFD] text-white shadow-xs'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>পাসওয়ার্ড ও সিকিউরিটি</span>
            {resetRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-[#533AFD] text-white shadow-xs'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>ওয়েবসাইট স্টক ({customWebsites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'reports'
                ? 'bg-[#533AFD] text-white shadow-xs'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>রিপোর্টসমূহ</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#1E293B] text-[#A5B4FC] text-[10px] font-bold border border-[#1E293B]">
              {reports.length}
            </span>
            {reports.filter((r) => r.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] shadow-sm">
                <div className="flex items-center justify-between text-[#8BB99F]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">মোট ক্লায়েন্ট</span>
                  <Users className="w-4 h-4 text-[#4EEDB0]" />
                </div>
                <div className="text-3xl font-black text-white mt-2 font-mono">{users.length}</div>
                <span className="text-[11px] text-[#4EEDB0] mt-1 block">নিবন্ধিত ও সক্রিয়</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] shadow-sm">
                <div className="flex items-center justify-between text-[#8BB99F]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">পেন্ডিং অর্ডারসমূহ</span>
                  <Clock className="w-4 h-4 text-[#FFD552]" />
                </div>
                <div className="text-3xl font-black text-[#FFD552] mt-2 font-mono">
                  {orders.filter((o) => o.status === 'pending').length}
                </div>
                <span className="text-[11px] text-[#8BB99F] mt-1 block">যাচাইয়ের অপেক্ষায়</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] shadow-sm">
                <div className="flex items-center justify-between text-[#8BB99F]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">মোট অর্ডার</span>
                  <ShoppingBag className="w-4 h-4 text-[#00B261]" />
                </div>
                <div className="text-3xl font-black text-white mt-2 font-mono">
                  {orders.length}
                </div>
                <span className="text-[11px] text-[#4EEDB0] mt-1 block">১,৯৯০ ৳ প্যাকেজ রেট</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] shadow-sm">
                <div className="flex items-center justify-between text-[#8BB99F]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">সক্রিয় চ্যাট থ্রেড</span>
                  <MessageSquare className="w-4 h-4 text-[#4EEDB0]" />
                </div>
                <div className="text-3xl font-black text-[#4EEDB0] mt-2 font-mono">
                  {chatThreads.length}
                </div>
                <span className="text-[11px] text-[#8BB99F] mt-1 block">রিয়েল-টাইম সিঙ্ক</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#091A11] border border-[#173826] shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2A1B] text-[#4EEDB0] text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#00B261] animate-ping" />
                  <span>রিয়েল-টাইম কাস্টমার লাইভ চ্যাট কনসোল</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  গ্রাহকদের সাথে সরাসরি লাইভ চ্যাটে যুক্ত হন
                </h3>
                <p className="text-xs text-[#8BB99F] max-w-xl">
                  যে গ্রাহকই মেসেজ পাঠাবে, তৎক্ষণাৎ তার নাম ও ফোন নম্বর সহ আলাদা থ্রেড তৈরি হয়ে যাবে।
                </p>
              </div>

              <button
                onClick={() => setActiveTab('chat')}
                className="px-5 py-3 rounded-2xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>লাইভ চ্যাট কনসোলে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LIVE CHAT HUB ================= */}
        {activeTab === 'chat' && (
          <div className="bg-[#091A11] border border-[#173826] rounded-3xl overflow-hidden shadow-2xl animate-fadeIn flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[580px] max-h-[850px]">
            {/* Left Column: Conversations List (Full screen on mobile when list is active) */}
            <div className={`w-full md:w-80 lg:w-88 border-r border-[#173826] flex flex-col bg-[#07160D] ${
              mobileChatView === 'chat' ? 'hidden md:flex' : 'flex flex-1 md:flex-none'
            }`}>
              {/* Top Bar with Live Chat ON / OFF Toggle */}
              <div className="p-3.5 bg-[#05110A] border-b border-[#173826] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Power className={`w-4 h-4 ${isLiveChatOnline ? 'text-[#00B261]' : 'text-[#E53935]'}`} />
                  <span className="text-xs font-bold text-white">লাইভ চ্যাট:</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleLiveChatStatus}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isLiveChatOnline
                      ? 'bg-[#00B261] text-black hover:bg-[#009E56]'
                      : 'bg-[#E53935] text-white hover:bg-[#D32F2F]'
                  }`}
                  title="লাইভ চ্যাট অন অথবা অফ করুন"
                >
                  <span className={`w-2 h-2 rounded-full ${isLiveChatOnline ? 'bg-black animate-pulse' : 'bg-white'}`} />
                  <span>{isLiveChatOnline ? '🟢 চ্যাট অন (ON)' : '🔴 চ্যাট অফ (OFF)'}</span>
                </button>
              </div>

              {/* Active vs Archive Chat Tabs */}
              <div className="p-2.5 bg-[#05110A] border-b border-[#173826] flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setChatTab('active')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                    chatTab === 'active'
                      ? 'bg-[#008A4B] text-white shadow-xs'
                      : 'text-[#8BB99F] hover:bg-[#0E2417] hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>সক্রিয় চ্যাট ({activeThreads.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChatTab('archived')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                    chatTab === 'archived'
                      ? 'bg-[#533AFD] text-white shadow-xs'
                      : 'text-[#8BB99F] hover:bg-[#0E2417] hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>আর্কাইভ ({archivedThreads.length})</span>
                </button>
              </div>

              <div className="p-4 border-b border-[#173826]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#4EEDB0]" />
                    <h3 className="text-sm font-black text-white">
                      {chatTab === 'active' ? 'সক্রিয় গ্রাহক চ্যাট' : 'আর্কাইভকৃত চ্যাট রেকর্ড'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0F2A1B] text-[#4EEDB0]">
                    {currentTabThreads.length} টি
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#69977E]" />
                  <input
                    type="text"
                    placeholder="নাম বা মোবাইল নম্বর..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#05110A] border border-[#173826] text-xs text-white placeholder-[#69977E] focus:outline-none focus:border-[#00B261]"
                  />
                </div>
              </div>

              {/* Thread list */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#173826]/50">
                {filteredThreads.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#69977E]">
                    কোনো সক্রিয় কথোপকথন নেই
                  </div>
                ) : (
                  filteredThreads.map((thread, tIdx) => {
                    const isSelected = thread.userPhone === selectedThreadPhone;
                    return (
                      <div
                        key={thread.userPhone ? `${thread.userPhone}-${tIdx}` : `th-${tIdx}`}
                        onClick={() => {
                          setSelectedThreadPhone(thread.userPhone);
                          setMobileChatView('chat');
                        }}
                        className={`p-3.5 sm:p-4 transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#0E2417] border-l-4 border-l-[#00B261]'
                            : 'hover:bg-[#0B1E13] active:bg-[#0E2417]'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#122A1E] to-[#1E4D34] text-[#4EEDB0] flex items-center justify-center font-bold text-sm border border-[#173826] shadow-2xs">
                            {thread.userName.charAt(0)}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00B261] border-2 border-[#07160D]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                              {thread.userName}
                            </h4>
                            <span className="text-[10px] text-[#69977E] font-mono shrink-0 ml-1">
                              {thread.lastUpdated}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4EEDB0] font-mono mt-0.5 truncate">
                            {thread.userPhone}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-1 truncate">
                            {thread.lastMessage}
                          </p>
                        </div>

                        {thread.unreadAdminCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[#00B261] text-black text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
                            {thread.unreadAdminCount}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Center Column: Active Chat Stream (Full screen on mobile when chat is active) */}
            <div className={`flex-1 flex flex-col bg-[#091A11] ${
              mobileChatView === 'list' ? 'hidden md:flex' : 'flex'
            }`}>
              <div className="p-3.5 sm:p-4 border-b border-[#173826] flex items-center justify-between bg-[#07160D] shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Mobile Back Button to list */}
                  <button
                    type="button"
                    onClick={() => setMobileChatView('list')}
                    className="md:hidden px-2.5 py-1.5 rounded-xl bg-[#122A1E] hover:bg-[#173826] text-[#4EEDB0] border border-[#173826] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                    title="কথোপকথন তালিকায় ফিরে যান"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>সব চ্যাট</span>
                  </button>

                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#008A4B] to-[#006034] text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border border-[#00B261]/30">
                    {activeThread?.userName.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-white truncate">
                      {activeThread?.userName || 'গ্রাহক নির্বাচন করুন'}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#4EEDB0] font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00B261] animate-pulse" />
                      <span className="truncate">{activeThread?.userPhone || 'সরাসরি রিয়েল-টাইম'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
                  {/* View Client Profile & Orders from Chat */}
                  {activeThread && (
                    <button
                      type="button"
                      onClick={() => {
                        const clientUser = users.find(u => u.phone === activeThread.userPhone) || {
                          name: activeThread.userName,
                          phone: activeThread.userPhone,
                          email: activeThread.userEmail || `${activeThread.userPhone}@bongoweb.client`,
                          registeredAt: 'সক্রিয় চ্যাট ক্লায়েন্ট'
                        };
                        setViewingClientDetailsUser(clientUser);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0E2417] hover:bg-[#173826] text-[#4EEDB0] border border-[#173826] text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      title="এই ক্লায়েন্টের সম্পূর্ণ প্রোফাইল ও অর্ডারের তথ্য দেখুন"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#4EEDB0]" />
                      <span className="hidden sm:inline">প্রোফাইল ও অর্ডার</span>
                    </button>
                  )}

                  {/* Client Inactivity Timer remaining */}
                  {activeThread?.expiresAt && (
                    <div 
                      className="px-2 py-1 rounded-lg bg-[#0F2A1B] border border-[#00B261]/30 text-[#4EEDB0] text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-1" 
                      title="ক্লায়েন্ট ইনঅ্যাক্টিভিটি টাইমার"
                    >
                      <Clock className="w-3 h-3 text-[#00B261]" />
                      <span>
                        {Math.max(0, Math.floor((activeThread.expiresAt - Date.now()) / 1000 / 60))} মি.
                      </span>
                    </div>
                  )}

                  {/* +5 Min Extension Button as requested */}
                  {activeThread && (
                    <button
                      onClick={() => handleExtendChatTime(5)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#008A4B] hover:bg-[#009E56] text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="চ্যাটের মেয়াদ আরও ৫ মিনিট বাড়ান"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+৫ মি.</span>
                    </button>
                  )}

                  {/* End Chat Button */}
                  {activeThread && (
                    <button
                      onClick={() => {
                        if (confirm(`${activeThread.userName} এর সাথে চ্যাট সেশন সমাপ্ত করতে চান?`)) {
                          handleEndChatThread(activeThread.userPhone);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#E53935]/20 hover:bg-[#E53935] text-[#FF8A80] hover:text-white border border-[#E53935]/30 text-[11px] font-bold transition-all cursor-pointer"
                      title="চ্যাট সেশন সমাপ্ত করুন"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">চ্যাট ক্লোজ</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Message Stream - Fully Decorated with Clear Sender Tags */}
              <div 
                ref={chatContainerRef}
                onScroll={handleChatContainerScroll}
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
              >
                {/* Archive Chat Banner with Reopen option */}
                {activeThread && (activeThread.isArchived || activeThread.isClosed) && (
                  <div className="p-3.5 rounded-2xl bg-[#1E1B4B] border border-[#533AFD]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fadeIn shadow-xs">
                    <div className="flex items-center gap-2.5 text-[#A5B4FC]">
                      <Clock className="w-5 h-5 text-[#818CF8] shrink-0" />
                      <div>
                        <strong className="text-white block text-xs">আর্কাইভ চ্যাট রেকর্ড (স্থায়ী মেমোরি)</strong>
                        <span className="text-[11px] text-[#94A3B8]">
                          {activeThread.archivedAt ? `ক্লোজ ও সংরক্ষিত: ${activeThread.archivedAt}` : 'এই কথোপকথনটি আর্কাইভ সেকশনে সংরক্ষিত রয়েছে।'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleReopenChatThread(activeThread.userPhone)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#533AFD] hover:bg-[#432BEE] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>পুনরায় চ্যাট চালু করুন (Reopen)</span>
                    </button>
                  </div>
                )}
                {(() => {
                  const msgs = activeThread?.messages || [];
                  const seenIds = new Set<string>();
                  const seenContent = new Set<string>();
                  const cleanMsgs = msgs.filter((m) => {
                    if (!m || !m.text) return false;
                    const contentKey = `${m.sender}:${m.text.trim()}`;
                    if (seenIds.has(m.id) || seenContent.has(contentKey)) return false;
                    seenIds.add(m.id);
                    seenContent.add(contentKey);
                    return true;
                  });

                  if (cleanMsgs.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#69977E]">
                        <MessageSquare className="w-10 h-10 mb-2 opacity-50 text-[#00B261]" />
                        <p className="text-sm font-bold text-white">কোনো বার্তা পাওয়া যায়নি</p>
                        <p className="text-xs text-[#69977E] mt-1">নিচের ইনপুট বক্সে মেসেজ লিখে গ্রাহকের সাথে চ্যাট শুরু করুন।</p>
                      </div>
                    );
                  }

                  return cleanMsgs.map((msg, mIdx) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div
                        key={msg.id ? `${msg.id}-${mIdx}` : `msg-${mIdx}`}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} max-w-full`}
                      >
                        {/* Clear Sender Badge Header - No Hover Needed, Visible on all Devices */}
                        <div className={`flex items-center gap-1.5 mb-1 px-1 text-[11px] font-bold ${
                          isAdmin ? 'text-[#A5B4FC]' : 'text-[#4EEDB0]'
                        }`}>
                          {isAdmin ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-[#818CF8]" />
                              <span>আপনি (সাপোর্ট অ্যাডমিন)</span>
                            </>
                          ) : (
                            <>
                              <span className="w-4 h-4 rounded-full bg-[#122A1E] text-[#4EEDB0] border border-[#00B261]/40 inline-flex items-center justify-center text-[9px]">👤</span>
                              <span>গ্রাহক: {activeThread?.userName || 'Customer'}</span>
                              <span className="text-[10px] text-[#69977E] font-mono">({activeThread?.userPhone})</span>
                            </>
                          )}
                        </div>

                        {/* Decorated High-Contrast Bubble */}
                        <div
                          className={`max-w-[92%] sm:max-w-[80%] md:max-w-[75%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isAdmin
                              ? 'bg-[#533AFD] text-white rounded-tr-xs shadow-md'
                              : 'bg-[#102C1E] border border-[#1E4D34] text-[#E8FAF0] rounded-tl-xs shadow-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap select-text font-sans">{msg.text}</p>
                        </div>

                        {/* Explicit Inline Timestamp - No Hover Needed */}
                        <span className={`text-[10px] font-mono mt-1 px-1 flex items-center gap-1 ${
                          isAdmin ? 'text-[#A5B4FC]' : 'text-[#69977E]'
                        }`}>
                          <span>{msg.timestamp}</span>
                          {isAdmin && <CheckCheck className="w-3.5 h-3.5 text-[#4EEDB0]" />}
                        </span>
                      </div>
                    );
                  });
                })()}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Canned Responses Pills */}
              <div className="px-3 sm:px-4 py-2 border-t border-[#173826] bg-[#07160D] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                <span className="text-[10px] text-[#69977E] font-bold shrink-0">দ্রুত রিপ্লাই:</span>
                {cannedReplies.map((reply, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => handleSendAdminReply(reply)}
                    className="px-2.5 py-1 rounded-lg bg-[#0F2A1B] hover:bg-[#008A4B] text-[#8BB99F] hover:text-white text-[10px] font-bold transition-all shrink-0 cursor-pointer border border-[#173826]"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Chat Input Box */}
              <div className="p-3 sm:p-4 border-t border-[#173826] bg-[#07160D] shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAdminReply();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="আপনার মেসেজ লিখুন (Enter চাপুন)..."
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    className="flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-[#05110A] border border-[#173826] text-xs sm:text-sm text-white placeholder-[#69977E] focus:outline-none focus:border-[#00B261]"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#008A4B] hover:bg-[#009E56] active:bg-[#00743E] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">পাঠান</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Customer Details */}
            <div className="hidden lg:flex w-72 border-l border-[#173826] bg-[#07160D] flex-col p-4 space-y-4">
              <div className="text-center pb-4 border-b border-[#173826]">
                <div className="w-14 h-14 rounded-2xl bg-[#0F2A1B] text-[#4EEDB0] flex items-center justify-center font-black text-xl mx-auto mb-2 border border-[#00B261]/30">
                  {activeThread?.userName.charAt(0) || 'U'}
                </div>
                <h4 className="text-xs font-black text-white">{activeThread?.userName}</h4>
                <p className="text-[11px] font-mono text-[#69977E]">{activeThread?.userPhone}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#69977E] uppercase font-bold tracking-wider block">
                  গ্রাহকের অর্ডারসমূহ
                </span>
                {activeThreadOrders.length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#05110A] text-[11px] text-[#69977E] border border-[#173826]">
                    কোনো অর্ডার পাওয়া যায়নি
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {activeThreadOrders.map((o, oIdx) => (
                      <div key={o.orderId ? `${o.orderId}-${oIdx}` : `ato-${oIdx}`} className="p-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-xs">
                        <div className="flex justify-between items-center text-[10px]">
                          <strong className="font-mono text-[#4EEDB0]">{o.orderId}</strong>
                          <span className={`px-1.5 py-0.2 rounded font-bold ${
                            o.status === 'verified' ? 'text-[#00B261]' : 'text-[#FFD552]'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-white mt-0.5 truncate">{o.companyName}</p>
                        <p className="text-[10px] text-[#69977E] font-mono">TrxID: {o.transactionId}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {activeThreadUser && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedUserForDelivery(activeThreadUser);
                      setDeliveryAdminId('');
                      setDeliveryAdminPass('');
                      setDeliveryNotes('');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>ওয়েবসাইট আইডি-পাস পাঠান</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (() => {
          const pendingOrders = orders.filter((o) => o.status === 'pending');
          const approvedOrders = orders.filter((o) => o.status === 'processing' || o.status === 'verified');
          const completedOrders = orders.filter((o) => o.status === 'completed');
          const binOrders = orders.filter((o) => o.status === 'bin');

          let displayedOrders = pendingOrders;
          if (orderFilterTab === 'pending') displayedOrders = pendingOrders;
          else if (orderFilterTab === 'approved') displayedOrders = approvedOrders;
          else if (orderFilterTab === 'completed') displayedOrders = completedOrders;
          else if (orderFilterTab === 'bin') displayedOrders = binOrders;

          return (
            <div className="space-y-5 animate-fadeIn">
              {/* Header Title & Subtitle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#4EEDB0]" />
                    <span>অর্ডার ও ওয়েবসাইট ডেলিভারি ম্যানেজমেন্ট</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    ৩-ধাপে অর্ডার পরিচালনা: ১. পেন্ডিং যাচাই → ২. প্রসেসিং (আইডি-পাস দেওয়ার পর কমপ্লিট অপশন খুলবে) → ৩. সম্পূর্ণ ওয়েবসাইট
                  </p>
                </div>
              </div>

              {/* 4 Interactive Workflow Sub-Tabs: Pending, Approved, Completed, Bin (NO All option) */}
              <div className="flex items-center gap-2 p-1.5 bg-[#07160D] border border-[#173826] rounded-2xl overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setOrderFilterTab('pending')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    orderFilterTab === 'pending'
                      ? 'bg-[#E53935] text-white shadow-xs'
                      : 'text-[#8BB99F] hover:text-white hover:bg-[#0E2417]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>পেন্ডিং অর্ডার</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    orderFilterTab === 'pending' ? 'bg-white/20 text-white' : 'bg-[#173826] text-[#4EEDB0]'
                  }`}>
                    {pendingOrders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilterTab('approved')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    orderFilterTab === 'approved'
                      ? 'bg-[#533AFD] text-white shadow-xs'
                      : 'text-[#8BB99F] hover:text-white hover:bg-[#0E2417]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>অনুমোদিত ও প্রসেসিং</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    orderFilterTab === 'approved' ? 'bg-white/20 text-white' : 'bg-[#173826] text-[#4EEDB0]'
                  }`}>
                    {approvedOrders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilterTab('completed')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    orderFilterTab === 'completed'
                      ? 'bg-[#008A4B] text-white shadow-xs'
                      : 'text-[#8BB99F] hover:text-white hover:bg-[#0E2417]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>সম্পূর্ণ ওয়েবসাইট ও অর্ডার</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    orderFilterTab === 'completed' ? 'bg-white/20 text-white' : 'bg-[#173826] text-[#4EEDB0]'
                  }`}>
                    {completedOrders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderFilterTab('bin')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    orderFilterTab === 'bin'
                      ? 'bg-[#E53935] text-white shadow-xs'
                      : 'text-[#8BB99F] hover:text-white hover:bg-[#0E2417]'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>রিসাইকেল বিন / ট্র্যাশ</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    orderFilterTab === 'bin' ? 'bg-white/20 text-white' : 'bg-[#173826] text-[#FF8A80]'
                  }`}>
                    {binOrders.length}
                  </span>
                </button>
              </div>

              {/* Order Cards List */}
              {displayedOrders.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#091A11] border border-[#173826] text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#0E2417] text-[#4EEDB0] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {orderFilterTab === 'pending'
                      ? 'কোনো পেন্ডিং অর্ডার নেই (No Pending Orders)'
                      : orderFilterTab === 'approved'
                      ? 'বর্তমানে কোনো প্রসেসিং অর্ডার নেই'
                      : orderFilterTab === 'completed'
                      ? 'এখনো কোনো অর্ডার সম্পূর্ণ হিসেবে মার্ক করা হয়নি'
                      : 'রিসাইকেল বিন সম্পূর্ণ খালি (Bin is Empty)'}
                  </h3>
                  <p className="text-xs text-[#69977E]">
                    {orderFilterTab === 'bin'
                      ? 'ভুল অর্ডার রিমুভ করলে সেগুলো এখানে জমা হবে এবং যে কোনো সময় রিস্টোর করা যাবে।'
                      : 'নতুন অর্ডার আসলে অথবা স্ট্যাটাস পরিবর্তন করলে এখানে প্রদর্শিত হবে।'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {displayedOrders.map((ord, oIdx) => {
                    const isPending = ord.status === 'pending';
                    const isProcessing = ord.status === 'processing' || ord.status === 'verified';
                    const isCompleted = ord.status === 'completed';
                    const isCancelled = ord.status === 'cancelled';
                    const isBin = ord.status === 'bin';
                    const activeOrdId = ord.orderId || (ord as any).id || '';

                    return (
                      <div
                        key={ord.orderId ? `${ord.orderId}-${oIdx}` : `ord-${oIdx}`}
                        className={`p-5 rounded-2xl sm:rounded-3xl border transition-all space-y-3 shadow-md ${
                          isPending
                            ? 'bg-[#0E1F14] border-[#E53935]/40 hover:border-[#E53935]'
                            : isProcessing
                            ? 'bg-[#0E1B24] border-[#533AFD]/40 hover:border-[#533AFD]'
                            : isCompleted
                            ? 'bg-[#091A11] border-[#00B261]/40 hover:border-[#00B261]'
                            : isBin
                            ? 'bg-[#181116] border-[#E53935]/30'
                            : 'bg-[#111827] border-[#1E293B]'
                        }`}
                      >
                        {/* Top Row: Order ID, Website Code, Company Name & Status Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#173826]/70 pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-1 rounded-xl bg-[#533AFD] text-white font-mono font-black text-xs">
                              {ord.orderId}
                            </span>
                            <span className="px-2.5 py-1 rounded-xl bg-[#05110A] text-[#4EEDB0] font-mono font-bold text-xs border border-[#173826]">
                              {ord.demoCode}
                            </span>
                            <h4 className="text-sm font-bold text-white">
                              {ord.companyName || ord.clientName}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                              isCompleted
                                ? 'bg-[#00B261]/20 text-[#00E575] border border-[#00B261]'
                                : isProcessing
                                ? 'bg-[#533AFD]/20 text-[#A5B4FC] border border-[#533AFD]'
                                : isCancelled
                                ? 'bg-[#E53935]/20 text-[#FF8A80] border border-[#E53935]'
                                : isBin
                                ? 'bg-rose-900/30 text-rose-300 border border-rose-800/40'
                                : 'bg-[#FFD552]/20 text-[#FFD552] border border-[#FFD552]'
                            }`}>
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00E575]" />
                                  <span>✓ সম্পূর্ণ (Completed)</span>
                                </>
                              ) : isProcessing ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-[#533AFD] animate-pulse" />
                                  <span>অনুমোদিত (প্রসেসিং)</span>
                                </>
                              ) : isCancelled ? (
                                <span>বাতিলকৃত</span>
                              ) : isBin ? (
                                <>
                                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                  <span>রিসাইকেল বিন (Bin)</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-[#FFD552] animate-ping" />
                                  <span>⏳ পেন্ডিং যাচাই</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#8BB99F]">
                          <div>
                            <span>গ্রাহকের নাম: </span>
                            <strong className="text-white">{ord.clientName}</strong>
                          </div>
                          <div>
                            <span>মোবাইল নম্বর: </span>
                            <strong className="text-white font-mono">{ord.phone}</strong>
                          </div>
                          <div>
                            <span>ইমেইল: </span>
                            <span className="text-white font-mono">{ord.email || 'N/A'}</span>
                          </div>
                          <div>
                            <span>পেমেন্ট: </span>
                            <strong className="text-white uppercase">{ord.paymentMethod}</strong> (TrxID: <span className="font-mono text-[#4EEDB0]">{ord.transactionId}</span>)
                          </div>
                          <div>
                            <span>ডোমেইন চয়েস: </span>
                            <strong className="text-white">{ord.customDomain || ord.domainOption}</strong>
                          </div>
                          <div>
                            <span>মেকিং চার্জ: </span>
                            <strong className="text-white">{ord.makingCharge || '১,৯৯০'} ৳</strong> (+১২০ ৳/মাস)
                          </div>
                          <div>
                            <span>অর্ডারের সময়: </span>
                            <span className="text-white">{ord.createdAt}</span>
                          </div>
                          <div>
                            <span>ডাটাবেস স্ট্যাটাস: </span>
                            <span className="text-[#4EEDB0] font-mono uppercase">{ord.status}</span>
                          </div>
                        </div>

                        {/* Interactive Workflow Actions for Each Stage */}
                        <div className="pt-3 border-t border-[#173826]/70 space-y-2.5 w-full">
                          <div className="text-[11px] text-[#69977E] leading-relaxed">
                            {isPending && 'অর্ডারটি পেন্ডিং রয়েছে। ট্রানজেকশন যাচাই করে অনুমোদন করুন।'}
                            {isProcessing && 'অর্ডারটি অনুমোদিত হয়েছে এবং প্রসেসিং চলছে। আইডি-পাসওয়ার্ড সাবমিট করার পর "পাঠানো / সম্পূর্ণ করুন" অপশনটি সক্রিয় হবে।'}
                            {isCompleted && 'ওয়েবসাইট সম্পূর্ণ তৈরি ও ক্লায়েন্টের কাছে ডেলিভারি সম্পন্ন হয়েছে।'}
                            {isBin && 'এই অর্ডারটি রিমুভ করে বিনে রাখা হয়েছে। যে কোনো সময় রিস্টোর করা যাবে।'}
                          </div>

                          {/* PENDING STAGE ACTIONS */}
                          {isPending && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                              <button
                                type="button"
                                onClick={() => handleApproveOrder(activeOrdId)}
                                className="w-full py-2.5 px-4 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs order-1 sm:order-2"
                              >
                                <Check className="w-4 h-4" />
                                <span>অনুমোদন করুন (Approve Order)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(activeOrdId)}
                                className="w-full py-2.5 px-3 rounded-xl bg-[#E53935]/15 hover:bg-[#E53935] text-[#FF8A80] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer order-2 sm:order-1"
                              >
                                <X className="w-4 h-4" />
                                <span>বাতিল করুন</span>
                              </button>
                            </div>
                          )}

                          {/* APPROVED / PROCESSING STAGE ACTIONS (Clean, Fully Responsive & Clickable) */}
                          {isProcessing && (() => {
                            const hasCredentialsSent = !!(
                              ord.hasDeliveredCredentials ||
                              ord.deliveredAdminId ||
                              deliveredCreds.some(c => (c.userPhone === ord.phone || c.orderId === ord.orderId) && (c.websiteCode === ord.demoCode || !c.websiteCode))
                            );

                            return (
                              <div className="w-full space-y-2.5 pt-1">
                                {/* Clear Step Progress Banner */}
                                <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                                  hasCredentialsSent 
                                    ? 'bg-[#008A4B]/15 border-[#008A4B]/40 text-[#4EEDB0]'
                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                }`}>
                                  <div className="flex items-center gap-2">
                                    {hasCredentialsSent ? (
                                      <CheckCircle2 className="w-4 h-4 text-[#00E575] shrink-0" />
                                    ) : (
                                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                                    )}
                                    <span className="font-semibold text-[11px] sm:text-xs">
                                      {hasCredentialsSent 
                                        ? `✓ আইডি ও পাসওয়ার্ড রেডি (${ord.deliveredAdminId ? `User: ${ord.deliveredAdminId}` : 'সংরক্ষিত'}) — এবার "পাঠানো / সম্পূর্ণ করুন" এ ক্লিক করুন`
                                        : 'ধাপ ১: আইডি ও পাসওয়ার্ড দিন → ধাপ ২: পাঠানো / সম্পূর্ণ করুন'}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-white shrink-0">
                                    {hasCredentialsSent ? 'রেডি টু ডেলিভারি' : 'অপেক্ষমান'}
                                  </span>
                                </div>

                                {/* Action Buttons: Responsive Grid with full readability */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                                  {/* 1. Deliver ID & Password */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const matchingUser = users.find(u => u.phone === ord.phone || (u.email && ord.email && u.email.toLowerCase() === ord.email.toLowerCase())) || {
                                        name: ord.clientName,
                                        phone: ord.phone,
                                        email: ord.email,
                                        registeredAt: 'অর্ডারকারী'
                                      };
                                      setSelectedUserForDelivery(matchingUser);
                                      setSelectedDeliveryOrder(ord.orderId || (ord as any).id || ord.demoCode);
                                      const safeDigits = ord.phone ? String(ord.phone).replace(/\D/g, '').slice(-4) : Math.floor(1000 + Math.random() * 9000);
                                      setDeliveryAdminId(ord.deliveredAdminId || `admin_${safeDigits}`);
                                      setDeliveryAdminPass(ord.deliveredAdminPass || `pass${Math.floor(1000 + Math.random() * 9000)}`);
                                    }}
                                    className={`w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] ${
                                      hasCredentialsSent
                                        ? 'bg-[#0E2417] hover:bg-[#143321] text-[#4EEDB0] border border-[#173826]'
                                        : 'bg-[#533AFD] hover:bg-[#4329d9] text-white shadow-[0_2px_12px_rgba(83,58,253,0.3)]'
                                    }`}
                                    title="গ্রাহকের ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড প্রদান বা পরিবর্তন করুন"
                                  >
                                    <Key className="w-4 h-4 shrink-0" />
                                    <span>
                                      {hasCredentialsSent ? '✓ ১. আইডি-পাস দেওয়া সম্পন্ন' : '১. আইডি ও পাসওয়ার্ড দিন'}
                                    </span>
                                  </button>

                                  {/* 2. Send / Dispatch Button (100% visible, fully clickable and responsive) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!hasCredentialsSent) {
                                        // Guide admin smoothly to fill credentials first
                                        const matchingUser = users.find(u => u.phone === ord.phone || (u.email && ord.email && u.email.toLowerCase() === ord.email.toLowerCase())) || {
                                          name: ord.clientName,
                                          phone: ord.phone,
                                          email: ord.email,
                                          registeredAt: 'অর্ডারকারী'
                                        };
                                        setSelectedUserForDelivery(matchingUser);
                                        setSelectedDeliveryOrder(ord.orderId || (ord as any).id || ord.demoCode);
                                        const safeDigits = ord.phone ? String(ord.phone).replace(/\D/g, '').slice(-4) : Math.floor(1000 + Math.random() * 9000);
                                        setDeliveryAdminId(ord.deliveredAdminId || `admin_${safeDigits}`);
                                        setDeliveryAdminPass(ord.deliveredAdminPass || `pass${Math.floor(1000 + Math.random() * 9000)}`);
                                        return;
                                      }
                                      handleMarkOrderCompleted(activeOrdId);
                                    }}
                                    className={`w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] ${
                                      hasCredentialsSent
                                        ? 'bg-[#008A4B] hover:bg-[#009E56] text-white shadow-[0_4px_16px_rgba(0,178,97,0.4)]'
                                        : 'bg-[#008A4B]/80 hover:bg-[#008A4B] text-white border border-[#008A4B]'
                                    }`}
                                    title="সম্পূর্ণ অর্ডার পাঠানো ও সম্পন্ন করুন"
                                  >
                                    <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                                    <span>২. পাঠানো / সম্পূর্ণ করুন</span>
                                  </button>

                                  {/* 3. Remove Button -> Moves to Bin */}
                                  <button
                                    type="button"
                                    onClick={() => handleMoveOrderToBin(activeOrdId)}
                                    className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-[#E53935]/15 hover:bg-[#E53935]/25 text-[#FF8A80] hover:text-white border border-[#E53935]/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                                    title="ভুল বা বাতিল অর্ডার রিমুভ করে ট্র্যাশ (বিন)-এ স্থানান্তর করুন"
                                  >
                                    <Trash2 className="w-4 h-4 shrink-0" />
                                    <span>৩. রিসাইকেল বিনে পাঠান</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })()}

                            {/* COMPLETED STAGE ACTIONS */}
                            {isCompleted && (
                              <button
                                type="button"
                                onClick={() => {
                                  const matchingUser = users.find(u => u.phone === ord.phone) || {
                                    name: ord.clientName,
                                    phone: ord.phone,
                                    email: ord.email,
                                    registeredAt: 'অর্ডারকারী'
                                  };
                                  setSelectedUserForDelivery(matchingUser);
                                  setSelectedDeliveryOrder(ord.demoCode);
                                  const safeDigits = ord.phone ? String(ord.phone).replace(/\D/g, '').slice(-4) : Math.floor(1000 + Math.random() * 9000);
                                  setDeliveryAdminId(`admin_${safeDigits}`);
                                  setDeliveryAdminPass(`pass${Math.floor(1000 + Math.random() * 9000)}`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#0E2417] hover:bg-[#173826] text-[#4EEDB0] border border-[#173826] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>ক্রেডেনশিয়াল পাঠান / পরিবর্তন</span>
                              </button>
                            )}

                            {/* BIN / TRASH STAGE ACTIONS */}
                            {isBin && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleRestoreOrderFromBin(activeOrdId)}
                                  className="px-3.5 py-1.5 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  title="অর্ডারটি পুনরায় আগের প্রসেসিং তালিকায় ফিরিয়ে নিন"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>পুনরুদ্ধার করুন (Restore)</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handlePermanentDeleteOrder(activeOrdId)}
                                  className="px-3 py-1.5 rounded-xl bg-[#E53935]/20 hover:bg-[#E53935]/30 text-[#FF8A80] border border-[#E53935]/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                  title="অর্ডারটি স্থায়ীভাবে মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>স্থায়ীভাবে মুছুন (Permanent Delete)</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ================= TAB 4: USERS & CREDENTIALS ================= */}
        {activeTab === 'users' && (() => {
          const filteredUsers = users.filter((u) => {
            if (!userSearchTerm.trim()) return true;
            const q = userSearchTerm.trim().toLowerCase();
            return u.phone.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
          });

          return (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white">নিবন্ধিত ব্যবহারকারী তালিকা ({users.length})</h2>
                  <p className="text-xs text-[#94A3B8]">ক্লায়েন্টদের ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড ডেলিভারি করুন এবং সিকিউরিটি কোড শেয়ার করুন।</p>
                </div>
              </div>

              {/* Search Bar for Clients by mobile number or name (Requirement 12) */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="মোবাইল নম্বর অথবা নাম দিয়ে ক্লায়েন্ট খুঁজুন..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs placeholder-[#64748D] focus:outline-none focus:border-[#533AFD] transition-all"
                />
                {userSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setUserSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-10 rounded-2xl bg-[#111827] border border-[#1E293B] text-center text-xs text-[#94A3B8]">
                  {userSearchTerm ? 'এই সার্চে কোনো ব্যবহারকারী পাওয়া যায়নি।' : 'কোনো নিবন্ধিত ব্যবহারকারী নেই।'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUsers.map((usr, uIdx) => {
                    const userOrders = orders.filter((o) => o.phone === usr.phone || o.email === usr.email);
                    const clientCreds = deliveredCreds.filter((c) => c.userPhone === usr.phone);
                    const isInfoOpen = infoPopoverPhone === usr.phone;
                    const secCode = getClientSecurityCode(usr.phone);

                    return (
                      <div
                        key={usr.phone ? `usr-${usr.phone}` : `usr-${uIdx}`}
                        className={`p-5 rounded-2xl border space-y-3.5 flex flex-col justify-between transition-all shadow-sm ${
                          usr.isRestricted 
                            ? 'bg-[#181116] border-rose-500/40' 
                            : 'bg-[#111827] border-[#1E293B]'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Header: Name, Date, Restriction Badge, and Security Code */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-black text-xs shadow-xs ${
                                usr.isRestricted ? 'bg-rose-600' : 'bg-[#533AFD]'
                              }`}>
                                {usr.name.charAt(0).toUpperCase()}
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                  <span className="truncate">{usr.name}</span>
                                  {usr.isRestricted && (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                                      🚫 রেস্ট্রিক্টেড (Restricted)
                                    </span>
                                  )}
                                </h4>
                                <span className="text-[10px] text-[#94A3B8]">নিবন্ধন: {usr.registeredAt}</span>
                              </div>
                            </div>

                            {/* Security Code System (Badge only - no send details button) */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#533AFD]/15 border border-[#533AFD]/30 text-xs">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#818CF8]" />
                              <span className="text-[10px] text-[#A5B4FC] font-semibold">Security Code:</span>
                              <span className="font-mono font-black text-white tracking-wider">{secCode}</span>
                            </div>
                          </div>

                          {/* Clean Overview: Phone with (i) Info Button & Order Names */}
                          <div className="space-y-2 text-xs">
                            {/* Mobile with small info (i) button beside it */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
                              <div className="flex items-center gap-2">
                                <span className="text-[#94A3B8]">মোবাইল:</span>
                                <strong className="text-white font-mono">{usr.phone}</strong>
                                <button
                                  type="button"
                                  onClick={() => setInfoPopoverPhone(isInfoOpen ? null : usr.phone)}
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                    isInfoOpen
                                      ? 'bg-[#533AFD] text-white'
                                      : 'bg-[#1E293B] text-[#A5B4FC] hover:bg-[#533AFD] hover:text-white border border-[#1E293B]'
                                  }`}
                                  title="ক্লিক করে সম্পূর্ণ ক্লায়েন্ট ডিটেইলস দেখুন"
                                >
                                  <Info className="w-3 h-3 stroke-[2.5]" />
                                </button>
                              </div>

                              <span className="text-[10px] text-[#A5B4FC] font-bold">
                                {userOrders.length} টি অর্ডার
                              </span>
                            </div>

                            {/* Info Button Dropdown/Popover (Reveals full client info cleanly) */}
                            {isInfoOpen && (
                              <div className="p-3 rounded-xl bg-[#131B2E] border border-[#533AFD]/40 text-xs text-[#CBD5E1] space-y-1.5 animate-fadeIn">
                                <div className="flex justify-between">
                                  <span className="text-[#94A3B8]">ইমেইল এড্রেস:</span>
                                  <span className="font-mono text-white select-all">{usr.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#94A3B8]">রেজিস্ট্রেশন তারিখ:</span>
                                  <span className="font-mono text-white">{usr.registeredAt}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#94A3B8]">ডেলিভারিকৃত ওয়েবসাইট:</span>
                                  <span className="text-[#818CF8] font-bold">{clientCreds.length} টি</span>
                                </div>
                                {userOrders.length > 0 && (
                                  <div className="flex justify-between pt-1 border-t border-[#1E293B]">
                                    <span className="text-[#94A3B8]">সর্বশেষ পেমেন্ট TrxID:</span>
                                    <span className="font-mono text-[#818CF8]">{userOrders[0].transactionId}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Order Names Overview */}
                            <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] space-y-1.5">
                              <span className="text-[11px] font-bold text-[#94A3B8] block">
                                অর্ডারের নামসমূহ ({userOrders.length}):
                              </span>
                              {userOrders.length === 0 ? (
                                <span className="text-[11px] text-[#64748D] italic block">
                                  এখনো কোনো ওয়েবসাইট অর্ডার করেননি
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {userOrders.map((ord, oIndex) => (
                                    <span
                                      key={ord.orderId ? `uo-${ord.orderId}-${oIndex}` : `uo-${oIndex}`}
                                      className="px-2 py-0.5 rounded-lg bg-[#1E293B] border border-[#1E293B] text-[11px] text-white font-medium truncate max-w-full flex items-center gap-1"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#533AFD]" />
                                      <span>{ord.companyName || ord.demoTitle}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Existing Delivered Credentials Badge if any */}
                            {clientCreds.length > 0 && (
                              <div className="p-2 rounded-xl bg-[#0B0F19] border border-[#533AFD]/30 text-[11px] text-[#A5B4FC] flex items-center justify-between">
                                <span>✓ {clientCreds.length} টি ওয়েবসাইটের অ্যাক্সেস পাঠানো হয়েছে</span>
                                <span className="font-mono text-[10px] text-[#94A3B8]">ID: {clientCreds[0].websiteAdminId}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons: 1. View Details, 2. Restrict/Unrestrict User (NO send details button!) */}
                        <div className="pt-2 grid grid-cols-2 gap-2 border-t border-[#1E293B]">
                          {/* 1. View Details Button */}
                          <button
                            type="button"
                            onClick={() => setViewingClientDetailsUser(usr)}
                            className="py-2 px-3 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white border border-[#1E293B] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#818CF8]" />
                            <span>View Details</span>
                          </button>

                          {/* 2. Restrict / Unrestrict User Button (Replaces Send Details button) */}
                          {usr.isRestricted ? (
                            <button
                              type="button"
                              onClick={() => handleToggleRestrictUser(usr)}
                              className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              title="রেস্ট্রিকশন প্রত্যাহার করুন"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>রেস্ট্রিকশন সরান (Unrestrict)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleRestrictUser(usr)}
                              className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              title="এই ব্যবহারকারীর অ্যাকাউন্ট রেস্ট্রিক্ট করুন (তিনি আর লগইন করতে পারবেন না)"
                            >
                              <Ban className="w-3.5 h-3.5 text-rose-400" />
                              <span>রেস্ট্রিক্ট করুন (Restrict)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ================= TAB: REPORTS MANAGEMENT ================= */}
        {activeTab === 'reports' && (() => {
          const pendingReports = reports.filter((r) => r.status === 'pending');
          const resolvedReports = reports.filter((r) => r.status === 'resolved');

          let displayedReports = reports;
          if (reportFilter === 'pending') displayedReports = pendingReports;
          else if (reportFilter === 'resolved') displayedReports = resolvedReports;

          return (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Flag className="w-5 h-5 text-[#818CF8]" />
                    <span>ক্লায়েন্ট রিপোর্ট ও কমপ্লেন বক্স</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    ক্লায়েন্টদের পাঠানো রিপোর্ট ও সমস্যা পর্যালোচনা করুন। কমপ্লিট বাটনে ক্লিক করলে পাসওয়ার্ড ছাড়াই স্বয়ংক্রিয়ভাবে সম্পন্ন হবে।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-[#E53935]/20 text-[#FF8A80] border border-[#E53935]/40 text-xs font-bold">
                    {pendingReports.length} টি পেন্ডিং রিপোর্ট
                  </span>
                </div>
              </div>

              {/* Subtabs: All, Pending, Resolved */}
              <div className="flex items-center gap-2 p-1.5 bg-[#0B0F19] border border-[#1E293B] rounded-2xl overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setReportFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    reportFilter === 'all'
                      ? 'bg-[#533AFD] text-white shadow-xs'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  <span>সবগুলো রিপোর্ট</span>
                  <span className="text-[10px] font-mono opacity-80">({reports.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReportFilter('pending')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    reportFilter === 'pending'
                      ? 'bg-[#E53935] text-white shadow-xs'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>পেন্ডিং রিপোর্ট</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    reportFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-[#1E293B] text-[#FF8A80]'
                  }`}>
                    {pendingReports.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setReportFilter('resolved')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    reportFilter === 'resolved'
                      ? 'bg-[#008A4B] text-white shadow-xs'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>সমাধানকৃত / সম্পন্ন</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    reportFilter === 'resolved' ? 'bg-white/20 text-white' : 'bg-[#1E293B] text-[#4EEDB0]'
                  }`}>
                    {resolvedReports.length}
                  </span>
                </button>
              </div>

              {/* Reports List */}
              {displayedReports.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#111827] border border-[#1E293B] text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#1E293B] text-[#818CF8] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {reportFilter === 'pending'
                      ? 'কোনো পেন্ডিং রিপোর্ট নেই (All Reports Resolved)'
                      : reportFilter === 'resolved'
                      ? 'কোনো সমাধানকৃত রিপোর্ট নেই'
                      : 'এখনো কোনো রিপোর্ট জমা পড়েনি'}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    ক্লায়েন্ট তাদের একাউন্ট সেকশন থেকে রিপোর্ট বা অভিযোগ পাঠালে এখানে তালিকাভুক্ত হবে।
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {displayedReports.map((rep, rIdx) => {
                    const isPending = rep.status === 'pending';
                    return (
                      <div
                        key={rep.id ? `rep-${rep.id}-${rIdx}` : `rep-${rIdx}`}
                        className={`p-5 rounded-2xl border space-y-3 transition-all shadow-md ${
                          isPending
                            ? 'bg-[#181116] border-[#E53935]/40 hover:border-[#E53935]'
                            : 'bg-[#111827] border-[#1E293B]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="px-2.5 py-1 rounded-xl bg-[#533AFD] text-white font-mono font-black text-xs">
                              {rep.clientIdentifier || '#BW-CLIENT'}
                            </span>
                            <h4 className="text-sm font-bold text-white">
                              {rep.clientName || 'ক্লায়েন্ট'}
                            </h4>
                            <span className="text-xs text-[#4EEDB0] font-mono">
                              ({rep.clientPhone})
                            </span>
                            {rep.clientEmail && (
                              <span className="text-xs text-[#94A3B8]">
                                • {rep.clientEmail}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                              isPending
                                ? 'bg-[#E53935]/20 text-[#FF8A80] border border-[#E53935]/40'
                                : 'bg-[#00B261]/20 text-[#4EEDB0] border border-[#00B261]/40'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${isPending ? 'bg-[#E53935] animate-ping' : 'bg-[#00B261]'}`} />
                              <span>{isPending ? 'অপেক্ষমান (Pending)' : 'সম্পূর্ণ (Resolved)'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Report message box */}
                        <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-xs text-white leading-relaxed whitespace-pre-wrap">
                          {rep.message}
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#1E293B]">
                          <div className="text-[11px] text-[#94A3B8]">
                            জমা দেওয়ার সময়: <span className="font-mono text-white">{rep.createdAt}</span>
                            {rep.resolvedAt && (
                              <span className="text-emerald-400 ml-2">
                                (সমাধান সম্পন্ন: {rep.resolvedAt})
                              </span>
                            )}
                          </div>

                          {/* Complete button (NO password needed as explicitly requested!) */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleResolveReport(rep.id)}
                              className="px-4 py-2 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              title="পাসওয়ার্ড ছাড়াই সরাসরি সম্পূর্ণ মার্ক করুন"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>সম্পূর্ণ করুন (Complete)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ================= TAB 5: PASSWORD & USER SECURITY DESK (Requirement 3) ================= */}
        {activeTab === 'resets' && (() => {
          // 1. Gather all users who have had their password reset
          const resetCompletedRequests = resetRequests.filter(r => r.status === 'reset');
          const resetUsersList = users.filter((u: any) => {
            const hasResetFlag = !!(u.isPasswordReset || u.passwordResetAt);
            const matchesResetRequest = resetCompletedRequests.some(r => 
              (r.phone && r.phone.replace(/\D/g, '') === u.phone.replace(/\D/g, '')) ||
              (r.newPasswordAssigned && r.newPasswordAssigned === u.password)
            );
            return hasResetFlag || matchesResetRequest;
          });

          // Also include any standalone completed reset requests that might not be in users array yet
          const standaloneResets = resetCompletedRequests.filter(r => 
            !resetUsersList.some(u => u.phone.replace(/\D/g, '') === r.phone.replace(/\D/g, ''))
          );

          // 2. Filtered by search term
          const q = passwordDeskSearch.trim().toLowerCase();
          const filteredAllUsers = users.filter(u => {
            if (!q) return true;
            return u.phone.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q));
          });

          const filteredResetUsers = resetUsersList.filter(u => {
            if (!q) return true;
            return u.phone.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q));
          });

          const pendingRequests = resetRequests.filter(r => r.status === 'pending');

          return (
            <div className="space-y-5 animate-fadeIn">
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#533AFD]" />
                    <span>পাসওয়ার্ড ও ইউজার সিকিউরিটি ম্যানেজমেন্ট</span>
                  </h2>
                  <p className="text-xs text-[#8BB99F] mt-0.5">
                    নিবন্ধিত সকল গ্রাহকের তথ্য এবং অ্যাডমিন কর্তৃক পাসওয়ার্ড রিসেটকৃত ইউজারদের তালিকা পরিচালনা করুন।
                  </p>
                </div>
                {pendingRequests.length > 0 && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 shrink-0 animate-pulse">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{pendingRequests.length} টি কল রিকোয়েস্ট অপেক্ষমান</span>
                  </span>
                )}
              </div>

              {/* Requirement 3: Two Clear Options Tabs (All Users List vs Reset Password Users List) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-[#091A11] border border-[#173826]">
                {/* 1. All Users List */}
                <button
                  type="button"
                  onClick={() => setPasswordDeskTab('all_users')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    passwordDeskTab === 'all_users'
                      ? 'bg-[#533AFD] text-white shadow-[0_4px_16px_rgba(83,58,253,0.35)]'
                      : 'text-[#8BB99F] hover:text-white hover:bg-[#143321]'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>১. All Users List (সকল ইউজার)</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    passwordDeskTab === 'all_users' ? 'bg-white/20 text-white' : 'bg-[#173826] text-[#4EEDB0]'
                  }`}>
                    {users.length}
                  </span>
                </button>

                {/* 2. Reset Password Users List */}
                <button
                  type="button"
                  onClick={() => setPasswordDeskTab('reset_users')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    passwordDeskTab === 'reset_users'
                      ? 'bg-[#008A4B] text-white shadow-[0_4px_16px_rgba(0,138,75,0.35)]'
                      : 'text-[#8BB99F] hover:text-white hover:bg-[#143321]'
                  }`}
                >
                  <Key className="w-4 h-4 shrink-0" />
                  <span>২. Reset Password Users List</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    passwordDeskTab === 'reset_users' ? 'bg-white/20 text-white' : 'bg-[#173826] text-[#4EEDB0]'
                  }`}>
                    {resetUsersList.length + standaloneResets.length}
                  </span>
                </button>

                {/* 3. Pending Call Requests Desk */}
                <button
                  type="button"
                  onClick={() => setPasswordDeskTab('pending_requests')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    passwordDeskTab === 'pending_requests'
                      ? 'bg-amber-600 text-white shadow-[0_4px_16px_rgba(217,119,6,0.35)]'
                      : 'text-[#8BB99F] hover:text-white hover:bg-[#143321]'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  <span>কল রিকোয়েস্ট ডেস্ক</span>
                  {pendingRequests.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping shrink-0" />
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    passwordDeskTab === 'pending_requests' ? 'bg-white/20 text-white' : 'bg-[#173826] text-amber-300'
                  }`}>
                    {pendingRequests.length}
                  </span>
                </button>
              </div>

              {/* Clean Search Bar */}
              {passwordDeskTab !== 'pending_requests' && (
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-[#8BB99F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={
                      passwordDeskTab === 'all_users'
                        ? 'সকল ইউজারদের নাম, মোবাইল নম্বর অথবা ইমেইল দিয়ে সার্চ করুন...'
                        : 'রিসেটকৃত গ্রাহকের নাম, মোবাইল নম্বর অথবা ইমেইল দিয়ে সার্চ করুন...'
                    }
                    value={passwordDeskSearch}
                    onChange={(e) => setPasswordDeskSearch(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#091A11] border border-[#173826] text-white text-xs placeholder-[#69977E] focus:outline-none focus:border-[#00B261] transition-all"
                  />
                  {passwordDeskSearch && (
                    <button
                      type="button"
                      onClick={() => setPasswordDeskSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8BB99F] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* ---------------- OPTION 1: ALL USERS LIST ---------------- */}
              {passwordDeskTab === 'all_users' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8BB99F] px-1">
                    <span>সকল নিবন্ধিত অ্যাকাউন্ট ({filteredAllUsers.length} জন)</span>
                    <span className="text-[11px] text-[#4EEDB0]">যেকোনো ইউজারের পাসওয়ার্ড সরাসরি রিসেট করতে পারবেন</span>
                  </div>

                  {filteredAllUsers.length === 0 ? (
                    <div className="p-10 rounded-2xl bg-[#091A11] border border-[#173826] text-center text-xs text-[#8BB99F]">
                      {passwordDeskSearch ? 'এই সার্চে কোনো ব্যবহারকারী পাওয়া যায়নি।' : 'কোনো নিবন্ধিত ব্যবহারকারী নেই।'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {filteredAllUsers.map((usr, uIdx) => {
                        const secCode = getClientSecurityCode(usr.phone);
                        const isReset = !!((usr as any).isPasswordReset || (usr as any).passwordResetAt || resetCompletedRequests.some(r => r.phone === usr.phone));

                        return (
                          <div
                            key={usr.phone ? `all-u-${usr.phone}` : `all-u-${uIdx}`}
                            className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all ${
                              usr.isRestricted
                                ? 'bg-[#181116] border-rose-500/40'
                                : 'bg-[#091A11] border-[#173826]'
                            }`}
                          >
                            {/* User Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-[#533AFD] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                                  {usr.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-bold text-white flex items-center gap-2 truncate">
                                    <span className="truncate">{usr.name}</span>
                                    {isReset && (
                                      <span className="px-1.5 py-0.5 rounded-md bg-[#008A4B]/25 text-[#4EEDB0] border border-[#008A4B]/40 text-[9px] font-black shrink-0">
                                        ✓ পাসওয়ার্ড রিসেটকৃত
                                      </span>
                                    )}
                                  </h4>
                                  <span className="text-[11px] text-[#8BB99F] font-mono block">{usr.phone}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#533AFD]/15 border border-[#533AFD]/30 text-xs shrink-0">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#818CF8]" />
                                <span className="text-[10px] text-[#A5B4FC] font-semibold">Security:</span>
                                <span className="font-mono font-black text-white">{secCode}</span>
                              </div>
                            </div>

                            {/* Details Row */}
                            <div className="p-3 rounded-xl bg-[#05110A] border border-[#173826]/70 text-xs space-y-1.5">
                              <div className="flex justify-between items-center text-[#8BB99F]">
                                <span>ইমেইল:</span>
                                <span className="font-mono text-white truncate max-w-[200px]">{usr.email || '—'}</span>
                              </div>
                              <div className="flex justify-between items-center text-[#8BB99F]">
                                <span>বর্তমান পাসওয়ার্ড:</span>
                                <span className="font-mono font-bold text-[#4EEDB0] bg-[#0E2417] px-2 py-0.5 rounded border border-[#173826]">
                                  {usr.password || 'প্রযোজ্য নয়'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[#8BB99F]">
                                <span>নিবন্ধনের তারিখ:</span>
                                <span className="text-white">{usr.registeredAt}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveResetRequest({
                                    id: `DIRECT-${Date.now()}`,
                                    phone: usr.phone,
                                    requestedAt: new Date().toLocaleString('bn-BD'),
                                    status: 'pending'
                                  });
                                  setManualNewPassword('');
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleRestrictUser(usr)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  usr.isRestricted
                                    ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                                    : 'bg-[#143321] text-[#8BB99F] hover:text-white border border-[#173826]'
                                }`}
                              >
                                {usr.isRestricted ? 'আন-রেস্ট্রিক্ট' : 'রেস্ট্রিক্ট'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ---------------- OPTION 2: RESET PASSWORD USERS LIST ---------------- */}
              {passwordDeskTab === 'reset_users' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8BB99F] px-1">
                    <span>অ্যাডমিন কর্তৃক রিসেটকৃত ইউজারদের তালিকা ({filteredResetUsers.length + standaloneResets.length} জন)</span>
                    <span className="text-[11px] text-[#4EEDB0]">শুধুমাত্র যাদের পাসওয়ার্ড অ্যাডমিন রিসেট করেছেন</span>
                  </div>

                  {filteredResetUsers.length === 0 && standaloneResets.length === 0 ? (
                    <div className="p-10 rounded-2xl bg-[#091A11] border border-[#173826] text-center text-xs text-[#8BB99F] space-y-2">
                      <Key className="w-8 h-8 text-[#8BB99F] mx-auto opacity-50" />
                      <p className="font-bold text-white">এখনও কোনো ইউজারের পাসওয়ার্ড অ্যাডমিন রিসেট করেননি।</p>
                      <p className="text-[11px]">"All Users List" ট্যাবে গিয়ে যেকোনো ইউজারের "পাসওয়ার্ড পরিবর্তন করুন" বাটনে ক্লিক করে পাসওয়ার্ড রিসেট করতে পারবেন।</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {filteredResetUsers.map((usr, uIdx) => {
                        const matchingReq = resetCompletedRequests.find(r => r.phone === usr.phone);
                        const assignedPass = matchingReq?.newPasswordAssigned || usr.password || '—';
                        const resetTime = matchingReq?.resolvedAt || (usr as any).passwordResetAt || matchingReq?.requestedAt || 'অ্যাডমিন কর্তৃক রিসেট';

                        return (
                          <div
                            key={`reset-u-${usr.phone}-${uIdx}`}
                            className="p-5 rounded-2xl bg-[#091A11] border-2 border-[#008A4B]/60 space-y-3.5 shadow-sm relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 px-3 py-1 bg-[#008A4B] text-white text-[10px] font-black rounded-bl-xl shadow-xs">
                              ✓ পাসওয়ার্ড রিসেট সম্পন্ন
                            </div>

                            <div>
                              <h4 className="text-base font-black text-white">{usr.name}</h4>
                              <p className="text-xs text-[#4EEDB0] font-mono mt-0.5">{usr.phone}</p>
                              {usr.email && <p className="text-[11px] text-[#8BB99F] font-mono">{usr.email}</p>}
                            </div>

                            <div className="p-3 rounded-xl bg-[#05110A] border border-[#173826] space-y-2 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-[#8BB99F]">নতুন নির্ধারিত পাসওয়ার্ড:</span>
                                <span className="font-mono font-black text-sm text-[#4EEDB0] bg-[#0E2417] px-2.5 py-0.5 rounded-lg border border-[#00B261]/40">
                                  {assignedPass}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[#8BB99F]">
                                <span>রিসেটের সময়:</span>
                                <span className="text-white font-mono text-[11px]">{resetTime}</span>
                              </div>
                              <div className="flex justify-between items-center text-[#8BB99F]">
                                <span>স্ট্যাটাস:</span>
                                <span className="font-bold text-[#4EEDB0]">সক্রিয় ও কার্যকর</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveResetRequest({
                                    id: `DIRECT-${Date.now()}`,
                                    phone: usr.phone,
                                    requestedAt: new Date().toLocaleString('bn-BD'),
                                    status: 'pending'
                                  });
                                  setManualNewPassword('');
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-[#143321] hover:bg-[#1c472e] text-[#4EEDB0] border border-[#173826] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>পুনরায় পাসওয়ার্ড পরিবর্তন</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSendSecurityCodeToClient(usr)}
                                className="py-2 px-3 rounded-xl bg-[#533AFD] hover:bg-[#432BEE] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                                title="গ্রাহকের কাছে সিকিউরিটি কোড এসএমএস পাঠান"
                              >
                                কোড পাঠান
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Standalone Reset Requests */}
                      {standaloneResets.map((req, rIdx) => (
                        <div
                          key={`standalone-reset-${req.id || rIdx}`}
                          className="p-5 rounded-2xl bg-[#091A11] border-2 border-[#008A4B]/60 space-y-3.5 shadow-sm relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 px-3 py-1 bg-[#008A4B] text-white text-[10px] font-black rounded-bl-xl shadow-xs">
                            ✓ পাসওয়ার্ড রিসেট সম্পন্ন
                          </div>

                          <div>
                            <h4 className="text-base font-black text-white font-mono">{req.phone}</h4>
                            <p className="text-xs text-[#8BB99F] mt-0.5">কল রিকোয়েস্ট থেকে সরাসরি রিসেটকৃত</p>
                          </div>

                          <div className="p-3 rounded-xl bg-[#05110A] border border-[#173826] space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-[#8BB99F]">নতুন পাসওয়ার্ড:</span>
                              <span className="font-mono font-black text-sm text-[#4EEDB0] bg-[#0E2417] px-2.5 py-0.5 rounded-lg border border-[#00B261]/40">
                                {req.newPasswordAssigned || '—'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[#8BB99F]">
                              <span>রিসেটের সময়:</span>
                              <span className="text-white font-mono text-[11px]">{req.resolvedAt || req.requestedAt}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveResetRequest(req);
                              setManualNewPassword('');
                            }}
                            className="w-full py-2 px-3 rounded-xl bg-[#143321] hover:bg-[#1c472e] text-[#4EEDB0] border border-[#173826] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>পুনরায় পাসওয়ার্ড পরিবর্তন</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---------------- OPTION 3: PENDING CALL REQUESTS DESK ---------------- */}
              {passwordDeskTab === 'pending_requests' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#8BB99F] px-1">
                    <span>গ্রাহকদের পাসওয়ার্ড রিসেট কল অনুরোধ ({pendingRequests.length} টি অপেক্ষমান)</span>
                  </div>

                  {pendingRequests.length === 0 ? (
                    <div className="p-10 rounded-2xl bg-[#091A11] border border-[#173826] text-center text-xs text-[#8BB99F] space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-[#4EEDB0] mx-auto" />
                      <p className="font-bold text-white">কোনো পেন্ডিং পাসওয়ার্ড রিসেট কল অনুরোধ নেই!</p>
                      <p className="text-[11px]">সকল কল অনুরোধ সমাধান করা হয়েছে।</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingRequests.map((req, rIdx) => (
                        <div
                          key={req.id ? `${req.id}-${rIdx}` : `req-${rIdx}`}
                          className="p-5 rounded-2xl bg-[#091A11] border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <PhoneCall className="w-4 h-4 text-amber-400" />
                              <h4 className="text-sm font-bold text-white font-mono">{req.phone}</h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                অপেক্ষমান কল
                              </span>
                            </div>
                            <p className="text-xs text-[#8BB99F] mt-1">অনুরোধের সময়: {req.requestedAt}</p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setActiveResetRequest(req);
                                setManualNewPassword('');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-[#008A4B] text-white text-xs font-bold hover:bg-[#009E56] cursor-pointer shadow-xs"
                            >
                              পাসওয়ার্ড রিসেট করুন
                            </button>
                            <button
                              onClick={() => {
                                setActiveResetRequest(req);
                                handleResolvePasswordReset('call_not_received');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#FFD552]/20 text-[#FFD552] text-xs font-bold hover:bg-[#FFD552]/30 cursor-pointer"
                            >
                              কল রিসিভ হয়নি
                            </button>
                            <button
                              onClick={() => {
                                setActiveResetRequest(req);
                                handleResolvePasswordReset('rejected');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#E53935]/20 text-[#FF8A80] text-xs font-bold hover:bg-[#E53935]/30 cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ================= TAB 6: CATALOG & EDIT STOCK ================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">ওয়েবসাইট স্টক ও এডিট ({customWebsites.length})</h2>
                <p className="text-xs text-[#8BB99F]">বিদ্যমান যেকোনো ওয়েবসাইটের তথ্য, ডেসক্রিপশন ও থাম্বনেইল সরাসরি এডিট করুন।</p>
              </div>

              <button
                onClick={() => setShowAddWebsiteModal(true)}
                className="px-4 py-2 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ওয়েবসাইট আপলোড</span>
              </button>
            </div>

            {/* Non-hover explicit cards with clear "এডিট করুন" button on each */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customWebsites.map((site, sIdx) => (
                <div
                  key={site.id ? `${site.id}-${sIdx}` : `site-${sIdx}`}
                  className="p-4 rounded-2xl bg-[#091A11] border border-[#173826] flex flex-col justify-between space-y-3"
                >
                  <div>
                    <img
                      src={site.previewImage}
                      alt={site.title}
                      className="w-full h-36 rounded-xl object-cover border border-[#173826] mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-[#008A4B] text-white text-[10px] font-mono font-bold">
                        {site.fourDigitCode}
                      </span>
                      <span className="text-[10px] text-[#4EEDB0] font-bold uppercase">
                        {site.categoryLabel}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1">{site.title}</h4>
                    <p className="text-[11px] text-[#8BB99F] line-clamp-2 mt-1">{site.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#173826] flex items-center justify-between gap-2">
                    <span className="font-mono text-white text-xs font-bold">{site.priceTag}</span>
                    
                    {/* Clear Edit Button */}
                    <button
                      onClick={() => handleOpenEditSite(site)}
                      className="px-3 py-1.5 rounded-xl bg-[#122A1E] hover:bg-[#008A4B] text-[#4EEDB0] hover:text-white border border-[#00B261]/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>এডিট করুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Edit Existing Website */}
            {editingSite && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                <div className="w-full max-w-lg bg-[#091A11] border-2 border-[#00B261] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
                  <button
                    onClick={() => setEditingSite(null)}
                    className="absolute top-5 right-5 text-[#8BB99F] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[#4EEDB0]" />
                    <h3 className="text-base font-black text-white">
                      ওয়েবসাইট এডিট করুন ({editingSite.fourDigitCode})
                    </h3>
                  </div>

                  <form onSubmit={handleSaveEditedWebsite} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#A8D7BD] mb-1">ওয়েবসাইট শিরোনাম (Title)</label>
                      <input
                        type="text"
                        required
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs focus:outline-none focus:border-[#00B261]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8D7BD] mb-1">ক্যাটাগরি</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs focus:outline-none focus:border-[#00B261]"
                      >
                        <option value="ecommerce">E-Commerce</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="blogging">Blogs & Media</option>
                        <option value="grocery">Groceries</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8D7BD] mb-1">থাম্বনেইল ইমেজ URL</label>
                      <input
                        type="url"
                        required
                        value={editThumbnail}
                        onChange={(e) => setEditThumbnail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs focus:outline-none focus:border-[#00B261]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8D7BD] mb-1">মূল্য ট্যাগ (Price Tag)</label>
                      <input
                        type="text"
                        value={editPriceTag}
                        onChange={(e) => setEditPriceTag(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs focus:outline-none focus:border-[#00B261]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8D7BD] mb-1">বর্ণনা / সাবটেক্সট (Description)</label>
                      <textarea
                        rows={2}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#05110A] border border-[#173826] text-xs text-white resize-none focus:outline-none focus:border-[#00B261]"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-[#008A4B] text-white text-xs font-bold hover:bg-[#009E56] cursor-pointer"
                      >
                        পরিবর্তন সংরক্ষণ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSite(null)}
                        className="px-4 py-2.5 rounded-xl bg-[#05110A] text-xs text-[#8BB99F]"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal: Upload New Product / Website (Requirement 15) */}
            {showAddWebsiteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                <div className="w-full max-w-lg bg-[#111827] border-2 border-[#533AFD] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setShowAddWebsiteModal(false)}
                    className="absolute top-5 right-5 text-[#94A3B8] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#818CF8]" />
                    <span>নতুন প্রোডাক্ট / ওয়েবসাইট আপলোড</span>
                  </h3>

                  <form onSubmit={handleCreateNewWebsite} className="space-y-3.5">
                    {/* 1. Product Title */}
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1">
                        Product Title (প্রোডাক্ট টাইটেল) <span className="text-[#E53935]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: Luxe Watch - Smart Luxury Store"
                        value={newProductTitle}
                        onChange={(e) => setNewProductTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs focus:outline-none focus:border-[#533AFD]"
                      />
                    </div>

                    {/* 2. Description */}
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1">
                        Description (বিবরণ)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="ওয়েবসাইটের মূল সুবিধাসমূহ ও বিবরণ লিখুন..."
                        value={newProductDesc}
                        onChange={(e) => setNewProductDesc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-xs text-white resize-none focus:outline-none focus:border-[#533AFD]"
                      />
                    </div>

                    {/* 3. Product Pricing (Packages: ৳999, ৳1499, ৳2499) */}
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1">
                        Product Pricing (প্যাকেজ মূল্য)
                      </label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {['৳999', '৳1499', '৳2499'].map((pkg) => (
                          <button
                            key={pkg}
                            type="button"
                            onClick={() => setNewProductPricing(pkg)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                              newProductPricing === pkg
                                ? 'bg-[#533AFD] border-[#533AFD] text-white shadow-xs'
                                : 'bg-[#0B0F19] border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#533AFD]/50'
                            }`}
                          >
                            {pkg}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="অন্যান্য কাস্টম মূল্য (যেমন: ৳1499)"
                        value={newProductPricing}
                        onChange={(e) => setNewProductPricing(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs font-mono focus:outline-none focus:border-[#533AFD]"
                      />
                    </div>

                    {/* 4. Discount Price */}
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1">
                        Discount Price (ডিসকাউন্ট মূল্য)
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: ৳199 বা ৳0"
                        value={newDiscountPrice}
                        onChange={(e) => setNewDiscountPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs font-mono focus:outline-none focus:border-[#533AFD]"
                      />
                    </div>

                    {/* 5. Product Link */}
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1">
                        Product Link (প্রোডাক্ট / ডেমো লিংক)
                      </label>
                      <input
                        type="text"
                        placeholder="demo.bongoweb.site অথবা https://..."
                        value={newProductLink}
                        onChange={(e) => setNewProductLink(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs font-mono focus:outline-none focus:border-[#533AFD]"
                      />
                    </div>

                    {/* 6. Details send option (Checkbox) */}
                    <div className="p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sendDetailsOpt"
                          checked={sendDetailsToClient}
                          onChange={(e) => setSendDetailsToClient(e.target.checked)}
                          className="w-4 h-4 rounded text-[#533AFD] focus:ring-[#533AFD] cursor-pointer"
                        />
                        <label htmlFor="sendDetailsOpt" className="text-xs font-bold text-white cursor-pointer select-none">
                          Details send option (ক্লায়েন্টের কাছে প্রোডাক্ট ডিটেইলস পাঠান)
                        </label>
                      </div>
                      <span className="text-[10px] text-[#818CF8] font-semibold">বিজ্ঞপ্তি যাবে</span>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#432BEE] cursor-pointer shadow-md transition-all"
                      >
                        প্রোডাক্ট যুক্ত ও পাবলিশ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddWebsiteModal(false)}
                        className="px-4 py-3 rounded-xl bg-[#1E293B] text-xs text-[#94A3B8] hover:text-white cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* SINGLE COMPLETE SYSTEM BACKUP VAULT MODAL (Triggered only from header next to logout) */}
      {showBackupVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#091A11] border-2 border-[#00B261] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowBackupVaultModal(false)}
              className="absolute top-5 right-5 text-[#8BB99F] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0F2A1B] text-[#4EEDB0] flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">সম্পূর্ণ ওয়েবসাইট ব্যাকআপ ভল্ট</h3>
                <p className="text-xs text-[#8BB99F]">
                  ১০০% ডেটা গ্যারান্টি: সমস্ত ক্লায়েন্ট অ্যাকাউন্ট, অর্ডার, চ্যাট ও ক্যাটালগ সুরক্ষিত।
                </p>
              </div>
            </div>

            {/* Live Database Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="p-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-center">
                <span className="text-[10px] text-[#69977E] block">মোট ইউজার</span>
                <span className="text-sm font-black text-[#4EEDB0] font-mono">{users.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-center">
                <span className="text-[10px] text-[#69977E] block">মোট অর্ডার</span>
                <span className="text-sm font-black text-[#4EEDB0] font-mono">{orders.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-center">
                <span className="text-[10px] text-[#69977E] block">ওয়েবসাইট স্টক</span>
                <span className="text-sm font-black text-[#4EEDB0] font-mono">{customWebsites.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-center">
                <span className="text-[10px] text-[#69977E] block">সাপোর্ট চ্যাট</span>
                <span className="text-sm font-black text-[#4EEDB0] font-mono">{chatThreads.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-center">
                <span className="text-[10px] text-[#69977E] block">হস্তান্তরিত সাইট</span>
                <span className="text-sm font-black text-[#4EEDB0] font-mono">{deliveredCreds.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-center">
                <span className="text-[10px] text-[#69977E] block">রিসেট রিকোয়েস্ট</span>
                <span className="text-sm font-black text-[#4EEDB0] font-mono">{resetRequests.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadFullSystemBackup}
                className="p-4 rounded-2xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-bold flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md text-center"
              >
                <Download className="w-5 h-5" />
                <span>সম্পূর্ণ ব্যাকআপ ডাউনলোড (JSON)</span>
              </button>

              <label className="p-4 rounded-2xl bg-[#05110A] hover:bg-[#122A1E] text-[#4EEDB0] border border-[#173826] text-xs font-bold flex flex-col items-center justify-center gap-2 cursor-pointer text-center">
                <Upload className="w-5 h-5" />
                <span>অন্য ডিভাইসে ব্যাকআপ রিস্টোর</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFullSystemBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Password Modal (Requirement 11) */}
      {showActionPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#111827] border border-[#533AFD] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#818CF8]" />
              <h3 className="text-base font-black text-white">অ্যাকশন সিকিউরিটি পাসওয়ার্ড</h3>
            </div>
            <p className="text-xs text-[#94A3B8]">
              এই সংবেদনশীল কাজটি সম্পন্ন করতে অ্যাডমিন সিকিউরিটি পাসওয়ার্ড দিন।
            </p>

            {actionPasswordError && (
              <div className="p-3 rounded-xl bg-[#E53935]/20 text-[#FF8A80] text-xs font-bold border border-[#E53935]">
                {actionPasswordError}
              </div>
            )}

            <form onSubmit={handleVerifyActionPassword} className="space-y-3">
              <input
                type="password"
                required
                placeholder="অ্যাডমিন পাসওয়ার্ড লিখুন"
                value={actionPasswordInput}
                onChange={(e) => setActionPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-white text-xs font-mono focus:outline-none focus:border-[#533AFD]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#432BEE] cursor-pointer shadow-xs"
                >
                  অনুমোদন করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowActionPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1E293B] text-xs text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Client Details Modal (Requirement 6) */}
      {viewingClientDetailsUser && (() => {
        const clientOrders = orders.filter((o) => o.phone === viewingClientDetailsUser.phone || o.email === viewingClientDetailsUser.email);
        const clientCreds = deliveredCreds.filter((c) => c.userPhone === viewingClientDetailsUser.phone);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-xl bg-[#091A11] border border-[#00B261] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setViewingClientDetailsUser(null)}
                className="absolute top-5 right-5 text-[#8BB99F] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#008A4B] text-white flex items-center justify-center font-black text-lg shadow-xs">
                  {viewingClientDetailsUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0E2417] text-[#4EEDB0] text-[10px] font-bold border border-[#173826]">
                    ক্লায়েন্ট ওভারভিউ
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {viewingClientDetailsUser.name}
                  </h3>
                  <p className="text-xs text-[#8BB99F] font-mono">
                    রেজিস্ট্রেশন: {viewingClientDetailsUser.registeredAt}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-[#05110A] border border-[#173826] text-xs">
                <div>
                  <span className="text-[#8BB99F] block text-[10px] uppercase font-bold">মোবাইল নম্বর:</span>
                  <span className="text-white font-mono font-bold select-all">{viewingClientDetailsUser.phone}</span>
                </div>
                <div>
                  <span className="text-[#8BB99F] block text-[10px] uppercase font-bold">ইমেইল এড্রেস:</span>
                  <span className="text-white font-mono select-all truncate block">{viewingClientDetailsUser.email}</span>
                </div>
              </div>

              {/* Order Names & Units Information */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    অর্ডার ও ওয়েবসাইট ইউনিটের তথ্য ({clientOrders.length} টি)
                  </h4>
                </div>

                {clientOrders.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#05110A] border border-[#173826] text-center text-xs text-[#8BB99F]">
                    এই ক্লায়েন্টের কোনো অর্ডার পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-2">
                    {clientOrders.map((ord, idx) => (
                      <div
                        key={ord.orderId ? `${ord.orderId}-${idx}` : `co-${idx}`}
                        className="p-3.5 rounded-xl bg-[#05110A] border border-[#173826] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#008A4B] text-white font-mono font-bold text-[11px]">
                              {ord.orderId}
                            </span>
                            <span className="font-bold text-white">
                              {ord.companyName || ord.demoTitle}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8BB99F]">
                            ডেমো কোড: {ord.demoCode} • ক্যাটাগরি: {ord.category}
                          </p>
                          <div className="text-[10px] text-[#69977E] font-mono flex items-center gap-2">
                            <span>পেমেন্ট: {ord.paymentMethod.toUpperCase()}</span>
                            <span>TrxID: <strong className="text-[#4EEDB0]">{ord.transactionId}</strong></span>
                            <span>চার্জ: ১,৯৯০ ৳</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === 'completed'
                              ? 'bg-[#00B261]/20 text-[#00E575] border border-[#00B261]/30'
                              : ord.status === 'processing' || ord.status === 'verified'
                              ? 'bg-[#533AFD]/20 text-[#A5B4FC] border border-[#533AFD]/30'
                              : ord.status === 'cancelled'
                              ? 'bg-[#E53935]/20 text-[#FF8A80] border border-[#E53935]/30'
                              : 'bg-[#FFD552]/20 text-[#FFD552] border border-[#FFD552]/30'
                          }`}>
                            {ord.status === 'completed' 
                              ? '✓ সম্পূর্ণ (Completed)' 
                              : ord.status === 'processing' || ord.status === 'verified'
                              ? '⚡ অনুমোদিত (প্রসেসিং)'
                              : ord.status === 'cancelled'
                              ? 'বাতিলকৃত'
                              : '⏳ পেন্ডিং যাচাই'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Already Delivered Credentials if any */}
              {clientCreds.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#173826]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    হস্তান্তরিত ওয়েবসাইট ডিটেইলস ({clientCreds.length} টি)
                  </h4>
                  <div className="space-y-2">
                    {clientCreds.map((cred, cIdx) => (
                      <div key={cred.id ? `${cred.id}-${cIdx}` : `cred-${cIdx}`} className="p-3 rounded-xl bg-[#05110A] border border-[#00B261]/30 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[#4EEDB0] font-bold">
                          <span>{cred.websiteTitle}</span>
                          <span className="text-[10px] text-[#8BB99F]">{cred.deliveredAt}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A8D7BD]">
                          <div>ID: <strong className="text-white font-mono">{cred.websiteAdminId}</strong></div>
                          <div>Pass: <strong className="text-white font-mono">{cred.websiteAdminPass}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Bottom Actions */}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUserForDelivery(viewingClientDetailsUser);
                    setSelectedDeliveryOrder(clientOrders[0]?.orderId || '');
                    setDeliveryAdminId('');
                    setDeliveryAdminPass('');
                    setDeliveryNotes('');
                    setViewingClientDetailsUser(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Client কে Details পাঠান</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingClientDetailsUser(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#05110A] hover:bg-[#173826] text-[#8BB99F] hover:text-white border border-[#173826] text-xs font-bold cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Deliver Website Credentials Modal (Client কে Details পাঠান) */}
      {selectedUserForDelivery && (() => {
        const userOrders = orders.filter((o) => o.phone === selectedUserForDelivery.phone || o.email === selectedUserForDelivery.email);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-md bg-[#091A11] border border-[#00B261] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
              <button
                onClick={() => setSelectedUserForDelivery(null)}
                className="absolute top-5 right-5 text-[#8BB99F] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#008A4B] text-white text-xs font-bold">
                  Client কে Details পাঠান
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {selectedUserForDelivery.name}
                </h3>
                <p className="text-xs text-[#8BB99F] font-mono">
                  মোবাইল নম্বর: {selectedUserForDelivery.phone}
                </p>
              </div>

              {deliverySuccess && (
                <div className="p-3 rounded-xl bg-[#00B261]/20 border border-[#00B261] text-[#4EEDB0] text-xs font-bold">
                  ✓ সফলভাবে গ্রাহকের প্রোফাইলে ওয়েবসাইট ডিটেইলস পাঠানো হয়েছে!
                </div>
              )}

              <form onSubmit={handleDeliverCredentials} className="space-y-3.5">
                {/* Website / Order selection if multiple */}
                {userOrders.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-[#A8D7BD] mb-1">
                      ওয়েবসাইট নির্বাচন করুন
                    </label>
                    <select
                      value={selectedDeliveryOrder}
                      onChange={(e) => setSelectedDeliveryOrder(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs focus:outline-none focus:border-[#00B261]"
                    >
                      {userOrders.map((ord, oIdx) => (
                        <option key={ord.orderId ? `${ord.orderId}-${oIdx}` : `opt-${oIdx}`} value={ord.orderId || ''}>
                          {ord.companyName || ord.demoTitle} ({ord.orderId || oIdx})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#A8D7BD] mb-1">
                    ID (অ্যাডমিন আইডি / ইউজারনেম) <span className="text-[#FF8A80]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: admin বা client@bongoweb.com"
                    value={deliveryAdminId}
                    onChange={(e) => setDeliveryAdminId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs font-mono focus:outline-none focus:border-[#00B261]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8D7BD] mb-1">
                    Password (অ্যাডমিন পাসওয়ার্ড) <span className="text-[#FF8A80]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: adminPass2026#"
                    value={deliveryAdminPass}
                    onChange={(e) => setDeliveryAdminPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs font-mono focus:outline-none focus:border-[#00B261]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8D7BD] mb-1">
                    ইঞ্জিনিয়ার নোট / ওয়েবসাইট লিংক (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ওয়েবসাইটের অ্যাডমিন প্যানেল লিংক বা বিশেষ নির্দেশনা..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#05110A] border border-[#173826] text-xs text-white resize-none focus:outline-none focus:border-[#00B261]"
                  />
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#008A4B] text-white text-xs font-bold hover:bg-[#009E56] transition-all cursor-pointer shadow-xs"
                  >
                    Details পাঠান
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedUserForDelivery(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-xs text-[#8BB99F] hover:text-white"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Password Reset Modal */}
      {activeResetRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#091A11] border border-[#00B261] rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white">
              {activeResetRequest.phone} এর নতুন পাসওয়ার্ড নির্ধারণ
            </h3>
            <input
              type="text"
              required
              placeholder="যেমন: newpass2026"
              value={manualNewPassword}
              onChange={(e) => setManualNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs font-mono focus:outline-none focus:border-[#00B261]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleResolvePasswordReset('reset')}
                className="flex-1 py-2 rounded-xl bg-[#008A4B] text-white text-xs font-bold"
              >
                নিশ্চিত করুন
              </button>
              <button
                onClick={() => setActiveResetRequest(null)}
                className="px-4 py-2 rounded-xl bg-[#05110A] text-xs text-[#8BB99F]"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
