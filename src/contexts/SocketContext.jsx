import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !socketRef.current?.connected) {
      socketRef.current = io(API_BASE_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnectionDelay: 3000,
        reconnectionAttempts: 5
      });

      socketRef.current.on('connect', () => {
        console.log('🔌 Connecté au serveur WebSocket');
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Déconnecté :', reason);
        if (reason === 'io server disconnect') {
          socketRef.current.connect();
        }
      });
    }

    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);