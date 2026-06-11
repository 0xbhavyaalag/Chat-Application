const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getUsers, getUser, updatePresence } = require('../controllers/userController');

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUser);
router.patch('/me/presence', protect, updatePresence);

module.exports = router;
