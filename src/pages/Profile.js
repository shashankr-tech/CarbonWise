import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../utils/api";

// Default profile information
const defaultProfile = {
  fullName: "",
  email: "",
  city: "",
  age: "",
  country: ""
};

function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [formData, setFormData] = useState(defaultProfile);
  const [stats, setStats] = useState({
    entries: 0,
    vehicles: 0,
    emissions: 0
  });
  const [saving, setSaving] = useState(false);

  // Load the profile, entry count, vehicle count and total emissions
  // from MongoDB
  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const [profileData, entryData, vehicleData] = await Promise.all([
          apiRequest("/auth/me"),
          apiRequest("/entries"),
          apiRequest("/vehicles")
        ]);

        if (cancelled) return;

        const loadedProfile = {
          ...defaultProfile,
          ...profileData.profile
        };

        const entries = Array.isArray(entryData.entries)
          ? entryData.entries
          : [];

        const vehicles = Array.isArray(vehicleData.vehicles)
          ? vehicleData.vehicles
          : [];

        setProfile(loadedProfile);
        setFormData(loadedProfile);
        setStats({
          entries: entries.length,
          vehicles: vehicles.length,
          emissions: entries.reduce(
            (total, entry) => total + (Number(entry.emissions) || 0),
            0
          )
        });
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load your profile.");
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Update form fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setMessage("");
    setError("");
  };

  // Save profile information
  const handleSave = async (event) => {
    event.preventDefault();

    const updatedProfile = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      age: formData.age,
      country: formData.country.trim()
    };

    if (!updatedProfile.fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (!updatedProfile.email) {
      setError("Please enter your email address.");
      return;
    }

    if (
      updatedProfile.age &&
      (
        Number(updatedProfile.age) < 1 ||
        Number(updatedProfile.age) > 120
      )
    ) {
      setError("Please enter a valid age.");
      return;
    }

    setSaving(true);

    try {
      const data = await apiRequest("/auth/me", {
        method: "PUT",
        body: updatedProfile
      });

      const savedProfile = { ...defaultProfile, ...data.profile };

      setProfile(savedProfile);
      setFormData(savedProfile);
      setEditing(false);
      setMessage("Profile updated successfully!");
      setError("");
    } catch (saveError) {
      setError(
        saveError.message || "Unable to save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
    setError("");
    setMessage("");
  };

  // Get the user's initials
  const initials = profile.fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "U";

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <Sidebar />


      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="profile-header">

          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information and account details.</p>
          </div>

          {!editing && (
            <button
              className="profile-edit-main"
              onClick={() => {
                setEditing(true);
                setMessage("");
              }}
            >
              Edit Profile
            </button>
          )}

        </header>


        {/* Profile Overview */}
        <section className="dashboard-card profile-overview">

          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-overview-info">
            <h2>{profile.fullName}</h2>

            <p>
              {profile.email || "Add your email address"}
            </p>

            <span className="profile-member-tag">
              CarbonWise Member
            </span>
          </div>

        </section>


        {/* Account Statistics */}
        <section className="profile-stats">

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Activities</span>
              <div className="stat-icon green">▤</div>
            </div>

            <h2>{stats.entries}</h2>
            <p>Recorded carbon activities</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>My Vehicles</span>
              <div className="stat-icon blue">🚗</div>
            </div>

            <h2>{stats.vehicles}</h2>
            <p>Vehicles in your list</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Emissions</span>
              <div className="stat-icon orange">♻</div>
            </div>

            <h2>
              {stats.emissions.toFixed(2)} <small>kg CO₂e</small>
            </h2>

            <p>All recorded activities</p>
          </div>

        </section>


        {/* Personal Information */}
        <section className="dashboard-card profile-details-card">

          <div className="profile-section-heading">
            <div>
              <h3>Personal Information</h3>
              <p>Your personal details and contact information.</p>
            </div>
          </div>


          {editing ? (

            <form onSubmit={handleSave}>

              <div className="profile-form-grid">

                <div className="profile-form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-form-group">
                  <label>Age</label>

                  <input
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-form-group">
                  <label>Country</label>

                  <input
                    type="text"
                    name="country"
                    placeholder="Enter your country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>

              </div>

              {error && (
                <p className="profile-error" role="alert">
                  {error}
                </p>
              )}

              <div className="profile-form-actions">

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving}
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </form>

          ) : (

            <div className="profile-details-grid">

              <div className="profile-detail">
                <span>Full Name</span>
                <strong>{profile.fullName || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Email Address</span>
                <strong>{profile.email || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>City</span>
                <strong>{profile.city || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Age</span>
                <strong>{profile.age || "Not provided"}</strong>
              </div>

              <div className="profile-detail">
                <span>Country</span>
                <strong>{profile.country || "Not provided"}</strong>
              </div>

            </div>

          )}

          {message && (
            <p className="profile-success" role="status">
              {message}
            </p>
          )}

        </section>


        {/* Account Information */}
        <section className="dashboard-card profile-account-card">

          <div className="profile-section-heading">
            <div>
              <h3>Account Information</h3>
              <p>About your CarbonWise account.</p>
            </div>
          </div>

          <div className="profile-account-row">
            <span>Account Type</span>
            <strong>Personal Account</strong>
          </div>

          <div className="profile-account-row">
            <span>Data Storage</span>
            <strong>Browser Local Storage</strong>
          </div>

          <div className="profile-account-row">
            <span>Application</span>
            <strong>CarbonWise</strong>
          </div>

        </section>

        <p className="profile-disclaimer">
          Profile information is currently stored in this browser.
          Server-based account management will be added during backend integration.
        </p>

      </main>
    </div>
  );
}

export default Profile;