import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../../firebase';

const simulatedTransactions = [
  { id: 1, timestamp: new Date(), description: 'Groceries', amount: 1500, type: 'Debit' },
  { id: 2, timestamp: new Date(), description: 'Salary', amount: 45000, type: 'Credit' },
  { id: 3, timestamp: new Date(), description: 'Netflix', amount: 1200, type: 'Debit' },
];

const simulatedUserInfo = {
  accountType: 'Smart Savings',
  phoneNumber: '+254712345678',
  registrationDate: '2024-12-10',
  role: 'User',
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="h-10 w-10 animate-spin border-4 border-blue-600 border-t-transparent rounded-full"></div>
  </div>
);

const AccountCard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState(simulatedTransactions);
  const [phoneInput, setPhoneInput] = useState(simulatedUserInfo.phoneNumber);
  const [editingPhone, setEditingPhone] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate('/login');
  };

  const updatePhoneNumber = () => {
    if (!phoneInput.trim()) return alert('Phone number cannot be empty');
    alert('Phone number updated successfully');
    setEditingPhone(false);
  };

  const calculateBalance = () => {
    let balance = 0;
    for (const tx of transactions) {
      balance += tx.type === 'Credit' ? tx.amount : -tx.amount;
    }
    return balance;
  };

  const accountNumber = user
    ? `SB360-${user.email.slice(0, 4).toUpperCase()}-${user.uid.slice(-4).toUpperCase()}`
    : '';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-8">Your Smart Bank Account</h2>

      {/* Profile Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
          <div><span className="font-semibold">Full Name:</span> {user.displayName || 'N/A'}</div>
          <div><span className="font-semibold">Email:</span> {user.email}</div>
          <div><span className="font-semibold">Account Number:</span> {accountNumber}</div>
          <div><span className="font-semibold">Account Type:</span> {simulatedUserInfo.accountType}</div>
          <div>
            <span className="font-semibold">Phone Number:</span>{' '}
            {editingPhone ? (
              <>
                <input
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="border px-2 py-1 rounded w-full max-w-xs"
                />
                <div className="mt-2 space-x-2">
                  <button onClick={updatePhoneNumber} className="bg-green-600 text-white px-4 py-1 rounded">
                    Save
                  </button>
                  <button onClick={() => setEditingPhone(false)} className="bg-gray-400 text-white px-4 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {phoneInput}
                <button onClick={() => setEditingPhone(true)} className="ml-4 text-blue-600 underline">Edit</button>
              </>
            )}
          </div>
          <div><span className="font-semibold">Registration Date:</span> {simulatedUserInfo.registrationDate}</div>
          <div><span className="font-semibold">Last Login:</span> {user.metadata?.lastSignInTime}</div>
          <div><span className="font-semibold">Role:</span> {simulatedUserInfo.role}</div>
        </div>
      </section>

      {/* Balance */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Account Summary</h3>
        <div className="bg-gray-100 p-6 rounded shadow text-center">
          <p className="text-3xl text-green-700 font-bold">
            KES {calculateBalance().toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-2">Current Available Balance</p>
        </div>
      </section>

      {/*Features */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Smart Features</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Auto-savings every 1st of the month</li>
          <li>Budget tracking and monthly summaries</li>
          <li>Loan eligibility checker</li>
          <li>Instant Airtime & Bill Payments</li>
        </ul>
      </section>

      {/* Transactions */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-600">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{new Date(tx.timestamp).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{tx.description}</td>
                    <td className={`border px-4 py-2 ${tx.type === 'Debit' ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.type === 'Debit' ? '-' : '+'}KES {tx.amount.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">{tx.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium mt-6"
      >
        Logout
      </button>
    </div>
  );
};

export default AccountCard;
