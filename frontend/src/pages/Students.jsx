import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import IDCard from "../components/IDCard";
import { UserPlus, Printer, X } from "lucide-react";

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <UserPlus size={20} /> Add Student
        </button>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Matric Number</th>
              <th className="p-4">Department</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{student.full_name}</td>
                <td className="p-4">{student.matric_number}</td>
                <td className="p-4">{student.department_name}</td>
                <td className="p-4">
                  <button
                    onClick={() => printID(student)}
                    className="text-primary hover:text-blue-800 flex items-center gap-1"
                  >
                    <Printer size={16} /> Print ID
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Add New Student</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Matric Number"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, matric_number: e.target.value })
                }
                required
              />
              <select
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
              >
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
              </select>
              <input
                type="file"
                className="w-full"
                onChange={(e) => setPhoto(e.target.files[0])}
                required
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded"
              >
                Save Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hidden ID Card for Printing */}
      <div className="hidden print:block print:fixed print:inset-0 print:bg-white print:z-[9999] flex justify-center items-center">
        {selectedStudent && <IDCard student={selectedStudent} />}
      </div>
    </div>
  );
};

export default Students;
