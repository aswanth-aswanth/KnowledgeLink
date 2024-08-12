import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TopicHeaderProps } from '@/types/roadmap';

const TopicHeader: React.FC<TopicHeaderProps> = ({
  topicName,
  level,
  isDarkMode,
  isExpanded,
  toggleExpand,
}) => (
  <div
    onClick={toggleExpand}
    className="flex cursor-pointer items-center group"
  >
    <button
      className={`p-2 rounded-md focus:outline-none ${
        isDarkMode
          ? 'text-gray-500 dark:hover:bg-gray-800'
          : 'text-gray-400 hover:bg-gray-100'
      }`}
    >
      {isExpanded ? (
        <ChevronDown
          size={16}
          className={isDarkMode ? 'text-gray-300' : 'text-black'}
        />
      ) : (
        <ChevronRight
          size={16}
          className={isDarkMode ? 'text-gray-300' : 'text-black'}
        />
      )}
    </button>
    <span
      className={`flex-grow px-2 py-1 rounded-md font-bold text-lg sm:text-lg ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}
    >
      {topicName}
    </span>
    <span
      className={`text-xs mr-2 ${
        isDarkMode ? 'text-gray-500' : 'text-gray-400'
      }`}
    >
      {level}
    </span>
  </div>
);

export default TopicHeader;
