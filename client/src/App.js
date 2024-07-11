import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Monitoring from './pages/Monitoring';
import RegistrationForm from './pages/RegistrationForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();

  const shouldDisplayNavbar = () => {
    return !['/login', '/register'].includes(location.pathname);
  };

  return (
    <>
      {shouldDisplayNavbar() && <Navbar />}
      <Routes>
        <Route path="/" element={<Monitoring />} />
        <Route path="/form" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
