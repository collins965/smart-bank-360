import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  if (!isOpen) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-opacity-40 z-40"
      onClick={toggleSidebar}
    >
      {/* Sidebar */}
      <div
        className="w-56 h-full bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
      >
        {/* Close button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded px-2 py-1 text-sm"
        >
          Close
        </button>

        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Sidebar Menu
        </div>

        <ul className="p-4 space-y-4 text-sm">
          <li><Link to="/" className="hover:text-blue-400">Home</Link></li>

          {/* Financial Tools */}
          <li className="pt-4 font-semibold text-gray-400">Financial Tools</li>
          <li><Link to="/budget-planner" className="hover:text-blue-400">Budget Planner</Link></li>
          <li><Link to="/spending-insights" className="hover:text-blue-400">Spending Insights</Link></li>
          <li><Link to="/savings-goals" className="hover:text-blue-400">Savings Goals</Link></li>
          <li><Link to="/loan-calculator" className="hover:text-blue-400">Loan Calculator</Link></li>
          <li><Link to="/currency-converter" className="hover:text-blue-400">Currency Converter</Link></li>

          {/* Transactions & Activity */}
          <li className="pt-4 font-semibold text-gray-400">Transactions & Activity</li>
          <li><Link to="/transaction-history" className="hover:text-blue-400">Transaction History</Link></li>
          <li><Link to="/pending-transactions" className="hover:text-blue-400">Pending Transactions</Link></li>
          <li><Link to="/scheduled-payments" className="hover:text-blue-400">Scheduled Payments</Link></li>

          {/* Documents */}
          <li className="pt-4 font-semibold text-gray-400">Documents</li>
          <li><Link to="/e-Statements" className="hover:text-blue-400">eStatements</Link></li>
          <li><Link to="/tax-documents" className="hover:text-blue-400">Tax Documents</Link></li>
          <li><Link to="/proof-of-payment" className="hover:text-blue-400">Proof of Payment</Link></li>

          {/* Support & Help */}
          <li className="pt-4 font-semibold text-gray-400">Support & Help</li>
          <li><Link to="/faqs" className="hover:text-blue-400">Help Center / FAQs</Link></li>
          <li><Link to="/report-issue" className="hover:text-blue-400">Report an Issue</Link></li>

          {/* User Settings */}
          <li className="pt-4 font-semibold text-gray-400">User Settings</li>
          <li><Link to="/profile-settings" className="hover:text-blue-400">Profile Settings</Link></li>
          <li><Link to="/security-settings" className="hover:text-blue-400">Security Settings</Link></li>
          <li><Link to="/linked-accounts" className="hover:text-blue-400">Linked Accounts</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
