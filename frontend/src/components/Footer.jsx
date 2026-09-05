import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* ================= BRAND ================= */}

        <div className="footer-brand">

          <Link to="/home" className="footer-logo">
            🎬 BOOK2WATCH
          </Link>

          <p>
            Your movie. Your seat. Your experience. 🍿
          </p>

          <span>
            Book your favourite movies and enjoy the ultimate
            cinema experience.
          </span>

        </div>


        {/* ================= QUICK LINKS ================= */}

        <div className="footer-section footer-links">

          <h3>
            Quick Links
          </h3>

          <Link to="/home">
            Home
          </Link>

          <Link to="/movies">
            Movies
          </Link>

          <Link to="/bookings">
            My Bookings
          </Link>

          <Link to="/about">
            About Us
          </Link>

        </div>


        {/* ================= INFORMATION ================= */}

        <div className="footer-section footer-info">

          <h3>
            Information
          </h3>

          <Link to="/about">
            About Book2Watch
          </Link>

          <span>
            🎟️ Easy Ticket Booking
          </span>

          <span>
            💺 Choose Your Seats
          </span>

          <span>
            🔒 Secure Booking
          </span>

        </div>


        {/* ================= CONTACT ================= */}

        <div className="footer-section footer-contact">

          <h3>
            Contact
          </h3>

          <span>
            📧 support@book2watch.com
          </span>

          <span>
            📞 +91 98765 43210
          </span>

          <span>
            📍 India
          </span>

        </div>

      </div>


      {/* ================= BOTTOM ================= */}

      <div className="footer-bottom">

        <p>
          © 2026 BOOK2WATCH. All Rights Reserved.
        </p>

        <p>
          Made with ❤️ for movie lovers 🎬
        </p>

      </div>

    </footer>
  );
}

export default Footer;