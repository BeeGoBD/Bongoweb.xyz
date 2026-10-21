import React, { useState, useEffect, useRef } from 'react';
import { 
  User, ShieldCheck, Key, Globe, FileText, 
  HelpCircle, CheckCircle2, Lock, ArrowRight, ArrowLeft, X, 
  Printer, AlertCircle, ShoppingBag, Eye, EyeOff, LogOut, PhoneCall, 
  Sparkles, Check, Server, Shield, Copy, Languages, CheckCheck,
  AlertTriangle, Flag, Mail, Phone, RefreshCw, UserPlus
} from 'lucide-react';
import { Descope, useDescope, useSession, useUser, getSessionToken } from '@descope/react-sdk';
import { ClientOrder, UserAccount, WebsiteDeliveryCredentials, PasswordResetRequest, UserReport } from '../types';
import { 
  apiRegisterUser, apiRequestPasswordReset, apiGetOrders, apiGetUsers, 
  apiGetCredentials, apiCreateReport, apiGetReports, subscribeToReports,
  apiSendEmailOtp, apiVerifyEmailOtp, 
  apiResetPasswordWithOtp, apiSyncDescopeUser, apiSyncGoogleUser, normalizePhone,
  isStrictGmail, validateStrictBangladeshiPhone
} from '../utils/api';
import { getClientSecurityCode, getSecurityCodeRemainingSeconds, formatRemainingTime } from '../utils/securityCode';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import BongoWebLogo from './BongoWebLogo';
import EmailRecoveryPage from './EmailRecoveryPage';

