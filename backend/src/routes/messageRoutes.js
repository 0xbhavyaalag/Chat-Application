const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { messageSchema } = require('../utils/validators');
const { getPrivateConversation, getMessagesForRoom, createMessage, updateMessageStatus } = require('../controllers/messageController');

const router = express.Router();

router.get('/private/:userId', protect, getPrivateConversation);
router.get('/room/:roomId', protect, getMessagesForRoom);
router.post('/', protect, validate(messageSchema), createMessage);
router.patch('/:id/status', protect, updateMessageStatus);

module.exports = router;
