import { ChevronDown, ChevronRight } from 'lucide-react';

const ExpandToggleButton = ({ isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className="p-1 sm:p-2 rounded-md flex-shrink-0 text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800 focus:outline-none"
  >
    {isExpanded ? (
      <ChevronDown size={14} className="text-black dark:text-gray-300" />
    ) : (
      <ChevronRight size={14} className="text-black dark:text-gray-300" />
    )}
  </button>
);

export default ExpandToggleButton;
