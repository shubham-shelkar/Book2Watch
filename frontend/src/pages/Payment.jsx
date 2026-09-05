import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;

  const [bookingId, setBookingId] = useState("");
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState("");

  const bookingStarted = useRef(false);


  useEffect(() => {
  if (!booking) {
    setSaving(false);
    return;
  }

  // Prevent duplicate booking API call
  if (bookingStarted.current) {
    return;
  }

  bookingStarted.current = true;

  const saveBooking = async () => {
      try {
        /* =====================================
           1. MOVIE NAME
        ===================================== */

        const movieName =
          typeof booking.movie === "object"
            ? booking.movie.title
            : booking.movie;

        /* =====================================
           2. SHOW ID CHECK
        ===================================== */

        const showId =
          booking.show?._id || booking.show?.id;

        if (!showId) {
          throw new Error("Show information not found.");
        }

        /* =====================================
           3. BOOK SEATS IN SHOW
           
           This will save selected seats in
           MongoDB -> Show.bookedSeats
        ===================================== */

        const seatResponse = await fetch(
          `http://localhost:5000/api/shows/${showId}/book-seats`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              seats: booking.seats,
            }),
          }
        );

        const seatData = await seatResponse.json();

        if (!seatResponse.ok) {
          if (seatResponse.status === 409) {
            throw new Error(
              "Some selected seats are already booked. Please select different seats."
            );
          }

          throw new Error(
            seatData.message || "Seat booking failed."
          );
        }

        /* =====================================
           4. SAVE BOOKING
        ===================================== */

        const response = await fetch(
          "http://localhost:5000/api/bookings",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              movie: movieName,
              theatre: booking.theatre,
              date: booking.date,
              time: booking.time,
              seats: booking.seats,
              totalAmount: booking.totalAmount,
              showId: showId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Booking failed"
          );
        }

        /* =====================================
           5. BOOKING ID
        ===================================== */

        setBookingId(data.booking.bookingId);
        setSaving(false);

      } catch (err) {
        console.error("Booking save error:", err);

        setError(
          err.message || "Booking save nahi ho paayi."
        );

        setSaving(false);
      }
    };

    saveBooking();
  }, [booking]);

  /* ==============================
     BOOKING NOT FOUND
  ============================== */

  if (!booking) {
    return (
      <div className="payment-page">
        <div className="payment-card">

          <div className="success-icon">
            ⚠️
          </div>

          <h1>
            Booking Information Not Found
          </h1>

          <button
            className="payment-home-btn"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>

        </div>
      </div>
    );
  }

  const movieName =
    typeof booking.movie === "object"
      ? booking.movie.title
      : booking.movie;

  const seats = Array.isArray(booking.seats)
    ? booking.seats.join(", ")
    : booking.seats;

  /* ==============================
     PROCESSING
  ============================== */

  if (saving) {
    return (
      <div className="payment-page">

        <div className="payment-card">

          <div className="success-icon">
            ⏳
          </div>

          <h1>
            Processing Payment...
          </h1>

          <h2>
            Please wait...
          </h2>

        </div>

      </div>
    );
  }

  /* ==============================
     ERROR
  ============================== */

  if (error) {
    return (
      <div className="payment-page">

        <div className="payment-card">

          <div className="success-icon">
            ❌
          </div>

          <h1 className="payment-failed-title">
            Booking Failed
          </h1>

          <h2 className="payment-error">
            {error}
          </h2>

          <button
            className="payment-home-btn"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>

        </div>

      </div>
    );
  }

  /* ==============================
     PAYMENT SUCCESS
  ============================== */

  return (
    <div className="payment-page">

      <div className="payment-card">

        {/* SUCCESS ICON */}

        <div className="success-icon">
          ✅
        </div>

        {/* TITLE */}

        <h1>
          Payment Successful
        </h1>

        <h2>
          Booking Confirmed!
        </h2>

        {/* BOOKING DETAILS */}

        <div className="booking-details">

          <p>
            <strong>Movie:</strong>
            <span>{movieName}</span>
          </p>

          <p>
            <strong>Theatre:</strong>
            <span>{booking.theatre}</span>
          </p>

          <p>
            <strong>Date:</strong>
            <span>{booking.date}</span>
          </p>

          <p>
            <strong>Time:</strong>
            <span>{booking.time}</span>
          </p>

          <p>
            <strong>Seats:</strong>
            <span>{seats}</span>
          </p>

          <p>
            <strong>Amount Paid:</strong>
            <span>₹{booking.totalAmount}</span>
          </p>

        </div>

        {/* BOOKING ID */}

        <div className="booking-id">

          <span>
            BOOKING ID
          </span>

          <strong>
            {bookingId}
          </strong>

        </div>

        <Link to="/home" className="brand-logo">
        <span className="brand-text">
            BOOK<span>2</span>WATCH
        </span>
    </Link>


        {/* ==============================
            NAVIGATION BUTTONS
        ============================== */}

        <div className="payment-actions">

          <button
            className="view-bookings-btn"
            onClick={() => navigate("/bookings")}
          >
            🎟️ View My Bookings
          </button>

          <button
            className="payment-home-btn"
            onClick={() => navigate("/home")}
          >
            ← Back to Home
          </button>

        </div>

      </div>

    </div>
  );
}

export default Payment;