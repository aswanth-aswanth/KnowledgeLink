import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TopicHeaderProps } from '@/types/roadmap';

const TopicHeader: React.FC<TopicHeaderProps> = ({
  topicName,
  level,
  isExpanded,
  toggleExpand,
}) => (
  <div
    onClick={toggleExpand}
    className="flex cursor-pointer items-center group"
  >
    <button className="md:p-0 rounded-md focus:outline-none text-gray-400 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
      {isExpanded ? (
        <ChevronDown size={16} className="text-black dark:text-gray-300" />
      ) : (
        <ChevronRight size={16} className="text-black dark:text-gray-300" />
      )}
    </button>
    <span className="flex-grow px-2 py-1 rounded-md font-bold text-sm sm:text-base text-gray-600 dark:text-white">
      {topicName}
    </span>
    <span className="hidden md:block text-xs mr-2 text-gray-400 dark:text-gray-500">
      {level}
    </span>
  </div>
);

export default TopicHeader;
