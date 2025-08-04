import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="align-items-center">
        <Col md={6} className="text-md-start mb-4 mb-md-0">
          <h1 className="display-4 fw-bold mb-4">Experience Luxury Redefined</h1>
          <p className="lead mb-4">
            Discover our exquisite collection of rooms designed for your comfort and elegance.
          </p>
          <Button as={Link} to="/rooms" variant="custom" size="lg">
            Explore Rooms <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          </Button>
        </Col>
        <Col md={6}>
          <div className="ratio ratio-16x9">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Luxury Hotel"
              className="rounded-3 shadow"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;