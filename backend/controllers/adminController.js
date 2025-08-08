const Booking = require('../models/Booking');
const Room = require('../models/Room');

//  Get all bookings GET /api/admin/bookings / access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'name price');
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};


// getAllRooms

exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().select('-__v'); // Exclude version key
    
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (err) {
    next(err);
  }
};

//  Create new room - POST /api/admin/rooms - Private/Admin

exports.createRoom = async (req, res) => {
  try {
    const { name, description, price, capacity, amenities } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    const room = await Room.create({
      name,
      description,
      price: Number(price),
      capacity: Number(capacity),
      amenities: amenities.split(',').map(item => item.trim()),
      images: req.files.map(file => `/uploads/${file.filename}`)
    });

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};