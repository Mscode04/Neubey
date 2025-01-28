import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Assuming the CSS is in the same directory

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <span>Palliative Care</span>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Logout</Link>
      </div>
    </nav>
  );
}

export default Navbar;
