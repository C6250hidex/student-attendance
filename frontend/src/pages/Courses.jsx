import React, { useEffect, useState, useContext } from "react"; // Added useContext
import api from "../services/api";
import { toast } from "react-toastify";
import { BookOpen, Plus, Trash2, X } from "lucide-react";
import { AuthContext } from "../store/AuthContext"; // Added AuthContext import

const Courses = () => {
  const { user } = useContext(AuthContext); // Initialize user from Context
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [depts, setDepts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    course_code: "",
    course_title: "",
    department_id: "",
    lecturer_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Logic: Everyone can see courses, but only Admin needs lecturer/dept lists for the modal
      const cRes = await api.get("/courses");
      setCourses(cRes.data);

      if (user?.role === "admin") {
        const [lRes, dRes] = await Promise.all([
          api.get("/lecturers"),
          api.get("/departments"),
        ]);
        setLecturers(lRes.data);
        setDepts(dRes.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses", formData);
      toast.success("Course Created");
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to create course");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      try {
        await api.delete(`/courses/${id}`);
        toast.success("Course Deleted");
        fetchData();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Course Management</h1>

        {/* Only Admin sees the Add Course button */}
        {user?.role === "admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={20} /> Add Course
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-gray-600 font-bold">Code</th>
              <th className="p-4 text-gray-600 font-bold">Title</th>
              <th className="p-4 text-gray-600 font-bold">Department</th>
              <th className="p-4 text-gray-600 font-bold">Lecturer</th>
              {user?.role === "admin" && (
                <th className="p-4 text-gray-600 font-bold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-bold text-primary">
                    {course.course_code}
                  </td>
                  <td className="p-4 font-medium text-gray-700">
                    {course.course_title}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {course.department_name}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-700">
                    {course.lecturer_name}
                  </td>
                  {user?.role === "admin" && (
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between mb-6 border-b pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                <BookOpen className="text-primary" /> Create New Course
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSC101"
                  className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) =>
                    setFormData({ ...formData, course_code: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  placeholder="Introduction to Programming"
                  className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) =>
                    setFormData({ ...formData, course_title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Department
                </label>
                <select
                  className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) =>
                    setFormData({ ...formData, department_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Department</option>
                  {depts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Assigned Lecturer
                </label>
                <select
                  className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) =>
                    setFormData({ ...formData, lecturer_id: e.target.value })
                  }
                  required
                >
                  <option value="">Assign Lecturer</option>
                  {lecturers.map((l) => (
                    <option key={l.lecturer_id} value={l.lecturer_id}>
                      {l.full_name} ({l.staff_id})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg mt-4"
              >
                Save Course
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
