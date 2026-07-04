import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import IDCard from "../components/IDCard";
import { UserPlus, Printer, X, ShieldAlert, GraduationCap } from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    matric_number: "",
    department_id: "1",
    level: "100",
  });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      toast.error("Failed to load students");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("matric_number", formData.matric_number);
    data.append("department_id", formData.department_id);
    data.append("level", formData.level);
    if (photo) data.append("photo", photo);

    try {
      await api.post("/students", data);
      toast.success("Student Added Successfully");
      setShowModal(false);
      // Reset photo state following clean submission
      setPhoto(null);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding student");
    }
  };

  const printID = (student) => {
    setSelectedStudent(student);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans antialiased text-slate-800">
      {/* View Header Control Grid */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 no-print">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            Student Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Provision digital credentials, configure metadata arrays, and manage
            hardware prints.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition duration-150 active:scale-[0.98] shadow-sm shadow-slate-950/10"
        >
          <UserPlus size={18} />
          Add Student
        </button>
      </div>

      {/* Structured Student Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4 pl-6">Full Name</th>
                <th className="p-4">Matric Number</th>
                <th className="p-4">Department</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-400 font-normal"
                  >
                    No records found. Click "Add Student" to construct a new
                    profile object.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 transition duration-150"
                  >
                    <td className="p-4 pl-6 font-semibold text-slate-900">
                      {student.full_name}
                    </td>
                    <td className="p-4 text-slate-600 font-mono tracking-tight">
                      {student.matric_number}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        <GraduationCap size={13} className="text-slate-500" />
                        {student.department_name ||
                          `Dept #${student.department_id}`}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => printID(student)}
                        className="inline-flex items-center gap-1.5 ml-auto text-blue-600 hover:text-blue-800 font-semibold transition duration-150 px-3 py-1.5 rounded-lg hover:bg-blue-50/70"
                      >
                        <Printer size={15} /> Print ID
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal Panel */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in no-print">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Add New Student
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Identity Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Jane Doe"
                  className="w-full border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none p-2.5 rounded-xl transition text-sm bg-slate-50/50"
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="jane.doe@university.edu"
                  className="w-full border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none p-2.5 rounded-xl transition text-sm bg-slate-50/50"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Matriculation Index
                </label>
                <input
                  type="text"
                  placeholder="e.g., U2024/001"
                  className="w-full border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none p-2.5 rounded-xl transition text-sm bg-slate-50/50 font-mono"
                  onChange={(e) =>
                    setFormData({ ...formData, matric_number: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Academic Level
                </label>
                <select
                  className="w-full border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none p-2.5 rounded-xl transition text-sm bg-slate-50/50 appearance-none"
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  value={formData.level}
                >
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Credential Profile Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl bg-slate-50/30 hover:bg-slate-50/70 transition duration-150 relative">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-slate-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload target asset</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => setPhoto(e.target.files[0])}
                          required
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                    {photo && (
                      <p className="text-xs font-semibold text-green-600 truncate max-w-xs mt-2">
                        ✓ Selected: {photo.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm py-3 rounded-xl transition duration-150 active:scale-[0.99] mt-2 shadow-sm"
              >
                Save Student Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* High-Fidelity Print Engine Port */}
      <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:z-[9999] h-screen w-screen">
        <div className="h-full w-full flex justify-center items-center print:p-0">
          {selectedStudent && <IDCard student={selectedStudent} />}
        </div>
      </div>
    </div>
  );
};

export default Students;
