import { io } from 'socket.io-client';

export function createChatSocket(token) {
  return io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    autoConnect: false,
    transports: ['websocket'],
    auth: { token },
  });
}
