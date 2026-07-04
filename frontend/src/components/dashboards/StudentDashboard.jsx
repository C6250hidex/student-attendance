import React from "react";
import { CheckCircle, Calendar } from "lucide-react";

const StudentDashboard = ({ data }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-primary to-blue-700 p-8 rounded-2xl text-white shadow-xl">
      <h2 className="text-2xl opacity-90">My Attendance</h2>
      <p className="text-6xl font-black mt-2">{data.stats.totalAttended}</p>
      <p className="mt-2 opacity-80 italic">
        Total classes attended this semester
      </p>
    </div>
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Calendar className="text-primary" /> Recent Attendance Logs
      </h2>
      {data.history.length > 0 ? (
        data.history.map((h, i) => (
          <div
            key={i}
            className="flex justify-between py-4 border-b last:border-0"
          >
            <div>
              <p className="font-bold text-gray-800">{h.course_title}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                {h.course_code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-success font-bold flex items-center gap-1">
                <CheckCircle size={14} /> Present
              </p>
              <p className="text-[10px] text-gray-400">
                {new Date(h.scanned_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 py-10 text-center">
          No attendance recorded yet.
        </p>
      )}
    </div>
  </div>
);

export default StudentDashboard;
