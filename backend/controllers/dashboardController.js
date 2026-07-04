import db from "../config/db.js";

export const getAdminStats = async (req, res) => {
  try {
    // 1. Get counts using a Promise.all for performance
    const [studentCount] = await db.execute(
      "SELECT COUNT(*) as total FROM students",
    );
    const [lecturerCount] = await db.execute(
      "SELECT COUNT(*) as total FROM lecturers",
    );
    const [courseCount] = await db.execute(
      "SELECT COUNT(*) as total FROM courses",
    );
    const [attendanceCount] = await db.execute(
      "SELECT COUNT(*) as total FROM attendance",
    );

    // 2. Get attendance trends for the last 7 days
    const [trends] = await db.execute(`
            SELECT DATE(scanned_at) as date, COUNT(*) as count 
            FROM attendance 
            GROUP BY DATE(scanned_at) 
            ORDER BY date DESC LIMIT 7
        `);

    // 3. Get recent attendance logs
    const [recentLogs] = await db.execute(`
            SELECT a.scanned_at, u.full_name, c.course_code 
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            JOIN users u ON s.user_id = u.id
            JOIN attendance_sessions asess ON a.session_id = asess.id
            JOIN courses c ON asess.course_id = c.id
            ORDER BY a.scanned_at DESC LIMIT 5
        `);

    res.json({
      stats: {
        students: studentCount[0].total,
        lecturers: lecturerCount[0].total,
        courses: courseCount[0].total,
        attendance: attendanceCount[0].total,
      },
      trends: trends.reverse(),
      recentLogs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  const { id, role } = req.user; // From Auth Middleware

  try {
    if (role === "admin") {
      const [students] = await db.execute(
        "SELECT COUNT(*) as total FROM students",
      );
      const [lecturers] = await db.execute(
        "SELECT COUNT(*) as total FROM lecturers",
      );
      const [attendance] = await db.execute(
        "SELECT COUNT(*) as total FROM attendance",
      );
      const [recent] = await db.execute(`
                SELECT a.scanned_at, u.full_name, c.course_code 
                FROM attendance a 
                JOIN students s ON a.student_id = s.id 
                JOIN users u ON s.user_id = u.id
                JOIN attendance_sessions sess ON a.session_id = sess.id
                JOIN courses c ON sess.course_id = c.id
                ORDER BY a.scanned_at DESC LIMIT 5`);

      return res.json({
        role,
        stats: {
          students: students[0].total,
          lecturers: lecturers[0].total,
          attendance: attendance[0].total,
        },
        recent,
      });
    }

    if (role === "lecturer") {
      const [courses] = await db.execute(
        "SELECT COUNT(*) as total FROM courses WHERE lecturer_id = (SELECT id FROM lecturers WHERE user_id = ?)",
        [id],
      );
      const [sessions] = await db.execute(
        "SELECT COUNT(*) as total FROM attendance_sessions WHERE lecturer_id = (SELECT id FROM lecturers WHERE user_id = ?)",
        [id],
      );
      const [activeSess] = await db.execute(
        'SELECT * FROM attendance_sessions WHERE status = "open" AND lecturer_id = (SELECT id FROM lecturers WHERE user_id = ?)',
        [id],
      );

      return res.json({
        role,
        stats: {
          myCourses: courses[0].total,
          totalSessions: sessions[0].total,
          activeSession: activeSess.length > 0,
        },
      });
    }

    if (role === "student") {
      const [myAttendance] = await db.execute(
        "SELECT COUNT(*) as total FROM attendance WHERE student_id = (SELECT id FROM students WHERE user_id = ?)",
        [id],
      );
      const [history] = await db.execute(
        `
                SELECT a.scanned_at, c.course_title, c.course_code 
                FROM attendance a
                JOIN attendance_sessions sess ON a.session_id = sess.id
                JOIN courses c ON sess.course_id = c.id
                WHERE a.student_id = (SELECT id FROM students WHERE user_id = ?)
                ORDER BY a.scanned_at DESC LIMIT 5`,
        [id],
      );

      return res.json({
        role,
        stats: { totalAttended: myAttendance[0].total },
        history,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: error.message });
  }
};
