import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000, // TiDB usually uses 4000
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // CRITICAL: Add this SSL block for TiDB Cloud
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

// Test the connection
try {
  const connection = await db.getConnection();
  console.log("✅ Connected to TiDB Cloud Successfully");
  connection.release();
} catch (error) {
  console.error("❌ Database Connection Failed:", error.message);
}

export default db;
