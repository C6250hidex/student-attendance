import db from "../config/db.js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode"; // <--- Check if this import exists!

export const registerUser = async (req, res) => {
  const {
    full_name,
    email,
    password,
    role,
    department_id,
    staff_id,
    matric_number,
    level,
  } = req.body;
  const photo = req.file ? req.file.path : "";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Insert into Users table
    const [userResult] = await db.execute(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashedPassword, role],
    );
    const userId = userResult.insertId;

    if (role === "student") {
      // Student logic
      const barcode = matric_number;
      const qr_string = `STUDENT-${matric_number}`;

      // Generate QR Code
      const qr_image = await QRCode.toDataURL(qr_string);

      console.log(`Saving student ${full_name} with user_id ${userId}`);

      await db.execute(
        `INSERT INTO students (user_id, matric_number, department_id, level, photo, barcode, qr_code, qr_code_image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          matric_number,
          department_id,
          level,
          photo,
          barcode,
          qr_string,
          qr_image,
        ],
      );
    } else {
      // Lecturer logic
      await db.execute(
        "INSERT INTO lecturers (user_id, staff_id, department_id) VALUES (?, ?, ?)",
        [userId, staff_id, department_id],
      );
    }

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    // This will print the EXACT error in Render Logs
    console.error("❌ STUDENT REGISTER ERROR:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};
