import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DB_FILE = path.resolve(__dirname, 'data', 'db.json');

// Ensure data folder exists
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

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
    users: [
      {
        name: 'Demo Client',
        phone: '01711223344',
        email: 'demo@bongoweb.xyz',
        password: 'demo',
        registeredAt: new Date().toLocaleDateString('bn-BD')
      }
    ],
    orders: [],
    supportChats: [],
    customWebsites: [],
    deliveredCredentials: [],
    resetRequests: []
  };
}

// Read DB from disk
function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
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

  // Full DB State
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
      const existingUser = db.users.find(u => u.phone === newOrder.phone);
      if (!existingUser) {
        db.users.push({
          name: newOrder.clientName || 'Valued Client',
          phone: newOrder.phone,
          email: newOrder.email || '',
          registeredAt: new Date().toLocaleDateString('bn-BD')
        });
      }
    }

    writeDb(db);
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
      u => u.phone === cleanPhone || u.email.toLowerCase() === cleanEmail
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
      u => (u.phone === cleanId || u.email.toLowerCase() === cleanId) && u.password === cleanPass
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
        thread.unreadAdminCount += 1;
        // User responded: reset 5-minute inactivity timer!
        thread.expiresAt = Date.now() + 5 * 60 * 1000;
        thread.isClosed = false;
      } else {
        thread.unreadClientCount += 1;
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

  // 4. WEBSITES CATALOG & STOCKS
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
      s => s.fourDigitCode.replace('#', '') === cleanCode
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
      s => s.fourDigitCode.replace('#', '') !== cleanCode
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
      customWebsites: Array.isArray(backupData.customWebsites) ? backupData.customWebsites : [],
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
