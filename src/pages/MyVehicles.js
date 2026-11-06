import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

import { apiRequest } from "../utils/api";

function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [fuel, setFuel] = useState("Petrol");
  const [efficiency, setEfficiency] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Load this user's vehicles from MongoDB
  useEffect(() => {
    let cancelled = false;

    const loadVehicles = async () => {
      try {
        const data = await apiRequest("/vehicles");

        if (!cancelled) {
          setVehicles(Array.isArray(data.vehicles) ? data.vehicles : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load vehicles.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

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

  // Add or update a vehicle in MongoDB
  const handleSubmit = async (event) => {
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

    const payload = {
      name: trimmedName,
      fuel,
      efficiencyValue
    };

    setSaving(true);

    try {
      if (editingId) {
        const data = await apiRequest(`/vehicles/${editingId}`, {
          method: "PUT",
          body: payload
        });

        setVehicles((current) =>
          current.map((vehicle) =>
            String(vehicle.id) === String(editingId)
              ? data.vehicle
              : vehicle
          )
        );
      } else {
        const data = await apiRequest("/vehicles", {
          method: "POST",
          body: payload
        });

        setVehicles((current) => [...current, data.vehicle]);
      }

      setShowForm(false);
      setEditingId(null);
      setName("");
      setFuel("Petrol");
      setEfficiency("");
    } catch (saveError) {
      setError(saveError.message || "Unable to save vehicle.");
    } finally {
      setSaving(false);
    }
  };

  // Delete a vehicle from MongoDB
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this vehicle? Previously saved carbon entries will remain unchanged."
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/vehicles/${id}`, { method: "DELETE" });

      setVehicles((current) =>
        current.filter((vehicle) => String(vehicle.id) !== String(id))
      );
      setError("");
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete vehicle.");
    }
  };

  const electricCount = vehicles.filter(
    (vehicle) => vehicle.fuel === "Electricity"
  ).length;

  const fuelCount = vehicles.length - electricCount;

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <Sidebar />


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

              <button
                type="submit"
                className="vehicle-save-button"
                disabled={saving}
              >
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

          {!showForm && error && (
            <p className="vehicle-error" role="alert">
              {error}
            </p>
          )}

          {loading ? (

            <div className="dashboard-card vehicle-empty">
              <p>Loading your vehicles...</p>
            </div>

          ) : vehicles.length === 0 ? (

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