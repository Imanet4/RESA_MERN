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
    const { name, description, price, capacity, amenities } = req.body;
    
    // Handle image upload (for single image)
    const image = req.file ? req.files.map(file => `uploads/${file.filename}`) : [];


    const room = await Room.create({
      name,
      description,
      price: Number(price),
      capacity: Number(capacity),
      amenities: Array.isArray(amenities) ? amenities : amenities.split(',').map(item => item.trim()),
      images: image ? [image] : [], // Store as array for consistency
      user: req.user.id
    });

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
    //Handling file upload
        const updates = {
          ...req.body,
          //Only update images if they are provided
          ...(req.file && { images: [`/uploads/${req.file.filename}`] })
        };
        // If amenities is a string, convert it to an array
        if (updates.amenities && typeof updates.amenities === 'string') {
            updates.amenities = updates.amenities.split(',').map(item => item.trim());
        }

        //Converting numerical fields if needed
        if (updates.price) updates.price = Number(updates.price);
        if (updates.capacity) updates.capacity = Number(updates.capacity);

        // Update the room with the new data
        room = await Room.findByIdAndUpdate(req.params.id, updates, {
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
        // Delete the room from the database
        await room.deleteOne({ _id: req.params.id });

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