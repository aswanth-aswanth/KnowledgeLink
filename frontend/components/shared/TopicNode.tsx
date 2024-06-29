"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  updateTopic,
  deleteTopic,
  addTopic,
  toggleExpand,
} from "@/store/topicsSlice";
import { ChevronDown, ChevronRight, Plus, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TEXT_STYLES = [
  { name: "Paragraph", style: "p", class: "text-base" },
  { name: "Heading 1", style: "h1", class: "text-2xl font-bold" },
  { name: "Heading 2", style: "h2", class: "text-xl font-bold" },
  { name: "Heading 3", style: "h3", class: "text-lg font-bold" },
  { name: "Bullet List", style: "ul", class: "list-disc list-inside" },
  { name: "Numbered List", style: "ol", class: "list-decimal list-inside" },
];

interface TopicNodeProps {
  id: string;
}

const TopicNode: React.FC<TopicNodeProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const topic = useSelector((state: RootState) => state.topics.topics[id]);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!topic) {
    return null;
  }

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateTopic({ id, updates: { name: e.target.value } }));
    },
    [dispatch, id]
  );

  const handleDelete = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to delete this topic and all its subtopics?"
      )
    ) {
      dispatch(deleteTopic(id));
    }
  }, [dispatch, id]);

  const handleAddSubtopic = useCallback(() => {
    const newTopic = {
      id: Date.now().toString(),
      name: "New Topic",
      content: "",
      no: `${topic.no}-${topic.children.length + 1}`,
      children: [],
      isExpanded: false,
    };
    dispatch(addTopic({ parentId: id, newTopic }));
  }, [dispatch, id, topic.no, topic.children.length]);

  const handleToggleExpand = useCallback(() => {
    dispatch(toggleExpand(id));
  }, [dispatch, id]);

  const handleContentChange = useCallback(() => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      dispatch(updateTopic({ id, updates: { content: newContent } }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== topic.content) {
      contentRef.current.innerHTML = topic.content;
    }
  }, [topic.content]);

  const applyStyle = useCallback(
    (style: string, styleClass: string) => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && contentRef.current) {
        const range = selection.getRangeAt(0);

        if (style === "ul" || style === "ol") {
          const listElement = document.createElement(style);
          listElement.className = styleClass;
          const listItem = document.createElement("li");
          listItem.className = "pl-1";

          if (range.toString().length > 0) {
            listItem.appendChild(range.extractContents());
          } else {
            listItem.appendChild(document.createTextNode("\u200B"));
          }

          listElement.appendChild(listItem);
          range.insertNode(listElement);

          const newRange = document.createRange();
          newRange.selectNodeContents(listItem);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } else {
          const newNode = document.createElement(style);
          newNode.className = styleClass;

          if (range.toString().length > 0) {
            range.surroundContents(newNode);
          } else {
            newNode.appendChild(document.createTextNode("\u200B"));
            range.insertNode(newNode);
            range.setStart(newNode.firstChild!, 1);
            range.setEnd(newNode.firstChild!, 1);
          }
        }
      }
      setShowStyleMenu(false);
      if (contentRef.current) {
        contentRef.current.focus();
        handleContentChange();
      }
    },
    [handleContentChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "/" && !showStyleMenu) {
        e.preventDefault();
        setShowStyleMenu(true);
      }
    },
    [showStyleMenu]
  );

  return (
    <div className="topic-node mb-3">
      <div className="flex items-center group">
        <button
          onClick={handleToggleExpand}
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 focus:outline-none"
        >
          {topic.isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
        <input
          type="text"
          value={topic.name}
          onChange={handleNameChange}
          className="flex-grow bg-transparent px-2 py-1 focus:outline-none focus:bg-gray-50 rounded-md font-semibold text-gray-800 transition-colors duration-200"
          placeholder="Untitled"
        />
        <span className="text-xs text-gray-400 mr-2">{topic.no}</span>
        <button
          onClick={handleAddSubtopic}
          className="p-1 rounded-md text-gray-400 bg-gray-100 hover:bg-gray-200 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-1"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 rounded-md text-gray-400 bg-gray-100 hover:bg-gray-200 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Trash size={16} />
        </button>
      </div>
      {topic.isExpanded && (
        <div className="ml-6 mt-2">
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            className="h-min p-2 mb-2 bg-gray-50 rounded-md focus:outline-none transition-all duration-200 prose prose-sm text-base tracking-wider leading-9 max-w-none"
          />
          <DropdownMenu open={showStyleMenu} onOpenChange={setShowStyleMenu}>
            <DropdownMenuTrigger asChild>
              <button className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none">
                Format
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white shadow-lg rounded-md border border-gray-200">
              {TEXT_STYLES.map((style) => (
                <DropdownMenuItem
                  key={style.style}
                  onClick={() => applyStyle(style.style, style.class)}
                  className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                >
                  <span className={`mr-2 ${style.class}`}>{style.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {topic.children.map((childId) => (
            <TopicNode key={childId} id={childId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicNode;
