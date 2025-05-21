import React, { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";

// localStorage
const LOCAL_STORAGE_KEY = "mockLoans";

const Loan = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [currentDebts, setCurrentDebts] = useState("");

  const [eligibility, setEligibility] = useState(null);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [loanHistory, setLoanHistory] = useState([]);

  const interestRateAnnual = 0.12;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserLoans(currentUser.uid);
      } else {
        setUser(null);
        setLoanHistory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserLoans = (uid) => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const userLoans = stored.filter((loan) => loan.userId === uid);
    setLoanHistory(userLoans);
  };

  const calculateMonthlyPayment = (principal, months, annualRate) => {
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEligibility(null);
    setSuccessMessage("");
    setMonthlyPayment(null);
    setTotalInterest(null);
    setTotalPayment(null);

    if (!user) {
      setError("You must be logged in to request a loan.");
      return;
    }

    const principal = parseFloat(loanAmount);
    const months = parseInt(loanTerm, 10);
    const income = parseFloat(monthlyIncome);
    const debts = parseFloat(currentDebts) || 0;

    if (
      isNaN(principal) || principal <= 0 ||
      isNaN(months) || months <= 0 || months > 60 ||
      isNaN(income) || income <= 0 || debts < 0
    ) {
      setError("Please fill all fields with valid positive values. Term max is 60 months.");
      return;
    }

    const payment = calculateMonthlyPayment(principal, months, interestRateAnnual);
    const dtiRatio = (debts + payment) / income;
    const interestPaid = payment * months - principal;

    const eligible = dtiRatio <= 0.4;
    setEligibility(eligible);
    setMonthlyPayment(payment);
    setTotalInterest(interestPaid);
    setTotalPayment(payment * months);

    if (eligible) {
      setLoading(true);

      // Simulate saving to backend
      const mockLoan = {
        id: `LN${Date.now()}`,
        userId: user.uid,
        loanAmount: principal,
        loanTerm: months,
        monthlyIncome: income,
        currentDebts: debts,
        monthlyPayment: payment,
        totalInterest: interestPaid,
        totalPayment: payment * months,
        dtiRatio,
        interestRate: interestRateAnnual,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      existing.push(mockLoan);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));

      setSuccessMessage("Loan request submitted successfully!");
      fetchUserLoans(user.uid);
      resetForm();
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLoanAmount("");
    setLoanTerm("");
    setMonthlyIncome("");
    setCurrentDebts("");
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Please log in to request a loan.
        </h2>
        <p className="text-gray-700">
          You need to be authenticated to access the loan request form.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Loan Request Form
      </h1>

      <p className="mb-6 text-center text-gray-700">
        Welcome, <span className="font-semibold">{user.email || user.displayName}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="loanAmount" className="block font-semibold mb-1">Loan Amount (KES)</label>
          <input
            type="number"
            id="loanAmount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="loanTerm" className="block font-semibold mb-1">Loan Term (months)</label>
          <input
            type="number"
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="monthlyIncome" className="block font-semibold mb-1">Monthly Income (KES)</label>
          <input
            type="number"
            id="monthlyIncome"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="currentDebts" className="block font-semibold mb-1">Current Debts (KES)</label>
          <input
            type="number"
            id="currentDebts"
            value={currentDebts}
            onChange={(e) => setCurrentDebts(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className={`w-full py-2 rounded text-white font-bold ${
              loading ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Loan Request"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="w-full py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-50"
          >
            Reset Form
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      {successMessage && <p className="mt-4 text-green-600 text-center">{successMessage}</p>}

      {eligibility !== null && (
        <div className="mt-6 p-4 border rounded bg-blue-50">
          <h3 className="font-bold text-lg">Loan Calculation Result</h3>
          <p className="mt-2 text-gray-800">
            Eligibility:{" "}
            <span className={`font-bold ${eligibility ? "text-green-600" : "text-red-600"}`}>
              {eligibility ? "Eligible " : "Not Eligible "}
            </span>
          </p>
          <ul className="mt-2 list-disc list-inside text-gray-700">
            <li>Monthly Payment: KES {monthlyPayment?.toFixed(2)}</li>
            <li>Total Interest: KES {totalInterest?.toFixed(2)}</li>
            <li>Total Payment: KES {totalPayment?.toFixed(2)}</li>
            <li>Interest Rate: {interestRateAnnual * 100}% per year</li>
          </ul>
        </div>
      )}

      <div className="mt-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Loan History</h2>
          <button
            onClick={() => fetchUserLoans(user.uid)}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {loanHistory.length === 0 ? (
          <p className="text-gray-600">No previous loans found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Term</th>
                  <th className="p-2">Monthly</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {loanHistory.map((loan) => (
                  <tr key={loan.id} className="border-t">
                    <td className="p-2 text-sm">{loan.id}</td>
                    <td className="p-2">KES {loan.loanAmount.toLocaleString()}</td>
                    <td className="p-2">{loan.loanTerm} mo</td>
                    <td className="p-2">KES {loan.monthlyPayment.toFixed(2)}</td>
                    <td className="p-2">
                      <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        {loan.status}
                      </span>
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(loan.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

            {/* Additional Loan Info */}
      <section
        className="mt-12 bg-blue-50 p-6 rounded-md"
        aria-label="Additional loan information and tips"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Loan Tips & FAQs
        </h2>

        <div className="space-y-4 text-gray-800">
          <article>
            <h3 className="font-semibold">What affects loan eligibility?</h3>
            <p>
              Lenders consider your debt-to-income ratio, credit history, and income stability. Keeping debts low and income steady improves your chances.
            </p>
          </article>

          <article>
            <h3 className="font-semibold">Why is the debt-to-income ratio important?</h3>
            <p>
              It measures your monthly debt payments compared to your income. A ratio below 40% is usually considered safe for new loans.
            </p>
          </article>

          <article>
            <h3 className="font-semibold">Can I request a loan if I am not eligible now?</h3>
            <p>
              You can reapply after improving your financial situation — for example, by reducing debts or increasing your income.
            </p>
          </article>

          <article>
            <h3 className="font-semibold">How is interest calculated?</h3>
            <p>
              Interest accrues monthly based on the annual rate. The monthly payment includes both principal and interest amortized over the loan term.
            </p>
          </article>

          <article>
            <h3 className="font-semibold">Who can I contact for loan support?</h3>
            <p>
              Reach out to our customer support team via the contact page or email support@smartbank.com.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Loan;
