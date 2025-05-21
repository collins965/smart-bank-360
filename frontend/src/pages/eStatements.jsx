import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { format } from 'date-fns';

// Simulated transaction data
const fakeTransactions = [
  {
    id: '1', type: 'Sent', from: 'you', to: 'user_001', amount: 1250,
    timestamp: new Date('2025-04-01T10:00:00'), note: 'Rent'
  },
  {
    id: '2', type: 'Received', from: 'user_002', to: 'you', amount: 4300,
    timestamp: new Date('2025-04-05T14:30:00'), note: 'Salary'
  },
  {
    id: '3', type: 'Sent', from: 'you', to: 'user_003', amount: 600,
    timestamp: new Date('2025-04-10T09:15:00'), note: 'Groceries'
  },
  {
    id: '4', type: 'Received', from: 'user_004', to: 'you', amount: 2000,
    timestamp: new Date('2025-04-12T19:45:00'), note: 'Refund'
  },
  {
    id: '5', type: 'Sent', from: 'you', to: 'user_005', amount: 800,
    timestamp: new Date('2025-04-15T08:05:00'), note: 'Electricity bill'
  }
];

const EStatements = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate('/login');
      else setUser(currentUser);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const sortedFakeTxs = fakeTransactions.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setTransactions(sortedFakeTxs);
      setLoading(false);
    }
  }, [user]);

  const filteredTransactions = transactions.filter(tx => {
    const matchSearch = (
      tx.note?.toLowerCase().includes(search.toLowerCase()) ||
      tx.to?.toLowerCase().includes(search.toLowerCase()) ||
      tx.from?.toLowerCase().includes(search.toLowerCase()) ||
      tx.type?.toLowerCase().includes(search.toLowerCase())
    );
    const matchMonth = filterMonth
      ? new Date(tx.timestamp).toISOString().slice(0, 7) === filterMonth
      : true;

    return matchSearch && matchMonth;
  });

  const exportCSV = () => {
    const csvRows = [
      ['Date', 'Type', 'Counterparty', 'Amount (KES)', 'Note'],
      ...filteredTransactions.map(tx => [
        format(new Date(tx.timestamp), 'yyyy-MM-dd HH:mm'),
        tx.type,
        tx.type === 'Sent' ? tx.to : tx.from,
        `KES ${tx.amount}`,
        tx.note || ''
      ])
    ];

    const blob = new Blob([csvRows.map(row => row.join(',')).join('\n')], {
      type: 'text/csv',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eStatement.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">eStatements</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by note, name, or type..."
            className="w-full md:w-1/2 p-2 border rounded-md shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="month"
            className="p-2 border rounded-md shadow-sm"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />

          <button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-500">No matching transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-left border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-4">Date</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Counterparty</th>
                  <th className="p-4">Amount (KES)</th>
                  <th className="p-4">Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50 transition-all">
                    <td className="p-4">
                      {format(new Date(tx.timestamp), 'dd MMM yyyy, hh:mm a')}
                    </td>
                    <td className={`p-4 font-medium ${tx.type === 'Sent' ? 'text-red-500' : 'text-green-600'}`}>
                      {tx.type}
                    </td>
                    <td className="p-4 text-gray-700">
                      {tx.type === 'Sent' ? tx.to : tx.from}
                    </td>
                    <td className="p-4 font-semibold">
                      KES {tx.amount.toLocaleString('en-KE')}
                    </td>
                    <td className="p-4 text-gray-600">{tx.note || '—'}</td>
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

export default EStatements;
