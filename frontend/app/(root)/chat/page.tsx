"use client";
import { useEffect } from "react";
import { store } from "@/store";
import ChatRoom from "./ChatRoom";
import io from "socket.io-client";

export default function ChatPage() {
  const state = store.getState();
  const token = state.auth.token;
  useEffect(() => {
    const socket = io(
      `${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}||http://localhost:5005`,
      {
        auth: { token: `Bearer ${token}` },
      }
    );

    socket.on("connect", () => {
      console.log("Connected to chat server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return <ChatRoom />;
}
