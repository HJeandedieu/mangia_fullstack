import { Category, MenuItem, Table, Order, Reservation, AuthState, User, UserRole } from "./types";

const BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || "/api/v1";

// Model mapping adapters for dual-compatibility (Local dev vs True backend DB)
function mapMenuItemFromReceive(item: any): MenuItem {
  const img = item.imageUrl || item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
  const avail = item.available !== undefined ? item.available : (item.isAvailable !== undefined ? item.isAvailable : true);
  return {
    ...item,
    image: img,
    imageUrl: img,
    isAvailable: avail,
    available: avail,
    price: typeof item.price === "string" ? parseFloat(item.price) : Number(item.price || 0)
  };
}

function mapMenuItemToSend(item: any) {
  return {
    name: item.name,
    description: item.description || "",
    price: typeof item.price === "string" ? parseFloat(item.price) : Number(item.price || 0),
    imageUrl: item.imageUrl || item.image || "",
    image: item.image || item.imageUrl || "",
    available: item.available !== undefined ? item.available : (item.isAvailable !== undefined ? item.isAvailable : true),
    isAvailable: item.isAvailable !== undefined ? item.isAvailable : (item.available !== undefined ? item.available : true),
    categoryId: item.categoryId
  };
}

function mapTableFromReceive(table: any): Table {
  const num = table.tableNumber !== undefined ? String(table.tableNumber) : (table.number || "");
  const tblNumber = table.tableNumber !== undefined ? table.tableNumber : (table.number ? parseInt(table.number) || 0 : 0);
  return {
    ...table,
    number: num,
    tableNumber: tblNumber,
    status: table.status || "AVAILABLE",
    location: table.location || "MAIN_ROOM"
  };
}

function mapTableToSend(table: any) {
  const tblNumber = table.tableNumber !== undefined ? table.tableNumber : (table.number ? parseInt(table.number) || 0 : 0);
  return {
    tableNumber: tblNumber,
    number: String(tblNumber),
    capacity: Number(table.capacity || 2),
    status: table.status || "AVAILABLE",
    location: table.location || "MAIN_ROOM"
  };
}

function mapOrderFromReceive(order: any): Order {
  const mappedItems = (order.items || []).map((item: any) => {
    const name = item.name || (item.menuItem && item.menuItem.name) || "Unknown Item";
    const rawPrice = item.price !== undefined ? item.price : (item.unitPrice !== undefined ? item.unitPrice : (item.menuItem && item.menuItem.price) || 0);
    const price = typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice);
    
    return {
      menuItemId: item.menuItemId,
      name,
      quantity: Number(item.quantity || 1),
      price
    };
  });

  const totalAmount = typeof order.totalAmount === "string" ? parseFloat(order.totalAmount) : Number(order.totalAmount || 0);

  return {
    ...order,
    items: mappedItems,
    totalAmount
  };
}

function mapReservationFromReceive(res: any): Reservation {
  const dateObj = new Date(res.reservationDate || res.date);
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const localDate = `${year}-${month}-${day}`;
  
  const hour = String(dateObj.getHours()).padStart(2, "0");
  const minute = String(dateObj.getMinutes()).padStart(2, "0");
  const localTime = `${hour}:${minute}`;

  const tableNum = res.table?.tableNumber !== undefined ? String(res.table.tableNumber) : (res.tableNumber || (res.table?.number) || "");

  let safeStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' = "PENDING";
  if (res.status === "APPROVED" || res.status === "CONFIRMED") {
    safeStatus = "CONFIRMED";
  } else if (res.status === "CANCELLED" || res.status === "REJECTED") {
    safeStatus = "CANCELLED";
  }

  return {
    id: res.id,
    userId: res.customerId || res.userId || "",
    userName: res.customer?.name || res.userName || "",
    userEmail: res.customer?.email || res.userEmail || "",
    tableId: res.tableId,
    tableNumber: tableNum,
    guestCount: Number(res.guestCount || 1),
    date: localDate,
    time: localTime,
    notes: res.notes || "",
    status: safeStatus,
    createdAt: res.createdAt || new Date().toISOString()
  };
}

// Helper to get token from storage
export function getSavedToken(): string | null {
  return localStorage.getItem("mangia_token");
}

export function getSavedUser(): User | null {
  const userJson = localStorage.getItem("mangia_user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (error) {
    return null;
  }
}

// Global state for auth listeners
type AuthListener = (state: AuthState) => void;
let authListeners: AuthListener[] = [];

export function subscribeToAuth(listener: AuthListener) {
  authListeners.push(listener);
  return () => {
    authListeners = authListeners.filter(l => l !== listener);
  };
}

function notifyAuthListeners(user: User | null, token: string | null) {
  authListeners.forEach(listener => listener({ user, token }));
}

// General fetch wrapper with token authentication handling and Envelope extraction
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getSavedToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMessage = "An unknown error occurred while contacting the server.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  const json = await response.json() as any;
  // Unwrap response envelope { success: true, message: "...", data: T } if present
  if (json && typeof json === "object" && "success" in json && "data" in json) {
    return json.data as T;
  }
  return json as T;
}

