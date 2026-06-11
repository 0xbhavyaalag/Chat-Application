const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { buildUserPayload } = require('./authService');

async function listUsers(currentUserId) {
  const users = await User.find({ _id: { $ne: currentUserId } }).sort({ createdAt: -1 });
  return users.map(buildUserPayload);
}

async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return buildUserPayload(user);
}

async function updateOnlineStatus(userId, isOnline) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isOnline = isOnline;
  user.lastSeen = isOnline ? new Date() : new Date();
  await user.save();

  return buildUserPayload(user);
}

module.exports = { listUsers, getUserById, updateOnlineStatus };
