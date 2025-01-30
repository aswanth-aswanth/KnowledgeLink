'use client';
import ChatRoom from '@/components/chat/ChatRoom';
import useSocket from '@/hooks/useSocket';
import { getFromLocalStorage } from '@/lib/utils';

export default function ChatPage() {
  const token = getFromLocalStorage('token') || '';
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
