import React, { useState } from 'react';
import {
  Github,
  Facebook,
  Linkedin,
  Twitter,
  Mail,
  Link as LinkIcon,
  Unlink
} from 'lucide-react';

const LinkedAccounts = () => {
  const [linkedAccounts, setLinkedAccounts] = useState({
    google: true,
    facebook: false,
    github: true,
    linkedin: false,
    twitter: false
  });

  const toggleLink = (platform) => {
    setLinkedAccounts((prev) => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const platforms = [
    {
      name: 'Google',
      id: 'google',
      icon: <Mail size={20} className="text-red-500" />,
      bg: 'bg-red-50'
    },
    {
      name: 'LinkedIn',
      id: 'linkedin',
      icon: <Linkedin size={20} className="text-blue-700" />,
      bg: 'bg-blue-100'
    },
    {
      name: 'Twitter',
      id: 'twitter',
      icon: <Twitter size={20} className="text-sky-400" />,
      bg: 'bg-sky-50'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg border-t-4 border-indigo-600">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Linked Accounts</h2>
      <p className="text-gray-600 text-sm text-center mb-8">
        Link your accounts for faster login and account recovery options.
      </p>

      <div className="space-y-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${platform.bg}`}
          >
            <div className="flex items-center gap-3">
              {platform.icon}
              <span className="font-medium text-gray-800">{platform.name}</span>
            </div>
            <button
              onClick={() => toggleLink(platform.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm transition ${
                linkedAccounts[platform.id]
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {linkedAccounts[platform.id] ? (
                <>
                  <Unlink size={16} />
                  Unlink
                </>
              ) : (
                <>
                  <LinkIcon size={16} />
                  Link
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkedAccounts;
