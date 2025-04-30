import React, { useState } from 'react';
import TopicHeader from '@/components/roadmap/TopicHeader';
import TopicContent from '@/components/roadmap/TopicContent';
import FAQSection from '@/components/faq/FAQSection';
import { TopicPropsRoadmapViewer } from '@/types/roadmap';
import { useTopic } from '@/hooks/useTopic';
import { HelpCircle } from 'lucide-react';

const Topic: React.FC<TopicPropsRoadmapViewer> = ({
  topic,
  level,
  expandedTopics,
  setExpandedTopics,
  isEditMode,
  onContentChange,
  roadmapId,
}) => {
  const [showFAQ, setShowFAQ] = useState(false);

  const {
    isExpanded,
    isEditing,
    editedContent,
    setEditedContent,
    toggleExpand,
    handleEditClick,
    handleSaveClick,
  } = useTopic(topic, expandedTopics, onContentChange);

  return (
    <div className="topic-node mb-1 ml-3 sm:ml-6">
      <TopicHeader
        topicName={topic.name}
        level={level}
        isExpanded={isExpanded}
        toggleExpand={() => toggleExpand(setExpandedTopics)}
      />
      {isExpanded && (
        <>
          <TopicContent
            isEditMode={isEditMode}
            isEditing={isEditing}
            content={topic.content}
            editedContent={editedContent}
            onContentChange={(e) => setEditedContent(e.target.value)}
            handleEditClick={handleEditClick}
            handleSaveClick={handleSaveClick}
          />

          {/* Icon Toggle for FAQ */}
          <div className="relative mt-2 flex items-center space-x-2 justify-center">
            <div className="absolute right-0 -top-12">
              <button
                onClick={() => setShowFAQ((prev) => !prev)}
                title={showFAQ ? 'Hide FAQ' : 'Show FAQ'}
                className={`
      flex items-center gap-2 sm:px-3 px-2 sm:py-1.5 py-1 rounded-full border
      bg-white dark:bg-gray-800
      text-gray-700 dark:text-gray-200
      hover:bg-gray-100 dark:hover:bg-gray-700
      border-gray-300 dark:border-gray-600
      shadow-sm transition-all
    `}
              >
                <HelpCircle
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    showFAQ
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-300'
                  }`}
                />
              </button>
            </div>
          </div>

          {showFAQ && (
            <FAQSection
              roadmapId={roadmapId}
              topicUniqueId={topic.uniqueId}
              topicId={topic._id}
              topicName={topic.name}
              topicContent={topic.content}
            />
          )}
        </>
      )}
      {topic?.children?.map((child, index) => (
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
    </div>
  );
};

export default Topic;
