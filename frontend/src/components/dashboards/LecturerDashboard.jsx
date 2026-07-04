import React from "react";
import { BookOpen, PlayCircle, Clock } from "lucide-react";

const LecturerDashboard = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
        <div className="p-4 bg-orange-100 text-orange-600 rounded-full">
          <BookOpen />
        </div>
        <div>
          <p className="text-gray-500">My Courses</p>
          <p className="text-2xl font-bold">{data.stats.myCourses}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
        <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
          <Clock />
        </div>
        <div>
          <p className="text-gray-500">Total Sessions Conducted</p>
          <p className="text-2xl font-bold">{data.stats.totalSessions}</p>
        </div>
      </div>
    </div>
    <div
      className={`p-8 rounded-xl border-2 flex flex-col items-center justify-center space-y-4 ${data.stats.activeSession ? "border-green-500 bg-green-50" : "border-dashed border-gray-300 bg-white"}`}
    >
      <h3 className="text-xl font-bold">
        {data.stats.activeSession
          ? "Attendance Session is LIVE"
          : "No Active Session"}
      </h3>
      <button
        className={`${data.stats.activeSession ? "bg-red-500" : "bg-primary"} text-white px-8 py-3 rounded-full font-bold shadow-lg`}
      >
        {data.stats.activeSession ? "Stop Session" : "Start New Session"}
      </button>
    </div>
  </div>
);

export default LecturerDashboard;
