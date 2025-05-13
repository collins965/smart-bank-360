import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gray-800 text-white h-screen p-4 transition-all duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Link to="/" className={`${!isOpen && "hidden"}`}>
              Smart Bank 360
            </Link>
          </div>
          {/* Toggle Sidebar Button */}
          <button
            onClick={toggleSidebar}
            className="text-white md:hidden focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="mt-6">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className="block py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition"
              >
                {isOpen && "Dashboard"}
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="block py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition"
              >
                {isOpen && "Profile"}
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="block py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition"
              >
                {isOpen && "Settings"}
              </Link>
            </li>
            <li>
              <Link
                to="/transactions"
                className="block py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition"
              >
                {isOpen && "Transactions"}
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                className="block py-3 px-4 rounded-md hover:bg-gray-700 hover:text-white transition"
              >
                {isOpen && "Logout"}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {/* Your main content here */}
      </div>
    </div>
  );
};

export default Sidebar;
