import React from 'react';
import { Container } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <Container className="py-5">
      <LoginForm />
    </Container>
  );
};

export default Login;