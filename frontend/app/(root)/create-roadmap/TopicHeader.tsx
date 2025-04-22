import { GripVertical, Plus, Trash } from 'lucide-react';
import ExpandToggleButton from './ExpandToggleButton';
import TopicActionButton from './TopicActionButton';

interface TopicHeaderProps {
  topic: any;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleExpand: () => void;
  handleAddSubtopic: () => void;
  handleDelete: () => void;
  dragHandleProps: any;
}

const TopicHeader: React.FC<TopicHeaderProps> = ({
  topic,
  handleNameChange,
  handleToggleExpand,
  handleAddSubtopic,
  handleDelete,
  dragHandleProps,
}) => (
  <div className="flex items-center justify-between group w-full overflow-x-auto md:px-28">
    <div className="flex items-center min-w-0 flex-shrink-1">
      <ExpandToggleButton
        isExpanded={topic.isExpanded}
        onClick={handleToggleExpand}
      />
      <input
        type="text"
        value={topic.name}
        onChange={handleNameChange}
        className="sm:min-w-96 flex-shrink bg-transparent px-1 sm:px-2 py-1 focus:outline-none rounded-md font-bold text-sm sm:text-lg truncate focus:bg-gray-50 text-gray-600 dark:focus:bg-gray-800 dark:text-gray-300 transition-colors duration-200"
        placeholder="Untitled"
      />
    </div>
    <div className="flex items-center flex-shrink-0 ml-1">
      <span className="text-xs text-gray-400 dark:text-gray-500 mr-1 hidden sm:inline">
        {topic.no}
      </span>
      <TopicActionButton
        onClick={handleAddSubtopic}
        icon={Plus}
        title="Add subtopic"
      />
      <TopicActionButton
        onClick={handleDelete}
        icon={Trash}
        title="Delete topic"
        className="ml-1"
      />
      <div
        {...dragHandleProps}
        className="p-1 rounded-md focus:outline-none ml-1 text-gray-400 bg-gray-100 hover:bg-gray-200 dark:text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 transition-opacity duration-200 cursor-grab"
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </div>
    </div>
  </div>
);

export default TopicHeader;
