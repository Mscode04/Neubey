import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase/config';
import { useNavigate } from 'react-router-dom';
import './PatientList.css';
import Navbar from './Navbar';
import Footer from './Footer';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 6;
  const [search, setSearch] = useState(''); // For searching by name, address, or phone
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'patients'));
        const patientData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  // Handle patient click
  const handlePatientClick = (patientId) => {
    navigate(`/patient-details/${patientId}`);
  };

  // Search and filter logic
  const filteredPatients = currentPatients.filter((patient) => {
    const patientName = patient.basicDetailsModel?.name?.toLowerCase() || '';
    const patientAddress = patient.basicDetailsModel?.address?.toLowerCase() || '';
    const patientPhone = patient.basicDetailsModel?.phone_number || '';
    const registrationDate = patient.registrationDate ? patient.registrationDate.toDate() : null;

    // Search logic for name, address, phone
    const matchesSearch = 
      patientName.includes(search.toLowerCase()) ||
      patientAddress.includes(search.toLowerCase()) ||
      patientPhone.includes(search);

    // Date filter logic
    const matchesStartDate = startDate ? new Date(startDate) <= registrationDate : true;
    const matchesEndDate = endDate ? new Date(endDate) >= registrationDate : true;

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <>
      <Navbar />
      <div className="patient-list-container">
        <h1 className="page-title">Patient List</h1>

        {/* Search and Filter Controls */}
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search Patient"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="patient-list">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="patient-card"
              onClick={() => handlePatientClick(patient.id)}
            >
              <div className="card-header">
                <h3 className="patient-name">{patient.basicDetailsModel?.name || 'N/A'}</h3>
              </div>
              <div className="card-body">
                <p><strong>Address:</strong> {patient.basicDetailsModel?.address || 'N/A'}</p>
                <p><strong>DOB:</strong> {patient.basicDetailsModel?.dob || 'N/A'}</p>
                <p><strong>Email:</strong> {patient.basicDetailsModel?.email || 'N/A'}</p>
                <p><strong>Gender:</strong> {patient.basicDetailsModel?.gender || 'N/A'}</p>
                <p><strong>Phone:</strong> {patient.basicDetailsModel?.phone_number || 'N/A'}</p>
                <p><strong>Panchayath:</strong> {patient.basicDetailsModel?.panchayath || 'N/A'}</p>
                <p><strong>Ward:</strong> {patient.basicDetailsModel?.ward || 'N/A'}</p>
                <p><strong>Registration Date:</strong> {patient.registrationDate ? patient.registrationDate.toDate().toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}>
              <a className="page-link" href="#">Previous</a>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => paginate(index + 1)}
              >
                <a className="page-link" href="#">{index + 1}</a>
              </li>
            ))}
            <li className="page-item" onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}>
              <a className="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
      <Footer />
    </>
  );
}

export default PatientList;
