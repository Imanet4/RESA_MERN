import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import API from '../utils/api';
import RoomCard from '../components/RoomCard';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        setRooms(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

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
      <h1 className="page-header mb-5">Our Rooms & Suites</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {rooms.map((room) => (
          <Col key={room._id}>
            <RoomCard room={room} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Rooms;