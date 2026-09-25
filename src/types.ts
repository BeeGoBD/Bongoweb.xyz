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
