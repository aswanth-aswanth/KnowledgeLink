import { useState, useEffect, useRef, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/hooks/useDarkMode";
import { deleteMessage, fetchChatMessages } from "@/api/chatWindow";
import { Message, EncapsulatedMessage, Chat, ChatWindowProps } from "@/types/chatwindow";

export const useChatWindow = ({
  selectedChatId,
  socket,
  sendMessage,
  joinChatRoom,
  token,
  userChats,
}: ChatWindowProps) => {
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
          const response = await fetchChatMessages(selectedChatId);
          setMessages(response);
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
      if (selectedChatId) await deleteMessage(selectedChatId, messageId);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    selectedUser,
    isDarkMode,
    chatContainerRef,
    messagesEndRef,
    hoveredMessageId,
    setHoveredMessageId,
    handleSend,
    handleScroll,
    handleDeleteMessage,
    openProfile,
    currentUserId,
    formatTime,
  };
};