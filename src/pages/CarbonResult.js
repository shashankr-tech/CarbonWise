
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function getPendingEntry() {
  try {
    const data = sessionStorage.getItem("carbonWisePendingEntry");

    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

function CarbonResult() {
  const navigate = useNavigate();

  const [entry] = useState(getPendingEntry);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // The entry was already saved to MongoDB when it was submitted.
  // Dashboard, History and Analytics read it from there.
  const handleSave = () => {
    setSaved(true);
    setError("");
  };

  // Handle missing result
  if (!entry) {
    return (
      <div className="result-page">
        <div className="result-container result-empty">
          <h2>No Carbon Result Found</h2>

          <p>
            Please add a carbon activity first.
          </p>

          <Link to="/add-entry" className="result-button">
            Add Carbon Entry
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(
    `${entry.date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="result-page">

      <div className="result-container">

        {/* Back Link */}

        <Link to="/add-entry" className="result-back">
          ← Back to Add Entry
        </Link>

        {/* Header */}

        <div className="result-header">
          <h1>Your Carbon Footprint</h1>

          <p>
            Here is the estimated environmental impact
            of your activity.
          </p>
        </div>

        {/* Main Result */}

        <div className="result-card">

          <div className="result-total">
            <span>Estimated Carbon Emissions</span>

            <h2>
              {entry.emissions.toFixed(2)}
              <small> kg CO₂e</small>
            </h2>

            <p>
              {entry.category}
            </p>
          </div>

          <div className="result-status">
            🌱 Calculation completed successfully
          </div>

        </div>

        {/* Activity Details */}

        <div className="result-card">

          <h3>Activity Summary</h3>

          <div className="result-details-grid">

            <div className="result-detail">
              <span>Category</span>
              <strong>{entry.category}</strong>
            </div>

            <div className="result-detail">
              <span>Activity</span>
              <strong>{entry.activity}</strong>
            </div>

            <div className="result-detail">
              <span>Quantity</span>
              <strong>
                {entry.quantity} {entry.unit}
              </strong>
            </div>

            <div className="result-detail">
              <span>Date</span>
              <strong>{formattedDate}</strong>
            </div>

            {entry.transportMode && (
              <div className="result-detail">
                <span>Transportation Mode</span>
                <strong>{entry.transportMode}</strong>
              </div>
            )}

            {entry.vehicle && (
              <div className="result-detail">
                <span>Vehicle</span>
                <strong>{entry.vehicle}</strong>
              </div>
            )}

            {entry.fuelType && (
              <div className="result-detail">
                <span>Fuel Type</span>
                <strong>{entry.fuelType}</strong>
              </div>
            )}

          </div>

        </div>

        {/* Calculation Breakdown */}

        <div className="result-card">

          <h3>Emission Breakdown</h3>

          <p className="result-description">
            The estimated emissions are calculated
            using the following emission factor.
          </p>

          <div className="result-formula">

            <span>Emission Factor</span>

            <strong>
              {entry.emissionFactor.toFixed(4)} kg CO₂e /
              {entry.factorUnit}
            </strong>

            <div className="result-divider"></div>

            <span>Calculation Formula</span>

            <strong>{entry.formula}</strong>

            <div className="result-divider"></div>

            <span>Total Emissions</span>

            <strong className="result-emission">
              {entry.emissions.toFixed(2)} kg CO₂e
            </strong>

          </div>

        </div>

        {/* Disclaimer */}

        <p className="result-disclaimer">
          Note: This is an estimated carbon footprint based
          on default emission factors. Actual emissions may vary.
        </p>

        {/* Error */}

        {error && (
          <p className="result-error" role="alert">
            {error}
          </p>
        )}

        {/* Actions */}

        <div className="result-actions">

          {!saved ? (
            <button
              onClick={handleSave}
              className="result-button"
            >
              Save Entry
            </button>
          ) : (
            <div className="result-message">
              ✓ Entry saved successfully!
            </div>
          )}

          <button
            onClick={() => navigate("/add-entry")}
            className="result-button secondary"
          >
            Add Another Entry
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="result-button secondary"
          >
            Go to Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}

export default CarbonResult;
