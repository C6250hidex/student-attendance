import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Trash2, Mail, BadgeCheck, Search, Users } from "lucide-react";

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
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Directory Header & Search Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Lecturer Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage academic staff profiles and system access.
          </p>
        </div>

        <div className="relative w-full sm:w-80 mb-2 sm:mb-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name or staff ID..."
            className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 transition duration-200 ease-in-out focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm placeholder:text-slate-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Staff Grid Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredLecturers.map((lecturer) => (
          <div
            key={lecturer.lecturer_id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md hover:border-slate-300 transition-all duration-200 ease-in-out group relative overflow-hidden"
          >
            {/* Top Row: Icon & Action */}
            <div className="flex justify-between items-start mb-5">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 ring-1 ring-inset ring-blue-600/10">
                <BadgeCheck size={22} />
              </div>
              <button
                onClick={() => handleDelete(lecturer.user_id)}
                className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition duration-150 opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                title="Remove Lecturer"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
                {lecturer.full_name}
              </h3>
              <p className="text-xs font-mono font-semibold tracking-wider text-slate-500 mt-1 uppercase">
                {lecturer.staff_id}
              </p>
            </div>

            {/* Bottom Row: Contact & Dept */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400 flex-shrink-0" />
                <span className="truncate" title={lecturer.email}>
                  {lecturer.email}
                </span>
              </div>

              <div className="flex">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-widest truncate max-w-full">
                  {lecturer.department_name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Presentation */}
      {filteredLecturers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="bg-slate-50 p-4 rounded-full mb-4 ring-1 ring-slate-100">
            <Users size={32} className="text-slate-300 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">
            No lecturers found
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            {searchTerm
              ? "We couldn't find any staff members matching your current search criteria."
              : "There are currently no lecturers registered in the system."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Lecturers;
