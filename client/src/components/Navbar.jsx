import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from "../config/api";

import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [href, setHref] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuth = async () => {
        try {
            const config = {
              headers: {
                "Content-type": "application/json"
              },
              withCredentials: true
            };

            const body = {};
            const response = await API.get("/check-auth", body, config);
            setUsername(response.data.data.email)
            setHref(response.headers.location);
          } catch (err) {
            console.log("Navbar: ",err)
            window.location.href = err.response.headers.location;
          }
    };

    fetchAuth();
  }, [navigate]);

  const handleLogout = async () => {
    const config = {
      headers: {
        "Content-type": "application/json"
      },
      withCredentials: true
    };

    const body = {};
    await API.get("/logout", body, config);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href={href}>Biodata</a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="nav-link">Hello, {username}</span>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
