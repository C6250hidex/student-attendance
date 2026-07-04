import React from "react";
import { CheckCircle, Calendar } from "lucide-react";

const StudentDashboard = ({ data }) => (
  <div className="space-y-8 animate-fade-in">
    {/* Modernized Banner Stats Hero */}
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-md shadow-blue-100/50">
      {/* Decorative background shape to add depth */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <h2 className="text-sm font-semibold tracking-wider uppercase text-blue-100">
        My Attendance
      </h2>
      <div className="mt-4 flex items-baseline space-x-2">
        <p className="text-6xl font-extrabold tracking-tight">
          {data.stats.totalAttended}
        </p>
        <span className="text-sm font-medium text-blue-200">sessions</span>
      </div>
      <p className="mt-3 text-sm text-blue-100/80 font-medium max-w-sm">
        Total classes successfully verified and attended this semester.
      </p>
    </div>

    {/* Log History Panel */}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
        <h2 className="font-semibold text-lg text-slate-900 flex items-center gap-2.5">
          <Calendar className="text-blue-600" size={20} /> Recent Attendance
          Logs
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Your chronological digital sign-ins across university courses.
        </p>
      </div>

      <div className="divide-y divide-slate-100 px-6">
        {data.history.length > 0 ? (
          data.history.map((h, i) => (
            <div
              key={i}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 transition-colors duration-150 hover:bg-slate-50/40 -mx-6 px-6"
            >
              <div className="space-y-1 mb-3 sm:mb-0">
                <p className="font-bold text-sm text-slate-800 tracking-wide transition-colors group-hover:text-blue-600">
                  {h.course_title}
                </p>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {h.course_code}
                </span>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md ring-1 ring-inset ring-emerald-600/10">
                  <CheckCircle size={12} className="text-emerald-600" /> Present
                </span>
                <p className="text-xs text-slate-400 tabular-nums">
                  {new Date(h.scanned_at).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-slate-400">
              No attendance recorded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StudentDashboard;
