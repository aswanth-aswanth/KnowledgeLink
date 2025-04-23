import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { TopicModalProps } from '@/types/roadmap';

const TopicModal: React.FC<TopicModalProps> = ({ topic, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const createMarkup = (html: string) => {
    return {
      __html: DOMPurify.sanitize(html, {
        ADD_TAGS: ['video'],
        ADD_ATTR: ['controls', 'src'],
      }),
    };
  };

  const renderTopic = (t: any) => (
    <div className="mb-8 lg:max-w-[68vw] scroll-smooth mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        {t.name}
      </h3>
      <div
        className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300"
        dangerouslySetInnerHTML={createMarkup(t.content)}
      />
      {t.children && t.children.length > 0 && (
        <div className="ml-6 mt-4">
          <div className="cursor-pointer font-semibold mb-4 text-lg text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
            Subtopics
          </div>
          <div className="ml-4 border-l-2 pl-4 mt-2 space-y-6 border-gray-300">
            {t.children.map((child: any, index: number) => (
              <div key={index} className="mb-4">
                {renderTopic(child)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-75 dark:bg-black dark:bg-opacity-75">
      <div
        ref={modalRef}
        className={`relative overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 ${
          isFullscreen
            ? 'w-full h-full'
            : 'sm:w-11/12 max-w-4xl max-h-[90vh] sm:m-4 rounded-lg shadow-2xl'
        }`}
      >
        <div className="sticky top-0 flex justify-between items-center p-4 sm:p-8 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {topic.name}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-20 dark:hover:bg-gray-600"
            >
              {isFullscreen ? (
                <Minimize2 className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Maximize2 className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 hover:bg-opacity-20 dark:hover:bg-gray-600"
            >
              <X className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        <div
          className={`p-4 sm:p-8 overflow-y-auto scrollbar-hide ${
            isFullscreen ? 'h-[calc(100vh-80px)]' : 'max-h-[calc(90vh-80px)]'
          }`}
        >
          {renderTopic(topic)}
        </div>
      </div>
    </div>
  );
};

export default TopicModal;
