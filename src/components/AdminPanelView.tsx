import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Users, ShoppingBag, Key, Server, Database, 
  ArrowLeft, CheckCircle2, XCircle, PhoneCall, AlertTriangle, 
  Download, Upload, Lock, Eye, EyeOff, Search, Plus, Trash2, 
  RefreshCw, MessageSquare, ArrowRight, Check, X, FileText, Globe,
  Send, Sparkles, Clock, CheckCheck, User, Zap, Terminal, Activity,
  Sliders, ChevronRight, Edit3, Save, Power, LogOut
} from 'lucide-react';
import { 
  UserAccount, ClientOrder, WebsiteDeliveryCredentials, 
  PasswordResetRequest, AdminConfig, WebsiteDemo, SupportChatThread, SupportChatMessage 
} from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';
import { 
  apiGetOrders, apiUpdateOrderStatus, apiGetUsers,
  apiGetChatThreads, apiSendChatMessage, apiExtendChatTime, apiEndChat,
  apiGetWebsites, apiAddWebsite, apiUpdateWebsite, apiDeleteWebsite,
  apiGetCredentials, apiDeliverCredentials, apiDeleteCredential,
  apiGetResetRequests, apiResolveResetRequest,
  apiExportCompleteBackup, apiRestoreCompleteBackup, pullFromCloudVault
} from '../utils/api';
import { realtimeManager } from '../utils/realtime';

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

  // Active Admin Tab (Backup tab removed, moved to single header button)
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'orders' | 'users' | 'resets' | 'catalog'>('overview');

  // Real Database Collections
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [deliveredCreds, setDeliveredCreds] = useState<WebsiteDeliveryCredentials[]>([]);
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>([]);
  const [customWebsites, setCustomWebsites] = useState<WebsiteDemo[]>(WEBSITE_DEMOS);

  // Live Chat System State
  const [chatThreads, setChatThreads] = useState<SupportChatThread[]>([]);
  const [selectedThreadPhone, setSelectedThreadPhone] = useState<string>('');
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

  // Modal / Action Prompts
  const [selectedUserForDelivery, setSelectedUserForDelivery] = useState<UserAccount | null>(null);
  const [deliveryAdminId, setDeliveryAdminId] = useState('');
  const [deliveryAdminPass, setDeliveryAdminPass] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliverySuccess, setDeliverySuccess] = useState(false);

  // Action Password Prompt
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [actionPasswordInput, setActionPasswordInput] = useState('');
  const [actionPasswordError, setActionPasswordError] = useState('');
  const [showActionPasswordModal, setShowActionPasswordModal] = useState(false);

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

        if (message.sender === 'client') {
          setRealtimeToast({
            title: `💬 লাইভ চ্যাটে নতুন মেসেজ এসেছে!`,
            subtitle: `${phone}: "${message.text.slice(0, 60)}${message.text.length > 60 ? '...' : ''}"`,
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

      const adminSession = sessionStorage.getItem('bongoweb_admin_auth');
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
      const res = await fetch('/api/data');
      if (res.ok) {
        const db = await res.json();
        if (Array.isArray(db.users)) setUsers(db.users);
        if (Array.isArray(db.orders)) setOrders(db.orders);
        if (Array.isArray(db.deliveredCredentials)) setDeliveredCreds(db.deliveredCredentials);
        if (Array.isArray(db.resetRequests)) setResetRequests(db.resetRequests);
        if (Array.isArray(db.customWebsites) && db.customWebsites.length > 0) {
          setCustomWebsites(db.customWebsites);
        }
        if (Array.isArray(db.supportChats)) {
          setChatThreads(db.supportChats);
          if (db.supportChats.length > 0 && !selectedThreadPhone) {
            setSelectedThreadPhone(db.supportChats[0].userPhone);
          }
        }
        if (db.adminConfig) {
          setAdminConfig(db.adminConfig);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Real-Time Polling & Storage Sync every 1.5s
  useEffect(() => {
    const syncData = () => {
      loadAllDatabaseCollections();
    };

    const interval = setInterval(syncData, 1500);
    window.addEventListener('storage', syncData);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', syncData);
    };
  }, [selectedThreadPhone]);

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
    } else if (adminInputPass === adminConfig.masterKey) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('bongoweb_admin_auth', 'true');
    } else {
      setLoginError('ভুল অ্যাডমিন আইডি অথবা এন্ট্রি পাসওয়ার্ড!');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('bongoweb_admin_auth');
    setIsAdminLoggedIn(false);
  };

  // Action Password Confirmation Guard
  const requestProtectedAction = (action: () => void) => {
    setPendingAction(() => action);
    setActionPasswordInput('');
    setActionPasswordError('');
    setShowActionPasswordModal(true);
  };

  const handleVerifyActionPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionPasswordInput === adminConfig.adminActionPassword || actionPasswordInput === adminConfig.masterKey) {
      setShowActionPasswordModal(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setActionPasswordError('ভুল কনফার্মেশন সিকিউরিটি পাসওয়ার্ড!');
    }
  };

  // Orders: Confirm & Cancel
  const handleConfirmOrder = (orderId: string) => {
    requestProtectedAction(async () => {
      const updated = await apiUpdateOrderStatus(orderId, 'verified');
      setOrders(updated);
      loadAllDatabaseCollections();
    });
  };

  const handleCancelOrder = (orderId: string) => {
    requestProtectedAction(async () => {
      const updated = await apiUpdateOrderStatus(orderId, 'cancelled');
      setOrders(updated);
      loadAllDatabaseCollections();
    });
  };

  // Admin Send Chat Reply
  const handleSendAdminReply = async (textToSend?: string) => {
    const text = (textToSend || adminReplyText).trim();
    if (!text || !selectedThreadPhone) return;

    setAdminReplyText('');

    const newMsg: SupportChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatThreads((prev) =>
      prev.map((th) => {
        if (th.userPhone === selectedThreadPhone) {
          return {
            ...th,
            lastMessage: text,
            lastUpdated: 'এখনই',
            unreadAdminCount: 0,
            unreadClientCount: (th.unreadClientCount || 0) + 1,
            messages: [...th.messages, newMsg]
          };
        }
        return th;
      })
    );

    try {
      await apiSendChatMessage({
        phone: selectedThreadPhone,
        sender: 'admin',
        text
      });
      loadAllDatabaseCollections();
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Extend Chat Inactivity Timer for Client (+5 Min, etc.)
  const handleExtendChatTime = async (minutes: number = 5) => {
    if (!selectedThreadPhone) return;
    try {
      await apiExtendChatTime(selectedThreadPhone, minutes);
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

    const newCred: WebsiteDeliveryCredentials = {
      id: `DELIV-${Date.now()}`,
      userPhone: selectedUserForDelivery.phone,
      websiteTitle: 'বিজনেস ওয়েবসাইট অ্যাডমিন প্যানেল',
      websiteCode: '#BW-ONLINE',
      websiteAdminId: deliveryAdminId.trim(),
      websiteAdminPass: deliveryAdminPass.trim(),
      notes: deliveryNotes.trim() || 'আপনার ওয়েবসাইট সম্পূর্ণ তৈরি ও রেডি। লগইন করুন।',
      deliveredAt: new Date().toLocaleString('bn-BD')
    };

    const updated = [newCred, ...deliveredCreds.filter((c) => c.userPhone !== selectedUserForDelivery.phone)];
    saveDeliveredCreds(updated);

    // Auto-send Live Chat notification
    const threadExists = chatThreads.find((t) => t.userPhone === selectedUserForDelivery.phone);
    if (threadExists) {
      handleSendAdminReply(`🎉 অভিনন্দন! আপনার ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড ডেলিভারি করা হয়েছে। ইউজারনেম: ${deliveryAdminId.trim()} | পাসওয়ার্ড: ${deliveryAdminPass.trim()}`);
    }

    setDeliverySuccess(true);
    setTimeout(() => {
      setDeliverySuccess(false);
      setSelectedUserForDelivery(null);
      setDeliveryAdminId('');
      setDeliveryAdminPass('');
      setDeliveryNotes('');
    }, 2000);
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

  // Add New Website to Inventory
  const handleCreateNewWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteTitle.trim() || !newSiteThumbnail.trim()) return;

    const randomCode = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const newDemo: WebsiteDemo = {
      id: `custom-${Date.now()}`,
      fourDigitCode: randomCode,
      title: `${randomCode} ${newSiteTitle.trim()}`,
      banglaTitle: `${randomCode} ${newSiteTitle.trim()}`,
      category: newSiteCategory,
      categoryLabel: newSiteCategory.toUpperCase(),
      description: newSiteDesc.trim() || 'উচ্চগতির আধুনিক ওয়েবসাইট',
      priceTag: '১,৯৯০ ৳',
      demoUrl: newSiteSecretUrl.trim() || 'demo.bongoweb.site',
      accentColor: 'from-white/20 to-white/5',
      rating: 5.0,
      ordersCount: '24h Launch',
      previewImage: newSiteThumbnail.trim(),
      heroHeadline: newSiteTitle.trim(),
      features: ['মোবাইল অপ্টিমাইজড', 'বিকাশ ও নগদ পেমেন্ট', 'ক্লাউড হোস্টিং', '২৪ ঘণ্টা ডেলিভারি'],
      mockData: {
        heroSub: newSiteDesc.trim(),
        items: []
      }
    };

    const updated = await apiAddWebsite(newDemo);
    setCustomWebsites(updated);
    setShowAddWebsiteModal(false);
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

  // Active chat thread
  const activeThread = chatThreads.find((t) => t.userPhone === selectedThreadPhone) || chatThreads[0];
  const activeThreadUser = users.find((u) => u.phone === activeThread?.userPhone);
  const activeThreadOrders = orders.filter((o) => o.phone === activeThread?.userPhone);

  const filteredThreads = chatThreads.filter((t) => 
    t.userName.toLowerCase().includes(chatSearch.toLowerCase()) || 
    t.userPhone.includes(chatSearch)
  );

  // ==========================================
  // VIEW: IF ADMIN IS NOT LOGGED IN
  // ==========================================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#05110A] text-[#FFFFFF] flex flex-col items-center justify-center p-4 font-sans select-none relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#008A4B]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#0B1E13]/90 backdrop-blur-xl border border-[#173826] rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative z-10">
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00A859] to-[#006837] text-white flex items-center justify-center mx-auto mb-3.5 shadow-[0_6px_24px_rgba(0,168,89,0.4)]">
              <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F2A1B] border border-[#00B261]/30 text-[#4EEDB0] text-[11px] font-mono font-bold tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B261] animate-ping" />
              <span>LEAF GREEN ENTERPRISE CORE</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Executive Admin Control
            </h1>
            <p className="text-xs text-[#8BB99F] mt-1 font-medium">
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
              <label className="block text-xs font-bold text-[#A8D7BD] mb-1.5 uppercase tracking-wider text-[10px]">
                অ্যাডমিন ইউজারনেম
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={adminInputId}
                onChange={(e) => setAdminInputId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#06140D] border border-[#173826] text-white text-xs sm:text-sm font-mono placeholder-[#457258] focus:outline-none focus:border-[#00B261] focus:ring-1 focus:ring-[#00B261] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8D7BD] mb-1.5 uppercase tracking-wider text-[10px]">
                অ্যাডমিন এন্ট্রি পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminInputPass}
                onChange={(e) => setAdminInputPass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#06140D] border border-[#173826] text-white text-xs sm:text-sm placeholder-[#457258] focus:outline-none focus:border-[#00B261] focus:ring-1 focus:ring-[#00B261] transition-all font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#008A4B] to-[#00A859] hover:from-[#009E56] hover:to-[#00BD64] active:scale-[0.98] text-white text-xs sm:text-sm font-black shadow-[0_6px_24px_rgba(0,138,75,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>লগইন করুন (Unlock Console)</span>
              </button>
            </div>
          </form>

          {/* Master Key Emergency Reset Link */}
          <div className="mt-6 pt-5 border-t border-[#173826] flex items-center justify-between text-xs">
            <button
              onClick={() => setShowMasterKeyModal(true)}
              className="text-[#4EEDB0] hover:text-white font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              <span>মাস্টার কি রিকভারি</span>
            </button>
            <button
              onClick={onBackToApp}
              className="text-[#8BB99F] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
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
  // VIEW: EXECUTIVE LEAF GREEN ADMIN SUITE
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-[#05110A] text-[#FFFFFF] font-sans flex flex-col selection:bg-[#00B261]/30 selection:text-[#4EEDB0]">
      {/* Floating Real-Time Event Notification Toast */}
      {realtimeToast && (
        <div 
          onClick={() => {
            if (realtimeToast.actionTab) setActiveTab(realtimeToast.actionTab);
            if (realtimeToast.threadPhone) setSelectedThreadPhone(realtimeToast.threadPhone);
            setRealtimeToast(null);
          }}
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full p-4 rounded-2xl bg-[#091A11] border-2 border-[#00B261] shadow-[0_10px_30px_rgba(0,178,97,0.3)] animate-slideDown flex items-start gap-3 cursor-pointer group"
          role="alert"
        >
          <div className="p-2 rounded-xl bg-[#008A4B] text-white shrink-0 shadow-xs">
            {realtimeToast.type === 'order' ? <ShoppingBag className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-black text-white group-hover:text-[#4EEDB0] transition-colors">
              {realtimeToast.title}
            </h5>
            <p className="text-[11px] text-[#A8D7BD] mt-0.5 line-clamp-2">
              {realtimeToast.subtitle}
            </p>
            <span className="text-[9px] text-[#4EEDB0] font-bold block mt-1.5 underline">
              সরাসরি দেখতে ক্লিক করুন →
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setRealtimeToast(null);
            }}
            className="text-[#69977E] hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header with Single Backup Vault Button Next to Logout */}
      <header className="sticky top-0 z-40 w-full bg-[#091A11]/95 backdrop-blur-md border-b border-[#173826] shadow-sm select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="p-2 rounded-xl bg-[#05110A] hover:bg-[#122A1E] text-[#4EEDB0] border border-[#173826] hover:border-[#00B261]/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
              title="ওয়েবসাইটে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">ওয়েবসাইট</span>
            </button>

            <div className="h-6 w-px bg-[#173826] hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00A859] to-[#006837] text-white flex items-center justify-center font-black text-xs shadow-[0_2px_12px_rgba(0,168,89,0.3)]">
                BW
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 leading-none">
                  <span className="text-sm sm:text-base font-black tracking-tight text-white">
                    BongoWeb Core
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0F2A1B] text-[#4EEDB0] text-[9px] font-mono font-bold border border-[#00B261]/30">
                    ENTERPRISE
                  </span>
                </div>
                <span className="text-[10px] text-[#69977E] font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B261] animate-pulse" />
                  Live Sync Active • 99.99% Uptime
                </span>
              </div>
            </div>
          </div>

          {/* Right: ONLY Single Complete Backup Vault Button + Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowBackupVaultModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white border border-[#00B261]/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="সম্পূর্ণ ওয়েবসাইট ব্যাকআপ ভল্ট"
            >
              <Database className="w-3.5 h-3.5" />
              <span>সম্পূর্ণ ওয়েবসাইট ব্যাকআপ</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2 rounded-xl bg-[#E53935]/15 hover:bg-[#E53935] text-[#FF8A80] hover:text-white border border-[#E53935]/30 text-xs font-bold transition-all cursor-pointer"
            >
              লগআউট
            </button>
          </div>
        </div>

        {/* Executive Tab Navigation Bar (Backup Tab Removed) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto py-2 border-t border-[#173826]/70 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-[#008A4B] text-white shadow-xs'
                : 'text-[#8BB99F] hover:bg-[#0E2417] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-[#008A4B] text-white shadow-xs'
                : 'text-[#8BB99F] hover:bg-[#0E2417] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>লাইভ চ্যাট হাব</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#00B261] text-black text-[10px] font-black">
              {chatThreads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#008A4B] text-white shadow-xs'
                : 'text-[#8BB99F] hover:bg-[#0E2417] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>অর্ডারসমূহ</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#0E2417] text-[#4EEDB0] text-[10px] font-bold border border-[#173826]">
              {orders.length}
            </span>
            {orders.filter((o) => o.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#FFD552] animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-[#008A4B] text-white shadow-xs'
                : 'text-[#8BB99F] hover:bg-[#0E2417] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ব্যবহারকারী ও ডেলিভারি ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('resets')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'resets'
                ? 'bg-[#008A4B] text-white shadow-xs'
                : 'text-[#8BB99F] hover:bg-[#0E2417] hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>পাসওয়ার্ড রিসেট ডেস্ক</span>
            {resetRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-[#008A4B] text-white shadow-xs'
                : 'text-[#8BB99F] hover:bg-[#0E2417] hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>ওয়েবসাইট স্টক ও এডিট ({customWebsites.length})</span>
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
          <div className="bg-[#091A11] border border-[#173826] rounded-3xl overflow-hidden shadow-xl animate-fadeIn flex flex-col md:flex-row h-[680px]">
            {/* Left Column: Conversations List */}
            <div className="w-full md:w-80 border-r border-[#173826] flex flex-col bg-[#07160D]">
              <div className="p-4 border-b border-[#173826]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#4EEDB0]" />
                    <h3 className="text-sm font-black text-white">গ্রাহক চ্যাট তালিকা</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0F2A1B] text-[#4EEDB0]">
                    {chatThreads.length} অ্যাক্টিভ
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
                  <div className="p-6 text-center text-xs text-[#69977E]">
                    কোনো সক্রিয় কথোপকথন নেই
                  </div>
                ) : (
                  filteredThreads.map((thread) => {
                    const isSelected = thread.userPhone === selectedThreadPhone;
                    return (
                      <div
                        key={thread.userPhone}
                        onClick={() => setSelectedThreadPhone(thread.userPhone)}
                        className={`p-3.5 transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#0E2417] border-l-4 border-l-[#00B261]'
                            : 'hover:bg-[#0B1E13]'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-[#122A1E] text-[#4EEDB0] flex items-center justify-center font-bold text-xs border border-[#173826]">
                            {thread.userName.charAt(0)}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00B261] border-2 border-[#07160D]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white truncate">
                              {thread.userName}
                            </h4>
                            <span className="text-[9px] text-[#69977E] font-mono shrink-0">
                              {thread.lastUpdated}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#69977E] font-mono mt-0.5 truncate">
                            {thread.userPhone}
                          </p>
                          <p className="text-[11px] text-[#8BB99F] mt-1 truncate">
                            {thread.lastMessage}
                          </p>
                        </div>

                        {thread.unreadAdminCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#00B261] text-black text-[9px] font-black flex items-center justify-center shrink-0">
                            {thread.unreadAdminCount}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Center Column: Active Chat Stream */}
            <div className="flex-1 flex flex-col bg-[#091A11]">
              <div className="p-4 border-b border-[#173826] flex items-center justify-between bg-[#07160D]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#008A4B] text-white flex items-center justify-center font-bold text-xs">
                    {activeThread?.userName.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white">
                      {activeThread?.userName || 'গ্রাহক নির্বাচন করুন'}
                    </h3>
                    <p className="text-[10px] text-[#4EEDB0] font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00B261]" />
                      <span>{activeThread?.userPhone || 'সরাসরি রিয়েল-টাইম'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {/* Client Inactivity Timer remaining */}
                  {activeThread?.expiresAt && (
                    <div 
                      className="px-2.5 py-1 rounded-lg bg-[#0F2A1B] border border-[#00B261]/30 text-[#4EEDB0] text-[11px] font-mono font-bold flex items-center gap-1.5" 
                      title="ক্লায়েন্ট ইনঅ্যাক্টিভিটি টাইমার (৫ মিনিট নিষ্ক্রিয় থাকলে চ্যাট বন্ধ হবে)"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#00B261]" />
                      <span>
                        {Math.max(0, Math.floor((activeThread.expiresAt - Date.now()) / 1000 / 60))} মিনিট অবশিষ্ট
                      </span>
                    </div>
                  )}

                  {/* +5 Min Extension Button as requested */}
                  {activeThread && (
                    <button
                      onClick={() => handleExtendChatTime(5)}
                      className="px-2.5 py-1 rounded-lg bg-[#008A4B] hover:bg-[#009E56] text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="ক্লায়েন্ট অফলাইন থাকলে চ্যাটের মেয়াদ আরও ৫ মিনিট বাড়ান"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+৫ মি. বৃদ্ধি</span>
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
                      className="px-2.5 py-1 rounded-lg bg-[#E53935]/20 hover:bg-[#E53935] text-[#FF8A80] hover:text-white border border-[#E53935]/30 text-[11px] font-bold transition-all cursor-pointer"
                      title="চ্যাট সেশন সমাপ্ত করুন"
                    >
                      <X className="w-3 h-3" />
                      <span className="hidden sm:inline">চ্যাট ক্লোজ</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Message Stream */}
              <div 
                ref={chatContainerRef}
                onScroll={handleChatContainerScroll}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {activeThread?.messages?.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-[#008A4B] text-white rounded-br-xs shadow-xs'
                            : 'bg-[#0F2A1B] border border-[#173826] text-[#C8EAD7] rounded-bl-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-[#69977E] font-mono mt-1 px-1 flex items-center gap-1">
                        <span>{msg.timestamp}</span>
                        {isAdmin && <CheckCheck className="w-3 h-3 text-[#4EEDB0]" />}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Canned Responses Pills */}
              <div className="px-4 py-2 border-t border-[#173826] bg-[#07160D] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
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
              <div className="p-3 sm:p-4 border-t border-[#173826] bg-[#07160D]">
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
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-xs text-white placeholder-[#69977E] focus:outline-none focus:border-[#00B261]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#008A4B] hover:bg-[#009E56] active:bg-[#00743E] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
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
                    {activeThreadOrders.map((o) => (
                      <div key={o.orderId} className="p-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-xs">
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
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">অর্ডারসমূহ ({orders.length})</h2>
                <p className="text-xs text-[#8BB99F]">রিয়েল-টাইমে প্রতিটি নতুন অর্ডারের TrxID যাচাই করে কনফার্ম করুন।</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#091A11] border border-[#173826] text-center text-xs text-[#8BB99F]">
                কোনো অর্ডার পাওয়া যায়নি। গ্রাহক চেকআউট করলে এখানে লাইভ দৃশ্যমান হবে।
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] hover:border-[#00B261]/50 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#173826] pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#008A4B] text-white font-mono font-black text-xs">
                          {ord.orderId}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#05110A] text-[#4EEDB0] font-mono text-xs border border-[#173826]">
                          {ord.demoCode}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {ord.companyName} ({ord.clientName})
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          ord.status === 'verified'
                            ? 'bg-[#00B261]/20 text-[#4EEDB0] border border-[#00B261]'
                            : ord.status === 'cancelled'
                            ? 'bg-[#E53935]/20 text-[#FF8A80] border border-[#E53935]'
                            : 'bg-[#FFD552]/20 text-[#FFD552] border border-[#FFD552]'
                        }`}>
                          {ord.status === 'verified' ? '✓ নিশ্চিতকৃত' : ord.status === 'cancelled' ? 'বাতিলকৃত' : '⏳ পেন্ডিং ভেরিফিকেশন'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#8BB99F]">
                      <div>
                        <span>মোবাইল: </span>
                        <strong className="text-white font-mono">{ord.phone}</strong>
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
                        <strong className="text-white">১,৯৯০ ৳</strong> (+১২০ ৳/মাস মেইনটেন্যান্স)
                      </div>
                      <div>
                        <span>তারিখ: </span>
                        <span className="text-white">{ord.createdAt}</span>
                      </div>
                    </div>

                    {ord.status === 'pending' && (
                      <div className="pt-2 border-t border-[#173826] flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCancelOrder(ord.orderId)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#E53935]/15 hover:bg-[#E53935] text-[#FF8A80] hover:text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          অর্ডার বাতিল করুন
                        </button>
                        <button
                          onClick={() => handleConfirmOrder(ord.orderId)}
                          className="px-4 py-1.5 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>পাসওয়ার্ড দিয়ে অর্ডার নিশ্চিত করুন</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: USERS & CREDENTIALS ================= */}
        {activeTab === 'users' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">নিবন্ধিত ব্যবহারকারী তালিকা ({users.length})</h2>
                <p className="text-xs text-[#8BB99F]">ক্লায়েন্টদের ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড ডেলিভারি করুন।</p>
              </div>
            </div>

            {users.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#091A11] border border-[#173826] text-center text-xs text-[#8BB99F]">
                কোনো নিবন্ধিত ব্যবহারকারী নেই।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((usr, uIdx) => {
                  const userOrders = orders.filter((o) => o.phone === usr.phone || o.email === usr.email);
                  const userDelivery = deliveredCreds.find((c) => c.userPhone === usr.phone);

                  return (
                    <div
                      key={uIdx}
                      className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-[#008A4B] text-white flex items-center justify-center font-bold text-xs">
                              {usr.name.charAt(0)}
                            </span>
                            <span>{usr.name}</span>
                          </h4>
                          <span className="text-[10px] text-[#8BB99F] font-mono">
                            {usr.registeredAt}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1 text-xs text-[#8BB99F]">
                          <p>মোবাইল: <strong className="text-white font-mono">{usr.phone}</strong></p>
                          <p>ইমেইল: <strong className="text-white font-mono">{usr.email}</strong></p>
                          <p>মোট অর্ডার: <strong className="text-[#4EEDB0]">{userOrders.length} টি</strong></p>
                        </div>

                        {userDelivery ? (
                          <div className="mt-3 p-3 rounded-xl bg-[#05110A] border border-[#00B261]/40 text-xs">
                            <div className="flex items-center justify-between text-[#4EEDB0] font-bold mb-1">
                              <span>✓ ওয়েবসাইট ক্রিডেনশিয়াল হস্তান্তর সম্পন্ন</span>
                              <button
                                onClick={() => handleDeleteCredentials(userDelivery.id)}
                                className="text-[#FF8A80] hover:underline text-[10px] cursor-pointer"
                              >
                                ডিলিট
                              </button>
                            </div>
                            <p className="text-[11px] text-[#A8D7BD]">
                              অ্যাডমিন আইডি: <strong className="text-white font-mono">{userDelivery.websiteAdminId}</strong>
                            </p>
                            <p className="text-[11px] text-[#A8D7BD]">
                              পাসওয়ার্ড: <strong className="text-white font-mono">{userDelivery.websiteAdminPass}</strong>
                            </p>
                          </div>
                        ) : (
                          <div className="mt-3 p-2.5 rounded-xl bg-[#05110A] text-[11px] text-[#8BB99F] border border-[#173826]">
                            কোনো ওয়েবসাইট অ্যাক্সেস পাঠানো হয়নি।
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSelectedUserForDelivery(usr);
                            setDeliveryAdminId('');
                            setDeliveryAdminPass('');
                            setDeliveryNotes('');
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>আইডি-পাসওয়ার্ড হস্তান্তর করুন</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: PASSWORD RESET CALL DESK ================= */}
        {activeTab === 'resets' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">পাসওয়ার্ড রিসেট ডেস্ক</h2>
                <p className="text-xs text-[#8BB99F]">গ্রাহকদের কল অনুরোধের ভিত্তিতে পাসওয়ার্ড আপডেট করুন।</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#0E2417] text-[#4EEDB0] text-xs font-bold border border-[#173826]">
                {resetRequests.filter((r) => r.status === 'pending').length} টি অপেক্ষমান
              </span>
            </div>

            {resetRequests.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#091A11] border border-[#173826] text-center text-xs text-[#8BB99F]">
                কোনো পাসওয়ার্ড রিসেট রিকোয়েস্ট নেই।
              </div>
            ) : (
              <div className="space-y-3">
                {resetRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-[#4EEDB0]" />
                        <h4 className="text-sm font-bold text-white font-mono">{req.phone}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'reset' ? 'bg-[#00B261]/20 text-[#4EEDB0]' : 'bg-[#FFD552]/20 text-[#FFD552]'
                        }`}>
                          {req.status === 'reset' ? '✓ রিসেট সম্পন্ন' : req.status === 'rejected' ? 'বাতিল' : 'অপেক্ষমান'}
                        </span>
                      </div>
                      <p className="text-xs text-[#8BB99F] mt-1">সময়: {req.requestedAt}</p>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveResetRequest(req);
                            setManualNewPassword('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#008A4B] text-white text-xs font-bold hover:bg-[#009E56] cursor-pointer"
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
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
              {customWebsites.map((site) => (
                <div
                  key={site.id}
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

            {/* Modal: Upload New Website (Non-hover explicit modal) */}
            {showAddWebsiteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                <div className="w-full max-w-lg bg-[#091A11] border-2 border-[#00B261] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
                  <button
                    onClick={() => setShowAddWebsiteModal(false)}
                    className="absolute top-5 right-5 text-[#8BB99F] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-base font-black text-white">নতুন ওয়েবসাইট আপলোড করুন</h3>

                  <form onSubmit={handleCreateNewWebsite} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#A8D7BD] mb-1">ওয়েবসাইট নাম</label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: Luxe Watch - Smart Luxury Store"
                        value={newSiteTitle}
                        onChange={(e) => setNewSiteTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs focus:outline-none focus:border-[#00B261]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8D7BD] mb-1">ক্যাটাগরি</label>
                      <select
                        value={newSiteCategory}
                        onChange={(e) => setNewSiteCategory(e.target.value as any)}
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
                        placeholder="https://images.unsplash.com/..."
                        value={newSiteThumbnail}
                        onChange={(e) => setNewSiteThumbnail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs focus:outline-none focus:border-[#00B261]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8D7BD] mb-1">গোপন লাইভ URL (ক্লায়েন্টের কাছে লুকায়িত থাকবে)</label>
                      <input
                        type="text"
                        placeholder="demo.bongoweb.site"
                        value={newSiteSecretUrl}
                        onChange={(e) => setNewSiteSecretUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs font-mono focus:outline-none focus:border-[#00B261]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#A8D7BD] mb-1">বর্ণনা</label>
                      <textarea
                        rows={2}
                        placeholder="ওয়েবসাইটের মূল সুবিধাসমূহ..."
                        value={newSiteDesc}
                        onChange={(e) => setNewSiteDesc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#05110A] border border-[#173826] text-xs text-white resize-none focus:outline-none focus:border-[#00B261]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#008A4B] text-white text-xs font-bold hover:bg-[#009E56] cursor-pointer"
                    >
                      ক্যাটালগে যুক্ত করুন
                    </button>
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

      {/* Action Password Modal */}
      {showActionPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#091A11] border border-[#00B261] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#4EEDB0]" />
              <h3 className="text-base font-black text-white">অ্যাকশন সিকিউরিটি পাসওয়ার্ড</h3>
            </div>
            <p className="text-xs text-[#8BB99F]">
              এই সংবেদনশীল কাজটি সম্পন্ন করতে অ্যাডমিন কনফার্মেশন পাসওয়ার্ড দিন।
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
                placeholder="অ্যাকশন পাসওয়ার্ড (confirm786)"
                value={actionPasswordInput}
                onChange={(e) => setActionPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs font-mono focus:outline-none focus:border-[#00B261]"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#008A4B] text-white text-xs font-bold hover:bg-[#009E56] cursor-pointer"
                >
                  অনুমোদন করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowActionPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#05110A] text-xs text-[#8BB99F] cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliver Website Credentials Modal */}
      {selectedUserForDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#091A11] border border-[#00B261] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedUserForDelivery(null)}
              className="absolute top-5 right-5 text-[#8BB99F] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#008A4B] text-white text-xs font-bold">
                ওয়েবসাইট হস্তান্তর
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                {selectedUserForDelivery.name} কে ক্রিডেনশিয়াল পাঠান
              </h3>
              <p className="text-xs text-[#8BB99F]">
                মোবাইল নম্বর: {selectedUserForDelivery.phone}
              </p>
            </div>

            {deliverySuccess && (
              <div className="p-3 rounded-xl bg-[#00B261]/20 border border-[#00B261] text-[#4EEDB0] text-xs font-bold">
                ✓ সফলভাবে গ্রাহকের প্রোফাইলে অ্যাক্সেস পাঠানো হয়েছে!
              </div>
            )}

            <form onSubmit={handleDeliverCredentials} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#A8D7BD] mb-1">
                  ওয়েবসাইট অ্যাডমিন আইডি / ইউজারনেম
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: admin বা user@store.com"
                  value={deliveryAdminId}
                  onChange={(e) => setDeliveryAdminId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs font-mono focus:outline-none focus:border-[#00B261]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8D7BD] mb-1">
                  ওয়েবসাইট অ্যাডমিন পাসওয়ার্ড
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: pass@2026#"
                  value={deliveryAdminPass}
                  onChange={(e) => setDeliveryAdminPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#05110A] border border-[#173826] text-white text-xs font-mono focus:outline-none focus:border-[#00B261]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8D7BD] mb-1">
                  ইঞ্জিনিয়ার নোট (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="ওয়েবসাইটের অ্যাডমিন লিংক বা নির্দেশনা..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#05110A] border border-[#173826] text-xs text-white resize-none focus:outline-none focus:border-[#00B261]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#008A4B] text-white text-xs font-bold hover:bg-[#009E56] cursor-pointer"
              >
                গ্রাহকের অ্যাকাউন্টে পাঠান
              </button>
            </form>
          </div>
        </div>
      )}

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
