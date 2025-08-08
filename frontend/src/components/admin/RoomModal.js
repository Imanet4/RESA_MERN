import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const RoomModal = ({ 
  show, 
  onClose, 
  initialData, 
  onSubmit, 
  isEditing 
}) => {
  const [roomData, setRoomData] = useState(initialData);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData({
      ...roomData,
      [name]: name === 'amenities' ? value.split(',') : value
    });
  };

  const handleNumberChange = (name, value) => {
    setRoomData({
      ...roomData,
      [name]: Number(value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(roomData, images);
  };

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? 'Edit Room' : 'Add New Room'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Room Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={roomData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={roomData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  min="0"
                  value={roomData.price}
                  onChange={(e) => handleNumberChange('price', e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Capacity</label>
                <input
                  type="number"
                  className="form-control"
                  name="capacity"
                  min="1"
                  value={roomData.capacity}
                  onChange={(e) => handleNumberChange('capacity', e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Amenities (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  name="amenities"
                  value={roomData.amenities}
                  onChange={handleInputChange}
                />
              </div>
              <ImageUpload 
                onImageChange={(files, previews) => {
                  setImages(files);
                  setImagePreview(previews);
                }}
                previews={imagePreview}
                required={!isEditing}
              />
              <div className="d-flex justify-content-end mt-3">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2" 
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </div>
  );
};

export default RoomModal;