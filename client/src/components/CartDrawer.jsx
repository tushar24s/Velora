import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import AppImage from "./AppImage";

const CartDrawer = () => {
  const location = useLocation();
  const { user } = useAuth();
  const {
    cart,
    closeCart,
    isDrawerOpen,
    isGuestCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const shipping = cart.subtotal >= 4999 ? 0 : cart.items.length ? 199 : 0;
  const tax = Math.round(cart.subtotal * 0.18);
  const total = cart.subtotal + shipping + tax;

  useEffect(() => {
    closeCart();
  }, [location.pathname]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart drawer"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ opacity: 0, x: 42 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 42 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[80] flex h-screen w-full max-w-[460px] flex-col border-l border-white/10 bg-[rgba(11,11,11,0.84)] px-5 pb-6 pt-5 text-stone-100 shadow-[0_32px_90px_-32px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:px-6"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Cart</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em]">
                  Your shopping bag
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-100 transition duration-300 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {cart.items.length ? (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                  {cart.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.72)] backdrop-blur-xl"
                    >
                      <div className="flex gap-4">
                        <AppImage
                          src={item.product.image}
                          alt={item.product.name}
                          label={item.product.name}
                          className="h-24 w-24 rounded-[20px] object-cover"
                        />

                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">
                                {item.product.category}
                              </p>
                              <Link
                                to={`/products/${item.product._id}`}
                                onClick={closeCart}
                                className="mt-1 block"
                              >
                                <h3 className="truncate text-base font-semibold tracking-[-0.02em]">
                                  {item.product.name}
                                </h3>
                              </Link>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product._id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-300 transition duration-300 hover:bg-white/10 hover:text-white"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.product._id, Math.max(1, item.qty - 1))
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-200"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-9 text-center text-sm font-semibold">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product._id,
                                    Math.min(item.product.stock, item.qty + 1)
                                  )
                                }
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-200"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-[rgb(var(--accent))]">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_60px_-34px_rgba(0,0,0,0.85)]">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-stone-400">
                      <span>Items ({cart.itemCount})</span>
                      <span className="text-stone-100">{formatCurrency(cart.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-stone-400">
                      <span>Shipping</span>
                      <span className="text-stone-100">
                        {shipping ? formatCurrency(shipping) : "Free"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-stone-400">
                      <span>Tax</span>
                      <span className="text-stone-100">{formatCurrency(tax)}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold">Subtotal</span>
                      <span className="text-xl font-semibold text-[rgb(var(--accent))]">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {isGuestCart ? (
                    <p className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-stone-400">
                      Sign in to continue to checkout. Your cart stays synced after login.
                    </p>
                  ) : null}

                  <div className="mt-5 grid gap-3">
                    <Link
                      to={user ? "/checkout" : "/login"}
                      onClick={closeCart}
                      className="btn-primary w-full justify-center"
                    >
                      {user ? "Proceed to Checkout" : "Sign in to Checkout"}
                    </Link>
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="btn-secondary w-full justify-center border-white/10 bg-white/[0.04] text-stone-100 hover:bg-white/[0.08]"
                    >
                      View full cart
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.04] px-8 py-10 text-center">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[rgb(var(--accent))]">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.04em]">
                  Your bag is empty
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-stone-400">
                  Add a few standout pieces to see the cart drawer come alive.
                </p>
                <Link to="/shop" onClick={closeCart} className="btn-primary mt-6">
                  Explore products
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default CartDrawer;
