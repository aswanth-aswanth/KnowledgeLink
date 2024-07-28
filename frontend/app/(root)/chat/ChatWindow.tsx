import React, { useState, useEffect, useRef, useCallback } from "react";
import apiClient from "@/api/apiClient";
import { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { MdCheck, MdReply } from "react-icons/md";
import { BiCheckDouble } from "react-icons/bi";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readBy: [];
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
  selectedChatId: string | null;
  socket: Socket | null;
  sendMessage: (chatId: string, content: string) => void;
  joinChatRoom: (chatId: string) => void;
  token: string;
  onOpenSidebar: () => void;
  userChats: Chat[];
}

export default function ChatWindow({
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
      const user = userChats.find((chat) => chat.chatId === selectedChatId);
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
          console.log("selected ChatId  : ", selectedChatId);
          console.log("fetched Messages : ", response.data);
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
        }
      };

      socket.on("new_message", newMessageHandler);

      const messageReadHandler = ({
        chatId,
        messageId,
        readBy,
      }: {
        chatId: string;
        messageId: string;
        readBy: [];
      }) => {
        /* console.group("messageReadHandler");
        console.log("messageHandler called chatId : ", chatId);
        console.log("messageId : ", messageId);
        console.log("readBy : ", readBy);
        console.log("chatId === selectedChatId : ", chatId === selectedChatId);
        console.groupEnd(); */
        if (chatId === selectedChatId) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId ? { ...msg, readBy: [...readBy] } : msg
            )
          );
        }
      };

      socket.on("message_read", messageReadHandler);

      return () => {
        socket.off("new_message", newMessageHandler);
        socket.off("message_read", messageReadHandler);
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

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;
    const containerBottom = container.scrollTop + container.clientHeight;
    const containerHeight = container.scrollHeight;

    if (containerBottom >= containerHeight - 100) {
      messages.forEach((message) => {
        if (
          !(message.readBy.length != 0) &&
          message.senderId !== currentUserId
        ) {
          socket?.emit("message_read", {
            chatId: message.chatId,
            messageId: message.id,
          });
        }
      });
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col h-full">
        <div className="bg-white dark:bg-gray-800 dark:text-white  p-4 border-b flex items-center">
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
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 scrollbar-hide"
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
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-[6px] ${
                    message.senderId === currentUserId
                      ? "bg-green-500 text-white dark:bg-[#005c4b] dark:text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  <p>{message.content}</p>
                  <div className="flex items-center justify-between ">
                    <p
                      className={`text-[0.6rem] flex items-center gap-1 mt-1 ${
                        message.senderId === currentUserId
                          ? "text-white dark:text-gray-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                      {message.readBy.length != 0 &&
                        message.senderId === currentUserId && (
                          <BiCheckDouble className="text-sm dark:text-blue-400" />
                        )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="dark:text-white">No messages yet.</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 flex items-center">
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
      </div>
    </>
  );
}
