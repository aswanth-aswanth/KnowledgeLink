import React, { useState, useEffect, useRef, useCallback } from "react";
import apiClient from "@/api/apiClient";
import { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  isDarkMode: boolean;
  selectedChatId: string | null;
  socket: Socket | null;
  sendMessage: (chatId: string, content: string) => void;
  joinChatRoom: (chatId: string) => void;
  token: string;
}

export default function ChatWindow({
  isDarkMode,
  selectedChatId,
  socket,
  sendMessage,
  joinChatRoom,
  token,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const getCurrentUserId = useCallback(() => {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId; // Adjust this based on your token structure
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (selectedChatId) {
      const fetchMessages = async () => {
        try {
          const response = await apiClient.get(
            `/chat/${selectedChatId}/messages`
          );
          setMessages(response.data);
          scrollToBottom();
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
      joinChatRoom(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId, joinChatRoom, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (socket) {
      const newMessageHandler = (message: Message) => {
        if (message.chatId === selectedChatId) {
          setMessages((prevMessages) => [...prevMessages, message]);
          scrollToBottom();
        }
      };

      socket.on("new_message", newMessageHandler);

      return () => {
        socket.off("new_message", newMessageHandler);
      };
    }
  }, [socket, selectedChatId, scrollToBottom]);

  const handleSend = async () => {
    if (newMessage.trim() && selectedChatId) {
      sendMessage(selectedChatId, newMessage);
      setNewMessage("");
      // We don't need to manually add the message here as it will come through the socket
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const currentUserId = getCurrentUserId();

  return (
    <div className="flex-1 flex flex-col h-full">
      <div
        className={`${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } p-4 border-b`}
      >
        <h2 className="text-xl font-semibold">Chat Window</h2>
      </div>
      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } scrollbar-hide`}
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUserId
                    ? "bg-green-500 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200"
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === currentUserId
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
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
