import React from 'react';
import { FiBarChart2, FiBookmark, FiCalendar, FiMessageSquare } from 'react-icons/fi';

const WelcomeComponent = () => {
  return (
    <div className="bg-gray-100 p-8 rounded-xl shadow-lg mt-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, User!</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          New Project
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: FiBarChart2, title: 'Progress', value: '78%' },
          { icon: FiBookmark, title: 'Bookmarks', value: '23' },
          { icon: FiCalendar, title: 'Events', value: '4' },
          { icon: FiMessageSquare, title: 'Messages', value: '9' },
        ].map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow flex items-center">
            <item.icon className="text-3xl text-blue-500 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{item.title}</h2>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          {['Completed Python Course', 'Started Machine Learning Project', 'Joined AI Discussion Group'].map((activity, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WelcomeComponent;