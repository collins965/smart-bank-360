import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const mockTransactions = [
  {
    id: 'txn1',
    date: new Date().getTime() / 1000 - 86400 * 1,
    type: 'deposit',
    amount: 15000,
    status: 'completed',
    reference: 'MPESA123ABC'
  },
  {
    id: 'txn2',
    date: new Date().getTime() / 1000 - 86400 * 2,
    type: 'withdrawal',
    amount: 5000,
    status: 'pending',
    reference: 'BANK987XYZ'
  },
  {
    id: 'txn3',
    date: new Date().getTime() / 1000 - 86400 * 4,
    type: 'deposit',
    amount: 8000,
    status: 'completed',
    reference: 'MPESA345JKL'
  },
  {
    id: 'txn4',
    date: new Date().getTime() / 1000 - 86400 * 5,
    type: 'withdrawal',
    amount: 2000,
    status: 'failed',
    reference: 'ATM000FAILED'
  }
];

const TransactionHistory = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        loadSimulatedData();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadSimulatedData = () => {
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000); // Simulate delay
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your transaction history...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  const filteredTransactions = transactions
    .filter(txn => filter === 'all' || txn.type === filter)
    .sort((a, b) => sortOrder === 'desc' ? b.date - a.date : a.date - b.date);

  const totalAmount = filteredTransactions.reduce((sum, txn) => txn.type === 'deposit' ? sum + txn.amount : sum - txn.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">Transaction History</h1>
        <p className="text-gray-600 mb-4">Below is a summary of your account activity.</p>

        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <div>
            <p className="text-lg text-gray-700">Total Balance: <span className="font-semibold text-green-700">KES {totalAmount.toLocaleString()}</span></p>
            <p className="text-sm text-gray-500">Transactions: {filteredTransactions.length}</p>
          </div>

          <div className="flex items-center gap-4">
            <select
              className="border px-2 py-1 rounded text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500">No matching transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-200 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount (KES)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reference</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td className="px-4 py-2">{new Date(txn.date * 1000).toLocaleDateString()}</td>
                    <td className="px-4 py-2 capitalize">{txn.type}</td>
                    <td className="px-4 py-2">{txn.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        txn.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : txn.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{txn.reference || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
