import db from "../config/db.js";

// 1. Start a new attendance session
export const startSession = async (req, res) => {
  const { course_id } = req.body;
  const lecturer_id = req.user.id; // User ID from token

  try {
    // Get actual lecturer primary key
    const [lec] = await db.execute(
      "SELECT id FROM lecturers WHERE user_id = ?",
      [lecturer_id],
    );

    if (lec.length === 0) {
      return res.status(404).json({ message: "Lecturer record not found" });
    }

    const [result] = await db.execute(
      'INSERT INTO attendance_sessions (course_id, lecturer_id, session_date, status) VALUES (?, ?, CURDATE(), "open")',
      [course_id, lec[0].id],
    );

    res.status(201).json({
      sessionId: result.insertId,
      message: "Attendance session opened!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error opening session", error: error.message });
  }
};

// 2. Mark Attendance (The logic for the scanner)
export const markAttendance = async (req, res) => {
  const { sessionId, scannedCode, method } = req.body;

  try {
    // Find student by Barcode OR QR Code
    const [students] = await db.execute(
      "SELECT id, user_id FROM students WHERE barcode = ? OR qr_code = ?",
      [scannedCode, scannedCode],
    );

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "Invalid Code: Student not found" });
    }

    const studentId = students[0].id;

    // Check if session is still open
    const [session] = await db.execute(
      "SELECT status FROM attendance_sessions WHERE id = ?",
      [sessionId],
    );

    if (session.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session[0].status === "closed") {
      return res.status(400).json({ message: "This session is closed" });
    }

    // Insert attendance (The UNIQUE constraint in DB will prevent duplicates automatically)
    await db.execute(
      "INSERT INTO attendance (session_id, student_id, scan_method) VALUES (?, ?, ?)",
      [sessionId, studentId, method],
    );

    // --- REAL-TIME NOTIFICATION LOGIC ---
    // Fetch student name and course code for the dashboard update
    const [studentInfo] = await db.execute(
      `
        SELECT u.full_name, c.course_code 
        FROM students s 
        JOIN users u ON s.user_id = u.id 
        JOIN attendance_sessions sess ON sess.id = ?
        JOIN courses c ON sess.course_id = c.id
        WHERE s.id = ?`,
      [sessionId, studentId],
    );

    // Emit the event to Socket.IO (Check if socketio is set in app)
    const io = req.app.get("socketio");
    if (io) {
      io.emit("newAttendance", {
        full_name: studentInfo[0].full_name,
        course_code: studentInfo[0].course_code,
        scanned_at: new Date(),
      });
    }

    res.status(200).json({
      message: `Attendance marked for ${studentInfo[0].full_name}`,
    });
  } catch (error) {
    // Handle duplicate scanning attempt
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "Attendance already marked for this student" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
