import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  AnswerItemProps,
  FAQItemProps,
  FAQListProps,
  NewAnswerInputProps,
} from '@/types/faq';

const FAQList: React.FC<FAQListProps> = ({
  faqs,
  expandedFAQs,
  toggleFAQ,
  newAnswers,
  handleAnswerChange,
  submitAnswer,
  answerRefs,
}) => {
  return (
    <div className="space-y-1 sm:ml-4 my-4">
      {faqs.map((faq) => (
        <FAQItem
          key={faq._id}
          faq={faq}
          isExpanded={expandedFAQs.includes(faq._id)}
          toggleFAQ={toggleFAQ}
          newAnswer={newAnswers[faq._id] || ''}
          handleAnswerChange={handleAnswerChange}
          submitAnswer={submitAnswer}
          answerRef={(el) => (answerRefs.current[faq._id] = el)}
        />
      ))}
    </div>
  );
};

const FAQItem: React.FC<FAQItemProps> = ({
  faq,
  isExpanded,
  toggleFAQ,
  newAnswer,
  handleAnswerChange,
  submitAnswer,
  answerRef,
}) => {
  return (
    <div className="border-b max-sm:text-sm border-gray-200 dark:border-gray-700 pb-1">
      <div
        className="font-normal cursor-pointer flex items-center"
        onClick={() => toggleFAQ(faq._id)}
      >
        {isExpanded ? (
          <ChevronDown className="mr-1 h-4 w-4 flex-shrink-0 dark:text-gray-400" />
        ) : (
          <ChevronRight className="mr-1 h-4 w-4 flex-shrink-0 dark:text-gray-400" />
        )}
        <span className="break-words dark:text-gray-300">{faq.question}</span>
      </div>
      {isExpanded && (
        <div className="pl-4 mt-1 text-gray-600 dark:text-gray-300">
          {faq.answers.map((answer, index) => (
            <AnswerItem
              key={answer._id}
              answer={answer}
              isFirst={index === 0}
            />
          ))}
          <NewAnswerInput
            faqId={faq._id}
            newAnswer={newAnswer}
            handleAnswerChange={handleAnswerChange}
            submitAnswer={submitAnswer}
            answerRef={answerRef}
          />
        </div>
      )}
    </div>
  );
};

const AnswerItem: React.FC<AnswerItemProps> = ({ answer, isFirst }) => {
  return (
    <>
      {!isFirst && <hr className="my-2 border-gray-200 dark:border-gray-700" />}
      <p className="break-words dark:text-gray-300 leading-loose">
        {answer.content}
      </p>
    </>
  );
};

const NewAnswerInput: React.FC<NewAnswerInputProps> = ({
  faqId,
  newAnswer,
  handleAnswerChange,
  submitAnswer,
  answerRef,
}) => {
  return (
    <div className="mt-2">
      <div
        ref={answerRef}
        contentEditable
        onInput={(e) =>
          handleAnswerChange(faqId, e.currentTarget.textContent || '')
        }
        className="p-1 py-2 text-sm border rounded bg-transparent dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-200 min-w-0 break-words whitespace-pre-wrap"
      />
      <button
        onClick={() => submitAnswer(faqId)}
        className="mt-1 px-2 py-1 text-sm bg-transparent border border-primary-500 text-primary-500 rounded hover:bg-primary-500 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-700"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default FAQList;
