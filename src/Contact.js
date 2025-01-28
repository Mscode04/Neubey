import React from 'react';
import Navbar from './Navbar';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'; // Importing FontAwesome icons

function Contact() {
  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ backgroundColor: '#6db1b3' }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h2 className="card-title mb-4 text-black">Contact Us</h2>
                <p className="lead text-black">We're here to assist you. Reach out to us using the information below:</p>
                <div className="mt-4">
                  <h5 className="text-black"><FaEnvelope /> Email</h5>
                  <p className="text-muted">help.neuraq@gmail.com</p>
                </div>
                <div className="mt-4">
                  <h5 className="text-black"><FaPhoneAlt /> Phone</h5>
                  <p className="text-muted">+91 8157980307</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
    </>
  );
}

export default Contact;
