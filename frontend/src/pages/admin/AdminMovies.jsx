import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminMovies.css";

function AdminMovies() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    duration: "",
    rating: "",
    language: "",
    image: "",
    description: "",
  });

  // =====================================================
  // GET ALL MOVIES
  // =====================================================

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/movies"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      const movieList = Array.isArray(data)
        ? data
        : data.movies || [];

      setMovies(movieList);
    } catch (err) {
      console.error("Fetch movies error:", err);
      setError("Unable to load movies.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {
    setEditingMovie(null);

    setFormData({
      title: "",
      genre: "",
      duration: "",
      rating: "",
      language: "",
      image: "",
      description: "",
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (movie) => {
    setEditingMovie(movie);

    setFormData({
      title: movie.title || "",
      genre: movie.genre || "",
      duration: movie.duration || "",
      rating: movie.rating || "",
      language: movie.language || "",
      image: movie.image || "",
      description: movie.description || "",
    });

    setMessage("");
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingMovie(null);

    setFormData({
      title: "",
      genre: "",
      duration: "",
      rating: "",
      language: "",
      image: "",
      description: "",
    });
  };

  // =====================================================
  // ADD / UPDATE MOVIE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.title.trim() ||
      !formData.genre.trim() ||
      !formData.duration.trim() ||
      !formData.rating.trim() ||
      !formData.language.trim() ||
      !formData.image.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      let response;

      if (editingMovie) {
        // ================= UPDATE =================

        response = await fetch(
          `http://localhost:5000/api/movies/${editingMovie._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // ================= ADD =================

        response = await fetch(
          "http://localhost:5000/api/movies",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Something went wrong"
        );
      }

      if (editingMovie) {
        setMessage("Movie updated successfully! 🎬");
      } else {
        setMessage("Movie added successfully! 🎬");
      }

      closeForm();
      await fetchMovies();

    } catch (err) {
      console.error("Save movie error:", err);
      setError(err.message || "Unable to save movie.");
    }
  };

  // =====================================================
  // DELETE MOVIE
  // =====================================================

  const handleDelete = async (movieId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/movies/${movieId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to delete movie"
        );
      }

      setMessage("Movie deleted successfully! 🗑️");

      await fetchMovies();

    } catch (err) {
      console.error("Delete movie error:", err);
      setError(err.message || "Unable to delete movie.");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    navigate("/admin/login");
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredMovies = movies.filter((movie) => {
    const searchText = search.toLowerCase();

    return (
      movie.title?.toLowerCase().includes(searchText) ||
      movie.genre?.toLowerCase().includes(searchText) ||
      movie.language?.toLowerCase().includes(searchText)
    );
  });

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="admin-movies-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        {/* LOGO */}

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

        {/* MENU */}

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
            className="sidebar-link active"
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

        {/* LOGOUT */}

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


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-movies-main">

        {/* HEADER */}

        <header className="movies-admin-header">

          <div>
            <h1>Movies</h1>

            <p>
              Manage all movies in your Book2Watch system.
            </p>
          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              👤
            </div>

            <div className="admin-profile-info">
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

          </div>

        </header>


        {/* =================================================
            MESSAGES
        ================================================= */}

        {message && (
          <div className="success-message">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>!</span>
            {error}
          </div>
        )}


        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (
          <section className="movie-form-section">

            <div className="form-header">

              <div>
                <p className="form-small-title">
                  {editingMovie
                    ? "UPDATE MOVIE"
                    : "NEW MOVIE"}
                </p>

                <h2>
                  {editingMovie
                    ? "Edit Movie"
                    : "Add New Movie"}
                </h2>
              </div>

              <button
                type="button"
                className="close-form-btn"
                onClick={closeForm}
              >
                ✕
              </button>

            </div>


            <form
              className="movie-form"
              onSubmit={handleSubmit}
            >

              {/* TITLE */}

              <div className="form-group">

                <label>
                  Movie Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter movie title"
                />

              </div>


              {/* GENRE */}

              <div className="form-group">

                <label>
                  Genre *
                </label>

                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="e.g. Action • Adventure"
                />

              </div>


              {/* DURATION */}

              <div className="form-group">

                <label>
                  Duration *
                </label>

                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 2h 30m"
                />

              </div>


              {/* RATING */}

              <div className="form-group">

                <label>
                  Rating *
                </label>

                <input
                  type="text"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                />

              </div>


              {/* LANGUAGE */}

              <div className="form-group">

                <label>
                  Language *
                </label>

                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="e.g. Hindi"
                />

              </div>


              {/* IMAGE URL */}

              <div className="form-group form-full">

                <label>
                  Movie Poster URL *
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Paste movie poster image URL"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="form-group form-full">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter movie description..."
                  rows="4"
                ></textarea>

              </div>


              {/* BUTTONS */}

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-movie-btn"
                >
                  {editingMovie
                    ? "Update Movie"
                    : "Add Movie"}
                </button>

              </div>

            </form>

          </section>
        )}


        {/* =================================================
            MOVIE LIST SECTION
        ================================================= */}

        <section className="movies-management">

          {/* TOP */}

          <div className="movies-list-header">

            <div>

              <h2>
                All Movies
              </h2>

              <p>
                {movies.length} movie
                {movies.length !== 1 ? "s" : ""} available
              </p>

            </div>


            <div className="movie-actions">

              {/* SEARCH */}

              <div className="movie-search">

                <span>🔍</span>

                <input
                  type="text"
                  placeholder="Search movies..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>


              {/* ADD */}

              <button
                className="add-movie-btn"
                onClick={openAddForm}
              >
                + Add Movie
              </button>

            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="movies-status">
              <div className="loader"></div>
              <p>Loading movies...</p>
            </div>
          )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            filteredMovies.length === 0 && (
              <div className="movies-status">

                <div className="empty-icon">
                  🎬
                </div>

                <h3>
                  No Movies Found
                </h3>

                <p>
                  {search
                    ? "No movie matches your search."
                    : "Add your first movie to get started."}
                </p>

              </div>
            )}


          {/* =================================================
              MOVIE TABLE
          ================================================= */}

          {!loading &&
            filteredMovies.length > 0 && (

              <div className="movies-table-wrapper">

                <table className="movies-table">

                  <thead>

                    <tr>

                      <th>
                        Movie
                      </th>

                      <th>
                        Genre
                      </th>

                      <th>
                        Duration
                      </th>

                      <th>
                        Rating
                      </th>

                      <th>
                        Language
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredMovies.map((movie) => (

                      <tr key={movie._id}>

                        {/* MOVIE */}

                        <td>

                          <div className="movie-table-info">

                            <img
                              src={movie.image}
                              alt={movie.title}
                              className="movie-poster"
                              onError={(e) => {
                                e.target.style.display =
                                  "none";
                              }}
                            />

                            <div>

                              <strong>
                                {movie.title}
                              </strong>

                              <span>
                                ID:{" "}
                                {movie._id
                                  ? movie._id.slice(-6)
                                  : "N/A"}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* GENRE */}

                        <td>
                          <span className="genre-badge">
                            {movie.genre}
                          </span>
                        </td>


                        {/* DURATION */}

                        <td>
                          {movie.duration}
                        </td>


                        {/* RATING */}

                        <td>

                          <span className="rating-badge">
                            ⭐ {movie.rating}
                          </span>

                        </td>


                        {/* LANGUAGE */}

                        <td>
                          {movie.language}
                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="table-actions">

                            <button
                              className="edit-btn"
                              onClick={() =>
                                openEditForm(movie)
                              }
                              title="Edit Movie"
                            >
                              ✏️
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  movie._id
                                )
                              }
                              title="Delete Movie"
                            >
                              🗑️
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default AdminMovies;