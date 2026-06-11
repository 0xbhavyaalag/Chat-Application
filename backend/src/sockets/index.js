const { Server } = require('socket.io');
const { registerChatSocket } = require('./chatSocket');

function initializeSocket(server) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const io = new Server(server, {
    cors: {
      origin: clientUrl,
      credentials: true,
    },
  });

  registerChatSocket(io);
  return io;
}

module.exports = { initializeSocket };
