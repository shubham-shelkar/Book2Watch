import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminUsers.css";

const API_URL = "http://localhost:5000/api/users";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [deleteUser, setDeleteUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);


  // ==========================================
  // FETCH USERS
  // ==========================================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      const userList = Array.isArray(data)
        ? data
        : data.users || [];

      // Old users without status are treated as Active
      const normalizedUsers = userList.map((user) => ({
        ...user,
        status: user.status || "Active",
      }));

      setUsers(normalizedUsers);
      setFilteredUsers(normalizedUsers);

    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    fetchUsers();
  }, []);


  // ==========================================
  // SEARCH + FILTER
  // ==========================================
  useEffect(() => {
    let result = [...users];

    // Search
    if (search.trim() !== "") {
      const searchText = search.toLowerCase();

      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchText) ||
          user.email?.toLowerCase().includes(searchText)
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(
        (user) => (user.status || "Active") === statusFilter
      );
    }

    setFilteredUsers(result);
  }, [search, statusFilter, users]);


  // ==========================================
  // STATISTICS
  // ==========================================
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => (user.status || "Active") === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => (user.status || "Active") === "Inactive"
  ).length;

  // Users registered in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newUsers = users.filter((user) => {
    if (!user.createdAt) return false;

    const createdDate = new Date(user.createdAt);

    return createdDate >= thirtyDaysAgo;
  }).length;


  // ==========================================
  // CHANGE STATUS
  // ==========================================
  const handleStatusChange = async (user) => {
    const currentStatus = user.status || "Active";

    const newStatus =
      currentStatus === "Active"
        ? "Inactive"
        : "Active";

    try {
      setUpdatingId(user._id);

      const response = await fetch(
        `${API_URL}/${user._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item._id === user._id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

    } catch (err) {
      console.error("Status update error:", err);
      alert(err.message || "Unable to update user status");
    } finally {
      setUpdatingId(null);
    }
  };


  // ==========================================
  // DELETE USER
  // ==========================================
  const confirmDelete = (user) => {
    setDeleteUser(user);
    setShowDeleteModal(true);
  };


  const handleDelete = async () => {
    if (!deleteUser) return;

    try {
      setDeletingId(deleteUser._id);

      const response = await fetch(
        `${API_URL}/${deleteUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete user"
        );
      }

      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user._id !== deleteUser._id
        )
      );

      setShowDeleteModal(false);
      setDeleteUser(null);

    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.message || "Unable to delete user");
    } finally {
      setDeletingId(null);
    }
  };


  // ==========================================
  // VIEW USER
  // ==========================================
  const handleView = async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to get user"
        );
      }

      const userData = data.user || data;

      setSelectedUser({
        ...userData,
        status: userData.status || "Active",
      });

      setShowViewModal(true);

    } catch (err) {
      console.error("View user error:", err);
      alert(err.message || "Unable to load user details");
    }
  };


  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    navigate("/admin/login");
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  return (
    <div className="admin-users-page">

      {/* =====================================
          SIDEBAR
      ===================================== */}
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
            <span className="sidebar-icon">
              ⌂
            </span>

            <span>Dashboard</span>
          </Link>


          <Link
            to="/admin/movies"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              🎬
            </span>

            <span>Movies</span>
          </Link>


          <Link
            to="/admin/cinemas"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              🏢
            </span>

            <span>Cinemas</span>
          </Link>


          <Link
            to="/admin/shows"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              📅
            </span>

            <span>Shows</span>
          </Link>


          <Link
            to="/admin/users"
            className="sidebar-link active"
          >
            <span className="sidebar-icon">
              👥
            </span>

            <span>Users</span>
          </Link>


          <Link
            to="/admin/bookings"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              🎟️
            </span>

            <span>Bookings</span>
          </Link>


          <Link
            to="/admin/profile"
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              👤
            </span>

            <span>Profile</span>
          </Link>

        </nav>


        <div className="sidebar-bottom">

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <span className="sidebar-icon">
              ↪
            </span>

            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}
      <main className="admin-main">

        {/* HEADER */}
        <div className="users-page-header">

          <div>
            <h1>Users</h1>

            <p>
              Manage registered Book2Watch users
            </p>
          </div>

          <div className="users-count">
            {totalUsers} Users
          </div>

        </div>


        {/* =====================================
            STATS
        ===================================== */}
        <div className="users-stats-grid">

          {/* TOTAL */}
          <div className="user-stat-card">

            <div className="stat-icon total-icon">
              👥
            </div>

            <div className="stat-content">
              <span>Total Users</span>

              <strong>
                {totalUsers}
              </strong>
            </div>

          </div>


          {/* ACTIVE */}
          <div className="user-stat-card">

            <div className="stat-icon active-icon">
              ✓
            </div>

            <div className="stat-content">
              <span>Active Users</span>

              <strong>
                {activeUsers}
              </strong>
            </div>

          </div>


          {/* INACTIVE */}
          <div className="user-stat-card">

            <div className="stat-icon inactive-icon">
              !
            </div>

            <div className="stat-content">
              <span>Inactive Users</span>

              <strong>
                {inactiveUsers}
              </strong>
            </div>

          </div>


          {/* NEW USERS */}
          <div className="user-stat-card">

            <div className="stat-icon new-icon">
              +
            </div>

            <div className="stat-content">
              <span>New Users</span>

              <strong>
                {newUsers}
              </strong>

              <small>
                Last 30 days
              </small>
            </div>

          </div>

        </div>


        {/* =====================================
            TOOLBAR
        ===================================== */}
        <div className="users-toolbar">

          <div className="user-search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="user-filter-box">

            <label>
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">
                All Users
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

          </div>

        </div>


        {/* =====================================
            ERROR
        ===================================== */}
        {error && (
          <div className="users-error">
            {error}
          </div>
        )}


        {/* =====================================
            TABLE
        ===================================== */}
        <div className="users-table-card">

          <div className="table-header">

            <div>
              <h2>
                Registered Users
              </h2>

              <p>
                {filteredUsers.length} user
                {filteredUsers.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

          </div>


          {loading ? (

            <div className="users-loading">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="users-empty">

              <div className="empty-icon">
                👥
              </div>

              <h3>
                No Users Found
              </h3>

              <p>
                No users match your search or filter.
              </p>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="users-table">

                <thead>
                  <tr>

                    <th>
                      USER
                    </th>

                    <th>
                      EMAIL
                    </th>

                    <th>
                      REGISTERED ON
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTIONS
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {filteredUsers.map((user) => (

                    <tr key={user._id}>

                      {/* USER */}
                      <td>

                        <div className="user-info">

                          <div className="user-avatar">
                            {user.name
                              ? user.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "U"}
                          </div>

                          <div className="user-name-box">

                            <strong>
                              {user.name}
                            </strong>

                            <span>
                              ID:{" "}
                              {user._id
                                ? user._id
                                    .toString()
                                    .slice(-8)
                                : "N/A"}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}
                      <td>

                        <span className="user-email">
                          {user.email}
                        </span>

                      </td>


                      {/* REGISTERED */}
                      <td>

                        <span className="registered-date">
                          {formatDate(
                            user.createdAt
                          )}
                        </span>

                      </td>


                      {/* STATUS */}
                      <td>

                        <span
                          className={`status-badge ${
                            (user.status ||
                              "Active") ===
                            "Active"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >

                          <span className="status-dot"></span>

                          {user.status ||
                            "Active"}

                        </span>

                      </td>


                      {/* ACTIONS */}
                      <td>

                        <div className="user-actions">

                          {/* VIEW */}
                          <button
                            className="action-btn view-btn"
                            title="View User"
                            onClick={() =>
                              handleView(
                                user._id
                              )
                            }
                          >
                            👁
                          </button>


                          {/* STATUS */}
                          <button
                            className={`action-btn ${
                              (user.status ||
                                "Active") ===
                              "Active"
                                ? "deactivate-btn"
                                : "activate-btn"
                            }`}
                            title={
                              (user.status ||
                                "Active") ===
                              "Active"
                                ? "Make Inactive"
                                : "Make Active"
                            }
                            disabled={
                              updatingId ===
                              user._id
                            }
                            onClick={() =>
                              handleStatusChange(
                                user
                              )
                            }
                          >

                            {updatingId ===
                            user._id
                              ? "..."
                              : (user.status ||
                                  "Active") ===
                                "Active"
                              ? "⏸"
                              : "▶"}

                          </button>


                          {/* DELETE */}
                          <button
                            className="action-btn delete-btn"
                            title="Delete User"
                            onClick={() =>
                              confirmDelete(
                                user
                              )
                            }
                          >
                            🗑
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>


      {/* =====================================
          VIEW USER MODAL
      ===================================== */}
      {showViewModal &&
        selectedUser && (

          <div
            className="user-modal-overlay"
            onClick={() =>
              setShowViewModal(false)
            }
          >

            <div
              className="user-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <div>
                  <h2>
                    User Details
                  </h2>

                  <p>
                    Registered user information
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                >
                  ×
                </button>

              </div>


              <div className="modal-user-profile">

                <div className="modal-avatar">
                  {selectedUser.name
                    ? selectedUser.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>

                <div>

                  <h3>
                    {selectedUser.name}
                  </h3>

                  <p>
                    {selectedUser.email}
                  </p>

                </div>

              </div>


              <div className="user-detail-grid">

                <div className="detail-item">

                  <span>
                    User ID
                  </span>

                  <strong>
                    {selectedUser._id}
                  </strong>

                </div>


                <div className="detail-item">

                  <span>
                    Status
                  </span>

                  <strong
                    className={
                      selectedUser.status ===
                      "Active"
                        ? "detail-active"
                        : "detail-inactive"
                    }
                  >
                    ●{" "}
                    {selectedUser.status ||
                      "Active"}
                  </strong>

                </div>


                <div className="detail-item">

                  <span>
                    Registered On
                  </span>

                  <strong>
                    {formatDate(
                      selectedUser.createdAt
                    )}
                  </strong>

                </div>


                <div className="detail-item">

                  <span>
                    Last Updated
                  </span>

                  <strong>
                    {formatDate(
                      selectedUser.updatedAt
                    )}
                  </strong>

                </div>


                <div className="detail-item full-detail">

                  <span>
                    Email
                  </span>

                  <strong>
                    {selectedUser.email}
                  </strong>

                </div>

              </div>


              <div className="modal-footer">

                <button
                  className={`modal-status-btn ${
                    selectedUser.status ===
                    "Active"
                      ? "make-inactive"
                      : "make-active"
                  }`}
                  onClick={() => {
                    handleStatusChange(
                      selectedUser
                    );

                    setSelectedUser({
                      ...selectedUser,
                      status:
                        selectedUser.status ===
                        "Active"
                          ? "Inactive"
                          : "Active",
                    });
                  }}
                >

                  {selectedUser.status ===
                  "Active"
                    ? "⏸ Make Inactive"
                    : "▶ Make Active"}

                </button>


                <button
                  className="modal-close-btn"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}


      {/* =====================================
          DELETE CONFIRMATION MODAL
      ===================================== */}
      {showDeleteModal &&
        deleteUser && (

          <div
            className="user-modal-overlay"
            onClick={() =>
              setShowDeleteModal(false)
            }
          >

            <div
              className="delete-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="delete-icon">
                🗑
              </div>

              <h2>
                Delete User?
              </h2>

              <p>
                Are you sure you want to delete
                <strong>
                  {" "}
                  {deleteUser.name}
                </strong>
                ?
              </p>

              <span className="delete-warning">
                This action cannot be undone.
              </span>


              <div className="delete-modal-actions">

                <button
                  className="cancel-delete-btn"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteUser(null);
                  }}
                >
                  Cancel
                </button>


                <button
                  className="confirm-delete-btn"
                  onClick={handleDelete}
                  disabled={
                    deletingId ===
                    deleteUser._id
                  }
                >

                  {deletingId ===
                  deleteUser._id
                    ? "Deleting..."
                    : "Delete User"}

                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default AdminUsers;