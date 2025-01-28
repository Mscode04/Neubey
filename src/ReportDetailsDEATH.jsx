import React, { useState, useEffect, useRef } from "react";
import { db } from "./Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsDEATH.css"; 

const ReportDetailsDEATH = () => {
  const { reportId } = useParams(); // Get reportId from URL
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef(); // Ref for printing

  const navigate = useNavigate(); // Use useNavigate

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const reportRef = doc(db, "Reports", reportId);
        const reportSnapshot = await getDoc(reportRef);

        if (reportSnapshot.exists()) {
          console.log("Report data:", reportSnapshot.data());
          setReport(reportSnapshot.data());
        } else {
          console.log("No report found with ID:", reportId);
          setError("Report not found.");
        }
      } catch (error) {
        console.error("Error fetching report: ", error);
        setError("Failed to load report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };


  const handlePrint = () => {
    window.print(); // Trigger the browser's print dialog
  };

  if (loading) {
    return <p>Loading report details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!report) {
    return <p>No report found.</p>;
  }

  return (
    <div ref={componentRef} className="rdeath-container">
      <button className="rdeath-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rdeath-title">Death Report Details</h2>
      <div className="rdeath-content">
        {/* Personal Details */}
        <h3 className="rdeath-section-title">Personal Details</h3>
        <div className="rdeath-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* Death Details */}
        <h3 className="rdeath-section-title">Death Details</h3>
        <div className="rdeath-field">
          <label>Date of Death:</label>
          <span>{report.date || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Time of Death:</label>
          <span>{report.timeOfDeath || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Reason for Death:</label>
          <span>{report.deathReason || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Visited Hospital:</label>
          <span>{report.visitedHospital || "N/A"}</span>
        </div>
        <div className="rdeath-field">
          <label>Place of Death:</label>
          <span>{report.deathPlace || "N/A"}</span>
        </div>
      </div>

      <button className="rdeath-print-button" onClick={handlePrint}>
        Print Report
      </button>
    </div>
  );
};

export default ReportDetailsDEATH;
