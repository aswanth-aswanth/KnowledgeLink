'use client';
import ChatRoom from '@/components/chat/ChatRoom';
import useSocket from '@/hooks/useSocket';

export default function ChatPage() {
  const token = localStorage.getItem('token') || '';
const { socket, sendMessage, joinChatRoom } = useSocket();

  return (
    <ChatRoom
      socket={socket}
      sendMessage={sendMessage}
      joinChatRoom={joinChatRoom}
      token={token}
    />
  );
}
