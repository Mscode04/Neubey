import React, { useState, useEffect } from "react";
import { db } from "./Firebase/config"; // Adjust the path if necessary
import { collection, getDocs } from "firebase/firestore";
import "./PatientList.css";
import { useNavigate } from "react-router-dom";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 8; // Number of patients per page
  const navigate = useNavigate();

  // Fetch patients from Firestore on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Patients"));
        const patientsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientsData);
        setFilteredPatients(patientsData); // Set initial filtered list
      } catch (error) {
        console.error("Error fetching patients: ", error);
      }
    };

    fetchPatients();
  }, []);

  // Update filtered patients when search query changes
  useEffect(() => {
    const filtered = patients.filter((patient) => {
      const name = patient.name || ""; // Default to an empty string if undefined
      const address = patient.address || ""; // Default to an empty string if undefined
      const caretakerPhone = patient.mainCaretakerPhone || ""; // Default to an empty string if undefined

      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caretakerPhone.includes(searchQuery)
      );
    });
    setFilteredPatients(filtered);
    setCurrentPage(1); // Reset to the first page on search
  }, [searchQuery, patients]);

  // Calculate the current page's patients
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handleCardClick = (patientId) => {
    navigate(`/patient-details/${patientId}`); // Navigate to the patient detail page
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="PatientTable-container">
    {/* Back button */}
    <button className="PatientTable-back-button" onClick={() => navigate(-1)}>
      <i className="bi bi-arrow-left"></i> Back
    </button>
  
    {/* Search bar */}
    <div className="PatientTable-search-bar">
      <input
        type="text"
        placeholder="Search by name, phone number, or address..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  
    {/* Patient cards */}
    <div className="PatientTable-patient-cards">
      {currentPatients.map((patient) => (
        <div
          key={patient.id}
          className="PatientTable-patient-card"
          onClick={() => handleCardClick(patient.id)}
        >
          <div className="PatientTable-profile-pic">
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="PatientTable-patient-info">
            <h5>{patient.name || "N/A"}</h5>
            <p>{patient.address || "N/A"}</p>
            <p>{patient.mainCaretakerPhone || "N/A"}</p>
          </div>
        </div>
      ))}
    </div>
  
    {/* Pagination */}
    <div className="PatientTable-pagination">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className="PatientTable-pagination-btn"
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={`PatientTable-pagination-btn ${
            currentPage === index + 1 ? "active" : ""
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="PatientTable-pagination-btn"
      >
        Next
      </button>
    </div>
  </div>
  );
};

export default PatientList;



