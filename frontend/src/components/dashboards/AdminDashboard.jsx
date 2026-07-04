import React from "react";
import { Users, UserCheck, Activity } from "lucide-react";

const AdminDashboard = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg">
        <Users size={40} className="mb-2 opacity-80" />
        <h3 className="text-lg opacity-90">Total Students</h3>
        <p className="text-4xl font-bold">{data.stats.students}</p>
      </div>
      <div className="bg-purple-600 p-6 rounded-xl text-white shadow-lg">
        <UserCheck size={40} className="mb-2 opacity-80" />
        <h3 className="text-lg opacity-90">Total Lecturers</h3>
        <p className="text-4xl font-bold">{data.stats.lecturers}</p>
      </div>
      <div className="bg-green-600 p-6 rounded-xl text-white shadow-lg">
        <Activity size={40} className="mb-2 opacity-80" />
        <h3 className="text-lg opacity-90">Overall Attendance</h3>
        <p className="text-4xl font-bold">{data.stats.attendance}</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="font-bold text-xl mb-4">Live System Activity</h2>
      {data.recent.map((log, i) => (
        <div
          key={i}
          className="flex justify-between py-3 border-b last:border-0"
        >
          <span className="font-medium">{log.full_name}</span>
          <span className="text-primary font-bold">{log.course_code}</span>
          <span className="text-gray-400 text-sm">
            {new Date(log.scanned_at).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDashboard;
