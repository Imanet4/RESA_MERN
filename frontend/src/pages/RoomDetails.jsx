import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Carousel } from 'react-bootstrap';
import API from '../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBed, 
  faUsers, 
  faWifi, 
  faTv, 
  faCoffee, 
  faSnowflake,
  faCalendarAlt,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import BookingForm from '../components/BookingForm';
import { useAuth } from '../context/AuthContext'

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await API.get(`/rooms/${id}`);
        setRoom(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch room details');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

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
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Back to Rooms
      </Button>

      <h1 className="page-header mb-4">{room.name}</h1>

      <Row className="mb-5">
        <Col lg={8}>
          <Carousel className="mb-4 rounded-3 overflow-hidden">
  {room.images.map((image, index) => (
    <Carousel.Item key={index}>
      <img
        className="d-block w-100"
        src={
          image.startsWith('/uploads/')
            ? `http://localhost:8000${image}`
            : `http://localhost:8000/uploads/${image}`
        }
        alt={`Room ${index + 1}`}
        style={{ height: '500px', objectFit: 'cover' }}
      />
    </Carousel.Item>
  ))}
</Carousel>
        </Col>
        <Col lg={4}>
          <div className="bg-white p-4 rounded-3 shadow-sm h-100">
            <h3 className="mb-4">${room.price} <small className="text-muted">/ night</small></h3>
            
            <div className="mb-4">
              <h5 className="mb-3">Room Features</h5>
              <p className="room-feature">
                <FontAwesomeIcon icon={faUsers} />
                Capacity: {room.capacity} {room.capacity > 1 ? 'Guests' : 'Guest'}
              </p>
              <p className="room-feature">
                <FontAwesomeIcon icon={faBed} />
                {room.type || 'Standard'} Bed
              </p>
              {room.amenities.map((amenity, index) => (
                <p key={index} className="room-feature">
                  <FontAwesomeIcon 
                    icon={
                      amenity === 'WiFi' ? faWifi :
                      amenity === 'TV' ? faTv :
                      amenity === 'AC' ? faSnowflake : faCoffee
                    } 
                  />
                  {amenity}
                </p>
              ))}
            </div>

            <Button 
              variant="custom" 
              size="lg" 
              className="w-100"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: `/rooms/${id}` } });
                } else {
                  setShowBookingForm(true);
                }
              }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
              Book Now
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="mb-3">Description</h3>
          <p className="lead">{room.description}</p>
        </Col>
      </Row>

      {showBookingForm && (
        <BookingForm 
          room={room} 
          onClose={() => setShowBookingForm(false)} 
        />
      )}
    </Container>
  );
};

export default RoomDetails;