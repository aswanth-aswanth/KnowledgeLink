import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Edit, Save } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TopicProps {
  topic: {
    uniqueId: string;
    name: string;
    content: string;
    children: TopicProps["topic"][];
  };
  level: string;
  expandedTopics: string[];
  setExpandedTopics: React.Dispatch<React.SetStateAction<string[]>>;
  isEditMode: boolean;
  onContentChange: (uniqueId: string, newContent: string) => void;
}

const Topic: React.FC<TopicProps> = ({
  topic,
  level,
  expandedTopics,
  setExpandedTopics,
  isEditMode,
  onContentChange,
}) => {
  const { isDarkMode } = useDarkMode();
  const isExpanded = expandedTopics.includes(topic.uniqueId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(topic.content);

  useEffect(() => {
    setEditedContent(topic.content);
  }, [topic.content]);

  const toggleExpand = () => {
    if (isExpanded) {
      setExpandedTopics(expandedTopics.filter((id) => id !== topic.uniqueId));
    } else {
      setExpandedTopics([...expandedTopics, topic.uniqueId]);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onContentChange(topic.uniqueId, editedContent);
    setIsEditing(false);
  };
  console.log("EditedContent : ", editedContent);
  return (
    <div className="topic-node mb-3">
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
          {isEditMode && !isEditing ? (
            <Button onClick={handleEditClick} size="sm" className="mb-2">
              <Edit className="mr-2 h-4 w-4" /> Edit Content
            </Button>
          ) : isEditMode && isEditing ? (
            <Button onClick={handleSaveClick} size="sm" className="mb-2">
              <Save className="mr-2 h-4 w-4" /> Save Content
            </Button>
          ) : null}
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className={` min-h-32 leading-8 p-2 mb-2 rounded-md transition-all duration-200 ${
                isDarkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-50 text-gray-600"
              }`}
            />
          ) : (
            <div
              className={`h-min p-2 mb-2 rounded-md transition-all duration-200 prose font-medium prose-sm text-base tracking-wider ${
                isDarkMode
                  ? "bg-transparent text-gray-300"
                  : "bg-gray-50 text-gray-600"
              } leading-9 max-w-none`}
              dangerouslySetInnerHTML={{ __html: topic.content }}
            />
          )}
          {topic.children.map((child, index) => (
            <Topic
              key={child.uniqueId}
              topic={child}
              level={`${level}-${index + 1}`}
              expandedTopics={expandedTopics}
              setExpandedTopics={setExpandedTopics}
              isEditMode={isEditMode}
              onContentChange={onContentChange}
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
  isEditMode: boolean;
  onContentChange: (uniqueId: string, newContent: string) => void;
}

const RoadmapViewer: React.FC<RoadmapViewerProps> = ({
  transformedTopics,
  isEditMode,
  onContentChange,
}) => {
  const { isDarkMode } = useDarkMode();
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  return (
    <div
      className={`nested-note-taker rounded-lg ${
        isDarkMode ? "bg-gray-900 shadow-lg" : "bg-white shadow-sm"
      } p-4 sm:p-6`}
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
      {transformedTopics.topics.children.map((child, index) => (
        <Topic
          key={child.uniqueId}
          topic={child}
          level={`${index + 1}`}
          expandedTopics={expandedTopics}
          setExpandedTopics={setExpandedTopics}
          isEditMode={isEditMode}
          onContentChange={onContentChange}
        />
      ))}
    </div>
  );
};

export default RoadmapViewer;
