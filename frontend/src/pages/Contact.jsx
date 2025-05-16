import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Your message has been submitted successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-gray-200 min-h-screen p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700">Contact Us</h1>
          <p className="text-gray-600 mt-4 text-lg">
            We’d love to hear from you! Reach out with questions, feedback, or just to say hi.
          </p>
        </div>

        {/* Contact Details */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-md grid md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600">Address</h2>
            <p className="text-gray-700">
              Smart bank 360<br />
              4th Floor, EcoBank Towers<br />
              Nairobi, Kenya
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600">Phone</h2>
            <p className="text-gray-700">+254 700 123 456</p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600">Email</h2>
            <p className="text-gray-700">support@smartbank.co.ke</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 outline-none resize-none"
              />
            </div>
            <div className="col-span-2 text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Google Map */}
        <div className="w-full rounded-xl overflow-hidden shadow-md">
          <iframe
            title="Company Location"
            src="https://maps.google.com/maps?q=Nairobi%20CBD&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="400"
            className="border-0 w-full"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
