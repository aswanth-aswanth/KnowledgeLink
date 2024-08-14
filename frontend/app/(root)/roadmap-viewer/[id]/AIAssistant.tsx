import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import AIResponseDisplay from './AIResponseDisplay';

interface AIAssistantProps {
  topicName: string;
  topicContent: string;
  onAskAI: (question: string) => Promise<string>;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  topicName,
  topicContent,
  onAskAI,
}) => {
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [aiResponses, setAIResponses] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const prompts = [
    `I'm learning about ${topicName}. This is the content: ${topicContent.substring(
      0,
      50
    )}... Can you explain this topic in simple terms?`,
    `Can you provide a detailed explanation of ${topicName}, focusing on its key aspects?`,
    `What are the practical applications of ${topicName} in real-world scenarios?`,
    `What are some common misconceptions or mistakes people make when learning about ${topicName}?`,
    // `Can you break down ${topicName} into simpler concepts for a beginner to understand?`,
    // `What are the most important things to remember about ${topicName}?`,
    // `How has ${topicName} evolved over time, and what are the current trends?`,
    // `Can you provide some examples or case studies related to ${topicName}?`,
  ];

  const togglePrompt = async (prompt: string) => {
    if (expandedPrompt === prompt) {
      setExpandedPrompt(null);
    } else {
      setExpandedPrompt(prompt);
      if (!aiResponses[prompt]) {
        setIsLoading({ ...isLoading, [prompt]: true });
        try {
          const response = await onAskAI(prompt);
          setAIResponses({ ...aiResponses, [prompt]: response });
        } catch (error) {
          console.error('Error getting AI response:', error);
          setAIResponses({
            ...aiResponses,
            [prompt]: 'Error: Failed to get AI response.',
          });
        }
        setIsLoading({ ...isLoading, [prompt]: false });
      }
    }
  };

  return (
    <div className="space-y-1 ml-4 my-4">
      {prompts.map((prompt, index) => (
        <div
          key={index}
          className="border-b border-gray-200 dark:border-gray-700 pb-1"
        >
          <div
            className="font-normal cursor-pointer flex items-center text-gray-800 dark:text-gray-300"
            onClick={() => togglePrompt(prompt)}
          >
            {expandedPrompt === prompt ? (
              <ChevronDown className="mr-1 h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="mr-1 h-4 w-4 flex-shrink-0" />
            )}
            <span className="break-words">{prompt}</span>
          </div>
          {expandedPrompt === prompt && (
            <div className="pl-4 mt-1 text-gray-600 dark:text-gray-300">
              {isLoading[prompt] ? (
                <p className="text-sm italic">Loading AI response...</p>
              ) : aiResponses[prompt] ? (
                <AIResponseDisplay content={aiResponses[prompt]} />
              ) : (
                <p className="text-sm italic">
                  AI response will appear here...
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AIAssistant;
