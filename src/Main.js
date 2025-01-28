import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
import ReportDetailsNHC from './ReportDetailsNHC';
import ReportDetailsDHC from './ReportDetailsDHC';
import ReportDetailsNHCE from './ReportDetailsNHCE';
import ReportDetailsPROGRESSION from './ReportDetailsPROGRESSION';
import ReportDetailsDEATH from './ReportDetailsDEATH';
import ReportDetailsINVESTIGATION from './ReportDetailsINVESTIGATION';
import ReportDetailsSOCIAL from './ReportDetailsSOCIAL';
import ReportDetailsVHC from './ReportDetailsVHC';
import Login from './Login';
import Contact from './Contact';
import PatientList from './PatientList';
import PatientDetails from './PatientDetails';

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage for login status on initial load
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    // Update localStorage when isLoggedIn changes
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = (status) => setIsLoggedIn(status);
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Chrome requires returnValue to be set
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
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
      <Route path="/report-details-vhc/:reportId" element={<ReportDetailsVHC />} />
      <Route path="/report-details-death/:reportId" element={<ReportDetailsDEATH />} />
      <Route path="/report-details-investigation/:reportId" element={<ReportDetailsINVESTIGATION />} />
      <Route path="/report-details-social/:reportId" element={<ReportDetailsSOCIAL />} />
      <Route path="/report-details-progression/:reportId" element={<ReportDetailsPROGRESSION/>} />
      
      <Route path="/contact" element={<Contact />} />
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