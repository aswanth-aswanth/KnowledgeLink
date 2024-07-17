import { useEffect, useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import { Search, MessageCircleMore, X } from "lucide-react";
import { Socket } from "socket.io-client";
import { Message } from "@/types";

interface User {
  _id: string;
  username: string;
  image: string;
}

interface Chat {
  userId: string;
  chatId: string;
  lastMessage: string;
  updatedAt: string;
  username: string;
  image: string;
}

interface SidebarProps {
  isDarkMode: boolean;
  onChatSelect: (chatId: string) => void;
  socket: Socket | null;
  isVisible: boolean;
  onClose: () => void;
  userChats: Chat[];
  setUserChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export default function Sidebar({
  isDarkMode,
  onChatSelect,
  socket,
  isVisible,
  onClose,
  userChats,
  setUserChats,
}: SidebarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (debouncedSearchTerm) {
      try {
        const response = await apiClient(
          `http://localhost:4000/profile/search?name=${debouncedSearchTerm}`
        );
        const { data } = await response;
        console.log("Search results : ", data);
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleStartConversation = async (participantId: string) => {
    try {
      const response = await apiClient.post(
        "http://localhost:4000/chat/individual",
        { participantId }
      );
      const { data } = await response;
      console.log("Response : ", data);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", (message: Message) => {
        setUserChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatId === message.chatId
              ? {
                  ...chat,
                  lastMessage: message.content,
                  updatedAt: message.createdAt,
                }
              : chat
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("new_message");
      }
    };
  }, [socket, setUserChats]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`w-64 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      } border-r md:block overflow-y-auto fixed inset-y-0 left-0 z-20 transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } px-2 transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="mt-2" ref={searchRef}>
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold flex-grow">Chat Room</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
          {isSearchExpanded ? (
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchExpanded(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {searchResults.length > 0 ? (
        <div className="mb-6">
          <h3
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } mb-2`}
          >
            SEARCH RESULTS
          </h3>
          <ul className="space-y-2">
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="flex items-center space-x-3 justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.image || "pngwing.com.png"}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStartConversation(user._id)}
                >
                  <MessageCircleMore className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h3
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } mb-2`}
        >
          YOUR CHATS
        </h3>
        <ul className="space-y-4">
          {userChats.map((chat) => (
            <li
              key={chat.chatId}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onChatSelect(chat.chatId)}
            >
              <img
                src={chat.image || "pngwing.com.png"}
                alt={chat.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-between">
                  <span>{chat.username}</span>
                  <span className="text-xs whitespace-nowrap">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs w-[170px] truncate">
                  {chat.lastMessage || "No messages yet"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
