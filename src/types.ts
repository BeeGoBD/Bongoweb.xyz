export type WizardStep = 1 | 2 | 3 | 4 | 5;
export type WebsiteCategory = 'all' | 'ecommerce' | 'restaurant' | 'landing' | 'grocery' | 'blogging' | 'corporate' | 'fashion' | 'portfolio' | 'newspaper' | 'education' | 'services';
export type SubscriptionPlanId = 'starter' | 'pro' | 'enterprise' | 'custom';

export interface WebsiteDemoItem {
  name: string;
  price: string;
  tag?: string;
  image: string;
}

export interface WebsiteDemoMockData {
  heroSub: string;
  items: WebsiteDemoItem[];
}

export interface WebsiteDemo {
  id: string;
  fourDigitCode: string;
  title: string;
  englishTitle?: string;
  banglaTitle?: string;
  category: WebsiteCategory;
  categoryLabel?: string;
  description: string;
  priceTag: string;
  demoUrl: string;
  badge?: string;
  accentColor?: string;
  rating?: number;
  ordersCount?: string;
  previewImage: string;
  heroHeadline?: string;
  features?: string[];
  mockData: WebsiteDemoMockData;
  [key: string]: any;
}

export interface PhotoMockup {
  id: string;
  fourDigitCode: string;
  title: string;
  description?: string;
  category: string;
  categoryKey?: WebsiteCategory;
  domain?: string;
  imageUrl: string;
  ratio?: string;
  features: string[];
  colorTheme?: string;
  [key: string]: any;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  business: string;
  location: string;
  avatar: string;
  stars: number;
  highlight: string;
  quote: string;
  verified: boolean;
  date: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  bengaliName: string;
  tagline: string;
  type: string;
  color: string;
  gradient: string;
  accountType: string;
  accountNumber: string;
  feeInfo: string;
  iconType: 'bkash' | 'nagad' | 'rocket' | 'upay' | 'card' | 'bank';
}

export interface UserAccount {
  name: string;
  phone: string;
  email: string;
  password?: string;
  registeredAt: string;
  isRestricted?: boolean;
  clientId?: string;
  photoUrl?: string;
  username?: string;
  whatsapp?: string;
  numberVerified?: boolean;
  numberVerificationCallPending?: boolean;
  [key: string]: any;
}

export interface ClientOrder {
  id?: string;
  orderId: string;
  demoCode: string;
  demoTitle: string;
  clientName: string;
  phone: string;
  email: string;
  companyName: string;
  domainOption: 'have_domain' | 'no_domain' | 'dont_know';
  customDomain?: string;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'upay' | string;
  transactionId: string;
  makingCharge: number;
  monthlyCost: number;
  status: 'pending' | 'processing' | 'completed' | 'verified' | 'cancelled' | 'bin';
  createdAt: string;
  screenshotName?: string;
  advanceAmount?: number;
  dueAmount?: number;
  paymentPhone?: string;
  businessName?: string;
  chosenDomain?: string;
  category?: string;
  hasDeliveredCredentials?: boolean;
  deliveredAdminId?: string;
  deliveredAdminPass?: string;
  binnedAt?: string;
  originalStatus?: 'pending' | 'processing' | 'completed';
  [key: string]: any;
}

export interface WebsiteDeliveryCredentials {
  id: string;
  orderId?: string;
  userPhone: string;
  userEmail?: string;
  customerPhone?: string;
  customerEmail?: string;
  websiteTitle: string;
  websiteCode?: string;
  websiteAdminId: string;
  websiteAdminPass: string;
  adminUsername?: string;
  adminPassword?: string;
  adminUrl?: string;
  liveUrl?: string;
  notes?: string;
  deliveredAt: string;
  updatedAt?: number;
  [key: string]: any;
}

export interface PasswordResetRequest {
  id: string;
  phone: string;
  requestedAt: string;
  status: 'pending' | 'reset' | 'rejected' | 'call_not_received' | 'approved';
  resolvedAt?: string;
  approvedAt?: string;
  newPasswordAssigned?: string;
  userName?: string;
  oldEmail?: string;
  newEmail?: string;
  oldPhone?: string;
  newPhone?: string;
  changeType?: 'email' | 'phone' | 'both' | 'password';
  changeSummary?: string;
  tag?: string;
  reason?: string;
  type?: 'reset' | 'call_back';
  [key: string]: any;
}

export interface CallBackRequest {
  id: string;
  name: string;
  phone: string;
  reason: string;
  requestedAt: string;
  createdAt?: string;
  preferredTime?: string;
  status?: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  rejectedAt?: string;
  notes?: string;
  [key: string]: any;
}

export interface AdminConfig {
  adminId: string;
  adminEntryPassword: string;
  adminActionPassword: string;
  masterKey: string;
  [key: string]: any;
}

export interface SupportChatMessage {
  id: string;
  sender: 'client' | 'admin' | string;
  text: string;
  timestamp: string;
  [key: string]: any;
}

export interface SupportChatThread {
  userPhone: string;
  userName: string;
  userEmail?: string;
  language?: 'bn' | 'en';
  lastMessage: string;
  lastUpdated: string;
  unreadAdminCount: number;
  unreadClientCount: number;
  expiresAt?: number;
  isClosed?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  additionalMinutesAdded?: number;
  messages: SupportChatMessage[];
  [key: string]: any;
}

export interface UserReport {
  id: string;
  clientIdentifier: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  category?: 'technical' | 'order' | 'billing' | 'domain' | 'general' | string;
  subject?: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'resolved';
  adminReply?: string;
  adminRepliedAt?: string;
  resolvedAt?: string;
  [key: string]: any;
}

export interface BrandLogoConfig {
  logoType: 'image' | 'text';
  imageUrl?: string;
  imageName?: string;
  imageSizePx?: number;
  showBrandTextWithImage?: boolean;
  typedLogoText: string;
  typedSubtitle?: string;
  textGradientTheme: 'royal' | 'violet' | 'sunset' | 'emerald' | 'monochrome';
  textFontSizePx?: number;
  textLetterSpacing?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface EmailRecoveryRequest {
  id: string;
  gmailIssue: 'forgot' | 'disabled' | 'no_access' | 'others';
  gmailIssueLabel: string;
  customReason?: string;
  purchasedBefore: boolean;
  rememberPhone: boolean;
  phoneNumber: string;
  createdAt: string;
  status: 'pending' | 'completed';
  decisionNote?: string;
  decisionAt?: string;
  [key: string]: any;
}
