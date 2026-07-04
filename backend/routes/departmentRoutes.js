import express from "express";
import db from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// This matches /api/departments
router.get("/", protect, async (req, res) => {
  try {
    const [depts] = await db.execute("SELECT * FROM departments");
    res.json(depts);
  } catch (error) {
    res.status(500).json({ message: "Database error", error: error.message });
  }
});

export default router;
