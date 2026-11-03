import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddCarbonEntry from "./pages/AddCarbonEntry";
import CarbonResult from "./pages/CarbonResult";
import CarbonHistory from "./pages/CarbonHistory";
import MyVehicles from "./pages/MyVehicles";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import RTOSubmission from "./pages/RTOSubmission";
import RTOOfficerDashboard from "./pages/RTOOfficerDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/vehicles" element={<MyVehicles />} />

        <Route path="/add-entry" element={<AddCarbonEntry />} />

        <Route path="/carbon-result" element={<CarbonResult />} />

        <Route path="/history" element={<CarbonHistory />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/rto-submit" element={<RTOSubmission />} />

        <Route path="/rto-dashboard" element={<RTOOfficerDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;