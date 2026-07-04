import React, { useState, useEffect } from "react";
import api from "../services/api";
import { FileDown, Table, Filter, Calendar, BookOpen } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    course_id: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data));
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get("/reports", { params: filters });
      setReports(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
    }
  };

  const exportToExcel = () => {
    if (reports.length === 0) {
      toast.warning("No data available to export");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(reports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(
      workbook,
      `Attendance_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-sans antialiased text-slate-800">
      {/* Action Top Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            Attendance Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Filter historical log records, review scanning metrics, and generate
            spreadsheet sheets.
          </p>
        </div>
        <button
          onClick={exportToExcel}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition duration-150 active:scale-[0.98] shadow-sm shadow-emerald-600/10 w-full sm:w-auto"
        >
          <FileDown size={18} />
          Export to Excel
        </button>
      </div>

      {/* Responsive Multi-Input Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Course Filter Dropdown */}
          <div className="space-y-1">
            <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <BookOpen size={13} className="text-slate-400" /> Course Selection
            </label>
            <select
              className="w-full border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none p-2.5 rounded-xl transition text-sm bg-slate-50/50 appearance-none"
              onChange={(e) =>
                setFilters({ ...filters, course_id: e.target.value })
              }
              value={filters.course_id}
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_code}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date Selection */}
          <div className="space-y-1">
            <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <Calendar size={13} className="text-slate-400" /> Start Range
              (From)
            </label>
            <input
              type="date"
              className="w-full border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none p-2.5 rounded-xl transition text-sm bg-slate-50/50"
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>

          {/* End Date Selection */}
          <div className="space-y-1">
            <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
              <Calendar size={13} className="text-slate-400" /> End Range (To)
            </label>
            <input
              type="date"
              className="w-full border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none p-2.5 rounded-xl transition text-sm bg-slate-50/50"
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>
        </div>

        {/* Filter Execution Wrapper */}
        <div className="flex justify-end pt-2 border-t border-slate-50">
          <button
            onClick={fetchReports}
            className="inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition duration-150 active:scale-[0.98] w-full sm:w-auto shadow-sm shadow-slate-950/10"
          >
            <Filter size={16} />
            Apply Query Filters
          </button>
        </div>
      </div>

      {/* Attendance Report Data Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4 pl-6">Student Name</th>
                <th className="p-4">Matric No.</th>
                <th className="p-4">Course</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4 pr-6 text-right">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-slate-400 font-normal"
                  >
                    No logs found matching your selected query parameters.
                  </td>
                </tr>
              ) : (
                reports.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/50 transition duration-150"
                  >
                    <td className="p-4 pl-6 font-semibold text-slate-900">
                      {row.full_name}
                    </td>
                    <td className="p-4 text-slate-600 font-mono tracking-tight">
                      {row.matric_number}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100/50">
                        {row.course_code}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-normal">
                      {new Date(row.scanned_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span
                        className={`inline-flex items-center text-[10px] uppercase px-2 py-0.5 rounded-full font-extrabold tracking-wider ${
                          row.scan_method?.toLowerCase() === "qr" ||
                          row.scan_method?.toLowerCase() === "camera"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100/30"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {row.scan_method || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
