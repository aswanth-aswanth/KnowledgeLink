import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import apiClient from '@/api/apiClient';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FAQ, FAQSectionProps } from '@/types/roadmap';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AIAssistant from '@/app/(root)/roadmap-viewer/[id]/AIAssistant';
import AIResponseDisplay from '@/app/(root)/roadmap-viewer/[id]/AIResponseDisplay';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const FAQSection: React.FC<FAQSectionProps> = ({
  roadmapId,
  topicUniqueId,
  topicId,
  topicName,
  topicContent,
}) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);
  const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({});
  const answerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeTab, setActiveTab] = useState<'faq' | 'ai'>('faq');
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, [roadmapId, topicUniqueId]);

  const fetchFAQs = async () => {
    try {
      const response = await apiClient.get(
        `/profile/faq/${roadmapId}/${topicUniqueId}`
      );
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to fetch FAQs. Please try again.');
    }
  };

  const askAI = async (question: string) => {
    setIsAILoading(true);
    try {
      const result = await model.generateContent(question);
      const response = result.response;
      const text = response.text();
      setIsAILoading(false);
      return text;
    } catch (error) {
      console.error('Error generating content:', error);
      setIsAILoading(false);
      throw error;
    }
  };

  const submitQuestion = async () => {
    if (!newQuestion.trim()) return;

    try {
      if (activeTab === 'faq') {
        await apiClient.post('/profile/faq/question', {
          roadmapId,
          topicUniqueId,
          topicId,
          question: newQuestion,
        });
        fetchFAQs();
        toast.success('Your question has been successfully submitted.');
      } else {
        const response = await askAI(newQuestion);
        setAIResponse(response);
        toast.success('AI has provided an answer.');
      }
      setNewQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit your question. Please try again.');
    }
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQs((prev) =>
      prev.includes(faqId)
        ? prev.filter((id) => id !== faqId)
        : [...prev, faqId]
    );
  };

  const handleAnswerChange = (faqId: string, content: string) => {
    setNewAnswers((prev) => ({ ...prev, [faqId]: content }));
  };

  const submitAnswer = async (faqId: string) => {
    const content = newAnswers[faqId];
    if (!content || !content.trim()) return;

    try {
      await apiClient.post('/profile/faq/answer', {
        faqId,
        content,
      });
      setNewAnswers((prev) => ({ ...prev, [faqId]: '' }));
      if (answerRefs.current[faqId]) {
        answerRefs.current[faqId]!.textContent = '';
      }
      fetchFAQs();
      toast.success('Your answer has been successfully submitted.');
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit your answer. Please try again.');
    }
  };

  return (
    <div className="mt-2 text-base dark:text-gray-300 max-sm:px-4 sm:px-8">
      <div className="flex mb-4">
        <button
          className={`mr-4 pb-2 ${
            activeTab === 'faq'
              ? 'border-b-2 border-primary-500 font-semibold'
              : ''
          } text-gray-800 dark:text-gray-200`}
          onClick={() => setActiveTab('faq')}
        >
          FAQs
        </button>
        <button
          className={`pb-2 ${
            activeTab === 'ai'
              ? 'border-b-2 border-primary-500 font-semibold'
              : ''
          } text-gray-800 dark:text-gray-200`}
          onClick={() => setActiveTab('ai')}
        >
          AI Assistant
        </button>
      </div>

      {activeTab === 'ai' && aiResponse && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            AI Response:
          </h3>
          <AIResponseDisplay content={aiResponse} />
        </div>
      )}

      <div className="my-4 flex items-center space-x-2">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder={activeTab === 'faq' ? 'Ask community' : 'Ask AI'}
          className="flex-grow p-2 text-sm border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <button
          onClick={submitQuestion}
          disabled={isAILoading}
          className="px-4 py-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50"
        >
          {isAILoading ? 'Loading...' : 'Ask'}
        </button>
      </div>

      {activeTab === 'faq' ? (
        <div className="space-y-1 ml-4 my-4">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="border-b border-gray-200 dark:border-gray-700 pb-1"
            >
              <div
                className="font-normal cursor-pointer flex items-center"
                onClick={() => toggleFAQ(faq._id)}
              >
                {expandedFAQs.includes(faq._id) ? (
                  <ChevronDown className="mr-1 h-4 w-4 flex-shrink-0 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="mr-1 h-4 w-4 flex-shrink-0 dark:text-gray-400" />
                )}
                <span className="break-words dark:text-gray-300">
                  {faq.question}
                </span>
              </div>
              {expandedFAQs.includes(faq._id) && (
                <div className="pl-4 mt-1 text-gray-600 dark:text-gray-300 ">
                  {faq.answers.map((answer, index) => (
                    <div key={answer._id}>
                      {index > 0 && (
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      )}
                      <p className="break-words dark:text-gray-300 leading-loose ">
                        {answer.content}
                      </p>
                    </div>
                  ))}
                  <div className="mt-2">
                    <div
                      ref={(el) => {
                        answerRefs.current[faq._id] = el;
                      }}
                      contentEditable
                      onInput={(e) =>
                        handleAnswerChange(
                          faq._id,
                          e.currentTarget.textContent || ''
                        )
                      }
                      className="p-1 py-2 text-sm border rounded bg-transparent dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-200 min-w-0 break-words whitespace-pre-wrap"
                    />
                    <button
                      onClick={() => submitAnswer(faq._id)}
                      className="mt-1 px-2 py-1 text-sm bg-transparent border border-primary-500 text-primary-500 rounded hover:bg-primary-500 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-700"
                    >
                      Submit Answer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
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
