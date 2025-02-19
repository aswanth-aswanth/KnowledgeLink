import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { ChatRoomProps } from '@/types/chat';
import useChat from '@/hooks/useChat';

export default function ChatRoom({
  socket,
  sendMessage,
  joinChatRoom,
  token,
}: ChatRoomProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { userChats, setUserChats, fetchUserChats } = useChat();

  useEffect(() => {
    fetchUserChats();
  }, [fetchUserChats]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    joinChatRoom(chatId);
    setIsSidebarVisible(false);
  };

  return (
    <div className="flex h-screen md:h-[90.9vh] bg-gray-100 dark:bg-gray-900">
      <Sidebar
        socket={socket}
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
          token={token ?? ''}
          onOpenSidebar={() => setIsSidebarVisible(true)}
          userChats={userChats}
        />
      </div>
    </div>
  );
}
