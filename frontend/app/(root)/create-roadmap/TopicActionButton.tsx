import { FC } from 'react';
import { LucideIcon } from 'lucide-react';

interface TopicActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  title: string;
  className?: string;
}

const TopicActionButton: FC<TopicActionButtonProps> = ({
  onClick,
  icon: Icon,
  title,
  className = '',
}) => (
  <button
    onClick={onClick}
    className={`p-1 rounded-md focus:outline-none text-gray-400 bg-gray-100 hover:bg-gray-200 dark:text-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 transition-opacity duration-200 ${className}`}
    title={title}
  >
    <Icon size={14} />
  </button>
);

export default TopicActionButton;
