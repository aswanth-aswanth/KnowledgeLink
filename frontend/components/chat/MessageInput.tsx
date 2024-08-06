import { MessageInputProps } from "@/types/chatwindow";
import React from "react";

export const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  handleSend,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 dark:text-white p-4 flex items-center`}
    >
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        className="flex-1 border rounded-full py-2 px-4 focus:outline-none bg-gray-200 border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        placeholder="Type a message"
      />
      <button
        onClick={handleSend}
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full"
      >
        Send
      </button>
    </div>
  );
};
