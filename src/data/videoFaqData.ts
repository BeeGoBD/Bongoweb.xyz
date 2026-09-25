export interface VideoFaqItem {
  id: string;
  code: string;
  category: 'delivery' | 'pricing' | 'control' | 'domain' | 'tech';
  categoryLabel: string;
  question: string;
  duration: string;
  videoPoster: string;
  videoSrc?: string;
  headline: string;
  summary: string;
  keyPoints: string[];
  viewsCount: string;
  speaker: string;
}

export const VIDEO_FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions', icon: 'Sparkles' },
  { id: 'delivery', label: 'Launch & Delivery', icon: 'Clock' },
  { id: 'pricing', label: 'Pricing & Upkeep', icon: 'CreditCard' },
  { id: 'control', label: 'Mobile Control', icon: 'Smartphone' },
  { id: 'domain', label: 'Domain & Lifetime', icon: 'Globe' },
  { id: 'tech', label: 'Security & Support', icon: 'ShieldCheck' },
];

export const VIDEO_FAQ_ITEMS: VideoFaqItem[] = [
  {
    id: 'vfaq-1',
    code: '#FAQ-01',
    category: 'delivery',
    categoryLabel: 'Launch & Delivery',
    question: 'How long does website delivery take and what details do I need to provide?',
    duration: '1:25 min',
    videoPoster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    headline: 'Live Website Delivery in Just 24 Hours',
    summary: 'When placing an order, simply provide your business name, logo (if any), and phone number. Our engineering team will configure and deliver your full live website within 24 hours.',
    keyPoints: [
      'No technical files needed — just share your basic business info',
      'Full live demo & dashboard walkthrough provided within 24 hours',
      'Our team connects directly via phone and WhatsApp to complete setup'
    ],
    viewsCount: '3.4k views',
    speaker: 'Technical Lead'
  },
  {
    id: 'vfaq-2',
    code: '#FAQ-02',
    category: 'pricing',
    categoryLabel: 'Pricing & Server',
    question: 'After the one-time setup fee, what is the low monthly cloud fee for?',
    duration: '1:40 min',
    videoPoster: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    headline: '100% Transparent Pricing: Lifetime Ownership with Zero Hidden Fees',
    summary: 'The one-time setup fee covers complete website design and development under your name. The low monthly cloud fee covers high-speed servers, database uptime, automatic daily backups, and SSL certificates.',
    keyPoints: [
      'No expensive annual renewal surprises',
      'Includes high-performance cloud hosting and automated SSL certificate',
      'Flexible digital payment options with instant receipt'
    ],
    viewsCount: '4.8k views',
    speaker: 'Server Admin'
  },
  {
    id: 'vfaq-3',
    code: '#FAQ-03',
    category: 'control',
    categoryLabel: 'Mobile Control',
    question: 'Can I manage my entire website using only a smartphone without a computer?',
    duration: '1:15 min',
    videoPoster: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    headline: 'Manage Products, Orders & Prices Directly From Your Phone',
    summary: 'Every website comes with an intuitive, 100% mobile-friendly admin control panel. It is as simple to manage as uploading a photo on social media.',
    keyPoints: [
      'Snap photos with your phone camera and publish new items in 2 minutes',
      'Real-time order notifications and instant alerts',
      'Zero coding or technical knowledge required'
    ],
    viewsCount: '5.1k views',
    speaker: 'Product Designer'
  },
  {
    id: 'vfaq-4',
    code: '#FAQ-04',
    category: 'domain',
    categoryLabel: 'Domain & Lifetime',
    question: 'Can I connect my own custom domain or do you provide one for free?',
    duration: '1:30 min',
    videoPoster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    headline: 'Full Freedom: Custom Domain (.com / .net) or Free Subdomain',
    summary: 'If you already own a custom domain, we connect it for free with one click. We also provide an instant live secure subdomain so your website works right away.',
    keyPoints: [
      'Free DNS connection for any custom domain you own',
      'Lifetime free SSL security certificate (green padlock)',
      'Our team handles all technical DNS configurations for you'
    ],
    viewsCount: '2.9k views',
    speaker: 'Network Engineer'
  },
  {
    id: 'vfaq-5',
    code: '#FAQ-05',
    category: 'tech',
    categoryLabel: 'Security & Support',
    question: 'How do I get help if I encounter an issue with my website?',
    duration: '1:10 min',
    videoPoster: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    headline: '24/7 Continuous Server Monitoring & Dedicated WhatsApp Support',
    summary: 'Every customer gets direct access to our technical support team. For any questions or updates, message or call us anytime for fast resolution.',
    keyPoints: [
      'Automated cloud backups — zero risk of data loss',
      '99.9% uptime enterprise-grade cloud server infrastructure',
      'Friendly and responsive one-on-one customer assistance'
    ],
    viewsCount: '3.8k views',
    speaker: 'Head of Support'
  },
  {
    id: 'vfaq-6',
    code: '#FAQ-06',
    category: 'pricing',
    categoryLabel: 'Payment Gateway',
    question: 'How do customer payments from my website reach my bank or wallet?',
    duration: '1:35 min',
    videoPoster: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    headline: 'Customer Payments Go Directly to Your Personal or Merchant Account',
    summary: 'When customers pay on your website, funds go directly to your personal or business account without intermediaries or platform commission cuts.',
    keyPoints: [
      'Supports Cash on Delivery (COD) and direct online payment options',
      'Funds deposit straight into your account with 0% platform commissions',
      'Automatic digital invoice generation upon order placement'
    ],
    viewsCount: '4.2k views',
    speaker: 'Payment Specialist'
  }
];
