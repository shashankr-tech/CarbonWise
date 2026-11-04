import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Load vehicles from My Vehicles
function getVehicles() {
  try {
    const saved = localStorage.getItem("carbonWiseVehicles");
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to load vehicles:", error);
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

function RTOSubmission() {
  const vehicles = getVehicles();

  const [reports, setReports] = useState([]);

  const [ownerName, setOwnerName] = useState(() => {
    try {
      const profile = JSON.parse(
        localStorage.getItem("carbonWiseProfile") || "{}"
      );

      return profile.fullName || "";
    } catch {
      return "";
    }
  });

  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [vehicleId, setVehicleId] = useState(
    vehicles.length > 0 ? String(vehicles[0].id) : ""
  );
  const [city, setCity] = useState("");
  const [odometer, setOdometer] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch this user's previous RTO submissions from MongoDB
  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const token = localStorage.getItem("carbonWiseToken");

        if (!token) {
          throw new Error("Please log in again to view your submissions.");
        }

        const response = await fetch(
          "http://localhost:5000/api/rto/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your submissions.");
        }

        setReports(Array.isArray(data.reports) ? data.reports : []);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load your submissions.");
      }
    };

    fetchMyReports();
  }, []);

  // Find selected vehicle
  const selectedVehicle = vehicles.find(
    (vehicle) => String(vehicle.id) === vehicleId
  );

  // Submit vehicle information to the backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (vehicles.length === 0) {
      setError("Please add a vehicle in My Vehicles first.");
      return;
    }

    if (!ownerName.trim()) {
      setError("Please enter the vehicle owner's name.");
      return;
    }

    if (!registrationNumber.trim()) {
      setError("Please enter the vehicle registration number.");
      return;
    }

    if (!selectedVehicle) {
      setError("Please select a vehicle.");
      return;
    }

    if (!city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (
      odometer === "" ||
      !Number.isFinite(Number(odometer)) ||
      Number(odometer) < 0
    ) {
      setError("Please enter a valid odometer reading.");
      return;
    }

    // Prepare vehicle information for the backend
    const report = {
      ownerName: ownerName.trim(),
      email: email.trim(),
      registrationNumber: registrationNumber.trim().toUpperCase(),
      vehicleId: String(selectedVehicle.id),
      vehicleName: selectedVehicle.name,
      fuel: selectedVehicle.fuel,
      efficiency: selectedVehicle.efficiency,
      emissionFactor: Number(selectedVehicle.kgPerKm),
      city: city.trim(),
      odometer: Number(odometer),
      notes: notes.trim()
    };

    try {
      // Get the JWT token saved during login
      const token = localStorage.getItem("carbonWiseToken");

      if (!token) {
        throw new Error("Please log in again before submitting vehicle information.");
      }

      // Send the report to the backend
      const response = await fetch(
        "http://localhost:5000/api/rto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(report)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit vehicle information.");
      }

      // Add the MongoDB report to the displayed submissions
      setReports((currentReports) => [data.report, ...currentReports]);

      // Clear selected form fields after successful submission
      setRegistrationNumber("");
      setOdometer("");
      setNotes("");

      setSuccessMessage(
        `Submission successful! Reference Number: ${data.report.requestNumber}`
      );
    } catch (submitError) {
      setError(
        submitError.message || "Unable to connect to the backend."
      );
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
            Dashboard
          </Link>

          <Link to="/add-entry" className="sidebar-link">
            <span>＋</span>
            Add Carbon Entry
          </Link>

          <Link to="/vehicles" className="sidebar-link">
            <span>🚗</span>
            My Vehicles
          </Link>

          <Link to="/history" className="sidebar-link">
            <span>◷</span>
            Carbon History
          </Link>

          <Link to="/analytics" className="sidebar-link">
            <span>▥</span>
            Analytics
          </Link>

          <Link to="/profile" className="sidebar-link">
            <span>◉</span>
            Profile
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="sidebar-link logout-link">
            <span>↪</span>
            Logout
          </Link>
        </div>

      </aside>


      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="rto-header">

          <div>
            <h1>RTO Vehicle Data Submission</h1>
            <p>
              Submit your vehicle information for RTO review.
            </p>
          </div>

          <Link
            to="/rto-dashboard"
            className="dashboard-add-button"
          >
            RTO Officer Portal →
          </Link>

        </header>


        {/* Information Notice */}
        <div className="rto-notice">
          <span>ℹ️</span>

          <div>
            <strong>Demonstration Portal</strong>

            <p>
              This is a CarbonWise prototype. Submitted vehicle
              information is stored in the CarbonWise database for
              demonstration and is not sent to an actual RTO.
            </p>
          </div>
        </div>


        {/* Submission Form */}
        <section className="dashboard-card rto-form-card">

          <div className="rto-section-heading">
            <div>
              <h3>Vehicle Information Form</h3>
              <p>Enter the owner's and vehicle's details.</p>
            </div>
          </div>

          {vehicles.length === 0 ? (

            <div className="rto-empty">
              <h3>No Vehicles Available</h3>

              <p>
                Add a vehicle before submitting its details.
              </p>

              <Link to="/vehicles" className="rto-submit-button">
                Go to My Vehicles
              </Link>
            </div>

          ) : (

            <form onSubmit={handleSubmit}>

              <div className="rto-form-grid">

                <div className="rto-form-group">
                  <label>Vehicle Owner Name *</label>

                  <input
                    type="text"
                    placeholder="Enter owner's name"
                    value={ownerName}
                    onChange={(event) =>
                      setOwnerName(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="rto-form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </div>

                <div className="rto-form-group">
                  <label>Vehicle Registration Number *</label>

                  <input
                    type="text"
                    placeholder="e.g. MH02AB1234"
                    value={registrationNumber}
                    maxLength={15}
                    onChange={(event) =>
                      setRegistrationNumber(event.target.value.toUpperCase())
                    }
                    required
                  />
                </div>

                <div className="rto-form-group">
                  <label>Select Vehicle *</label>

                  <select
                    value={vehicleId}
                    onChange={(event) => setVehicleId(event.target.value)}
                    required
                  >
                    <option value="">Select a vehicle</option>

                    {vehicles.map((vehicle) => (
                      <option
                        key={vehicle.id}
                        value={String(vehicle.id)}
                      >
                        {vehicle.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rto-form-group">
                  <label>City *</label>

                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    required
                  />
                </div>

                <div className="rto-form-group">
                  <label>Current Odometer Reading (km) *</label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Enter odometer reading"
                    value={odometer}
                    onChange={(event) => setOdometer(event.target.value)}
                    required
                  />
                </div>

              </div>


              {/* Selected Vehicle Summary */}
              {selectedVehicle && (

                <div className="rto-vehicle-summary">

                  <h4>Selected Vehicle Details</h4>

                  <div>
                    <span>Vehicle:</span>
                    <strong>{selectedVehicle.name}</strong>
                  </div>

                  <div>
                    <span>Fuel Type:</span>
                    <strong>{selectedVehicle.fuel}</strong>
                  </div>

                  <div>
                    <span>Efficiency:</span>
                    <strong>{selectedVehicle.efficiency}</strong>
                  </div>

                  <div>
                    <span>Estimated Emission Factor:</span>

                    <strong>
                      {Number(selectedVehicle.kgPerKm).toFixed(4)} kg CO₂e/km
                    </strong>
                  </div>

                </div>

              )}


              <div className="rto-form-group rto-notes-group">
                <label>Additional Information (Optional)</label>

                <textarea
                  rows="3"
                  placeholder="Enter any additional information..."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </div>


              {error && (
                <p className="rto-error" role="alert">
                  {error}
                </p>
              )}

              {successMessage && (
                <p className="rto-success" role="status">
                  {successMessage}
                </p>
              )}


              <button
                type="submit"
                className="rto-submit-button"
              >
                Submit Vehicle Information
              </button>

            </form>

          )}

        </section>


        {/* Previous Submissions */}
        <section className="dashboard-card rto-previous-card">

          <div className="rto-section-heading">
            <div>
              <h3>My Previous Submissions</h3>
              <p>Track the information you have submitted.</p>
            </div>
          </div>

          {reports.length === 0 ? (

            <p className="rto-no-reports">
              You haven't submitted any vehicle information yet.
            </p>

          ) : (

            <div className="rto-submission-list">

              {reports.slice(0, 5).map((report) => (

                <div className="rto-submission-item" key={report.id}>

                  <div>
                    <strong>{report.registrationNumber}</strong>

                    <p>
                      {report.vehicleName} • {formatDate(report.submittedAt)}
                    </p>

                    <span>{report.requestNumber}</span>
                  </div>

                  <span className="rto-pending-status">
                    {report.status}
                  </span>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>
    </div>
  );
}

export default RTOSubmission;