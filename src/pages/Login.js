import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="auth-page">

      {/* Left Side */}
      <div className="auth-visual">
        <div className="auth-logo">
          Carbon<span>Wise</span>
        </div>

        <div className="auth-visual-content">
          <div className="leaf-icon">🌱</div>

          <h1>Track. Reduce. Sustain.</h1>

          <p>
            Take control of your carbon footprint and make
            every choice count for a greener future.
          </p>

          <div className="auth-stats">
            <div>
              <strong>🌍</strong>
              <span>Track your impact</span>
            </div>

            <div>
              <strong>♻</strong>
              <span>Reduce emissions</span>
            </div>

            <div>
              <strong>🌱</strong>
              <span>Build a greener future</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-form-section">
        <div className="auth-form-card">

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>

          <h2>Welcome Back</h2>

          <p className="auth-subtitle">
            Login to continue tracking your carbon footprint.
          </p>

          <form>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label>Password</label>
                <a href="#forgot">Forgot Password?</a>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="remember-row">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
            </div>

            <button type="submit" className="auth-submit">
              Login
            </button>

          </form>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/register"> Create Account</Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;