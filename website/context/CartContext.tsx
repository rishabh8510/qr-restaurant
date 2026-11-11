"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CartItem {
  id: number | string;
  name: string;
  price: number | string;
  image: string;
  quantity: number;
  [key: string]: unknown;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number | string) => void;
  increaseQty: (id: number | string) => void;
  decreaseQty: (id: number | string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function readInitialTableNumber(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const urlTable = params.get("table") || params.get("t") || params.get("tableNumber");
    if (urlTable) {
      localStorage.setItem("cafe_table_number", urlTable);
      return urlTable;
    }
    return localStorage.getItem("cafe_table_number");
  } catch {
    return null;
  }
}

function readInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(readInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableNumber, setTableNumberState] = useState<string | null>(readInitialTableNumber);

  const setTableNumber = (t: string | null) => {
    setTableNumberState(t);
    if (typeof window !== "undefined") {
      if (t) {
        localStorage.setItem("cafe_table_number", t);
      } else {
        localStorage.removeItem("cafe_table_number");
      }
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch {
      // ignore local storage errors
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev: CartItem[]) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 } as CartItem];
    });
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const increaseQty = (id: number | string) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQty = (id: number | string) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        openCart,
        closeCart,
        tableNumber,
        setTableNumber,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
