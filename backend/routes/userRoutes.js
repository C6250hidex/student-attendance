import express from "express";
import { registerUser } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Only Admin can register users
router.post(
  "/register",
  protect,
  authorize("admin"),
  upload.single("photo"),
  registerUser,
);

export default router;
