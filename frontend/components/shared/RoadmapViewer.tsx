import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

interface TopicProps {
  topic: {
    uniqueId: string;
    name: string;
    content: string;
    children: TopicProps["topic"][];
  };
  level: string;
}

const Topic: React.FC<TopicProps> = ({ topic, level }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isDarkMode } = useDarkMode();

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="topic-node mb-3 mx-auto">
      <div className="flex items-center group">
        <button
          onClick={toggleExpand}
          className={`p-2 rounded-md ${
            isDarkMode
              ? "text-gray-500 hover:bg-gray-800"
              : "text-gray-400 hover:bg-gray-100"
          } focus:outline-none`}
        >
          {isExpanded ? (
            <ChevronDown
              size={16}
              className={isDarkMode ? "text-gray-300" : "text-black"}
            />
          ) : (
            <ChevronRight
              size={16}
              className={isDarkMode ? "text-gray-300" : "text-black"}
            />
          )}
        </button>
        <span
          className={`flex-grow px-2 py-1 rounded-md font-bold text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {topic.name}
        </span>
        <span
          className={`text-xs ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          } mr-2`}
        >
          {level}
        </span>
      </div>
      {isExpanded && (
        <div className="ml-6 mt-2">
          <div
            className={`h-min p-2 mb-2 rounded-md transition-all duration-200 prose font-medium prose-sm text-base tracking-wider ${
              isDarkMode
                ? "bg-gray-900 text-gray-300"
                : "bg-gray-50 text-gray-600"
            } leading-9 max-w-none`}
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
          {topic.children.map((child, index) => (
            <Topic
              key={child.uniqueId}
              topic={child}
              level={`${level}-${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface RoadmapViewerProps {
  transformedTopics: {
    title: string;
    description: string;
    topics: TopicProps["topic"];
  };
}

const RoadmapViewer: React.FC<RoadmapViewerProps> = ({ transformedTopics }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <h1
        className={`text-2xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {transformedTopics.title}
      </h1>
      <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        {transformedTopics.description}
      </p>
      <Topic topic={transformedTopics.topics} level={"1"} />
    </div>
  );
};

export default RoadmapViewer;
