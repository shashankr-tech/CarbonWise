import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddCarbonEntry from "./pages/AddCarbonEntry";
import CarbonResult from "./pages/CarbonResult";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/add-entry" element={<AddCarbonEntry />} />

        <Route path="/carbon-result" element={<CarbonResult />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;