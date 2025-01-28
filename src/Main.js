import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
import ReportDetailsNHC from './ReportDetailsNHC';
import ReportDetailsDHC from './ReportDetailsDHC';
import ReportDetailsNHCE from './ReportDetailsNHCE';
import ReportDetailsPROGRESSION from './ReportDetailsPROGRESSION';
import Login from './Login';
import Contact from './Contact';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status) => setIsLoggedIn(status);

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <App /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={<Login onLogin={() => handleLogin(true)} />}
      />
      <Route path="/reportsdetailnhc/:reportId" element={<ReportDetailsNHC />} />
      <Route path="/reportsdetailnhce/:reportId" element={<ReportDetailsNHCE />} />
      <Route path="/report-details-dhc/:reportId" element={<ReportDetailsDHC />} />
      <Route path="/report-details-progression/:reportId" element={<ReportDetailsPROGRESSION/>} />
      <Route path="/contact" element={<Contact />} />
      {/* Routes for Patient List and Details */}
      <Route
        path="/patients"
        element={isLoggedIn ? <PatientList /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/patient-details/:patientId"
        element={isLoggedIn ? <PatientDetails /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default Main;
