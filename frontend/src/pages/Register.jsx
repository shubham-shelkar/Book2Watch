import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Password check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      if (response.ok) {
        setMessage(data.message);

        // Form clear
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Login page par redirect
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">

      {/* Cinematic background animation */}
      <div className="cinema-light"></div>

      {/* Floating movie elements */}
      <div className="floating-ticket ticket-1">🎟️</div>
      <div className="floating-ticket ticket-2">🎟️</div>
      <div className="floating-ticket ticket-3">🎟️</div>

      <div className="floating-popcorn popcorn-1">🍿</div>
      <div className="floating-popcorn popcorn-2">🍿</div>

      {/* Website branding */}
      <div className="brand">
        <span>🎬</span>
        <strong>BOOK2WATCH</strong>
      </div>

      {/* Register Card */}
      <div className="login-card register-card">

        {/* Logo */}
        <div className="logo">
          🎬
        </div>

        {/* Heading */}
        <div className="card-title">
          <h1>Create Account</h1>

          <p>
            Join CineBook and book your favourite movies 🍿
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="input-group">
            <label>Full Name</label>

            <div className="input-box">
              <span className="input-icon">👤</span>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email Address</label>

            <div className="input-box">
              <span className="input-icon">📧</span>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="input-box">
              <span className="input-icon">🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm Password</label>

            <div className="input-box">
              <span className="input-icon">🔐</span>

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="login-btn"
          >
            <span>Create Account</span>
            <span className="btn-icon">🎟️</span>
          </button>

        </form>

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Login Link */}
        <p className="register-text">
          Already have an account?

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

      {/* Bottom text */}
      <div className="bottom-text">
        <span>🎥</span>
        Your movie. Your seat. Your experience.
        <span>🍿</span>
      </div>

    </div>
  );
}

export default Register;