import { WebsiteDemo, PhotoMockup, Testimonial, PaymentMethod } from '../types';

export const WEBSITE_DEMOS: WebsiteDemo[] = [
  {
    id: 'rest-1',
    fourDigitCode: '#1042',
    title: '#1042 Sultan Dine — Premium Dining & Biryani House',
    banglaTitle: '#1042 Sultan Dine — Premium Dining & Biryani House',
    category: 'restaurant',
    categoryLabel: '🍽️ Restaurant',
    description: 'Complete premium catering and restaurant website with online table booking, special deals, and food ordering system.',
    priceTag: 'Starts at 999 BDT',
    demoUrl: 'sultandine.bongoweb.site',
    badge: 'Popular Bestseller',
    accentColor: 'from-amber-500 to-orange-600',
    rating: 4.9,
    ordersCount: '120+ orders/day',
    previewImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Authentic Traditional Flavors & Premium Dine-In Experience',
    features: ['Online Food Menu', 'Table Reservation', 'Instant Digital Payment', 'Order Tracker'],
    mockData: {
      heroSub: 'Prepared with pure butter oil and aromatic saffron, royal biryani platters and special beverages.',
      items: [
        { name: 'Special Mutton Biryani Platter (1:1)', price: '450 BDT', tag: 'Chef Choice', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=500&q=80' },
        { name: 'Chicken Roast & Saffron Rice Combo', price: '320 BDT', tag: 'Popular', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=500&q=80' },
        { name: 'Traditional Spiced Yogurt Beverage (1L)', price: '180 BDT', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80' },
        { name: 'Royal Pistachio Pudding & Sweet Curd', price: '120 BDT', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'ecom-1',
    fourDigitCode: '#2085',
    title: '#2085 GadgetZone — Smart Tech & Electronics Store',
    banglaTitle: '#2085 GadgetZone — Smart Tech & Electronics Store',
    category: 'ecommerce',
    categoryLabel: '🛍️ E-Commerce',
    description: 'High-converting online store with inventory stock tracking, automated checkout, courier integration, and SMS alerts.',
    priceTag: 'Starts at 999 BDT',
    demoUrl: 'gadgetzone.bongoweb.site',
    badge: 'High Converting',
    accentColor: 'from-blue-600 to-indigo-600',
    rating: 4.8,
    ordersCount: '210+ sales/week',
    previewImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Original Smart Gadgets & Premium Audio Accessories',
    features: ['Category Dropdown', 'Courier Tracking API', 'Warranty Card Printing', 'Customer Dashboard'],
    mockData: {
      heroSub: '100% genuine products with official brand warranty and lightning-fast delivery.',
      items: [
        { name: 'Wireless Active Noise-Canceling Earbuds', price: '1,650 BDT', tag: 'Sale', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80' },
        { name: 'Ultra Smartwatch Series 8 Pro', price: '2,190 BDT', tag: 'Top Rated', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' },
        { name: 'Fast-Charging Powerbank 20,000 mAh', price: '1,100 BDT', image: 'https://images.unsplash.com/photo-1609081219090-a6d8173087ec?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'blog-1',
    fourDigitCode: '#3091',
    title: '#3091 TechVibe — Technology News & Gadget Reviews',
    banglaTitle: '#3091 TechVibe — Technology News & Gadget Reviews',
    category: 'blogging',
    categoryLabel: '📰 Blog & Media',
    description: 'Modern tech news, reviews, categorized article archives, newsletter subscription, and social media optimized portal.',
    priceTag: 'Starts at 999 BDT',
    demoUrl: 'techvibe.bongoweb.site',
    badge: 'Trending Media',
    accentColor: 'from-indigo-600 to-violet-700',
    rating: 4.9,
    ordersCount: '45k readers/mo',
    previewImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Latest Tech Trends, In-Depth Gadget Reviews & Insights',
    features: ['Categorized Articles', 'Newsletter Subscription', 'Ad Placement Manager', 'Auto Social Share'],
    mockData: {
      heroSub: 'Daily technology insights, freelance career guides, and hands-on smartphone comparisons in one place.',
      items: [
        { name: 'Top Budget Smartphones of 2026: Comprehensive Review', price: 'Free Read', tag: 'Hot Topic', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80' },
        { name: 'Top 5 AI Tools to Supercharge Your Remote Productivity', price: 'Guide', tag: 'Trending', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80' },
        { name: 'Cybersecurity 101: Essential Habits to Keep Passwords Safe', price: 'Security', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'groc-1',
    fourDigitCode: '#4150',
    title: '#4150 Pure Valley — Organic Honey & Farm Groceries',
    banglaTitle: '#4150 Pure Valley — Organic Honey & Farm Groceries',
    category: 'grocery',
    categoryLabel: '🌿 Grocery & Organic',
    description: 'Trusted online shop for raw forest honey, farm butter ghee, cold-pressed oils, and 100% natural organic food items.',
    priceTag: 'Starts at 999 BDT',
    demoUrl: 'purevalley.bongoweb.site',
    badge: '100% Organic',
    accentColor: 'from-emerald-600 to-teal-700',
    rating: 4.9,
    ordersCount: '150+ jars/week',
    previewImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Pure, Natural & Chemical-Free Food for a Healthier Lifestyle',
    features: ['Weight-based Variants', 'Lab Certificate Gallery', '1-Click Fast Order', 'Cash on Delivery'],
    mockData: {
      heroSub: 'Completely chemical-free, farm-fresh quality with rigorous purity certification.',
      items: [
        { name: 'Raw Natural Wildflower Honey (1kg)', price: '950 BDT', tag: 'Pure Natural', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80' },
        { name: 'Grass-Fed Cow Clarified Butter Ghee (500g)', price: '750 BDT', tag: 'Traditional', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80' },
        { name: 'Cold-Pressed Pure Virgin Mustard Oil', price: '320 BDT', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'ecom-2',
    fourDigitCode: '#5218',
    title: '#5218 Aura Heritage — Designer Boutique & Fashion Store',
    banglaTitle: '#5218 Aura Heritage — Designer Boutique & Fashion Store',
    category: 'ecommerce',
    categoryLabel: '🛍️ E-Commerce',
    description: 'Festive and wedding apparel showcase, interactive size charts, direct WhatsApp cart, and online payment options.',
    priceTag: 'Starts at 999 BDT',
    demoUrl: 'auraheritage.bongoweb.site',
    badge: 'Trending Choice',
    accentColor: 'from-pink-500 to-rose-600',
    rating: 5.0,
    ordersCount: '85+ orders/day',
    previewImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Elegance Redefined in Premium Designer Apparel',
    features: ['Size & Color Selectors', 'Instant Checkout', 'Instagram & Social Feeds', 'VIP Discount Coupons'],
    mockData: {
      heroSub: '100% premium handloom cotton and artisan woven festive collection.',
      items: [
        { name: 'Royal Embroidered Festive Tunic', price: '2,850 BDT', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80' },
        { name: 'Traditional Hand-Woven Silk Saree', price: '4,200 BDT', tag: 'Exclusive', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80' },
        { name: 'Premium Semi-Stitched Designer Kurti', price: '1,450 BDT', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'rest-2',
    fourDigitCode: '#6372',
    title: '#6372 Chai & Roast — Artisan Cafe & Specialty Bakery',
    banglaTitle: '#6372 Chai & Roast — Artisan Cafe & Specialty Bakery',
    category: 'restaurant',
    categoryLabel: '🍽️ Restaurant',
    description: 'Cafe lounge menu, signature shakes, fresh desserts, and artisanal coffee ordering system with digital QR scan.',
    priceTag: 'Starts at 999 BDT',
    demoUrl: 'chairoast.bongoweb.site',
    badge: 'Popular Spot',
    accentColor: 'from-amber-700 to-yellow-800',
    rating: 4.7,
    ordersCount: '70+ orders/day',
    previewImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Fresh Roasted Beans & Cozy Artisan Cafe Ambience',
    features: ['QR Code Digital Menu', 'Take-Away Pre-Orders', 'Loyalty Rewards Program', 'Private Event Booking'],
    mockData: {
      heroSub: 'Freshly roasted single-origin coffee beans and handcrafted bakery treats.',
      items: [
        { name: 'Spanish Hazelnut Iced Latte', price: '250 BDT', tag: 'Signature', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80' },
        { name: 'Belgian Chocolate Waffle with Cream', price: '320 BDT', tag: 'Hot', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=500&q=80' },
        { name: 'Flaky Golden Butter Croissant', price: '180 BDT', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'blog-2',
    fourDigitCode: '#7481',
    title: '#7481 Perspective — Business, Career & Leadership Magazine',
    banglaTitle: '#7481 Perspective — Business, Career & Leadership Magazine',
    category: 'blogging',
    categoryLabel: '📰 Blog & Media',
    description: 'Modern online publication featuring business case studies, career advice, and inspirational founder stories.',
    priceTag: 'Starts at 999 BDT',
    demoUrl: 'perspective.bongoweb.site',
    badge: 'Editors Choice',
    accentColor: 'from-blue-700 to-indigo-800',
    rating: 4.8,
    ordersCount: '28k readers',
    previewImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Inspiring Stories of Entrepreneurship and Business Growth',
    features: ['Author Profiles', 'Bookmark Articles', 'Reading Time Counter', 'Community Discussion'],
    mockData: {
      heroSub: 'Actionable strategies on commerce, economics, and scaling modern startups.',
      items: [
        { name: 'From Bootstrapped Shop to Market Leader: 5 Key Lessons', price: 'Case Study', tag: 'Popular', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80' },
        { name: '7 Proven Strategies to Maximize Customer Retention in 2026', price: 'Marketing', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  },
  {
    id: 'groc-2',
    fourDigitCode: '#8593',
    title: '#8593 Fresh Daily — Supermarket & Household Groceries',
    banglaTitle: '#8593 Fresh Daily — Supermarket & Household Groceries',
    category: 'grocery',
    categoryLabel: '🌿 Grocery & Organic',
    description: 'Home delivery solution for daily fresh vegetables, staples, grains, cooking oils, spices, and household essentials.',
    priceTag: 'Starts at 999 BDT',
    demoUrl: 'freshdaily.bongoweb.site',
    badge: 'Fast Delivery',
    accentColor: 'from-green-600 to-emerald-700',
    rating: 4.9,
    ordersCount: '300+ daily parcels',
    previewImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Farm-Fresh Produce & Daily Household Goods at Your Doorstep',
    features: ['Area-based Express Delivery', 'Weight Cart Calculator', 'Instant QR Pay', 'Daily Flash Deals'],
    mockData: {
      heroSub: 'Morning and evening harvest delivery with guaranteed freshness and doorstep satisfaction.',
      items: [
        { name: 'Premium Grain White Rice (25kg Sack)', price: '1,750 BDT', tag: 'Deal', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80' },
        { name: 'Farm-Fresh Free Range Eggs (1 Dozen)', price: '150 BDT', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=80' }
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
    colorTheme: '#D97706'
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
    colorTheme: '#EA580C'
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
    colorTheme: '#E11D48'
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
    colorTheme: '#2563EB'
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
    colorTheme: '#9333EA'
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
    colorTheme: '#7C3AED'
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
    colorTheme: '#059669'
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
    colorTheme: '#10B981'
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
    color: '#E2136E',
    gradient: 'from-[#E2136E]/10 to-[#E2136E]/5',
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
    color: '#F7941D',
    gradient: 'from-[#F7941D]/10 to-[#F7941D]/5',
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
    color: '#8C3494',
    gradient: 'from-[#8C3494]/10 to-[#8C3494]/5',
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
    color: '#002E6E',
    gradient: 'from-[#002E6E]/10 to-[#002E6E]/5',
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
    color: '#2563EB',
    gradient: 'from-blue-600/10 to-blue-600/5',
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
    color: '#059669',
    gradient: 'from-emerald-600/10 to-emerald-600/5',
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
    color: 'from-blue-600 to-indigo-600',
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
    oneTimeFee: '1,490 BDT',
    monthlyRenew: '250 BDT',
    popular: false,
    badge: 'High Conversion',
    color: 'from-purple-600 to-pink-600',
    features: [
      'All Starter Package features included',
      'Custom domain (.com / .net) connection included',
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
    color: 'from-emerald-600 to-teal-700',
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
    a: 'Yes, absolutely! You can connect your existing .com, .net, or any custom domain for free at any time, or use our free high-speed subdomain.'
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
