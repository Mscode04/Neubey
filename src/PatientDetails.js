import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './Firebase/config';
import './PatientDetails.css';

function PatientDetails() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientDoc = await getDoc(doc(db, 'patients', patientId));
        if (patientDoc.exists()) {
          setPatient(patientDoc.data());
        }
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  if (!patient) {
    return <div className="loading-container">Loading...</div>;
  }

  const renderTable = (data) => (
    <table className="patient-table">
      <tbody>
        {Object.entries(data || {}).map(([key, value]) => (
          <tr key={key}>
            <th>{key}</th>
            <td>{value || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderNestedTable = (dataArray, title) => (
    <table className="nested-table">
      <thead>
        <tr>
          {Object.keys(dataArray[0] || {}).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataArray.map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((value, idx) => (
              <td key={idx}>{value || 'N/A'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const handlePrint = () => {
    window.print(); // Trigger the browser's print dialog
  };

  return (
    <div ref={componentRef} className="patient-details">
      <h1 className="patient-title">Patient Profile</h1>
      <div className="general-info">
        <p><strong>Name:</strong> {patient.basicDetailsModel?.name || 'N/A'}</p>
        <p><strong>Address:</strong> {patient.basicDetailsModel?.address || 'N/A'}</p>
        <p><strong>Date of Registration:</strong> {patient.registrationDate?.toDate().toLocaleDateString() || 'N/A'}</p>
        <p><strong>Registration Number:</strong> {patient.registrationNumber || 'N/A'}</p>
      </div>

      <section>
        <h2>Basic Details</h2>
        {renderTable(patient.basicDetailsModel)}
      </section>

      <section>
        <h2>Main Diagnosis</h2>
        <p>{patient.mainDiagnosis || 'N/A'}</p>
      </section>

      <section>
        <h2>Medical Condition</h2>
        <p>{patient.medicalCondition || 'N/A'}</p>
      </section>

      <section>
        <h2>Body Status</h2>
        {renderTable(patient.bodyStaus)}
      </section>

      <section>
        <h2>General Details</h2>
        {renderTable(patient.generalDetailsModel)}
      </section>

      <section>
        <h2>Medical Details</h2>
        {renderTable(patient.medicalDetailsModel)}

        <h3>Medicines</h3>
        {patient.medicines?.length > 0 &&
          renderNestedTable(patient.medicines, 'Medicines')}
      </section>

      <section>
        <h2>Vital Signs</h2>
        {renderTable(patient.vitalSigns)}
      </section>

      <section>
        <h2>Basic Model</h2>
        {renderTable(patient.basicModel)}
      </section>

      <section>
        <h2>Welfare Model</h2>
        {renderTable(patient.welfareModel)}
      </section>

      {patient.familyModel?.length > 0 && (
        <section>
          <h2>Family Details</h2>
          {renderNestedTable(patient.familyModel, 'Family Details')}
        </section>
      )}

      <button onClick={handlePrint} className="btn btn-primary mt-3">
        Print
      </button>
    </div>
  );
}

export default PatientDetails;
