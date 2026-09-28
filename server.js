// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var PORT = parseInt(process.env.PORT || "3000", 10);
var DB_FILE = path.resolve(__dirname, "data", "db.json");
var dataDir = path.resolve(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
function getInitialDb() {
  return {
    adminConfig: {
      adminId: "admin",
      adminEntryPassword: "admin123",
      adminActionPassword: "confirm786",
      masterKey: "MASTER-BONGO-2026"
    },
    users: [
      {
        name: "Demo Client",
        phone: "01711223344",
        email: "demo@bongoweb.xyz",
        password: "demo",
        registeredAt: (/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD")
      }
    ],
    orders: [],
    supportChats: [],
    customWebsites: [],
    deliveredCredentials: [],
    resetRequests: []
  };
}
function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading db.json, returning initial db:", err);
  }
  const init = getInitialDb();
  writeDb(init);
  return init;
}
function writeDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}
async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  readDb();
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/data", (req, res) => {
    const db = readDb();
    res.json(db);
  });
  app.get("/api/orders", (req, res) => {
    const db = readDb();
    res.json(db.orders || []);
  });
  app.post("/api/orders", (req, res) => {
    const db = readDb();
    const newOrder = req.body;
    if (!newOrder.orderId) {
      newOrder.orderId = `#BW-${Math.floor(1e4 + Math.random() * 9e4)}`;
    }
    if (!newOrder.createdAt) {
      newOrder.createdAt = (/* @__PURE__ */ new Date()).toLocaleString("bn-BD");
    }
    db.orders.unshift(newOrder);
    if (newOrder.phone) {
      const existingUser = db.users.find((u) => u.phone === newOrder.phone);
      if (!existingUser) {
        db.users.push({
          name: newOrder.clientName || "Valued Client",
          phone: newOrder.phone,
          email: newOrder.email || "",
          registeredAt: (/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD")
        });
      }
    }
    writeDb(db);
    res.status(201).json(newOrder);
  });
  app.put("/api/orders/:orderId/status", (req, res) => {
    const db = readDb();
    const { orderId } = req.params;
    const { status } = req.body;
    const order = db.orders.find((o) => o.orderId === orderId);
    if (order) {
      order.status = status;
      writeDb(db);
      res.json(db.orders);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });
  app.get("/api/users", (req, res) => {
    const db = readDb();
    res.json(db.users || []);
  });
  app.post("/api/users/register", (req, res) => {
    const db = readDb();
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, error: "\u09B8\u09AC\u0997\u09C1\u09B2\u09CB \u09A4\u09A5\u09CD\u09AF \u09AA\u09C2\u09B0\u09A3 \u0995\u09B0\u09C1\u09A8\u0964" });
    }
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();
    const exists = db.users.some(
      (u) => u.phone === cleanPhone || u.email.toLowerCase() === cleanEmail
    );
    if (exists) {
      return res.status(400).json({
        success: false,
        error: "\u098F\u0987 \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0 \u09AC\u09BE \u0987\u09AE\u09C7\u0987\u09B2 \u09A6\u09BF\u09DF\u09C7 \u0987\u09A4\u09BF\u09AE\u09A7\u09CD\u09AF\u09C7 \u098F\u0995\u099F\u09BF \u0985\u09CD\u09AF\u09BE\u0995\u09BE\u0989\u09A8\u09CD\u099F \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7!"
      });
    }
    const newUser = {
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      password: password ? password.trim() : void 0,
      registeredAt: (/* @__PURE__ */ new Date()).toLocaleDateString("bn-BD")
    };
    db.users.push(newUser);
    writeDb(db);
    res.status(201).json({ success: true, user: newUser });
  });
  app.post("/api/users/login", (req, res) => {
    const db = readDb();
    const { identifier, password } = req.body;
    const cleanId = (identifier || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();
    const user = db.users.find(
      (u) => (u.phone === cleanId || u.email.toLowerCase() === cleanId) && u.password === cleanPass
    );
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: "\u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09A8\u09AE\u09CD\u09AC\u09B0/\u0987\u09AE\u09C7\u0987\u09B2 \u0985\u09A5\u09AC\u09BE \u09AA\u09BE\u09B8\u0993\u09DF\u09BE\u09B0\u09CD\u09A1 \u09B8\u09A0\u09BF\u0995 \u09A8\u09DF!" });
    }
  });
  app.get("/api/chat/threads", (req, res) => {
    const db = readDb();
    res.json(db.supportChats || []);
  });
  app.get("/api/chat/thread/:phone", (req, res) => {
    const db = readDb();
    const { phone } = req.params;
    const thread = db.supportChats.find((t) => t.userPhone === phone);
    res.json(thread || null);
  });
  app.post("/api/chat/activate", (req, res) => {
    const db = readDb();
    const { name, phone, language, welcomeText } = req.body;
    const cleanPhone = (phone || "").trim();
    const cleanName = (name || "").trim();
    const welcomeMsg = {
      id: `init-${Date.now()}`,
      sender: "admin",
      text: welcomeText || (language === "bn" ? `\u09B8\u09CD\u09AC\u09BE\u0997\u09A4\u09AE ${cleanName}! BongoWeb \u09B2\u09BE\u0987\u09AD \u09B8\u09BE\u09AA\u09CB\u09B0\u09CD\u099F \u099F\u09BF\u09AE \u0986\u09AA\u09A8\u09BE\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AF\u09C1\u0995\u09CD\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7\u09A8\u0964 \u0986\u09AA\u09A8\u09BE\u09B0 \u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u099C\u09BF\u099C\u09CD\u099E\u09BE\u09B8\u09BE \u098F\u0996\u09BE\u09A8\u09C7 \u09B2\u09BF\u0996\u09C1\u09A8:` : `Welcome ${cleanName}! A BongoWeb live support specialist has joined the chat. How can we help you today?`),
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    let thread = db.supportChats.find((t) => t.userPhone === cleanPhone);
    const expiresAt = Date.now() + 5 * 60 * 1e3;
    if (thread) {
      thread.userName = cleanName;
      thread.language = language || "bn";
      thread.lastMessage = welcomeMsg.text;
      thread.lastUpdated = "\u098F\u0996\u09A8\u0987";
      thread.expiresAt = expiresAt;
      thread.isClosed = false;
      if (!thread.messages || thread.messages.length === 0) {
        thread.messages = [welcomeMsg];
      }
    } else {
      thread = {
        userPhone: cleanPhone,
        userName: cleanName,
        language: language || "bn",
        lastMessage: welcomeMsg.text,
        lastUpdated: "\u098F\u0996\u09A8\u0987",
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
  app.post("/api/chat/message", (req, res) => {
    const db = readDb();
    const { phone, sender, text, name, message } = req.body;
    const cleanPhone = (phone || "").trim();
    const msg = message || {
      id: `${sender}-${Date.now()}`,
      sender,
      text,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    let thread = db.supportChats.find((t) => t.userPhone === cleanPhone);
    if (thread) {
      thread.messages.push(msg);
      thread.lastMessage = msg.text;
      thread.lastUpdated = "\u098F\u0996\u09A8\u0987";
      if (sender === "client") {
        thread.unreadAdminCount += 1;
        thread.expiresAt = Date.now() + 5 * 60 * 1e3;
        thread.isClosed = false;
      } else {
        thread.unreadClientCount += 1;
      }
    } else {
      thread = {
        userPhone: cleanPhone,
        userName: name || "Client",
        lastMessage: msg.text,
        lastUpdated: "\u098F\u0996\u09A8\u0987",
        unreadAdminCount: sender === "client" ? 1 : 0,
        unreadClientCount: sender === "admin" ? 1 : 0,
        expiresAt: Date.now() + 5 * 60 * 1e3,
        isClosed: false,
        messages: [msg]
      };
      db.supportChats.unshift(thread);
    }
    writeDb(db);
    res.json(msg);
  });
  app.post("/api/chat/extend", (req, res) => {
    const db = readDb();
    const { phone, additionalMinutes = 5 } = req.body;
    const thread = db.supportChats.find((t) => t.userPhone === phone);
    if (thread) {
      const base = thread.expiresAt && thread.expiresAt > Date.now() ? thread.expiresAt : Date.now();
      thread.expiresAt = base + additionalMinutes * 60 * 1e3;
      thread.isClosed = false;
      thread.additionalMinutesAdded = (thread.additionalMinutesAdded || 0) + additionalMinutes;
      writeDb(db);
      res.json({ success: true, expiresAt: thread.expiresAt });
    } else {
      res.status(404).json({ error: "Thread not found" });
    }
  });
  app.post("/api/chat/end", (req, res) => {
    const db = readDb();
    const { phone } = req.body;
    const idx = db.supportChats.findIndex((t) => t.userPhone === phone);
    if (idx >= 0) {
      db.supportChats.splice(idx, 1);
      writeDb(db);
    }
    res.json({ success: true });
  });
  app.get("/api/websites", (req, res) => {
    const db = readDb();
    res.json(db.customWebsites || []);
  });
  app.post("/api/websites", (req, res) => {
    const db = readDb();
    const newSite = req.body;
    db.customWebsites.unshift(newSite);
    writeDb(db);
    res.status(201).json(db.customWebsites);
  });
  app.put("/api/websites/:code", (req, res) => {
    const db = readDb();
    const { code } = req.params;
    const cleanCode = code.replace("#", "");
    const updateData = req.body;
    const idx = db.customWebsites.findIndex(
      (s) => s.fourDigitCode.replace("#", "") === cleanCode
    );
    if (idx >= 0) {
      db.customWebsites[idx] = { ...db.customWebsites[idx], ...updateData };
      writeDb(db);
      res.json(db.customWebsites);
    } else {
      res.status(404).json({ error: "Website not found" });
    }
  });
  app.delete("/api/websites/:code", (req, res) => {
    const db = readDb();
    const { code } = req.params;
    const cleanCode = code.replace("#", "");
    db.customWebsites = db.customWebsites.filter(
      (s) => s.fourDigitCode.replace("#", "") !== cleanCode
    );
    writeDb(db);
    res.json(db.customWebsites);
  });
  app.get("/api/credentials", (req, res) => {
    const db = readDb();
    res.json(db.deliveredCredentials || []);
  });
  app.post("/api/credentials", (req, res) => {
    const db = readDb();
    const cred = req.body;
    db.deliveredCredentials.unshift(cred);
    writeDb(db);
    res.status(201).json(db.deliveredCredentials);
  });
  app.delete("/api/credentials/:id", (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.deliveredCredentials = db.deliveredCredentials.filter((c) => c.id !== id);
    writeDb(db);
    res.json(db.deliveredCredentials);
  });
  app.get("/api/resets", (req, res) => {
    const db = readDb();
    res.json(db.resetRequests || []);
  });
  app.post("/api/resets", (req, res) => {
    const db = readDb();
    const newReq = req.body;
    db.resetRequests.unshift(newReq);
    writeDb(db);
    res.status(201).json(newReq);
  });
  app.put("/api/resets/:id", (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const { status, newPassword } = req.body;
    const reqItem = db.resetRequests.find((r) => r.id === id);
    if (reqItem) {
      reqItem.status = status;
      reqItem.resolvedAt = (/* @__PURE__ */ new Date()).toLocaleString("bn-BD");
      if (newPassword) reqItem.newPasswordAssigned = newPassword;
      writeDb(db);
      res.json(db.resetRequests);
    } else {
      res.status(404).json({ error: "Request not found" });
    }
  });
  app.get("/api/backup/export", (req, res) => {
    const db = readDb();
    res.json({
      exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
      platform: "BongoWeb.xyz Complete Production Vault",
      version: "4.0.0",
      totalUsers: db.users.length,
      totalOrders: db.orders.length,
      totalCustomWebsites: db.customWebsites.length,
      totalChatThreads: db.supportChats.length,
      totalDeliveredCredentials: db.deliveredCredentials.length,
      totalResetRequests: db.resetRequests.length,
      ...db
    });
  });
  app.post("/api/backup/restore", (req, res) => {
    const backupData = req.body;
    if (!backupData) {
      return res.status(400).json({ success: false, error: "No backup data provided" });
    }
    const newDb = {
      adminConfig: backupData.adminConfig || {
        adminId: "admin",
        adminEntryPassword: "admin123",
        adminActionPassword: "confirm786",
        masterKey: "MASTER-BONGO-2026"
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
      message: "\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u099C \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09B0\u09BF\u09B8\u09CD\u099F\u09CB\u09B0 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
      recordsRestored: {
        users: newDb.users.length,
        orders: newDb.orders.length,
        websites: newDb.customWebsites.length,
        chats: newDb.supportChats.length
      }
    });
  });
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} BongoWeb Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
