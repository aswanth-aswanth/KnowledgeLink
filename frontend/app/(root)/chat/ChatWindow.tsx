import React, { useState, useEffect, useRef, useCallback } from "react";
import apiClient from "@/api/apiClient";
import { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface Chat {
  userId: string;
  chatId: string;
  lastMessage: string;
  updatedAt: string;
  username: string;
  image: string;
}

interface ChatWindowProps {
  isDarkMode: boolean;
  selectedChatId: string | null;
  socket: Socket | null;
  sendMessage: (chatId: string, content: string) => void;
  joinChatRoom: (chatId: string) => void;
  token: string;
  onOpenSidebar: () => void;
  userChats: Chat[];
}

export default function ChatWindow({
  isDarkMode,
  selectedChatId,
  socket,
  sendMessage,
  joinChatRoom,
  token,
  onOpenSidebar,
  userChats,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [selectedUser, setSelectedUser] = useState<Chat | null>(null);
  const router = useRouter();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const getCurrentUserId = useCallback(() => {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (selectedChatId && userChats.length > 0) {
      const user = userChats.find(chat => chat.chatId === selectedChatId);
      setSelectedUser(user || null);
    } else {
      setSelectedUser(null);
    }
  }, [selectedChatId, userChats]);

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

  const openProfile = () => {
    if (selectedUser) {
      router.push(`/profile/${selectedUser.userId}`);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col h-full">
        <div
          className={`${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white"
          } p-4 border-b flex items-center`}
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
            <div
              className="flex items-center cursor-pointer"
              onClick={openProfile}
            >
              <img
                src={selectedUser.image || "/default-avatar.png"}
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
    </>
  );
}
