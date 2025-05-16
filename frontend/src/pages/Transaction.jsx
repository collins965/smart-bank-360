import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Your Firebase config
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';

const Transaction = () => {
  const [user, setUser] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleTransaction = async (e) => {
    e.preventDefault();

    if (!recipient || !amount || isNaN(amount) || Number(amount) <= 0) {
      setStatus('Please enter a valid recipient and amount.');
      return;
    }

    setIsLoading(true);
    setStatus('');

    try {
      // Check if recipient exists
      const recipientDoc = await getDoc(doc(db, 'users', recipient));

      if (!recipientDoc.exists()) {
        setStatus('Recipient account does not exist.');
        setIsLoading(false);
        return;
      }

      // Add transaction document including userId to satisfy Firestore rules
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,      // Added to match Firestore rules
        from: user.uid,
        to: recipient,
        amount: Number(amount),
        note,
        timestamp: serverTimestamp()
      });

      setStatus('Transaction successful!');
      setRecipient('');
      setAmount('');
      setNote('');
    } catch (error) {
      console.error('Transaction Error:', error);
      setStatus('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Send Money</h2>
        <form onSubmit={handleTransaction} className="space-y-6">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
              Recipient Account ID
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              placeholder="Enter recipient UID"
              required
            />
          </div>

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

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              placeholder="Write a note"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send Money'}
            </button>
          </div>
        </form>

        {status && (
          <p
            className={`text-center mt-4 font-medium ${
              status.includes('successful') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default Transaction;
