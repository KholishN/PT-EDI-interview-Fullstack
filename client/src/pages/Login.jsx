import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Col, Row, Container, Alert } from 'react-bootstrap';
import { useMutation } from 'react-query'; // Import useMutation from your state management library
import { API } from "../config/api";

const Login = () => {
  const [message, setMessage] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          },
          withCredentials: true
        };

        const body = {};
        const response = await API.get("/check-auth", body, config);
        window.location.href = response.headers.location;
      } catch (err) {
        console.log("Monitoring : ",err)
        // window.location.href = err.response.headers.location;
      }
    };
    fetchData();
    const storedLogin = localStorage.getItem('login');
    if (storedLogin) {
      setLogin(JSON.parse(storedLogin));
      setRememberMe(true);
    }
  }, []);

  const { mutate: loginUser, isLoading } = useMutation(async (loginData) => {
    const config = {
      headers: {
        "Content-type": "application/json"
      },
      withCredentials: true
    };

    const body = JSON.stringify(loginData);
    const response = await API.post("/login", body, config);
    const userStatus = response.data.status;

    if (userStatus === "0") {
      const alert = (
        <Alert variant="success" className="py-1">
          {response.data.message}
        </Alert>
      );
      setMessage(alert);

      if (rememberMe) {
        localStorage.setItem('login', JSON.stringify(loginData));
      } else {
        localStorage.removeItem('login');
      }


      window.location.href = response.headers.location;
      
    } else {
      throw new Error("Login failed");
    }
  }, {
    onError: (error) => {
      const alert = (
        <Alert variant="danger" className="py-1">
          {error.response.data.message}
        </Alert>
      );
      setMessage(alert);
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(login);
  };

  const handleOnChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    });
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#ddd' }}>
      <Card className="p-4 col-md-5">
        <Card.Body>
          <Card.Title className="text-center mb-4" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Login</Card.Title>
          {message && message}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                id="email"
                name="email"
                aria-label="Email"
                placeholder="Email"
                type="email"
                onChange={handleOnChange}
                value={login.email}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleOnChange}
                value={login.password}
                aria-label="Password"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Remember me"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
            </Form.Group>
            <Button className="w-100 mb-3" variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Sign In'}
            </Button>
            <Row className="mb-3">
              <Col className="text-center">
                <a href="/register" className="text-primary">{"Don't have an account? Sign Up"}</a>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
