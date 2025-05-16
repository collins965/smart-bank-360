import React, { useState } from 'react';

const faqsData = [
  {
    category: 'Account',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click the "Sign Up" button on the homepage and fill in the registration form with your details.',
      },
      {
        q: 'Can I update my email address later?',
        a: 'Yes. Go to Account Settings and update your email under the Profile section.',
      },
    ],
  },
  {
    category: 'Transactions',
    questions: [
      {
        q: 'How do I track my expenses?',
        a: 'Use the Budget Planner on your dashboard. All transactions are categorized automatically.',
      },
      {
        q: 'Why was my transaction declined?',
        a: 'This could be due to insufficient funds or a connection error. Please try again or contact support.',
      },
    ],
  },
  {
    category: 'Security',
    questions: [
      {
        q: 'Is my data secure?',
        a: 'Absolutely. We use 256-bit SSL encryption and never store your personal banking credentials.',
      },
      {
        q: 'How can I reset my password?',
        a: 'Click on "Forgot Password" at the login screen and follow the reset instructions sent to your email.',
      },
    ],
  },
];

const Faqs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaqs = faqsData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-xl">
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-6">Help Center / FAQs</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search a question..."
        className="w-full p-3 mb-6 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {filteredFaqs.map((section, i) =>
        section.questions.length > 0 ? (
          <div key={section.category} className="mb-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">{section.category}</h3>
            <div className="space-y-2">
              {section.questions.map((item, idx) => {
                const currentIndex = `${i}-${idx}`;
                return (
                  <div key={currentIndex} className="border rounded">
                    <button
                      onClick={() => toggleAnswer(currentIndex)}
                      className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-700 font-medium hover:bg-gray-100"
                    >
                      {item.q}
                      <span>{openIndex === currentIndex ? '−' : '+'}</span>
                    </button>
                    {openIndex === currentIndex && (
                      <div className="px-4 py-2 text-gray-600 bg-gray-50 border-t">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null
      )}

      {/* Contact Support */}
      <div className="mt-10 bg-indigo-50 p-6 rounded text-center">
        <p className="text-lg font-medium text-indigo-700 mb-2">Still need help?</p>
        <p className="text-gray-600 mb-4">Contact our support team and we’ll get back to you as soon as possible.</p>
        <a
          href="/contact"
          className="inline-block bg-indigo-700 text-white px-6 py-2 rounded hover:bg-indigo-800 transition"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default Faqs;
