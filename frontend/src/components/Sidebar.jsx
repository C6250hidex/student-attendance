import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserSquare,
  BookOpen,
  LogOut,
  Camera,
  Menu,
  X,
  ClipboardList, // Add this
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      roles: ["admin", "lecturer", "student"],
    },
    {
      name: "Students",
      path: "/students",
      icon: <Users size={18} />,
      roles: ["admin"],
    },
    {
      name: "Register",
      path: "/register",
      icon: <UserSquare size={18} />,
      roles: ["admin"],
    },
    {
      name: "Attendance Scanner",
      path: "/scanner",
      icon: <Camera size={18} />,
      roles: ["admin", "lecturer"],
    },
    {
      name: "Lecturers",
      path: "/lecturers",
      icon: <UserSquare size={18} />,
      roles: ["admin"],
    },
    {
      name: "Courses",
      path: "/courses",
      icon: <BookOpen size={18} />,
      roles: ["admin", "lecturer"],
    },
    {
      name: "Reports", // NEW ITEM
      path: "/reports",
      icon: <ClipboardList size={18} />,
      roles: ["admin", "lecturer"],
    },
    {
      name: "My Digital ID",
      path: "/my-id",
      icon: <UserSquare size={18} />,
      roles: ["student"],
    },
  ];

  // Helper markup for rendering the inside of our navbar lists consistently
  const renderNavContent = () => (
    <>
      <div>
        {/* Premium Header Branding Zone */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <span className="text-xs font-black tracking-tighter">QR</span>
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
              QR Attend
            </span>
          </div>
          {/* Close button shown only inside mobile overlay drawers */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Navigation Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)} // Auto-collapse responsive menus on redirect click
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ease-in-out ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div
                    className={`transition-transform duration-200 group-hover:scale-105 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Modern Destructive Action Panel Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40">
        <button
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className="group flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          <LogOut
            size={18}
            className="text-rose-400 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-rose-600"
          />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 1. MOBILE HEADER BAR: Renders on small screen breakpoints, hidden on desktop layout frames */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shadow-sm no-print">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <span className="text-xs font-black tracking-tighter">QR</span>
          </div>
          <span className="text-md font-bold tracking-tight text-slate-900">
            QR Attend
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition active:scale-95"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* 2. SLIDEOVER MOBILE DRAWER MODAL: Uses portal backdrops behind navigation slide overlays */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex no-print">
          {/* Blackout click-out blur mask layer */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Actual slide-in content engine container panel */}
          <div className="relative w-64 max-w-xs bg-white h-full flex flex-col justify-between shadow-xl animate-slide-in border-r border-slate-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* 3. PERMANENT LARGE VISIBILITY RUNTIME SIDEBAR: Clean layout container for standard workstation monitor sizing profiles */}
      <div className="hidden lg:flex w-64 h-screen bg-white border-r border-slate-200 flex-col justify-between flex-shrink-0 z-40 shadow-sm no-print">
        {renderNavContent()}
      </div>

      {/* 4. CONTENT WRAPPER PADDING SHUNT: Prevents mobile top headers from overlapping layout routes */}
      <div className="lg:hidden h-16 w-full no-print" />
    </>
  );
};

export default Sidebar;
