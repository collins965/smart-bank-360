import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

import LoginForm from './components/auth/LoginForm';
import SignUp from './components/auth/Signup';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import AccountCard from './components/banking/AccountCard';
import SavingsGoals from './pages/SavingsGoals';

import Home from './pages/Home'; // authenticated home
import Landing from './pages/Landing'; // public landing
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import NotFound from './pages/NotFound';
import BudgetPlanner from './pages/BudgetPlanner';
import LoanCalculator from './pages/LoanCalculator';
import CurrencyConverter from './pages/CurrencyConvertor';
import Faqs from './pages/FAQs';
import ReportIssue from './pages/ReportIssue';
import ProfileSettings from './pages/ProfileSettings';
import SecuritySettings from './pages/SecuritySettings';
import LinkedAccounts from './pages/LinkedAccounts';
import Transaction from './pages/Transaction';
import EStatements from './pages/eStatements';
import TaxDocuments from './pages/TaxDocuments';
import ProofOfPayment from './pages/Proofofpayment';
import TransactionHistory from './pages/TransactionHistory';
import ScheduledPayments from './pages/ScheduledPayments';
import PendingTransactions from './pages/PendingTransactions';
import SpendingInsights from './pages/SpendingInsights';
import Loan from './pages/Loan';

import './App.css';

const App = () => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ProtectedRoute = ({ element }) => {
    if (loading) return <div className="p-10 text-xl">Loading...</div>;
    return user && user.email ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen relative">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar user={user} />
        </div>

        {/* Navbar */}
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} user={user} />

        {/* Main Content */}
        <div className="flex flex-1">
          <main className="flex-grow bg-gray-100 p-4">
            <Routes>
              {/* Auth pages */}
              <Route
                path="/login"
                element={!loading && user ? <Navigate to="/home" replace /> : <LoginForm />}
              />
              <Route
                path="/signup"
                element={!loading && user ? <Navigate to="/home" replace /> : <SignUp />}
              />

              {/* Public landing page */}
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/budget-planner" element={<BudgetPlanner />} />
              <Route path="/loan-calculator" element={<LoanCalculator />} />
              <Route path="/currency-converter" element={<CurrencyConverter />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/report-issue" element={<ReportIssue />} />

              {/* Authenticated Home (Dashboard) */}
              <Route path="/home" element={<ProtectedRoute element={<Home />} />} />

              {/* Protected Routes */}
              <Route path="/account" element={<ProtectedRoute element={<AccountCard />} />} />
              <Route path="/profile-settings" element={<ProtectedRoute element={<ProfileSettings />} />} />
              <Route path="/security-settings" element={<ProtectedRoute element={<SecuritySettings />} />} />
              <Route path="/linked-accounts" element={<ProtectedRoute element={<LinkedAccounts />} />} />
              <Route path="/transaction" element={<ProtectedRoute element={<Transaction />} />} />
              <Route path="/savings-goals" element={<ProtectedRoute element={<SavingsGoals />} />} />
              <Route path="/e-statements" element={<ProtectedRoute element={<EStatements />} />} />
              <Route path="/tax-documents" element={<ProtectedRoute element={<TaxDocuments />} />} />
              <Route path="/transaction-history" element={<ProtectedRoute element={<TransactionHistory />} />} />
              <Route path="/proof-of-payment" element={<ProtectedRoute element={<ProofOfPayment />} />} />
              <Route path="/scheduled-payments" element={<ProtectedRoute element={<ScheduledPayments />} />} />
              <Route path="/pending-transactions" element={<ProtectedRoute element={<PendingTransactions />} />} />
              <Route path="/spending-insights" element={<ProtectedRoute element={<SpendingInsights />} />} />
              <Route path="/loan" element={<ProtectedRoute element={<Loan />} />} />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
