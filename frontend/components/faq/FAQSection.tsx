// components/FAQSection.tsx

import React from 'react';
import { FAQSectionProps } from '@/types/roadmap';
import AIAssistant from './AIAssistant';
import TabSelector from './TabSelector';
import QuestionInput from './QuestionInput';
import AIResponseSection from './AIResponseSection';
import FAQList from './FAQList';
import { useFAQ } from '@/hooks/useFAQ';

const FAQSection: React.FC<FAQSectionProps> = ({
  roadmapId,
  topicUniqueId,
  topicId,
  topicName,
  topicContent,
}) => {
  const {
    faqs,
    newQuestion,
    setNewQuestion,
    expandedFAQs,
    newAnswers,
    answerRefs,
    activeTab,
    setActiveTab,
    aiResponse,
    isAILoading,
    askAI,
    submitQuestion,
    toggleFAQ,
    handleAnswerChange,
    submitAnswer,
  } = useFAQ({ roadmapId, topicUniqueId, topicId });

  return (
    <div className="mt-2 text-base dark:text-gray-300 max-sm:px-4 sm:px-8">
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'ai' && aiResponse && (
        <AIResponseSection aiResponse={aiResponse} />
      )}
      <QuestionInput
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        submitQuestion={submitQuestion}
        isAILoading={isAILoading}
        activeTab={activeTab}
      />
      {activeTab === 'faq' ? (
        <FAQList
          faqs={faqs}
          expandedFAQs={expandedFAQs}
          toggleFAQ={toggleFAQ}
          newAnswers={newAnswers}
          handleAnswerChange={handleAnswerChange}
          submitAnswer={submitAnswer}
          answerRefs={answerRefs}
        />
      ) : (
        <AIAssistant
          topicName={topicName}
          topicContent={topicContent}
          onAskAI={askAI}
        />
      )}
    </div>
  );
};

export default FAQSection;
