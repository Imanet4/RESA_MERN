const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { protect } = require('../middleware/auth');


//Get all RESA

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('room user');
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

//Get a RESA

const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room user');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user is booking owner or admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

//Get all MY bookings

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('room');
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// Create a RESA

const createBooking = async (req, res, next) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    // Validate dates
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Get room price
    const roomDetails = await Room.findById(room);
    if (!roomDetails) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Calculate total price
    const days = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    const totalPrice = days * roomDetails.price;

    // Check if room is available for the dates
    const existingBookings = await Booking.find({
      room,
      $or: [
        { checkInDate: { $lt: new Date(checkOutDate) }, checkOutDate: { $gt: new Date(checkInDate) } }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Room is already booked for the selected dates'
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      room,
      checkInDate,
      checkOutDate,
      totalPrice
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

//Update a RESA 

const updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // If updating dates, recalculate price
    if (req.body.checkInDate || req.body.checkOutDate) {
      const checkInDate = req.body.checkInDate || booking.checkInDate;
      const checkOutDate = req.body.checkOutDate || booking.checkOutDate;

      if (new Date(checkOutDate) <= new Date(checkInDate)) {
        return res.status(400).json({
          success: false,
          message: 'Check-out date must be after check-in date'
        });
      }

      const roomDetails = await Room.findById(booking.room);
      const days = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
      req.body.totalPrice = days * roomDetails.price;
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('room user');

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

//DELETE A RESA

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this booking'
      });
    }

    await booking.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
    getBookings,
    getBooking,
    getMyBookings,
    createBooking,
    updateBooking,
    deleteBooking
};