import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your Smart Financial Partner 24/7
        </h1>
        <p className="text-lg md:text-xl mb-6">Smart Bank 360 – Revolutionizing the way you bank.</p>
        <div className="space-x-4">
          <Link to="/login" className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
            Login
          </Link>
          <Link to="/signup" className="bg-indigo-700 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-800">
            Get Started
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            ['Personal & Business Accounts', 'image'],
            ['Loans & Credit', 'image'],
            ['Investments', 'image'],
            ['Digital Wallet', 'image'],
            ['Mobile Banking App', 'image'],
            ['24/7 Support', 'image'],
          ].map(([title, icon]) => (
            <div key={title} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">Learn more about how we make banking easier for you.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Smart Bank 360?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div>
            <h4 className="text-xl font-semibold mb-2">Security</h4>
            <p className="text-gray-700 mb-4">Your data and funds are protected with military-grade encryption.</p>

            <h4 className="text-xl font-semibold mb-2">24/7 Support</h4>
            <p className="text-gray-700 mb-4">Our team is always ready to help you—day or night.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">Low Fees</h4>
            <p className="text-gray-700 mb-4">No hidden charges. Transparent and fair pricing always.</p>

            <h4 className="text-xl font-semibold mb-2">Fast Transactions</h4>
            <p className="text-gray-700 mb-4">Instant money transfers and real-time account updates.</p>
          </div>
        </div>
      </section>

      {/* Stats & Highlights */}
      <section className="bg-indigo-50 py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Smart Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-5xl mx-auto">
          <div>
            <p className="text-4xl font-bold text-indigo-600">50k+</p>
            <p className="text-gray-700">Active Users</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-indigo-600">$100M+</p>
            <p className="text-gray-700">Processed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-indigo-600">100+</p>
            <p className="text-gray-700">Business Partners</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-indigo-600">98%</p>
            <p className="text-gray-700">Customer Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <blockquote className="border-l-4 border-indigo-600 pl-4 italic">
            “Smart Bank 360 has completely changed how I manage my business finances.”
            <br />
            <span className="font-semibold text-indigo-700 mt-2 block">– Sarah, Business Owner</span>
          </blockquote>
          <blockquote className="border-l-4 border-indigo-600 pl-4 italic">
            “The mobile app is fast and secure. I use it every day!”
            <br />
            <span className="font-semibold text-indigo-700 mt-2 block">– Kevin, Freelancer</span>
          </blockquote>
        </div>
      </section>

      {/* Feature Tour */}
      <section className="bg-indigo-100 py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Take a Quick Tour</h2>
        <div className="flex justify-center">
          <div className="w-full md:w-3/4 rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://source.unsplash.com/featured/?banking,finance"
              alt="Feature demo"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="bg-white py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Financial Education</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            ['Investment Guides', 'Learn the basics of investing and growing your money.'],
            ['Financial Tips', 'Practical advice for managing your income, expenses, and goals.'],
            ['FAQs', 'Answers to common questions about Smart Bank 360.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition">
              <h4 className="text-xl font-semibold mb-2">{title}</h4>
              <p className="text-gray-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Buttons */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to take control of your finances?</h2>
        <div className="space-x-4">
          <Link to="/signup" className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100">
            Create Account
          </Link>
          <Link to="/plans" className="bg-blue-700 px-6 py-2 rounded font-semibold hover:bg-blue-800">
            Compare Plans
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
