import React, { useState, useEffect } from "react";
import { db } from "./Firebase/config"; // Adjust the path if necessary
import { collection, getDocs } from "firebase/firestore";
import "./PatientList.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("All"); // Filter by diagnosis
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order: asc or desc
  const [sortBy, setSortBy] = useState("name"); // Sort by: name or registernumber
  const [selectedStatus, setSelectedStatus] = useState("All"); // Filter by active/inactive
  const patientsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(db, "Patients"));
        const patientsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientsData);
        setFilteredPatients(patientsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patients: ", error);
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    let filtered = patients.filter((patient) => {
      const name = patient.name || "";
      const address = patient.address || "";
      const caretakerPhone = patient.mainCaretakerPhone || "";
      const mainDiagnosis = patient.mainDiagnosis || "";
      const registernumber = patient.registernumber || "";
      const isDeactivated = patient.deactivated || false;

      // Search filter
      const matchesSearchQuery =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        caretakerPhone.includes(searchQuery) ||
        mainDiagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        registernumber.includes(searchQuery);

      // Diagnosis filter
      const matchesDiagnosis =
        selectedDiagnosis === "All" || patient.mainDiagnosis === selectedDiagnosis;

      // Status filter (Active / Inactive)
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Active" && !isDeactivated) ||
        (selectedStatus === "Inactive" && isDeactivated);

      return matchesSearchQuery && matchesDiagnosis && matchesStatus;
    });

    // Sort patients
    if (sortBy === "name") {
      filtered.sort((a, b) => {
        const nameA = a.name || "";
        const nameB = b.name || "";
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    } else if (sortBy === "registernumber") {
      filtered.sort((a, b) => {
        const parseRegisterNumber = (reg) => {
          if (!reg) return { number: Infinity, year: Infinity };
          const parts = reg.split("/");
          const number = parseInt(parts[0]) || 0;
          const year = parts[1] ? 2000 + parseInt(parts[1]) : 0;
          return { number, year };
        };

        const regA = parseRegisterNumber(a.registernumber);
        const regB = parseRegisterNumber(b.registernumber);

        if (regA.year !== regB.year) {
          return sortOrder === "asc" ? regA.year - regB.year : regB.year - regA.year;
        }
        return sortOrder === "asc" ? regA.number - regB.number : regB.number - regA.number;
      });
    }

    setFilteredPatients(filtered);
    setCurrentPage(1); // Reset to the first page on filter or sort change
  }, [searchQuery, selectedDiagnosis, selectedStatus, sortOrder, sortBy, patients]);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const uniqueDiagnoses = [
    "All",
    ...new Set(patients.map((patient) => patient.mainDiagnosis).filter(Boolean)),
  ];

  const handleCardClick = (patientId) => {
    navigate(`/patient-details/${patientId}`);
  };

  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <><Navbar></Navbar>
    <div className="PatientTable-container">
      <button className="PatientTable-back-button" style={{color:'#fff'}} onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left" ></i> Back
      </button>

      <div className="PatientTable-search-bar">
        <input
          type="text"
          placeholder="Search by name, phone number, address, diagnosis, or register number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="PatientTable-filters">
        <label>
          Filter by Diagnosis:
          <select value={selectedDiagnosis} onChange={(e) => setSelectedDiagnosis(e.target.value)}>
            {uniqueDiagnoses.map((diagnosis) => (
              <option key={diagnosis} value={diagnosis}>
                {diagnosis}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filter by Status:
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="registernumber">Register Number</option>
          </select>
        </label>

        <label>
          Order:
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {isLoading ? (
          <div className="PatientTable-loading-indicator">
            <div className="loading-container">
              <img
                src="https://media.giphy.com/media/YMM6g7x45coCKdrDoj/giphy.gif"
                alt="Loading..."
                className="loading-image"
              />
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Register Number</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Diagnosis</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((patient) => (
                  <tr key={patient.id} onClick={() => handleCardClick(patient.id)}>
                    <td data-label="Register Number">{patient.registernumber || "N/A"}</td>
                    <td data-label="Name">{patient.name || "N/A"}</td>
                    <td data-label="Address">{patient.address || "N/A"}</td>
                    <td data-label="Phone">{patient.mainCaretakerPhone || "N/A"}</td>
                    <td data-label="Diagnosis">{patient.mainDiagnosis || "N/A"}</td>
                    <td data-label="Status">
                      <span
                        className="status-indicator"
                        style={{ backgroundColor: patient.deactivated ? "red" : "green" }}
                      ></span>
                      {patient.deactivated ? "Inactive" : "Active"}
                    </td>
                    <td data-label="Actions">
                      <button className="view-button">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination()}
          </div>
           
        )}
    </div>
    </>
  );
};

export default PatientList;
