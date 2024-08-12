import React from "react";
import { RoadmapViewerProps } from "@/types/roadmap";
import { useRoadmapViewer } from "@/hooks/useRoadmapViewer";
import Topic from "./Topic";

const RoadmapViewer: React.FC<RoadmapViewerProps> = ({
  transformedTopics,
  isEditMode,
  onContentChange,
  roadmapId,
}) => {
  const { isDarkMode, expandedTopics, setExpandedTopics } =
    useRoadmapViewer(transformedTopics);

  return (
    <div
      className={`nested-note-taker rounded-xl ${
        isDarkMode ? "bg-gray-800 shadow-lg" : "bg-white shadow-sm"
      } p-0 sm:p-6`}
    >
      <h1
        className={`text-2xl px-2 pt-5 sm:px-0 sm:pt-0 font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {transformedTopics.title}
      </h1>
      <p
        className={`mb-6 px-2 sm:px-0 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
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
          roadmapId={roadmapId}
        />
      ))}
    </div>
  );
};

export default RoadmapViewer;
