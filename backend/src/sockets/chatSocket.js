const { verifyToken } = require('../utils/token');
const User = require('../models/User');
const { createPrivateMessage, createRoomMessage, buildMessagePayload } = require('../services/messageService');
const { setUserOnline, setUserOffline, emitToUser } = require('../services/socketService');

function registerChatSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on('connection', async (socket) => {
    const currentUser = socket.user;
    setUserOnline(currentUser._id, socket.id);
    await User.findByIdAndUpdate(currentUser._id, { isOnline: true, lastSeen: new Date() });

    socket.broadcast.emit('user_online', {
      userId: currentUser._id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      isOnline: true,
    });

    socket.on('join_room', async ({ roomId }) => {
      socket.join(roomId);
      socket.emit('room_joined', { roomId, userId: currentUser._id });
    });

    socket.on('leave_room', async ({ roomId }) => {
      socket.leave(roomId);
      socket.emit('room_left', { roomId, userId: currentUser._id });
    });

    socket.on('typing', ({ receiverId, roomId }) => {
      const payload = {
        userId: currentUser._id,
        username: currentUser.username,
        roomId: roomId || null,
      };

      if (roomId) {
        socket.to(roomId).emit('user_typing', payload);
        return;
      }

      if (receiverId) {
        emitToUser(io, receiverId, 'user_typing', payload);
      }
    });

    socket.on('stop_typing', ({ receiverId, roomId }) => {
      const payload = {
        userId: currentUser._id,
        username: currentUser.username,
        roomId: roomId || null,
      };

      if (roomId) {
        socket.to(roomId).emit('user_stopped_typing', payload);
        return;
      }

      if (receiverId) {
        emitToUser(io, receiverId, 'user_stopped_typing', payload);
      }
    });

    socket.on('send_message', async (data, ack) => {
      try {
        const { receiverId, roomId, content } = data;
        const message = roomId
          ? await createRoomMessage({ sender: currentUser._id, roomId, content })
          : await createPrivateMessage({ sender: currentUser._id, receiver: receiverId, content });

        const populatedMessage = buildMessagePayload(message);

        if (roomId) {
          io.to(roomId).emit('receive_message', populatedMessage);
        } else if (receiverId) {
          emitToUser(io, receiverId, 'receive_message', populatedMessage);
          socket.emit('receive_message', populatedMessage);
        }

        if (ack) {
          ack({ success: true, message: populatedMessage });
        }
      } catch (error) {
        if (ack) {
          ack({ success: false, error: error.message });
        }
      }
    });

    socket.on('disconnect', async () => {
      setUserOffline(currentUser._id);
      await User.findByIdAndUpdate(currentUser._id, { isOnline: false, lastSeen: new Date() });

      socket.broadcast.emit('user_offline', {
        userId: currentUser._id,
        username: currentUser.username,
        avatar: currentUser.avatar,
        isOnline: false,
        lastSeen: new Date(),
      });
    });
  });
}

module.exports = { registerChatSocket };
