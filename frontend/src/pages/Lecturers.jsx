import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Trash2, Mail, BadgeCheck, Search } from "lucide-react";

const Lecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      const res = await api.get("/lecturers");
      setLecturers(res.data);
    } catch (err) {
      toast.error("Failed to load lecturers");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure? This will remove the lecturer and their account.",
      )
    ) {
      try {
        await api.delete(`/lecturers/${id}`);
        toast.success("Lecturer removed");
        fetchLecturers();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredLecturers = lecturers.filter(
    (l) =>
      l.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.staff_id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Lecturer Management
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-primary outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLecturers.map((lecturer) => (
          <div
            key={lecturer.lecturer_id}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-full text-primary">
                <BadgeCheck size={24} />
              </div>
              <button
                onClick={() => handleDelete(lecturer.user_id)}
                className="text-red-400 hover:text-red-600 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-800">
              {lecturer.full_name}
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-4">
              {lecturer.staff_id}
            </p>

            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                <span>{lecturer.email}</span>
              </div>
              <div className="text-xs bg-gray-100 w-fit px-2 py-1 rounded text-gray-500 uppercase font-bold">
                {lecturer.department_name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLecturers.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          No lecturers found.
        </div>
      )}
    </div>
  );
};

export default Lecturers;
