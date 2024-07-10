// components/TopicModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

interface TopicModalProps {
  topic: any;
  onClose: () => void;
}

const TopicModal: React.FC<TopicModalProps> = ({ topic, onClose }) => {
  const { isDarkMode } = useDarkMode();
  const [isFullscreen, setIsFullscreen] = useState(true);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderTopic = (t: any) => (
    <div className="mb-8">
      <h3
        className={`text-2xl font-bold mb-4 ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {t.name}
      </h3>
      <p
        className={`mb-6 text-lg leading-relaxed ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {t.content}
      </p>
      {t.children && t.children.length > 0 && (
        <details className="ml-6 mt-4">
          <summary
            className={`cursor-pointer font-semibold mb-4 text-lg ${
              isDarkMode
                ? "text-gray-300 hover:text-gray-100"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Subtopics
          </summary>
          <div className="ml-4 border-l-2 pl-4 mt-2 space-y-6 border-gray-300">
            {t.children.map((child: any, index: number) => (
              <div key={index} className="mb-4">
                {renderTopic(child)}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isDarkMode ? "bg-black bg-opacity-75" : "bg-gray-200 bg-opacity-75"
      }`}
    >
      <div
        ref={modalRef}
        className={`relative overflow-hidden transition-all duration-300 ease-in-out
          ${isDarkMode ? "bg-gray-900" : "bg-white"}
          ${
            isFullscreen
              ? "w-full h-full"
              : "w-11/12 max-w-4xl max-h-[90vh] m-4 rounded-lg shadow-2xl"
          }`}
      >
        <div
          className={`sticky top-0 flex justify-between items-center p-6 border-b ${
            isDarkMode
              ? "border-gray-700 bg-gray-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <h2
            className={`text-3xl font-bold ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {topic.name}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-full hover:bg-opacity-20 ${
                isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
              }`}
            >
              {isFullscreen ? (
                <Minimize2
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
              ) : (
                <Maximize2
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
              )}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-opacity-20 ${
                isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
              }`}
            >
              <X className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
            </button>
          </div>
        </div>
        <div
          className={`p-8 overflow-y-auto ${
            isFullscreen ? "h-[calc(100vh-80px)]" : "max-h-[calc(90vh-80px)]"
          }`}
        >
          {renderTopic(topic)}
        </div>
      </div>
    </div>
  );
};

export default TopicModal;
