import React from 'react';
import { Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faHome, 
  faCalendarAlt,
  faReceipt,
  faUser
} from '@fortawesome/free-solid-svg-icons';

const BookingConfirmation = ({ booking }) => {
  const navigate = useNavigate();

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="text-center p-5">
        <FontAwesomeIcon 
          icon={faCheckCircle} 
          size="4x" 
          className="text-success mb-4"
        />
        <h2 className="mb-4">Booking Confirmed!</h2>
        <Alert variant="success" className="text-start">
          <p className="mb-3">
            Thank you for your booking. Your reservation has been confirmed and details 
            have been sent to your email.
          </p>
          <p className="mb-0">
            <strong>Booking Reference:</strong> {booking._id}
          </p>
        </Alert>

        <ListGroup variant="flush" className="mb-4 text-start">
          <ListGroup.Item>
            <FontAwesomeIcon icon={faUser} className="me-2 text-dark-green" />
            <strong>Guest:</strong> {booking.user.name}
          </ListGroup.Item>
          <ListGroup.Item>
            <FontAwesomeIcon icon={faHome} className="me-2 text-dark-green" />
            <strong>Room:</strong> {booking.room.name}
          </ListGroup.Item>
          <ListGroup.Item>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-dark-green" />
            <strong>Dates:</strong> {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
          </ListGroup.Item>
          <ListGroup.Item>
            <FontAwesomeIcon icon={faReceipt} className="me-2 text-dark-green" />
            <strong>Total:</strong> ${booking.totalPrice.toFixed(2)}
          </ListGroup.Item>
        </ListGroup>

        <div className="d-flex justify-content-center gap-3">
          <Button 
            variant="outline-dark-green" 
            as={Link} 
            to="/my-bookings"
          >
            View My Bookings
          </Button>
          <Button 
            variant="custom"
            onClick={() => navigate('/rooms')}
          >
            Book Another Room
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookingConfirmation;