import { useState } from "react";
import { Link } from "react-router-dom";

function AddCarbonEntry() {
  const [category, setCategory] = useState("Transportation");

  const [distance, setDistance] = useState("");

  const [vehicle, setVehicle] = useState("");

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Carbon entry calculated!");
  };

  return (
    <div className="add-entry-page">

      <div className="add-entry-container">

        {/* Back to Dashboard */}
        <Link to="/dashboard" className="add-entry-back">
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="add-entry-header">
          <h1>Add Carbon Entry</h1>
          <p>
            Record an activity to calculate your carbon footprint.
          </p>
        </div>

        {/* Form Card */}
        <div className="add-entry-card">

          <form onSubmit={handleSubmit}>

            {/* Category */}
            <div className="add-entry-form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="Transportation">
                  Transportation
                </option>

                <option value="Electricity">
                  Electricity
                </option>

                <option value="Household Fuel">
                  Household Fuel
                </option>

                <option value="Water">
                  Water
                </option>
              </select>
            </div>


            {/* Transportation */}
            {category === "Transportation" && (
              <>

                <div className="add-entry-divider"></div>

                <div className="add-entry-form-group">
                  <label>Transportation Mode</label>

                  <select>
                    <option value="Personal Vehicle">
                      Personal Vehicle
                    </option>

                    <option value="Bus">
                      Bus
                    </option>

                    <option value="Train">
                      Train
                    </option>

                    <option value="Taxi">
                      Taxi / Cab
                    </option>

                    <option value="Flight">
                      Flight
                    </option>

                    <option value="Bicycle">
                      Bicycle
                    </option>

                    <option value="Walking">
                      Walking
                    </option>
                  </select>
                </div>


                <div className="add-entry-form-group">
                  <label>Select Vehicle</label>

                  <select
                    value={vehicle}
                    onChange={(event) =>
                      setVehicle(event.target.value)
                    }
                  >
                    <option value="">
                      Select a vehicle
                    </option>

                    <option value="Honda City">
                      Honda City
                    </option>

                    <option value="TVS Apache">
                      TVS Apache
                    </option>

                    <option value="Tata Nexon EV">
                      Tata Nexon EV
                    </option>
                  </select>

                  {vehicle && (
                    <div className="vehicle-info">
                      <h4>Selected Vehicle</h4>
                      <p>{vehicle}</p>
                      <p>
                        Vehicle information will be used
                        to calculate emissions.
                      </p>
                    </div>
                  )}
                </div>


                <div className="add-entry-form-group">
                  <label>Distance Travelled (km)</label>

                  <input
                    type="number"
                    placeholder="Enter distance"
                    value={distance}
                    onChange={(event) =>
                      setDistance(event.target.value)
                    }
                  />
                </div>

              </>
            )}


            {/* Electricity */}
            {category === "Electricity" && (
              <div className="add-entry-form-group">

                <div className="add-entry-divider"></div>

                <label>
                  Electricity Consumption (kWh)
                </label>

                <input
                  type="number"
                  placeholder="Enter electricity consumption"
                />

              </div>
            )}


            {/* Household Fuel */}
            {category === "Household Fuel" && (
              <div>

                <div className="add-entry-divider"></div>

                <div className="add-entry-form-group">
                  <label>Fuel Type</label>

                  <select>
                    <option value="LPG">
                      LPG
                    </option>

                    <option value="Generator Fuel">
                      Generator Fuel
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="add-entry-form-group">
                  <label>Fuel Consumed</label>

                  <input
                    type="number"
                    placeholder="Enter fuel consumed"
                  />
                </div>

              </div>
            )}


            {/* Water */}
            {category === "Water" && (
              <div className="add-entry-form-group">

                <div className="add-entry-divider"></div>

                <label>
                  Water Consumption (litres)
                </label>

                <input
                  type="number"
                  placeholder="Enter water consumption"
                />

              </div>
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