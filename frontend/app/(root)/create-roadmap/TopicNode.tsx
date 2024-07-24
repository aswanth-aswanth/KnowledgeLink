import React, { useCallback, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  updateTopic,
  deleteTopic,
  addTopic,
  toggleExpand,
} from "@/store/topicsSlice";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash,
  Image,
  Video,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDarkMode } from "@/hooks/useDarkMode";

const TEXT_STYLES = [
  { name: "Paragraph", style: "p", class: "text-base" },
  { name: "Heading 1", style: "h1", class: "text-2xl font-bold" },
  { name: "Heading 2", style: "h2", class: "text-xl font-bold" },
  { name: "Heading 3", style: "h3", class: "text-lg font-bold" },
  { name: "Bullet List", style: "ul", class: "list-disc list-inside" },
  { name: "Numbered List", style: "ol", class: "list-decimal list-inside" },
];

const MEDIA_OPTIONS = [
  { name: "Image", icon: Image },
  { name: "Video", icon: Video },
];

const LAYOUT_OPTIONS = [
  { name: "Full Width", class: "w-full" },
  { name: "Large", class: "max-w-lg" },
  { name: "Medium", class: "max-w-md" },
  { name: "Small", class: "max-w-sm" },
];

interface TopicNodeProps {
  id: string;
}

const TopicNode: React.FC<TopicNodeProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const topic = useSelector((state: RootState) => state.topics.topics[id]);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useDarkMode();

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

      // Replace Blob URLs with data URLs
      const updatedContent = newContent.replace(
        /(src=")blob:[^"]+/g,
        (match, prefix) => {
          const element = contentRef.current?.querySelector(
            `[src="${match.slice(5)}"]`
          );
          if (
            element instanceof HTMLImageElement ||
            element instanceof HTMLVideoElement
          ) {
            return `${prefix}${element.src}`;
          }
          return match;
        }
      );

      dispatch(updateTopic({ id, updates: { content: updatedContent } }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== topic.content) {
      contentRef.current.innerHTML = topic.content;
    }
  }, [topic.content, topic.isExpanded]);

  const applyStyle = useCallback(
    (style: string, styleClass: string) => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && contentRef.current) {
        const range = selection.getRangeAt(0);
        const parentElement = range.commonAncestorContainer.parentElement;

        const unwrapContent = (element: HTMLElement) => {
          const parent = element.parentNode;
          while (element.firstChild) {
            parent?.insertBefore(element.firstChild, element);
          }
          parent?.removeChild(element);
        };

        if (parentElement && parentElement !== contentRef.current) {
          unwrapContent(parentElement);
        }

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
            newNode.appendChild(range.extractContents());
            range.insertNode(newNode);
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

  const insertMedia = useCallback(
    (file: File | null) => {
      if (contentRef.current && file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;

          const mediaContainer = document.createElement("div");
          mediaContainer.className = `media-container w-full ${LAYOUT_OPTIONS[0].class} mx-auto my-4 relative`;

          const mediaElement = file.type.startsWith("image/")
            ? document.createElement("img")
            : document.createElement("video");

          mediaElement.src = dataUrl;
          mediaElement.className = "w-full h-auto";
          if (mediaElement instanceof HTMLVideoElement) {
            mediaElement.controls = true;
          }

          mediaContainer.appendChild(mediaElement);

          // Add layout and delete buttons
          const buttonsContainer = document.createElement("div");
          buttonsContainer.className = "absolute top-2 right-2 flex space-x-2";

          const layoutButton = document.createElement("button");
          layoutButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`;
          layoutButton.className = "p-1 bg-white rounded-full shadow-md";
          layoutButton.onclick = (e) => {
            e.stopPropagation();
            cycleLayout(mediaContainer);
          };

          const deleteButton = document.createElement("button");
          deleteButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
          deleteButton.className = "p-1 bg-white rounded-full shadow-md";
          deleteButton.onclick = (e) => {
            e.stopPropagation();
            mediaContainer.remove();
            handleContentChange();
          };

          buttonsContainer.appendChild(layoutButton);
          buttonsContainer.appendChild(deleteButton);
          mediaContainer.appendChild(buttonsContainer);

          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(mediaContainer);
            range.collapse(false);
          } else {
            contentRef.current.appendChild(mediaContainer);
          }

          handleContentChange();
        };
        reader.readAsDataURL(file);
      }
    },
    [handleContentChange]
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      insertMedia(file);
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "/" && !showStyleMenu) {
        e.preventDefault();
        setShowStyleMenu(true);
      }
    },
    [showStyleMenu]
  );

  const cycleLayout = (container: HTMLElement) => {
    const currentIndex = LAYOUT_OPTIONS.findIndex((option) =>
      container.classList.contains(option.class)
    );
    const nextIndex = (currentIndex + 1) % LAYOUT_OPTIONS.length;
    container.classList.remove(LAYOUT_OPTIONS[currentIndex].class);
    container.classList.add(LAYOUT_OPTIONS[nextIndex].class);
    handleContentChange(); // Add this line to save the changes
  };

  return (
    <div className="topic-node mb-3">
      <div className="flex items-center group">
        <button
          onClick={handleToggleExpand}
          className={`p-2 rounded-md ${
            isDarkMode
              ? "text-gray-500 hover:bg-gray-800"
              : "text-gray-400 hover:bg-gray-100"
          } focus:outline-none`}
        >
          {topic.isExpanded ? (
            <ChevronDown
              size={16}
              className={`${isDarkMode ? "text-gray-300" : "text-black"}`}
            />
          ) : (
            <ChevronRight
              size={16}
              className={`${isDarkMode ? "text-gray-300" : "text-black"}`}
            />
          )}
        </button>
        <input
          type="text"
          value={topic.name}
          onChange={handleNameChange}
          className={`flex-grow bg-transparent px-2 py-1 focus:outline-none rounded-md font-bold text-lg ${
            isDarkMode
              ? "focus:bg-gray-800 text-gray-300"
              : "focus:bg-gray-50 text-gray-600"
          } transition-colors duration-200`}
          placeholder="Untitled"
        />
        <span
          className={`text-xs ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          } mr-2`}
        >
          {topic.no}
        </span>
        <button
          onClick={handleAddSubtopic}
          className={`p-1 rounded-md focus:outline-none group-hover:opacity-100 ${
            isDarkMode
              ? "text-gray-500 bg-gray-800 hover:bg-gray-700"
              : "text-gray-400 bg-gray-100 hover:bg-gray-200"
          } transition-opacity duration-200 mr-1`}
        >
          <Plus size={16} />
        </button>
        <button
          onClick={handleDelete}
          className={`p-1 rounded-md focus:outline-none group-hover:opacity-100 ${
            isDarkMode
              ? "text-gray-500 bg-gray-800 hover:bg-gray-700"
              : "text-gray-400 bg-gray-100 hover:bg-gray-200"
          } transition-opacity duration-200`}
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
            className={`h-min p-2 mb-2 rounded-md focus:outline-none transition-all duration-200 prose font-medium prose-sm text-base tracking-wider ${
              isDarkMode
                ? "bg-gray-800 text-gray-300"
                : "bg-gray-50 text-gray-600"
            } leading-9 max-w-none`}
          />
          <DropdownMenu open={showStyleMenu} onOpenChange={setShowStyleMenu}>
            <DropdownMenuTrigger asChild>
              <button
                className={`text-sm focus:outline-none ${
                  isDarkMode
                    ? "hover:text-gray-200 text-gray-400"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Format
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-56 shadow-lg rounded-md border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {TEXT_STYLES.map((style) => (
                <DropdownMenuItem
                  key={style.style}
                  onClick={() => applyStyle(style.style, style.class)}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className={`mr-2 ${style.class}`}>{style.name}</span>
                </DropdownMenuItem>
              ))}
              {MEDIA_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.name}
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                    setShowStyleMenu(false);
                  }}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <option.icon className="mr-2 h-4 w-4 inline-block" />
                  <span>{option.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          {topic.children.map((childId) => (
            <TopicNode key={childId} id={childId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicNode;
