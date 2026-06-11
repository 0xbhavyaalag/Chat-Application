const asyncHandler = require('../utils/asyncHandler');
const { listUsers, getUserById, updateOnlineStatus } = require('../services/userService');

const getUsers = asyncHandler(async (req, res) => {
  const users = await listUsers(req.user._id);
  res.json({ users });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json({ user });
});

const updatePresence = asyncHandler(async (req, res) => {
  const user = await updateOnlineStatus(req.user._id, Boolean(req.body.isOnline));
  res.json({ user });
});

module.exports = { getUsers, getUser, updatePresence };
