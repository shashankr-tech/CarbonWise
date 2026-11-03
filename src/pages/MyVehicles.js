import { Link } from "react-router-dom";
import { useState } from "react";

import {
  VEHICLES,
  GRID_ELECTRICITY_FACTOR
} from "../utils/emissionFactors";

// Create the initial vehicle list using existing project vehicles
function getDefaultVehicles() {
  return Object.entries(VEHICLES).map(([name, data], index) => {
    const efficiencyUnit =
      data.fuel === "Electricity" ? "kWh/km" : "km/L";

    return {
      id: `default-${index + 1}`,
      name,
      fuel: data.fuel,
      efficiencyValue: Number.parseFloat(data.efficiency),
      efficiencyUnit,
      efficiency: data.efficiency,
      kgPerKm: data.kgPerKm
    };
  });
}

// Load vehicles from localStorage
function loadVehicles() {
  try {
    const saved = localStorage.getItem("carbonWiseVehicles");

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }

    const defaults = getDefaultVehicles();

    localStorage.setItem(
      "carbonWiseVehicles",
      JSON.stringify(defaults)
    );

    return defaults;
  } catch (error) {
    console.error("Unable to load vehicles:", error);
    return getDefaultVehicles();
  }
}

function MyVehicles() {
  const [vehicles, setVehicles] = useState(loadVehicles);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [fuel, setFuel] = useState("Petrol");
  const [efficiency, setEfficiency] = useState("");
  const [error, setError] = useState("");

  // Save the updated vehicle list
  const saveVehicles = (updatedVehicles) => {
    try {
      localStorage.setItem(
        "carbonWiseVehicles",
        JSON.stringify(updatedVehicles)
      );

      setVehicles(updatedVehicles);
      return true;
    } catch (storageError) {
      setError("Unable to save vehicles. Please try again.");
      return false;
    }
  };

  // Calculate estimated emissions per kilometre
  const calculateFactor = (fuelType, efficiencyValue) => {
    if (fuelType === "Petrol") {
      return 2.30 / efficiencyValue;
    }

    if (fuelType === "Diesel") {
      return 2.685 / efficiencyValue;
    }

    return efficiencyValue * GRID_ELECTRICITY_FACTOR;
  };

  // Open the form for adding a vehicle
  const handleAdd = () => {
    setEditingId(null);
    setName("");
    setFuel("Petrol");
    setEfficiency("");
    setError("");
    setShowForm(true);
  };

  // Open the form for editing a vehicle
  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setName(vehicle.name);
    setFuel(vehicle.fuel);
    setEfficiency(String(vehicle.efficiencyValue));
    setError("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add or update a vehicle
  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const efficiencyValue = Number(efficiency);

    if (!trimmedName) {
      setError("Please enter a vehicle name.");
      return;
    }

    if (
      !Number.isFinite(efficiencyValue) ||
      efficiencyValue <= 0
    ) {
      setError("Please enter a valid efficiency value.");
      return;
    }

    // Prevent duplicate vehicle names
    const duplicate = vehicles.some(
      (vehicle) =>
        vehicle.name.toLowerCase() === trimmedName.toLowerCase() &&
        String(vehicle.id) !== String(editingId)
    );

    if (duplicate) {
      setError("A vehicle with this name already exists.");
      return;
    }

    const efficiencyUnit =
      fuel === "Electricity" ? "kWh/km" : "km/L";

    const updatedVehicle = {
      id: editingId || `vehicle-${Date.now()}`,
      name: trimmedName,
      fuel,
      efficiencyValue,
      efficiencyUnit,
      efficiency: `${efficiencyValue} ${efficiencyUnit}`,
      kgPerKm: calculateFactor(fuel, efficiencyValue)
    };

    let updatedVehicles;

    if (editingId) {
      updatedVehicles = vehicles.map((vehicle) =>
        String(vehicle.id) === String(editingId)
          ? updatedVehicle
          : vehicle
      );
    } else {
      updatedVehicles = [...vehicles, updatedVehicle];
    }

    if (saveVehicles(updatedVehicles)) {
      setShowForm(false);
      setEditingId(null);
      setName("");
      setFuel("Petrol");
      setEfficiency("");
    }
  };

  // Delete a vehicle
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Delete this vehicle? Previously saved carbon entries will remain unchanged."
    );

    if (!confirmed) return;

    const updatedVehicles = vehicles.filter(
      (vehicle) => String(vehicle.id) !== String(id)
    );

    saveVehicles(updatedVehicles);
  };

  const electricCount = vehicles.filter(
    (vehicle) => vehicle.fuel === "Electricity"
  ).length;

  const fuelCount = vehicles.length - electricCount;

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

          <Link to="/vehicles" className="sidebar-link active">
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
        <header className="vehicle-header">

          <div>
            <h1>My Vehicles</h1>
            <p>Manage your vehicles and their emission information.</p>
          </div>

          <button
            className="dashboard-add-button vehicle-add-button"
            onClick={handleAdd}
          >
            + Add Vehicle
          </button>

        </header>


        {/* Statistics */}
        <section className="vehicle-stats">

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Vehicles</span>
              <div className="stat-icon green">🚗</div>
            </div>

            <h2>{vehicles.length}</h2>
            <p>Vehicles in your list</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Fuel Vehicles</span>
              <div className="stat-icon orange">⛽</div>
            </div>

            <h2>{fuelCount}</h2>
            <p>Petrol and diesel vehicles</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Electric Vehicles</span>
              <div className="stat-icon blue">⚡</div>
            </div>

            <h2>{electricCount}</h2>
            <p>Electric vehicles</p>
          </div>

        </section>


        {/* Add/Edit Form */}
        {showForm && (

          <section className="dashboard-card vehicle-form-card">

            <div className="vehicle-section-heading">
              <div>
                <h3>
                  {editingId ? "Edit Vehicle" : "Add New Vehicle"}
                </h3>

                <p>Enter your vehicle information below.</p>
              </div>

              <button
                className="vehicle-cancel-button"
                onClick={() => setShowForm(false)}
                type="button"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="vehicle-form-grid">

                <div className="vehicle-form-group">
                  <label>Vehicle Name</label>

                  <input
                    type="text"
                    placeholder="e.g. Honda City"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>

                <div className="vehicle-form-group">
                  <label>Fuel Type</label>

                  <select
                    value={fuel}
                    onChange={(event) => setFuel(event.target.value)}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electricity">Electricity</option>
                  </select>
                </div>

                <div className="vehicle-form-group">
                  <label>
                    {fuel === "Electricity"
                      ? "Energy Consumption (kWh/km)"
                      : "Mileage (km/L)"}
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder={
                      fuel === "Electricity" ? "e.g. 0.15" : "e.g. 18"
                    }
                    value={efficiency}
                    onChange={(event) =>
                      setEfficiency(event.target.value)
                    }
                    required
                  />
                </div>

              </div>

              {error && (
                <p className="vehicle-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="vehicle-save-button">
                {editingId ? "Update Vehicle" : "Save Vehicle"}
              </button>

            </form>

          </section>

        )}


        {/* Vehicle Cards */}
        <section className="vehicle-list-section">

          <div className="vehicle-section-heading">
            <div>
              <h3>Your Registered Vehicles</h3>
              <p>Manage the vehicles used for your carbon calculations.</p>
            </div>
          </div>

          {vehicles.length === 0 ? (

            <div className="dashboard-card vehicle-empty">
              <div>🚗</div>
              <h3>No Vehicles Added</h3>
              <p>Add a vehicle to use it when recording transportation.</p>

              <button
                className="vehicle-save-button"
                onClick={handleAdd}
              >
                Add Your First Vehicle
              </button>
            </div>

          ) : (

            <div className="vehicle-cards-grid">

              {vehicles.map((vehicle) => (

                <div className="dashboard-card vehicle-card" key={vehicle.id}>

                  <div className="vehicle-card-top">

                    <div className="vehicle-icon">
                      {vehicle.fuel === "Electricity" ? "⚡" : "🚗"}
                    </div>

                    <span
                      className={
                        vehicle.fuel === "Electricity"
                          ? "vehicle-type electric"
                          : "vehicle-type fuel"
                      }
                    >
                      {vehicle.fuel}
                    </span>

                  </div>

                  <h3>{vehicle.name}</h3>

                  <div className="vehicle-details">

                    <div>
                      <span>
                        {vehicle.fuel === "Electricity"
                          ? "Energy consumption"
                          : "Mileage"}
                      </span>

                      <strong>{vehicle.efficiency}</strong>
                    </div>

                    <div>
                      <span>Estimated emission factor</span>

                      <strong>
                        {vehicle.kgPerKm.toFixed(4)} kg CO₂e/km
                      </strong>
                    </div>

                  </div>

                  <div className="vehicle-card-actions">

                    <button
                      className="vehicle-edit-button"
                      onClick={() => handleEdit(vehicle)}
                    >
                      Edit
                    </button>

                    <button
                      className="vehicle-delete-button"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        <p className="vehicle-disclaimer">
          Note: Emission factors are approximate estimates used for this project
          demonstration. Actual emissions may vary.
        </p>

      </main>
    </div>
  );
}

export default MyVehicles;