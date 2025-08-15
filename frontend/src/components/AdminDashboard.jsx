import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingsTable from './admin/BookingsTable';
import RoomsTable from './admin/RoomsTable';
import RoomModal from './admin/RoomModal';
import '../styles/modal.css';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);

  // Add body class when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showModal]);
 
  // Fetching all Bookings
  const fetchAllBookings = useCallback(async () => {
    try {
      const { data } = await axios.get('/admin/bookings');
      setBookings(data.data);
    } catch (error) {
      if (error.response?.status === 403) {
        navigate('/login');
      }
      console.error('Error:', error);
      toast.error('Failed to fetch bookings');
    }
  }, [navigate]);

  // Fetching all rooms
  const fetchAllRooms = useCallback(async () => {
    try {
      const { data } = await axios.get('/rooms');
      setRooms(data.data || data.rooms || data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast.error('Failed to fetch rooms');
      setRooms([]);
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
    fetchAllRooms();
  }, [fetchAllBookings, fetchAllRooms]);

  // Simplified delete handler - just does the API call and state update
  const handleDeleteRoom = async (roomId) => {
    try {
      await axios.delete(`/rooms/${roomId}`);
      setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
      return true; // Indicate success to RoomsTable
    } catch (error) {
      console.error('Failed to delete room:', error);
      throw error; // Will be caught by RoomsTable
    }
  };

  // Handle adding a new room
  const handleAddRoom = async (roomData, images) => {
    try {
      const formData = new FormData();
      formData.append('name', roomData.name);
      formData.append('description', roomData.description);
      formData.append('price', roomData.price);
      formData.append('capacity', roomData.capacity);
      formData.append('amenities', roomData.amenities);
      
      if (images) {
        Array.from(images).forEach(image => {
          formData.append('images', image);
        });
      }

      await axios.post('/admin/rooms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Room added successfully');
      setShowModal(false);
      fetchAllRooms();
    } catch (error) {
      console.error('Failed to add room:', error);
      toast.error(error.response?.data?.message || 'Failed to add room');
      throw error;
    }
  };

  // Handle updating a room
  const handleUpdateRoom = async (roomData, images) => {
    try {
      const formData = new FormData();
      formData.append('name', roomData.name);
      formData.append('description', roomData.description);
      formData.append('price', roomData.price);
      formData.append('capacity', roomData.capacity);
      formData.append('amenities', roomData.amenities);
      
      if (images && images.length > 0) {
        Array.from(images).forEach(image => {
          formData.append('images', image);
        });
      }

      const { data } = await axios.put(`/rooms/${editingRoom._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setRooms(rooms.map(room =>
        room._id === editingRoom._id ? data : room
      ));
      
      toast.success('Room updated successfully');
      setShowModal(false);
      fetchAllRooms();
    } catch (error) {
      console.error('Failed to update room:', error);
      toast.error(error.response?.data?.message || 'Failed to update room');
      throw error;
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <button 
        className="btn btn-primary mb-4" 
        onClick={() => {
          setEditingRoom(null);
          setShowModal(true);
        }}
      >
        Add New Room
      </button>

      <BookingsTable bookings={bookings} />
      
      <RoomsTable 
        rooms={rooms} 
        onEdit={(room) => {
          setEditingRoom(room);
          setShowModal(true);
        }} 
        onDelete={handleDeleteRoom}
      />

      <RoomModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        initialData={editingRoom || {
          name: '',
          description: '',
          price: 0,
          capacity: 1,
          amenities: '',
          images: null
        }}
        onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom}
        isEditing={!!editingRoom}
      />
    </div>
  );
};

export default AdminDashboard;