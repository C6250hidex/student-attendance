import React from "react";
import Barcode from "react-barcode";

const IDCard = ({ student }) => {
  if (!student) return null;

  // Construct the full URL for the photo
  const photoUrl = student.photo
    ? `http://localhost:5000/${student.photo.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/150";

  return (
    <div
      id="id-card"
      className="w-[350px] h-[500px] border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-4 rounded-2xl shadow-xl relative overflow-hidden flex flex-col items-center"
    >
      {/* Premium Header Accent Layer */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-10 pointer-events-none" />

      {/* Header Text Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-full text-white text-center py-3.5 absolute top-0 shadow-sm">
        <h2 className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-50">
          University Attendance System
        </h2>
      </div>

      {/* Student Photo Container */}
      <div className="mt-14 w-32 h-32 border-4 border-white ring-4 ring-blue-600/10 overflow-hidden rounded-full shadow-md bg-slate-100 flex-shrink-0 z-10 transition-transform duration-300 hover:scale-105">
        <img
          src={photoUrl}
          alt="Student"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
      </div>

      {/* Student Details Block */}
      <div className="text-center mt-5 space-y-1 w-full px-2">
        <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800 leading-tight truncate">
          {student.full_name || "N/A"}
        </h3>
        <p className="text-blue-600 font-mono text-sm font-semibold tracking-wider uppercase">
          {student.matric_number || "N/A"}
        </p>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate max-w-xs mx-auto">
          {student.department_name || "N/A"}
        </p>

        <div className="pt-1.5">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">
            LEVEL: {student.level}
          </span>
        </div>
      </div>

      {/* Scannable Codes Segment */}
      <div className="mt-auto flex items-center justify-between w-full max-w-[290px] pb-6 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-slate-100/80 shadow-sm mb-3">
        {/* Barcode Element */}
        <div className="flex flex-col items-center justify-center bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm">
          {student.barcode ? (
            <Barcode
              value={student.barcode}
              height={32}
              width={1.0}
              fontSize={9}
              background="transparent"
            />
          ) : (
            <p className="text-[8px] font-bold tracking-wider text-rose-500 py-2 px-1">
              Barcode Missing
            </p>
          )}
        </div>

        {/* QR Code Graphic Frame */}
        <div className="w-16 h-16 bg-white p-1.5 border border-slate-100 shadow-sm rounded-lg flex items-center justify-center flex-shrink-0">
          {student.qr_code_image ? (
            <img
              src={student.qr_code_image}
              alt="QR"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[8px] font-medium text-slate-400 bg-slate-50 rounded">
              No QR
            </div>
          )}
        </div>
      </div>

      {/* Bottom Legal Identification Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 w-full text-[9px] font-bold tracking-widest text-blue-100 text-center py-2 absolute bottom-0">
        OFFICIAL STUDENT IDENTIFICATION CARD
      </div>
    </div>
  );
};

export default IDCard;
