import { TabButtonProps } from '@/types/roadmap';
import React from 'react';

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`mr-4 pb-2 ${
        isActive ? 'border-b-2 border-primary-500 font-semibold' : ''
      } text-gray-800 dark:text-gray-200`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export { TabButton };
