import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const serviceOptions = [
  { name: 'Spotify', id: 'spotify-subscription', note: 'Monthly Spotify subscription' },
  { name: 'Netflix', id: 'netflix-subscription', note: 'Monthly Netflix subscription' },
  { name: 'Showmax', id: 'showmax-subscription', note: 'Monthly Showmax subscription' },
  { name: 'Custom', id: '', note: '' },
];

const PendingTransactions = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedService, setSelectedService] = useState('Custom');

  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate('/login');
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleServiceChange = (e) => {
    const selected = e.target.value;
    setSelectedService(selected);

    const service = serviceOptions.find((s) => s.name === selected);
    if (service && service.name !== 'Custom') {
      setTo(service.id);
      setNote(service.note);
    } else {
      setTo('');
      setNote('');
    }
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!to.trim() || !amount || isNaN(amount) || Number(amount) <= 0) {
      setStatusMsg('Please enter a valid recipient and amount.');
      return;
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      to: to.trim(),
      amount: parseFloat(amount),
      currency: 'KES',
      date: new Date().toISOString(),
      note: note.trim(),
      status: 'pending',
    };

    setTransactions([newTx, ...transactions]);
    setStatusMsg('Transaction created successfully!');
    setTo('');
    setAmount('');
    setNote('');
    setSelectedService('Custom');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Pending Transactions</h2>

        <form onSubmit={handleAddTransaction} className="mb-10 space-y-6 bg-blue-50 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">Create New Pending Transaction</h3>

          {/* Service selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Online Purchase</label>
            <select
              value={selectedService}
              onChange={handleServiceChange}
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 sm:text-sm"
            >
              {serviceOptions.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient ID */}
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700">Recipient ID</label>
            <input
              type="text"
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. spotify-subscription"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 sm:text-sm"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (KES)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 sm:text-sm"
              required
            />
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note (Optional)</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (e.g. rent, lunch)"
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 sm:text-sm"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            Add Transaction
          </button>

          {statusMsg && (
            <p className={`mt-4 text-center font-medium ${statusMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {statusMsg}
            </p>
          )}
        </form>

        {/* Transaction list */}
        <div>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-600">No pending transactions available.</p>
          ) : (
            transactions.map(({ id, to, amount, currency, date, note, status }) => (
              <div key={id} className="mb-6 p-4 border border-blue-300 rounded-xl shadow-sm bg-white hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg text-blue-700">{to}</span>
                  <span className="text-sm text-gray-500">{new Date(date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-indigo-700">
                    {amount.toLocaleString()} {currency}
                  </span>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-yellow-200 text-yellow-800">
                    {status.toUpperCase()}
                  </span>
                </div>
                {note && <p className="mt-2 text-gray-600 italic">Note: {note}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingTransactions;
