import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ProfileSection from "./ProfileSection";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useSocket } from "@/hooks/useSocket";
import { Socket } from "socket.io-client";

interface ChatRoomProps {
  socket: Socket | null;
  sendMessage: (chatId: string, content: string) => void;
  joinChatRoom: (chatId: string) => void;
  token: string;
}

export default function ChatRoom({
  socket,
  sendMessage,
  joinChatRoom,
  token,
}: ChatRoomProps) {
  const { isDarkMode } = useDarkMode();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    joinChatRoom(chatId);
  };

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
      />
      <div className="flex-1 flex flex-col">
        <ChatWindow
          isDarkMode={isDarkMode}
          selectedChatId={selectedChatId}
          socket={socket}
          sendMessage={sendMessage}
          joinChatRoom={joinChatRoom}
          token={token}
        />
      </div>
      <ProfileSection isDarkMode={isDarkMode} />
    </div>
  );
}
