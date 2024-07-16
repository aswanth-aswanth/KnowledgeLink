"use client";
import { useEffect } from "react";
import { store } from "@/store";
import ChatRoom from "./ChatRoom";
import io from "socket.io-client";
import { useSocket } from "@/hooks/useSocket";

export default function ChatPage() {
  const token = localStorage.getItem("token") || "my token"; // Get this from your authentication system
  const socket = useSocket(token);
  return <ChatRoom />;
}
