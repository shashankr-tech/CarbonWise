import { Link, NavLink } from "react-router-dom";
import { getTokenRole } from "../utils/auth";

function Sidebar() {
  const isOfficer = getTokenRole() === "officer";
  const getLinkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">↗</div>
        <span>
          Carbon<span>Wise</span>
        </span>
      </div>

      <nav className="sidebar-nav">

        <NavLink to="/dashboard" end className={getLinkClass}>
          <span>▣</span>
          Dashboard
        </NavLink>

        <NavLink to="/add-entry" className={getLinkClass}>
          <span>＋</span>
          Add Carbon Entry
        </NavLink>

        <NavLink to="/vehicles" className={getLinkClass}>
          <span>🚗</span>
          My Vehicles
        </NavLink>

        <NavLink to="/rto-submit" className={getLinkClass}>
          <span>📄</span>
          RTO Submission
        </NavLink>

        {isOfficer && (
          <NavLink to="/rto-dashboard" className={getLinkClass}>
            <span>▤</span>
            RTO Officer Portal
          </NavLink>
        )}

        <NavLink to="/history" className={getLinkClass}>
          <span>◷</span>
          Carbon History
        </NavLink>

        <NavLink to="/analytics" className={getLinkClass}>
          <span>▥</span>
          Analytics
        </NavLink>

        <NavLink to="/profile" className={getLinkClass}>
          <span>◉</span>
          Profile
        </NavLink>

      </nav>

      <div className="sidebar-bottom">
        <Link to="/" className="sidebar-link logout-link">
          <span>↪</span>
          Logout
        </Link>
      </div>

    </aside>
  );
}

export default Sidebar;