// Authentication Service Callbacks
export const authApi = {
  async register(name: string, email: string, password: string, role: UserRole = "CUSTOMER"): Promise<AuthState> {
    const data = await request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role })
    });
    const mappedToken = data.token;
    const mappedUser = data.user;
    if (mappedToken && mappedUser) {
      localStorage.setItem("mangia_token", mappedToken);
      localStorage.setItem("mangia_user", JSON.stringify(mappedUser));
      notifyAuthListeners(mappedUser, mappedToken);
    }
    return { user: mappedUser, token: mappedToken };
  },

  async login(email: string, password: string): Promise<AuthState> {
    const data = await request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    const mappedToken = data.token;
    const mappedUser = data.user;
    if (mappedToken && mappedUser) {
      localStorage.setItem("mangia_token", mappedToken);
      localStorage.setItem("mangia_user", JSON.stringify(mappedUser));
      notifyAuthListeners(mappedUser, mappedToken);
    }
    return { user: mappedUser, token: mappedToken };
  },

  async logout(): Promise<void> {
    try {
      await request("/auth/logout", { method: "POST" });
    } catch (_) {}
    localStorage.removeItem("mangia_token");
    localStorage.removeItem("mangia_user");
    notifyAuthListeners(null, null);
  },

  getCurrentState(): AuthState {
    return {
      user: getSavedUser(),
      token: getSavedToken()
    };
  }
};

// Categories Service Callbacks
export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    return request<Category[]>("/categories");
  },
  async getById(id: string): Promise<Category> {
    return request<Category>(`/categories/${id}`);
  },
  async create(name: string, description?: string): Promise<Category> {
    return request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify({ name, description })
    });
  },
  async update(id: string, name: string, description?: string): Promise<Category> {
    return request<Category>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, description })
    });
  },
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/categories/${id}`, {
      method: "DELETE"
    });
  }
};

// Menu Items Service Callbacks
export const menuItemsApi = {
  async getAll(): Promise<MenuItem[]> {
    const list = await request<any[]>("/menu-items");
    return list.map(mapMenuItemFromReceive);
  },
  async getById(id: string): Promise<MenuItem> {
    const raw = await request<any>(`/menu-items/${id}`);
    return mapMenuItemFromReceive(raw);
  },
  async create(item: Omit<MenuItem, "id">): Promise<MenuItem> {
    const payload = mapMenuItemToSend(item);
    const raw = await request<any>("/menu-items", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return mapMenuItemFromReceive(raw);
  },
  async update(id: string, item: Partial<MenuItem>): Promise<MenuItem> {
    const payload = mapMenuItemToSend(item);
    const raw = await request<any>(`/menu-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    return mapMenuItemFromReceive(raw);
  },
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/menu-items/${id}`, {
      method: "DELETE"
    });
  }
};

// Tables Service Callbacks
export const tablesApi = {
  async getAll(): Promise<Table[]> {
    const list = await request<any[]>("/tables");
    return list.map(mapTableFromReceive);
  },
  async getById(id: string): Promise<Table> {
    const raw = await request<any>(`/tables/${id}`);
    return mapTableFromReceive(raw);
  },
  async create(table: Omit<Table, "id">): Promise<Table> {
    const payload = mapTableToSend(table);
    const raw = await request<any>("/tables", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return mapTableFromReceive(raw);
  },
  async update(id: string, table: Partial<Table>): Promise<Table> {
    const payload = mapTableToSend(table);
    const raw = await request<any>(`/tables/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    return mapTableFromReceive(raw);
  },
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/tables/${id}`, {
      method: "DELETE"
    });
  }
};

// Orders Service Callbacks
export const ordersApi = {
  async getAdminOrders(): Promise<Order[]> {
    const list = await request<any[]>("/orders");
    return list.map(mapOrderFromReceive);
  },
  async getMyOrders(): Promise<Order[]> {
    const list = await request<any[]>("/orders/my");
    return list.map(mapOrderFromReceive);
  },
  async create(order: {
    items: { menuItemId: string; quantity: number }[];
    orderType: Order["orderType"];
    deliveryAddress?: string;
    notes?: string;
  }): Promise<Order> {
    const raw = await request<any>("/orders", {
      method: "POST",
      body: JSON.stringify(order)
    });
    return mapOrderFromReceive(raw);
  },
  async updateStatus(id: string, status: Order["status"]): Promise<Order> {
    const raw = await request<any>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    return mapOrderFromReceive(raw);
  }
};

// Reservations Service Callbacks
export const reservationsApi = {
  async getAdminReservations(): Promise<Reservation[]> {
    const list = await request<any[]>("/reservations");
    return list.map(mapReservationFromReceive);
  },
  async getMyReservations(): Promise<Reservation[]> {
    const list = await request<any[]>("/reservations/my");
    return list.map(mapReservationFromReceive);
  },
  async create(reservation: {
    guestCount: number;
    date: string;
    time: string;
    notes?: string;
    tableId?: string;
  }): Promise<Reservation> {
    // Format to ISO String expected by backend DB schema (reservationDate)
    let reservationDate = "";
    try {
      reservationDate = new Date(`${reservation.date}T${reservation.time}`).toISOString();
    } catch (_) {
      reservationDate = `${reservation.date}T${reservation.time}:00.000Z`;
    }

    // Auto-assignment fallback: if no tableId specified, fetch tables and pick the first capacity-satisfying option
    let resolvedTableId = reservation.tableId || "";
    if (!resolvedTableId) {
      try {
        const tables = await tablesApi.getAll();
        const suitable = tables.filter(t => t.capacity >= reservation.guestCount);
        if (suitable.length > 0) {
          resolvedTableId = suitable[0].id;
        } else if (tables.length > 0) {
          resolvedTableId = tables[0].id;
        }
      } catch (_) {}
    }

    const payload = {
      tableId: resolvedTableId,
      reservationDate,
      guestCount: Number(reservation.guestCount),
      notes: reservation.notes || ""
    };

    const raw = await request<any>("/reservations", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return mapReservationFromReceive(raw);
  },
  async updateStatus(id: string, status: Reservation["status"]): Promise<Reservation> {
    // Map standard CONFIRMED -> APPROVED for database-backed workflows
    const backendStatus = status === "CONFIRMED" ? "APPROVED" : status;
    const raw = await request<any>(`/reservations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: backendStatus })
    });
    return mapReservationFromReceive(raw);
  }
};
