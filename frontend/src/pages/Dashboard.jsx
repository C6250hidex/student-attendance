import React, { useEffect, useState } from "react";
import api from "../services/api";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import LecturerDashboard from "../components/dashboards/LecturerDashboard";
import StudentDashboard from "../components/dashboards/StudentDashboard";

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
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="p-10 animate-pulse text-gray-500">
        Loading your personalized dashboard...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800">Welcome Back!</h1>
        <p className="text-gray-500">Here is what's happening today.</p>
      </header>

      {data?.role === "admin" && <AdminDashboard data={data} />}
      {data?.role === "lecturer" && <LecturerDashboard data={data} />}
      {data?.role === "student" && <StudentDashboard data={data} />}
    </div>
  );
};

export default Dashboard;
