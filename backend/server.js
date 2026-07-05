import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
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

// 1. RENDER PROXY SETTING
app.set('trust proxy', 1);

// 2. ROBUST CORS CONFIGURATION
const allowedOrigins = [
  "https://student-attendance-61cr.onrender.com", // YOUR FRONTEND
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Clean the strings to prevent slash-mismatch
    const cleanOrigin = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, "") === cleanOrigin);

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`🚨 CORS REJECTED: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.options("*", cors()); // Enable pre-flight for all routes

// 3. STANDARD MIDDLEWARES
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. STORAGE SETUP
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static("uploads"));

// 5. SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.set("socketio", io);

// 6. MOUNT ROUTES (Check these prefixes!)
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => res.send("Backend is Running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server on ${PORT}. Allowed: ${allowedOrigins[0]}`);
});