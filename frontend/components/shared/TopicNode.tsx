import React, { useState, useCallback, useRef, useEffect } from "react";
import { Topic } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, Plus, Trash } from "lucide-react";

interface TopicNodeProps {
  topic: Topic;
  addTopic: (parentNo: string) => void;
  updateTopic: (no: string, field: keyof Topic, value: string) => void;
  deleteTopic: (no: string) => void;
}

const TEXT_STYLES = [
  { name: "Paragraph", style: "p", class: "text-base" },
  { name: "Heading 1", style: "h1", class: "text-2xl font-bold" },
  { name: "Heading 2", style: "h2", class: "text-xl font-bold" },
  { name: "Heading 3", style: "h3", class: "text-lg font-bold" },
  { name: "Bullet List", style: "ul", class: "list-disc list-inside" },
  { name: "Numbered List", style: "ol", class: "list-decimal list-inside" },
];

const TopicNode: React.FC<TopicNodeProps> = ({
  topic,
  addTopic,
  updateTopic,
  deleteTopic,
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

  const handleDelete = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to delete this topic and all its subtopics?"
      )
    ) {
      deleteTopic(topic.no);
    }
  }, [topic.no, deleteTopic]);

  console.log("Topic : ", topic);

  const handleContentChange = useCallback(() => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      updateTopic(topic.no, "content", newContent);
    }
  }, [topic.no, updateTopic]);

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
          listItem.className = "pl-1"; // Add left padding to list items

          if (range.toString().length > 0) {
            listItem.appendChild(range.extractContents());
          } else {
            listItem.appendChild(document.createTextNode("\u200B")); // Add a zero-width space
          }

          listElement.appendChild(listItem);
          range.insertNode(listElement);

          // Move cursor to the end of the list item
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
            newNode.appendChild(document.createTextNode("\u200B")); // Add a zero-width space
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
      } else if (e.key === "Enter") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const currentNode = range.startContainer.parentElement;

          if (
            currentNode &&
            (currentNode.tagName === "LI" ||
              currentNode.parentElement?.tagName === "LI")
          ) {
            e.preventDefault();
            const listItem =
              currentNode.tagName === "LI"
                ? currentNode
                : currentNode.parentElement;
            const list = listItem?.parentElement;

            if (listItem && list) {
              if (listItem.textContent?.trim() === "") {
                // If the current list item is empty, exit the list
                if (listItem.nextElementSibling) {
                  // If there are items after this one, split the list
                  const newList = list.cloneNode(false);
                  while (listItem.nextElementSibling) {
                    newList.appendChild(listItem.nextElementSibling);
                  }
                  list.parentNode?.insertBefore(newList, list.nextSibling);
                }
                listItem.remove();
                if (!list.hasChildNodes()) {
                  list.remove();
                }
              } else {
                const newItem = document.createElement("li");
                newItem.appendChild(document.createTextNode("\u200B"));
                list.insertBefore(newItem, listItem.nextSibling);

                const newRange = document.createRange();
                newRange.setStart(newItem.firstChild!, 1);
                newRange.setEnd(newItem.firstChild!, 1);
                selection.removeAllRanges();
                selection.addRange(newRange);
              }
            }
          }
        }
      }
    },
    [showStyleMenu]
  );
  return (
    <div className="topic-node mb-3">
      <div className="flex items-center group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 focus:outline-none"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <input
          type="text"
          value={topic.name}
          onChange={handleNameChange}
          className="flex-grow bg-transparent px-2 py-1 focus:outline-none focus:bg-gray-50 rounded-md transition-colors duration-200"
          placeholder="Untitled"
        />
        <span className="text-xs text-gray-400 mr-2">{topic.no}</span>
        <button
          onClick={() => addTopic(topic.no)}
          className="p-1 rounded-md text-gray-400 bg-gray-100 hover:bg-gray-200 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
      {isExpanded && (
        <div className="ml-6 mt-2">
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] p-2 mb-2 bg-gray-50 rounded-md focus:outline-none  transition-all duration-200 prose prose-sm max-w-none"
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
          {topic.children.map((childTopic) => (
            <TopicNode
              key={childTopic.no}
              topic={childTopic}
              addTopic={addTopic}
              updateTopic={updateTopic}
              deleteTopic={deleteTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicNode;
