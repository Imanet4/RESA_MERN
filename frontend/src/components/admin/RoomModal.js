import React, { useState, useEffect } from 'react';


const RoomModal = ({ 
  show, 
  onClose, 
  initialData, 
  onSubmit, 
  isEditing 
}) => {
  const [roomData, setRoomData] = useState({
    name: '',
    description: '',
    price: 0,
    capacity: 1,
    amenities: '',
    images: null,
    ...initialData
  });

  const [error, setError] = useState('');
  
  // Reset form when initialData changes
  useEffect(() => {
    setRoomData({
      name: '',
      description: '',
      price: 0,
      capacity: 1,
      amenities: '',
      images: null,
      ...initialData
    });
    setError('');
  }, [initialData]);

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

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(roomData, roomData.images || []);
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to save room');
    }
  };

  if (!show) return null;

return (
  <>
    {/* Backdrop */}
    <div 
      className="modal-backdrop fade show" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1040
      }}
    ></div>
    
    {/* Modal */}
    <div 
      className="modal fade show" 
      style={{ 
        display: 'block',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1050
      }}
      tabIndex="-1"
    >
      <div 
        className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">
              {isEditing ? 'Edit Room' : 'Add New Room'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Room Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={roomData.name || ''}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={roomData.description || ''}
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
                  value={roomData.price || 0}
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
                  value={roomData.capacity || 1}
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
                  value={Array.isArray(roomData.amenities) ? roomData.amenities.join(',') : (roomData.amenities || '')}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setRoomData({...roomData, images: e.target.files})}
                  className="form-control"
                  accept="image/*"
                />
              </div>
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
    </div>
  </>
);
}
export default RoomModal;