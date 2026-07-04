import db from "../config/db.js";

export const getAttendanceReport = async (req, res) => {
  const { course_id, startDate, endDate } = req.query;
  const { id, role } = req.user;

  try {
    let query = `
            SELECT a.scanned_at, u.full_name, s.matric_number, c.course_code, c.course_title, a.scan_method
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN attendance_sessions sess ON a.session_id = sess.id
            JOIN courses c ON sess.course_id = c.id
        `;

    let conditions = [];
    let params = [];

    // Role-based filtering: Lecturers only see their own courses
    if (role === "lecturer") {
      query += ` JOIN lecturers l ON sess.lecturer_id = l.id`;
      conditions.push(`l.user_id = ?`);
      params.push(id);
    }

    if (course_id) {
      conditions.push(`c.id = ?`);
      params.push(course_id);
    }

    if (startDate && endDate) {
      conditions.push(`DATE(a.scanned_at) BETWEEN ? AND ?`);
      params.push(startDate, endDate);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY a.scanned_at DESC`;

    const [records] = await db.execute(query, params);
    res.json(records);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating report", error: error.message });
  }
};
