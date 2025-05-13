import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-extrabold text-blue-400 tracking-wide">
          <Link to="/" className="hover:text-white transition-colors">Smart Bank 360</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-10 text-sm font-medium">
          <Link to="/" className="hover:text-blue-300 transition-colors duration-200">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-300 transition-colors duration-200">
            About
          </Link>
          <Link to="/services" className="hover:text-blue-300 transition-colors duration-200">
            Services
          </Link>
          <Link to="/contact" className="hover:text-blue-300 transition-colors duration-200">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none text-white"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-gray-800 px-6 py-4 space-y-3 text-sm`}>
        <Link to="/" className="block hover:text-blue-300 transition-colors">
          Home
        </Link>
        <Link to="/about" className="block hover:text-blue-300 transition-colors">
          About
        </Link>
        <Link to="/services" className="block hover:text-blue-300 transition-colors">
          Services
        </Link>
        <Link to="/contact" className="block hover:text-blue-300 transition-colors">
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
