import React from 'react';

interface ContentCardProps {
  title: string;
  content: string;
  tags: string[];
}

const ContentCard: React.FC<ContentCardProps> = ({ title, content, tags }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="mb-2">{content}</p>
      <div className="flex space-x-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 text-sm rounded-full px-2 py-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ContentCard;