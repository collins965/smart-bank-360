import React, { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const Loan = () => {
  // Firebase setup
  const auth = getAuth();
  const db = getFirestore();

  // User state
  const [user, setUser] = useState(null);

  // Form inputs
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [currentDebts, setCurrentDebts] = useState("");

  // Eligibility & calculation
  const [eligibility, setEligibility] = useState(null);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);

  // UI states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // User's previous loans
  const [loanHistory, setLoanHistory] = useState([]);

  // Constants
  const interestRateAnnual = 0.12; // 12% fixed annual interest

  // Monitor auth state
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

  // Fetch user's previous loans
  const fetchUserLoans = async (uid) => {
    const loansRef = collection(db, "loans");
    const q = query(loansRef, where("userId", "==", uid));
    try {
      const querySnapshot = await getDocs(q);
      const loans = [];
      querySnapshot.forEach((doc) => {
        loans.push({ id: doc.id, ...doc.data() });
      });
      setLoanHistory(loans);
    } catch (err) {
      console.error("Error fetching loans:", err);
    }
  };

  // Loan payment calculation (annuity formula)
  const calculateMonthlyPayment = (principal, months, annualRate) => {
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return principal / months;
    return (
      (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEligibility(null);
    setMonthlyPayment(null);
    setTotalInterest(null);
    setTotalPayment(null);
    setSuccessMessage("");

    if (!user) {
      setError("You must be logged in to request a loan.");
      return;
    }

    // Parse inputs
    const principal = parseFloat(loanAmount);
    const months = parseInt(loanTerm, 10);
    const income = parseFloat(monthlyIncome);
    const debts = parseFloat(currentDebts) || 0;

    // Validation
    if (
      isNaN(principal) ||
      principal <= 0 ||
      isNaN(months) ||
      months <= 0 ||
      isNaN(income) ||
      income <= 0 ||
      debts < 0
    ) {
      setError("Please enter valid positive numbers in all fields.");
      return;
    }
    if (months > 60) {
      setError("Loan term cannot exceed 60 months.");
      return;
    }

    // Calculate monthly payment
    const payment = calculateMonthlyPayment(principal, months, interestRateAnnual);

    // Calculate debt-to-income ratio with new loan payment
    const dtiRatio = (debts + payment) / income;

    if (dtiRatio <= 0.4) {
      // Eligible
      setEligibility(true);
      setMonthlyPayment(payment);
      const interestPaid = payment * months - principal;
      setTotalInterest(interestPaid);
      setTotalPayment(payment * months);

      // Save loan request to Firestore
      setLoading(true);
      try {
        await addDoc(collection(db, "loans"), {
          userId: user.uid,
          loanAmount: principal,
          loanTerm: months,
          monthlyIncome: income,
          currentDebts: debts,
          monthlyPayment: payment,
          totalInterest: interestPaid,
          totalPayment: payment * months,
          dtiRatio,
          createdAt: serverTimestamp(),
          status: "pending", // could be pending/approved/declined in real app
        });

        setSuccessMessage("Loan request submitted successfully! We will review it shortly.");
        fetchUserLoans(user.uid); // Refresh loan history

        // Clear form
        setLoanAmount("");
        setLoanTerm("");
        setMonthlyIncome("");
        setCurrentDebts("");
      } catch (err) {
        setError("Failed to submit loan request. Please try again.");
        console.error("Firestore error:", err);
      }
      setLoading(false);
    } else {
      // Not eligible
      setEligibility(false);
      setMonthlyPayment(payment);
      const interestPaid = payment * months - principal;
      setTotalInterest(interestPaid);
      setTotalPayment(payment * months);
    }
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

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Loan request form">
        <div>
          <label htmlFor="loanAmount" className="block mb-2 font-semibold">
            Loan Amount (KES)
          </label>
          <input
            id="loanAmount"
            type="number"
            min="0"
            step="100"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter desired loan amount"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="loanTerm" className="block mb-2 font-semibold">
            Loan Term (Months)
          </label>
          <input
            id="loanTerm"
            type="number"
            min="1"
            max="60"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            placeholder="Enter loan duration in months (max 60)"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="monthlyIncome" className="block mb-2 font-semibold">
            Monthly Income (KES)
          </label>
          <input
            id="monthlyIncome"
            type="number"
            min="0"
            step="100"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="Enter your monthly income"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="currentDebts" className="block mb-2 font-semibold">
            Current Monthly Debt Payments (KES)
          </label>
          <input
            id="currentDebts"
            type="number"
            min="0"
            step="100"
            value={currentDebts}
            onChange={(e) => setCurrentDebts(e.target.value)}
            placeholder="Enter total monthly debt payments (if any)"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-describedby="debtHelp"
          />
          <small id="debtHelp" className="text-gray-500 text-sm">
            Leave blank or 0 if none.
          </small>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-md font-semibold text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
          } transition-colors`}
          disabled={loading}
          aria-busy={loading}
          aria-label="Submit loan request"
        >
          {loading ? "Submitting..." : "Check Eligibility & Submit Loan Request"}
        </button>
      </form>

      {error && (
        <p
          className="mt-4 text-red-600 font-semibold text-center"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}

      {successMessage && (
        <p
          className="mt-4 text-green-600 font-semibold text-center"
          role="alert"
          aria-live="polite"
        >
          {successMessage}
        </p>
      )}

      {eligibility !== null && (
        <div
          className="mt-6 p-4 border rounded-md bg-blue-50"
          role="region"
          aria-live="polite"
          aria-atomic="true"
        >
          <h2 className="text-xl font-bold mb-3">
            Loan Eligibility Result:
          </h2>

          {eligibility ? (
            <p className="text-green-700 font-semibold mb-4">
              Congratulations! You are eligible for the loan.
            </p>
          ) : (
            <p className="text-red-700 font-semibold mb-4">
              Unfortunately, you are not eligible for the loan based on your current financial situation.
            </p>
          )}

          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>
              Monthly Payment: <strong>KES {monthlyPayment.toFixed(2)}</strong>
            </li>
            <li>
              Total Interest to be Paid: <strong>KES {totalInterest.toFixed(2)}</strong>
            </li>
            <li>
              Total Amount to be Repaid: <strong>KES {totalPayment.toFixed(2)}</strong>
            </li>
            <li>
              Debt-to-Income Ratio (Including this loan): <strong>{((currentDebts ? parseFloat(currentDebts) : 0) + monthlyPayment) / monthlyIncome >= 0 ? (((currentDebts ? parseFloat(currentDebts) : 0) + monthlyPayment) / monthlyIncome).toFixed(2) : "N/A"}</strong>
            </li>
          </ul>
        </div>
      )}

      {/* Loan History */}
      {loanHistory.length > 0 && (
        <section
          className="mt-10"
          aria-labelledby="loanHistoryHeading"
          role="region"
        >
          <h2
            id="loanHistoryHeading"
            className="text-2xl font-semibold mb-4 text-center text-blue-700"
          >
            Your Previous Loan Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Loan Amount (KES)</th>
                  <th className="py-2 px-4 border-b">Term (Months)</th>
                  <th className="py-2 px-4 border-b">Monthly Payment (KES)</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {loanHistory.map((loan) => (
                  <tr
                    key={loan.id}
                    className="even:bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="py-2 px-4 border-b text-center">
                      {loan.createdAt?.seconds
                        ? new Date(loan.createdAt.seconds * 1000).toLocaleDateString()
                        : "Unknown"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      KES {loan.loanAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">{loan.loanTerm}</td>
                    <td className="py-2 px-4 border-b text-center">
                      KES {loan.monthlyPayment.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b text-center capitalize">
                      {loan.status || "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

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
