import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    cinemas: 0,
    shows: 0,
    bookings: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // =========================
      // FETCH ALL APIs
      // =========================

      const [
        usersResponse,
        moviesResponse,
        cinemasResponse,
        showsResponse,
        bookingsResponse,
      ] = await Promise.all([
        fetch("http://localhost:5000/api/users"),
        fetch("http://localhost:5000/api/movies"),
        fetch("http://localhost:5000/api/cinemas"),
        fetch("http://localhost:5000/api/shows"),
        fetch("http://localhost:5000/api/bookings"),
      ]);

      // =========================
      // CHECK API RESPONSES
      // =========================

      if (
        !usersResponse.ok ||
        !moviesResponse.ok ||
        !cinemasResponse.ok ||
        !showsResponse.ok ||
        !bookingsResponse.ok
      ) {
        throw new Error("One or more APIs failed");
      }

      // =========================
      // CONVERT TO JSON
      // =========================

      const usersData = await usersResponse.json();
      const moviesData = await moviesResponse.json();
      const cinemasData = await cinemasResponse.json();
      const showsData = await showsResponse.json();
      const bookingsData = await bookingsResponse.json();

      // =========================
      // NORMALIZE DATA
      // =========================

      const users = Array.isArray(usersData)
        ? usersData
        : usersData.users || [];

      const movies = Array.isArray(moviesData)
        ? moviesData
        : moviesData.movies || [];

      const cinemas = Array.isArray(cinemasData)
        ? cinemasData
        : cinemasData.cinemas || [];

      const shows = Array.isArray(showsData)
        ? showsData
        : showsData.shows || [];

      const bookings = Array.isArray(bookingsData)
        ? bookingsData
        : bookingsData.bookings || [];

      // =========================
      // CALCULATE REVENUE
      // =========================

      const revenue = bookings.reduce((total, booking) => {
        // Cancelled bookings ko revenue me include nahi karna
        if (
          booking.status &&
          booking.status.toLowerCase() === "cancelled"
        ) {
          return total;
        }

        return total + Number(booking.totalAmount || 0);
      }, 0);

      // =========================
      // SET STATS
      // =========================

      setStats({
        users: users.length,
        movies: movies.length,
        cinemas: cinemas.length,
        shows: shows.length,
        bookings: bookings.length,
        revenue: revenue,
      });

    } catch (error) {
      console.error("Dashboard error:", error);

      // Agar kisi API me problem ho to
      // console me exact error dikhega
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    navigate("/admin/login");
  };

  // =========================
  // QUICK ACTIONS
  // =========================

  const goToMovies = () => {
    navigate("/admin/movies");
  };

  const goToCinemas = () => {
    navigate("/admin/cinemas");
  };

  const goToShows = () => {
    navigate("/admin/shows");
  };

  const goToBookings = () => {
    navigate("/admin/bookings");
  };

  return (
    <div className="admin-dashboard">

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
            className="sidebar-link active"
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
            className="sidebar-link"
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


      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-main">

        {/* ================= HEADER ================= */}

        <header className="dashboard-header">

          <div className="dashboard-title">

            <h1>Dashboard</h1>

            <p>
              Welcome back, Admin!
            </p>

          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              👤
            </div>

            <div className="admin-profile-info">

              <strong>Admin</strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </header>


        {/* ================= STATS ================= */}

        <section className="stats-grid">

          {/* USERS */}

          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div className="stat-content">

              <p>Total Users</p>

              <h2>
                {loading ? "..." : stats.users}
              </h2>

            </div>

          </div>


          {/* MOVIES */}

          <div className="stat-card">

            <div className="stat-icon">
              🎬
            </div>

            <div className="stat-content">

              <p>Total Movies</p>

              <h2>
                {loading ? "..." : stats.movies}
              </h2>

            </div>

          </div>


          {/* CINEMAS */}

          <div className="stat-card">

            <div className="stat-icon">
              🏢
            </div>

            <div className="stat-content">

              <p>Total Cinemas</p>

              <h2>
                {loading ? "..." : stats.cinemas}
              </h2>

            </div>

          </div>


          {/* SHOWS */}

          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div className="stat-content">

              <p>Total Shows</p>

              <h2>
                {loading ? "..." : stats.shows}
              </h2>

            </div>

          </div>


          {/* BOOKINGS */}

          <div className="stat-card">

            <div className="stat-icon">
              🎟️
            </div>

            <div className="stat-content">

              <p>Total Bookings</p>

              <h2>
                {loading ? "..." : stats.bookings}
              </h2>

            </div>

          </div>


          {/* REVENUE */}

          <div className="stat-card">

            <div className="stat-icon">
              ₹
            </div>

            <div className="stat-content">

              <p>Total Revenue</p>

              <h2>
                {loading
                  ? "..."
                  : `₹${stats.revenue.toFixed(2)}`}
              </h2>

            </div>

          </div>

        </section>


        {/* ================= QUICK ACTIONS ================= */}

        <section className="quick-actions">

          <div className="quick-header">

            <h2>
              Quick Actions
            </h2>

            <p>
              Manage your Book2Watch system.
            </p>

          </div>


          <div className="quick-grid">

            {/* ADD MOVIE */}

            <button
              className="quick-card"
              onClick={goToMovies}
            >

              <div className="quick-icon">
                🎬
              </div>

              <div className="quick-content">

                <h3>
                  Add Movie
                </h3>

                <p>
                  Add a new movie
                </p>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>


            {/* ADD CINEMA */}

            <button
              className="quick-card"
              onClick={goToCinemas}
            >

              <div className="quick-icon">
                🏢
              </div>

              <div className="quick-content">

                <h3>
                  Add Cinema
                </h3>

                <p>
                  Add a new cinema
                </p>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>


            {/* ADD SHOW */}

            <button
              className="quick-card"
              onClick={goToShows}
            >

              <div className="quick-icon">
                📅
              </div>

              <div className="quick-content">

                <h3>
                  Add Show
                </h3>

                <p>
                  Create a new show
                </p>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>


            {/* BOOKINGS */}

            <button
              className="quick-card"
              onClick={goToBookings}
            >

              <div className="quick-icon">
                🎟️
              </div>

              <div className="quick-content">

                <h3>
                  View Bookings
                </h3>

                <p>
                  Manage all bookings
                </p>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;