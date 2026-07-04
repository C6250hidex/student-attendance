import db from "../config/db.js";

// Get all courses with Department and Lecturer names
export const getAllCourses = async (req, res) => {
  const { id, role } = req.user; // Get user ID and role from token

  try {
    let query = `
            SELECT courses.*, departments.name as department_name, users.full_name as lecturer_name
            FROM courses
            JOIN departments ON courses.department_id = departments.id
            JOIN lecturers ON courses.lecturer_id = lecturers.id
            JOIN users ON lecturers.user_id = users.id
        `;

    let params = [];

    // If the user is a lecturer, filter by their lecturer_id
    if (role === "lecturer") {
      query += ` WHERE lecturers.user_id = ?`;
      params.push(id);
    }

    const [courses] = await db.execute(query, params);
    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

// Add a new course
export const addCourse = async (req, res) => {
  const { course_code, course_title, department_id, lecturer_id } = req.body;

  try {
    await db.execute(
      "INSERT INTO courses (course_code, course_title, department_id, lecturer_id) VALUES (?, ?, ?, ?)",
      [course_code, course_title, department_id, lecturer_id],
    );
    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    console.error("Course Error:", error); // ADD THIS LINE TO SEE THE ERROR
    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM courses WHERE id = ?", [id]);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
};
