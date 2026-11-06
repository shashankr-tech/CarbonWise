import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../utils/api";

// Convert a date into YYYY-MM-DD format
function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Format an entry date for display
function formatEntryDate(dateValue) {
  if (!dateValue) return "Date unavailable";

  const entryDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(entryDate.getTime())) {
    return dateValue;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  entryDate.setHours(0, 0, 0, 0);

  if (entryDate.getTime() === today.getTime()) {
    return "Today";
  }

  if (entryDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  return entryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function Dashboard() {
  const [entries, setEntries] = useState([]);

  // Refresh saved entries when the page becomes active
  useEffect(() => {
    let cancelled = false;

    const refreshEntries = async () => {
      try {
        const data = await apiRequest("/entries");

        if (!cancelled) {
          setEntries(Array.isArray(data.entries) ? data.entries : []);
        }
      } catch (loadError) {
        console.error("Unable to load carbon entries:", loadError);
      }
    };

    refreshEntries();

    window.addEventListener("focus", refreshEntries);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshEntries);
    };
  }, []);

  // Current date
  const today = getDateString(new Date());
  const currentMonth = today.substring(0, 7);

  // Today's and this month's entries
  const todayEntries = entries.filter(
    (entry) => entry.date === today
  );

  const monthlyEntries = entries.filter(
    (entry) =>
      typeof entry.date === "string" &&
      entry.date.substring(0, 7) === currentMonth
  );

  // Calculate emissions
  const calculateTotal = (entryList) => {
    return entryList.reduce(
      (total, entry) => total + (Number(entry.emissions) || 0),
      0
    );
  };

  const todayEmissions = calculateTotal(todayEntries);
  const monthlyEmissions = calculateTotal(monthlyEntries);
  const totalEmissions = calculateTotal(entries);

  // Category information
  const categories = [
    {
      name: "Transportation",
      color: "#2e7d32",
      className: "transportation"
    },
    {
      name: "Electricity",
      color: "#42a5f5",
      className: "electricity"
    },
    {
      name: "Household Fuel",
      color: "#81c784",
      className: "household"
    },
    {
      name: "Water",
      color: "#ffb74d",
      className: "water"
    }
  ];

  // Calculate emissions for each category
  const categoryStats = categories.map((category) => {
    const categoryEntries = monthlyEntries.filter(
      (entry) => entry.category === category.name
    );

    const amount = calculateTotal(categoryEntries);

    const percentage =
      monthlyEmissions > 0
        ? (amount / monthlyEmissions) * 100
        : 0;

    return {
      ...category,
      amount,
      percentage
    };
  });

  // Create the dynamic donut chart
  let currentPercentage = 0;

  const donutSegments = categoryStats.map((category) => {
    const start = currentPercentage;
    currentPercentage += category.percentage;

    return `${category.color} ${start}% ${currentPercentage}%`;
  });

  const donutBackground =
    monthlyEmissions > 0
      ? `conic-gradient(${donutSegments.join(", ")})`
      : "#e8f5e9";

  // Recent activities: newest entries first
  const recentEntries = [...entries]
    .sort((a, b) => {
      const dateDifference = String(b.date || "").localeCompare(
        String(a.date || "")
      );

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return Number(b.id || 0) - Number(a.id || 0);
    })
    .slice(0, 5);

  // Category icons for recent activities
  const getCategoryIcon = (category) => {
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
  };

  // Prepare the last seven days for the emissions chart
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    const dateString = getDateString(date);

    const dailyEntries = entries.filter(
      (entry) => entry.date === dateString
    );

    return {
      date: dateString,
      label: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
      }),
      emissions: calculateTotal(dailyEntries)
    };
  });

  const chartMax = Math.max(
    ...weeklyData.map((day) => day.emissions)
  );

  const chartPoints = weeklyData
    .map((day, index) => {
      const x = (index / 6) * 100;

      const y =
        chartMax > 0
          ? 95 - (day.emissions / chartMax) * 85
          : 95;

      return `${x},${y}`;
    })
    .join(" ");

  const chartAxisValues =
    chartMax > 0
      ? [
          chartMax,
          chartMax * 0.75,
          chartMax * 0.5,
          chartMax * 0.25,
          0
        ]
      : [0, 0, 0, 0, 0];

  // Environmental insight based on actual entries
  const highestCategory = [...categoryStats].sort(
    (a, b) => b.amount - a.amount
  )[0];

  let insightMessage = "Add your first carbon entry to start tracking your environmental impact.";

  if (monthlyEmissions > 0) {
    insightMessage =
      `Your largest recorded emission source this month is ${highestCategory.name}, ` +
      `contributing ${highestCategory.amount.toFixed(2)} kg CO₂e. ` +
      `Look for ways to reduce this category.`;
  } else if (entries.length > 0) {
    insightMessage =
      "You have saved carbon entries, but none have been recorded in the current month yet.";
  }

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <Sidebar />


      {/* Main Content */}
      <main className="dashboard-main">

        {/* Top Bar */}
        <header className="dashboard-header">

          <div>
            <h1>Good Morning, Shashank 🌱</h1>
            <p>Here's your carbon footprint overview.</p>
          </div>

          <div className="header-actions">
            <button className="notification-button">
              🔔
            </button>

            <div className="user-avatar">
              S
            </div>

            <Link to="/add-entry" className="dashboard-add-button">
              + Add Carbon Entry
            </Link>
          </div>

        </header>


        {/* Statistics */}
        <section className="stats-grid">

          {/* Today's Emissions */}
          <div className="stat-card">
            <div className="stat-card-top">
              <span>Today's Emissions</span>
              <div className="stat-icon green">☀</div>
            </div>

            <h2>
              {todayEmissions.toFixed(2)} <small>kg CO₂e</small>
            </h2>

            <p>Based on today's saved entries</p>
          </div>


          {/* Monthly Emissions */}
          <div className="stat-card">
            <div className="stat-card-top">
              <span>Monthly Emissions</span>
              <div className="stat-icon blue">◷</div>
            </div>

            <h2>
              {monthlyEmissions.toFixed(2)} <small>kg CO₂e</small>
            </h2>

            <p>Current month's total emissions</p>
          </div>


          {/* All-Time Emissions */}
          <div className="stat-card">
            <div className="stat-card-top">
              <span>All-Time Emissions</span>
              <div className="stat-icon green">♻</div>
            </div>

            <h2>
              {totalEmissions.toFixed(2)} <small>kg CO₂e</small>
            </h2>

            <p>Total emissions from saved entries</p>
          </div>


          {/* Total Entries */}
          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Entries</span>
              <div className="stat-icon orange">▤</div>
            </div>

            <h2>{entries.length}</h2>

            <p>Activities recorded so far</p>
          </div>

        </section>


        {/* Charts */}
        <section className="dashboard-grid">

          {/* Emissions Trend */}
          <div className="dashboard-card trend-card">

            <div className="card-header">
              <div>
                <h3>7-Day Emissions Trend</h3>
                <p>Your daily carbon emissions</p>
              </div>
            </div>

            <div className="chart-area">

              <div className="chart-y-axis">
                {chartAxisValues.map((value, index) => (
                  <span key={index}>
                    {value.toFixed(1)}
                  </span>
                ))}
              </div>

              <div className="line-chart">

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    left: 0,
                    top: 0
                  }}
                >
                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="#2e7d32"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />

                  {weeklyData.map((day, index) => {
                    const x = (index / 6) * 100;

                    const y =
                      chartMax > 0
                        ? 95 - (day.emissions / chartMax) * 85
                        : 95;

                    return (
                      <circle
                        key={day.date}
                        cx={x}
                        cy={y}
                        r="1.5"
                        fill="#2e7d32"
                        stroke="white"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>

              </div>

            </div>

            <div className="chart-labels">
              {weeklyData.map((day) => (
                <span key={day.date}>{day.label}</span>
              ))}
            </div>

          </div>


          {/* Category Breakdown */}
          <div className="dashboard-card category-card">

            <div className="card-header">
              <div>
                <h3>Category Breakdown</h3>
                <p>This month's emissions</p>
              </div>
            </div>

            <div className="donut-container">

              <div
                className="donut-chart"
                style={{ background: donutBackground }}
              >
                <div className="donut-center">
                  <strong>{monthlyEmissions.toFixed(2)}</strong>
                  <span>kg CO₂e</span>
                </div>
              </div>

            </div>

            <div className="category-list">

              {categoryStats.map((category) => (
                <div key={category.name}>
                  <span
                    className={`category-dot ${category.className}`}
                  ></span>

                  <span>{category.name}</span>

                  <strong>
                    {category.percentage.toFixed(1)}%
                  </strong>
                </div>
              ))}

            </div>

          </div>

        </section>


        {/* Bottom Section */}
        <section className="dashboard-bottom-grid">

          {/* Recent Activity */}
          <div className="dashboard-card recent-card">

            <div className="card-header">
              <div>
                <h3>Recent Activity</h3>
                <p>Your latest carbon entries</p>
              </div>

              <Link to="/history">View All</Link>
            </div>

            <div className="activity-list">

              {recentEntries.length === 0 ? (

                <p>
                  No activities recorded yet. Add your first carbon entry!
                </p>

              ) : (

                recentEntries.map((entry) => (
                  <div className="activity-item" key={entry.id}>

                    <div className="activity-icon">
                      {getCategoryIcon(entry.category)}
                    </div>

                    <div className="activity-info">
                      <strong>
                        {entry.activity || entry.category}
                      </strong>

                      <span>
                        {entry.category} • {formatEntryDate(entry.date)}
                      </span>
                    </div>

                    <strong>
                      {(Number(entry.emissions) || 0).toFixed(2)} kg
                    </strong>

                  </div>
                ))

              )}

            </div>

          </div>


          {/* Environmental Insight */}
          <div className="dashboard-card insight-card">

            <div className="insight-icon">
              🌱
            </div>

            <h3>Environmental Insight</h3>

            <p>{insightMessage}</p>

            <Link to="/analytics">
              View Detailed Analytics →
            </Link>

          </div>


          {/* Quick Actions */}
          <div className="dashboard-card quick-card">

            <h3>Quick Actions</h3>

            <Link to="/add-entry" className="quick-action">
              <span>＋</span>
              Add Carbon Entry
            </Link>

            <Link to="/vehicles" className="quick-action">
              <span>🚗</span>
              Manage Vehicles
            </Link>

            <Link to="/history" className="quick-action">
              <span>◷</span>
              View History
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;