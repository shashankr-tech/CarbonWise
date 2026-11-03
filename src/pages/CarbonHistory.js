import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Load saved carbon entries
function getSavedEntries() {
  try {
    const savedData = localStorage.getItem("carbonWiseEntries");
    const parsedData = savedData ? JSON.parse(savedData) : [];

    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Error loading entries:", error);
    return [];
  }
}

// Format date for display
function formatDate(dateValue) {
  if (!dateValue) return "N/A";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Get icon based on category
function getCategoryIcon(category) {
  switch (category) {
    case "Transportation":
      return "🚗";
    case "Electricity":
      return "⚡";
    case "Household Fuel":
      return "🔥";
    case "Water":
      return "💧";
    default:
      return "🌱";
  }
}

function CarbonHistory() {
  const [entries, setEntries] = useState(getSavedEntries);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Refresh entries when returning to this page
  useEffect(() => {
    const refreshEntries = () => {
      setEntries(getSavedEntries());
    };

    window.addEventListener("storage", refreshEntries);
    window.addEventListener("focus", refreshEntries);

    return () => {
      window.removeEventListener("storage", refreshEntries);
      window.removeEventListener("focus", refreshEntries);
    };
  }, []);

  // Filter and sort entries
  const filteredEntries = [...entries]
    .filter((entry) => {
      const matchesCategory =
        categoryFilter === "All" ||
        entry.category === categoryFilter;

      const searchableText = [
        entry.activity,
        entry.category,
        entry.vehicle,
        entry.transportMode,
        entry.fuelType
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        searchText.trim().toLowerCase()
      );

      const matchesFromDate =
        !fromDate || (entry.date && entry.date >= fromDate);

      const matchesToDate =
        !toDate || (entry.date && entry.date <= toDate);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesFromDate &&
        matchesToDate
      );
    })
    .sort((a, b) => {
      const dateDifference = String(b.date || "").localeCompare(
        String(a.date || "")
      );

      return dateDifference ||
        Number(b.id || 0) - Number(a.id || 0);
    });

  // Calculate total emissions for the displayed entries
  const totalEmissions = filteredEntries.reduce(
    (total, entry) => total + (Number(entry.emissions) || 0),
    0
  );

  // Delete an entry
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this carbon entry?"
    );

    if (!confirmed) return;

    const updatedEntries = entries.filter(
      (entry) => String(entry.id) !== String(id)
    );

    try {
      localStorage.setItem(
        "carbonWiseEntries",
        JSON.stringify(updatedEntries)
      );

      setEntries(updatedEntries);
    } catch (error) {
      alert("Unable to delete this entry. Please try again.");
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter("All");
    setSearchText("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">↗</div>
          <span>
            Carbon<span>Wise</span>
          </span>
        </div>

        <nav className="sidebar-nav">

          <Link to="/dashboard" className="sidebar-link">
            <span>▣</span>
            Dashboard
          </Link>

          <Link to="/add-entry" className="sidebar-link">
            <span>＋</span>
            Add Carbon Entry
          </Link>

          <Link to="/vehicles" className="sidebar-link">
            <span>🚗</span>
            My Vehicles
          </Link>

          <Link to="/history" className="sidebar-link active">
            <span>◷</span>
            Carbon History
          </Link>

          <Link to="/analytics" className="sidebar-link">
            <span>▥</span>
            Analytics
          </Link>

          <Link to="/profile" className="sidebar-link">
            <span>◉</span>
            Profile
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="sidebar-link logout-link">
            <span>↪</span>
            Logout
          </Link>
        </div>

      </aside>


      {/* Main Content */}
      <main className="dashboard-main">

        {/* Page Header */}
        <header className="history-header">
          <div>
            <h1>Carbon History</h1>
            <p>View and manage your recorded carbon activities.</p>
          </div>

          <Link to="/add-entry" className="dashboard-add-button">
            + Add Carbon Entry
          </Link>
        </header>


        {/* Summary Cards */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Entries</span>
              <div className="stat-icon green">▤</div>
            </div>

            <h2>{filteredEntries.length}</h2>
            <p>Matching activities</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Emissions</span>
              <div className="stat-icon blue">♻</div>
            </div>

            <h2>
              {totalEmissions.toFixed(2)} <small>kg CO₂e</small>
            </h2>

            <p>Emissions from displayed entries</p>
          </div>

        </section>


        {/* Filters */}
        <section className="dashboard-card history-filter-card">

          <div className="history-section-heading">
            <div>
              <h3>Filter Activities</h3>
              <p>Search and narrow down your carbon entries.</p>
            </div>

            <button
              type="button"
              className="history-clear-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          <div className="history-filters">

            <div className="history-filter-group">
              <label htmlFor="history-search">Search</label>

              <input
                id="history-search"
                type="text"
                placeholder="Search activities..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>

            <div className="history-filter-group">
              <label htmlFor="history-category">Category</label>

              <select
                id="history-category"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
              >
                <option value="All">All Categories</option>
                <option value="Transportation">Transportation</option>
                <option value="Electricity">Electricity</option>
                <option value="Household Fuel">Household Fuel</option>
                <option value="Water">Water</option>
              </select>
            </div>

            <div className="history-filter-group">
              <label htmlFor="history-from">From Date</label>

              <input
                id="history-from"
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(event) => setFromDate(event.target.value)}
              />
            </div>

            <div className="history-filter-group">
              <label htmlFor="history-to">To Date</label>

              <input
                id="history-to"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => setToDate(event.target.value)}
              />
            </div>

          </div>
        </section>


        {/* Entries Table */}
        <section className="dashboard-card history-table-card">

          <div className="history-section-heading">
            <div>
              <h3>Recorded Activities</h3>
              <p>
                Showing {filteredEntries.length} of {entries.length} entries.
              </p>
            </div>
          </div>

          {filteredEntries.length === 0 ? (

            <div className="history-empty">
              <div>🌱</div>
              <h3>No Carbon Entries Found</h3>

              <p>
                No activities match your filters. Try changing your search
                or add a new carbon entry.
              </p>

              <Link to="/add-entry" className="history-add-button">
                Add Carbon Entry
              </Link>
            </div>

          ) : (

            <div className="history-table-wrapper">
              <table className="history-table">

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Emissions</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEntries.map((entry) => (

                    <tr key={entry.id}>

                      <td>{formatDate(entry.date)}</td>

                      <td>
                        <div className="history-activity">
                          <span>
                            {getCategoryIcon(entry.category)}
                          </span>
                          <strong>
                            {entry.activity || entry.category}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span className="history-category">
                          {entry.category}
                        </span>
                      </td>

                      <td>
                        {entry.quantity} {entry.unit}
                      </td>

                      <td>
                        <strong className="history-emissions">
                          {(Number(entry.emissions) || 0).toFixed(2)} kg
                        </strong>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="history-delete-button"
                          onClick={() => handleDelete(entry.id)}
                          aria-label={`Delete ${entry.activity || "entry"}`}
                          title="Delete entry"
                        >
                          Delete
                        </button>
                      </td>

                    </tr>

                  ))}
                </tbody>

              </table>
            </div>

          )}

        </section>

      </main>
    </div>
  );
}

export default CarbonHistory;
