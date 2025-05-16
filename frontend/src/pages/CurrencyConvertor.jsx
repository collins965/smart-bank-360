import React, { useState, useEffect } from 'react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KES');
  const [exchangeRates, setExchangeRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currencies = ['USD', 'KES', 'EUR', 'GBP', 'NGN', 'UGX', 'TZS', 'INR', 'JPY', 'CNY'];

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await res.json();

      if (data.result === 'success') {
        setExchangeRates(data.rates);
        setError('');
      } else {
        throw new Error(data.error || 'Failed to fetch exchange rates');
      }
    } catch (err) {
      setError(err.message || 'Error fetching rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [fromCurrency]);

  useEffect(() => {
    if (exchangeRates && exchangeRates[toCurrency]) {
      const result = (amount * exchangeRates[toCurrency]).toFixed(2);
      setConvertedAmount(result);
    }
  }, [amount, toCurrency, exchangeRates]);

  const swapCurrencies = () => {
    const prevFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(prevFrom);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-500 mb-6">Currency Converter</h2>

      {error && (
        <p className="text-center text-red-500 mb-4">{error}</p>
      )}

      {/* Converter Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-3 rounded border w-full"
          placeholder="Enter amount"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="p-3 rounded border w-full"
        >
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="p-3 rounded border w-full"
        >
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={swapCurrencies}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Swap
        </button>
      </div>

      {/* Conversion Result */}
      {loading ? (
        <p className="text-center text-gray-500">Fetching exchange rates...</p>
      ) : convertedAmount ? (
        <div className="text-center bg-purple-50 p-6 rounded shadow-sm">
          <p className="text-lg font-medium text-gray-700">
            {amount} {fromCurrency} = 
          </p>
          <p className="text-3xl font-bold text-green-500 mt-2">
            {convertedAmount} {toCurrency}
          </p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Enter amount to convert.</p>
      )}
    </div>
  );
};

export default CurrencyConverter;
