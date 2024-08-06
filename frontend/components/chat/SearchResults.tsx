import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircleMore } from "lucide-react";
import { User } from "@/types/chat";

interface SearchResultsProps {
  searchResults: User[];
  isDarkMode: boolean;
  handleStartConversation: (participantId: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  isDarkMode,
  handleStartConversation,
}) => {
  if (searchResults.length === 0) return null;

  return (
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
                src={user.image || "/pngwing.com.png"}
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
  );
};
