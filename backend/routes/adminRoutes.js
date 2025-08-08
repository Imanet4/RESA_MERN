const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllBookings,
  getAllRooms,
  createRoom
} = require('../controllers/adminController');
const upload = require('../utils/multer');

const router = express.Router();

// Apply protect and authorize('admin') to all admin routes
router.use(protect); //This checks if logged in
router.use(authorize('admin')); //then checks if you're an admin

// Admin routes
router.get('/bookings', getAllBookings);
router.get('/rooms', getAllRooms)
router.post('/rooms', upload.array('images', 5), createRoom);

module.exports = router;