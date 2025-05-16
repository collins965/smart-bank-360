import React, { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "scheduledPayments";

export default function ScheduledPayments() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    amount: "",
    date: "",
  });
  const [editing, setEditing] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setPayments(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever payments change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.amount || !form.date) {
      alert("Please fill all fields");
      return;
    }

    if (editing) {
      setPayments((prev) =>
        prev.map((p) => (p.id === form.id ? { ...form, amount: Number(form.amount) } : p))
      );
      setEditing(false);
    } else {
      const newPayment = {
        id: Date.now().toString(),
        title: form.title,
        amount: Number(form.amount),
        date: form.date,
      };
      setPayments((prev) => [...prev, newPayment]);
    }

    setForm({ id: null, title: "", amount: "", date: "" });
  }

  function handleEdit(payment) {
    setForm({
      id: payment.id,
      title: payment.title,
      amount: payment.amount.toString(),
      date: payment.date,
    });
    setEditing(true);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this scheduled payment?")) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      // If editing this payment, cancel editing
      if (form.id === id) {
        setEditing(false);
        setForm({ id: null, title: "", amount: "", date: "" });
      }
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Scheduled Payments</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div>
          <label className="block font-semibold mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. Rent"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="amount">
            Amount ($)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. 1200"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="date">
            Scheduled Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editing ? "Update Payment" : "Add Payment"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setForm({ id: null, title: "", amount: "", date: "" });
            }}
            className="ml-3 px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        )}
      </form>

      <hr className="my-4" />

      {payments.length === 0 ? (
        <p className="text-gray-600">No scheduled payments yet.</p>
      ) : (
        <ul>
          {payments.map(({ id, title, amount, date }) => (
            <li
              key={id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-gray-600">
                  ${amount.toFixed(2)} — {date}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit({ id, title, amount, date })}
                  className="text-blue-600 hover:underline"
                  aria-label={`Edit ${title}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="text-red-600 hover:underline"
                  aria-label={`Delete ${title}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

