const Message = require('../models/Message');
const ApiError = require('../utils/apiError');

function buildMessagePayload(message) {
  return {
    id: message._id,
    sender: message.sender,
    receiver: message.receiver,
    roomId: message.roomId,
    content: message.content,
    status: message.status,
    seenBy: message.seenBy,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

async function createPrivateMessage({ sender, receiver, content, status = 'sent' }) {
  const message = await Message.create({ sender, receiver, content, status });
  return message.populate('sender receiver', 'username avatar isOnline lastSeen');
}

async function createRoomMessage({ sender, roomId, content, status = 'sent' }) {
  const message = await Message.create({ sender, roomId, content, status });
  return message.populate('sender roomId', 'username avatar roomName');
}

async function getConversation({ userId, otherUserId, page = 1, limit = 30 }) {
  const skip = (page - 1) * limit;
  const query = {
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  };

  const [items, total] = await Promise.all([
    Message.find(query)
      .populate('sender receiver', 'username avatar isOnline lastSeen')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments(query),
  ]);

  return {
    items: items.reverse().map(buildMessagePayload),
    total,
    page,
    limit,
  };
}

async function getRoomMessages({ roomId, page = 1, limit = 30 }) {
  const skip = (page - 1) * limit;
  const query = { roomId };

  const [items, total] = await Promise.all([
    Message.find(query)
      .populate('sender roomId', 'username avatar roomName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments(query),
  ]);

  return {
    items: items.reverse().map(buildMessagePayload),
    total,
    page,
    limit,
  };
}

async function markMessageStatus(messageId, status, seenByUserId) {
  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  message.status = status;
  if (seenByUserId && !message.seenBy.some((memberId) => memberId.toString() === seenByUserId.toString())) {
    message.seenBy.push(seenByUserId);
  }
  await message.save();

  return message.populate('sender receiver roomId', 'username avatar isOnline lastSeen roomName');
}

module.exports = {
  buildMessagePayload,
  createPrivateMessage,
  createRoomMessage,
  getConversation,
  getRoomMessages,
  markMessageStatus,
};
