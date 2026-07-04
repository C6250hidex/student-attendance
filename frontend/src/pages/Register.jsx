import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { UserPlus, ShieldCheck, Upload } from "lucide-react";

const Register = () => {
  const [role, setRole] = useState("student");
  const [photo, setPhoto] = useState(null); // State for the file
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    department_id: "1",
    matric_number: "",
    staff_id: "",
    level: "100",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use FormData to allow file uploads (required for the student photo)
    const data = new FormData();
    data.append("role", role);
    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("department_id", formData.department_id);

    if (role === "student") {
      data.append("matric_number", formData.matric_number);
      data.append("level", formData.level);
      if (photo) data.append("photo", photo); // Append photo only if student
    } else {
      data.append("staff_id", formData.staff_id);
    }

    try {
      // We must set the header to multipart/form-data for files to work
      await api.post("/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`${role.toUpperCase()} Registered!`);

      // Reset photo state after success
      setPhoto(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <UserPlus className="text-primary" size={30} />
        <h2 className="text-2xl font-bold text-gray-800">
          Admin: Register New User
        </h2>
      </div>

      {/* Role Switcher Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex-1 py-2 rounded-md font-bold transition flex justify-center items-center gap-2 ${
            role === "student"
              ? "bg-primary text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole("lecturer")}
          className={`flex-1 py-2 rounded-md font-bold transition flex justify-center items-center gap-2 ${
            role === "lecturer"
              ? "bg-primary text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Lecturer
        </button>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="col-span-2">
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
            placeholder="John Doe"
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
            placeholder="email@school.com"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Login Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
            placeholder="••••••••"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        {/* STUDENT SPECIFIC FIELDS */}
        {role === "student" && (
          <>
            {/* Photo Upload Section */}
            <div className="col-span-2 border-2 border-dashed border-gray-200 p-6 rounded-xl flex flex-col items-center bg-gray-50 hover:bg-gray-100 transition">
              <label className="cursor-pointer flex flex-col items-center w-full">
                <Upload className="text-primary mb-2" size={24} />
                <span className="text-sm font-medium text-gray-600">
                  {photo
                    ? `Selected: ${photo.name}`
                    : "Click to Upload Student Photo"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  accept="image/*"
                />
              </label>
            </div>

            {/* Matric Number */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Matric Number
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="UG/24/1001"
                onChange={(e) =>
                  setFormData({ ...formData, matric_number: e.target.value })
                }
                required
              />
            </div>

            {/* Level Selection */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Level
              </label>
              <select
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
              >
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>
          </>
        )}

        {/* LECTURER SPECIFIC FIELDS */}
        {role === "lecturer" && (
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Staff ID Number
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="STAFF/SCI/042"
              onChange={(e) =>
                setFormData({ ...formData, staff_id: e.target.value })
              }
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="col-span-2 mt-6">
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <ShieldCheck size={20} /> Complete{" "}
            {role === "student" ? "Student" : "Lecturer"} Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
