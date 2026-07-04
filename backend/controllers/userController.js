import db from "../config/db.js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode"; // Import this

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
  const photo = req.file ? req.file.path : ""; // Get the uploaded file path

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Insert into Users
    const [userResult] = await db.execute(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashedPassword, role],
    );
    const userId = userResult.insertId;

    // 2. Role-specific logic
    if (role === "lecturer") {
      await db.execute(
        "INSERT INTO lecturers (user_id, staff_id, department_id) VALUES (?, ?, ?)",
        [userId, staff_id, department_id],
      );
    } else if (role === "student") {
      const barcode = matric_number; // We use matric number as the barcode value
      const qr_string = `STUDENT-${matric_number}`;
      const qr_code_image = await QRCode.toDataURL(qr_string);

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
          qr_code_image,
        ],
      );
    }

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};
