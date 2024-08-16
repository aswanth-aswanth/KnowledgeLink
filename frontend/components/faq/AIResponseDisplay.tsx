import {
  AIResponseDisplayProps,
  CodeBlockProps,
  RegularContentProps,
  TextComponentProps,
} from '@/types/faq';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AIResponseDisplay: React.FC<AIResponseDisplayProps> = ({ content }) => {
  return (
    <div className="font-mono text-sm sm:text-base bg-gray-50 dark:bg-gray-900 p-6 rounded-xl dark:shadow-xl">
      <div className="space-y-2 ai-response-content max-h-[60vh] overflow-y-auto pr-4">
        {renderContent(content)}
      </div>
    </div>
  );
};

const renderContent = (content: string) => {
  const parts = content.split(/(```[\s\S]*?```)/);
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      return <CodeBlock key={index} code={part} />;
    } else {
      return <RegularContent key={index} content={part} />;
    }
  });
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const language = code.split('\n')[0].trim().slice(3);
  const codeContent = code.split('\n').slice(1).join('\n').slice(0, -3);
  return (
    <div className="my-4">
      <SyntaxHighlighter
        language={language || 'javascript'}
        style={vscDarkPlus}
        className="rounded-md text-sm"
      >
        {codeContent}
      </SyntaxHighlighter>
    </div>
  );
};

const RegularContent: React.FC<RegularContentProps> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div>
      {lines.map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <MainHeader key={index} content={line} />;
        } else if (line.startsWith('*')) {
          return <BulletPoint key={index} content={line} />;
        } else {
          return <RegularText key={index} content={line} />;
        }
      })}
    </div>
  );
};

const MainHeader: React.FC<TextComponentProps> = ({ content }) => (
  <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400 my-4">
    {content.replace(/\*\*/g, '')}
  </h2>
);

const BulletPoint: React.FC<TextComponentProps> = ({ content }) => {
  const bulletContent = content.slice(1).trim();
  const parts = bulletContent.split(/(\*\*.*?\*\*)/g);
  return (
    <div className="flex items-start space-x-2 my-2">
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
};

const RegularText: React.FC<TextComponentProps> = ({ content }) => (
  <p className="text-gray-700 dark:text-gray-300 my-1">{content}</p>
);

export default AIResponseDisplay;
