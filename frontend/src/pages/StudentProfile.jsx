import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import IDCard from "../components/IDCard";
import { AuthContext } from "../store/AuthContext";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        // We'll create this endpoint in a moment
        const res = await api.get(`/students/profile/me`);
        setStudentData(res.data);
      } catch (err) {
        console.error("Failed to load profile");
      }
    };
    fetchMyProfile();
  }, []);

  if (!studentData)
    return <div className="p-10">Loading your Digital ID...</div>;

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">My Digital ID Card</h1>
        <p className="text-gray-500">
          Present this QR Code to your lecturer for attendance
        </p>
      </div>

      {/* Reuse the IDCard component we built in Phase 7 */}
      <IDCard student={studentData} />

      <button
        onClick={() => window.print()}
        className="bg-primary text-white px-6 py-2 rounded-lg no-print"
      >
        Download / Print PDF
      </button>
    </div>
  );
};

export default StudentProfile;
