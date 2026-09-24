import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

function Dashboard() {
  const [monthlyEmissions, setMonthlyEmissions] = useState(245.6);
  const carbonSaved = 38.2;

  const goalProgress = useMemo(() => {
    const target = 340;
    return Math.round((monthlyEmissions / target) * 100);
  }, [monthlyEmissions]);

  const handleAddEmission = () => {
    setMonthlyEmissions(monthlyEmissions + 5);
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

          <Link to="/dashboard" className="sidebar-link active">
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

          <Link to="/history" className="sidebar-link">
            <span>◷</span>
            Carbon History
          </Link>

          <Link to="/analytics" className="sidebar-link">
            <span>▥</span>
            Analytics
          </Link>

          <Link to="/" className="sidebar-link">
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

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Today's Emissions</span>
              <div className="stat-icon green">☀</div>
            </div>

            <h2>12.4 <small>kg CO₂e</small></h2>

            <p className="stat-positive">
              ↓ 4.2% from yesterday
            </p>
          </div>


          <div className="stat-card">
            <div className="stat-card-top">
              <span>Monthly Emissions</span>
              <div className="stat-icon blue">◷</div>
            </div>

            <h2>
              {monthlyEmissions} <small>kg CO₂e</small>
            </h2>

            <p className="stat-positive">
              ↓ 8.4% from last month
            </p>
          </div>


          <div className="stat-card">
            <div className="stat-card-top">
              <span>Carbon Saved</span>
              <div className="stat-icon green">♻</div>
            </div>

            <h2>
              {carbonSaved} <small>kg CO₂e</small>
            </h2>

            <p className="stat-positive">
              ↑ 12.6% this month
            </p>
          </div>


          <div className="stat-card">
            <div className="stat-card-top">
              <span>Goal Progress</span>
              <div className="stat-icon orange">🎯</div>
            </div>

            <h2>{goalProgress}%</h2>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              ></div>
            </div>

            <p>Monthly reduction target</p>
          </div>

        </section>


        {/* Charts */}
        <section className="dashboard-grid">

          {/* Emissions Trend */}
          <div className="dashboard-card trend-card">

            <div className="card-header">
              <div>
                <h3>30-Day Emissions Trend</h3>
                <p>Your daily carbon emissions</p>
              </div>

              <select>
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>This Month</option>
              </select>
            </div>

            <div className="chart-area">

              <div className="chart-y-axis">
                <span>20</span>
                <span>15</span>
                <span>10</span>
                <span>5</span>
                <span>0</span>
              </div>

              <div className="line-chart">

                <div className="chart-line">
                  <span style={{ left: "5%", top: "55%" }}></span>
                  <span style={{ left: "15%", top: "40%" }}></span>
                  <span style={{ left: "25%", top: "48%" }}></span>
                  <span style={{ left: "35%", top: "30%" }}></span>
                  <span style={{ left: "45%", top: "42%" }}></span>
                  <span style={{ left: "55%", top: "25%" }}></span>
                  <span style={{ left: "65%", top: "35%" }}></span>
                  <span style={{ left: "75%", top: "20%" }}></span>
                  <span style={{ left: "85%", top: "30%" }}></span>
                  <span style={{ left: "95%", top: "18%" }}></span>
                </div>

              </div>

            </div>

            <div className="chart-labels">
              <span>Jun 1</span>
              <span>Jun 7</span>
              <span>Jun 14</span>
              <span>Jun 21</span>
              <span>Jun 30</span>
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

              <div className="donut-chart">
                <div className="donut-center">
                  <strong>245.6</strong>
                  <span>kg CO₂e</span>
                </div>
              </div>

            </div>

            <div className="category-list">

              <div>
                <span className="category-dot transportation"></span>
                <span>Transportation</span>
                <strong>42%</strong>
              </div>

              <div>
                <span className="category-dot electricity"></span>
                <span>Electricity</span>
                <strong>28%</strong>
              </div>

              <div>
                <span className="category-dot household"></span>
                <span>Household Fuel</span>
                <strong>18%</strong>
              </div>

              <div>
                <span className="category-dot water"></span>
                <span>Water</span>
                <strong>12%</strong>
              </div>

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

              <div className="activity-item">
                <div className="activity-icon">🚗</div>

                <div className="activity-info">
                  <strong>Honda City</strong>
                  <span>Transportation • Today</span>
                </div>

                <strong>6.2 kg</strong>
              </div>

              <div className="activity-item">
                <div className="activity-icon">⚡</div>

                <div className="activity-info">
                  <strong>Electricity Usage</strong>
                  <span>Electricity • Yesterday</span>
                </div>

                <strong>3.1 kg</strong>
              </div>

              <div className="activity-item">
                <div className="activity-icon">🔥</div>

                <div className="activity-info">
                  <strong>LPG Consumption</strong>
                  <span>Household Fuel • Sep 21</span>
                </div>

                <strong>1.8 kg</strong>
              </div>

            </div>

          </div>


          {/* Environmental Insight */}
          <div className="dashboard-card insight-card">

            <div className="insight-icon">
              🌱
            </div>

            <h3>Environmental Insight</h3>

            <p>
              Your transportation emissions make up the
              largest part of your carbon footprint this month.
              Consider using public transport or carpooling
              when possible.
            </p>

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


        {/* Temporary React demonstration */}
        <button
          onClick={handleAddEmission}
          className="sample-button"
        >
          Add Sample Emission (+5 kg)
        </button>

      </main>

    </div>
  );
}

export default Dashboard;