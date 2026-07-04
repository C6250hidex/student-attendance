import React from "react";
import { BookOpen, PlayCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Added for navigation

const LecturerDashboard = ({ data }) => {
  const navigate = useNavigate(); // Initialize navigation

  const handleSessionAction = () => {
    if (data.stats.activeSession) {
      // If session is live, go to scanner to manage it
      navigate("/scanner");
    } else {
      // If no session, go to scanner to start one
      navigate("/scanner");
    }
  };

  return (
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

        {/* Total Sessions Card */}
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

        <p
          className={`text-sm max-w-sm text-center font-medium ${data.stats.activeSession ? "text-emerald-700" : "text-slate-400"}`}
        >
          {data.stats.activeSession
            ? "Students can now scan and sign in. Proceed to the scanner to manage this session."
            : "Start a new terminal session to begin accepting student biometric/QR credentials."}
        </p>

        <button
          onClick={handleSessionAction} // ADDED: Click handler
          className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            data.stats.activeSession
              ? "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500"
              : "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-600"
          }`}
        >
          {data.stats.activeSession ? "Manage Session" : "Start New Session"}
        </button>
      </div>
    </div>
  );
};

export default LecturerDashboard;
