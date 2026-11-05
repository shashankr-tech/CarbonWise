
  import { Link } from "react-router-dom";

  function Navbar() {
    const scrollToSection = (event, sectionId) => {
      event.preventDefault();

      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    };

    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-icon">↗</div>
          <span>
            Carbon<span className="logo-green">Wise</span>
          </span>
        </div>

        <div className="navbar-links">
          <a
            href="#features"
            onClick={(event) => scrollToSection(event, "features")}
          >
            Features
          </a>

          <a
            href="#how-it-works"
            onClick={(event) => scrollToSection(event, "how-it-works")}
          >
            How It Works
          </a>

          <a
            href="#impact"
            onClick={(event) => scrollToSection(event, "impact")}
          >
            Impact
          </a>

          <a
            href="#about"
            onClick={(event) => scrollToSection(event, "about")}
          >
            About
          </a>
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
