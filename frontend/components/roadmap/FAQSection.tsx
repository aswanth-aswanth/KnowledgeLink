import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import { useDarkMode } from "@/hooks/useDarkMode";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FAQSectionProps {
  roadmapId: string;
  topicUniqueId: string;
  topicId: string;
}

interface FAQ {
  _id: string;
  roadmapId: string;
  topicId: string;
  topicUniqueId: string;
  question: string;
  authorId: string;
  upvotes: string[];
  createdAt: string;
  updatedAt: string;
  answers: {
    _id: string;
    content: string;
    authorId: string;
    upvotes: string[];
    createdAt: string;
    updatedAt: string;
  }[];
}

const FAQSection: React.FC<FAQSectionProps> = ({
  roadmapId,
  topicUniqueId,
  topicId,
}) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);
  const [newAnswers, setNewAnswers] = useState<{ [key: string]: string }>({});
  const { isDarkMode } = useDarkMode();
  const answerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to fetch FAQs. Please try again.");
    }
  };

  const submitQuestion = async () => {
    if (!newQuestion.trim()) return;

    try {
      await apiClient.post("/profile/faq/question", {
        roadmapId,
        topicUniqueId,
        topicId,
        question: newQuestion,
      });
      setNewQuestion("");
      fetchFAQs();
      toast.success("Your question has been successfully submitted.");
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to submit your question. Please try again.");
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
      await apiClient.post("/profile/faq/answer", {
        faqId,
        content,
      });
      setNewAnswers((prev) => ({ ...prev, [faqId]: "" }));
      if (answerRefs.current[faqId]) {
        answerRefs.current[faqId]!.textContent = "";
      }
      fetchFAQs();
      toast.success("Your answer has been successfully submitted.");
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit your answer. Please try again.");
    }
  };

  return (
    <div className="mt-2 text-sm px-4">
      <h3 className="font-semibold mb-1">FAQs</h3>
      <div className="space-y-1">
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="border-b border-gray-200 dark:border-gray-700 pb-1"
          >
            <div
              className="font-medium cursor-pointer flex items-center"
              onClick={() => toggleFAQ(faq._id)}
            >
              {expandedFAQs.includes(faq._id) ? (
                <ChevronDown className="mr-1 h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="mr-1 h-4 w-4 flex-shrink-0" />
              )}
              <span className="break-words">{faq.question}</span>
            </div>
            {expandedFAQs.includes(faq._id) && (
              <div className="pl-4 mt-1 text-gray-600 dark:text-gray-300">
                {faq.answers.map((answer, index) => (
                  <div key={answer._id}>
                    {index > 0 && (
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    )}
                    <p className="break-words">{answer.content}</p>
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
                        e.currentTarget.textContent || ""
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
      <div className="mt-2 flex items-center space-x-2">
        <div
          contentEditable
          onInput={(e) => setNewQuestion(e.currentTarget.textContent || "")}
          className="flex-grow p-1 py-2 text-sm border rounded bg-transparent dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-200 min-w-0 break-words whitespace-pre-wrap"
        />
        <button
          onClick={submitQuestion}
          className="px-2 py-2 text-sm bg-transparent border border-primary-500 text-primary-500 rounded hover:bg-primary-500 hover:text-white dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-700"
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default FAQSection;
