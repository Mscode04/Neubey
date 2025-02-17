import React, { useState, useEffect } from "react";
import { db } from "./Firebase/config"; // Adjust the path if necessary
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./PatientList.css"; // Your custom CSS (if any)
import Navbar from "./Navbar";
import * as XLSX from 'xlsx';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("All"); // Filter by diagnosis
  const [sortOrder, setSortOrder] = useState("asc"); // Sort order: asc or desc
  const [sortBy, setSortBy] = useState("name"); // Sort by: name or registernumber
  const [selectedStatus, setSelectedStatus] = useState("All"); // Filter by active/inactive
  const patientsPerPage = 100; // Show 10 patients per page
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

  const normalizeDiagnosis = (diagnosis) => {
    if (!diagnosis) return [];
    return diagnosis.split(",").map((d) => d.trim());
  };

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
      const normalizedDiagnosis = normalizeDiagnosis(mainDiagnosis);
      const matchesDiagnosis =
        selectedDiagnosis === "All" || normalizedDiagnosis.includes(selectedDiagnosis);

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
    ...new Set(
      patients
        .flatMap((patient) => normalizeDiagnosis(patient.mainDiagnosis))
        .filter(Boolean)
    ),
  ];

  const handleViewPatient = (patientId) => {
    navigate(`/patient-details/${patientId}`);
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      const pin = prompt("Enter the confirmation PIN to proceed:");
      
      if (pin === "2012") {
        try {
          await deleteDoc(doc(db, "Patients", patientId));
          setPatients(patients.filter((patient) => patient.id !== patientId));
          setFilteredPatients(filteredPatients.filter((patient) => patient.id !== patientId));
          alert("Patient deleted successfully!");
        } catch (error) {
          console.error("Error deleting patient: ", error);
          alert("Failed to delete patient.");
        }
      } else {
        alert("Incorrect PIN. Deletion canceled.");
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDownloadExcel = () => {
    // Prepare the data for Excel
    const dataForExcel = filteredPatients.map((patient) => ({
      'Register Number': patient.registernumber || 'N/A',
      Name: patient.name || 'N/A',
      Address: patient.address || 'N/A',
      Phone: patient.mainCaretakerPhone || 'N/A',
      Diagnosis: normalizeDiagnosis(patient.mainDiagnosis).join(', ') || 'N/A',
      Status: patient.deactivated ? 'Inactive' : 'Active',
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients');

    // Define the filename
    const filename = 'patients.xlsx';

    // Save the workbook as an Excel file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>

        {/* Display total number of patients */}
        <div className="mb-3">
          <strong>Total Patients:</strong> {filteredPatients.length}
        </div>

        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, phone number, address, diagnosis, or register number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label>
              Filter by Diagnosis:
              <select
                className="form-control"
                value={selectedDiagnosis}
                onChange={(e) => setSelectedDiagnosis(e.target.value)}
              >
                {uniqueDiagnoses.map((diagnosis) => (
                  <option key={diagnosis} value={diagnosis}>
                    {diagnosis}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-md-3">
            <label>
              Filter by Status:
              <select
                className="form-control"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>
          <div className="col-md-3">
            <label>
              Sort by:
              <select
                className="form-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="registernumber">Register Number</option>
              </select>
            </label>
          </div>
          <div className="col-md-3">
            <label>
              Order:
              <select
                className="form-control"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
        </div>

        {/* <div className="mb-3">
          <button onClick={handleDownloadExcel} className="btn btn-primary">
            Download to Excel
          </button>
        </div> */}

        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Patient Table */}
            <table className="table table-striped table-bordered table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Register Number</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Diagnosis</th>
                  <th>Status</th>
                  <th>View</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.map((patient) => (
                  <tr key={patient.id} className="bg-light">
                    <td>{patient.registernumber || "N/A"}</td>
                    <td>{patient.name || "N/A"}</td>
                    <td>{patient.address || "N/A"}</td>
                    <td>{patient.mainCaretakerPhone || "N/A"}</td>
                    <td>{normalizeDiagnosis(patient.mainDiagnosis).join(", ") || "N/A"}</td>
                    <td>
                      <span
                        style={{
                          color: patient.deactivated ? "red" : "green",
                        }}
                      >
                        {patient.deactivated ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2 mb-3"
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeletePatient(patient.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={handlePreviousPage}>
                      Previous
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">
                      Page {currentPage} of {totalPages}
                    </span>
                  </li>
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={handleNextPage}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PatientTable;