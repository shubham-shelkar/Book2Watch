import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminShows.css";

function AdminShows() {
  const navigate = useNavigate();

  // ================= STATES =================

  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  // ================= ADD SHOW FORM OPEN / CLOSE =================
  const [showFormOpen, setShowFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    movie: "",
    cinema: "",
    date: "",
    startTime: "",
    ticketPrice: "",
    totalSeats: "",
    status: "Active",
  });

  // ================= LOAD DATA =================

  useEffect(() => {
    fetchShows();
    fetchMovies();
    fetchCinemas();
  }, []);

  // ================= FETCH SHOWS =================

  const fetchShows = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/shows"
      );

      const data = await response.json();

      if (response.ok) {
        setShows(data.shows || []);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
    }
  };

  // ================= FETCH MOVIES =================

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/movies"
      );

      const data = await response.json();

      if (response.ok) {
        setMovies(data.movies || data || []);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // ================= FETCH CINEMAS =================

  const fetchCinemas = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/cinemas"
      );

      const data = await response.json();

      if (response.ok) {
        setCinemas(data.cinemas || []);
      }
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    }
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================= ADD / UPDATE SHOW =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `http://localhost:5000/api/shows/${editingId}`
        : "http://localhost:5000/api/shows";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert(
        editingId
          ? "Show updated successfully!"
          : "Show added successfully!"
      );

      // ================= RESET FORM =================

      setFormData({
        movie: "",
        cinema: "",
        date: "",
        startTime: "",
        ticketPrice: "",
        totalSeats: "",
        status: "Active",
      });

      setEditingId(null);

      // CLOSE FORM AFTER ADD / UPDATE
      setShowFormOpen(false);

      fetchShows();

    } catch (error) {
      console.error("Show submit error:", error);

      alert("Unable to connect to server");
    }
  };

  // ================= EDIT SHOW =================

  const handleEdit = (show) => {
    setEditingId(show._id);

    setFormData({
      movie: show.movie?._id || "",
      cinema: show.cinema?._id || "",
      date: show.date || "",
      startTime: show.startTime || "",
      ticketPrice: show.ticketPrice || "",
      totalSeats: show.totalSeats || "",
      status: show.status || "Active",
    });

    // OPEN FORM WHEN EDIT IS CLICKED
    setShowFormOpen(true);

    // Scroll top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE SHOW =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this show?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/shows/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete show");
        return;
      }

      alert("Show deleted successfully!");

      fetchShows();

    } catch (error) {
      console.error("Delete show error:", error);

      alert("Unable to connect to server");
    }
  };

  // ================= CANCEL EDIT / FORM =================

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      movie: "",
      cinema: "",
      date: "",
      startTime: "",
      ticketPrice: "",
      totalSeats: "",
      status: "Active",
    });

    // CLOSE ADD SHOW FORM
    setShowFormOpen(false);
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin-login");
  };

  // ================= SEARCH =================

  const filteredShows = shows.filter((show) => {
    const movieName =
      show.movie?.title?.toLowerCase() || "";

    const cinemaName =
      show.cinema?.name?.toLowerCase() || "";

    const searchText = search.toLowerCase();

    return (
      movieName.includes(searchText) ||
      cinemaName.includes(searchText) ||
      show.date?.toLowerCase().includes(searchText) ||
      show.status?.toLowerCase().includes(searchText)
    );
  });

  // ================= UI =================

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
            className="sidebar-link active"
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

        <div className="admin-topbar">

          <div>

            <p className="admin-breadcrumb">
              Admin / Shows
            </p>

            <h1>
              Show Management
            </h1>

          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              👥
            </div>

            <div>

              <strong>
                Admin
              </strong>

              <p>
                Administrator
              </p>

            </div>

          </div>

        </div>


        {/* ================= ADD SHOW FORM ================= */}

        {showFormOpen && (
          <section className="show-form-section">

            <div className="section-title">

              <div>

                <h2>
                  {editingId
                    ? "Edit Show"
                    : "Add New Show"}
                </h2>

                <p>
                  Select a movie and cinema to create a show.
                </p>

              </div>

            </div>


            <form
              className="show-form"
              onSubmit={handleSubmit}
            >

              {/* ================= MOVIE ================= */}

              <div className="form-group">

                <label>
                  Select Movie *
                </label>

                <select
                  name="movie"
                  value={formData.movie}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Movie
                  </option>

                  {movies.map((movie) => (

                    <option
                      key={movie._id}
                      value={movie._id}
                    >
                      {movie.title}
                    </option>

                  ))}

                </select>

              </div>


              {/* ================= CINEMA ================= */}

              <div className="form-group">

                <label>
                  Select Cinema *
                </label>

                <select
                  name="cinema"
                  value={formData.cinema}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Cinema
                  </option>

                  {cinemas.map((cinema) => (

                    <option
                      key={cinema._id}
                      value={cinema._id}
                    >
                      {cinema.name} - {cinema.city}
                    </option>

                  ))}

                </select>

              </div>


              {/* ================= DATE ================= */}

              <div className="form-group">

                <label>
                  Show Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* ================= START TIME ================= */}

              <div className="form-group">

                <label>
                  Start Time *
                </label>

                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* ================= TICKET PRICE ================= */}

              <div className="form-group">

                <label>
                  Ticket Price (₹) *
                </label>

                <input
                  type="number"
                  name="ticketPrice"
                  placeholder="Enter ticket price"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>


              {/* ================= TOTAL SEATS ================= */}

              <div className="form-group">

                <label>
                  Total Seats *
                </label>

                <input
                  type="number"
                  name="totalSeats"
                  placeholder="Enter total seats"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  min="1"
                  required
                />

              </div>


              {/* ================= STATUS ================= */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* ================= BUTTONS ================= */}

              <div className="show-form-buttons">

                   <button
                  type="button"
                  className="cancel-show-btn"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-show-btn"
                >
                  {editingId
                    ? "Update Show"
                    : "Add Show"}
                </button>

              </div>

            </form>

          </section>
        )}


        {/* ================= SHOWS LIST ================= */}

        <section className="shows-list-section">

          <div className="shows-list-header">

            <div>

              <h2>
                All Shows
              </h2>

              <p>
                Manage all movie shows from here.
              </p>

            </div>

            <div className="shows-list-actions">

              <input
                type="text"
                className="show-search"
                placeholder="Search movie, cinema or date..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {/* ================= ADD SHOW BUTTON ================= */}

              <button
                className="add-show-btn"
                onClick={() => {

                  setEditingId(null);

                  setFormData({
                    movie: "",
                    cinema: "",
                    date: "",
                    startTime: "",
                    ticketPrice: "",
                    totalSeats: "",
                    status: "Active",
                  });

                  setShowFormOpen(true);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });

                }}
              >
                + Add Show
              </button>

            </div>

          </div>


          {/* ================= TABLE ================= */}

          <div className="shows-table-wrapper">

            <table className="shows-table">

              <thead>

                <tr>

                  <th>Movie</th>

                  <th>Cinema</th>

                  <th>Date</th>

                  <th>Time</th>

                  <th>Price</th>

                  <th>Seats</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {filteredShows.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="no-shows"
                    >
                      No shows found.
                    </td>

                  </tr>

                ) : (

                  filteredShows.map((show) => (

                    <tr key={show._id}>

                      {/* ================= MOVIE ================= */}

                      <td>

                        <div className="show-movie-info">

                          {show.movie?.image && (

                            <img
                              src={show.movie.image}
                              alt={show.movie.title}
                            />

                          )}

                          <span>
                            {show.movie?.title ||
                              "Movie Deleted"}
                          </span>

                        </div>

                      </td>


                      {/* ================= CINEMA ================= */}

                      <td>

                        <strong>
                          {show.cinema?.name ||
                            "Cinema Deleted"}
                        </strong>

                        <small>
                          {show.cinema?.city || ""}
                        </small>

                      </td>


                      {/* ================= DATE ================= */}

                      <td>
                        {show.date}
                      </td>


                      {/* ================= TIME ================= */}

                      <td>
                        {show.startTime}
                      </td>


                      {/* ================= PRICE ================= */}

                      <td>
                        ₹{show.ticketPrice}
                      </td>


                      {/* ================= SEATS ================= */}

                      <td>

                        {show.availableSeats} /{" "}
                        {show.totalSeats}

                      </td>


                      {/* ================= STATUS ================= */}

                      <td>

                        <span
                          className={
                            show.status === "Active"
                              ? "show-status active"
                              : "show-status inactive"
                          }
                        >
                          {show.status}
                        </span>

                      </td>


                      {/* ================= ACTIONS ================= */}

                      <td>

                        <div className="show-actions">

                          <button
                            className="edit-show-btn"
                            onClick={() =>
                              handleEdit(show)
                            }
                          >
                            ✏️
                          </button>


                          <button
                            className="delete-show-btn"
                            onClick={() =>
                              handleDelete(show._id)
                            }
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminShows;