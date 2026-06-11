import { useEffect, useRef, useState } from 'react';
import { createChatSocket } from '../sockets/client';

export function useChatSocket(token, handlers = {}) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      setConnected(false);
      return undefined;
    }

    const socket = createChatSocket(token);
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    socket.connect();

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return {
    socketRef,
    connected,
  };
}
