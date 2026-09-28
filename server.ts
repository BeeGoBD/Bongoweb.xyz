import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const portArgIndex = process.argv.indexOf('--port');
const portArg = portArgIndex !== -1 ? process.argv[portArgIndex + 1] : null;
const PORT = portArg ? parseInt(portArg, 10) : 3000;
const DB_FILE = path.resolve(__dirname, 'data', 'db.json');

// Ensure data folder exists
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 8 Production Ready Website Stocks
const INITIAL_OFFICIAL_WEBSITES = [
  {
    id: 'rest-1',
    fourDigitCode: '#1042',
    title: '#1042 Sultan Dine — Premium Dining & Biryani House',
    banglaTitle: '#1042 Sultan Dine — Premium Dining & Biryani House',
    category: 'restaurant',
    categoryLabel: '🍽️ Restaurant',
    description: 'Complete premium catering and restaurant website with online table booking, special deals, and food ordering system.',
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'sultandine.bongoweb.site',
    badge: 'Popular Bestseller',
    accentColor: 'from-white/20 to-white/5',
    rating: 4.9,
    ordersCount: '120+ orders/day',
    previewImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Authentic Traditional Flavors & Premium Dine-In Experience',
    features: ['Online Food Menu', 'Table Reservation', 'Instant Digital Payment', 'Order Tracker'],
    mockData: {
      heroSub: 'Prepared with pure butter oil and aromatic saffron, royal biryani platters and special beverages.',
      items: [
        { name: 'Special Mutton Biryani Platter (1:1)', price: '450 BDT', tag: 'Chef Choice', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=500&q=80' },
        { name: 'Chicken Roast & Saffron Rice Combo', price: '320 BDT', tag: 'Popular', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=500&q=80' }
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
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'gadgetzone.bongoweb.site',
    badge: 'High Converting',
    accentColor: 'from-white/20 to-white/5',
    rating: 4.8,
    ordersCount: '210+ sales/week',
    previewImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Original Smart Gadgets & Premium Audio Accessories',
    features: ['Category Dropdown', 'Courier Tracking API', 'Warranty Card Printing', 'Customer Dashboard'],
    mockData: {
      heroSub: '100% genuine products with official brand warranty and lightning-fast delivery.',
      items: [
        { name: 'Wireless Active Noise-Canceling Earbuds', price: '1,650 BDT', tag: 'Sale', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80' },
        { name: 'Ultra Smartwatch Series 8 Pro', price: '2,190 BDT', tag: 'Top Rated', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' }
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
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'techvibe.bongoweb.site',
    badge: 'Trending Media',
    accentColor: 'from-white/20 to-white/5',
    rating: 4.9,
    ordersCount: '45k readers/mo',
    previewImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Latest Tech Trends, In-Depth Gadget Reviews & Insights',
    features: ['Categorized Articles', 'Newsletter Subscription', 'Ad Placement Manager', 'Auto Social Share'],
    mockData: {
      heroSub: 'Daily technology insights, freelance career guides, and hands-on smartphone comparisons in one place.',
      items: [
        { name: 'Top Budget Smartphones of 2026: Comprehensive Review', price: 'Free Read', tag: 'Hot Topic', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80' }
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
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'purevalley.bongoweb.site',
    badge: '100% Organic',
    accentColor: 'from-white/20 to-white/5',
    rating: 4.9,
    ordersCount: '150+ jars/week',
    previewImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Pure, Natural & Chemical-Free Food for a Healthier Lifestyle',
    features: ['Weight-based Variants', 'Lab Certificate Gallery', '1-Click Fast Order', 'Cash on Delivery'],
    mockData: {
      heroSub: 'Completely chemical-free, farm-fresh quality with rigorous purity certification.',
      items: [
        { name: 'Raw Natural Wildflower Honey (1kg)', price: '950 BDT', tag: 'Pure Natural', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80' }
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
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'auraheritage.bongoweb.site',
    badge: 'Trending Choice',
    accentColor: 'from-white/20 to-white/5',
    rating: 5.0,
    ordersCount: '85+ orders/day',
    previewImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Elegance Redefined in Premium Designer Apparel',
    features: ['Size & Color Selectors', 'Instant Checkout', 'Instagram & Social Feeds', 'VIP Discount Coupons'],
    mockData: {
      heroSub: '100% premium handloom cotton and artisan woven festive collection.',
      items: [
        { name: 'Royal Embroidered Festive Tunic', price: '2,850 BDT', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80' }
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
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'chairoast.bongoweb.site',
    badge: 'Popular Spot',
    accentColor: 'from-white/20 to-white/5',
    rating: 4.7,
    ordersCount: '70+ orders/day',
    previewImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Fresh Roasted Beans & Cozy Artisan Cafe Ambience',
    features: ['QR Code Digital Menu', 'Take-Away Pre-Orders', 'Loyalty Rewards Program', 'Private Event Booking'],
    mockData: {
      heroSub: 'Freshly roasted single-origin coffee beans and handcrafted bakery treats.',
      items: [
        { name: 'Spanish Hazelnut Iced Latte', price: '250 BDT', tag: 'Signature', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80' }
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
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'perspective.bongoweb.site',
    badge: 'Editors Choice',
    accentColor: 'from-white/20 to-white/5',
    rating: 4.8,
    ordersCount: '28k readers',
    previewImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Inspiring Stories of Entrepreneurship and Business Growth',
    features: ['Author Profiles', 'Bookmark Articles', 'Reading Time Counter', 'Community Discussion'],
    mockData: {
      heroSub: 'Actionable strategies on commerce, economics, and scaling modern startups.',
      items: [
        { name: 'From Bootstrapped Shop to Market Leader: 5 Key Lessons', price: 'Case Study', tag: 'Popular', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80' }
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
    priceTag: '১,৯৯০ ৳',
    demoUrl: 'freshdaily.bongoweb.site',
    badge: 'Fast Delivery',
    accentColor: 'from-white/20 to-white/5',
    rating: 4.9,
    ordersCount: '300+ daily parcels',
    previewImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    heroHeadline: 'Farm-Fresh Produce & Daily Household Goods at Your Doorstep',
    features: ['Area-based Express Delivery', 'Weight Cart Calculator', 'Instant QR Pay', 'Daily Flash Deals'],
    mockData: {
      heroSub: 'Morning and evening harvest delivery with guaranteed freshness and doorstep satisfaction.',
      items: [
        { name: 'Premium Grain White Rice (25kg Sack)', price: '1,750 BDT', tag: 'Deal', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80' }
      ]
    }
  }
];

// Initial Database Structure
interface DatabaseSchema {
  adminConfig: {
    adminId: string;
    adminEntryPassword: string;
    adminActionPassword: string;
    masterKey: string;
  };
  users: Array<{
    name: string;
    phone: string;
    email: string;
    password?: string;
    registeredAt: string;
  }>;
  orders: Array<any>;
  supportChats: Array<{
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
    additionalMinutesAdded?: number;
    messages: Array<{
      id: string;
      sender: 'client' | 'admin';
      text: string;
      timestamp: string;
    }>;
  }>;
  customWebsites: Array<any>;
  deliveredCredentials: Array<any>;
  resetRequests: Array<any>;
}

// Default initial database
function getInitialDb(): DatabaseSchema {
  return {
    adminConfig: {
      adminId: 'admin',
      adminEntryPassword: 'admin123',
      adminActionPassword: 'confirm786',
      masterKey: 'MASTER-BONGO-2026'
    },
    users: [],
    orders: [],
    supportChats: [],
    customWebsites: INITIAL_OFFICIAL_WEBSITES,
    deliveredCredentials: [],
    resetRequests: []
  };
}

// Read DB from disk
function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed: DatabaseSchema = JSON.parse(content);
      if (!parsed.customWebsites || parsed.customWebsites.length === 0) {
        parsed.customWebsites = INITIAL_OFFICIAL_WEBSITES;
        writeDb(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading db.json, returning initial db:', err);
  }
  const init = getInitialDb();
  writeDb(init);
  return init;
}

// Write DB atomically
function writeDb(data: DatabaseSchema): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

async function startServer() {
  const app = express();

  // CORS support so mobile devices or local network IP addresses can communicate freely
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // JSON Body Parser
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Ensure DB file exists
  readDb();

  // ---------------- API ROUTES ----------------

  // Health
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Full DB State (for instant admin sync & complete backup)
  app.get('/api/data', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db);
  });

  // 1. ORDERS
  app.get('/api/orders', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.orders || []);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const db = readDb();
    const newOrder = req.body;
    if (!newOrder.orderId) {
      newOrder.orderId = `#BW-${Math.floor(10000 + Math.random() * 90000)}`;
    }
    if (!newOrder.createdAt) {
      newOrder.createdAt = new Date().toLocaleString('bn-BD');
    }
    db.orders.unshift(newOrder);

    // Also auto-register user in DB if not already present
    if (newOrder.phone) {
      const cleanPhone = newOrder.phone.trim();
      const existingUser = db.users.find(u => u.phone === cleanPhone);
      if (!existingUser) {
        db.users.push({
          name: newOrder.clientName || 'Valued Client',
          phone: cleanPhone,
          email: newOrder.email || '',
          registeredAt: new Date().toLocaleDateString('bn-BD')
        });
      }
    }

    writeDb(db);
    console.log(`[Order Placed] Order ${newOrder.orderId} from ${newOrder.clientName} (${newOrder.phone})`);
    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:orderId/status', (req: Request, res: Response) => {
    const db = readDb();
    const { orderId } = req.params;
    const { status } = req.body;
    const order = db.orders.find(o => o.orderId === orderId);
    if (order) {
      order.status = status;
      writeDb(db);
      res.json(db.orders);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });

  // 2. USERS & AUTH
  app.get('/api/users', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.users || []);
  });

  app.post('/api/users/register', (req: Request, res: Response) => {
    const db = readDb();
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, error: 'সবগুলো তথ্য পূরণ করুন।' });
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate
    const exists = db.users.some(
      u => u.phone === cleanPhone || (u.email && u.email.toLowerCase() === cleanEmail)
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'এই মোবাইল নম্বর বা ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে!'
      });
    }

    const newUser = {
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      password: password ? password.trim() : undefined,
      registeredAt: new Date().toLocaleDateString('bn-BD')
    };

    db.users.push(newUser);
    writeDb(db);
    res.status(201).json({ success: true, user: newUser });
  });

  app.post('/api/users/login', (req: Request, res: Response) => {
    const db = readDb();
    const { identifier, password } = req.body;
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const user = db.users.find(
      u => (u.phone === cleanId || (u.email && u.email.toLowerCase() === cleanId)) && u.password === cleanPass
    );

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: 'মোবাইল নম্বর/ইমেইল অথবা পাসওয়ার্ড সঠিক নয়!' });
    }
  });

  // 3. LIVE CHAT SYSTEM
  app.get('/api/chat/threads', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.supportChats || []);
  });

  app.get('/api/chat/thread/:phone', (req: Request, res: Response) => {
    const db = readDb();
    const { phone } = req.params;
    const thread = db.supportChats.find(t => t.userPhone === phone);
    res.json(thread || null);
  });

  app.post('/api/chat/activate', (req: Request, res: Response) => {
    const db = readDb();
    const { name, phone, language, welcomeText } = req.body;
    const cleanPhone = (phone || '').trim();
    const cleanName = (name || '').trim();

    const welcomeMsg = {
      id: `init-${Date.now()}`,
      sender: 'admin' as const,
      text: welcomeText || (language === 'bn' 
        ? `স্বাগতম ${cleanName}! BongoWeb লাইভ সাপোর্ট টিম আপনার সাথে যুক্ত হয়েছেন। আপনার যেকোনো জিজ্ঞাসা এখানে লিখুন:`
        : `Welcome ${cleanName}! A BongoWeb live support specialist has joined the chat. How can we help you today?`),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let thread = db.supportChats.find(t => t.userPhone === cleanPhone);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes inactivity timer

    if (thread) {
      thread.userName = cleanName;
      thread.language = language || 'bn';
      thread.lastMessage = welcomeMsg.text;
      thread.lastUpdated = 'এখনই';
      thread.expiresAt = expiresAt;
      thread.isClosed = false;
      if (!thread.messages || thread.messages.length === 0) {
        thread.messages = [welcomeMsg];
      }
    } else {
      thread = {
        userPhone: cleanPhone,
        userName: cleanName,
        language: language || 'bn',
        lastMessage: welcomeMsg.text,
        lastUpdated: 'এখনই',
        unreadAdminCount: 1,
        unreadClientCount: 0,
        expiresAt,
        isClosed: false,
        additionalMinutesAdded: 0,
        messages: [welcomeMsg]
      };
      db.supportChats.unshift(thread);
    }

    writeDb(db);
    console.log(`[Chat Activated] User ${cleanName} (${cleanPhone})`);
    res.json(thread);
  });

  app.post('/api/chat/message', (req: Request, res: Response) => {
    const db = readDb();
    const { phone, sender, text, name, message } = req.body;
    const cleanPhone = (phone || '').trim();

    const msg = message || {
      id: `${sender}-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let thread = db.supportChats.find(t => t.userPhone === cleanPhone);

    if (thread) {
      thread.messages.push(msg);
      thread.lastMessage = msg.text;
      thread.lastUpdated = 'এখনই';
      if (sender === 'client') {
        thread.unreadAdminCount = (thread.unreadAdminCount || 0) + 1;
        // User responded: reset 5-minute inactivity timer!
        thread.expiresAt = Date.now() + 5 * 60 * 1000;
        thread.isClosed = false;
      } else {
        thread.unreadClientCount = (thread.unreadClientCount || 0) + 1;
      }
    } else {
      thread = {
        userPhone: cleanPhone,
        userName: name || 'Client',
        lastMessage: msg.text,
        lastUpdated: 'এখনই',
        unreadAdminCount: sender === 'client' ? 1 : 0,
        unreadClientCount: sender === 'admin' ? 1 : 0,
        expiresAt: Date.now() + 5 * 60 * 1000,
        isClosed: false,
        messages: [msg]
      };
      db.supportChats.unshift(thread);
    }

    writeDb(db);
    console.log(`[Chat Message] [${sender}] ${cleanPhone}: ${msg.text}`);
    res.json(msg);
  });

  // Admin adds extra time for client
  app.post('/api/chat/extend', (req: Request, res: Response) => {
    const db = readDb();
    const { phone, additionalMinutes = 5 } = req.body;
    const thread = db.supportChats.find(t => t.userPhone === phone);

    if (thread) {
      const base = thread.expiresAt && thread.expiresAt > Date.now() ? thread.expiresAt : Date.now();
      thread.expiresAt = base + additionalMinutes * 60 * 1000;
      thread.isClosed = false;
      thread.additionalMinutesAdded = (thread.additionalMinutesAdded || 0) + additionalMinutes;
      writeDb(db);
      res.json({ success: true, expiresAt: thread.expiresAt });
    } else {
      res.status(404).json({ error: 'Thread not found' });
    }
  });

  // End / Close chat
  app.post('/api/chat/end', (req: Request, res: Response) => {
    const db = readDb();
    const { phone } = req.body;
    const idx = db.supportChats.findIndex(t => t.userPhone === phone);
    if (idx >= 0) {
      db.supportChats.splice(idx, 1);
      writeDb(db);
    }
    res.json({ success: true });
  });

  // 4. WEBSITES CATALOG & STOCKS (Full real edit, add, delete, persist)
  app.get('/api/websites', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.customWebsites || []);
  });

  app.post('/api/websites', (req: Request, res: Response) => {
    const db = readDb();
    const newSite = req.body;
    db.customWebsites.unshift(newSite);
    writeDb(db);
    res.status(201).json(db.customWebsites);
  });

  app.put('/api/websites/:code', (req: Request, res: Response) => {
    const db = readDb();
    const { code } = req.params;
    const cleanCode = code.replace('#', '');
    const updateData = req.body;

    const idx = db.customWebsites.findIndex(
      s => (s.fourDigitCode && s.fourDigitCode.replace('#', '') === cleanCode) || s.id === code
    );

    if (idx >= 0) {
      db.customWebsites[idx] = { ...db.customWebsites[idx], ...updateData };
      writeDb(db);
      res.json(db.customWebsites);
    } else {
      res.status(404).json({ error: 'Website not found' });
    }
  });

  app.delete('/api/websites/:code', (req: Request, res: Response) => {
    const db = readDb();
    const { code } = req.params;
    const cleanCode = code.replace('#', '');
    db.customWebsites = db.customWebsites.filter(
      s => (s.fourDigitCode && s.fourDigitCode.replace('#', '') !== cleanCode) && s.id !== code
    );
    writeDb(db);
    res.json(db.customWebsites);
  });

  // 5. DELIVERED CREDENTIALS
  app.get('/api/credentials', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.deliveredCredentials || []);
  });

  app.post('/api/credentials', (req: Request, res: Response) => {
    const db = readDb();
    const cred = req.body;
    db.deliveredCredentials.unshift(cred);
    writeDb(db);
    res.status(201).json(db.deliveredCredentials);
  });

  app.delete('/api/credentials/:id', (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    db.deliveredCredentials = db.deliveredCredentials.filter(c => c.id !== id);
    writeDb(db);
    res.json(db.deliveredCredentials);
  });

  // 6. PASSWORD RESET REQUESTS
  app.get('/api/resets', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.resetRequests || []);
  });

  app.post('/api/resets', (req: Request, res: Response) => {
    const db = readDb();
    const newReq = req.body;
    db.resetRequests.unshift(newReq);
    writeDb(db);
    res.status(201).json(newReq);
  });

  app.put('/api/resets/:id', (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    const { status, newPassword } = req.body;
    const reqItem = db.resetRequests.find(r => r.id === id);

    if (reqItem) {
      reqItem.status = status;
      reqItem.resolvedAt = new Date().toLocaleString('bn-BD');
      if (newPassword) reqItem.newPasswordAssigned = newPassword;
      writeDb(db);
      res.json(db.resetRequests);
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  });

  // 7. BACKUP & VAULT (FULL SYSTEM RESTORE & EXPORT)
  app.get('/api/backup/export', (req: Request, res: Response) => {
    const db = readDb();
    res.json({
      exportedAt: new Date().toISOString(),
      platform: 'BongoWeb.xyz Complete Production Vault',
      version: '4.0.0',
      totalUsers: db.users.length,
      totalOrders: db.orders.length,
      totalCustomWebsites: db.customWebsites.length,
      totalChatThreads: db.supportChats.length,
      totalDeliveredCredentials: db.deliveredCredentials.length,
      totalResetRequests: db.resetRequests.length,
      ...db
    });
  });

  app.post('/api/backup/restore', (req: Request, res: Response) => {
    const backupData = req.body;
    if (!backupData) {
      return res.status(400).json({ success: false, error: 'No backup data provided' });
    }

    const newDb: DatabaseSchema = {
      adminConfig: backupData.adminConfig || {
        adminId: 'admin',
        adminEntryPassword: 'admin123',
        adminActionPassword: 'confirm786',
        masterKey: 'MASTER-BONGO-2026'
      },
      users: Array.isArray(backupData.users) ? backupData.users : [],
      orders: Array.isArray(backupData.orders) ? backupData.orders : [],
      supportChats: Array.isArray(backupData.supportChats) ? backupData.supportChats : [],
      customWebsites: Array.isArray(backupData.customWebsites) && backupData.customWebsites.length > 0 
        ? backupData.customWebsites 
        : INITIAL_OFFICIAL_WEBSITES,
      deliveredCredentials: Array.isArray(backupData.deliveredCredentials) ? backupData.deliveredCredentials : [],
      resetRequests: Array.isArray(backupData.resetRequests) ? backupData.resetRequests : []
    };

    writeDb(newDb);
    res.json({
      success: true,
      message: 'সম্পূর্ণ ডাটাবেজ সফলভাবে রিস্টোর করা হয়েছে।',
      recordsRestored: {
        users: newDb.users.length,
        orders: newDb.orders.length,
        websites: newDb.customWebsites.length,
        chats: newDb.supportChats.length
      }
    });
  });

  // ---------------- VITE MIDDLEWARE / STATIC FILES ----------------
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BongoWeb Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
