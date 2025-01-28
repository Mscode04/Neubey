import React from 'react';
import './Footer.css'
// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img
          src="./assets/img/logo.png" // Replace with your logo URL
          alt="Neuraq Logo"
          className="footer-logo"
        />
        <p className="footer-text">
   
        help.neuraq@gmsil.com
        </p>
      
      </div>
    </footer>
  );
}

export default Footer;
