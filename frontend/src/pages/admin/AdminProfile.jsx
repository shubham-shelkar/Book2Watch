import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminProfile.css";

function AdminProfile() {

  const navigate = useNavigate();

  const adminData = JSON.parse(
    localStorage.getItem("admin") || "{}"
  );

  const adminName =
    adminData.name ||
    adminData.username ||
    "Administrator";

  const adminEmail =
    adminData.email ||
    "admin@book2watch.com";


  // ================= PASSWORD STATES =================

  const [showPasswordBox, setShowPasswordBox] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ================= LOGOUT =================

  const handleLogout = () => {
  localStorage.removeItem("admin");
  localStorage.removeItem("adminToken");

  navigate("/admin/login");
};


  // ================= OPEN PASSWORD =================

  const openPasswordBox = () => {

    setShowPasswordBox(true);

    setMessage("");
    setError("");
  };


  // ================= CLOSE PASSWORD =================

  const closePasswordBox = () => {

    setShowPasswordBox(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setMessage("");
    setError("");
  };


  // ================= CHANGE PASSWORD =================

  const handleChangePassword = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // Frontend validation

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      setError(
        "Please fill all password fields."
      );

      return;
    }


    if (newPassword.length < 6) {

      setError(
        "New password must be at least 6 characters."
      );

      return;
    }


    if (newPassword !== confirmPassword) {

      setError(
        "New password and confirm password do not match."
      );

      return;
    }


    const token =
      localStorage.getItem("adminToken");


    if (!token) {

      setError(
        "Admin session expired. Please login again."
      );

      return;
    }


    try {

      setLoading(true);


      const response = await fetch(
        "http://localhost:5000/api/admin/change-password",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to change password"
        );
      }


      // Success

      setMessage(
        "Password changed successfully!"
      );


      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");


      // Logout after password change

      setTimeout(() => {

        localStorage.removeItem("admin");
        localStorage.removeItem("adminToken");

        navigate("/admin-login");

      }, 1800);


    } catch (error) {

      setError(
        error.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };


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
            className="sidebar-link"
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
            className="sidebar-link active"
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


      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-profile-main">

        <div className="profile-header">

          <div>

            <h1>
              Admin Profile
            </h1>

            <p>
              Manage your administrator account
            </p>

          </div>

        </div>


        {/* ================= PROFILE CARD ================= */}

        <div className="profile-card">

          <div className="profile-cover"></div>


          <div className="profile-content">

            <div className="profile-avatar">
              👤
            </div>


            <div className="profile-info">

              <h2>
                {adminName}
              </h2>

              <p className="profile-role">
                Administrator
              </p>

            </div>

          </div>


          {/* ================= ACCOUNT DETAILS ================= */}

          <div className="profile-details">

            <h3>
              Account Information
            </h3>


            <div className="profile-grid">

              <div className="profile-field">

                <label>
                  Full Name
                </label>

                <div className="profile-value">
                  {adminName}
                </div>

              </div>


              <div className="profile-field">

                <label>
                  Email Address
                </label>

                <div className="profile-value">
                  {adminEmail}
                </div>

              </div>


              <div className="profile-field">

                <label>
                  Role
                </label>

                <div className="profile-value">
                  Administrator
                </div>

              </div>


              <div className="profile-field">

                <label>
                  Account Status
                </label>

                <div className="profile-value status-active">

                  <span></span>

                  Active

                </div>

              </div>

            </div>

          </div>


          {/* ================= SECURITY ================= */}

          <div className="profile-security">

            <h3>
              Security
            </h3>


            <div className="security-box">

              <div className="security-icon">
                🔐
              </div>


              <div className="security-text">

                <h4>
                  Password
                </h4>

                <p>
                  Your administrator password is
                  securely protected.
                </p>

              </div>


              <button
                className="change-password-btn"
                onClick={openPasswordBox}
              >
                Change Password
              </button>

            </div>


            {/* ================= PASSWORD FORM ================= */}

            {showPasswordBox && (

              <div className="password-form-box">

                <div className="password-form-header">

                  <div>

                    <h3>
                      Change Password
                    </h3>

                    <p>
                      Enter your current password
                      and choose a new password.
                    </p>

                  </div>


                  <button
                    type="button"
                    className="password-close-btn"
                    onClick={closePasswordBox}
                  >
                    ×
                  </button>

                </div>


                {error && (

                  <div className="password-error">
                    {error}
                  </div>

                )}


                {message && (

                  <div className="password-success">
                    {message}
                    <br />
                    Redirecting to login...
                  </div>

                )}


                <form
                  onSubmit={handleChangePassword}
                >

                  {/* CURRENT PASSWORD */}

                  <div className="password-input-group">

                    <label>
                      Current Password
                    </label>

                    <div className="password-input-wrap">

                      <input
                        type={
                          showCurrent
                            ? "text"
                            : "password"
                        }
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(
                            e.target.value
                          )
                        }
                        placeholder="Enter current password"
                        disabled={loading}
                      />

                      <button
                        type="button"
                        className="password-eye"
                        onClick={() =>
                          setShowCurrent(
                            !showCurrent
                          )
                        }
                      >
                        {showCurrent ? "🙈" : "👁️"}
                      </button>

                    </div>

                  </div>


                  {/* NEW PASSWORD */}

                  <div className="password-input-group">

                    <label>
                      New Password
                    </label>

                    <div className="password-input-wrap">

                      <input
                        type={
                          showNew
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(
                            e.target.value
                          )
                        }
                        placeholder="Enter new password"
                        disabled={loading}
                      />

                      <button
                        type="button"
                        className="password-eye"
                        onClick={() =>
                          setShowNew(
                            !showNew
                          )
                        }
                      >
                        {showNew ? "🙈" : "👁️"}
                      </button>

                    </div>

                  </div>


                  {/* CONFIRM PASSWORD */}

                  <div className="password-input-group">

                    <label>
                      Confirm New Password
                    </label>

                    <div className="password-input-wrap">

                      <input
                        type={
                          showConfirm
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(
                            e.target.value
                          )
                        }
                        placeholder="Confirm new password"
                        disabled={loading}
                      />

                      <button
                        type="button"
                        className="password-eye"
                        onClick={() =>
                          setShowConfirm(
                            !showConfirm
                          )
                        }
                      >
                        {showConfirm ? "🙈" : "👁️"}
                      </button>

                    </div>

                  </div>


                  {/* BUTTONS */}

                  <div className="password-form-actions">

                    <button
                      type="button"
                      className="password-cancel-btn"
                      onClick={closePasswordBox}
                      disabled={loading}
                    >
                      Cancel
                    </button>


                    <button
                      type="submit"
                      className="password-submit-btn"
                      disabled={loading}
                    >

                      {loading
                        ? "Changing..."
                        : "Change Password"}

                    </button>

                  </div>

                </form>

              </div>

            )}

          </div>


          {/* ================= LOGOUT ================= */}

          <div className="profile-actions">

            <button
              className="profile-logout-btn"
              onClick={handleLogout}
            >
              ↪ Logout from Admin Panel
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminProfile;