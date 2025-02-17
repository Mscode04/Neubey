import React, { useState, useEffect } from "react";
import { db } from "./Firebase/config";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
const App = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [pin, setPin] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [regNoFilter, setRegNoFilter] = useState("");
  const [formTypeFilter, setFormTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10); // Number of reports per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const querySnapshot = await getDocs(collection(db, "Reports"));
        const reportsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReports(reportsData);
        setFilteredReports(reportsData); // Initialize filtered reports
      } catch (error) {
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    let filteredData = [...reports];

    // Apply filters
    if (nameFilter) {
      filteredData = filteredData.filter((report) =>
        report.name?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (addressFilter) {
      filteredData = filteredData.filter((report) =>
        report.address?.toLowerCase().includes(addressFilter.toLowerCase())
      );
    }
    if (regNoFilter) {
      filteredData = filteredData.filter((report) =>
        report.registernumber?.toLowerCase().includes(regNoFilter.toLowerCase())
      );
    }
    if (formTypeFilter) {
      filteredData = filteredData.filter((report) =>
        report.formType === formTypeFilter
      );
    }
    if (startDate || endDate) {
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;
      if (endDateObj) {
        endDateObj.setHours(23, 59, 59, 999); // Include the entire end date
      }

      filteredData = filteredData.filter((report) => {
        const submittedAtDate = new Date(report.submittedAt);
        if (startDateObj && submittedAtDate < startDateObj) return false;
        if (endDateObj && submittedAtDate > endDateObj) return false;
        return true;
      });
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      const dateA = new Date(a.submittedAt);
      const dateB = new Date(b.submittedAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredReports(filteredData);
  }, [reports, nameFilter, addressFilter, regNoFilter, formTypeFilter, startDate, endDate, sortOrder]);

  // Get current reports
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getReportDetailsRoute = (formType, reportId) => {
    switch (formType) {
      case "NHC": return `/reportsdetailnhc/${reportId}`;
      case "NHC(E)": return `/reportsdetailnhce/${reportId}`;
      case "DHC": return `/report-details-dhc/${reportId}`;
      case "PROGRESSION REPORT": return `/report-details-progression/${reportId}`;
      case "SOCIAL REPORT": return `/report-details-social/${reportId}`;
      case "VHC": return `/report-details-vhc/${reportId}`;
      case "GVHC": return `/report-details-vhc/${reportId}`;
      case "INVESTIGATION": return `/report-details-investigation/${reportId}`;
      case "DEATH": return `/report-details-death/${reportId}`;
      default: return `/report-details-default/${reportId}`;
    }
  };

  const handleDeleteClick = (reportId) => {
    setReportToDelete(reportId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (pin === "2012") {
      try {
        await deleteDoc(doc(db, "Reports", reportToDelete));
        setReports(reports.filter((report) => report.id !== reportToDelete));
        setShowConfirmation(false);
        setPin("");
        toast.success("Report deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete report.");
      }
    } else {
      toast.error("Incorrect PIN.");
    }
  };
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredReports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

    // Define the filename
    const filename = 'reports.xlsx';

    // Use a library like FileSaver.js to save the file
    XLSX.writeFile(workbook, filename);
  };
  return (
    <>
      <Navbar />
      <div className="app-container">
        <ToastContainer position="top-center" autoClose={3000} />
        <h2 className="app-heading">All Reports</h2>

        {/* Filters */}
        <div className="filters-container">
          <input
            type="text"
            placeholder="Search by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="form-control"
          />
          <input
            type="text"
            placeholder="Search by Address"
            value={addressFilter}
            onChange={(e) => setAddressFilter(e.target.value)}
            className="form-control"
          />
          <input
            type="text"
            placeholder="Search by Reg No"
            value={regNoFilter}
            onChange={(e) => setRegNoFilter(e.target.value)}
            className="form-control"
          />
          <select
            value={formTypeFilter}
            onChange={(e) => setFormTypeFilter(e.target.value)}
            className="form-control"
          >
            <option value="">All Form Types</option>
            <option value="NHC">NHC</option>
            <option value="NHC(E)">NHC(E)</option>
            <option value="DHC">DHC</option>
            <option value="PROGRESSION REPORT">Progression Report</option>
            <option value="SOCIAL REPORT">Social Report</option>
            <option value="VHC">VHC</option>
            <option value="GVHC">GVHC</option>
            <option value="INVESTIGATION">Investigation</option>
            <option value="DEATH">Death</option>
          </select>
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control"
          />
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="form-control"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        {/* <button onClick={handleDownloadExcel} className="btn btn-primary">
            Download to Excel
          </button> */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <table className="app-table table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Form Type</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Submitted At</th>
                  <th>Reg No</th>
                  <th>View</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <Link to={getReportDetailsRoute(report.formType, report.id)} className="text-primary">
                        {report.formType}
                      </Link>
                    </td>
                    <td>{report.name || "No Name"}</td>
                    <td>{report.address || "No Address"}</td>
                    <td>{report.submittedAt ? new Date(report.submittedAt).toLocaleString() : "No date available"}</td>
                    <td>{report.registernumber || "No Register Number"}</td>
                    <td>   <Link to={getReportDetailsRoute(report.formType, report.id)} className="btn btn-primary btn-sm me-2 mb-3">
                    <i className="bi bi-eye-fill"></i>
                      </Link></td>
                    <td>
                      <button onClick={() => handleDeleteClick(report.id)} className="btn btn-danger">
                      <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button onClick={() => paginate(currentPage - 1)} className="page-link">
                    Previous
                  </button>
                </li>
                <li className={`page-item ${currentPage === Math.ceil(filteredReports.length / reportsPerPage) ? 'disabled' : ''}`}>
                  <button onClick={() => paginate(currentPage + 1)} className="page-link">
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}

        {showConfirmation && (
          <div className="confirmation-box">
            <p>Enter PIN to delete the report:</p>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="form-control"
            />
            <button onClick={handleConfirmDelete} className="btn btn-danger">Confirm</button>
            <button onClick={() => setShowConfirmation(false)} className="btn btn-secondary">Cancel</button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;