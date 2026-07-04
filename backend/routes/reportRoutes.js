import express from "express";
import { getAttendanceReport } from "../controllers/reportController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "lecturer"), getAttendanceReport);

export default router;
