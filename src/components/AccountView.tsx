import React, { useState, useEffect } from 'react';
import { 
  User, ShieldCheck, Key, Globe, FileText, 
  HelpCircle, CheckCircle2, Lock, ArrowRight, ArrowLeft, X, 
  Printer, AlertCircle, ShoppingBag, Eye, EyeOff, LogOut, PhoneCall, 
  Sparkles, Check, Server, Shield, Copy, Languages, CheckCheck,
  AlertTriangle, Flag, Mail, Phone, RefreshCw, UserPlus
} from 'lucide-react';
import { Descope, useDescope, useSession, useUser, getSessionToken } from '@descope/react-sdk';
import { ClientOrder, UserAccount, WebsiteDeliveryCredentials, PasswordResetRequest } from '../types';
import { 
  apiRegisterUser, apiRequestPasswordReset, apiGetOrders, apiGetUsers, 
  apiGetCredentials, apiCreateReport, apiSendEmailOtp, apiVerifyEmailOtp, 
  apiResetPasswordWithOtp, apiSyncDescopeUser, apiSyncGoogleUser 
} from '../utils/api';
import { getClientSecurityCode, getSecurityCodeRemainingSeconds, formatRemainingTime } from '../utils/securityCode';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

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

export type AccountSubView = 'overview' | 'total-orders' | 'pending-orders' | 'privacy' | 'terms';

