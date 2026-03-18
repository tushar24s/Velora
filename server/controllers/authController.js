import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const authResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  addressBook: user.addressBook || [],
  wishlist: user.wishlist || [],
  token: generateToken(user._id),
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json(authResponse(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() }).populate(
    "wishlist",
    "_id name price image rating category"
  );

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json(authResponse(user));
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "wishlist",
    "_id name price image rating category"
  );
  res.json(authResponse(user));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email?.toLowerCase() || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  if (req.body.addressBook) {
    user.addressBook = req.body.addressBook;
  }

  if (req.body.wishlist) {
    user.wishlist = req.body.wishlist;
  }

  const updatedUser = await user.save();
  const populatedUser = await User.findById(updatedUser._id).populate(
    "wishlist",
    "_id name price image rating category"
  );

  res.json(authResponse(populatedUser));
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product id is required");
  }

  const user = await User.findById(req.user._id);
  const exists = user.wishlist.some((item) => item.toString() === productId);

  user.wishlist = exists
    ? user.wishlist.filter((item) => item.toString() !== productId)
    : [...user.wishlist, productId];

  await user.save();

  const populatedUser = await User.findById(user._id).populate(
    "wishlist",
    "_id name price image rating category"
  );

  res.json(authResponse(populatedUser));
});

