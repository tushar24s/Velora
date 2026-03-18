import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const populateCart = (userId) =>
  Cart.findOne({ user: userId }).populate("items.product", "name price image stock");

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = "UPI" } = req.body;
  const cart = await populateCart(req.user._id);

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.image,
    price: item.product.price,
    qty: item.qty,
  }));

  for (const item of cart.items) {
    if (item.product.stock < item.qty) {
      res.status(400);
      throw new Error(`${item.product.name} does not have enough stock`);
    }
  }

  const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
  const shippingPrice = itemsPrice >= 4999 ? 0 : 199;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: paymentMethod !== "Cash on Delivery",
    paidAt: paymentMethod !== "Cash on Delivery" ? new Date() : undefined,
    status: paymentMethod !== "Cash on Delivery" ? "Paid" : "Processing",
  });

  for (const item of cart.items) {
    item.product.stock -= item.qty;
    await Product.findByIdAndUpdate(item.product._id, { stock: item.product.stock });
  }

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this order");
  }

  res.json(order);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const status = req.body.status || order.status;
  order.status = status;

  if (status === "Paid" && !order.isPaid) {
    order.isPaid = true;
    order.paidAt = new Date();
  }

  if (status === "Delivered") {
    order.deliveredAt = new Date();
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
