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
  apiResetPasswordWithOtp, apiSyncDescopeUser, apiSyncGoogleUser, normalizePhone 
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

  // Google Social Login - with Firefox & Popup blocker safe handling and SPA routing
  const handleGoogleSignIn = async () => {
    setAuthError('');
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const gUser = result.user;
      if (gUser && gUser.email) {
        const cleanEmail = gUser.email.toLowerCase();
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
      if (err?.code === 'auth/popup-blocked') {
        setAuthError('Google Sign-In popup was blocked by your browser. Please allow popups or use email address below.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed before completing.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setAuthError(err?.message || 'Google sign-in encountered an issue. Please enter your email below.');
      }
    } finally {
      setGoogleLoading(false);
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

  // STEP 1: Handle Email Submit (Unified Entry for all users)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setAuthError('Please enter a valid Gmail / Email address.');
      return;
    }

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

    setOtpSending(true);
    try {
      const res = await apiSendEmailOtp(cleanEmail, 'signup');
      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(30);
        setAuthStep('otp');
        setAuthSuccess(`Verification code sent to ${cleanEmail}`);
      } else {
        setAuthError(res.error || 'Failed to send verification code. Please try again.');
      }
    } catch (_) {
      setAuthError('Error sending verification code. Please check your network.');
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

    const cleanPhone = manualPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 6) {
      setAuthError('Please enter a valid mobile number.');
      return;
    }

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
      <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-start items-center font-sans pb-28 pt-4 sm:pt-6 relative bg-[#FAF6F0] overflow-x-hidden animate-fadeIn select-none">
        
        {/* Subtle Ambient Background Brand Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#2B47EE]/[0.08] via-[#7C3AED]/[0.05] to-[#4F46E5]/[0.05] rounded-full blur-3xl pointer-events-none -z-10" />

        {/* MOBILE-FIRST CENTERED CARD */}
        <div className="max-w-[440px] mx-auto px-4 w-full relative z-10 flex flex-col items-center mt-4 sm:mt-6">
          {/* ======================================================== */}
          {/* STEP 1: EMAIL ENTRY CARD (No Sign In, No Sign Up tabs)   */}
          {/* ======================================================== */}
          {authStep === 'email' && (
            <div className="w-full bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(43,71,238,0.12),0_4px_16px_rgba(0,0,0,0.03)] space-y-4 animate-fadeIn">
              
              {/* Top: Google Continue Button (Firefox-safe styling & robust fallback) */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.99] whitespace-nowrap select-none overflow-hidden"
              >
                <GoogleLogoIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                <span className="truncate">{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              {/* Divider: OR */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <span className="bg-white px-3">OR</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {authError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Gmail / Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your Gmail or email address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2B47EE] focus:ring-2 focus:ring-[#2B47EE]/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Continue button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={otpSending}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#2B47EE] to-[#7C3AED] hover:from-[#203CD4] hover:to-[#6D28D9] active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-[0_6px_22px_-4px_rgba(43,71,238,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
                </div>
              </form>

              {/* Bottom Option: "I don't have my email" */}
              <div className="text-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailRecoveryPage(true);
                    setSubView('recover-email');
                    window.history.pushState({}, '', '/account/recover-email');
                  }}
                  className="text-xs text-[#AB55F7] hover:text-[#9333EA] font-bold underline cursor-pointer inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-purple-50 transition-colors"
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
            <div className="w-full bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(43,71,238,0.12),0_4px_16px_rgba(0,0,0,0.03)] space-y-5 animate-fadeIn">
              
              {/* Header Icon */}
              <div className="text-center pt-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2B47EE]/10 to-[#7C3AED]/15 border border-[#2B47EE]/20 text-[#2B47EE] flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Mail className="w-7 h-7 text-[#2B47EE]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0D253D] tracking-tight">
                  Enter Verification Code
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  A 6-digit code has been sent to{' '}
                  <strong className="text-slate-800 font-semibold">{emailInput}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('email');
                    setAuthError('');
                    setEmailOtpCode('');
                  }}
                  className="mt-1 text-[11px] text-[#2B47EE] hover:underline font-semibold cursor-pointer"
                >
                  Edit email address
                </button>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* 6-Digit Code Input Box with Auto-Verify */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
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
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-center font-mono font-bold tracking-[0.35em] text-lg text-[#0D253D] focus:outline-none focus:border-[#2B47EE] focus:ring-2 focus:ring-[#2B47EE]/20 transition-all shadow-2xs"
                  />
                  {otpConfirming && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-[#2B47EE] font-bold bg-white/95 px-2.5 py-1 rounded-lg shadow-2xs">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  )}
                  {emailVerified && !otpConfirming && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-emerald-600 font-bold bg-white/95 px-2.5 py-1 rounded-lg shadow-2xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Didn't receive code?</span>
                  {otpCountdown > 0 ? (
                    <span className="text-slate-400 font-medium font-mono">
                      Resend in {otpCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEmailSubmit({ preventDefault: () => {} } as any)}
                      disabled={otpSending}
                      className="text-[#2B47EE] hover:underline font-bold cursor-pointer"
                    >
                      {otpSending ? 'Sending...' : 'Resend Code'}
                    </button>
                  )}
                </div>

                {/* Bottom Option: "I don't have my email" */}
                <div className="text-center pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailRecoveryPage(true);
                      setSubView('recover-email');
                      window.history.pushState({}, '', '/account/recover-email');
                    }}
                    className="text-xs text-[#AB55F7] hover:text-[#9333EA] font-bold underline cursor-pointer inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-purple-50 transition-colors"
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
            <div className="w-full bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(43,71,238,0.12),0_4px_16px_rgba(0,0,0,0.03)] space-y-5 animate-fadeIn">
              
              {isOldUser ? (
                /* ================= OLD USER FLOW ================= */
                <div className="space-y-4">
                  <div className="text-center pt-1">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0D253D] tracking-tight">
                      Welcome Back!
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Your email <strong className="text-slate-700">{emailInput}</strong> is verified.
                    </p>
                  </div>

                  {/* Registered Number (Locked - User cannot change it) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800">
                        Registered Mobile Number
                      </label>
                      <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100/90 border border-slate-200 text-xs sm:text-sm text-slate-700 font-mono font-bold cursor-not-allowed select-none shadow-2xs"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      🔒 Your registered phone number is verified and cannot be edited.
                    </p>
                  </div>

                  {/* Step Into Account Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleStepIntoOldAccount}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#2B47EE] to-[#7C3AED] hover:from-[#203CD4] hover:to-[#6D28D9] active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-[0_6px_22px_-4px_rgba(43,71,238,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-[#2B47EE] flex items-center justify-center mx-auto mb-3 shadow-xs">
                      <UserPlus className="w-7 h-7 text-[#2B47EE]" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0D253D] tracking-tight">
                      Complete Your Account
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Email verified! Please enter your mobile number to create your account.
                    </p>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2B47EE] focus:ring-2 focus:ring-[#2B47EE]/20 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Manual Phone Number Entry */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Mobile Number (Required)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 017XXXXXXXX"
                        value={manualPhone}
                        onChange={(e) => setManualPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#2B47EE] focus:ring-2 focus:ring-[#2B47EE]/20 transition-all shadow-2xs font-mono font-medium"
                      />
                    </div>
                  </div>

                  {/* Create Account Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={submittingNumber}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#2B47EE] to-[#7C3AED] hover:from-[#203CD4] hover:to-[#6D28D9] active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-[0_6px_22px_-4px_rgba(43,71,238,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
    );
  }

  // ==========================================
  // VIEW: TOTAL ORDERS SUBPAGE (Requirement 8)
  // ==========================================
  if (subView === 'total-orders') {
    return (
      <div className="w-full flex flex-col font-sans pb-28 pt-3 sm:pt-6 animate-fadeIn">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-5">
          {/* Back Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-bold font-mono">
              মোট অর্ডার: {userOrders.length} টি
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0D253D]">
              মোট Order (Total Orders)
            </h1>
            <p className="text-xs text-[#64748D] mt-1">
              আপনার নিবন্ধিত মোবাইল নম্বর ({currentUser.phone}) দিয়ে করা সমস্ত অর্ডারের সম্পূর্ণ তালিকা ও রসিদ:
            </p>
          </div>

          {userOrders.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E5EDF5] text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#0D253D]">
                আপনি এখনো কোনো ওয়েবসাইট অর্ডার করেননি
              </h3>
              <p className="text-xs text-[#64748D] max-w-sm mx-auto">
                ড্যাশবোর্ডে গিয়ে আপনার পছন্দের ক্যাটাগরি থেকে মাত্র ১,৯৯০ টাকায় ওয়েবসাইট অর্ডার করতে পারেন।
              </p>
              {onGoToDashboard && (
                <button
                  onClick={onGoToDashboard}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-[#2B47EE] text-white text-xs font-bold hover:bg-[#203CD4] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
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
                  className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] hover:border-[#2B47EE]/40 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#2B47EE] text-white font-mono font-black text-xs">
                        {ord.orderId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#2B47EE] text-[11px] font-bold">
                        {ord.demoCode}
                      </span>
                      <span className="text-sm font-bold text-[#0D253D] truncate">
                        {ord.companyName || ord.clientName}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748D] truncate">
                      {ord.demoTitle}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#273951] pt-1">
                      <span>তারিখ: <strong>{ord.createdAt}</strong></span>
                      <span>মেকিং: <strong className="text-[#2B47EE]">১,৯৯০ ৳</strong></span>
                      <span>TrxID: <strong className="font-mono text-[#00B261]">{ord.transactionId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EDF5]">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      ord.status === 'completed'
                        ? 'bg-[#00B261]/15 text-[#008A4B] border border-[#00B261]/30'
                        : ord.status === 'processing' || ord.status === 'verified'
                        ? 'bg-[#2B47EE]/15 text-[#2B47EE] border border-[#2B47EE]/30'
                        : ord.status === 'cancelled'
                        ? 'bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30'
                        : 'bg-[#FFD552]/20 text-[#8A6D00] border border-[#FFD552]'
                    }`}>
                      {ord.status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#008A4B]" />
                          <span>✓ সম্পূর্ণ (Completed)</span>
                        </>
                      ) : ord.status === 'processing' || ord.status === 'verified' ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#2B47EE] animate-pulse" />
                          <span>অনুমোদিত (প্রসেসিং)</span>
                        </>
                      ) : ord.status === 'cancelled' ? (
                        <span>বাতিলকৃত</span>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
                          <span>⏳ পেন্ডিং যাচাই</span>
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
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
      <div className="w-full flex flex-col font-sans pb-28 pt-3 sm:pt-6 animate-fadeIn">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-5">
          {/* Back Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              pendingOrders.length > 0 ? 'bg-[#FFD552]/20 text-[#8A6D00] border border-[#FFD552]' : 'bg-[#00B261]/15 text-[#008A4B]'
            }`}>
              {pendingOrders.length > 0 ? `${pendingOrders.length} টি পেন্ডিং যাচাই` : '০ টি পেন্ডিং'}
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0D253D]">
              Pending যাচাই (Pending Verification)
            </h1>
            <p className="text-xs text-[#64748D] mt-1">
              ম্যানুয়াল পেমেন্ট প্রেরণের পর অ্যাডমিন টিম কর্তৃক যাচাইকরণের তালিকা:
            </p>
          </div>

          {/* If there are NO pending orders -> Show "কোনো Pending নেই" / "No Pending" exactly as required */}
          {pendingOrders.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border-2 border-[#00B261]/30 text-center space-y-3 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#0D253D]">
                কোনো Pending নেই / No Pending
              </h3>
              <p className="text-xs sm:text-sm text-[#273951] max-w-md mx-auto leading-relaxed">
                আপনার কোনো অর্ডার বর্তমানে পেন্ডিং অবস্থায় নেই। সকল পেমেন্ট ও অর্ডার সফলভাবে যাচাই এবং কনফার্ম করা হয়েছে।
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateSubView('overview')}
                  className="px-6 py-2.5 rounded-xl bg-[#2B47EE] text-white text-xs font-bold hover:bg-[#203CD4] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>অ্যাকাউন্ট ওভারভিউতে ফিরুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#FFD552]/20 border border-[#FFD552] text-xs sm:text-sm font-bold text-[#8A6D00] flex items-center gap-2.5 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] animate-ping shrink-0" />
                <span>
                  আপনার নিম্নের অর্ডারসমূহের পেমেন্ট যাচাই প্রক্রিয়াধীন রয়েছে। অনুগ্রহ করে ১ মিনিট থেকে ১ ঘণ্টা অপেক্ষা করুন।
                </span>
              </div>

              {pendingOrders.map((ord, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#FFD552] transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#2B47EE] text-white font-mono font-black text-xs">
                        {ord.orderId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#2B47EE] text-[11px] font-bold">
                        {ord.demoCode}
                      </span>
                      <span className="text-sm font-bold text-[#0D253D] truncate">
                        {ord.companyName || ord.clientName}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748D] truncate">
                      {ord.demoTitle}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#273951] pt-1">
                      <span>তারিখ: <strong>{ord.createdAt || 'N/A'}</strong></span>
                      <span>মেকিং চার্জ: <strong className="text-[#2B47EE]">১,৯৯০ ৳</strong></span>
                      <span>পেমেন্ট: <strong>{String(ord.paymentMethod || 'bKash').toUpperCase()}</strong></span>
                      <span>TrxID: <strong className="font-mono text-[#00B261]">{ord.transactionId || 'N/A'}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EDF5]">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFD552]/20 text-[#8A6D00] border border-[#FFD552] flex items-center gap-1">
                      <span>⏳ পেন্ডিং যাচাই (১ মি. - ১ ঘণ্টা)</span>
                    </span>

                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
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
      <div className="w-full flex flex-col font-sans pb-28 pt-3 sm:pt-6 animate-fadeIn">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 w-full space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-[#64748D]">BongoWeb পলিসি</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5EDF5]">
              <ShieldCheck className="w-6 h-6 text-[#2B47EE]" />
              <h1 className="text-lg sm:text-xl font-black text-[#0D253D]">
                গোপনীয়তা নীতিমালা (Privacy Policy)
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#273951] leading-relaxed">
              <p>
                BongoWeb গ্রাহকদের তথ্যের গোপনীয়তা ও নিরাপত্তাকে সর্বোচ্চ প্রাধান্য দেয়। আপনি যখন আমাদের ওয়েবসাইট সেবা গ্রহণ করেন, আপনার প্রদত্ত ফোন নম্বর, ইমেইল ও ব্যবসার তথ্য শুধুমাত্র ওয়েবসাইট কনফিগারেশন ও অফিসিয়াল ডেলিভারির উদ্দেশ্যে সংরক্ষিত থাকে।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">১. তথ্য সংগ্রহ ও সুরক্ষা</h3>
              <p>
                আপনার মোবাইল নম্বর, ইমেইল এবং পেমেন্ট ট্রানজেকশন আইডি ২৫৬-বিট এসএসএল (SSL) এনক্রিপশনের মাধ্যমে সম্পূর্ণ সুরক্ষিত ডেটাবেজে সংরক্ষিত থাকে। কোনো অবস্থাতেই তৃতীয় পক্ষের কাছে বাণিজ্যিক উদ্দেশ্যে তথ্য শেয়ার করা হয় না।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">২. ওয়েবসাইট অ্যাডমিন ও পাসওয়ার্ড গোপনীয়তা</h3>
              <p>
                ওয়েবসাইট ডেলিভারির পর গ্রাহকের জন্য স্বতন্ত্র অ্যাডমিন আইডি ও পাসওয়ার্ড তৈরি করে সুরক্ষিত এনক্রিপশনে প্রদান করা হয়। গ্রাহক যেকোনো সময় নিজস্ব ওয়েবসাইট প্যানেল থেকে পাসওয়ার্ড পরিবর্তন করতে পারেন।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">৩. যোগাযোগ ও সহায়তা</h3>
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
      <div className="w-full flex flex-col font-sans pb-28 pt-3 sm:pt-6 animate-fadeIn">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 w-full space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateSubView('overview')}
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-[#64748D]">BongoWeb টার্মস</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5EDF5]">
              <FileText className="w-6 h-6 text-[#2B47EE]" />
              <h1 className="text-lg sm:text-xl font-black text-[#0D253D]">
                শর্তাবলি ও ব্যবহারের নিয়ম (Terms & Conditions)
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#273951] leading-relaxed">
              <h3 className="text-sm font-bold text-[#0D253D]">১. মেকিং ও ডেলিভারি চার্জ</h3>
              <p>
                প্রতিটি প্রি-বিল্ট ওয়েবসাইটের এককালীন রেডিমেকিং চার্জ মাত্র ১,৯৯০ টাকা। অর্ডার নিশ্চিত হওয়ার পর সর্বোচ্চ ২৪ থেকে ৪৮ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ওয়েবসাইট ডেলিভারি সম্পন্ন হয়।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">২. ক্লাউড সার্ভার ও মেইনটেন্যান্স (মাসিক খরচ ২৫০ টাকা)</h3>
              <p>
                ওয়েবসাইট নিরবচ্ছিন্নভাবে লাইভ ও নিরাপদ রাখার জন্য মাসিক খরচ ২৫০ টাকা। এই ফিতে সার্বক্ষণিক এসএসএল সিকিউরিটি, ডেটা ব্যাকআপ ও ক্লাউড নোড অপটিমাইজেশন অন্তর্ভুক্ত থাকে।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">৩. ফ্রি সাপোর্ট ও পরামর্শ</h3>
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
        <div className="w-full max-w-lg bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-8 animate-slideUpModal relative space-y-4">
          <button
            onClick={() => setSelectedReceiptOrder(null)}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center pb-4 border-b border-[#E5EDF5]">
            <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#2B47EE] text-xs font-black font-mono">
              {selectedReceiptOrder.orderId}
            </span>
            <h3 className="text-lg font-black text-[#0D253D] mt-2">
              অফিসিয়াল অর্ডার রসিদ (Official Receipt)
            </h3>
            <p className="text-[11px] text-[#64748D]">
              BongoWeb — ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">গ্রাহকের নাম:</span>
              <span className="font-bold text-[#0D253D]">{selectedReceiptOrder.clientName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">ব্যবসা/কোম্পানি:</span>
              <span className="font-bold text-[#0D253D]">{selectedReceiptOrder.companyName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">মোবাইল নম্বর:</span>
              <span className="font-bold font-mono text-[#0D253D]">{selectedReceiptOrder.phone}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">ইমেইল এড্রেস:</span>
              <span className="font-bold font-mono text-[#0D253D]">{selectedReceiptOrder.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">পেমেন্ট মাধ্যম:</span>
              <span className="font-bold text-[#0D253D] uppercase">{selectedReceiptOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">ট্রানজেকশন TrxID:</span>
              <span className="font-bold font-mono text-[#00B261]">{selectedReceiptOrder.transactionId}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">এককালীন চার্জ:</span>
              <span className="font-black text-sm text-[#0D253D]">১,৯৯০ ৳</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E5EDF5]">
              <span className="text-[#64748D]">মাসিক খরচ:</span>
              <span className="font-bold text-[#9333EA]">মাসিক খরচ ২৫০ টাকা</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#64748D]">স্ট্যাটাস:</span>
              <span className={`font-bold flex items-center gap-1 ${
                selectedReceiptOrder.status === 'completed'
                  ? 'text-[#008A4B]'
                  : selectedReceiptOrder.status === 'processing' || selectedReceiptOrder.status === 'verified'
                  ? 'text-[#2B47EE]'
                  : selectedReceiptOrder.status === 'cancelled'
                  ? 'text-[#E53935]'
                  : 'text-[#D8351E]'
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
              className="flex-1 py-2.5 rounded-xl bg-[#2B47EE] hover:bg-[#203CD4] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / ডাউনলোড</span>
            </button>
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="px-4 py-2.5 rounded-xl bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-xs font-bold cursor-pointer"
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
    <div className="w-full flex flex-col font-sans pb-28 pt-2 animate-fadeIn">
      {/* 2. SECTION: আপনার Website এর বিস্তারিত (Requirement 6 & Menu Item 2) */}
      <section id="website-credentials-section" className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-5 scroll-mt-24">
        {userCredentialsList.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0D253D] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00B261]" />
                  <span>আপনার Website এর বিস্তারিত</span>
                </h3>
                <p className="text-xs text-[#64748D]">
                  আমাদের ইঞ্জিনিয়ার টিম কর্তৃক প্রস্তুতকৃত প্রতিটি ওয়েবসাইটের পৃথক বিস্তারিত তথ্য ও অ্যাডমিন অ্যাক্সেস:
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#00B261]/15 text-[#008A4B] text-xs font-bold">
                {userCredentialsList.length} টি ওয়েবসাইট রেডি
              </span>
            </div>

            {/* Each website's details shown separately (Requirement 6) */}
            <div className="space-y-3">
              {userCredentialsList.map((cred, cIdx) => (
                <div
                  key={cIdx}
                  className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#008A4B]/10 via-[#00B261]/15 to-[#008A4B]/10 border-2 border-[#00B261] shadow-md space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00B261]/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-full bg-[#008A4B] text-white text-xs font-bold">
                        ✓ ওয়েবসাইট #{cIdx + 1}
                      </span>
                      <h4 className="text-base font-black text-[#0D253D]">
                        {cred.websiteTitle}
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#64748D] font-mono">
                      ডেলিভারি তারিখ: {cred.deliveredAt}
                    </span>
                  </div>

                  {/* ID & Password display with 1-click copy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E5EDF5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#64748D] font-bold block uppercase">
                          ওয়েবসাইট অ্যাডমিন আইডি / ইউজারনেম:
                        </span>
                        <span className="text-sm font-mono font-black text-[#0D253D] select-all">
                          {cred.websiteAdminId}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyText(cred.websiteAdminId, `id-${cred.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="আইডি কপি করুন"
                      >
                        {copiedField === `id-${cred.id}` ? <Check className="w-3.5 h-3.5 text-[#00B261]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === `id-${cred.id}` ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#E5EDF5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#64748D] font-bold block uppercase">
                          ওয়েবসাইট অ্যাডমিন পাসওয়ার্ড:
                        </span>
                        <span className="text-sm font-mono font-black text-[#2B47EE] select-all">
                          {cred.websiteAdminPass}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyText(cred.websiteAdminPass, `pass-${cred.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFD] hover:bg-[#EEF2FF] text-[#2B47EE] border border-[#E5EDF5] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="পাসওয়ার্ড কপি করুন"
                      >
                        {copiedField === `pass-${cred.id}` ? <Check className="w-3.5 h-3.5 text-[#00B261]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === `pass-${cred.id}` ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </div>
                  </div>

                  {cred.notes && (
                    <div className="bg-white/80 p-3 rounded-2xl border border-[#E5EDF5] text-xs text-[#273951]">
                      <strong className="text-[#0D253D] block mb-0.5">ইঞ্জিনিয়ার নোট ও লগইন নির্দেশনা:</strong>
                      <p className="leading-relaxed text-[#64748D]">{cred.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5EDF5] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center font-bold text-xs">
                  ২
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#0D253D]">
                    আপনার Website এর বিস্তারিত (Website ID ও Password)
                  </h3>
                  <p className="text-xs text-[#64748D]">
                    অ্যাডমিন আইডি ও পাসওয়ার্ড অ্যাক্সেস ড্যাশবোর্ড
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                অপেক্ষমান
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#64748D] leading-relaxed flex items-start gap-3">
              <Key className="w-5 h-5 text-[#2B47EE] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#0D253D] mb-0.5">কোনো সক্রিয় ওয়েবসাইট আইডি-পাসওয়ার্ড এখনও ডেলিভারি হয়নি</p>
                <p>আপনার অর্ডার অনুমোদিত ও সম্পন্ন হওয়ার সাথে সাথেই আমাদের ইঞ্জিনিয়ার টিম কর্তৃক প্রস্তুতকৃত ওয়েবসাইটের অ্যাডমিন আইডি ও পাসওয়ার্ড সরাসরি এখানে প্রদর্শিত হবে।</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. SECTION: CLIENT ACCOUNT / PROFILE SECTION (Requirement 2) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2B47EE] to-[#7C3AED] text-white flex items-center justify-center font-black text-base shadow-xs">
                {(currentUser.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-[#0D253D]">
                    {currentUser.name || 'ক্লায়েন্ট প্রোফাইল'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    সক্রিয় অ্যাকাউন্ট
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  রেজিস্ট্রেশন: {currentUser.registeredAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSecurityCodeModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-[#EEF2FF] text-[#2B47EE] border border-slate-200 hover:border-[#2B47EE]/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                title="৫-মিনিটের সিকিউরিটি কোড দেখুন"
              >
                <ShieldCheck className="w-4 h-4 text-[#2B47EE]" />
                <span>Security Code</span>
              </button>
            </div>
          </div>

          {/* Clean Fields: Profile Name, Email Address, Verification / Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Full Name (নাম)
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {currentUser.name}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Email Address (ইমেইল)
              </span>
              <p className="text-xs sm:text-sm font-mono font-bold text-slate-800 truncate select-all">
                {currentUser.email}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {currentUser.phone && !currentUser.phone.includes('_') && !currentUser.phone.includes('@') && /\d{6,}/.test(currentUser.phone)
                    ? 'Phone Number (মোবাইল)'
                    : 'Account Status (স্ট্যাটাস)'}
                </span>

                {/* Corner Question Mark (?) for Number Verification */}
                {currentUser.phone && !currentUser.phone.includes('_') && !currentUser.phone.includes('@') && /\d{6,}/.test(currentUser.phone) && (
                  <button
                    type="button"
                    onClick={() => setShowVerificationExplainerModal(true)}
                    className="w-5 h-5 rounded-full bg-slate-200 hover:bg-[#2B47EE] hover:text-white text-slate-600 inline-flex items-center justify-center transition-colors cursor-pointer text-xs font-black shadow-2xs"
                    title="নম্বর ভেরিফিকেশন নীতিমালা ও তথ্য দেখুন (?)"
                    aria-label="নম্বর ভেরিফিকেশন তথ্য"
                  >
                    ?
                  </button>
                )}
              </div>

              {currentUser.phone && !currentUser.phone.includes('_') && !currentUser.phone.includes('@') && /\d{6,}/.test(currentUser.phone) ? (
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <p className="text-xs sm:text-sm font-mono font-bold text-[#2B47EE] select-all">
                    {currentUser.phone}
                  </p>
                  {/* Badge at the end of phone number */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 shrink-0 ${
                    currentUser.numberVerified
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentUser.numberVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>{currentUser.numberVerified ? '✓ Verified' : 'Unverified'}</span>
                  </span>
                </div>
              ) : (
                <p className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span>ইমেইল ভেরিফাইড ✓</span>
                </p>
              )}
            </div>
          </div>

          {/* Sign Out & Report Buttons */}
          <div className="pt-3 border-t border-[#E5EDF5] flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => {
                setReportMessage('');
                setReportSuccess('');
                setShowReportModal(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#EEF2FF] hover:bg-[#2B47EE] text-[#2B47EE] hover:text-white border border-[#2B47EE]/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Flag className="w-4 h-4" />
              <span>রিপোর্ট / অভিযোগ জানান (Submit Report)</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E53935]/10 text-[#64748D] hover:text-[#E53935] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>সাইন আউট (Sign Out)</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: PROFESSIONAL POLICIES */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-3">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-[#0D253D]">
              অ্যাকাউন্ট সেটিংস ও নীতিমালা (Account Settings & Policies)
            </h3>
            <p className="text-xs text-[#64748D]">
              BongoWeb সার্ভিস ব্যবহারের নিয়মাবলি ও নীতিসমূহ:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Privacy Policy */}
            <button
              onClick={() => navigateSubView('privacy')}
              className="p-4 rounded-2xl bg-[#F8FAFD] hover:bg-[#EEF2FF] border border-[#E5EDF5] hover:border-[#2B47EE]/30 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-[#2B47EE]" />
                <ArrowRight className="w-4 h-4 text-[#64748D] group-hover:text-[#2B47EE] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D253D] group-hover:text-[#2B47EE]">
                Privacy Policy
              </h4>
              <p className="text-[11px] text-[#64748D] mt-0.5">
                গ্রাহকের তথ্যের সুরক্ষা ও গোপনীয়তা নীতিমালা পড়ুন
              </p>
            </button>

            {/* Terms & Conditions */}
            <button
              onClick={() => navigateSubView('terms')}
              className="p-4 rounded-2xl bg-[#F8FAFD] hover:bg-[#EEF2FF] border border-[#E5EDF5] hover:border-[#2B47EE]/30 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-[#2B47EE]" />
                <ArrowRight className="w-4 h-4 text-[#64748D] group-hover:text-[#2B47EE] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D253D] group-hover:text-[#2B47EE]">
                Terms & Conditions
              </h4>
              <p className="text-[11px] text-[#64748D] mt-0.5">
                সার্ভিস ব্যবহার ও ওয়েবসাইট ডেলিভারির শর্তাবলি
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Receipt Modal Popup */}
      {renderReceiptModal()}

      {/* 6. SECURITY CODE MODAL (Requirement 13) */}
      {showSecurityCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5EDF5] relative space-y-4">
            <button
              onClick={() => setShowSecurityCodeModal(false)}
              className="absolute top-4 right-4 p-2 text-[#64748D] hover:text-[#0D253D] rounded-full hover:bg-[#F8FAFD] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!currentUser ? (
              <div className="text-center space-y-4 pt-2">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8E7] text-[#FF9800] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-[#0D253D]">
                  সিকিউরিটি কোড যাচাইকরণ
                </h3>
                <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#FFD552] text-xs font-bold text-[#8A6D00] leading-relaxed">
                  “কোড পেতে আগে Account তৈরি করুন। তারপর আমরা আপনার সমস্যা সমাধান করব।”
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSecurityCodeModal(false);
                      setAuthStep('email');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#2B47EE] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Account তৈরি করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSecurityCodeModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#F8FAFD] text-[#64748D] hover:text-[#0D253D] text-xs font-semibold cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#2B47EE] uppercase tracking-wider block">
                      ভেরিফিকেশন সুরক্ষা কোড
                    </span>
                    <h3 className="text-base font-black text-[#0D253D]">
                      Your Security Code
                    </h3>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFD] border-2 border-[#2B47EE]/30 text-center space-y-2">
                  <span className="text-xs text-[#64748D] font-medium block">
                    আপনার বর্তমান ৫-মিনিটের সক্রিয় সিকিউরিটি কোড:
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-[0.25em] text-[#2B47EE] select-all py-1">
                    {getClientSecurityCode(currentUser.phone || currentUser.email)}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748D] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#00B261] animate-pulse" />
                    <span>মেয়াদ বাকি: <strong className="text-[#0D253D] font-mono">{formatRemainingTime(codeRemainingSec)}</strong></span>
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
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    securityCodeCopied
                      ? 'bg-[#00B261] text-white'
                      : 'bg-[#2B47EE] hover:bg-[#1E3A8A] text-white'
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

                <p className="text-[11px] text-[#64748D] text-center leading-relaxed">
                  * এই কোডটি প্রতি ৫ মিনিটে স্বয়ংক্রিয়ভাবে পরিবর্তিত হয়। অ্যাডমিন বা সাপোর্ট টিম চাইলে তাদের এই কোডটি প্রদান করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Client Report Submission Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-[#FFFFFF] rounded-3xl border border-[#E5EDF5] shadow-2xl p-6 sm:p-7 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[#64748D] hover:text-[#0D253D] hover:bg-[#F8FAFD] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#2B47EE] flex items-center justify-center shadow-xs">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0D253D]">
                  অভিযোগ ও রিপোর্ট পাঠান
                </h3>
                <p className="text-[11px] text-[#64748D]">
                  আপনার মতামত, টেকনিক্যাল সমস্যা বা অভিযোগ সরাসরি অ্যাডমিনকে জানান
                </p>
              </div>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#00B261]/10 text-[#00B261] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#0D253D]">
                  রিপোর্ট সফলভাবে পাঠানো হয়েছে!
                </h4>
                <p className="text-xs text-[#64748D]">
                  {reportSuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3.5">
                {/* Auto-filled details (User doesn't need to type them) */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748D]">ক্লায়েন্ট আইডি:</span>
                    <span className="font-mono font-bold text-[#2B47EE] bg-[#EEF2FF] px-2.5 py-0.5 rounded-md">
                      {currentUser?.clientId || (currentUser?.phone ? `#BW-USER-${currentUser.phone.slice(-4)}` : '#BW-CLIENT')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748D]">নাম:</span>
                    <strong className="text-[#0D253D]">{currentUser?.name}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748D]">মোবাইল নম্বর:</span>
                    <span className="font-mono text-[#0D253D]">{currentUser?.phone}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D253D] mb-1.5">
                    আপনার অভিযোগ বা সমস্যা লিখুন <span className="text-[#E53935]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    placeholder="আপনার অভিযোগ, ওয়েবসাইটের সমস্যা বা যেকোনো প্রশ্ন বিস্তারিত লিখুন..."
                    className="w-full p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:border-[#2B47EE] focus:ring-1 focus:ring-[#2B47EE] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={reportLoading || !reportMessage.trim()}
                    className="flex-1 py-3 rounded-xl bg-[#2B47EE] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{reportLoading ? 'পাঠানো হচ্ছে...' : 'রিপোর্ট পাঠান (Send Report)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-3 rounded-xl bg-[#F8FAFD] text-[#64748D] hover:text-[#0D253D] text-xs font-bold cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 relative space-y-4 animate-slideUpModal">
            <button
              type="button"
              onClick={() => setShowVerificationExplainerModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0D253D]">
                  নম্বর ভেরিফিকেশন তথ্য
                </h3>
                <span className="text-[11px] font-bold text-slate-500">
                  Phone Verification Policy
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <p className="font-semibold text-amber-900">
                আপনার নম্বর verification অপেক্ষমাণ।
              </p>
              <p className="text-slate-700">
                আমাদের verification team সর্বোচ্চ 24 ঘণ্টার মধ্যে call করবে। 24 ঘণ্টায় call না ধরলে account সীমাবদ্ধ / restrict করা হতে পারে। অনুগ্রহ করে কলটি গ্রহণ করুন।
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                কলটি সফলভাবে সম্পন্ন হলে আপনার স্ট্যাটাস স্থায়ীভাবে <strong className="text-emerald-600 font-bold">Verified</strong> হয়ে যাবে।
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowVerificationExplainerModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2B47EE] to-[#7C3AED] hover:from-[#203CD4] hover:to-[#6D28D9] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              বুঝেছি (Got it)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
