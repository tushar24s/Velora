import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  toggleWishlist,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/wishlist", protect, toggleWishlist);

export default router;

