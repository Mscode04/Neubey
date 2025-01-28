import React, { useState, useEffect, useRef } from "react";
import { db } from "./Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsVHC.css"; // Import the CSS file

const ReportDetailsVHC = () => {
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
    <div ref={componentRef} className="rvhc-container">
      <button className="rvhc-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rvhc-title">VHC Report Details</h2>
      <div className="rvhc-content">
        {/* Personal Details */}
        <h3 className="rvhc-section-title">Personal Details</h3>
        <div className="rvhc-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* Disease Information */}
        <h3 className="rvhc-section-title">Disease Information</h3>
        <div className="rvhc-field">
          <label>Disease Information:</label>
          <span>{report.diseaseInformation || "N/A"}</span>
        </div>

        {/* Patient Condition */}
        <h3 className="rvhc-section-title">Patient Condition</h3>
        <div className="rvhc-field">
          <label>Patient Condition:</label>
          <span>{report.patientCondition || "N/A"}</span>
        </div>

        {/* Financial Situation */}
        <h3 className="rvhc-section-title">Financial Situation</h3>
        {Object.keys(report.financialSituation || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.financialSituation[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Welfare Schemes */}
        <h3 className="rvhc-section-title">Welfare Schemes</h3>
        <div className="rvhc-field">
          <label>Ration Card Number:</label>
          <span>{report.welfareSchemes?.rationCardNumber || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Ration Card Type:</label>
          <span>{report.welfareSchemes?.rationCardType || "N/A"}</span>
        </div>
        <div className="rvhc-field">
          <label>Financial Status:</label>
          <span>{report.welfareSchemes?.financialStatus || "N/A"}</span>
        </div>

        {/* Government Welfare Schemes */}
        <h4 className="rvhc-subsection-title">Government</h4>
        {Object.keys(report.welfareSchemes?.government || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.welfareSchemes.government[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Non-Government Welfare Schemes */}
        <h4 className="rvhc-subsection-title">Non-Government</h4>
        {Object.keys(report.welfareSchemes?.nonGovernment || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.welfareSchemes.nonGovernment[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Other Agencies */}
        <h4 className="rvhc-subsection-title">Other Agencies</h4>
        {Object.keys(report.welfareSchemes?.otherAgencies || {}).map((field) => (
          <div className="rvhc-field" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <span>{report.welfareSchemes.otherAgencies[field] ? "Yes" : "No"}</span>
          </div>
        ))}

        {/* Welfare Benefits */}
        <h3 className="rvhc-section-title">Welfare Benefits</h3>
        {report.welfareBenefits?.map((benefit, index) => (
          <div key={index} className="rvhc-field">
            <label>Full Name:</label>
            <span>{benefit.fullName || "N/A"}</span>
            <label>Phone No:</label>
            <span>{benefit.phoneNo || "N/A"}</span>
            <label>Relation:</label>
            <span>{benefit.relation || "N/A"}</span>
            <label>Ways to Help:</label>
            <span>{benefit.waysToHelp || "N/A"}</span>
          </div>
        ))}
      </div>

      <button className="rvhc-update-button" onClick={handlePrint}>
        Print Report
      </button>
    </div>
  );
};

export default ReportDetailsVHC;
