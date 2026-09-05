import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

if (response.ok) {
  setMessage(data.message);

  // Login user save
  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  // 1 second ke baad Home page
  setTimeout(() => {
    navigate("/home");
  }, 1000);

} else {
  setError(data.message);
}

    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">

      {/* Animated background elements */}
      <div className="cinema-light"></div>

      <div className="floating-ticket ticket-1">🎟️</div>
      <div className="floating-ticket ticket-2">🎟️</div>
      <div className="floating-ticket ticket-3">🎟️</div>

      <div className="floating-popcorn popcorn-1">🍿</div>
      <div className="floating-popcorn popcorn-2">🍿</div>

      {/* Top Branding */}
      <div className="brand">
        <span>🎬</span>
        <strong>BOOK2WATCH</strong>
      </div>

      {/* Login Card */}
      <div className="login-card">

        <div className="logo">
          🎬
        </div>

        <div className="card-title">
          <h1>Welcome Back!</h1>

          <p>
            Book your favourite movie & enjoy the show 🍿
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

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
                type={
                  showPassword ? "text" : "password"
                }
                name="password"
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-btn"
          >
            <span>Login</span>
            <span className="btn-icon">🎟️</span>
          </button>

        </form>

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Register */}
        <p className="register-text">
          New to CineBook?

          <Link to="/register">
            Create an Account
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

export default Login;