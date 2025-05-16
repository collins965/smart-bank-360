import React, { useState, useEffect } from "react";

const incomeCategories = [
  "Salary",
  "Business",
  "Investments",
  "Gifts",
  "Other",
];

const expenseCategories = [
  "Rent",
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Health",
  "Education",
  "Other",
];

const BudgetPlanner = () => {
  // States
  const [transactions, setTransactions] = useState([]); // {id, type, description, amount, category, date}
  const [form, setForm] = useState({
    type: "income",
    description: "",
    amount: "",
    category: incomeCategories[0],
    date: new Date().toISOString().slice(0, 10),
  });

  const [editId, setEditId] = useState(null);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("budgetTransactions")) || [];
    setTransactions(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("budgetTransactions", JSON.stringify(transactions));
  }, [transactions]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Change category options when type changes
    if (name === "type") {
      setForm({
        ...form,
        type: value,
        category: value === "income" ? incomeCategories[0] : expenseCategories[0],
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Add or update transaction
  const handleSubmit = (e) => {
    e.preventDefault();

    const { type, description, amount, category, date } = form;
    const amtNum = parseFloat(amount);

    if (!description.trim()) return alert("Please enter a description.");
    if (isNaN(amtNum) || amtNum <= 0) return alert("Enter a valid positive amount.");

    if (editId) {
      // Update existing
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === editId
            ? { ...tx, type, description: description.trim(), amount: amtNum, category, date }
            : tx
        )
      );
      setEditId(null);
    } else {
      // Add new
      setTransactions((prev) => [
        { id: Date.now(), type, description: description.trim(), amount: amtNum, category, date },
        ...prev,
      ]);
    }

    setForm({
      type: "income",
      description: "",
      amount: "",
      category: incomeCategories[0],
      date: new Date().toISOString().slice(0, 10),
    });
  };

  // Delete transaction
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions(transactions.filter((tx) => tx.id !== id));
    }
  };

  // Edit transaction
  const handleEdit = (tx) => {
    setForm({
      type: tx.type,
      description: tx.description,
      amount: tx.amount,
      category: tx.category,
      date: tx.date,
    });
    setEditId(tx.id);
  };

  // Clear all
  const clearAll = () => {
    if (window.confirm("Clear ALL transactions? This cannot be undone.")) {
      setTransactions([]);
      setEditId(null);
      setForm({
        type: "income",
        description: "",
        amount: "",
        category: incomeCategories[0],
        date: new Date().toISOString().slice(0, 10),
      });
    }
  };

  // Filter transactions by selected month (YYYY-MM)
  const filteredTransactions = transactions.filter((tx) =>
    tx.date.startsWith(filterMonth)
  );

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalIncome - totalExpenses;
  const expensePercent = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0;

  // Calculate category totals for bars
  const getCategoryTotals = (type) => {
    const filtered = filteredTransactions.filter((tx) => tx.type === type);
    const categoryMap = {};

    filtered.forEach((tx) => {
      if (!categoryMap[tx.category]) categoryMap[tx.category] = 0;
      categoryMap[tx.category] += tx.amount;
    });

    return categoryMap;
  };

  const incomeCategoryTotals = getCategoryTotals("income");
  const expenseCategoryTotals = getCategoryTotals("expense");

  // Helper: max value for progress bars
  const maxIncomeCategoryValue = Math.max(...Object.values(incomeCategoryTotals), 0);
  const maxExpenseCategoryValue = Math.max(...Object.values(expenseCategoryTotals), 0);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center py-12 px-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-5xl font-extrabold text-center text-purple-700 mb-12">Smart Bank 360 Budget Planner</h1>

        {/* Month filter */}
        <div className="flex justify-center mb-8">
          <label className="mr-3 font-semibold text-gray-700" htmlFor="filterMonth">
            Select Month:
          </label>
          <input
            type="month"
            id="filterMonth"
            name="filterMonth"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-8 text-center mb-12">
          <div className="bg-green-100 rounded-2xl p-8 shadow-md">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Total Income</h2>
            <p className="text-3xl font-bold text-green-900">KES {totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 rounded-2xl p-8 shadow-md">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Total Expenses</h2>
            <p className="text-3xl font-bold text-red-900">KES {totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-red-700 mt-1">{expensePercent}% of income</p>
          </div>
          <div className={`rounded-2xl p-8 shadow-md ${balance >= 0 ? "bg-blue-100" : "bg-red-200"}`}>
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Balance</h2>
            <p className={`text-3xl font-bold ${balance >= 0 ? "text-blue-900" : "text-red-900"}`}>
              KES {balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Add/Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 justify-center mb-10"
          aria-label={editId ? "Edit transaction form" : "Add transaction form"}
        >
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Select transaction type"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="min-w-[150px] p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Transaction description"
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount (KES)"
            value={form.amount}
            onChange={handleChange}
            className="w-28 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="0.01"
            step="0.01"
            aria-label="Transaction amount"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Select category"
          >
            {(form.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Select transaction date"
            required
          />

          <button
            type="submit"
            className="bg-purple-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            aria-label={editId ? "Update transaction" : "Add transaction"}
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm({
                  type: "income",
                  description: "",
                  amount: "",
                  category: incomeCategories[0],
                  date: new Date().toISOString().slice(0, 10),
                });
              }}
              className="px-5 py-3 rounded-xl font-semibold border border-gray-400 hover:bg-gray-200 transition-colors"
              aria-label="Cancel edit"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Category breakdown */}
        <div className="grid sm:grid-cols-2 gap-10 mb-12">
          {/* Income Categories */}
          <div>
            <h3 className="text-2xl font-bold text-green-700 mb-4">Income by Category</h3>
            {Object.keys(incomeCategoryTotals).length === 0 && (
              <p className="text-gray-500">No income transactions this month.</p>
            )}
            {Object.entries(incomeCategoryTotals).map(([cat, val]) => {
              const widthPercent = maxIncomeCategoryValue ? (val / maxIncomeCategoryValue) * 100 : 0;
              return (
                <div key={cat} className="mb-2">
                  <div className="flex justify-between mb-1 text-green-800 font-semibold">
                    <span>{cat}</span>
                    <span>KES {val.toFixed(2)}</span>
                  </div>
                  <div className="h-5 bg-green-200 rounded-xl">
                    <div
                      className="h-5 bg-green-600 rounded-xl"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expense Categories */}
          <div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">Expenses by Category</h3>
            {Object.keys(expenseCategoryTotals).length === 0 && (
              <p className="text-gray-500">No expense transactions this month.</p>
            )}
            {Object.entries(expenseCategoryTotals).map(([cat, val]) => {
              const widthPercent = maxExpenseCategoryValue ? (val / maxExpenseCategoryValue) * 100 : 0;
              return (
                <div key={cat} className="mb-2">
                  <div className="flex justify-between mb-1 text-red-800 font-semibold">
                    <span>{cat}</span>
                    <span>KES {val.toFixed(2)}</span>
                  </div>
                  <div className="h-5 bg-red-200 rounded-xl">
                    <div
                      className="h-5 bg-red-600 rounded-xl"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions list */}
        <div className="max-h-[350px] overflow-y-auto border rounded-xl border-gray-300 p-5 shadow-inner">
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-gray-500">No transactions for this month.</p>
          ) : (
            <table className="w-full text-left">
              <thead className="border-b border-gray-300">
                <tr>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3 text-right">Amount (KES)</th>
                  <th className="py-2 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="odd:bg-gray-50 even:bg-gray-100">
                    <td className="py-2 px-3">{tx.date}</td>
                    <td
                      className={`py-2 px-3 font-semibold ${
                        tx.type === "income" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </td>
                    <td className="py-2 px-3">{tx.description}</td>
                    <td className="py-2 px-3">{tx.category}</td>
                    <td className="py-2 px-3 text-right font-semibold">{tx.amount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center space-x-3">
                      <button
                        onClick={() => handleEdit(tx)}
                        className="text-blue-600 hover:underline"
                        aria-label={`Edit transaction ${tx.description}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-red-600 hover:underline"
                        aria-label={`Delete transaction ${tx.description}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Clear All */}
        {transactions.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={clearAll}
              className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              aria-label="Clear all transactions"
            >
              Clear All Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner;
