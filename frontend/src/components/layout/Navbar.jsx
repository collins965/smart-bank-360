import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* Optional Sidebar for Desktop */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Navbar */}
      <nav className="bg-gray-900 text-white z-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex flex-col items-start">
            <Link to="/" className="text-2xl font-bold text-blue-400 mb-1">
              Smart Bank 360
            </Link>
            {/* Sidebar Toggle (Desktop) */}
            <button
              onClick={toggleSidebar}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Sidebar
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-blue-300">Home</Link>
            <Link to="/about" className="hover:text-blue-300">About</Link>
            <Link to="/services" className="hover:text-blue-300">Services</Link>
            <Link to="/contact" className="hover:text-blue-300">Contact</Link>
            <Link to="/loan" className="hover:text-blue-600 font-medium">Loan</Link>
            <Link to="/transaction" className="hover:text-blue-300">Transact</Link>
            <Link to="/account" className="hover:text-blue-300">My Account</Link>
          </div>

          {/* Mobile Hamburger Icon */}
          <button
            className="md:hidden text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Slide-in Mobile Menu (Right Side) */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white transform ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out z-50 md:hidden`}
        >
          <div className="p-6 space-y-4">
            <div className="flex justify-end">
              <button
                onClick={toggleMobileMenu}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-4"
              >
                Close
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={toggleMobileMenu} className="hover:text-blue-300">Home</Link>
              <Link to="/about" onClick={toggleMobileMenu} className="hover:text-blue-300">About</Link>
              <Link to="/services" onClick={toggleMobileMenu} className="hover:text-blue-300">Services</Link>
              <Link to="/contact" onClick={toggleMobileMenu} className="hover:text-blue-300">Contact</Link>
              <Link to="/loan" onClick={toggleMobileMenu} className="hover:text-blue-600 font-medium">Loan</Link>
              <Link to="/transaction" onClick={toggleMobileMenu} className="hover:text-blue-300">Transact</Link>
              <Link to="/account" onClick={toggleMobileMenu} className="hover:text-blue-300">My Account</Link>
            </nav>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          />
        )}
      </nav>
    </>
  );
};

export default Navbar;
