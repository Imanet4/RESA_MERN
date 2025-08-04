import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import API from '../utils/api';
//import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({ room, onClose }) => {
  //const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    if (dates.checkIn && dates.checkOut) {
      const days = Math.ceil(
        (new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24)
      );
      return days * room.price;
    }
    return 0;
  };

  const validateDates = () => {
    if (!dates.checkIn || !dates.checkOut) {
      return 'Please select both check-in and check-out dates';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (new Date(dates.checkIn) < today) {
      return 'Check-in date cannot be in the past';
    }
    
    if (new Date(dates.checkOut) <= new Date(dates.checkIn)) {
      return 'Check-out date must be after check-in date';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Current cookies:', document.cookie)
    setLoading(true);
    setError(null);

    const validationError = validateDates();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const res = await API.post('/bookings', {
        room: room._id,
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut,
        totalPrice: calculateTotal()
      });

      setSuccess({
        message: 'Booking confirmed!',
        booking: res.data.data
      });
    } catch (err) {
    // Enhanced error handling
    if (err.response?.status === 401) {
      setError('Your session has expired. Please login again.');
      // Optional: Redirect to login after delay
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(err.response?.data?.message || 'Booking failed. Please try different dates.');
    }
  } finally {
    setLoading(false);
  }
};

  const handleNewBooking = () => {
    onClose();
    navigate(`/rooms/${room._id}`);
  };

  return (
    <Modal show={true} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark-green text-white">
        <Modal.Title>
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          Book {room.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success ? (
          <div className="text-center py-4">
            <div className="mb-4">
              <FontAwesomeIcon icon={faCheck} size="4x" className="text-success mb-3" />
              <h3>{success.message}</h3>
              <p className="lead">Your booking reference: {success.booking._id}</p>
              <p className="text-muted">
                {new Date(success.booking.checkInDate).toLocaleDateString()} - {' '}
                {new Date(success.booking.checkOutDate).toLocaleDateString()}
              </p>
            </div>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="outline-secondary" onClick={onClose}>
                Close
              </Button>
              <Button variant="custom" onClick={handleNewBooking}>
                Book Another Room
              </Button>
            </div>
          </div>
        ) : (
          <>
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group controlId="checkInDate">
                    <Form.Label>Check-in Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dates.checkIn}
                      onChange={(e) => {
                        setDates({
                          ...dates,
                          checkIn: e.target.value,
                          // Reset check-out if it's now invalid
                          checkOut: e.target.value && dates.checkOut && new Date(dates.checkOut) <= new Date(e.target.value) 
                            ? '' 
                            : dates.checkOut
                        });
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="checkOutDate">
                    <Form.Label>Check-out Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dates.checkOut}
                      onChange={(e) => setDates({...dates, checkOut: e.target.value})}
                      min={dates.checkIn || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="bg-light-beige p-4 rounded-3 mb-4">
                <h5 className="mb-3">Booking Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Room:</span>
                  <strong>{room.name}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Price per night:</span>
                  <strong>${room.price}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Nights:</span>
                  <strong>
                    {dates.checkIn && dates.checkOut ? 
                      Math.ceil(
                        (new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24)
                      ) : 
                      0}
                  </strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total:</span>
                  <strong className="text-success">${calculateTotal().toFixed(2)}</strong>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <Button 
                  variant="outline-secondary" 
                  onClick={onClose} 
                  className="me-2"
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="custom" 
                  disabled={loading || !dates.checkIn || !dates.checkOut}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookingForm;