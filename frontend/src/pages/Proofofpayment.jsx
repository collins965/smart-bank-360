import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; 

const mockPayments = [
  {
    id: 1,
    reference: 'INV-2024-001',
    date: '2025-03-12',
    amount: 4500,
    method: 'M-Pesa',
    status: 'Completed',
    receiptUrl: '/receipts/inv-2024-001.pdf',
  },
  {
    id: 2,
    reference: 'INV-2024-002',
    date: '2025-04-03',
    amount: 2750,
    method: 'Bank Transfer',
    status: 'Completed',
    receiptUrl: '/receipts/inv-2024-002.pdf',
  },
];

const ProofOfPayment = () => {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setPayments(mockPayments); 
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDownload = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Checking authentication...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Proof of Payment</h1>
        <p className="text-gray-600 mb-6">
          Below is your payment history. You can download official receipts for your records.
        </p>

        {payments.length === 0 ? (
          <p className="text-gray-500">No payment records found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <li key={payment.id} className="py-4 flex items-center justify-between">
                <div>
                  <h2 className="font-medium text-gray-800">{payment.reference}</h2>
                  <p className="text-sm text-gray-500">
                    {payment.method} &middot; KES {payment.amount.toLocaleString()} &middot; {payment.date}
                  </p>
                  <span className={`inline-block mt-1 text-xs font-semibold px-2 py-1 rounded ${
                    payment.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {payment.status}
                  </span>
                </div>
                <button
                  onClick={() => handleDownload(payment.receiptUrl)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProofOfPayment;
