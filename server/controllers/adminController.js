import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [productCount, orderCount, userCount, revenueAgg, recentOrders, topProducts] =
    await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]),
      Order.find({})
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(6),
      Product.find({}).sort({ popularity: -1 }).limit(5),
    ]);

  res.json({
    productCount,
    orderCount,
    userCount,
    totalRevenue: revenueAgg[0]?.totalRevenue || 0,
    recentOrders,
    topProducts,
  });
});

