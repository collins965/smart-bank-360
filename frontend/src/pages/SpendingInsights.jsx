import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
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

// Simulated fake spending data
const fakeSpendings = [
  { category: "Food", amount: 1200 },
  { category: "Transport", amount: 800 },
  { category: "Shopping", amount: 2300 },
  { category: "Entertainment", amount: 1500 },
  { category: "Utilities", amount: 900 },
  { category: "Food", amount: 500 },
  { category: "Transport", amount: 200 },
  { category: "Other", amount: 400 }
];

const SpendingInsights = () => {
  const [user, setUser] = useState(undefined); // undefined: checking
  const [spendings, setSpendings] = useState([]);

  // Monitor user authentication
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

  // Load spending data
  useEffect(() => {
    if (user) {
      setSpendings(fakeSpendings);
    }
  }, [user]);

  // Group and sum amounts by category
  const categoryTotals = spendings.reduce((acc, curr) => {
    const cat = curr.category || "Other";
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  // Pie chart data
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

  const totalSpending = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const maxCategory = Object.entries(categoryTotals).reduce(
    (max, [cat, amount]) => (amount > max.amount ? { cat, amount } : max),
    { cat: "", amount: 0 }
  );

  // Redirect if not logged in
  if (user === null) return <Navigate to="/login" />;
  if (user === undefined)
    return <div className="text-center py-10">Checking authentication...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Spending Insights
        </h1>

        <p className="text-gray-600 mb-6">
          Here’s a breakdown of your simulated spending habits using fake data.
        </p>

        <div className="w-full md:w-1/2 mx-auto">
          <Pie data={pieData} />
        </div>

        <div className="mt-6 space-y-3">
          {Object.entries(categoryTotals).map(([cat, amount]) => (
            <div
              key={cat}
              className="flex justify-between items-center border p-3 rounded-lg shadow-sm"
            >
              <span className="font-medium text-gray-700">{cat}</span>
              <span className="text-blue-600 font-semibold">
                {amount.toLocaleString("en-KE", {
                  style: "currency",
                  currency: "KES"
                })}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-blue-800">
            Total Spending:
          </h2>
          <p className="text-xl font-bold text-blue-700">
            {totalSpending.toLocaleString("en-KE", {
              style: "currency",
              currency: "KES"
            })}
          </p>
        </div>

        <div className="mt-4 bg-yellow-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-yellow-800">
            Top Category:
          </h2>
          <p className="text-md text-gray-700">
            {maxCategory.cat} (
            {maxCategory.amount.toLocaleString("en-KE", {
              style: "currency",
              currency: "KES"
            })}
            )
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpendingInsights;
