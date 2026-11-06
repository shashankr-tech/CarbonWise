import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../utils/api";

import {
  TRANSPORT_FACTORS,
  GRID_ELECTRICITY_FACTOR,
  HOUSEHOLD_FUEL_FACTORS,
  WATER_FACTOR
} from "../utils/emissionFactors";

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function AddCarbonEntry() {
  const navigate = useNavigate();

  // Category
  const [category, setCategory] = useState("Transportation");

  // Transportation
  const [transportMode, setTransportMode] = useState("Personal Vehicle");
  const [vehicle, setVehicle] = useState("");
  const [distance, setDistance] = useState("");

  // Electricity
  const [electricity, setElectricity] = useState("");

  // Household Fuel
  const [fuelType, setFuelType] = useState("LPG");
  const [fuelQuantity, setFuelQuantity] = useState("");

  // Water
  const [waterQuantity, setWaterQuantity] = useState("");

  // Date
  const [entryDate, setEntryDate] = useState(getTodayDate());

  // Validation error
  const [error, setError] = useState("");

  // The user's registered vehicles (from MongoDB)
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

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
          setError(loadError.message || "Unable to load your vehicles.");
        }
      } finally {
        if (!cancelled) {
          setVehiclesLoading(false);
        }
      }
    };

    loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    let activity = "";
    let quantity = 0;
    let unit = "";
    let factor = 0;
    let factorUnit = "";
    let emissions = 0;
    let formula = "";

    // TRANSPORTATION
    if (category === "Transportation") {
      quantity = Number(distance);

      if (quantity <= 0 || !Number.isFinite(quantity)) {
        setError("Please enter a valid distance.");
        return;
      }

      if (transportMode === "Personal Vehicle") {
        // Use the saved kgPerKm of the selected registered vehicle
        const vehicleData = vehicles.find(
          (item) => item.name === vehicle
        );

        if (!vehicleData) {
          setError("Please select your vehicle.");
          return;
        }

        activity = vehicle;
        factor = vehicleData.kgPerKm;
        factorUnit = "km";

        emissions = quantity * factor;

        formula =
          `${quantity} km × ${factor.toFixed(4)} kg CO₂e/km`;

      } else {
        factor = TRANSPORT_FACTORS[transportMode];

        activity = transportMode;

        if (factor === undefined) {
          setError("Invalid transportation mode.");
          return;
        }

        factorUnit =
          ["Bus", "Train", "Flight"].includes(transportMode)
            ? "passenger-km"
            : "km";

        emissions = quantity * factor;

        formula =
          `${quantity} km × ${factor.toFixed(4)} kg CO₂e/${factorUnit}`;
      }

      unit = "km";
    }

    // ELECTRICITY
    else if (category === "Electricity") {
      quantity = Number(electricity);

      if (quantity <= 0 || !Number.isFinite(quantity)) {
        setError("Please enter valid electricity consumption.");
        return;
      }

      activity = "Electricity Consumption";
      unit = "kWh";

      factor = GRID_ELECTRICITY_FACTOR;
      factorUnit = "kWh";

      emissions = quantity * factor;

      formula =
        `${quantity} kWh × ${factor} kg CO₂/kWh`;
    }

    // HOUSEHOLD FUEL
    else if (category === "Household Fuel") {
      quantity = Number(fuelQuantity);

      if (quantity <= 0 || !Number.isFinite(quantity)) {
        setError("Please enter a valid fuel quantity.");
        return;
      }

      const fuelData = HOUSEHOLD_FUEL_FACTORS[fuelType];

      activity = fuelType;
      unit = fuelData.unit;

      factor = fuelData.factor;
      factorUnit = fuelData.unit;

      emissions = quantity * factor;

      formula =
        `${quantity} ${unit} × ${factor} kg CO₂e/${unit}`;
    }

    // WATER
    else if (category === "Water") {
      quantity = Number(waterQuantity);

      if (quantity <= 0 || !Number.isFinite(quantity)) {
        setError("Please enter valid water consumption.");
        return;
      }

      activity = "Water Consumption";
      unit = "litres";

      factor = WATER_FACTOR;
      factorUnit = "litre";

      emissions = quantity * factor;

      formula =
        `${quantity} litres × ${factor} kg CO₂e/litre`;
    }

    // Prepare the result
    const entry = {
      id: Date.now(),
      category,
      activity,
      transportMode:
        category === "Transportation" ? transportMode : null,
      vehicle:
        category === "Transportation" &&
        transportMode === "Personal Vehicle"
          ? vehicle
          : null,
      fuelType:
        category === "Household Fuel" ? fuelType : null,
      quantity,
      unit,
      emissionFactor: factor,
      factorUnit,
      formula,
      emissions: Number(emissions.toFixed(4)),
      date: entryDate
    };

    // Save the carbon entry to the backend (MongoDB)
    try {
      const data = await apiRequest("/entries", {
        method: "POST",
        body: entry
      });

      // Pass the saved entry to the Carbon Result page
      sessionStorage.setItem(
        "carbonWisePendingEntry",
        JSON.stringify(data.entry)
      );

      navigate("/carbon-result");

    } catch (error) {
      setError(
        error.message || "Unable to connect to the backend."
      );
    }
  };

  const selectedVehicle = vehicles.find(
    (item) => item.name === vehicle
  );

  const selectedFuel = HOUSEHOLD_FUEL_FACTORS[fuelType];

  return (
    <div className="add-entry-page">

      <div className="add-entry-container">

        <Link to="/dashboard" className="add-entry-back">
          ← Back to Dashboard
        </Link>

        <div className="add-entry-header">
          <h1>Add Carbon Entry</h1>
          <p>
            Record an activity to calculate your carbon footprint.
          </p>
        </div>

        <div className="add-entry-card">

          <form onSubmit={handleSubmit}>

            {/* Category */}

            <div className="add-entry-form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setError("");
                }}
              >
                <option value="Transportation">Transportation</option>
                <option value="Electricity">Electricity</option>
                <option value="Household Fuel">Household Fuel</option>
                <option value="Water">Water</option>
              </select>
            </div>

            {/* Transportation */}

            {category === "Transportation" && (
              <>
                <div className="add-entry-divider"></div>

                <div className="add-entry-form-group">
                  <label>Transportation Mode</label>

                  <select
                    value={transportMode}
                    onChange={(event) => {
                      setTransportMode(event.target.value);
                      setVehicle("");
                    }}
                  >
                    <option value="Personal Vehicle">Personal Vehicle</option>
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Taxi / Cab">Taxi / Cab</option>
                    <option value="Flight">Flight</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Walking">Walking</option>
                  </select>
                </div>

                {transportMode === "Personal Vehicle" && (
                  <div className="add-entry-form-group">
                    <label>Select Vehicle</label>

                    <select
                      value={vehicle}
                      onChange={(event) => setVehicle(event.target.value)}
                      required
                    >
                      <option value="">
                        {vehiclesLoading
                          ? "Loading vehicles..."
                          : "Select a vehicle"}
                      </option>

                      {vehicles.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {!vehiclesLoading && vehicles.length === 0 && (
                      <p className="add-entry-hint">
                        You have no registered vehicles.{" "}
                        <Link to="/vehicles">Add one in My Vehicles</Link>
                      </p>
                    )}

                    {selectedVehicle && (
                      <div className="vehicle-info">
                        <h4>Selected Vehicle</h4>

                        <p>Vehicle: {vehicle}</p>
                        <p>Fuel: {selectedVehicle.fuel}</p>
                        <p>Efficiency: {selectedVehicle.efficiency}</p>

                        <p>
                          Estimated factor:{" "}
                          {selectedVehicle.kgPerKm.toFixed(4)} kg CO₂/km
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="add-entry-form-group">
                  <label>Distance Travelled (km)</label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter distance"
                    value={distance}
                    onChange={(event) => setDistance(event.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/* Electricity */}

            {category === "Electricity" && (
              <>
                <div className="add-entry-divider"></div>

                <div className="add-entry-form-group">
                  <label>Electricity Consumption (kWh)</label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter electricity consumption"
                    value={electricity}
                    onChange={(event) => setElectricity(event.target.value)}
                    required
                  />

                  <p className="entry-hint">
                    Enter the electricity consumed during the activity period.
                  </p>
                </div>
              </>
            )}

            {/* Household Fuel */}

            {category === "Household Fuel" && (
              <>
                <div className="add-entry-divider"></div>

                <div className="add-entry-form-group">
                  <label>Fuel Type</label>

                  <select
                    value={fuelType}
                    onChange={(event) => setFuelType(event.target.value)}
                  >
                    <option value="LPG">LPG</option>
                    <option value="Diesel (Generator)">
                      Diesel (Generator)
                    </option>
                    <option value="Kerosene">Kerosene</option>
                  </select>
                </div>

                <div className="add-entry-form-group">
                  <label>
                    Fuel Consumed ({selectedFuel.unit})
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter fuel quantity"
                    value={fuelQuantity}
                    onChange={(event) => setFuelQuantity(event.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/* Water */}

            {category === "Water" && (
              <>
                <div className="add-entry-divider"></div>

                <div className="add-entry-form-group">
                  <label>Water Consumption (litres)</label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter water consumption"
                    value={waterQuantity}
                    onChange={(event) => setWaterQuantity(event.target.value)}
                    required
                  />

                  <p className="entry-hint">
                    The water calculation is an approximate
                    water-supply energy estimate.
                  </p>
                </div>
              </>
            )}

            {/* Date */}

            <div className="add-entry-form-group">
              <label>Activity Date</label>

              <input
                type="date"
                value={entryDate}
                onChange={(event) => setEntryDate(event.target.value)}
                required
              />
            </div>

            {/* Error */}

            {error && (
              <p className="entry-error" role="alert">
                {error}
              </p>
            )}

            {/* Submit */}

            <button
              type="submit"
              className="calculate-button"
            >
              Calculate Footprint
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddCarbonEntry;