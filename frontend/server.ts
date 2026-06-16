import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  passwordHash: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  isAvailable: boolean;
}

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED';
  location: 'MAIN_ROOM' | 'TERRACE' | 'BAR';
}

interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  deliveryAddress?: string;
  notes?: string;
  status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

interface Reservation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  tableId?: string;
  tableNumber?: string;
  guestCount: number;
  date: string;
  time: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

// In-Memory Database State
const db = {
  users: [
    {
      id: "u-1",
      name: "Chef Vito",
      email: "admin@mangia.com",
      role: "ADMIN" as const,
      passwordHash: "admin123"
    },
    {
      id: "u-2",
      name: "Sarah Jenkins",
      email: "customer@mangia.com",
      role: "CUSTOMER" as const,
      passwordHash: "customer123"
    }
  ] as User[],
  categories: [
    { id: "cat-1", name: "Appetizers", description: "Elegant starters to stimulate your palate before the main course." },
    { id: "cat-2", name: "First Courses", description: "Freshly made artisanal pasta, risottos, and traditional grain dishes." },
    { id: "cat-3", name: "Main Courses", description: "Prime selected meats, freshly caught seafood, and classic main entrees." },
    { id: "cat-4", name: "Desserts", description: "Decadent, signature house-rolled Italian desserts and sweet endings." }
  ] as Category[],
  menuItems: [
    {
      id: "menu-1",
      name: "Bruschetta Classica",
      description: "Grilled garlic-rubbed rustico sourdough, marinated vine tomatoes, sweet basil, aged balsamic glaze, and Dop extra virgin olive oil.",
      price: 14.50,
      image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80",
      categoryId: "cat-1",
      isAvailable: true
    },
    {
      id: "menu-2",
      name: "Burrata alla Caprese",
      description: "Creamy fresh burrata cheese from Puglia, wild garden rocket, heirloom cherry tomatoes, cold-pressed olive olive, and fresh pesto.",
      price: 18.00,
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
      categoryId: "cat-1",
      isAvailable: true
    },
    {
      id: "menu-3",
      name: "Tagliatelle alla Bolognese",
      description: "Traditional handmade egg pasta ribbons tossed in a slow-braised ragù of select beef, milk-fed veal, pancetta, and finished with red wine and fine Grana Padano.",
      price: 24.50,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
      categoryId: "cat-2",
      isAvailable: true
    },
    {
      id: "menu-4",
      name: "Gnocchi al Tartufo e Funghi",
      description: "Delicate cloud-like potato dumplings sautéed with forest mushrooms, wild Porcini, finished in a luxurious black truffle cream sauce.",
      price: 27.00,
      image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
      categoryId: "cat-2",
      isAvailable: true
    },
    {
      id: "menu-5",
      name: "Costata di Bue al Rosmarino",
      description: "Grilled prime cut dry-aged ribeye steak with a crust of sea salt, fresh crack-basil oil rosemary, and extra-virgin olive oil serve alongside roasted tubers.",
      price: 44.00,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      categoryId: "cat-3",
      isAvailable: true
    },
    {
      id: "menu-6",
      name: "Filetto di Branzino",
      description: "Pan-roasted Mediterranean Sea Bass, cherry tomatoes, capers, kalamata olives, white wine reduction sauce, served over braised greens.",
      price: 36.00,
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
      categoryId: "cat-3",
      isAvailable: true
    },
    {
      id: "menu-7",
      name: "Tiramisù Tradizionale",
      description: "Light and creamy signature Italian classic with rich espresso-soaked ladyfingers, velvety whipped mascarpone folders, and finished elegantly with Dutch cocoa powder dusting.",
      price: 12.00,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
      categoryId: "cat-4",
      isAvailable: true
    },
    {
      id: "menu-8",
      name: "Panna Cotta ai Frutti di Bosco",
      description: "Silky Madagascar vanilla bean chilled custard, generously draped with a glaze of wild seasonal berries syrup.",
      price: 11.00,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
      categoryId: "cat-4",
      isAvailable: true
    }
  ] as MenuItem[],
  tables: [
    { id: "tab-1", number: "101", capacity: 2, status: "AVAILABLE", location: "MAIN_ROOM" },
    { id: "tab-2", number: "102", capacity: 4, status: "AVAILABLE", location: "MAIN_ROOM" },
    { id: "tab-3", number: "103", capacity: 6, status: "AVAILABLE", location: "MAIN_ROOM" },
    { id: "tab-4", number: "201", capacity: 2, status: "AVAILABLE", location: "TERRACE" },
    { id: "tab-5", number: "202", capacity: 4, status: "AVAILABLE", location: "TERRACE" },
    { id: "tab-6", number: "301", capacity: 8, status: "AVAILABLE", location: "BAR" }
  ] as Table[],
  orders: [
    {
      id: "ord-1",
      userId: "u-2",
      userEmail: "customer@mangia.com",
      userName: "Sarah Jenkins",
      createdAt: new Date().toISOString(),
      orderType: "DELIVERY",
      deliveryAddress: "124 Via Roma, Apt 4B, New York, NY",
      notes: "Please leave the parcel with the door concierges. No plastic forks needed.",
      items: [
        { menuItemId: "menu-1", name: "Bruschetta Classica", quantity: 1, price: 14.50 },
        { menuItemId: "menu-3", name: "Tagliatelle alla Bolognese", quantity: 1, price: 24.50 },
        { menuItemId: "menu-7", name: "Tiramisù Tradizionale", quantity: 1, price: 12.00 }
      ],
      totalAmount: 51.00,
      status: "PREPARING"
    }
  ] as Order[],
  reservations: [
    {
      id: "res-1",
      userId: "u-2",
      userName: "Sarah Jenkins",
      userEmail: "customer@mangia.com",
      tableId: "tab-2",
      tableNumber: "102",
      guestCount: 4,
      date: "2026-06-20",
      time: "19:30",
      notes: "Celebrating a special wedding anniversary. We'd love a cozy layout corner if possible.",
      status: "CONFIRMED",
      createdAt: new Date().toISOString()
    }
  ] as Reservation[]
};

