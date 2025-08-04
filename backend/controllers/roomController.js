const Room = require('../models/Room');
const upload = require('../utils/multer')
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middleware/auth');


//GET ALL ROOMS 

const getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (err) {
        next(err);
    }
};

//GET A ROOM

const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }
        res.status(200).json({
            success:true,
            data: room
        });
    } catch (err) {
        next(err)
    }
};

// Creating a Room

const createRoom = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const room = await Room.create(req.body);
        res.status(201).json({
            success: true,
            data: room
        });
    } catch (err) {
        next(err);
    }
};

//Updating a room

const updateRoom = async (req, res, next) => {
    try {
        let room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: room
        });

    } catch (err) {
        next(err);
    }
};


//DELETING A ROOM

const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        
        }

    // DELETE ASSOCIATED IMAGES:

        room.images.forEach(image => {
            const imagePath = path.join(__dirname, '../uploads', image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        });

        await room.remove();

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (err) {
        next(err);
    }
};

const uploadImage = [
  protect,
  authorize('admin'),
  upload.single('image'), // 'image' is the field name in the form
  async (req, res, next) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Room not found'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a file'
        });
      }

      // Add new image to room's images array
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        { $push: { images: req.file.filename } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        data: updatedRoom
      });
    } catch (err) {
      next(err);
    }
  }
];

module.exports = {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    uploadImage,

};