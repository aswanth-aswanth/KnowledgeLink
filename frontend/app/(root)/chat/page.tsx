'use client';
import ChatRoom from '@/components/chat/ChatRoom';
import useSocket from '@/hooks/useSocket';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export default function ChatPage() {
  const token = localStorage.getItem('token') || '';
  const { socket, sendMessage, joinChatRoom } = useSocket();
  useEffect(() => {
    const newSocket = io('https://backend.aswanth.online/chat', {
      path: '/socket.io',
      transports: ['websocket'],
      auth: { token },
      secure: true,
      withCredentials: true,
    });
    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    return () => {
    };
  }, []);

  return (
    <ChatRoom
      socket={socket}
      sendMessage={sendMessage}
      joinChatRoom={joinChatRoom}
      token={token}
    />
  );
}
