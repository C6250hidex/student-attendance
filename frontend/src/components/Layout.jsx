import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../store/AuthContext";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    // FIX: Added flex-col for mobile and flex-row for desktop
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Top Navigation Header */}
        {/* We hide the Layout header on mobile because Sidebar.jsx already has a mobile header */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white/80 backdrop-blur-md h-16 border-b border-slate-200 items-center px-8 justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Role:
            </span>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 shadow-sm capitalize">
              {user?.role || "Guest"}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
