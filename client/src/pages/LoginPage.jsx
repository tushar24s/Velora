import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pageVariants } from "../animations/pageVariants";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: mode === "login" ? "admin@velora.store" : "",
    password: mode === "login" ? "Admin@123" : "",
  });
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setForm({
      name: "",
      email: nextMode === "login" ? "admin@velora.store" : "",
      password: nextMode === "login" ? "Admin@123" : "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (mode === "login") {
        await login({
          email: form.email,
          password: form.password,
        });
      } else {
        await register(form);
      }

      navigate(redirectTo);
    } catch (error) {
      // Notifications are handled in the auth context.
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="section-shell"
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card-strong flex flex-col justify-between gap-10 px-6 py-8 sm:px-8">
          <div className="space-y-5">
            <span className="eyebrow">Authentication</span>
            <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Secure JWT-based login designed to feel like a polished product onboarding flow.
            </h1>
            <p className="max-w-xl text-base leading-8 text-soft">
              Register a new user, sign in as an existing customer, or use the seeded admin
              account to open the dashboard and manage products and orders.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-card px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-soft">Admin demo</p>
              <p className="mt-2 font-semibold">admin@velora.store</p>
              <p className="mt-1 text-sm text-soft">Password: Admin@123</p>
            </div>
            <div className="surface-card px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-soft">Guest cart sync</p>
              <p className="mt-2 text-sm leading-7 text-soft">
                Add items before signing in and the cart merges into your account automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card-strong px-6 py-8 sm:px-8">
          <div className="inline-flex rounded-full border border-soft bg-[rgba(var(--surface),0.76)] p-1">
            {["login", "register"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleModeChange(item)}
                className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                  mode === item ? "bg-[rgb(var(--accent))] text-white" : "text-soft"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "register" ? (
              <label className="block space-y-2 text-sm">
                <span className="font-semibold">Full name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                  className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-3 outline-none"
                  placeholder="Enter your name"
                />
              </label>
            ) : null}

            <label className="block space-y-2 text-sm">
              <span className="font-semibold">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
                className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-3 outline-none"
                placeholder="you@example.com"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-semibold">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                required
                className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-3 outline-none"
                placeholder="Enter a secure password"
              />
            </label>

            <button type="submit" disabled={loading} className="btn-primary mt-2 flex w-full justify-center">
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
