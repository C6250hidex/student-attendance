import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../services/api";
import { toast } from "react-toastify";
import { Camera, StopCircle, CheckCircle2, RefreshCcw } from "lucide-react";

const AttendanceScanner = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [lastScanned, setLastScanned] = useState("");
  const scannerRef = useRef(null); // Reference to hold the scanner instance

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data));
  }, []);

  const startAttendance = async () => {
    if (!selectedCourse) return toast.error("Please select a course");
    try {
      const res = await api.post("/attendance/start", {
        course_id: selectedCourse,
      });
      setSessionId(res.data.sessionId);
      toast.success("Attendance Session Started!");
    } catch (err) {
      toast.error("Failed to start session");
    }
  };

  // UseEffect to start scanner ONLY when sessionId is set
  useEffect(() => {
    if (sessionId && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.0,
      });

      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;
    }

    // Cleanup function to stop scanner when component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.error("Scanner clear error", err));
        scannerRef.current = null;
      }
    };
  }, [sessionId]);

  const onScanSuccess = async (decodedText, result) => {
    // Prevent multiple rapid scans of the same code
    if (decodedText === lastScanned) return;

    setLastScanned(decodedText);

    try {
      // DETECT FORMAT
      const format = result.result.format.formatName;
      const method = format.includes("QR") ? "qrcode" : "barcode";

      const res = await api.post("/attendance/mark", {
        sessionId: sessionId,
        scannedCode: decodedText,
        method: method,
      });

      toast.success(res.data.message);

      // Clear last scanned after 3 seconds to allow re-scanning if needed
      setTimeout(() => setLastScanned(""), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Scan Error");
      // Also clear after error so the lecturer can try again
      setTimeout(() => setLastScanned(""), 2000);
    }
  };

  const onScanError = (error) => {
    // Scanning is constant, we don't want to spam the console with "No QR code found"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Camera className="text-primary" /> Attendance Scanner
      </h1>

      {!sessionId ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Select Course to Scan</h2>
            <p className="text-gray-500">
              Pick the course you are currently teaching
            </p>
          </div>

          <select
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-lg"
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Choose Course...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_code} - {c.course_title}
              </option>
            ))}
          </select>

          <button
            onClick={startAttendance}
            disabled={!selectedCourse}
            className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95 disabled:bg-gray-300"
          >
            Initialize Webcam Scanner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* The Camera Container */}
          <div className="bg-white p-4 rounded-2xl shadow-xl border-2 border-primary overflow-hidden">
            <div id="reader" className="rounded-lg overflow-hidden"></div>
          </div>

          {/* Status & Feedback Panel */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-bold text-xl">Active Session</h3>
                <p className="text-sm text-gray-500">Ready to receive codes</p>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                <span className="animate-ping h-2 w-2 rounded-full bg-green-500"></span>
                Live
              </div>
            </div>

            <div
              className={`p-6 rounded-xl border-2 transition-all ${lastScanned ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-100"}`}
            >
              <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">
                Current Scan Result
              </p>
              <div className="flex items-center gap-3">
                {lastScanned ? (
                  <CheckCircle2 className="text-primary animate-bounce" />
                ) : (
                  <RefreshCcw className="text-gray-300 animate-spin" />
                )}
                <span className="text-lg font-mono font-bold break-all">
                  {lastScanned || "Scanning..."}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-xs text-gray-400 text-center">
                Ensure the student ID card is well-lit and centered in the
                frame.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
              >
                <StopCircle size={20} /> Terminate Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceScanner;
