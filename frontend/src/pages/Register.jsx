import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  UserPlus,
  ShieldCheck,
  Upload,
  User,
  GraduationCap,
  FileImage,
  Loader2,
  Building2,
} from "lucide-react";

const Register = () => {
  const [role, setRole] = useState("student");
  const [photo, setPhoto] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    department_id: "",
    matric_number: "",
    staff_id: "",
    level: "100",
  });

  // Fetch departments from the backend on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data);
        // Default to the first department if available
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, department_id: res.data[0].id }));
        }
      } catch (err) {
        toast.error("Critical: Could not load departments.");
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("role", role);
    data.append("full_name", formData.full_name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("department_id", formData.department_id);

    if (role === "student") {
      data.append("matric_number", formData.matric_number);
      data.append("level", formData.level);
      if (photo) data.append("photo", photo);
    } else {
      data.append("staff_id", formData.staff_id);
    }

    try {
      await api.post("/users/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`${role.toUpperCase()} Profile Provisioned Successfully!`);

      // Reset sensitive fields
      setPhoto(null);
      setFormData({
        ...formData,
        full_name: "",
        email: "",
        password: "",
        matric_number: "",
        staff_id: "",
      });
      e.target.reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Engine Failure");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-200/60 mt-8 animate-fade-in font-sans antialiased">
      {/* Dynamic Administrative Header */}
      <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-slate-100">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl ring-1 ring-inset ring-blue-600/10">
          <UserPlus size={24} className="stroke-[1.75]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Account Provisioning Portal
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Register new institutional profiles into the core attendance
            ecosystem.
          </p>
        </div>
      </div>

      {/* Pill-Styled Segmented Role Switcher */}
      <div className="p-1 bg-slate-100 rounded-xl flex gap-1 mb-8">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition duration-200 flex justify-center items-center gap-2 ${
            role === "student"
              ? "bg-white text-blue-600 shadow-sm border border-slate-200/40"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
          }`}
        >
          <GraduationCap size={16} />
          Student Account
        </button>
        <button
          type="button"
          onClick={() => setRole("lecturer")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition duration-200 flex justify-center items-center gap-2 ${
            role === "lecturer"
              ? "bg-white text-blue-600 shadow-sm border border-slate-200/40"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
          }`}
        >
          <User size={16} />
          Lecturer Account
        </button>
      </div>

      {/* Main Administrative Hydration Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {/* Full Name Field Block */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Legal Full Name
          </label>
          <input
            type="text"
            value={formData.full_name}
            className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition duration-200 focus:border-blue-500 focus:bg-white outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
            placeholder="e.g., Maku Salihu"
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            required
          />
        </div>

        {/* Institutional Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition duration-200 focus:border-blue-500 focus:bg-white outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
            placeholder="identity@university.edu"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Login Password
          </label>
          <input
            type="password"
            value={formData.password}
            className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition duration-200 focus:border-blue-500 focus:bg-white outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
            placeholder="••••••••"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>

        {/* Dynamic Department Selection Field */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Building2 size={12} /> Assigned Department
          </label>
          <select
            value={formData.department_id}
            className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition duration-200 focus:border-blue-500 focus:bg-white outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
            onChange={(e) =>
              setFormData({ ...formData, department_id: e.target.value })
            }
            required
          >
            <option value="">Select Department...</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* STUDENT DYNAMIC FIELD DOMAIN */}
        {role === "student" && (
          <>
            <div className="sm:col-span-2 group border-2 border-dashed border-slate-200 hover:border-blue-400 p-6 rounded-2xl flex flex-col items-center bg-slate-50/50 hover:bg-white transition-all duration-200">
              <label className="cursor-pointer flex flex-col items-center w-full text-center">
                <div
                  className={`p-3 rounded-xl mb-2 transition duration-200 ${photo ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"}`}
                >
                  {photo ? <FileImage size={22} /> : <Upload size={22} />}
                </div>
                <span className="text-sm font-semibold tracking-tight text-slate-700">
                  {photo
                    ? "Biometric Data Staged"
                    : "Upload Verification Photo"}
                </span>
                <span className="text-xs text-slate-400 mt-1 font-medium">
                  {photo
                    ? `Selected: ${photo.name}`
                    : "Supports JPEG, PNG or WEBP face validation."}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  accept="image/*"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Matric Number
              </label>
              <input
                type="text"
                value={formData.matric_number}
                className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm font-mono"
                placeholder="UG/24/1001"
                onChange={(e) =>
                  setFormData({ ...formData, matric_number: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Level Cohort
              </label>
              <select
                value={formData.level}
                className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm cursor-pointer"
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

        {/* LECTURER DYNAMIC FIELD DOMAIN */}
        {role === "lecturer" && (
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Staff Identification Number
            </label>
            <input
              type="text"
              value={formData.staff_id}
              className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm font-mono"
              placeholder="STAFF/SCI/042"
              onChange={(e) =>
                setFormData({ ...formData, staff_id: e.target.value })
              }
              required
            />
          </div>
        )}

        {/* Transaction Dispatch Execution Element */}
        <div className="sm:col-span-2 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.99] disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 animate-spin" size={18} />
            ) : (
              <ShieldCheck size={18} className="mr-2" />
            )}
            {isSubmitting
              ? "Provisioning Profile..."
              : `Provision ${role === "student" ? "Student" : "Lecturer"} Credentials`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
