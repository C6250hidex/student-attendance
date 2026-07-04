import express from "express";
import {
  startSession,
  markAttendance,
} from "../controllers/attendanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, authorize("lecturer", "admin"), startSession);
router.post("/mark", protect, markAttendance);

export default router;
