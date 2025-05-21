import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/pexels-tima-miroshnichenko-6266285.jpg';
import loanImage from '../assets/pexels-jakubzerdzicki-30349323.jpg';
import InvestmentImage from '../assets/pexels-pixabay-534216.jpg';
import digitalwalltImage from "../assets/pexels-karolina-grabowska-5239819.jpg";
import BankingImage from "../assets/pexels-mikhail-nilov-7534801.jpg";
import timeimage from "../assets/pexels-rdne-7564246.jpg";

const Landing = () => {
  return (
    <div className="bg-gray-200 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your Smart Financial Partner 24/7
        </h1>
        <Link to="/transaction">
          <button className="bg-indigo-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-900 transition duration-300">
            Start Transaction
          </button>
        </Link>
      </section>

      {/* Services Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Personal & Business Accounts */}
          <div className="w-full h-[50vh] bg-center bg-cover flex items-center justify-center rounded-lg" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="bg-opacity-60 p-8 rounded-lg">
              <h1 className="text-white text-4xl font-bold mb-4">Personal & Business Accounts</h1>
              <p className="text-white text-lg">
                Manage your finances with ease using our flexible personal and business account options.
              </p>
            </div>
          </div>

          {/* Loans & Credit */}
          <div className="w-full h-[50vh] bg-center bg-cover flex items-center justify-center rounded-lg" style={{ backgroundImage: `url(${loanImage})` }}>
            <div className="bg-opacity-60 p-8 rounded-lg">
              <h1 className="text-white text-4xl font-bold mb-4">Loans & Credit</h1>
              <p className="text-white text-lg">
                Manage your finances with ease using our flexible personal and business account options.
              </p>
            </div>
          </div>

          {/* Investments */}
          <div className="w-full h-[50vh] bg-center bg-cover flex items-center justify-center rounded-lg" style={{ backgroundImage: `url(${InvestmentImage})` }}>
            <div className="bg-opacity-60 p-8 rounded-lg">
              <h1 className="text-white text-4xl font-bold mb-4">Investments</h1>
              <p className="text-white text-lg">
                Grow your wealth with our secure investment plans and expert guidance.
              </p>
            </div>
          </div>

          {/* Digital Wallet */}
          <div className="w-full h-[50vh] bg-center bg-cover flex items-center justify-center rounded-lg" style={{ backgroundImage: `url(${digitalwalltImage})` }}>
            <div className="bg-opacity-60 p-8 rounded-lg">
              <h1 className="text-white text-4xl font-bold mb-4">Digital Wallet</h1>
              <p className="text-white text-lg">
                Enjoy seamless digital payments and instant transfers from anywhere.
              </p>
            </div>
          </div>

          {/* Mobile Banking App */}
          <div className="w-full h-[50vh] bg-center bg-cover flex items-center justify-center rounded-lg" style={{ backgroundImage: `url(${BankingImage})` }}>
            <div className="bg-opacity-60 p-8 rounded-lg">
              <h1 className="text-white text-4xl font-bold mb-4">Mobile Banking App</h1>
              <p className="text-white text-lg">
                Bank on the go with our secure and user-friendly mobile app.
              </p>
            </div>
          </div>

          {/* 24/7 Support */}
          <div className="w-full h-[50vh] bg-center bg-cover flex items-center justify-center rounded-lg" style={{ backgroundImage: `url(${timeimage})` }}>
            <div className="bg-opacity-60 p-8 rounded-lg">
              <h1 className="text-white text-4xl font-bold mb-4">24/7 Support</h1>
              <p className="text-white text-lg">
                Get round-the-clock assistance with our dedicated customer support team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-12 px-6">
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

      {/* Stats Section */}
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
      <section className="bg-gray-100 py-12 px-6 max-w-6xl mx-auto">
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
          <div className="w-full md:w-3/4 h-64 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://player.cloudinary.com/embed/?cloud_name=dehwllp4b&public_id=py64t2nh7rkjas9jnmgr&profile=cld-default&autoplay=true&loop=true&muted=true&controls=true"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-full"
              title="Smart Bank Tour"
            />
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="bg-gray-200 py-12 px-6 max-w-6xl mx-auto">
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
    </div>
  );
};

export default Landing;
