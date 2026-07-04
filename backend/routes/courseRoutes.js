import express from "express";
import {
  getAllCourses,
  addCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// These match /api/courses
router.get("/", protect, getAllCourses);
router.post("/", protect, authorize("admin"), addCourse);
router.delete("/:id", protect, authorize("admin"), deleteCourse);

export default router;
