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
  const stopAttendance = async () => {
    if (
      window.confirm(
        "Are you sure you want to close this session? No more students will be able to scan.",
      )
    ) {
      try {
        // We should create this 'close' endpoint in the backend
        await api.put(`/attendance/session/${sessionId}/close`);
        window.location.reload();
      } catch (err) {
        window.location.reload(); // Fail gracefully
      }
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* View Header */}
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Camera size={20} />
        </div>
        Attendance Scanner
      </h1>

      {!sessionId ? (
        /* Configuration Stage Control Panel Card */
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-6">
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              Select Course to Scan
            </h2>
            <p className="text-sm text-slate-500">
              Pick the active academic course module you are currently hosting
              to activate authentication terminals.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <select
              className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-base text-slate-900 transition duration-200 ease-in-out focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm"
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Choose Course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_code} — {c.course_title}
                </option>
              ))}
            </select>
          </div>

          <div className="max-w-xl mx-auto pt-2">
            <button
              onClick={startAttendance}
              disabled={!selectedCourse}
              className="inline-flex items-center justify-center w-full rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-600/10 transition-all duration-200 ease-in-out hover:bg-blue-500 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:pointer-events-none disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              Initialize Webcam Scanner
            </button>
          </div>
        </div>
      ) : (
        /* Active Scanner Grid Terminal */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Hardware Stream Viewfinder Frame */}
          <div className="bg-slate-950 p-3 rounded-2xl shadow-md border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/50">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">
                Camera Source
              </span>
            </div>
            <div
              id="reader"
              className="rounded-xl overflow-hidden [&_video]:rounded-xl [&_img]:mx-auto bg-slate-900"
            ></div>
          </div>

          {/* Operational Status Control Deck Panel */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                  Active Terminal
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Hardware operational, reading credentials
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ring-1 ring-inset ring-emerald-600/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live
              </div>
            </div>

            {/* Scanning Status Feedback Shield */}
            <div
              className={`p-5 rounded-xl border transition-all duration-300 ${
                lastScanned
                  ? "bg-blue-50/60 border-blue-200/80 shadow-inner"
                  : "bg-slate-50/80 border-slate-200/60"
              }`}
            >
              <p className="text-[11px] text-slate-500 font-bold mb-2 uppercase tracking-widest">
                Current Scan Result
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {lastScanned ? (
                    <CheckCircle2
                      className="text-blue-600 animate-bounce"
                      size={22}
                    />
                  ) : (
                    <RefreshCcw
                      className="text-slate-400 animate-spin"
                      size={20}
                    />
                  )}
                </div>
                <span
                  className={`text-base font-mono font-bold break-all tracking-tight ${lastScanned ? "text-blue-900" : "text-slate-500"}`}
                >
                  {lastScanned || "Awaiting credentials..."}
                </span>
              </div>
            </div>

            {/* Security Actions Section */}
            <div className="space-y-4 pt-2">
              <p className="text-xs leading-relaxed text-slate-400 text-center max-w-xs mx-auto">
                Align the student identity card's barcode or QR module directly
                within the central viewfinder crosshairs under flat lighting.
              </p>
              <button
                onClick={stopAttendance}
                className="inline-flex items-center justify-center w-full gap-2 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-rose-500/10"
              >
                <StopCircle size={18} /> Terminate Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceScanner;
