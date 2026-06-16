export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  isAvailable: boolean;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED';
  location: 'MAIN_ROOM' | 'TERRACE' | 'BAR';
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  items: OrderItem[];
  totalAmount: number;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  deliveryAddress?: string;
  notes?: string;
  status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface Reservation {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  tableId?: string;
  tableNumber?: string;
  guestCount: number;
  date: string;
  time: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
