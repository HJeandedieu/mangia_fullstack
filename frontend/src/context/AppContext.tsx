import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState, CartItem, MenuItem } from "../types";
import { authApi, subscribeToAuth } from "../api";
import { toast } from "sonner";

interface AppContextType {
  // Auth
  user: User | null;
  token: string | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: 'CUSTOMER' | 'ADMIN') => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(authApi.getCurrentState());
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Auth setup and syncing
  useEffect(() => {
    // Read initial auth state from localStorage
    const state = authApi.getCurrentState();
    setAuthState(state);
    setIsAuthLoading(false);

    // Subscribe to external/internal state updates
    const unsubscribe = subscribeToAuth((updatedState) => {
      setAuthState(updatedState);
    });

    return () => unsubscribe();
  }, []);

  // Sync / Load Cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("mangia_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  // Save Cart to local storage on edits
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("mangia_cart", JSON.stringify(newCart));
  };

  // Auth operations
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsAuthLoading(true);
      await authApi.login(email, password);
      toast.success("Welcome back to Mangia!");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to log in. Please check credentials.");
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role?: 'CUSTOMER' | 'ADMIN'): Promise<boolean> => {
    try {
      setIsAuthLoading(true);
      await authApi.register(name, email, password, role);
      toast.success("Account successfully created! Welcome to Mangia.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setCart([]);
      localStorage.removeItem("mangia_cart");
      toast.success("Logged out successfully. See you soon!");
    } catch (err: any) {
      toast.error(err.message || "Failed to log out correctly.");
    }
  };

  // Cart operations
  const addToCart = (menuItem: MenuItem, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.menuItem.id === menuItem.id);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { menuItem, quantity }];
    }

    saveCart(updatedCart);
    toast.success(`Added ${menuItem.name} to your selection.`);
  };

  const removeFromCart = (menuItemId: string) => {
    const updatedCart = cart.filter(item => item.menuItem.id !== menuItemId);
    saveCart(updatedCart);
    toast.info("Item removed from your cart.");
  };

  const updateCartQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    const updatedCart = cart.map(item =>
      item.menuItem.id === menuItemId ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);

  return (
    <AppContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthLoading,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used inside an AppProvider");
  }
  return context;
};
