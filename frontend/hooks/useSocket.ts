import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCallback } from "react";

export default function useSocket() {
    const socket = useSelector((state: RootState) => state.socket.socket);

    const sendMessage = useCallback((chatId: string, content: string) => {
        if (socket) {
            console.log(`Emitting send_message event: ${chatId}, ${content}`);
            socket.emit("send_message", { chatId, content });
        } else {
            console.error("Socket is not connected");
        }
    }, [socket]);

    const joinChatRoom = useCallback((chatId: string) => {
        if (socket) {
            console.log(`Joining chat room: ${chatId}`);
            socket.emit("join_room", chatId);
        } else {
            console.error("Socket is not connected");
        }
    }, [socket]);

    return { socket, sendMessage, joinChatRoom };
}