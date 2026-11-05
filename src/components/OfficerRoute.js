import { Navigate } from "react-router-dom";
import { getTokenRole } from "../utils/auth";

function OfficerRoute({ children }) {
  const role = getTokenRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "officer") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default OfficerRoute;
