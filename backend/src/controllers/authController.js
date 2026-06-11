const asyncHandler = require('../utils/asyncHandler');
const { registerUser, loginUser, getCurrentUser } = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
});

const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user._id);
  res.json({ user });
});

module.exports = { register, login, me };
