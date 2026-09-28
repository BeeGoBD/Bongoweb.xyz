import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Users, ShoppingBag, Key, Server, Database, 
  ArrowLeft, CheckCircle2, XCircle, PhoneCall, AlertTriangle, 
  Download, Upload, Lock, Eye, EyeOff, Search, Plus, Trash2, 
  RefreshCw, MessageSquare, ArrowRight, Check, X, FileText, Globe,
  Send, Sparkles, Clock, CheckCheck, User, Zap, Terminal, Activity,
  Sliders, ChevronRight, CornerDownLeft, MessageCircle
} from 'lucide-react';
import { 
  UserAccount, ClientOrder, WebsiteDeliveryCredentials, 
  PasswordResetRequest, AdminConfig, WebsiteDemo, SupportChatThread, SupportChatMessage 
} from '../types';
import { WEBSITE_DEMOS } from '../data/mockData';

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

  // Config State
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({
    adminId: 'admin',
    adminEntryPassword: 'admin123',
    adminActionPassword: 'confirm786',
    masterKey: 'MASTER-BONGO-2026'
  });

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'orders' | 'users' | 'resets' | 'catalog' | 'backup'>('overview');

  // Real Database Collections from localStorage
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

  // Modal / Action Prompts
  const [selectedUserForDelivery, setSelectedUserForDelivery] = useState<UserAccount | null>(null);
  const [deliveryAdminId, setDeliveryAdminId] = useState('');
  const [deliveryAdminPass, setDeliveryAdminPass] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliverySuccess, setDeliverySuccess] = useState(false);

  // Action Password Prompt for Confirming Orders & Backups
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [actionPasswordInput, setActionPasswordInput] = useState('');
  const [actionPasswordError, setActionPasswordError] = useState('');
  const [showActionPasswordModal, setShowActionPasswordModal] = useState(false);

  // New Website Upload State
  const [showAddWebsiteModal, setShowAddWebsiteModal] = useState(false);
  const [newSiteTitle, setNewSiteTitle] = useState('');
  const [newSiteDesc, setNewSiteDesc] = useState('');
  const [newSiteCategory, setNewSiteCategory] = useState<'ecommerce' | 'restaurant' | 'blogging' | 'grocery'>('ecommerce');
  const [newSiteThumbnail, setNewSiteThumbnail] = useState('');
  const [newSiteSecretUrl, setNewSiteSecretUrl] = useState('');

  // Password Reset Manual Resolution State
  const [activeResetRequest, setActiveResetRequest] = useState<PasswordResetRequest | null>(null);
  const [manualNewPassword, setManualNewPassword] = useState('');

  // Search Filter for General Sections
  const [globalSearch, setGlobalSearch] = useState('');

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

      // Load Users
      const storedUsers = localStorage.getItem('bongoweb_registered_users');
      let loadedUsers: UserAccount[] = [];
      if (storedUsers) {
        loadedUsers = JSON.parse(storedUsers);
        setUsers(loadedUsers);
      } else {
        const singleUser = localStorage.getItem('bongoweb_user');
        if (singleUser) {
          loadedUsers = [JSON.parse(singleUser)];
          setUsers(loadedUsers);
          localStorage.setItem('bongoweb_registered_users', JSON.stringify(loadedUsers));
        }
      }

      // Load Orders
      const storedOrders = localStorage.getItem('bongoweb_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      // Load Delivered Credentials
      const storedCreds = localStorage.getItem('bongoweb_delivered_credentials');
      if (storedCreds) {
        setDeliveredCreds(JSON.parse(storedCreds));
      }

      // Load Reset Requests
      const storedResets = localStorage.getItem('bongoweb_reset_requests');
      if (storedResets) {
        setResetRequests(JSON.parse(storedResets));
      }

      // Load Custom Catalog
      const storedCatalog = localStorage.getItem('bongoweb_custom_catalog');
      if (storedCatalog) {
        setCustomWebsites(JSON.parse(storedCatalog));
      }

      // Initialize / Load Support Chat Threads
      loadOrInitChatThreads(loadedUsers);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Initialize or Load Chat Threads
  const loadOrInitChatThreads = (currentUsersList: UserAccount[]) => {
    try {
      const storedThreads = localStorage.getItem('bongoweb_support_chats');
      if (storedThreads) {
        const parsed: SupportChatThread[] = JSON.parse(storedThreads);
        setChatThreads(parsed);
        if (parsed.length > 0 && !selectedThreadPhone) {
          setSelectedThreadPhone(parsed[0].userPhone);
        }
      } else {
        // Seed initial high-fidelity real conversations from existing users or demo client
        const defaultThreads: SupportChatThread[] = [
          {
            userPhone: currentUsersList[0]?.phone || '01711223344',
            userName: currentUsersList[0]?.name || 'সাকিব আল হাসান',
            userEmail: currentUsersList[0]?.email || 'sakib@example.com',
            lastMessage: 'আমার পেমেন্ট কি ভেরিফাই হয়েছে?',
            lastUpdated: '১০ মিনিট আগে',
            unreadAdminCount: 1,
            unreadClientCount: 0,
            messages: [
              {
                id: '1',
                sender: 'client',
                text: 'আসসালামু আলাইকুম! আমি ১,৯৯০ টাকার ই-কমার্স ওয়েবসাইট প্যাকেজের পেমেন্ট পাঠিয়েছি।',
                timestamp: '11:40 AM'
              },
              {
                id: '2',
                sender: 'admin',
                text: 'ওয়ালাইকুম আসসালাম! আপনার অর্ডার ও TrxID আমরা পেয়েছি। ভেরিফিকেশন চলছে।',
                timestamp: '11:42 AM'
              },
              {
                id: '3',
                sender: 'client',
                text: 'আমার পেমেন্ট কি ভেরিফাই হয়েছে?',
                timestamp: '11:50 AM'
              }
            ]
          },
          {
            userPhone: '01855667788',
            userName: 'তানভীর আহমেদ (রেস্টুরেন্ট শপ)',
            userEmail: 'tanvir.food@gmail.com',
            lastMessage: 'ডোমেইনটি কখন লাইভ হবে?',
            lastUpdated: '১ ঘণ্টা আগে',
            unreadAdminCount: 0,
            unreadClientCount: 0,
            messages: [
              {
                id: '10',
                sender: 'client',
                text: 'হ্যালো ভাইয়া, সুলতান ডাইন স্টাইলের রেস্তোরাঁ সাইটটি ২৪ ঘণ্টার মধ্যে কি ডেলিভারি পাওয়া যাবে?',
                timestamp: '10:15 AM'
              },
              {
                id: '11',
                sender: 'admin',
                text: 'হ্যাঁ অবশ্যই! আমাদের ফুল ক্লাউড প্যাকেজ ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি গ্যারান্টি যুক্ত।',
                timestamp: '10:20 AM'
              },
              {
                id: '12',
                sender: 'client',
                text: 'ডোমেইনটি কখন লাইভ হবে?',
                timestamp: '10:45 AM'
              }
            ]
          }
        ];

        setChatThreads(defaultThreads);
        localStorage.setItem('bongoweb_support_chats', JSON.stringify(defaultThreads));
        setSelectedThreadPhone(defaultThreads[0].userPhone);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auto scroll chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    requestProtectedAction(() => {
      const updated = orders.map((o) => 
        o.orderId === orderId ? { ...o, status: 'verified' as const } : o
      );
      saveOrders(updated);
    });
  };

  const handleCancelOrder = (orderId: string) => {
    requestProtectedAction(() => {
      const updated = orders.map((o) => 
        o.orderId === orderId ? { ...o, status: 'cancelled' as const } : o
      );
      saveOrders(updated);
    });
  };

  // Admin Send Chat Reply
  const handleSendAdminReply = (textToSend?: string) => {
    const text = (textToSend || adminReplyText).trim();
    if (!text || !selectedThreadPhone) return;

    const newMsg: SupportChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedThreads = chatThreads.map((th) => {
      if (th.userPhone === selectedThreadPhone) {
        return {
          ...th,
          lastMessage: text,
          lastUpdated: 'এখনই',
          unreadAdminCount: 0,
          unreadClientCount: th.unreadClientCount + 1,
          messages: [...th.messages, newMsg]
        };
      }
      return th;
    });

    saveChatThreads(updatedThreads);
    setAdminReplyText('');
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

    // Also auto-notify via Live Chat
    const threadExists = chatThreads.find((t) => t.userPhone === selectedUserForDelivery.phone);
    const deliveryNotice = `🎉 অভিনন্দন! আপনার ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড ডেলিভারি করা হয়েছে। ইউজারনেম: ${deliveryAdminId.trim()} | পাসওয়ার্ড: ${deliveryAdminPass.trim()}`;
    if (threadExists) {
      handleSendAdminReply(deliveryNotice);
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
    requestProtectedAction(() => {
      const updated = deliveredCreds.filter((c) => c.id !== credId);
      saveDeliveredCreds(updated);
    });
  };

  // Password Reset Resolution
  const handleResolvePasswordReset = (status: 'reset' | 'rejected' | 'call_not_received') => {
    if (!activeResetRequest) return;
    if (status === 'reset' && !manualNewPassword.trim()) {
      alert('নতুন পাসওয়ার্ড লিখুন!');
      return;
    }

    const updated = resetRequests.map((r) => {
      if (r.id === activeResetRequest.id) {
        return {
          ...r,
          status,
          resolvedAt: new Date().toLocaleString('bn-BD'),
          newPasswordAssigned: status === 'reset' ? manualNewPassword.trim() : undefined
        };
      }
      return r;
    });
    saveResetRequests(updated);

    if (status === 'reset') {
      const updatedUsers = users.map((u) => {
        if (u.phone === activeResetRequest.phone) {
          return { ...u, password: manualNewPassword.trim() };
        }
        return u;
      });
      setUsers(updatedUsers);
      localStorage.setItem('bongoweb_registered_users', JSON.stringify(updatedUsers));
    }

    setActiveResetRequest(null);
    setManualNewPassword('');
  };

  // Backup & Restore
  const handleDownloadBackup = () => {
    requestProtectedAction(() => {
      const backupData = {
        platform: 'BongoWeb.xyz Super Core',
        exportDate: new Date().toISOString(),
        version: '2026.Enterprise',
        users,
        orders,
        deliveredCredentials: deliveredCreds,
        resetRequests,
        supportChats: chatThreads,
        customCatalog: customWebsites,
        adminConfig
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `bongoweb_enterprise_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  };

  const handleRestoreBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    requestProtectedAction(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);

          if (parsed.users) {
            setUsers(parsed.users);
            localStorage.setItem('bongoweb_registered_users', JSON.stringify(parsed.users));
          }
          if (parsed.orders) {
            setOrders(parsed.orders);
            localStorage.setItem('bongoweb_orders', JSON.stringify(parsed.orders));
          }
          if (parsed.deliveredCredentials) {
            setDeliveredCreds(parsed.deliveredCredentials);
            localStorage.setItem('bongoweb_delivered_credentials', JSON.stringify(parsed.deliveredCredentials));
          }
          if (parsed.resetRequests) {
            setResetRequests(parsed.resetRequests);
            localStorage.setItem('bongoweb_reset_requests', JSON.stringify(parsed.resetRequests));
          }
          if (parsed.supportChats) {
            setChatThreads(parsed.supportChats);
            localStorage.setItem('bongoweb_support_chats', JSON.stringify(parsed.supportChats));
          }
          if (parsed.customCatalog) {
            setCustomWebsites(parsed.customCatalog);
            localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(parsed.customCatalog));
          }
          alert('সফলভাবে সমস্ত ব্যাকআপ ডেটা ওয়েবসাইটে রিস্টোর করা হয়েছে!');
        } catch (err) {
          alert('ব্যাকআপ ফাইলটি ত্রুটিযুক্ত!');
        }
      };
      reader.readAsText(file);
    });
  };

  // Add New Website to Inventory
  const handleCreateNewWebsite = (e: React.FormEvent) => {
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

    const updated = [newDemo, ...customWebsites];
    setCustomWebsites(updated);
    localStorage.setItem('bongoweb_custom_catalog', JSON.stringify(updated));
    setShowAddWebsiteModal(false);
    setNewSiteTitle('');
    setNewSiteDesc('');
    setNewSiteThumbnail('');
    setNewSiteSecretUrl('');
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

  // Active chat thread object
  const activeThread = chatThreads.find((t) => t.userPhone === selectedThreadPhone) || chatThreads[0];
  const activeThreadUser = users.find((u) => u.phone === activeThread?.userPhone);
  const activeThreadOrders = orders.filter((o) => o.phone === activeThread?.userPhone);

  // Filtered threads for sidebar search
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
        {/* Glow orb */}
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

        {/* Master Key Emergency Modal */}
        {showMasterKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-md bg-[#0B1E13] border border-[#00B261]/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setShowMasterKeyModal(false)}
                className="absolute top-5 right-5 text-[#8BB99F] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-5 h-5 text-[#4EEDB0]" />
                <h3 className="text-lg font-black text-white">
                  মাস্টার কি পাসওয়ার্ড রিকভারি
                </h3>
              </div>
              <p className="text-xs text-[#8BB99F] mb-4">
                অপরিবর্তনযোগ্য মাস্টার কি ইনপুট দিয়ে অ্যাডমিনের যেকোনো পাসওয়ার্ড পুনর্নির্ধারণ করুন।
              </p>

              {masterSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-[#00B261]/20 text-[#4EEDB0] text-xs font-bold border border-[#00B261]/40">
                  {masterSuccessMsg}
                </div>
              )}

              <form onSubmit={handleMasterKeyReset} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#A8D7BD] mb-1">
                    মাস্টার কি (Master Key)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="MASTER-BONGO-2026"
                    value={masterKeyInput}
                    onChange={(e) => setMasterKeyInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06140D] border border-[#173826] text-white font-mono text-xs focus:outline-none focus:border-[#00B261]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A8D7BD] mb-1">
                    কোন পাসওয়ার্ড পরিবর্তন করতে চান?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setResetTarget('entry')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        resetTarget === 'entry' 
                          ? 'bg-[#008A4B] text-white border-[#00B261]' 
                          : 'bg-[#06140D] text-[#8BB99F] border-[#173826]'
                      }`}
                    >
                      লগইন এন্ট্রি পাসওয়ার্ড
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetTarget('action')}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        resetTarget === 'action' 
                          ? 'bg-[#008A4B] text-white border-[#00B261]' 
                          : 'bg-[#06140D] text-[#8BB99F] border-[#173826]'
                      }`}
                    >
                      অ্যাকশন কনফার্মেশন পাসওয়ার্ড
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A8D7BD] mb-1">
                    নতুন পাসওয়ার্ড
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="নতুন পাসওয়ার্ড লিখুন"
                    value={newAdminPassInput}
                    onChange={(e) => setNewAdminPassInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06140D] border border-[#173826] text-white text-xs font-mono focus:outline-none focus:border-[#00B261]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#008A4B] text-white text-xs font-bold hover:bg-[#009E56] cursor-pointer shadow-md transition-all"
                >
                  পাসওয়ার্ড হালনাগাদ করুন
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW: EXECUTIVE LEAF GREEN ADMIN SUITE
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-[#05110A] text-[#FFFFFF] font-sans flex flex-col selection:bg-[#00B261]/30 selection:text-[#4EEDB0]">
      {/* 1. Ultra-Clean Executive Header */}
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
                  Live System • 99.99% Uptime
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadBackup}
              className="px-3.5 py-2 rounded-xl bg-[#05110A] hover:bg-[#122A1E] text-[#4EEDB0] border border-[#173826] hover:border-[#00B261]/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="সম্পূর্ণ ব্যাকআপ ডাউনলোড"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ব্যাকআপ নিন</span>
            </button>

            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2 rounded-xl bg-[#E53935]/15 hover:bg-[#E53935] text-[#FF8A80] hover:text-white border border-[#E53935]/30 text-xs font-bold transition-all cursor-pointer"
            >
              লগআউট
            </button>
          </div>
        </div>

        {/* Executive Tab Navigation Bar */}
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

          {/* Dedicated Live Chat Hub Tab with Unread Pulse */}
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
              {chatThreads.reduce((acc, t) => acc + t.unreadAdminCount, 0) || 'Active'}
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
            <span>ওয়েবসাইট স্টক ও আপলোড</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'bg-[#008A4B] text-white shadow-xs'
                : 'text-[#8BB99F] hover:bg-[#0E2417] hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>ক্লাউড ব্যাকআপ ভল্ট</span>
          </button>
        </div>
      </header>

      {/* Main Executive Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ================= TAB 1: EXECUTIVE OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top 4 Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] hover:border-[#00B261]/40 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[#8BB99F]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">মোট ক্লায়েন্ট</span>
                  <Users className="w-4 h-4 text-[#4EEDB0]" />
                </div>
                <div className="text-3xl font-black text-white mt-2 font-mono">{users.length}</div>
                <span className="text-[11px] text-[#4EEDB0] mt-1 block">নিবন্ধিত ও সক্রিয়</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] hover:border-[#00B261]/40 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[#8BB99F]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">পেন্ডিং অর্ডারসমূহ</span>
                  <Clock className="w-4 h-4 text-[#FFD552]" />
                </div>
                <div className="text-3xl font-black text-[#FFD552] mt-2 font-mono">
                  {orders.filter((o) => o.status === 'pending').length}
                </div>
                <span className="text-[11px] text-[#8BB99F] mt-1 block">যাচাইয়ের অপেক্ষায়</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] hover:border-[#00B261]/40 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[#8BB99F]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">মোট সফল অর্ডার</span>
                  <ShoppingBag className="w-4 h-4 text-[#00B261]" />
                </div>
                <div className="text-3xl font-black text-white mt-2 font-mono">
                  {orders.length}
                </div>
                <span className="text-[11px] text-[#4EEDB0] mt-1 block">১,৯৯০ ৳ প্যাকেজ রেট</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#091A11] border border-[#173826] hover:border-[#00B261]/40 transition-all shadow-sm">
                <div className="flex items-center justify-between text-[#8BB99F]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">লাইভ চ্যাট থ্রেড</span>
                  <MessageSquare className="w-4 h-4 text-[#4EEDB0]" />
                </div>
                <div className="text-3xl font-black text-[#4EEDB0] mt-2 font-mono">
                  {chatThreads.length}
                </div>
                <span className="text-[11px] text-[#8BB99F] mt-1 block">সরাসরি রিয়েল-টাইম</span>
              </div>
            </div>

            {/* Quick Live Chat Preview Widget */}
            <div className="p-6 rounded-3xl bg-[#091A11] border border-[#173826] shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2A1B] text-[#4EEDB0] text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#00B261] animate-ping" />
                  <span>রিয়েল-টাইম কাস্টমার লাইভ চ্যাট কনসোল</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  ক্লায়েন্টদের সাথে সরাসরি অ্যাডমিন চ্যাট হাব
                </h3>
                <p className="text-xs text-[#8BB99F] max-w-xl">
                  যেকোনো গ্রাহকের সাথে আলাদা আলাদা থ্রেডে কথোপকথন করুন, পেমেন্ট ট্র্যাকিং ও ওয়েবসাইট ডেলিভারি সম্পর্কিত তথ্য জানান।
                </p>
              </div>

              <button
                onClick={() => setActiveTab('chat')}
                className="px-5 py-3 rounded-2xl bg-[#008A4B] hover:bg-[#009E56] active:bg-[#007A43] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>লাইভ চ্যাট কনসোলে যান</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LIVE CHAT SUPPORT HUB (INTERCOM/ZENDESK TIER) ================= */}
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
                {filteredThreads.map((thread) => {
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
                })}
              </div>
            </div>

            {/* Center Column: Active Chat Stream */}
            <div className="flex-1 flex flex-col bg-[#091A11]">
              {/* Chat Header */}
              <div className="p-4 border-b border-[#173826] flex items-center justify-between bg-[#07160D]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#008A4B] text-white flex items-center justify-center font-bold text-xs">
                    {activeThread?.userName.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white">
                      {activeThread?.userName || 'গ্রাহক'}
                    </h3>
                    <p className="text-[10px] text-[#4EEDB0] font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00B261]" />
                      <span>{activeThread?.userPhone} • লাইভ কানেক্টেড</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#0F2A1B] text-[#4EEDB0] text-[10px] font-mono border border-[#00B261]/30">
                    BongoWeb Verified Customer
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
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

            {/* Right Column: Customer Intelligence Info */}
            <div className="hidden lg:flex w-72 border-l border-[#173826] bg-[#07160D] flex-col p-4 space-y-4">
              <div className="text-center pb-4 border-b border-[#173826]">
                <div className="w-14 h-14 rounded-2xl bg-[#0F2A1B] text-[#4EEDB0] flex items-center justify-center font-black text-xl mx-auto mb-2 border border-[#00B261]/30">
                  {activeThread?.userName.charAt(0) || 'U'}
                </div>
                <h4 className="text-xs font-black text-white">{activeThread?.userName}</h4>
                <p className="text-[11px] font-mono text-[#69977E]">{activeThread?.userPhone}</p>
                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#008A4B]/20 text-[#4EEDB0] text-[9px] font-bold inline-block">
                  সক্রিয় ক্লায়েন্ট
                </span>
              </div>

              {/* Order history summary for this user */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#69977E] uppercase font-bold tracking-wider block">
                  অর্ডার সংক্রান্ত তথ্য
                </span>
                {activeThreadOrders.length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#05110A] text-[11px] text-[#69977E] border border-[#173826]">
                    কোনো অর্ডার করা হয়নি
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

              {/* Quick Handover Action */}
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
                <h2 className="text-lg font-black text-white">অর্ডারসমূহ (Order Management)</h2>
                <p className="text-xs text-[#8BB99F]">গ্রাহকদের করা প্রতিটি অর্ডারের ট্রানজেকশন যাচাই করে নিশ্চিত করুন।</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#0E2417] text-[#4EEDB0] text-xs font-bold border border-[#173826]">
                {orders.length} টি মোট অর্ডার
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#091A11] border border-[#173826] text-center text-xs text-[#8BB99F]">
                কোনো অর্ডার পাওয়া যায়নি।
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
                      {ord.screenshotName && (
                        <div>
                          <span>স্ক্রিনশট: </span>
                          <span className="text-[#4EEDB0] underline">{ord.screenshotName}</span>
                        </div>
                      )}
                    </div>

                    {/* Order Action Buttons */}
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
                <h2 className="text-lg font-black text-white">ব্যবহারকারী তালিকা ও ক্রিডেনশিয়াল ({users.length})</h2>
                <p className="text-xs text-[#8BB99F]">প্রত্যেক ক্লায়েন্টকে তাদের তৈরি ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড হস্তান্তর করুন।</p>
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
                          <Plus className="w-3.5 h-3.5" />
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

        {/* Modal: Deliver Website Credentials */}
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

        {/* ================= TAB 5: PASSWORD RESET CALL DESK ================= */}
        {activeTab === 'resets' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">পাসওয়ার্ড রিসেট ডেস্ক</h2>
                <p className="text-xs text-[#8BB99F]">গ্রাহকদের পাঠানো কল অনুরোধে ফোন দিয়ে পাসওয়ার্ড পরিবর্তন করুন।</p>
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
                          req.status === 'reset'
                            ? 'bg-[#00B261]/20 text-[#4EEDB0]'
                            : req.status === 'rejected'
                            ? 'bg-[#E53935]/20 text-[#FF8A80]'
                            : req.status === 'call_not_received'
                            ? 'bg-[#FFD552]/20 text-[#FFD552]'
                            : 'bg-[#FFD552]/20 text-[#FFD552]'
                        }`}>
                          {req.status === 'reset' ? '✓ রিসেট সম্পন্ন' : req.status === 'rejected' ? 'বাতিল' : req.status === 'call_not_received' ? 'কল রিসিভ হয়নি' : 'অপেক্ষমান'}
                        </span>
                      </div>
                      <p className="text-xs text-[#8BB99F] mt-1">অনুরোধের সময়: {req.requestedAt}</p>
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

            {/* Modal: Set New Password for Request */}
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
        )}

        {/* ================= TAB 6: CATALOG & STOCK ================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">ওয়েবসাইট ক্যাটালগ ও স্টক</h2>
                <p className="text-xs text-[#8BB99F]">নতুন ওয়েবসাইট যোগ করুন এবং গোপন লাইভ ডেমো URL কনফিগার করুন।</p>
              </div>

              <button
                onClick={() => setShowAddWebsiteModal(true)}
                className="px-4 py-2 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ওয়েবসাইট আপলোড</span>
              </button>
            </div>

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

                  <div className="pt-2 border-t border-[#173826] flex items-center justify-between text-xs">
                    <span className="font-mono text-white font-bold">{site.priceTag}</span>
                    <span className="text-[10px] text-[#00B261] font-semibold">স্টকে আছে</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Upload Website */}
            {showAddWebsiteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                <div className="w-full max-w-lg bg-[#091A11] border border-[#00B261] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-4">
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
                      className="w-full py-2.5 rounded-xl bg-[#008A4B] text-white text-xs font-bold hover:bg-[#009E56]"
                    >
                      ক্যাটালগে যুক্ত করুন
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 7: BACKUP & RESTORE ================= */}
        {activeTab === 'backup' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-[#091A11] border border-[#173826] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0F2A1B] text-[#4EEDB0] flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">রিয়েল ব্যাকআপ ও রিস্টোর সিস্টেম</h3>
                  <p className="text-xs text-[#8BB99F]">
                    প্রতিদিন রাত ১২:০০ টায় স্বয়ংক্রিয় ব্যাকআপ তৈরি হয়। এছাড়াও যেকোনো সময় ম্যানুয়াল ব্যাকআপ ডাউনলোড করতে পারেন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#05110A] border border-[#173826] flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#4EEDB0]" />
                      <span>ব্যাকআপ ডাউনলোড</span>
                    </h4>
                    <p className="text-xs text-[#8BB99F] mt-1">
                      সমস্ত ব্যবহারকারী, অর্ডার, চ্যাট মেসেজ ও ডেলিভারি হিস্ট্রি সম্বলিত `.json` ফাইল ডাউনলোড করুন।
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full py-2.5 rounded-xl bg-[#008A4B] hover:bg-[#009E56] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>কনফার্মেশন পাসওয়ার্ড দিয়ে ডাউনলোড করুন</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-[#05110A] border border-[#173826] flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#4EEDB0]" />
                      <span>ব্যাকআপ ফাইল থেকে রিস্টোর</span>
                    </h4>
                    <p className="text-xs text-[#8BB99F] mt-1">
                      পূর্বের যেকোনো ডিভাইসে ডাউনলোড করা `.json` ব্যাকআপ আপলোড করে সম্পূর্ণ ওয়েবসাইট পুনরুজ্জীবিত করুন।
                    </p>
                  </div>
                  <label className="w-full py-2.5 rounded-xl bg-[#0E2417] hover:bg-[#122A1E] text-[#4EEDB0] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#173826]">
                    <Upload className="w-4 h-4" />
                    <span>ব্যাকআপ ফাইল আপলোড করুন</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreBackupFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Action Password Modal */}
      {showActionPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#091A11] border border-[#00B261] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#4EEDB0]" />
              <h3 className="text-base font-black text-white">অ্যাকশন সিকিউরিটি পাসওয়ার্ড</h3>
            </div>
            <p className="text-xs text-[#8BB99F]">
              এই সংবেদনশীল কাজটি সম্পন্ন করতে অ্যাডমিন অ্যাকশন কনফার্মেশন পাসওয়ার্ড লিখুন।
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
    </div>
  );
}
