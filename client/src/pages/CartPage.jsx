import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { pageVariants } from "../animations/pageVariants";
import EmptyState from "../components/EmptyState";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import AppImage from "../components/AppImage";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, isGuestCart } = useCart();
  const { user } = useAuth();

  const shipping = cart.subtotal >= 4999 ? 0 : cart.items.length ? 199 : 0;
  const tax = Math.round(cart.subtotal * 0.18);
  const total = cart.subtotal + shipping + tax;

  if (!cart.items.length) {
    return (
      <div className="section-shell">
        <EmptyState
          title="Your cart is empty"
          description="Start browsing the latest collection and add a few products to see the full checkout flow."
          action={
            <Link to="/shop" className="btn-primary">
              Continue shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="section-shell space-y-10"
    >
      <SectionHeading
        eyebrow="Shopping bag"
        title="A clean, responsive cart with quantity controls and synced totals."
        description="Guest cart items are stored locally and merge automatically once a user signs in."
      />

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.product._id} className="surface-card-strong flex flex-col gap-5 p-5 sm:flex-row">
              <AppImage
                src={item.product.image}
                alt={item.product.name}
                label={item.product.name}
                className="h-36 w-full rounded-[24px] object-cover sm:w-36"
              />

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-soft">{item.product.category}</p>
                    <Link to={`/products/${item.product._id}`} className="mt-1 block">
                      <h3 className="text-xl font-semibold tracking-[-0.03em]">{item.product.name}</h3>
                    </Link>
                    <p className="mt-2 text-sm text-soft">Stock: {item.product.stock}</p>
                  </div>
                  <p className="text-lg font-semibold text-[rgb(var(--accent))]">
                    {formatCurrency(item.product.price)}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="inline-flex items-center rounded-full border border-soft bg-[rgba(var(--surface),0.76)] p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, Math.max(1, item.qty - 1))}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product._id, Math.min(item.product.stock, item.qty + 1))
                      }
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold">{formatCurrency(item.subtotal)}</p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="surface-card-strong h-fit px-6 py-8 sm:px-8">
          <SectionHeading
            eyebrow="Summary"
            title="Order overview"
            description="Checkout totals mirror the backend order creation logic."
          />

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-soft">Items ({cart.itemCount})</span>
              <span>{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-soft">Shipping</span>
              <span>{shipping ? formatCurrency(shipping) : "Free"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-soft">Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="h-px bg-[rgba(var(--border),0.72)]" />
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-xl font-semibold text-[rgb(var(--accent))]">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {isGuestCart ? (
            <div className="mt-6 rounded-[22px] border border-soft bg-[rgba(var(--surface),0.62)] px-4 py-4">
              <p className="text-sm text-soft">
                Sign in to continue to checkout. Your local cart will sync automatically after login.
              </p>
            </div>
          ) : null}

          <Link to={user ? "/checkout" : "/login"} className="btn-primary mt-8 flex w-full justify-center">
            {user ? "Proceed to Checkout" : "Sign in to Checkout"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
