import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-4">
        <Outlet /> {/* Render matched route inside here */}
      </div>
    </div>
  );
};

export default Layout;
