import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmationModal from '../common/ConfirmationModal';

const RoomsTable = ({ rooms, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);

  const handleDeleteClick = (roomId) => {
    setDeleteRoomId(roomId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(deleteRoomId);
      toast.success('Room deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <h2 className="mb-3 mt-5">Manage Rooms</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-sm">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id}>
                <td>{room.name}</td>
                <td>${room.price}</td>
                <td>{room.capacity}</td>
                <td className="text-nowrap">
                  <button 
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => onEdit(room)}
                    title="Edit"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteClick(room._id)}
                    title="Delete"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Permanent Deletion"
        message="This will permanently delete the room and all related data. This action cannot be undone."
        confirmText="Delete Permanently"
        variant="danger"
        size="lg"
      />
    </>
  );
};

export default RoomsTable;