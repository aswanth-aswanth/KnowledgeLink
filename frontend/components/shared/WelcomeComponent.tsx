// jsx
import React from 'react';
import { FiBookOpen, FiUsers, FiTrendingUp } from 'react-icons/fi';

const WelcomeComponent = () => {
  return (
    <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl mt-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to KnowledgeLink</h1>
      <p className="text-xl mb-8">Your gateway to collaborative learning and growth.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: FiBookOpen, title: 'Learn', desc: 'Access a vast library of resources' },
          { icon: FiUsers, title: 'Connect', desc: 'Engage with a community of experts' },
          { icon: FiTrendingUp, title: 'Grow', desc: 'Track your progress and achieve goals' },
        ].map((item, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-xl shadow-md">
            <item.icon className="text-3xl mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-sm text-gray-800">{item.desc}</p>
          </div>
        ))}
      </div>
      
      <button className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300">
        Get Started
      </button>
    </div>
  );
};

export default WelcomeComponent;