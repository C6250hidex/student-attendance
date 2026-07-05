import db from "../config/db.js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";

export const addStudent = async (req, res) => {
  const { full_name, email, matric_number, department_id, level } = req.body;
  const photo = req.file ? req.file.path : "";

  // Default password for students is their matric number
  const hashedPassword = await bcrypt.hash(matric_number, 10);

  try {
    // 1. Create User
    const [userResult] = await db.execute(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashedPassword, "student"],
    );
    const userId = userResult.insertId;

    // 2. Generate Unique Strings for Barcode/QR
    const barcodeData = matric_number; // Using matric number as the code
    const qrData = `STUDENT-${matric_number}`;

    // 3. Generate QR Code Image (Data URL)
    const qrCodeImage = await QRCode.toDataURL(qrData);

    // 4. Save Student Details
    await db.execute(
      `INSERT INTO students (user_id, matric_number, department_id, level, barcode, qr_code, qr_code_image, photo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        matric_number,
        department_id,
        level,
        barcodeData,
        qrData,
        qrCodeImage,
        photo,
      ],
    );

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering student", error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const [students] = await db.execute(`
            SELECT students.*, users.full_name, users.email, departments.name as department_name 
            FROM students 
            JOIN users ON students.user_id = users.id 
            JOIN departments ON students.department_id = departments.id
        `);
    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  // <--- Make sure 'export' is here
  try {
    const [rows] = await db.execute(
      `
            SELECT students.*, users.full_name, users.email, departments.name as department_name 
            FROM students 
            JOIN users ON students.user_id = users.id 
            JOIN departments ON students.department_id = departments.id
            WHERE students.user_id = ?
        `,
      [req.user.id],
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Student record not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get a single student by their ID
export const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      `
            SELECT students.*, users.full_name, users.email, departments.name as department_name 
            FROM students 
            JOIN users ON students.user_id = users.id 
            JOIN departments ON students.department_id = departments.id
            WHERE students.id = ?
        `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student record not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
