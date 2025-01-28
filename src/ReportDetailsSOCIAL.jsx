import React, { useState, useEffect, useRef } from "react";
import { db } from "./Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsSOCIAL.css"; // Import the CSS file

const ReportDetailsSOCIAL = () => {
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
    <div ref={componentRef} className="rsocial-container">
      <button className="rsocial-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rsocial-title">Social Report Details</h2>
      <div className="rsocial-content">
        {/* Personal Details */}
        <h3 className="rsocial-section-title">Personal Details</h3>
        <div className="rsocial-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* General Details */}
        <h3 className="rsocial-section-title">General Details</h3>
        <div className="rsocial-field">
          <label>Date:</label>
          <span>{report.date || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Food:</label>
          <span>{report.food || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Education:</label>
          <span>{report.edn || "N/A"}</span>
        </div>
        <div className="rsocial-field">
          <label>Others:</label>
          <span>{report.others || "N/A"}</span>
        </div>

        {/* Dynamic Fields */}
        <h3 className="rsocial-section-title">Dynamic Fields</h3>
        {report.dynamicFields?.map((field, index) => (
          <div key={index} className="rsocial-dynamic-field-group">
            <div className="rsocial-field">
              <label>Frequency:</label>
              <span>{field.freq || "N/A"}</span>
            </div>
            <div className="rsocial-field">
              <label>FEA Date:</label>
              <span>{field.feaDate || "N/A"}</span>
            </div>
            <div className="rsocial-field">
              <label>Category:</label>
              <span>{field.cat || "N/A"}</span>
            </div>
            <div className="rsocial-field">
              <label>Category Date:</label>
              <span>{field.catDate || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
 
      <button className="rsocial-print-button" onClick={handlePrint}>
        Print Report
      </button>
    </div>
  );
};

export default ReportDetailsSOCIAL;
