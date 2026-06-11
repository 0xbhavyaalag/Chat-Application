const asyncHandler = require('../utils/asyncHandler');
const { createPrivateMessage, createRoomMessage, getConversation, getRoomMessages, markMessageStatus } = require('../services/messageService');

const getPrivateConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 30);

  const conversation = await getConversation({
    userId: req.user._id,
    otherUserId: userId,
    page,
    limit,
  });

  res.json(conversation);
});

const getMessagesForRoom = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 30);

  const messages = await getRoomMessages({
    roomId: req.params.roomId,
    page,
    limit,
  });

  res.json(messages);
});

const createMessage = asyncHandler(async (req, res) => {
  const { receiver, roomId, content } = req.body;
  const message = roomId
    ? await createRoomMessage({ sender: req.user._id, roomId, content })
    : await createPrivateMessage({ sender: req.user._id, receiver, content });

  res.status(201).json({ message });
});

const updateMessageStatus = asyncHandler(async (req, res) => {
  const message = await markMessageStatus(req.params.id, req.body.status, req.user._id);
  res.json({ message });
});

module.exports = {
  getPrivateConversation,
  getMessagesForRoom,
  createMessage,
  updateMessageStatus,
};
