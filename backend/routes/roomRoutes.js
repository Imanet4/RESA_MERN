const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  uploadImage
} = require('../controllers/roomController');

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, authorize('admin'), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(protect, authorize('admin'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

router.route('/:id/photo')
  .put(uploadImage);

module.exports = router;