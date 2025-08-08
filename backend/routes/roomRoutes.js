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
const upload = require('../utils/multer'); // Multer config for file uploads

const router = express.Router();

//Public routes - can be accessed without authentication
router.route('/')
  .get(getRooms) //getting all rooms
  .post(
    protect, authorize('admin'), 
    upload.array('images', 5), // Accepts up to 5 pictures
    createRoom
  ); //creating a room (admin Only)


router.route('/:id')
  .get(getRoom) //Getting single room
  .put(protect, authorize('admin'), updateRoom) // update room details (admin ONLY)
  .delete(protect, authorize('admin'), deleteRoom); // Delete room (admin Only)

router.route('/:id/photo')
  .put(protect, authorize('admin'), upload.array('images', 5) ,uploadImage);


module.exports = router;