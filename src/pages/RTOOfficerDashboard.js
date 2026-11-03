import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Load submitted reports
function getReports() {
  try {
    const saved = localStorage.getItem("carbonWiseRTOReports");
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to load RTO reports:", error);
    return [];
  }
}

// Format submission date
function formatDate(dateValue) {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function RTOOfficerDashboard() {
  const [reports, setReports] = useState(getReports);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Refresh reports when returning to this page
  useEffect(() => {
    const refreshReports = () => {
      setReports(getReports());
    };

    window.addEventListener("storage", refreshReports);
    window.addEventListener("focus", refreshReports);

    return () => {
      window.removeEventListener("storage", refreshReports);
      window.removeEventListener("focus", refreshReports);
    };
  }, []);

  // Summary statistics
  const pendingCount = reports.filter(
    (report) => report.status === "Pending Review"
  ).length;

  const approvedCount = reports.filter(
    (report) => report.status === "Approved"
  ).length;

  const informationCount = reports.filter(
    (report) => report.status === "Needs Information"
  ).length;

  // Search and filter reports
  const filteredReports = [...reports]
    .filter((report) => {
      const searchableText = [
        report.requestNumber,
        report.ownerName,
        report.email,
        report.registrationNumber,
        report.vehicleName,
        report.city
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        searchText.trim().toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() -
        new Date(a.submittedAt).getTime()
    );

  // Update submission status
  const updateStatus = (id, newStatus) => {
    const updatedReports = reports.map((report) =>
      String(report.id) === String(id)
        ? {
            ...report,
            status: newStatus,
            reviewedAt: new Date().toISOString()
          }
        : report
    );

    try {
      localStorage.setItem(
        "carbonWiseRTOReports",
        JSON.stringify(updatedReports)
      );

      setReports(updatedReports);
      setMessage(`Submission status updated to "${newStatus}".`);
      setError("");
    } catch (storageError) {
      setError("Unable to update the submission. Please try again.");
      setMessage("");
    }
  };

  // Status CSS class
  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "rto-status-approved";

      case "Needs Information":
        return "rto-status-information";

      default:
        return "rto-status-pending";
    }
  };

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">↗</div>
          <span>
            Carbon<span>Wise</span>
          </span>
        </div>

        <nav className="sidebar-nav">

          <Link to="/dashboard" className="sidebar-link">
            <span>▣</span>
            Main Dashboard
          </Link>

          <Link to="/rto-submit" className="sidebar-link">
            <span>＋</span>
            Vehicle Submission
          </Link>

          <Link
            to="/rto-dashboard"
            className="sidebar-link active"
          >
            <span>▤</span>
            RTO Officer Portal
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="sidebar-link logout-link">
            <span>↪</span>
            Exit Portal
          </Link>
        </div>

      </aside>


      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="rto-officer-header">

          <div>
            <h1>RTO Officer Dashboard</h1>
            <p>
              Review and manage submitted vehicle information.
            </p>
          </div>

          <Link
            to="/rto-submit"
            className="dashboard-add-button"
          >
            ← Submission Portal
          </Link>

        </header>


        {/* Prototype Notice */}
        <div className="rto-notice">
          <span>ℹ️</span>

          <div>
            <strong>RTO Officer Demonstration Portal</strong>

            <p>
              This is a simulated officer interface for the CarbonWise
              project. All records and status updates are stored locally.
            </p>
          </div>
        </div>


        {/* Summary Cards */}
        <section className="stats-grid rto-officer-stats">

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Submissions</span>
              <div className="stat-icon blue">▤</div>
            </div>

            <h2>{reports.length}</h2>
            <p>All submitted vehicle records</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Pending Review</span>
              <div className="stat-icon orange">◷</div>
            </div>

            <h2>{pendingCount}</h2>
            <p>Awaiting officer review</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Approved</span>
              <div className="stat-icon green">✓</div>
            </div>

            <h2>{approvedCount}</h2>
            <p>Approved submissions</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Needs Information</span>
              <div className="stat-icon orange">!</div>
            </div>

            <h2>{informationCount}</h2>
            <p>Require additional details</p>
          </div>

        </section>


        {/* Review Messages */}
        {message && (
          <p className="rto-officer-success" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="rto-error" role="alert">
            {error}
          </p>
        )}


        {/* Filters */}
        <section className="dashboard-card rto-officer-filter">

          <div className="rto-section-heading">
            <div>
              <h3>Vehicle Submissions</h3>
              <p>Search and review submitted vehicle records.</p>
            </div>
          </div>

          <div className="rto-officer-filters">

            <div className="rto-officer-search">
              <label>Search Submissions</label>

              <input
                type="text"
                placeholder="Search registration, owner, vehicle or reference..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>

            <div className="rto-officer-status-filter">
              <label>Filter by Status</label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Needs Information">Needs Information</option>
              </select>
            </div>

          </div>

        </section>


        {/* Submission Records */}
        <section className="rto-officer-records">

          {filteredReports.length === 0 ? (

            <div className="dashboard-card rto-officer-empty">
              <div>📋</div>
              <h3>No Submissions Found</h3>

              <p>
                There are no vehicle submissions matching your search.
              </p>
            </div>

          ) : (

            filteredReports.map((report) => (

              <div className="dashboard-card rto-officer-record" key={report.id}>

                {/* Record Header */}
                <div className="rto-record-header">

                  <div>
                    <span className="rto-record-reference">
                      {report.requestNumber}
                    </span>

                    <h3>{report.registrationNumber}</h3>

                    <p>
                      Submitted on {formatDate(report.submittedAt)}
                    </p>
                  </div>

                  <span
                    className={`rto-officer-status ${getStatusClass(report.status)}`}
                  >
                    {report.status}
                  </span>

                </div>


                {/* Record Details */}
                <div className="rto-record-grid">

                  <div>
                    <span>Vehicle Owner</span>
                    <strong>{report.ownerName}</strong>
                  </div>

                  <div>
                    <span>Vehicle</span>
                    <strong>{report.vehicleName}</strong>
                  </div>

                  <div>
                    <span>Fuel Type</span>
                    <strong>{report.fuel}</strong>
                  </div>

                  <div>
                    <span>City</span>
                    <strong>{report.city}</strong>
                  </div>

                  <div>
                    <span>Odometer Reading</span>
                    <strong>{report.odometer} km</strong>
                  </div>

                  <div>
                    <span>Emission Factor</span>
                    <strong>
                      {Number(report.emissionFactor).toFixed(4)} kg CO₂e/km
                    </strong>
                  </div>

                </div>


                {/* Additional Information */}
                <details className="rto-record-extra">

                  <summary>View Additional Information</summary>

                  <div>
                    <p>
                      <strong>Email:</strong>{" "}
                      {report.email || "Not provided"}
                    </p>

                    <p>
                      <strong>Vehicle Efficiency:</strong>{" "}
                      {report.efficiency}
                    </p>

                    <p>
                      <strong>Additional Notes:</strong>{" "}
                      {report.notes || "No additional notes"}
                    </p>

                    <p>
                      <strong>Request Reference:</strong>{" "}
                      {report.requestNumber}
                    </p>

                    <p>
                      <strong>Last Reviewed:</strong>{" "}
                      {report.reviewedAt
                        ? formatDate(report.reviewedAt)
                        : "Not reviewed yet"}
                    </p>
                  </div>

                </details>


                {/* Officer Actions */}
                <div className="rto-record-actions">

                  <span>Officer Actions</span>

                  <div>

                    <button
                      className="rto-approve-button"
                      onClick={() => updateStatus(report.id, "Approved")}
                    >
                      ✓ Approve
                    </button>

                    <button
                      className="rto-information-button"
                      onClick={() =>
                        updateStatus(report.id, "Needs Information")
                      }
                    >
                      Request Information
                    </button>

                    <button
                      className="rto-reset-button"
                      onClick={() => updateStatus(report.id, "Pending Review")}
                    >
                      Reset to Pending
                    </button>

                  </div>

                </div>

              </div>

            ))

          )}

        </section>

      </main>
    </div>
  );
}

export default RTOOfficerDashboard;