import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Transaction = () => {
  const [user, setUser] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [selectedService, setSelectedService] = useState('Custom');

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const services = [
    { name: 'Spotify', uid: 'spotify_official', note: 'Spotify Premium Subscription' },
    { name: 'Netflix', uid: 'netflix_kenya', note: 'Netflix Monthly Subscription' },
    { name: 'Showmax', uid: 'showmax_service', note: 'Showmax Standard Plan' },
    { name: 'YouTube Premium', uid: 'yt_premium', note: 'YouTube Premium Subscription' },
    { name: 'Custom', uid: '', note: '' },
  ];

  const handleServiceChange = (e) => {
    const service = services.find((s) => s.name === e.target.value);
    setSelectedService(service.name);
    setRecipient(service.uid);
    setNote(service.note);
  };

  const handleTransaction = async (e) => {
    e.preventDefault();

    if (!recipient.trim() || !amount || isNaN(amount) || Number(amount) <= 0) {
      setStatus('Please enter a valid recipient and amount.');
      return;
    }

    setIsLoading(true);
    setStatus('');
    setShowSummary(false);

    setTimeout(() => {
      setTimestamp(new Date());
      setStatus('Transaction successful!');
      setShowSummary(true);
      setIsLoading(false);

      // Reset form
      setRecipient('');
      setAmount('');
      setNote('');
      setSelectedService('Custom');

      // Redirect to /account
      setTimeout(() => {
        navigate('/account');
      }, 2500);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-xl rounded-2xl border border-blue-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Send Money</h2>

        <form onSubmit={handleTransaction} className="space-y-6">
          {/* Service Dropdown */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">
              Select Online Service
            </label>
            <select
              id="service"
              value={selectedService}
              onChange={handleServiceChange}
              className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
            >
              {services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Input */}
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
              Recipient ID
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              placeholder="Enter recipient's UID"
              required
            />
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (KES)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Note Input */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              placeholder="e.g. Payment for dinner"
              rows="3"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Processing...' : 'Send Money'}
            </button>
          </div>
        </form>

        {/* Status Message */}
        {status && (
          <p
            className={`text-center mt-4 font-medium transition-all duration-300 ${
              status.includes('successful') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status}
          </p>
        )}

        {/* Transaction Summary */}
        {showSummary && (
          <div className="mt-6 p-4 border border-green-300 rounded-xl bg-green-50 shadow-sm animate-fade-in">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Transaction Summary</h3>
            <ul className="text-sm text-gray-800 space-y-1">
              <li>
                <strong>From:</strong> {user?.email || 'Your Account'}
              </li>
              <li>
                <strong>To:</strong> {recipient}
              </li>
              <li>
                <strong>Amount:</strong> KES {amount}
              </li>
              {note && (
                <li>
                  <strong>Note:</strong> {note}
                </li>
              )}
              <li>
                <strong>Date:</strong> {timestamp?.toLocaleString()}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
