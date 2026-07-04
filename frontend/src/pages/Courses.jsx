import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { BookOpen, Plus, Trash2, X } from "lucide-react";
import { AuthContext } from "../store/AuthContext";

const Courses = () => {
  const { user } = useContext(AuthContext);
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
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Course Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View, assign, and organize academic modules.
          </p>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <Plus size={18} /> Add Course
          </button>
        )}
      </div>

      {/* Main Data Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">
                  Code
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Lecturer
                </th>
                {user?.role === "admin" && (
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-24">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-slate-50/50 transition duration-150 ease-in-out group"
                  >
                    <td className="p-4 font-mono font-bold text-sm text-blue-600">
                      {course.course_code}
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-800">
                      {course.course_title}
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {course.department_name}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">
                      {course.lecturer_name}
                    </td>
                    {user?.role === "admin" && (
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition duration-150 opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                          title="Delete Course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={user?.role === "admin" ? "5" : "4"}
                    className="p-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <BookOpen
                        size={36}
                        className="text-slate-300 stroke-[1.5]"
                      />
                      <p className="text-sm font-medium">
                        No academic courses registered yet.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-200/50 overflow-hidden transform transition-all scale-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold flex items-center gap-2.5 text-slate-800">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <BookOpen size={18} />
                </div>
                Create New Course
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Course Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSC101"
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm placeholder:text-slate-400"
                  onChange={(e) =>
                    setFormData({ ...formData, course_code: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Course Title
                </label>
                <input
                  type="text"
                  placeholder="Introduction to Programming"
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm placeholder:text-slate-400"
                  onChange={(e) =>
                    setFormData({ ...formData, course_title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Department
                </label>
                <select
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Assigned Lecturer
                </label>
                <select
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm"
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
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/10 transition-all duration-200 hover:bg-blue-500 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 mt-2"
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
