import express from 'express';
import type { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import DescopeClient from '@descope/node-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Descope Authentication Client (Project ID: P3K6LwIDJRlYK19nBi2yewOjmo22)
const DESCOPE_PROJECT_ID = process.env.DESCOPE_PROJECT_ID || 'P3K6LwIDJRlYK19nBi2yewOjmo22';
const descopeClient = DescopeClient({ projectId: DESCOPE_PROJECT_ID });

// Optional SMTP Mail Transporter for Live Email Dispatch
const mailTransporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null;

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

// Database Schema
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
    isRestricted?: boolean;
    numberVerified?: boolean;
    photoUrl?: string;
    clientId?: string;
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
    isArchived?: boolean;
    archivedAt?: string;
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
  reports: Array<any>;
  emailRecoveries?: Array<any>;
  logoConfig?: any;
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
    customWebsites: [],
    deliveredCredentials: [],
    resetRequests: [],
    reports: [],
    emailRecoveries: [],
    logoConfig: {
      logoType: 'image',
      imageUrl: '',
      imageSizePx: 36,
      showBrandTextWithImage: true,
      typedLogoText: 'BongoWeb',
      typedSubtitle: '.xyz',
      textGradientTheme: 'royal',
      updatedAt: new Date().toISOString()
    }
  };
}