// Simple ID Generator Helper
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API v1 Routing - Middlewares
  const getAuthorizationUser = (req: express.Request): User | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.split(" ")[1];
    if (!token) return null;
    
    // Simplistic token structure check (e.g. token-u-1, token-u-2)
    const userId = token.replace("token-", "");
    return db.users.find(u => u.id === userId) || null;
  };

  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = getAuthorizationUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized access. Please log in first." });
    }
    (req as any).user = user;
    next();
  };

  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = getAuthorizationUser(req);
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access forbidden. Admin role required." });
    }
    (req as any).user = user;
    next();
  };

  // --- Auth Endpoints ---
  app.post("/api/v1/auth/register", (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields: name, email, and password." });
    }
    
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "User already registered with this email address." });
    }

    const newUser: User = {
      id: generateId("u"),
      name,
      email: email.toLowerCase(),
      role: role === "ADMIN" ? "ADMIN" : "CUSTOMER",
      passwordHash: password // Mock hashing
    };

    db.users.push(newUser);

    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    res.status(201).json({
      token: `token-${newUser.id}`,
      user: safeUser
    });
  });

  app.post("/api/v1/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.passwordHash !== password) {
      return res.status(400).json({ error: "Invalid email credentials or incorrect password." });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({
      token: `token-${user.id}`,
      user: safeUser
    });
  });

  app.post("/api/v1/auth/logout", (req, res) => {
    res.json({ success: true, message: "Logged out successfully." });
  });

  // --- Categories CRM Endpoints ---
  app.get("/api/v1/categories", (req, res) => {
    res.json(db.categories);
  });

  app.get("/api/v1/categories/:id", (req, res) => {
    const cat = db.categories.find(c => c.id === req.params.id);
    if (!cat) return res.status(404).json({ error: "Category not found." });
    res.json(cat);
  });

  app.post("/api/v1/categories", requireAdmin, (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required." });
    
    const newCategory: Category = {
      id: generateId("cat"),
      name,
      description: description || ""
    };
    db.categories.push(newCategory);
    res.status(201).json(newCategory);
  });

  app.put("/api/v1/categories/:id", requireAdmin, (req, res) => {
    const { name, description } = req.body;
    const catIndex = db.categories.findIndex(c => c.id === req.params.id);
    if (catIndex === -1) return res.status(404).json({ error: "Category not found." });

    db.categories[catIndex] = {
      ...db.categories[catIndex],
      name: name || db.categories[catIndex].name,
      description: description !== undefined ? description : db.categories[catIndex].description
    };
    res.json(db.categories[catIndex]);
  });

  app.delete("/api/v1/categories/:id", requireAdmin, (req, res) => {
    const catIndex = db.categories.findIndex(c => c.id === req.params.id);
    if (catIndex === -1) return res.status(404).json({ error: "Category not found." });
    
    db.categories.splice(catIndex, 1);
    res.json({ success: true, message: "Category deleted." });
  });

  // --- MenuItems CRM Endpoints ---
  app.get("/api/v1/menu-items", (req, res) => {
    res.json(db.menuItems);
  });

  app.get("/api/v1/menu-items/:id", (req, res) => {
    const item = db.menuItems.find(m => m.id === req.params.id);
    if (!item) return res.status(404).json({ error: "Menu item not found." });
    res.json(item);
  });

  app.post("/api/v1/menu-items", requireAdmin, (req, res) => {
    const { name, description, price, image, categoryId, isAvailable } = req.body;
    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({ error: "Required fields missing for menu item: name, price, categoryId." });
    }

    const newItem: MenuItem = {
      id: generateId("menu"),
      name,
      description: description || "",
      price: parseFloat(price),
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      categoryId,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    };
    db.menuItems.push(newItem);
    res.status(201).json(newItem);
  });

  app.put("/api/v1/menu-items/:id", requireAdmin, (req, res) => {
    const itemIndex = db.menuItems.findIndex(m => m.id === req.params.id);
    if (itemIndex === -1) return res.status(404).json({ error: "Menu item not found." });

    const { name, description, price, image, categoryId, isAvailable } = req.body;

    db.menuItems[itemIndex] = {
      ...db.menuItems[itemIndex],
      name: name || db.menuItems[itemIndex].name,
      description: description !== undefined ? description : db.menuItems[itemIndex].description,
      price: price !== undefined ? parseFloat(price) : db.menuItems[itemIndex].price,
      image: image !== undefined ? image : db.menuItems[itemIndex].image,
      categoryId: categoryId || db.menuItems[itemIndex].categoryId,
      isAvailable: isAvailable !== undefined ? isAvailable : db.menuItems[itemIndex].isAvailable
    };
    res.json(db.menuItems[itemIndex]);
  });

  app.delete("/api/v1/menu-items/:id", requireAdmin, (req, res) => {
    const itemIndex = db.menuItems.findIndex(m => m.id === req.params.id);
    if (itemIndex === -1) return res.status(404).json({ error: "Menu item not found." });

    db.menuItems.splice(itemIndex, 1);
    res.json({ success: true, message: "Menu item deleted successfully." });
  });

  // --- Tables CRM Endpoints ---
  app.get("/api/v1/tables", (req, res) => {
    res.json(db.tables);
  });

  app.get("/api/v1/tables/:id", (req, res) => {
    const table = db.tables.find(t => t.id === req.params.id);
    if (!table) return res.status(404).json({ error: "Table not found." });
    res.json(table);
  });

  app.post("/api/v1/tables", requireAdmin, (req, res) => {
    const { number, capacity, status, location } = req.body;
    if (!number || !capacity) {
      return res.status(400).json({ error: "Table number and capacity are required." });
    }

    const newTable: Table = {
      id: generateId("tab"),
      number: String(number),
      capacity: parseInt(capacity),
      status: status || "AVAILABLE",
      location: location || "MAIN_ROOM"
    };
    db.tables.push(newTable);
    res.status(201).json(newTable);
  });

  app.put("/api/v1/tables/:id", requireAdmin, (req, res) => {
    const tIndex = db.tables.findIndex(t => t.id === req.params.id);
    if (tIndex === -1) return res.status(404).json({ error: "Table not found." });

    const { number, capacity, status, location } = req.body;

    db.tables[tIndex] = {
      ...db.tables[tIndex],
      number: number !== undefined ? String(number) : db.tables[tIndex].number,
      capacity: capacity !== undefined ? parseInt(capacity) : db.tables[tIndex].capacity,
      status: status || db.tables[tIndex].status,
      location: location || db.tables[tIndex].location
    };
    res.json(db.tables[tIndex]);
  });

  app.delete("/api/v1/tables/:id", requireAdmin, (req, res) => {
    const tIndex = db.tables.findIndex(t => t.id === req.params.id);
    if (tIndex === -1) return res.status(404).json({ error: "Table not found." });

    db.tables.splice(tIndex, 1);
    res.json({ success: true, message: "Table deleted." });
  });

  // --- Orders Endpoints ---
  app.get("/api/v1/orders", requireAdmin, (req, res) => {
    // Sort orders from newest to oldest
    const sortedOrders = [...db.orders].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(sortedOrders);
  });

  app.get("/api/v1/orders/my", requireAuth, (req, res) => {
    const user = (req as any).user;
    const myOrders = db.orders.filter(o => o.userId === user.id);
    const sorted = [...myOrders].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(sorted);
  });

  app.post("/api/v1/orders", requireAuth, (req, res) => {
    const user = (req as any).user;
    const { items, orderType, deliveryAddress, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "An order must contain at least one item." });
    }

    if (!orderType || !["DINE_IN", "TAKEAWAY", "DELIVERY"].includes(orderType)) {
      return res.status(400).json({ error: "Valid OrderType is required ('DINE_IN' | 'TAKEAWAY' | 'DELIVERY')." });
    }

    if (orderType === "DELIVERY" && !deliveryAddress) {
      return res.status(400).json({ error: "Delivery address is required for DELIVERY orders." });
    }

    // Resolve prices on server side
    const resolvedItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = db.menuItems.find(m => m.id === item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item with ID ${item.menuItemId} does not exist.` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ error: `Menu item ${menuItem.name} is currently unavailable.` });
      }
      
      const qty = parseInt(item.quantity) || 1;
      const price = menuItem.price;
      resolvedItems.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: qty,
        price
      });
      totalAmount += price * qty;
    }

    const newOrder: Order = {
      id: generateId("ord"),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      items: resolvedItems,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      orderType,
      deliveryAddress,
      notes,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    res.status(201).json(newOrder);
  });

  app.patch("/api/v1/orders/:id/status", requireAdmin, (req, res) => {
    const { status } = req.body;
    if (!status || !["PENDING", "PREPARING", "COMPLETED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status code provided for order." });
    }

    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found." });

    order.status = status;
    res.json(order);
  });

  // --- Reservations Endpoints ---
  app.get("/api/v1/reservations", requireAdmin, (req, res) => {
    const sorted = [...db.reservations].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(sorted);
  });

  app.get("/api/v1/reservations/my", requireAuth, (req, res) => {
    const user = (req as any).user;
    const myRes = db.reservations.filter(r => r.userId === user.id);
    const sorted = [...myRes].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(sorted);
  });

  app.post("/api/v1/reservations", requireAuth, (req, res) => {
    const user = (req as any).user;
    const { guestCount, date, time, notes, tableId } = req.body;

    if (!guestCount || !date || !time) {
      return res.status(400).json({ error: "Missing required reservation specifications: guestCount, date, time." });
    }

    let tNumber = "";
    if (tableId) {
      const selectedTable = db.tables.find(t => t.id === tableId);
      if (!selectedTable) {
        return res.status(400).json({ error: "Specified table does not exist." });
      }
      tNumber = selectedTable.number;
      // Mark table reserved in a simulated scenario (optional)
    } else {
      // Find a matching table automatically based on guestCount
      const eligibleTable = db.tables.find(t => t.capacity >= guestCount && t.status === "AVAILABLE");
      if (eligibleTable) {
        eligibleTable.status = "RESERVED";
        tNumber = eligibleTable.number;
      }
    }

    const newRes: Reservation = {
      id: generateId("res"),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      tableId,
      tableNumber: tNumber || "TBD",
      guestCount: parseInt(guestCount),
      date,
      time,
      notes,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    db.reservations.push(newRes);
    res.status(201).json(newRes);
  });

  app.patch("/api/v1/reservations/:id/status", requireAdmin, (req, res) => {
    const { status } = req.body;
    if (!status || !["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ error: "Invalid reservation status, must be 'PENDING', 'CONFIRMED' or 'CANCELLED'." });
    }

    const resItem = db.reservations.find(r => r.id === req.params.id);
    if (!resItem) return res.status(404).json({ error: "Reservation not found." });

    resItem.status = status;
    res.json(resItem);
  });


  // --- Vite & Production static files middlewares ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mangia App Server running on http://localhost:${PORT}`);
  });
}

startServer();
