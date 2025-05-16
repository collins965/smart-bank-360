import teamImg from '../assets/pexels-mikhail-nilov-7534801.jpg';

const About = () => {
  return (
    <div className="bg-gray-200 min-h-screen p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700">About Us</h1>
          <p className="text-gray-600 mt-4 text-lg">
            Learn more about our journey, our mission, and the team behind your digital banking experience.
          </p>
        </div>

        {/* Company Overview */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed">
            We are a modern digital banking platform committed to simplifying personal finance for everyone. 
            Our platform provides secure, accessible, and efficient tools to manage savings, access loans, invest smartly, 
            and understand your financial health. Backed by technology and driven by customer-first values, we aim to revolutionize the banking experience in Kenya and beyond.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Our Mission</h3>
            <p className="text-gray-700">
              To empower individuals and businesses through secure, innovative, and user-friendly digital banking services.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Our Vision</h3>
            <p className="text-gray-700">
              To become the leading digital financial ecosystem in Africa by making banking smarter, faster, and fairer for everyone.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Our Core Values</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Security First – We prioritize protecting your data and transactions.</li>
            <li>Customer-Centric – Your satisfaction and trust guide our every decision.</li>
            <li>Innovation – We constantly evolve to offer cutting-edge solutions.</li>
            <li>Inclusion – Everyone deserves access to quality financial tools.</li>
            <li>Transparency – We believe in clarity, fairness, and open communication.</li>
          </ul>
        </div>

        {/* Our Team */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <img
                src={teamImg}
                alt="Team member"
                className="w-32 h-32 mx-auto rounded-full object-cover"
              />
              <h4 className="mt-4 font-semibold text-gray-800">James Mwangi</h4>
              <p className="text-sm text-gray-500">CEO & Founder</p>
            </div>
            <div className="text-center">
              <img
                src={teamImg}
                alt="Team member"
                className="w-32 h-32 mx-auto rounded-full object-cover"
              />
              <h4 className="mt-4 font-semibold text-gray-800">Amina Kilonzo</h4>
              <p className="text-sm text-gray-500">CTO</p>
            </div>
            <div className="text-center">
              <img
                src={teamImg}
                alt="Team member"
                className="w-32 h-32 mx-auto rounded-full object-cover"
              />
              <h4 className="mt-4 font-semibold text-gray-800">Brian Otieno</h4>
              <p className="text-sm text-gray-500">Lead UI/UX Designer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
