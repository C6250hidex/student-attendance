import React from "react";
import { Users, UserCheck, Activity } from "lucide-react";

const AdminDashboard = ({ data }) => (
  <div className="space-y-8 animate-fade-in">
    {/* Statistics Grid */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Total Students Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
        <div className="flex items-center space-x-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors duration-300 group-hover:bg-blue-100">
            <Users
              size={26}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-wide text-slate-500 uppercase">
              Total Students
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {data.stats.students}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
      </div>

      {/* Total Lecturers Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
        <div className="flex items-center space-x-4">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-100">
            <UserCheck
              size={26}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-wide text-slate-500 uppercase">
              Total Lecturers
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {data.stats.lecturers}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-indigo-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
      </div>

      {/* Overall Attendance Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-slate-300 hover:shadow-md sm:col-span-2 lg:col-span-1">
        <div className="flex items-center space-x-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-100">
            <Activity
              size={26}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-wide text-slate-500 uppercase">
              Overall Attendance
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {data.stats.attendance}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
      </div>
    </div>

    {/* Live System Activity Table / List Card */}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Live System Activity
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Real-time tracking logs for campus wide check-ins.
        </p>
      </div>

      <div className="divide-y divide-slate-100 px-6">
        {data.recent.map((log, i) => (
          <div
            key={i}
            className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 transition-colors duration-200 hover:bg-slate-50/50 -mx-6 px-6"
          >
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50 animate-pulse" />
              <span className="font-semibold text-sm text-slate-800 tracking-wide">
                {log.full_name}
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end sm:space-x-8">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {log.course_code}
              </span>
              <span className="text-xs font-medium text-slate-400 tabular-nums">
                {new Date(log.scanned_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