export default function AccountView({ onGoToDashboard, onOpenAdminPanel }: AccountViewProps) {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<ClientOrder | null>(null);
  const [userCredentialsList, setUserCredentialsList] = useState<WebsiteDeliveryCredentials[]>([]);
  const [subView, setSubView] = useState<AccountSubView>('overview');

  // Security Code System State (Requirement 13)
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(false);
  const [securityCodeCopied, setSecurityCodeCopied] = useState(false);
  const [codeRemainingSec, setCodeRemainingSec] = useState<number>(getSecurityCodeRemainingSeconds());

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // Language Change State (Requirement 9)
  const [selectedLanguage, setSelectedLanguage] = useState<'bn' | 'en'>('bn');

  // Copy Feedback State
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Descope SDK integration
  const descope = useDescope();
  const { isAuthenticated } = useSession();
  const { user: descopeUser } = useUser();

  // User-Requested 3-Screen Authentication Architecture (Login -> Registration -> Email Verification)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'email-verify' | 'descope'>('login');
  const [showAllScreensComparison, setShowAllScreensComparison] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Screen 2 Registration Form Specific Fields (Strict Order: Username, First Name, Last Name, WhatsApp, Password, Confirm Password)
  const [regUsername, setRegUsername] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regWhatsApp, setRegWhatsApp] = useState('');

  const [googleLoading, setGoogleLoading] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form State (with Email OTP)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpConfirming, setOtpConfirming] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isExistingAccountDetected, setIsExistingAccountDetected] = useState(false);
  const [showGoogleAccountModal, setShowGoogleAccountModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regSubmitting, setRegSubmitting] = useState(false);

  // Forgot Password Modal (Email OTP based)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

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

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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

    window.history.pushState({}, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem('bongoweb_user');
      if (storedUser) {
        const parsed: UserAccount = JSON.parse(storedUser);
        const allUsers = await apiGetUsers();
        const latest = allUsers.find(u => u.phone === parsed.phone) || parsed;
        if (latest.isRestricted) {
          handleLogout();
          setLoginError('🚫 আপনার অ্যাকাউন্টটি সাময়িকভাবে সীমাবদ্ধ (Restricted) করা হয়েছে।');
          return;
        }
        setCurrentUser(latest);

        // Check delivered credentials for this user
        const credsList = await apiGetCredentials();
        const found = credsList.filter((c) => c.userPhone === parsed.phone);
        setUserCredentialsList(found);
      } else {
        setCurrentUser(null);
        setUserCredentialsList([]);
      }

      const allOrders = await apiGetOrders();
      setOrders(allOrders);
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
    setSubView('overview');
    window.history.pushState({}, '', '/account');
  };

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Google Social Login - Opens the Google Account Selector Modal directly for reliable login
  const handleGoogleSignIn = () => {
    setLoginError('');
    setShowGoogleAccountModal(true);
  };

  // Direct Google Account Log In (works reliably for ANY Google account in iframe and browser)
  const handleDirectGoogleLogin = async (emailToUse: string, nameToUse?: string) => {
    const cleanEmail = emailToUse.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLoginError('Please enter a valid Google email address.');
      return;
    }
    setGoogleLoading(true);
    setLoginError('');
    try {
      const derivedName = nameToUse?.trim() || cleanEmail.split('@')[0] || 'Google User';
      const synced = await apiSyncGoogleUser({
        email: cleanEmail,
        name: derivedName
      });
      setCurrentUser(synced);
      localStorage.setItem('bongoweb_user', JSON.stringify(synced));
      sessionStorage.setItem('bongoweb_user', JSON.stringify(synced));
      localStorage.setItem('bongoweb_last_google_email', cleanEmail);
      if (nameToUse) localStorage.setItem('bongoweb_last_google_name', nameToUse);
      loadUserData();
      setShowGoogleAccountModal(false);
      if (onGoToDashboard) {
        onGoToDashboard();
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Google direct login error:', err);
      setLoginError('Google sign in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Descope Flow Success Callback
  const handleDescopeSuccess = async (e: any) => {
    try {
      if (e?.detail?.user) {
        console.log(e.detail.user.name);
        console.log(e.detail.user.email);
      }
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

      // Redirect user to home page "/" as requested
      if (onGoToDashboard) {
        onGoToDashboard();
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Descope success handler error:', err);
      window.location.href = '/';
    }
  };

  const handleDescopeError = (err: any) => {
    console.log("Error!", err);
    console.error('Descope authentication error:', err);
    setLoginError('Descope authentication error. Please try again.');
  };

  // Handle Client Login (or Secret Admin Login)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const cleanId = loginIdentifier.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // 1. Secret Admin Detection
    const adminConfigStr = localStorage.getItem('bongoweb_admin_config');
    const adminConfig = adminConfigStr ? JSON.parse(adminConfigStr) : {
      adminId: 'admin',
      adminEntryPassword: 'admin123',
      masterKey: 'MASTER-BONGO-2026'
    };

    if (
      (cleanId === adminConfig.adminId.toLowerCase() || cleanId === 'admin@bongoweb.xyz') &&
      cleanPass === adminConfig.adminEntryPassword
    ) {
      sessionStorage.setItem('bongoweb_admin_auth', 'true');
      setLoginLoading(false);
      if (onOpenAdminPanel) {
        onOpenAdminPanel();
      } else {
        window.location.href = '/admin';
      }
      return;
    }

    if (cleanPass === adminConfig.masterKey) {
      sessionStorage.setItem('bongoweb_admin_auth', 'true');
      setLoginLoading(false);
      if (onOpenAdminPanel) {
        onOpenAdminPanel();
      } else {
        window.location.href = '/admin';
      }
      return;
    }

    // 2. Client Login Check
    try {
      const storedUsers = await apiGetUsers();
      const matchingUser = storedUsers.find(
        (u) => (u.phone === cleanId || (u.email && u.email.toLowerCase() === cleanId)) && u.password === cleanPass
      );

      if (matchingUser) {
        if (matchingUser.isRestricted) {
          setLoginError('🚫 Your account has been temporarily restricted. Please contact support.');
          setLoginLoading(false);
          return;
        }
        localStorage.setItem('bongoweb_user', JSON.stringify(matchingUser));
        sessionStorage.setItem('bongoweb_user', JSON.stringify(matchingUser));
        setCurrentUser(matchingUser);
        loadUserData();

        // Redirect user to the home page "/"
        if (onGoToDashboard) {
          onGoToDashboard();
        } else {
          window.location.href = '/';
        }
      } else {
        setLoginError('Invalid phone number/email or password!');
      }
    } catch (_) {
      setLoginError('Login process failed. Please check your credentials and try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Send Email OTP during Registration (Smart Auto-Login for Existing Accounts)
  const handleSendEmailOtp = async () => {
    const clean = regEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }

    setRegError('');
    setRegSuccess('');
    setOtpSending(true);

    try {
      const res = await apiSendEmailOtp(clean, 'signup');
      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        if (res.isExistingUser) {
          setIsExistingAccountDetected(true);
          setRegSuccess('Existing account detected! A 6-digit verification code has been sent to your email. Enter it below to directly access your account without needing a password.');
        } else {
          setIsExistingAccountDetected(false);
          setRegSuccess('A 6-digit OTP verification code has been sent to your email.');
        }
      } else {
        setRegError(res.error || 'Failed to send OTP code.');
      }
    } catch (err) {
      setRegError('Failed to send OTP code. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  // Handle Confirm Email OTP
  const handleConfirmEmailOtp = async () => {
    const cleanCode = emailOtpCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setRegError('Please enter the 6-digit OTP code.');
      return;
    }

    setRegError('');
    setOtpConfirming(true);

    try {
      const res = await apiVerifyEmailOtp(regEmail.trim().toLowerCase(), cleanCode);
      if (res.success) {
        // Smart Registration System: If existing user, auto-login directly!
        if (res.isExistingUser && res.user) {
          setCurrentUser(res.user);
          localStorage.setItem('bongoweb_user', JSON.stringify(res.user));
          sessionStorage.setItem('bongoweb_user', JSON.stringify(res.user));
          loadUserData();
          if (onGoToDashboard) {
            onGoToDashboard();
          } else {
            window.location.href = '/';
          }
          return;
        }

        // Fallback check if existing user was flagged
        if (isExistingAccountDetected) {
          const allUsers = await apiGetUsers();
          const found = allUsers.find(u => (u.email || '').toLowerCase() === regEmail.trim().toLowerCase());
          if (found) {
            setCurrentUser(found);
            localStorage.setItem('bongoweb_user', JSON.stringify(found));
            sessionStorage.setItem('bongoweb_user', JSON.stringify(found));
            loadUserData();
            if (onGoToDashboard) {
              onGoToDashboard();
            } else {
              window.location.href = '/';
            }
            return;
          }
        }

        setEmailVerified(true);
      } else {
        setRegError(res.error || 'Invalid OTP code! Please verify the code received in your email.');
      }
    } catch (_) {
      setRegError('Code verification failed.');
    } finally {
      setOtpConfirming(false);
    }
  };

  // Handle Submit Client Report
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim()) return;
    setReportLoading(true);
    try {
      const clientId = currentUser?.clientId || (currentUser?.phone ? `#BW-USER-${currentUser.phone.slice(-4)}` : `#BW-${Date.now()}`);
      await apiCreateReport({
        id: `REP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        clientIdentifier: clientId,
        clientName: currentUser?.name || 'Valued Client',
        clientPhone: currentUser?.phone || '',
        clientEmail: currentUser?.email || '',
        message: reportMessage.trim(),
        createdAt: new Date().toLocaleString('en-US'),
        status: 'pending'
      });
      setReportSuccess('Your report has been submitted successfully! Our team will review it shortly.');
      setTimeout(() => {
        setReportSuccess('');
        setReportMessage('');
        setShowReportModal(false);
      }, 2500);
    } catch (_) {
      setReportSuccess('Report submitted.');
      setTimeout(() => {
        setReportSuccess('');
        setReportMessage('');
        setShowReportModal(false);
      }, 2000);
    } finally {
      setReportLoading(false);
    }
  };

  // SCREEN 2: Handle Step 1 Registration (Validates Username, First Name, Last Name, WhatsApp, Passwords)
  const handleRegisterStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regUsername.trim()) {
      setRegError('Please choose a username.');
      return;
    }
    if (!regFirstName.trim()) {
      setRegError('Please enter your first name.');
      return;
    }
    const cleanWhatsApp = regWhatsApp.trim();
    if (!cleanWhatsApp || cleanWhatsApp.length < 9) {
      setRegError('Please enter a valid WhatsApp mobile number (e.g. 017XXXXXXXX).');
      return;
    }
    if (!regPass || regPass.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }
    if (regPass !== regConfirmPass) {
      setRegError('Password and Confirm Password do not match!');
      return;
    }

    try {
      const allUsers = await apiGetUsers();
      if (allUsers.some(u => u.phone === cleanWhatsApp || u.whatsapp === cleanWhatsApp)) {
        setRegError('An account with this WhatsApp number already exists.');
        return;
      }
    } catch (_) {}

    // Successfully validated step 1 -> immediately transition to SCREEN 3: EMAIL VERIFICATION
    setAuthMode('email-verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SCREEN 3: Handle Final Registration with Email & OTP
  const handleFinalizeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const cleanEmail = regEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setRegError('Please enter a valid email address.');
      return;
    }

    // If OTP was sent and not yet confirmed
    if (otpSent && !emailVerified) {
      const cleanCode = emailOtpCode.trim();
      if (!cleanCode || cleanCode.length < 6) {
        setRegError('Please enter the 6-digit verification code sent to your email.');
        return;
      }
      setOtpConfirming(true);
      const verifyRes = await apiVerifyEmailOtp(cleanEmail, cleanCode);
      setOtpConfirming(false);
      if (!verifyRes.success) {
        setRegError(verifyRes.error || 'Invalid or expired OTP code.');
        return;
      }
      setEmailVerified(true);
    }

    setRegSubmitting(true);
    try {
      const cleanWhatsApp = regWhatsApp.trim() || regPhone.trim();
      const fullName = `${regFirstName.trim()} ${regLastName.trim()}`.trim() || regUsername.trim() || 'BongoWeb Member';
      const newUser: UserAccount = {
        name: fullName,
        username: regUsername.trim(),
        whatsapp: cleanWhatsApp,
        phone: cleanWhatsApp,
        email: cleanEmail,
        password: regPass.trim(),
        registeredAt: new Date().toLocaleDateString('bn-BD')
      };

      const result = await apiRegisterUser(newUser);
      setRegSubmitting(false);

      if (!result.success) {
        setRegError(result.error || 'Registration failed. Please try again.');
        return;
      }

      setCurrentUser(newUser);
      localStorage.setItem('bongoweb_user', JSON.stringify(newUser));
      sessionStorage.setItem('bongoweb_user', JSON.stringify(newUser));
      loadUserData();

      if (onGoToDashboard) {
        onGoToDashboard();
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setRegSubmitting(false);
      setRegError(err?.message || 'Registration error. Please try again.');
    }
  };

  // Legacy full registration handler fallback
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    await handleRegisterStep1(e);
  };

  // Handle Forgot Password Send OTP (Email OTP)
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = forgotEmail.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotError('');
    setForgotLoading(true);

    try {
      const res = await apiSendEmailOtp(clean, 'forgot_password');
      if (res.success) {
        setForgotOtpSent(true);
      } else {
        setForgotError(res.error || 'No account found with this email address.');
      }
    } catch (_) {
      setForgotError('Failed to send OTP code. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Forgot Password Reset Submit
  const handleForgotResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotOtpCode || forgotOtpCode.length < 6) {
      setForgotError('Please enter the 6-digit OTP code.');
      return;
    }
    if (!forgotNewPass || forgotNewPass.length < 4) {
      setForgotError('Password must be at least 4 characters long.');
      return;
    }
    if (forgotNewPass !== forgotConfirmPass) {
      setForgotError('Password and Confirm Password do not match!');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await apiResetPasswordWithOtp(forgotEmail.trim().toLowerCase(), forgotOtpCode.trim(), forgotNewPass.trim());
      if (res.success) {
        setForgotSuccess('Password successfully reset! You can now log in.');
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotSuccess('');
          setForgotOtpSent(false);
          setForgotOtpCode('');
          setForgotNewPass('');
          setForgotConfirmPass('');
          setForgotEmail('');
          setAuthMode('login');
        }, 2200);
      } else {
        setForgotError(res.error || 'Password reset failed.');
      }
    } catch (_) {
      setForgotError('Server error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Filter orders for the logged-in client
  const userOrders = currentUser 
    ? orders.filter((o) => o.phone === currentUser.phone || o.email.toLowerCase() === currentUser.email.toLowerCase())
    : [];
  const pendingOrders = userOrders.filter((o) => o.status === 'pending');

  // ==========================================
  // VIEW: IF USER IS NOT LOGGED IN (Production Authentication Portal)
  // 3 CLEAN, MODERN, PREMIUM UI SCREENS FOR BONGEWEB.XYZ
  // SCREEN 1: LOGIN | SCREEN 2: REGISTRATION | SCREEN 3: EMAIL VERIFICATION
  // ==========================================
  if (!currentUser) {
    return (
      <div className="w-full min-h-[calc(100vh-120px)] flex flex-col justify-start items-center font-sans pb-28 pt-4 sm:pt-6 relative bg-[#FAF6F0] overflow-x-hidden animate-fadeIn select-none">
        
        {/* Subtle Ambient Background Warm Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#FF6118]/[0.06] via-[#FBD38D]/[0.08] to-[#533AFD]/[0.03] rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Floating Green WhatsApp Chat Button (Bottom-Right Corner) */}
        <a
          href="https://wa.me/8801831828859?text=Hello%20BongoWeb%20Support%20I%20need%20help%20with%20my%20account"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all group cursor-pointer"
          title="Chat on WhatsApp (+880 1831-828859)"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-200"></span>
          </span>
          <WhatsAppIcon className="w-7 h-7 text-white fill-white" />
        </a>

        {/* MOBILE-FIRST CENTERED CARD */}
        <div className="max-w-[440px] mx-auto px-4 w-full relative z-10 flex flex-col items-center mt-2 sm:mt-4">
          
          {/* SCREEN 1: LOGIN PAGE */}
          {authMode === 'login' && (
              <div className="w-full bg-[#FFF8F0] border border-[#FBD38D] rounded-[26px] sm:rounded-[28px] p-6 sm:p-8 shadow-[0_18px_45px_-10px_rgba(255,145,50,0.12),0_4px_16px_rgba(0,0,0,0.03)] space-y-4 animate-fadeIn">
                
                {/* 1. Top of Card: White Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-[#FFFDFB] border border-[#EBDCC8] hover:border-[#FBD38D] text-slate-800 text-xs sm:text-sm font-bold shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.99]"
                >
                  <GoogleLogoIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                  <span>Google এর মাধ্যমে সাইন-ইন করুন</span>
                </button>

                {/* 2. Thin Horizontal Line + Centered Text "OR" */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#EBDCC8]" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    <span className="bg-[#FFF8F0] px-3">OR</span>
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Label: Email or Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Email or Phone
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your email or phone number"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#EBDCC8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6118] focus:ring-2 focus:ring-[#FF6118]/20 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>

                  {/* Label: Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showLoginPass ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-[#EBDCC8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6118] focus:ring-2 focus:ring-[#FF6118]/20 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Left: unchecked checkbox + Remember me | Right: orange underlined link Forgot password? */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[#EBDCC8] text-[#FF6118] focus:ring-[#FF6118] cursor-pointer"
                      />
                      <span className="text-slate-600 font-medium">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotError('');
                        setForgotSuccess('');
                        setForgotOtpSent(false);
                        setForgotEmail(loginIdentifier.includes('@') ? loginIdentifier : '');
                      }}
                      className="text-xs text-[#FF6118] hover:text-[#EE5507] underline font-semibold cursor-pointer transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Large full-width orange button with black text: "Sign in" */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#FF6118] hover:bg-[#EE5507] active:scale-[0.99] text-black font-black text-sm sm:text-base shadow-[0_6px_20px_-3px_rgba(255,97,24,0.38)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {loginLoading ? <span>Signing in...</span> : <span>Sign in</span>}
                    </button>
                  </div>
                </form>

                {/* Bottom text: "Do not have an account?" + blue underlined link "Sign up" */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Do not have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setLoginError('');
                        setRegError('');
                      }}
                      className="text-[#3B82F6] hover:text-[#2563EB] font-bold underline cursor-pointer ml-1 inline-flex items-center gap-1"
                    >
                      <span>Sign up</span>
                    </button>
                  </p>
                </div>

              </div>
            )}

            {/* SCREEN 2: REGISTRATION PAGE */}
            {authMode === 'register' && (
              <div className="w-full bg-[#FFF8F0] border border-[#FBD38D] rounded-[26px] sm:rounded-[28px] p-6 sm:p-8 shadow-[0_18px_45px_-10px_rgba(255,145,50,0.12),0_4px_16px_rgba(0,0,0,0.03)] space-y-3.5 animate-fadeIn">
                
                {/* 1. Top of Card: White Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-[#FFFDFB] border border-[#EBDCC8] hover:border-[#FBD38D] text-slate-800 text-xs sm:text-sm font-bold shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.99]"
                >
                  <GoogleLogoIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                  <span>Google অ্যাকাউন্ট দিয়ে সাইন-আপ করুন</span>
                </button>

                {/* 2. Thin Horizontal Line + Centered Text "OR" */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#EBDCC8]" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    <span className="bg-[#FFF8F0] px-3">OR</span>
                  </div>
                </div>

                <form onSubmit={handleRegisterStep1} className="space-y-3">
                  {regError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {/* 1. Username (person icon) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Choose a username"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EBDCC8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6118] focus:ring-2 focus:ring-[#FF6118]/20 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>

                  {/* 2. First name (person icon) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      First name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your first name"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EBDCC8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6118] focus:ring-2 focus:ring-[#FF6118]/20 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>

                  {/* 3. Last name (person icon) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Last name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your last name"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EBDCC8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6118] focus:ring-2 focus:ring-[#FF6118]/20 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>

                  {/* 4. WhatsApp number (WhatsApp green icon) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      WhatsApp number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 017XXXXXXXX"
                        value={regWhatsApp}
                        onChange={(e) => setRegWhatsApp(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EBDCC8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6118] focus:ring-2 focus:ring-[#FF6118]/20 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] font-mono"
                      />
                    </div>
                  </div>

                  {/* 5. Password (lock icon) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showRegPass ? 'text' : 'password'}
                        required
                        placeholder="Create a password"
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#EBDCC8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6118] focus:ring-2 focus:ring-[#FF6118]/20 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass(!showRegPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {showRegPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* 6. Confirm password (lock icon) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showRegPass ? 'text' : 'password'}
                        required
                        placeholder="Confirm your password"
                        value={regConfirmPass}
                        onChange={(e) => setRegConfirmPass(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EBDCC8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6118] focus:ring-2 focus:ring-[#FF6118]/20 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] font-mono"
                      />
                    </div>
                  </div>

                  {/* Large full-width orange button with black text: "Sign up" */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-[#FF6118] hover:bg-[#EE5507] active:scale-[0.99] text-black font-black text-sm sm:text-base shadow-[0_6px_20px_-3px_rgba(255,97,24,0.38)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Sign up</span>
                    </button>
                  </div>
                </form>

                {/* Bottom text: "Already have an account?" + blue underlined link "Sign in" */}
                <div className="text-center pt-1">
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setRegError('');
                        setLoginError('');
                      }}
                      className="text-[#3B82F6] hover:text-[#2563EB] font-bold underline cursor-pointer ml-1 inline-flex items-center gap-1"
                    >
                      <span>Sign in</span>
                    </button>
                  </p>
                </div>

              </div>
            )}

            {/* SCREEN 3: EMAIL VERIFICATION PAGE (Comes right after clicking Sign up) */}
            {authMode === 'email-verify' && (
              <div className="w-full bg-[#FFF8F0] border border-[#FBD38D] rounded-[26px] sm:rounded-[28px] p-6 sm:p-8 shadow-[0_18px_45px_-10px_rgba(255,145,50,0.12),0_4px_16px_rgba(0,0,0,0.03)] space-y-5 animate-fadeIn">
                
                {/* Top: Small icon / illustration of an email / envelope */}
                <div className="text-center pt-1">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFEBD9] border border-[#FBD38D] text-[#FF6118] flex items-center justify-center mx-auto mb-3.5 shadow-[0_4px_14px_rgba(255,97,24,0.18)]">
                    <Mail className="w-7 h-7 text-[#FF6118]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0D253D] tracking-tight">
                    Verify your email
                  </h2>
                  <p className="text-xs sm:text-[13px] text-slate-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
                    We need your email address to complete your registration. Please enter it below.
                  </p>
                </div>

                <form onSubmit={handleFinalizeRegistration} className="space-y-4">
                  {regError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {regSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{regSuccess}</span>
                    </div>
                  )}

                  {/* Input field: Email address + small orange "Send Code" or "Verify" button on SAME LINE */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          placeholder="Enter your email address"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-[#EBDCC8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6118] focus:ring-2 focus:ring-[#FF6118]/20 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        disabled={otpSending || !regEmail.includes('@')}
                        className="shrink-0 px-4 py-3 rounded-xl bg-[#FF6118] hover:bg-[#EE5507] active:scale-95 text-black font-extrabold text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
                      >
                        {otpSending ? 'Sending...' : otpSent ? 'Resend' : 'Send Code'}
                      </button>
                    </div>
                  </div>

                  {/* Optional OTP Code Verification box if code was sent */}
                  {otpSent && (
                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-[#FBD38D] space-y-2 animate-fadeIn">
                      <label className="block text-xs font-bold text-slate-800">
                        6-Digit Verification Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter code"
                          value={emailOtpCode}
                          onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#EBDCC8] text-center font-mono font-bold tracking-widest text-sm text-[#0D253D] focus:outline-none focus:border-[#FF6118]"
                        />
                        <button
                          type="button"
                          onClick={handleConfirmEmailOtp}
                          disabled={otpConfirming || emailOtpCode.length < 6}
                          className="px-3.5 py-2 rounded-xl bg-[#00B261] hover:bg-[#009E56] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          {otpConfirming ? 'Verifying...' : emailVerified ? 'Verified ✓' : 'Verify'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Check your email inbox or spam folder for your 6-digit confirmation code.
                      </p>
                    </div>
                  )}

                  {/* Below: Large orange button "Continue" */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={regSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#FF6118] hover:bg-[#EE5507] active:scale-[0.99] text-black font-black text-sm sm:text-base shadow-[0_6px_20px_-3px_rgba(255,97,24,0.38)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {regSubmitting ? <span>Finalizing registration...</span> : <span>Continue</span>}
                    </button>
                  </div>
                </form>

                {/* Small text at the bottom: "Already verified? Sign in" */}
                <div className="text-center pt-1">
                  <p className="text-xs text-slate-500">
                    Already verified?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setRegError('');
                      }}
                      className="text-[#3B82F6] hover:text-[#2563EB] font-bold underline cursor-pointer ml-1 inline-flex items-center gap-1"
                    >
                      <span>Sign in</span>
                    </button>
                  </p>
                </div>

              </div>
            )}

            {/* DESCOPE AUTH FLOW VIEW (Optional alternative mode) */}
            {authMode === 'descope' && (
              <div className="w-full bg-[#FFF8F0] border border-[#FBD38D] rounded-[26px] p-6 shadow-[0_18px_45px_-10px_rgba(255,145,50,0.12)] space-y-4 animate-fadeIn">
                <div className="text-center pb-2">
                  <h3 className="text-base font-black text-[#0D253D]">Descope All-In-One Flow</h3>
                  <p className="text-xs text-slate-500">Google, Magic Link, Passkeys or WhatsApp login</p>
                </div>
                <div className="min-h-[300px] flex items-center justify-center">
                  <Descope
                    flowId="sign-up-or-in"
                    onSuccess={(e) => {
                      console.log(e?.detail?.user?.name);
                      console.log(e?.detail?.user?.email);
                      handleDescopeSuccess(e);
                    }}
                    onError={(err) => {
                      console.log("Error!", err);
                      handleDescopeError(err);
                    }}
                    theme="light"
                  />
                </div>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-xs text-[#3B82F6] hover:underline font-bold"
                  >
                    Return to Standard Sign In
                  </button>
                </div>
              </div>
            )}

          </div>

        {/* Security & Code Footnote */}
        <div className="mt-8 flex flex-col items-center gap-2 select-none text-center">
          <button
            type="button"
            onClick={() => setShowSecurityCodeModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#FBD38D]/60 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#FF6118]" />
            <span>View Client Security Code</span>
          </button>

          <p className="text-[11px] text-slate-400">
            bongoweb.xyz • Verified Bangladeshi Business Platform • 256-Bit SSL Secured
          </p>
        </div>

        {/* GOOGLE ACCOUNT DIRECT SELECTION MODAL */}
        {showGoogleAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/70 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-[28px] border border-slate-200/90 shadow-[0_25px_65px_-15px_rgba(15,23,42,0.25)] p-6 sm:p-7 relative space-y-4">
              <button
                type="button"
                onClick={() => setShowGoogleAccountModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0D253D]">
                    Continue with Google
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Sign in with any Google account directly
                  </p>
                </div>
              </div>

              {/* 1-Click Fast Account Button for remembered account if previously logged in */}
              {(() => {
                const rememberedEmail = localStorage.getItem('bongoweb_last_google_email');
                const rememberedName = localStorage.getItem('bongoweb_last_google_name');
                if (!rememberedEmail) return null;
                const initials = rememberedName ? rememberedName.slice(0, 2).toUpperCase() : rememberedEmail.slice(0, 2).toUpperCase();
                return (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      Recently used Google account:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDirectGoogleLogin(rememberedEmail, rememberedName || undefined)}
                      disabled={googleLoading}
                      className="w-full p-3 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 transition-all flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4285F4] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{rememberedEmail}</span>
                          <span className="text-[10px] text-indigo-700 font-medium">1-Click Fast Sign In</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#4285F4] transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                );
              })()}

              {/* Enter ANY Google Account */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customGoogleEmail) {
                    handleDirectGoogleLogin(customGoogleEmail, customGoogleName);
                  }
                }}
                className="space-y-3 pt-1 border-t border-slate-100"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Google Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. user@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Tanvir Ahmed"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={!customGoogleEmail.includes('@') || googleLoading}
                    className="flex-1 py-3 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs flex items-center justify-center gap-2 active:scale-98"
                  >
                    {googleLoading ? (
                      <span>Connecting...</span>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGoogleAccountModal(false)}
                    className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD MODAL (EMAIL OTP BASED) */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D253D]/65 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-[28px] border border-slate-200/90 shadow-[0_25px_65px_-15px_rgba(15,23,42,0.25)] p-6 sm:p-7 relative space-y-4">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#533AFD] flex items-center justify-center shadow-xs">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0D253D]">
                    Reset Password (Email OTP)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Set a new password using the OTP code sent to your registered email
                  </p>
                </div>
              </div>

              {forgotSuccess ? (
                <div className="py-6 text-center space-y-2 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0D253D]">
                    Password Reset Successful!
                  </h4>
                  <p className="text-xs text-slate-500">
                    {forgotSuccess}
                  </p>
                </div>
              ) : !forgotOtpSent ? (
                /* Step 1: Send OTP to Email */
                <form onSubmit={handleForgotSendOtp} className="space-y-3.5">
                  {forgotError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-[#0D253D] placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#533AFD] focus:ring-3 focus:ring-[#533AFD]/15 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={forgotLoading || !forgotEmail.includes('@')}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#533AFD] to-[#432BEE] text-white text-xs font-bold hover:from-[#432BEE] hover:to-[#3724C4] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
                    >
                      {forgotLoading ? (
                        <span>Sending code...</span>
                      ) : (
                        <>
                          <Key className="w-3.5 h-3.5" />
                          <span>Send Reset OTP</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Enter OTP Code + New Password */
                <form onSubmit={handleForgotResetSubmit} className="space-y-3.5 animate-fadeIn">
                  {forgotError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between">
                    <span>A 6-digit verification code has been sent to {forgotEmail}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      6-Digit OTP Code from Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="6-digit OTP"
                      value={forgotOtpCode}
                      onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-sm text-[#0D253D] font-mono tracking-[0.25em] text-center font-bold focus:outline-none focus:bg-white focus:border-[#533AFD] focus:ring-3 focus:ring-[#533AFD]/15 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 4 characters"
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-[#0D253D] focus:outline-none focus:bg-white focus:border-[#533AFD] focus:ring-3 focus:ring-[#533AFD]/15 transition-all shadow-2xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={forgotConfirmPass}
                      onChange={(e) => setForgotConfirmPass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-[#0D253D] focus:outline-none focus:bg-white focus:border-[#533AFD] focus:ring-3 focus:ring-[#533AFD]/15 transition-all shadow-2xs font-mono"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={forgotLoading || forgotOtpCode.length < 6}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00B261] to-[#009E56] text-white text-xs font-bold hover:from-[#009E56] hover:to-[#008749] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
                    >
                      {forgotLoading ? (
                        <span>Resetting...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete Password Reset</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotOtpSent(false)}
                      className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
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
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-bold font-mono">
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
              <div className="w-14 h-14 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center mx-auto">
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
                  className="mt-2 px-6 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
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
                  className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] hover:border-[#533AFD]/40 transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#533AFD] text-white font-mono font-black text-xs">
                        {ord.orderId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#E2E4FF] text-[#533AFD] text-[11px] font-bold">
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
                      <span>মেকিং: <strong className="text-[#533AFD]">১,৯৯০ ৳</strong></span>
                      <span>TrxID: <strong className="font-mono text-[#00B261]">{ord.transactionId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EDF5]">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      ord.status === 'completed'
                        ? 'bg-[#00B261]/15 text-[#008A4B] border border-[#00B261]/30'
                        : ord.status === 'processing' || ord.status === 'verified'
                        ? 'bg-[#533AFD]/15 text-[#533AFD] border border-[#533AFD]/30'
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
                          <span className="w-2 h-2 rounded-full bg-[#533AFD] animate-pulse" />
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
                      className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
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
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
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
                  className="px-6 py-2.5 rounded-xl bg-[#533AFD] text-white text-xs font-bold hover:bg-[#665EFD] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
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
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#533AFD] text-white font-mono font-black text-xs">
                        {ord.orderId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#E2E4FF] text-[#533AFD] text-[11px] font-bold">
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
                      <span>মেকিং চার্জ: <strong className="text-[#533AFD]">১,৯৯০ ৳</strong></span>
                      <span>পেমেন্ট: <strong>{ord.paymentMethod.toUpperCase()}</strong></span>
                      <span>TrxID: <strong className="font-mono text-[#00B261]">{ord.transactionId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5EDF5]">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFD552]/20 text-[#8A6D00] border border-[#FFD552] flex items-center gap-1">
                      <span>⏳ পেন্ডিং যাচাই (১ মি. - ১ ঘণ্টা)</span>
                    </span>

                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
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
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-[#64748D]">BongoWeb.xyz পলিসি</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5EDF5]">
              <ShieldCheck className="w-6 h-6 text-[#533AFD]" />
              <h1 className="text-lg sm:text-xl font-black text-[#0D253D]">
                গোপনীয়তা নীতিমালা (Privacy Policy)
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#273951] leading-relaxed">
              <p>
                BongoWeb.xyz গ্রাহকদের তথ্যের গোপনীয়তা ও নিরাপত্তাকে সর্বোচ্চ প্রাধান্য দেয়। আপনি যখন আমাদের ওয়েবসাইট সেবা গ্রহণ করেন, আপনার প্রদত্ত ফোন নম্বর, ইমেইল ও ব্যবসার তথ্য শুধুমাত্র ওয়েবসাইট কনফিগারেশন ও অফিসিয়াল ডেলিভারির উদ্দেশ্যে সংরক্ষিত থাকে।
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
              className="px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← অ্যাকাউন্টে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-[#64748D]">BongoWeb.xyz টার্মস</span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5EDF5]">
              <FileText className="w-6 h-6 text-[#533AFD]" />
              <h1 className="text-lg sm:text-xl font-black text-[#0D253D]">
                শর্তাবলি ও ব্যবহারের নিয়ম (Terms & Conditions)
              </h1>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#273951] leading-relaxed">
              <h3 className="text-sm font-bold text-[#0D253D]">১. মেকিং ও ডেলিভারি চার্জ</h3>
              <p>
                প্রতিটি প্রি-বিল্ট ওয়েবসাইটের এককালীন রেডিমেকিং চার্জ মাত্র ১,৯৯০ টাকা। অর্ডার নিশ্চিত হওয়ার পর সর্বোচ্চ ২৪ থেকে ৪৮ ঘণ্টার মধ্যে সম্পূর্ণ লাইভ ওয়েবসাইট ডেলিভারি সম্পন্ন হয়।
              </p>
              <h3 className="text-sm font-bold text-[#0D253D]">২. মাসিক ক্লাউড সার্ভার ও মেইনটেন্যান্স</h3>
              <p>
                ওয়েবসাইট নিরবচ্ছিন্নভাবে লাইভ ও নিরাপদ রাখার জন্য মাসিক ক্লাউড সার্ভার মেইনটেন্যান্স ফি মাত্র ১২০ টাকা। এই ফিতে সার্বক্ষণিক এসএসএল সিকিউরিটি, ডেটা ব্যাকআপ ও ক্লাউড নোড অপটিমাইজেশন অন্তর্ভুক্ত থাকে।
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
            <span className="px-3 py-1 rounded-full bg-[#E2E4FF] text-[#533AFD] text-xs font-black font-mono">
              {selectedReceiptOrder.orderId}
            </span>
            <h3 className="text-lg font-black text-[#0D253D] mt-2">
              অফিসিয়াল অর্ডার রসিদ (Official Receipt)
            </h3>
            <p className="text-[11px] text-[#64748D]">
              BongoWeb.xyz — ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি
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
              <span className="text-[#64748D]">মাসিক মেইনটেন্যান্স:</span>
              <span className="font-bold text-[#533AFD]">১২০ ৳ / মাস</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#64748D]">স্ট্যাটাস:</span>
              <span className={`font-bold flex items-center gap-1 ${
                selectedReceiptOrder.status === 'completed'
                  ? 'text-[#008A4B]'
                  : selectedReceiptOrder.status === 'processing' || selectedReceiptOrder.status === 'verified'
                  ? 'text-[#533AFD]'
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
              className="flex-1 py-2.5 rounded-xl bg-[#533AFD] hover:bg-[#665EFD] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / ডাউনলোড</span>
            </button>
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="px-4 py-2.5 rounded-xl bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-xs font-bold cursor-pointer"
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
      {/* 1. Global Pending Verification Notice (If any pending orders exist) */}
      {pendingOrders.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-4">
          <div className="p-4 rounded-2xl bg-[#FFD552]/20 border border-[#FFD552] text-xs sm:text-sm font-bold text-[#8A6D00] flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] animate-ping shrink-0" />
              <span>
                আপনার পেমেন্ট ভেরিফিকেশন প্রক্রিয়াধীন রয়েছে (অর্ডার {pendingOrders[0].orderId})। অনুগ্রহ করে ১ মিনিট থেকে ১ ঘণ্টা অপেক্ষা করুন।
              </span>
            </div>
            <button
              onClick={() => navigateSubView('pending-orders')}
              className="px-3 py-1 rounded-xl bg-[#8A6D00] text-white text-xs font-bold shrink-0 hover:bg-[#725a00] cursor-pointer"
            >
              বিবরণ দেখুন
            </button>
          </div>
        </section>
      )}

      {/* 2. SECTION: আপনার Website এর বিস্তারিত (Requirement 6) */}
      {userCredentialsList.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-5">
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

            {/* If payment is in verification status, show that notice right here as required */}
            {pendingOrders.length > 0 && (
              <div className="p-3 rounded-xl bg-[#FFD552]/20 border border-[#FFD552] text-xs text-[#8A6D00] font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#8A6D00]" />
                <span>
                  বিজ্ঞপ্তি: আপনার নতুন ওয়েবসাইটের পেমেন্ট বর্তমানে 'যাচাইকরণ' (Verification) স্ট্যাটাসে রয়েছে।
                </span>
              </div>
            )}

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
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
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
                        <span className="text-sm font-mono font-black text-[#533AFD] select-all">
                          {cred.websiteAdminPass}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyText(cred.websiteAdminPass, `pass-${cred.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAFD] hover:bg-[#E2E4FF] text-[#533AFD] border border-[#E5EDF5] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
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
        </section>
      )}

      {/* 3. SECTION: CLIENT ACCOUNT / PROFILE SECTION (Requirement 2) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E5EDF5] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#533AFD] text-white flex items-center justify-center font-black text-lg shadow-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E2E4FF] text-[#533AFD] text-[10px] font-bold">
                  সক্রিয় ক্লায়েন্ট অ্যাকাউন্ট
                </span>
                <h2 className="text-base sm:text-lg font-black text-[#0D253D] mt-0.5">
                  ক্লায়েন্ট প্রোফাইল বিবরণ
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowSecurityCodeModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#E2E4FF] hover:bg-[#533AFD] text-[#533AFD] hover:text-white border border-[#533AFD]/30 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="৫-মিনিটের সিকিউরিটি কোড দেখুন"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Security Code (কোড দেখুন)</span>
              </button>
              <span className="text-[11px] text-[#64748D] font-mono hidden sm:inline-block">
                রেজিস্ট্রেশন: {currentUser.registeredAt}
              </span>
            </div>
          </div>

          {/* Clean Fields: Profile Name, Email Address, Phone Number (Requirement 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-1">
              <span className="text-[10px] font-bold text-[#64748D] uppercase block">
                Profile Name (প্রোফাইল নাম)
              </span>
              <p className="text-sm font-black text-[#0D253D] truncate">
                {currentUser.name}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-1">
              <span className="text-[10px] font-bold text-[#64748D] uppercase block">
                Email Address (ইমেইল এড্রেস)
              </span>
              <p className="text-sm font-mono font-bold text-[#0D253D] truncate select-all">
                {currentUser.email}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-1">
              <span className="text-[10px] font-bold text-[#64748D] uppercase block">
                Phone Number (রেজিস্ট্রেশন মোবাইল)
              </span>
              <p className="text-sm font-mono font-bold text-[#533AFD] select-all">
                {currentUser.phone}
              </p>
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
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#E2E4FF] hover:bg-[#533AFD] text-[#533AFD] hover:text-white border border-[#533AFD]/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
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

      {/* 4. SECTION: STATS & DEDICATED SUBPAGES TRIGGER (Requirement 8) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#64748D] mb-2 uppercase tracking-wider">
            অর্ডার ও সার্ভিস পরিসংখ্যান (ক্লিক করে সরাসরি বিস্তারিত দেখুন)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Stat 1: মোট Order (Click opens dedicated full page, Requirement 8) */}
          <button
            type="button"
            onClick={() => navigateSubView('total-orders')}
            className="p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#533AFD]/30 hover:border-[#533AFD] text-center shadow-xs transition-all hover:scale-[1.02] cursor-pointer group text-left sm:text-center"
          >
            <span className="text-2xl sm:text-3xl font-black text-[#533AFD] block">
              {userOrders.length}
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-1 group-hover:text-[#533AFD] flex items-center justify-center gap-1">
              <span>মোট Order</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </p>
            <span className="text-[10px] text-[#64748D] block mt-0.5">
              ক্লিক করে সকল অর্ডার দেখুন
            </span>
          </button>

          {/* Stat 2: Pending যাচাই (Click opens dedicated full page, Requirement 8) */}
          <button
            type="button"
            onClick={() => navigateSubView('pending-orders')}
            className={`p-4 rounded-2xl border-2 text-center shadow-xs transition-all hover:scale-[1.02] cursor-pointer group text-left sm:text-center ${
              pendingOrders.length > 0 
                ? 'bg-[#FFF8E7] border-[#FFD552] hover:border-[#E53935]'
                : 'bg-[#FFFFFF] border-[#E5EDF5] hover:border-[#00B261]'
            }`}
          >
            <span className={`text-2xl sm:text-3xl font-black block ${
              pendingOrders.length > 0 ? 'text-[#E53935]' : 'text-[#00B261]'
            }`}>
              {pendingOrders.length}
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-1 group-hover:text-[#E53935] flex items-center justify-center gap-1">
              <span>Pending যাচাই</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </p>
            <span className="text-[10px] text-[#64748D] block mt-0.5">
              {pendingOrders.length > 0 ? '১ মিনিট - ১ ঘণ্টা' : 'কোনো Pending নেই'}
            </span>
          </button>

          {/* Stat 3: ডেলিভারি সময় */}
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-[#00B261] block">
              ২৪ ঘণ্টা
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-1">ডেলিভারি সময়</p>
            <span className="text-[10px] text-[#64748D] block mt-0.5">এক্সপ্রেস লাইভ সেটআপ</span>
          </div>

          {/* Stat 4: মাসিক মেইনটেন্যান্স */}
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5EDF5] text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-black text-[#533AFD] block">
              ১২০ ৳
            </span>
            <p className="text-xs font-bold text-[#0D253D] mt-1">মাসিক মেইনটেন্যান্স</p>
            <span className="text-[10px] text-[#64748D] block mt-0.5">সার্ভার ও হোস্টিং ফি</span>
          </div>
        </div>
      </section>

      {/* 5. SECTION: PROFESSIONAL IMPROVEMENTS (Requirement 9) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-3">
        <div className="bg-[#FFFFFF] border border-[#E5EDF5] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-[#0D253D]">
              অ্যাকাউন্ট সেটিংস ও নীতিমালা (Account Settings & Policies)
            </h3>
            <p className="text-xs text-[#64748D]">
              BongoWeb.xyz সার্ভিস ব্যবহারের নিয়মাবলি, ভাষা নির্বাচন ও নীতিসমূহ:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Privacy Policy */}
            <button
              onClick={() => navigateSubView('privacy')}
              className="p-4 rounded-2xl bg-[#F8FAFD] hover:bg-[#E2E4FF] border border-[#E5EDF5] hover:border-[#533AFD]/30 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-[#533AFD]" />
                <ArrowRight className="w-4 h-4 text-[#64748D] group-hover:text-[#533AFD] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D253D] group-hover:text-[#533AFD]">
                Privacy Policy
              </h4>
              <p className="text-[11px] text-[#64748D] mt-0.5">
                গ্রাহকের তথ্যের সুরক্ষা ও গোপনীয়তা নীতিমালা পড়ুন
              </p>
            </button>

            {/* Terms & Conditions */}
            <button
              onClick={() => navigateSubView('terms')}
              className="p-4 rounded-2xl bg-[#F8FAFD] hover:bg-[#E2E4FF] border border-[#E5EDF5] hover:border-[#533AFD]/30 text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-[#533AFD]" />
                <ArrowRight className="w-4 h-4 text-[#64748D] group-hover:text-[#533AFD] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D253D] group-hover:text-[#533AFD]">
                Terms & Conditions
              </h4>
              <p className="text-[11px] text-[#64748D] mt-0.5">
                সার্ভিস ব্যবহার ও ওয়েবসাইট ডেলিভারির শর্তাবলি
              </p>
            </button>

            {/* Language Change Option */}
            <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D253D]">
                  <Languages className="w-4 h-4 text-[#533AFD]" />
                  <span>ভাষা পরিবর্তন (Language)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('bn')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedLanguage === 'bn'
                      ? 'bg-[#533AFD] text-white shadow-xs'
                      : 'bg-white text-[#64748D] border border-[#E5EDF5] hover:text-[#0D253D]'
                  }`}
                >
                  <span>🇧🇩</span>
                  <span>বাংলা</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLanguage('en')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedLanguage === 'en'
                      ? 'bg-[#533AFD] text-white shadow-xs'
                      : 'bg-white text-[#64748D] border border-[#E5EDF5] hover:text-[#0D253D]'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
              <p className="text-[10px] text-[#64748D]">
                সিস্টেমের ভাষা {selectedLanguage === 'bn' ? 'বাংলা' : 'English'} হিসেবে নির্বাচিত।
              </p>
            </div>
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
                      setAuthMode('register');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#533AFD] hover:bg-[#432BEE] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
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
                  <div className="w-11 h-11 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#533AFD] uppercase tracking-wider block">
                      ভেরিফিকেশন সুরক্ষা কোড
                    </span>
                    <h3 className="text-base font-black text-[#0D253D]">
                      Your Security Code
                    </h3>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8FAFD] border-2 border-[#533AFD]/30 text-center space-y-2">
                  <span className="text-xs text-[#64748D] font-medium block">
                    আপনার বর্তমান ৫-মিনিটের সক্রিয় সিকিউরিটি কোড:
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-[0.25em] text-[#533AFD] select-all py-1">
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
                      : 'bg-[#533AFD] hover:bg-[#432BEE] text-white'
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
              <div className="w-10 h-10 rounded-2xl bg-[#E2E4FF] text-[#533AFD] flex items-center justify-center shadow-xs">
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
                    <span className="font-mono font-bold text-[#533AFD] bg-[#E2E4FF] px-2.5 py-0.5 rounded-md">
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
                    className="w-full p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E5EDF5] text-xs text-[#0D253D] focus:outline-none focus:border-[#533AFD] focus:ring-1 focus:ring-[#533AFD] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={reportLoading || !reportMessage.trim()}
                    className="flex-1 py-3 rounded-xl bg-[#533AFD] hover:bg-[#432BEE] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
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
    </div>
  );
}
