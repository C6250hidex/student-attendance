import express from "express";
import {
  getAllLecturers,
  deleteLecturer,
} from "../controllers/lecturerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only Admin can manage lecturers
router.get("/", protect, authorize("admin"), getAllLecturers);
router.delete("/:id", protect, authorize("admin"), deleteLecturer);

export default router;
