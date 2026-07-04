import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import IDCard from "../components/IDCard";
import { AuthContext } from "../store/AuthContext";
import { Printer, RefreshCcw, QrCode } from "lucide-react";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await api.get(`/students/profile/me`);
        setStudentData(res.data);
      } catch (err) {
        console.error("Failed to load profile");
      }
    };
    fetchMyProfile();
  }, []);

  useEffect(() => {
    // Set the document title so the PDF name looks professional when saving
    document.title = `ID_Card_${user?.full_name || "Student"}`;

    const fetchMyProfile = async () => {
      try {
        const res = await api.get(`/students/profile/me`);
        setStudentData(res.data);
      } catch (err) {
        toast.error("Security: Unable to verify student credentials.");
        console.error("Failed to load profile", err);
      }
    };
    fetchMyProfile();
  }, [user]);

  if (!studentData) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-10 space-y-4 text-slate-500">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl animate-spin shadow-sm border border-blue-100/50">
          <RefreshCcw size={24} />
        </div>
        <p className="text-sm font-medium animate-pulse tracking-wide text-slate-600">
          Generating your Digital ID...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto py-4 animate-fade-in font-sans antialiased">
      {/* Informative Presentation Header */}
      <div className="text-center space-y-2 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/60 text-blue-700 text-xs font-semibold tracking-wide mb-1">
          <QrCode size={14} /> Attendance Credential Staged
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          My Digital ID Card
        </h1>
        <p className="text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed">
          Present this secure dashboard layout window or the integrated QR
          target to your instructor for instantaneous check-in validation.
        </p>
      </div>

      {/* Structural ID Container Element */}
      <div className="w-full flex justify-center drop-shadow-xl shadow-slate-200/50 transform transition duration-300 hover:scale-[1.01]">
        <IDCard student={studentData} />
      </div>

      {/* Print Trigger Control Layout Block */}
      <button
        onClick={() => window.print()}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all duration-200 ease-in-out hover:bg-slate-800 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 no-print print:hidden w-full sm:w-auto"
      >
        <Printer size={16} />
        Download / Print PDF
      </button>
    </div>
  );
};

export default StudentProfile;
