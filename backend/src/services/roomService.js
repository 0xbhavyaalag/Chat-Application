const Room = require('../models/Room');
const ApiError = require('../utils/apiError');

async function listRooms() {
  return Room.find().populate('createdBy', 'username avatar').populate('members', 'username avatar isOnline lastSeen');
}

async function createRoom({ roomName, createdBy, members = [] }) {
  const room = await Room.create({
    roomName,
    createdBy,
    members: Array.from(new Set([createdBy.toString(), ...members.map(String)])),
  });

  return room.populate('createdBy', 'username avatar').populate('members', 'username avatar isOnline lastSeen');
}

async function joinRoom(roomId, userId) {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  if (!room.members.some((memberId) => memberId.toString() === userId.toString())) {
    room.members.push(userId);
    await room.save();
  }

  return room.populate('createdBy', 'username avatar').populate('members', 'username avatar isOnline lastSeen');
}

async function leaveRoom(roomId, userId) {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  room.members = room.members.filter((memberId) => memberId.toString() !== userId.toString());
  await room.save();

  return room.populate('createdBy', 'username avatar').populate('members', 'username avatar isOnline lastSeen');
}

async function getRoomById(roomId) {
  const room = await Room.findById(roomId).populate('createdBy', 'username avatar').populate('members', 'username avatar isOnline lastSeen');
  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  return room;
}

module.exports = { listRooms, createRoom, joinRoom, leaveRoom, getRoomById };
