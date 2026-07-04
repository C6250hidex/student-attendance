import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import fs from "fs";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import lecturerRoutes from "./routes/lecturerRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// 1. DYNAMIC CORS NORMALIZATION
const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const frontendUrl = rawFrontendUrl.replace(/\/$/, ""); // Remove trailing slash

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    const incomingOrigin = origin.replace(/\/$/, "");

    // Check if the request comes from our production URL or Localhost
    if (
      incomingOrigin === frontendUrl ||
      incomingOrigin === "http://localhost:5173" ||
      incomingOrigin === "http://localhost:3000"
    ) {
      callback(null, true);
    } else {
      console.error(
        `🚨 CORS REJECTED: Request from [${origin}] does not match allowed [${frontendUrl}]`,
      );
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// 2. APPLY CORS AT THE VERY TOP
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle Preflight for all routes

// 3. INITIALIZE SOCKET.IO WITH SAME ORIGIN
const io = new Server(server, {
  cors: {
    origin: [frontendUrl, "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 4. STORAGE & SECURITY MIDDLEWARE
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(
  helmet({
    crossOriginResourcePolicy: false, // Required to show student photos on frontend
  }),
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files correctly
app.use("/uploads", express.static("uploads"));

// Attach Socket.io to the app instance
app.set("socketio", io);

// 5. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reports", reportRoutes);

// Health Check for Render
app.get("/", (req, res) => {
  res.status(200).send("Attendance System API is live and healthy.");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Allowing traffic from: ${frontendUrl}`);
});
