import { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import api from "../utils/api";
import { getErrorMessage } from "../utils/helpers";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("velora-user", null);
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  const login = async (payload) => {
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", payload);
      setUser(data);
      notify({
        title: "Welcome back",
        message: "Your account is ready.",
        type: "success",
      });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      notify({ title: "Login failed", message, type: "error" });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", payload);
      setUser(data);
      notify({
        title: "Account created",
        message: "You are now signed in.",
        type: "success",
      });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      notify({ title: "Registration failed", message, type: "error" });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user?.token) {
      return null;
    }

    const { data } = await api.get("/auth/profile");
    setUser(data);
    return data;
  };

  const updateProfile = async (payload) => {
    setLoading(true);

    try {
      const { data } = await api.put("/auth/profile", payload);
      setUser(data);
      notify({
        title: "Profile updated",
        message: "Your preferences were saved.",
        type: "success",
      });
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      notify({ title: "Update failed", message, type: "error" });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      notify({
        title: "Sign in required",
        message: "Create an account to save items to your wishlist.",
        type: "info",
      });
      return;
    }

    try {
      const { data } = await api.post("/auth/wishlist", { productId });
      setUser(data);
      return data;
    } catch (error) {
      notify({ title: "Wishlist failed", message: getErrorMessage(error), type: "error" });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    notify({
      title: "Signed out",
      message: "You have been logged out.",
      type: "info",
    });
  };

  const isWishlisted = (productId) =>
    Boolean(user?.wishlist?.some((item) => (item._id || item) === productId));

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

