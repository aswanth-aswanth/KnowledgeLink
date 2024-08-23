import { useEffect } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

export function useNotifications(url: string, userEmail: string | null) {
  const token = localStorage.getItem('token');
  useEffect(() => {
    const socket = io(url, {
      auth: { token },
      path: '/notification/socket.io',
      withCredentials: true,
    });

    if (userEmail) {
      socket.emit('register', userEmail);
    }

    socket.on('notification', (notification: { type: string; message: string; postId: string }) => {
      console.count("toast notified2");
      toast(notification.message, {
        icon: '👏',
        duration: 6000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [url, userEmail]);
}