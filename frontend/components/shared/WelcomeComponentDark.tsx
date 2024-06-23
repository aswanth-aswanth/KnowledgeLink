import React from "react";
import { FiBookOpen, FiUsers, FiTrendingUp } from "react-icons/fi";

const WelcomeComponent = () => {
  return (
    <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl">
      <h1 className="text-4xl font-bold mb-6">Welcome to KnowledgeLink</h1>
      <p className="text-xl mb-8">
        Your gateway to collaborative learning and growth.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: FiBookOpen,
            title: "Learn",
            desc: "Access a vast library of resources",
          },
          {
            icon: FiUsers,
            title: "Connect",
            desc: "Engage with a community of experts",
          },
          {
            icon: FiTrendingUp,
            title: "Grow",
            desc: "Track your progress and achieve goals",
          },
        ].map((item, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-md">
            <item.icon className="text-3xl mb-4 text-yellow-500" />
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-sm text-gray-300">{item.desc}</p>
          </div>
        ))}
      </div>

      <button className="mt-8 bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-600 transition duration-300">
        Get Started
      </button>
    </div>
  );
};

export default WelcomeComponent;
