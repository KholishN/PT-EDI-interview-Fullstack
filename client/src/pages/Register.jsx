import React, { useState } from 'react';
import { Button, Card, Form, Col, Row, Container, Alert } from 'react-bootstrap';
import { API } from "../config/api";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Passwords do not match
        </Alert>
      );
      setMessage(alert);
      return;
    }

    const config = {
      headers: {
        "Content-type": "application/json"
      },
      withCredentials: true
    };

    const body = JSON.stringify({ email, password });

    try {
      const response = await API.post("/register", body, config);
      console.log(response.data); // Handle response accordingly
      const alert = (
        <Alert variant="success" className="py-1">
          {response.data.message}
        </Alert>
      );
      setMessage(alert);
      // Reset form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          {error.response.data.message}
        </Alert>
      );
      setMessage(alert);
      setMessage("Registration failed. Please try again.");
    }
  };

  const handleAccount = (field, event) => {
    switch (field) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      case "confirmPassword":
        setConfirmPassword(event.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#ddd' }}>
      <Card className="p-4 col-md-5">
        <Card.Body>
          <Card.Title className="text-center mb-4" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Register</Card.Title>
          {message && message}
          <Form onSubmit={handleSignUp}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => handleAccount("email", event)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => handleAccount("password", event)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(event) => handleAccount("confirmPassword", event)}
                required
              />
            </Form.Group>
            <Button className="w-100 mb-3" variant="primary" type="submit">
              Sign Up
            </Button>
            <Row className="mb-3">
              <Col className="text-center">
                <a href="/login" className="text-primary">Already have an account? Sign In</a>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignUp;
