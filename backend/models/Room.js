const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter room name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter price'],
    min: [0, 'Price cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Please enter capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  amenities: {
    type: [String],
    default: []
  },
  images: {
    type: [String], // Array of image paths
    required: [true, 'Please upload at least one image']
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);