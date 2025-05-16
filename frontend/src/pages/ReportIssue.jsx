import React, { useState } from 'react';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    description: '',
    file: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // send formData to backend.
    console.log('Reported Issue:', formData);
    setSubmitted(true);

    // Reset form
    setFormData({
      name: '',
      email: '',
      issueType: '',
      description: '',
      file: null,
    });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Report an Issue</h2>

      {submitted && (
        <div className="bg-green-100 text-green-800 px-4 py-2 mb-4 rounded">
          Issue reported successfully. We’ll get back to you soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Issue Type</label>
          <select
            name="issueType"
            required
            value={formData.issueType}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an issue</option>
            <option value="bug">Bug / Error</option>
            <option value="feature">Feature Request</option>
            <option value="account">Account Issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            required
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Attach Screenshot (optional)</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-indigo-800 transition w-full font-semibold"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportIssue;
