import React from "react";
import { BookOpen, PlayCircle, Clock } from "lucide-react";

const LecturerDashboard = ({ data }) => (
  <div className="space-y-8 animate-fade-in">
    {/* Statistics Metrics Grid */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* My Courses Card */}
      <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-md flex items-center gap-5">
        <div className="p-4 bg-amber-50 text-amber-600 rounded-xl transition-colors duration-300 group-hover:bg-amber-100/80">
          <BookOpen
            size={24}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div>
          <p className="text-sm font-medium tracking-wide text-slate-500 uppercase">
            My Courses
          </p>
          <p className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {data.stats.myCourses}
          </p>
        </div>
      </div>

      {/* Total Sessions Conducted Card */}
      <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-md flex items-center gap-5">
        <div className="p-4 bg-blue-50 text-blue-600 rounded-xl transition-colors duration-300 group-hover:bg-blue-100/80">
          <Clock
            size={24}
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div>
          <p className="text-sm font-medium tracking-wide text-slate-500 uppercase">
            Total Sessions Conducted
          </p>
          <p className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {data.stats.totalSessions}
          </p>
        </div>
      </div>
    </div>

    {/* Session Management Action Panel */}
    <div
      className={`p-8 rounded-2xl border-2 flex flex-col items-center justify-center space-y-5 transition-all duration-300 ease-in-out ${
        data.stats.activeSession
          ? "border-emerald-500 bg-emerald-50/40 shadow-sm shadow-emerald-100/50"
          : "border-dashed border-slate-300 bg-white shadow-inner shadow-slate-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        {data.stats.activeSession && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        )}
        <h3
          className={`text-xl font-bold tracking-tight ${data.stats.activeSession ? "text-emerald-900" : "text-slate-800"}`}
        >
          {data.stats.activeSession
            ? "Attendance Session is LIVE"
            : "No Active Session"}
        </h3>
      </div>

      {data.stats.activeSession && (
        <p className="text-sm text-emerald-700 max-w-sm text-center font-medium">
          Students can now scan and sign in. Closing this panel will terminate
          the window.
        </p>
      )}

      <button
        className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          data.stats.activeSession
            ? "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus:ring-red-500 shadow-red-100"
            : "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 focus:ring-blue-600 shadow-blue-100"
        }`}
      >
        {data.stats.activeSession ? "Stop Session" : "Start New Session"}
      </button>
    </div>
  </div>
);

export default LecturerDashboard;
