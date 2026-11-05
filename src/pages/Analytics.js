import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

// Load saved carbon entries
function getSavedEntries() {
  try {
    const savedData = localStorage.getItem("carbonWiseEntries");
    const parsedData = savedData ? JSON.parse(savedData) : [];

    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Unable to load analytics data:", error);
    return [];
  }
}

// Format a date as YYYY-MM-DD
function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Format a date for display
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

// Category information
const categories = [
  {
    name: "Transportation",
    color: "#2e7d32",
    className: "transportation",
    icon: "🚗"
  },
  {
    name: "Electricity",
    color: "#42a5f5",
    className: "electricity",
    icon: "⚡"
  },
  {
    name: "Household Fuel",
    color: "#81c784",
    className: "household",
    icon: "🔥"
  },
  {
    name: "Water",
    color: "#ffb74d",
    className: "water",
    icon: "💧"
  }
];

function Analytics() {
  const [entries, setEntries] = useState(getSavedEntries);
  const [selectedRange, setSelectedRange] = useState("30days");

  // Refresh data when returning to the page
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayString = getDateString(today);

  // Calculate the starting date of the selected range
  let startDate = null;

  if (selectedRange === "7days") {
    const date = new Date(today);
    date.setDate(date.getDate() - 6);
    startDate = getDateString(date);
  }

  else if (selectedRange === "30days") {
    const date = new Date(today);
    date.setDate(date.getDate() - 29);
    startDate = getDateString(date);
  }

  else if (selectedRange === "6months") {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - 5,
      1
    );
    startDate = getDateString(date);
  }

  // Filter entries based on the selected range
  const filteredEntries = entries.filter((entry) => {
    if (!entry.date || typeof entry.date !== "string") {
      return false;
    }

    if (selectedRange === "all") {
      return true;
    }

    return entry.date >= startDate && entry.date <= todayString;
  });

  // Calculate total emissions
  const totalEmissions = filteredEntries.reduce(
    (total, entry) => total + (Number(entry.emissions) || 0),
    0
  );

  // Average emissions per activity
  const averageEmissions =
    filteredEntries.length > 0
      ? totalEmissions / filteredEntries.length
      : 0;

  // Category-wise emissions
  const categoryStats = categories.map((category) => {
    const categoryEntries = filteredEntries.filter(
      (entry) => entry.category === category.name
    );

    const amount = categoryEntries.reduce(
      (total, entry) => total + (Number(entry.emissions) || 0),
      0
    );

    const percentage =
      totalEmissions > 0
        ? (amount / totalEmissions) * 100
        : 0;

    return {
      ...category,
      amount,
      percentage,
      count: categoryEntries.length
    };
  });

  // Find the category with the highest emissions
  const highestCategory = [...categoryStats].sort(
    (a, b) => b.amount - a.amount
  )[0];

  // Prepare emissions trend data
  let chartData = [];

  if (selectedRange === "7days" || selectedRange === "30days") {
    const numberOfDays = selectedRange === "7days" ? 7 : 30;

    for (let i = numberOfDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dateString = getDateString(date);

      const dailyEmissions = filteredEntries
        .filter((entry) => entry.date === dateString)
        .reduce(
          (total, entry) => total + (Number(entry.emissions) || 0),
          0
        );

      chartData.push({
        date: dateString,
        label:
          selectedRange === "7days"
            ? date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short"
              })
            : String(date.getDate()),
        emissions: dailyEmissions
      });
    }
  }

  else {
    // Group entries by month
    let firstMonth;

    if (selectedRange === "6months") {
      firstMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 5,
        1
      );
    } else {
      const validDates = entries
        .map((entry) => entry.date)
        .filter(
          (date) =>
            typeof date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(date)
        )
        .sort();

      if (validDates.length > 0) {
        const firstDate = validDates[0].split("-").map(Number);
        firstMonth = new Date(firstDate[0], firstDate[1] - 1, 1);
      } else {
        firstMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 5,
          1
        );
      }
    }

    const validDates = entries
      .map((entry) => entry.date)
      .filter(
        (date) =>
          typeof date === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(date)
      )
      .sort();

    let lastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    if (selectedRange === "all" && validDates.length > 0) {
      const latestDate = validDates[validDates.length - 1]
        .split("-")
        .map(Number);

      lastMonth = new Date(
        latestDate[0],
        latestDate[1] - 1,
        1
      );
    }

    const monthList = [];

    const currentMonth = new Date(firstMonth);

    while (currentMonth <= lastMonth) {
      monthList.push(new Date(currentMonth));
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    // Show at most the latest 12 months on the chart
    const visibleMonths = monthList.slice(-12);

    chartData = visibleMonths.map((month) => {
      const year = month.getFullYear();
      const monthNumber = String(month.getMonth() + 1).padStart(2, "0");
      const monthKey = `${year}-${monthNumber}`;

      const monthlyTotal = filteredEntries
        .filter(
          (entry) => entry.date.substring(0, 7) === monthKey
        )
        .reduce(
          (total, entry) => total + (Number(entry.emissions) || 0),
          0
        );

      return {
        date: monthKey,
        label: month.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit"
        }),
        emissions: monthlyTotal
      };
    });
  }

  // Calculate chart scale
  const chartMax = Math.max(
    ...chartData.map((item) => item.emissions),
    0
  );

  // Create line chart points
  const chartPoints = chartData.map((item, index) => {
    const x =
      chartData.length > 1
        ? (index / (chartData.length - 1)) * 100
        : 50;

    const y =
      chartMax > 0
        ? 90 - (item.emissions / chartMax) * 80
        : 90;

    return `${x},${y}`;
  }).join(" ");

  // Chart axis labels
  const axisValues = [
    chartMax,
    chartMax * 0.75,
    chartMax * 0.5,
    chartMax * 0.25,
    0
  ];

  // Select a few labels for the chart
  const labelIndexes =
    chartData.length <= 7
      ? chartData.map((item, index) => index)
      : [
          0,
          Math.floor((chartData.length - 1) / 4),
          Math.floor((chartData.length - 1) / 2),
          Math.floor(3 * (chartData.length - 1) / 4),
          chartData.length - 1
        ];

  // Donut chart segments
  let currentPercentage = 0;

  const donutSegments = categoryStats.map((category) => {
    const start = currentPercentage;
    currentPercentage += category.percentage;

    return `${category.color} ${start}% ${currentPercentage}%`;
  });

  const donutBackground =
    totalEmissions > 0
      ? `conic-gradient(${donutSegments.join(", ")})`
      : "#e8f5e9";

  // Recent activities
  const recentEntries = [...filteredEntries]
    .sort((a, b) => {
      const dateDifference = String(b.date || "").localeCompare(
        String(a.date || "")
      );

      return dateDifference ||
        Number(b.id || 0) - Number(a.id || 0);
    })
    .slice(0, 5);

  // Period description
  const rangeLabel = {
    "7days": "Last 7 Days",
    "30days": "Last 30 Days",
    "6months": "Last 6 Months",
    "all": "All Time"
  }[selectedRange];

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <Sidebar />


      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="analytics-header">

          <div>
            <h1>Carbon Analytics</h1>
            <p>Understand your emissions and track your environmental impact.</p>
          </div>

          <Link to="/add-entry" className="dashboard-add-button">
            + Add Carbon Entry
          </Link>

        </header>


        {/* Date Range Filter */}
        <section className="dashboard-card analytics-filter">

          <div>
            <h3>Analytics Overview</h3>
            <p>Choose a time period to explore your carbon footprint.</p>
          </div>

          <select
            value={selectedRange}
            onChange={(event) => setSelectedRange(event.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="all">All Time</option>
          </select>

        </section>


        {/* Summary Cards */}
        <section className="stats-grid analytics-stats">

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Emissions</span>
              <div className="stat-icon green">♻</div>
            </div>

            <h2>
              {totalEmissions.toFixed(2)} <small>kg CO₂e</small>
            </h2>

            <p>{rangeLabel}</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Activities</span>
              <div className="stat-icon blue">▤</div>
            </div>

            <h2>{filteredEntries.length}</h2>

            <p>Recorded activities</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Average per Activity</span>
              <div className="stat-icon orange">◷</div>
            </div>

            <h2>
              {averageEmissions.toFixed(2)} <small>kg CO₂e</small>
            </h2>

            <p>Average emissions</p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Highest Emission Source</span>
              <div className="stat-icon green">↑</div>
            </div>

            <h2 className="analytics-top-category">
              {totalEmissions > 0 ? highestCategory.name : "N/A"}
            </h2>

            <p>
              {totalEmissions > 0
                ? `${highestCategory.amount.toFixed(2)} kg CO₂e`
                : "No recorded emissions"}
            </p>
          </div>

        </section>


        {/* Charts */}
        <section className="dashboard-grid analytics-chart-grid">

          {/* Emissions Trend */}
          <div className="dashboard-card analytics-trend-card">

            <div className="card-header">
              <div>
                <h3>Emissions Trend</h3>
                <p>{rangeLabel} carbon emissions</p>
              </div>
            </div>

            {filteredEntries.length === 0 ? (

              <div className="analytics-empty-chart">
                <span>📊</span>
                <p>Add carbon entries to see your emissions trend.</p>
              </div>

            ) : (

              <>
                <div className="analytics-chart-area">

                  <div className="analytics-y-axis">
                    {axisValues.map((value, index) => (
                      <span key={index}>
                        {value.toFixed(2)}
                      </span>
                    ))}
                  </div>

                  <div className="analytics-line-chart">

                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <polyline
                        points={chartPoints}
                        fill="none"
                        stroke="#2e7d32"
                        strokeWidth="2.5"
                        vectorEffect="non-scaling-stroke"
                      />

                      {chartData.map((item, index) => {
                        const x =
                          chartData.length > 1
                            ? (index / (chartData.length - 1)) * 100
                            : 50;

                        const y =
                          chartMax > 0
                            ? 90 - (item.emissions / chartMax) * 80
                            : 90;

                        return (
                          <circle
                            key={item.date}
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill="#2e7d32"
                            stroke="white"
                            strokeWidth="0.6"
                            vectorEffect="non-scaling-stroke"
                          >
                            <title>
                              {item.label}: {item.emissions.toFixed(2)} kg CO₂e
                            </title>
                          </circle>
                        );
                      })}

                    </svg>

                  </div>

                </div>

                <div className="analytics-chart-labels">
                  {labelIndexes.map((index) => (
                    <span key={index}>
                      {chartData[index].label}
                    </span>
                  ))}
                </div>
              </>

            )}

          </div>


          {/* Category Breakdown */}
          <div className="dashboard-card analytics-category-card">

            <div className="card-header">
              <div>
                <h3>Emissions by Category</h3>
                <p>{rangeLabel} category breakdown</p>
              </div>
            </div>

            <div className="donut-container">

              <div
                className="donut-chart"
                style={{ background: donutBackground }}
              >
                <div className="donut-center">
                  <strong>{totalEmissions.toFixed(2)}</strong>
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
        <section className="dashboard-bottom-grid analytics-bottom-grid">

          {/* Category Details */}
          <div className="dashboard-card analytics-details-card">

            <div className="card-header">
              <div>
                <h3>Category Details</h3>
                <p>Emission contribution by activity type</p>
              </div>
            </div>

            <div className="analytics-category-details">

              {categoryStats.map((category) => (
                <div className="analytics-category-row" key={category.name}>

                  <div className="analytics-category-row-top">
                    <span>
                      {category.icon} {category.name}
                    </span>

                    <strong>
                      {category.amount.toFixed(2)} kg
                    </strong>
                  </div>

                  <div className="analytics-progress">
                    <div
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }}
                    ></div>
                  </div>

                  <p>
                    {category.count} {category.count === 1 ? "activity" : "activities"}
                  </p>

                </div>
              ))}

            </div>

          </div>


          {/* Recent Activities */}
          <div className="dashboard-card analytics-recent-card">

            <div className="card-header">
              <div>
                <h3>Recent Activities</h3>
                <p>Latest recorded entries in this period</p>
              </div>

              <Link to="/history">View All</Link>
            </div>

            {recentEntries.length === 0 ? (

              <p className="analytics-no-activity">
                No activities recorded for this period.
              </p>

            ) : (

              <div className="activity-list">

                {recentEntries.map((entry) => {
                  const categoryInfo = categories.find(
                    (category) => category.name === entry.category
                  );

                  return (
                    <div className="activity-item" key={entry.id}>

                      <div className="activity-icon">
                        {categoryInfo ? categoryInfo.icon : "🌱"}
                      </div>

                      <div className="activity-info">
                        <strong>
                          {entry.activity || entry.category}
                        </strong>

                        <span>
                          {formatDate(entry.date)}
                        </span>
                      </div>

                      <strong>
                        {(Number(entry.emissions) || 0).toFixed(2)} kg
                      </strong>

                    </div>
                  );
                })}

              </div>

            )}

          </div>

        </section>


        <p className="analytics-disclaimer">
          Note: These analytics are based on your saved activities and
          estimated emission factors. Actual emissions may vary.
        </p>

      </main>
    </div>
  );
}

export default Analytics;