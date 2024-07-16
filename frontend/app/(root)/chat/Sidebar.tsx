import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { users, channels } from "@/data/sampleData";
import apiClient from "@/api/apiClient";

interface User {
  _id: string;
  username: string;
  image: string;
}

export default function Sidebar({ isDarkMode }: { isDarkMode: boolean }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<User[]>([]);

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

  // Use effect to trigger search when debounced search term changes
  useEffect(() => {
    handleSearch();
  }, [debouncedSearchTerm]);

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
                <li key={user._id} className="flex items-center space-x-3">
                  <img
                    src={user.image||'pngwing.com.png'}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.username}</span>
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
                FAVOURITES
              </h3>
              <ul className="space-y-4">
                {users.map((user) => (
                  <li key={user.id} className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.name}</span>
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
