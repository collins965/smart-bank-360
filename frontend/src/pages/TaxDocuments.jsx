import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; 

const mockTaxDocuments = [
  {
    id: 1,
    title: 'Form 1099-INT',
    year: 2024,
    type: 'Interest Income',
    url: '/documents/1099-int-2024.pdf',
    date: '2025-01-15',
  },
  {
    id: 2,
    title: 'Form 1099-DIV',
    year: 2024,
    type: 'Dividends',
    url: '/documents/1099-div-2024.pdf',
    date: '2025-01-20',
  },
  {
    id: 3,
    title: 'Form 1099-B',
    year: 2023,
    type: 'Brokerage',
    url: '/documents/1099-b-2023.pdf',
    date: '2024-01-25',
  },
];

const TaxDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setDocuments(mockTaxDocuments); // Replace with real fetch if needed
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  const handleDownload = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    a.click();
  };

  const filteredDocuments = documents.filter(doc => {
    return (
      (yearFilter ? doc.year.toString() === yearFilter : true) &&
      (typeFilter ? doc.type === typeFilter : true)
    );
  });

  if (user === undefined) {
    return <div className="p-6 text-center text-gray-600">Checking authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">Tax Documents</h1>
        <p className="text-gray-600 mb-6">
          Review and download your annual tax forms for reporting purposes. For questions, contact support.
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border p-2 rounded-md w-40 text-gray-700"
          >
            <option value="">Filter by Year</option>
            {[...new Set(documents.map((d) => d.year))].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border p-2 rounded-md w-48 text-gray-700"
          >
            <option value="">Filter by Type</option>
            {[...new Set(documents.map((d) => d.type))].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {(yearFilter || typeFilter) && (
            <button
              onClick={() => {
                setYearFilter('');
                setTypeFilter('');
              }}
              className="text-sm text-red-500 underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredDocuments.length === 0 ? (
          <p className="text-gray-500">No tax documents found for the selected criteria.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredDocuments.map((doc) => (
              <li key={doc.id} className="py-4 flex items-center justify-between">
                <div>
                  <h2 className="font-medium text-gray-800">{doc.title}</h2>
                  <p className="text-sm text-gray-500">
                    {doc.type} &middot; {doc.year} &middot; Issued on {doc.date}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(doc.url)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaxDocuments;
