"use client";
import ChatRoom from "./ChatRoom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function ChatPage() {
  const socket = useSelector((state: RootState) => state.socket.socket);
  const token = useSelector((state: RootState) => state.auth.token);

  const sendMessage = (chatId: string, content: string) => {
    if (socket) {
      console.log(`Emitting send_message event: ${chatId}, ${content}`);
      socket.emit("send_message", { chatId, content });
    } else {
      console.error("Socket is not connected");
    }
  };

  const joinChatRoom = (chatId: string) => {
    if (socket) {
      console.log(`Joining chat room: ${chatId}`);
      socket.emit("join_room", chatId); 
    } else {
      console.error("Socket is not connected");
    }
  };

  return (
    <ChatRoom
      socket={socket}
      sendMessage={sendMessage}
      joinChatRoom={joinChatRoom}
      token={token}
    />
  );
}