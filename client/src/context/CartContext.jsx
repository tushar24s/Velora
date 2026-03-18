import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import api from "../utils/api";
import { buildGuestCart, getErrorMessage } from "../utils/helpers";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [guestItems, setGuestItems] = useLocalStorage("velora-guest-cart", []);
  const [cart, setCart] = useState(buildGuestCart(guestItems));
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const { notify } = useToast();

  const fetchServerCart = async () => {
    const { data } = await api.get("/cart");
    setCart(data);
    return data;
  };

  useEffect(() => {
    if (!user) {
      setCart(buildGuestCart(guestItems));
    }
  }, [guestItems, user]);

  useEffect(() => {
    const syncCart = async () => {
      if (!user) {
        return;
      }

      setLoading(true);

      try {
        if (guestItems.length > 0) {
          await api.post("/cart/sync", {
            items: guestItems.map((item) => ({
              productId: item.product._id,
              qty: item.qty,
            })),
          });
          setGuestItems([]);
        }

        await fetchServerCart();
      } catch (error) {
        notify({
          title: "Cart sync failed",
          message: getErrorMessage(error),
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    syncCart();
  }, [guestItems, notify, setGuestItems, user]);

  const addToCart = async (product, qty = 1) => {
    if (user) {
      try {
        const { data } = await api.post("/cart", { productId: product._id, qty });
        setCart(data);
        notify({
          title: "Added to cart",
          message: `${product.name} is ready in your bag.`,
          type: "success",
        });
        return true;
      } catch (error) {
        notify({
          title: "Could not add item",
          message: getErrorMessage(error),
          type: "error",
        });
        return false;
      }
    }

    setGuestItems((current) => {
      const existingItem = current.find((item) => item.product._id === product._id);

      if (existingItem) {
        return current.map((item) =>
          item.product._id === product._id
            ? { ...item, qty: Math.min(item.qty + qty, product.stock || 99) }
            : item
        );
      }

      return [...current, { product, qty }];
    });

    notify({
      title: "Added to cart",
      message: "Sign in later and your cart will sync automatically.",
      type: "success",
    });
    return true;
  };

  const updateQuantity = async (productId, qty) => {
    if (qty < 1) {
      return;
    }

    if (user) {
      try {
        const { data } = await api.put(`/cart/${productId}`, { qty });
        setCart(data);
      } catch (error) {
        notify({
          title: "Cart update failed",
          message: getErrorMessage(error),
          type: "error",
        });
      }

      return;
    }

    setGuestItems((current) =>
      current.map((item) => (item.product._id === productId ? { ...item, qty } : item))
    );
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const { data } = await api.delete(`/cart/${productId}`);
        setCart(data);
        notify({
          title: "Removed from cart",
          message: "Item removed from your bag.",
          type: "info",
        });
      } catch (error) {
        notify({
          title: "Remove failed",
          message: getErrorMessage(error),
          type: "error",
        });
      }

      return;
    }

    setGuestItems((current) => current.filter((item) => item.product._id !== productId));
  };

  const clearCart = async () => {
    if (user) {
      const { data } = await api.delete("/cart");
      setCart(data);
      return;
    }

    setGuestItems([]);
  };

  const openCart = () => setIsDrawerOpen(true);
  const closeCart = () => setIsDrawerOpen(false);
  const toggleCart = () => setIsDrawerOpen((current) => !current);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isDrawerOpen,
        isGuestCart: !user,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchServerCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
