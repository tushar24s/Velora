import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/mine", getMyOrders);
router.post("/", createOrder);
router.get("/admin/all", admin, getAllOrders);
router.put("/:id/status", admin, updateOrderStatus);
router.get("/:id", getOrderById);

export default router;

