import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminBookings.css";

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FETCH BOOKINGS
  // ==============================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/bookings"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch bookings"
        );
      }

      setBookings(
        Array.isArray(data)
          ? data
          : data.bookings || []
      );

      setError("");
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError("Bookings load nahi ho paayi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==============================
  // CANCEL BOOKING
  // ==============================

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel booking"
        );
      }

      alert("Booking cancelled successfully.");

      fetchBookings();
    } catch (err) {
      console.error("Cancel booking error:", err);

      alert(
        err.message || "Booking cancel nahi ho paayi."
      );
    }
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    navigate("/admin-login");
  };

  // ==============================
  // FILTER BOOKINGS
  // ==============================

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      booking.bookingId
        ?.toLowerCase()
        .includes(searchText) ||
      booking.movie
        ?.toLowerCase()
        .includes(searchText) ||
      booking.theatre
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ==============================
  // STATS
  // ==============================

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  ).length;

  const totalRevenue = bookings
    .filter((booking) => booking.status !== "Cancelled")
    .reduce(
      (total, booking) =>
        total + Number(booking.totalAmount || 0),
      0
    );

  return (
    <div className="admin-cinemas-page">

      {/* ================= SIDEBAR ================= */}

<aside className="admin-sidebar">

  <Link
    to="/admin/dashboard"
    className="admin-brand"
  >
    <div className="brand-title">
      BOOK<span>2</span>WATCH
    </div>

    <div className="brand-subtitle">
      ADMIN PANEL
    </div>
  </Link>

  <div className="sidebar-line"></div>

  <nav className="sidebar-menu">

    <Link
      to="/admin/dashboard"
      className="sidebar-link"
    >
      <span className="sidebar-icon">⌂</span>
      <span>Dashboard</span>
    </Link>

    <Link
      to="/admin/movies"
      className="sidebar-link"
    >
      <span className="sidebar-icon">🎬</span>
      <span>Movies</span>
    </Link>

    <Link
      to="/admin/cinemas"
      className="sidebar-link"
    >
      <span className="sidebar-icon">🏢</span>
      <span>Cinemas</span>
    </Link>

    <Link
      to="/admin/shows"
      className="sidebar-link"
    >
      <span className="sidebar-icon">📅</span>
      <span>Shows</span>
    </Link>

    <Link
      to="/admin/users"
      className="sidebar-link"
    >
      <span className="sidebar-icon">👥</span>
      <span>Users</span>
    </Link>

    <Link
      to="/admin/bookings"
      className="sidebar-link active"
    >
      <span className="sidebar-icon">🎟️</span>
      <span>Bookings</span>
    </Link>

    <Link
      to="/admin/profile"
      className="sidebar-link"
    >
      <span className="sidebar-icon">👤</span>
      <span>Profile</span>
    </Link>

  </nav>

  <div className="sidebar-bottom">

    <button
      className="sidebar-logout"
      onClick={handleLogout}
    >
      <span className="sidebar-icon">↪</span>
      <span>Logout</span>
    </button>

  </div>

</aside>

      {/* ==============================
          MAIN CONTENT
      ============================== */}

      <main className="admin-main">

        <div className="admin-header">

          <div>
            <h1>Bookings</h1>
            <p>
              Manage all movie ticket bookings
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchBookings}
          >
            🔄 Refresh
          </button>

        </div>

        {/* ==============================
            STATS
        ============================== */}

        <div className="booking-stats">

          <div className="booking-stat-card">
            <div className="stat-icon">🎟️</div>
            <div>
              <h3>{totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="booking-stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <h3>{confirmedBookings}</h3>
              <p>Confirmed</p>
            </div>
          </div>

          <div className="booking-stat-card">
            <div className="stat-icon">❌</div>
            <div>
              <h3>{cancelledBookings}</h3>
              <p>Cancelled</p>
            </div>
          </div>

          <div className="booking-stat-card">
            <div className="stat-icon">💰</div>
            <div>
              <h3>₹{totalRevenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

        </div>

        {/* ==============================
            FILTERS
        ============================== */}

        <div className="booking-filters">

          <input
            type="text"
            placeholder="🔍 Search Booking ID, Movie, Theatre..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Confirmed">
              Confirmed
            </option>
            <option value="Cancelled">
              Cancelled
            </option>
          </select>

        </div>

        {/* ==============================
            ERROR
        ============================== */}

        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}

        {/* ==============================
            TABLE
        ============================== */}

        <div className="bookings-table-container">

          {loading ? (
            <div className="booking-loading">
              Loading bookings...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="booking-empty">
              <div>🎟️</div>
              <h3>No bookings found</h3>
              <p>
                Bookings will appear here after
                customers book tickets.
              </p>
            </div>
          ) : (
            <table className="bookings-table">

              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredBookings.map((booking) => (

                  <tr key={booking._id}>

                    <td>
                      <strong className="booking-id-text">
                        {booking.bookingId}
                      </strong>
                    </td>

                    <td>
                      {booking.movie}
                    </td>

                    <td>
                      {booking.theatre}
                    </td>

                    <td>
                      {booking.date}
                    </td>

                    <td>
                      {booking.time}
                    </td>

                    <td>
                      <span className="seat-badge">
                        {Array.isArray(booking.seats)
                          ? booking.seats.join(", ")
                          : booking.seats}
                      </span>
                    </td>

                    <td>
                      <strong>
                        ₹{booking.totalAmount}
                      </strong>
                    </td>

                    <td>

                      <span
                        className={
                          booking.status === "Cancelled"
                            ? "status cancelled"
                            : "status confirmed"
                        }
                      >
                        {booking.status ||
                          "Confirmed"}
                      </span>

                    </td>

                    <td>

                      {booking.status !== "Cancelled" ? (
                        <button
                          className="cancel-booking-btn"
                          onClick={() =>
                            cancelBooking(
                              booking._id
                            )
                          }
                        >
                          ❌ Cancel
                        </button>
                      ) : (
                        <span className="cancelled-text">
                          Cancelled
                        </span>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}

        </div>

      </main>

    </div>
  );
}

export default AdminBookings;