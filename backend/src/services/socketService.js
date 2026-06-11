const onlineUsers = new Map();

function setUserOnline(userId, socketId) {
  onlineUsers.set(userId.toString(), socketId);
}

function setUserOffline(userId) {
  onlineUsers.delete(userId.toString());
}

function getSocketId(userId) {
  return onlineUsers.get(userId.toString());
}

function getOnlineUserIds() {
  return Array.from(onlineUsers.keys());
}

function emitToUser(io, userId, eventName, payload) {
  const socketId = getSocketId(userId);
  if (socketId) {
    io.to(socketId).emit(eventName, payload);
  }
}

module.exports = {
  setUserOnline,
  setUserOffline,
  getSocketId,
  getOnlineUserIds,
  emitToUser,
};
