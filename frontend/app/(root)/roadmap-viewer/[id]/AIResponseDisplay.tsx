// components/AIResponseDisplay.tsx
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIResponseDisplayProps {
  content: string;
}

const AIResponseDisplay: React.FC<AIResponseDisplayProps> = ({ content }) => {
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Code block
        const code = part.slice(3, -3).trim();
        const language = code.split('\n')[0].trim();
        const codeContent = code.split('\n').slice(1).join('\n');
        return (
          <div key={index} className="my-4">
            <SyntaxHighlighter
              language={language || 'javascript'}
              style={vscDarkPlus}
              className="rounded-md text-sm"
            >
              {codeContent}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        // Regular content
        return <div key={index}>{renderRegularContent(part)}</div>;
      }
    });
  };
  const renderRegularContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        // Main headers
        return (
          <h2
            key={index}
            className="text-lg font-bold text-blue-600 dark:text-blue-400 my-4"
          >
            {line.replace(/\*\*/g, '')}
          </h2>
        );
      } else if (line.startsWith('*')) {
        // Bullet points
        const bulletContent = line.slice(1).trim();
        const parts = bulletContent.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={index} className="flex items-start space-x-2 my-2">
            <span className="text-yellow-500 dark:text-yellow-400 text-xl mt-1">
              •
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {parts.map((part, partIndex) =>
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong
                    key={partIndex}
                    className="text-green-600 dark:text-green-400"
                  >
                    {part.replace(/\*\*/g, '')}
                  </strong>
                ) : (
                  part
                )
              )}
            </span>
          </div>
        );
      } else {
        // Regular text
        return (
          <p key={index} className="text-gray-700 dark:text-gray-300 my-1">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className="font-mono text-sm sm:text-base bg-gray-50 dark:bg-gray-900 p-6 rounded-xl dark:shadow-xl">
      <div className="space-y-2 ai-response-content max-h-[60vh] overflow-y-auto pr-4">
        {renderContent(content)}
      </div>
    </div>
  );
};

export default AIResponseDisplay;
