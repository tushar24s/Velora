import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const populateCart = (cartId) =>
  Cart.findById(cartId).populate("items.product", "name price image category rating stock");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const formatCart = (cart) => {
  const items = cart.items.map((item) => ({
    product: item.product,
    qty: item.qty,
    subtotal: (item.product?.price || 0) * item.qty,
  }));

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  return { ...cart.toObject(), items, itemCount, subtotal };
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const populatedCart = await populateCart(cart._id);
  res.json(formatCart(populatedCart));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const quantity = Math.max(1, Number(qty));

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error("Insufficient stock available");
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.qty = Math.min(existingItem.qty + quantity, product.stock);
  } else {
    cart.items.push({ product: productId, qty: quantity });
  }

  await cart.save();
  const populatedCart = await populateCart(cart._id);
  res.status(201).json(formatCart(populatedCart));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { qty } = req.body;
  const quantity = Number(qty);

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error("Valid quantity is required");
  }

  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((entry) => entry.product.toString() === req.params.productId);

  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  item.qty = Math.min(quantity, product.stock);

  await cart.save();
  const populatedCart = await populateCart(cart._id);
  res.json(formatCart(populatedCart));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();

  const populatedCart = await populateCart(cart._id);
  res.json(formatCart(populatedCart));
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();

  const populatedCart = await populateCart(cart._id);
  res.json(formatCart(populatedCart));
});

export const syncCart = asyncHandler(async (req, res) => {
  const { items = [] } = req.body;
  const cart = await getOrCreateCart(req.user._id);

  for (const incomingItem of items) {
    const product = await Product.findById(incomingItem.productId);

    if (!product) {
      continue;
    }

    const desiredQty = Math.max(1, Number(incomingItem.qty || 1));
    const existingItem = cart.items.find(
      (item) => item.product.toString() === incomingItem.productId
    );

    if (existingItem) {
      existingItem.qty = Math.min(existingItem.qty + desiredQty, product.stock);
    } else {
      cart.items.push({
        product: incomingItem.productId,
        qty: Math.min(desiredQty, product.stock),
      });
    }
  }

  await cart.save();
  const populatedCart = await populateCart(cart._id);
  res.json(formatCart(populatedCart));
});

