import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white h-16 border-b flex items-center px-8 justify-end">
          <span className="font-semibold text-gray-700">
            Role:{" "}
            <span className="capitalize text-primary font-bold">
              {JSON.parse(localStorage.getItem("user"))?.role}
            </span>
          </span>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
