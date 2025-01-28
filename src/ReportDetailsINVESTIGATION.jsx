import React, { useState, useEffect, useRef } from "react";
import { db } from "./Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsINVESTIGATION.css"; // Import the CSS file

const ReportDetailsINVESTIGATION = () => {
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
    <div ref={componentRef} className="rinvestigation-container">
      <button className="rinvestigation-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rinvestigation-title">Investigation Report Details</h2>
      <div className="rinvestigation-content">
        {/* Personal Details */}
        <h3 className="rinvestigation-section-title">Personal Details</h3>
        <div className="rinvestigation-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rinvestigation-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* Investigation Details */}
        <h3 className="rinvestigation-section-title">Investigation Details</h3>
        {[
          "CBR",
          "ESR",
          "CRP",
          "FBS",
          "PPBS",
          "RBS",
          "HBa1c",
          "RFT",
          "LFT",
          "LIPID_PROFILE",
          "ELECTROLYTES",
          "URINE",
          "OTHERS",
        ].map((field) => (
          <div className="rinvestigation-field" key={field}>
            <label>{field}:</label>
            <span>{report[field] || "N/A"}</span>
          </div>
        ))}

        {/* Reports From */}
        <h3 className="rinvestigation-section-title">Reports From</h3>
        {Object.keys(report.REPORTS_FROM || {}).map((field) => (
          <div className="rinvestigation-field" key={field}>
            <label>{field}:</label>
            <span>{report.REPORTS_FROM[field] || "N/A"}</span>
          </div>
        ))}

        {/* Date */}
        <h3 className="rinvestigation-section-title">Date</h3>
        <div className="rinvestigation-field">
          <label>Date:</label>
          <span>{report.date || "N/A"}</span>
        </div>
      </div>
      <button className="rinvestigation-print-button" onClick={handlePrint}>
        Print Report
      </button>
    </div>
  );
};

export default ReportDetailsINVESTIGATION;