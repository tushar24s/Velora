import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pageVariants } from "../animations/pageVariants";
import EmptyState from "../components/EmptyState";
import SectionHeading from "../components/SectionHeading";
import AppImage from "../components/AppImage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { formatCurrency } from "../utils/currency";
import { getErrorMessage } from "../utils/helpers";

const paymentOptions = ["UPI", "Card", "Cash on Delivery"];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, fetchServerCart } = useCart();
  const { notify } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "UPI",
  });

  useEffect(() => {
    const savedAddress = user?.addressBook?.[0];

    if (savedAddress) {
      setForm((current) => ({
        ...current,
        ...savedAddress,
      }));
    }
  }, [user]);

  if (!cart.items.length) {
    return (
      <div className="section-shell">
        <EmptyState
          title="Your cart is empty"
          description="Add some items to the cart before you continue to checkout."
        />
      </div>
    );
  }

  const shipping = cart.subtotal >= 4999 ? 0 : 199;
  const tax = Math.round(cart.subtotal * 0.18);
  const total = cart.subtotal + shipping + tax;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/orders", {
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      });

      await fetchServerCart();
      notify({
        title: "Order placed",
        message: "Your checkout was completed successfully.",
        type: "success",
      });
      navigate("/orders");
    } catch (error) {
      notify({
        title: "Checkout failed",
        message: getErrorMessage(error),
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="section-shell space-y-10"
    >
      <SectionHeading
        eyebrow="Checkout"
        title="A smooth shipping and payment flow backed by the order API."
        description="The totals here match the backend pricing logic so the frontend feels consistent and believable."
      />

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="surface-card-strong space-y-5 px-6 py-8 sm:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["fullName", "Full name"],
              ["phone", "Phone number"],
              ["street", "Street address"],
              ["city", "City"],
              ["state", "State"],
              ["postalCode", "Postal code"],
            ].map(([key, label]) => (
              <label key={key} className={`block space-y-2 text-sm ${key === "street" ? "sm:col-span-2" : ""}`}>
                <span className="font-semibold">{label}</span>
                <input
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                  required
                  className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-3 outline-none"
                />
              </label>
            ))}
          </div>

          <label className="block space-y-2 text-sm">
            <span className="font-semibold">Payment method</span>
            <select
              value={form.paymentMethod}
              onChange={(event) =>
                setForm((current) => ({ ...current, paymentMethod: event.target.value }))
              }
              className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-3 outline-none"
            >
              {paymentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={submitting} className="btn-primary flex w-full justify-center">
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </form>

        <div className="surface-card-strong h-fit px-6 py-8 sm:px-8">
          <SectionHeading
            eyebrow="Summary"
            title="Order recap"
            description="This mirrors the backend order snapshot and pricing logic."
          />

          <div className="mt-8 space-y-4">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex items-center gap-3">
                <AppImage
                  src={item.product.image}
                  alt={item.product.name}
                  label={item.product.name}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.product.name}</p>
                  <p className="text-xs text-soft">
                    {item.qty} x {formatCurrency(item.product.price)}
                  </p>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-soft">Items</span>
              <span>{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-soft">Shipping</span>
              <span>{shipping ? formatCurrency(shipping) : "Free"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-soft">Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="h-px bg-[rgba(var(--border),0.72)]" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-[rgb(var(--accent))]">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
