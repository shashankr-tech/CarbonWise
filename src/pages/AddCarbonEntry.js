import { useState } from "react";

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
    <div>
      <h1>Add Carbon Entry</h1>

      <p>Record an activity to calculate your carbon footprint.</p>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Category</label>
          <br />

          <select value={category} onChange={handleCategoryChange}>
            <option value="Transportation">Transportation</option>
            <option value="Electricity">Electricity</option>
            <option value="Household Fuel">Household Fuel</option>
            <option value="Water">Water</option>
          </select>
        </div>

        <br />

        {category === "Transportation" && (
          <div>
            <label>Transportation Mode</label>
            <br />

            <select>
              <option value="Personal Vehicle">Personal Vehicle</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Taxi">Taxi / Cab</option>
              <option value="Flight">Flight</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Walking">Walking</option>
            </select>

            <br />
            <br />

            <label>Select Vehicle</label>
            <br />

            <select
              value={vehicle}
              onChange={(event) => setVehicle(event.target.value)}
            >
              <option value="">Select a vehicle</option>
              <option value="Honda City">Honda City</option>
              <option value="TVS Apache">TVS Apache</option>
              <option value="Tata Nexon EV">Tata Nexon EV</option>
            </select>

            <br />
            <br />

            <label>Distance Travelled (km)</label>
            <br />

            <input
              type="number"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
            />
          </div>
        )}

        {category === "Electricity" && (
          <div>
            <label>Electricity Consumption (kWh)</label>
            <br />

            <input type="number" />
          </div>
        )}

        {category === "Household Fuel" && (
          <div>
            <label>Fuel Type</label>
            <br />

            <select>
              <option value="LPG">LPG</option>
              <option value="Generator Fuel">Generator Fuel</option>
              <option value="Other">Other</option>
            </select>

            <br />
            <br />

            <label>Fuel Consumed</label>
            <br />

            <input type="number" />
          </div>
        )}

        {category === "Water" && (
          <div>
            <label>Water Consumption (litres)</label>
            <br />

            <input type="number" />
          </div>
        )}

        <br />

        <button type="submit">
          Calculate Footprint
        </button>

      </form>
    </div>
  );
}

export default AddCarbonEntry;