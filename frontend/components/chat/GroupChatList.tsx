import React from "react";
import { Users } from "lucide-react";
import { GroupChatListProps } from "@/types/chat";

export const GroupChatList: React.FC<GroupChatListProps> = ({
  groupChats,
  isDarkMode,
  onChatSelect,
}) => {
  return (
    <div>
      <h3
        className={`text-sm font-medium mt-10 ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        } mb-2`}
      >
        YOUR GROUP CHATS
      </h3>
      <ul className="space-y-4">
        {groupChats.map((chat) => (
          <li
            key={chat.chatId}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onChatSelect(chat.chatId)}
          >
            <Users className="w-8 h-8" />
            <div className="flex flex-col flex-grow">
              <div className="flex items-center justify-between">
                <span>{chat.name}</span>
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
  );
};
