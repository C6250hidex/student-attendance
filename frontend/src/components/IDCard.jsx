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
      className="w-[350px] h-[500px] border-2 border-gray-800 bg-white p-4 rounded-xl shadow-2xl relative overflow-hidden flex flex-col items-center"
    >
      {/* Header */}
      <div className="bg-primary w-full text-white text-center py-3 absolute top-0">
        <h2 className="text-xs font-bold tracking-widest uppercase">
          University Attendance System
        </h2>
      </div>

      {/* Student Photo */}
      <div className="mt-12 w-32 h-32 border-4 border-primary overflow-hidden rounded-xl shadow-md bg-gray-100">
        <img
          src={photoUrl}
          alt="Student"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
      </div>

      {/* Student Details */}
      <div className="text-center mt-6">
        <h3 className="text-xl font-bold uppercase text-gray-800 leading-tight">
          {student.full_name || "N/A"}
        </h3>
        <p className="text-gray-500 font-mono text-sm mt-1 uppercase">
          {student.matric_number || "N/A"}
        </p>
        <p className="text-xs font-semibold text-gray-400 mt-2">
          {student.department_name || "N/A"}
        </p>
        <div className="mt-2 inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold">
          LEVEL: {student.level}
        </div>
      </div>

      {/* Barcode & QR Code Section */}
      <div className="mt-auto flex flex-col items-center w-full pb-6 space-y-3">
        {/* Barcode */}
        <div className="bg-white p-1 rounded">
          {student.barcode ? (
            <Barcode
              value={student.barcode}
              height={35}
              width={1.2}
              fontSize={10}
              background="transparent"
            />
          ) : (
            <p className="text-[8px] text-red-500">Barcode Data Missing</p>
          )}
        </div>

        {/* QR Code */}
        <div className="w-20 h-20 bg-gray-50 p-1 border border-gray-100 rounded-lg">
          {student.qr_code_image ? (
            <img
              src={student.qr_code_image}
              alt="QR"
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">
              No QR
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-primary w-full text-[9px] text-white text-center py-1 absolute bottom-0 font-medium">
        OFFICIAL STUDENT IDENTIFICATION CARD
      </div>
    </div>
  );
};

export default IDCard;
