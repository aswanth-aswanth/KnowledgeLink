import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { ChatHeaderProps } from "@/types/chatwindow";

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  onOpenSidebar,
  openProfile,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 dark:text-white p-4 border-b flex items-center`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSidebar}
        className="mr-2 md:hidden"
      >
        <Menu className="h-4 w-4" />
      </Button>
      {selectedUser ? (
        <div className="flex items-center cursor-pointer" onClick={openProfile}>
          <img
            src={selectedUser.image || "/defaultUserImage.png"}
            alt={selectedUser.username}
            className="w-8 h-8 rounded-full mr-2"
          />
          <h2 className="text-xl font-semibold">{selectedUser.username}</h2>
        </div>
      ) : (
        <h2 className="text-xl font-semibold">Select a chat</h2>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={openProfile}
        className="ml-auto md:hidden"
      >
        <User className="h-4 w-4" />
      </Button>
    </div>
  );
};