// Read DB from disk
function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed: DatabaseSchema = JSON.parse(content);
      if (!Array.isArray(parsed.customWebsites)) {
        parsed.customWebsites = [];
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
  const server = http.createServer(app);

  // Initialize WebSocket Server
  const wss = new WebSocketServer({ noServer: true });

  // Connected SSE clients set
  const sseClients: Set<Response> = new Set();

  // Universal Broadcaster (WebSockets + SSE for zero-loss real-time events)
  function broadcast(event: { type: string; [key: string]: any }) {
    const payload = JSON.stringify(event);

    // 1. Broadcast via WebSocket
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (err) {
          console.error('WebSocket send error:', err);
        }
      }
    });

    // 2. Broadcast via Server-Sent Events (SSE)
    sseClients.forEach((res) => {
      try {
        res.write(`data: ${payload}\n\n`);
      } catch (_) {
        sseClients.delete(res);
      }
    });
  }

  // Alap AI WebSocket Proxy Server (authorizes requests to api.alapai.app with configured domain)
  const alapaiProxyWss = new WebSocketServer({ noServer: true });

  // Handle HTTP -> WebSocket Upgrade on /ws and /api/alapai-ws
  server.on('upgrade', (request, socket, head) => {
    try {
      const parsedUrl = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
      const pathname = parsedUrl.pathname;

      if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else if (pathname === '/api/alapai-ws') {
        alapaiProxyWss.handleUpgrade(request, socket, head, (clientWs) => {
          const key = parsedUrl.searchParams.get('key') || '2c8b94ad-421a-4a4e-a029-f86d59d21330';
          const upstreamUrl = `wss://api.alapai.app/ws/widget/?key=${encodeURIComponent(key)}`;

          const upstreamWs = new WebSocket(upstreamUrl, {
            headers: {
              Origin: 'https://bongoweb.xyz',
              'User-Agent': (request.headers['user-agent'] as string) || 'BongoWeb/1.0'
            }
          });

          const queue: Array<{ data: any; isBinary: boolean }> = [];

          clientWs.on('message', (data, isBinary) => {
            if (upstreamWs.readyState === WebSocket.OPEN) {
              upstreamWs.send(data, { binary: isBinary });
            } else if (upstreamWs.readyState === WebSocket.CONNECTING) {
              queue.push({ data, isBinary });
            }
          });

          upstreamWs.on('open', () => {
            while (queue.length > 0) {
              const item = queue.shift();
              if (item) {
                upstreamWs.send(item.data, { binary: item.isBinary });
              }
            }
          });

          upstreamWs.on('message', (data, isBinary) => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(data, { binary: isBinary });
            }
          });

          upstreamWs.on('close', (code, reason) => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.close(code, reason);
            }
          });

          upstreamWs.on('error', (err) => {
            console.error('[Alapai Proxy Upstream Error]:', err.message);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.close(1011, 'Alap AI upstream error');
            }
          });

          clientWs.on('close', (code, reason) => {
            if (upstreamWs.readyState === WebSocket.OPEN || upstreamWs.readyState === WebSocket.CONNECTING) {
              upstreamWs.close(code, reason);
            }
          });

          clientWs.on('error', (err) => {
            console.error('[Alapai Proxy Client Error]:', err.message);
            upstreamWs.close();
          });
        });
      }
    } catch (err) {
      console.error('WebSocket upgrade error:', err);
    }
  });

  // WebSocket Connection Lifecycle
  wss.on('connection', (ws: WebSocket) => {
    console.log(`[WebSocket] Client connected. Total clients: ${wss.clients.size}`);

    // Send initial snapshot on connect
    const db = readDb();
    ws.send(JSON.stringify({
      type: 'init',
      data: {
        orders: db.orders,
        supportChats: db.supportChats,
        users: db.users,
        customWebsites: db.customWebsites,
        deliveredCredentials: db.deliveredCredentials
      },
      timestamp: Date.now()
    }));

    // Listen for incoming WebSocket messages from clients
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        } else if (msg.type === 'chat:message') {
          const db = readDb();
          const { phone, sender, text, name, message } = msg;
          const cleanPhone = (phone || '').trim();
          const newMsg = message || {
            id: `${sender}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            sender,
            text: (text || '').trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          let thread = db.supportChats.find(t => t.userPhone === cleanPhone);
          if (thread) {
            if (!thread.messages.some(m => m.id === newMsg.id || (m.sender === newMsg.sender && m.text === newMsg.text))) {
              thread.messages.push(newMsg);
            }
            thread.lastMessage = newMsg.text;
            thread.lastUpdated = 'এখনই';
            thread.isClosed = false;
            thread.isArchived = false;
            if (sender === 'client') {
              thread.unreadAdminCount = (thread.unreadAdminCount || 0) + 1;
              thread.expiresAt = Date.now() + 5 * 60 * 1000;
            } else {
              thread.unreadClientCount = (thread.unreadClientCount || 0) + 1;
            }
          } else {
            thread = {
              userPhone: cleanPhone,
              userName: name || 'Valued Client',
              lastMessage: newMsg.text,
              lastUpdated: 'এখনই',
              unreadAdminCount: sender === 'client' ? 1 : 0,
              unreadClientCount: sender === 'admin' ? 1 : 0,
              expiresAt: Date.now() + 5 * 60 * 1000,
              isClosed: false,
              isArchived: false,
              messages: [newMsg]
            };
            db.supportChats.unshift(thread);
          }
          writeDb(db);
          broadcast({
            type: 'chat:message',
            phone: cleanPhone,
            message: newMsg,
            thread,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      console.log(`[WebSocket] Client disconnected. Remaining: ${wss.clients.size}`);
    });
  });

  // CORS support
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

  // ---------------- REAL-TIME SSE ENDPOINT ----------------
  app.get('/api/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders?.();

    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);
    sseClients.add(res);

    const pingTimer = setInterval(() => {
      try {
        res.write(`:ping\n\n`);
      } catch (_) {
        clearInterval(pingTimer);
        sseClients.delete(res);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(pingTimer);
      sseClients.delete(res);
    });
  });

  // ---------------- API ROUTES ----------------

  // Health
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      wsClients: wss.clients.size,
      sseClients: sseClients.size
    });
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
    console.log(`[Realtime Order Placed] Order ${newOrder.orderId} from ${newOrder.clientName} (${newOrder.phone})`);
    
    // Broadcast real-time order creation event
    broadcast({
      type: 'order:created',
      order: newOrder,
      totalOrders: db.orders.length,
      timestamp: Date.now()
    });

    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:orderId/status', (req: Request, res: Response) => {
    const db = readDb();
    const { orderId } = req.params;
    const { status, extraData } = req.body;
    const cleanTargetId = String(orderId || '').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    const order = (db.orders || []).find(o => {
      const currentClean = String(o.orderId || '').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
      return o.orderId === orderId || (cleanTargetId && currentClean === cleanTargetId);
    });
    if (order) {
      order.status = status;
      if (extraData && typeof extraData === 'object') {
        Object.assign(order, extraData);
      }
      writeDb(db);

      // Broadcast order status update event
      broadcast({
        type: 'order:updated',
        orderId: order.orderId,
        status,
        orders: db.orders,
        timestamp: Date.now()
      });

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

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'অনুগ্রহ করে নাম এবং ইমেইল প্রদান করুন।' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim().replace(/\s+/g, '') : '';
    const cleanName = name.trim();

    // 1. One name cannot be registered twice until completed/verified
    const nameExists = (db.users || []).some(
      u => u.name && u.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (nameExists) {
      return res.status(400).json({
        success: false,
        error: 'এই নাম দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে! অনুগ্রহ করে ভিন্ন একটি নাম ব্যবহার করুন।'
      });
    }

    // 2. One email can have only one account
    const emailExists = (db.users || []).some(
      u => u.email && u.email.trim().toLowerCase() === cleanEmail
    );
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে! অনুগ্রহ করে সাইন ইন করুন।'
      });
    }

    // 3. One phone can have only one account
    if (cleanPhone) {
      const phoneExists = (db.users || []).some(
        u => u.phone && u.phone.trim().replace(/\s+/g, '') === cleanPhone
      );
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          error: 'এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে! একটি নম্বরে কেবল একটি অ্যাকাউন্ট তৈরি সম্ভব।'
        });
      }
    }

    const newUser = {
      name: cleanName,
      phone: cleanPhone || '',
      email: cleanEmail,
      password: password ? password.trim() : undefined,
      registeredAt: new Date().toLocaleDateString('bn-BD'),
      numberVerified: false,
      numberVerificationCallPending: true
    };

    db.users.push(newUser);
    writeDb(db);

    broadcast({
      type: 'user:registered',
      user: newUser,
      totalUsers: db.users.length,
      timestamp: Date.now()
    });

    res.status(201).json({ success: true, user: newUser });
  });

  app.post('/api/users/login', (req: Request, res: Response) => {
    const db = readDb();
    const { identifier, password } = req.body;
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const user = db.users.find(
      u => ((u.email && u.email.toLowerCase() === cleanId) || 
            (u.phone && u.phone === cleanId) || 
            ((u as any).username && (u as any).username.toLowerCase() === cleanId)) && 
           u.password === cleanPass
    );

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়!' });
    }
  });

  // EMAIL OTP & AUTH ROUTES (Directly powered by Descope: P3K6LwIDJRlYK19nBi2yewOjmo22)
  interface EmailOtpRecord {
    code: string;
    expiresAt: number;
    purpose: 'signup' | 'forgot_password';
    verified: boolean;
    isExistingUser?: boolean;
    existingUser?: any;
    descopeMaskedEmail?: string;
  }
  const emailOtpStore = new Map<string, EmailOtpRecord>();

  app.post('/api/auth/send-email-otp', async (req: Request, res: Response) => {
    const { email, phone, purpose } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim().replace(/\D/g, '');

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please enter a valid Gmail / Email address.' });
    }

    const db = readDb();
    const existingUser = (db.users || []).find(u => {
      const uEmail = (u.email || '').toLowerCase();
      const uPhone = (u.phone || '').replace(/\D/g, '');
      return (uEmail && uEmail === cleanEmail) || (cleanPhone && uPhone && uPhone === cleanPhone);
    });

    // Smart Registration System: If user already exists and tries to register, allow sending OTP to auto-login them!
    const isExistingUser = !!(purpose === 'signup' && existingUser);

    if (purpose === 'forgot_password' && !existingUser) {
      return res.status(404).json({ success: false, error: 'No account found with this email address.' });
    }

    // 1. Primary: Deliver real OTP email using Descope with configured Project ID P3K6LwIDJRlYK19nBi2yewOjmo22
    let descopeSent = false;
    let maskedEmail = '';
    try {
      const descopeRes = await descopeClient.otp.signUpOrIn.email(cleanEmail);
      if (descopeRes?.ok) {
        descopeSent = true;
        maskedEmail = descopeRes.data?.maskedEmail || cleanEmail;
        console.log(`[AUTH OTP via Descope] Real OTP sent to ${cleanEmail} via Descope Project ${DESCOPE_PROJECT_ID}`);
      } else {
        console.warn(`[AUTH OTP Descope Notice]`, descopeRes?.error);
      }
    } catch (err: any) {
      console.warn(`[AUTH OTP Descope Error]`, err?.message || err);
    }

    // 2. Generate local fallback verification code
    const fallbackCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    emailOtpStore.set(cleanEmail, {
      code: fallbackCode,
      expiresAt,
      purpose: purpose || 'signup',
      verified: false,
      isExistingUser,
      existingUser: existingUser || undefined,
      descopeMaskedEmail: maskedEmail
    });

    if (!maskedEmail) {
      const parts = cleanEmail.split('@');
      maskedEmail = parts[0].slice(0, 2) + '***@' + (parts[1] || 'gmail.com');
    }

    console.log(`[AUTH OTP] OTP dispatch initiated for ${cleanEmail} via Descope (backup code: ${fallbackCode})`);

    // Optional nodemailer dispatch only if an external SMTP is configured (never required)
    if (mailTransporter) {
      mailTransporter.sendMail({
        from: process.env.SMTP_FROM || `"BongoWeb Security" <noreply@bongoweb.xyz>`,
        to: cleanEmail,
        subject: isExistingUser
          ? `[BongoWeb] Your Instant Login Verification Code: ${fallbackCode}`
          : `[BongoWeb] Your Email Verification OTP: ${fallbackCode}`,
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #533AFD; margin: 0; font-size: 22px;">BongoWeb Authentication</h2>
              <p style="color: #64748B; font-size: 13px; margin: 4px 0 0 0;">Descope Official Security Code Service</p>
            </div>
            <p style="color: #1e293b; font-size: 14px; line-height: 1.5;">
              ${isExistingUser 
                ? 'We noticed you entered an email associated with an existing account. Use the 6-digit verification code below to directly sign into your account:' 
                : 'Thank you for choosing BongoWeb. Please use the following 6-digit verification code to complete your Gmail verification:'}
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <div style="display: inline-block; padding: 14px 28px; background: #f1f3fd; border: 1px solid #c7d2fe; border-radius: 12px; font-family: monospace; font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #4328eb;">
                ${fallbackCode}
              </div>
            </div>
            <p style="color: #64748B; font-size: 12px; line-height: 1.5;">
              This code will expire in 10 minutes. Powered by Descope authentication.
            </p>
          </div>
        `
      }).catch((err: any) => {
        console.warn(`[AUTH OTP SMTP Optional Notice]`, err.message);
      });
    }

    res.json({
      success: true,
      descopeSent,
      isExistingUser,
      maskedEmail,
      message: isExistingUser
        ? `Existing account found! A 6-digit verification code was sent to ${maskedEmail} via Descope. Enter it below to log into your account directly.`
        : `A 6-digit verification code was sent to ${maskedEmail} via Descope. Please check your Gmail inbox or spam folder.`
    });
  });

  app.post('/api/auth/verify-email-otp', async (req: Request, res: Response) => {
    const { email, code } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanCode = String(code || '').trim();

    if (!cleanCode || cleanCode.length < 6) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 6-digit verification code.' });
    }

    const record = emailOtpStore.get(cleanEmail);

    // 1. Primary: Verify with Descope Project
    let isVerified = false;
    let descopeData: any = null;
    try {
      const descopeVerify = await descopeClient.otp.verify.email(cleanEmail, cleanCode);
      if (descopeVerify?.ok) {
        isVerified = true;
        descopeData = descopeVerify.data;
        console.log(`[AUTH OTP via Descope] OTP for ${cleanEmail} verified successfully with Descope!`);
      }
    } catch (err: any) {
      console.warn(`[AUTH OTP Descope Verify Notice]`, err?.message || err);
    }

    // 2. Secondary fallback check
    if (!isVerified && record) {
      if (record.code === cleanCode && Date.now() <= record.expiresAt) {
        isVerified = true;
      }
    }

    if (!isVerified) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP code! Please check the code in your Gmail inbox.' });
    }

    if (record) {
      record.verified = true;
      emailOtpStore.set(cleanEmail, record);
    }

    // Smart Registration System: Check if user exists in database
    const dbUsers = readDb().users || [];
    const foundUser = (record?.existingUser) || dbUsers.find(
      (u: any) => (u.email && u.email.toLowerCase() === cleanEmail)
    );

    if (foundUser) {
      return res.json({
        success: true,
        isExistingUser: true,
        user: foundUser,
        message: 'OTP verified successfully! Welcome back to your account.'
      });
    }

    res.json({ 
      success: true, 
      isExistingUser: false, 
      message: 'Gmail verified successfully via Descope.',
      descopeSession: descopeData?.sessionJwt
    });
  });

  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { email, code, newPassword } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanCode = String(code || '').trim();
    const cleanPass = String(newPassword || '').trim();

    if (!cleanPass || cleanPass.length < 4) {
      return res.status(400).json({ success: false, error: 'Password must be at least 4 characters long.' });
    }

    const record = emailOtpStore.get(cleanEmail);
    if (!record || (!record.verified && record.code !== cleanCode)) {
      return res.status(400).json({ success: false, error: 'Invalid OTP code or verification failed.' });
    }

    const db = readDb();
    const userIndex = (db.users || []).findIndex(u => (u.email || '').toLowerCase() === cleanEmail);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'No account found with this email address.' });
    }

    db.users[userIndex].password = cleanPass;
    writeDb(db);
    emailOtpStore.delete(cleanEmail);

    res.json({ success: true, message: 'Password successfully changed. You can now log in with your new password.' });
  });

  // GOOGLE AUTH DIRECT SYNC ROUTE
  app.post('/api/auth/google-sync', (req: Request, res: Response) => {
    const db = readDb();
    const { email, name, phone, photoUrl } = req.body;
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Invalid Google email.' });
    }

    const cleanName = String(name || cleanEmail.split('@')[0] || 'Google User').trim();
    const cleanPhone = String(phone || '').trim();

    let user = (db.users || []).find(u => 
      (u.email || '').toLowerCase() === cleanEmail ||
      (cleanPhone && u.phone === cleanPhone)
    );

    if (!user) {
      const generatedPhone = cleanPhone || `017${Math.floor(10000000 + Math.random() * 90000000)}`;
      const newUser = {
        name: cleanName,
        phone: generatedPhone,
        email: cleanEmail,
        photoUrl: photoUrl || undefined,
        registeredAt: new Date().toLocaleDateString('en-US')
      };
      db.users.push(newUser);
      writeDb(db);
      user = newUser;
      broadcast({
        type: 'user:registered',
        user: newUser,
        totalUsers: db.users.length,
        timestamp: Date.now()
      });
    } else {
      // Update name/photo if updated
      let changed = false;
      if (cleanName && (!user.name || user.name === 'Google User')) {
        user.name = cleanName;
        changed = true;
      }
      if (photoUrl && !user.photoUrl) {
        user.photoUrl = photoUrl;
        changed = true;
      }
      if (changed) writeDb(db);
    }

    res.json({ success: true, user });
  });

  // Descope Server-Side Session Validation Endpoint
  // Validates sessionToken using descopeClient.validateSession
  app.post('/api/auth/descope-validate', async (req: Request, res: Response) => {
    try {
      const sessionToken = req.body?.sessionToken || req.headers.authorization?.replace(/^Bearer\s+/i, '');
      if (!sessionToken) {
        return res.status(400).json({ success: false, error: 'sessionToken is required' });
      }
      const authInfo = await descopeClient.validateSession(sessionToken);
      return res.json({ success: true, authInfo });
    } catch (err: any) {
      console.warn('[Descope] Session validation warning/error:', err?.message || err);
      return res.status(401).json({ success: false, error: err?.message || 'Invalid or expired Descope session token' });
    }
  });

  app.post('/api/auth/descope-sync', async (req: Request, res: Response) => {
    const db = readDb();
    let { email, name, phone, sessionToken } = req.body;

    // If sessionToken is provided, attempt server-side verification with Descope
    if (!sessionToken && req.headers.authorization) {
      sessionToken = req.headers.authorization.replace(/^Bearer\s+/i, '');
    }

    if (sessionToken) {
      try {
        const authInfo = await descopeClient.validateSession(sessionToken);
        const tokenData = authInfo?.token as any;
        if (tokenData) {
          if (!email && (tokenData.email || tokenData.sub)) {
            email = tokenData.email || (tokenData.sub?.includes('@') ? tokenData.sub : email);
          }
          if (!name && (tokenData.name || tokenData.given_name)) {
            name = tokenData.name || tokenData.given_name;
          }
          if (!phone && tokenData.phone) {
            phone = tokenData.phone;
          }
        }
      } catch (validationErr: any) {
        // Fall back gracefully if offline or token expired
        console.warn('[Descope] Token validation non-fatal warning during sync:', validationErr?.message);
      }
    }

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();
    const cleanName = String(name || (cleanEmail ? cleanEmail.split('@')[0] : 'BongoWeb Member')).trim();

    let user = (db.users || []).find(u => 
      (cleanEmail && (u.email || '').toLowerCase() === cleanEmail) ||
      (cleanPhone && u.phone === cleanPhone)
    );

    if (!user) {
      const generatedPhone = cleanPhone || `017${Math.floor(10000000 + Math.random() * 90000000)}`;
      user = {
        name: cleanName,
        phone: generatedPhone,
        email: cleanEmail,
        registeredAt: new Date().toLocaleDateString('bn-BD')
      };
      db.users.push(user);
      writeDb(db);
      broadcast({
        type: 'user:registered',
        user,
        totalUsers: db.users.length,
        timestamp: Date.now()
      });
    }

    res.json({ success: true, user });
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
      thread.isArchived = false;
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
        isArchived: false,
        additionalMinutesAdded: 0,
        messages: [welcomeMsg]
      };
      db.supportChats.unshift(thread);
    }

    writeDb(db);
    console.log(`[Realtime Chat Activated] User ${cleanName} (${cleanPhone})`);

    // Broadcast chat activation event
    broadcast({
      type: 'chat:activated',
      thread,
      timestamp: Date.now()
    });

    res.json(thread);
  });

  app.post('/api/chat/message', (req: Request, res: Response) => {
    const db = readDb();
    const { phone, sender, text, name, message } = req.body;
    const cleanPhone = (phone || '').trim();

    const msg = message || {
      id: `${sender}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sender,
      text: (text || '').trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let thread = db.supportChats.find(t => t.userPhone === cleanPhone);

    if (thread) {
      if (!thread.messages.some(m => m.id === msg.id || (m.sender === msg.sender && m.text === msg.text))) {
        thread.messages.push(msg);
      }
      thread.lastMessage = msg.text;
      thread.lastUpdated = 'এখনই';
      thread.isClosed = false;
      thread.isArchived = false;
      if (sender === 'client') {
        thread.unreadAdminCount = (thread.unreadAdminCount || 0) + 1;
        // User responded: reset 5-minute inactivity timer
        thread.expiresAt = Date.now() + 5 * 60 * 1000;
      } else {
        thread.unreadClientCount = (thread.unreadClientCount || 0) + 1;
      }
    } else {
      thread = {
        userPhone: cleanPhone,
        userName: name || 'Valued Client',
        lastMessage: msg.text,
        lastUpdated: 'এখনই',
        unreadAdminCount: sender === 'client' ? 1 : 0,
        unreadClientCount: sender === 'admin' ? 1 : 0,
        expiresAt: Date.now() + 5 * 60 * 1000,
        isClosed: false,
        isArchived: false,
        messages: [msg]
      };
      db.supportChats.unshift(thread);
    }

    writeDb(db);
    console.log(`[Realtime Chat Message] [${sender}] ${cleanPhone}: ${msg.text}`);

    // Broadcast real-time chat message event
    broadcast({
      type: 'chat:message',
      phone: cleanPhone,
      message: msg,
      thread,
      timestamp: Date.now()
    });

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

      broadcast({
        type: 'chat:extended',
        phone,
        expiresAt: thread.expiresAt,
        additionalMinutes,
        timestamp: Date.now()
      });

      res.json({ success: true, expiresAt: thread.expiresAt });
    } else {
      res.status(404).json({ error: 'Thread not found' });
    }
  });

  // End / Close chat (Archive only if user has account, otherwise discard temporary chat)
  app.post('/api/chat/end', (req: Request, res: Response) => {
    const db = readDb();
    const { phone } = req.body;
    const cleanPhone = (phone || '').trim();
    const cleanDigits = cleanPhone.replace(/\D/g, '').slice(-10);
    const thread = db.supportChats.find(t => (t.userPhone || '').trim() === cleanPhone || (t.userPhone || '').replace(/\D/g, '').slice(-10) === cleanDigits);
    const now = new Date().toLocaleString('bn-BD');

    const userHasAccount = 
      (db.users || []).some(u => (u.phone || '').replace(/\D/g, '').slice(-10) === cleanDigits) ||
      (db.orders || []).some(o => (o.phone || '').replace(/\D/g, '').slice(-10) === cleanDigits);

    if (thread) {
      if (userHasAccount) {
        thread.isClosed = true;
        thread.isArchived = true;
        thread.archivedAt = now;
      } else {
        // Temporary visitor chat: discard and do not save to archive
        db.supportChats = db.supportChats.filter(t => t.userPhone !== thread.userPhone);
      }
      writeDb(db);
    }

    broadcast({
      type: 'chat:ended',
      phone: cleanPhone,
      isClosed: true,
      hasAccount: userHasAccount,
      timestamp: Date.now()
    });

    res.json({ success: true, archived: userHasAccount });
  });

  // Reopen chat from archive
  app.post('/api/chat/reopen', (req: Request, res: Response) => {
    const db = readDb();
    const { phone } = req.body;
    const thread = db.supportChats.find(t => t.userPhone === phone);
    if (thread) {
      thread.isClosed = false;
      thread.isArchived = false;
      thread.expiresAt = Date.now() + 5 * 60 * 1000;
      writeDb(db);

      broadcast({
        type: 'chat:activated',
        thread,
        timestamp: Date.now()
      });
    }

    res.json({ success: true, thread });
  });

  // REPORTS
  app.get('/api/reports', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.reports || []);
  });

  app.post('/api/reports', (req: Request, res: Response) => {
    const db = readDb();
    if (!db.reports) db.reports = [];
    const report = {
      ...req.body,
      id: req.body.id || `REP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: req.body.status || 'pending',
      createdAt: req.body.createdAt || new Date().toLocaleString('bn-BD')
    };
    db.reports.unshift(report);
    writeDb(db);
    broadcast({
      type: 'report:created',
      report,
      timestamp: Date.now()
    });
    res.json(report);
  });

  app.put('/api/reports/:id/reply', (req: Request, res: Response) => {
    const db = readDb();
    if (!db.reports) db.reports = [];
    const rep = db.reports.find(r => r.id === req.params.id);
    if (rep) {
      rep.adminReply = String(req.body.reply || '').trim();
      rep.adminRepliedAt = new Date().toLocaleString('bn-BD');
      // Report remains strictly in 'pending' or 'in_progress' (পেন্ডিং/চলমান) until explicitly marked complete
      if (rep.status === 'pending') {
        rep.status = 'in_progress';
      }
      writeDb(db);
      broadcast({
        type: 'report:replied',
        report: rep,
        timestamp: Date.now()
      });
      return res.json(rep);
    }
    res.status(404).json({ error: 'Report not found' });
  });

  app.put('/api/reports/:id/resolve', (req: Request, res: Response) => {
    const db = readDb();
    if (!db.reports) db.reports = [];
    const rep = db.reports.find(r => r.id === req.params.id);
    if (rep) {
      rep.status = 'resolved';
      rep.resolvedAt = new Date().toLocaleString('bn-BD');
      writeDb(db);
      broadcast({
        type: 'report:resolved',
        report: rep,
        timestamp: Date.now()
      });
    }
    res.json(db.reports);
  });

  // ---------------- EMAIL RECOVERY REQUESTS ("I don't have email") ----------------
  app.get('/api/email-recoveries', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.emailRecoveries || []);
  });

  app.post('/api/email-recoveries', (req: Request, res: Response) => {
    const db = readDb();
    if (!db.emailRecoveries) db.emailRecoveries = [];
    const item = {
      ...req.body,
      id: req.body.id || `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: req.body.status || 'pending',
      createdAt: req.body.createdAt || new Date().toLocaleString('bn-BD')
    };
    db.emailRecoveries.unshift(item);
    writeDb(db);
    broadcast({
      type: 'email_recovery:created',
      recovery: item,
      timestamp: Date.now()
    });
    res.json(item);
  });

  app.put('/api/email-recoveries/:id/approve', (req: Request, res: Response) => {
    const db = readDb();
    if (!db.emailRecoveries) db.emailRecoveries = [];
    const rec = db.emailRecoveries.find(r => r.id === req.params.id);
    if (rec) {
      rec.status = 'completed';
      rec.decisionAt = new Date().toLocaleString('bn-BD');
      rec.decisionNote = req.body.decisionNote || 'অ্যাডমিন টিম কর্তৃক অনুমোদিত ও কল সম্পন্ন হয়েছে।';
      writeDb(db);
      broadcast({
        type: 'email_recovery:approved',
        recovery: rec,
        timestamp: Date.now()
      });
      return res.json(rec);
    }
    res.status(404).json({ error: 'Recovery request not found' });
  });

  app.put('/api/email-recoveries/:id/undo', (req: Request, res: Response) => {
    const db = readDb();
    if (!db.emailRecoveries) db.emailRecoveries = [];
    const rec = db.emailRecoveries.find(r => r.id === req.params.id);
    if (rec) {
      rec.status = 'pending';
      rec.decisionAt = undefined;
      rec.decisionNote = undefined;
      writeDb(db);
      broadcast({
        type: 'email_recovery:undone',
        recovery: rec,
        timestamp: Date.now()
      });
      return res.json(rec);
    }
    res.status(404).json({ error: 'Recovery request not found' });
  });

  app.delete('/api/email-recoveries/:id', (req: Request, res: Response) => {
    const db = readDb();
    if (!db.emailRecoveries) db.emailRecoveries = [];
    db.emailRecoveries = db.emailRecoveries.filter(r => r.id !== req.params.id);
    writeDb(db);
    broadcast({
      type: 'email_recovery:deleted',
      id: req.params.id,
      timestamp: Date.now()
    });
    res.json({ success: true, id: req.params.id });
  });

  // RESTRICT USER
  app.put('/api/users/:phone/restrict', (req: Request, res: Response) => {
    const db = readDb();
    const cleanPhone = String(req.params.phone || '').replace(/[^0-9]/g, '');
    const user = db.users.find(u => String(u.phone || '').replace(/[^0-9]/g, '') === cleanPhone);
    if (user) {
      user.isRestricted = Boolean(req.body.isRestricted);
      writeDb(db);
    }
    res.json(db.users);
  });

  // VERIFY USER NUMBER
  app.put('/api/users/:phone/verify-number', (req: Request, res: Response) => {
    const db = readDb();
    const cleanPhone = String(req.params.phone || '').replace(/[^0-9]/g, '');
    const user = db.users.find(u => String(u.phone || '').replace(/[^0-9]/g, '') === cleanPhone);
    if (user) {
      user.numberVerified = req.body.numberVerified !== undefined ? Boolean(req.body.numberVerified) : true;
      writeDb(db);
    }
    res.json(db.users);
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

    broadcast({
      type: 'catalog:updated',
      websites: db.customWebsites,
      timestamp: Date.now()
    });

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

      broadcast({
        type: 'catalog:updated',
        websites: db.customWebsites,
        timestamp: Date.now()
      });

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

    broadcast({
      type: 'catalog:updated',
      websites: db.customWebsites,
      timestamp: Date.now()
    });

    res.json(db.customWebsites);
  });

  // 5. DELIVERED CREDENTIALS
  app.get('/api/credentials', (req: Request, res: Response) => {
    const db = readDb();
    const creds = Array.isArray(db.deliveredCredentials) ? [...db.deliveredCredentials] : [];
    // Sort latest first
    creds.sort((a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0));

    // Deduplicate keeping ONLY the single freshest record per order / client website
    const deduplicated: any[] = [];
    for (const c of creds) {
      const safeOrderId = String(c.orderId || '').trim();
      const phoneDigits = String(c.userPhone || '').replace(/\D/g, '').slice(-10);
      const webCode = String(c.websiteCode || '').trim();
      const existingIdx = deduplicated.findIndex((x) => {
        const xOrder = String(x.orderId || '').trim();
        const xDigits = String(x.userPhone || '').replace(/\D/g, '').slice(-10);
        const xCode = String(x.websiteCode || '').trim();
        if (safeOrderId && xOrder && safeOrderId === xOrder) return true;
        if (phoneDigits && xDigits && phoneDigits === xDigits) {
          if (!webCode || !xCode || webCode === xCode) return true;
        }
        return false;
      });
      if (existingIdx === -1) {
        deduplicated.push(c);
      }
    }
    res.json(deduplicated);
  });

  app.post('/api/credentials', (req: Request, res: Response) => {
    const db = readDb();
    const cred = { ...req.body, updatedAt: Number(req.body.updatedAt) || Date.now() };
    const safeOrderId = String(cred.orderId || '').trim();
    const phoneDigits = String(cred.userPhone || '').replace(/\D/g, '').slice(-10);
    const webCode = String(cred.websiteCode || '').trim();
    const targetId = String(cred.id || '').trim();

    const currentList = Array.isArray(db.deliveredCredentials) ? db.deliveredCredentials : [];
    // Purge any older credentials for this order or client website
    db.deliveredCredentials = currentList.filter((c: any) => {
      const cOrder = String(c.orderId || '').trim();
      const cDigits = String(c.userPhone || '').replace(/\D/g, '').slice(-10);
      const cCode = String(c.websiteCode || '').trim();
      const cId = String(c.id || '').trim();
      if (targetId && cId && targetId === cId) return false;
      if (safeOrderId && cOrder && safeOrderId === cOrder) return false;
      if (phoneDigits && cDigits && phoneDigits === cDigits) {
        if (!webCode || !cCode || webCode === cCode) return false;
      }
      return true;
    });

    db.deliveredCredentials.unshift(cred);
    writeDb(db);

    broadcast({
      type: 'credential:delivered',
      credential: cred,
      timestamp: Date.now()
    });

    res.status(201).json(db.deliveredCredentials);
  });

  app.delete('/api/credentials/:id', (req: Request, res: Response) => {
    const db = readDb();
    const { id } = req.params;
    db.deliveredCredentials = db.deliveredCredentials.filter(c => c.id !== id);
    writeDb(db);
    res.json(db.deliveredCredentials);
  });

  // LOGO & BRAND SETTINGS ENDPOINTS
  app.get('/api/settings/logo', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.logoConfig || null);
  });

  app.post('/api/settings/logo', (req: Request, res: Response) => {
    const db = readDb();
    db.logoConfig = req.body;
    writeDb(db);
    broadcast({
      type: 'logo:updated',
      config: req.body,
      timestamp: Date.now()
    });
    res.json({ success: true, config: req.body });
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

    broadcast({
      type: 'reset:requested',
      request: newReq,
      timestamp: Date.now()
    });

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
      if (newPassword) {
        reqItem.newPasswordAssigned = newPassword;
        const matchingUser = db.users.find(u => u.phone === reqItem.phone);
        if (matchingUser) {
          matchingUser.password = newPassword;
        }
      }
      writeDb(db);

      broadcast({
        type: 'reset:resolved',
        request: reqItem,
        timestamp: Date.now()
      });

      if (newPassword) {
        broadcast({
          type: 'user:password_updated',
          phone: reqItem.phone,
          newPassword,
          timestamp: Date.now()
        });
      }

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
      customWebsites: Array.isArray(backupData.customWebsites)
        ? backupData.customWebsites 
        : [],
      deliveredCredentials: Array.isArray(backupData.deliveredCredentials) ? backupData.deliveredCredentials : [],
      resetRequests: Array.isArray(backupData.resetRequests) ? backupData.resetRequests : [],
      reports: Array.isArray(backupData.reports) ? backupData.reports : []
    };

    writeDb(newDb);

    broadcast({
      type: 'system:restored',
      timestamp: Date.now()
    });

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
      appType: 'custom'
    });
    app.use(vite.middlewares);

    // Reliable fallback for client-side routing on page refresh (custom appType gives Express full HTML routing control)
    app.get('*', async (req: Request, res: Response, next) => {
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/ws')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        try {
          template = await vite.transformIndexHtml(url, template);
        } catch {
          template = await vite.transformIndexHtml('/', template);
        }
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(template);
      } catch (e) {
        try {
          const rawHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
          res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(rawHtml);
        } catch (err) {
          next(e);
        }
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/ws')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      const distIndex = path.resolve(distPath, 'index.html');
      if (fs.existsSync(distIndex)) {
        return res.sendFile(distIndex);
      }
      res.sendFile(path.resolve(__dirname, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BongoWeb Realtime Full-Stack Server running on http://0.0.0.0:${PORT} (WS on /ws, SSE on /api/events)`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
