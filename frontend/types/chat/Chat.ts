import { Socket } from "socket.io-client";

export interface Chat {
    userId: string;
    chatId: string;
    lastMessage: string;
    updatedAt: string;
    username: string;
    image: string;
}

export interface ChatRoomProps {
    socket: Socket | null;
    sendMessage: (chatId: string, content: string) => void;
    joinChatRoom: (chatId: string) => void;
    token: string | null;
}

interface User {
    id: string;
    name: string;
    avatar: string;
    status?: string;
}

export interface Message {
    chatId: string;
    content: string;
    sender: User;
    createdAt: string;
    isOwn: boolean;
}

export interface GroupChat {
    chatId: string;
    name: string;
    lastMessage: string;
    updatedAt: string;
}

export interface EncapsulatedMessage {
    [key: string]: Message;
}

export interface SidebarProps {
    isDarkMode: boolean;
    onChatSelect: (chatId: string) => void;
    socket: Socket | null;
    isVisible: boolean;
    onClose: () => void;
    userChats: Chat[];
    setUserChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export interface UserChatListProps {
    userChats: Chat[];
    isDarkMode: boolean;
    onChatSelect: (chatId: string) => void;
}

export interface GroupChatListProps {
    groupChats: GroupChat[];
    isDarkMode: boolean;
    onChatSelect: (chatId: string) => void;
}