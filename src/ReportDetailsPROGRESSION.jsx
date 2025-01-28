import React, { useState, useEffect, useRef } from "react";
import { db } from "./Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsPROGRESSION.css"; // Import the CSS file

const ReportDetailsPROGRESSION = () => {
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
    <div ref={componentRef} className="rprogression-container">
      <button className="rprogression-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rprogression-title">Progression Report Details</h2>
      <div className="rprogression-content">
        {/* Personal Details */}
        <h3 className="rprogression-section-title">Personal Details</h3>
        <div className="rprogression-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* General Details */}
        <h3 className="rprogression-section-title">General Details</h3>
        <div className="rprogression-field">
          <label>Time In:</label>
          <span>{report.timeIn || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Time Out:</label>
          <span>{report.timeOut || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>HC SI No:</label>
          <span>{report.hcSiNo || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>D/N/V/SPHC Number:</label>
          <span>{report.dnvsphcNumber || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Monthly:</label>
          <span>{report.monthly || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Last Home Care:</label>
          <span>{report.lastHomeCare || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Last Home Care Date:</label>
          <span>{report.lastHomeCareDate || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Consultation/Hospitalisation:</label>
          <span>{report.consultationHospitalisation || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Main Activities:</label>
          <span>{report.mainActivities || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Physical Service:</label>
          <span>{report.physicalService || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>The Primary Once:</label>
          <span>{report.primaryOnce || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Patient Awareness:</label>
          <span>{report.patientAwareness || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Family Awareness:</label>
          <span>{report.familyAwareness || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Financially:</label>
          <span>{report.financially || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Emotional State:</label>
          <span>{report.emotionalState || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Caretaker:</label>
          <span>{report.caretaker || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Caretaker Type:</label>
          <span>{report.caretakerType || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Community Support:</label>
          <span>{report.communitySupport || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Palliative Team Support:</label>
          <span>{report.palliativeTeamSupport || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Environmental Hygiene:</label>
          <span>{report.environmentalHygiene || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Head to Foot Checkup:</label>
          <span>{report.headToFootCheckup || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Silent Tapes:</label>
          <span>{report.silentTapes || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Activity Mobility:</label>
          <span>{report.activityMobility || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Glassglow:</label>
          <span>{report.glassglow || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>General Condition:</label>
          <span>{report.generalCondition || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Care Status:</label>
          <span>{report.careStatus || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Quality of Life:</label>
          <span>{report.qualityOfLife || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Logistic:</label>
          <span>{report.logistic || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>HC Plan:</label>
          <span>{report.hcPlan || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Team 1:</label>
          <span>{report.team1 || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Team 2:</label>
          <span>{report.team2 || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Team 3:</label>
          <span>{report.team3 || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Team 4:</label>
          <span>{report.team4 || "N/A"}</span>
        </div>
        <div className="rprogression-field">
          <label>Submitted At:</label>
          <span>{report.submittedAt || "N/A"}</span>
        </div>
      </div>
      <button className="rprogression-print-button" onClick={handlePrint}>
        Print Report
      </button>
    </div>
  );
};

export default ReportDetailsPROGRESSION;