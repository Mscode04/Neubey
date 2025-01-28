import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './Firebase/config';
import './ProgressionReport.css'; // External CSS

function ProgressionReportDetail() {
  const { reportId } = useParams(); // Get reportId from URL params
  const [report, setReport] = useState(null);
  const componentRef = React.useRef(); // Ref for the HTML element to clone

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const reportDoc = await getDoc(doc(db, 'Reports', reportId));
        if (reportDoc.exists()) {
          setReport(reportDoc.data()); // Set the report data
        }
      } catch (error) {
        console.error('Error fetching report details:', error);
      }
    };

    fetchReportDetails();
  }, [reportId]);

  const handlePrint = () => {
    window.print(); // Trigger the browser's print dialog
  };

  const getField = (field) => field !== undefined ? field : 'Null';

  // Function to clean and format field names
  const cleanFieldName = (fieldName) => {
    return fieldName.replace(/^Progression Report\./, '').replace(/_/g, ' ');
  };

  // Function to render fields dynamically
  const renderFields = (obj, prefix = '') => {
    return Object.keys(obj).map((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        return (
          <div key={prefix ? `${prefix}.${key}` : key} className="nested-field">
            <h4>{cleanFieldName(key)}</h4>
            <div style={{ marginLeft: '20px' }}>
              {renderFields(obj[key], key)}
            </div>
          </div>
        );
      }
      return (
        <p key={prefix ? `${prefix}.${key}` : key}>
          <strong>{cleanFieldName(key)}:</strong> {getField(obj[key])}
        </p>
      );
    });
  };

  if (!report) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div ref={componentRef} className="container progression-report">
      <div className="report-details">
        <h3>Patient Information</h3>
        <p><strong>Patient Name:</strong> {getField(report?.Name)}</p>
        <p><strong>Address:</strong> {getField(report?.Address)}</p>

        <section className="report-section">
          <h3>Details</h3>
          {renderFields(report)}
        </section>
      </div>
      <button onClick={handlePrint}>Print Report</button>
    </div>
  );
}

export default ProgressionReportDetail;
