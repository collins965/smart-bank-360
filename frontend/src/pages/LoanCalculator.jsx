import React, { useState } from 'react';

const LoanCalculator = () => {
  const [form, setForm] = useState({
    amount: '',
    interestRate: '',
    termYears: '',
  });
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateLoan = (e) => {
    e.preventDefault();
    const { amount, interestRate, termYears } = form;
    const principal = parseFloat(amount);
    const calculatedInterest = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(termYears) * 12;

    if (!principal || !calculatedInterest || !numberOfPayments) {
      setResults(null);
      return;
    }

    const x = Math.pow(1 + calculatedInterest, numberOfPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      const monthlyPayment = monthly.toFixed(2);
      const totalPayment = (monthly * numberOfPayments).toFixed(2);
      const totalInterest = (monthly * numberOfPayments - principal).toFixed(2);

      setResults({
        monthlyPayment,
        totalPayment,
        totalInterest,
      });
    } else {
      setResults(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Loan Calculator</h2>

      {/* Form */}
      <form onSubmit={calculateLoan} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Loan Amount (KES)"
          className="p-3 rounded border w-full"
          required
        />
        <input
          type="number"
          step="0.01"
          name="interestRate"
          value={form.interestRate}
          onChange={handleChange}
          placeholder="Interest Rate (%)"
          className="p-3 rounded border w-full"
          required
        />
        <input
          type="number"
          name="termYears"
          value={form.termYears}
          onChange={handleChange}
          placeholder="Term (Years)"
          className="p-3 rounded border w-full"
          required
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-3 bg-green-500 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          Calculate Loan
        </button>
      </form>

      {/* Results */}
      {results ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm text-center space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Monthly Payment</h3>
            <p className="text-2xl text-teal-700 font-bold">KES {results.monthlyPayment}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-md font-medium text-gray-600">Total Payment</h4>
              <p className="text-lg text-gray-800">KES {results.totalPayment}</p>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-600">Total Interest</h4>
              <p className="text-lg text-gray-800">KES {results.totalInterest}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">Enter valid loan details to see results.</p>
      )}
    </div>
  );
};

export default LoanCalculator;
