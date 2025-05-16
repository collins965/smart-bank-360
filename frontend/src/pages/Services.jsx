const services = [
  {
    title: 'Digital Banking',
    description:
      'Manage your bank accounts, transfers, and payments all in one place with our secure digital banking platform.',
  },
  {
    title: 'Savings & Deposits',
    description:
      'Earn competitive interest rates with flexible savings plans tailored to your financial goals.',
  },
  {
    title: 'Investments',
    description:
      'Grow your wealth through diversified investment portfolios and expert financial insights.',
  },
  {
    title: 'Loans & Credit',
    description:
      'Access low-interest loans and flexible credit lines designed to fit your personal or business needs.',
  },
  {
    title: 'Financial Advisory',
    description:
      'Get personalized financial advice and guidance from our certified experts to make smarter money decisions.',
  },
  {
    title: 'Investment Education',
    description:
      'Learn how to manage, invest, and grow your money with courses, webinars, and tutorials for all levels.',
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700">Our Services</h1>
        <p className="mt-4 text-gray-600 text-lg">
          At Vanguard Wealth Markets, we offer a wide range of financial services to help you succeed.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition text-center"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <a
          href="/contact"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
};

export default Services;
