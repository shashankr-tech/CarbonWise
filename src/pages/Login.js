
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { saveToken, clearLegacyData } from "../utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Check whether the backend returned user details
      if (!data.user) {
        throw new Error("User information was not received.");
      }

      // Check whether the backend returned a JWT token
if (!data.token) {
  throw new Error("Authentication token was not received.");
}

// Save the JWT token. This is the only thing kept in the browser.
// Profile, vehicles and carbon entries are stored in MongoDB.
saveToken(data.token);

// Remove old browser copies of data that now lives in MongoDB
clearLegacyData();

      setMessage(data.message || "Login successful!");

      navigate("/dashboard");

    } catch (error) {
      setMessage(
        error.message || "Unable to connect to the backend."
      );
    } finally {
      setIsLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="password-label">
                <label>Password</label>
                <a href="#forgot">Forgot Password?</a>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {/* Remember Me */}
            <div className="remember-row">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />
                Remember me
              </label>
            </div>

            {/* Response Message */}
            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
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
