const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { signToken } = require('../utils/token');

function buildUserPayload(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    isOnline: user.isOnline,
    lastSeen: user.lastSeen,
    createdAt: user.createdAt,
  };
}

async function registerUser({ username, email, password, avatar }) {
  const existing = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existing) {
    throw new ApiError(409, 'Username or email already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
    avatar,
  });

  const token = signToken({ id: user._id });

  return {
    token,
    user: buildUserPayload(user),
  };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid credentials');
  }

  user.isOnline = true;
  user.lastSeen = new Date();
  await user.save();

  const token = signToken({ id: user._id });

  return {
    token,
    user: buildUserPayload(user),
  };
}

async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return buildUserPayload(user);
}

module.exports = {
  buildUserPayload,
  registerUser,
  loginUser,
  getCurrentUser,
};
