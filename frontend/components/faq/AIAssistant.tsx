import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import AIResponseDisplay from './AIResponseDisplay';

interface AIAssistantProps {
  topicName: string;
  topicContent: string;
  onAskAI: (question: string) => Promise<string>;
}

interface PromptState {
  [key: string]: {
    isExpanded: boolean;
    response: string | null;
    isLoading: boolean;
  };
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  topicName,
  topicContent,
  onAskAI,
}) => {
  const [promptStates, setPromptStates] = useState<PromptState>({});

  const prompts = [
    `I'm learning about ${topicName}. This is the content: ${topicContent.substring(
      0,
      50
    )}... Can you explain this topic in simple terms?`,
    `Can you provide a detailed explanation of ${topicName}, focusing on its key aspects?`,
    `What are the practical applications of ${topicName} in real-world scenarios?`,
    `What are some common misconceptions or mistakes people make when learning about ${topicName}?`,
  ];

  const togglePrompt = async (prompt: string) => {
    setPromptStates((prevStates) => {
      const currentState = prevStates[prompt] || { isExpanded: false, response: null, isLoading: false };
      const newState = { ...currentState, isExpanded: !currentState.isExpanded };

      if (newState.isExpanded && !newState.response && !newState.isLoading) {
        newState.isLoading = true;
        onAskAI(prompt)
          .then((response) => {
            setPromptStates((s) => ({
              ...s,
              [prompt]: { ...newState, response, isLoading: false },
            }));
          })
          .catch((error) => {
            console.error('Error getting AI response:', error);
            setPromptStates((s) => ({
              ...s,
              [prompt]: {
                ...newState,
                response: 'Error: Failed to get AI response.',
                isLoading: false,
              },
            }));
          });
      }

      return { ...prevStates, [prompt]: newState };
    });
  };

  return (
    <div className="space-y-1 sm:ml-4 my-4">
      {prompts.map((prompt, index) => (
        <PromptItem
          key={index}
          prompt={prompt}
          promptState={promptStates[prompt]}
          togglePrompt={togglePrompt}
        />
      ))}
    </div>
  );
};

interface PromptItemProps {
  prompt: string;
  promptState?: PromptState[string];
  togglePrompt: (prompt: string) => void;
}

const PromptItem: React.FC<PromptItemProps> = ({ prompt, promptState, togglePrompt }) => {
  const isExpanded = promptState?.isExpanded || false;
  const isLoading = promptState?.isLoading || false;
  const response = promptState?.response || null;

  return (
    <div className="border-b max-sm:text-sm border-gray-200 dark:border-gray-700 pb-1">
      <div
        className="font-normal cursor-pointer flex items-center text-gray-800 dark:text-gray-300"
        onClick={() => togglePrompt(prompt)}
      >
        {isExpanded ? (
          <ChevronDown className="mr-1 h-4 w-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="mr-1 h-4 w-4 flex-shrink-0" />
        )}
        <span className="break-words">{prompt}</span>
      </div>
      {isExpanded && (
        <div className="pl-4 mt-1 text-gray-600 dark:text-gray-300">
          {isLoading ? (
            <p className="text-sm italic">Loading AI response...</p>
          ) : response ? (
            <AIResponseDisplay content={response} />
          ) : (
            <p className="text-sm italic">AI response will appear here...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;