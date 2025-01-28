import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from './Firebase/config';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './Navbar';
import Footer from './Footer';

function App() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [formTypeFilter, setFormTypeFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reportsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        const reportsRef = collection(db, "Reports");
        let q = query(reportsRef);

        if (nameFilter) {
          q = query(q, where("name", ">=", nameFilter), where("name", "<=", nameFilter + "\uf8ff"));
        }
        if (formTypeFilter) {
          q = query(q, where("formType", "==", formTypeFilter));
        }
        if (addressFilter) {
          q = query(q, where("address", ">=", addressFilter), where("address", "<=", addressFilter + "\uf8ff"));
        }

        const querySnapshot = await getDocs(q);
        let reportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (startDate || endDate) {
          const startDateObj = startDate ? new Date(startDate) : null;
          const endDateObj = endDate ? new Date(endDate) : null;
          if (endDateObj) {
            endDateObj.setHours(23, 59, 59, 999);
          }

          reportsData = reportsData.filter((report) => {
            const submittedAtDate = new Date(report.submittedAt);
            if (startDateObj && submittedAtDate < startDateObj) return false;
            if (endDateObj && submittedAtDate > endDateObj) return false;
            return true;
          });
        }

        setReports(reportsData);
        setFilteredReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports: ", error);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [nameFilter, formTypeFilter, addressFilter, startDate, endDate]);

  const getReportDetailsRoute = (formType, reportId) => {
    switch (formType) {
      case "NHC":
        return `/reportsdetailnhc/${reportId}`;
      case "NHC(E)":
        return `/reportsdetailnhce/${reportId}`;
      case "DHC":
        return `/report-details-dhc/${reportId}`;
      case "PROGRESSION REPORT":
        return `/report-details-progression/${reportId}`;
      case "SOCIAL REPORT":
        return `/report-details-social/${reportId}`;
      case "VHC":
        return `/report-details-vhc/${reportId}`;
      case "GVHC":
        return `/report-details-vhc/${reportId}`;
      case "INVESTIGATION":
        return `/report-details-investigation/${reportId}`;
      case "DEATH":
        return `/report-details-death/${reportId}`;
      default:
        return `/report-details-default/${reportId}`;
    }
  };

  const handleReportClick = (report) => {
    const route = getReportDetailsRoute(report.formType, report.id);
    navigate(route);
  };

  const handleDeleteClick = (reportId) => {
    setReportToDelete(reportId);
    setShowConfirmation(true);
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };

  const handleConfirmDelete = async () => {
    if (pin === "2012") {
      try {
        await deleteDoc(doc(db, "Reports", reportToDelete));
        setReports(reports.filter((report) => report.id !== reportToDelete));
        setFilteredReports(filteredReports.filter((report) => report.id !== reportToDelete));
        setShowConfirmation(false);
        setPin("");
        toast.success("Report deleted successfully!");
      } catch (error) {
        console.error("Error deleting report: ", error);
        toast.error("Failed to delete report.");
      }
    } else {
      toast.error("Incorrect PIN.");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setPin("");
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <div className="apphome-container">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastStyle={{ marginTop: "20px" }}
        />

        <div className="apphome-filter-container">
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Search by Name"
            className="apphome-filter-input"
          />
          <select
            value={formTypeFilter}
            onChange={(e) => setFormTypeFilter(e.target.value)}
            className="apphome-filter-select"
          >
            <option value="">Select Form Type</option>
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
            type="text"
            value={addressFilter}
            onChange={(e) => setAddressFilter(e.target.value)}
            placeholder="Search by Address"
            className="apphome-filter-input"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            className="apphome-filter-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            className="apphome-filter-input"
          />
        </div>

        {loading ? (
          <p className="apphome-loading">Loading reports...</p>
        ) : error ? (
          <p className="apphome-error">{error}</p>
        ) : filteredReports.length === 0 ? (
          <p className="apphome-no-reports">No reports found.</p>
        ) : (
          <>
            <div className="row">
              {currentReports.map((report) => (
                <div key={report.id} className="col-md-4 mb-4">
                  <div
                    className="apphome-report-card"
                    onClick={() => handleReportClick(report)}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{report.formType || "Report Title"}</h5>
                      <p className="card-text">
                        <strong>Patient Name: </strong>
                        {report.name || 'Unknown'}
                        <br />
                        <strong>Address: </strong>
                        {report.address}
                        <br />
                        <strong>Date: </strong>
                        {report.submittedAt
                          ? new Date(report.submittedAt).toLocaleString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                              hour12: true,
                            })
                          : "No date available"}
                      </p>
                    </div>
                  <button
                    onClick={() => handleDeleteClick(report.id)}
                    className="apphome-delete-button"
                  >
                    Delete
                  </button>
                  </div>
                </div>
              ))}
            </div>

            <nav aria-label="Page navigation example">
              <ul className="apphome-pagination">
                <li className="apphome-page-item">
                  <button
                    className="apphome-page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(Math.ceil(filteredReports.length / reportsPerPage)).keys()].map((num) => (
                  <li
                    key={num}
                    className={`apphome-page-item ${currentPage === num + 1 ? 'apphome-active' : ''}`}
                  >
                    <button
                      className="apphome-page-link"
                      onClick={() => paginate(num + 1)}
                    >
                      {num + 1}
                    </button>
                  </li>
                ))}
                <li className="apphome-page-item">
                  <button
                    className="apphome-page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredReports.length / reportsPerPage)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}

        {showConfirmation && (
          <div className="apphome-confirmation-box">
            <p>Enter PIN to delete the report:</p>
            <input
              type="password"
              value={pin}
              onChange={handlePinChange}
              placeholder="Enter PIN"
              className="apphome-pin-input"
            />
            <button onClick={handleConfirmDelete} className="apphome-confirm-button">
              Confirm
            </button>
            <button onClick={handleCancelDelete} className="apphome-cancel-button">
              Cancel
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;