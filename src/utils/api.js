// Shared helpers for talking to the CarbonWise backend.
// MongoDB (through the backend) is the source of truth for all saved data.
// The browser only keeps the login token.

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const TOKEN_KEY = "carbonWiseToken";

// Old keys from before MongoDB. They are removed so that data from one
// person can never show up for the next person using the same browser.
const LEGACY_KEYS = [
  "carbonWiseEntries",
  "carbonWiseVehicles",
  "carbonWiseProfile"
];

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Remove the old localStorage copies of permanent data
export function clearLegacyData() {
  try {
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore storage errors
  }
}

// Log the user out of this browser
export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem("carbonWisePendingEntry");
  } catch {
    // Ignore storage errors
  }

  clearLegacyData();
}

// Send an authenticated request to the backend.
// Returns the parsed JSON. Throws an Error (with .status) on failure.
export async function apiRequest(path, { method = "GET", body } = {}) {
  const token = getToken();

  if (!token) {
    const error = new Error("Please log in again.");
    error.status = 401;
    throw error;
  }

  let response;

  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new Error("Unable to connect to the backend.");
  }

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // Token expired or invalid: send the user back to the login page
  if (response.status === 401) {
    clearSession();
    window.location.hash = "#/login";

    const error = new Error(
      data.message || "Session expired. Please log in again."
    );
    error.status = 401;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    throw error;
  }

  return data;
}
