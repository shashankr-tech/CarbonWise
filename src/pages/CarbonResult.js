import { useState } from "react";

function CarbonResult() {
  const [emissions, setEmissions] = useState(12.8);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div>
      <h1>Your Carbon Footprint</h1>

      <h2>{emissions} kg CO₂e</h2>

      <p>Moderate Environmental Impact</p>

      <hr />

      <h2>Activity Summary</h2>

      <p>Vehicle: Honda City</p>
      <p>Fuel: Petrol</p>
      <p>Distance: 25 km</p>
      <p>Fuel Efficiency: 17.8 km/L</p>
      <p>Emission Factor: 0.130 kg CO₂e/km</p>

      <hr />

      <h2>Emission Breakdown</h2>

      <p>Transportation: 6.2 kg CO₂e</p>
      <p>Electricity: 3.1 kg CO₂e</p>
      <p>Household Fuel: 1.8 kg CO₂e</p>
      <p>Water: 0.9 kg CO₂e</p>

      <br />

      <button onClick={handleSave}>
        Save Entry
      </button>

      <button>
        Edit Entry
      </button>

      {saved && (
        <p>Entry saved successfully!</p>
      )}
    </div>
  );
}

export default CarbonResult;