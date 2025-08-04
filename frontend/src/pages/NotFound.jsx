import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <Card className="border-0 shadow-sm py-5">
        <Card.Body>
          <h1 className="display-1 text-dark-green mb-4">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead mb-5">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/" variant="custom" size="lg">
              <FontAwesomeIcon icon={faHome} className="me-2" />
              Go Home
            </Button>
            <Button as={Link} to="/rooms" variant="outline-dark-green" size="lg">
              <FontAwesomeIcon icon={faSearch} className="me-2" />
              Browse Rooms
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotFound;