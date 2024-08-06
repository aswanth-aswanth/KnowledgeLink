import { Socket } from "socket.io-client";

export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: string;
    readBy: string[];
    isOwn?: boolean;
}

export interface EncapsulatedMessage {
    [key: string]: Message;
}

export interface Chat {
    userId: string;
    chatId: string;
    lastMessage: string;
    updatedAt: string;
    username: string;
    image: string;
}

export interface ChatWindowProps {
    selectedChatId: string | null;
    socket: Socket | null;
    sendMessage: (chatId: string, content: string) => void;
    joinChatRoom: (chatId: string) => void;
    token: string;
    onOpenSidebar?: () => void;
    userChats: Chat[];
}

export interface ChatHeaderProps {
    selectedUser: Chat | null;
    onOpenSidebar?: () => void;
    openProfile: () => void;
}

export interface MessageListProps {
    messages: Message[];
    currentUserId: string | null;
    hoveredMessageId: string | null;
    setHoveredMessageId: (id: string | null) => void;
    handleDeleteMessage: (messageId: string) => void;
    formatTime: (timestamp: string) => string;
    isDarkMode: boolean;
    chatContainerRef: React.RefObject<HTMLDivElement>;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    handleScroll: () => void;
}

export interface MessageInputProps {
    newMessage: string;
    setNewMessage: (message: string) => void;
    handleSend: () => void;
}