import React from 'react';

const RoomsTable = ({ rooms, onEdit, onDelete }) => {
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
                    onClick={() => onDelete(room._id)}
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
    </>
  );
};

export default RoomsTable;