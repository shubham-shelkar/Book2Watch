import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="common-navbar">

      {/* LOGO */}
      <Link to="/home" className="common-logo">
        <span className="common-logo-icon">▶</span>

        <span className="common-logo-text">
          BOOK<span>2</span>WATCH
        </span>
      </Link>

      {/* NAVIGATION */}
      <div className="common-nav-links">

        <Link
          to="/home"
          className={location.pathname === "/home" ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/movies"
          className={location.pathname === "/movies" ? "active" : ""}
        >
          Movies
        </Link>

        <Link
          to="/bookings"
          className={location.pathname === "/bookings" ? "active" : ""}
        >
          My Bookings
        </Link>

        <Link
          to="/about"
          className={location.pathname === "/about" ? "active" : ""}
        >
          About Us
        </Link>

        <button
          className="common-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;