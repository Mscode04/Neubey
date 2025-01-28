import React, { useState, useEffect, useRef } from "react";
import { db } from "./Firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import "./ReportDetailsNHCE.css"; // Import the CSS file for NHCE

const ReportDetailsNHCE = () => {
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
    <div ref={componentRef} className="rnhce-container">
      <button className="rnhce-back-button" onClick={goBack}>
        &larr; Back
      </button>
      <h2 className="rnhce-title">NHC(E) Report</h2>
      <div className="rnhce-content">
        {/* Personal Details */}
        <h3 className="rnhce-section-title">Personal Details</h3>
        <div className="rnhce-field">
          <label>Patient Name:</label>
          <span>{report.name || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Age:</label>
          <span>{report.age || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Gender:</label>
          <span>{report.gender || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Date of Birth:</label>
          <span>{report.dob || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Address:</label>
          <span>{report.address || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Email:</label>
          <span>{report.email || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Patient ID:</label>
          <span>{report.patientId || "N/A"}</span>
        </div>

        {/* Medical Details */}
        <h3 className="rnhce-section-title">Medical Details</h3>
        <div className="rnhce-field">
          <label>Main Diagnosis:</label>
          <span>{report.mainDiagnosis || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Medical History:</label>
          <span>{report.medicalHistory || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>General Status:</label>
          <span>{report.generalStatus || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Response Status:</label>
          <span>{report.responseStatus || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Current Difficulties:</label>
          <span>{report.currentDifficulties || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Medicine Changes:</label>
          <span>{report.medicineChanges || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Complimentary Rx:</label>
          <span>{report.complimentaryRx || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Home Care Plan:</label>
          <span>{report.homeCarePlan || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Home Care Type:</label>
          <span>{report.homeCareType || "N/A"}</span>
        </div>

        {/* Additional Details */}
        <h3 className="rnhce-section-title">Additional Details</h3>
        <div className="rnhce-field">
          <label>Activity Score:</label>
          <span>{report.activityScore || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Bad Habit:</label>
          <span>{report.badHabit || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Exercise:</label>
          <span>{report.exercise || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Exercise Frequency:</label>
          <span>{report.exerciseFrequency || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Exercise Location:</label>
          <span>{report.exerciseLocation || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Exercise Time:</label>
          <span>{report.exerciseTime || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Entertainment Time:</label>
          <span>{report.entertainmentTime || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Other Activities:</label>
          <span>{report.otherActivities || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Special Care Areas:</label>
          <span>{report.specialCareAreas || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Summary Discussion:</label>
          <span>{report.summaryDiscussion || "N/A"}</span>
        </div>

        {/* Cleanliness and Hygiene */}
        <h3 className="rnhce-section-title">Cleanliness and Hygiene</h3>
        <div className="rnhce-field">
          <label>House Cleanliness:</label>
          <span>{report.houseCleanliness || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Bedroom Cleanliness:</label>
          <span>{report.bedroomCleanliness || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Bed Cleanliness:</label>
          <span>{report.bedCleanliness || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Surroundings Cleanliness:</label>
          <span>{report.surroundingsCleanliness || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Dress Cleanliness:</label>
          <span>{report.dressCleanliness || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Self Hygiene:</label>
          <span>{report.selfHygiene || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Hair:</label>
          <span>{report.hair || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Skin:</label>
          <span>{report.skin || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Nails:</label>
          <span>{report.nails || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Mouth:</label>
          <span>{report.mouth || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Perineum:</label>
          <span>{report.perineum || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Pressure Spaces:</label>
          <span>{report.pressureSpaces || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Hidden Spaces:</label>
          <span>{report.hiddenSpaces || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Scalp:</label>
          <span>{report.scalp || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Joints:</label>
          <span>{report.joints || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>POP:</label>
          <span>{report.pop || "N/A"}</span>
        </div>

        {/* Vital Signs */}
        <h3 className="rnhce-section-title">Vital Signs</h3>
        <div className="rnhce-field">
          <label>BP :</label>
          <span>{report.bp || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>BP (Sitting/Lying):</label>
          <span>{report.bpSittingLying || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>BP (UL/LL):</label>
          <span>{report.bpUlLl || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Pulse:</label>
          <span>{report.pulse || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Pulse Type:</label>
          <span>{report.pulseType || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Respiratory Rate (RR):</label>
          <span>{report.rr || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>RR Type:</label>
          <span>{report.rrType || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Temperature:</label>
          <span>{report.temperature || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Temperature Type:</label>
          <span>{report.temperatureType || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>SPO2:</label>
          <span>{report.spo2 || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>GRBS:</label>
          <span>{report.grbs || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>GCS:</label>
          <span>{report.gcs || "N/A"}</span>
        </div>

        {/* Miscellaneous */}
        <h3 className="rnhce-section-title">Miscellaneous</h3>
        <div className="rnhce-field">
          <label>Form Type:</label>
          <span>{report.formType || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Registration Date:</label>
          <span>{report.registrationDate || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Register Time:</label>
          <span>{report.registerTime || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Submitted At:</label>
          <span>{report.submittedAt || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Team 1:</label>
          <span>{report.team1 || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Team 2:</label>
          <span>{report.team2 || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Team 3:</label>
          <span>{report.team3 || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Team 4:</label>
          <span>{report.team4 || "N/A"}</span>
        </div>
        <div className="rnhce-field">
          <label>Consultation:</label>
          <span>{report.consultation || "N/A"}</span>
        </div>
      </div>
      
      <button className="rnhce-print-button" onClick={handlePrint}>
        Print Report
      </button>
    </div>
  );
};

export default ReportDetailsNHCE;