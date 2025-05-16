import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

const EStatements = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        const sentQuery = query(
          collection(db, 'transactions'),
          where('from', '==', user.uid),
          orderBy('timestamp', 'desc')
        );

        const receivedQuery = query(
          collection(db, 'transactions'),
          where('to', '==', user.uid),
          orderBy('timestamp', 'desc')
        );

        const [sentSnap, receivedSnap] = await Promise.all([
          getDocs(sentQuery),
          getDocs(receivedQuery)
        ]);

        const sent = sentSnap.docs.map(doc => ({ id: doc.id, type: 'Sent', ...doc.data() }));
        const received = receivedSnap.docs.map(doc => ({ id: doc.id, type: 'Received', ...doc.data() }));

        const allTransactions = [...sent, ...received].sort(
          (a, b) => b.timestamp?.seconds - a.timestamp?.seconds
        );

        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">eStatements</h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-500">No transactions found.</div>
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
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="p-4">
                      {tx.timestamp
                        ? format(new Date(tx.timestamp.seconds * 1000), 'dd MMM yyyy, hh:mm a')
                        : '—'}
                    </td>
                    <td className={`p-4 font-medium ${tx.type === 'Sent' ? 'text-red-500' : 'text-green-600'}`}>
                      {tx.type}
                    </td>
                    <td className="p-4 text-gray-700">
                      {tx.type === 'Sent' ? tx.to : tx.from}
                    </td>
                    <td className="p-4 font-semibold">KES {tx.amount?.toLocaleString()}</td>
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
