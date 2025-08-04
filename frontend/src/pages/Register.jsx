import React from 'react';
import { Container } from 'react-bootstrap';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <Container className="py-5">
      <RegisterForm />
    </Container>
  );
};

export default Register;