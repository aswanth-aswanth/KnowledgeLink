"use client";
import ChatRoom from "./ChatRoom";
import { useSocket } from "@/hooks/useSocket";

export default function ChatPage() {
  const token = localStorage.getItem("token") || "";
  const { socket, sendMessage, joinChatRoom } = useSocket(token);

  return (
    <ChatRoom
      socket={socket}
      sendMessage={sendMessage}
      joinChatRoom={joinChatRoom}
      token={token}
    />
  );
}
