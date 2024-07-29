import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ProfileSection from "./ProfileSection";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Socket } from "socket.io-client";
import apiClient from "@/api/apiClient";

interface Chat {
  userId: string;
  chatId: string;
  lastMessage: string;
  updatedAt: string;
  username: string;
  image: string;
}

interface ChatRoomProps {
  socket: Socket | null;
  sendMessage: (chatId: string, content: string) => void;
  joinChatRoom: (chatId: string) => void;
  token: string | null;
}

export default function ChatRoom({
  socket,
  sendMessage,
  joinChatRoom,
  token,
}: ChatRoomProps) {
  const { isDarkMode } = useDarkMode();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userChats, setUserChats] = useState<Chat[]>([]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    joinChatRoom(chatId);
    setIsSidebarVisible(false);
  };

  const fetchUserChats = async () => {
    try {
      const response = await apiClient.get("/chat/user/chats");
      const { data } = await response;
      console.log("data : ", data);
      setUserChats(data);
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };

  useEffect(() => {
    fetchUserChats();
  }, []);

  return (
    <div
      className={`flex h-screen max-h-[91.8vh] ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Sidebar
        socket={socket}
        isDarkMode={isDarkMode}
        onChatSelect={handleChatSelect}
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        userChats={userChats}
        setUserChats={setUserChats}
      />
      <div className="flex-1 flex flex-col">
        <ChatWindow
          selectedChatId={selectedChatId}
          socket={socket}
          sendMessage={sendMessage}
          joinChatRoom={joinChatRoom}
          token={token}
          onOpenSidebar={() => setIsSidebarVisible(true)}
          userChats={userChats}
        />
      </div>
      {/* <ProfileSection isDarkMode={isDarkMode} /> */}
    </div>
  );
}
