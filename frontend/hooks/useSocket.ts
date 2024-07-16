import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL || 'http://localhost:5005';

export function useSocket(token: string) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(CHAT_SERVER_URL, {
            auth: {
                token: token // This should be your JWT token
            },
            transports: ['websocket', 'polling'] // Specify transport methods
        });

        newSocket.on('connect', () => {
            console.log('Connected to chat server');
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    return socket;
}