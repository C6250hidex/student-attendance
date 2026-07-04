import express from "express";
import {
  getAdminStats,
  getDashboardStats,
} from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin-stats", protect, authorize("admin"), getAdminStats);
router.get("/stats", protect, getDashboardStats);

export default router;
