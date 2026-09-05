import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/login",
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
        setError(data.message || "Invalid admin credentials");
        return;
      }

      // Save admin information
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      // Go to admin page
      navigate("/admin/dashboard");

    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to server. Please start backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      {/* Background decoration */}
      <div className="admin-glow glow-one"></div>
      <div className="admin-glow glow-two"></div>


      <div className="admin-login-card">

        {/* LOGO */}

        <div className="admin-logo">

          <div className="admin-logo-icon">
            ▶
          </div>

          <div className="admin-logo-text">
            BOOK<span>2</span>WATCH
          </div>

        </div>


        {/* TITLE */}

        <div className="admin-heading">

          <p>WELCOME BACK</p>

          <h1>
            Admin Login
          </h1>

          <span>
            Manage your movie booking system
          </span>

        </div>


        {/* FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="admin-input-group">

            <label>
              Admin Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>


          {/* PASSWORD */}

          <div className="admin-input-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login as Admin →"}
          </button>

        </form>


        {/* BACK */}

        <button
          className="back-home-btn"
          onClick={() => navigate("/login")}
        >
          ← Back to User Login
        </button>


        <div className="admin-footer-text">
          🔒 Secure Admin Access
        </div>

      </div>

    </div>
  );
}

export default AdminLogin;