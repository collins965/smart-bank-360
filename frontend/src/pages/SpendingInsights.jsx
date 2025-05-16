import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// Category color mapping
const categoryColors = {
  Food: "#FF6384",
  Transport: "#36A2EB",
  Shopping: "#FFCE56",
  Utilities: "#4BC0C0",
  Entertainment: "#9966FF",
  Other: "#E7E9ED"
};

const SpendingInsights = () => {
  const [user, setUser] = useState(undefined); // undefined: loading state
  const [spendings, setSpendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user's spendings
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "spendings"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSpendings(fetchedData);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load spending data: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Process data for Pie chart
  const categoryTotals = spendings.reduce((acc, curr) => {
    const cat = curr.category || "Other";
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(
          (cat) => categoryColors[cat] || "#CCCCCC"
        ),
        borderWidth: 1
      }
    ]
  };

  // Redirect to login if user is not logged in (after checking)
  if (user === null) return <Navigate to="/login" />;
  if (user === undefined) return <div className="text-center py-10">Checking authentication...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Spending Insights
        </h1>

        {loading && (
          <div className="text-gray-500 text-center py-10">
            Loading spending data...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && spendings.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No spending records found.
          </div>
        )}

        {!loading && spendings.length > 0 && (
          <>
            <div className="w-full md:w-1/2 mx-auto">
              <Pie data={pieData} />
            </div>

            <div className="mt-6 space-y-4">
              {Object.entries(categoryTotals).map(([cat, amount]) => (
                <div
                  key={cat}
                  className="flex justify-between items-center border p-3 rounded-lg shadow-sm"
                >
                  <span className="font-medium text-gray-700">{cat}</span>
                  <span className="text-blue-600 font-semibold">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpendingInsights;