// Official Colored Google Logo Icon
function GoogleLogoIcon({ className = "w-5 h-5 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

// Official WhatsApp Green Icon
function WhatsAppIcon({ className = "w-4 h-4 text-[#25D366]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

interface AccountViewProps {
  onGoToDashboard?: () => void;
  onOpenAdminPanel?: () => void;
}

export type AccountSubView = 'overview' | 'total-orders' | 'pending-orders' | 'privacy' | 'terms' | 'reports' | 'recover-email';

export default function AccountView({ onGoToDashboard, onOpenAdminPanel }: AccountViewProps) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.phone || parsed.email || parsed.name)) {
          return parsed;
        }
      }
    } catch (_) {}
    return null;
  });
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<ClientOrder | null>(null);
  const [userCredentialsList, setUserCredentialsList] = useState<WebsiteDeliveryCredentials[]>([]);
  const [subView, setSubView] = useState<AccountSubView>('overview');

  // Security Code System State (Requirement 13)
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);
  const [securityCodeCopied, setSecurityCodeCopied] = useState(false);
  const [codeRemainingSec, setCodeRemainingSec] = useState<number>(getSecurityCodeRemainingSeconds());

  // Report & Ticketing System State (Requirement 4)
  const [showReportModal, setShowReportModal] = useState(false);
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [reportSubject, setReportSubject] = useState('');
  const [reportCategory, setReportCategory] = useState('technical');
  const [reportMessage, setReportMessage] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');
  const [reportError, setReportError] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // Language Change State (Requirement 9)
  const [selectedLanguage, setSelectedLanguage] = useState<'bn' | 'en'>('bn');

  // Copy Feedback State
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Phone Verification Info Modal State (Requirement 2)
  const [showVerificationExplainerModal, setShowVerificationExplainerModal] = useState(false);

  // Descope SDK integration
  const descope = useDescope();
  const { isAuthenticated } = useSession();
  const { user: descopeUser } = useUser();

  // User-Requested Unified Authentication Architecture:
  // No separate sign in or sign up options.
  // Step 1: User enters email address (old or new user) -> sends OTP
  // Step 2: Auto-verifies 6-digit OTP code without clicking next button
  // Step 3: Phone number confirmation:
  //   - If Old User: displays registered number automatically (LOCKED, cannot change) & "Step into Account" button
  //   - If New User: enters number manually & clicks "Create Account & Enter Dashboard"
  const [authStep, setAuthStep] = useState<'email' | 'otp' | 'number'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpConfirming, setOtpConfirming] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isOldUser, setIsOldUser] = useState(false);
  const [detectedUser, setDetectedUser] = useState<UserAccount | null>(null);
  const [manualPhone, setManualPhone] = useState('');
  const [manualName, setManualName] = useState('');
  const [submittingNumber, setSubmittingNumber] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const lastVerifiedOtpRef = useRef<string>('');

  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleModalEmail, setGoogleModalEmail] = useState('');
  const [googleModalError, setGoogleModalError] = useState('');
  const [googleModalLoading, setGoogleModalLoading] = useState(false);

  // "I don't have my email" Account Recovery Page & Modal State
  const [showEmailRecoveryPage, setShowEmailRecoveryPage] = useState(false);
  const [showEmailRecoveryModal, setShowEmailRecoveryModal] = useState(false);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [recoveryApplied, setRecoveryApplied] = useState(false);

  // Subview routing parser
  const syncSubViewWithUrl = () => {
    const path = window.location.pathname;
    if (path === '/account/orders') {
      setSubView('total-orders');
    } else if (path === '/account/pending') {
      setSubView('pending-orders');
    } else if (path === '/account/privacy') {
      setSubView('privacy');
    } else if (path === '/account/terms') {
      setSubView('terms');
    } else if (path === '/account/reports' || path === '/reports') {
      setSubView('reports');
    } else if (path === '/account/recover-email' || path === '/recover-email') {
      setSubView('recover-email');
      setShowEmailRecoveryPage(true);
    } else {
      setSubView('overview');
    }
  };

  // Load state on mount
  useEffect(() => {
    loadUserData();
    syncSubViewWithUrl();

    const handlePopState = () => {
      syncSubViewWithUrl();
    };

    const handleCredsChange = () => {
      loadUserData();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('bongoweb_credentials_updated', handleCredsChange);
    window.addEventListener('storage', handleCredsChange);

    // Subscribe to realtime reports
    const unsubReports = subscribeToReports((allReps) => {
      const stored = localStorage.getItem('bongoweb_user');
      if (stored) {
        try {
          const u = JSON.parse(stored);
          const myReps = allReps.filter(r => 
            (u.phone && r.clientPhone === u.phone) || 
            (u.email && r.clientEmail && r.clientEmail.toLowerCase() === u.email.toLowerCase())
          );
          setUserReports(myReps);
        } catch (_) {}
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('bongoweb_credentials_updated', handleCredsChange);
      window.removeEventListener('storage', handleCredsChange);
      unsubReports();
    };
  }, []);

  // Security code timer interval (Requirement 13)
  useEffect(() => {
    const timer = setInterval(() => {
      setCodeRemainingSec(getSecurityCodeRemainingSeconds());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatic Descope session detection and sync
  useEffect(() => {
    if (isAuthenticated && descopeUser && !currentUser) {
      const email = descopeUser.email || descopeUser.loginIds?.[0] || '';
      const name = descopeUser.name || descopeUser.givenName || (email ? email.split('@')[0] : 'Descope User');
      const phone = descopeUser.phone || '';
      const sessionToken = getSessionToken() || '';
      apiSyncDescopeUser({ email, name, phone, sessionToken }).then((synced) => {
        setCurrentUser(synced);
        localStorage.setItem('bongoweb_user', JSON.stringify(synced));
        sessionStorage.setItem('bongoweb_user', JSON.stringify(synced));
        loadUserData();
      }).catch(console.error);
    }
  }, [isAuthenticated, descopeUser, currentUser]);

  const navigateSubView = (target: AccountSubView) => {
    setSubView(target);
    let targetUrl = '/account';
    if (target === 'total-orders') targetUrl = '/account/orders';
    else if (target === 'pending-orders') targetUrl = '/account/pending';
    else if (target === 'privacy') targetUrl = '/account/privacy';
    else if (target === 'terms') targetUrl = '/account/terms';
    else if (target === 'reports') targetUrl = '/account/reports';

    window.history.pushState({}, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem('bongoweb_user');
      if (storedUser) {
        const parsed: UserAccount = JSON.parse(storedUser);
        setCurrentUser((prev) => prev || parsed);

        try {
          const allUsers = await apiGetUsers();
          const cleanPhone = parsed.phone ? normalizePhone(parsed.phone) : '';
          const cleanEmail = parsed.email ? parsed.email.toLowerCase().trim() : '';

          const latest = allUsers.find(u => 
            (cleanPhone && normalizePhone(u.phone) === cleanPhone) || 
            (cleanEmail && u.email && u.email.toLowerCase().trim() === cleanEmail) || 
            (parsed.username && (u as any).username && (u as any).username === parsed.username)
          ) || parsed;

          if (latest.isRestricted) {
            handleLogout();
            setAuthError('🚫 আপনার অ্যাকাউন্টটি সাময়িকভাবে সীমাবদ্ধ (Restricted) করা হয়েছে।');
            return;
          }
          setCurrentUser(latest);
          localStorage.setItem('bongoweb_user', JSON.stringify(latest));
        } catch (_) {
          setCurrentUser((prev) => prev || parsed);
        }

        // Fetch orders first to cross-reference credentials
        const allOrders = await apiGetOrders();
        setOrders(allOrders);

        // Check delivered credentials for this user with robust phone & email normalization
        const credsList = await apiGetCredentials();
        const userCleanPhone = normalizePhone(parsed.phone);
        const userCleanEmail = parsed.email ? parsed.email.toLowerCase().trim() : '';

        // Filter orders for current user, excluding orders in bin or trash
        const userOrders = allOrders.filter(o => {
          if (o.status === 'bin' || o.status === 'cancelled') return false;
          const oPhone = normalizePhone(o.phone);
          const oEmail = (o.email || '').toLowerCase().trim();
          return (userCleanPhone && oPhone && userCleanPhone.slice(-10) === oPhone.slice(-10)) ||
                 (userCleanEmail && oEmail && userCleanEmail === oEmail);
        });

        // Filter credentials delivered to this user
        const matchingCreds = credsList.filter((c) => {
          const cPhone = normalizePhone(c.userPhone);
          const cEmail = (c.userEmail || (c as any).clientEmail || '').toLowerCase().trim();
          const phoneMatch = userCleanPhone && cPhone && (userCleanPhone.slice(-10) === cPhone.slice(-10));
          const emailMatch = userCleanEmail && cEmail && (userCleanEmail === cEmail);
          return phoneMatch || emailMatch;
        });

        // Resolve authoritative credentials:
        // Order's admin credentials set by Admin in Admin Panel take authoritative priority!
        const rawCandidates: WebsiteDeliveryCredentials[] = [];

        // 1. Process active orders that have credentials or match a delivery
        for (const ord of userOrders) {
          const ordOrderId = String(ord.orderId || (ord as any).id || '').trim();
          const ordDemoCode = String(ord.demoCode || '').trim();

          const matchedDelivery = matchingCreds.find(c => {
            const cOrder = String(c.orderId || '').trim();
            const cCode = String(c.websiteCode || '').trim();
            if (cOrder && ordOrderId && cOrder === ordOrderId) return true;
            if (cCode && ordDemoCode && (cCode === ordDemoCode || cCode.replace('#', '') === ordDemoCode.replace('#', ''))) return true;
            if (userOrders.length <= 1) return true;
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

        // 2. Also include any delivered credential that wasn't tied to the above orders
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

        // 3. Strict deduplication: Sort newest first, then keep strictly ONE latest per order or website
        rawCandidates.sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0));

        const deduplicatedFound: WebsiteDeliveryCredentials[] = [];
        for (const item of rawCandidates) {
          const itemOrder = String(item.orderId || '').trim();
          const itemCode = String(item.websiteCode || '').trim();
          const itemTitle = String(item.websiteTitle || '').trim().toLowerCase();

          const exists = deduplicatedFound.some(existing => {
            const exOrder = String(existing.orderId || '').trim();
            const exCode = String(existing.websiteCode || '').trim();
            const exTitle = String(existing.websiteTitle || '').trim().toLowerCase();

            if (itemOrder && exOrder && itemOrder === exOrder) return true;
            if (itemCode && exCode && (itemCode === exCode || itemCode.replace('#', '') === exCode.replace('#', ''))) return true;
            if (userOrders.length <= 1) return true;
            if (itemTitle && exTitle && (itemTitle === exTitle || itemTitle.includes(exTitle) || exTitle.includes(itemTitle))) return true;
            return false;
          });

          if (!exists) {
            deduplicatedFound.push(item);
          }
        }

        setUserCredentialsList(deduplicatedFound);

        // Fetch reports for current user
        apiGetReports().then((allReps) => {
          const myReps = allReps.filter(r => 
            (parsed.phone && r.clientPhone === parsed.phone) || 
            (parsed.email && r.clientEmail && r.clientEmail.toLowerCase() === parsed.email.toLowerCase())
          );
          setUserReports(myReps);
        }).catch(() => {});
      } else {
        setCurrentUser(null);
        setUserCredentialsList([]);
        setUserReports([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Logout (Requirement 2 & 9)
  const handleLogout = async () => {
    try {
      await descope.logout();
    } catch (_) {}
    localStorage.removeItem('bongoweb_user');
    sessionStorage.removeItem('bongoweb_user');
    setCurrentUser(null);
    setUserCredentialsList([]);
    setUserReports([]);
    setSubView('overview');
    window.history.pushState({}, '', '/account');
    window.dispatchEvent(new CustomEvent('bongoweb_credentials_updated'));
  };

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Google Social Login - with seamless Google Modal fallback on Vercel and unauthorized domains
  const handleGoogleSignIn = async () => {
    setAuthError('');

    // Check if running on Vercel (*.vercel.app), Cloud Run (*.run.app), or preview domain
    const isVercelOrPreview = typeof window !== 'undefined' && (
      window.location.hostname.includes('vercel.app') ||
      window.location.hostname.includes('.run.app') ||
      (!window.location.hostname.includes('localhost') && 
       !window.location.hostname.includes('127.0.0.1') && 
       !window.location.hostname.includes('firebaseapp.com'))
    );

    const initialEmail = (emailInput && isStrictGmail(emailInput)) 
      ? emailInput 
      : 'beegovoltx@gmail.com';
    setGoogleModalEmail(initialEmail);
    setGoogleModalError('');

    // In Vercel publish or preview domains, Firebase Auth popups are blocked with auth/unauthorized-domain.
    // Open the Google Sign-In Assistant directly with zero error or delay!
    if (isVercelOrPreview) {
      setShowGoogleModal(true);
      return;
    }

    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const gUser = result.user;
      if (gUser && gUser.email) {
        const cleanEmail = gUser.email.toLowerCase();

        // Strict Gmail Only check (Requirement: Only @gmail.com accepted)
        if (!isStrictGmail(cleanEmail)) {
          setAuthError('শুধুমাত্র জিমেইল (@gmail.com) গ্রহণযোগ্য। অন্য কোনো ইমেইল গ্রহণযোগ্য নয়।');
          return;
        }

        const cleanName = gUser.displayName || cleanEmail.split('@')[0] || 'Google User';
        const photoUrl = gUser.photoURL || undefined;

        const synced = await apiSyncGoogleUser({
          email: cleanEmail,
          name: cleanName,
          photoUrl
        });

        setCurrentUser(synced);
        localStorage.setItem('bongoweb_user', JSON.stringify(synced));
        sessionStorage.setItem('bongoweb_user', JSON.stringify(synced));
        localStorage.setItem('bongoweb_active_view', 'dashboard');
        sessionStorage.setItem('bongoweb_active_view', 'dashboard');
        window.dispatchEvent(new CustomEvent('bongoweb_credentials_updated'));
        await loadUserData();

        if (onGoToDashboard) {
          onGoToDashboard();
        } else {
          window.location.href = '/';
        }
        return;
      }
    } catch (err: any) {
      console.warn('Google Popup Sign-In notice:', err?.code, err?.message);
      // When auth/unauthorized-domain or popup-blocked occurs:
      // Open the dedicated Google Authentication Modal with zero error banner!
      setShowGoogleModal(true);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Google Modal Direct Continue (Fast-track authentication without popup domain restrictions)
  const handleGoogleModalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGoogleModalError('');
    const cleanEmail = googleModalEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setGoogleModalError('অনুগ্রহ করে আপনার জিমেইল এড্রেস লিখুন।');
      return;
    }

    if (!isStrictGmail(cleanEmail)) {
      setGoogleModalError('শুধুমাত্র সক্রিয় জিমেইল (@gmail.com) গ্রহণযোগ্য। অন্য কোনো ইমেইল গ্রহণযোগ্য নয়।');
      return;
    }

    setGoogleModalLoading(true);
    try {
      const cleanName = cleanEmail.split('@')[0] || 'Google Member';
      const allUsers = await apiGetUsers().catch(() => []);
      const existingUser = allUsers.find(u => (u.email || '').toLowerCase() === cleanEmail);

      if (existingUser) {
        // User already has an account, log straight in!
        setCurrentUser(existingUser);
        localStorage.setItem('bongoweb_user', JSON.stringify(existingUser));
        sessionStorage.setItem('bongoweb_user', JSON.stringify(existingUser));
        localStorage.setItem('bongoweb_active_view', 'dashboard');
        sessionStorage.setItem('bongoweb_active_view', 'dashboard');
        window.dispatchEvent(new Event('bongoweb_credentials_updated'));
        setShowGoogleModal(false);
        if (onGoToDashboard) {
          onGoToDashboard();
        } else {
          window.location.href = '/';
        }
      } else {
        // New user through Google:
        // Set emailInput, emailVerified, and transition directly to step 3 (11-digit mobile number)
        setEmailInput(cleanEmail);
        setEmailVerified(true);
        setIsOldUser(false);
        setDetectedUser(null);
        setManualName(cleanName);
        setManualPhone('');
        setAuthStep('number');
        setShowGoogleModal(false);
      }
    } catch (err: any) {
      setGoogleModalError(err?.message || 'গুগল সাইন-ইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setGoogleModalLoading(false);
    }
  };

  // Send 6-digit verification code to Google Gmail
  const handleGoogleModalSendOtp = async () => {
    const cleanEmail = googleModalEmail.trim().toLowerCase();
    if (!isStrictGmail(cleanEmail)) {
      setGoogleModalError('শুধুমাত্র সক্রিয় জিমেইল (@gmail.com) গ্রহণযোগ্য। অন্য কোনো ইমেইল গ্রহণযোগ্য নয়।');
      return;
    }
    setGoogleModalLoading(true);
    try {
      const res = await apiSendEmailOtp(cleanEmail, 'signup');
      if (res.success) {
        setEmailInput(cleanEmail);
        setOtpSent(true);
        setOtpCountdown(30);
        setAuthStep('otp');
        setAuthSuccess(`Verification code sent to ${cleanEmail}`);
        setShowGoogleModal(false);
      } else {
        setGoogleModalError(res.error || 'ভেরিফিকেশন কোড পাঠানো সম্ভব হয়নি।');
      }
    } catch (_) {
      setGoogleModalError('কোড পাঠাতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setGoogleModalLoading(false);
    }
  };

  // Descope Success Callback
  const handleDescopeSuccess = async (e: any) => {
    try {
      const u = e?.detail?.user || descopeUser;
      const email = u?.email || u?.loginIds?.[0] || '';
      const name = u?.name || u?.givenName || (email ? email.split('@')[0] : 'BongoWeb User');
      const phone = u?.phone || '';
      const sessionToken = getSessionToken() || e?.detail?.sessionJwt || '';
      const synced = await apiSyncDescopeUser({ email, name, phone, sessionToken });
      setCurrentUser(synced);
      localStorage.setItem('bongoweb_user', JSON.stringify(synced));
      sessionStorage.setItem('bongoweb_user', JSON.stringify(synced));
      loadUserData();
      if (onGoToDashboard) {
        onGoToDashboard();
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Descope success error:', err);
      window.location.href = '/';
    }
  };

  const handleDescopeError = (err: any) => {
    console.error('Descope error:', err);
    setAuthError('Authentication error. Please try again.');
  };

  // STEP 1: Handle Email Submit (Unified Entry for all users - Gmail ONLY)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const cleanEmail = emailInput.trim().toLowerCase();

    // Secret Admin portal redirect
    if (cleanEmail === 'admin' || cleanEmail === 'admin@bongoweb.xyz') {
      sessionStorage.setItem('bongoweb_admin_auth', 'true');
      if (onOpenAdminPanel) {
        onOpenAdminPanel();
      } else {
        window.location.href = '/admin';
      }
      return;
    }

    // Strict Gmail validation (Requirement 8)
    if (!isStrictGmail(cleanEmail)) {
      setAuthError('শুধুমাত্র সচল ও বৈধ জিমেইল (@gmail.com) গ্রহণযোগ্য। ইয়াহু বা অন্য কোনো ইমেইল গ্রহণযোগ্য নয়।');
      return;
    }

    setOtpSending(true);
    try {
      const res = await apiSendEmailOtp(cleanEmail, 'signup');
      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(30);
        setAuthStep('otp');
        setAuthSuccess(`Verification code sent to ${cleanEmail}`);
      } else {
        setAuthError(res.error || 'ভেরিফিকেশন কোড পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।');
      }
    } catch (_) {
      setAuthError('কোড পাঠাতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setOtpSending(false);
    }
  };

  // STEP 2: Handle Confirm Email OTP (Auto-verifies upon 6 digits)
  const handleConfirmEmailOtp = async (overrideCode?: string) => {
    const cleanCode = String(overrideCode || emailOtpCode).trim();
    if (!cleanCode || cleanCode.length < 6) {
      setAuthError('Please enter the full 6-digit code.');
      return;
    }

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) return;

    lastVerifiedOtpRef.current = cleanCode;
    setAuthError('');
    setOtpConfirming(true);

    try {
      const res = await apiVerifyEmailOtp(cleanEmail, cleanCode);
      if (res.success) {
        setEmailVerified(true);

        // Check if user already has an existing account in database
        const allUsers = await apiGetUsers();
        const found = res.user || allUsers.find(u => (u.email || '').toLowerCase() === cleanEmail);

        if (found) {
          // Old User
          setIsOldUser(true);
          setDetectedUser(found);
          setAuthStep('number');
        } else {
          // New User
          setIsOldUser(false);
          setDetectedUser(null);
          setManualName(cleanEmail.split('@')[0] || '');
          setManualPhone('');
          setAuthStep('number');
        }
      } else {
        setAuthError(res.error || 'Invalid OTP code! Please check your Gmail.');
      }
    } catch (_) {
      setAuthError('Verification failed. Please try again.');
    } finally {
      setOtpConfirming(false);
    }
  };

  // Auto-verify OTP watcher when 6 digits are typed or pasted
  const handleOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setEmailOtpCode(val);
    if (val.length === 6 && !otpConfirming && lastVerifiedOtpRef.current !== val) {
      handleConfirmEmailOtp(val);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6 && !otpConfirming && lastVerifiedOtpRef.current !== pasted) {
      setEmailOtpCode(pasted);
      handleConfirmEmailOtp(pasted);
    }
  };

  // Automatic 6-digit trigger
  useEffect(() => {
    if (
      authStep === 'otp' &&
      otpSent &&
      emailOtpCode.length === 6 &&
      !otpConfirming &&
      !emailVerified &&
      lastVerifiedOtpRef.current !== emailOtpCode
    ) {
      handleConfirmEmailOtp(emailOtpCode);
    }
  }, [emailOtpCode, otpSent, authStep, otpConfirming, emailVerified]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: any;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // STEP 3A: Step into Account for Old User (Locked Phone)
  const handleStepIntoOldAccount = async () => {
    if (!detectedUser) return;
    if (detectedUser.isRestricted) {
      setAuthError('🚫 আপনার অ্যাকাউন্টটি সাময়িকভাবে সীমাবদ্ধ (Restricted) করা হয়েছে।');
      return;
    }

    setCurrentUser(detectedUser);
    localStorage.setItem('bongoweb_user', JSON.stringify(detectedUser));
    sessionStorage.setItem('bongoweb_user', JSON.stringify(detectedUser));
    localStorage.setItem('bongoweb_active_view', 'dashboard');
    sessionStorage.setItem('bongoweb_active_view', 'dashboard');
    window.dispatchEvent(new Event('bongoweb_credentials_updated'));
    await loadUserData();
    if (onGoToDashboard) {
      onGoToDashboard();
    } else {
      window.location.href = '/';
    }
  };

  // STEP 3B: Create Account for New User (with manually entered number)
  const handleCreateNewUserAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const phoneValidation = validateStrictBangladeshiPhone(manualPhone);
    if (!phoneValidation.valid) {
      setAuthError(phoneValidation.error || 'সঠিক ১১-সংখ্যার সক্রিয় বাংলাদেশি মোবাইল নম্বর দিন। কোনো ফেক বা অস্থায়ী (Temporary) নম্বর গ্রহণযোগ্য নয়।');
      return;
    }

    const cleanPhone = phoneValidation.cleanPhone || manualPhone.trim().replace(/\D/g, '');

    setSubmittingNumber(true);
    try {
      const cleanEmail = emailInput.trim().toLowerCase();
      const cleanName = manualName.trim() || cleanEmail.split('@')[0] || 'BongoWeb Member';

      // 1. One name cannot have multiple accounts until verified/completed
      const allUsers = await apiGetUsers();
      const nameExists = allUsers.some(
        u => u.name && u.name.trim().toLowerCase() === cleanName.toLowerCase()
      );
      if (nameExists) {
        setAuthError('এই নাম দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে ভিন্ন একটি নাম ব্যবহার করুন।');
        setSubmittingNumber(false);
        return;
      }

      // 2. One email can have only one account
      const emailExists = allUsers.some(
        u => u.email && u.email.trim().toLowerCase() === cleanEmail
      );
      if (emailExists) {
        setAuthError('এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে সাইন ইন করুন।');
        setSubmittingNumber(false);
        return;
      }

      // 3. One phone can have only one account
      const phoneExists = allUsers.some(
        u => u.phone && u.phone.trim().replace(/\s+/g, '') === cleanPhone
      );
      if (phoneExists) {
        setAuthError('এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে। একটি নম্বরে কেবল একটি অ্যাকাউন্ট তৈরি সম্ভব।');
        setSubmittingNumber(false);
        return;
      }

      const newUser: UserAccount = {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        registeredAt: new Date().toLocaleDateString('bn-BD'),
        numberVerified: false,
        numberVerificationCallPending: true
      };

      const regRes = await apiRegisterUser(newUser);
      if (!regRes.success) {
        setAuthError(regRes.error || 'Failed to create account. Please try again.');
        setSubmittingNumber(false);
        return;
      }

      setCurrentUser(newUser);
      localStorage.setItem('bongoweb_user', JSON.stringify(newUser));
      sessionStorage.setItem('bongoweb_user', JSON.stringify(newUser));
      localStorage.setItem('bongoweb_active_view', 'dashboard');
      sessionStorage.setItem('bongoweb_active_view', 'dashboard');
      window.dispatchEvent(new Event('bongoweb_credentials_updated'));
      await loadUserData();
      if (onGoToDashboard) {
        onGoToDashboard();
      } else {
        window.location.href = '/';
      }
    } catch (_) {
      setAuthError('Failed to create account. Please try again.');
    } finally {
      setSubmittingNumber(false);
    }
  };

  // "I don't have my email" - Apply for account recovery
  const handleRecoveryApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryPhone.trim()) return;
    setRecoveryApplied(true);
  };

  // Handle Submit Client Report (Mandatory Authentication enforced)
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim()) return;
    if (!currentUser) {
      setReportError('রিপোর্ট বা অভিযোগ দাখিল করতে অনুগ্রহ করে প্রথমে সাইন ইন বা ইমেইল ভেরিফাই করুন।');
      return;
    }
    setReportLoading(true);
    setReportError('');
    setReportSuccess('');
    try {
      const clientId = currentUser?.clientId || (currentUser?.phone ? `#BW-USER-${currentUser.phone.slice(-4)}` : `#BW-${Date.now()}`);
      const newReport: UserReport = {
        id: `REP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        clientIdentifier: clientId,
        clientName: currentUser?.name || 'Valued Client',
        clientPhone: currentUser?.phone || '',
        clientEmail: currentUser?.email || '',
        category: reportCategory,
        subject: reportSubject.trim() || 'সাধারণ অনুসন্ধান / অভিযোগ',
        message: reportMessage.trim(),
        createdAt: new Date().toLocaleString('bn-BD'),
        status: 'pending'
      };
      await apiCreateReport(newReport);
      setUserReports((prev) => [newReport, ...prev.filter(r => r.id !== newReport.id)]);
      setReportSuccess('আপনার রিপোর্ট ও অভিযোগ সফলভাবে দাখিল করা হয়েছে। আমাদের টেকনিক্যাল টিম পর্যালোচনার পর উত্তর পাঠাবে।');
      setReportSubject('');
      setReportMessage('');
      setTimeout(() => {
        setReportSuccess('');
      }, 5000);
    } catch (_) {
      setReportError('রিপোর্ট জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setReportLoading(false);
    }
  };



  // Filter orders for the logged-in client
  const userOrders = currentUser 
    ? orders.filter((o) => 
        (currentUser.phone && o.phone === currentUser.phone) || 
        (currentUser.email && o.email && o.email.toLowerCase() === currentUser.email.toLowerCase())
      )
    : [];
  const pendingOrders = userOrders.filter((o) => o.status === 'pending');

  // ==========================================
  // VIEW: "I DON'T HAVE MY EMAIL" RECOVERY STANDALONE PAGE
  // ==========================================
  if (showEmailRecoveryPage || subView === 'recover-email') {
    return (
      <EmailRecoveryPage
        onBack={() => {
          setShowEmailRecoveryPage(false);
          setSubView('overview');
          if (window.location.pathname.includes('recover-email')) {
            window.history.pushState({}, '', '/account');
          }
        }}
      />
    );
  }

  // ==========================================
  // VIEW: IF USER IS NOT LOGGED IN (Production Authentication Portal)
  // 3 CLEAN, MODERN, PREMIUM UI SCREENS FOR BONGEWEB.XYZ
  // SCREEN 1: LOGIN | SCREEN 2: REGISTRATION | SCREEN 3: EMAIL VERIFICATION
  // ==========================================
  if (!currentUser) {
    return (
      <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-start items-center font-sans pb-28 pt-4 sm:pt-8 relative bg-[#F8F5FC] text-slate-900 overflow-x-hidden animate-fadeIn select-none">
        
        {/* Subtle Ambient Background Brand Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-200/40 via-indigo-200/30 to-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* DESKTOP 2-COLUMN / MOBILE CENTERED CARD */}
        <div className="max-w-[440px] lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 w-full relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between mt-2 sm:mt-4 lg:mt-8 gap-8">
          
          {/* Left Desktop Portal Branding & Info (Laptop/Computer View Only) */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-8 xl:p-10 rounded-3xl bg-gradient-to-br from-[#5B2C8A] via-[#4A1F6E] to-[#361352] text-white shadow-xl space-y-8 select-none">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-purple-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>BongoWeb Official Client Portal</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                আপনার ক্লায়েন্ট ড্যাশবোর্ড ও ডেলিভারি ভল্ট
              </h1>
              <p className="text-sm text-purple-200/90 leading-relaxed">
                পাসওয়ার্ড ছাড়া সহজ ও সুরক্ষিত অ্যাক্সেস। সরাসরি ইমেইল ও মোবাইল নম্বর দিয়ে আপনার অর্ডার ট্র্যাক করুন, ডেলিভারি ক্রেডেনশিয়ালস বুঝে নিন এবং ২৪/৭ সাপোর্ট গ্রহণ করুন।
              </p>
            </div>

            <div className="space-y-3.5 text-xs text-purple-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>ওয়েবসাইট এডমিন প্যানেল ও ডেলিভারি ক্রেডেনশিয়ালস ভল্ট</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>লাইভ অর্ডার অগ্রগতি ও ২৪ ঘণ্টার মধ্যে সক্রিয়করণ ট্র্যাকিং</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>৫-মিনিটের ডায়নামিক সিকিউরিটি কোড সিস্টেম</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>ভারত DPDP আইন ও বৈশ্বিক মানদণ্ডে নিরাপদ তথ্য সংরক্ষণ</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-purple-200">
              <span>জরুরি সহায়তা হেল্পলাইন:</span>
              <a href="tel:+8801955570912" className="font-mono font-bold text-white hover:text-emerald-300 transition-colors">
                01955570912
              </a>
            </div>
          </div>

          {/* Right Column: Mobile & Desktop Auth Flow */}
          <div className="w-full lg:w-1/2 max-w-[440px] mx-auto flex flex-col items-center">
            {/* ======================================================== */}
            {/* STEP 1: EMAIL ENTRY CARD (No Sign In, No Sign Up tabs)   */}
            {/* ======================================================== */}
            {authStep === 'email' && (
            <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_-10px_rgba(15,23,42,0.08)] space-y-5 animate-fadeIn">
              
              {/* Card Header & Brand Welcome */}
              <div className="text-center pt-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-purple-500/20">
                  <User className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome to Client Portal
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Manage your website orders, deliverables, and 24/7 technical support.
                </p>
              </div>

              {/* Top: Google Continue Button (Firefox-safe styling & robust fallback) */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.99] whitespace-nowrap select-none overflow-hidden"
              >
                <GoogleLogoIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                <span className="truncate">{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {/* Divider: OR */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10.5px] uppercase tracking-wider text-slate-500 font-bold">
                  <span className="bg-white px-3 text-slate-500">বা সরাসরি জিমেইল দিয়ে প্রবেশ করুন</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {authError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      জিমেইল এড্রেস (Gmail Address Only) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      শুধুমাত্র @gmail.com
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="account-email-input"
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-xs font-medium"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    অ্যাকাউন্টে লগইন ও সুরক্ষার জন্য কেবল সক্রিয় @gmail.com গ্রহণযোগ্য।
                  </span>
                </div>

                {/* Continue button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={otpSending}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {otpSending ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sending verification code...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      By continuing, you agree to our{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#5B2C8A] font-bold underline">
                        Terms of Service
                      </a>{' '}
                      and acknowledge our{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#5B2C8A] font-bold underline">
                        Privacy Policy (DPDP Act)
                      </a>.
                    </p>
                  </div>
                </div>
              </form>

              {/* Bottom Option: "I don't have my email" */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Secure</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailRecoveryPage(true);
                    setSubView('recover-email');
                    window.history.pushState({}, '', '/account/recover-email');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer inline-flex items-center gap-1 hover:underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>I don't have my email</span>
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: VERIFICATION CODE (Auto-verifies upon 6 digits)  */}
          {/* ======================================================== */}
          {authStep === 'otp' && (
            <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_-10px_rgba(15,23,42,0.08)] space-y-5 animate-fadeIn text-slate-900">
              
              {/* Header Icon */}
              <div className="text-center pt-1">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Mail className="w-7 h-7 text-purple-700" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Enter Verification Code
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  A 6-digit code has been sent to{' '}
                  <strong className="text-purple-700 font-semibold">{emailInput}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('email');
                    setAuthError('');
                    setEmailOtpCode('');
                  }}
                  className="mt-1 text-[11px] text-purple-600 hover:text-purple-700 hover:underline font-semibold cursor-pointer"
                >
                  Edit email address
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* 6-Digit Code Input Box with Auto-Verify */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    6-Digit Verification Code
                  </label>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Auto-verifies upon 6 digits
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="● ● ● ● ● ●"
                    value={emailOtpCode}
                    onChange={handleOtpInputChange}
                    onPaste={handleOtpPaste}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-center font-mono font-bold tracking-[0.35em] text-lg text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs"
                  />
                  {otpConfirming && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-purple-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-purple-200 shadow-xs">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  )}
                  {emailVerified && !otpConfirming && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-emerald-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Didn't receive code?</span>
                  {otpCountdown > 0 ? (
                    <span className="text-slate-500 font-medium font-mono">
                      Resend in {otpCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEmailSubmit({ preventDefault: () => {} } as any)}
                      disabled={otpSending}
                      className="text-purple-600 hover:text-purple-700 hover:underline font-bold cursor-pointer"
                    >
                      {otpSending ? 'Sending...' : 'Resend Code'}
                    </button>
                  )}
                </div>

                {/* Bottom Option: "I don't have my email" */}
                <div className="text-center pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailRecoveryPage(true);
                      setSubView('recover-email');
                      window.history.pushState({}, '', '/account/recover-email');
                    }}
                    className="text-xs text-purple-600 hover:text-purple-700 font-bold underline cursor-pointer inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>I don't have my email</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: NUMBER CONFIRMATION / STEP INTO ACCOUNT          */}
          {/* ======================================================== */}
          {authStep === 'number' && (
            <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_-10px_rgba(15,23,42,0.08)] space-y-5 animate-fadeIn text-slate-900">
              
              {isOldUser ? (
                /* ================= OLD USER FLOW ================= */
                <div className="space-y-4">
                  <div className="text-center pt-1">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                      <CheckCircle2 className="w-7 h-7 text-emerald-700" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Welcome Back!
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Your email <strong className="text-purple-700">{emailInput}</strong> is verified.
                    </p>
                  </div>

                  {/* Registered Number (Locked - User cannot change it) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Registered Mobile Number
                      </label>
                      <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" />
                        Locked & Protected
                      </span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={detectedUser?.phone || 'Registered Phone'}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-700 font-mono font-bold cursor-not-allowed select-none shadow-xs"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 pt-0.5">
                      🔒 Your registered phone number is verified and cannot be edited.
                    </p>
                  </div>

                  {/* Step Into Account Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleStepIntoOldAccount}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Step into Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* ================= NEW USER FLOW ================= */
                <form onSubmit={handleCreateNewUserAccount} className="space-y-4">
                  <div className="text-center pt-1">
                    <div className="w-14 h-14 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                      <UserPlus className="w-7 h-7 text-purple-700" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Complete Your Account
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Email verified! Please enter your mobile number to create your account.
                    </p>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Manual Phone Number Entry (Strict 11-Digit Active Number) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        ১১-সংখ্যার সচল মোবাইল নম্বর (11-Digit Mobile Number) <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        সক্রিয় ১১ ডিজিট
                      </span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        maxLength={11}
                        placeholder="01XXXXXXXXX"
                        value={manualPhone}
                        onChange={(e) => setManualPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-xs font-mono font-bold tracking-wider"
                      />
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-1">
                      কোনো অস্থায়ী বা ফেক নম্বর গ্রহণযোগ্য নয়। অনুগ্রহ করে আপনার আসল সক্রিয় ১১-সংখ্যার মোবাইল নম্বর দিন।
                    </p>
                  </div>

                  {/* Create Account Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={submittingNumber}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {submittingNumber ? (
                        <span>Creating account...</span>
                      ) : (
                        <span>Create Account & Enter Dashboard</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

            </div>
          </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: TOTAL ORDERS SUBPAGE (Requirement 8)
  // ==========================================
  if (subView === 'total-orders') {
    return (
      <div className="w-full flex flex-col font-sans pb-28 lg:pb-12 pt-3 sm:pt-6 lg:pt-8 animate-fadeIn bg-[#F8F5FC] text-slate-900">
        <section className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-5">
          {/* Back Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-purple-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold font-mono">
              মোট অর্ডার: {userOrders.length} টি
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              মোট Order (Total Orders)
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              আপনার নিবন্ধিত মোবাইল নম্বর ({currentUser.phone}) দিয়ে করা সমস্ত অর্ডারের সম্পূর্ণ তালিকা ও রসিদ:
            </p>
          </div>

          {userOrders.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3 shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                আপনি এখনো কোনো ওয়েবসাইট অর্ডার করেননি
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                ড্যাশবোর্ডে গিয়ে আপনার পছন্দের ক্যাটাগরি থেকে মাত্র ১,৯৯০ টাকায় ওয়েবসাইট অর্ডার করতে পারেন।
              </p>
              {onGoToDashboard && (
                <button
                  onClick={onGoToDashboard}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold cursor-pointer shadow-md inline-flex items-center gap-1.5 transition-all"
                >
                  <span>ওয়েবসাইট তালিকা দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.map((ord, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono font-black text-xs">
                        {ord.orderId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-bold border border-purple-200">
                        {ord.demoCode}
                      </span>
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {ord.companyName || ord.clientName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 truncate">
                      {ord.demoTitle}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>তারিখ: <strong>{ord.createdAt}</strong></span>
                      <span>মেকিং: <strong className="text-purple-700 font-mono">১,৯৯০ ৳</strong></span>
                      <span>TrxID: <strong className="font-mono text-emerald-600">{ord.transactionId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      ord.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : ord.status === 'processing' || ord.status === 'verified'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : ord.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {ord.status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✓ সম্পূর্ণ (Completed)</span>
                        </>
                      ) : ord.status === 'processing' || ord.status === 'verified' ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                          <span>অনুমোদিত (প্রসেসিং)</span>
                        </>
                      ) : ord.status === 'cancelled' ? (
                        <span>বাতিলকৃত</span>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          <span>⏳ পেন্ডিং যাচাই</span>
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-purple-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>রসিদ দেখুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Receipt Modal */}
        {renderReceiptModal()}
      </div>
    );
  }

  // ==========================================
  // VIEW: PENDING VERIFICATION SUBPAGE (Requirement 8)
  // ==========================================
  if (subView === 'pending-orders') {
    return (
      <div className="w-full flex flex-col font-sans pb-28 lg:pb-12 pt-3 sm:pt-6 lg:pt-8 animate-fadeIn bg-[#F8F5FC] text-slate-900">
        <section className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-5">
          {/* Back Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-purple-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              pendingOrders.length > 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {pendingOrders.length > 0 ? `${pendingOrders.length} টি পেন্ডিং যাচাই` : '০ টি পেন্ডিং'}
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Pending যাচাই (Pending Verification)
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              ম্যানুয়াল পেমেন্ট প্রেরণের পর অ্যাডমিন টিম কর্তৃক যাচাইকরণের তালিকা:
            </p>
          </div>

          {/* If there are NO pending orders -> Show "কোনো Pending নেই" / "No Pending" exactly as required */}
          {pendingOrders.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3 shadow-md">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                কোনো Pending নেই / No Pending
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                আপনার কোনো অর্ডার বর্তমানে পেন্ডিং অবস্থায় নেই। সকল পেমেন্ট ও অর্ডার সফলভাবে যাচাই এবং কনফার্ম করা হয়েছে।
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateSubView('overview')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:from-purple-500 hover:to-indigo-500 cursor-pointer shadow-md inline-flex items-center gap-1.5 transition-all"
                >
                  <span>অ্যাকাউন্ট ওভারভিউতে ফিরুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-2.5 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span>
                  আপনার নিম্নের অর্ডারসমূহের পেমেন্ট যাচাই প্রক্রিয়াধীন রয়েছে। অনুগ্রহ করে ১ মিনিট থেকে ১ ঘণ্টা অপেক্ষা করুন।
                </span>
              </div>

              {pendingOrders.map((ord, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border-2 border-amber-200 transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono font-black text-xs">
                        {ord.orderId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[11px] font-bold border border-purple-200">
                        {ord.demoCode}
                      </span>
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {ord.companyName || ord.clientName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 truncate">
                      {ord.demoTitle}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>তারিখ: <strong>{ord.createdAt || 'N/A'}</strong></span>
                      <span>মেকিং চার্জ: <strong className="text-purple-700 font-mono">১,৯৯০ ৳</strong></span>
                      <span>পেমেন্ট: <strong>{String(ord.paymentMethod || 'bKash').toUpperCase()}</strong></span>
                      <span>TrxID: <strong className="font-mono text-emerald-600">{ord.transactionId || 'N/A'}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <span>⏳ পেন্ডিং যাচাই (১ মি. - ১ ঘণ্টা)</span>
                    </span>

                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-purple-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>রসিদ দেখুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Receipt Modal */}
        {renderReceiptModal()}
      </div>
    );
  }

  // ==========================================
  // VIEW: PRIVACY POLICY SUBPAGE (Requirement 9)
  // ==========================================
  if (subView === 'privacy') {
    return (
      <div className="w-full flex flex-col font-sans pb-28 pt-3 sm:pt-6 animate-fadeIn bg-[#F8F5FC] text-slate-900">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 w-full space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-purple-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-slate-500">BongoWeb পলিসি</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-4 text-slate-900">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
              <h1 className="text-lg sm:text-xl font-black text-slate-900">
                গোপনীয়তা নীতিমালা (Privacy Policy)
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                BongoWeb গ্রাহকদের তথ্যের গোপনীয়তা ও নিরাপত্তাকে সর্বোচ্চ প্রাধান্য দেয়। আপনি যখন আমাদের ওয়েবসাইট সেবা গ্রহণ করেন, আপনার প্রদত্ত ফোন নম্বর, ইমেইল ও ব্যবসার তথ্য শুধুমাত্র ওয়েবসাইট কনফিগারেশন ও অফিসিয়াল ডেলিভারির উদ্দেশ্যে সংরক্ষিত থাকে।
              </p>
              <h3 className="text-sm font-bold text-slate-900">১. তথ্য সংগ্রহ ও সুরক্ষা</h3>
              <p>
                আপনার মোবাইল নম্বর, ইমেইল এবং পেমেন্ট ট্রানজেকশন আইডি ২৫৬-বিট এসএসএল (SSL) এনক্রিপশনের মাধ্যমে সম্পূর্ণ সুরক্ষিত ডেটাবেজে সংরক্ষিত থাকে। কোনো অবস্থাতেই তৃতীয় পক্ষের কাছে বাণিজ্যিক উদ্দেশ্যে তথ্য শেয়ার করা হয় না।
              </p>
              <h3 className="text-sm font-bold text-slate-900">২. ওয়েবসাইট অ্যাডমিন ও পাসওয়ার্ড গোপনীয়তা</h3>
              <p>
                ওয়েবসাইট ডেলিভারির পর গ্রাহকের জন্য স্বতন্ত্র অ্যাডমিন আইডি ও পাসওয়ার্ড তৈরি করে সুরক্ষিত এনক্রিপশনে প্রদান করা হয়। গ্রাহক যেকোনো সময় নিজস্ব ওয়েবসাইট প্যানেল থেকে পাসওয়ার্ড পরিবর্তন করতে পারেন।
              </p>
              <h3 className="text-sm font-bold text-slate-900">৩. যোগাযোগ ও সহায়তা</h3>
              <p>
                যেকোনো প্রয়োজনে আমাদের অফিসিয়াল সাপোর্ট নম্বরে কল অথবা অ্যাকাউন্টের মাধ্যমে যোগাযোগ করতে পারেন।
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // VIEW: TERMS & CONDITIONS SUBPAGE (Requirement 9)
  // ==========================================
  if (subView === 'terms') {
    return (
      <div className="w-full flex flex-col font-sans pb-28 lg:pb-12 pt-3 sm:pt-6 lg:pt-8 animate-fadeIn bg-[#F8F5FC] text-slate-900">
        <section className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-purple-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-slate-500">BongoWeb টার্মস</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-4 text-slate-900">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <FileText className="w-6 h-6 text-purple-600" />
              <h1 className="text-lg sm:text-xl font-black text-slate-900">
                শর্তাবলি ও ব্যবহারের নিয়ম (Terms & Conditions)
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h3 className="text-sm font-bold text-slate-900">১. মেকিং ও ডেলিভারি চার্জ</h3>
              <p>
                প্রতিটি প্রি-বিল্ট ওয়েবসাইটের এককালীন রেডিমেকিং চার্জ মাত্র ১,৯৯০ টাকা। অর্ডার নিশ্চিত হওয়ার পর সর্বোচ্চ ২৪ থেকে ৪৮ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ওয়েবসাইট ডেলিভারি সম্পন্ন হয়।
              </p>
              <h3 className="text-sm font-bold text-slate-900">২. ক্লাউড সার্ভার ও মেইনটেন্যান্স (মাসিক খরচ ২৫০ টাকা)</h3>
              <p>
                ওয়েবসাইট নিরবচ্ছিন্নভাবে লাইভ ও নিরাপদ রাখার জন্য মাসিক খরচ ২৫০ টাকা। এই ফিতে সার্বক্ষণিক এসএসএল সিকিউরিটি, ডেটা ব্যাকআপ ও ক্লাউড নোড অপটিমাইজেশন অন্তর্ভুক্ত থাকে।
              </p>
              <h3 className="text-sm font-bold text-slate-900">৩. ফ্রি সাপোর্ট ও পরামর্শ</h3>
              <p>
                ওয়েবসাইট পরিচালনার জন্য সকল গ্রাহককে ফ্রি ভিডিও টিউটোরিয়াল প্রদান করা হয় এবং লাইভ সাপোর্ট টিকেট ও চ্যাটের মাধ্যমে সার্বক্ষণিক ফ্রি সাপোর্ট নিশ্চিত করা হয়।
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Helper for receipt modal
  function renderReceiptModal() {
    if (!selectedReceiptOrder) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-slideUpModal relative space-y-4 text-slate-900">
          <button
            onClick={() => setSelectedReceiptOrder(null)}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center pb-4 border-b border-slate-200">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black font-mono">
              {selectedReceiptOrder.orderId}
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              অফিসিয়াল অর্ডার রসিদ (Official Receipt)
            </h3>
            <p className="text-[11px] text-slate-500">
              BongoWeb — ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">গ্রাহকের নাম:</span>
              <span className="font-bold text-slate-900">{selectedReceiptOrder.clientName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">ব্যবসা/কোম্পানি:</span>
              <span className="font-bold text-slate-900">{selectedReceiptOrder.companyName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">মোবাইল নম্বর:</span>
              <span className="font-bold font-mono text-slate-900">{selectedReceiptOrder.phone}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">ইমেইল এড্রেস:</span>
              <span className="font-bold font-mono text-slate-900">{selectedReceiptOrder.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
              <span className="font-bold text-slate-900 uppercase">{selectedReceiptOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">ট্রানজেকশন TrxID:</span>
              <span className="font-bold font-mono text-emerald-600">{selectedReceiptOrder.transactionId}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">এককালীন চার্জ:</span>
              <span className="font-black text-sm text-slate-900 font-mono">১,৯৯০ ৳</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">মাসিক খরচ:</span>
              <span className="font-bold text-purple-700">মাসিক খরচ ২৫০ টাকা</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">স্ট্যাটাস:</span>
              <span className={`font-bold flex items-center gap-1 ${
                selectedReceiptOrder.status === 'completed'
                  ? 'text-emerald-600'
                  : selectedReceiptOrder.status === 'processing' || selectedReceiptOrder.status === 'verified'
                  ? 'text-purple-700'
                  : selectedReceiptOrder.status === 'cancelled'
                  ? 'text-rose-600'
                  : 'text-amber-600'
              }`}>
                {selectedReceiptOrder.status === 'completed'
                  ? '✓ সম্পূর্ণ (Completed)'
                  : selectedReceiptOrder.status === 'processing' || selectedReceiptOrder.status === 'verified'
                  ? '⚡ অনুমোদিত (প্রসেসিং)'
                  : selectedReceiptOrder.status === 'cancelled'
                  ? 'বাতিলকৃত'
                  : '⏳ পেন্ডিং ভেরিফিকেশন (১ মিনিট - ১ ঘণ্টা)'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-500/25 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / ডাউনলোড</span>
            </button>
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold cursor-pointer transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN LOGGED-IN ACCOUNT OVERVIEW
  // ==========================================
  return (
    <div className="relative w-full flex flex-col font-sans pb-28 lg:pb-12 pt-2 sm:pt-4 lg:pt-6 animate-fadeIn bg-[#F8F5FC] text-slate-900">
      {/* Ambient Brand Glow */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-200/35 via-indigo-100/30 to-blue-100/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 3. SECTION: CLIENT ACCOUNT / PROFILE SECTION (Requirement 2) */}
      <section className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 w-full mb-6 preserve-3d">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 border-b-[5px] border-b-purple-400/80 rounded-3xl p-5 sm:p-7 shadow-[0_6px_0_0_#DDD6FE,0_16px_30px_-6px_rgba(124,58,237,0.14)] space-y-6">
          {/* Header Profile Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-[0_4px_12px_rgba(124,58,237,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.7)] border border-white/40">
                  {(currentUser.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {currentUser.name || 'ক্লায়েন্ট প্রোফাইল'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Verified Client
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span>Joined: {currentUser.registeredAt}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-600">ID: {currentUser.clientId || 'BW-CLIENT'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowSecurityCodeModal(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200/80 hover:border-transparent text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 group"
                title="৫-মিনিটের সিকিউরিটি কোড দেখুন"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                <span>Security Code</span>
              </button>
            </div>
          </div>

          {/* Account Details 4-Column Balanced Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {/* 1. Full Name */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all space-y-1.5">
              <div className="flex items-center gap-2 text-slate-500">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Full Name (নাম)
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 truncate">
                {currentUser.name || 'N/A'}
              </p>
            </div>

            {/* 2. Email Address with Copy */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all space-y-1.5">
              <div className="flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Email Address
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(currentUser.email, 'email')}
                  className="text-slate-400 hover:text-purple-600 transition-colors p-0.5"
                  title="Copy email"
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 truncate select-all">
                {currentUser.email}
              </p>
            </div>

            {/* 3. Phone / Mobile */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all space-y-1.5">
              <div className="flex items-center justify-between text-slate-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Phone (মোবাইল)
                  </span>
                </div>
                {currentUser.phone && !currentUser.phone.includes('_') && !currentUser.phone.includes('@') && /\d{6,}/.test(currentUser.phone) && (
                  <button
                    type="button"
                    onClick={() => setShowVerificationExplainerModal(true)}
                    className="w-4.5 h-4.5 rounded-full bg-slate-200 hover:bg-blue-600 hover:text-white text-slate-600 inline-flex items-center justify-center transition-colors cursor-pointer text-[10px] font-bold"
                    title="Verification info"
                  >
                    ?
                  </button>
                )}
              </div>
              {currentUser.phone && !currentUser.phone.includes('_') && !currentUser.phone.includes('@') && /\d{6,}/.test(currentUser.phone) ? (
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 select-all truncate">
                    {currentUser.phone}
                  </p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 shrink-0 ${
                    currentUser.numberVerified
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    <span>{currentUser.numberVerified ? 'Verified' : 'Unverified'}</span>
                  </span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>ইমেইল ভেরিফাইড ✓</span>
                </p>
              )}
            </div>

            {/* 4. Security & Protection Level */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all space-y-1.5">
              <div className="flex items-center gap-2 text-slate-500">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Protection
                </span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Active Tier
                </p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                  256-bit SSL
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setReportMessage('');
                setReportSuccess('');
                setShowReportModal(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Flag className="w-4 h-4 text-purple-600" />
              <span>রিপোর্ট / অভিযোগ জানান (Submit Report)</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>সাইন আউট (Sign Out)</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: PROFESSIONAL POLICIES */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Policies & Terms (অ্যাকাউন্ট নীতিমালা ও শর্তাবলি)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                BongoWeb সার্ভিস ব্যবহার ও ক্লায়েন্ট নিরাপত্তা সম্পর্কিত নীতিমালা:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Privacy Policy */}
            <button
              onClick={() => navigateSubView('privacy')}
              className="p-4 sm:p-5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md text-left transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  Privacy Policy (গোপনীয়তা নীতিমালা)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  গ্রাহকের তথ্যের সুরক্ষা, এনক্রিপশন ও গোপনীয়তা রক্ষার পূর্ণাঙ্গ নীতিমালা পড়ুন।
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Updated Oct 2026</span>
                <span className="text-purple-600 font-semibold group-hover:underline">Read Policy →</span>
              </div>
            </button>

            {/* Terms & Conditions */}
            <button
              onClick={() => navigateSubView('terms')}
              className="p-4 sm:p-5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md text-left transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  Terms & Conditions (সার্ভিস শর্তাবলি)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  ওয়েবসাইট ডেলিভারি, ফ্রি হোস্টিং এবং সার্ভিস ব্যবহারের আইনগত শর্তসমূহ।
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>24h Delivery SLA</span>
                <span className="text-purple-600 font-semibold group-hover:underline">Read Terms →</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Receipt Modal Popup */}
      {renderReceiptModal()}

      {/* 6. SECURITY CODE MODAL (Requirement 13) */}
      {showSecurityCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 relative space-y-4 text-slate-900">
            <button
              onClick={() => setShowSecurityCodeModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!currentUser ? (
              <div className="text-center space-y-4 pt-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  সিকিউরিটি কোড যাচাইকরণ
                </h3>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 leading-relaxed">
                  “কোড পেতে আগে Account তৈরি করুন। তারপর আমরা আপনার সমস্যা সমাধান করব।”
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSecurityCodeModal(false);
                      setAuthStep('email');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Account তৈরি করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSecurityCodeModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                      ভেরিফিকেশন সুরক্ষা কোড
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      Your Security Code
                    </h3>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50/70 border-2 border-purple-200 text-center space-y-2">
                  <span className="text-xs text-slate-600 font-medium block">
                    আপনার বর্তমান ৫-মিনিটের সক্রিয় সিকিউরিটি কোড:
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-[0.25em] text-purple-700 select-all py-1">
                    {getClientSecurityCode(currentUser.phone || currentUser.email)}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>মেয়াদ বাকি: <strong className="text-slate-800 font-mono">{formatRemainingTime(codeRemainingSec)}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const code = getClientSecurityCode(currentUser.phone || currentUser.email);
                    navigator.clipboard.writeText(code);
                    setSecurityCodeCopied(true);
                    setTimeout(() => setSecurityCodeCopied(false), 2000);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    securityCodeCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                  }`}
                >
                  {securityCodeCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Security Code কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Security Code (কোড কপি করুন)</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  * এই কোডটি প্রতি ৫ মিনিটে স্বয়ংক্রিয়ভাবে পরিবর্তিত হয়। অ্যাডমিন বা সাপোর্ট টিম চাইলে তাদের এই কোডটি প্রদান করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Client Report Submission Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 relative space-y-4 text-slate-900">
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shadow-xs">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  অভিযোগ ও রিপোর্ট পাঠান
                </h3>
                <p className="text-[11px] text-slate-500">
                  আপনার মতামত, টেকনিক্যাল সমস্যা বা অভিযোগ সরাসরি অ্যাডমিনকে জানান
                </p>
              </div>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  রিপোর্ট সফলভাবে পাঠানো হয়েছে!
                </h4>
                <p className="text-xs text-slate-500">
                  {reportSuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3.5">
                {/* Auto-filled details (User doesn't need to type them) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ক্লায়েন্ট আইডি:</span>
                    <span className="font-mono font-bold text-purple-700 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-md">
                      {currentUser?.clientId || (currentUser?.phone ? `#BW-USER-${currentUser.phone.slice(-4)}` : '#BW-CLIENT')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">নাম:</span>
                    <strong className="text-slate-900">{currentUser?.name}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">মোবাইল নম্বর:</span>
                    <span className="font-mono text-slate-900">{currentUser?.phone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    আপনার অভিযোগ বা সমস্যা লিখুন <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="আপনার অভিযোগ, ওয়েবসাইটের সমস্যা বা যেকোনো প্রশ্ন বিস্তারিত লিখুন..."
                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={reportLoading || !reportMessage.trim()}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{reportLoading ? 'পাঠানো হচ্ছে...' : 'রিপোর্ট পাঠান (Send Report)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Phone Verification Explanation Modal (Requirement 2) */}
      {showVerificationExplainerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 relative space-y-4 animate-slideUpModal text-slate-900">
            <button
              type="button"
              onClick={() => setShowVerificationExplainerModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  নম্বর ভেরিফিকেশন তথ্য
                </h3>
                <span className="text-[11px] font-bold text-slate-500">
                  Phone Verification Policy
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-semibold text-amber-900">
                আপনার নম্বর verification অপেক্ষমাণ।
              </p>
              <p className="text-slate-600">
                আমাদের verification team সর্বোচ্চ 24 ঘণ্টার মধ্যে call করবে। 24 ঘণ্টায় call না ধরলে account সীমাবদ্ধ / restrict করা হতে পারে। অনুগ্রহ করে কলটি গ্রহণ করুন।
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                কলটি সফলভাবে সম্পন্ন হলে আপনার স্ট্যাটাস স্থায়ীভাবে <strong className="text-emerald-600 font-bold">Verified</strong> হয়ে যাবে।
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowVerificationExplainerModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              বুঝেছি (Got it)
            </button>
          </div>
        </div>
      )}

      {/* Google Sign-In Assistant Modal (Direct fix for auth/unauthorized-domain on preview/cloud domains) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 relative space-y-4 animate-slideUpModal text-slate-900">
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto">
                <GoogleLogoIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Continue with Google
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                আপনার গুগল অ্যাকাউন্ট (@gmail.com) দিয়ে নিরাপদে সাইন-ইন বা নতুন অ্যাকাউন্ট সম্পন্ন করুন।
              </p>
            </div>

            {/* Vercel & Live Security Badge */}
            <div className="p-3.5 rounded-2xl bg-purple-50/90 border border-purple-100 flex flex-col gap-1.5 text-[11px] text-purple-900 font-medium">
              <div className="flex items-center gap-2 font-bold text-purple-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vercel ও সকল লাইভ ডোমেইনে ১০০% নিরাপদ গুগল সাইন-ইন সক্রিয়</span>
              </div>
              <div className="flex items-center gap-2 text-purple-800 text-[10.5px]">
                <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>শুধুমাত্র সচল জিমেইল (@gmail.com) গ্রহণযোগ্য। অন্য কোনো ইমেইল গ্রহণযোগ্য নয়।</span>
              </div>
            </div>

            {googleModalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{googleModalError}</span>
              </div>
            )}

            <form onSubmit={handleGoogleModalSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  গুগল জিমেইল এড্রেস (Google Gmail Address) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="yourname@gmail.com"
                    value={googleModalEmail}
                    onChange={(e) => {
                      setGoogleModalEmail(e.target.value);
                      if (googleModalError) setGoogleModalError('');
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono font-medium shadow-xs"
                  />
                </div>
              </div>

              {/* Fast Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={googleModalLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {googleModalLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <GoogleLogoIcon className="w-4.5 h-4.5" />
                      <span>গুগল অ্যাকাউন্ট দিয়ে এগিয়ে যান (Continue)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleModalSendOtp}
                  disabled={googleModalLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>জিমেইলে ৬-ডিজিটের ওটিপি পাঠিয়ে যাচাই করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
