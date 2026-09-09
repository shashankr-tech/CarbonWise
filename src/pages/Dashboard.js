import { useMemo, useState } from "react";

function Dashboard() {
  const [monthlyEmissions, setMonthlyEmissions] = useState(245.6);
  const [carbonSaved, setCarbonSaved] = useState(38.2);

  const goalProgress = useMemo(() => {
    const target = 340;
    return Math.round((monthlyEmissions / target) * 100);
  }, [monthlyEmissions]);

  const handleAddEmission = () => {
    setMonthlyEmissions(monthlyEmissions + 5);
  };

  return (
    <div>
      <h1>Good Morning, Shashank 🌱</h1>
      <p>Here's your carbon footprint overview.</p>

      <hr />

      <h2>Today's Emissions</h2>
      <p>12.4 kg CO₂e</p>

      <h2>Monthly Emissions</h2>
      <p>{monthlyEmissions} kg CO₂e</p>

      <h2>Carbon Saved</h2>
      <p>{carbonSaved} kg CO₂e</p>

      <h2>Goal Progress</h2>
      <p>{goalProgress}%</p>

      <button onClick={handleAddEmission}>
        Add Sample Emission
      </button>
    </div>
  );
}

export default Dashboard;