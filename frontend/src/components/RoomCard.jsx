import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faWifi, faTv, faSnowflake } from '@fortawesome/free-solid-svg-icons';

const RoomCard = ({ room }) => {
  return (
    <Card className="card-custom h-100">
      <Card.Img variant="top" src={`http://localhost:8000/uploads/${room.images[0]}`} />
      <Card.Body>
        <Card.Title>{room.name}</Card.Title>
        <Card.Text className="text-muted">{room.description.substring(0, 100)}...</Card.Text>
        <div className="mb-3">
          <Badge bg="success" className="me-2">
            <FontAwesomeIcon icon={faUsers} className="me-1" />
            {room.capacity} {room.capacity > 1 ? 'Guests' : 'Guest'}
          </Badge>
          <Badge bg="success">
            ${room.price}/night
          </Badge>
        </div>
        <div className="mb-3">
          {room.amenities.includes('WiFi') && (
            <Badge bg="light" text="dark" className="me-2 mb-2">
              <FontAwesomeIcon icon={faWifi} className="me-1" />
              WiFi
            </Badge>
          )}
          {room.amenities.includes('TV') && (
            <Badge bg="light" text="dark" className="me-2 mb-2">
              <FontAwesomeIcon icon={faTv} className="me-1" />
              TV
            </Badge>
          )}
          {room.amenities.includes('AC') && (
            <Badge bg="light" text="dark" className="me-2 mb-2">
              <FontAwesomeIcon icon={faSnowflake} className="me-1" />
              AC
            </Badge>
          )}
        </div>
        <Button as={Link} to={`/rooms/${room._id}`} variant="custom" className="w-100">
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;