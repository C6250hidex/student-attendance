import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

// This is the route that is currently failing
router.post("/login", login);

// ADD THIS: A test route to check if the router is working
router.get("/test", (req, res) => {
  res.send("Auth router is working!");
});

export default router;
