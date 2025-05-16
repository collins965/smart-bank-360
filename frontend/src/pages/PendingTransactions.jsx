import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/outline";

const PendingTransactions = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check user authentication state
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch pending transactions for logged-in user
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const pendingRef = collection(db, "pendingTransactions");
    const q = query(pendingRef, where("userId", "==", user.uid), where("status", "==", "pending"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const txns = [];
        snapshot.forEach((doc) => {
          txns.push({ id: doc.id, ...doc.data() });
        });
        setTransactions(txns);
        setLoading(false);
      },
      (err) => {
        setError("Failed to fetch pending transactions: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Cancel transaction handler
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this pending transaction?")) return;
    try {
      await deleteDoc(doc(db, "pendingTransactions", id));
      // Optionally show success feedback
    } catch (err) {
      alert("Failed to cancel transaction: " + err.message);
    }
  };

  // Redirect if not logged in
  if (user === null) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-blue-700 mb-4">Pending Transactions</h1>

        {loading && (
          <div className="text-center py-10 text-gray-600">Loading your pending transactions...</div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded mb-4">
            <ExclamationTriangleIcon className="h-6 w-6" />
            <span>{error}</span>
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <p className="text-gray-500 text-center py-10">You have no pending transactions at the moment.</p>
        )}

        {!loading && transactions.length > 0 && (
          <ul className="divide-y divide-gray-200">
            {transactions.map(({ id, amount, recipient, date, description }) => {
              const formattedDate = date?.toDate ? date.toDate().toLocaleString() : new Date(date).toLocaleString();

              return (
                <li key={id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      To: <span className="font-semibold">{recipient}</span>
                    </p>
                    <p className="text-gray-700">Amount: ${amount.toFixed(2)}</p>
                    {description && <p className="text-gray-600 italic">{description}</p>}
                    <p className="text-gray-500 text-sm">Scheduled on: {formattedDate}</p>
                  </div>
                  <button
                    onClick={() => handleCancel(id)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition"
                    aria-label="Cancel pending transaction"
                  >
                    <TrashIcon className="h-5 w-5" />
                    Cancel
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PendingTransactions;
