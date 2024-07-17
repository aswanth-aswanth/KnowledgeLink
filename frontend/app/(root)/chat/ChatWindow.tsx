import { useState, useEffect, useRef } from "react";
import { Message } from "@/types";
import apiClient from "@/api/apiClient";

export default function ChatWindow({
  isDarkMode,
  selectedChatId,
}: {
  isDarkMode: boolean;
  selectedChatId: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedChatId) {
      const fetchMessages = async () => {
        try {
          const response = await apiClient.get(
            `/chat/${selectedChatId}/messages`
          );
          const { data } = await response;
          setMessages(data);
          scrollToBottom();
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim() && selectedChatId) {
      try {
        const response = await apiClient.post("/chat/message", {
          chatId: selectedChatId,
          content: newMessage,
        });

        const { data: newMsg } = await response;
        setMessages([...messages, { ...newMsg, isOwn: true }]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } p-4 border-b`}
      >
        <h2 className="text-xl font-semibold">Coffee Nerds</h2>
      </div>
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } scrollbar-hide`}
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? "bg-green-500 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isOwn
                      ? "text-white"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p
            className={`${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } text-center`}
          >
            Start a conversation
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div
        className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 border-t`}
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white"
            }`}
            placeholder="Write a reply..."
            disabled={!selectedChatId}
          />
          <button
            onClick={handleSend}
            className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!selectedChatId}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
