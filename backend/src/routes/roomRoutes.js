const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { roomSchema } = require('../utils/validators');
const { getAllRooms, createNewRoom, joinExistingRoom, leaveExistingRoom, getRoom } = require('../controllers/roomController');

const router = express.Router();

router.get('/', protect, getAllRooms);
router.post('/', protect, validate(roomSchema), createNewRoom);
router.get('/:id', protect, getRoom);
router.post('/:id/join', protect, joinExistingRoom);
router.post('/:id/leave', protect, leaveExistingRoom);

module.exports = router;
