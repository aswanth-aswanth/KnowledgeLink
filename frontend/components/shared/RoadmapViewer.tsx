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
    <div className="topic-node mb-4">
    <div className="flex items-center group  backdrop-blur-md rounded-lg p-2 transition-all duration-200 hover:bg-white/15">
      <button
        onClick={toggleExpand}
        className="p-1 rounded-md text-gray-400 hover:text-gray-200 focus:outline-none transition-colors duration-200"
      >
        {isExpanded ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </button>
      <span className="flex-grow px-2 py-1 font-medium text-base text-gray-200">
        {topic.name}
      </span>
      <span className="text-xs text-gray-400 mr-2">{level}</span>
    </div>
    {isExpanded && (
      <div className="ml-6 mt-2">
        {isEditMode && (
          <Button
            onClick={isEditing ? handleSaveClick : handleEditClick}
            size="sm"
            className="mb-2 bg-white/10 hover:bg-white/20 text-gray-200 backdrop-blur-md transition-all duration-200"
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Save
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </>
            )}
          </Button>
        )}
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-32 leading-7 p-2 mb-2 rounded-md transition-all duration-200 bg-white/5 text-gray-200 backdrop-blur-md focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        ) : (
          <div
            className="prose prose-invert font-normal  text-lg tracking-wide  text-gray-200 leading-10  max-w-none backdrop-blur-md rounded-md p-3 mb-2"
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
        )}
        {topic.children.map((child, index) => (
          <Topic
            key={child.uniqueId}
            topic={child}
            level={`${level}.${index + 1}`}
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
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  return (
    <div className="nested-note-taker rounded-xl p-6 sm:p-8 border border-white/10 prose prose-invert font-normal text-sm tracking-wide bg-white/5 text-gray-200">
    <h1 className="text-2xl font-semibold mb-4 text-gray-100">
      {transformedTopics.title}
    </h1>
    <p className="mb-6 text-gray-300 text-base">
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