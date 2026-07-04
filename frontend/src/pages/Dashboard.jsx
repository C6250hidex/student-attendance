import React, { useEffect, useState } from "react";
import api from "../services/api";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import LecturerDashboard from "../components/dashboards/LecturerDashboard";
import StudentDashboard from "../components/dashboards/StudentDashboard";
import { RefreshCcw } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        loading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-10 space-y-4 text-slate-500">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl animate-spin shadow-sm border border-blue-100/50">
          <RefreshCcw size={24} />
        </div>
        <p className="text-sm font-medium animate-pulse tracking-wide text-slate-600">
          Loading your personalized dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Modernized Action Welcome Header Group */}
      <header className="pb-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome Back!
        </h1>
        <p className="text-base text-slate-500 mt-1 font-medium">
          Here is what's happening across your modules today.
        </p>
      </header>

      {/* Conditional Dashboard Sub-system Controller */}
      <div className="transition-all duration-300">
        {data?.role === "admin" && <AdminDashboard data={data} />}
        {data?.role === "lecturer" && <LecturerDashboard data={data} />}
        {data?.role === "student" && <StudentDashboard data={data} />}
      </div>
    </div>
  );
};

export default Dashboard;
