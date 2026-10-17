import { WebsiteDemo, PhotoMockup, Testimonial, PaymentMethod } from '../types';

export const WEBSITE_DEMOS: WebsiteDemo[] = [
  {
    id: 'ecom-1',
    fourDigitCode: '#2085',
    title: 'Modern Shop',
    englishTitle: 'Modern Shop',
    banglaTitle: 'মডার্ন শপ — ই-কমার্স স্টোর',
    category: 'ecommerce',
    categoryLabel: '🛍️ E-Commerce',
    description: 'High-converting modern online store for your products with automated checkout, courier integration, and stock tracking.',
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'modernshop.bongoweb.site',
    badge: 'Popular Bestseller',
    accentColor: 'from-purple-500/20 to-purple-500/5',
    rating: 4.9,
    ordersCount: '240+ orders/week',
    previewImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Premium Gadgets & Modern Lifestyle Store',
    features: ['Instant Checkout', 'Courier Tracking API', 'bKash/Nagad Auto', 'Inventory Sync'],
    mockData: {
      heroSub: '100% genuine products with official warranty and lightning-fast courier delivery.',
      items: [
        { name: 'Wireless Active Noise-Canceling Earbuds', price: '1,650 BDT', tag: 'Sale', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80' },
        { name: 'Ultra Smartwatch Series 8 Pro', price: '2,190 BDT', tag: 'Top Rated', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' },
        { name: 'Fast-Charging Powerbank 20,000 mAh', price: '1,100 BDT', image: 'https://images.unsplash.com/photo-1609081219090-a6d8173087ec?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'rest-1',
    fourDigitCode: '#1042',
    title: 'Foodie Cafe',
    englishTitle: 'Foodie Cafe & Fast Food',
    banglaTitle: 'ফুডি ক্যাফে — রেস্তোরাঁ ও ফাস্ট ফুড',
    category: 'restaurant',
    categoryLabel: '🍔 Restaurant & Fast Food',
    description: 'Burger, pizza, delicious food menu, table reservation, online orders & takeaway delivery.',
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'foodiecafe.bongoweb.site',
    badge: 'Trending Choice',
    accentColor: 'from-amber-500/20 to-amber-500/5',
    rating: 4.9,
    ordersCount: '150+ orders/day',
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Artisan Flavors & Memorable Dining Experience',
    features: ['Digital QR Menu', 'Table Booking System', 'Home Delivery Sync', 'Instant Bill Pay'],
    mockData: {
      heroSub: 'Prepared with freshest ingredients, authentic recipes, and chef specialty platters.',
      items: [
        { name: 'Special Grilled Platter Combo (1:2)', price: '650 BDT', tag: 'Chef Choice', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80' },
        { name: 'Artisan Smoked Burger & Fries', price: '380 BDT', tag: 'Popular', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80' },
        { name: 'Signature Hazelnut Iced Frappe', price: '220 BDT', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'landing-1',
    fourDigitCode: '#3091',
    title: 'Landing Page',
    englishTitle: 'Landing Page',
    banglaTitle: 'ল্যান্ডিং পেজ — হাই কনভার্সন সেলস পেজ',
    category: 'landing',
    categoryLabel: '🚀 Landing Page',
    description: 'High converting landing page for single product sales, marketing campaign, and instant customer leads.',
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'landing.bongoweb.site',
    badge: 'High Conversion',
    accentColor: 'from-purple-500/20 to-purple-500/5',
    rating: 4.9,
    ordersCount: '240+ campaigns',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'High-Converting Sales Landing Page for Your Brand',
    features: ['Instant Lead Capture', 'Fast 1-Page Checkout', 'AdSense & Pixel Ready', 'Mobile Optimized'],
    mockData: {
      heroSub: 'Maximize your sales conversions with focused product showcase and streamlined order forms.',
      items: [
        { name: 'Flagship Single Product Promotion Kit', price: 'Special Offer', tag: 'Top Seller', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80' },
        { name: 'Premium Conversion Booster Bundle', price: 'Featured', tag: 'High ROI', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'groc-1',
    fourDigitCode: '#4150',
    title: 'Fresh Mart',
    englishTitle: 'Grocery Shop',
    banglaTitle: 'ফ্রেশ মার্ট — গ্রোসারি শপ',
    category: 'grocery',
    categoryLabel: '🛒 Grocery Shop',
    description: 'Everyday essentials delivered fast. Features weight-based pricing, area express delivery, and instant checkout.',
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'freshmart.bongoweb.site',
    badge: 'Daily Essential',
    accentColor: 'from-emerald-500/20 to-emerald-500/5',
    rating: 4.9,
    ordersCount: '320+ deliveries/day',
    previewImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Farm-Fresh Vegetables, Organic Fruits & Daily Groceries',
    features: ['Weight-based Calculator', 'Same-Day Express Delivery', '1-Click Fast Reorder', 'Cash or Digital Pay'],
    mockData: {
      heroSub: 'Handpicked daily produce directly from certified organic farms to your kitchen.',
      items: [
        { name: 'Organic Farm Fresh Egg Tray (30 pcs)', price: '380 BDT', tag: 'Daily Deal', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=80' },
        { name: 'Pure Forest Raw Honey (1kg Bottle)', price: '950 BDT', tag: 'Pure Natural', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80' },
        { name: 'Premium Jasmine Aromatic Rice (5kg)', price: '480 BDT', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'ecom-2',
    fourDigitCode: '#5218',
    title: 'Style Studio',
    englishTitle: 'Style Studio',
    banglaTitle: 'স্টাইল স্টুডিও — ফ্যাশন ও বুটিক',
    category: 'ecommerce',
    categoryLabel: '🛍️ E-Commerce',
    description: 'Contemporary fashion boutique & designer apparel storefront with size selectors and WhatsApp direct order.',
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'stylestudio.bongoweb.site',
    badge: 'Fashion Trend',
    accentColor: 'from-pink-500/20 to-pink-500/5',
    rating: 5.0,
    ordersCount: '110+ sales/day',
    previewImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Curated Elegance & Contemporary Fashion Collection',
    features: ['Interactive Size Guide', 'Color & Fabric Variants', 'Fast bKash Checkout', 'VIP Customer Discount'],
    mockData: {
      heroSub: 'Artisan handloom cotton and celebratory designer clothing collection.',
      items: [
        { name: 'Royal Embroidered Festive Kurti', price: '2,450 BDT', tag: 'Exclusive', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80' },
        { name: 'Designer Traditional Silk Saree', price: '4,200 BDT', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'rest-2',
    fourDigitCode: '#6372',
    title: 'Brew Cafe',
    englishTitle: 'Brew Cafe',
    banglaTitle: 'ব্রু ক্যাফে — কফি ও বেকারি',
    category: 'restaurant',
    categoryLabel: '🍽️ Restaurant',
    description: 'Cozy artisan coffee shop, handcrafted bakery menu, and quick takeaway ordering system.',
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'brewcafe.bongoweb.site',
    badge: 'Cozy Spot',
    accentColor: 'from-amber-600/20 to-amber-600/5',
    rating: 4.8,
    ordersCount: '95+ cups/day',
    previewImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Fresh Roasted Specialty Beans & Artisanal Bakery',
    features: ['Pre-Order Takeaway', 'QR Table Scanner', 'Loyalty Coffee Card', 'Online Dessert Menu'],
    mockData: {
      heroSub: 'Single-origin roasted beans brewed to perfection with fresh oven-baked pastries.',
      items: [
        { name: 'Spanish Hazelnut Iced Latte', price: '250 BDT', tag: 'Signature', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80' },
        { name: 'Belgian Chocolate Waffle with Cream', price: '320 BDT', tag: 'Hot', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  }
];

export const PHOTO_MOCKUPS: PhotoMockup[] = [
  {
    id: 'mock-1',
    fourDigitCode: '#2011',
    title: 'Premium Restaurant & Cafe Layout',
    category: 'Restaurant & Food',
    categoryKey: 'restaurant',
    domain: 'sultandine.com',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    ratio: '16:9',
    features: ['High-Resolution Food Hero', '1-Click Menu Browsing', 'Mobile Optimized UI'],
    colorTheme: '#FFFFFF'
  },
  {
    id: 'mock-2',
    fourDigitCode: '#2012',
    title: 'Gourmet Bistro & Fast Food Showcase',
    category: 'Restaurant & Food',
    categoryKey: 'restaurant',
    domain: 'dhakabiryani.com',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    ratio: '16:9',
    features: ['Digital Food Menu', 'Table Reservations', 'Online Order Slots'],
    colorTheme: '#FFFFFF'
  },
  {
    id: 'mock-3',
    fourDigitCode: '#2021',
    title: 'Exclusive Fashion & Apparel Boutique',
    category: 'Fashion & Boutique',
    categoryKey: 'ecommerce',
    domain: 'auraboutique.com',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    ratio: '16:9',
    features: ['Instagram Grid Feed', 'Size & Color Filters', 'Fast Checkout Flow'],
    colorTheme: '#FFFFFF'
  },
  {
    id: 'mock-4',
    fourDigitCode: '#2022',
    title: 'Smart Tech & Gadgets E-Commerce',
    category: 'Tech & Electronics',
    categoryKey: 'ecommerce',
    domain: 'techvaly.com',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    ratio: '16:9',
    features: ['Specification Tables', 'Slide-Out Cart Drawer', 'Cash on Delivery Option'],
    colorTheme: '#FFFFFF'
  },
  {
    id: 'mock-5',
    fourDigitCode: '#2031',
    title: 'Modern Tech Magazine & News Hub',
    category: 'News & Magazine',
    categoryKey: 'blogging',
    domain: 'techbangla.com',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    ratio: '16:9',
    features: ['Categorized Articles', 'Dark & Light Mode', 'Newsletter Subscription'],
    colorTheme: '#FFFFFF'
  },
  {
    id: 'mock-6',
    fourDigitCode: '#2032',
    title: 'Lifestyle, Travel & Personal Journal',
    category: 'Lifestyle & Travel',
    categoryKey: 'blogging',
    domain: 'traveljournal.com',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    ratio: '16:9',
    features: ['Photo Gallery Highlights', 'Reading Time Estimator', 'Social Share Buttons'],
    colorTheme: '#FFFFFF'
  },
  {
    id: 'mock-7',
    fourDigitCode: '#2041',
    title: 'Natural Honey & Organic Store',
    category: 'Grocery & Organic',
    categoryKey: 'grocery',
    domain: 'pureorganic.com',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    ratio: '16:9',
    features: ['Ingredient Transparency', 'Lab Test Certificates', '1-Click Buy Now'],
    colorTheme: '#FFFFFF'
  },
  {
    id: 'mock-8',
    fourDigitCode: '#2042',
    title: 'Farm Fresh Produce & Supermarket',
    category: 'Grocery & Organic',
    categoryKey: 'grocery',
    domain: 'dailyfresh.com',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    ratio: '16:9',
    features: ['Live Stock Counters', 'Dynamic Weight Cart', 'Fast Delivery Tracker'],
    colorTheme: '#FFFFFF'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Tanvir Ahmed',
    role: 'Founder',
    business: 'Dhaka Blend Cafe & Roastery',
    location: 'Dhanmondi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    highlight: 'Could not believe such a premium website was possible at this price!',
    quote: 'We ordered our website through BongoWeb. Within 24 hours, the full site was live. Customers order directly from our digital menu, and our sales grew by 30%.',
    verified: true,
    date: '3 days ago'
  },
  {
    id: 'rev-2',
    name: 'Farhana Islam',
    role: 'Proprietor',
    business: 'Rainbow Boutique & Fashion House',
    location: 'Chittagong',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    highlight: 'Affordable monthly cloud fee with peaceful server reliability!',
    quote: 'We used to pay other agencies hefty annual fees. Now we manage our active cloud node seamlessly. Uploading new dresses and changing prices takes seconds without coding.',
    verified: true,
    date: '1 week ago'
  },
  {
    id: 'rev-3',
    name: 'Sayedur Rahman',
    role: 'Owner',
    business: 'Forest Honey & Pure Organics',
    location: 'Sylhet',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    highlight: 'Managed everything easily with simple video tutorials',
    quote: 'I had zero technical background. Their friendly video walkthroughs and 24/7 WhatsApp assistance made running the online shop a total breeze.',
    verified: true,
    date: '2 weeks ago'
  },
  {
    id: 'rev-4',
    name: 'Engr. Rashedul Hassan',
    role: 'Managing Director',
    business: 'SmartWay Technologies',
    location: 'Rajshahi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    stars: 5,
    highlight: 'Exact mirror of the live interactive demo',
    quote: 'What we saw in the showcase is exactly what was delivered for our brand. Our custom logo and domain were integrated flawlessly within a day.',
    verified: true,
    date: '2 weeks ago'
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bkash',
    name: 'bKash',
    bengaliName: 'bKash',
    tagline: 'Merchant & Personal Direct Payment',
    type: 'Mobile Wallet',
    color: '#FFFFFF',
    gradient: 'from-white/10 to-white/5',
    accountType: 'Merchant Payment & Send Money',
    accountNumber: '01700-000000',
    feeInfo: 'Instant verification • 0% platform fee',
    iconType: 'bkash'
  },
  {
    id: 'nagad',
    name: 'Nagad',
    bengaliName: 'Nagad',
    tagline: 'Fast Mobile Payment & Monthly Recharge',
    type: 'Mobile Banking',
    color: '#FFFFFF',
    gradient: 'from-white/10 to-white/5',
    accountType: 'Merchant & Instant QR Pay',
    accountNumber: '01800-000000',
    feeInfo: 'Instant receipt & automated tracking',
    iconType: 'nagad'
  },
  {
    id: 'rocket',
    name: 'Rocket',
    bengaliName: 'Rocket',
    tagline: 'DBBL Secure Digital Wallet',
    type: 'Bank Wallet',
    color: '#FFFFFF',
    gradient: 'from-white/10 to-white/5',
    accountType: 'Dutch-Bangla Rocket Account',
    accountNumber: '01900-000000-7',
    feeInfo: 'Secure regulated banking channel',
    iconType: 'rocket'
  },
  {
    id: 'upay',
    name: 'Upay',
    bengaliName: 'Upay',
    tagline: 'UCB Digital Financial Service',
    type: 'Mobile Wallet',
    color: '#FFFFFF',
    gradient: 'from-white/10 to-white/5',
    accountType: 'UCB Upay Business Pay',
    accountNumber: '01600-000000',
    feeInfo: 'Easy monthly server billing',
    iconType: 'upay'
  },
  {
    id: 'card',
    name: 'Cards',
    bengaliName: 'Cards',
    tagline: 'Visa, Mastercard & AMEX',
    type: 'Debit / Credit Card',
    color: '#FFFFFF',
    gradient: 'from-white/10 to-white/5',
    accountType: 'Any Local or International Card',
    accountNumber: 'SSL Secure Gateway',
    feeInfo: '256-bit encrypted checkout gateway',
    iconType: 'card'
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    bengaliName: 'Bank Transfer',
    tagline: 'Direct Electronic Wire Transfer',
    type: 'Bank Account',
    color: '#FFFFFF',
    gradient: 'from-white/10 to-white/5',
    accountType: 'Corporate Bank Account',
    accountNumber: 'BongoWeb Technologies Ltd.',
    feeInfo: 'Official electronic invoice receipt',
    iconType: 'bank'
  }
];

export const PRICING_PACKAGES = [
  {
    id: 'pkg-starter',
    name: 'Starter Package',
    subtitle: 'Best for new entrepreneurs, small businesses & startups',
    oneTimeFee: '999 BDT',
    monthlyRenew: '120 BDT',
    popular: true,
    badge: 'Most Popular',
    color: 'from-white/20 to-white/5',
    features: [
      'Choice of any 1 ready responsive website demo',
      'Full setup with your brand name, logo, and colors',
      'Free secure live subdomain (yourbrand.bongoweb.site)',
      'Unlimited products, services, and menu items',
      '100% mobile, tablet, and desktop responsive design',
      'Step-by-step video training & operating tutorial',
      'Lifetime website ownership with one-time setup fee',
      'Affordable 120 BDT/mo cloud server upkeep',
      '24/7 priority customer support on WhatsApp'
    ]
  },
  {
    id: 'pkg-pro',
    name: 'Business Pro',
    subtitle: 'Designed for scaling e-commerce stores and retail brands',
    oneTimeFee: '1,499 BDT',
    monthlyRenew: '250 BDT',
    popular: false,
    badge: 'High Conversion',
    color: 'from-white/20 to-white/5',
    features: [
      'All Starter Package features included',
      'Free custom domain connection & cloud hosting included',
      'Direct online payment gateway integration (bKash, Nagad, etc.)',
      'Facebook Pixel & Google Analytics conversion tracking',
      'Automated SMS order notification gateway',
      'Inventory stock, profit & sales reporting dashboard',
      'High-speed cloud server with dedicated cache (250 BDT/mo)',
      'Priority VIP support and automated weekly backups'
    ]
  },
  {
    id: 'pkg-enterprise',
    name: 'Premium Enterprise',
    subtitle: 'For established brands, chains, and multi-branch companies',
    oneTimeFee: '2,499 BDT',
    monthlyRenew: '399 BDT',
    popular: false,
    badge: 'All-In-One',
    color: 'from-white/20 to-white/5',
    features: [
      'All Business Pro features included',
      'Custom bespoke UI and tailor-made layout design',
      'Courier automated parcel tracking & booking API',
      'Customer accounts & loyalty reward point system',
      'SEO optimized Google search ranking structure',
      'Dedicated account manager with 1-on-1 consultation',
      'High-capacity dedicated cloud server node (399 BDT/mo)',
      'Live phone call, AnyDesk, and instant remote support'
    ]
  }
];

export const SUPPORT_FAQS = [
  {
    q: 'Why is there a small monthly server fee?',
    a: 'To ensure your website stays online 24 hours a day, 365 days a year without downtime, the small monthly fee covers cloud server hosting, database infrastructure, daily backups, and SSL security renewals.'
  },
  {
    q: 'Can I connect my own custom domain?',
    a: 'Yes, absolutely! You can connect your existing domain for free at any time, or get our free domain and cloud hosting included with your package.'
  },
  {
    q: 'I have no coding or technical experience. Can I manage this?',
    a: '100% yes! Our admin system is designed for everyday business owners. Uploading a product or changing prices is as simple as making a social media post, backed by our video walkthroughs.'
  },
  {
    q: 'How fast will my website be live after placing an order?',
    a: 'Once you choose your design and provide your details, our team configures and launches your fully live website within 12 to 24 hours.'
  }
];
