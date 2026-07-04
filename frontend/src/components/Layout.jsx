import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Structural Workspace Sidebar */}
      <Sidebar />

      {/* Main Context Workspace Wrapper */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Modernized Top Navigation Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md h-16 border-b border-slate-200 flex items-center px-6 sm:px-8 justify-end transition-all duration-300">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Role:
            </span>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 shadow-sm capitalize">
              {JSON.parse(localStorage.getItem("user"))?.role || "Guest"}
            </span>
          </div>
        </header>

        {/* Dynamic Inner Page Content Body Canvas */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
