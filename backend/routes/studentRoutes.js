import express from "express";
import {
  addStudent,
  getAllStudents,
  getMyProfile,
  getStudentById,
} from "../controllers/studentController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("photo"),
  addStudent,
);
router.get("/", protect, getAllStudents);
router.get("/profile/me", protect, getMyProfile);
router.get("/:id", protect, getStudentById);

export default router;
