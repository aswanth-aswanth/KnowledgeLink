import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import { Search, MessageCircleMore } from "lucide-react";

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
}

export default function Sidebar({ isDarkMode, onChatSelect }: SidebarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [userChats, setUserChats] = useState<Chat[]>([]);

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
      fetchUserChats();
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const fetchUserChats = async () => {
    try {
      const response = await apiClient.get("/chat/user/chats");
      const { data } = await response;
      console.log("data : ", data);
      setUserChats(data);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchUserChats();
  }, []);

  return (
    <div
      className={`w-64 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      } border-r hidden md:block overflow-y-auto`}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold flex-grow">Chat Room</h2>
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
          <ul className="space-y-2">
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
                  <span>{chat.username}</span>
                  <span className="text-xs truncate">
                    {chat.lastMessage || "No messages yet"}
                  </span>
                </div>
                <span className="text-xs whitespace-nowrap">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
