"use client";
// src/components/TopicNode.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Topic } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TopicNodeProps {
  topic: Topic;
  addTopic: (parentNo: string) => void;
  updateTopic: (no: string, field: keyof Topic, value: string) => void;
}

const TEXT_STYLES = [
  { name: "Paragraph", style: "p" },
  { name: "Heading 1", style: "h1" },
  { name: "Heading 2", style: "h2" },
  { name: "Heading 3", style: "h3" },
  { name: "Bullet List", style: "ul" },
  { name: "Numbered List", style: "ol" },
];

const TopicNode: React.FC<TopicNodeProps> = ({
  topic,
  addTopic,
  updateTopic,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateTopic(topic.no, "name", e.target.value);
    },
    [topic.no, updateTopic]
  );

  const handleContentChange = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      updateTopic(topic.no, "content", e.currentTarget.innerHTML);
    },
    [topic.no, updateTopic]
  );

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "/" && !showStyleMenu) {
        e.preventDefault();
        setShowStyleMenu(true);
      }
    },
    [showStyleMenu]
  );

  const applyStyle = useCallback((style: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const newNode = document.createElement(style);
      range.surroundContents(newNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    setShowStyleMenu(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setShowStyleMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="topic-node mb-4">
      <div className="flex items-center bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200">
        <button
          onClick={toggleExpand}
          className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isExpanded ? "▼" : "▶"}
        </button>
        <input
          type="text"
          value={topic.name}
          onChange={handleNameChange}
          className="flex-grow bg-transparent border-none focus:outline-none font-medium"
          placeholder="Untitled"
        />
        <span className="text-sm text-gray-400 ml-2">{topic.no}</span>
      </div>
      {isExpanded && (
        <div className="ml-6 mt-2">
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
          <DropdownMenu open={showStyleMenu} onOpenChange={setShowStyleMenu}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden">
                Style
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {TEXT_STYLES.map((style) => (
                <DropdownMenuItem
                  key={style.style}
                  onClick={() => applyStyle(style.style)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <span className={`mr-2 ${getStyleClass(style.style)}`}>
                    {style.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex space-x-2 mb-2">
            <button
              onClick={() => addTopic(topic.no)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg text-sm transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Subtopic
            </button>
          </div>
          {topic.children.map((childTopic) => (
            <TopicNode
              key={childTopic.no}
              topic={childTopic}
              addTopic={addTopic}
              updateTopic={updateTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function getStyleClass(style: string): string {
  switch (style) {
    case "h1":
      return "text-2xl font-bold";
    case "h2":
      return "text-xl font-bold";
    case "h3":
      return "text-lg font-bold";
    case "ul":
      return "list-disc";
    case "ol":
      return "list-decimal";
    default:
      return "";
  }
}

export default TopicNode;
