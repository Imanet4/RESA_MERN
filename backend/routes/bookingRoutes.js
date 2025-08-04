const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getBookings,
  getBooking,
  getMyBookings,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getBookings)
  .post(createBooking);

router.route('/mybookings')
  .get(getMyBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;