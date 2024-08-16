import React from 'react';
import AIResponseDisplay from './AIResponseDisplay';
import { AIResponseSectionProps } from '@/types/faq';


const AIResponseSection: React.FC<AIResponseSectionProps> = ({ aiResponse }) => {
  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
        AI Response:
      </h3>
      <AIResponseDisplay content={aiResponse} />
    </div>
  );
};

export default AIResponseSection;