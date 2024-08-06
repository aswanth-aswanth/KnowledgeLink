import React from "react";
import { useChatWindow } from "@/hooks/useChatWindow";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { ChatWindowProps } from "@/types/chatwindow";

export default function ChatWindow({
  selectedChatId,
  socket,
  sendMessage,
  joinChatRoom,
  token,
  onOpenSidebar,
  userChats,
}: ChatWindowProps) {
  const {
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
  } = useChatWindow({
    selectedChatId,
    socket,
    sendMessage,
    joinChatRoom,
    token,
    userChats,
  });

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader
        selectedUser={selectedUser}
        onOpenSidebar={onOpenSidebar}
        openProfile={openProfile}
      />
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        hoveredMessageId={hoveredMessageId}
        setHoveredMessageId={setHoveredMessageId}
        handleDeleteMessage={handleDeleteMessage}
        formatTime={formatTime}
        isDarkMode={isDarkMode}
        chatContainerRef={chatContainerRef}
        messagesEndRef={messagesEndRef}
        handleScroll={handleScroll}
      />
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
      />
    </div>
  );
}
