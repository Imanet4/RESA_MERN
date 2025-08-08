import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel, faBed, faCalendarAlt, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  

  return (
    <Navbar bg="dark-green" variant="dark" expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faHotel} className="me-2" />
          LuxeStays
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/rooms" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faBed} className="me-2" />
              Rooms
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/my-bookings" className="d-flex align-items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                My Bookings
              </Nav.Link>
            )}
            {isAuthenticated && user && user.role === 'admin' && (
              <Nav.Link as={Link} to="/admin/dashboard" className="d-flex align-items-center">
                <FontAwesomeIcon icon={faUserShield} className="me-2" />
                Admin Dashboard
              </Nav.Link>
            )}

          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3 d-flex align-items-center">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Welcome, {user.name}
                </Navbar.Text>
                <Button variant="outline-light" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-light" as={Link} to="/login" className="me-2">
                  Login
                </Button>
                <Button variant="light" as={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;