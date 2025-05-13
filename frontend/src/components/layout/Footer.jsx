import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Footer Content Left */}
          <div className="text-center md:text-left">
            <p className="text-lg font-bold">Smart Bank 360</p>
            <p className="text-sm text-gray-400 mt-2">
              © 2025 Smart Bank 360. All rights reserved.
            </p>
          </div>

          {/* Footer Navigation Links */}
          <div className="mt-6 md:mt-0 space-x-4 flex justify-center md:justify-end">
            <a
              href="/about"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              About Us
            </a>
            <a
              href="/services"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Services
            </a>
            <a
              href="/contact"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Contact
            </a>
            <a
              href="/privacy-policy"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
