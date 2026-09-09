import { useState } from "react";
import Button from "../components/Button";
import Navbar from "../components/Navbar";

function Landing() {
  const [message, setMessage] = useState("");

  const handleGetStarted = () => {
    setMessage("Let's start tracking your carbon footprint!");
  };

  const handleLogin = () => {
    setMessage("Login page will open here.");
  };

  return (
    <div>
      <Navbar />

      <h1>Track. Reduce. Sustain.</h1>

      <p>
        Understand your carbon footprint, track your daily activities,
        and make more sustainable choices.
      </p>

      <Button text="Get Started" onClick={handleGetStarted} />
      <Button text="Login" onClick={handleLogin} />

      {message && <p>{message}</p>}

      <h2>Why CarbonWise?</h2>

      <div>
        <h3>Track Your Impact</h3>
        <p>
          Record your daily activities and estimate your carbon emissions.
        </p>
      </div>

      <div>
        <h3>Understand Your Data</h3>
        <p>
          View your emissions by category and understand where your
          carbon footprint comes from.
        </p>
      </div>

      <div>
        <h3>Build Better Habits</h3>
        <p>
          Use your carbon data to make better and more sustainable choices.
        </p>
      </div>
    </div>
  );
}

export default Landing;