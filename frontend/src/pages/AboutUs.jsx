import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar />


      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="about-hero">

        <div className="about-hero-content">

          <p className="about-small-title">
            ABOUT BOOK2WATCH
          </p>

          <h1>
            Your Movie.
            <br />
            Your Seat.
            <br />
            Your Experience.
          </h1>

          <p className="about-hero-text">
            Book your favourite movies, choose your perfect seats,
            and enjoy a simple and seamless cinema experience with
            Book2Watch.
          </p>

        </div>

      </section>


      {/* =========================
          ABOUT SECTION
      ========================= */}

      <section className="about-content">

        <div className="about-section-title">

          <p>
            WHO WE ARE
          </p>

          <h2>
            Welcome to Book2Watch
          </h2>

        </div>


        <div className="about-description">

          <p>
            <strong>Book2Watch</strong> is a movie ticket booking
            platform designed to make your cinema experience simple,
            fast and convenient.
          </p>

          <p>
            Our platform allows users to explore movies, view movie
            details, select theatres and show timings, choose their
            preferred seats and complete their booking online.
          </p>

          <p>
            We created Book2Watch with one simple goal:
            <strong> make movie ticket booking easier for everyone.</strong>
          </p>

        </div>

      </section>


      {/* =========================
          FEATURES
      ========================= */}

      <section className="about-features">

        <div className="feature-card">

          <div className="feature-icon">
            🎬
          </div>

          <h3>
            Explore Movies
          </h3>

          <p>
            Discover popular and latest movies with complete
            movie information.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            🎟️
          </div>

          <h3>
            Easy Booking
          </h3>

          <p>
            Select your theatre, show timing and preferred seats
            with just a few clicks.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            🔒
          </div>

          <h3>
            Secure Booking
          </h3>

          <p>
            Your booking information is safely stored and available
            in your My Bookings section.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            ⚡
          </div>

          <h3>
            Simple Experience
          </h3>

          <p>
            A clean and user-friendly interface makes booking
            movie tickets quick and easy.
          </p>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section className="how-section">

        <div className="about-section-title">

          <p>
            HOW IT WORKS
          </p>

          <h2>
            Book Your Movie in 4 Steps
          </h2>

        </div>


        <div className="steps-container">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>
              Choose a Movie
            </h3>

            <p>
              Browse the available movies and select your favourite.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>
              Select Show
            </h3>

            <p>
              Choose your preferred theatre, date and show timing.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>
              Select Seats
            </h3>

            <p>
              Pick the seats you want for your movie experience.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              04
            </div>

            <h3>
              Confirm Booking
            </h3>

            <p>
              Complete the payment and get your booking confirmation.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          CTA
      ========================= */}

      <section className="about-cta">

        <p>
          READY FOR YOUR NEXT MOVIE?
        </p>

        <h2>
          Your Seat is Waiting.
        </h2>

        <Link
          to="/movies"
          className="about-cta-btn"
        >
          Explore Movies 🎬
        </Link>

      </section>


{
/* =========================
    FOOTER
========================= */}

<Footer />

    </div>
  );
}

export default AboutUs;