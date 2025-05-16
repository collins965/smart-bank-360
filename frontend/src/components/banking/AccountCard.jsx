import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { app, db } from '../../firebase';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
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

const AccountCard = () => {
  const [user, setUser] = useState(null);
  const [firestoreUser, setFirestoreUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchFirestoreUser(currentUser.uid);
        await fetchTransactions(currentUser.uid);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchFirestoreUser = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setFirestoreUser(userDoc.data());
        if (userDoc.data().phoneNumber) {
          setPhoneInput(userDoc.data().phoneNumber);
        }
      } else {
        setFirestoreUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch Firestore user data:', err);
    }
  };

  const fetchTransactions = async (uid) => {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('from', '==', uid),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      // ListenS to user's outgoing transactions for recent
      onSnapshot(q, (snapshot) => {
        const trans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(trans);
      });
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate('/login');
  };

  const updatePhoneNumber = async () => {
    if (!phoneInput.trim()) return alert('Phone number cannot be empty');

    try {
      // Update Firestore user doc
      await updateDoc(doc(db, 'users', user.uid), {
        phoneNumber: phoneInput.trim(),
      });

      // Update firebase using update Profile
      setFirestoreUser((prev) => ({ ...prev, phoneNumber: phoneInput.trim() }));
      setEditingPhone(false);
      alert('Phone number updated successfully');
    } catch (err) {
      console.error('Failed to update phone number:', err);
      alert('Failed to update phone number');
    }
  };

  // Calculate balance from transactions where user is either sender or recipient
  const calculateBalance = () => {
    if (!transactions.length) return 0;

    const expenses = transactions.reduce((acc, tx) => acc + Number(tx.amount), 0);

    return -expenses;
  };

  const accountNumber = user
    ? `SB360-${user.email.slice(0, 4).toUpperCase()}-${user.uid.slice(-4).toUpperCase()}`
    : '';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-8">Your Account</h2>

      {/* Profile Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          <div>
            <span className="font-semibold">Full Name:</span> {user.displayName || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Account Number:</span> {accountNumber}
          </div>
          <div>
            <span className="font-semibold">Account Type:</span> Smart Savings
          </div>
          <div>
            <span className="font-semibold">Phone Number:</span>{' '}
            {editingPhone ? (
              <>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full max-w-xs"
                />
                <div className="mt-2 space-x-2">
                  <button
                    onClick={updatePhoneNumber}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingPhone(false);
                      setPhoneInput(firestoreUser?.phoneNumber || '');
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {firestoreUser?.phoneNumber || 'Not added'}
                <button
                  onClick={() => setEditingPhone(true)}
                  className="ml-4 text-blue-600 underline hover:text-blue-800"
                >
                  Edit
                </button>
              </>
            )}
          </div>
          <div>
            <span className="font-semibold">Registration Date:</span>{' '}
            {firestoreUser?.createdAt
              ? new Date(firestoreUser.createdAt.seconds * 1000).toLocaleDateString()
              : 'Unknown'}
          </div>
          <div>
            <span className="font-semibold">Last Login:</span>{' '}
            {user.metadata?.lastSignInTime || 'Unknown'}
          </div>
          <div>
            <span className="font-semibold">Role:</span>{' '}
            {firestoreUser?.role || 'User'}
          </div>
        </div>
      </section>

      {/* Account Balance Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Account Summary</h3>
        <div className="bg-gray-50 rounded p-6 shadow-inner text-center text-3xl font-bold text-green-700">
          KES {calculateBalance().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className="mt-2 text-gray-600">Current available balance</p>
      </section>

      {/* Recent Transactions */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-600">No recent transactions.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left table-auto border-collapse">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Amount (KES)</th>
                  <th className="px-4 py-2 border">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      {tx.timestamp ? new Date(tx.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="border px-4 py-2">{tx.description || 'Transfer'}</td>
                    <td className="border px-4 py-2 text-red-600">-{Number(tx.amount).toLocaleString()}</td>
                    <td className="border px-4 py-2">Debit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default AccountCard;
