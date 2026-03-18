import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { pageVariants } from "../animations/pageVariants";
import EmptyState from "../components/EmptyState";
import SectionHeading from "../components/SectionHeading";
import api from "../utils/api";
import { formatCurrency } from "../utils/currency";
import AppImage from "../components/AppImage";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders/mine");
        setOrders(data);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (!loading && !orders.length) {
    return (
      <div className="section-shell">
        <EmptyState
          title="No orders yet"
          description="Place your first order to see the order history and status management flow here."
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
        eyebrow="Order history"
        title="A personal order timeline with status badges and full totals."
        description="Orders are pulled from the JWT-protected backend so the history reflects real server state."
      />

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="surface-card-strong px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-soft">
                  Order #{order._id.slice(-8)}
                </p>
                <h3 className="text-xl font-semibold tracking-[-0.03em]">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </h3>
                <p className="text-sm text-soft">
                  {order.orderItems.length} items • {order.paymentMethod}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[rgba(var(--accent),0.12)] px-4 py-2 text-xs font-semibold text-[rgb(var(--accent))]">
                  {order.status}
                </span>
                <span className="rounded-full border border-soft px-4 py-2 text-xs font-semibold text-soft">
                  {order.isPaid ? "Paid" : "Pending payment"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {order.orderItems.map((item) => (
                <div key={`${order._id}-${item.product}`} className="flex items-center gap-3">
                  <AppImage
                    src={item.image}
                    alt={item.name}
                    label={item.name}
                    className="h-14 w-14 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-soft">
                      {item.qty} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm text-soft sm:flex-row sm:items-center sm:justify-between">
              <p>
                Shipping to {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p className="font-semibold text-main">{formatCurrency(order.totalPrice)}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default OrdersPage;
