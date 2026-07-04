import React, { useEffect, useState } from "react";
import api from "../services/api";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import LecturerDashboard from "../components/dashboards/LecturerDashboard";
import StudentDashboard from "../components/dashboards/StudentDashboard";
import { RefreshCcw, AlertCircle } from "lucide-react";
import { io } from "socket.io-client"; // Import Socket.IO client

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Initial Data Fetch
    const fetchDashboard = async () => {
      try {
        setError(false);
        const res = await api.get("/dashboard/stats");
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error", err);
        setError(true);
      } finally {
        setLoading(false); // FIXED: Changed from loading(false)
      }
    };

    fetchDashboard();

    // 2. Real-time Socket Listener
    // Change this URL to your Render Backend URL when deploying
    const socket = io("http://localhost:5000");

    socket.on("newAttendance", (newScan) => {
      console.log("Real-time scan received:", newScan);

      setData((prevData) => {
        if (!prevData) return prevData;

        // If the user is an Admin, update the 'recent' list immediately
        if (prevData.role === "admin") {
          return {
            ...prevData,
            stats: {
              ...prevData.stats,
              attendance: prevData.stats.attendance + 1,
            },
            recent: [newScan, ...prevData.recent.slice(0, 4)], // Keep last 5
          };
        }

        // If user is Student or Lecturer, you could increment their specific stats here too
        return prevData;
      });
    });

    // Cleanup socket on unmount
    return () => socket.disconnect();
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

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-center">
        <AlertCircle size={40} className="text-rose-500 mb-2" />
        <h3 className="text-lg font-bold">Failed to load dashboard</h3>
        <p className="text-slate-500 text-sm">
          Please check your internet connection or login again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-600 font-bold underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <header className="pb-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome Back!
        </h1>
        <p className="text-base text-slate-500 mt-1 font-medium">
          Here is what's happening across your modules today.
        </p>
      </header>

      <div className="transition-all duration-300">
        {data?.role === "admin" && <AdminDashboard data={data} />}
        {data?.role === "lecturer" && <LecturerDashboard data={data} />}
        {data?.role === "student" && <StudentDashboard data={data} />}
      </div>
    </div>
  );
};

export default Dashboard;
