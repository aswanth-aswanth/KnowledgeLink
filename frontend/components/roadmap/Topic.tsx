import React from 'react';
import TopicHeader from '@/components/roadmap/TopicHeader';
import TopicContent from '@/components/roadmap/TopicContent';
import FAQSection from '@/components/roadmap/FAQSection';
import { TopicPropsRoadmapViewer } from '@/types/roadmap';
import { useTopic } from '@/hooks/useTopic';

const Topic: React.FC<TopicPropsRoadmapViewer> = ({
  topic,
  level,
  expandedTopics,
  setExpandedTopics,
  isEditMode,
  onContentChange,
  roadmapId,
}) => {
  const {
    isDarkMode,
    isExpanded,
    isEditing,
    editedContent,
    setEditedContent,
    toggleExpand,
    handleEditClick,
    handleSaveClick,
  } = useTopic(topic, expandedTopics, onContentChange);

  return (
    <div className="topic-node mb-1 ml-2 sm:ml-6">
      <TopicHeader
        topicName={topic.name}
        level={level}
        isDarkMode={isDarkMode}
        isExpanded={isExpanded}
        toggleExpand={() => toggleExpand(setExpandedTopics)}
      />
      {isExpanded && (
        <>
          <TopicContent
            isDarkMode={isDarkMode}
            isEditMode={isEditMode}
            isEditing={isEditing}
            content={topic.content}
            editedContent={editedContent}
            onContentChange={(e) => setEditedContent(e.target.value)}
            handleEditClick={handleEditClick}
            handleSaveClick={handleSaveClick}
          />
          {expandedTopics.includes(topic.uniqueId) && (
            <FAQSection
              roadmapId={roadmapId}
              topicUniqueId={topic.uniqueId}
              topicId={topic._id}
              topicName={topic.name}
              topicContent={topic.content}
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
              roadmapId={roadmapId}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Topic;
