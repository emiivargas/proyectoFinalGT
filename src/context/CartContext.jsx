import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "gen-t:cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url || "",
          qty: 1,
        },
      ];
    });
  };

  const removeFromCart = (id) => setItems((prev) => prev.filter((x) => x.id !== id));
  const setQty = (id, qty) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)));
  const clearCart = () => setItems([]);

  const count = useMemo(() => items.reduce((acc, it) => acc + it.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, it) => acc + it.qty * it.price, 0), [items]);

  const value = { items, addToCart, removeFromCart, setQty, clearCart, count, subtotal };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
