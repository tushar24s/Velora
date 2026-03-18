import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Menu, ShoppingBag, User2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useCartMotion } from "../context/CartMotionContext";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/categories" },
  { label: "Cart", to: "/cart" },
];

const DesktopNavLink = ({ to, label }) => (
  <NavLink to={to} className="relative inline-flex">
    {({ isActive }) => (
      <span
        className={`group relative inline-flex items-center text-sm font-medium tracking-[0.01em] transition-colors duration-300 ${
          isActive ? "text-main" : "text-soft hover:text-main"
        }`}
      >
        {label}
        <span
          className={`absolute -bottom-1.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[rgb(var(--accent))] transition-[width] duration-300 ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </span>
    )}
  </NavLink>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cart, openCart } = useCart();
  const { cartPulseToken, registerCartIcon } = useCartMotion();
  const desktopCartRef = useRef(null);
  const mobileCartRef = useRef(null);
  const desktopCartControls = useAnimationControls();
  const mobileCartControls = useAnimationControls();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncCartTarget = () => {
      const isDesktop = window.innerWidth >= 1024;
      registerCartIcon(isDesktop ? desktopCartRef.current : mobileCartRef.current);
    };

    syncCartTarget();
    window.addEventListener("resize", syncCartTarget, { passive: true });

    return () => window.removeEventListener("resize", syncCartTarget);
  }, [registerCartIcon]);

  useEffect(() => {
    if (!cartPulseToken) {
      return;
    }

    const pulse = {
      scale: [1, 1.12, 0.96, 1],
      transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
    };

    desktopCartControls.start(pulse);
    mobileCartControls.start(pulse);
  }, [cartPulseToken, desktopCartControls, mobileCartControls]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div className="section-shell">
        <div
          className={`glass-navbar mx-auto flex items-center justify-between px-3 py-3 sm:px-5 ${
            scrolled ? "is-scrolled" : ""
          }`}
        >
          <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgba(var(--accent),0.14)] text-[rgb(var(--accent))] sm:h-10 sm:w-10">
              <span className="font-display text-lg font-bold">V</span>
            </div>
            <div className="min-w-0">
              <p className="font-display text-base font-semibold tracking-[0.08em] sm:text-lg">
                VELORA
              </p>
              <p className="hidden text-xs uppercase tracking-[0.16em] text-soft sm:block">
                Curated commerce
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <DesktopNavLink key={link.to} to={link.to} label={link.label} />
            ))}
            {user?.isAdmin ? (
              <DesktopNavLink to="/admin" label="Admin" />
            ) : null}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <motion.button
              type="button"
              ref={desktopCartRef}
              onClick={openCart}
              animate={desktopCartControls}
              className="theme-ring relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(var(--surface-strong),0.86)] text-main transition duration-300 hover:-translate-y-0.5"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[rgb(var(--accent))] px-1 text-[10px] font-semibold text-white">
                {cart?.itemCount || 0}
              </span>
            </motion.button>
            {user ? (
              <>
                <Link
                  to={user.isAdmin ? "/admin" : "/orders"}
                  className="inline-flex items-center gap-2 rounded-full border border-soft px-4 py-2.5 text-sm font-medium text-main transition hover:border-[rgba(var(--accent),0.32)]"
                >
                  <User2 className="h-4 w-4" />
                  {user.name.split(" ")[0]}
                </Link>
                <button type="button" onClick={logout} className="btn-secondary px-4 py-2.5">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-secondary px-4 py-2.5">
                Login
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            <motion.button
              type="button"
              ref={mobileCartRef}
              onClick={openCart}
              animate={mobileCartControls}
              className="theme-ring relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(var(--surface-strong),0.86)]"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[rgb(var(--accent))] px-1 text-[10px] font-semibold text-white">
                {cart?.itemCount || 0}
              </span>
            </motion.button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="theme-ring inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(var(--surface-strong),0.86)]"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.26 }}
            className="section-shell lg:hidden"
          >
            <div className="glass-panel mt-3 space-y-2 px-4 py-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-main hover:bg-[rgba(var(--surface-muted),0.82)]"
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to={user?.isAdmin ? "/admin" : user ? "/orders" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-main hover:bg-[rgba(var(--surface-muted),0.82)]"
              >
                {user?.isAdmin ? "Admin" : user ? "My Orders" : "Login"}
              </NavLink>
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-2xl border border-soft px-4 py-3 text-left text-sm font-medium"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
