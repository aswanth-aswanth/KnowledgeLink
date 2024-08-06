import React from "react";
import { UserChatListProps } from "@/types/chat";

export const UserChatList: React.FC<UserChatListProps> = ({
  userChats,
  isDarkMode,
  onChatSelect,
}) => {
  return (
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
              src={chat.image || "/pngwing.com.png"}
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
  );
};
