import { Link } from "react-router-dom";
import { useState } from "react";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setMessage("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage(data.message || "Registration successful!");
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

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

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
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength="6"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />
            </div>

            {/* City and Age */}
            <div className="form-row">

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Age"
                  min="1"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
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
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              />
            </div>

            {/* Terms */}
            <div className="terms-row">
              <label>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                />

                <span>
                  I agree to the <a href="#terms">Terms of Service</a>{" "}
                  and <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>
            </div>

            {/* Response Message */}
            {message && (
              <p role="status" className="auth-message">
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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