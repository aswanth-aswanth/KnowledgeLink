// components/RoadmapIndex.tsx
import React, { useState } from 'react';
import Link from 'next/link';

interface Topic {
  _id: string;
  name: string;
  uniqueId: string;
  children: Topic[];
}

interface RoadmapData {
  title: string;
  topics: {
    children: Topic[];
  };
}

interface RoadmapIndexProps {
  roadmapData: RoadmapData;
}

const RoadmapIndex: React.FC<RoadmapIndexProps> = ({ roadmapData }) => {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (uniqueId: string) => {
    setExpandedTopics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uniqueId)) {
        newSet.delete(uniqueId);
      } else {
        newSet.add(uniqueId);
      }
      return newSet;
    });
  };

  const renderTopics = (topics: Topic[], level = 0) => {
    return (
      <ul className={`pl-${level * 4} space-y-2`}>
        {topics.map((topic) => (
          <li key={topic._id}>
            <div className="flex items-center group">
              {topic.children && topic.children.length > 0 && (
                <button
                  onClick={() => toggleTopic(topic.uniqueId)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors duration-200 focus:outline-none"
                >
                  {expandedTopics.has(topic.uniqueId) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )}
              <Link 
                href={`#${topic.uniqueId}`} 
                className="ml-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 group-hover:underline"
              >
                {topic.name}
              </Link>
            </div>
            {topic.children && topic.children.length > 0 && expandedTopics.has(topic.uniqueId) && (
              <div className="mt-2">{renderTopics(topic.children, level + 1)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{roadmapData.title} - Index</h2>
      {renderTopics(roadmapData.topics.children)}
    </div>
  );
};

export default RoadmapIndex;