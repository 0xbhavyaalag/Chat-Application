const asyncHandler = require('../utils/asyncHandler');
const { createRoom, listRooms, joinRoom, leaveRoom, getRoomById } = require('../services/roomService');

const getAllRooms = asyncHandler(async (_req, res) => {
  const rooms = await listRooms();
  res.json({ rooms });
});

const createNewRoom = asyncHandler(async (req, res) => {
  const room = await createRoom({
    roomName: req.body.roomName,
    createdBy: req.user._id,
    members: req.body.members || [],
  });
  res.status(201).json({ room });
});

const joinExistingRoom = asyncHandler(async (req, res) => {
  const room = await joinRoom(req.params.id, req.user._id);
  res.json({ room });
});

const leaveExistingRoom = asyncHandler(async (req, res) => {
  const room = await leaveRoom(req.params.id, req.user._id);
  res.json({ room });
});

const getRoom = asyncHandler(async (req, res) => {
  const room = await getRoomById(req.params.id);
  res.json({ room });
});

module.exports = { getAllRooms, createNewRoom, joinExistingRoom, leaveExistingRoom, getRoom };
