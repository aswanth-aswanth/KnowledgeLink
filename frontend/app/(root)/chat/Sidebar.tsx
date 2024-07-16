import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { channels } from "@/data/sampleData";
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
  username: string; // Added for displaying user names
}

export default function Sidebar({ isDarkMode }: { isDarkMode: boolean }) {
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
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const fetchUserChats = async () => {
    try {
      const response = await apiClient.get("/chat/user/chats");
      const { data } = await response;
      console.log("data : ",data);

      // Temporarily replace userId with random names
      const chatsWithUsernames = data.map((chat: Chat) => ({
        ...chat,
        username: getRandomName(),
      }));

      setUserChats(chatsWithUsernames);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };

  const getRandomName = () => {
    const names = [
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Emma",
      "Frank",
      "Grace",
      "Henry",
    ];
    return names[Math.floor(Math.random() * names.length)];
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
                    title="Start conversation"
                  >
                    <MessageCircleMore className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } mb-2`}
              >
                CHATS
              </h3>
              <ul className="space-y-4">
                {userChats.map((chat) => (
                  <li key={chat.chatId} className="flex items-center space-x-3">
                    <img
                      src="pngwing.com.png"
                      alt={chat.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {chat.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } mb-2`}
              >
                CHANNELS
              </h3>
              <ul className="space-y-2">
                {channels.map((channel) => (
                  <li key={channel.id} className="flex items-center space-x-3">
                    <span>#</span>
                    <span>{channel.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
