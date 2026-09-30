export type WizardStep = 1 | 2 | 3 | 4 | 5;

export type WebsiteCategory = 'all' | 'ecommerce' | 'restaurant' | 'blogging' | 'grocery' | 'corporate' | 'fashion' | 'portfolio';

export type SubscriptionPlanId = 'starter' | 'pro' | 'enterprise';

export interface WebsiteDemo {
  id: string;
  fourDigitCode: string; // Special character 4-digit code e.g. '#4821'
  title: string;
  englishTitle?: string;
  banglaTitle?: string;
  category: WebsiteCategory;
  categoryLabel: string;
  description: string;
  priceTag: string;
  demoUrl: string;
  badge?: string;
  accentColor: string;
  rating: number;
  ordersCount: string;
  previewImage: string;
  heroHeadline: string;
  features: string[];
  mockData: {
    heroSub: string;
    items: {
      name: string;
      price: string;
      tag?: string;
      image: string;
    }[];
  };
}

export interface PhotoMockup {
  id: string;
  fourDigitCode: string;
  title: string;
  description?: string;
  category: string;
  categoryKey: WebsiteCategory;
  domain: string;
  imageUrl: string;
  ratio: string;
  features: string[];
  colorTheme: string;
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
}

export interface ClientOrder {
  orderId: string; // e.g. '#BW-84920'
  demoCode: string;
  demoTitle: string;
  clientName: string;
  phone: string;
  email: string;
  companyName: string;
  domainOption: 'have_domain' | 'no_domain' | 'dont_know';
  customDomain?: string;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'upay';
  transactionId: string;
  makingCharge: number; // 1990
  monthlyCost: number; // 120
  status: 'pending' | 'processing' | 'completed' | 'verified' | 'cancelled';
  createdAt: string;
  screenshotName?: string;
  advanceAmount?: number;
  dueAmount?: number;
  paymentPhone?: string;
  businessName?: string;
  chosenDomain?: string;
  category?: string;
}

export interface WebsiteDeliveryCredentials {
  id: string;
  userPhone: string;
  websiteTitle: string;
  websiteCode: string;
  websiteAdminId: string;
  websiteAdminPass: string;
  notes?: string;
  deliveredAt: string;
}

export interface PasswordResetRequest {
  id: string;
  phone: string;
  requestedAt: string;
  status: 'pending' | 'reset' | 'rejected' | 'call_not_received';
  resolvedAt?: string;
  newPasswordAssigned?: string;
}

export interface AdminConfig {
  adminId: string;
  adminEntryPassword: string;
  adminActionPassword: string;
  masterKey: string;
}

export interface SupportChatMessage {
  id: string;
  sender: 'client' | 'admin';
  text: string;
  timestamp: string;
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
  expiresAt?: number; // timestamp in ms when 5-min inactivity expires
  isClosed?: boolean;
  additionalMinutesAdded?: number;
  messages: SupportChatMessage[];
}



