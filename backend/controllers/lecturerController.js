import db from "../config/db.js";

// Get all lecturers with user and department info
export const getAllLecturers = async (req, res) => {
  try {
    const [lecturers] = await db.execute(`
            SELECT lecturers.id as lecturer_id, users.id as user_id, users.full_name, 
                   users.email, users.status, lecturers.staff_id, departments.name as department_name
            FROM lecturers
            JOIN users ON lecturers.user_id = users.id
            JOIN departments ON lecturers.department_id = departments.id
        `);
    res.json(lecturers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching lecturers", error: error.message });
  }
};

// Delete a lecturer (and their user account)
export const deleteLecturer = async (req, res) => {
  const { id } = req.params; // This is the user_id

  try {
    // Deleting from 'users' will automatically delete from 'lecturers' due to ON DELETE CASCADE
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "Lecturer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting lecturer", error: error.message });
  }
};
