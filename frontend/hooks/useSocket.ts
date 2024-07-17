import { useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL || 'http://localhost:5005';

export function useSocket(token: string) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lastMessage, setLastMessage] = useState<any>(null);

    useEffect(() => {
        console.log("Initializing socket connection");
        const newSocket = io(CHAT_SERVER_URL, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Connected to chat server');
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Disconnected from chat server:', reason);
        });

        newSocket.on('new_message', (message) => {
            console.log('New message received in useSocket:', message);
            setLastMessage(message);
        });

        setSocket(newSocket);

        return () => {
            console.log("Disconnecting socket");
            newSocket.disconnect();
        };
    }, [token]);

    const sendMessage = useCallback((chatId: string, content: string) => {
        if (socket) {
            console.log(`Emitting send_message event: ${chatId}, ${content}`);
            socket.emit('send_message', { chatId, content });
        } else {
            console.error('Socket is not connected');
        }
    }, [socket]);

    const joinChatRoom = useCallback((chatId: string) => {
        if (socket) {
            console.log(`Joining chat room: ${chatId}`);
            socket.emit('join_room', chatId);
        } else {
            console.error('Socket is not connected');
        }
    }, [socket]);

    return { socket, lastMessage, sendMessage, joinChatRoom };
}