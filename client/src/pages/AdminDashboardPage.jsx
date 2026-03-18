import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { pageVariants } from "../animations/pageVariants";
import SectionHeading from "../components/SectionHeading";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { formatCurrency } from "../utils/currency";
import { getErrorMessage } from "../utils/helpers";
import AppImage from "../components/AppImage";

const emptyForm = {
  name: "",
  brand: "",
  price: "",
  image: "",
  image2: "",
  image3: "",
  description: "",
  category: "Luxury Watches",
  rating: "4.5",
  stock: "12",
  featured: true,
  popularity: "80",
};

const categories = [
  "Luxury Watches",
  "Men's Clothing",
  "Women's Clothing",
  "Shoes",
  "Luxury Bags",
  "Accessories",
];
const statuses = ["Pending", "Processing", "Paid", "Shipped", "Delivered", "Cancelled"];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { notify } = useToast();

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [{ data: dashboard }, { data: productData }, { data: orderData }] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/products", { params: { limit: 40, sort: "newest" } }),
        api.get("/orders/admin/all"),
      ]);

      setStats(dashboard);
      setProducts(productData.products);
      setOrders(orderData);
    } catch (error) {
      notify({
        title: "Dashboard load failed",
        message: getErrorMessage(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProductId(null);
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      brand: form.brand,
      price: Number(form.price),
      image: form.image,
      images: [form.image, form.image2, form.image3].filter(Boolean),
      description: form.description,
      category: form.category,
      rating: Number(form.rating),
      stock: Number(form.stock),
      featured: Boolean(form.featured),
      popularity: Number(form.popularity),
      numReviews: 0,
      specifications: [
        { label: "Crafted for", value: "Portfolio showcase" },
        { label: "Visual style", value: "Premium minimal" },
        { label: "Category", value: form.category },
      ],
    };

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      notify({
        title: editingProductId ? "Product updated" : "Product created",
        message: "The catalogue has been refreshed.",
        type: "success",
      });
      resetForm();
      await loadDashboard();
    } catch (error) {
      notify({
        title: "Save failed",
        message: getErrorMessage(error),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setForm({
      name: product.name,
      brand: product.brand || "",
      price: String(product.price),
      image: product.image,
      image2: product.images?.[1] || "",
      image3: product.images?.[2] || "",
      description: product.description,
      category: product.category,
      rating: String(product.rating || 4.5),
      stock: String(product.stock || 1),
      featured: Boolean(product.featured),
      popularity: String(product.popularity || 80),
    });
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      notify({
        title: "Product deleted",
        message: "The item was removed from the catalogue.",
        type: "success",
      });
      await loadDashboard();
    } catch (error) {
      notify({
        title: "Delete failed",
        message: getErrorMessage(error),
        type: "error",
      });
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? { ...order, status } : order))
      );
      notify({
        title: "Order updated",
        message: `Status changed to ${status}.`,
        type: "success",
      });
    } catch (error) {
      notify({
        title: "Status update failed",
        message: getErrorMessage(error),
        type: "error",
      });
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
        eyebrow="Admin dashboard"
        title="Manage products, monitor orders, and review high-level storefront stats."
        description="This page connects directly to protected admin endpoints and handles full CRUD for products plus order status management."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Products", stats?.productCount || 0],
          ["Orders", stats?.orderCount || 0],
          ["Customers", stats?.userCount || 0],
          ["Revenue", formatCurrency(stats?.totalRevenue || 0)],
        ].map(([label, value]) => (
          <div key={label} className="surface-card-strong px-5 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-soft">{label}</p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">
              {loading ? "..." : value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleProductSubmit} className="surface-card-strong space-y-4 px-6 py-8 sm:px-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">
              {editingProductId ? "Edit product" : "Add product"}
            </h2>
            {editingProductId ? (
              <button type="button" onClick={resetForm} className="btn-secondary px-4 py-2.5">
                Cancel edit
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["name", "Product name"],
              ["brand", "Brand"],
              ["price", "Price in INR"],
              ["stock", "Stock"],
              ["image", "Primary image URL"],
              ["image2", "Gallery image 2"],
              ["image3", "Gallery image 3"],
              ["popularity", "Popularity score"],
            ].map(([key, label]) => (
              <label key={key} className={`block space-y-2 text-sm ${key.startsWith("image") ? "sm:col-span-2" : ""}`}>
                <span className="font-semibold">{label}</span>
                <input
                  value={form[key]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  required={["name", "price", "stock", "image"].includes(key)}
                  className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-3 outline-none"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span className="font-semibold">Category</span>
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-3 outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-semibold">Rating</span>
              <input
                value={form.rating}
                onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
                className="w-full rounded-2xl border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-3 outline-none"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm">
            <span className="font-semibold">Description</span>
            <textarea
              rows="5"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              required
              className="w-full rounded-[24px] border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-3 outline-none"
            />
          </label>

          <label className="inline-flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                setForm((current) => ({ ...current, featured: event.target.checked }))
              }
              className="h-4 w-4 rounded border-soft"
            />
            Mark as featured
          </label>

          <button type="submit" disabled={saving} className="btn-primary flex w-full justify-center">
            {saving
              ? "Saving..."
              : editingProductId
                ? "Update Product"
                : "Create Product"}
          </button>
        </form>

        <div className="space-y-8">
          <div className="surface-card-strong px-6 py-8 sm:px-8">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">Products</h2>
            <div className="mt-6 space-y-3">
              {products.map((product) => (
                <div key={product._id} className="flex flex-col gap-4 rounded-[24px] border border-soft p-4 sm:flex-row sm:items-center">
                  <AppImage
                    src={product.image}
                    alt={product.name}
                    label={product.name}
                    className="h-20 w-20 rounded-[20px] object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{product.name}</p>
                    <p className="mt-1 text-sm text-soft">
                      {product.category} • {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-soft"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card-strong px-6 py-8 sm:px-8">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">Orders</h2>
            <div className="mt-6 space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="rounded-[24px] border border-soft p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">#{order._id.slice(-8)}</p>
                      <p className="text-sm text-soft">
                        {order.user?.name || "Customer"} • {formatCurrency(order.totalPrice)}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(event) => handleStatusUpdate(order._id, event.target.value)}
                      className="rounded-full border border-soft bg-[rgba(var(--surface),0.82)] px-4 py-2 text-sm outline-none"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
