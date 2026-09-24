import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">↗</div>
        <span>
          Carbon<span className="logo-green">Wise</span>
        </span>
      </div>

      <div className="navbar-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#impact">Impact</a>
        <a href="#about">About</a>
      </div>

      <div className="navbar-buttons">
        <Link to="/login" className="login-button">
          Login
        </Link>

        <Link to="/register" className="primary-button">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;