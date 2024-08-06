import { useState, useCallback } from "react";
import { Chat } from "@/types/chat";
import { fetchUserChat } from "@/api/chat/fetchUserChats";

export default function useChat() {
    const [userChats, setUserChats] = useState<Chat[]>([]);

    const fetchUserChats = useCallback(async () => {
        try {
            const chat = await fetchUserChat();
            console.log("data : ", chat);
            setUserChats(chat);
        } catch (error) {
            console.error("Error fetching user chats:", error);
        }
    }, []);

    return { userChats, setUserChats, fetchUserChats };
}