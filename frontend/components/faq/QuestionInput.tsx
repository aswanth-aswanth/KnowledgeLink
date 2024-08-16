import { QuestionInputProps } from '@/types/faq';
import React from 'react';

const QuestionInput: React.FC<QuestionInputProps> = ({
  newQuestion,
  setNewQuestion,
  submitQuestion,
  isAILoading,
  activeTab,
}) => {
  return (
    <div className="my-4 flex items-center space-x-2">
      <input
        type="text"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        placeholder={activeTab === 'faq' ? 'Ask community' : 'Ask AI'}
        className="flex-grow p-2 text-sm border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      <button
        onClick={submitQuestion}
        disabled={isAILoading}
        className="px-4 py-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50"
      >
        Ask
      </button>
    </div>
  );
};

export default QuestionInput;
