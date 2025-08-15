import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import API from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faHotel, faReceipt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/common/ConfirmationModal';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      console.log('Fetching bookings...');
      try {
        const res = await API.get('/bookings/mybookings');
        console.log('Bookings data:', res.data);
        setBookings(res.data.data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.message || 'Failed to fetch bookings');
        toast.error(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = (id) => {
    setCancelBookingId(id);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      await API.delete(`/bookings/${cancelBookingId}`);
      setBookings(bookings.filter(booking => booking._id !== cancelBookingId));
      toast.success('Booking cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setShowCancelModal(false);
    setCancelBookingId(null);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="success">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="page-header mb-5">
        <FontAwesomeIcon icon={faCalendarAlt} className="me-3" />
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <h4 className="mb-4">You don't have any bookings yet</h4>
            <Button variant="custom" onClick={() => navigate('/rooms')}>
              Browse Rooms
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <Card key={booking._id} className="mb-4 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h4>
                      <FontAwesomeIcon icon={faHotel} className="me-2 text-dark-green" />
                      {booking.room?.name || 'Unknown Room'}
                    </h4>
                    <Badge bg={booking.status === 'confirmed' ? 'success' : 'secondary'}>
                      {booking.status}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={booking.status !== 'confirmed'}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                    Cancel
                  </Button>
                </div>

                <div className="d-flex flex-wrap gap-4 mb-3">
                  <div>
                    <small className="text-muted">Check-in</small>
                    <p className="mb-0 fw-bold">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <small className="text-muted">Check-out</small>
                    <p className="mb-0 fw-bold">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <small className="text-muted">Total</small>
                    <p className="mb-0 fw-bold text-success">
                      <FontAwesomeIcon icon={faReceipt} className="me-1" />
                      ${booking.totalPrice?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <Button 
                    variant="outline-dark-green" 
                    size="sm"
                    onClick={() => navigate(`/rooms/${booking.room?._id}`)}
                  >
                    View Room Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <ConfirmationModal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        title="Cancel Booking Confirmation"
        message="This will cancel your reservation. Any payments made may be subject to cancellation fees."
        confirmText="Confirm Cancellation"
        variant="danger"
      />
    </Container>
  );
};

export default MyBookings;