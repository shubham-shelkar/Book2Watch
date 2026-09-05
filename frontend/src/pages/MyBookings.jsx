import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load bookings"
          );
        }

        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setError("Bookings load nahi ho paayi.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="my-bookings-page">

      {/* NAVBAR */}
      
      <Navbar />
      
      {/* MAIN CONTENT */}
      <main className="my-bookings-container">

        <div className="bookings-heading">

          <p>BOOK2WATCH</p>

          <h1>
            My Bookings
          </h1>

          <span>
            Your movie tickets and booking history
          </span>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="booking-message">
            <h2>Loading bookings...</h2>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="booking-message error">
            <h2>{error}</h2>
          </div>
        )}

        {/* NO BOOKINGS */}
        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="booking-message">

              <div className="empty-icon">
                🎬
              </div>

              <h2>
                No Bookings Yet
              </h2>

              <p>
                You haven't booked any movie tickets yet.
              </p>

              <Link
                to="/home"
                className="browse-movies-btn"
              >
                Browse Movies
              </Link>

            </div>
          )}

        {/* BOOKINGS */}
        {!loading &&
          !error &&
          bookings.length > 0 && (

            <div className="bookings-list">

              {bookings.map((booking) => (

                <div
                  className="booking-ticket"
                  key={booking._id}
                >

                  <div className="ticket-left">

                    <div className="ticket-movie">
                      🎬 {booking.movie}
                    </div>

                    <div className="ticket-info">

                      <p>
                        <strong>Theatre</strong>
                        <span>
                          {booking.theatre}
                        </span>
                      </p>

                      <p>
                        <strong>Date</strong>
                        <span>
                          {booking.date}
                        </span>
                      </p>

                      <p>
                        <strong>Time</strong>
                        <span>
                          {booking.time}
                        </span>
                      </p>

                      <p>
                        <strong>Seats</strong>
                        <span>
                          {booking.seats.join(", ")}
                        </span>
                      </p>

                    </div>

                  </div>

                  <div className="ticket-right">

                    <span className="paid-status">
                      ✓ PAID
                    </span>

                    <span className="ticket-label">
                      Booking ID
                    </span>

                    <strong className="ticket-id">
                      {booking.bookingId}
                    </strong>

                    <span className="ticket-amount">
                      ₹{booking.totalAmount}
                    </span>

                  </div>

                </div>

              ))}

            </div>
          )}

      </main>

      <Footer />
    </div>
  );
}

export default MyBookings;