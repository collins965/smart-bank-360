import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SparklesIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid';

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [offers, setOffers] = useState([]);

  // Mock data for transactions - empty list
  const transactions = [];

  // Mock balance calculations
  const balance = 0;
  const monthlyIncome = 0;
  const monthlyExpenses = 0;

  useEffect(() => {
    // Sample offers hardcoded, no change
    const sampleOffers = [
      {
        id: 1,
        title: 'Get 10% Cashback on Fuel',
        description: 'Pay with SmartBank card at Shell stations and enjoy instant 10% cashback.',
      },
      {
        id: 2,
        title: 'Save Big on Jumia Fridays',
        description: 'Use your SmartBank wallet on Jumia and unlock exclusive Friday discounts.',
      },
      {
        id: 3,
        title: 'Travel Rewards',
        description: 'Book flights with SmartBank and earn reward points on every booking.',
      },
    ];
    setOffers(sampleOffers);
  }, []);

  if (authLoading) return (
    <div className="flex justify-center items-center min-h-screen p-10">
      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-8">
      {/* Welcome Message */}
      <div className="text-3xl font-bold text-gray-800">
        Welcome back, {user.displayName || user.email.split('@')[0]}
      </div>

      {/* User Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-gray-500">Total Balance</p>
          <p className="text-xl font-semibold text-green-600">
            KES {balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-gray-500">Monthly Income</p>
          <p className="text-xl font-semibold text-blue-600">
            KES {monthlyIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-gray-500">Monthly Expenses</p>
          <p className="text-xl font-semibold text-red-500">
            KES {monthlyExpenses.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Offers Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <SparklesIcon className="h-6 w-6 text-yellow-500" />
          Exclusive Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white shadow rounded-lg p-4 border border-gray-200 transition hover:shadow-lg"
            >
              <h3 className="font-semibold text-lg text-blue-600">{offer.title}</h3>
              <p className="text-sm text-gray-600">{offer.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
          <Link
            to="/transactions"
            className="text-blue-600 flex items-center hover:underline"
          >
            View All
            <ArrowRightCircleIcon className="w-5 h-5 ml-1" />
          </Link>
        </div>
        {transactions.length === 0 ? (
          <p className="text-gray-600">No recent transactions found.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {transactions.slice(0, 5).map((tx) => (
                <li key={tx.id} className="px-4 py-4 flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-800">
                      {tx.description || 'Transaction'}
                    </p>
                    <p className="text-gray-500">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-xs">
                      From: {tx.from || 'Unknown'} | To: {tx.to || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        tx.type === 'expense' ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      {tx.type === 'expense' ? '-' : '+'} KES{' '}
                      {Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {tx.category || 'General'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
