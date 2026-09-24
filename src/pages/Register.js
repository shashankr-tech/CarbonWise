import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="auth-page">

      {/* Left Side */}
      <div className="auth-visual">
        <div className="auth-logo">
          Carbon<span>Wise</span>
        </div>

        <div className="auth-visual-content">
          <div className="leaf-icon">🌱</div>

          <h1>Start Your Green Journey.</h1>

          <p>
            Create your CarbonWise account and start
            understanding, tracking, and reducing your
            carbon footprint.
          </p>

          <div className="auth-stats">
            <div>
              <strong>📊</strong>
              <span>Track your emissions</span>
            </div>

            <div>
              <strong>🌍</strong>
              <span>Understand your impact</span>
            </div>

            <div>
              <strong>🌱</strong>
              <span>Make greener choices</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-form-section">
        <div className="auth-form-card register-card">

          <Link to="/" className="back-home">
            ← Back to Home
          </Link>

          <h2>Create Your Account</h2>

          <p className="auth-subtitle">
            Join CarbonWise and start tracking your carbon footprint.
          </p>

          <form>

            {/* Full Name */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
              />
            </div>

            {/* City and Age */}
            <div className="form-row">

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="Enter your city"
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Age"
                  min="1"
                />
              </div>

            </div>

            {/* Country */}
            <div className="form-group">
              <label>
                Country <span className="optional">(Optional)</span>
              </label>

              <input
                type="text"
                placeholder="Enter your country"
              />
            </div>

            {/* Terms */}
            <div className="terms-row">
              <label>
                <input type="checkbox" />
                <span>
                  I agree to the <a href="#terms">Terms of Service</a>{" "}
                  and <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="auth-submit">
              Create Account
            </button>

          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Register;