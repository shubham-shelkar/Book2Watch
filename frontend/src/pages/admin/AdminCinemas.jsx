import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminCinemas.css";

function AdminCinemas() {
  const navigate = useNavigate();

  const [cinemas, setCinemas] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    city: "",
    screens: "",
    contact: "",
    image: "",
    description: "",
    status: "Active",
  });

  // ===============================
  // FETCH CINEMAS
  // ===============================
  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/cinemas"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cinemas");
      }

      const data = await response.json();

      const cinemaList = Array.isArray(data)
        ? data
        : data.cinemas || [];

      setCinemas(cinemaList);
    } catch (err) {
      console.error("Fetch cinemas error:", err);
      setError("Unable to load cinemas.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FORM CHANGE
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ===============================
  // OPEN ADD FORM
  // ===============================
  const openAddForm = () => {
    setEditingCinema(null);

    setFormData({
      name: "",
      location: "",
      address: "",
      city: "",
      screens: "",
      contact: "",
      image: "",
      description: "",
      status: "Active",
    });

    setMessage("");
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // OPEN EDIT FORM
  // ===============================
  const openEditForm = (cinema) => {
    setEditingCinema(cinema);

    setFormData({
      name: cinema.name || "",
      location: cinema.location || "",
      address: cinema.address || "",
      city: cinema.city || "",
      screens: cinema.screens || "",
      contact: cinema.contact || "",
      image: cinema.image || "",
      description: cinema.description || "",
      status: cinema.status || "Active",
    });

    setMessage("");
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // CLOSE FORM
  // ===============================
  const closeForm = () => {
    setShowForm(false);
    setEditingCinema(null);

    setFormData({
      name: "",
      location: "",
      address: "",
      city: "",
      screens: "",
      contact: "",
      image: "",
      description: "",
      status: "Active",
    });
  };

  // ===============================
  // ADD / UPDATE CINEMA
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name.trim() ||
      !formData.location.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.screens ||
      !formData.contact.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      let response;

      const cinemaData = {
        ...formData,
        screens: Number(formData.screens),
      };

      // UPDATE
      if (editingCinema) {
        response = await fetch(
          `http://localhost:5000/api/cinemas/${editingCinema._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cinemaData),
          }
        );
      }

      // ADD
      else {
        response = await fetch(
          "http://localhost:5000/api/cinemas",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cinemaData),
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

      if (editingCinema) {
        setMessage("Cinema updated successfully! 🏢");
      } else {
        setMessage("Cinema added successfully! 🏢");
      }

      closeForm();

      await fetchCinemas();
    } catch (err) {
      console.error("Save cinema error:", err);

      setError(
        err.message || "Unable to save cinema."
      );
    }
  };

  // ===============================
  // DELETE CINEMA
  // ===============================
  const handleDelete = async (cinemaId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this cinema?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/cinemas/${cinemaId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to delete cinema"
        );
      }

      setMessage("Cinema deleted successfully! 🗑️");

      await fetchCinemas();
    } catch (err) {
      console.error("Delete cinema error:", err);

      setError(
        err.message || "Unable to delete cinema."
      );
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    navigate("/admin/login");
  };

  // ===============================
  // SEARCH
  // ===============================
  const filteredCinemas = cinemas.filter((cinema) => {
    const searchText = search.toLowerCase();

    return (
      cinema.name
        ?.toLowerCase()
        .includes(searchText) ||
      cinema.location
        ?.toLowerCase()
        .includes(searchText) ||
      cinema.city
        ?.toLowerCase()
        .includes(searchText) ||
      cinema.address
        ?.toLowerCase()
        .includes(searchText)
    );
  });

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
            className="sidebar-link active"
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


      {/* ================= MAIN ================= */}
      <main className="admin-cinemas-main">

        {/* HEADER */}
        <header className="cinemas-admin-header">

          <div>
            <h1>Cinemas</h1>

            <p>
              Manage all cinemas in your Book2Watch system.
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


        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="success-message">
            <span>✓</span>
            {message}
          </div>
        )}


        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message">
            <span>!</span>
            {error}
          </div>
        )}


        {/* ================= FORM ================= */}
        {showForm && (

          <section className="cinema-form-section">

            <div className="form-header">

              <div>

                <p className="form-small-title">
                  {editingCinema
                    ? "UPDATE CINEMA"
                    : "NEW CINEMA"}
                </p>

                <h2>
                  {editingCinema
                    ? "Edit Cinema"
                    : "Add New Cinema"}
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
              className="cinema-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}
              <div className="form-group">

                <label>
                  Cinema Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter cinema name"
                />

              </div>


              {/* LOCATION */}
              <div className="form-group">

                <label>
                  Location *
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Vesu"
                />

              </div>


              {/* CITY */}
              <div className="form-group">

                <label>
                  City *
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Surat"
                />

              </div>


              {/* SCREENS */}
              <div className="form-group">

                <label>
                  Total Screens *
                </label>

                <input
                  type="number"
                  name="screens"
                  value={formData.screens}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="1"
                />

              </div>


              {/* CONTACT */}
              <div className="form-group">

                <label>
                  Contact Number *
                </label>

                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                />

              </div>


              {/* STATUS */}
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


              {/* ADDRESS */}
              <div className="form-group form-full">

                <label>
                  Full Address *
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete cinema address"
                />

              </div>


              {/* IMAGE */}
              <div className="form-group form-full">

                <label>
                  Cinema Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Paste cinema image URL"
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
                  placeholder="Enter cinema description..."
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
                  className="save-cinema-btn"
                >
                  {editingCinema
                    ? "Update Cinema"
                    : "Add Cinema"}
                </button>

              </div>

            </form>

          </section>
        )}


        {/* ================= CINEMA LIST ================= */}
        <section className="cinemas-management">

          <div className="cinemas-list-header">

            <div>

              <h2>
                All Cinemas
              </h2>

              <p>
                {cinemas.length} cinema
                {cinemas.length !== 1
                  ? "s"
                  : ""}{" "}
                available
              </p>

            </div>


            <div className="cinema-actions">

              {/* SEARCH */}
              <div className="cinema-search">

                <span>🔍</span>

                <input
                  type="text"
                  placeholder="Search cinemas..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>


              {/* ADD BUTTON */}
              <button
                className="add-cinema-btn"
                onClick={openAddForm}
              >
                + Add Cinema
              </button>

            </div>

          </div>


          {/* LOADING */}
          {loading && (

            <div className="cinemas-status">

              <div className="loader"></div>

              <p>
                Loading cinemas...
              </p>

            </div>

          )}


          {/* EMPTY */}
          {!loading &&
            filteredCinemas.length === 0 && (

              <div className="cinemas-status">

                <div className="empty-icon">
                  🏢
                </div>

                <h3>
                  No Cinemas Found
                </h3>

                <p>
                  {search
                    ? "No cinema matches your search."
                    : "Add your first cinema to get started."}
                </p>

              </div>

            )}


          {/* TABLE */}
          {!loading &&
            filteredCinemas.length > 0 && (

              <div className="cinemas-table-wrapper">

                <table className="cinemas-table">

                  <thead>

                    <tr>

                      <th>
                        Cinema
                      </th>

                      <th>
                        Location
                      </th>

                      <th>
                        City
                      </th>

                      <th>
                        Screens
                      </th>

                      <th>
                        Contact
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredCinemas.map(
                      (cinema) => (

                        <tr
                          key={cinema._id}
                        >

                          {/* CINEMA */}
                          <td>

                            <div className="cinema-table-info">

                              {cinema.image ? (

                                <img
                                  src={cinema.image}
                                  alt={cinema.name}
                                  className="cinema-image"
                                  onError={(e) => {
                                    e.target.style.display =
                                      "none";
                                  }}
                                />

                              ) : (

                                <div className="cinema-image-placeholder">
                                  🏢
                                </div>

                              )}


                              <div>

                                <strong>
                                  {cinema.name}
                                </strong>

                                <span>
                                  ID:{" "}
                                  {cinema._id
                                    ? cinema._id.slice(
                                        -6
                                      )
                                    : "N/A"}
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* LOCATION */}
                          <td>

                            <span className="location-badge">
                              📍{" "}
                              {cinema.location}
                            </span>

                          </td>


                          {/* CITY */}
                          <td>
                            {cinema.city}
                          </td>


                          {/* SCREENS */}
                          <td>

                            <span className="screen-badge">
                              🎬{" "}
                              {cinema.screens}
                            </span>

                          </td>


                          {/* CONTACT */}
                          <td>
                            {cinema.contact}
                          </td>


                          {/* STATUS */}
                          <td>

                            <span
                              className={
                                cinema.status ===
                                "Inactive"
                                  ? "status-badge inactive"
                                  : "status-badge active"
                              }
                            >
                              {cinema.status ||
                                "Active"}
                            </span>

                          </td>


                          {/* ACTIONS */}
                          <td>

                            <div className="table-actions">

                              <button
                                className="edit-btn"
                                onClick={() =>
                                  openEditForm(
                                    cinema
                                  )
                                }
                                title="Edit Cinema"
                              >
                                ✏️
                              </button>

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDelete(
                                    cinema._id
                                  )
                                }
                                title="Delete Cinema"
                              >
                                🗑️
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

        </section>

      </main>

    </div>
  );
}

export default AdminCinemas;