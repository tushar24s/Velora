import mongoose from "mongoose";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const sortMap = {
  newest: { createdAt: -1 },
  popularity: { popularity: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { rating: -1 },
};

const buildSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const findProductByIdentifier = async (identifier) => {
  let product = null;

  if (mongoose.isValidObjectId(identifier)) {
    product = await Product.findById(identifier);
  }

  if (!product) {
    product = await Product.findOne({ slug: identifier });
  }

  return product;
};

export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sort = "popularity",
    featured,
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  if (category && category !== "All") {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  if (featured === "true") {
    query.featured = true;
  }

  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortMap[sort] || sortMap.popularity)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.json({
    products,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).sort({ popularity: -1 }).limit(8);
  res.json(products);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category");
  res.json(categories);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await findProductByIdentifier(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .sort({ popularity: -1 })
    .limit(4);

  res.json({ product, relatedProducts });
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = req.body;

  const product = await Product.create({
    ...payload,
    slug: payload.slug || buildSlug(payload.name),
    images: payload.images?.length ? payload.images : [payload.image],
  });

  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, {
    ...req.body,
    slug: req.body.slug || buildSlug(req.body.name || product.name),
    images:
      req.body.images?.length || req.body.image
        ? req.body.images?.length
          ? req.body.images
          : [req.body.image]
        : product.images,
  });

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
});

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await findProductByIdentifier(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user?.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});
