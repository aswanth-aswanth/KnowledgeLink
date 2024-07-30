import React, { useState, useEffect, useRef, useCallback } from "react";
import apiClient from "@/api/apiClient";
import { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { CloudLightning, Menu, User, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { MdCheck, MdReply } from "react-icons/md";
import { BiCheckDouble } from "react-icons/bi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDarkMode } from "@/hooks/useDarkMode";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readBy: string[];
  isOwn?: boolean;
}

interface EncapsulatedMessage {
  [key: string]: Message;
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
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const { isDarkMode } = useDarkMode();

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
      const newMessageHandler = (encapsulatedMessage: EncapsulatedMessage) => {
        Object.keys(encapsulatedMessage).forEach((key) => {
          const message = encapsulatedMessage[key];
          if (message.isOwn) {
            if (message.chatId === selectedChatId) {
              setMessages((prevMessages) => [...prevMessages, message]);
            }
          }
        });
      };

      const messageReadHandler = ({
        chatId,
        messageId,
        readBy,
      }: {
        chatId: string;
        messageId: string;
        readBy: string[];
      }) => {
        if (chatId === selectedChatId) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId ? { ...msg, readBy: [...readBy] } : msg
            )
          );
        }
      };

      const messageDeletedHandler = ({
        chatId,
        messageId,
      }: {
        chatId: string;
        messageId: string;
      }) => {
        if (chatId === selectedChatId) {
          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId)
          );
        }
      };

      socket.on("new_message", newMessageHandler);
      socket.on("message_read", messageReadHandler);
      socket.on("delete_message", messageDeletedHandler);

      return () => {
        socket.off("new_message", newMessageHandler);
        socket.off("message_read", messageReadHandler);
        socket.off("delete_message", messageDeletedHandler);
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
        if (message.readBy.length === 0 && message.senderId !== currentUserId) {
          socket?.emit("message_read", {
            chatId: message.chatId,
            messageId: message.id,
          });
        }
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await apiClient.delete(`/chat/${selectedChatId}/message/${messageId}`);
      // The message will be removed from the state when the 'delete_message' event is received
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col h-full">
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 border-b flex items-center">
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
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div
                  className={`max-w-xs mr-2 lg:max-w-md px-4 py-2 rounded-[6px] relative ${
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
                      {message.readBy.length > 0 &&
                        message.senderId === currentUserId && (
                          <BiCheckDouble className="text-sm dark:text-blue-400" />
                        )}
                    </p>
                  </div>
                  {hoveredMessageId === message.id &&
                    message.senderId === currentUserId && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute -right-8 top-0 ${
                              isDarkMode ? "text-red-400" : "text-red-500"
                            }`}
                          >
                            <Trash2
                              className={`h-4 w-4 ${
                                isDarkMode ? "text-red-400" : "text-red-500"
                              }`}
                            />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          className={`${
                            isDarkMode ? "bg-gray-700 text-white" : "bg-white"
                          }`}
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle
                              className={`${isDarkMode ? "text-white" : ""}`}
                            >
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription
                              className={`${isDarkMode ? "text-gray-300" : ""}`}
                            >
                              This action cannot be undone. This will
                              permanently delete the message.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              className={`${
                                isDarkMode
                                  ? "bg-gray-700 text-white hover:bg-gray-600"
                                  : ""
                              }`}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMessage(message.id)}
                              className={`${
                                isDarkMode
                                  ? "bg-red-600 text-white hover:bg-red-700"
                                  : ""
                              }`}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
