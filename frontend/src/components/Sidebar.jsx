import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserSquare,
  BookOpen,
  LogOut,
  Camera,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["admin", "lecturer", "student"],
    },
    {
      name: "Students",
      path: "/students",
      icon: <Users size={20} />,
      roles: ["admin"],
    },
    {
      name: "Register",
      path: "/register",
      icon: <UserSquare size={20} />,
      roles: ["admin"],
    },
    {
      name: "Attendance Scanner",
      path: "/scanner",
      icon: <Camera size={20} />,
      roles: ["admin", "lecturer"],
    },
    {
      name: "Lecturers",
      path: "/lecturers",
      icon: <UserSquare size={20} />,
      roles: ["admin"],
    },
    {
      name: "Courses",
      path: "/courses",
      icon: <BookOpen size={20} />,
      roles: ["admin", "lecturer"],
    },
    {
      name: "My Digital ID",
      path: "/my-id",
      icon: <UserSquare size={20} />,
      roles: ["student"],
    },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-6 text-2xl font-bold text-primary border-b">
        QR Attend
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
